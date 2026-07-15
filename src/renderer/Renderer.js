import { CANVAS_W, CANVAS_H, WORLD_W, WORLD_H, SCALE, GROUND_Y, w2c, COEFF_COLORS } from '../constants.js';
import { evalForm, formatEquation, factoredVertex, standardVertex } from '../core/equation.js';
import { findVertexPoint } from '../core/arc.js';

export class Renderer {
  constructor(canvas, sprites) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;
    this._theme = 'desert';
    this._cfg = null;
    this._voiceBubble = null;
    this._sprites = sprites ?? null;
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
    this._drawObstacles(cfg.obstacles, session);
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

    // Mini graph overlay — shows full parabola on axes
    if (session.gameState === 'idle') {
      this._drawMiniGraph(session);
    }

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

    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, r);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = '#000000';
    ctx.fillText(b.text, x, y);

    ctx.restore();
  }

  // ── Background ──────────────────────────────────────────────────────────────

  _drawBackground(launcher) {
    const ctx = this.ctx;
    const chapter = this._cfg?.chapter ?? 1;
    const { cy: groundCy } = w2c(0, GROUND_Y);

    const bgMap = {
      1: 'bg_ch1', 2: 'bg_ch2', 3: 'bg_ch3',
      4: 'bg_ch4', 5: 'bg_ch5', 6: 'bg_ch6',
      7: 'bg_ch7', 8: 'bg_ch8',
    };
    const bgImg = this._sprites?.get(bgMap[chapter] ?? 'bg_ch1');

    ctx.save();
    ctx.setLineDash([]);
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
    ctx.restore();

    // Grid overlay
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    for (let x = 0; x <= WORLD_W; x++) {
      const cx = x * SCALE;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, CANVAS_H); ctx.stroke();
    }
    // Grid lines relative to ground
    for (let y = 0; y <= 8; y++) {
      const { cy } = w2c(0, GROUND_Y + y);
      if (cy < 0) break;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(CANVAS_W, cy); ctx.stroke();
    }

    // Ground line at bottom of canvas
    ctx.strokeStyle = '#65a30d';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(0, CANVAS_H); ctx.lineTo(CANVAS_W, CANVAS_H); ctx.stroke();
    // Ground label
    ctx.fillStyle = '#65a30d'; ctx.font = '10px monospace';
    ctx.fillText('ground', 4, CANVAS_H - 4);
  }

  // ── Obstacles ───────────────────────────────────────────────────────────────

  _drawObstacles(obstacles, session) {
    if (!obstacles?.length) return;
    const ctx = this.ctx;
    const now = Date.now();

    for (const obs of obstacles) {
      if (!obs.blockType) {
        // Static wall — always draw
        const { cx: x1, cy: y1 } = w2c(obs.x, obs.y + obs.height);
        const pw = obs.width * SCALE;
        const ph = obs.height * SCALE;
        ctx.fillStyle = '#374151';
        ctx.fillRect(x1, y1, pw, ph);
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.strokeRect(x1, y1, pw, ph);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        for (let row = 0; row < obs.height * 2; row++) {
          const rowY = y1 + row * (SCALE / 2);
          const offset = (row % 2) * (SCALE / 2);
          for (let bx = offset; bx < pw; bx += SCALE) {
            ctx.strokeRect(x1 + bx, rowY, SCALE, SCALE / 2);
          }
        }
        continue;
      }

      // Destructible block
      const isFalling = session?.fallingBlocks?.some(fb => fb.id === obs.id);
      if (isFalling) continue; // drawn in falling-block pass below

      const destroyedAt = session?.obstacleDestroyed?.[obs.id];
      if (destroyedAt) {
        // Brief white flash for 120ms after destruction
        const elapsed = now - destroyedAt;
        if (elapsed < 120) {
          const { cx: x1, cy: y1 } = w2c(obs.x, obs.y + obs.height);
          const pw = obs.width * SCALE, ph = obs.height * SCALE;
          ctx.save();
          ctx.globalAlpha = 1 - elapsed / 120;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x1, y1, pw, ph);
          ctx.restore();
        }
        continue; // fully gone after flash
      }

      const { cx: x1, cy: y1 } = w2c(obs.x, obs.y + obs.height);
      const pw = obs.width * SCALE;
      const ph = obs.height * SCALE;
      this._drawBlock(ctx, obs, x1, y1, pw, ph, session);
    }

    // Draw falling blocks at their animated Y position
    if (session?.fallingBlocks?.length) {
      for (const fb of session.fallingBlocks) {
        const { cx: fx, cy: fy } = w2c(fb.x, fb.currentY + fb.height);
        const fw = fb.width * SCALE;
        const fh = fb.height * SCALE;
        ctx.save();
        ctx.globalAlpha = 0.85;
        this._drawBlockByType(ctx, fb.blockType, fx, fy, fw, fh, 1);
        ctx.restore();
      }
    }
  }

  _drawBlock(ctx, obs, x, y, w, h, session) {
    const maxHP = obs.hp ?? { glass: 1, wood: 2, concrete: 2, stone: Infinity }[obs.blockType] ?? 3;
    const currentHP = session?.obstacleHP?.[obs.id] ?? maxHP;
    const flashTime = session?.obstacleHitFlash?.[obs.id];
    const flash = flashTime && (Date.now() - flashTime) < 200;

    if (flash) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, w, h);
      return;
    }

    const healthRatio = currentHP / maxHP;
    this._drawBlockByType(ctx, obs.blockType, x, y, w, h, healthRatio);

    // Draw cracks if damaged
    if (healthRatio < 1) {
      ctx.strokeStyle = obs.blockType === 'glass' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      const cx = x + w / 2, cy = y + h / 2;
      // Diagonal crack lines
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.3, cy - h * 0.2);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + w * 0.2, cy + h * 0.3);
      ctx.stroke();
      if (healthRatio < 0.5) {
        ctx.beginPath();
        ctx.moveTo(cx + w * 0.3, cy - h * 0.3);
        ctx.lineTo(cx - w * 0.1, cy + h * 0.1);
        ctx.lineTo(cx - w * 0.3, cy + h * 0.3);
        ctx.stroke();
      }
    }
  }

  _drawBlockByType(ctx, blockType, x, y, w, h, healthRatio) {
    if (blockType === 'glass') {
      ctx.fillStyle = `rgba(147, 197, 253, ${0.4 + healthRatio * 0.3})`;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, w, h);
      // Shine line
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 4);
      ctx.lineTo(x + 4, y + h - 4);
      ctx.stroke();
    } else if (blockType === 'wood') {
      ctx.fillStyle = healthRatio > 0.5 ? '#92400e' : '#78350f';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, w, h);
      // Wood grain lines
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      for (let gy = y + 8; gy < y + h - 4; gy += 10) {
        ctx.beginPath(); ctx.moveTo(x + 4, gy); ctx.lineTo(x + w - 4, gy); ctx.stroke();
      }
    } else if (blockType === 'stone') {
      ctx.fillStyle = '#78716c'; // darker, more imposing
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#a8a29e';
      ctx.lineWidth = 3; // thicker border = indestructible feel
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, w, h);
      // Stone texture dots
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      for (let dx = 6; dx < w - 4; dx += 12) {
        for (let dy = 6; dy < h - 4; dy += 10) {
          ctx.fillRect(x + dx, y + dy, 3, 3);
        }
      }
      // X mark to indicate indestructible
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 4); ctx.lineTo(x + w - 4, y + h - 4);
      ctx.moveTo(x + w - 4, y + 4); ctx.lineTo(x + 4, y + h - 4);
      ctx.stroke();
    } else if (blockType === 'concrete') {
      ctx.fillStyle = healthRatio > 0.5 ? '#9ca3af' : '#6b7280';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, w, h);
      // Concrete texture — small gravel dots
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      for (let dx = 5; dx < w - 3; dx += 8) {
        for (let dy = 5; dy < h - 3; dy += 7) {
          ctx.fillRect(x + dx, y + dy, 2, 2);
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

      // Fade out over 2000ms on kill
      let opacity = 1;
      if (dead) {
        const kt = session.killTime?.[t.id];
        if (kt) {
          const elapsed = now - kt;
          if (elapsed >= 2000) continue; // fully faded
          opacity = 1 - elapsed / 2000;
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
    const nameMap = { helmet: 'jock', letterman: 'varsity', cool: 'skater', whistle: 'coach', king: 'bullyboss' };
    const name = nameMap[type] ?? 'jock';
    const img = this._sprites?.get(`${name}_${dead ? 'dead' : 'alive'}`);
    if (!img) return;

    const drawH = r * 2.8;
    const drawW = drawH * (img.naturalWidth / img.naturalHeight);

    ctx.save();
    ctx.setLineDash([]);
    ctx.globalAlpha = opacity;
    if (flashWhite) ctx.filter = 'brightness(3)';
    ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    ctx.filter = 'none';
    ctx.restore();
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
    const charName = chapter <= 2 ? 'carl' : chapter <= 4 ? 'fiona' : 'pete';
    const stateName = state === 'hit' ? 'celebrate' : state === 'miss' ? 'miss' : 'idle';
    const img = this._sprites?.get(`${charName}_${stateName}`);
    if (!img) return;

    const drawH = 120;
    const drawW = drawH * (img.naturalWidth / img.naturalHeight);
    ctx.save();
    ctx.setLineDash([]);
    ctx.drawImage(img, cx - drawW / 2, cy - drawH, drawW, drawH);
    ctx.restore();

    // Draw platform under launcher so it doesn't look like it's floating
    this._drawLauncherPlatform(drawX, drawY);
  }

  _drawLauncherPlatform(worldX, worldY) {
    const ctx = this.ctx;
    const { cx, cy } = w2c(worldX, worldY);
    const { cy: groundCy } = w2c(worldX, GROUND_Y);

    // Platform dimensions — a sturdy podium
    const platW = 80;
    const platTopH = 12;  // lip at top
    const stemW = 56;

    // Only draw if launcher is noticeably above ground
    const gap = groundCy - cy;
    if (gap < 20) return;

    ctx.save();
    ctx.setLineDash([]);

    // Stone/concrete platform stem — tapered pedestal
    const stemTop = cy + 2;
    const stemBottom = groundCy;

    // Gradient for 3D-ish look
    const grad = ctx.createLinearGradient(cx - stemW / 2, 0, cx + stemW / 2, 0);
    grad.addColorStop(0, '#a8a29e');
    grad.addColorStop(0.5, '#d1d5db');
    grad.addColorStop(1, '#78716c');

    // Tapered stem (wider at bottom)
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx - stemW / 2 + 4, stemTop);
    ctx.lineTo(cx + stemW / 2 - 4, stemTop);
    ctx.lineTo(cx + platW / 2, stemBottom);
    ctx.lineTo(cx - platW / 2, stemBottom);
    ctx.closePath();
    ctx.fill();

    // Top slab (overhang)
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(cx - platW / 2, stemTop - platTopH, platW, platTopH);
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - platW / 2, stemTop - platTopH, platW, platTopH);

    // Texture dots on stem
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let dy = stemTop + 8; dy < stemBottom - 4; dy += 12) {
      const widthHere = stemW + (platW - stemW) * ((dy - stemTop) / (stemBottom - stemTop));
      for (let dx = -widthHere / 2 + 6; dx < widthHere / 2 - 4; dx += 10) {
        ctx.fillRect(cx + dx, dy, 2, 2);
      }
    }

    ctx.restore();
  }

  // ── Mini Graph Overlay ──────────────────────────────────────────────────

  _drawMiniGraph(session) {
    const ctx = this.ctx;
    const cfg = this._cfg;
    if (!cfg) return;

    const params = session.getEffectiveParams();
    const form = session.currentForm();

    // Graph box dimensions (top-right corner)
    const gW = 200, gH = 140;
    const chapter = this._cfg?.chapter ?? 1;
    const gX = chapter === 1 ? CANVAS_W - gW - 12 : 12;  // Left for ch2+, right for ch1
    const gY = 12;
    const pad = 28; // padding inside box for axes labels

    // Semi-transparent background
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.roundRect(gX, gY, gW, gH, 8);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Coordinate system within graph box
    // Map math coords (x: -2 to 10, y: -2 to 6) to graph pixels
    const xMin = -2, xMax = 10, yMin = -2, yMax = 6;
    const plotL = gX + pad, plotR = gX + gW - 8;
    const plotT = gY + 8, plotB = gY + gH - pad;
    const plotW = plotR - plotL, plotH = plotB - plotT;

    const toGx = (x) => plotL + ((x - xMin) / (xMax - xMin)) * plotW;
    const toGy = (y) => plotB - ((y - yMin) / (yMax - yMin)) * plotH;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx <= 10; gx += 2) {
      const px = toGx(gx);
      ctx.beginPath(); ctx.moveTo(px, plotT); ctx.lineTo(px, plotB); ctx.stroke();
    }
    for (let gy = 0; gy <= 6; gy += 2) {
      const py = toGy(gy);
      ctx.beginPath(); ctx.moveTo(plotL, py); ctx.lineTo(plotR, py); ctx.stroke();
    }

    // Axes (x=0, y=0)
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    // Y-axis (x=0)
    const ax0 = toGx(0);
    if (ax0 >= plotL && ax0 <= plotR) {
      ctx.beginPath(); ctx.moveTo(ax0, plotT); ctx.lineTo(ax0, plotB); ctx.stroke();
    }
    // X-axis (y=0)
    const ay0 = toGy(0);
    if (ay0 >= plotT && ay0 <= plotB) {
      ctx.beginPath(); ctx.moveTo(plotL, ay0); ctx.lineTo(plotR, ay0); ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let gx = 2; gx <= 8; gx += 2) {
      ctx.fillText(gx, toGx(gx), ay0 + 11);
    }
    ctx.textAlign = 'right';
    for (let gy = 2; gy <= 6; gy += 2) {
      ctx.fillText(gy, ax0 - 4, toGy(gy) + 3);
    }

    // Draw the full parabola
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (let px = xMin; px <= xMax; px += 0.1) {
      const localX = px - cfg.launcher.x; // convert world x to equation-local x
      const localY = evalForm(localX, form, params);
      const worldY = cfg.launcher.y + localY;
      const sx = toGx(px);
      const sy = toGy(worldY);
      if (sy < plotT - 20 || sy > plotB + 20) {
        started = false;
        continue;
      }
      if (!started) { ctx.moveTo(sx, sy); started = true; }
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Draw game arc portion (highlighted)
    const arcPts = session.arcPoints;
    if (arcPts && arcPts.length > 1) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const s0x = toGx(arcPts[0].x);
      const s0y = toGy(arcPts[0].y);
      ctx.moveTo(s0x, s0y);
      for (let i = 1; i < arcPts.length; i += 3) { // sample every 3rd point for perf
        ctx.lineTo(toGx(arcPts[i].x), toGy(arcPts[i].y));
      }
      ctx.stroke();
    }

    // Vertex dot
    const launcher = cfg.launcher;
    const span = WORLD_W - launcher.x;
    const vertex = findVertexPoint(form, params, launcher, span);
    const vx = toGx(vertex.x), vy = toGy(vertex.y);
    if (vx >= plotL && vx <= plotR && vy >= plotT && vy <= plotB) {
      ctx.fillStyle = COEFF_COLORS.k || '#34d399';
      ctx.beginPath(); ctx.arc(vx, vy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('vertex', vx, vy - 7);
    }

    // Root dots (for forms that have roots)
    if (form === 'factored' && params.r1 != null && params.r2 != null) {
      const r1World = launcher.x + params.r1;
      const r2World = launcher.x + params.r2;
      for (const [label, rx] of [['r\u2081', r1World], ['r\u2082', r2World]]) {
        const gx = toGx(rx), gy = toGy(launcher.y); // roots at y = launcher.y (equation y=0)
        if (gx >= plotL && gx <= plotR && gy >= plotT && gy <= plotB) {
          ctx.fillStyle = label === 'r\u2081' ? COEFF_COLORS.r1 : COEFF_COLORS.r2;
          ctx.beginPath(); ctx.arc(gx, gy, 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.font = '7px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(label, gx, gy + 10);
        }
      }
    }

    // Launcher dot
    const lx = toGx(launcher.x), ly = toGy(launcher.y);
    if (lx >= plotL && lx <= plotR && ly >= plotT && ly <= plotB) {
      ctx.fillStyle = '#f97316';
      ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2); ctx.fill();
    }

    // Equation label at top of box
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    const formLabels = {
      stretch: 'y = ax\u00B2',
      vertex: 'y = a(x\u2212h)\u00B2 + k',
      factored: 'y = a(x\u2212r\u2081)(x\u2212r\u2082)',
      standard: 'y = ax\u00B2 + bx + c',
      cubic: 'y = a(x\u2212h)\u00B3 + k',
      abs: 'y = a|x\u2212h| + k',
    };
    ctx.fillText(formLabels[form] || form, gX + 8, gY + gH - 6);

    // Legend
    ctx.font = '8px monospace';
    const legX = gX + 8, legY = gY + 14;
    ctx.fillStyle = '#60a5fa'; ctx.fillRect(legX, legY - 4, 10, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillText('full curve', legX + 14, legY);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(legX, legY + 8, 10, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillText('your arc', legX + 14, legY + 12);

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
