import { MovingTarget } from './MovingTarget.js';
import { deriveK } from '../core/equation.js';

// Holds all mutable state for one level play-through.
export class LevelSession {
  constructor(levelConfig) {
    this.config = levelConfig;
    this.gameState = 'idle'; // idle | flying | hit | miss
    this.sliderMoves = 0;
    this.bonusAchieved = false;
    this.shotsUsed = 0;
    this.blocksDestroyed = []; // [{ id, blockType }]

    // Current equation params (copy of defaults)
    this.params = { ...levelConfig.defaultParams };

    // Multi-shot state
    this.isMultiShot = !!levelConfig.multiShot;
    this.activeShotIndex = 0;
    this.shotResults = []; // 'hit'|'miss' per shot
    this.completedArcPoints = []; // ghost arcs from completed shots
    this.targetsHit = new Set();

    if (this.isMultiShot) {
      const shots = levelConfig.multiShot.shots;
      this.params = { ...shots[0].defaultParams };
      this.shotResults = new Array(shots.length).fill(null);
    }

    // Moving targets
    this.movingTargets = {}; // targetId → MovingTarget instance
    for (const t of levelConfig.targets) {
      if (t.moving) {
        this.movingTargets[t.id] = new MovingTarget(t.x, t.y, t.moving);
      }
    }
    this.hasMovingTargets = Object.keys(this.movingTargets).length > 0;

    // Timer
    this.timerSeconds = levelConfig.timer?.seconds ?? null;
    this.timeRemaining = this.timerSeconds;
    this._lastTick = null;

    // Arc animation
    this.arcPoints = [];
    this.flyFrame = 0;
    this.trail = [];
    this.bounceFrames = [];  // frame indices where bounces occur
    this.bouncePoints = [];  // world-space {x,y} of each bounce impact

    // HP tracking for targets with hp > 1
    this.targetHP = {};
    this.hitFlash = {};   // targetId → ms timestamp of last non-lethal hit
    this.killTime = {};   // targetId → ms timestamp of kill
    for (const t of levelConfig.targets) {
      this.targetHP[t.id] = t.hp ?? 1;
    }

    // Spawn animation timestamps: targetId → ms timestamp of spawn
    this.spawnTimes = {};

    // Destructible block state
    this.obstacleHP = {};
    this.obstacleDestroyed = {};  // id → timestamp of destruction
    this.obstacleHitFlash = {};  // id → timestamp of last hit
    this.fallingBlocks = [];     // { id, x, startY, endY, currentY, velocity, width, height, blockType, damage }
    this.fallingTargets = [];    // { id, currentY, landY, vy } — pigs that lost their resting block
    for (const obs of (levelConfig.obstacles || [])) {
      if (obs.blockType) {
        this.obstacleHP[obs.id] = obs.hp ?? { glass: 1, wood: 2, stone: 3 }[obs.blockType] ?? 3;
      }
    }
  }

  // Call every animation frame when targets are moving or timer is running.
  tick(timestamp) {
    if (this._lastTick === null) { this._lastTick = timestamp; return; }
    const dt = Math.min((timestamp - this._lastTick) / 1000, 0.1); // cap at 100ms
    this._lastTick = timestamp;

    for (const mt of Object.values(this.movingTargets)) {
      mt.tick(dt);
    }

    if (this.timerSeconds !== null && this.gameState === 'idle') {
      this.timeRemaining = Math.max(0, this.timeRemaining - dt);
    }
  }

  getEffectiveParams() {
    const p = { ...this.params };
    // Auto-derive k for vertex/stretch forms when k is not independently controlled
    const form = this.currentForm();
    const activeCoeffs = this.currentActiveCoeffs();
    if ((form === 'vertex' || form === 'stretch') && !activeCoeffs.includes('k')) {
      p.k = deriveK(p.a, p.h ?? 0);
    }
    return p;
  }

  currentForm() {
    if (this.isMultiShot) {
      return this.config.multiShot.shots[this.activeShotIndex].equationForm;
    }
    return this.config.equationForm;
  }

  currentActiveCoeffs() {
    if (this.isMultiShot) {
      return this.config.multiShot.shots[this.activeShotIndex].activeCoefficients;
    }
    return this.config.activeCoefficients;
  }

  currentSliderConfig() {
    if (this.isMultiShot) {
      return this.config.multiShot.shots[this.activeShotIndex].sliderConfig;
    }
    return this.config.sliderConfig;
  }

  getTargetWorld(targetConfig) {
    const ft = this.fallingTargets.find(f => f.id === targetConfig.id);
    if (ft) return { ...targetConfig, y: ft.currentY };
    const mt = this.movingTargets[targetConfig.id];
    if (mt) return { ...targetConfig, x: mt.worldX, y: mt.worldY };
    return targetConfig;
  }

  allTargetsHit() {
    return this.config.targets.every(t => this.targetsHit.has(t.id));
  }

