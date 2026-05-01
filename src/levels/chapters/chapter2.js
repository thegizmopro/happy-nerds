// Chapter 2: SHIFT — y = a(x−h)² + k
// Launcher at ground level (1, 0.8).
// k is player-controlled (active slider).
// worldY = 0.8 + a*(localX−h)² + k   where localX = worldX − 1
//
// Design: vertex form gives full aiming control.
// Structures require precise vertex placement.
// Multi-story buildings, enclosed chambers, cascade chains.
// Kill vectors: direct hit, fall (destroy support), crush (cascade).

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'desert';

export const CHAPTER_2 = [
  // ── 2-1 ──────────────────────────────────────────────────────────────────
  // Glass arch around pig at ground level. Simplest vertex form level.
  // Kill vectors: (1) arc through glass arch → direct hit, (2) destroy glass beam → roof collapses
  {
    id: 'ch2-l1', chapter: 2, levelInChapter: 1,
    title: 'Glass Guard',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.15, h: 5.0, k: 3.75 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.65, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'glass_col_l', x: 5.8, y: 0.8, width: 0.3, height: 1.2, blockType: 'glass', hp: 1, supports: ['glass_beam'] },
      { id: 'glass_col_r', x: 7.2, y: 0.8, width: 0.3, height: 1.2, blockType: 'glass', hp: 1, supports: ['glass_beam'] },
      { id: 'glass_beam',  x: 5.8, y: 2.0, width: 1.7, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Glass shatters on contact. Arc through the arch to reach the pig inside.',
    theme: THEME,
  },

  // ── 2-2 ──────────────────────────────────────────────────────────────────
  // Pig on glass beam supported by wood columns. Destroy beam → pig falls.
  // Kill vectors: (1) direct arc at pig on beam, (2) destroy glass beam → pig falls >1.5 units
  {
    id: 'ch2-l2', chapter: 2, levelInChapter: 2,
    title: 'Hanging Platform',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.10, h: 5.5, k: 3.025 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.075, y: 3.0, radius: 0.45, pigType: 'letterman', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'wood_col_l',  x: 5.2,  y: 0.8, width: 0.35, height: 1.0, blockType: 'wood',  hp: 2, supports: ['glass_col_l'] },
      { id: 'wood_col_r',  x: 6.95, y: 0.8, width: 0.35, height: 1.0, blockType: 'wood',  hp: 2, supports: ['glass_col_r'] },
      { id: 'glass_col_l', x: 5.2,  y: 1.8, width: 0.35, height: 0.5, blockType: 'glass', hp: 1, supports: ['glass_beam'] },
      { id: 'glass_col_r', x: 6.95, y: 1.8, width: 0.35, height: 0.5, blockType: 'glass', hp: 1, supports: ['glass_beam'] },
      { id: 'glass_beam',  x: 5.2,  y: 2.3, width: 2.1, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Pig is on a glass platform. Raise k to reach the height — or smash the beam to drop him.',
    theme: THEME,
  },

  // ── 2-3 ──────────────────────────────────────────────────────────────────
  // Two-story: concrete ground floor + glass upper floor. Pig on glass beam.
  // Kill vectors: (1) arc through glass top → direct hit, (2) hit concrete columns → cascade → pig falls
  {
    id: 'ch2-l3', chapter: 2, levelInChapter: 3,
    title: 'Two-Story',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.15, h: 3.0, k: 1.35 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.35, y: 3.1, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'stone_col_l', x: 5.6,  y: 0.8, width: 0.3, height: 0.8, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_col_r', x: 6.8,  y: 0.8, width: 0.3, height: 0.8, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_beam',  x: 5.6,  y: 1.6, width: 1.5, height: 0.2, blockType: 'concrete', hp: 2, supports: ['glass_col_l', 'glass_col_r'] },
      { id: 'glass_col_l', x: 5.6,  y: 1.8, width: 0.3, height: 0.65, blockType: 'glass', hp: 1, supports: ['glass_beam'] },
      { id: 'glass_col_r', x: 6.8,  y: 1.8, width: 0.3, height: 0.65, blockType: 'glass', hp: 1, supports: ['glass_beam'] },
      { id: 'glass_beam',  x: 5.6,  y: 2.45, width: 1.5, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 3.8, radius: 0.3 },
    starThresholds: [2, 6], starMode: 'bonus',
    revealAfter: 'vertex_form',
    hint: 'Stone base, glass top. Shatter the glass beam to drop the pig — thread the ring for 3★.',
    theme: THEME,
  },

  // ── 2-4 ──────────────────────────────────────────────────────────────────
  // Stone wall blocks path. Glass lane through a second wall lets ball pass.
  // Target behind both walls. Must arc over stone, then through glass.
  {
    id: 'ch2-l4', chapter: 2, levelInChapter: 4,
    title: 'Stone & Glass',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.12, h: 5.0, k: 2.5 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.8, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone_wall',  x: 4.5, y: 0.8, width: 0.4, height: 2.2, blockType: 'stone', hp: 3, supports: [] },
      { id: 'glass_lane',  x: 6.5, y: 0.8, width: 0.35, height: 1.6, blockType: 'glass', hp: 1, supports: [] },
      { id: 'wood_pillar', x: 8.2, y: 0.8, width: 0.4, height: 1.0, blockType: 'wood',  hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Stone wall is indestructible. Arc over it. Glass wall shatters — the ball passes through to the target.',
    theme: THEME,
  },

  // ── 2-5 ──────────────────────────────────────────────────────────────────
  // Three-story tower: concrete → wood → glass. Pig on glass roof beam.
  // Kill vectors: (1) direct arc at pig, (2) hit concrete base → cascade all 3 floors → pig falls
  {
    id: 'ch2-l5', chapter: 2, levelInChapter: 5,
    title: 'Skyscraper',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.08, h: 3.5, k: 0.98 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.55, y: 3.5, radius: 0.45, pigType: 'letterman', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'stone_col_l', x: 5.9,  y: 0.8, width: 0.3, height: 0.7, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_col_r', x: 6.9,  y: 0.8, width: 0.3, height: 0.7, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_beam',  x: 5.9,  y: 1.5, width: 1.3, height: 0.2, blockType: 'concrete', hp: 2, supports: ['wood_col_l', 'wood_col_r'] },
      { id: 'wood_col_l',  x: 5.9,  y: 1.7, width: 0.3, height: 0.55, blockType: 'wood', hp: 2, supports: ['wood_beam'] },
      { id: 'wood_col_r',  x: 6.9,  y: 1.7, width: 0.3, height: 0.55, blockType: 'wood', hp: 2, supports: ['wood_beam'] },
      { id: 'wood_beam',   x: 5.9,  y: 2.25, width: 1.3, height: 0.2, blockType: 'wood', hp: 2, supports: ['glass_col_l', 'glass_col_r'] },
      { id: 'glass_col_l', x: 5.9,  y: 2.45, width: 0.3, height: 0.4, blockType: 'glass', hp: 1, supports: ['glass_beam'] },
      { id: 'glass_col_r', x: 6.9,  y: 2.45, width: 0.3, height: 0.4, blockType: 'glass', hp: 1, supports: ['glass_beam'] },
      { id: 'glass_beam',  x: 5.9,  y: 2.85, width: 1.3, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: 'horizontal_shift',
    hint: 'Three stories tall. Hit the concrete base to cascade the whole tower down.',
    theme: THEME,
  },

  // ── 2-6 ──────────────────────────────────────────────────────────────────
  // Enclosed chamber with target inside. Stone left wall, concrete right wall, glass ceiling.
  // Kill vectors: (1) arc through glass ceiling → direct hit, (2) break concrete wall → ceiling collapses
  {
    id: 'ch2-l6', chapter: 2, levelInChapter: 6,
    title: 'Chamber',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.05 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.18, h: 4.0, k: 2.88 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 7.2, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone_left',     x: 6.0, y: 0.8, width: 0.4, height: 2.6, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'concrete_right', x: 8.4, y: 0.8, width: 0.4, height: 2.6, blockType: 'concrete', hp: 2, supports: ['ceiling'] },
      { id: 'ceiling',        x: 6.0, y: 3.4, width: 2.8, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: { x: 5.0, y: 3.0, radius: 0.28 },
    starThresholds: [2, 6], starMode: 'bonus',
    revealAfter: null,
    hint: 'Arc through the glass ceiling to hit the pig inside. Or break the concrete wall to collapse the ceiling.',
    theme: THEME,
  },

  // ── 2-7 ──────────────────────────────────────────────────────────────────
  // Over the wall: stone wall forces high arc. Target inside concrete arch beyond.
  // Two constraints: arc must peak above wall AND descend into arch opening.
  {
    id: 'ch2-l7', chapter: 2, levelInChapter: 7,
    title: 'Over the Wall',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.05, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.15, h: 5.0, k: 3.75 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.8, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall',        x: 3.8, y: 0.8, width: 0.4, height: 2.7 },
      { id: 'stone_col_l', x: 5.8, y: 0.8, width: 0.35, height: 1.5, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_col_r', x: 7.5, y: 0.8, width: 0.35, height: 1.5, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_beam',  x: 5.8, y: 2.3, width: 2.05, height: 0.25, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Peak above the wall, then descend into the arch opening to reach the pig.',
    theme: 'forest',
  },

  // ── 2-8 ──────────────────────────────────────────────────────────────────
  // Static wall + ceiling slab form a narrow threading gap.
  // Target on glass beam behind the slab.
  // Kill vectors: (1) arc through gap → clip glass beam → pig falls, (2) arc directly at pig height
  {
    id: 'ch2-l8', chapter: 2, levelInChapter: 8,
    title: 'Loop Around',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.05, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.043, h: 6.0, k: 1.55 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 8.45, y: 2.25, radius: 0.45, pigType: 'letterman', hp: 1, moving: null, restingOn: 'glass_beam' }],
    obstacles: [
      { id: 'wall1',      x: 3.5, y: 0.8, width: 0.4, height: 1.8 },
      { id: 'plat',       x: 5.5, y: 3.5, width: 2.5, height: 0.3 },
      { id: 'wood_col_l', x: 7.8, y: 0.8, width: 0.3, height: 0.8, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'wood_col_r', x: 8.8, y: 0.8, width: 0.3, height: 0.8, blockType: 'wood', hp: 2, supports: ['glass_beam'] },
      { id: 'glass_beam', x: 7.8, y: 1.6, width: 1.3, height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: 'vertex_hunting',
    hint: 'Thread between the wall and the ceiling slab, then knock the pig off its perch.',
    theme: 'forest',
  },

  // ── 2-9 ──────────────────────────────────────────────────────────────────
  // Stone arch with glass pedestal inside. Target on pedestal.
  // Kill vectors: (1) direct arc at target, (2) destroy glass pedestal → target falls
  {
    id: 'ch2-l9', chapter: 2, levelInChapter: 9,
    title: 'Checkpoint',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.05 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.14, h: 4.5, k: 2.835 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 8.5, y: 1.5, radius: 0.40, pigType: 'helmet', hp: 1, moving: null, restingOn: 'pedestal' }],
    obstacles: [
      { id: 'stone_col_l', x: 7.7, y: 0.8, width: 0.3, height: 0.8, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_col_r', x: 9.0, y: 0.8, width: 0.3, height: 0.8, blockType: 'concrete', hp: 2, supports: ['stone_beam'] },
      { id: 'stone_beam',  x: 7.7, y: 1.6, width: 1.6, height: 0.2, blockType: 'concrete', hp: 2, supports: [] },
      { id: 'pedestal',    x: 8.1, y: 0.8, width: 0.8, height: 0.3, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.0, y: 3.2, radius: 0.28 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Thread the ring and hit the pig. Break the glass pedestal first to drop the pig to ground level.',
    theme: 'forest',
  },

  // ── 2-10 ─────────────────────────────────────────────────────────────────
  // Moving target inside wood gate. Stone wall in approach.
  // Set vertex position, then time the shot.
  {
    id: 'ch2-l10', chapter: 2, levelInChapter: 10,
    title: 'Moving Target',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.18, h: 4.0, k: 2.88 },
    launcher: LAUNCHER,
    targets: [{
      id: 'cool', x: 6.5, y: 2.2, radius: 0.42, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.5, max: 8.0, speed: 1.0 },
    }],
    obstacles: [
      { id: 'wall',        x: 3.0, y: 0.8, width: 0.4, height: 2.0 },
      { id: 'gate_col_l',  x: 5.8, y: 0.8, width: 0.3, height: 2.0, blockType: 'wood', hp: 2, supports: ['gate_beam'] },
      { id: 'gate_col_r',  x: 7.7, y: 0.8, width: 0.3, height: 2.0, blockType: 'wood', hp: 2, supports: ['gate_beam'] },
      { id: 'gate_beam',   x: 5.8, y: 2.8, width: 2.2, height: 0.2, blockType: 'wood', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: 'symmetry',
    hint: 'Moving target patrols inside the gate. Set k for the right height, time the release.',
    theme: 'forest',
  },
];
