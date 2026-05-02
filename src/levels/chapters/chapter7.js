// Chapter 7: BEYOND QUADRATICS — cubic, abs value, piecewise
// Structures are placed where only the special arc shape can navigate inside.
// Stone = permanent barrier. Concrete = 2-hit cascade. Glass = pass-through.

const LAUNCHER = { x: 1, y: 0.2 };
const THEME = 'space';

function vshot(label, a, h, k = 0) {
  return { label, equationForm: 'vertex', activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: { a:{min:-0.45,max:-0.03,step:0.01}, h:{min:1,max:8,step:0.1}, k:{min:-2,max:6,step:0.1} },
    defaultParams: { a, h, k } };
}

export const CHAPTER_7 = [
  // ── 7-1 ──────────────────────────────────────────────────────────────────
  // Cubic intro. S-curve arc must slide UNDER a static ceiling overhang.
  // Ceiling: x=5.0-9.5, y=3.0 (static). Shelf inside: x=6.5, y=2.0.
  // Concrete pillars support the shelf. Target on shelf.
  // Kill vectors: (1) cubic arc under ceiling → hits shelf (glass) → target drops,
  //               (2) destroy concrete pillar → shelf falls → target falls 1.65 units
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
    targets: [{ id: 'pig', x: 7.05, y: 2.1, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf7_1' }],
    obstacles: [
      { id: 'ceil7_1',   x: 5.0,  y: 2.4,  width: 4.5,  height: 0.3 },
      { id: 'pl7_1l',    x: 6.3,  y: 0,  width: 0.35, height: 1.4, blockType: 'concrete', hp: 2, supports: ['shelf7_1'] },
      { id: 'pl7_1r',    x: 7.6,  y: 0,  width: 0.35, height: 1.4, blockType: 'concrete', hp: 2, supports: ['shelf7_1'] },
      { id: 'shelf7_1',  x: 6.3,  y: 1.4,  width: 1.7,  height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
      { id: 'guard7_1',  x: 4.5,  y: 0,  width: 0.4,  height: 2.4, blockType: 'stone',    hp: 3, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: 'cubic_intro',
    hint: 'The cubic S-curve dips under the ceiling — a standard parabola would hit the overhang. Hit a concrete pillar to cascade the shelf.',
    theme: THEME,
  },

  // ── 7-2 ──────────────────────────────────────────────────────────────────
  // Cubic arc must navigate past a stone moat wall then arc into a 3-layer tower.
  // Stone moat at x=4.5. Tower: stone base → concrete mid → glass top. Target on top.
  // Kill vectors: (1) cubic arc over wall → hits glass top → target drops,
  //               (2) hit concrete mid → cascade glass + target (falls 1.6 units)
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
    targets: [{ id: 'pig', x: 7.75, y: 1.75, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'twr7_2t' }],
    obstacles: [
      { id: 'wall7_2',  x: 4.5,  y: 0, width: 0.4,  height: 2.4 },
      { id: 'twr7_2s',  x: 7.5,  y: 0, width: 0.5,  height: 0.5,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'twr7_2c',  x: 7.5,  y: 0.5, width: 0.5,  height: 0.7,  blockType: 'concrete', hp: 2, supports: ['twr7_2t'] },
      { id: 'twr7_2t',  x: 7.5,  y: 1.2, width: 0.5,  height: 0.35, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Cubic path loops over the moat wall. Hit the concrete mid-section — it cascades the glass top and drops the pig.',
    theme: THEME,
  },

  // ── 7-3 ──────────────────────────────────────────────────────────────────
  // Two pigs on structures at very different heights. S-curve cubic hits both.
  // Left: low glass shelf (x=4.5). Right: tall concrete+glass tower (x=7.5).
  // Stone divider wall at x=5.8 separates the two zones.
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
      { id: 't1', x: 4.55, y: 0.9,  radius: 0.40, pigType: 'helmet',    hp: 1, moving: null, restingOn: 'ch7_3sl' },
      { id: 't2', x: 7.75, y: 1.7,  radius: 0.40, pigType: 'letterman', hp: 1, moving: null, restingOn: 'ch7_3sr' },
    ],
    obstacles: [
      { id: 'ch7_3pl',  x: 4.1,  y: 0, width: 0.3,  height: 0.6,  blockType: 'glass',    hp: 1, supports: ['ch7_3sl'] },
      { id: 'ch7_3pr',  x: 4.9,  y: 0, width: 0.3,  height: 0.6,  blockType: 'glass',    hp: 1, supports: ['ch7_3sl'] },
      { id: 'ch7_3sl',  x: 4.1,  y: 0.6, width: 1.1,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'ch7_3div', x: 5.8,  y: 0, width: 0.4,  height: 2.0,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'ch7_3rb',  x: 7.5,  y: 0, width: 0.5,  height: 1.0,  blockType: 'concrete', hp: 2, supports: ['ch7_3sr'] },
      { id: 'ch7_3sr',  x: 7.5,  y: 1, width: 0.5,  height: 0.45, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'S-curve through both structures in one shot. Stone divider separates the zones — find the h that threads between them.',
    theme: THEME,
  },

  // ── 7-4 ──────────────────────────────────────────────────────────────────
  // Absolute value: V-arc through a narrow gap between two stacked concrete blocks.
  // Gap at y ≈ 1.4–1.6 between the two concrete blocks.
  // Pig behind a glass cage on the other side of the gap.
  // Kill vectors: (1) V-arc minimum through gap → arc continues → hits glass cage → pig inside,
  //               (2) destroy one concrete gap block → gap widens → arc can navigate through
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
    targets: [{ id: 'pig', x: 7.5, y: 0.2, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'gap_lo',   x: 5.2,  y: 0, width: 0.4,  height: 0.8,  blockType: 'concrete', hp: 2, supports: [] },
      { id: 'gap_hi',   x: 5.2,  y: 1, width: 0.4,  height: 0.8,  blockType: 'concrete', hp: 2, supports: [] },
      { id: 'cage7_4l', x: 7.0,  y: 0, width: 0.35, height: 1.2,  blockType: 'glass',    hp: 1, supports: ['cage7_4t'] },
      { id: 'cage7_4r', x: 8.2,  y: 0, width: 0.35, height: 1.2,  blockType: 'glass',    hp: 1, supports: ['cage7_4t'] },
      { id: 'cage7_4t', x: 7.0,  y: 1.2, width: 1.55, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'V-arc minimum at h. Thread the bottom of the V through the 0.8-unit gap between concrete blocks, then the ball shatters the glass cage.',
    theme: THEME,
  },

  // ── 7-5 ──────────────────────────────────────────────────────────────────
  // Abs value: pig in open-top box — inverted V arc drops in from above.
  // Concrete left/right walls form an open-top box. No ceiling.
  // Stone blocker wall at x=3.5 forces arc to arc up steeply.
  // Kill vectors: (1) inverted V peaks inside open box → drops onto pig,
  //               (2) destroy concrete wall → box opens → direct arc (if h adjusted)
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
    targets: [{ id: 'pig', x: 7.2, y: 0.2, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'blocker7_5', x: 3.5,  y: 0, width: 0.4,  height: 1.5, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'box7_5l',    x: 6.3,  y: 0, width: 0.35, height: 2.5, blockType: 'concrete', hp: 2, supports: [] },
      { id: 'box7_5r',    x: 8.1,  y: 0, width: 0.35, height: 2.5, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: 'piecewise_intro',
    hint: 'Inverted V peaks inside the open-top box. Set h to the center of the gap — the arc drops straight onto the pig.',
    theme: THEME,
  },

  // ── 7-6 ──────────────────────────────────────────────────────────────────
  // Piecewise: pig behind a partial structure at a specific angle.
  // Static wall + wood/concrete arch. Piecewise arc threads through the structure.
  // Stone pillar on the right forces precise arc shape.
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
    targets: [{ id: 'pig', x: 7.5, y: 0.2, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'pw_wall',  x: 4.0,  y: 0, width: 0.4,  height: 1.8 },
      { id: 'pw_stone', x: 8.2,  y: 0, width: 0.4,  height: 2.2, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'pw_col_l', x: 6.5,  y: 0, width: 0.3,  height: 1.2, blockType: 'wood',     hp: 2, supports: ['pw_beam'] },
      { id: 'pw_col_r', x: 7.8,  y: 0, width: 0.3,  height: 1.2, blockType: 'concrete', hp: 2, supports: ['pw_beam'] },
      { id: 'pw_beam',  x: 6.5,  y: 1.2, width: 1.6,  height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Piecewise arc: linear slope left of the break, parabola right. The stone pillar on the far right forces the arc through a narrow corridor.',
    theme: THEME,
  },

  // ── 7-7 ──────────────────────────────────────────────────────────────────
  // Cubic S-curve hits two pigs in one shot (different heights).
  // Left pig: low concrete tower (x=4.5, y=1.6). Right pig: high stone+concrete tower (x=7.5, y=2.8).
  // Stone wall at x=5.8 separates the zones.
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
      { id: 't1', x: 4.55, y: 1,  radius: 0.40, pigType: 'helmet',    hp: 1, moving: null, restingOn: 'sh7_7l' },
      { id: 't2', x: 7.75, y: 1.9,  radius: 0.40, pigType: 'letterman', hp: 1, moving: null, restingOn: 'sh7_7r' },
    ],
    obstacles: [
      { id: 'sh7_7ll',  x: 4.1,  y: 0, width: 0.3,  height: 0.65, blockType: 'concrete', hp: 2, supports: ['sh7_7l'] },
      { id: 'sh7_7lr',  x: 4.9,  y: 0, width: 0.3,  height: 0.65, blockType: 'concrete', hp: 2, supports: ['sh7_7l'] },
      { id: 'sh7_7l',   x: 4.1,  y: 0.65,width: 1.1,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'sh7_7div', x: 5.8,  y: 0, width: 0.4,  height: 2.0,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'sh7_7rl',  x: 7.3,  y: 0, width: 0.3,  height: 1.6,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'sh7_7rr',  x: 8.2,  y: 0, width: 0.3,  height: 1.6,  blockType: 'concrete', hp: 2, supports: ['sh7_7r'] },
      { id: 'sh7_7r',   x: 7.3,  y: 1.6, width: 1.2,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: 'absolute_value_intro',
    hint: 'Cubic rises through the low shelf then keeps climbing to hit the high shelf. Find the a and h that arc through both.',
    theme: THEME,
  },

  // ── 7-8 ──────────────────────────────────────────────────────────────────
  // Vertex form (any sign of a). Multi-shot, 2 targets.
  // Two static moat walls create a narrow corridor. King + guard inside fortress.
  // 2 shots: vertex form with adjustable sign of a (positive arc can go up-then-right).
  {
    id: 'ch7-l8', chapter: 7, levelInChapter: 8,
    title: 'All Forms',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: 0.45, step: 0.01 },
      h: { min: 1.0,  max: 8.0,  step: 0.1 },
      k: { min: -2,   max: 6,    step: 0.1 },
    },
    defaultParams: { a: -0.15, h: 4.0, k: 0 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        vshot('Shot 1 — Break fortress ceiling', -0.12, 4.5, 2.0),
        vshot('Shot 2 — King inside',            -0.10, 4.0, 0),
      ],
    },
    targets: [
      { id: 'guard', x: 6.5,  y: 0.2, radius: 0.42, pigType: 'letterman', hp: 1, moving: null },
      { id: 'king',  x: 7.6,  y: 0.2, radius: 0.55, pigType: 'king',      hp: 1, moving: null },
    ],
    obstacles: [
      { id: 'sw1',       x: 3.5,  y: 0, width: 0.4,  height: 3.5 },
      { id: 'sw2',       x: 5.8,  y: 0.6, width: 0.4,  height: 2.0 },
      { id: 'fort7_8l',  x: 6.2,  y: 0, width: 0.35, height: 2.0, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort7_8r',  x: 8.4,  y: 0, width: 0.35, height: 2.0, blockType: 'concrete', hp: 2, supports: ['fort7_8t'] },
      { id: 'fort7_8t',  x: 6.2,  y: 2, width: 2.55, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Two static walls create a narrow high corridor. Shot 1: shatter the glass ceiling. Shot 2: reach the guard and king inside.',
    theme: THEME,
  },

  // ── 7-9 ──────────────────────────────────────────────────────────────────
  // Abs value: King pig under two glass overhangs — V-arc must peak between them.
  // Concrete pillars hold overhangs. King at ground level between columns.
  // Kill vectors: (1) V-arc peaks between overhangs → descends onto king,
  //               (2) destroy concrete pillar → overhang falls → crushes king
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
    targets: [{ id: 'king', x: 7.0, y: 0.2, radius: 0.55, pigType: 'king', hp: 1, moving: null }],
    obstacles: [
      { id: 'col7_9l',  x: 5.8,  y: 0, width: 0.35, height: 1.7, blockType: 'concrete', hp: 2, supports: ['ovh7_9l'] },
      { id: 'ovh7_9l',  x: 5.8,  y: 1.7, width: 1.3,  height: 0.3, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'col7_9r',  x: 8.0,  y: 0, width: 0.35, height: 2.2, blockType: 'concrete', hp: 2, supports: ['ovh7_9r'] },
      { id: 'ovh7_9r',  x: 7.0,  y: 2.2, width: 1.35, height: 0.3, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
        bonusShots: 1,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'V-arc peaks between the two glass overhangs. Set h to the king\'s x — or destroy a concrete column to drop the overhang on him.',
    theme: THEME,
  },

  // ── 7-10 ─────────────────────────────────────────────────────────────────
  // Grand finale: cubic, 2 static walls, bonus ring, king pig in elaborate fortress.
  // Two-shot finish: S-curve over both walls + bonus ring + break ceiling, then king.
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
        bonusShots: 1,
multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        { label: 'Shot 1 — Cubic ceiling break', equationForm: 'cubic',
          activeCoefficients: ['a', 'h'], sliderConfig: { a:{min:-0.10,max:0.10,step:0.005}, h:{min:1,max:8,step:0.1} },
          defaultParams: { a: 0.04, h: 5.0, k: 0 } },
        { label: 'Shot 2 — Vertex finish king', equationForm: 'vertex',
          activeCoefficients: ['a', 'h', 'k'], sliderConfig: { a:{min:-0.45,max:-0.03,step:0.01}, h:{min:1,max:8,step:0.1}, k:{min:-2,max:6,step:0.1} },
          defaultParams: { a: -0.10, h: 5.0, k: 0 } },
      ],
    },
    targets: [{ id: 'king', x: 8.5, y: 0.2, radius: 0.55, pigType: 'king', hp: 2, moving: null }],
    obstacles: [
      { id: 'sw7_10a',  x: 3.5,  y: 0, width: 0.4,  height: 2.5 },
      { id: 'sw7_10b',  x: 6.0,  y: 0.9, width: 0.4,  height: 2.0 },
      { id: 'fn_wl',    x: 7.8,  y: 0, width: 0.35, height: 2.2, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fn_wr',    x: 9.2,  y: 0, width: 0.35, height: 2.2, blockType: 'concrete', hp: 2, supports: ['fn_roof'] },
      { id: 'fn_roof',  x: 7.8,  y: 2.2, width: 1.75, height: 0.25, blockType: 'glass',   hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.8, y: 3.2, radius: 0.25 },
    starThresholds: [2, 3], starMode: 'bonus',
    revealAfter: 'function_transformations',
    hint: 'Cubic arc threads through the bonus ring and over both walls to break the fortress ceiling. Switch to vertex for Shot 2 to finish the King.',
    theme: THEME,
  },
];
