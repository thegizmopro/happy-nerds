// Chapter intro screens — shown once when player first enters each chapter.
// Each has a title, concept explanation, and a mini-canvas drawing function.

export const CHAPTER_INTROS = {
  1: {
    chapter: 1,
    title: 'Chapter 1: The Stretch',
    subtitle: 'y = ax²',
    body: [
      'A <b>function</b> is a rule: put a number in, get a number out.',
      '',
      'y = ax² is one of the simplest functions. The number <b>a</b> stretches or squishes the curve.',
      '',
      'Your job: adjust <b>a</b> until the arc hits the target.',
      'Watch how the curve changes — that\'s what a function looks like in motion.',
    ].join('\n'),
    vocab: ['function', 'parabola', 'coefficient'],
  },
  2: {
    chapter: 2,
    title: 'Chapter 2: The Shift',
    subtitle: 'y = a(x − h)² + k',
    body: [
      'What if the peak isn\'t where you need it?',
      '',
      '<b>Vertex form</b> lets you move the parabola around:',
      '• <b>h</b> shifts the peak left or right',
      '• <b>k</b> shifts it up or down',
      '',
      'The vertex (peak) of the parabola is always at <b>(h, k)</b>.',
      'Move h and k to aim your arc precisely.',
    ].join('\n'),
    vocab: ['vertex', 'horizontal shift', 'vertical shift'],
  },
  3: {
    chapter: 3,
    title: 'Chapter 3: Sign & Shape',
    subtitle: 'Which way does it open?',
    body: [
      'The <b>sign of a</b> changes everything:',
      '',
      '• <b>a > 0</b>: parabola opens UP (smile ☺)',
      '• <b>a < 0</b>: parabola opens DOWN (frown ☹)',
      '',
      'Why does it matter? Projectile motion — throwing a ball — always creates a downward-opening parabola.',
      'Satellite dishes, suspension bridges, headlights — all use upward-opening ones.',
      '',
      'Same math, different shapes.',
    ].join('\n'),
    vocab: ['concavity', 'projectile motion', 'orientation'],
  },
  4: {
    chapter: 4,
    title: 'Chapter 4: Roots',
    subtitle: 'y = a(x − r₁)(x − r₂)',
    body: [
      'The <b>roots</b> are where the parabola crosses zero.',
      'In the game, they\'re where your arc hits the ground.',
      '',
      'Factored form puts those landing points front and center:',
      '• Set <b>r₁</b> = where the arc starts',
      '• Set <b>r₂</b> = where you want it to land',
      '',
      'If you can think in terms of "start here, land there," you already understand factored form.',
    ].join('\n'),
    vocab: ['roots', 'zeros', 'x-intercepts', 'factored form'],
  },
  5: {
    chapter: 5,
    title: 'Chapter 5: Standard Form',
    subtitle: 'y = ax² + bx + c',
    body: [
      'Three forms, same parabola:',
      '',
      '• <b>Vertex form</b> → tells you the peak',
      '• <b>Factored form</b> → tells you the landing points',
      '• <b>Standard form</b> → tells you the y-intercept (where x = 0)',
      '',
      'The <b>b</b> coefficient tilts the parabola — it controls the slope at launch.',
      'The <b>c</b> coefficient sets the starting height.',
      '',
      'All three forms are equivalent. Converting between them is just algebra.',
    ].join('\n'),
    vocab: ['standard form', 'y-intercept', 'completing the square'],
  },
  6: {
    chapter: 6,
    title: 'Chapter 6: Multi-Shot',
    subtitle: 'Multiple equations, one problem',
    body: [
      'Some problems need more than one try.',
      '',
      'In multi-shot levels, you launch multiple projectiles — each with its own equation.',
      'Use your first shot to clear the path, your second to hit the target.',
      '',
      'This is how real engineers work: break a big problem into smaller equations.',
      'Each shot is one equation in a <b>system</b>.',
    ].join('\n'),
    vocab: ['system of equations', 'strategic planning', 'multi-step problems'],
  },
  7: {
    chapter: 7,
    title: 'Chapter 7: Beyond Parabolas',
    subtitle: 'Cubic, absolute value, piecewise',
    body: [
      'Not every path is a parabola.',
      '',
      '<b>Cubic functions</b> (y = x³) make S-curves that wrap around obstacles.',
      '<b>Absolute value</b> (y = |x|) makes V-shapes — sharp turns.',
      '<b>Piecewise functions</b> stitch different rules together.',
      '',
      'Each one opens up new paths that parabolas can\'t reach.',
      'The math gets wilder — and so do the shots.',
    ].join('\n'),
    vocab: ['cubic function', 'absolute value', 'piecewise', 'inflection point'],
  },
  8: {
    chapter: 8,
    title: 'Chapter 8: The Final Exam',
    subtitle: 'Everything you\'ve learned — timed!',
    body: [
      'This is it. Boss levels combining every concept from the course.',
      '',
      'You\'ll use stretch, shift, roots, standard form, and multi-shot — all under time pressure.',
      '',
      'The structures are tougher. The targets are better protected.',
      'But you\'ve got the math.',
      '',
      'Good luck, nerd. 🎓',
    ].join('\n'),
    vocab: ['review', 'timed problem', 'mastery'],
  },
};

