// Chapter 3: SIGN & SHAPE — y = a(x−h)² + k
// Full vertex form. Focus: sign of a (positive opens up = "smile", negative opens down = "frown").
// Now introduces positive a (arc opens upward — unusual trajectory).
// Launcher at (1, 0.8).

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'mountain';

export const CHAPTER_3 = [
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
    // Target BELOW the launcher path — requires upward-opening arc (positive a)
    // but that makes arc go DOWN then UP, which doesn't make sense as a projectile.
    // Instead: target needs arc to be low at target x — narrow negative a.
    targets: [{ id: 'main', x: 5.5, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [],
    bonusRing: { x: 7.5, y: 1.5, radius: 0.3 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: 'negative_a',
    hint: 'Vary the sign of a. Positive opens upward (smile), negative opens downward (frown).',
    theme: THEME,
  },
  {
    id: 'ch3-l2', chapter: 3, levelInChapter: 2,
    title: 'Narrow Gate',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.05, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.10, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    // Target is in a narrow vertical space. Must use specific |a| to fit through.
    targets: [{ id: 'main', x: 6.5, y: 1.5, radius: 0.38, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'ceil', x: 5.5, y: 2.8, width: 3.5, height: 0.3 }, // ceiling
      { id: 'floor2', x: 5.5, y: 0.6, width: 3.5, height: 0.5 }, // raised floor
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Thread the needle. Narrow arc = steep. Find |a| that fits the gap.',
    theme: THEME,
  },
  {
    id: 'ch3-l3', chapter: 3, levelInChapter: 3,
    title: 'Wide Open',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.02, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.25, h: 3.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'main', x: 9.0, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [{ id: 'wall', x: 2.5, y: 0.8, width: 0.4, height: 1.5 }],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Far target with a short wall. Wide arc clears the wall easily.',
    theme: THEME,
  },
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
    targets: [{ id: 'main', x: 6.5, y: 0.8, radius: 0.35, pigType: 'helmet', hp: 1, moving: null }],
    // Pig is surrounded by walls on sides forming a tight trench
    obstacles: [
      { id: 'left', x: 5.5, y: 0.8, width: 0.4, height: 2.0 },
      { id: 'right', x: 7.2, y: 0.8, width: 0.4, height: 2.0 },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Pig is in a narrow trench. The arc must descend steeply to land inside it.',
    theme: THEME,
  },
  {
    id: 'ch3-l5', chapter: 3, levelInChapter: 5,
    title: 'Tall Column',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.02, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.25, h: 3.5, k: 0 },
    launcher: LAUNCHER,
    // Target on top of a tall column — wide arc that barely reaches the top
    targets: [{ id: 'main', x: 7.5, y: 4.2, radius: 0.40, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'col', x: 7.1, y: 0.8, width: 0.8, height: 3.4 }, // column body
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Target on a tall column. Very wide arc, very small |a|.',
    theme: THEME,
  },
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
    targets: [{ id: 'main', x: 8.5, y: 1.8, radius: 0.42, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'w1', x: 3.0, y: 0.8, width: 0.4, height: 2.5 },
      { id: 'w2', x: 5.5, y: 2.5, width: 0.4, height: 2.0 },
      { id: 'w3', x: 7.5, y: 0.8, width: 0.4, height: 1.5 },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Three obstacles. Thread the arc through all of them to reach the target.',
    theme: THEME,
  },
  {
    id: 'ch3-l7', chapter: 3, levelInChapter: 7,
    title: 'Two Birds',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -0.15, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    // Two targets — must hit BOTH (the arc passes through both)
    targets: [
      { id: 't1', x: 5.0, y: 2.5, radius: 0.42, pigType: 'helmet', hp: 1, moving: null },
      { id: 't2', x: 8.0, y: 0.8, radius: 0.42, pigType: 'helmet', hp: 1, moving: null },
    ],
    obstacles: [], bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Must hit BOTH pigs with one arc. The parabola passes through both.',
    theme: THEME,
  },
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
    targets: [
      { id: 'whistle', x: 6.5, y: 0.8, radius: 0.45, pigType: 'whistle', hp: 1, moving: null },
      { id: 'helmet',  x: 8.5, y: 0.8, radius: 0.42, pigType: 'helmet',  hp: 1, moving: null },
    ],
    obstacles: [], bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Hit the Whistle Pig first — it spawns a Helmet Pig you also need to hit!',
    theme: THEME,
  },
  {
    id: 'ch3-l9', chapter: 3, levelInChapter: 9,
    title: 'Speed and Precision',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.05 },
    },
    defaultParams: { a: -0.18, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{
      id: 'cool', x: 7.0, y: 1.5, radius: 0.38, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 6.0, max: 8.5, speed: 1.5 },
    }],
    obstacles: [{ id: 'w', x: 4.0, y: 0.8, width: 0.4, height: 2.0 }],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Wall + elevated moving target. Clear the wall, time the shot.',
    theme: THEME,
  },
  {
    id: 'ch3-l10', chapter: 3, levelInChapter: 10,
    title: 'King Pig',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.05 },
    },
    defaultParams: { a: -0.14, h: 4.5, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 8.0, y: 2.5, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'w1', x: 3.5, y: 0.8, width: 0.4, height: 2.0 },
      { id: 'w2', x: 6.0, y: 0.8, width: 0.4, height: 1.5 },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'King Pig takes 3 hits. Two walls. Arc must clear both and strike the throne.',
    theme: THEME,
  },
];
