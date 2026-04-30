// Chapter 5: STANDARD FORM — y = ax² + bx + c
// All three coefficients. c = y-intercept (arc height at launch). b = launch slope.
// Launcher at (1, 0.8). Arc in local coords: y_local = a*x² + b*x + c.
// c=0 means arc starts at launcher height. Non-zero c shifts the start.

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'space';

export const CHAPTER_5 = [
  // ── 5-1 ──────────────────────────────────────────────────────────────────
  // Full castle (Archetype F). Glass window to shoot through.
  // Left wall stone: x=6.0, h=2.4. Right wall stone: x=8.4, h=2.4.
  // Glass window (narrow gap): implied — pig inside at ground, ceiling glass.
  // Ceiling glass: x=6.35, y=3.0, w=2.45, h=0.25.
  // Pig: x=7.2, y=0.8, letterman hp=2.
  {
    id: 'ch5-l1', chapter: 5, levelInChapter: 1,
    title: 'Full Control',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      c: { min: -1.00, max:  1.00, step: 0.05 },
    },
    defaultParams: { a: -0.10, b: 1.0, c: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.2, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall_l',  x: 6.0,  y: 0.6, width: 0.35, height: 2.45, blockType: 'stone', hp: 3, supports: ['ceiling'] },
      { id: 'wall_r',  x: 8.4,  y: 0.6, width: 0.35, height: 2.45, blockType: 'stone', hp: 3, supports: ['ceiling'] },
      { id: 'ceiling', x: 6.35, y: 3.05, width: 2.45, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 8], starMode: 'moves',
    revealAfter: 'standard_form',
    hint: 'Standard form — b controls angle, c shifts launch height. Destroy the glass ceiling to reach the pig.',
    theme: THEME,
  },

  // ── 5-2 ──────────────────────────────────────────────────────────────────
  // c locked at 0. Pig on simple glass shelf (Archetype A).
  // Two wood pillars + glass shelf. Pig y = 1.3+0.25+0.45 = 2.0.
  {
    id: 'ch5-l2', chapter: 5, levelInChapter: 2,
    title: 'Zero Launch',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'k'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.10, b: 1.2, c: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.5, y: 2.0, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'pillar_l', x: 5.7,  y: 0.6, width: 0.35, height: 0.7, blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'pillar_r', x: 7.1,  y: 0.6, width: 0.35, height: 0.7, blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'shelf',    x: 5.7,  y: 1.3, width: 1.8,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'c=0 locked — arc starts at launch height. Hit a pillar to drop the shelf.',
    theme: THEME,
  },

  // ── 5-3 ──────────────────────────────────────────────────────────────────
  // Two-layer pyramid + stone inner wall (Archetype G + C).
  // Pyramid: stone base x=5.8 w=2.2 h=0.5, wood mid x=6.15 w=1.5 h=0.4, glass top x=6.4 w=1.0 h=0.25.
  // Stone inner wall: x=5.6 y=0.6 w=0.4 h=1.5 (blocks left approach).
  // Pig behind inner wall inside pyramid at x=7.0, y=0.8.
  {
    id: 'ch5-l3', chapter: 5, levelInChapter: 3,
    title: 'Pyramid Fortress',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      c: { min: -1.00, max:  1.00, step: 0.05 },
    },
    defaultParams: { a: -0.12, b: 1.5, c: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.0, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'pyr_base',  x: 5.8,  y: 0.6, width: 2.2,  height: 0.5,  blockType: 'stone', hp: 3, supports: ['pyr_mid'] },
      { id: 'pyr_mid',   x: 6.15, y: 1.1, width: 1.5,  height: 0.4,  blockType: 'wood',  hp: 2, supports: ['pyr_top'] },
      { id: 'pyr_top',   x: 6.4,  y: 1.5, width: 1.0,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'inner_wall', x: 5.4, y: 0.6, width: 0.35, height: 1.5,  blockType: 'stone', hp: 3, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 8], starMode: 'moves',
    revealAfter: null,
    hint: 'Stone inner wall blocks the low approach. Arc over it, then down through the pyramid to reach the pig.',
    theme: THEME,
  },

  // ── 5-4 ──────────────────────────────────────────────────────────────────
  // Pig on shelf (A), bonus ring on other side of static wall (Archetype A + J).
  // Static wall at x=5.0 h=2.0. Shelf at x=7.0.
  // Pig y = 1.3+0.25+0.45 = 2.0. Bonus ring at x=3.5 (between launcher and wall).
  {
    id: 'ch5-l4', chapter: 5, levelInChapter: 4,
    title: 'Ring Heist',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c', 'k'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      c: { min: -1.00, max:  1.00, step: 0.05 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.15, b: 1.0, c: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.7, y: 2.0, radius: 0.40, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'wall',     x: 5.0,  y: 0.6, width: 0.4,  height: 2.0 },
      { id: 'pillar_l', x: 6.9,  y: 0.6, width: 0.35, height: 0.7, blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'pillar_r', x: 8.3,  y: 0.6, width: 0.35, height: 0.7, blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'shelf',    x: 6.9,  y: 1.3, width: 1.8,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 3.5, y: 2.8, radius: 0.28 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: 'vertex_to_factored',
    hint: 'Bonus ring is before the wall, pig is behind it. Tune b and c to thread both.',
    theme: THEME,
  },

  // ── 5-5 ──────────────────────────────────────────────────────────────────
  // King pig in stone fortress protected by two static walls (Archetype F + static walls).
  // Static outer walls at x=3.5 and x=5.5 (the moat).
  // Stone fortress: walls x=6.5 & x=8.7, wood inner walls x=7.0 & x=8.2, glass ceiling.
  // King pig: x=7.6, y=0.8, hp=3.
  {
    id: 'ch5-l5', chapter: 5, levelInChapter: 5,
    title: 'High B',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  1.00, max:  5.00, step: 0.10 },
      c: { min: -1.50, max:  1.50, step: 0.05 },
    },
    defaultParams: { a: -0.08, b: 2.5, c: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 7.6, y: 0.8, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'outer_l_s', x: 3.5,  y: 0.6, width: 0.4, height: 3.0 },
      { id: 'outer_r_s', x: 5.5,  y: 0.6, width: 0.4, height: 3.0 },
      { id: 'fort_wl',   x: 6.5,  y: 0.6, width: 0.35, height: 2.6, blockType: 'stone', hp: 3, supports: ['fort_ceil'] },
      { id: 'fort_il',   x: 7.0,  y: 0.6, width: 0.3,  height: 2.2, blockType: 'wood',  hp: 2, supports: ['fort_ceil'] },
      { id: 'fort_ir',   x: 8.2,  y: 0.6, width: 0.3,  height: 2.2, blockType: 'wood',  hp: 2, supports: ['fort_ceil'] },
      { id: 'fort_wr',   x: 8.7,  y: 0.6, width: 0.35, height: 2.6, blockType: 'stone', hp: 3, supports: ['fort_ceil'] },
      { id: 'fort_ceil', x: 7.0,  y: 2.8, width: 1.55, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 8], starMode: 'moves',
    revealAfter: null,
    hint: 'High b to clear both outer walls. Break the inner ceiling then hit the king 3 times.',
    theme: THEME,
  },

  // ── 5-6 ──────────────────────────────────────────────────────────────────
  // Inverted structure: pig under overhanging blocks (Archetype I complex).
  // Two stone pillars at sides holding a glass+wood double-layer ceiling above pig.
  // Pig underneath at ground level. Must hit ceiling to collapse it onto pig.
  // Pillar L: x=6.0, y=0.6, h=2.0 (stone). Pillar R: x=8.4, h=2.0 (stone).
  // Wood ceiling: x=6.35, y=2.6, w=2.45, h=0.3 (wood).
  // Glass top: x=6.35, y=2.9, w=2.45, h=0.25 (glass).
  // Pig: x=7.2, y=0.8.
  {
    id: 'ch5-l6', chapter: 5, levelInChapter: 6,
    title: 'Cave Pig',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      c: { min: -1.00, max:  1.00, step: 0.05 },
    },
    defaultParams: { a: -0.12, b: 1.2, c: 0.5 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.2, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'slab_glass', x: 6.35, y: 2.9,  width: 2.45, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'slab_wood',  x: 6.35, y: 2.6,  width: 2.45, height: 0.3,  blockType: 'wood',  hp: 2, supports: ["slab_glass"] },
      { id: 'pillar_l',   x: 6.0,  y: 0.6,  width: 0.35, height: 2.0,  blockType: 'stone', hp: 3, supports: ['slab_wood'] },
      { id: 'pillar_r',   x: 8.4,  y: 0.6,  width: 0.35, height: 2.0,  blockType: 'stone', hp: 3, supports: ['slab_wood'] },
    ],
    bonusRing: { x: 3.5, y: 2.8, radius: 0.28 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Pig is sheltered below. Hit the glass top — the ceiling collapses onto it.',
    theme: THEME,
  },

  // ── 5-7 ──────────────────────────────────────────────────────────────────
  // Moving pig in open courtyard between two glass towers (Archetype E + moving).
  // Left tower: pillars x=4.5 & 5.4, shelf y=1.6 (glass). Right tower: pillars x=7.8 & 8.7, shelf y=1.6 (glass).
  // Moving pig at y=0.8 sweeps between towers.
  {
    id: 'ch5-l7', chapter: 5, levelInChapter: 7,
    title: 'Tower Run',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      c: { min: -1.00, max:  1.00, step: 0.05 },
    },
    defaultParams: { a: -0.10, b: 1.5, c: 0 },
    launcher: LAUNCHER,
    targets: [{
      id: 'cool', x: 6.5, y: 0.8, radius: 0.42, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.6, max: 7.6, speed: 1.2 },
    }],
    obstacles: [
      { id: 'tl_pll', x: 4.5, y: 0.6, width: 0.3, height: 1.0, blockType: 'glass', hp: 1, supports: ['tl_shelf'] },
      { id: 'tl_plr', x: 5.4, y: 0.6, width: 0.3, height: 1.0, blockType: 'glass', hp: 1, supports: ['tl_shelf'] },
      { id: 'tl_shelf', x: 4.5, y: 1.6, width: 1.2, height: 0.25, blockType: 'wood', hp: 2, supports: [] },
      { id: 'tr_pll', x: 7.8, y: 0.6, width: 0.3, height: 1.0, blockType: 'glass', hp: 1, supports: ['tr_shelf'] },
      { id: 'tr_plr', x: 8.7, y: 0.6, width: 0.3, height: 1.0, blockType: 'glass', hp: 1, supports: ['tr_shelf'] },
      { id: 'tr_shelf', x: 7.8, y: 1.6, width: 1.2, height: 0.25, blockType: 'wood', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [1, 4], starMode: 'moves',
    revealAfter: null,
    hint: 'Pig patrols between two towers. Time the arc to catch it in the gap.',
    theme: THEME,
  },

  // ── 5-8 ──────────────────────────────────────────────────────────────────
  // Three-structure obstacle course: single block (B) + wall (C) + shelf (A).
  // B tower: x=3.5 stone base h=0.5, wood h=0.4, glass top h=0.25.
  // C wall: static at x=5.8, h=2.0.
  // A shelf: pillars x=7.5 & 8.7, shelf y=1.3. Pig on shelf.
  {
    id: 'ch5-l8', chapter: 5, levelInChapter: 8,
    title: 'Obstacle Course',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c', 'k'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      c: { min: -1.00, max:  1.00, step: 0.05 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.14, b: 1.5, c: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 8.1, y: 2.0, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'course_shelf' }],
    obstacles: [
      { id: 'b_base',  x: 3.2,  y: 0.6, width: 0.5,  height: 0.5,  blockType: 'stone', hp: 3, supports: ['b_mid'] },
      { id: 'b_mid',   x: 3.2,  y: 1.1, width: 0.5,  height: 0.4,  blockType: 'wood',  hp: 2, supports: ['b_top'] },
      { id: 'b_top',   x: 3.2,  y: 1.5, width: 0.5,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'c_wall',  x: 5.8,  y: 0.6, width: 0.4,  height: 2.0 },
      { id: 'course_pll', x: 7.5, y: 0.6, width: 0.3, height: 0.7, blockType: 'wood', hp: 2, supports: ['course_shelf'] },
      { id: 'course_plr', x: 8.7, y: 0.6, width: 0.3, height: 0.7, blockType: 'wood', hp: 2, supports: ['course_shelf'] },
      { id: 'course_shelf', x: 7.5, y: 1.3, width: 1.5, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Three structures in the way. Tune b (angle) and c (height) to thread the arc through.',
    theme: THEME,
  },

  // ── 5-9 ──────────────────────────────────────────────────────────────────
  // Two pigs: one in glass box, one on a tower (F partial + B).
  // Glass box: x=4.0 walls + glass top. Pig1 inside at x=4.6.
  // Tower: stone base x=7.5, wood mid, glass top. Pig2 on top y=2.55.
  {
    id: 'ch5-l9', chapter: 5, levelInChapter: 9,
    title: 'Box and Tower',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.50, max:  4.00, step: 0.05 },
      c: { min: -2.00, max:  2.00, step: 0.05 },
    },
    defaultParams: { a: -0.12, b: 2.0, c: -0.5 },
    launcher: LAUNCHER,
    targets: [
      { id: 't1', x: 4.6,  y: 0.8,  radius: 0.40, pigType: 'helmet', hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'box_l',   x: 4.0,  y: 0.6, width: 0.35, height: 1.4, blockType: 'glass', hp: 1, supports: ['box_top'] },
      { id: 'box_r',   x: 5.2,  y: 0.6, width: 0.35, height: 1.4, blockType: 'glass', hp: 1, supports: ['box_top'] },
      { id: 'box_top', x: 4.0,  y: 2.0, width: 1.55, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'twr_base', x: 7.5, y: 0.6, width: 0.5,  height: 0.8, blockType: 'stone', hp: 3, supports: ['twr_mid'] },
      { id: 'twr_mid',  x: 7.5, y: 1.4, width: 0.5,  height: 0.6, blockType: 'wood',  hp: 2, supports: ['twr_top'] },
      { id: 'twr_top',  x: 7.5, y: 2.0, width: 0.5,  height: 0.3, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Two targets — one in a glass box, one on top of a tower. One arc to hit both.',
    theme: THEME,
  },

  // ── 5-10 ─────────────────────────────────────────────────────────────────
  // Grand standard: King pig in stone fortress + glass roof + bonus ring.
  // Two static outer walls. Fortress: stone side walls, glass roof. King inside.
  {
    id: 'ch5-l10', chapter: 5, levelInChapter: 10,
    title: 'Grand Standard',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  4.00, step: 0.05 },
      c: { min: -2.00, max:  2.00, step: 0.05 },
    },
    defaultParams: { a: -0.10, b: 1.8, c: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 7.7, y: 0.8, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'moat_l',  x: 3.5,  y: 0.6, width: 0.4,  height: 2.5 },
      { id: 'moat_r',  x: 5.5,  y: 0.6, width: 0.4,  height: 2.5 },
      { id: 'fort_l',  x: 6.8,  y: 0.6, width: 0.4,  height: 2.8, blockType: 'stone', hp: 3, supports: ['grand_roof'] },
      { id: 'fort_r',  x: 8.6,  y: 0.6, width: 0.4,  height: 2.8, blockType: 'stone', hp: 3, supports: ['grand_roof'] },
      { id: 'grand_roof', x: 6.8, y: 3.4, width: 2.2, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 4.2, radius: 0.25 },
    starThresholds: [3, 8], starMode: 'bonus',
    revealAfter: null,
    hint: 'King Pig, two moat walls, stone fortress. Bonus ring at the peak. All three coefficients needed.',
    theme: THEME,
  },
];
