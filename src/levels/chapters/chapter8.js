// Chapter 8: BOSS LEVELS — timed, multi-form, multi-target, maximum density.
// 5 levels. Each has a timer. All archetypes combined. Stone = ∞. Concrete = 2-hit. Glass = pass-through.

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'space';

function vshot(label, a, h, k = 0) {
  return { label, equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: { a:{min:-0.45,max:-0.03,step:0.01}, h:{min:1,max:8,step:0.1}, k:{min:-2,max:6,step:0.1} },
    defaultParams: { a, h, k } };
}
function sshot(label, a, b, c, k = 0) {
  return { label, equationForm: 'standard',
    activeCoefficients: ['a','b','c','k'],
    sliderConfig: { a:{min:-0.40,max:-0.01,step:0.01}, b:{min:0.1,max:4,step:0.05}, c:{min:-2,max:2,step:0.05}, k:{min:-2,max:6,step:0.1} },
    defaultParams: { a, b, c, k } };
}
function fshot(label, a, r1, r2, k = 0) {
  return { label, equationForm: 'factored',
    activeCoefficients: ['a','r1','r2','k'],
    sliderConfig: { a:{min:-0.45,max:-0.02,step:0.01}, r1:{min:-1,max:3,step:0.1}, r2:{min:3,max:9.5,step:0.1}, k:{min:-2,max:6,step:0.1} },
    defaultParams: { a, r1, r2, k } };
}