  recordHit(targetId) {
    const t = this.config.targets.find(t => t.id === targetId);
    if (!t) return;
    this.targetHP[targetId] = Math.max(0, (this.targetHP[targetId] ?? 1) - 1);
    if (this.targetHP[targetId] === 0) {
      this.targetsHit.add(targetId);
      this.killTime[targetId] = Date.now();
    } else {
      this.hitFlash[targetId] = Date.now();
      // Multi-HP pig dodges to a new position after being hit
      this._dodgeTarget(t);
    }
  }

  _dodgeTarget(t) {
    const launcher = this.config.launcher;
    // Move pig to a random position that's different enough to require a new arc
    // Keep x between launcher.x+1 and WORLD_W-1, y above ground
    const WORLD_W = 10;
    const minX = launcher.x + 2;
    const maxX = WORLD_W - 1;
    const minY = 0.5;
    const maxY = 4.0;
    // Try up to 10 positions, pick one far enough from current position
    const minDist = 1.5;
    for (let attempt = 0; attempt < 10; attempt++) {
      const newX = minX + Math.random() * (maxX - minX);
      const newY = minY + Math.random() * (maxY - minY);
      const dist = Math.sqrt((newX - t.x) ** 2 + (newY - t.y) ** 2);
      if (dist >= minDist) {
        // Check not inside an obstacle
        const blocked = (this.config.obstacles ?? []).some(obs => {
          return newX >= obs.x - obs.width/2 && newX <= obs.x + obs.width/2 &&
                 newY >= obs.y - obs.height/2 && newY <= obs.y + obs.height/2;
        });
        if (!blocked) {
          t.x = parseFloat(newX.toFixed(2));
          t.y = parseFloat(newY.toFixed(2));
          return;
        }
      }
    }
    // Fallback: just shift by +2 in x
    t.x = Math.min(maxX, parseFloat((t.x + 2).toFixed(2)));
  }

  advanceShot() {
    if (!this.isMultiShot) return;
    this.activeShotIndex++;
    const shots = this.config.multiShot.shots;
    if (this.activeShotIndex < shots.length) {
      this.params = { ...shots[this.activeShotIndex].defaultParams };
      this.sliderMoves = 0; // reset per-shot moves? or cumulative? cumulative for now.
    }
  }

  isLastShot() {
    if (!this.isMultiShot) return true;
    return this.activeShotIndex >= this.config.multiShot.shots.length - 1;
  }

  isTimedOut() {
    return this.timerSeconds !== null && this.timeRemaining <= 0;
  }

  spawnTarget(newTarget) {
    this.config.targets.push(newTarget);
    this.targetHP[newTarget.id] = newTarget.hp ?? 1;
    this.targetsHit.delete(newTarget.id);
    this.spawnTimes[newTarget.id] = Date.now();
    return newTarget;
  }

  // ─── Destructible Blocks ─────────────────────────────────────────────────

  // Returns true if the obstacle is still physically present (not destroyed).
  // Non-destructible walls always return true.
  isObstacleAlive(id) {
    if (this.obstacleHP[id] === undefined) return true; // wall, not a block
    return this.obstacleHP[id] > 0 && !this.obstacleDestroyed[id];
  }

  // Apply damage to a destructible block. Returns true if destroyed.
  // Auto-triggers cascade (supported blocks start falling) on destruction.
  // Stone is indestructible — immune to all damage.
  hitObstacle(id, damage = 1) {
    if (this.obstacleHP[id] === undefined) return false; // not a block
    if (!this.isObstacleAlive(id)) return false;
    // Stone is indestructible
    const obs = (this.config.obstacles || []).find(o => o.id === id);
    if (obs?.blockType === 'stone') return false;
    this.obstacleHitFlash[id] = Date.now();
    this.obstacleHP[id] = Math.max(0, this.obstacleHP[id] - damage);
    if (this.obstacleHP[id] === 0) {
      this.obstacleDestroyed[id] = Date.now();
      // Track destroyed block for scoring
      if (obs?.blockType) {
        this.blocksDestroyed.push({ id, blockType: obs.blockType });
      }
      // Cascade: blocks this one was supporting may now fall
      const toFall = this._getSupportedBlocks(id);
      for (const obs of toFall) this._startFalling(obs);
      // Pigs resting on this block now fall
      this._startFallingTargets(id);
      return true;
    }
    return false;
  }

  // Find blocks that were supported by destroyedId and now have no other alive support.
  _getSupportedBlocks(destroyedId) {
    const destroyedObs = (this.config.obstacles || []).find(o => o.id === destroyedId);
    if (!destroyedObs?.supports?.length) return [];

    const result = [];
    for (const supportedId of destroyedObs.supports) {
      const supportedObs = (this.config.obstacles || []).find(o => o.id === supportedId);
      if (!supportedObs || !this.isObstacleAlive(supportedId)) continue;
      // Check if any OTHER alive block also supports this block
      const hasOtherSupport = (this.config.obstacles || []).some(other => {
        if (other.id === destroyedId) return false;
        if (!this.isObstacleAlive(other.id)) return false;
        return other.supports?.includes(supportedId);
      });
      if (!hasOtherSupport) result.push(supportedObs);
    }
    return result;
  }

