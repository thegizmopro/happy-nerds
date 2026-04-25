import { REVEALS } from '../levels/revealContent.js';

// ── Drawing helpers ──────────────────────────────────────────────────────────

function _bg(ctx, w, h) {
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, w, h);
}

function _axis(ctx, ox, oy, len) {
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + len, oy); ctx.stroke();
}

function _vaxis(ctx, x, y1, y2) {
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
}

// Draws a ∩-shaped arc (trajectory) from (ox, oy) to (ox+range, oy) with peak height peakH above oy
function _parabola(ctx, ox, oy, range, peakH, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
  for (let i = 0; i <= range; i++) {
    const t = i / range;
    const y = oy - peakH * 4 * t * (1 - t);
    i === 0 ? ctx.moveTo(ox + i, y) : ctx.lineTo(ox + i, y);
  }
  ctx.stroke();
}

// Draws a U-shape with arms at y=oy_top and vertex at y=oy_top+depth
function _uParabola(ctx, ox, oy_top, range, depth, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
  for (let i = 0; i <= range; i++) {
    const t = i / range;
    const y = oy_top + depth * 4 * t * (1 - t);
    i === 0 ? ctx.moveTo(ox + i, y) : ctx.lineTo(ox + i, y);
  }
  ctx.stroke();
}

function _dot(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

function _label(ctx, x, y, text, color, size = 9) {
  ctx.fillStyle = color;
  ctx.font = `${size}px 'Courier New', monospace`;
  ctx.fillText(text, x, y);
}

// ── Mini-canvas draw functions ───────────────────────────────────────────────

const DRAW_FNS = {
  leading_coefficient(ctx, w, h) {
    _bg(ctx, w, h);
    _axis(ctx, 5, h - 14, w - 10);
    const gy = h - 14;
    // Three arcs: steep (big |a|) in yellow, medium in purple, gentle (small |a|) in green
    _parabola(ctx, 10, gy, w - 22, 58, '#f59e0b');
    _parabola(ctx, 10, gy, w - 22, 38, '#7c3aed');
    _parabola(ctx, 10, gy, w - 22, 20, '#22c55e');
    _label(ctx, 10, 12, 'steep', '#f59e0b', 8);
    _label(ctx, 10, 22, 'gentle', '#22c55e', 8);
  },

  vertex_form(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 14, ax = 15;
    _axis(ctx, 5, gy, w - 10);
    _vaxis(ctx, ax, 5, h - 8);
    // Symmetric arc; vertex at canvas (ax + range/2, gy - peakH)
    const range = w - 25, peakH = 62;
    _parabola(ctx, ax, gy, range, peakH, '#7c3aed');
    const vx = ax + range / 2, vy = gy - peakH;
    // Dashed guide lines to axes
    ctx.save();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(vx, gy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax, vy); ctx.lineTo(vx, vy); ctx.stroke();
    ctx.restore();
    _dot(ctx, vx, vy, 4, '#a78bfa');
    _label(ctx, vx + 4, vy - 2, '(h,k)', '#a78bfa', 8);
    _label(ctx, vx - 3, gy + 11, 'h', '#a78bfa', 8);
    _label(ctx, ax + 3, vy + 4, 'k', '#a78bfa', 8);
  },

  negative_a_intro(ctx, w, h) {
    _bg(ctx, w, h);
    const mid = w / 2;
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mid, 5); ctx.lineTo(mid, h - 5); ctx.stroke();
    // Left: a > 0 = U-shape (arms near top, vertex near bottom)
    const lRange = mid - 18;
    _uParabola(ctx, 10, 14, lRange, 62, '#22c55e');
    // Right: a < 0 = ∩-shape (arms near bottom, vertex near top)
    const rRange = mid - 18;
    _parabola(ctx, mid + 8, h - 18, rRange, 62, '#f87171');
    _label(ctx, 12, h - 4, 'a > 0', '#22c55e', 8);
    _label(ctx, mid + 5, h - 4, 'a < 0', '#f87171', 8);
  },

  negative_a(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    _parabola(ctx, 10, gy, w - 28, 55, '#7c3aed');
    const tx = w - 20, ty = gy - 3;
    _dot(ctx, tx, ty, 5, '#f59e0b');
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(tx, ty, 9, 0, Math.PI * 2); ctx.stroke();
    _label(ctx, 8, 13, 'a < 0', '#a78bfa', 8);
  },

  factored_form(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 17;
    _axis(ctx, 5, gy, w - 10);
    const r1x = 22, r2x = w - 22;
    _parabola(ctx, r1x, gy, r2x - r1x, 54, '#22c55e');
    _dot(ctx, r1x, gy, 4, '#e2e8f0');
    _dot(ctx, r2x, gy, 4, '#e2e8f0');
    _label(ctx, r1x - 6, gy + 12, 'r₁', '#e2e8f0', 8);
    _label(ctx, r2x - 4, gy + 12, 'r₂', '#e2e8f0', 8);
  },

  standard_form(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15, ax = 20;
    _axis(ctx, 5, gy, w - 10);
    _vaxis(ctx, ax, 5, h - 8);
    // Asymmetric arc via bezier to show b offset
    const startY = gy - 30;
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax, startY);
    ctx.quadraticCurveTo(85, 5, w - 15, gy);
    ctx.stroke();
    // y-intercept at the y-axis
    _dot(ctx, ax, startY, 4, '#f59e0b');
    _label(ctx, ax + 4, startY - 2, 'c', '#f59e0b', 9);
  },

  multi_shot_strategy(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    const s1End = Math.round(w * 0.44);
    _parabola(ctx, 10, gy, s1End, 44, '#22c55e');
    _parabola(ctx, 10, gy, w - 22, 28, '#7c3aed');
    // Target 1
    const t1x = 10 + s1End, t1y = gy - 3;
    _dot(ctx, t1x, t1y, 5, '#f59e0b');
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(t1x, t1y, 8, 0, Math.PI * 2); ctx.stroke();
    // Target 2
    const t2x = w - 15, t2y = gy - 3;
    _dot(ctx, t2x, t2y, 5, '#f59e0b');
    ctx.beginPath(); ctx.arc(t2x, t2y, 8, 0, Math.PI * 2); ctx.stroke();
  },

  cubic_intro(ctx, w, h) {
    _bg(ctx, w, h);
    const midY = h / 2;
    _axis(ctx, 5, midY, w - 10);
    // S-curve: y = 50 - (xn)^3 * 38 where xn = (cx - w/2) / (w/2 - 10)
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let cx = 10; cx <= w - 10; cx++) {
      const xn = (cx - w / 2) / (w / 2 - 10);
      const y = midY - Math.pow(xn, 3) * (h / 2 - 10);
      cx === 10 ? ctx.moveTo(cx, y) : ctx.lineTo(cx, y);
    }
    ctx.stroke();
    _label(ctx, 8, 14, 'y = x³', '#22c55e', 9);
  },
};

