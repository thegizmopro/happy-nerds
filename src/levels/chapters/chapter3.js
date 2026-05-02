// Chapter 3: SIGN & SHAPE - y = a(x-h)2 + k
// Full vertex form. k is AUTO-DERIVED (k = -a·h2), so arc always starts at launcher.
// Player controls: a (sign matters - negative = arch, positive = bowl) and h.
// worldY = 0.8 + a*(localX-h)2 - a·h2
//
// Design: Sign of a opens up new strategies. Positive a for targets above.
// Cascade chains, enclosed chambers, multi-story structures.
// Kill vectors: direct hit, fall (destroy support), crush (cascade).

const LAUNCHER = { x: 1, y: 0.2 };
const THEME = 'mountain';

export const CHAPTER_3 = [
  // ── 3-1 ──────────────────────────────────────────────────────────────────
  // Introduce sign of a. Glass arch, pig inside at ground level.
  // Negative a hits pig through glass. Positive a (bowl) can reach bonus ring above.
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
    targets: [{ id: 'pig', x: 5.7, y: 0.2, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'wood_col_l', x: 4.7, y: 0.2, width: 0.35, height: 1.2, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'wood_col_r', x: 6.45, y: 0.2, width: 0.35, height: 1.2, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'glass_beam', x: 4.7, y: 1.4, width: 2.1, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 7.5, y: 0.9, radius: 0.3 },
        bonusShots: 1,
    starThresholds: [1, 2], starMode: 'bonus',
    revealAfter: 'negative_a_intro',
    hint: 'Positive a makes a bowl, negative a makes an arch. To reach the bonus ring you need to think differently.',
    theme: THEME,
  },

  // ── 3-2 ──────────────────────────────────────────────────────────────────
  // Enclosed chamber: stone left, concrete right, glass ceiling.
  // Target inside at ground level. Arc through glass ceiling for direct hit.
  // Kill vectors: (1) through glass ceiling → direct, (2) break concrete wall → ceiling collapses → crush
  {
    id: 'ch3-l2', chapter: 3, levelInChapter: 2,
    title: 'Enclosed',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.05, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.10, h: 5.0, k: 2.5 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.0, y: 0.2, radius: 0.42, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone_left',     x: 5.8, y: 0.2, width: 0.4, height: 2.4, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'concrete_right', x: 8.0, y: 0.2, width: 0.4, height: 2.4, blockType: 'concrete', hp: 2, supports: ['ceiling'] },
      { id: 'ceiling',        x: 5.8, y: 2.6, width: 2.6, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: null,
    hint: 'Arc through the glass ceiling, or break the concrete wall to collapse everything onto the pig.',
    theme: THEME,
  },

  // ── 3-3 ──────────────────────────────────────────────────────────────────
  // Stone wall + glass lane combo. Target behind both.
  // Arc must clear stone wall (indestructible) and pass through glass.
  {
    id: 'ch3-l3', chapter: 3, levelInChapter: 3,
    title: 'Double Barrier',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.02, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.25, h: 3.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 8.4, y: 0.2, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone_wall',  x: 3.5, y: 0.2, width: 0.4, height: 1.5, blockType: 'stone', hp: 3, supports: [] },
      { id: 'glass_lane', x: 5.5, y: 0.2, width: 0.35, height: 1.2, blockType: 'glass', hp: 1, supports: [] },
      { id: 'concrete_pillar', x: 7.5, y: 0.2, width: 0.35, height: 1.2, blockType: 'concrete', hp: 2, supports: ['concrete_beam'] },
      { id: 'concrete_beam', x: 7.5, y: 1.4, width: 1.85, height: 0.2, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: null,
    hint: 'Stone wall blocks, glass lane shatters. Arc over the stone, through the glass, to reach the far target.',
    theme: THEME,
  },

  // ── 3-4 ──────────────────────────────────────────────────────────────────
  // Trench sealed with glass lid. Arc breaks through glass to reach pig inside.
  // Kill vectors: (1) through glass lid → direct hit, (2) glass shatters and falls onto target
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
    targets: [{ id: 'pig', x: 6.3, y: 0.2, radius: 0.35, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'left',      x: 4.8, y: 0.2, width: 0.4, height: 1.8 },
      { id: 'right',     x: 7.8, y: 0.2, width: 0.4, height: 1.8 },
      { id: 'glass_lid', x: 4.8, y: 2, width: 3.4, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: null,
    hint: 'The trench is sealed with glass. Arc steep enough to clear the left wall, then punch through the lid.',
    theme: THEME,
  },

  // ── 3-5 ──────────────────────────────────────────────────────────────────
  // Two-story: concrete base + glass top. Pig on glass beam.
  // Kill vectors: (1) clip glass beam → pig falls, (2) hit concrete base → cascade
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
    targets: [{ id: 'pig', x: 6.45, y: 2.25, radius: 0.40, pigType: 'letterman', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'stone_col_l', x: 5.8, y: 0.2, width: 0.3, height: 0.7, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_col_r', x: 6.8, y: 0.2, width: 0.3, height: 0.7, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_beam',  x: 5.8, y: 0.9, width: 1.3, height: 0.2, blockType: 'concrete', hp: 2, supports: ['wood_col_l', 'wood_col_r'] },
      { id: 'wood_col_l',  x: 5.8, y: 1.1, width: 0.3, height: 0.55, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'wood_col_r',  x: 6.8, y: 1.1, width: 0.3, height: 0.55, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'glass_beam',  x: 5.8, y: 1.65, width: 1.3, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: 'negative_a',
    hint: 'Stone base, wood mid, glass top. Clip the glass beam to start the cascade.',
    theme: THEME,
  },

  // ── 3-6 ──────────────────────────────────────────────────────────────────
  // Three-wall gauntlet: short wall, hanging wall, mid wall. Pig inside concrete arch at end.
  // Must thread between obstacles to reach the arch.
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
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 8.5, y: 0.2, radius: 0.42, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'w1',          x: 3.0, y: 0.2, width: 0.4, height: 2.5 },
      { id: 'w2',          x: 5.5, y: 1.9, width: 0.4, height: 2.0 },
      { id: 'w3',          x: 7.5, y: 0.2, width: 0.4, height: 1.5 },
      { id: 'stone_col_l', x: 8.0, y: 0.2, width: 0.35, height: 1.25, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_col_r', x: 9.2, y: 0.2, width: 0.35, height: 1.25, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_beam',  x: 8.0, y: 1.45, width: 1.55, height: 0.2, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 2.9, radius: 0.3 },
        bonusShots: 1,
    starThresholds: [1, 2], starMode: 'bonus',
    revealAfter: null,
    hint: 'Over the first wall, under the hanging wall, over the third wall, into the arch.',
    theme: THEME,
  },

  // ── 3-7 ──────────────────────────────────────────────────────────────────
  // Two pigs: helmet on glass beam (left arch), letterman in concrete arch (right).
  // One arc through glass → hits first pig → continues to second arch.
  // Kill vectors: (1) arc through glass beam → first pig falls, (2) arc hits second pig directly
  {
    id: 'ch3-l7', chapter: 3, levelInChapter: 7,
    title: 'Double Hit',
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
      { id: 't1', x: 5.6, y: 1.4, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'g_beam' },
      { id: 't2', x: 8.1, y: 0.2, radius: 0.42, pigType: 'letterman', hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'g_col_l',  x: 4.9, y: 0.2, width: 0.3, height: 1.45, blockType: 'glass', hp: 1, supports: ['g_beam'] },
      { id: 'g_col_r',  x: 6.2, y: 0.2, width: 0.3, height: 1.45, blockType: 'glass', hp: 1, supports: ['g_beam'] },
      { id: 'g_beam',   x: 4.9, y: 1.65, width: 1.6, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
      { id: 'w_col_l',  x: 7.4, y: 0.2, width: 0.35, height: 0.8, blockType: 'concrete', hp: 2, supports: ['w_beam'] },
      { id: 'w_col_r',  x: 8.7, y: 0.2, width: 0.35, height: 0.8, blockType: 'concrete', hp: 2, supports: ['w_beam'] },
      { id: 'w_beam',   x: 7.4, y: 1, width: 1.65, height: 0.2, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: null,
    hint: 'Two targets! Arc through the glass beam to drop the first pig, then continue to the second arch.',
    theme: THEME,
  },

  // ── 3-8 ──────────────────────────────────────────────────────────────────
  // Whistle pig in glass arch. Arc through glass for direct hit.
  // Glass arch + glass floor = satisfying shatter cascade.
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
    targets: [{ id: 'whistle', x: 6.5, y: 0.2, radius: 0.45, pigType: 'whistle', hp: 1, moving: null }],
    obstacles: [
      { id: 'g_col_l',  x: 5.8, y: 0.2, width: 0.3, height: 1.0, blockType: 'glass', hp: 1, supports: ['g_beam'] },
      { id: 'g_col_r',  x: 7.0, y: 0.2, width: 0.3, height: 1.0, blockType: 'glass', hp: 1, supports: ['g_beam'] },
      { id: 'g_beam',   x: 5.8, y: 1.2, width: 1.5, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: 'domain_and_range',
    hint: 'Hit the Whistle Pig to trigger its special ability.',
    theme: THEME,
  },

  // ── 3-9 ──────────────────────────────────────────────────────────────────
  // Moving pig behind stone wall + wood gate. Arc over wall, time the shot.
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
      id: 'cool', x: 7.0, y: 0.9, radius: 0.38, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 6.0, max: 8.5, speed: 1.5 },
    }],
    obstacles: [
      { id: 'wall',       x: 4.0, y: 0.2, width: 0.4, height: 2.0 },
      { id: 'gate_col_l', x: 6.2, y: 0.2, width: 0.3, height: 1.8, blockType: 'wood', hp: 2, supports: ['gate_beam'] },
      { id: 'gate_col_r', x: 8.2, y: 0.2, width: 0.3, height: 1.8, blockType: 'wood', hp: 2, supports: ['gate_beam'] },
      { id: 'gate_beam',  x: 6.2, y: 2, width: 2.3, height: 0.2, blockType: 'wood', hp: 2, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 0,
    starThresholds: [1, 1], starMode: 'moves',
    revealAfter: null,
    hint: 'Wall blocks the approach. Set h past the wall and find the right a, then time the shot.',
    theme: THEME,
  },

  // ── 3-10 ─────────────────────────────────────────────────────────────────
  // King Pig on glass beam atop a 3-story structure. Stone wall in approach.
  // Break glass beam → king falls → finish at ground level.
  // Full cascade: concrete pillars → concrete beam → wood cols → wood beam → glass cols → glass beam.
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
    targets: [{ id: 'king', x: 7.325, y: 2.45, radius: 0.55, pigType: 'king', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'wall',        x: 3.5, y: 0.2, width: 0.4, height: 2.0 },
      { id: 'stone_col_l', x: 6.3, y: 0.2, width: 0.35, height: 0.8, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_col_r', x: 8.0, y: 0.2, width: 0.35, height: 0.8, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_beam',  x: 6.3, y: 1, width: 2.05, height: 0.2, blockType: 'concrete', hp: 2, supports: ['wood_col_l', 'wood_col_r'] },
      { id: 'wood_col_l',  x: 6.3, y: 1.2, width: 0.35, height: 0.5, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'wood_col_r',  x: 8.0, y: 1.2, width: 0.35, height: 0.5, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'glass_beam',  x: 6.3, y: 1.7, width: 2.05, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 5.0, y: 3.6, radius: 0.3 },
        bonusShots: 1,
    starThresholds: [1, 2], starMode: 'bonus',
    revealAfter: null,
    hint: 'King Pig takes 2 hits. Break the glass beam to drop him, then adjust your arc to finish him.',
    theme: THEME,
  },
];
