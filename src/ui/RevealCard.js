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

  what_is_a_function(ctx, w, h) {
    _bg(ctx, w, h);
    // Machine box
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
    ctx.beginPath();
    const bx = w/2 - 30, by = 15, bw = 60, bh = h - 40;
    ctx.roundRect(bx, by, bw, bh, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
    ctx.fillText('f(x)', w/2, by + 20);
    // Input arrow
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, h/2); ctx.lineTo(bx - 4, h/2); ctx.stroke();
    ctx.fillStyle = '#22c55e'; ctx.font = '10px monospace'; ctx.textAlign = 'right';
    ctx.fillText('x', bx - 8, h/2 + 4);
    // Output arrow
    ctx.strokeStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(bx + bw + 4, h/2); ctx.lineTo(w - 10, h/2); ctx.stroke();
    ctx.fillStyle = '#f59e0b'; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    ctx.fillText('y', bx + bw + 8, h/2 + 4);
  },

  symmetry(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    const mid = w / 2;
    // Dashed symmetry line
    ctx.save(); ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(mid, 5); ctx.lineTo(mid, gy); ctx.stroke(); ctx.restore();
    // Parabola
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= w - 20; i++) {
      const t = i / (w - 20);
      const y = gy - 55 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // Mirror dots
    const dx = 30;
    _dot(ctx, mid - dx, gy - 55 * 4 * (0.5 - dx/(w-20)) * (0.5 + dx/(w-20)), 4, '#f59e0b');
    _dot(ctx, mid + dx, gy - 55 * 4 * (0.5 - dx/(w-20)) * (0.5 + dx/(w-20)), 4, '#f59e0b');
    ctx.fillStyle = '#f59e0b'; ctx.font = '8px monospace'; ctx.textAlign = 'center';
    ctx.fillText('symmetry', mid, 10);
  },

  horizontal_shift(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Original (faded)
    ctx.strokeStyle = 'rgba(124,58,237,0.3)'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const y = gy - 50 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // Shifted right
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const y = gy - 50 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(50 + i, y) : ctx.lineTo(50 + i, y);
    }
    ctx.stroke();
    // Arrow
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(50, gy - 50); ctx.lineTo(90, gy - 50); ctx.stroke();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(90, gy - 50); ctx.lineTo(84, gy - 54); ctx.lineTo(84, gy - 46); ctx.fill();
    ctx.font = '8px monospace'; ctx.textAlign = 'left';
    ctx.fillText('h →', 60, gy - 55);
  },

  vertex_hunting(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15, ax = 15;
    _axis(ctx, 5, gy, w - 10);
    _vaxis(ctx, ax, 5, h - 8);
    // Parabola
    const range = w - 25;
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= range; i++) {
      const t = i / range;
      const y = gy - 60 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(ax + i, y) : ctx.lineTo(ax + i, y);
    }
    ctx.stroke();
    // Vertex dot + crosshairs
    const vx = ax + range/2, vy = gy - 60;
    ctx.save(); ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(vx, gy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax, vy); ctx.lineTo(vx, vy); ctx.stroke(); ctx.restore();
    _dot(ctx, vx, vy, 5, '#f59e0b');
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(vx, vy, 9, 0, Math.PI * 2); ctx.stroke();
    _label(ctx, vx + 4, vy - 6, '(h, k)', '#f59e0b', 8);
  },

  real_world_parabolas(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Dish shape (U-parabola)
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= w - 20; i++) {
      const t = i / (w - 20);
      const y = gy - 15 - 50 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // Focus point
    _dot(ctx, w/2, gy - 35, 4, '#f59e0b');
    _label(ctx, w/2 + 4, gy - 35, 'focus', '#f59e0b', 7);
    // Incoming signals
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, 5); ctx.lineTo(w/2, gy - 35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - 20, 5); ctx.lineTo(w/2, gy - 35); ctx.stroke();
    _label(ctx, w/2 - 20, 8, 'satellite dish', '#94a3b8', 7);
  },

  wider_vs_narrower(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Three parabolas: narrow, medium, wide
    const colors = ['#ef4444', '#7c3aed', '#22c55e'];
    const peaks = [65, 42, 22];
    const labels = ['|a| = 0.5', '|a| = 0.15', '|a| = 0.05'];
    for (let j = 0; j < 3; j++) {
      ctx.strokeStyle = colors[j]; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i <= w - 20; i++) {
        const t = i / (w - 20);
        const y = gy - peaks[j] * 4 * t * (1 - t);
        i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
      }
      ctx.stroke();
      _label(ctx, 12, 12 + j * 11, labels[j], colors[j], 7);
    }
  },

  domain_and_range(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 18, ax = 18;
    _axis(ctx, 5, gy, w - 10);
    _vaxis(ctx, ax, 5, h - 8);
    // Parabola
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= w - 30; i++) {
      const t = i / (w - 30);
      const y = gy - 60 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(ax + i, y) : ctx.lineTo(ax + i, y);
    }
    ctx.stroke();
    // Domain arrow (x-axis)
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax + 5, gy + 6); ctx.lineTo(w - 10, gy + 6); ctx.stroke();
    _label(ctx, w/2, gy + 15, 'domain (all x)', '#22c55e', 7);
    // Range arrow (y-axis)
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax - 6, gy); ctx.lineTo(ax - 6, gy - 60); ctx.stroke();
    _label(ctx, 2, 14, 'range', '#f59e0b', 7);
  },

  discriminant(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Two roots (positive discriminant)
    const r1 = 25, r2 = w - 25;
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= r2 - r1; i++) {
      const t = i / (r2 - r1);
      const y = gy - 50 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(r1 + i, y) : ctx.lineTo(r1 + i, y);
    }
    ctx.stroke();
    _dot(ctx, r1, gy, 4, '#22c55e'); _dot(ctx, r2, gy, 4, '#22c55e');
    _label(ctx, r1 - 2, gy + 11, 'root', '#22c55e', 7);
    _label(ctx, r2 - 6, gy + 11, 'root', '#22c55e', 7);
    // Formula
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('b\u00B2 - 4ac > 0', w/2, 12);
  },

  multiple_roots(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Two arcs from same start, different roots
    const r1a = 15, r2a = 60, r1b = 15, r2b = w - 15;
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= r2a - r1a; i++) {
      const t = i / (r2a - r1a);
      const y = gy - 40 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(r1a + i, y) : ctx.lineTo(r1a + i, y);
    }
    ctx.stroke();
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= r2b - r1b; i++) {
      const t = i / (r2b - r1b);
      const y = gy - 55 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(r1b + i, y) : ctx.lineTo(r1b + i, y);
    }
    ctx.stroke();
    _dot(ctx, 15, gy, 3, '#e2e8f0');
    _dot(ctx, 60, gy, 4, '#22c55e');
    _dot(ctx, w - 15, gy, 4, '#7c3aed');
    _label(ctx, 10, 12, 'path A', '#22c55e', 7);
    _label(ctx, 10, 22, 'path B', '#7c3aed', 7);
  },

  completing_the_square(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Standard form (asymmetric)
    const startY = gy - 20;
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(15, startY);
    ctx.quadraticCurveTo(80, 8, w - 10, gy - 10);
    ctx.stroke();
    // Arrow to vertex form (symmetric)
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(w/2 - 20, 20); ctx.lineTo(w/2 + 20, 20); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b'; ctx.font = '8px monospace'; ctx.textAlign = 'left';
    ctx.fillText('ax\u00B2+bx+c', 10, h - 3);
    ctx.fillStyle = '#7c3aed'; ctx.textAlign = 'right';
    ctx.fillText('a(x-h)\u00B2+k', w - 10, h - 3);
  },

  accuracy_and_efficiency(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Three stars
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('\u2B50\u2B50\u2B50', w/2, 16);
    // Perfect arc hitting target
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= w - 30; i++) {
      const t = i / (w - 30);
      const y = gy - 50 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(15 + i, y) : ctx.lineTo(15 + i, y);
    }
    ctx.stroke();
    _dot(ctx, w - 15, gy - 3, 5, '#ef4444');
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(w - 15, gy - 3, 9, 0, Math.PI * 2); ctx.stroke();
  },

  absolute_value_intro(ctx, w, h) {
    _bg(ctx, w, h);
    const mid = h / 2;
    _axis(ctx, 5, mid, w - 10);
    // V-shape
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(10, mid + 3);
    ctx.lineTo(w/2, mid - 35);
    ctx.lineTo(w - 10, mid + 3);
    ctx.stroke();
    // Corner dot
    _dot(ctx, w/2, mid - 35, 4, '#f59e0b');
    _label(ctx, w/2 + 4, mid - 38, 'corner', '#f59e0b', 7);
    // Compare: parabola (faded)
    ctx.strokeStyle = 'rgba(124,58,237,0.3)'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i <= w - 20; i++) {
      const t = i / (w - 20);
      const y = mid + 3 - 38 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
  },

  combining_functions(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // First arc (green, hits wall)
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const y = gy - 45 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // Wall
    ctx.fillStyle = '#64748b';
    ctx.fillRect(70, gy - 30, 6, 30);
    // Second arc (purple, from wall)
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const y = gy - 25 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(76 + i, y) : ctx.lineTo(76 + i, y);
    }
    ctx.stroke();
    // Target
    _dot(ctx, w - 16, gy - 3, 4, '#f59e0b');
  },

  math_mastery(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Multiple curve types
    // Parabola
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i <= 70; i++) {
      const t = i / 70;
      const y = gy - 45 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // S-curve (cubic)
    const midY = gy - 20;
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let cx = 10; cx <= w - 10; cx++) {
      const xn = (cx - 80) / 50;
      const y = midY - Math.pow(xn, 3) * 15;
      cx === 10 ? ctx.moveTo(cx, y) : ctx.lineTo(cx, y);
    }
    ctx.stroke();
    // Trophy
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('\uD83C\uDFC6', w/2, 16);
  },

  precision_matters(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Two arcs very close together
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= w - 30; i++) {
      const t = i / (w - 30);
      const y = gy - 50 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(15 + i, y) : ctx.lineTo(15 + i, y);
    }
    ctx.stroke();
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath();
    for (let i = 0; i <= w - 30; i++) {
      const t = i / (w - 30);
      const y = gy - 52 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(15 + i, y) : ctx.lineTo(15 + i, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    // Target
    _dot(ctx, w - 15, gy - 3, 5, '#f59e0b');
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(w - 15, gy - 3, 9, 0, Math.PI * 2); ctx.stroke();
    // Labels
    ctx.font = '7px monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = '#22c55e'; ctx.fillText('hit', w - 40, 12);
    ctx.fillStyle = '#ef4444'; ctx.fillText('miss (tiny change)', w - 80, 22);
  },

  strategic_thinking(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15;
    _axis(ctx, 5, gy, w - 10);
    // Structure silhouette
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(60, gy - 40, 20, 40);
    ctx.fillRect(100, gy - 50, 20, 50);
    ctx.fillRect(140, gy - 35, 20, 35);
    // Beam
    ctx.fillStyle = '#334155';
    ctx.fillRect(55, gy - 42, 110, 4);
    // Target on top
    _dot(ctx, 110, gy - 52, 4, '#ef4444');
    // Weak point arrow
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(30, gy - 55); ctx.lineTo(58, gy - 44); ctx.stroke();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(58, gy - 44); ctx.lineTo(52, gy - 48); ctx.lineTo(54, gy - 40); ctx.fill();
    ctx.font = '7px monospace'; ctx.textAlign = 'left';
    ctx.fillText('weak point', 8, gy - 58);
    // Timer
    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
    ctx.fillText('\u23F1', w/2, 12);
  },

  function_transformations(ctx, w, h) {
    _bg(ctx, w, h);
    const gy = h - 15, ax = 20;
    _axis(ctx, 5, gy, w - 10);
    _vaxis(ctx, ax, 5, h - 8);
    // Base y = x² (faded)
    ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const y = gy - 30 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(ax + i, y) : ctx.lineTo(ax + i, y);
    }
    ctx.stroke();
    // Stretched (a)
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const y = gy - 55 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(ax + i, y) : ctx.lineTo(ax + i, y);
    }
    ctx.stroke();
    // Shifted (h, k)
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const y = gy - 10 - 45 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(ax + 25 + i, y) : ctx.lineTo(ax + 25 + i, y);
    }
    ctx.stroke();
    ctx.font = '7px monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8'; ctx.fillText('base', 22, 12);
    ctx.fillStyle = '#f59e0b'; ctx.fillText('stretch (a)', 22, 22);
    ctx.fillStyle = '#7c3aed'; ctx.fillText('shift (h,k)', 22, 32);
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

    this._timer = setTimeout(dismiss, 15000);
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
