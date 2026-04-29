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
    title: 'Glass Guard',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.15, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    // Pig at ground level behind a glass wall.
    // With h=3, arc returns to y=0.8 at worldX=7 for any a.
    // Steep a clears wall top (y=2.3); gentle a passes through glass.
    targets: [{ id: 'pig', x: 7.0, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'glass', x: 4.5, y: 0.8, width: 0.4, height: 1.5, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'A glass block guards the pig. Move h to aim the arc — glass shatters on contact.',
    theme: THEME,
  },
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
    defaultParams: { a: -0.10, h: 5.5, k: 0 },
    launcher: LAUNCHER,
    // Pig on glass platform supported by two wood columns.
    // Pig y = platform.y + platform.height + radius = 2.3+0.25+0.45 = 3.0
    // Solution A (direct): k=2.2, h=5.5 → vertex at (6.5, 3.0), arc hits pig.
    // Solution B (cascade): any arc through platform at worldY≈2.3–2.55 breaks glass → pig falls to y=0.8.
    targets: [{ id: 'pig', x: 6.5, y: 3.0, radius: 0.45, pigType: 'letterman', hp: 2, moving: null, restingOn: 'platform' }],
    obstacles: [
      { id: 'col_l',    x: 5.5, y: 0.8, width: 0.4, height: 1.5, blockType: 'wood',  hp: 2, supports: [] },
      { id: 'col_r',    x: 7.1, y: 0.8, width: 0.4, height: 1.5, blockType: 'wood',  hp: 2, supports: [] },
      { id: 'platform', x: 5.5, y: 2.3, width: 2.0, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Pig sits on a glass platform. Raise k to lift the arc to target height — or smash the platform to drop the pig.',
    theme: THEME,
  },
  {
    id: 'ch2-l3', chapter: 2, levelInChapter: 3,
    title: 'Tower Block',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: {
      a: { min: -0.45, max: -0.03, step: 0.01 },
      h: { min: 1.0, max: 8.0, step: 0.1 },
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.15, h: 3.0, k: 0 },
    launcher: LAUNCHER,
    // Wood base supports glass cap; pig rests on cap.
    // Pig y = glass_top.y + glass_top.height + radius = 1.8+0.4+0.45 = 2.65
    // Direct hit: k≈1.85, h≈5.25 → vertex over pig, worldY≈2.65.
    // Cascade hit: break glass_top (1HP) → pig falls; OR break wood_base (2HP) → glass_top falls → pig falls.
    // Bonus ring at (4.5, 3.2): solution a≈-0.114, h≈3.0, k≈2.43 satisfies both constraints.
    targets: [{ id: 'pig', x: 6.25, y: 2.65, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: 'glass_top' }],
    obstacles: [
      { id: 'wood_base', x: 6.0, y: 0.8, width: 0.5, height: 1.0, blockType: 'wood',  hp: 2, supports: ['glass_top'] },
      { id: 'glass_top', x: 6.0, y: 1.8, width: 0.5, height: 0.4, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.5, y: 3.2, radius: 0.3 },
    starThresholds: [2, 6], starMode: 'bonus',
    revealAfter: 'vertex_form',
    hint: 'Break the glass cap to drop the pig, or arc right to the pig. Thread the bonus ring for 3★.',
    theme: THEME,
  },
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
    defaultParams: { a: -0.12, h: 3.0, k: 0 },
    launcher: LAUNCHER,
    // Two stone pillars frame a glass shelf; pig rests on top.
    // Pig y = shelf.y + shelf.height + radius = 2.5+0.25+0.45 = 3.2
    // Stone pillars (hp=3) are impractical to break; easiest path: break glass shelf → pig falls;
    // OR direct hit at (6.3, 3.2): k≈2.4, h≈5.3.
    targets: [{ id: 'pig', x: 6.3, y: 3.2, radius: 0.45, pigType: 'letterman', hp: 2, moving: null, restingOn: 'shelf' }],
    obstacles: [
      { id: 'col_l', x: 5.0, y: 0.8, width: 0.4, height: 1.7, blockType: 'stone', hp: 3, supports: [] },
      { id: 'col_r', x: 7.2, y: 0.8, width: 0.4, height: 1.7, blockType: 'stone', hp: 3, supports: [] },
      { id: 'shelf', x: 5.0, y: 2.5, width: 2.6, height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Stone pillars frame a glass shelf. Break the shelf to drop the pig, then adjust k to swing higher.',
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
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.08, h: 3.5, k: 0 },
    launcher: LAUNCHER,
    // Four-block tower: stone base → wood × 2 → glass cap. Pig on glass cap.
    // Pig y = glass_top.y + glass_top.height + radius = 2.3+0.35+0.45 = 3.1
    // Easiest: hit glass_top (1HP) → pig falls; then hit pig at y=0.8 (k=0).
    // Direct hit at (6.25, 3.1): k≈2.3, h≈5.25.
    // Deep cascade not chained; stone_base/wood_mid are cosmetic challenge.
    targets: [{ id: 'pig', x: 6.25, y: 3.1, radius: 0.45, pigType: 'letterman', hp: 2, moving: null, restingOn: 'glass_top' }],
    obstacles: [
      { id: 'stone_base', x: 6.0, y: 0.8, width: 0.5, height: 0.5, blockType: 'stone', hp: 3, supports: [] },
      { id: 'wood_m1',    x: 6.0, y: 1.3, width: 0.5, height: 0.5, blockType: 'wood',  hp: 2, supports: [] },
      { id: 'wood_m2',    x: 6.0, y: 1.8, width: 0.5, height: 0.5, blockType: 'wood',  hp: 2, supports: ['glass_top'] },
      { id: 'glass_top',  x: 6.0, y: 2.3, width: 0.5, height: 0.35, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Tall tower with glass at the top. Clip the glass cap to drop the pig, then finish it on the ground.',
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
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.18, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    // Pig flanked by two glass walls inside a glass pen.
    // Solution (ring + pig): a≈-0.14, h≈4.1, k≈2.0 satisfies both constraints.
    // Arc passes through glass walls; 3★ requires threading bonus ring too.
    targets: [{ id: 'pig', x: 8.0, y: 1.2, radius: 0.40, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'cage_l', x: 7.35, y: 0.8, width: 0.25, height: 0.85, blockType: 'glass', hp: 1, supports: [] },
      { id: 'cage_r', x: 8.40, y: 0.8, width: 0.25, height: 0.85, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 5.0, y: 3.0, radius: 0.3 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Hit the target for 1★. Thread through the golden ring for 3★.',
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
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.15, h: 5.0, k: 0 },
    launcher: LAUNCHER,
    // Static wall top = 0.8+2.7 = 3.5. Arc must peak above 3.5 to clear it.
    // Pig sheltered by glass side walls + glass roof. Arc descends through glass roof to reach pig.
    // Solution: h≈3, k≈0 → arc peaks high, descends to y=0.8 at x=7.
    targets: [{ id: 'pig', x: 7.0, y: 0.8, radius: 0.45, pigType: 'helmet', hp: 1, moving: null }],
    obstacles: [
      { id: 'wall',        x: 3.8, y: 0.8, width: 0.4,  height: 2.7 },
      { id: 'shelter_l',   x: 6.3, y: 0.8, width: 0.3,  height: 1.0,  blockType: 'glass', hp: 1, supports: [] },
      { id: 'shelter_r',   x: 7.4, y: 0.8, width: 0.3,  height: 1.0,  blockType: 'glass', hp: 1, supports: [] },
      { id: 'shelter_top', x: 6.3, y: 1.8, width: 1.4,  height: 0.25, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Clear the tall wall, then punch through the glass roof to reach the pig below.',
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
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.20, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    // Static wall1 top = 0.8+1.8 = 2.6. Static plat bottom = 3.5. Arc must pass above 2.6 then below 3.5.
    // Pig on glass cap: glass_cap.top = 1.35+0.2 = 1.55; pig.y = 1.55+0.45 = 2.0.
    // Break glass cap → pig falls to y=0.8; OR direct hit on pig at (8.25, 2.0).
    targets: [{ id: 'pig', x: 8.25, y: 2.0, radius: 0.45, pigType: 'letterman', hp: 2, moving: null, restingOn: 'glass_cap' }],
    obstacles: [
      { id: 'wall1',     x: 3.5, y: 0.8,  width: 0.4,  height: 1.8 },
      { id: 'plat',      x: 5.5, y: 3.5,  width: 2.5,  height: 0.3 },
      { id: 'wood_base', x: 8.0, y: 0.8,  width: 0.5,  height: 0.55, blockType: 'wood',  hp: 2, supports: ['glass_cap'] },
      { id: 'glass_cap', x: 8.0, y: 1.35, width: 0.5,  height: 0.2,  blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Thread between the wall and the ceiling platform, then knock down the pig\'s perch.',
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
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.14, h: 4.5, k: 0 },
    launcher: LAUNCHER,
    // Pig on glass pedestal: pedestal.top = 0.8+0.3 = 1.1; pig.y = 1.1+0.40(radius) = 1.5.
    // Break pedestal → pig falls to y=0.8. Direct hit: k≈0.7, h≈7.5.
    // Bonus ring + pig constraint: a≈-0.151, h≈4.0, k≈2.55.
    targets: [{ id: 'pig', x: 8.5, y: 1.5, radius: 0.40, pigType: 'helmet', hp: 1, moving: null, restingOn: 'pedestal' }],
    obstacles: [
      { id: 'pedestal', x: 8.1, y: 0.8, width: 0.8, height: 0.3, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: { x: 4.0, y: 3.2, radius: 0.28 },
    starThresholds: [3, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Pass through the ring AND hit the target. Break the pedestal for an easier second shot.',
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
      k: { min: -5.0, max: 5.0, step: 0.05 },
    },
    defaultParams: { a: -0.18, h: 4.0, k: 0 },
    launcher: LAUNCHER,
    // Moving pig travels x: 5.5–8.0 at y=2.2. Static wall top = 0.8+2.0 = 2.8 → arc must pass above 2.8.
    // Glass column at x=6.5 is mid-range decoration; arc passes through on way to pig.
    // No restingOn: pig is moving, not static.
    targets: [{
      id: 'cool', x: 6.5, y: 2.2, radius: 0.42, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.5, max: 8.0, speed: 1.0 },
    }],
    obstacles: [
      { id: 'wall',      x: 3.0, y: 0.8, width: 0.4,  height: 2.0 },
      { id: 'glass_col', x: 6.5, y: 0.8, width: 0.3,  height: 1.7, blockType: 'glass', hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [1, 3], starMode: 'moves',
    revealAfter: null,
    hint: 'Moving target at elevation. Clear the wall, set k to the right height, then time the release.',
    theme: 'forest',
  },
];