export const CHAPTER_8 = [
  // ── 8-1 ──────────────────────────────────────────────────────────────────
  // 60s, 3 shots. Two compound shelf structures — each has a concrete pillar AND wood pillar.
  // Stone divider wall in the middle. Under time pressure: decide which structure first.
  // Kill vectors: destroy either pillar → glass shelf drops → pig falls.
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
        bonusShots: 1,
multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        vshot('Shot 1 — Left shelf',   -0.25, 2.5, 1.0),
        vshot('Shot 2 — Right shelf',  -0.10, 5.5, 3.0),
        vshot('Shot 3 — Bonus arc',    -0.08, 6.5, 3.5),
      ],
    },
    targets: [
      { id: 'pig_l', x: 4.45, y: 2.0, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'b1_shelf' },
      { id: 'pig_r', x: 8.15, y: 2.0, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'b1_shelf2' },
    ],
    obstacles: [
      { id: 'b1_pl1',   x: 3.8,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'concrete', hp: 2, supports: ['b1_shelf'] },
      { id: 'b1_pl2',   x: 4.9,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',     hp: 2, supports: ['b1_shelf'] },
      { id: 'b1_shelf', x: 3.8,  y: 1.3, width: 1.4,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'divider',  x: 5.8,  y: 0.6, width: 0.4,  height: 1.8,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'b1_pl3',   x: 7.5,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',     hp: 2, supports: ['b1_shelf2'] },
      { id: 'b1_pl4',   x: 8.6,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'concrete', hp: 2, supports: ['b1_shelf2'] },
      { id: 'b1_shelf2',x: 7.5,  y: 1.3, width: 1.4,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: { x: 6.5, y: 4.0, radius: 0.28 },
    starThresholds: [3, 4], starMode: 'bonus',
    revealAfter: null,
    hint: '60 seconds. Two shelves, two pigs, stone divider. Smash a pillar to drop the shelf. Decide fast — the clock is running.',
    theme: THEME,
  },

  // ── 8-2 ──────────────────────────────────────────────────────────────────
  // 90s. The Fortress: maximum layered defense. Standard form for precision.
  // Two static moat walls. Fortress: stone outer (∞) + concrete inner (2-hit) + glass ceiling.
  // King inside (hp:2). Bonus ring at peak arc.
  // Kill vectors: (1) arc through glass ceiling → 2 hits king,
  //               (2) destroy concrete inner wall → ceiling collapses → king crushed
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
    targets: [{ id: 'king', x: 7.6, y: 0.8, radius: 0.55, pigType: 'king', hp: 2, moving: null }],
    obstacles: [
      { id: 'moat1',    x: 3.0,  y: 0.6, width: 0.4,  height: 3.0 },
      { id: 'moat2',    x: 5.0,  y: 0.6, width: 0.4,  height: 2.5 },
      { id: 'fort_ol',  x: 6.5,  y: 0.6, width: 0.4,  height: 3.2, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort_il',  x: 7.0,  y: 0.6, width: 0.35, height: 2.8, blockType: 'concrete', hp: 2, supports: ['fort_roof'] },
      { id: 'fort_ir',  x: 8.2,  y: 0.6, width: 0.35, height: 2.8, blockType: 'concrete', hp: 2, supports: ['fort_roof'] },
      { id: 'fort_or',  x: 8.7,  y: 0.6, width: 0.4,  height: 3.2, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort_roof',x: 7.0,  y: 3.4, width: 1.55, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.0, y: 4.2, radius: 0.25 },
        bonusShots: 1,
    starThresholds: [3, 4], starMode: 'bonus',
    revealAfter: 'math_mastery',
    hint: '90 seconds. Two moat walls, stone outer shell, concrete inner walls, glass ceiling. King takes 2 hits — plan every arc.',
    theme: THEME,
  },

  // ── 8-3 ──────────────────────────────────────────────────────────────────
  // 90s, 3 shots. 3 moving pigs each in a different cage material.
  // Left: glass cage (easy — ball passes through). Center: concrete+glass cage (harder).
  // Right: stone-pillared cage with glass walls (stone ∞ sides, glass front + back).
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
        bonusShots: 1,
multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        vshot('Shot 1 — Left glass cage',    -0.30, 2.0, 0.8),
        vshot('Shot 2 — Center cage',        -0.15, 4.0, 2.2),
        vshot('Shot 3 — Right stone cage',   -0.07, 6.5, 2.4),
      ],
    },
    targets: [
      { id: 'm1', x: 3.5, y: 0.8, radius: 0.42, pigType: 'cool', hp: 1, moving: { axis: 'x', min: 3.0, max: 4.2, speed: 1.5 } },
      { id: 'm2', x: 6.0, y: 0.8, radius: 0.42, pigType: 'cool', hp: 1, moving: { axis: 'x', min: 5.5, max: 6.8, speed: 2.0 } },
      { id: 'm3', x: 8.5, y: 0.8, radius: 0.42, pigType: 'cool', hp: 1, moving: { axis: 'x', min: 8.0, max: 9.2, speed: 1.2 } },
    ],
    obstacles: [
      { id: 'cage1l',  x: 2.8,  y: 0.6, width: 0.3,  height: 1.5, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'cage1r',  x: 4.3,  y: 0.6, width: 0.3,  height: 1.5, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'cage2l',  x: 5.3,  y: 0.6, width: 0.35, height: 1.5, blockType: 'concrete', hp: 2, supports: [] },
      { id: 'cage2r',  x: 6.8,  y: 0.6, width: 0.35, height: 1.5, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'cage3l',  x: 7.8,  y: 0.6, width: 0.35, height: 1.8, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'cage3rf', x: 8.3,  y: 0.6, width: 0.3,  height: 1.8, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'cage3rb', x: 9.3,  y: 0.6, width: 0.35, height: 1.8, blockType: 'stone',    hp: 3, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 4], starMode: 'moves',
    revealAfter: null,
    hint: '90 seconds. Left pig in glass (easy), center in concrete (needs bounce-through), right behind stone (glass front only). Time each shot carefully.',
    theme: THEME,
  },

  // ── 8-4 ──────────────────────────────────────────────────────────────────
  // 90s, 3 shots. Mixed equation forms: staircase (factored) + tower (vertex) + fortress (standard).
  // 3 targets: letterman on staircase, helmet on tower, king inside fortress.
  {
    id: 'ch8-l4', chapter: 8, levelInChapter: 4,
    title: 'Mixed Structures',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0,  max: 3.0,   step: 0.1 },
      r2: { min: 3.0,   max: 9.5,   step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, r1: 0, r2: 8.0, k: 0 },
    launcher: LAUNCHER,
    timer: { seconds: 90 },
        bonusShots: 1,
multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        fshot('Shot 1 — Staircase',   -0.15, 0, 4.2),
        vshot('Shot 2 — Tower',       -0.12, 6.5, 2.0),
        sshot('Shot 3 — Fortress',    -0.10, 2.0, 0),
      ],
    },
    targets: [
      { id: 'stair_pig', x: 4.95, y: 2.15, radius: 0.42, pigType: 'letterman', hp: 1, moving: null, restingOn: 'stair_top' },
      { id: 'twr_pig',   x: 6.75, y: 2.5,  radius: 0.42, pigType: 'helmet',    hp: 1, moving: null, restingOn: 'twr8_4t' },
      { id: 'king',      x: 9.0,  y: 0.8,  radius: 0.55, pigType: 'king',      hp: 2, moving: null },
    ],
    obstacles: [
      { id: 'stair1',    x: 3.0,  y: 0.6, width: 0.5, height: 0.4, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'stair2',    x: 3.8,  y: 0.6, width: 0.5, height: 0.8, blockType: 'wood',     hp: 2, supports: [] },
      { id: 'stair_top', x: 4.6,  y: 0.6, width: 0.5, height: 1.1, blockType: 'concrete', hp: 2, supports: [] },
      { id: 'twr8_4s',   x: 6.5,  y: 0.6, width: 0.5, height: 0.6, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'twr8_4b',   x: 6.5,  y: 1.2, width: 0.5, height: 0.8, blockType: 'concrete', hp: 2, supports: ['twr8_4t'] },
      { id: 'twr8_4t',   x: 6.5,  y: 2.0, width: 0.5, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
      { id: 'k8_4wl',    x: 8.1,  y: 0.6, width: 0.35, height: 2.6, blockType: 'stone',   hp: 3, supports: [] },
      { id: 'k8_4wr',    x: 9.6,  y: 0.6, width: 0.35, height: 2.6, blockType: 'concrete',hp: 2, supports: ['k8_4rf'] },
      { id: 'k8_4rf',    x: 8.1,  y: 3.2, width: 1.85, height: 0.25, blockType: 'glass',  hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [5, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Three equation forms — one per structure. Read the structure, choose the right form. King takes 2 hits inside the stone fortress.',
    theme: THEME,
  },

  // ── 8-5 ──────────────────────────────────────────────────────────────────
  // 120s. The Final Exam: every archetype combined.
  // Whistle pig on glass shelf (spawns second). Letterman (hp:2) in castle.
  // Moving King (hp:2) in stone fortress. 5 shots, 3 forms, bonus ring.
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
        bonusShots: 1,
multiShot: {
      shotCount: 5,
      sequenceMode: 'sequential',
      shots: [
        sshot('Shot 1 — Whistle shelf',    -0.20, 1.5, 0),
        vshot('Shot 2 — Castle ceiling',   -0.15, 4.0, 2.5),
        vshot('Shot 3 — Letterman kill',   -0.14, 4.2, 2.3),
        fshot('Shot 4 — King ceiling',     -0.10, 0, 7.0),
        fshot('Shot 5 — King finish',      -0.09, 0, 7.2),
      ],
    },
    targets: [
      { id: 'whistle',   x: 3.65, y: 2.0,  radius: 0.42, pigType: 'whistle',   hp: 1, moving: null, restingOn: 'fe_shelf' },
      { id: 'letterman', x: 6.25, y: 0.8,  radius: 0.42, pigType: 'letterman', hp: 2, moving: null },
      { id: 'king',      x: 8.5,  y: 0.8,  radius: 0.55, pigType: 'king',      hp: 2,
        moving: { axis: 'x', min: 7.8, max: 9.2, speed: 0.8 } },
    ],
    obstacles: [
      { id: 'fe_pll',   x: 3.0,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',     hp: 2, supports: ['fe_shelf'] },
      { id: 'fe_plr',   x: 4.1,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'concrete', hp: 2, supports: ['fe_shelf'] },
      { id: 'fe_shelf', x: 3.0,  y: 1.3, width: 1.4,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'cas_wl',   x: 5.5,  y: 0.6, width: 0.35, height: 2.5,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'cas_wr',   x: 7.1,  y: 0.6, width: 0.35, height: 2.5,  blockType: 'concrete', hp: 2, supports: ['cas_roof'] },
      { id: 'cas_roof', x: 5.5,  y: 3.1, width: 1.95, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'king_wl',  x: 7.6,  y: 0.6, width: 0.35, height: 3.0,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'king_wr',  x: 9.3,  y: 0.6, width: 0.35, height: 3.0,  blockType: 'concrete', hp: 2, supports: ['king_rf'] },
      { id: 'king_rf',  x: 7.6,  y: 3.6, width: 2.05, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.8, y: 4.5, radius: 0.25 },
    starThresholds: [2, 3], starMode: 'bonus',
    revealAfter: 'strategic_thinking',
    hint: '120 seconds. Whistle Pig on a shelf, Letterman in a castle, moving King in a stone fortress. Five shots, three equation forms. This IS the final exam.',
    theme: THEME,
  },
];
