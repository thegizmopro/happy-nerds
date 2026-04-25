import { LevelSession } from './LevelSession.js';
import { ControlPoints } from '../ui/ControlPoints.js';
import { buildArcPoints, clipArcAtObstacle } from '../core/arc.js';
import { arcHitsTarget, detectBounceSurface } from '../core/collision.js';
import { calcStars } from '../core/scoring.js';
import { loadProgress, saveProgress, recordStar, markRevealSeen, isChapterUnlocked } from '../save/ProgressStore.js';
import { getLevelConfig, CHAPTERS, totalLevels, isChapterLocked } from '../levels/levelLoader.js';
import { REVEALS } from '../levels/revealContent.js';
import { WORLD_W } from '../constants.js';
import { SoundManager } from '../audio/SoundManager.js';

const HIT_LINES   = ['NICE!', 'Calculated!', 'Bullseye!', "That's what I call a solution!", 'Textbook!'];
const STAR_LINES  = ['Elegant!', "Now THAT'S math!", 'Beautiful solution!', 'A+!'];
const MISS_LINES  = ['Close!', 'Recalculate!', 'Almost!', 'Try again!', 'Adjust and fire!'];
const BLOCK_LINES = ['Blocked!', 'Find another path!', 'Wrong angle!'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export class GameController {
  constructor({ renderer, ui }) {
    this.renderer = renderer;
    this.ui = ui;
    this.progress = loadProgress();
    this.session = null;
    this.currentLevelIndex = this.progress.currentLevel ?? 0;
    this._rafId = null;
    this._animating = false;
    this.sound = new SoundManager();
  }

  // ─── Init ──────────────────────────────────────────────────────────────────

  init() {
    this.ui.onLaunch   = () => this.launch();
    this.ui.onRetry    = () => this.retry();
    this.ui.onNext     = () => this.nextLevel();
    this.ui.onSelectLevel = (idx) => this.loadLevel(idx);
    this.ui.onCoeffChange = (coeff, val) => this.onCoeffChange(coeff, val);
    this.ui.onMenuOpen = () => this.progress;
    this.ui.onSliderDragStart = (coeff, val) => {
      this._ensureAudioInit();
      this.sound.startArcTone(this.session?.params?.a ?? val);
    };
    this.ui.onSliderDragEnd = () => this.sound.stopArcTone();
    this.ui.onMuteToggle = () => {
      this.sound.muted = !this.sound.muted;
      this.ui.updateMuteButton(this.sound.muted);
    };
    this.ui.updateMuteButton(this.sound.muted);

    this._controlPoints = new ControlPoints(
      () => this.session,
      (changes) => this._onControlPointDrag(changes),
    );
    this.renderer.setControlPointsProvider(this._controlPoints);
    this._initCanvasEvents();

    this.loadLevel(this.currentLevelIndex);
  }

  _ensureAudioInit() {
    if (!this.sound._ctx) {
      this.sound.init(this.progress);
      this.ui.updateMuteButton(this.sound.muted);
    } else {
      this.sound._resume();
    }
  }

  // ─── Level Loading ─────────────────────────────────────────────────────────

  loadLevel(globalIndex) {
    this.currentLevelIndex = globalIndex;
    const cfg = getLevelConfig(globalIndex);
    if (!cfg) return;

    // Paywall check
    if (isChapterLocked(cfg.chapter, this.progress)) {
      this.ui.showPaywall(cfg.chapter);
      return;
    }

    this.session = new LevelSession(cfg);
    this._stopLoop();

    this.ui.loadLevel(cfg, globalIndex, this.progress);
    this.renderer.loadLevel(cfg);
    this._rebuildArc();
    this.ui.initialRender(this.session);

    if (this.session.hasMovingTargets || this.session.timerSeconds !== null) {
      this._startLoop();
    } else {
      this.renderer.draw(this.session);
    }
  }

  // ─── Coefficient Change ────────────────────────────────────────────────────

  onCoeffChange(coeff, val) {
    if (this.session.gameState !== 'idle') return;
    this.session.params[coeff] = val;
    this.session.sliderMoves++;
    this._rebuildArc();
    this.ui.updateEquation(this.session);
    this.ui.updateHint(this.session);
    if (!this._animating) this.renderer.draw(this.session);
    // Arc tone: update frequency on every coefficient change
    this.sound.updateArcTone(this.session.params.a ?? val);
  }

  _rebuildArc() {
    const { config, launcher } = this._activeContext();
    const params = this.session.getEffectiveParams();
    const span = WORLD_W - launcher.x;
    const fullArc = buildArcPoints(config.equationForm, params, launcher, span);
    this.session.arcPoints = clipArcAtObstacle(fullArc, config.obstacles);
  }

  _activeContext() {
    const cfg = this.session.config;
    return { config: cfg, launcher: cfg.launcher };
  }

  _onControlPointDrag(changes) {
    if (!this.session || this.session.gameState !== 'idle') return;
    for (const [coeff, val] of Object.entries(changes)) {
      this.session.params[coeff] = val;
    }
    this.session.sliderMoves++;
    this._rebuildArc();
    this.ui.updateEquation(this.session);
    this.ui.updateHint(this.session);
    if (!this._animating) this.renderer.draw(this.session);
    this.sound.updateArcTone(this.session.params.a);
  }

  _initCanvasEvents() {
    const canvas = this.ui.canvas;

    const getXY = (clientX, clientY) => {
      const rect  = canvas.getBoundingClientRect();
      const scaleX = canvas.width  / rect.width;
      const scaleY = canvas.height / rect.height;
      return { cx: (clientX - rect.left) * scaleX, cy: (clientY - rect.top) * scaleY };
    };

    canvas.addEventListener('mousedown', (e) => {
      this._ensureAudioInit();
      const { cx, cy } = getXY(e.clientX, e.clientY);
      const cp = this._controlPoints.hitTest(cx, cy);
      if (cp) {
        this._controlPoints.startDrag(cp);
        canvas.style.cursor = 'grabbing';
        this.sound.startArcTone(this.session?.params?.a);
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      const { cx, cy } = getXY(e.clientX, e.clientY);
      if (this._controlPoints.isDragging()) {
        this._controlPoints.updateDrag(cx, cy);
      } else {
        const cp = this._controlPoints.hitTest(cx, cy);
        this._controlPoints.setHovered(cp?.coeff ?? null);
        canvas.style.cursor = cp ? 'grab' : 'default';
        if (!this._animating && this.session?.gameState === 'idle') {
          this.renderer.draw(this.session);
        }
      }
    });

    canvas.addEventListener('mouseup', () => {
      if (this._controlPoints.isDragging()) this.sound.stopArcTone();
      this._controlPoints.endDrag();
      canvas.style.cursor = 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      if (this._controlPoints.isDragging()) this.sound.stopArcTone();
      this._controlPoints.endDrag();
      this._controlPoints.setHovered(null);
      if (!this._animating && this.session?.gameState === 'idle') {
        this.renderer.draw(this.session);
      }
    });

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._ensureAudioInit();
      const t = e.touches[0];
      const { cx, cy } = getXY(t.clientX, t.clientY);
      const cp = this._controlPoints.hitTest(cx, cy);
      if (cp) {
        this._controlPoints.startDrag(cp);
        this.sound.startArcTone(this.session?.params?.a);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (!this._controlPoints.isDragging()) return;
      e.preventDefault();
      const t = e.touches[0];
      const { cx, cy } = getXY(t.clientX, t.clientY);
      this._controlPoints.updateDrag(cx, cy);
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      if (this._controlPoints.isDragging()) this.sound.stopArcTone();
      this._controlPoints.endDrag();
    });
  }

  // ─── Launch ────────────────────────────────────────────────────────────────

  launch() {
    if (this.session.gameState !== 'idle') return;
    if (this.session.isTimedOut()) return;

    this._ensureAudioInit();

    const cfg = this.session.config;
    const launcher = cfg.launcher;
    const params = this.session.getEffectiveParams();
    const span = WORLD_W - launcher.x;

    const fullArc = buildArcPoints(this.session.currentForm(), params, launcher, span, 300);
    const arcPts = clipArcAtObstacle(fullArc, cfg.obstacles);

    // Build bounce segments (up to 3 bounces off obstacles)
    const { allPts, bounceFrames, bouncePoints, finalHitObstacle } =
      this._buildBounceArc(arcPts, fullArc, cfg);

    this.session.arcPoints = allPts;
    this.session.bounceFrames = bounceFrames;
    this.session.bouncePoints = bouncePoints;
    this.session.hitObstacle = finalHitObstacle;

    // Bonus ring — achievable pre- or post-bounce
    if (cfg.bonusRing && arcHitsTarget(allPts, cfg.bonusRing)) {
      this.session.bonusAchieved = true;
    }

    // Which targets belong to this shot (multi-shot support)
    const targetIds = this.session.isMultiShot
      ? new Set(cfg.multiShot.shots[this.session.activeShotIndex].targetIds)
      : null;

    this.session.gameState = 'flying';
    this.session.flyFrame = 0;
    this.session.trail = [];
    this.session._shotHitAlive = false; // track if we hit a still-alive target this shot
    this.ui.setControlsEnabled(false);

    this.sound.playLaunch();

    this._stopLoop();
    // Reset hitFlash for this shot so existing flashes don't carry over
    this.session.hitFlash = {};
    this._animateLaunch(allPts, targetIds);
  }

  // Collision is checked frame-by-frame so moving targets keep moving and hits
  // register at the moment the ball visually reaches the target.
  // arcPts is already clipped at any obstacle, so targets beyond the obstacle
  // are unreachable — no extra hitObstacle guard needed.
  _animateLaunch(arcPts, targetIds) {
    // Extend duration proportionally so post-bounce segments animate at similar speed
    const BASE_STEPS = 300;
    const DURATION = 1300 * Math.max(1, Math.ceil(arcPts.length / BASE_STEPS));
    const total = arcPts.length;
    const cfg = this.session.config;
    let startTime = null;
    let prevFrame = 0;
    // Track which targets the ball was inside last frame to register one hit per entry
    let prevInTarget = new Set();
    this._animating = true;

    const step = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const newFrame = Math.min(Math.floor((elapsed / DURATION) * total), total - 1);

      // Keep moving targets alive during flight
      this.session.tick(ts);

      // Real-time collision: scan every arc point from last frame to this one.
      // Only register a hit when the ball *enters* a target (wasn't inside last frame).
      // This prevents multi-HP pigs from absorbing dozens of hits per pass-through,
      // while still allowing a second pass (e.g. on a bounce) to count as a new hit.
      for (let fi = prevFrame; fi <= newFrame; fi++) {
        const ballPt = arcPts[fi];
        if (!ballPt) continue;
        const inTargetNow = new Set();
        for (const t of cfg.targets) {
          if (this.session.targetsHit.has(t.id)) continue;
          if (targetIds && !targetIds.has(t.id)) continue;
          const wt = this.session.getTargetWorld(t);
          const dx = ballPt.x - wt.x;
          const dy = ballPt.y - wt.y;
          if (dx * dx + dy * dy <= wt.radius * wt.radius) {
            inTargetNow.add(t.id);
            if (!prevInTarget.has(t.id)) {
              // Ball just entered this target — register one hit
              this.session.recordHit(t.id);
              if (this.session.targetHP[t.id] > 0) this.session._shotHitAlive = true;
              this.sound.playHit();
              if (t.pigType === 'whistle' && !t.hasSpawned) {
                t.hasSpawned = true;
                this.sound.playWhistleTweet();
                const spawnPos = this._findWhistleSpawnPos(t, cfg);
                const newTarget = {
                  id: `spawn-${t.id}-${Date.now()}`,
                  x: spawnPos.x,
                  y: spawnPos.y,
                  radius: t.radius,
                  pigType: 'helmet',
                  hp: 1,
                  moving: null,
                };
                this.session.spawnTarget(newTarget);
                if (targetIds) targetIds.add(newTarget.id);
              }
            }
          }
        }
        prevInTarget = inTargetNow;
      }

      prevFrame = newFrame + 1;
      this.session.flyFrame = newFrame;
      this.session.trail = arcPts.slice(0, newFrame + 1);
      this.renderer.draw(this.session);

      if (elapsed < DURATION) {
        this._rafId = requestAnimationFrame(step);
      } else {
        this._animating = false;
        this._onLaunchComplete(targetIds);
      }
    };
    this._rafId = requestAnimationFrame(step);
  }

  // Compute bounce segments for a shot, returning the flat all-points array and metadata.
  _buildBounceArc(arcPts, fullArc, cfg) {
    const DAMPING = 0.7;
    const MAX_BOUNCES = 3;
    let allPts = [...arcPts];
    const bounceFrames = [];
    const bouncePoints = [];
    let lastSegPts = arcPts;
    let didHitObstacle = (cfg.obstacles?.length > 0) && (arcPts.length < fullArc.length);

    for (let bi = 0; bi < MAX_BOUNCES && didHitObstacle; bi++) {
      const lastIdx = lastSegPts.length - 1;
      if (lastIdx < 2) break;

      const collPt = lastSegPts[lastIdx];
      const prevPt = lastSegPts[lastIdx - 1];
      const prevPt2 = lastSegPts[lastIdx - 2];

      const hitObs = (cfg.obstacles || []).find(obs =>
        collPt.x >= obs.x && collPt.x <= obs.x + obs.width &&
        collPt.y >= obs.y && collPt.y <= obs.y + obs.height
      );
      if (!hitObs) break;

      const { reflectX, reflectY } = detectBounceSurface(prevPt, hitObs);

      // Velocity via finite differences from the last two arc steps
      let vx = collPt.x - prevPt.x;
      let vy = collPt.y - prevPt.y;
      // Second difference gives per-step gravity (constant for a parabola)
      const gravity = collPt.y - 2 * prevPt.y + prevPt2.y;

      if (reflectX) vx = -vx * DAMPING;
      if (reflectY) vy = -vy * DAMPING;

      const seg = this._computePhysicsSegment(collPt, vx, vy, gravity, cfg.obstacles);

      bounceFrames.push(allPts.length - 1);
      bouncePoints.push({ x: collPt.x, y: collPt.y });
      allPts = allPts.concat(seg.points.slice(1)); // skip duplicate of collPt
      lastSegPts = seg.points;
      didHitObstacle = !!seg.hitObstacle;
    }

    return { allPts, bounceFrames, bouncePoints, finalHitObstacle: didHitObstacle };
  }

  // Step a projectile forward frame-by-frame from (startPt) with given velocity and gravity.
  // Returns { points, hitObstacle } where hitObstacle is the first obstacle struck (or null).
  _computePhysicsSegment(startPt, vx, vy, gravity, obstacles) {
    const pts = [startPt];
    let x = startPt.x, y = startPt.y;
    let cvx = vx, cvy = vy;
    let hitObstacle = null;

    for (let i = 0; i < 300; i++) {
      x += cvx;
      y += cvy;
      cvy += gravity;
      pts.push({ x, y });

      if (x > WORLD_W + 1 || x < -1 || y < -3) break;

      for (const obs of (obstacles || [])) {
        if (x >= obs.x && x <= obs.x + obs.width && y >= obs.y && y <= obs.y + obs.height) {
          hitObstacle = obs;
          break;
        }
      }
      if (hitObstacle) break;
    }

    return { points: pts, hitObstacle };
  }

  _onLaunchComplete(targetIds) {
    const session = this.session;
    const cfg = session.config;

    // Multi-shot: record shot result, continue if more shots remain
    if (session.isMultiShot) {
      const shotHit = targetIds
        ? [...targetIds].every(id => session.targetsHit.has(id))
        : false;
      session.completedArcPoints.push([...session.arcPoints]);
      session.shotResults[session.activeShotIndex] = shotHit ? 'hit' : 'miss';

      if (!session.isLastShot()) {
        session.advanceShot();
        session.gameState = 'idle';
        session.arcPoints = [];
        session.trail = [];
        this._rebuildArc();
        this.ui.advanceShot(session);
        this.ui.setControlsEnabled(true);
        this.renderer.draw(session);
        if (session.hasMovingTargets || session.timerSeconds !== null) this._startLoop();
        return;
      }
    }

    // All shots done — evaluate final result
    const allHit = session.allTargetsHit();
    const hasAliveTargets = session.config.targets.some(t => (session.targetHP[t.id] ?? t.hp ?? 1) > 0);

    // If we hit a multi-HP target (damaged but not killed), let the player fire again.
    // This only applies to single-shot levels — multi-shot has its own flow.
    // Don't re-fire on a complete miss (hit nothing at all).
    if (!allHit && hasAliveTargets && session._shotHitAlive && !session.isMultiShot) {
      session.gameState = 'idle';
      session.arcPoints = [];
      session.trail = [];
      session.flyFrame = 0;
      session.bounceFrames = [];
      session.bouncePoints = [];
      this.ui.setControlsEnabled(true);
      this._rebuildArc();
      this.renderer.draw(session);
      if (session.hasMovingTargets || session.timerSeconds !== null) this._startLoop();
      return;
    }

    session.gameState = allHit ? 'hit' : 'miss';
    this.renderer.draw(session);

    // Drive kill-fade redraws (500ms) so fading pigs animate smoothly
    this._startKillFadeLoop();

    if (!allHit && session.hitObstacle) this.sound.playObstacleSplat();
    if (!allHit) this.sound.playMiss();

    if (!allHit) {
      if (session.hitObstacle) {
        this.renderer.showVoiceBubble(randomFrom(BLOCK_LINES));
      } else {
        this.renderer.showVoiceBubble(randomFrom(MISS_LINES));
      }
    }

    if (allHit) {
      if (session.bonusAchieved) this.sound.playBonusChime();
      const stars = calcStars({
        sliderMoves: session.sliderMoves,
        starThresholds: cfg.starThresholds,
        starMode: cfg.starMode,
        bonusAchieved: session.bonusAchieved,
      });
      recordStar(this.progress, this.currentLevelIndex, stars);
      if (stars > 0) this.sound.playStar();

      if (stars >= 3) {
        this.renderer.showVoiceBubble(randomFrom(STAR_LINES));
      } else {
        this.renderer.showVoiceBubble(randomFrom(HIT_LINES));
      }

      const revealId = cfg.revealAfter;
      if (revealId && !this.progress.revealsSeen.includes(revealId) && REVEALS[revealId]) {
        markRevealSeen(this.progress, revealId);
        this.ui.showRevealCard(REVEALS[revealId], () => {
          this.ui.showResult({ hit: true, stars, moves: session.sliderMoves, isLastLevel: this._isLastLevel() });
        });
      } else {
        this.ui.showResult({ hit: true, stars, moves: session.sliderMoves, isLastLevel: this._isLastLevel() });
      }
    } else {
      this.ui.showResult({ hit: false });
    }

    if (session.hasMovingTargets) this._startLoop();
  }

  _startKillFadeLoop() {
    const FADE_MS = 500;
    const session = this.session;
    const start = performance.now();
    const fade = (ts) => {
      if (ts - start >= FADE_MS) return;
      this.renderer.draw(session);
      requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  retry() {
    this.loadLevel(this.currentLevelIndex);
  }

  nextLevel() {
    const next = this.currentLevelIndex + 1;
    if (next < totalLevels()) this.loadLevel(next);
  }

  // ─── Game Loop ─────────────────────────────────────────────────────────────

  _startLoop() {
    if (this._rafId !== null && this._animating) return;
    const loop = (ts) => {
      if (this.session.gameState !== 'flying') {
        this.session.tick(ts);
        if (this.session.isTimedOut() && this.session.gameState === 'idle') {
          this.session.gameState = 'miss';
          this.ui.showResult({ hit: false, timedOut: true });
          this.renderer.draw(this.session);
          return; // stop loop
        }
        this.renderer.draw(this.session);
        this.ui.updateTimer(this.session.timeRemaining);
      }
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  _stopLoop() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._animating = false;
  }

  _findWhistleSpawnPos(whistle, cfg) {
    const launcher = cfg.launcher;
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 1.5;
      const x = whistle.x + Math.cos(angle) * dist;
      const y = whistle.y + Math.sin(angle) * dist;
      if (x < 1 || x > WORLD_W - 1) continue;
      if (y < launcher.y) continue;
      const inObstacle = cfg.obstacles?.some(obs =>
        x >= obs.x && x <= obs.x + obs.width &&
        y >= obs.y && y <= obs.y + obs.height
      );
      if (inObstacle) continue;
      const overlaps = cfg.targets.some(t => {
        const dx = t.x - x;
        const dy = t.y - y;
        return dx * dx + dy * dy < (t.radius + whistle.radius) * (t.radius + whistle.radius);
      });
      if (overlaps) continue;
      return { x, y };
    }
    return { x: whistle.x, y: whistle.y };
  }

  _isLastLevel() {
    return this.currentLevelIndex >= totalLevels() - 1;
  }
}
