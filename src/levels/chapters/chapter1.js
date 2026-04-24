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
    title: 'Mid-Range',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.05, step: 0.01 } },
    defaultParams: { a: -0.30, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'main', x: 6.0, y: 0.6, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [], bonusRing: { x: 4.0, y: 3.0, radius: 0.3 },
    starThresholds: [2, 5], starMode: 'bonus',
    revealAfter: null,
    hint: 'Target is farther — you need a less steep arc. Make a less negative.',
    theme: THEME,
  },
  {
    id: 'ch1-l3', chapter: 1, levelInChapter: 3,
    title: 'Wide Arc',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.12, h: 0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'main', x: 8.5, y: 0.6, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [], bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: 'leading_coefficient',
    hint: 'Far target — needs a very gentle arc. Find the right a to reach it.',
    theme: THEME,
  },
  {
    id: 'ch1-l4', chapter: 1, levelInChapter: 4,
    title: 'Up High',
    equationForm: 'stretch',
    activeCoefficients: ['a'],
    sliderConfig: { a: { min: -0.50, max: -0.03, step: 0.005 } },
    defaultParams: { a: -0.20, h: 0, k: 0 },
    launcher: LAUNCHER,
    // exact a = (2.5-4.5)/(5-1)² = -2.0/16 = -0.125
    targets: [{ id: 'main', x: 5.0, y: 2.5, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [], bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'The target is on a shelf. The arc needs to still be high when it reaches x=5.',
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
    targets: [{ id: 'main', x: 7.0, y: 3.0, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
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
    obstacles: [{ id: 'wall1', x: 3.8, y: 0.6, width: 0.4, height: 2.4 }],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'There\'s a wall! A wide arc (less negative a) will clear it. Too narrow and you\'ll hit the wall.',
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
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Two walls at different heights. One value of a clears both — find it.',
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
