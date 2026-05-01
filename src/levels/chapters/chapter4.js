// Chapter 4: ROOTS — y = a(x−r₁)(x−r₂)
// Factored form. r₁ and r₂ are where the arc crosses y=launcherY.
// Kill vectors: (1) direct hit, (2) destroy supports → target falls, (3) block crushes target.
// Stone = indestructible barrier. Concrete = 2-hit. Glass = pass-through.

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'mountain';

function fshot(label, a, r1, r2, k = 0) {
  return {
    label,
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0,  max: 2.0,   step: 0.1 },
      r2: { min: 2.0,   max: 9.0,   step: 0.1 },
      k:  { min: -2,    max: 6,      step: 0.1 },
    },
    defaultParams: { a, r1, r2, k },
  };
}

export const CHAPTER_4 = [
  // ── 4-1 ──────────────────────────────────────────────────────────────────
  // Stone gate + glass panel. Target behind glass.
  // Stone wall is indestructible — arc must clear it or go through the glass lane.
  // Kill vectors: (1) arc over stone + through glass → hits target, (2) direct high arc
  {
    id: 'ch4-l1', chapter: 4, levelInChapter: 1,
    title: 'Stone Gate',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.15, r1: 0, r2: 6.8, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.8, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone_gate', x: 5.0, y: 0.6, width: 0.4, height: 1.8, blockType: 'stone', hp: 3, supports: [] },
      { id: 'glass_lane', x: 6.8, y: 0.6, width: 0.35, height: 1.6, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: 'factored_form',
    hint: 'Stone wall is indestructible — arc over it. Glass wall shatters and the ball continues through to the target.',
    theme: THEME,
  },

  // ── 4-2 ──────────────────────────────────────────────────────────────────
  // 2-story tower (concrete base → wood mid → glass top). Target on top.
  // Stone blocker wall at x=4.5 forces arc to go high.
  // Kill vectors: (1) direct arc at target, (2) hit concrete base → cascade all 3 layers → target falls 2+ units
  {
    id: 'ch4-l2', chapter: 4, levelInChapter: 2,
    title: 'The Tower',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, r1: 0, r2: 6.25, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.05, y: 2.75, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'twr_glass' }],
    obstacles: [
      { id: 'stone_block', x: 4.5,  y: 0.6, width: 0.4,  height: 1.5, blockType: 'stone', hp: 3, supports: [] },
      { id: 'twr_base',   x: 6.8,  y: 0.6, width: 0.5,  height: 0.8, blockType: 'concrete', hp: 2, supports: ['twr_wood'] },
      { id: 'twr_wood',   x: 6.8,  y: 1.4, width: 0.5,  height: 0.6, blockType: 'wood',     hp: 2, supports: ['twr_glass'] },
      { id: 'twr_glass',  x: 6.8,  y: 2.0, width: 0.5,  height: 0.3, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Hit the concrete base — the whole tower cascades down and the target falls over 2 units.',
    theme: THEME,
  },

  // ── 4-3 ──────────────────────────────────────────────────────────────────
  // Enclosed chamber: stone left wall (∞), concrete right wall (2-hit), glass ceiling.
  // Target inside at ground level.
  // Kill vectors: (1) arc through glass ceiling → target, (2) destroy concrete right wall → ceiling falls → crushes target
  {
    id: 'ch4-l3', chapter: 4, levelInChapter: 3,
    title: 'Enclosed Chamber',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.10, r1: 0, r2: 6.2, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.2, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone_left',    x: 6.0, y: 0.6, width: 0.4,  height: 2.6, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'concrete_right',x: 8.4, y: 0.6, width: 0.4,  height: 2.6, blockType: 'concrete', hp: 2, supports: ['ceiling'] },
      { id: 'ceiling',       x: 6.0, y: 3.2, width: 2.8,  height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 3.8, radius: 0.28 },
    starThresholds: [2, 5], starMode: 'bonus',
    revealAfter: null,
    hint: 'Arc through the glass ceiling to hit the pig inside — or break the concrete wall and let the ceiling crush it.',
    theme: THEME,
  },

  // ── 4-4 ──────────────────────────────────────────────────────────────────
  // Staircase with 2 targets at different heights. 2 shots (multiShot).
  // Stone step 1 (∞), wood step 2 (2-hit), concrete step 3 (2-hit).
  // Target 1 on top of wood step, target 2 on top of concrete step.
  // Kill vectors: (1) direct arc at each target, (2) hit step base → step falls → target drops
  {
    id: 'ch4-l4', chapter: 4, levelInChapter: 4,
    title: 'Staircase Siege',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.14, r1: 0, r2: 5.5, k: 0 },
    launcher: LAUNCHER,
    multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        fshot('Shot 1 — Mid step target', -0.18, 0, 4.5),
        fshot('Shot 2 — High step target', -0.12, 0, 7.5),
      ],
    },
    targets: [
      { id: 't1', x: 5.95, y: 1.85, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'step2' },
      { id: 't2', x: 8.35, y: 2.65, radius: 0.42, pigType: 'letterman', hp: 1, moving: null, restingOn: 'step3' },
    ],
    obstacles: [
      { id: 'step1', x: 4.0, y: 0.6, width: 0.5, height: 0.5, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'step2', x: 5.7, y: 0.6, width: 0.5, height: 1.0, blockType: 'wood',     hp: 2, supports: [] },
      { id: 'step3', x: 8.1, y: 0.6, width: 0.5, height: 1.6, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 7], starMode: 'moves',
    revealAfter: null,
    hint: 'Two targets at different heights on the staircase. Arc must clear the lower steps to reach the top ones.',
    theme: THEME,
  },

  // ── 4-5 ──────────────────────────────────────────────────────────────────
  // Moat wall + enclosed tower. 2 shots.
  // Static moat wall at x=4.0 (∞). Tower: concrete base + wood mid + glass top (enclosed with stone sides).
  // Target inside tower at ground level.
  // Kill vectors: (1) arc over moat → through glass top → hits target inside,
  //               (2) break concrete base → tower cascades → pig exposed
  {
    id: 'ch4-l5', chapter: 4, levelInChapter: 5,
    title: 'Moat Fortress',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, r1: 0, r2: 6.2, k: 0 },
    launcher: LAUNCHER,
    multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        fshot('Shot 1 — Smash concrete base', -0.20, 0, 5.8),
        fshot('Shot 2 — Finish exposed pig', -0.10, 0, 6.2),
      ],
    },
    targets: [{ id: 'pig', x: 7.2, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'moat_wall',  x: 4.0, y: 0.6, width: 0.4,  height: 2.0 },
      { id: 'fort_left',  x: 6.5, y: 0.6, width: 0.35, height: 2.2, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort_base',  x: 6.9, y: 0.6, width: 0.75, height: 0.7, blockType: 'concrete', hp: 2, supports: ['fort_mid'] },
      { id: 'fort_mid',   x: 6.9, y: 1.3, width: 0.75, height: 0.6, blockType: 'wood',     hp: 2, supports: ['fort_roof'] },
      { id: 'fort_roof',  x: 6.85,y: 1.9, width: 1.2,  height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
      { id: 'fort_right', x: 8.1, y: 0.6, width: 0.35, height: 2.2, blockType: 'stone',    hp: 3, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: 'roots_and_zeros',
    hint: 'Stone walls protect the fortress — break the concrete base underneath to bring it down, then finish the pig.',
    theme: THEME,
  },

  // ── 4-6 ──────────────────────────────────────────────────────────────────
  // Twin structures: left = wood shelf with concrete pillar, right = glass cage.
  // 2 targets, 2 shots. r1 lands near left structure, r2 near right.
  // Kill vectors left: destroy concrete pillar → shelf drops → target falls.
  //              right: arc through glass cage walls → direct hit.
  {
    id: 'ch4-l6', chapter: 4, levelInChapter: 6,
    title: 'Two Landings',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: 0.5, max: 4.0, step: 0.1 },
      r2: { min: 4.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.10, r1: 2.0, r2: 7.5, k: 0 },
    launcher: LAUNCHER,
    multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        fshot('Shot 1 — Left shelf', -0.18, 0.5, 3.5),
        fshot('Shot 2 — Right cage', -0.08, 0, 7.5),
      ],
    },
    targets: [
      { id: 't1', x: 4.5,  y: 1.95, radius: 0.42, pigType: 'helmet',   hp: 1, moving: null, restingOn: 'shelf_l' },
      { id: 't2', x: 7.9,  y: 0.8,  radius: 0.42, pigType: 'letterman',hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'pl_l',   x: 3.8,  y: 0.6, width: 0.35, height: 1.0, blockType: 'concrete', hp: 2, supports: ['shelf_l'] },
      { id: 'pl_r',   x: 5.0,  y: 0.6, width: 0.35, height: 1.0, blockType: 'wood',     hp: 2, supports: ['shelf_l'] },
      { id: 'shelf_l',x: 3.8,  y: 1.6, width: 1.55, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
      { id: 'cage_l', x: 7.2,  y: 0.6, width: 0.35, height: 1.8, blockType: 'glass',    hp: 1, supports: ['cage_top'] },
      { id: 'cage_r', x: 8.5,  y: 0.6, width: 0.35, height: 1.8, blockType: 'glass',    hp: 1, supports: ['cage_top'] },
      { id: 'cage_top',x: 7.2, y: 2.4, width: 1.65, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: { x: 5.8, y: 2.5, radius: 0.28 },
    starThresholds: [3, 8], starMode: 'bonus',
    revealAfter: null,
    hint: 'Shot 1 collapses the left shelf. Shot 2 goes through the glass cage to hit the target inside.',
    theme: THEME,
  },

  // ── 4-7 ──────────────────────────────────────────────────────────────────
  // Castle with glass window + pig on roof. 2 shots, 2 targets.
  // Fortress: stone left, concrete right, glass ceiling. Pig 1 inside. Pig 2 on a wood shelf on top.
  // Kill vectors: Shot 1: through glass ceiling → inside pig. Shot 2: destroy concrete wall → ceiling drops → roof pig falls.
  {
    id: 'ch4-l7', chapter: 4, levelInChapter: 7,
    title: 'Castle Window',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.10, r1: 0, r2: 6.2, k: 0 },
    launcher: LAUNCHER,
    multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        fshot('Shot 1 — Through ceiling to inside pig', -0.10, 0, 6.2),
        fshot('Shot 2 — Destroy wall, drop roof pig',   -0.14, 0, 7.4),
      ],
    },
    targets: [
      { id: 'pig_inside', x: 7.2,  y: 0.8,  radius: 0.45, pigType: 'letterman', hp: 1, moving: null },
      { id: 'pig_roof',   x: 7.2,  y: 3.75, radius: 0.42, pigType: 'helmet',    hp: 1, moving: null, restingOn: 'roof_shelf' },
    ],
    obstacles: [
      { id: 'wall_l',    x: 6.0,  y: 0.6, width: 0.4,  height: 2.6,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'wall_r',    x: 8.4,  y: 0.6, width: 0.4,  height: 2.6,  blockType: 'concrete', hp: 2, supports: ['ceiling'] },
      { id: 'ceiling',   x: 6.0,  y: 3.2, width: 2.8,  height: 0.25, blockType: 'glass',    hp: 1, supports: ['roof_shelf'] },
      { id: 'roof_shelf',x: 6.4,  y: 3.45, width: 1.6, height: 0.25, blockType: 'wood',     hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 7], starMode: 'moves',
    revealAfter: 'multiple_roots',
    hint: 'Shot 1: arc through the glass ceiling to hit the pig inside. Shot 2: destroy the concrete wall to collapse everything onto the roof pig.',
    theme: THEME,
  },

  // ── 4-8 ──────────────────────────────────────────────────────────────────
  // Double-walled fortress with king pig inside. 2 shots.
  // Outer stone walls (∞), inner concrete walls (2-hit each), glass ceiling.
  // Glass window gap on left side near ground — narrow shooting lane.
  // Kill vectors: (1) arc through glass ceiling → 2 hits on king, (2) destroy inner concrete → ceiling collapses
  {
    id: 'ch4-l8', chapter: 4, levelInChapter: 8,
    title: "King's Fortress",
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.10, r1: 0, r2: 6.2, k: 0 },
    launcher: LAUNCHER,
    multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        fshot('Shot 1 — Break glass ceiling', -0.12, 0, 6.5),
        fshot('Shot 2 — Hit king inside',    -0.10, 0, 6.2),
      ],
    },
    targets: [{ id: 'king', x: 7.3, y: 0.8, radius: 0.55, pigType: 'king', hp: 2, moving: null }],
    obstacles: [
      { id: 'outer_l',  x: 5.6,  y: 0.6, width: 0.4,  height: 3.2, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'inner_l',  x: 6.2,  y: 0.6, width: 0.35, height: 2.8, blockType: 'concrete', hp: 2, supports: ['king_roof'] },
      { id: 'inner_r',  x: 8.2,  y: 0.6, width: 0.35, height: 2.8, blockType: 'concrete', hp: 2, supports: ['king_roof'] },
      { id: 'outer_r',  x: 8.7,  y: 0.6, width: 0.4,  height: 3.2, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'king_roof',x: 6.2,  y: 3.4, width: 2.35, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 8], starMode: 'moves',
    revealAfter: null,
    hint: 'King Pig takes 2 hits. Shot 1: smash the glass ceiling. Shot 2: finish the king through the open roof.',
    theme: THEME,
  },

  // ── 4-9 ──────────────────────────────────────────────────────────────────
  // Pyramid compound + glass cage. 2 targets, 3 shots.
  // Pyramid: concrete base → wood mid → glass top. Target 1 on pyramid top.
  // Glass cage beside pyramid. Target 2 inside cage.
  // Kill vectors pyramid: (1) direct to top, (2) hit base → cascade → target falls.
  // Kill vectors cage: (1) arc through glass cage → direct hit.
  {
    id: 'ch4-l9', chapter: 4, levelInChapter: 9,
    title: 'Pyramid Compound',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, r1: 0, r2: 5.8, k: 0 },
    launcher: LAUNCHER,
    multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        fshot('Shot 1 — Hit pyramid base',  -0.15, 0, 5.0),
        fshot('Shot 2 — Finish pyramid pig',-0.12, 0, 5.8),
        fshot('Shot 3 — Glass cage pig',    -0.08, 0, 7.8),
      ],
    },
    targets: [
      { id: 'pyr_pig',  x: 6.8,  y: 2.25, radius: 0.42, pigType: 'helmet',    hp: 1, moving: null, restingOn: 'pyr_top' },
      { id: 'cage_pig', x: 8.6,  y: 0.8,  radius: 0.42, pigType: 'letterman', hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'pyr_base', x: 5.8,  y: 0.6, width: 2.0,  height: 0.5,  blockType: 'concrete', hp: 2, supports: ['pyr_mid'] },
      { id: 'pyr_mid',  x: 6.15, y: 1.1, width: 1.3,  height: 0.4,  blockType: 'wood',     hp: 2, supports: ['pyr_top'] },
      { id: 'pyr_top',  x: 6.45, y: 1.5, width: 0.7,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'cage_l',   x: 8.0,  y: 0.6, width: 0.35, height: 1.8,  blockType: 'glass',    hp: 1, supports: ['cage_roof'] },
      { id: 'cage_r',   x: 9.2,  y: 0.6, width: 0.35, height: 1.8,  blockType: 'glass',    hp: 1, supports: ['cage_roof'] },
      { id: 'cage_roof',x: 8.0,  y: 2.4, width: 1.55, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 3.0, radius: 0.28 },
    starThresholds: [3, 8], starMode: 'bonus',
    revealAfter: null,
    hint: 'Hit the pyramid base — it cascades and drops the pig. Then arc through the glass cage to finish the second target.',
    theme: THEME,
  },

  // ── 4-10 ─────────────────────────────────────────────────────────────────
  // Compound finale: 3 targets, 3 shots.
  // Structure 1 (left): concrete tower with pig on top.
  // Structure 2 (center): enclosed stone/concrete fortress with king pig inside.
  // Structure 3 (right): moving cool pig behind a glass wall.
  {
    id: 'ch4-l10', chapter: 4, levelInChapter: 10,
    title: 'Compound Finale',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.14, r1: 0, r2: 3.5, k: 0 },
    launcher: LAUNCHER,
    multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        fshot('Shot 1 — Left tower pig',    -0.20, 0, 3.5),
        fshot('Shot 2 — Fortress ceiling',  -0.12, 0, 5.8),
        fshot('Shot 3 — Moving pig',        -0.08, 0, 8.2),
      ],
    },
    targets: [
      { id: 'twr_pig',  x: 4.55, y: 2.15, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'twr4_top' },
      { id: 'king',     x: 6.7,  y: 0.8,  radius: 0.55, pigType: 'king',   hp: 1, moving: null },
      { id: 'cool',     x: 8.8,  y: 0.8,  radius: 0.42, pigType: 'cool',   hp: 1,
        moving: { axis: 'x', min: 8.2, max: 9.3, speed: 1.5 } },
    ],
    obstacles: [
      { id: 'twr4_base', x: 4.2, y: 0.6, width: 0.5, height: 0.9,  blockType: 'concrete', hp: 2, supports: ['twr4_top'] },
      { id: 'twr4_top',  x: 4.2, y: 1.5, width: 0.5, height: 0.4,  blockType: 'wood',     hp: 2, supports: [] },
      { id: 'fort_l',    x: 6.0, y: 0.6, width: 0.35, height: 2.4, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort_r',    x: 7.5, y: 0.6, width: 0.35, height: 2.4, blockType: 'concrete', hp: 2, supports: ['fort_ceil'] },
      { id: 'fort_ceil', x: 6.0, y: 3.0, width: 1.85, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
      { id: 'glass_bar', x: 7.9, y: 0.6, width: 0.35, height: 1.8, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [4, 9], starMode: 'moves',
    revealAfter: 'discriminant',
    hint: 'Three structures, three shots. Topple the tower, break into the fortress, then time the moving pig.',
    theme: THEME,
  },
];