// Mini-canvas draw functions for chapter intros
export const INTRO_DRAW = {
  1(ctx, w, h) {
    // Show three parabolas with different a values
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);
    const gy = h - 15;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(5, gy); ctx.lineTo(w - 5, gy); ctx.stroke();

    const range = w - 20;
    // steep a
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= range; i++) {
      const t = i / range;
      const y = gy - 60 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // medium a
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= range; i++) {
      const t = i / range;
      const y = gy - 38 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // gentle a
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= range; i++) {
      const t = i / range;
      const y = gy - 20 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#f59e0b'; ctx.font = '9px monospace'; ctx.textAlign = 'left';
    ctx.fillText('a = −0.5', 10, 12);
    ctx.fillStyle = '#7c3aed'; ctx.fillText('a = −0.2', 10, 24);
    ctx.fillStyle = '#22c55e'; ctx.fillText('a = −0.05', 10, 36);
  },

  2(ctx, w, h) {
    // Show parabola shifting with h and k
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);
    const gy = h - 15;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(5, gy); ctx.lineTo(w - 5, gy); ctx.stroke();

    // Original
    ctx.strokeStyle = 'rgba(124,58,237,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i <= w - 20; i++) {
      const t = i / (w - 20);
      const y = gy - 50 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // Shifted
    const shiftX = 40, shiftY = 20;
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= w - 20; i++) {
      const t = i / (w - 20);
      const y = gy - shiftY - 50 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + shiftX + i, y) : ctx.lineTo(10 + shiftX + i, y);
    }
    ctx.stroke();
    // Arrow from old to new vertex
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(10 + (w-20)/2, gy - 50); ctx.lineTo(10 + shiftX + (w-20)/2, gy - shiftY - 50); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b'; ctx.font = '9px monospace'; ctx.textAlign = 'left';
    ctx.fillText('(h, k)', 10 + shiftX + (w-20)/2 + 4, gy - shiftY - 50 - 4);
  },

  3(ctx, w, h) {
    // Up vs down parabola
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);
    const mid = w / 2;
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mid, 5); ctx.lineTo(mid, h - 5); ctx.stroke();

    // Left: a > 0 (U-shape)
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= mid - 18; i++) {
      const t = i / (mid - 18);
      const y = 14 + 62 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // Right: a < 0 (∩-shape)
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= mid - 18; i++) {
      const t = i / (mid - 18);
      const y = h - 18 - 62 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(mid + 8 + i, y) : ctx.lineTo(mid + 8 + i, y);
    }
    ctx.stroke();

    ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillStyle = '#22c55e'; ctx.fillText('a > 0', mid / 2, h - 4);
    ctx.fillStyle = '#f87171'; ctx.fillText('a < 0', mid + mid / 2, h - 4);
  },

  4(ctx, w, h) {
    // Parabola with roots marked
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);
    const gy = h - 17;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(5, gy); ctx.lineTo(w - 5, gy); ctx.stroke();

    const r1x = 25, r2x = w - 25, range = r2x - r1x;
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= range; i++) {
      const t = i / range;
      const y = gy - 55 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(r1x + i, y) : ctx.lineTo(r1x + i, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.arc(r1x, gy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r2x, gy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('r\u2081', r1x, gy + 12);
    ctx.fillText('r\u2082', r2x, gy + 12);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('y = 0', w / 2, gy + 12);
  },

  5(ctx, w, h) {
    // Standard form with y-intercept highlighted
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);
    const gy = h - 15, ax = 25;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(5, gy); ctx.lineTo(w - 5, gy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax, 5); ctx.lineTo(ax, h - 8); ctx.stroke();

    const startY = gy - 30;
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax, startY);
    ctx.quadraticCurveTo(90, 5, w - 15, gy);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(ax, startY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.font = '9px monospace'; ctx.textAlign = 'left';
    ctx.fillText('c (y-intercept)', ax + 6, startY - 2);
    ctx.fillStyle = '#facc15';
    ctx.fillText('b (tilt)', ax + 50, gy - 8);
  },

  6(ctx, w, h) {
    // Two arcs hitting different targets
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);
    const gy = h - 15;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(5, gy); ctx.lineTo(w - 5, gy); ctx.stroke();

    // First shot
    const s1End = Math.round(w * 0.44);
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= s1End; i++) {
      const t = i / s1End;
      const y = gy - 44 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();
    // Second shot
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= w - 22; i++) {
      const t = i / (w - 22);
      const y = gy - 28 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(10 + i, y) : ctx.lineTo(10 + i, y);
    }
    ctx.stroke();

    // Targets
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(10 + s1End, gy - 3, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(w - 15, gy - 3, 4, 0, Math.PI * 2); ctx.fill();
    ctx.font = '8px monospace'; ctx.textAlign = 'left';
    ctx.fillText('shot 1', 14, 12);
    ctx.fillText('shot 2', 14, 24);
  },

  7(ctx, w, h) {
    // S-curve (cubic)
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);
    const midY = h / 2;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(5, midY); ctx.lineTo(w - 5, midY); ctx.stroke();

    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath();
    for (let cx = 10; cx <= w - 10; cx++) {
      const xn = (cx - w / 2) / (w / 2 - 10);
      const y = midY - Math.pow(xn, 3) * (h / 2 - 10);
      cx === 10 ? ctx.moveTo(cx, y) : ctx.lineTo(cx, y);
    }
    ctx.stroke();

    // V-shape (abs value)
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1.5; ctx.beginPath();
    ctx.moveTo(10, midY + 5);
    ctx.lineTo(w / 2, midY - 25);
    ctx.lineTo(w - 10, midY + 5);
    ctx.stroke();

    ctx.font = '8px monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = '#22c55e'; ctx.fillText('y = x\u00B3', 12, 14);
    ctx.fillStyle = '#f87171'; ctx.fillText('y = |x|', 12, 26);
  },

  8(ctx, w, h) {
    // Boss level: complex layered structure silhouette
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);
    const gy = h - 10;

    // Tower silhouette
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(30, gy - 60, 30, 60);
    ctx.fillRect(80, gy - 45, 25, 45);
    ctx.fillRect(130, gy - 55, 30, 55);

    // Parabola arcs
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 70; i++) {
      const t = i / 70;
      const y = gy - 70 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(5 + i, y) : ctx.lineTo(5 + i, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath();
    for (let i = 0; i <= 90; i++) {
      const t = i / 90;
      const y = gy - 40 * 4 * t * (1 - t);
      i === 0 ? ctx.moveTo(5 + i, y) : ctx.lineTo(5 + i, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
    ctx.fillText('\u23F1', w / 2, 16);
  },
};
