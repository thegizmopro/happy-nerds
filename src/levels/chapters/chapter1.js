// Chapter 1: STRETCH — y = ax²
// Launcher on a platform at (1, 2.5). Arc descends to targets below.
// Player controls only 'a'. Bigger |a| = narrower/steeper arc = shorter range.
//
// Math: worldY = 2.5 + a*(worldX - 1)²
// Exact a to hit target at (tx, ty): a = (ty - 2.5) / (tx - 1)²
//
// Design: Early game introduces materials gradually.
// L1: No obstacles (tutorial). L2-3: Glass only. L4-5: Glass + wood.
// L6-7: Concrete + wood + glass. L8-10: Multi-story + cascade chains.
// Kill vectors: direct shot, fall (destroy support), crush (cascade).

const LAUNCHER = { x: 1, y: 2.5 };
const THEME = 'desert';

export const CHAPTER_1 = [
  // ── 1-1 ──────────────────────────────────────────────────────────────────
  // Pure tutorial: no obstacles, just find the right a to hit the target.
  // Exact a = (0.0 - 2.5) / (4.0 - 1)² = -2.5 / 9 ≈ -0.278
  {
    id: 'ch1-l1', chapter: 1, levelInChapter: 1,
    title: 'First Shot',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.70, max: -0.05, step: 0.01 } },
    defaultParams: { a: -0.17, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'main', x: 4.0, y: 0, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [],
    bonusRing: null,
    bonusShots: 0,
    starThresholds: [1, 1], starMode: 'moves',
    revealAfter: 'what_is_a_function',
    hint: 'Drag a to change the arc. Bigger |a| = steeper drop = shorter range.',
    theme: THEME,
  },

  // ── 1-2 ──────────────────────────────────────────────────────────────────
  // Glass cage: target behind glass walls. Ball passes through glass.
  // Introduces: glass shatters, ball continues.
  // Exact a = (1.05 - 2.5) / (5.8 - 1)² = -1.45 / 23.04 ≈ -0.063
  {
    id: 'ch1-l2', chapter: 1, levelInChapter: 2,
    title: 'Glass House',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.16, max: -0.02, step: 0.005 } },
    defaultParams: { a: -0.04, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 5.8, y: 1.2, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'glass_floor' }],
    obstacles: [
      { id: 'glass_wall_l', x: 4.6, y: 0, width: 0.3,  height: 0.8,  blockType: 'glass', hp: 1, supports: ['glass_floor'] },
      { id: 'glass_wall_r', x: 6.8, y: 0, width: 0.3,  height: 0.8,  blockType: 'glass', hp: 1, supports: ['glass_floor'] },
      { id: 'glass_floor',  x: 4.6, y: 0.8, width: 2.5,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: null,
    hint: 'Glass shatters on contact and the ball keeps going. Arc through the glass walls to reach the target.',
    theme: THEME,
  },

  // ── 1-3 ──────────────────────────────────────────────────────────────────
  // Glass shelf with target on top. Destroy shelf → target falls.
  // Introduces: falling kills (destroy restingOn block).
  // Exact a = (1.25 - 2.5) / (6.5 - 1)² = -1.25 / 30.25 ≈ -0.041
  {
    id: 'ch1-l3', chapter: 1, levelInChapter: 3,
    title: 'Shelf Shot',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.10, max: -0.01, step: 0.005 } },
    defaultParams: { a: -0.025, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.5, y: 1.7, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'p_l',   x: 5.5, y: 0, width: 0.4, height: 1.0, blockType: 'wood', hp: 2, supports: ['shelf'] },
      { id: 'p_r',   x: 7.2, y: 0, width: 0.4, height: 1.0, blockType: 'wood', hp: 2, supports: ['shelf'] },
      { id: 'shelf', x: 5.5, y: 1, width: 2.1, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: 'leading_coefficient',
    hint: 'Hit the glass shelf — it shatters and the target falls. Or arc directly to the target for a direct hit.',
    theme: THEME,
  },

  // ── 1-4 ──────────────────────────────────────────────────────────────────
  // Stone wall (indestructible) forces arc over it. Target behind wall at ground level.
  // Introduces: stone = permanent barrier, must arc over.
  // Exact a = (0.0 - 2.5) / (6.8 - 1)² = -2.5 / 33.64 ≈ -0.074
  {
    id: 'ch1-l4', chapter: 1, levelInChapter: 4,
    title: 'Over the Wall',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.19, max: -0.02, step: 0.005 } },
    defaultParams: { a: -0.045, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.8, y: 0, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone_wall', x: 4.5, y: 0, width: 0.5, height: 2.0, blockType: 'stone', hp: 3, supports: [] },
      { id: 'glass_lane', x: 5.8, y: 0, width: 0.35, height: 1.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: null,
    hint: 'Stone is indestructible — you can\'t break it. Flatten the arc to clear the wall and hit the target behind it.',
    theme: THEME,
  },

  // ── 1-5 ──────────────────────────────────────────────────────────────────
  // Stacked tower: concrete base, wood mid, glass top. Target on top.
  // Kill vectors: (1) direct arc at target, (2) hit concrete base → cascade → target falls.
  // Exact a = (1.7 - 2.5) / (5.8 - 1)² = -0.8 / 23.04 ≈ -0.035
  {
    id: 'ch1-l5', chapter: 1, levelInChapter: 5,
    title: 'The Tower',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.09, max: -0.01, step: 0.002 } },
    defaultParams: { a: -0.021, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 5.8, y: 2.5, radius: 0.45, pigType: 'letterman', hp: 1, moving: null, restingOn: 'glass_top' }],
    obstacles: [
      { id: 'concrete_base', x: 5.5, y: 0, width: 0.6, height: 0.8, blockType: 'concrete', hp: 2, supports: ['wood_mid'] },
      { id: 'wood_mid',      x: 5.5, y: 0.8, width: 0.6, height: 0.6, blockType: 'wood',     hp: 2, supports: ['glass_top'] },
      { id: 'glass_top',     x: 5.5, y: 1.4, width: 0.6, height: 0.3, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: 'wider_vs_narrower',
    hint: 'Hit the concrete base to collapse the whole tower — the target falls over 2 units. Or arc gently to the top.',
    theme: THEME,
  },

  // ── 1-6 ──────────────────────────────────────────────────────────────────
  // Enclosed chamber: stone left wall (∞), concrete right wall (2-hit), glass ceiling.
  // Target inside at ground level.
  // Kill vectors: (1) arc through glass ceiling → direct hit, (2) break concrete wall → ceiling falls → crushes target.
  // Exact a = (0.0 - 2.5) / (7.2 - 1)² = -2.5 / 38.44 ≈ -0.065
  {
    id: 'ch1-l6', chapter: 1, levelInChapter: 6,
    title: 'Enclosed',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.16, max: -0.02, step: 0.005 } },
    defaultParams: { a: -0.039, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.2, y: 0, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone_left',     x: 6.0, y: 0, width: 0.4, height: 2.4, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'concrete_right', x: 8.4, y: 0, width: 0.4, height: 2.4, blockType: 'concrete', hp: 2, supports: ['ceiling'] },
      { id: 'ceiling',        x: 6.0, y: 2.4, width: 2.8, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 2.9, radius: 0.28 },
    bonusShots: 1,
    starThresholds: [1, 2], starMode: 'bonus',
    revealAfter: null,
    hint: 'Arc through the glass ceiling to hit the target inside. Or break the concrete wall to collapse the ceiling.',
    theme: THEME,
  },

  // ── 1-7 ──────────────────────────────────────────────────────────────────
  // Two-story fortress: stone ground floor, wood + glass upper floor.
  // Target on glass beam (2nd floor). Destroy concrete pillars → whole floor drops.
  // Exact a = (2.2 - 2.5) / (6.5 - 1)² = -0.3 / 30.25 ≈ -0.010
  {
    id: 'ch1-l7', chapter: 1, levelInChapter: 7,
    title: 'Two Stories',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.025, max: -0.003, step: 0.002 } },
    defaultParams: { a: -0.006, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.5, y: 2.9, radius: 0.45, pigType: 'letterman', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'col_l1',     x: 5.5, y: 0, width: 0.4, height: 1.0, blockType: 'concrete', hp: 2, supports: ['floor1'] },
      { id: 'col_r1',     x: 7.2, y: 0, width: 0.4, height: 1.0, blockType: 'concrete', hp: 2, supports: ['floor1'] },
      { id: 'floor1',     x: 5.5, y: 1, width: 2.1, height: 0.25, blockType: 'concrete', hp: 2, supports: ['col_l2', 'col_r2'] },
      { id: 'col_l2',     x: 5.5, y: 1.25, width: 0.35, height: 0.7, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'col_r2',     x: 7.2, y: 1.25, width: 0.35, height: 0.7, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'glass_beam', x: 5.5, y: 1.95, width: 2.1, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: null,
    hint: 'Two-story building. Hit the concrete pillars on the ground floor to collapse the whole thing.',
    theme: THEME,
  },

  // ── 1-8 ──────────────────────────────────────────────────────────────────
  // Moving target on a glass shelf. Lock arc height, then time the shot.
  // Target slides between two wood pillars.
  // Exact a = (1.15 - 2.5) / (6.2 - 1)² = -1.35 / 27.04 ≈ -0.050
  {
    id: 'ch1-l8', chapter: 1, levelInChapter: 8,
    title: 'Moving Target',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.13, max: -0.015, step: 0.005 } },
    defaultParams: { a: -0.030, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{
      id: 'pig', x: 6.2, y: 1.6, radius: 0.45, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.65, max: 6.75, speed: 1.3 },
      restingOn: 'shelf',
    }],
    obstacles: [
      { id: 'p_l',   x: 5.2, y: 0, width: 0.4, height: 0.9, blockType: 'wood', hp: 2, supports: ['shelf'] },
      { id: 'p_r',   x: 6.8, y: 0, width: 0.4, height: 0.9, blockType: 'wood', hp: 2, supports: ['shelf'] },
      { id: 'shelf', x: 5.2, y: 0.9, width: 2.0, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    bonusShots: 0,
    starThresholds: [1, 1], starMode: 'moves',
    revealAfter: 'real_world_parabolas',
    hint: 'The target slides on the glass shelf. Dial in the right arc height, then wait for the moment.',
    theme: THEME,
  },

  // ── 1-9 ──────────────────────────────────────────────────────────────────
  // Double chamber: stone divider + two glass cages. Two targets.
  // One shot must pass through a glass cage to reach target.
  // Left cage: glass ceiling + target. Right cage: glass wall + target.
  // The single a control means both targets share the same arc shape —
  // ball passes through glass in the left cage, continues to right cage.
  // Exact a = (0.25 - 2.5) / (7.2 - 1)² = -2.25 / 38.44 ≈ -0.059
  {
    id: 'ch1-l9', chapter: 1, levelInChapter: 9,
    title: 'Double Chamber',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.15, max: -0.02, step: 0.005 } },
    defaultParams: { a: -0.035, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.2, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'glass_floor' }],
    obstacles: [
      { id: 'stone_divider', x: 4.8, y: 0, width: 0.4, height: 2.2, blockType: 'stone', hp: 3, supports: [] },
      { id: 'glass_floor',   x: 6.2, y: 0, width: 2.0, height: 0.25, blockType: 'glass', hp: 1, supports: ['glass_wall_l', 'glass_wall_r'] },
      { id: 'glass_wall_l', x: 6.2, y: 0.25, width: 0.3, height: 1.2, blockType: 'glass', hp: 1, supports: ['glass_roof'] },
      { id: 'glass_wall_r', x: 8.0, y: 0.25, width: 0.3, height: 1.2, blockType: 'glass', hp: 1, supports: ['glass_roof'] },
      { id: 'glass_roof',   x: 6.2, y: 1.45, width: 2.1, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.0, y: 2.9, radius: 0.28 },
    bonusShots: 1,
    starThresholds: [1, 2], starMode: 'bonus',
    revealAfter: null,
    hint: 'Stone divider blocks direct shots. Arc over it, through the glass cage, to reach the target inside.',
    theme: THEME,
  },

  // ── 1-10 ─────────────────────────────────────────────────────────────────
  // Fortress finale: stone walls + concrete base + glass ceiling. King target inside.
  // Kill vectors: (1) arc through glass ceiling, (2) destroy concrete base → ceiling collapses → crushes king.
  // King hp: 1 (stretch form only has 1 shot, so king must be 1-hittable).
  // Exact a = (0.2 - 2.5) / (7.2 - 1)² = -2.3 / 38.44 ≈ -0.060
  {
    id: 'ch1-l10', chapter: 1, levelInChapter: 10,
    title: 'The Fortress',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.15, max: -0.02, step: 0.002 } },
    defaultParams: { a: -0.036, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 7.2, y: 0.2, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall_front',  x: 4.2, y: 0, width: 0.5, height: 2.8, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort_left',   x: 6.0, y: 0, width: 0.4, height: 2.0, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort_base',   x: 6.4, y: 0, width: 1.2, height: 0.7, blockType: 'concrete', hp: 2, supports: ['fort_ceil'] },
      { id: 'fort_right',  x: 8.2, y: 0, width: 0.4, height: 2.0, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort_ceil',   x: 6.0, y: 2.0, width: 2.6, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: null,
    bonusShots: 1,
    starThresholds: [1, 2], starMode: 'moves',
    revealAfter: null,
    hint: 'Stone fortress with a glass ceiling. Arc over the front wall, through the ceiling, to hit the king inside. Or break the concrete base to collapse everything.',
    theme: THEME,
  },
];
