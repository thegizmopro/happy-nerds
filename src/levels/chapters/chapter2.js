// Chapter 2: SHIFT — y = a(x−h)² + k
// Launcher at ground level (1, 0.8). Arc goes up then comes down.
// k auto-derived: k = −a·h² (arc always starts at launcher).
// Player controls a and h. k shown as derived readout.
//
// Math: localY = a*(localX - h)^2 - a*h^2
// For target at local (tx, ty): a*(tx^2 - 2*tx*h) = ty  (expanding)

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'desert';

export const CHAPTER_2 = [
  {
    id: 'ch2-l1', chapter: 2, levelInChapter: 1,
    title: 'Side Step',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.15, h: 5.0, k: 0 }, // k derived in-game
    launcher: LAUNCHER,
    // Solution: h=3 (arc returns to y=0 at localX=2h=6, worldX=7)
    targets: [{ id: 'main', x: 7.0, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [], bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'h controls where the arc peaks. Move the vertex closer to the middle of the flight path.',
    theme: THEME,
  },
  {
    id: 'ch2-l2', chapter: 2, levelInChapter: 2,
    title: 'Loft It',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.10, h: 5.5, k: 0 },
    launcher: LAUNCHER,
    // Solution example: h=4, a≈-0.183 → localY at tx=6: -0.183*(36-48)=2.196, worldY=3.0
    targets: [{ id: 'main', x: 7.0, y: 3.0, radius: 0.45, pigType: 'letterman', hp: 2, moving: null }],
    obstacles: [], bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Target is elevated. Move h to control where the arc peaks, a to control its height.',
    theme: THEME,
  },
  {
    id: 'ch2-l3', chapter: 2, levelInChapter: 3,
    title: 'Angled',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.15, h: 3.0, k: 0 },
    launcher: LAUNCHER,
    // Solution: h=5, a≈-0.033 → localY at tx=7: a*(49-70)=-0.033*(-21)=0.693, worldY≈1.5
    targets: [{ id: 'main', x: 8.0, y: 1.5, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [], bonusRing: { x: 5.5, y: 3.5, radius: 0.3 },
    starThresholds: [2, 6], starMode: 'bonus',
    revealAfter: 'vertex_form',
    hint: 'The vertex marks the peak of the parabola. Place it between the launcher and target.',
    theme: THEME,
  },
  {
    id: 'ch2-l4', chapter: 2, levelInChapter: 4,
    title: 'High Shelf',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.12, h: 3.0, k: 0 },
    launcher: LAUNCHER,
    // Solution: h=4, a≈-0.113 → localY at tx=5: a*(25-40)=1.7, worldY=2.5
    targets: [{ id: 'main', x: 6.0, y: 2.5, radius: 0.45, pigType: 'letterman', hp: 2, moving: null }],
    obstacles: [], bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Closer and higher. Try moving the vertex (h) past the halfway point.',
    theme: THEME,
  },
  {
    id: 'ch2-l5', chapter: 2, levelInChapter: 5,
    title: 'Skyscraper',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.08, h: 3.5, k: 0 },
    launcher: LAUNCHER,
    // Solution: h=5, a≈-0.129 → localY at tx=7: a*(49-70)=2.7, worldY=3.5
    targets: [{ id: 'main', x: 8.0, y: 3.5, radius: 0.45, pigType: 'letterman', hp: 2, moving: null }],
    obstacles: [], bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Very high target. The peak (k = −a·h²) must be above the target height.',
    theme: THEME,
  },
  {
    id: 'ch2-l6', chapter: 2, levelInChapter: 6,
    title: 'Precision',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.05 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.18, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    // Solution: h≈4.1, a≈-0.14 (derived from two constraints: hits target AND bonus ring)
    targets: [{ id: 'main', x: 8.0, y: 1.2, radius: 0.40, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [],
    bonusRing: { x: 5.0, y: 3.0, radius: 0.3 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Hit the target for 1★. Thread it through the golden ring for 3★.',
    theme: THEME,
  },
  {
    id: 'ch2-l7', chapter: 2, levelInChapter: 7,
    title: 'Over the Wall',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.05, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.15, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    // h=3, |a|>0.317 clears wall x=[3.8,4.2] top=3.5, hits target at (7,0.8)
    targets: [{ id: 'main', x: 7.0, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [{ id: 'wall', x: 3.8, y: 0.8, width: 0.4, height: 2.7 }],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Tall wall between you and the target. Peak ABOVE the wall top, then descend to the target.',
    theme: 'forest',
  },
  {
    id: 'ch2-l8', chapter: 2, levelInChapter: 8,
    title: 'Loop Around',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.05, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.20, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'main', x: 8.5, y: 2.0, radius: 0.45, pigType: 'letterman', hp: 2, moving: null }],
    obstacles: [
      { id: 'wall1', x: 3.5, y: 0.8, width: 0.4, height: 1.8 },
      { id: 'plat',  x: 5.5, y: 3.5, width: 2.5, height: 0.3 }, // horizontal platform above target approach
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Two obstacles. Find an arc that threads between them and reaches the target.',
    theme: 'forest',
  },
  {
    id: 'ch2-l9', chapter: 2, levelInChapter: 9,
    title: 'Checkpoint',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.05 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.14, h: 4.5, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'main', x: 8.5, y: 1.5, radius: 0.40, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [],
    bonusRing: { x: 4.0, y: 3.2, radius: 0.28 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Pass through the ring AND hit the target. One equation, two constraints.',
    theme: 'forest',
  },
  {
    id: 'ch2-l10', chapter: 2, levelInChapter: 10,
    title: 'Moving Shelf',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -2.0, max: 5.0, step: 0.1 },
    },
    defaultParams: { a: -0.18, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{
      id: 'cool', x: 6.5, y: 2.2, radius: 0.42, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.5, max: 8.0, speed: 1.0 },
    }],
    obstacles: [{ id: 'wall', x: 3.0, y: 0.8, width: 0.4, height: 2.0 }],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Moving target on an elevated path. Clear the wall AND time the shot.',
    theme: 'forest',
  },
];
