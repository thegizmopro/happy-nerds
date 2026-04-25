import { MovingTarget } from './MovingTarget.js';
import { deriveK } from '../core/equation.js';

// Holds all mutable state for one level play-through.
export class LevelSession {
  constructor(levelConfig) {
    this.config = levelConfig;
    this.gameState = 'idle'; // idle | flying | hit | miss
    this.sliderMoves = 0;
    this.bonusAchieved = false;

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
    for (const t of levelConfig.targets) {
      this.targetHP[t.id] = t.hp ?? 1;
    }

    // Spawn animation timestamps: targetId → ms timestamp of spawn
    this.spawnTimes = {};
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
    if (this.targetHP[targetId] === 0) this.targetsHit.add(targetId);
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
}
