import { CANVAS_W, CANVAS_H, WORLD_W, WORLD_H, SCALE, GROUND_Y, w2c, COEFF_COLORS } from '../constants.js';
import { evalForm } from '../core/equation.js';
import { findVertexPoint } from '../core/arc.js';

const THEME_COLORS = {
  desert:   { sky: '#1a1a2e', ground: '#1a2e1a', groundFill: 'rgba(10,26,10,0.7)', grid: 'rgba(255,255,255,0.035)' },
  forest:   { sky: '#0d1a0d', ground: '#1a3a1a', groundFill: 'rgba(5,20,5,0.7)',   grid: 'rgba(255,255,255,0.035)' },
  mountain: { sky: '#0d1117', ground: '#1a1a3a', groundFill: 'rgba(10,10,26,0.7)', grid: 'rgba(255,255,255,0.04)' },
  space:    { sky: '#050510', ground: '#1a0a2e', groundFill: 'rgba(10,5,20,0.7)',   grid: 'rgba(255,255,255,0.05)' },
};

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;
    this._theme = 'desert';
    this._cfg = null;
    this._voiceBubble = null;
  }

  loadLevel(cfg) {
    this._cfg = cfg;
    this._theme = cfg.theme ?? 'desert';
  }

  setControlPointsProvider(provider) {
    this._cpProvider = provider;
  }

  draw(session) {
    const ctx = this.ctx;
    const cfg = this._cfg;
    if (!cfg) return;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    this._drawBackground(cfg.launcher);
    this._drawObstacles(cfg.obstacles);
    this._drawBonusRing(cfg.bonusRing, session.bonusAchieved);
    this._drawTargets(cfg.targets, session);

    // Ghost arcs from completed shots
    if (session.completedArcPoints) {
      for (const pts of session.completedArcPoints) {
        this._drawGhostArc(pts);
      }
    }

    if (session.gameState === 'idle') {
      this._drawPredictedArc(session);
    }

    this._drawTrail(session);
    this._drawSparks(session);
    this._drawProjectile(session);
    this._drawLauncher(cfg.launcher, session);

    if (session.gameState === 'idle' && this._cpProvider) {
      this._drawControlPoints(this._cpProvider.getControlPoints());
    }

    this._drawVoiceBubble();
  }

  showVoiceBubble(text) {
    this._voiceBubble = { text, startTime: performance.now(), duration: 1500 };
  }

  _drawVoiceBubble() {
    const b = this._voiceBubble;
    if (!b) return;
    const elapsed = performance.now() - b.startTime;
    if (elapsed > b.duration) { this._voiceBubble = null; return; }

    let alpha;
    if (elapsed < 200) alpha = elapsed / 200;
    else if (elapsed < 1000) alpha = 1;
    else alpha = 1 - (elapsed - 1000) / 500;

    const x = 60, y = 30;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.font = 'bold 14px sans-serif';
    const textW = ctx.measureText(b.text).width;
    const padX = 10, padY = 6, r = 6;
    const bx = x - padX, by = y - padY - 14;
    const bw = textW + padX * 2, bh = 14 + padY * 2;

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, r);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Text
    ctx.fillStyle = '#000000';
    ctx.fillText(b.text, x, y);

    ctx.restore();
  }

  // ── Background ──────────────────────────────────────────────────────────────

  _drawBackground(launcher) {
    const ctx = this.ctx;
    const tc = THEME_COLORS[this._theme] ?? THEME_COLORS.desert;

    ctx.fillStyle = tc.sky;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid
    ctx.strokeStyle = tc.grid;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    for (let x = 0; x <= WORLD_W; x++) {
      const cx = x * SCALE;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y <= WORLD_H; y++) {
      const cy = CANVAS_H - y * SCALE;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(CANVAS_W, cy); ctx.stroke();
    }

    // Ground line at launcher.y
    const { cy: groundCy } = w2c(0, launcher.y);
    ctx.strokeStyle = tc.ground;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(0, groundCy); ctx.lineTo(CANVAS_W, groundCy); ctx.stroke();
    ctx.fillStyle = tc.groundFill;
    ctx.fillRect(0, groundCy, CANVAS_W, CANVAS_H - groundCy);
  }

  // ── Obstacles ───────────────────────────────────────────────────────────────

  _drawObstacles(obstacles) {
    if (!obstacles?.length) return;
    const ctx = this.ctx;
    for (const obs of obstacles) {
      const { cx: x1, cy: y1 } = w2c(obs.x, obs.y + obs.height);
      const pw = obs.width * SCALE;
      const ph = obs.height * SCALE;
      ctx.fillStyle = '#374151';
      ctx.fillRect(x1, y1, pw, ph);
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(x1, y1, pw, ph);
      // Brick pattern (simple)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      for (let row = 0; row < obs.height * 2; row++) {
        const rowY = y1 + row * (SCALE / 2);
        const offset = (row % 2) * (SCALE / 2);
        for (let bx = offset; bx < pw; bx += SCALE) {
          ctx.strokeRect(x1 + bx, rowY, SCALE, SCALE / 2);
        }
      }
    }
  }

  // ── Bonus Ring ───────────────────────────────────────────────────────────────

  _drawBonusRing(ring, achieved) {
    if (!ring) return;
    const ctx = this.ctx;
    const { cx, cy } = w2c(ring.x, ring.y);
    const r = ring.radius * SCALE;
    ctx.strokeStyle = achieved ? '#fbbf24' : 'rgba(251,191,36,0.7)';
    ctx.lineWidth = achieved ? 4 : 2.5;
    ctx.setLineDash(achieved ? [] : [5, 4]);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    if (achieved) {
      ctx.fillStyle = 'rgba(251,191,36,0.15)';
      ctx.fill();
    }
    ctx.setLineDash([]);
  }

  // ── Targets ─────────────────────────────────────────────────────────────────

  _drawTargets(targets, session) {
    const now = Date.now();
    for (const t of targets) {
      const worldPos = session.getTargetWorld(t);
      const hp = session.targetHP[t.id] ?? 1;
      const dead = hp <= 0;

      // Fade out over 500ms on kill
      let opacity = 1;
      if (dead) {
        const kt = session.killTime?.[t.id];
        if (kt) {
          const elapsed = now - kt;
          if (elapsed >= 500) continue; // fully faded
          opacity = 1 - elapsed / 500;
        }
      }

      let radius = t.radius;
      const spawnTime = session.spawnTimes?.[t.id];
      if (spawnTime) {
        const elapsed = now - spawnTime;
        if (elapsed < 200) radius = t.radius * (elapsed / 200);
      }

      // White flash for 200ms on non-lethal hit
      const flashTime = session.hitFlash?.[t.id];
      const flashWhite = !dead && !!flashTime && (now - flashTime) < 200;

      this._drawPig(worldPos.x, worldPos.y, radius, t.pigType, dead,
                    session.gameState === 'hit' && dead, flashWhite, opacity);

      // HP dots above alive multi-HP pigs
      const maxHP = t.hp ?? 1;
      if (!dead && maxHP > 1) {
        this._drawHPDots(worldPos.x, worldPos.y, radius, hp, maxHP);
      }
    }
  }

  _drawHPDots(wx, wy, radius, hp, maxHP) {
    const ctx = this.ctx;
    const { cx, cy } = w2c(wx, wy);
    const r = radius * SCALE;
    const dotR = 4;
    const spacing = dotR * 2.8;
    const totalWidth = (maxHP - 1) * spacing;
    const startX = cx - totalWidth / 2;
    const dotY = cy - r - 10;

    ctx.setLineDash([]);
    for (let i = 0; i < maxHP; i++) {
      const dotX = startX + i * spacing;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
      if (i < hp) {
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      } else {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }

  _drawPig(wx, wy, radius, type, dead, celebrating, flashWhite = false, opacity = 1) {
    const ctx = this.ctx;
    const { cx, cy } = w2c(wx, wy);
    const r = radius * SCALE;

    ctx.save();
    ctx.setLineDash([]);
    if (opacity < 1) ctx.globalAlpha = opacity;

    const bodyColor = flashWhite ? '#ffffff' : '#4ade80';

    switch (type) {
      case 'letterman': this._drawLettermanPig(ctx, cx, cy, r, bodyColor, dead); break;
      case 'cool':      this._drawCoolPig(ctx, cx, cy, r, bodyColor, dead); break;
      case 'whistle':   this._drawWhistlePig(ctx, cx, cy, r, bodyColor, dead); break;
      case 'king':      this._drawKingPig(ctx, cx, cy, r, bodyColor, dead); break;
      default:          this._drawHelmetPig(ctx, cx, cy, r, bodyColor, dead); break;
    }

    ctx.restore();
  }

  // ── Pig shared helpers ────────────────────────────────────────────────────────

  _pgBody(ctx, cx, cy, r, bodyColor) {
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = Math.max(1, r * 0.07);
    ctx.stroke();
  }

  _pgSnout(ctx, cx, cy, r) {
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.27, r * 0.26, r * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9f1239';
    ctx.beginPath();
    ctx.arc(cx - r * 0.1, cy + r * 0.27, r * 0.065, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.1, cy + r * 0.27, r * 0.065, 0, Math.PI * 2);
    ctx.fill();
  }

  _pgEyes(ctx, cx, cy, r, dead) {
    const lx = cx - r * 0.27, rx = cx + r * 0.27, ey = cy - r * 0.1;
    if (dead) {
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = Math.max(1.5, r * 0.08);
      const s = r * 0.11;
      ctx.beginPath();
      ctx.moveTo(lx - s, ey - s); ctx.lineTo(lx + s, ey + s);
      ctx.moveTo(lx + s, ey - s); ctx.lineTo(lx - s, ey + s);
      ctx.moveTo(rx - s, ey - s); ctx.lineTo(rx + s, ey + s);
      ctx.moveTo(rx + s, ey - s); ctx.lineTo(rx - s, ey + s);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(lx, ey, r * 0.1, 0, Math.PI * 2);
      ctx.arc(rx, ey, r * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _pgAngryBrows(ctx, cx, cy, r) {
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = Math.max(1.5, r * 0.08);
    const ey = cy - r * 0.1;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.44, ey - r * 0.14);
    ctx.lineTo(cx - r * 0.14, ey - r * 0.28);
    ctx.moveTo(cx + r * 0.14, ey - r * 0.28);
    ctx.lineTo(cx + r * 0.44, ey - r * 0.14);
    ctx.stroke();
  }

  _pgTongue(ctx, cx, cy, r) {
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.08, cy + r * 0.5, r * 0.13, r * 0.09, Math.PI * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Pig type renderers ────────────────────────────────────────────────────────

  _drawHelmetPig(ctx, cx, cy, r, bodyColor, dead) {
    this._pgBody(ctx, cx, cy, r, bodyColor);

    // Yellow football helmet covering top half
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.94, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    // Helmet center stripe
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = Math.max(2, r * 0.1);
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.94);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Face mask bars (horizontal + center stub)
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = Math.max(1.5, r * 0.07);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.46, cy + r * 0.12);
    ctx.lineTo(cx + r * 0.46, cy + r * 0.12);
    ctx.moveTo(cx, cy + r * 0.12);
    ctx.lineTo(cx, cy + r * 0.4);
    ctx.stroke();

    if (!dead) this._pgAngryBrows(ctx, cx, cy, r);
    this._pgEyes(ctx, cx, cy, r, dead);
    this._pgSnout(ctx, cx, cy, r);
    if (dead) this._pgTongue(ctx, cx, cy, r);
  }

  _drawLettermanPig(ctx, cx, cy, r, bodyColor, dead) {
    this._pgBody(ctx, cx, cy, r, bodyColor);

    // Blue cap across top
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.85, Math.PI * 1.12, Math.PI * 1.88);
    ctx.closePath();
    ctx.fill();
    // Cap brim
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(cx - r * 0.48, cy - r * 0.38, r * 0.96, r * 0.11);

    // Red V jacket lines
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = Math.max(2, r * 0.11);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.38, cy - r * 0.1);
    ctx.lineTo(cx, cy + r * 0.22);
    ctx.moveTo(cx + r * 0.38, cy - r * 0.1);
    ctx.lineTo(cx, cy + r * 0.22);
    ctx.stroke();
    ctx.lineCap = 'butt';

    // N letter on chest
    ctx.fillStyle = '#fef2f2';
    ctx.font = `bold ${Math.max(7, Math.round(r * 0.27))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', cx, cy + r * 0.42);

    // Determined flat mouth
    if (!dead) {
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = Math.max(1.5, r * 0.07);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.17, cy + r * 0.53);
      ctx.lineTo(cx + r * 0.17, cy + r * 0.53);
      ctx.stroke();
    }

    this._pgEyes(ctx, cx, cy, r, dead);
    this._pgSnout(ctx, cx, cy, r);
    if (dead) this._pgTongue(ctx, cx, cy, r);
  }

  _drawCoolPig(ctx, cx, cy, r, bodyColor, dead) {
    // Headphone band (behind body)
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = Math.max(2, r * 0.1);
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.08, r * 0.88, Math.PI, 0);
    ctx.stroke();

    this._pgBody(ctx, cx, cy, r, bodyColor);

    // Ear cups
    ctx.fillStyle = '#6d28d9';
    ctx.beginPath();
    ctx.arc(cx - r * 0.88, cy - r * 0.08, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r * 0.88, cy - r * 0.08, r * 0.22, 0, Math.PI * 2);
    ctx.fill();

    this._pgSnout(ctx, cx, cy, r);

    // Sunglasses (two filled rects + bridge)
    ctx.fillStyle = '#111827';
    const sgY = cy - r * 0.14, sgH = r * 0.21, sgW = r * 0.36;
    ctx.fillRect(cx - r * 0.54, sgY - sgH / 2, sgW, sgH);
    ctx.fillRect(cx + r * 0.18, sgY - sgH / 2, sgW, sgH);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = Math.max(1, r * 0.06);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.18, sgY);
    ctx.lineTo(cx + r * 0.18, sgY);
    ctx.stroke();

    // Smirk
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = Math.max(1.5, r * 0.07);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.08, cy + r * 0.5);
    ctx.quadraticCurveTo(cx + r * 0.15, cy + r * 0.42, cx + r * 0.28, cy + r * 0.48);
    ctx.stroke();

    if (dead) {
      this._pgEyes(ctx, cx, cy, r, true);
      this._pgTongue(ctx, cx, cy, r);
    }
  }

  _drawWhistlePig(ctx, cx, cy, r, bodyColor, dead) {
    this._pgBody(ctx, cx, cy, r, bodyColor);

    // Red coach cap
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.88, Math.PI * 1.1, Math.PI * 1.9);
    ctx.closePath();
    ctx.fill();
    // White brim
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(cx - r * 0.08, cy - r * 0.38, r * 0.72, r * 0.11);

    // Lanyard string
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.08, cy + r * 0.15);
    ctx.quadraticCurveTo(cx + r * 0.1, cy + r * 0.32, cx + r * 0.26, cy + r * 0.5);
    ctx.stroke();

    // Whistle body
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx + r * 0.26, cy + r * 0.5, r * 0.13, 0, Math.PI * 2);
    ctx.fill();
    // Whistle mouthpiece
    ctx.fillRect(cx + r * 0.37, cy + r * 0.46, r * 0.11, r * 0.06);

    if (!dead) this._pgAngryBrows(ctx, cx, cy, r);
    this._pgEyes(ctx, cx, cy, r, dead);
    this._pgSnout(ctx, cx, cy, r);

    // Shouting mouth
    if (!dead) {
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.ellipse(cx, cy + r * 0.5, r * 0.15, r * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (dead) this._pgTongue(ctx, cx, cy, r);
  }

  _drawKingPig(ctx, cx, cy, r, bodyColor, dead) {
    // Purple cape peeking behind (drawn first)
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.3, r * 1.12, 0, Math.PI * 2);
    ctx.fill();

    this._pgBody(ctx, cx, cy, r, bodyColor);

    // Gold crown (3 triangular points) — kept below HP dot zone (cy - r - 10)
    ctx.fillStyle = '#fbbf24';
    const cb = cy - r * 0.72;
    const cw = r * 0.68, ch = r * 0.32;
    ctx.beginPath();
    ctx.moveTo(cx - cw * 0.5, cb);
    ctx.lineTo(cx - cw * 0.5, cb - ch * 0.45);
    ctx.lineTo(cx - cw * 0.16, cb - ch * 0.45);
    ctx.lineTo(cx, cb - ch);
    ctx.lineTo(cx + cw * 0.16, cb - ch * 0.45);
    ctx.lineTo(cx + cw * 0.5, cb - ch * 0.45);
    ctx.lineTo(cx + cw * 0.5, cb);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = Math.max(1, r * 0.06);
    ctx.stroke();

    // Sneering expression (left brow raised, right brow flat-angry)
    if (!dead) {
      const ey = cy - r * 0.1;
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = Math.max(1.5, r * 0.08);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.44, ey - r * 0.26);
      ctx.lineTo(cx - r * 0.14, ey - r * 0.14);
      ctx.moveTo(cx + r * 0.14, ey - r * 0.28);
      ctx.lineTo(cx + r * 0.44, ey - r * 0.18);
      ctx.stroke();
    }

    this._pgEyes(ctx, cx, cy, r, dead);
    this._pgSnout(ctx, cx, cy, r);
    if (dead) this._pgTongue(ctx, cx, cy, r);
  }

  // ── Launcher ─────────────────────────────────────────────────────────────────

  _drawLauncher(launcher, session) {
    const ctx = this.ctx;
    const params = session.getEffectiveParams();
    const form = session.currentForm();
    const originLocalY = evalForm(0, form, params);
    const MIN_Y = 0.3;
    const MAX_Y = WORLD_H - 0.5;
    const drawX = launcher.x;
    const drawY = Math.max(MIN_Y, Math.min(MAX_Y, launcher.y + originLocalY));
    const { cx, cy } = w2c(drawX, drawY);

    const chapter = session.config?.chapter ?? 1;
    const state = session.gameState;

    if (chapter <= 2) this._drawCarl(ctx, cx, cy, state);
    else if (chapter <= 4) this._drawFiona(ctx, cx, cy, state);
    else this._drawPete(ctx, cx, cy, state);
  }

  _drawCarl(ctx, cx, cy, state) {
    ctx.save();
    ctx.setLineDash([]);

    const armUp = state === 'hit';
    const slumped = state === 'miss';
    const lArmEndY = armUp ? cy - 26 : slumped ? cy + 8 : cy - 2;
    const rArmEndY = armUp ? cy - 26 : slumped ? cy + 8 : cy - 2;

    // Arms (behind body)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 9, cy - 12); ctx.lineTo(cx - 20, lArmEndY);
    ctx.moveTo(cx + 9, cy - 12); ctx.lineTo(cx + 20, rArmEndY);
    ctx.stroke();

    // Pencil in right hand
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx + 20, rArmEndY);
    ctx.lineTo(cx + 22, rArmEndY + (armUp ? -9 : 9));
    ctx.stroke();
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(cx + 22, rArmEndY + (armUp ? -9 : 9), 2, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(cx - 9, cy + 2, 7, 12);
    ctx.fillRect(cx + 2, cy + 2, 7, 12);

    // Shoes
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(cx - 11, cy + 13, 10, 5, 2);
    ctx.roundRect(cx + 1,  cy + 13, 10, 5, 2);
    ctx.fill();

    // Shirt body
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(cx - 10, cy - 20, 20, 23, [4, 4, 0, 0]);
    ctx.fill();

    // Calculator icon on chest
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(cx - 6, cy - 17, 12, 9);
    ctx.fillStyle = '#bfdbfe';
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillRect(cx - 5 + c * 4, cy - 16 + r * 4, 2.5, 2.5);
      }
    }

    // Neck
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(cx - 4, cy - 24, 8, 6);

    // Head
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(cx, cy - 32, 12, 0, Math.PI * 2);
    ctx.fill();

    // Brown hair swoosh
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(cx, cy - 32, 12, -Math.PI * 0.9, -Math.PI * 0.1);
    ctx.lineTo(cx, cy - 32);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 3, cy - 41, 7, Math.PI * 0.6, Math.PI * 1.5);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(cx - 12, cy - 32, 3, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 12, cy - 32, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 33, 3, 0, Math.PI * 2);
    ctx.arc(cx + 4, cy - 33, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 33, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 4, cy - 33, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Glasses frames
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.strokeRect(cx - 8.5, cy - 36.5, 7, 6);
    ctx.strokeRect(cx + 1.5, cy - 36.5, 7, 6);
    ctx.beginPath();
    ctx.moveTo(cx - 1.5, cy - 33.5); ctx.lineTo(cx + 1.5, cy - 33.5);
    ctx.stroke();

    // Smile
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy - 28, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();

    ctx.lineCap = 'butt';
    ctx.restore();
  }

  _drawFiona(ctx, cx, cy, state) {
    ctx.save();
    ctx.setLineDash([]);

    const armUp = state === 'hit';
    const slumped = state === 'miss';
    const lArmEndY = armUp ? cy - 26 : slumped ? cy + 8 : cy - 2;
    const rArmEndY = armUp ? cy - 26 : slumped ? cy + 8 : cy - 2;

    // Long purple hair curtains (behind character)
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 38);
    ctx.quadraticCurveTo(cx - 18, cy - 20, cx - 16, cy - 4);
    ctx.lineTo(cx - 10, cy - 4);
    ctx.quadraticCurveTo(cx - 12, cy - 20, cx - 8, cy - 32);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 12, cy - 38);
    ctx.quadraticCurveTo(cx + 18, cy - 20, cx + 16, cy - 4);
    ctx.lineTo(cx + 10, cy - 4);
    ctx.quadraticCurveTo(cx + 12, cy - 20, cx + 8, cy - 32);
    ctx.closePath();
    ctx.fill();

    // Arms
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 9, cy - 12); ctx.lineTo(cx - 20, lArmEndY);
    ctx.moveTo(cx + 9, cy - 12); ctx.lineTo(cx + 20, rArmEndY);
    ctx.stroke();

    // Notebook in right hand
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(cx + 14, rArmEndY - 8, 12, 10);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx + 14, rArmEndY - 8, 12, 10);
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + 16, rArmEndY - 6 + i * 3);
      ctx.lineTo(cx + 24, rArmEndY - 6 + i * 3);
      ctx.stroke();
    }

    // Legs
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(cx - 9, cy + 2, 7, 12);
    ctx.fillRect(cx + 2, cy + 2, 7, 12);

    // Shoes
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.roundRect(cx - 11, cy + 13, 10, 5, 2);
    ctx.roundRect(cx + 1,  cy + 13, 10, 5, 2);
    ctx.fill();

    // Pink shirt body
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.roundRect(cx - 10, cy - 20, 20, 23, [4, 4, 0, 0]);
    ctx.fill();

    // Integral symbol on shirt
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('∫', cx, cy - 9);

    // Neck
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(cx - 4, cy - 24, 8, 6);

    // Head
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(cx, cy - 32, 12, 0, Math.PI * 2);
    ctx.fill();

    // Purple hair on top
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(cx, cy - 32, 12, -Math.PI * 0.95, -Math.PI * 0.05);
    ctx.lineTo(cx, cy - 32);
    ctx.closePath();
    ctx.fill();

    // Ears
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(cx - 12, cy - 32, 3, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 12, cy - 32, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 33, 3, 0, Math.PI * 2);
    ctx.arc(cx + 4, cy - 33, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 33, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 4, cy - 33, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Cat-eye glasses (angled lenses)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.8;
    ctx.save();
    ctx.translate(cx - 5, cy - 33.5);
    ctx.rotate(-0.18);
    ctx.strokeRect(-4, -3, 8, 5);
    ctx.restore();
    ctx.save();
    ctx.translate(cx + 5, cy - 33.5);
    ctx.rotate(0.18);
    ctx.strokeRect(-4, -3, 8, 5);
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(cx - 1.5, cy - 33.5); ctx.lineTo(cx + 1.5, cy - 33.5);
    ctx.stroke();

    // Smile
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy - 28, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();

    ctx.lineCap = 'butt';
    ctx.restore();
  }

  _drawPete(ctx, cx, cy, state) {
    ctx.save();
    ctx.setLineDash([]);

    const armUp = state === 'hit';
    const slumped = state === 'miss';
    const lArmEndY = armUp ? cy - 26 : slumped ? cy + 8 : cy - 2;
    const rArmEndY = armUp ? cy - 26 : slumped ? cy + 8 : cy - 2;

    // Lab coat arms (white)
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 9, cy - 12); ctx.lineTo(cx - 20, lArmEndY);
    ctx.moveTo(cx + 9, cy - 12); ctx.lineTo(cx + 20, rArmEndY);
    ctx.stroke();

    // Test tube in right hand
    const ttX = cx + 22;
    const ttY = rArmEndY - 9;
    ctx.fillStyle = '#d1fae5';
    ctx.fillRect(ttX - 3, ttY, 6, 10);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(ttX - 3, ttY + 5, 6, 5);
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(ttX - 3, ttY, 6, 10);
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(ttX - 3.5, ttY - 2.5, 7, 3);

    // Legs
    ctx.fillStyle = '#374151';
    ctx.fillRect(cx - 9, cy + 2, 7, 12);
    ctx.fillRect(cx + 2, cy + 2, 7, 12);

    // Shoes
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.roundRect(cx - 11, cy + 13, 10, 5, 2);
    ctx.roundRect(cx + 1,  cy + 13, 10, 5, 2);
    ctx.fill();

    // Green shirt collar peek
    ctx.fillStyle = '#059669';
    ctx.fillRect(cx - 5, cy - 22, 10, 4);

    // Lab coat body
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(cx - 10, cy - 20, 20, 23, [4, 4, 0, 0]);
    ctx.fill();

    // Lab coat lapels
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy - 20); ctx.lineTo(cx - 2, cy - 8);
    ctx.moveTo(cx + 3, cy - 20); ctx.lineTo(cx + 2, cy - 8);
    ctx.stroke();

    // Neck
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(cx - 4, cy - 24, 8, 6);

    // Head
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(cx, cy - 32, 12, 0, Math.PI * 2);
    ctx.fill();

    // Spiky white/gray hair
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 32);
    ctx.lineTo(cx - 11, cy - 42);
    ctx.lineTo(cx - 7,  cy - 37);
    ctx.lineTo(cx - 4,  cy - 44);
    ctx.lineTo(cx,      cy - 38);
    ctx.lineTo(cx + 4,  cy - 44);
    ctx.lineTo(cx + 7,  cy - 37);
    ctx.lineTo(cx + 11, cy - 42);
    ctx.lineTo(cx + 12, cy - 32);
    ctx.closePath();
    ctx.fill();

    // Ears
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(cx - 12, cy - 32, 3, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 12, cy - 32, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (behind goggles)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(cx - 4.5, cy - 33, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 4.5, cy - 33, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Goggle strap
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 33); ctx.lineTo(cx + 12, cy - 33);
    ctx.stroke();

    // Goggle lenses
    ctx.fillStyle = '#bfdbfe';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(cx - 4.5, cy - 33, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 4.5, cy - 33, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx - 4.5, cy - 33, 4.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 4.5, cy - 33, 4.5, 0, Math.PI * 2);
    ctx.stroke();

    // Smile
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy - 28, 3.5, 0.1, Math.PI - 0.1);
    ctx.stroke();

    ctx.lineCap = 'butt';
    ctx.restore();
  }

  // ── Predicted Arc ────────────────────────────────────────────────────────────

  _drawPredictedArc(session) {
    const ctx = this.ctx;
    const cfg = this._cfg;
    if (!session.arcPoints?.length) return;

    // Vertex marker line
    const launcher = cfg.launcher;
    const params = session.getEffectiveParams();
    const span = WORLD_W - launcher.x;
    const vertex = findVertexPoint(session.currentForm(), params, launcher, span);
    if (vertex.y > launcher.y + 0.1) {
      const { cx: vx } = w2c(vertex.x, 0);
      const { cy: groundCy } = w2c(0, launcher.y);
      const { cy: peakCy } = w2c(0, vertex.y);
      ctx.save();
      ctx.strokeStyle = 'rgba(251,146,60,0.2)';
      ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(vx, groundCy); ctx.lineTo(vx, Math.max(peakCy, 2)); ctx.stroke();
      ctx.restore();
    }

    // Arc line
    ctx.save();
    ctx.setLineDash([7, 5]);
    ctx.strokeStyle = 'rgba(125,211,252,0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (const { x, y } of session.arcPoints) {
      if (y < 0 || y > WORLD_H + 0.5) { started = false; continue; }
      const { cx, cy } = w2c(x, y);
      if (!started) { ctx.moveTo(cx, cy); started = true; } else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.restore();

    // Splat marker — drawn when the arc was clipped by an obstacle
    const lastPt = session.arcPoints[session.arcPoints.length - 1];
    if (lastPt && cfg.obstacles?.some(obs =>
      lastPt.x >= obs.x && lastPt.x <= obs.x + obs.width &&
      lastPt.y >= obs.y && lastPt.y <= obs.y + obs.height
    )) {
      const { cx: sx, cy: sy } = w2c(lastPt.x, lastPt.y);
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      const sz = 8;
      ctx.beginPath();
      ctx.moveTo(sx - sz, sy - sz); ctx.lineTo(sx + sz, sy + sz);
      ctx.moveTo(sx + sz, sy - sz); ctx.lineTo(sx - sz, sy + sz);
      ctx.stroke();
      ctx.restore();
    }
  }

  _drawGhostArc(pts) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(125,211,252,0.25)';
    ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.beginPath();
    let started = false;
    for (const { x, y } of pts) {
      if (y < 0 || y > WORLD_H + 0.5) { started = false; continue; }
      const { cx, cy } = w2c(x, y);
      if (!started) { ctx.moveTo(cx, cy); started = true; } else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.restore();
  }

  // ── Trail & Projectile ───────────────────────────────────────────────────────

  _drawTrail(session) {
    const trail = session.trail;
    if (!trail || trail.length < 2) return;
    const ctx = this.ctx;
    const bounceFrames = session.bounceFrames ?? [];
    const segColors = [
      'rgba(251,146,60,0.5)',
      'rgba(249,115,22,0.6)',
      'rgba(239,68,68,0.7)',
      'rgba(220,38,38,0.8)',
    ];

    const drawSegment = (from, to, color) => {
      if (to <= from) return;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5; ctx.setLineDash([]);
      ctx.beginPath();
      const s = w2c(trail[from].x, trail[from].y);
      ctx.moveTo(s.cx, s.cy);
      for (let i = from + 1; i <= to && i < trail.length; i++) {
        const { cx, cy } = w2c(trail[i].x, trail[i].y);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.restore();
    };

    let segStart = 0;
    for (let si = 0; si < bounceFrames.length; si++) {
      const bf = bounceFrames[si];
      if (bf >= trail.length) break;
      drawSegment(segStart, bf, segColors[si] ?? segColors[segColors.length - 1]);
      segStart = bf;
    }
    drawSegment(segStart, trail.length - 1, segColors[bounceFrames.length] ?? segColors[segColors.length - 1]);
  }

  _drawSparks(session) {
    if (session.gameState !== 'flying') return;
    const bounceFrames = session.bounceFrames;
    const bouncePoints = session.bouncePoints;
    if (!bounceFrames?.length) return;
    const ctx = this.ctx;
    for (let i = 0; i < bounceFrames.length; i++) {
      const dist = session.flyFrame - bounceFrames[i];
      if (dist >= 0 && dist <= 2) {
        const { cx, cy } = w2c(bouncePoints[i].x, bouncePoints[i].y);
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // ── Control Points ───────────────────────────────────────────────────────────

  _drawControlPoints(cps) {
    if (!cps?.length) return;
    const ctx = this.ctx;
    for (const cp of cps) {
      const { cx, cy } = w2c(cp.x, cp.y);
      ctx.save();
      ctx.setLineDash([]);
      ctx.fillStyle = cp.color;
      ctx.beginPath();
      ctx.arc(cx, cy, cp.radius, 0, Math.PI * 2);
      ctx.fill();
      if (cp.active) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = cp.color;
      ctx.font = 'bold 10px monospace';
      ctx.fillText(cp.label, cx + cp.radius + 3, cy - 3);
      ctx.restore();
    }
  }

  _drawProjectile(session) {
    if (session.gameState !== 'flying' || !session.arcPoints?.length) return;
    const pt = session.arcPoints[session.flyFrame];
    if (!pt) return;
    const { cx, cy } = w2c(pt.x, pt.y);
    if (cy < -20 || cy > CANVAS_H + 20) return;
    const ctx = this.ctx;
    ctx.fillStyle = '#fb923c';
    ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5; ctx.setLineDash([]);
    ctx.stroke();
  }
}
