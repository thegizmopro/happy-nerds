// Chapter 8: BOSS LEVELS — timed, multi-form, multi-target
// 5 levels. Each has a timer. All archetypes combined, maximum density.

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'space';

function vshot(label, a, h, k) {
  k = k || (-a * h * h);
  return { label, equationForm: 'vertex', activeCoefficients: ['a', 'h', 'k'], sliderConfig: { a:{min:-0.45,max:-0.03,step:0.01}, h:{min:1,max:8,step:0.1}, k:{min:-2,max:6,step:0.1} }, defaultParams: { a, h, k: parseFloat(k.toFixed(4)) } };
}
function sshot(label, a, b, c, k = 0) {
  return { label, equationForm: 'standard', activeCoefficients: ['a','b','c','k'], sliderConfig: { a:{min:-0.40,max:-0.01,step:0.01}, b:{min:0.1,max:4,step:0.05}, c:{min:-2,max:2,step:0.05}, k:{min:-2,max:6,step:0.1} }, defaultParams: { a, b, c, k } };
}
function fshot(label, a, r1, r2, k = 0) {
  return { label, equationForm: 'factored', activeCoefficients: ['a','r1','r2','k'], sliderConfig: { a:{min:-0.45,max:-0.02,step:0.01}, r1:{min:-1,max:3,step:0.1}, r2:{min:3,max:9.5,step:0.1}, k:{min:-2,max:6,step:0.1} }, defaultParams: { a, r1, r2, k } };
}

