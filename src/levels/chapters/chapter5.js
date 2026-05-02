// Chapter 5: STANDARD FORM — y = ax² + bx + c
// All three coefficients. c = y-intercept (arc height offset). b = launch slope.
// Kill vectors: stone=permanent barrier, concrete=2-hit cascade, glass=pass-through lane.

const LAUNCHER = { x: 1, y: 0.2 };
const THEME = 'space';

function sshot(label, a, b, c, k = 0) {
  return {
    label,
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c', 'k'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      c: { min: -1.00, max:  1.00, step: 0.05 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a, b, c, k },
  };
}

export const CHAPTER_5 = [
  // ── 5-1 ──────────────────────────────────────────────────────────────────
  // Full castle: stone left wall (∞), concrete right wall (2-hit), glass ceiling.
  // Target inside. Glass ceiling = shoot-through lane from above.
  // Kill vectors: (1) arc through glass ceiling → hits target, (2) break concrete wall → ceiling crushes target
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
    defaultParams: { a: -0.10, b: 1.2, c: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.3, y: 0.2, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall_l',  x: 6.0,  y: 0, width: 0.4,  height: 2.65, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'wall_r',  x: 8.6,  y: 0, width: 0.4,  height: 2.65, blockType: 'concrete', hp: 2, supports: ['ceiling'] },
      { id: 'ceiling', x: 6.0,  y: 2.65, width: 3.0,  height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: 'standard_form',
    hint: 'Standard form: b controls launch angle, c shifts start height. Arc through the glass ceiling to reach the pig inside.',
    theme: THEME,
  },

  // ── 5-2 ──────────────────────────────────────────────────────────────────
  // Two-story tower with stone base. Target elevated on glass top.
  // Stone base (∞), concrete mid (2-hit), glass top. Another target on a nearby shelf.
  // Kill vectors tower: (1) direct to glass top, (2) hit concrete mid → cascade → target falls
  {
    id: 'ch5-l2', chapter: 5, levelInChapter: 2,
    title: 'Two Targets',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'k'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.10, max:  3.00, step: 0.05 },
      k: { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, b: 1.5, c: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [
      { id: 't1', x: 5.0,  y: 1.4,  radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf_a' },
      { id: 't2', x: 7.85, y: 2.15, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'twr_glass' },
    ],
    obstacles: [
      { id: 'shelf_pl', x: 4.2, y: 0, width: 0.35, height: 0.7, blockType: 'wood',     hp: 2, supports: ['shelf_a'] },
      { id: 'shelf_pr', x: 5.5, y: 0, width: 0.35, height: 0.7, blockType: 'wood',     hp: 2, supports: ['shelf_a'] },
      { id: 'shelf_a',  x: 4.2, y: 0.7, width: 1.65, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
      { id: 'twr_stone',x: 7.6, y: 0, width: 0.5,  height: 0.8, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'twr_conc', x: 7.6, y: 0.8, width: 0.5,  height: 0.6, blockType: 'concrete', hp: 2, supports: ['twr_glass'] },
      { id: 'twr_glass',x: 7.6, y: 1.4, width: 0.5,  height: 0.3, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [3, 4], starMode: 'moves',
    revealAfter: null,
    hint: 'c=0 locked — arc starts at launch height. Two targets at different heights: shelf first, then the tower top.',
    theme: THEME,
  },

  // ── 5-3 ──────────────────────────────────────────────────────────────────
  // Pyramid fortress: stone inner wall blocks the left approach.
  // Concrete pyramid base → wood mid → glass top. Target on pyramid top.
  // Stone inner wall at x=5.4 blocks direct low path.
  // Kill vectors: (1) arc over stone wall → hits glass pyramid top → target drops,
  //               (2) destroy concrete base → cascade → target falls 2+ units
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
    targets: [{ id: 'pig', x: 7.0, y: 1.65, radius: 0.45, pigType: 'letterman', hp: 1, moving: null, restingOn: 'pyr_top' }],
    obstacles: [
      { id: 'stone_guard',x: 5.4, y: 0, width: 0.4,  height: 1.8, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'pyr_base',   x: 5.8, y: 0, width: 2.2,  height: 0.5, blockType: 'concrete', hp: 2, supports: ['pyr_mid'] },
      { id: 'pyr_mid',    x: 6.2, y: 0.5, width: 1.5,  height: 0.4, blockType: 'wood',     hp: 2, supports: ['pyr_top'] },
      { id: 'pyr_top',    x: 6.5, y: 0.9, width: 1.0,  height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Stone guard blocks the low approach. Arc over it and break the pyramid base — the whole thing cascades.',
    theme: THEME,
  },

  // ── 5-4 ──────────────────────────────────────────────────────────────────
  // Static moat wall blocks direct approach. Pig on shelf behind wall.
  // Bonus ring sits between launcher and moat (before the wall).
  // Must tune b and c to thread through the ring AND arc over the wall.
  // Kill vectors: (1) arc over moat → hit wood pillar → shelf drops → pig falls,
  //               (2) direct high arc to pig on shelf
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
    defaultParams: { a: -0.14, b: 1.2, c: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.7, y: 1.4, radius: 0.40, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'moat',     x: 5.0, y: 0, width: 0.4,  height: 2.2 },
      { id: 'pillar_l', x: 6.9, y: 0, width: 0.35, height: 0.7, blockType: 'concrete', hp: 2, supports: ['shelf'] },
      { id: 'pillar_r', x: 8.3, y: 0, width: 0.35, height: 0.7, blockType: 'wood',     hp: 2, supports: ['shelf'] },
      { id: 'shelf',    x: 6.9, y: 0.7, width: 1.8,  height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: { x: 3.5, y: 2.2, radius: 0.28 },
        bonusShots: 1,
    starThresholds: [4, 5], starMode: 'bonus',
    revealAfter: 'vertex_to_factored',
    hint: 'Thread the arc through the bonus ring, then clear the moat wall and hit a pillar to drop the shelf.',
    theme: THEME,
  },

  // ── 5-5 ──────────────────────────────────────────────────────────────────
  // King pig behind double moat + stone fortress. High b needed to clear both walls.
  // Outer moat walls (static, ∞). Fortress: stone left, concrete right, glass ceiling. King inside.
  // Kill vectors: (1) arc through glass ceiling → 2 hits king, (2) destroy concrete right → ceiling drops
  {
    id: 'ch5-l5', chapter: 5, levelInChapter: 5,
    title: 'Double Moat King',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  1.00, max:  5.00, step: 0.10 },
      c: { min: -1.50, max:  1.50, step: 0.05 },
    },
    defaultParams: { a: -0.08, b: 2.5, c: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 7.6, y: 0.2, radius: 0.55, pigType: 'king', hp: 2, moving: null }],
    obstacles: [
      { id: 'moat_1',    x: 3.5, y: 0, width: 0.4,  height: 2.8 },
      { id: 'moat_2',    x: 5.5, y: 0, width: 0.4,  height: 2.4 },
      { id: 'fort_l',    x: 6.5, y: 0, width: 0.4,  height: 2.8, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort_r',    x: 8.7, y: 0, width: 0.4,  height: 2.8, blockType: 'concrete', hp: 2, supports: ['fort_roof'] },
      { id: 'fort_roof', x: 6.5, y: 2.8, width: 2.6,  height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'King takes 2 hits. High b to clear both moat walls. Break the glass ceiling, then finish the king inside.',
    theme: THEME,
  },

  // ── 5-6 ──────────────────────────────────────────────────────────────────
  // Pig under overhanging slab (cave pig). Stone pillars hold a wood + glass double ceiling above pig.
  // Must hit the glass top → shatters → wood slab exposed → hit wood → falls on pig (crush kill).
  // Kill vectors: (1) hit glass top → passes through → lands on wood slab → collapses onto pig (crush),
  //               (2) destroy concrete pillar → both ceiling layers fall → crush pig
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
    targets: [{ id: 'pig', x: 7.2, y: 0.2, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'pillar_l',  x: 6.0, y: 0, width: 0.35, height: 2.0, blockType: 'concrete', hp: 2, supports: ['slab_wood'] },
      { id: 'pillar_r',  x: 8.4, y: 0, width: 0.35, height: 2.0, blockType: 'concrete', hp: 2, supports: ['slab_wood'] },
      { id: 'slab_wood', x: 6.35,y: 2, width: 2.45, height: 0.3, blockType: 'wood',     hp: 2, supports: ['slab_glass'] },
      { id: 'slab_glass',x: 6.35,y: 2.3, width: 2.45, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: { x: 3.5, y: 2.2, radius: 0.28 },
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'bonus',
    revealAfter: 'completing_the_square',
    hint: 'Pig hides under the slab. Hit the glass top — it shatters, then hit the wood slab to collapse it onto the pig.',
    theme: THEME,
  },

  // ── 5-7 ──────────────────────────────────────────────────────────────────
  // Moving pig between two glass/concrete towers. 2 shots.
  // Shot 1 collapses left tower (concrete base → cascade). Shot 2 times moving pig.
  // Kill vectors: (1) direct arc at moving pig, (2) tower collapse hits pig if in range
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
    defaultParams: { a: -0.14, b: 1.5, c: 0 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        sshot('Shot 1 — Topple left tower',   -0.20, 1.5, 0),
        sshot('Shot 2 — Time the moving pig', -0.10, 1.8, 0),
      ],
    },
    targets: [{
      id: 'cool', x: 6.5, y: 0.2, radius: 0.42, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.6, max: 7.8, speed: 1.4 },
    }],
    obstacles: [
      { id: 'tl_base',  x: 4.2, y: 0, width: 0.5, height: 0.8, blockType: 'concrete', hp: 2, supports: ['tl_top'] },
      { id: 'tl_top',   x: 4.2, y: 0.8, width: 0.5, height: 0.4, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'tr_stone', x: 8.2, y: 0, width: 0.5, height: 0.8, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'tr_glass', x: 8.2, y: 0.8, width: 0.5, height: 0.4, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Moving pig patrols between towers. Collapse the left tower with Shot 1, then time Shot 2 to catch the pig in the open.',
    theme: THEME,
  },

  // ── 5-8 ──────────────────────────────────────────────────────────────────
  // Obstacle course: 3 structures, 3 targets, 3 shots.
  // Structure 1 (left x≈3): concrete/glass mini-tower with pig.
  // Structure 2 (center x≈6): static moat wall + enclosed pig.
  // Structure 3 (right x≈8): wood shelf pig.
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
        bonusShots: 1,
multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        sshot('Shot 1 — Left tower',  -0.22, 1.2, 0),
        sshot('Shot 2 — Center pig',  -0.12, 2.0, 0),
        sshot('Shot 3 — Right shelf', -0.08, 2.5, 0),
      ],
    },
    targets: [
      { id: 't1', x: 3.45, y: 1.45, radius: 0.40, pigType: 'helmet',    hp: 1, moving: null, restingOn: 'left_top' },
      { id: 't2', x: 6.1,  y: 0.2,  radius: 0.40, pigType: 'letterman', hp: 1, moving: null },
      { id: 't3', x: 8.35, y: 1.4,  radius: 0.40, pigType: 'helmet',    hp: 1, moving: null, restingOn: 'right_shelf' },
    ],
    obstacles: [
      { id: 'left_base', x: 3.1, y: 0, width: 0.5, height: 0.8,  blockType: 'concrete', hp: 2, supports: ['left_top'] },
      { id: 'left_top',  x: 3.1, y: 0.8, width: 0.5, height: 0.4,  blockType: 'glass',    hp: 1, supports: [] },
      { id: 'mid_wall',  x: 5.5, y: 0, width: 0.4, height: 2.0 },
      { id: 'mid_conc',  x: 6.5, y: 0, width: 0.4, height: 2.0,  blockType: 'concrete', hp: 2, supports: [] },
      { id: 'right_pl',  x: 7.7, y: 0, width: 0.35, height: 0.7, blockType: 'wood',     hp: 2, supports: ['right_shelf'] },
      { id: 'right_pr',  x: 8.9, y: 0, width: 0.35, height: 0.7, blockType: 'wood',     hp: 2, supports: ['right_shelf'] },
      { id: 'right_shelf',x:7.7, y: 0.7, width: 1.55, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Three structures in the obstacle course — one shot each. Tune b and c to thread the arc through all three.',
    theme: THEME,
  },

  // ── 5-9 ──────────────────────────────────────────────────────────────────
  // Stacked cages: 2 pigs in separate enclosed cells (one above the other). 2 shots.
  // Top cell: glass walls + glass ceiling. Target on glass floor (which is the mid-shelf).
  // Bottom cell: concrete left, stone right, wood floor. Target on wood floor.
  // Kill vectors top: (1) arc through glass top → direct hit, (2) destroy glass cell → falls
  // Kill vectors bottom: (1) destroy wood floor → falls through to ground, (2) arc through exposed cell
  {
    id: 'ch5-l9', chapter: 5, levelInChapter: 9,
    title: 'Stacked Cages',
    equationForm: 'standard',
    activeCoefficients: ['a', 'b', 'c'],
    sliderConfig: {
      a: { min: -0.40, max: -0.01, step: 0.01 },
      b: { min:  0.50, max:  4.00, step: 0.05 },
      c: { min: -2.00, max:  2.00, step: 0.05 },
    },
    defaultParams: { a: -0.12, b: 2.0, c: -0.5 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        sshot('Shot 1 — Top cage pig',    -0.12, 2.0, -0.5),
        sshot('Shot 2 — Bottom cage pig', -0.15, 1.5,  0.0),
      ],
    },
    targets: [
      { id: 'top_pig', x: 7.15, y: 2.3, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'mid_shelf' },
      { id: 'bot_pig', x: 7.15, y: 0.2, radius: 0.42, pigType: 'letterman', hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'cage_l',   x: 6.5,  y: 0, width: 0.35, height: 3.2,  blockType: 'concrete', hp: 2, supports: ['top_roof'] },
      { id: 'cage_r',   x: 7.95, y: 0, width: 0.35, height: 3.2,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'mid_shelf',x: 6.85, y: 1.6, width: 1.1,  height: 0.25, blockType: 'wood',     hp: 2, supports: [] },
      { id: 'top_roof', x: 6.85, y: 3, width: 1.1,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: 'accuracy_and_efficiency',
    hint: 'Two pigs in stacked cells. Shot 1: arc through the glass roof into the top cage. Shot 2: break the mid-shelf, drop to the bottom pig.',
    theme: THEME,
  },

  // ── 5-10 ─────────────────────────────────────────────────────────────────
  // Grand standard: 3 targets, 4 shots. Whistle pig on shelf, letterman in castle, king behind fortress.
  // Whistle pig spawns a second pig on death.
  // Full structural complexity: shelf + enclosed castle + stone fortress + bonus ring.
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
        bonusShots: 1,
multiShot: {
      shotCount: 4,
      sequenceMode: 'sequential',
      shots: [
        sshot('Shot 1 — Whistle shelf',    -0.22, 1.2, 0),
        sshot('Shot 2 — Castle ceiling',   -0.12, 2.0, 0),
        sshot('Shot 3 — Letterman',        -0.11, 2.1, 0),
        sshot('Shot 4 — King fortress',    -0.08, 2.8, 0),
      ],
    },
    targets: [
      { id: 'whistle',  x: 3.65, y: 1.4,  radius: 0.42, pigType: 'whistle',   hp: 1, moving: null, restingOn: 'ws_shelf' },
      { id: 'letterman',x: 6.2,  y: 0.2,  radius: 0.42, pigType: 'letterman', hp: 2, moving: null },
      { id: 'king',     x: 8.7,  y: 0.2,  radius: 0.55, pigType: 'king',      hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'ws_pll',   x: 3.0,  y: 0, width: 0.3,  height: 0.7,  blockType: 'wood',     hp: 2, supports: ['ws_shelf'] },
      { id: 'ws_plr',   x: 4.1,  y: 0, width: 0.3,  height: 0.7,  blockType: 'wood',     hp: 2, supports: ['ws_shelf'] },
      { id: 'ws_shelf', x: 3.0,  y: 0.7, width: 1.4,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'cas_wl',   x: 5.5,  y: 0, width: 0.35, height: 2.5,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'cas_wr',   x: 7.0,  y: 0, width: 0.35, height: 2.5,  blockType: 'concrete', hp: 2, supports: ['cas_roof'] },
      { id: 'cas_roof', x: 5.5,  y: 2.5, width: 1.85, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'king_wl',  x: 8.0,  y: 0, width: 0.35, height: 2.8,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'king_wr',  x: 9.3,  y: 0, width: 0.35, height: 2.8,  blockType: 'concrete', hp: 2, supports: ['king_rf'] },
      { id: 'king_rf',  x: 8.0,  y: 2.8, width: 1.65, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 3.6, radius: 0.25 },
    starThresholds: [2, 3], starMode: 'bonus',
    revealAfter: null,
    hint: 'Whistle Pig on a shelf, Letterman in a castle, King behind a fortress. Four shots — plan them all.',
    theme: THEME,
  },
];
