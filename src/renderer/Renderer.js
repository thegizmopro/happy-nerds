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
    if (opacity < 1) ctx.globalAlpha = opacity;

    // Outer ring
    const ringColor = dead ? '#4ade80' : '#ef4444';
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = dead ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.08)';
    ctx.fill();

    // Face
    const faceColors = {
      helmet:   dead ? '#4ade80' : '#86efac',
      letterman:dead ? '#4ade80' : '#6ee7b7',
      cool:     dead ? '#4ade80' : '#5eead4',
      whistle:  dead ? '#4ade80' : '#fbbf24',
      king:     dead ? '#4ade80' : '#a3e635',
    };
    const pr = r * 0.65;
    ctx.fillStyle = faceColors[type] ?? faceColors.helmet;
    ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2); ctx.fill();

    if (!dead) {
      // Eyes
      ctx.fillStyle = '#1a2e1a';
      ctx.beginPath();
      ctx.arc(cx - pr * 0.3, cy - pr * 0.2, pr * 0.13, 0, Math.PI * 2);
      ctx.arc(cx + pr * 0.3, cy - pr * 0.2, pr * 0.13, 0, Math.PI * 2);
      ctx.fill();
      // Nose
      ctx.fillStyle = '#4d7a4d';
      ctx.beginPath();
      ctx.ellipse(cx, cy + pr * 0.2, pr * 0.22, pr * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      // Nostrils
      ctx.fillStyle = '#1a2e1a';
      ctx.beginPath();
      ctx.arc(cx - pr * 0.1, cy + pr * 0.2, pr * 0.07, 0, Math.PI * 2);
      ctx.arc(cx + pr * 0.1, cy + pr * 0.2, pr * 0.07, 0, Math.PI * 2);
      ctx.fill();
      // Type-specific accessory
      if (type === 'helmet') {
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(cx, cy - pr * 0.55, pr * 0.65, Math.PI, 0);
        ctx.fill();
      } else if (type === 'king') {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(cx - pr * 0.4, cy - pr * 0.6);
        ctx.lineTo(cx, cy - pr);
        ctx.lineTo(cx + pr * 0.4, cy - pr * 0.6);
        ctx.fill();
      } else if (type === 'cool') {
        ctx.fillStyle = '#1e3a5f';
        ctx.fillRect(cx - pr * 0.45, cy - pr * 0.35, pr * 0.35, pr * 0.2);
        ctx.fillRect(cx + pr * 0.1,  cy - pr * 0.35, pr * 0.35, pr * 0.2);
      }
    } else {
      // Dead: X eyes
      ctx.strokeStyle = '#1a2e1a';
      ctx.lineWidth = 2;
      const ex = pr * 0.3, ey = pr * 0.2, es = pr * 0.12;
      ctx.beginPath();
      ctx.moveTo(cx - ex - es, cy - ey - es); ctx.lineTo(cx - ex + es, cy - ey + es);
      ctx.moveTo(cx - ex + es, cy - ey - es); ctx.lineTo(cx - ex - es, cy - ey + es);
      ctx.moveTo(cx + ex - es, cy - ey - es); ctx.lineTo(cx + ex + es, cy - ey + es);
      ctx.moveTo(cx + ex + es, cy - ey - es); ctx.lineTo(cx + ex - es, cy - ey + es);
      ctx.stroke();
    }

    // White flash overlay on non-lethal hit
    if (flashWhite) {
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ── Launcher ─────────────────────────────────────────────────────────────────

  _drawLauncher(launcher, session) {
    const ctx = this.ctx;
    // Compute where the arc actually starts — draw the nerd there
    // so the arc always originates from the character
    const params = session.getEffectiveParams();
    const form = session.currentForm();
    const originLocalY = evalForm(0, form, params);
    const drawX = launcher.x;
    const drawY = launcher.y + originLocalY;
    const { cx, cy } = w2c(drawX, drawY);
    // Head
    ctx.fillStyle = '#fde68a';
    ctx.beginPath(); ctx.arc(cx, cy - 24, 14, 0, Math.PI * 2); ctx.fill();
    // Glasses
    ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2; ctx.setLineDash([]);
    ctx.strokeRect(cx - 15, cy - 33, 12, 9);
    ctx.strokeRect(cx + 3,  cy - 33, 12, 9);
    ctx.beginPath(); ctx.moveTo(cx - 3, cy - 28); ctx.lineTo(cx + 3, cy - 28); ctx.stroke();
    // Body
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(cx - 11, cy - 10, 22, 26);
    // Arms — up if excited, normal otherwise
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    const armY = session.gameState === 'hit' ? cy - 22 : cy - 10;
    ctx.beginPath();
    ctx.moveTo(cx - 11, cy - 5); ctx.lineTo(cx - 22, armY);
    ctx.moveTo(cx + 11, cy - 5); ctx.lineTo(cx + 22, armY);
    ctx.stroke();
    ctx.lineCap = 'butt';
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
