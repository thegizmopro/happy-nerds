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
    const chapter = this._cfg?.chapter ?? 1;
    const { cy: groundCy } = w2c(0, launcher.y);

    ctx.save();
    ctx.setLineDash([]);
    if (chapter === 1)      this._drawBusStop(groundCy);
    else if (chapter === 2) this._drawHallway(groundCy);
    else if (chapter === 3) this._drawClassroom(groundCy);
    else if (chapter === 4) this._drawCafeteria(groundCy);
    else if (chapter === 5) this._drawLibrary(groundCy);
    else if (chapter === 6) this._drawGym(groundCy);
    else if (chapter === 7) this._drawLab(groundCy);
    else                    this._drawOffice(groundCy);
    ctx.restore();

    // Grid overlay
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
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

    // Ground line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(0, groundCy); ctx.lineTo(CANVAS_W, groundCy); ctx.stroke();
    ctx.fillStyle = 'rgba(8,10,16,0.75)';
    ctx.fillRect(0, groundCy, CANVAS_W, CANVAS_H - groundCy);
  }

  _drawBusStop(groundCy) {
    const ctx = this.ctx;
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (const [sx, sy] of [[60,30],[140,55],[220,20],[350,45],[480,15],[580,40],[650,25],[720,60],[800,35],[900,50]]) {
      ctx.beginPath(); ctx.arc(sx, sy, 1.2, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = '#0f1d2e';
    ctx.fillRect(420, groundCy - 110, 160, 110);
    ctx.fillRect(490, groundCy - 145, 50, 35);
    ctx.fillRect(560, groundCy - 80, 60, 80);
    ctx.fillStyle = 'rgba(253,230,138,0.3)';
    for (let col = 0; col < 3; col++) for (let row = 0; row < 2; row++)
      ctx.fillRect(432 + col*36, groundCy - 100 + row*40, 16, 20);
    ctx.fillStyle = '#1e2a38';
    ctx.fillRect(0, groundCy - 20, CANVAS_W, 20);
    ctx.strokeStyle = 'rgba(255,255,200,0.35)';
    ctx.lineWidth = 3; ctx.setLineDash([30,20]);
    ctx.beginPath(); ctx.moveTo(0, groundCy + 15); ctx.lineTo(CANVAS_W, groundCy + 15); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(110, groundCy); ctx.lineTo(110, groundCy - 90); ctx.stroke();
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(85, groundCy - 95, 72, 28);
    ctx.fillStyle = '#fde68a';
    ctx.font = `bold ${Math.round(SCALE * 0.17)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('BUS STOP', 121, groundCy - 81);
  }

  _drawHallway(groundCy) {
    const ctx = this.ctx;
    ctx.fillStyle = '#1a1810'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = 'rgba(240,250,255,0.18)';
    for (let i = 0; i < 4; i++)
      ctx.fillRect(i*(CANVAS_W/4) + (CANVAS_W/4)*0.15, 4, (CANVAS_W/4)*0.7, 8);
    const vpX = CANVAS_W/2, vpY = groundCy * 0.7;
    ctx.strokeStyle = '#2d2a1e'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) { ctx.moveTo(vpX, vpY); ctx.lineTo(i*(CANVAS_W/8), groundCy); }
    ctx.stroke();
    const lockerW = 36, lockerH = groundCy * 0.85;
    for (let i = 0; i < 6; i++) {
      const lx = i * lockerW;
      ctx.fillStyle = i%2===0 ? '#1e2d45' : '#1a2840';
      ctx.fillRect(lx, groundCy - lockerH, lockerW-2, lockerH);
      ctx.strokeStyle = '#2d4a6b'; ctx.lineWidth = 1;
      ctx.strokeRect(lx, groundCy - lockerH, lockerW-2, lockerH);
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(lx + lockerW/2 - 3, groundCy - lockerH*0.5, 6, 4);
    }
    for (let i = 0; i < 6; i++) {
      const lx = CANVAS_W - (i+1)*lockerW;
      ctx.fillStyle = i%2===0 ? '#2d1e45' : '#281a40';
      ctx.fillRect(lx+2, groundCy - lockerH, lockerW-2, lockerH);
      ctx.strokeStyle = '#4a2d6b'; ctx.lineWidth = 1;
      ctx.strokeRect(lx+2, groundCy - lockerH, lockerW-2, lockerH);
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(lx + lockerW/2 - 1, groundCy - lockerH*0.5, 6, 4);
    }
    ctx.fillStyle = '#1a2a1a';
    ctx.fillRect(CANVAS_W/2 - 70, 24, 140, 28);
    ctx.strokeStyle = '#2d6b3a'; ctx.lineWidth = 1.5;
    ctx.strokeRect(CANVAS_W/2 - 70, 24, 140, 28);
    ctx.fillStyle = '#4ade80';
    ctx.font = `bold ${Math.round(SCALE * 0.2)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('MATH WING', CANVAS_W/2, 38);
  }

  _drawClassroom(groundCy) {
    const ctx = this.ctx;
    ctx.fillStyle = '#141a14'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#0d2010';
    ctx.fillRect(80, 10, CANVAS_W - 160, groundCy * 0.65);
    ctx.strokeStyle = '#1a4020'; ctx.lineWidth = 6;
    ctx.strokeRect(80, 10, CANVAS_W - 160, groundCy * 0.65);
    ctx.fillStyle = '#1a2a1a';
    ctx.fillRect(80, 10 + groundCy*0.65, CANVAS_W - 160, 6);
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font = `${Math.round(SCALE * 0.22)}px monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('y = a(x-h)² + k', CANVAS_W/2, groundCy * 0.3);
    ctx.fillStyle = '#e5e5e5';
    ctx.beginPath(); ctx.arc(680, 40, 22, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(680, 40, 22, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(680,40); ctx.lineTo(680,22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(680,40); ctx.lineTo(695,40); ctx.stroke();
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(680,40,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#0d1a2e';
    ctx.fillRect(20, groundCy*0.05, 55, groundCy*0.55);
    ctx.strokeStyle = '#2d3a4a'; ctx.lineWidth = 3;
    ctx.strokeRect(20, groundCy*0.05, 55, groundCy*0.55);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(47, groundCy*0.05); ctx.lineTo(47, groundCy*0.6);
    ctx.moveTo(20, groundCy*0.3);  ctx.lineTo(75, groundCy*0.3);
    ctx.stroke();
    ctx.fillStyle = '#0a1f0a';
    ctx.beginPath(); ctx.arc(35, groundCy*0.35, 12, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(47, groundCy*0.28, 10, 0, Math.PI*2); ctx.fill();
    ctx.fillRect(43, groundCy*0.4, 4, groundCy*0.18);
    ctx.fillStyle = '#1a1a12';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(60 + i*160, groundCy - 15, 60, 12);
      ctx.strokeStyle = '#2a2a1a'; ctx.lineWidth = 1;
      ctx.strokeRect(60 + i*160, groundCy - 15, 60, 12);
    }
  }

  _drawCafeteria(groundCy) {
    const ctx = this.ctx;
    ctx.fillStyle = '#17130d'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#1a1508'; ctx.fillRect(0, 0, CANVAS_W, groundCy*0.5);
    ctx.fillStyle = '#0f1a0f';
    ctx.fillRect(CANVAS_W/2 - 95, 10, 190, 65);
    ctx.strokeStyle = '#1a3a1a'; ctx.lineWidth = 2;
    ctx.strokeRect(CANVAS_W/2 - 95, 10, 190, 65);
    ctx.fillStyle = '#4ade80';
    ctx.font = `bold ${Math.round(SCALE * 0.16)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText("TODAY'S SPECIAL", CANVAS_W/2, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = `${Math.round(SCALE * 0.13)}px sans-serif`;
    ctx.fillText('Pizza + Math Homework', CANVAS_W/2, 44);
    ctx.fillStyle = '#1e1a10';
    ctx.fillRect(0, groundCy*0.55, CANVAS_W, 18);
    ctx.strokeStyle = '#3a3020'; ctx.lineWidth = 1;
    ctx.strokeRect(0, groundCy*0.55, CANVAS_W, 18);
    ctx.fillStyle = '#201c12';
    ctx.fillRect(10, groundCy - 26, 200, 14);
    ctx.fillRect(CANVAS_W - 210, groundCy - 26, 200, 14);
    ctx.strokeStyle = '#3a3222'; ctx.lineWidth = 1;
    ctx.strokeRect(10, groundCy - 26, 200, 14);
    ctx.strokeRect(CANVAS_W - 210, groundCy - 26, 200, 14);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (let tx = 0; tx < CANVAS_W; tx += 40) {
      ctx.beginPath(); ctx.moveTo(tx, groundCy - 30); ctx.lineTo(tx, groundCy); ctx.stroke();
    }
  }

  _drawLibrary(groundCy) {
    const ctx = this.ctx;
    const bookColors = ['#1d4ed8','#dc2626','#16a34a','#7c3aed','#ea580c','#0891b2','#be185d'];
    ctx.fillStyle = '#100d0a'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#1a1408';
    ctx.fillRect(CANVAS_W/2 - 68, 14, 136, 26);
    ctx.strokeStyle = '#4a3800'; ctx.lineWidth = 1.5;
    ctx.strokeRect(CANVAS_W/2 - 68, 14, 136, 26);
    ctx.fillStyle = '#fbbf24';
    ctx.font = `bold ${Math.round(SCALE * 0.17)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('QUIET PLEASE', CANVAS_W/2, 27);
    const shelfH = groundCy * 0.85, shelfW = 68;
    for (let side = 0; side < 2; side++) {
      const sx = side === 0 ? 0 : CANVAS_W - shelfW;
      ctx.fillStyle = '#1a1208'; ctx.fillRect(sx, groundCy - shelfH, shelfW, shelfH);
      ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = 1;
      ctx.strokeRect(sx, groundCy - shelfH, shelfW, shelfH);
      for (let row = 0; row < 4; row++) {
        let bx = sx + 3;
        const by = groundCy - shelfH + row*(shelfH/4) + 4;
        const bh = shelfH/4 - 8;
        let ci = 0;
        while (bx < sx + shelfW - 4) {
          const bw = 7 + (ci%3)*3;
          ctx.fillStyle = bookColors[(row*3+ci+side*2) % bookColors.length];
          ctx.globalAlpha = 0.5; ctx.fillRect(bx, by, bw, bh); ctx.globalAlpha = 1;
          bx += bw + 1; ci++;
        }
        ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = 1.5;
        if (row > 0) {
          ctx.beginPath();
          ctx.moveTo(sx, groundCy - shelfH + row*shelfH/4);
          ctx.lineTo(sx + shelfW, groundCy - shelfH + row*shelfH/4);
          ctx.stroke();
        }
      }
    }
    ctx.strokeStyle = '#4a3820'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(CANVAS_W - 100, groundCy); ctx.lineTo(CANVAS_W - 100, groundCy - 52);
    ctx.lineTo(CANVAS_W - 115, groundCy - 60); ctx.stroke();
    ctx.fillStyle = '#78350f';
    ctx.beginPath(); ctx.arc(CANVAS_W - 115, groundCy - 66, 9, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(253,230,138,0.1)';
    ctx.beginPath(); ctx.arc(CANVAS_W - 115, groundCy - 66, 34, 0, Math.PI*2); ctx.fill();
  }

  _drawGym(groundCy) {
    const ctx = this.ctx;
    ctx.fillStyle = '#0d0f0a'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    for (let row = 0; row < 5; row++) {
      ctx.fillStyle = row%2===0 ? '#1a1a12' : '#151510';
      ctx.fillRect(0, row*(groundCy*0.12), CANVAS_W, groundCy*0.12);
      ctx.strokeStyle = '#2a2a18'; ctx.lineWidth = 0.5;
      ctx.strokeRect(0, row*(groundCy*0.12), CANVAS_W, groundCy*0.12);
    }
    ctx.fillStyle = '#0f0f08';
    ctx.fillRect(CANVAS_W/2 - 82, 10, 164, 52);
    ctx.strokeStyle = '#2a2a10'; ctx.lineWidth = 2;
    ctx.strokeRect(CANVAS_W/2 - 82, 10, 164, 52);
    ctx.fillStyle = '#ef4444';
    ctx.font = `bold ${Math.round(SCALE * 0.35)}px monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('24 – 07', CANVAS_W/2, 36);
    ctx.strokeStyle = '#f97316'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(CANVAS_W - 30, groundCy*0.42, 18, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = '#1a1a14';
    ctx.fillRect(CANVAS_W - 58, groundCy*0.22, 50, 35);
    ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 2;
    ctx.strokeRect(CANVAS_W - 58, groundCy*0.22, 50, 35);
    ctx.beginPath(); ctx.moveTo(CANVAS_W - 33, groundCy*0.22 + 35); ctx.lineTo(CANVAS_W - 33, groundCy*0.42); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(CANVAS_W/2, groundCy - 10, 60, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(CANVAS_W - 20, groundCy - 10, 120, Math.PI*0.55, Math.PI*0.95); ctx.stroke();
    ctx.beginPath(); ctx.arc(20, groundCy - 10, 120, Math.PI*0.05, Math.PI*0.45); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CANVAS_W/2, groundCy - 20); ctx.lineTo(CANVAS_W/2, groundCy); ctx.stroke();
  }

  _drawLab(groundCy) {
    const ctx = this.ctx;
    const beakerColors = ['#22d3ee','#4ade80','#f97316','#a78bfa'];
    ctx.fillStyle = '#0e0f14'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#121520'; ctx.fillRect(0, 0, CANVAS_W, groundCy*0.6);
    ctx.fillStyle = '#0d1018';
    ctx.fillRect(15, 10, 110, groundCy*0.55);
    ctx.strokeStyle = '#1d2540'; ctx.lineWidth = 1;
    ctx.strokeRect(15, 10, 110, groundCy*0.55);
    const cellW = 11, cellH = (groundCy*0.55)/7;
    for (let row = 0; row < 7; row++) for (let col = 0; col < 9; col++) {
      if (row === 0 && col > 0 && col < 8) continue;
      ctx.fillStyle = `hsl(${(row*40+col*20)%360},40%,18%)`;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(17 + col*cellW, 12 + row*cellH, cellW-1, cellH-1);
      ctx.globalAlpha = 1;
    }
    const shelfY1 = groundCy*0.1, shelfY2 = groundCy*0.42;
    ctx.fillStyle = '#1a1a10';
    ctx.fillRect(CANVAS_W - 130, shelfY1, 130, 8);
    ctx.fillRect(CANVAS_W - 130, shelfY2, 130, 8);
    ctx.strokeStyle = '#2a2a18'; ctx.lineWidth = 1;
    ctx.strokeRect(CANVAS_W - 130, shelfY1, 130, 8);
    ctx.strokeRect(CANVAS_W - 130, shelfY2, 130, 8);
    for (let i = 0; i < 4; i++) {
      const bx = CANVAS_W - 120 + i*30, by = shelfY1 - 28;
      ctx.fillStyle = beakerColors[i]; ctx.globalAlpha = 0.35;
      ctx.fillRect(bx-8, by, 16, 20); ctx.globalAlpha = 1;
      ctx.strokeStyle = beakerColors[i]; ctx.lineWidth = 1.5;
      ctx.strokeRect(bx-8, by, 16, 20);
      ctx.fillStyle = beakerColors[i]; ctx.globalAlpha = 0.5;
      ctx.fillRect(bx-8, by+10, 16, 10); ctx.globalAlpha = 1;
    }
    for (let i = 0; i < 3; i++) {
      const bx = CANVAS_W - 115 + i*35, by = shelfY2 - 28;
      ctx.fillStyle = beakerColors[(i+2)%4]; ctx.globalAlpha = 0.35;
      ctx.fillRect(bx-8, by, 16, 20); ctx.globalAlpha = 1;
      ctx.strokeStyle = beakerColors[(i+2)%4]; ctx.lineWidth = 1.5;
      ctx.strokeRect(bx-8, by, 16, 20);
      ctx.fillStyle = beakerColors[(i+2)%4]; ctx.globalAlpha = 0.5;
      ctx.fillRect(bx-8, by+12, 16, 8); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = '#14120a';
    ctx.fillRect(150, groundCy - 18, 200, 12);
    ctx.strokeStyle = '#2a2218'; ctx.lineWidth = 1;
    ctx.strokeRect(150, groundCy - 18, 200, 12);
    ctx.fillStyle = '#0a1e0a';
    ctx.fillRect(CANVAS_W/2 - 42, 14, 84, 22);
    ctx.fillStyle = '#22c55e';
    ctx.font = `bold ${Math.round(SCALE * 0.14)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('⚠ SAFETY', CANVAS_W/2, 25);
  }

  _drawOffice(groundCy) {
    const ctx = this.ctx;
    const offBookColors = ['#7c2d12','#1e3a8a','#14532d','#312e81','#78350f'];
    ctx.fillStyle = '#0f0a08'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#1a0f08'; ctx.fillRect(0, 0, CANVAS_W, groundCy*0.7);
    ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 1;
    for (let px = 0; px < CANVAS_W; px += 80) {
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, groundCy*0.7); ctx.stroke();
    }
    ctx.fillStyle = '#150e06';
    ctx.fillRect(0, groundCy*0.05, 90, groundCy*0.65);
    ctx.strokeStyle = '#2a1808'; ctx.lineWidth = 1;
    ctx.strokeRect(0, groundCy*0.05, 90, groundCy*0.65);
    for (let row = 0; row < 4; row++) {
      let bx = 4;
      const by = groundCy*0.07 + row*(groundCy*0.65/4);
      const bh = groundCy*0.65/4 - 6;
      let ci = 0;
      while (bx < 86) {
        const bw = 10 + (ci%3)*4;
        ctx.fillStyle = offBookColors[(row*2+ci)%offBookColors.length];
        ctx.globalAlpha = 0.55; ctx.fillRect(bx, by, bw, bh); ctx.globalAlpha = 1;
        bx += bw + 2; ci++;
      }
    }
    for (const [cx2, cy2] of [[CANVAS_W-120,20],[CANVAS_W-62,20],[CANVAS_W-120,85],[CANVAS_W-62,85]]) {
      ctx.fillStyle = '#1a1408'; ctx.fillRect(cx2, cy2, 50, 55);
      ctx.strokeStyle = '#4a3820'; ctx.lineWidth = 1.5;
      ctx.strokeRect(cx2, cy2, 50, 55);
      ctx.fillStyle = 'rgba(251,191,36,0.2)'; ctx.fillRect(cx2+4, cy2+4, 42, 47);
      ctx.strokeStyle = 'rgba(251,191,36,0.28)'; ctx.lineWidth = 1;
      ctx.strokeRect(cx2+4, cy2+4, 42, 47);
    }
    ctx.fillStyle = '#1a1208';
    ctx.fillRect(CANVAS_W/2 - 82, 14, 164, 30);
    ctx.strokeStyle = '#4a3820'; ctx.lineWidth = 1.5;
    ctx.strokeRect(CANVAS_W/2 - 82, 14, 164, 30);
    ctx.fillStyle = '#fbbf24';
    ctx.font = `bold ${Math.round(SCALE * 0.2)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('PRINCIPAL', CANVAS_W/2, 29);
    ctx.fillStyle = '#1a0f08';
    ctx.fillRect(CANVAS_W/2 - 135, groundCy - 20, 270, 18);
    ctx.strokeStyle = '#3a2010'; ctx.lineWidth = 2;
    ctx.strokeRect(CANVAS_W/2 - 135, groundCy - 20, 270, 18);
    ctx.fillStyle = '#4a3820';
    ctx.fillRect(CANVAS_W/2 - 46, groundCy - 30, 92, 12);
    ctx.fillStyle = '#fbbf24';
    ctx.font = `${Math.round(SCALE * 0.12)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('PRINCIPAL', CANVAS_W/2, groundCy - 24);
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

    const faceColor = flashWhite ? '#ffffff' : '#fde68a';

    switch (type) {
      case 'letterman': this._drawVarsity(ctx, cx, cy, r, faceColor, dead); break;
      case 'cool':      this._drawSkater(ctx, cx, cy, r, faceColor, dead); break;
      case 'whistle':   this._drawCoach(ctx, cx, cy, r, faceColor, dead); break;
      case 'king':      this._drawBullyBoss(ctx, cx, cy, r, faceColor, dead); break;
      default:          this._drawJock(ctx, cx, cy, r, faceColor, dead); break;
    }

    ctx.restore();
  }

  // ── Human target shared helpers ───────────────────────────────────────────────

  _hFace(ctx, cx, cy, r, faceColor) {
    ctx.fillStyle = faceColor;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.stroke();
  }

  _hEyes(ctx, cx, cy, r, dead) {
    const lx = cx - r * 0.28, rx = cx + r * 0.28, ey = cy - r * 0.04;
    if (dead) {
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = Math.max(1.5, r * 0.08);
      const s = r * 0.12;
      ctx.beginPath();
      ctx.moveTo(lx-s, ey-s); ctx.lineTo(lx+s, ey+s);
      ctx.moveTo(lx+s, ey-s); ctx.lineTo(lx-s, ey+s);
      ctx.moveTo(rx-s, ey-s); ctx.lineTo(rx+s, ey+s);
      ctx.moveTo(rx+s, ey-s); ctx.lineTo(rx-s, ey+s);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(lx, ey, r * 0.1, 0, Math.PI * 2);
      ctx.arc(rx, ey, r * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _hBrows(ctx, cx, cy, r) {
    const ey = cy - r * 0.04;
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = Math.max(1.5, r * 0.08);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.46, ey - r * 0.22);
    ctx.lineTo(cx - r * 0.14, ey - r * 0.38);
    ctx.moveTo(cx + r * 0.14, ey - r * 0.38);
    ctx.lineTo(cx + r * 0.46, ey - r * 0.22);
    ctx.stroke();
  }

  _hTongue(ctx, cx, cy, r) {
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.08, cy + r * 0.56, r * 0.14, r * 0.1, Math.PI * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Human character type renderers ────────────────────────────────────────────

  _drawJock(ctx, cx, cy, r, faceColor, dead) {
    // Shoulder pads hint at bottom
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.62, cy + r * 0.68);
    ctx.lineTo(cx - r * 0.5, cy + r * 0.28);
    ctx.lineTo(cx + r * 0.5, cy + r * 0.28);
    ctx.lineTo(cx + r * 0.62, cy + r * 0.68);
    ctx.closePath(); ctx.fill();

    this._hFace(ctx, cx, cy, r, faceColor);

    // Blue football helmet dome
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.08, r * 0.96, Math.PI, 0);
    ctx.closePath(); ctx.fill();

    // Gold stripe
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = Math.max(2, r * 0.1);
    ctx.beginPath();
    ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy - r * 0.08); ctx.stroke();

    // Face mask bars
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = Math.max(1.5, r * 0.07);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.46, cy + r * 0.18); ctx.lineTo(cx + r * 0.46, cy + r * 0.18);
    ctx.moveTo(cx - r * 0.46, cy + r * 0.36); ctx.lineTo(cx + r * 0.46, cy + r * 0.36);
    ctx.moveTo(cx, cy + r * 0.18); ctx.lineTo(cx, cy + r * 0.54);
    ctx.stroke();

    if (!dead) this._hBrows(ctx, cx, cy, r);
    this._hEyes(ctx, cx, cy, r, dead);
    if (dead) this._hTongue(ctx, cx, cy, r);
  }

  _drawVarsity(ctx, cx, cy, r, faceColor, dead) {
    // Red letterman jacket collar
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.5, r * 0.85, Math.PI, 0);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#f5f5f5'; ctx.lineWidth = Math.max(1, r * 0.06);
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.5, r * 0.85, Math.PI * 1.15, Math.PI * 1.35); ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.5, r * 0.85, Math.PI * 1.65, Math.PI * 1.85); ctx.stroke();

    this._hFace(ctx, cx, cy, r, faceColor);

    // Backwards snapback cap
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.9, Math.PI * 1.08, Math.PI * 1.92);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx - r * 0.5, cy - r * 0.88, r, r * 0.14);

    // "B" on jacket
    ctx.fillStyle = '#fef2f2';
    ctx.font = `bold ${Math.max(8, Math.round(r * 0.28))}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('B', cx, cy + r * 0.62);

    if (!dead) {
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = Math.max(1.5, r * 0.07);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.1, cy + r * 0.46);
      ctx.quadraticCurveTo(cx + r * 0.15, cy + r * 0.38, cx + r * 0.3, cy + r * 0.44);
      ctx.stroke();
    }
    this._hEyes(ctx, cx, cy, r, dead);
    if (dead) this._hTongue(ctx, cx, cy, r);
  }

  _drawSkater(ctx, cx, cy, r, faceColor, dead) {
    this._hFace(ctx, cx, cy, r, faceColor);

    // Hoodie
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.55, r * 0.82, Math.PI, 0);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.1, cy + r * 0.38); ctx.lineTo(cx - r * 0.14, cy + r * 0.7);
    ctx.moveTo(cx + r * 0.1, cy + r * 0.38); ctx.lineTo(cx + r * 0.14, cy + r * 0.7);
    ctx.stroke();

    // Beanie
    ctx.fillStyle = '#4d7c0f';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.12, r * 0.88, Math.PI * 1.05, Math.PI * 1.95);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3f6212';
    ctx.fillRect(cx - r * 0.72, cy - r * 0.42, r * 1.44, r * 0.18);

    // Sunglasses
    const sgY = cy - r * 0.08, sgH = r * 0.2, sgW = r * 0.34;
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx - r * 0.52, sgY - sgH/2, sgW, sgH);
    ctx.fillRect(cx + r * 0.18, sgY - sgH/2, sgW, sgH);
    ctx.strokeStyle = '#111827'; ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.beginPath(); ctx.moveTo(cx - r * 0.18, sgY); ctx.lineTo(cx + r * 0.18, sgY); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = Math.max(1, r * 0.04);
    ctx.beginPath(); ctx.moveTo(cx - r * 0.48, sgY - sgH*0.3); ctx.lineTo(cx - r * 0.28, sgY - sgH*0.3); ctx.stroke();

    if (!dead) {
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = Math.max(1.5, r * 0.07);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.1, cy + r * 0.46);
      ctx.quadraticCurveTo(cx + r * 0.15, cy + r * 0.38, cx + r * 0.3, cy + r * 0.44);
      ctx.stroke();
    }
    if (dead) { this._hEyes(ctx, cx, cy, r, true); this._hTongue(ctx, cx, cy, r); }
  }

  _drawCoach(ctx, cx, cy, r, faceColor, dead) {
    this._hFace(ctx, cx, cy, r, faceColor);

    // Coach cap
    ctx.fillStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.9, Math.PI * 1.08, Math.PI * 1.92);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#172a45';
    ctx.fillRect(cx - r * 0.7, cy - r * 0.38, r * 1.4, r * 0.13);
    ctx.fillStyle = '#2d5a8e';
    ctx.beginPath(); ctx.arc(cx, cy - r * 0.88, r * 0.07, 0, Math.PI*2); ctx.fill();

    // Lanyard + whistle
    ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.08, cy + r * 0.12);
    ctx.quadraticCurveTo(cx + r * 0.1, cy + r * 0.35, cx + r * 0.28, cy + r * 0.54);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(cx + r * 0.28, cy + r * 0.54, r * 0.14, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#d97706';
    ctx.fillRect(cx + r * 0.4, cy + r * 0.5, r * 0.1, r * 0.06);

    if (!dead) this._hBrows(ctx, cx, cy, r);
    this._hEyes(ctx, cx, cy, r, dead);
    if (!dead) {
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.ellipse(cx, cy + r * 0.46, r * 0.16, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (dead) this._hTongue(ctx, cx, cy, r);
  }

  _drawBullyBoss(ctx, cx, cy, r, faceColor, dead) {
    // Intimidating shadow
    ctx.fillStyle = 'rgba(30,0,0,0.5)';
    ctx.beginPath(); ctx.arc(cx, cy + r * 0.2, r * 1.15, 0, Math.PI*2); ctx.fill();

    // Leather jacket
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.6, r * 0.95, Math.PI, 0);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(cx - r*0.3, cy + r*0.28); ctx.lineTo(cx - r*0.5, cy + r*0.7); ctx.lineTo(cx, cy + r*0.45); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + r*0.3, cy + r*0.28); ctx.lineTo(cx + r*0.5, cy + r*0.7); ctx.lineTo(cx, cy + r*0.45); ctx.closePath(); ctx.fill();

    this._hFace(ctx, cx, cy, r, faceColor);

    // Slicked-back hair
    ctx.fillStyle = '#1a0a00';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, Math.PI * 1.06, Math.PI * 1.94);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#2d1800'; ctx.lineWidth = Math.max(1, r * 0.06);
    ctx.beginPath();
    ctx.moveTo(cx - r*0.5, cy - r*0.72);
    ctx.quadraticCurveTo(cx, cy - r*0.92, cx + r*0.6, cy - r*0.62);
    ctx.stroke();

    if (!dead) {
      const ey = cy - r * 0.04;
      ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = Math.max(1.5, r * 0.09);
      ctx.beginPath();
      ctx.moveTo(cx - r*0.46, ey - r*0.3); ctx.lineTo(cx - r*0.14, ey - r*0.18);
      ctx.moveTo(cx + r*0.14, ey - r*0.38); ctx.lineTo(cx + r*0.46, ey - r*0.24);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - r*0.22, cy + r*0.44);
      ctx.quadraticCurveTo(cx + r*0.05, cy + r*0.36, cx + r*0.3, cy + r*0.42);
      ctx.stroke();
    }
    this._hEyes(ctx, cx, cy, r, dead);
    if (dead) this._hTongue(ctx, cx, cy, r);
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
