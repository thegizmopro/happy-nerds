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
    targets: [{ id: 'pig', x: 6.2, y: 2.20, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
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
    targets: [{ id: 'pig', x: 7.8, y: 2.30, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
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
    targets: [{ id: 'pig', x: 5.75, y: 2.45, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone', x: 5.5, y: 0.6, width: 0.5, height: 0.5, blockType: 'stone', hp: 3, supports: ['wood'] },
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
    title: 'Penthouse',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.20, max: -0.02, step: 0.002 } },
    defaultParams: { a: -0.08, h: 0, k: 0 },
    launcher: LAUNCHER,
    // exact a = (3.0-4.5)/(7-1)² = -1.5/36 = -0.0417
    targets: [{ id: 'main', x: 7.0, y: 3.0, radius: 0.45, pigType: 'letterman', hp: 2, moving: null }],
    obstacles: [], bonusRing: { x: 5.0, y: 4.0, radius: 0.3 },
    starThresholds: [2, 5], starMode: 'bonus',
    revealAfter: null,
    hint: 'High shelf, far away. Very gentle arc needed — a close to zero.',
    theme: THEME,
  },
  {
    id: 'ch1-l6', chapter: 1, levelInChapter: 6,
    title: 'The Wall',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.22, h: 0, k: 0 },
    launcher: LAUNCHER,
    // exact a = (0.6-4.5)/(7-1)² = -3.9/36 = -0.1083
    // Wall at world x=[3.8,4.2] y=[0.6,3.0]. Arc at local x=2.8: -0.1083*7.84+4.5=3.65>3.0 ✓
    // Default a=-0.22 at local x=2.8: -0.22*7.84+4.5=2.78<3.0 hits wall ✓
    targets: [{ id: 'main', x: 7.0, y: 0.6, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall1', x: 3.8, y: 0.6, width: 0.4, height: 2.4 },
      // Glass block shatters as the arc descends; the wood block above falls as rubble
      // Solution arc (a≈-0.108) passes through x=6.2-6.7 at y≈1.6, within glass y=[1.2,1.8] ✓
      { id: 'glass_l6', x: 6.2, y: 1.2, width: 0.5, height: 0.6, blockType: 'glass', hp: 1, supports: ['wood_l6'] },
      { id: 'wood_l6',  x: 6.2, y: 1.8, width: 0.5, height: 0.5, blockType: 'wood',  hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'There\'s a wall! A wide arc clears it. Watch the glass block shatter as the arc descends.',
    theme: THEME,
  },
  {
    id: 'ch1-l7', chapter: 1, levelInChapter: 7,
    title: 'Double Trouble',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.30, max: -0.03, step: 0.003 } },
    defaultParams: { a: -0.15, h: 0, k: 0 },
    launcher: LAUNCHER,
    // exact a = (0.6-4.5)/(8.5-1)² = -3.9/56.25 = -0.0693
    // Wall1 x=[3.0,3.4] top=3.8: at local x=2.2: -0.0693*4.84+4.5=4.165>3.8 ✓
    // Wall2 x=[5.8,6.2] top=2.2: at local x=5.0: -0.0693*25+4.5=2.768>2.2 ✓
    // Default a=-0.15 at local x=5.0: -0.15*25+4.5=0.75<2.2 hits wall2 ✓
    targets: [{ id: 'main', x: 8.5, y: 0.6, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall1', x: 3.0, y: 0.6, width: 0.4, height: 3.2 },
      { id: 'wall2', x: 5.8, y: 0.6, width: 0.4, height: 1.6 },
      // Glass+stone tower between the two walls — solution arc (a≈-0.069) passes through at y≈3.5
      // at localX=3.5 (worldX=4.5): worldY=4.5-0.069*12.25≈3.65, within glass y=[3.2,3.7] ✓
      { id: 'glass_l7', x: 4.5, y: 3.2, width: 0.4, height: 0.5, blockType: 'glass', hp: 1, supports: ['stone_l7'] },
      { id: 'stone_l7', x: 4.5, y: 3.7, width: 0.4, height: 0.4, blockType: 'stone', hp: 3, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Two walls at different heights. One value of a clears both. Glass shatters on the way through!',
    theme: THEME,
  },
  {
    id: 'ch1-l8', chapter: 1, levelInChapter: 8,
    title: 'Moving Target',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.15, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{
      id: 'cool', x: 7.0, y: 0.6, radius: 0.45, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.0, max: 8.5, speed: 1.2 },
    }],
    obstacles: [], bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'The Cool Pig slides around. Set your arc, then time the launch.',
    theme: THEME,
  },
  {
    id: 'ch1-l9', chapter: 1, levelInChapter: 9,
    title: 'Speed Run',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.12, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{
      id: 'cool2', x: 6.5, y: 0.6, radius: 0.40, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 4.0, max: 8.5, speed: 2.4 },
    }],
    obstacles: [], bonusRing: { x: 4.5, y: 2.5, radius: 0.3 },
    starThresholds: [1, 2], starMode: 'bonus',
    revealAfter: null,
    hint: 'Faster pig! Lock your a first, then wait for the right moment.',
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
    // wall at x=[3.8,4.2] top=2.8; moving target around x=7, y=0.6
    // exact a to clear wall AND hit x=7: -0.1083 (same as L6)
    targets: [{
      id: 'cool3', x: 7.0, y: 0.6, radius: 0.42, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 6.0, max: 9.0, speed: 1.8 },
    }],
    obstacles: [{ id: 'wall', x: 3.8, y: 0.6, width: 0.4, height: 2.2 }],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Wall AND moving target. Set a to clear the wall, then time it.',
    theme: THEME,
  },
];
