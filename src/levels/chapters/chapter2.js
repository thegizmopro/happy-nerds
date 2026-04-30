// Chapter 2: SHIFT — y = a(x−h)² + k
// Launcher at ground level (1, 0.8).
// k is player-controlled (active slider).
// worldY = 0.8 + a*(localX−h)² + k   where localX = worldX − 1

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'desert';

export const CHAPTER_2 = [
  // ── 2-1 ──────────────────────────────────────────────────────────────────
  // Tutorial: glass arch around pig. Arc passes through glass and shatters it.
  // Pig inside arch at ground level. Solution: k=0, h≈5.65 (vertex at pig x).
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
      { id: 'glass_col_l', x: 5.8, y: 0.8, width: 0.3,  height: 1.2, blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_col_r', x: 7.2, y: 0.8, width: 0.3,  height: 1.2, blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_beam',  x: 5.8, y: 2.0, width: 1.7,  height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Glass shatters on contact. Arc straight through the arch to reach the pig inside.',
    theme: THEME,
  },

  // ── 2-2 ──────────────────────────────────────────────────────────────────
  // Wood legs + glass arch cap. Pig sits on the glass beam.
  // Pig y = glass_beam.y + glass_beam.height + radius = 2.3+0.25+0.45 = 3.0
  // Strategy A: clip the glass beam (1HP) → pig falls.
  // Strategy B: direct hit at (6.075, 3.0) with k≈2.2.
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
      { id: 'wood_col_l',  x: 5.2,  y: 0.8, width: 0.35, height: 1.0,  blockType: 'wood',  hp: 2, supports: ["glass_col_l"] },
      { id: 'wood_col_r',  x: 6.95, y: 0.8, width: 0.35, height: 1.0,  blockType: 'wood',  hp: 2, supports: ["glass_col_r"] },
      { id: 'glass_col_l', x: 5.2,  y: 1.8, width: 0.35, height: 0.5,  blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_col_r', x: 6.95, y: 1.8, width: 0.35, height: 0.5,  blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_beam',  x: 5.2,  y: 2.3, width: 2.1,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Pig is on a glass platform. Raise k to reach the height — or smash the beam to drop him.',
    theme: THEME,
  },

  // ── 2-3 ──────────────────────────────────────────────────────────────────
  // Two-story arch: stone ground floor + glass upper floor. Pig on glass beam.
  // Pig y = glass_beam.y + glass_beam.height + radius = 2.45+0.2+0.45 = 3.1
  // Bonus ring at (4.5, 3.8): solution a≈-0.20, h≈3.5, k≈3.0.
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
      { id: 'stone_col_l', x: 5.6,  y: 0.8,  width: 0.3,  height: 0.8,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_col_r', x: 6.8,  y: 0.8,  width: 0.3,  height: 0.8,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_beam',  x: 5.6,  y: 1.6,  width: 1.5,  height: 0.2,  blockType: 'concrete', hp: 2, supports: ["glass_col_l","glass_col_r"] },
      { id: 'glass_col_l', x: 5.6,  y: 1.8,  width: 0.3,  height: 0.65, blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_col_r', x: 6.8,  y: 1.8,  width: 0.3,  height: 0.65, blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_beam',  x: 5.6,  y: 2.45, width: 1.5,  height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 3.8, radius: 0.3 },
    starThresholds: [2, 6], starMode: 'bonus',
    revealAfter: 'vertex_form',
    hint: 'Stone base, glass top. Shatter the glass beam to drop the pig — thread the ring for 3★.',
    theme: THEME,
  },

  // ── 2-4 ──────────────────────────────────────────────────────────────────
  // Wide stone arch. Pig sheltered inside at ground level.
  // Stone is 3HP — easier to arc THROUGH than to break. Solution: k=0, h≈5.8.
  {
    id: 'ch2-l4', chapter: 2, levelInChapter: 4,
    title: 'Stone Arch',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.12, h: 3.0, k: 1.08 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 6.8, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 1, moving: null }],
    obstacles: [
      { id: 'stone_col_l', x: 5.0,  y: 0.8, width: 0.35, height: 1.6,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_col_r', x: 7.5,  y: 0.8, width: 0.35, height: 1.6,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_beam',  x: 5.0,  y: 2.4, width: 2.85, height: 0.25, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Massive stone arch. Arc through the opening at the right height to tag the pig inside.',
    theme: THEME,
  },

  // ── 2-5 ──────────────────────────────────────────────────────────────────
  // Three-story tower: stone → wood → glass. Pig on glass roof beam.
  // Pig y = glass_beam.y + glass_beam.height + radius = 3.05+0.2+0.45 = 3.7...
  // Recalc: glass_col starts at 2.45, height 0.4 → top 2.85; glass_beam y=2.85 h=0.2 → top 3.05; pig y=3.5.
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
      { id: 'stone_col_l', x: 5.9,  y: 0.8,  width: 0.3, height: 0.7,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_col_r', x: 6.9,  y: 0.8,  width: 0.3, height: 0.7,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_beam',  x: 5.9,  y: 1.5,  width: 1.3, height: 0.2,  blockType: 'concrete', hp: 2, supports: ["wood_col_l","wood_col_r"] },
      { id: 'wood_col_l',  x: 5.9,  y: 1.7,  width: 0.3, height: 0.55, blockType: 'wood',  hp: 2, supports: ["wood_beam"] },
      { id: 'wood_col_r',  x: 6.9,  y: 1.7,  width: 0.3, height: 0.55, blockType: 'wood',  hp: 2, supports: ["wood_beam"] },
      { id: 'wood_beam',   x: 5.9,  y: 2.25, width: 1.3, height: 0.2,  blockType: 'wood',  hp: 2, supports: ["glass_col_l","glass_col_r"] },
      { id: 'glass_col_l', x: 5.9,  y: 2.45, width: 0.3, height: 0.4,  blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_col_r', x: 6.9,  y: 2.45, width: 0.3, height: 0.4,  blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_beam',  x: 5.9,  y: 2.85, width: 1.3, height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Three stories tall. Clip the glass roof beam to start the collapse, then finish the pig at ground level.',
    theme: THEME,
  },

  // ── 2-6 ──────────────────────────────────────────────────────────────────
  // Glass arch cage around pig. Two-constraint precision: thread ring AND hit pig.
  // Pig inside arch at (8.0, 1.2). Solution: a≈-0.14, h≈4.1, k≈2.0.
  {
    id: 'ch2-l6', chapter: 2, levelInChapter: 6,
    title: 'Precision',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.005 },
      h: { min: 1.0, max: 8.0, step: 0.05 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.18, h: 4.0, k: 2.88 },
    launcher: LAUNCHER,
    targets: [{ id: 'pig', x: 8.0, y: 1.2, radius: 0.40, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'glass_col_l', x: 7.1,  y: 0.8, width: 0.3,  height: 0.9, blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_col_r', x: 8.6,  y: 0.8, width: 0.3,  height: 0.9, blockType: 'glass', hp: 1, supports: ["glass_beam"] },
      { id: 'glass_beam',  x: 7.1,  y: 1.7, width: 1.8,  height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 5.0, y: 3.0, radius: 0.3 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Hit the pig for 1★. Thread the golden ring first for 3★.',
    theme: THEME,
  },

  // ── 2-7 ──────────────────────────────────────────────────────────────────
  // Static wall (solid) + stone arch beyond it. Arc must peak above wall (top=3.5)
  // then descend inside the arch opening. Solution: a≈-0.40, h≈3.0, k≈3.14.
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
      { id: 'wall',        x: 3.8,  y: 0.8, width: 0.4,  height: 2.7 },
      { id: 'stone_col_l', x: 5.8,  y: 0.8, width: 0.35, height: 1.5, blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_col_r', x: 7.5,  y: 0.8, width: 0.35, height: 1.5, blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_beam',  x: 5.8,  y: 2.3, width: 2.05, height: 0.25, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Peak above the wall, then descend into the arch opening to reach the pig.',
    theme: 'forest',
  },

  // ── 2-8 ──────────────────────────────────────────────────────────────────
  // Static wall (top=2.6) + ceiling slab (bottom=3.5) form a narrow threading gap.
  // Wood arch beyond the slab; pig on glass beam.
  // Pig y = glass_beam.y + height + radius = 1.6+0.2+0.45 = 2.25
  // Solution: arc stays between y=2.6 and y=3.5 at x=3.5–8.0, then descends to pig.
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
      { id: 'wall1',      x: 3.5, y: 0.8,  width: 0.4,  height: 1.8 },
      { id: 'plat',       x: 5.5, y: 3.5,  width: 2.5,  height: 0.3 },
      { id: 'wood_col_l', x: 7.8, y: 0.8,  width: 0.3,  height: 0.8, blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'wood_col_r', x: 8.8, y: 0.8,  width: 0.3,  height: 0.8, blockType: 'wood',  hp: 2, supports: ["glass_beam"] },
      { id: 'glass_beam', x: 7.8, y: 1.6,  width: 1.3,  height: 0.2, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Thread between the wall and the ceiling slab, then knock the pig off its perch.',
    theme: 'forest',
  },

  // ── 2-9 ──────────────────────────────────────────────────────────────────
  // Stone arch with pig on a glass pedestal inside.
  // Break pedestal (glass, 1HP) → pig falls and is easier to hit.
  // Bonus ring + pig: two constraints. Solution: a≈-0.151, h≈4.0, k≈2.55.
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
    // Pig y = pedestal.y + pedestal.height + radius = 0.8+0.3+0.40 = 1.5
    targets: [{ id: 'pig', x: 8.5, y: 1.5, radius: 0.40, pigType: 'helmet', hp: 1, moving: null, restingOn: 'pedestal' }],
    obstacles: [
      { id: 'stone_col_l', x: 7.7,  y: 0.8, width: 0.3,  height: 0.8,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_col_r', x: 9.0,  y: 0.8, width: 0.3,  height: 0.8,  blockType: 'concrete', hp: 2, supports: ["stone_beam"] },
      { id: 'stone_beam',  x: 7.7,  y: 1.6, width: 1.6,  height: 0.2,  blockType: 'concrete', hp: 2, supports: [] },
      { id: 'pedestal',    x: 8.1,  y: 0.8, width: 0.8,  height: 0.3,  blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.0, y: 3.2, radius: 0.28 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Thread the ring and hit the pig — one arc, two constraints. Break the pedestal first for a simpler follow-up.',
    theme: 'forest',
  },

  // ── 2-10 ─────────────────────────────────────────────────────────────────
  // Static wall + wood gate arch. Moving pig patrols between the gate pillars.
  // No restingOn: pig is moving. Arc clears wall, threads gate, times the shot.
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
      { id: 'wall',        x: 3.0,  y: 0.8, width: 0.4,  height: 2.0 },
      { id: 'gate_col_l',  x: 5.8,  y: 0.8, width: 0.3,  height: 2.0, blockType: 'wood', hp: 2, supports: ["gate_beam"] },
      { id: 'gate_col_r',  x: 7.7,  y: 0.8, width: 0.3,  height: 2.0, blockType: 'wood', hp: 2, supports: ["gate_beam"] },
      { id: 'gate_beam',   x: 5.8,  y: 2.8, width: 2.2,  height: 0.2, blockType: 'wood', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Moving target patrols inside the gate. Set k for the right height, time the release.',
    theme: 'forest',
  },
];
