// Chapter 1: STRETCH — y = ax²
// Launcher elevated at (1, 4.5). Arc descends to targets below.
// Player controls only 'a'. Bigger |a| = narrower/steeper arc = shorter range.
//
// Math: worldY = 4.5 + a*(worldX - 1)²
// Exact a to hit target at (tx, ty): a = (ty - 4.5) / (tx - 1)²

const LAUNCHER = { x: 1, y: 4.5 };
const THEME = 'desert';

export const CHAPTER_1 = [
  {
    id: 'ch1-l1', chapter: 1, levelInChapter: 1,
    title: 'First Shot',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.05, step: 0.01 } },
    defaultParams: { a: -0.20, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'main', x: 4.0, y: 0.6, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [], bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Drag a to change the arc. Bigger |a| = steeper drop = shorter range.',
    theme: THEME,
  },
  {
    id: 'ch1-l2', chapter: 1, levelInChapter: 2,
    title: 'Shelf Shot',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.05, step: 0.01 } },
    defaultParams: { a: -0.20, h: 0, k: 0 },
    launcher: LAUNCHER,
    // Exact a = (2.2 - 4.5) / (6.2 - 1)² = -2.3 / 27.04 ≈ -0.085
    // Default a=-0.20 hits left pillar, drops before reaching pig
    targets: [{ id: 'pig', x: 6.2, y: 2.20, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'p_l',  x: 5.2, y: 0.6, width: 0.4, height: 0.9,  blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'p_r',  x: 6.8, y: 0.6, width: 0.4, height: 0.9,  blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'shelf',x: 5.2, y: 1.5, width: 2.0, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'The pig sits on a glass shelf. Flatten the arc to reach shelf height — the glass shatters on contact.',
    theme: THEME,
  },
  {
    id: 'ch1-l3', chapter: 1, levelInChapter: 3,
    title: 'Wide Shelf',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.06, h: 0, k: 0 },
    launcher: LAUNCHER,
    // Exact a = (2.3 - 4.5) / (7.8 - 1)² = -2.2 / 46.24 ≈ -0.048
    // Default a=-0.06: arc hits glass shelf (y≈1.73 at x=7.8) but misses pig above it
    targets: [{ id: 'pig', x: 7.8, y: 2.30, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'p_l',  x: 7.0, y: 0.6, width: 0.4, height: 1.0,  blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'p_r',  x: 8.2, y: 0.6, width: 0.4, height: 1.0,  blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'shelf',x: 7.0, y: 1.6, width: 1.6, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: 'leading_coefficient',
    hint: 'Farther and higher. The default arc shatters the shelf but misses the pig — flatten it more.',
    theme: THEME,
  },
  {
    id: 'ch1-l4', chapter: 1, levelInChapter: 4,
    title: 'Leaning Tower',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.12, h: 0, k: 0 },
    launcher: LAUNCHER,
    // Exact a = (2.45 - 4.5) / (5.75 - 1)² = -2.05 / 22.56 ≈ -0.091
    // Default a=-0.12: arc hits glass (y≈1.79), pig at y=2.45 survives
    targets: [{ id: 'pig', x: 5.75, y: 2.45, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'glass' }],
    obstacles: [
      { id: 'stone', x: 5.5, y: 0.6, width: 0.5, height: 0.5, blockType: 'concrete', hp: 2, supports: ['wood'] },
      { id: 'wood',  x: 5.5, y: 1.1, width: 0.5, height: 0.5, blockType: 'wood',  hp: 2, supports: ['glass'] },
      { id: 'glass', x: 5.5, y: 1.6, width: 0.5, height: 0.4, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Three layers — stone, wood, glass. The pig sits above all of them. Flatten the arc to reach it.',
    theme: THEME,
  },
  {
    id: 'ch1-l5', chapter: 1, levelInChapter: 5,
    title: 'The Penthouse',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.20, max: -0.02, step: 0.002 } },
    defaultParams: { a: -0.06, h: 0, k: 0 },
    launcher: LAUNCHER,
    // Exact a = (3.10 - 4.5) / (6.8 - 1)² = -1.4 / 33.64 ≈ -0.042
    // Default a=-0.06: hits glass shelf (y≈2.48 at x=6.8), pig at y=3.10 survives
    targets: [{ id: 'pig', x: 6.8, y: 3.10, radius: 0.45, pigType: 'letterman', hp: 1, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'col_l', x: 5.8, y: 0.6, width: 0.4, height: 1.8,  blockType: 'concrete', hp: 2, supports: ['shelf'] },
      { id: 'col_r', x: 7.4, y: 0.6, width: 0.4, height: 1.8,  blockType: 'concrete', hp: 2, supports: ['shelf'] },
      { id: 'shelf', x: 5.8, y: 2.4, width: 2.0, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'The pig is way up high. Only a very gentle arc can reach it — keep a close to zero.',
    theme: THEME,
  },
  {
    id: 'ch1-l6', chapter: 1, levelInChapter: 6,
    title: 'Behind the Wall',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.22, h: 0, k: 0 },
    launcher: LAUNCHER,
    // Exact a = (0.6 - 4.5) / (6.8 - 1)² = -3.9 / 33.64 ≈ -0.116
    // Default a=-0.22: arc y≈2.78 at x=3.8, wall top=2.8 — just clips the wall
    // Solution arc clears wall (y=3.43), clips left wood wall, hits pig
    targets: [{ id: 'pig', x: 6.8, y: 0.6, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall',    x: 3.8, y: 0.6, width: 0.4, height: 2.2 },
      { id: 'wood_l',  x: 5.8, y: 0.6, width: 0.4, height: 1.0, blockType: 'wood', hp: 2, supports: [] },
      { id: 'wood_r',  x: 7.4, y: 0.6, width: 0.4, height: 1.0, blockType: 'wood', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'A wall blocks the path — flatten the arc to clear it. The pig is tucked between two wood walls.',
    theme: THEME,
  },
  {
    id: 'ch1-l7', chapter: 1, levelInChapter: 7,
    title: 'Double Tower',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.30, max: -0.03, step: 0.003 } },
    defaultParams: { a: -0.10, h: 0, k: 0 },
    launcher: LAUNCHER,
    // Pig slides along shelf at y=2.40. Two glass towers both support the shelf.
    // Direct hit required — find a that reaches y=2.40, then time the shot.
    // Reachable: a in [-0.153, -0.065] covers pig x range 4.7–6.7 at y=2.40
    targets: [{
      id: 'pig', x: 5.7, y: 2.40, radius: 0.45, pigType: 'helmet', hp: 1,
      moving: { axis: 'x', min: 4.7, max: 6.7, speed: 0.9 },
      restingOn: 'shelf',
    }],
    obstacles: [
      { id: 'tow_l', x: 4.2, y: 0.6, width: 0.4, height: 1.1, blockType: 'glass', hp: 1, supports: ['shelf'] },
      { id: 'tow_r', x: 6.6, y: 0.6, width: 0.4, height: 1.1, blockType: 'glass', hp: 1, supports: ['shelf'] },
      { id: 'shelf', x: 4.2, y: 1.7, width: 2.8, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'The pig slides along a glass shelf. Lock in the arc height, then time the shot.',
    theme: THEME,
  },
  {
    id: 'ch1-l8', chapter: 1, levelInChapter: 8,
    title: 'Moving Shelf',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.10, h: 0, k: 0 },
    launcher: LAUNCHER,
    // Pig slides on glass shelf at y=2.20. Lock arc height to shelf level, then time shot.
    // Reachable: a in [-0.106, -0.070] covers pig x range 5.65–6.75 at y=2.20
    targets: [{
      id: 'pig', x: 6.2, y: 2.20, radius: 0.45, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.65, max: 6.75, speed: 1.3 },
    }],
    obstacles: [
      { id: 'p_l',  x: 5.2, y: 0.6, width: 0.4, height: 0.9,  blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'p_r',  x: 6.8, y: 0.6, width: 0.4, height: 0.9,  blockType: 'wood',  hp: 2, supports: ['shelf'] },
      { id: 'shelf',x: 5.2, y: 1.5, width: 2.0, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'The pig slides on the shelf. Dial in the right arc height, then wait for the moment.',
    theme: THEME,
  },
  {
    id: 'ch1-l9', chapter: 1, levelInChapter: 9,
    title: 'Speed Tower',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.12, h: 0, k: 0 },
    launcher: LAUNCHER,
    // Two stacked glass blocks form a wall. Fast pig runs behind it at ground level.
    // Steep arc breaks through wall + hits pig. Flat arc clears wall, hits pig further right.
    // Reachable: pig y=0.6, x=5.8–8.5 → a range -0.169 to -0.069
    targets: [{
      id: 'pig', x: 7.0, y: 0.6, radius: 0.40, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.8, max: 8.5, speed: 2.5 },
    }],
    obstacles: [
      { id: 'wall_b', x: 5.2, y: 0.6, width: 0.4, height: 0.7, blockType: 'glass', hp: 1, supports: ['wall_t'] },
      { id: 'wall_t', x: 5.2, y: 1.3, width: 0.4, height: 0.7, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 2.5, radius: 0.3 },
    starThresholds: [1, 2], starMode: 'bonus',
    revealAfter: null,
    hint: 'Fast pig! A steep arc breaks the glass wall and hits it close. A flat arc clears the wall and hits it far.',
    theme: THEME,
  },
  {
    id: 'ch1-l10', chapter: 1, levelInChapter: 10,
    title: 'The Gauntlet',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.30, max: -0.03, step: 0.003 } },
    defaultParams: { a: -0.20, h: 0, k: 0 },
    launcher: LAUNCHER,
    // Exact a = (2.45 - 4.5) / (6.6 - 1)² = -2.05 / 31.36 ≈ -0.065
    // Default a=-0.20: arc y=3.7 at x=3.0 — clips wall top (3.8). Must flatten.
    // Wrong hits: a=-0.10 hits wood_mid, a=-0.085 hits glass_top. Only a≈-0.065 reaches pig.
    targets: [{ id: 'pig', x: 6.6, y: 2.45, radius: 0.45, pigType: 'king', hp: 1, moving: null, restingOn: 'glass_top' }],
    obstacles: [
      { id: 'wall',       x: 3.0,  y: 0.6, width: 0.4, height: 3.2 },
      { id: 'stone_base', x: 6.0,  y: 0.6, width: 1.2, height: 0.5, blockType: 'concrete', hp: 2, supports: ['wood_mid'] },
      { id: 'wood_mid',   x: 6.2,  y: 1.1, width: 0.8, height: 0.5, blockType: 'wood',  hp: 2, supports: ['glass_top'] },
      { id: 'glass_top',  x: 6.35, y: 1.6, width: 0.5, height: 0.4, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Clear the wall first. Then find the arc that reaches the king at the pyramid\'s peak.',
    theme: THEME,
  },
];