// ── RevealCard class ─────────────────────────────────────────────────────────

export class RevealCard {
  constructor(container) {
    this.container = container;
    this._card = null;
    this._timer = null;
  }

  show(conceptId, onDismiss) {
    const content = REVEALS[conceptId];
    if (!content) return;

    this.hide();

    const card = document.createElement('div');
    card.className = 'reveal-card';

    const vocabHTML = (content.vocabulary ?? [])
      .map(v => `<span class="vocab-chip">${v}</span>`)
      .join('');

    card.innerHTML = `
      <div class="reveal-card-title">${content.title}</div>
      <div class="reveal-card-subtitle">${content.subtitle}</div>
      <canvas class="reveal-card-canvas" width="200" height="100"></canvas>
      <div class="reveal-card-body">${content.body.replace(/\n/g, '<br>')}</div>
      <div class="reveal-card-vocab">${vocabHTML}</div>
      <button class="reveal-card-dismiss">Cool!</button>
    `;

    this.container.appendChild(card);
    this._card = card;

    const drawFn = DRAW_FNS[conceptId];
    if (drawFn) {
      const canvas = card.querySelector('.reveal-card-canvas');
      try { drawFn(canvas.getContext('2d'), canvas.width, canvas.height); } catch (_) {}
    }

    // Double rAF ensures initial transform is computed before adding enter class
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('reveal-card-enter')));

    const dismiss = () => {
      clearTimeout(this._timer);
      this._timer = null;
      const c = this._card;
      this._card = null;
      if (c) this._animateOut(c, onDismiss);
    };

    card.querySelector('.reveal-card-dismiss').addEventListener('click', dismiss);
    // Touch anywhere on card backdrop dismisses too
    card.addEventListener('touchend', e => { if (e.target === card) dismiss(); });

    this._timer = setTimeout(dismiss, 5000);
  }

  hide() {
    clearTimeout(this._timer);
    this._timer = null;
    if (this._card) {
      this._card.remove();
      this._card = null;
    }
  }

  _animateOut(card, onDismiss) {
    card.classList.remove('reveal-card-enter');
    card.classList.add('reveal-card-exit');
    setTimeout(() => {
      if (card.parentNode) card.remove();
      onDismiss?.();
    }, 300);
  }
}
