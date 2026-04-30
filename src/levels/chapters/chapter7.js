// Chapter 7: BEYOND QUADRATICS — cubic, abs value, piecewise
// Structures placed where only the special arc shape can navigate inside them.

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'space';

export const CHAPTER_7 = [
  // ── 7-1 ──────────────────────────────────────────────────────────────────
  // Cubic intro. Pig on elevated glass shelf under a static ceiling overhang.
  // Only S-curve cubic arc can reach under the ceiling to hit the shelf.
  // Ceiling: x=4.5 y=3.0 w=4.5 h=0.3 (static). Shelf: x=6.0 y=2.0 w=1.8 h=0.25.
  // Pillars: x=6.0 & x=7.5, h=1.0 (wood). Pig y=2.0+0.25+0.45=2.7.
  {
    id: 'ch7-l1', chapter: 7, levelInChapter: 1,
    title: 'S-Curve',
    equationForm: 'cubic',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.10, max: 0.10, step: 0.005 },
      h: { min: 1.0,  max: 8.0,  step: 0.1 },
    },
    defaultParams: { a: 0.04, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.75, y: 2.7, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf7_1' }],
    obstacles: [
      { id: 'ceil7_1',  x: 4.5,  y: 3.0, width: 4.5,  height: 0.3 },
      { id: 'pll7_1l',  x: 6.0,  y: 0.6, width: 0.3,  height: 1.4, blockType: 'wood',  hp: 2, supports: ['shelf7_1'] },
      { id: 'pll7_1r',  x: 7.5,  y: 0.6, width: 0.3,  height: 1.4, blockType: 'wood',  hp: 2, supports: ['shelf7_1'] },
      { id: 'shelf7_1', x: 6.0,  y: 2.0, width: 1.8,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: 'cubic_intro',
    hint: 'Cubic S-curve can arc under the ceiling — quadratics cannot. Adjust a and h.',
    theme: THEME,
  },

  // ── 7-2 ──────────────────────────────────────────────────────────────────
  // Cubic arc must dip then rise (J-shaped path) to reach pig behind a moat wall.
  // Static wall at x=4.5 h=2.0. Pig inside wood tower behind wall at x=7.5.
  // Tower: stone base + wood + glass top. Pig on glass top.
  {
    id: 'ch7-l2', chapter: 7, levelInChapter: 2,
    title: 'Loop Around',
    equationForm: 'cubic',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.10, max: 0.10, step: 0.005 },
      h: { min: 1.0,  max: 8.0,  step: 0.1 },
    },
    defaultParams: { a: 0.05, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.75, y: 2.35, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'twr7_2t' }],
    obstacles: [
      { id: 'wall7_2',  x: 4.5,  y: 0.6, width: 0.4, height: 2.4 },
      { id: 'twr7_2b',  x: 7.5,  y: 0.6, width: 0.5, height: 0.8, blockType: 'stone', hp: 3, supports: ['twr7_2m'] },
      { id: 'twr7_2m',  x: 7.5,  y: 1.4, width: 0.5, height: 0.6, blockType: 'wood',  hp: 2, supports: ['twr7_2t'] },
      { id: 'twr7_2t',  x: 7.5,  y: 2.0, width: 0.5, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Cubic path dips then rises — thread it over the wall and down onto the tower top.',
    theme: THEME,
  },

  // ── 7-3 ──────────────────────────────────────────────────────────────────
  // Two pigs on separate structures connected by a chain — S-curve hits both.
  // Left pig on glass shelf at x=4.5. Right pig on wood tower at x=7.5.
  // Cubic arc passes through both if h is centered between them.
  {
    id: 'ch7-l3', chapter: 7, levelInChapter: 3,
    title: 'Chain Shot',
    equationForm: 'cubic',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.10, max: 0.10, step: 0.005 },
      h: { min: 1.0,  max: 8.0,  step: 0.1 },
    },
    defaultParams: { a: -0.04, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    targets: [
      { id: 't2', x: 7.75, y: 2.3, radius: 0.40, pigType: 'letterman', hp: 1, moving: null, restingOn: 'ch7_3sr' },
    ],
    obstacles: [
      { id: 'ch7_3pll', x: 4.1, y: 0.6, width: 0.3, height: 0.6, blockType: 'glass', hp: 1, supports: ['ch7_3sl'] },
      { id: 'ch7_3plr', x: 4.9, y: 0.6, width: 0.3, height: 0.6, blockType: 'glass', hp: 1, supports: ['ch7_3sl'] },
      { id: 'ch7_3sl',  x: 4.1, y: 1.2, width: 1.1, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'ch7_3rb',  x: 7.5, y: 0.6, width: 0.5, height: 0.8, blockType: 'wood',  hp: 2, supports: ['ch7_3sr'] },
      { id: 'ch7_3sr',  x: 7.5, y: 1.4, width: 0.5, height: 0.65, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'S-curve through both structures in one shot. Find the h that threads between them.',
    theme: THEME,
  },

  // ── 7-4 ──────────────────────────────────────────────────────────────────
  // Absolute value: V-arc through narrow horizontal gap between two stacked blocks.
  // Two stone blocks stacked vertically at x=5.5 with a 0.5 gap between them.
  // Pig behind the upper block at x=7.5 y=1.5, inside glass enclosure.
  {
    id: 'ch7-l4', chapter: 7, levelInChapter: 4,
    title: 'V-Gap',
    equationForm: 'abs',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -2.0, max: 2.0, step: 0.1 },
      h: { min: 1.0,  max: 8.0, step: 0.1 },
    },
    defaultParams: { a: 0.8, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.5, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'gap_lo',  x: 5.2, y: 0.6,  width: 0.4, height: 0.8, blockType: 'stone', hp: 3, supports: [] },
      { id: 'gap_hi',  x: 5.2, y: 1.6,  width: 0.4, height: 0.8, blockType: 'stone', hp: 3, supports: [] },
      { id: 'box7_4l', x: 7.0, y: 0.6,  width: 0.3, height: 1.2, blockType: 'glass', hp: 1, supports: ['box7_4t'] },
      { id: 'box7_4r', x: 8.1, y: 0.6,  width: 0.3, height: 1.2, blockType: 'glass', hp: 1, supports: ['box7_4t'] },
      { id: 'box7_4t', x: 7.0, y: 1.8,  width: 1.4, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'V-arc minimum at h. Thread the bottom of the V through the 0.5 gap between stone blocks.',
    theme: THEME,
  },

  // ── 7-5 ──────────────────────────────────────────────────────────────────
  // Abs value: pig in box with top opening only — inverted V arc drops in.
  // Box: glass left/right walls, no top. Pig inside at x=7.0.
  // Arc must peak between the walls and descend into the opening.
  {
    id: 'ch7-l5', chapter: 7, levelInChapter: 5,
    title: 'Drop Zone',
    equationForm: 'abs',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -2.0, max: 2.0, step: 0.1 },
      h: { min: 1.0,  max: 8.0, step: 0.1 },
    },
    defaultParams: { a: -1.0, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.0, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'box7_5l', x: 6.3, y: 0.6, width: 0.35, height: 2.5, blockType: 'stone', hp: 3, supports: [] },
      { id: 'box7_5r', x: 8.1, y: 0.6, width: 0.35, height: 2.5, blockType: 'stone', hp: 3, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: 'piecewise_intro',
    hint: 'Inverted V peaks inside the open-top box. Set h to the center of the gap and let it drop.',
    theme: THEME,
  },

  // ── 7-6 ──────────────────────────────────────────────────────────────────
  // Piecewise: pig behind a partial structure at a specific angle.
  // Static wall + wood arch. Piecewise arc can thread left-side slope then right-side arc.
  {
    id: 'ch7-l6', chapter: 7, levelInChapter: 6,
    title: 'Join the Dots',
    equationForm: 'piecewise',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 2.0,  max: 7.0,  step: 0.1 },
    },
    defaultParams: {
      a: -0.15, h: 4.5,
      left:  { form: 'standard', params: { a: 0.0, b: 0.8, c: 0 } },
      right: { form: 'vertex',   params: { a: -0.15, h: 0, k: 0 } },
      breakX: 4.5,
      k: 0,
    },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.5, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'pw_wall',    x: 4.0,  y: 0.6, width: 0.4, height: 1.8 },
      { id: 'pw_col_l',   x: 6.5,  y: 0.6, width: 0.3, height: 1.2, blockType: 'wood', hp: 2, supports: ['pw_beam'] },
      { id: 'pw_col_r',   x: 7.8,  y: 0.6, width: 0.3, height: 1.2, blockType: 'wood', hp: 2, supports: ['pw_beam'] },
      { id: 'pw_beam',    x: 6.5,  y: 1.8, width: 1.6, height: 0.25, blockType: 'wood', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Piecewise arc: one slope before the break, another after. Set h at the wall to thread it.',
    theme: THEME,
  },

  // ── 7-7 ──────────────────────────────────────────────────────────────────
  // Cubic S-curve hits two pigs on separate shelves in one shot.
  // Left shelf low at x=4.5. Right shelf high at x=7.5.
  {
    id: 'ch7-l7', chapter: 7, levelInChapter: 7,
    title: 'Two in One',
    equationForm: 'cubic',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.10, max: 0.10, step: 0.005 },
      h: { min: 1.0,  max: 8.0,  step: 0.1 },
    },
    defaultParams: { a: 0.03, h: 5.5, k: 0 },
    launcher: LAUNCHER,
    targets: [
      { id: 't2', x: 7.75, y: 3.3, radius: 0.40, pigType: 'letterman', hp: 1, moving: null, restingOn: 'sh7_7r' },
    ],
    obstacles: [
      { id: 'sh7_7ll', x: 4.1,  y: 0.6, width: 0.3,  height: 0.65, blockType: 'glass', hp: 1, supports: ['sh7_7l'] },
      { id: 'sh7_7lr', x: 4.9,  y: 0.6, width: 0.3,  height: 0.65, blockType: 'glass', hp: 1, supports: ['sh7_7l'] },
      { id: 'sh7_7l',  x: 4.1,  y: 1.25, width: 1.1, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
      { id: 'sh7_7rl', x: 7.3,  y: 0.6, width: 0.3,  height: 2.2,  blockType: 'stone', hp: 3, supports: ['sh7_7r'] },
      { id: 'sh7_7rr', x: 8.2,  y: 0.6, width: 0.3,  height: 2.2,  blockType: 'stone', hp: 3, supports: ['sh7_7r'] },
      { id: 'sh7_7r',  x: 7.3,  y: 2.8, width: 1.2,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Cubic rises through the low shelf then keeps climbing to the high shelf.',
    theme: THEME,
  },

  // ── 7-8 ──────────────────────────────────────────────────────────────────
  // Vertex form (any sign of a). Complex multi-block fortress with narrow approach.
  // Two static walls + fortress inside. King pig (3HP) inside.
  {
    id: 'ch7-l8', chapter: 7, levelInChapter: 8,
    title: 'All Forms',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.45, max: 0.45, step: 0.01 },
      h: { min: 1.0,  max: 8.0,  step: 0.1 },
    },
    defaultParams: { a: -0.15, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 7.5, y: 0.8, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'sw1',      x: 3.5,  y: 0.6, width: 0.4, height: 3.5 },
      { id: 'sw2',      x: 6.0,  y: 1.0, width: 0.4, height: 2.5 },
      { id: 'fort7_8l', x: 6.8,  y: 0.6, width: 0.35, height: 2.0, blockType: 'stone', hp: 3, supports: ['fort7_8t'] },
      { id: 'fort7_8r', x: 8.4,  y: 0.6, width: 0.35, height: 2.0, blockType: 'stone', hp: 3, supports: ['fort7_8t'] },
      { id: 'fort7_8t', x: 6.8,  y: 2.6, width: 2.0,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Two static walls with a narrow gap. Tune a and h precisely — then break the fortress roof.',
    theme: THEME,
  },

  // ── 7-9 ──────────────────────────────────────────────────────────────────
  // Abs value: King pig under glass overhangs — V-arc must peak OVER the glass.
  // Two glass overhangs above pig at different heights. Inverted-V rises between them.
  {
    id: 'ch7-l9', chapter: 7, levelInChapter: 9,
    title: 'Abs King',
    equationForm: 'abs',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -2.0, max: 2.0, step: 0.1 },
      h: { min: 1.0,  max: 8.0, step: 0.1 },
    },
    defaultParams: { a: 1.2, h: 4.5, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 7.0, y: 0.8, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'ovh7_9l', x: 5.5, y: 2.5, width: 1.2, height: 0.3, blockType: 'glass', hp: 1, supports: [] },
      { id: 'ovh7_9r', x: 7.2, y: 3.2, width: 1.2, height: 0.3, blockType: 'glass', hp: 1, supports: [] },
      { id: 'col7_9l', x: 6.0, y: 0.6, width: 0.35, height: 1.7, blockType: 'stone', hp: 3, supports: [] },
      { id: 'col7_9r', x: 8.0, y: 0.6, width: 0.35, height: 2.2, blockType: 'stone', hp: 3, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'V-arc rises steeply through the gap between the stone columns to hit the king.',
    theme: THEME,
  },

  // ── 7-10 ─────────────────────────────────────────────────────────────────
  // Grand finale: Cubic, two walls, bonus ring, king pig in elaborate fortress.
  {
    id: 'ch7-l10', chapter: 7, levelInChapter: 10,
    title: 'Function Finale',
    equationForm: 'cubic',
    activeCoefficients: ['a', 'h'],
    sliderConfig: {
      a: { min: -0.10, max: 0.10, step: 0.005 },
      h: { min: 1.0,  max: 8.0,  step: 0.1 },
    },
    defaultParams: { a: 0.04, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    targets: [{ id: 'king', x: 8.5, y: 0.8, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'sw7_10a',  x: 3.5,  y: 0.6, width: 0.4, height: 2.5 },
      { id: 'sw7_10b',  x: 6.0,  y: 1.5, width: 0.4, height: 2.0 },
      { id: 'fn_wl',    x: 7.8,  y: 0.6, width: 0.35, height: 2.2, blockType: 'stone', hp: 3, supports: ['fn_roof'] },
      { id: 'fn_wr',    x: 9.2,  y: 0.6, width: 0.35, height: 2.2, blockType: 'stone', hp: 3, supports: ['fn_roof'] },
      { id: 'fn_roof',  x: 7.8,  y: 2.8, width: 1.75, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.8, y: 3.8, radius: 0.25 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Cubic path, two static walls, bonus ring, King in a stone fortress. The full beyond-quadratics challenge.',
    theme: THEME,
  },
];
