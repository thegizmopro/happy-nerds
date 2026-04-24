import { LevelSession } from './LevelSession.js';
import { ControlPoints } from '../ui/ControlPoints.js';
import { buildArcPoints, clipArcAtObstacle } from '../core/arc.js';
import { arcHitsTarget } from '../core/collision.js';
import { calcStars } from '../core/scoring.js';
import { loadProgress, saveProgress, recordStar, markRevealSeen, isChapterUnlocked } from '../save/ProgressStore.js';
import { getLevelConfig, CHAPTERS, totalLevels, isChapterLocked } from '../levels/levelLoader.js';
import { REVEALS } from '../levels/revealContent.js';
import { WORLD_W } from '../constants.js';
import { SoundManager } from '../audio/SoundManager.js';

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
    this.session.arcPoints = arcPts;
    this.session.hitObstacle = cfg.obstacles?.length > 0 && arcPts.length < fullArc.length;

    // Bonus ring — achievable only if arc reaches it (i.e. not blocked by an obstacle)
    if (cfg.bonusRing && arcHitsTarget(arcPts, cfg.bonusRing)) {
      this.session.bonusAchieved = true;
    }

    // Which targets belong to this shot (multi-shot support)
    const targetIds = this.session.isMultiShot
      ? new Set(cfg.multiShot.shots[this.session.activeShotIndex].targetIds)
      : null;

    this.session.gameState = 'flying';
    this.session.flyFrame = 0;
    this.session.trail = [];
    this.ui.setControlsEnabled(false);

    this.sound.playLaunch();

    this._stopLoop();
    this._animateLaunch(arcPts, targetIds);
  }

  // Collision is checked frame-by-frame so moving targets keep moving and hits
  // register at the moment the ball visually reaches the target.
  // arcPts is already clipped at any obstacle, so targets beyond the obstacle
  // are unreachable — no extra hitObstacle guard needed.
  _animateLaunch(arcPts, targetIds) {
    const DURATION = 1300;
    const total = arcPts.length;
    const cfg = this.session.config;
    let startTime = null;
    let prevFrame = 0;
    this._animating = true;

    const step = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const newFrame = Math.min(Math.floor((elapsed / DURATION) * total), total - 1);

      // Keep moving targets alive during flight
      this.session.tick(ts);

      // Real-time collision: scan every arc point from last frame to this one
      for (let fi = prevFrame; fi <= newFrame; fi++) {
        const ballPt = arcPts[fi];
        if (!ballPt) continue;
        for (const t of cfg.targets) {
          if (this.session.targetsHit.has(t.id)) continue;
          if (targetIds && !targetIds.has(t.id)) continue;
          const wt = this.session.getTargetWorld(t);
          const dx = ballPt.x - wt.x;
          const dy = ballPt.y - wt.y;
          if (dx * dx + dy * dy <= wt.radius * wt.radius) {
            this.session.recordHit(t.id);
            this.sound.playHit();
          }
        }
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
    session.gameState = allHit ? 'hit' : 'miss';
    this.renderer.draw(session);

    if (!allHit && session.hitObstacle) this.sound.playObstacleSplat();
    if (!allHit) this.sound.playMiss();

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

  _isLastLevel() {
    return this.currentLevelIndex >= totalLevels() - 1;
  }
}
