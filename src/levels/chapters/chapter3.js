// Chapter 3: SIGN & SHAPE - y = a(x-h)2 + k
// Full vertex form. k is AUTO-DERIVED (k = -a·h2), so arc always starts at launcher.
// Player controls: a (sign matters - negative = arch, positive = bowl) and h.
// worldY = 0.8 + a*(localX-h)2 - a·h2

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'mountain';

export const CHAPTER_3 = [
  // ── 3-1 ──────────────────────────────────────────────────────────────────
  // Introduce sign of a. Wood arch, pig inside at ground level.
  // With any a, arc returns to launch height at localX = 2h → worldX = 2h+1.
  // For pig at x=5.7: h=2.35 hits with any a.
  // Bonus ring at (7.5, 1.5): requires POSITIVE a ≈ 0.06, h ≈ 2.35.
  // Player must discover positive a to reach the ring.
  {
    id: 'ch3-l1', chapter: 3, levelInChapter: 1,
    title: 'Flip Side',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: 0.45, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.20, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 5.7, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'wood_col_l', x: 4.7,  y: 0.8, width: 0.35, height: 1.2,  blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'wood_col_r', x: 6.45, y: 0.8, width: 0.35, height: 1.2,  blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'glass_beam', x: 4.7,  y: 2.0, width: 2.1,  height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 7.5, y: 1.5, radius: 0.3 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: 'negative_a_intro',
    hint: 'Positive a makes a bowl, negative a makes an arch. To reach the bonus ring you need to think differently.',
    theme: THEME,
  },

  // ── 3-2 ──────────────────────────────────────────────────────────────────
  // Narrow channel: static ceiling (bottom y=2.8) + raised floor (top y=1.1).
  // Wood arch sits on the raised floor; pig on glass beam inside the channel.
  // Pig y = glass_beam.top + radius = 1.8+0.2+0.38 = 2.38.
  // Solution: a≈-0.167, h≈3.5. Arc enters channel between floor and ceiling.
  {
    id: 'ch3-l2', chapter: 3, levelInChapter: 2,
    title: 'Narrow Gate',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.05, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.10, h: 5.0, k: 2.5 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.65, y: 2.38, radius: 0.38, pigType: 'helmet', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'floor',      x: 5.5,  y: 0.6,  width: 3.5,  height: 0.5 },
      { id: 'ceil',       x: 5.5,  y: 2.8,  width: 3.5,  height: 0.3 },
      { id: 'wood_col_l', x: 5.8,  y: 1.1,  width: 0.3,  height: 0.5,  blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'wood_col_r', x: 7.2,  y: 1.1,  width: 0.3,  height: 0.5,  blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'glass_beam', x: 5.8,  y: 1.6,  width: 1.7,  height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Thread the arc through the gap - not too steep, not too shallow. Smash the glass beam to drop the pig.',
    theme: THEME,
  },

  // ── 3-3 ──────────────────────────────────────────────────────────────────
  // Short wall near launcher + stone arch at far right. Pig sheltered inside.
  // Pig at (8.4, 0.8): h=3.7 for any a. Wide (shallow) arc clears short wall.
  {
    id: 'ch3-l3', chapter: 3, levelInChapter: 3,
    title: 'Wide Open',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.02, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.25, h: 3.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 8.4, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall',        x: 2.5,  y: 0.8, width: 0.4,  height: 1.5 },
      { id: 'stone_col_l', x: 7.5,  y: 0.8, width: 0.35, height: 1.2, blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_col_r', x: 9.0,  y: 0.8, width: 0.35, height: 1.2, blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_beam',  x: 7.5,  y: 2.0, width: 1.85, height: 0.2, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Short wall, far pig. A wide arc (small |a|) clears the wall and threads the arch.',
    theme: THEME,
  },

  // ── 3-4 ──────────────────────────────────────────────────────────────────
  // Trench: two tall static walls + glass lid spanning the top.
  // Order of ops: arc punches through glass lid → continues to pig inside.
  // Pig at (6.3, 0.8): h=2.65. Arc must clear left wall (need |a|≥0.32).
  // Too-shallow arc clips the left wall; too-steep arc misses pig.
  {
    id: 'ch3-l4', chapter: 3, levelInChapter: 4,
    title: 'In a Trench',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.05, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.15, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.3, y: 0.8, radius: 0.35, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'left',      x: 4.8,  y: 0.8, width: 0.4,  height: 1.8 },
      { id: 'right',     x: 7.8,  y: 0.8, width: 0.4,  height: 1.8 },
      { id: 'glass_lid', x: 4.8,  y: 2.6, width: 3.4,  height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'The trench is sealed with glass. Arc steep enough to clear the left wall, then punch through the lid.',
    theme: THEME,
  },

  // ── 3-5 ──────────────────────────────────────────────────────────────────
  // Two-story arch: stone ground floor + glass upper floor. Pig on glass beam.
  // Pig y = glass_beam.top + radius = 2.25+0.2+0.40 = 2.85.
  // Solution: a≈-0.243, h≈3.5.
  {
    id: 'ch3-l5', chapter: 3, levelInChapter: 5,
    title: 'Tower Defense',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.02, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.25, h: 3.5, k: 3.0625 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.45, y: 2.85, radius: 0.40, pigType: 'letterman', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'stone_col_l', x: 5.8,  y: 0.8,  width: 0.3, height: 0.7,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_col_r', x: 6.8,  y: 0.8,  width: 0.3, height: 0.7,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_beam',  x: 5.8,  y: 1.5,  width: 1.3, height: 0.2,  blockType: 'concrete', hp: 2, supports: ["wood_col_l","wood_col_r"] },
      { id: 'wood_col_l',  x: 5.8,  y: 1.7,  width: 0.3, height: 0.55, blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'wood_col_r',  x: 6.8,  y: 1.7,  width: 0.3, height: 0.55, blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'glass_beam',  x: 5.8,  y: 2.25, width: 1.3, height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: 'negative_a',
    hint: 'Stone base, wood mid, glass top. Clip the glass beam to start the collapse.',
    theme: THEME,
  },

  // ── 3-6 ──────────────────────────────────────────────────────────────────
  // Three-obstacle gauntlet: short wall, hanging wall, mid wall.
  // Stone arch at the far end shelters the pig inside.
  // Bonus ring at (4.5, 3.5) sits between obstacles 1 and 2.
  // Solution: a≈-0.267, h≈4.0 clears all three and hits pig.
  {
    id: 'ch3-l6', chapter: 3, levelInChapter: 6,
    title: 'The Gauntlet',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.20, h: 4.0, k: 0 },
    shotCount: 2,
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 8.5, y: 0.8, radius: 0.42, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'w1',          x: 3.0,  y: 0.8, width: 0.4,  height: 2.5 },
      { id: 'w2',          x: 5.5,  y: 2.5, width: 0.4,  height: 2.0 },
      { id: 'w3',          x: 7.5,  y: 0.8, width: 0.4,  height: 1.5 },
      { id: 'stone_col_l', x: 8.0,  y: 0.8, width: 0.35, height: 1.25, blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_col_r', x: 9.2,  y: 0.8, width: 0.35, height: 1.25, blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_beam',  x: 8.0,  y: 2.05, width: 1.55, height: 0.2, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 3.5, radius: 0.3 },
    starThresholds: [2, 6], starMode: 'bonus',
    revealAfter: null,
    hint: 'Over the first wall, under the hanging wall, over the third wall, into the arch.',
    theme: THEME,
  },

  // ── 3-7 ──────────────────────────────────────────────────────────────────
  // Two pigs - arc must pass through both in one shot.
  // t1 inside glass arch at (5.6, 2.0). t2 inside wood arch at (8.1, 0.8).
  // One-arc solution: a≈-0.104, h≈3.55 hits t1 at y=2.0 and t2 at y=0.8.
  {
    id: 'ch3-l7', chapter: 3, levelInChapter: 7,
    title: 'Two Birds',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.15, h: 4.0, k: 2.4 },
    launcher: LAUNCHER,
    targets: [
      { id: 't1', x: 5.6,  y: 2.0,  radius: 0.42, pigType: 'helmet', hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'g_col_l',  x: 4.9,  y: 0.8, width: 0.3,  height: 1.45, blockType: 'glass', hp: 1, supports: ["g_beam"] },
      { id: 'g_col_r',  x: 6.2,  y: 0.8, width: 0.3,  height: 1.45, blockType: 'glass', hp: 1, supports: ["g_beam"] },
      { id: 'g_beam',   x: 4.9,  y: 2.25, width: 1.6,  height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
      { id: 'w_col_l',  x: 7.4,  y: 0.8, width: 0.35, height: 0.8,  blockType: 'wood',  hp: 2, supports: ["w_beam"] },
      { id: 'w_col_r',  x: 8.7,  y: 0.8, width: 0.35, height: 0.8,  blockType: 'wood',  hp: 2, supports: ["w_beam"] },
      { id: 'w_beam',   x: 7.4,  y: 1.6, width: 1.65, height: 0.2,  blockType: 'wood',  hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Arc through the glass structure to hit the helmet pig on top.',
    theme: THEME,
  },

  // ── 3-8 ──────────────────────────────────────────────────────────────────
  // Whistle pig inside glass arch. Helmet pig inside wood arch.
  // Hit whistle pig first (left arch); then helmet pig (right arch).
  {
    id: 'ch3-l8', chapter: 3, levelInChapter: 8,
    title: 'Whistle Pig',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.20, h: 4.5, k: 0 },
    launcher: LAUNCHER,
    targets: [
      { id: 'whistle', x: 6.5, y: 0.8, radius: 0.45, pigType: 'whistle', hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'g_col_l',  x: 5.8,  y: 0.8, width: 0.3,  height: 1.0,  blockType: 'glass', hp: 1, supports: ["g_beam"] },
      { id: 'g_col_r',  x: 7.0,  y: 0.8, width: 0.3,  height: 1.0,  blockType: 'glass', hp: 1, supports: ["g_beam"] },
      { id: 'g_beam',   x: 5.8,  y: 1.8, width: 1.5,  height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
      { id: 'w_col_l',  x: 7.8,  y: 0.8, width: 0.3,  height: 0.8,  blockType: 'wood',  hp: 2, supports: ["w_beam"] },
      { id: 'w_col_r',  x: 9.0,  y: 0.8, width: 0.3,  height: 0.8,  blockType: 'wood',  hp: 2, supports: ["w_beam"] },
      { id: 'w_beam',   x: 7.8,  y: 1.6, width: 1.5,  height: 0.2,  blockType: 'wood',  hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Hit the Whistle Pig to trigger its special ability.',
    theme: THEME,
  },

  // ── 3-9 ──────────────────────────────────────────────────────────────────
  // Static wall + wood gate arch. Moving pig patrols through gate at y=1.5.
  // Set h, find a that clears wall AND reaches pig height, then time the shot.
  {
    id: 'ch3-l9', chapter: 3, levelInChapter: 9,
    title: 'Speed and Precision',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.05 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.18, h: 4.0, k: 2.88 },
    launcher: LAUNCHER,
    targets: [{
      id: 'cool', x: 7.0, y: 1.5, radius: 0.38, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 6.0, max: 8.5, speed: 1.5 },
    }],
    obstacles: [
      { id: 'wall',       x: 4.0,  y: 0.8, width: 0.4,  height: 2.0 },
      { id: 'gate_col_l', x: 6.2,  y: 0.8, width: 0.3,  height: 1.8, blockType: 'wood', hp: 2, supports: ["gate_beam"] },
      { id: 'gate_col_r', x: 8.2,  y: 0.8, width: 0.3,  height: 1.8, blockType: 'wood', hp: 2, supports: ["gate_beam"] },
      { id: 'gate_beam',  x: 6.2,  y: 2.6, width: 2.3,  height: 0.2, blockType: 'wood', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Wall blocks the approach. Set h past the wall and find the right a, then time the shot.',
    theme: THEME,
  },

  // ── 3-10 ─────────────────────────────────────────────────────────────────
  // King Pig (3HP) on glass beam atop a stone+wood arch. Static wall in approach.
  // Order of ops: arc over wall → clip glass beam → king falls → hit king 3 times.
  // King pig y = glass_beam.top + king_radius = 2.5+0.55 = 3.05.
  // Bonus ring + king pig: a≈-0.212, h≈4.0.
  {
    id: 'ch3-l10', chapter: 3, levelInChapter: 10,
    title: 'King Pig',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.05 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.14, h: 4.5, k: 2.835 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 7.325, y: 3.05, radius: 0.55, pigType: 'king', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'wall',        x: 3.5,  y: 0.8,  width: 0.4,  height: 2.0 },
      { id: 'stone_col_l', x: 6.3,  y: 0.8,  width: 0.35, height: 0.8,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_col_r', x: 8.0,  y: 0.8,  width: 0.35, height: 0.8,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_beam',  x: 6.3,  y: 1.6,  width: 2.05, height: 0.2,  blockType: 'concrete', hp: 2, supports: ["wood_col_l","wood_col_r"] },
      { id: 'wood_col_l',  x: 6.3,  y: 1.8,  width: 0.35, height: 0.5,  blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'wood_col_r',  x: 8.0,  y: 1.8,  width: 0.35, height: 0.5,  blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'glass_beam',  x: 6.3,  y: 2.3,  width: 2.05, height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 5.0, y: 4.2, radius: 0.3 },
    starThresholds: [4, 8], starMode: 'bonus',
    revealAfter: null,
    hint: 'King Pig takes 2 hits. Break the glass beam to drop him, then adjust your arc to finish him.',
    theme: THEME,
  },
];