  _startFalling(obs) {
    if (!this.isObstacleAlive(obs.id)) return;
    if (this.fallingBlocks.find(fb => fb.id === obs.id)) return; // already falling
    // Mark as destroyed so the static drawing skips it
    this.obstacleHP[obs.id] = 0;
    this.obstacleDestroyed[obs.id] = Date.now();
    // Find landing Y: top of nearest alive block directly below, or GROUND_Y
    const GROUND_Y = 0.6;
    let landY = GROUND_Y;
    for (const other of (this.config.obstacles || [])) {
      if (other.id === obs.id || !this.isObstacleAlive(other.id)) continue;
      const xOverlap = obs.x < other.x + other.width && obs.x + other.width > other.x;
      if (!xOverlap) continue;
      const otherTop = other.y + other.height;
      if (otherTop <= obs.y && otherTop > landY) landY = otherTop;
    }
    this.fallingBlocks.push({
      id: obs.id,
      x: obs.x,
      width: obs.width,
      height: obs.height,
      blockType: obs.blockType,
      currentY: obs.y, // Y of block's bottom edge — falls DOWN (decreasing)
      landY,           // target Y when block hits ground or another block
      vy: 0,           // downward speed in world units/sec (increases over time)
    });
    // Pigs resting on this block also fall
    this._startFallingTargets(obs.id);
  }

  _startFallingTargets(blockId) {
    const GROUND_Y = 0.8; // pig center y at ground level (matches launcher.y and ground pig positions)
    for (const t of (this.config.targets ?? [])) {
      if (t.restingOn !== blockId) continue;
      if (this.targetsHit.has(t.id)) continue;
      if (this.fallingTargets.find(f => f.id === t.id)) continue;
      this.fallingTargets.push({ id: t.id, currentY: t.y, landY: GROUND_Y, vy: 0 });
    }
  }

  // Advance falling blocks by dt seconds. Call each animation frame.
  updateFalling(dt) {
    const GRAVITY = 18; // world units per second²
    const settled = [];

    for (const fb of this.fallingBlocks) {
      fb.vy += GRAVITY * dt;          // speed increases as block accelerates
      fb.currentY -= fb.vy * dt;      // Y decreases — block falls downward
      if (fb.currentY <= fb.landY) {
        fb.currentY = fb.landY;
        settled.push(fb);
      }
    }

    for (const fb of settled) {
      this._onBlockLand(fb);
      this.fallingBlocks = this.fallingBlocks.filter(b => b.id !== fb.id);
    }

    // Advance falling pigs
    for (const ft of this.fallingTargets) {
      ft.vy += GRAVITY * dt;
      ft.currentY -= ft.vy * dt;
      if (ft.currentY <= ft.landY) ft.currentY = ft.landY;
    }
    const landedTargets = this.fallingTargets.filter(ft => ft.currentY <= ft.landY);
    for (const ft of landedTargets) {
      const t = this.config.targets.find(t => t.id === ft.id);
      if (t) {
        // Kill target if it fell a significant distance (>1 world unit)
        const fallDistance = (t.y) - ft.landY; // original y minus landing y
        if (fallDistance > 1.0 && !this.targetsHit.has(t.id)) {
          this.recordHit(t.id);
        }
        t.y = ft.landY; // persist landed position for next shot
      }
    }
    this.fallingTargets = this.fallingTargets.filter(ft => ft.currentY > ft.landY);
  }

  _onBlockLand(fb) {
    const cfg = this.config;
    // Damage any target whose hitbox overlaps the block's landing position
    for (const t of cfg.targets) {
      if (this.targetsHit.has(t.id)) continue;
      const wt = this.getTargetWorld(t);
      const closestX = Math.max(fb.x, Math.min(wt.x, fb.x + fb.width));
      const closestY = Math.max(fb.landY, Math.min(wt.y, fb.landY + fb.height));
      const dist = Math.sqrt((wt.x - closestX) ** 2 + (wt.y - closestY) ** 2);
      if (dist <= wt.radius) this.recordHit(t.id);
    }
    // Damage any destructible obstacle at the landing position (cascade)
    for (const obs of (cfg.obstacles || [])) {
      if (obs.id === fb.id || !this.isObstacleAlive(obs.id)) continue;
      const xOverlap = fb.x < obs.x + obs.width && fb.x + fb.width > obs.x;
      if (xOverlap && Math.abs(fb.landY - (obs.y + obs.height)) < 0.05) {
        this.hitObstacle(obs.id, 1); // cascade: hitObstacle will trigger further falls
      }
    }
  }

  hasFallingBlocks() {
    return this.fallingBlocks.length > 0 || this.fallingTargets.length > 0;
  }

  getAliveObstacles() {
    return (this.config.obstacles || []).filter(obs => this.isObstacleAlive(obs.id));
  }
}
