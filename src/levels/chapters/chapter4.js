// Chapter 4: ROOTS — y = a(x−r₁)(x−r₂)
// Factored form. r₁ and r₂ are where the arc crosses y=0 (ground level of launcher).
// Arc starts at local x=0 (launcher). Player controls a, r1, r2.
// With r1=0 locked: y_local = a*x*(x-r2). Arc starts at 0 ✓.

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'mountain';

export const CHAPTER_4 = [
  // ── 4-1 ──────────────────────────────────────────────────────────────────
  // r2 controls landing — pig on ground behind single glass block.
  // Glass block at x=6.8 (0.4 wide). Pig at x=7.8.
  // Hit glass OR arc clears it; r2≈7.8 to land on pig.
  {
    id: 'ch4-l1', chapter: 4, levelInChapter: 1,
    title: 'Ground Zero',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.15, r1: 0, r2: 7.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.8, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'glass_wall', x: 6.8, y: 0.6, width: 0.4, height: 0.9, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'r₂ is where the arc lands. Set it past the glass to reach the pig.',
    theme: THEME,
  },

  // ── 4-2 ──────────────────────────────────────────────────────────────────
  // Pig on low glass shelf (Archetype A). Two wood pillars + glass shelf.
  // Pillar L: x=5.5, y=0.6, h=0.7. Pillar R: x=7.0, y=0.6, h=0.7.
  // Shelf: x=5.5, y=1.3, w=1.9, h=0.25. Pig y = 1.3+0.25+0.45 = 2.0.
  // r2≈5.0 to arc hits left pillar (x≈5.7); shelf falls on pig.
  {
    id: 'ch4-l2', chapter: 4, levelInChapter: 2,
    title: 'Shelf Shot',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r2: { min: 2.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, r1: 0, r2: 5.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.3, y: 2.0, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'pillar_l', x: 5.5,  y: 0.6, width: 0.35, height: 0.7, blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'pillar_r', x: 7.0,  y: 0.6, width: 0.35, height: 0.7, blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'shelf',    x: 5.5,  y: 1.3, width: 1.9,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Hit a pillar — the shelf falls and takes the pig with it.',
    theme: THEME,
  },

  // ── 4-3 ──────────────────────────────────────────────────────────────────
  // Pig on elevated glass shelf atop two stone pillars (Archetype A elevated).
  // Stone pillar L: x=6.0, y=0.6, h=1.6. Stone pillar R: x=7.5, y=0.6, h=1.6.
  // Shelf: x=6.0, y=2.2, w=1.9, h=0.25. Pig y = 2.2+0.25+0.45 = 2.9.
  // Arc on the way up (r2>6.0): hits shelf at x≈6.5, pig drops.
  {
    id: 'ch4-l3', chapter: 4, levelInChapter: 3,
    title: 'High Shelf',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r2: { min: 4.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.10, r1: 0, r2: 8.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.9, y: 2.9, radius: 0.45, pigType: 'letterman', hp: 1, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'stone_l', x: 6.0, y: 0.6, width: 0.35, height: 1.6, blockType: 'stone', hp: 3, supports: ['shelf'] },
      { id: 'stone_r', x: 7.5, y: 0.6, width: 0.35, height: 1.6, blockType: 'stone', hp: 3, supports: ['shelf'] },
      { id: 'shelf',   x: 6.0, y: 2.2, width: 1.9,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.0, y: 3.5, radius: 0.3 },
    starThresholds: [2, 5], starMode: 'bonus',
    revealAfter: null,
    hint: 'Target is high up. The arc passes through the shelf on the way up — r₂ > target x.',
    theme: THEME,
  },

  // ── 4-4 ──────────────────────────────────────────────────────────────────
  // Staircase (Archetype H). Three blocks ascending right to left — pig at top.
  // Block 1 (low):  x=5.5, y=0.6, w=0.5, h=0.5 (glass).
  // Block 2 (mid):  x=6.5, y=0.6, w=0.5, h=1.0 (wood).
  // Block 3 (high): x=7.5, y=0.6, w=0.5, h=1.5 (stone).
  // Pig on top of stone block: y = 0.6+1.5+0.45 = 2.55.
  // Both r1 and r2 unlocked so player can thread the arc over low blocks.
  {
    id: 'ch4-l4', chapter: 4, levelInChapter: 4,
    title: 'Staircase',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 3.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, r1: 0, r2: 6.5, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.75, y: 2.55, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'step3' }],
    obstacles: [
      { id: 'step1', x: 5.5, y: 0.6, width: 0.5, height: 0.5, blockType: 'glass', hp: 1, supports: [] },
      { id: 'step2', x: 6.5, y: 0.6, width: 0.5, height: 1.0, blockType: 'wood',  hp: 2, supports: [] },
      { id: 'step3', x: 7.5, y: 0.6, width: 0.5, height: 1.5, blockType: 'stone', hp: 3, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Staircase of blocks — pig is on the tallest. Arc must clear the lower steps and land on the top.',
    theme: THEME,
  },

  // ── 4-5 ──────────────────────────────────────────────────────────────────
  // Moat + tower (Archetype J). Static wall at x=4.0, wood tower behind at x=6.5.
  // Tower: stone base + wood mid + glass top. Pig on top.
  // Static wall: x=4.0, h=2.2. Tower base: x=6.5, h=0.6. Mid: x=6.5, y=1.2, h=0.5. Top: y=1.7, h=0.25.
  // Pig y = 1.7+0.25+0.45 = 2.4.
  {
    id: 'ch4-l5', chapter: 4, levelInChapter: 5,
    title: 'Moat Tower',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 3.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.15, r1: 0, r2: 7.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.05, y: 2.4, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'tower_top' }],
    obstacles: [
      { id: 'wall',       x: 4.0,  y: 0.6, width: 0.4,  height: 2.2 },
      { id: 'tower_base', x: 6.6,  y: 0.6, width: 0.5,  height: 0.6, blockType: 'stone', hp: 3, supports: ['tower_mid'] },
      { id: 'tower_mid',  x: 6.6,  y: 1.2, width: 0.5,  height: 0.5, blockType: 'wood',  hp: 2, supports: ['tower_top'] },
      { id: 'tower_top',  x: 6.6,  y: 1.7, width: 0.5,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Wall blocks the approach. Arc must clear it, then hit the tower. Destroy the glass top to drop the pig.',
    theme: THEME,
  },

  // ── 4-6 ──────────────────────────────────────────────────────────────────
  // Two pigs: one on left shelf (A), one on right shelf (A).
  // r1 hits left structure, r2 hits right structure.
  // Left shelf: pillars at x=4.2 & 5.4, shelf at y=1.3, pig y=2.0.
  // Right shelf: pillars at x=7.0 & 8.2, shelf at y=1.0, pig y=1.7.
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
    defaultParams: { a: -0.12, r1: 1.0, r2: 7.0, k: 0 },
    launcher: LAUNCHER,
    targets: [
      { id: 't1', x: 4.9,  y: 2.0, radius: 0.40, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf_l' },
    ],
    obstacles: [
      { id: 'pl_ll', x: 4.2,  y: 0.6, width: 0.3, height: 0.7, blockType: 'wood',  hp: 2, supports: ['shelf_l'] },
      { id: 'pl_lr', x: 5.4,  y: 0.6, width: 0.3, height: 0.7, blockType: 'wood',  hp: 2, supports: ['shelf_l'] },
      { id: 'shelf_l', x: 4.2, y: 1.3, width: 1.5, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'pl_rl', x: 7.0,  y: 0.6, width: 0.3, height: 0.4, blockType: 'wood',  hp: 2, supports: ['shelf_r'] },
      { id: 'pl_rr', x: 8.2,  y: 0.6, width: 0.3, height: 0.4, blockType: 'wood',  hp: 2, supports: ['shelf_r'] },
      { id: 'shelf_r', x: 7.0, y: 1.0, width: 1.5, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Both roots hit structures. r₁ takes out the left shelf, r₂ the right.',
    theme: THEME,
  },

  // ── 4-7 ──────────────────────────────────────────────────────────────────
  // Castle with window (Archetype F partial). Stone sides, glass roof, pig inside.
  // Left wall: x=6.0, y=0.6, w=0.35, h=2.2 (stone).
  // Right wall: x=8.2, y=0.6, w=0.35, h=2.2 (stone).
  // Glass roof: x=6.0, y=2.8, w=2.55, h=0.25 (glass).
  // Window = gap between walls above ground. Pig at center: x=7.275, y=0.8.
  // Arc passes through glass roof hole to reach pig below.
  {
    id: 'ch4-l7', chapter: 4, levelInChapter: 7,
    title: 'Castle Window',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 3.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.10, r1: 0, r2: 8.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.275, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall_l',  x: 6.0,  y: 0.6, width: 0.35, height: 2.45, blockType: 'stone', hp: 3, supports: ['roof'] },
      { id: 'wall_r',  x: 8.2,  y: 0.6, width: 0.35, height: 2.45, blockType: 'stone', hp: 3, supports: ['roof'] },
      { id: 'roof',    x: 6.0,  y: 3.05, width: 2.55, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 4.0, radius: 0.3 },
    starThresholds: [2, 6], starMode: 'bonus',
    revealAfter: null,
    hint: 'Hit the glass roof — once it shatters, finish the pig below.',
    theme: THEME,
  },

  // ── 4-8 ──────────────────────────────────────────────────────────────────
  // King pig in thick fortress (Archetype F thick). Two outer stone walls,
  // inner wood walls, glass roof. King inside at ground level.
  // Outer walls: x=5.5 & 8.8 (stone h=2.8).
  // Inner walls: x=6.1 & 8.2 (wood h=2.4).
  // Glass ceiling: x=6.1, y=3.0, w=2.1, h=0.25.
  // King pig: x=7.15, y=0.8, hp=3.
  {
    id: 'ch4-l8', chapter: 4, levelInChapter: 8,
    title: "King's Fortress",
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 3.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.14, r1: 0, r2: 7.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 7.15, y: 0.8, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'outer_l', x: 5.5,  y: 0.6, width: 0.4, height: 2.8, blockType: 'stone', hp: 3, supports: [] },
      { id: 'inner_l', x: 6.1,  y: 0.6, width: 0.35, height: 2.4, blockType: 'wood',  hp: 2, supports: ['ceiling'] },
      { id: 'inner_r', x: 8.2,  y: 0.6, width: 0.35, height: 2.4, blockType: 'wood',  hp: 2, supports: ['ceiling'] },
      { id: 'outer_r', x: 8.8,  y: 0.6, width: 0.4, height: 2.8, blockType: 'stone', hp: 3, supports: [] },
      { id: 'ceiling', x: 6.1,  y: 3.0, width: 2.5,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 8], starMode: 'moves',
    revealAfter: null,
    hint: 'King Pig takes 3 hits. Break the ceiling first, then crack the inner wall to reach him.',
    theme: THEME,
  },

  // ── 4-9 ──────────────────────────────────────────────────────────────────
  // Pig on pyramid (Archetype G). Stone base wide, wood mid, glass top, pig atop.
  // Stone base: x=6.0, y=0.6, w=2.0, h=0.5. Wood mid: x=6.35, y=1.1, w=1.3, h=0.4.
  // Glass top: x=6.65, y=1.5, w=0.7, h=0.25. Pig y=1.5+0.25+0.45=2.2.
  // Bonus ring above pyramid.
  {
    id: 'ch4-l9', chapter: 4, levelInChapter: 9,
    title: 'Pyramid',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 3.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.12, r1: 0, r2: 8.5, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.0, y: 2.2, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'pyr_top' }],
    obstacles: [
      { id: 'pyr_base', x: 6.0,  y: 0.6, width: 2.0,  height: 0.5, blockType: 'stone', hp: 3, supports: ['pyr_mid'] },
      { id: 'pyr_mid',  x: 6.35, y: 1.1, width: 1.3,  height: 0.4, blockType: 'wood',  hp: 2, supports: ['pyr_top'] },
      { id: 'pyr_top',  x: 6.65, y: 1.5, width: 0.7,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 5.0, y: 2.8, radius: 0.28 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Hit the base to topple the pyramid. Bonus ring above — thread the arc through it for 3★.',
    theme: THEME,
  },

  // ── 4-10 ─────────────────────────────────────────────────────────────────
  // Moving pig patrolling behind a staircase (Archetype H + moving).
  // Staircase blocks the approach. Moving pig at y=0.8 sweeps behind it.
  // Step1 glass x=5.0 h=0.5. Step2 wood x=6.0 h=1.0. Step3 stone x=7.0 h=1.5.
  // Pig moving behind step3 from x=7.5 to x=9.0.
  {
    id: 'ch4-l10', chapter: 4, levelInChapter: 10,
    title: 'Speed Root',
    equationForm: 'factored',
    activeCoefficients: ['a', 'r1', 'r2', 'k'],
    sliderConfig: {
      a:  { min: -0.45, max: -0.02, step: 0.01 },
      r1: { min: -1.0, max: 2.0, step: 0.1 },
      r2: { min: 3.0, max: 9.0, step: 0.1 },
      k:  { min: -2, max: 6, step: 0.1 },
    },
    defaultParams: { a: -0.14, r1: 0, r2: 7.5, k: 0 },
    launcher: LAUNCHER,
    targets: [{
      id: 'cool', x: 8.0, y: 0.8, radius: 0.42, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 7.6, max: 9.0, speed: 1.5 },
    }],
    obstacles: [
      { id: 'stair1', x: 5.0, y: 0.6, width: 0.5, height: 0.5, blockType: 'glass', hp: 1, supports: [] },
      { id: 'stair2', x: 6.0, y: 0.6, width: 0.5, height: 1.0, blockType: 'wood',  hp: 2, supports: [] },
      { id: 'stair3', x: 7.0, y: 0.6, width: 0.5, height: 1.5, blockType: 'stone', hp: 3, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Moving pig behind the staircase. Arc must clear the tallest step — then time the landing.',
    theme: THEME,
  },
];