export const CHAPTER_8 = [
  // ── 8-1 ──────────────────────────────────────────────────────────────────
  // 60s, 3 shots. Two separate shelf structures — decide which to hit first under time pressure.
  // Left shelf at x=3.8, right shelf at x=7.5.
  {
    id: 'ch8-l1', chapter: 8, levelInChapter: 1,
    title: 'Time Pressure',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0,  max: 8.0,  step: 0.1 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.20, h: 2.5, k: 1.25 },
    launcher: LAUNCHER,
    timer: { seconds: 60 },
    multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        vshot('Shot 1 — Left shelf',  -0.25, 2.5),
        vshot('Shot 2 — Right shelf', -0.10, 5.5),
        vshot('Shot 3 — Bonus',       -0.15, 6.0),
      ],
    },
    targets: [
      { id: 'pig_l', x: 4.45, y: 2.0,  radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'b1_shelf' },
      { id: 'pig_r', x: 8.15, y: 2.0,  radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'b1_shelf2' },
    ],
    obstacles: [
      { id: 'b1_pl1', x: 3.8,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',  hp: 2, supports: ['b1_shelf'] },
      { id: 'b1_pl2', x: 4.9,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',  hp: 2, supports: ['b1_shelf'] },
      { id: 'b1_shelf', x: 3.8, y: 1.3, width: 1.4,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'b1_pl3', x: 7.5,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',  hp: 2, supports: ['b1_shelf2'] },
      { id: 'b1_pl4', x: 8.6,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',  hp: 2, supports: ['b1_shelf2'] },
      { id: 'b1_shelf2', x: 7.5, y: 1.3, width: 1.4, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [4, 10], starMode: 'moves',
    revealAfter: null,
    hint: '60 seconds. Two shelves, two pigs. Decide fast — every slider move costs time.',
    theme: THEME,
  },

  // ── 8-2 ──────────────────────────────────────────────────────────────────
  // 90s. The Fortress: maximum stone walls + wood inner walls + glass roof + king.
  // Single standard form equation. Bonus ring at peak.
  {
    id: 'ch8-l2', chapter: 8, levelInChapter: 2,
    title: 'The Fortress',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      c: { min: -1.00, max:  1.00, step: 0.05 },
    },
    defaultParams: { a: -0.12, b: 1.5, c: 0 },
    launcher: LAUNCHER,
    timer: { seconds: 90 },
    targets: [{ id: 'king', x: 7.5, y: 0.8, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'moat1',   x: 3.0,  y: 0.6, width: 0.4,  height: 3.0 },
      { id: 'moat2',   x: 5.0,  y: 0.6, width: 0.4,  height: 2.5 },
      { id: 'fort_ol', x: 6.5,  y: 0.6, width: 0.4,  height: 3.2, blockType: 'stone', hp: 3, supports: ['fort_roof'] },
      { id: 'fort_il', x: 7.0,  y: 0.6, width: 0.3,  height: 2.7, blockType: 'wood',  hp: 2, supports: ['fort_roof'] },
      { id: 'fort_ir', x: 8.2,  y: 0.6, width: 0.3,  height: 2.7, blockType: 'wood',  hp: 2, supports: ['fort_roof'] },
      { id: 'fort_or', x: 8.7,  y: 0.6, width: 0.4,  height: 3.2, blockType: 'stone', hp: 3, supports: ['fort_roof'] },
      { id: 'fort_roof', x: 7.0, y: 3.3, width: 1.5,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.0, y: 4.2, radius: 0.25 },
    starThresholds: [3, 8], starMode: 'bonus',
    revealAfter: null,
    hint: '90 seconds. Two moat walls, stone outer walls, wood inner walls, glass roof. Standard form for precision.',
    theme: THEME,
  },

  // ── 8-3 ──────────────────────────────────────────────────────────────────
  // 90s, 3 shots. 3 moving pigs each in small glass cage.
  // Each cage: glass left/right walls (no roof). Pigs move inside.
  {
    id: 'ch8-l3', chapter: 8, levelInChapter: 3,
    title: 'Moving Army',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0,  max: 8.0,  step: 0.1 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.15, h: 4.0, k: 2.4 },
    launcher: LAUNCHER,
    timer: { seconds: 90 },
    multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        vshot('Shot 1 — Left cage',  -0.30, 2.0),
        vshot('Shot 2 — Mid cage',   -0.15, 4.0),
        vshot('Shot 3 — Right cage', -0.07, 6.5),
      ],
    },
    targets: [
      { id: 'm1', x: 3.5, y: 0.8, radius: 0.42, pigType: 'cool', hp: 1, moving: { axis: 'x', min: 3.1, max: 4.3, speed: 1.5 } },
      { id: 'm2', x: 6.0, y: 0.8, radius: 0.42, pigType: 'cool', hp: 1, moving: { axis: 'x', min: 5.6, max: 6.8, speed: 2.0 } },
      { id: 'm3', x: 8.5, y: 0.8, radius: 0.42, pigType: 'cool', hp: 1, moving: { axis: 'x', min: 8.1, max: 9.2, speed: 1.2 } },
    ],
    obstacles: [
      { id: 'cage1l', x: 2.9,  y: 0.6, width: 0.3, height: 1.5, blockType: 'glass', hp: 1, supports: [] },
      { id: 'cage1r', x: 4.3,  y: 0.6, width: 0.3, height: 1.5, blockType: 'glass', hp: 1, supports: [] },
      { id: 'cage2l', x: 5.4,  y: 0.6, width: 0.3, height: 1.5, blockType: 'glass', hp: 1, supports: [] },
      { id: 'cage2r', x: 6.8,  y: 0.6, width: 0.3, height: 1.5, blockType: 'glass', hp: 1, supports: [] },
      { id: 'cage3l', x: 7.9,  y: 0.6, width: 0.3, height: 1.5, blockType: 'glass', hp: 1, supports: [] },
      { id: 'cage3r', x: 9.3,  y: 0.6, width: 0.3, height: 1.5, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [4, 10], starMode: 'moves',
    revealAfter: null,
    hint: 'Three caged pigs pacing in their cells. Break the cage walls to catch them.',
    theme: THEME,
  },

  // ── 8-4 ──────────────────────────────────────────────────────────────────
  // 90s, 3 shots. Mixed structures: staircase + castle + tower at different heights.
  // Uses mixed equation forms per shot.
  {
    id: 'ch8-l4', chapter: 8, levelInChapter: 4,
    title: 'Mixed Structures',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0,  max: 3.0,   step: 0.1 },
      r2: { min: 3.0,   max: 9.5,   step: 0.1 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, r1: 0, r2: 8.0, k: 0 },
    launcher: LAUNCHER,
    timer: { seconds: 90 },
    multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        fshot('Shot 1 — Staircase',  -0.15, 0, 5.0),
        vshot('Shot 2 — Tower',      -0.12, 6.5),
        sshot('Shot 3 — Castle king', -0.10, 2.0, 0),
      ],
    },
    targets: [
      { id: 'stair_pig', x: 4.95, y: 2.12, radius: 0.42, pigType: 'letterman', hp: 1, moving: null, restingOn: 'stair_top' },
      { id: 'twr_pig',   x: 6.75, y: 2.5,  radius: 0.42, pigType: 'helmet',    hp: 1, moving: null, restingOn: 'twr8_4t' },
      { id: 'king',      x: 9.0,  y: 0.8,  radius: 0.55, pigType: 'king',      hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'stair1',   x: 3.3, y: 0.6, width: 0.5, height: 0.4, blockType: 'glass', hp: 1, supports: [] },
      { id: 'stair2',   x: 4.0, y: 0.6, width: 0.5, height: 0.8, blockType: 'wood',  hp: 2, supports: [] },
      { id: 'stair_top',x: 4.7, y: 0.6, width: 0.5, height: 1.1, blockType: 'stone', hp: 3, supports: [] },
      { id: 'twr8_4b',  x: 6.5, y: 0.6, width: 0.5, height: 1.0, blockType: 'wood',  hp: 2, supports: ['twr8_4t'] },
      { id: 'twr8_4t',  x: 6.5, y: 1.6, width: 0.5, height: 0.65, blockType: 'glass', hp: 1, supports: [] },
      { id: 'k8_4wl',   x: 7.8, y: 0.6, width: 0.35, height: 2.2, blockType: 'stone', hp: 3, supports: ['k8_4rf'] },
      { id: 'k8_4wr',   x: 9.2, y: 0.6, width: 0.35, height: 2.2, blockType: 'stone', hp: 3, supports: ['k8_4rf'] },
      { id: 'k8_4rf',   x: 7.8, y: 2.8, width: 1.75, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [5, 12], starMode: 'moves',
    revealAfter: null,
    hint: 'Three structure types, three equation forms. One per shot — read the structure, pick the right form.',
    theme: THEME,
  },

  // ── 8-5 ──────────────────────────────────────────────────────────────────
  // 120s. Final exam: every archetype — whistle pig on shelf, letterman in castle,
  // moving king pig behind stone fortress. 5 shots, 3 forms, bonus ring.
  {
    id: 'ch8-l5', chapter: 8, levelInChapter: 5,
    title: 'The Final Exam',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c', 'k'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  4.00, step: 0.05 },
      c: { min: -2.00, max:  2.00, step: 0.05 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, b: 1.8, c: 0, k: 0 },
    launcher: LAUNCHER,
    timer: { seconds: 120 },
    multiShot: {
      shotCount: 5,
      sequenceMode: 'sequential',
      shots: [
        sshot('Shot 1 — Whistle shelf',    -0.20, 1.5, 0),
        vshot('Shot 2 — Castle roof',      -0.15, 4.0),
        vshot('Shot 3 — Letterman finish', -0.14, 4.2),
        sshot('Shot 4 — King fortress',    -0.10, 2.2, 0),
        sshot('Shot 5 — King finish',      -0.09, 2.5, 0),
      ],
    },
    targets: [
      { id: 'whistle',   x: 3.65, y: 2.0,  radius: 0.42, pigType: 'whistle',   hp: 1, moving: null, restingOn: 'fe_shelf' },
      { id: 'letterman', x: 6.25, y: 0.8,  radius: 0.42, pigType: 'letterman', hp: 2, moving: null },
      { id: 'king',      x: 8.5,  y: 0.8,  radius: 0.55, pigType: 'king',      hp: 2,
        moving: { axis: 'x', min: 7.8, max: 9.2, speed: 0.8 } },
    ],
    obstacles: [
      { id: 'fe_pll',   x: 3.0,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'glass', hp: 1, supports: ['fe_shelf'] },
      { id: 'fe_plr',   x: 4.1,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'glass', hp: 1, supports: ['fe_shelf'] },
      { id: 'fe_shelf', x: 3.0,  y: 1.3, width: 1.4,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'cas_wl',   x: 5.5,  y: 0.6, width: 0.35, height: 2.5,  blockType: 'stone', hp: 3, supports: ['cas_roof'] },
      { id: 'cas_wr',   x: 7.1,  y: 0.6, width: 0.35, height: 2.5,  blockType: 'stone', hp: 3, supports: ['cas_roof'] },
      { id: 'cas_roof', x: 5.5,  y: 3.1, width: 1.95, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'king_wl',  x: 7.6,  y: 0.6, width: 0.35, height: 3.0,  blockType: 'stone', hp: 3, supports: ['king_rf'] },
      { id: 'king_wr',  x: 9.3,  y: 0.6, width: 0.35, height: 3.0,  blockType: 'stone', hp: 3, supports: ['king_rf'] },
      { id: 'king_rf',  x: 7.6,  y: 3.6, width: 2.05, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.8, y: 4.5, radius: 0.25 },
    starThresholds: [5, 12], starMode: 'bonus',
    revealAfter: null,
    hint: '120 seconds. Whistle pig, Letterman in a castle, moving King in a fortress. Five shots, three forms. This IS the final exam.',
    theme: THEME,
  },
];
