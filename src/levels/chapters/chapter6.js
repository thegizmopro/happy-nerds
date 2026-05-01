// Chapter 6: MULTI-SHOT — sequential shots, each with its own equation.
// Structures persist across all shots — early shots weaken/clear, later shots kill.
// Stone = permanent barrier. Concrete = 2-hit. Glass = pass-through.

const LAUNCHER = { x: 1, y: 0.8 };
const THEME = 'space';

const stdSliders = {
  a: { min: -0.40, max: -0.02, step: 0.01 },
  h: { min: 1.0,  max: 8.0,  step: 0.1  },
};

function shot(label, defaults, kVal = 0) {
  return {
    label,
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: { ...stdSliders, k: { min: -2, max: 6, step: 0.1 } },
    defaultParams: { ...defaults, k: kVal },
  };
}

export const CHAPTER_6 = [
  // ── 6-1 ──────────────────────────────────────────────────────────────────
  // Shot 1: pig on glass shelf (concrete pillar supports).
  // Shot 2: pig on 3-layer tower (concrete→wood→glass). Stone wall separates them.
  // Kill vectors shelf: destroy concrete pillar → glass shelf drops → pig falls.
  // Kill vectors tower: hit concrete base → full cascade.
  {
    id: 'ch6-l1', chapter: 6, levelInChapter: 1,
    title: 'Double Trouble',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: stdSliders,
    defaultParams: { a: -0.20, h: 2.5, k: 1.25 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Shelf pig',  { a: -0.22, h: 2.2 }, 1.0),
        shot('Shot 2 — Tower pig',  { a: -0.10, h: 5.5 }, 3.0),
      ],
    },
    targets: [
      { id: 'pig_l', x: 4.55, y: 2.0,  radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf_l' },
      { id: 'pig_r', x: 7.65, y: 2.2,  radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'twr_top' },
    ],
    obstacles: [
      { id: 'pl_l',     x: 3.8,  y: 0.6, width: 0.35, height: 0.7,  blockType: 'concrete', hp: 2, supports: ['shelf_l'] },
      { id: 'pl_r',     x: 5.0,  y: 0.6, width: 0.35, height: 0.7,  blockType: 'wood',     hp: 2, supports: ['shelf_l'] },
      { id: 'shelf_l',  x: 3.8,  y: 1.3, width: 1.55, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'divider',  x: 5.7,  y: 0.6, width: 0.4,  height: 1.8,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'twr_base', x: 7.4,  y: 0.6, width: 0.5,  height: 0.8,  blockType: 'concrete', hp: 2, supports: ['twr_top'] },
      { id: 'twr_top',  x: 7.4,  y: 1.4, width: 0.5,  height: 0.35, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [2, 3], starMode: 'moves',
    revealAfter: 'multi_shot_strategy',
    hint: 'Shot 1 collapses the left shelf. Stone divider separates the zones. Shot 2 topples the right tower via cascade.',
    theme: THEME,
  },

  // ── 6-2 ──────────────────────────────────────────────────────────────────
  // Staged castle assault: 3 shots. Letterman (hp:2) inside stone fortress.
  // Stone outer walls (∞), concrete inner walls (2-hit each), glass roof.
  // Shot 1: smash glass roof. Shot 2: break one concrete inner wall. Shot 3: kill pig.
  {
    id: 'ch6-l2', chapter: 6, levelInChapter: 2,
    title: 'Staged Assault',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: stdSliders,
    defaultParams: { a: -0.12, h: 4.0, k: 1.92 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Smash glass roof',   { a: -0.14, h: 3.5 }),
        shot('Shot 2 — Break inner wall',   { a: -0.12, h: 4.5 }),
        shot('Shot 3 — Kill letterman',     { a: -0.10, h: 4.5 }),
      ],
    },
    targets: [{ id: 'pig', x: 7.25, y: 0.8, radius: 0.45, pigType: 'letterman', hp: 2, moving: null }],
    obstacles: [
      { id: 'outer_l',  x: 5.8,  y: 0.6, width: 0.4,  height: 2.8, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'inner_l',  x: 6.3,  y: 0.6, width: 0.35, height: 2.4, blockType: 'concrete', hp: 2, supports: ['castle_roof'] },
      { id: 'inner_r',  x: 8.0,  y: 0.6, width: 0.35, height: 2.4, blockType: 'concrete', hp: 2, supports: ['castle_roof'] },
      { id: 'outer_r',  x: 8.5,  y: 0.6, width: 0.4,  height: 2.8, blockType: 'stone',    hp: 3, supports: [] },
      { id: 'castle_roof',x: 6.3, y: 3.0, width: 2.05, height: 0.25, blockType: 'glass',  hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 4], starMode: 'moves',
    revealAfter: null,
    hint: 'Peel the fortress layer by layer: shatter the glass roof, crack the inner wall, then finish the Letterman.',
    theme: THEME,
  },

  // ── 6-3 ──────────────────────────────────────────────────────────────────
  // Path-clearing: 4 shots. Two stone-topped wood columns block the path.
  // Shots 1-2 demolish columns. Shot 3: kill guard pig (whistle). Shot 4: finish king.
  // Kill vector columns: destroy wood base → concrete falls → path cleared.
  {
    id: 'ch6-l3', chapter: 6, levelInChapter: 3,
    title: 'Clear the Path',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: stdSliders,
    defaultParams: { a: -0.18, h: 3.5, k: 2.205 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 4,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Smash col 1', { a: -0.28, h: 2.0 }),
        shot('Shot 2 — Smash col 2', { a: -0.22, h: 3.0 }),
        shot('Shot 3 — Guard pig',   { a: -0.14, h: 4.5 }),
        shot('Shot 4 — King pig',    { a: -0.08, h: 5.5 }),
      ],
    },
    targets: [
      { id: 'blocker', x: 6.5, y: 0.8, radius: 0.42, pigType: 'whistle', hp: 1, moving: null },
      { id: 'king',    x: 8.8, y: 0.8, radius: 0.55, pigType: 'king',    hp: 2, moving: null },
    ],
    obstacles: [
      { id: 'col1_base', x: 3.8, y: 0.6, width: 0.4, height: 1.0, blockType: 'wood',     hp: 2, supports: ['col1_top'] },
      { id: 'col1_top',  x: 3.8, y: 1.6, width: 0.4, height: 0.6, blockType: 'concrete', hp: 2, supports: [] },
      { id: 'col2_base', x: 5.3, y: 0.6, width: 0.4, height: 1.0, blockType: 'wood',     hp: 2, supports: ['col2_top'] },
      { id: 'col2_top',  x: 5.3, y: 1.6, width: 0.4, height: 0.6, blockType: 'concrete', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [4, 5], starMode: 'moves',
    revealAfter: null,
    hint: 'Smash both columns first — then the path is clear to hit the guard and finish the King.',
    theme: THEME,
  },

  // ── 6-4 ──────────────────────────────────────────────────────────────────
  // 3 towers at increasing difficulty. 3 shots, one pig each.
  // Tower 1 (glass only). Tower 2 (concrete→glass). Tower 3 (stone→concrete→glass).
  // Stone base of Tower 3 forces arc to go high to hit the glass top.
  {
    id: 'ch6-l4', chapter: 6, levelInChapter: 4,
    title: 'Three Towers',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: stdSliders,
    defaultParams: { a: -0.20, h: 3.0, k: 1.8 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Glass tower',    { a: -0.35, h: 1.5 }, 0.8),
        shot('Shot 2 — Concrete tower', { a: -0.18, h: 3.5 }, 2.2),
        shot('Shot 3 — Stone tower',    { a: -0.07, h: 6.0 }, 2.5),
      ],
    },
    targets: [
      { id: 't1', x: 3.75, y: 1.45, radius: 0.40, pigType: 'helmet', hp: 1, moving: null, restingOn: 'twr1_top' },
      { id: 't2', x: 6.25, y: 2.15, radius: 0.40, pigType: 'helmet', hp: 1, moving: null, restingOn: 'twr2_top' },
      { id: 't3', x: 8.75, y: 2.75, radius: 0.40, pigType: 'helmet', hp: 1, moving: null, restingOn: 'twr3_top' },
    ],
    obstacles: [
      { id: 'twr1_top',  x: 3.5,  y: 0.6, width: 0.5, height: 0.6,  blockType: 'glass',    hp: 1, supports: [] },
      { id: 'twr2_base', x: 6.0,  y: 0.6, width: 0.5, height: 0.9,  blockType: 'concrete', hp: 2, supports: ['twr2_top'] },
      { id: 'twr2_top',  x: 6.0,  y: 1.5, width: 0.5, height: 0.4,  blockType: 'glass',    hp: 1, supports: [] },
      { id: 'twr3_stone',x: 8.5,  y: 0.6, width: 0.5, height: 0.8,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'twr3_conc', x: 8.5,  y: 1.4, width: 0.5, height: 0.6,  blockType: 'concrete', hp: 2, supports: ['twr3_top'] },
      { id: 'twr3_top',  x: 8.5,  y: 2.0, width: 0.5, height: 0.5,  blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 4], starMode: 'moves',
    revealAfter: 'combining_functions',
    hint: 'Three towers, escalating difficulty. Stone base on the third tower forces a high arc — smash the glass top.',
    theme: THEME,
  },

  // ── 6-5 ──────────────────────────────────────────────────────────────────
  // Moving pig behind a two-tier wood wall. 3 shots.
  // Two stacked wood blocks form the wall. Shot 1 and 2 demolish both.
  // Shot 3 times the now-exposed moving pig.
  {
    id: 'ch6-l5', chapter: 6, levelInChapter: 5,
    title: 'Timed Break',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: stdSliders,
    defaultParams: { a: -0.15, h: 4.0, k: 2.4 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 3,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Break wall bottom', { a: -0.22, h: 2.5 }),
        shot('Shot 2 — Break wall top',    { a: -0.18, h: 2.8 }),
        shot('Shot 3 — Time the pig',      { a: -0.12, h: 5.0 }),
      ],
    },
    targets: [{
      id: 'moving', x: 7.0, y: 0.8, radius: 0.42, pigType: 'cool', hp: 1,
      moving: { axis: 'x', min: 5.8, max: 8.5, speed: 1.5 },
    }],
    obstacles: [
      { id: 'wall_lo', x: 5.0, y: 0.6, width: 0.4, height: 1.0, blockType: 'wood', hp: 2, supports: ['wall_hi'] },
      { id: 'wall_hi', x: 5.0, y: 1.6, width: 0.4, height: 1.0, blockType: 'wood', hp: 2, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [3, 4], starMode: 'moves',
    revealAfter: null,
    hint: 'Break both wall blocks — then time Shot 3 to catch the pig when it is exposed.',
    theme: THEME,
  },

  // ── 6-6 ──────────────────────────────────────────────────────────────────
  // 5 shots: divided castle. Left wing: glass shelf pig. Right wing: concrete tower pig.
  // King pig in stone core. Stone walls protect the center — must take flanks first.
  {
    id: 'ch6-l6', chapter: 6, levelInChapter: 6,
    title: 'Walled Garden',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: stdSliders,
    defaultParams: { a: -0.18, h: 3.5, k: 2.205 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 5,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Left pillar',   { a: -0.22, h: 2.0 }, 0.9),
        shot('Shot 2 — Right tower',   { a: -0.10, h: 5.5 }, 3.0),
        shot('Shot 3 — Right tower 2', { a: -0.09, h: 5.5 }, 2.7),
        shot('Shot 4 — King ceiling',  { a: -0.12, h: 4.5 }, 2.4),
        shot('Shot 5 — King finish',   { a: -0.11, h: 4.5 }, 2.2),
      ],
    },
    targets: [
      { id: 'left_pig',  x: 3.65, y: 2.0, radius: 0.42, pigType: 'letterman', hp: 1, moving: null, restingOn: 'left_shelf' },
      { id: 'right_pig', x: 8.25, y: 2.2, radius: 0.42, pigType: 'letterman', hp: 1, moving: null, restingOn: 'right_top' },
      { id: 'king',      x: 6.0,  y: 0.8, radius: 0.55, pigType: 'king',      hp: 3, moving: null },
    ],
    obstacles: [
      { id: 'left_pl',    x: 3.0,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',     hp: 2, supports: ['left_shelf'] },
      { id: 'left_pr',    x: 4.1,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'concrete', hp: 2, supports: ['left_shelf'] },
      { id: 'left_shelf', x: 3.0,  y: 1.3, width: 1.4,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'king_wl',    x: 5.5,  y: 0.6, width: 0.35, height: 2.5,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'king_wr',    x: 6.8,  y: 0.6, width: 0.35, height: 2.5,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'king_roof',  x: 5.5,  y: 3.1, width: 1.65, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'right_base', x: 8.0,  y: 0.6, width: 0.5,  height: 0.8,  blockType: 'concrete', hp: 2, supports: ['right_mid'] },
      { id: 'right_mid',  x: 8.0,  y: 1.4, width: 0.5,  height: 0.5,  blockType: 'wood',     hp: 2, supports: ['right_top'] },
      { id: 'right_top',  x: 8.0,  y: 1.9, width: 0.5,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [5, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'King sits behind stone walls — take out both flanks first, then shatter the glass roof to finish him.',
    theme: THEME,
  },

  // ── 6-7 ──────────────────────────────────────────────────────────────────
  // Guard pig on concrete/glass tower. King pig (hp:3) in stone fortress.
  // 5 shots: kill guard first (2 shots), then break into fortress (2 shots), finish king (1 shot).
  {
    id: 'ch6-l7', chapter: 6, levelInChapter: 7,
    title: "King's Guard",
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: stdSliders,
    defaultParams: { a: -0.15, h: 4.0, k: 2.4 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 5,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Guard tower base',  { a: -0.30, h: 1.8 }, 1.0),
        shot('Shot 2 — Guard tower top',   { a: -0.28, h: 2.0 }, 1.1),
        shot('Shot 3 — Fortress ceiling',  { a: -0.10, h: 4.5 }, 2.0),
        shot('Shot 4 — King hit',          { a: -0.09, h: 5.0 }, 2.3),
        shot('Shot 5 — King finish',       { a: -0.09, h: 5.0 }, 2.3),
      ],
    },
    targets: [
      { id: 'guard', x: 4.25, y: 2.1,  radius: 0.42, pigType: 'letterman', hp: 2, moving: null, restingOn: 'guard_top' },
      { id: 'king',  x: 7.6,  y: 0.8,  radius: 0.55, pigType: 'king',      hp: 3, moving: null },
    ],
    obstacles: [
      { id: 'guard_base', x: 4.0,  y: 0.6, width: 0.5,  height: 0.8,  blockType: 'concrete', hp: 2, supports: ['guard_top'] },
      { id: 'guard_top',  x: 4.0,  y: 1.4, width: 0.5,  height: 0.45, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'fort_wl',    x: 6.8,  y: 0.6, width: 0.35, height: 2.4,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'fort_wr',    x: 8.3,  y: 0.6, width: 0.35, height: 2.4,  blockType: 'concrete', hp: 2, supports: ['fort_roof'] },
      { id: 'fort_roof',  x: 6.8,  y: 3.0, width: 1.85, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [5, 6], starMode: 'moves',
    revealAfter: null,
    hint: 'Take out the guard tower first (Letterman, 2 HP). Then breach the stone fortress to reach the King (3 HP).',
    theme: THEME,
  },

  // ── 6-8 ──────────────────────────────────────────────────────────────────
  // 2 shots: each collapses a compound shelf structure. Bonus ring between them.
  // Left: concrete pillar + wood pillar + glass shelf. Right: wood pillars + glass shelf.
  {
    id: 'ch6-l8', chapter: 6, levelInChapter: 8,
    title: 'Bonus Collapse',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: stdSliders,
    defaultParams: { a: -0.20, h: 2.0, k: 0.8 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 2,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Left shelf',  { a: -0.20, h: 2.0 }, 0.8),
        shot('Shot 2 — Right shelf', { a: -0.10, h: 5.5 }, 3.0),
      ],
    },
    targets: [
      { id: 'pig_l', x: 4.15, y: 2.0, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf_l' },
      { id: 'pig_r', x: 7.65, y: 2.0, radius: 0.42, pigType: 'helmet', hp: 1, moving: null, restingOn: 'shelf_r' },
    ],
    obstacles: [
      { id: 'lpl_l',   x: 3.5,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'concrete', hp: 2, supports: ['shelf_l'] },
      { id: 'lpl_r',   x: 4.6,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',     hp: 2, supports: ['shelf_l'] },
      { id: 'shelf_l', x: 3.5,  y: 1.3, width: 1.4,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'rpl_l',   x: 7.0,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',     hp: 2, supports: ['shelf_r'] },
      { id: 'rpl_r',   x: 8.1,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'concrete', hp: 2, supports: ['shelf_r'] },
      { id: 'shelf_r', x: 7.0,  y: 1.3, width: 1.4,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: { x: 5.5, y: 3.0, radius: 0.28 },
    starThresholds: [2, 3], starMode: 'bonus',
    revealAfter: 'precision_matters',
    hint: 'Thread Shot 1 through the bonus ring AND smash a pillar. Shot 2 collapses the right shelf.',
    theme: THEME,
  },

  // ── 6-9 ──────────────────────────────────────────────────────────────────
  // Relay race: 3 structures at ascending heights. Each target has 2 HP.
  // 6 shots. Low shelf (glass), mid shelf (wood), high concrete tower.
  {
    id: 'ch6-l9', chapter: 6, levelInChapter: 9,
    title: 'Relay Race',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: { ...stdSliders, k: { min: -2, max: 6, step: 0.1 } },
    defaultParams: { a: -0.18, h: 3.0, k: 1.62 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 6,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Low shelf hit 1',  { a: -0.28, h: 1.5 }, 0.6),
        shot('Shot 2 — Low shelf kill',   { a: -0.25, h: 2.0 }, 1.0),
        shot('Shot 3 — Mid shelf hit 1',  { a: -0.15, h: 3.5 }, 1.8),
        shot('Shot 4 — Mid shelf kill',   { a: -0.12, h: 3.8 }, 2.1),
        shot('Shot 5 — High tower hit',   { a: -0.09, h: 5.5 }, 2.7),
        shot('Shot 6 — High tower kill',  { a: -0.08, h: 6.0 }, 2.9),
      ],
    },
    targets: [
      { id: 't1', x: 3.8,  y: 1.75, radius: 0.40, pigType: 'letterman', hp: 2, moving: null, restingOn: 'sh1' },
      { id: 't2', x: 6.25, y: 2.45, radius: 0.40, pigType: 'letterman', hp: 2, moving: null, restingOn: 'sh2' },
      { id: 't3', x: 8.75, y: 2.55, radius: 0.40, pigType: 'letterman', hp: 2, moving: null, restingOn: 'sh3' },
    ],
    obstacles: [
      { id: 'sh1_pl', x: 3.3,  y: 0.6, width: 0.3,  height: 0.6,  blockType: 'glass',    hp: 1, supports: ['sh1'] },
      { id: 'sh1_pr', x: 4.2,  y: 0.6, width: 0.3,  height: 0.6,  blockType: 'glass',    hp: 1, supports: ['sh1'] },
      { id: 'sh1',    x: 3.3,  y: 1.2, width: 1.2,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'sh2_pl', x: 5.7,  y: 0.6, width: 0.3,  height: 1.4,  blockType: 'wood',     hp: 2, supports: ['sh2'] },
      { id: 'sh2_pr', x: 6.6,  y: 0.6, width: 0.3,  height: 1.4,  blockType: 'wood',     hp: 2, supports: ['sh2'] },
      { id: 'sh2',    x: 5.7,  y: 2.0, width: 1.2,  height: 0.25, blockType: 'wood',     hp: 2, supports: [] },
      { id: 'sh3_pl', x: 8.2,  y: 0.6, width: 0.3,  height: 1.6,  blockType: 'concrete', hp: 2, supports: ['sh3'] },
      { id: 'sh3_pr', x: 9.1,  y: 0.6, width: 0.3,  height: 1.6,  blockType: 'concrete', hp: 2, supports: ['sh3'] },
      { id: 'sh3',    x: 8.2,  y: 2.2, width: 1.2,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: null,
    starThresholds: [6, 7], starMode: 'moves',
    revealAfter: null,
    hint: 'Three shelves at different heights — each target takes 2 hits. Two shots per structure, plan the arc heights carefully.',
    theme: THEME,
  },

  // ── 6-10 ─────────────────────────────────────────────────────────────────
  // Grand finale: 3 target types, 6 shots.
  // Whistle pig on low glass shelf (spawns second pig). Letterman (hp:2) in castle.
  // King pig (hp:3) in stone-walled fortress. Bonus ring at arc peak.
  {
    id: 'ch6-l10', chapter: 6, levelInChapter: 10,
    title: 'Grand Combo',
    equationForm: 'vertex',
    activeCoefficients: ['a', 'h', 'k'],
    sliderConfig: stdSliders,
    defaultParams: { a: -0.15, h: 4.0, k: 2.4 },
    launcher: LAUNCHER,
        bonusShots: 1,
multiShot: {
      shotCount: 6,
      sequenceMode: 'sequential',
      shots: [
        shot('Shot 1 — Whistle shelf',    { a: -0.30, h: 1.8 }, 1.0),
        shot('Shot 2 — Castle ceiling',   { a: -0.16, h: 4.0 }, 2.6),
        shot('Shot 3 — Letterman kill',   { a: -0.14, h: 4.2 }, 2.5),
        shot('Shot 4 — Fortress ceiling', { a: -0.10, h: 5.5 }, 3.0),
        shot('Shot 5 — King hit 2',       { a: -0.09, h: 5.5 }, 2.7),
        shot('Shot 6 — King finish',      { a: -0.08, h: 5.5 }, 2.4),
      ],
    },
    targets: [
      { id: 'whistle',   x: 3.65, y: 2.0, radius: 0.42, pigType: 'whistle',   hp: 1, moving: null, restingOn: 'ws_shelf' },
      { id: 'letterman', x: 6.0,  y: 0.8, radius: 0.42, pigType: 'letterman', hp: 2, moving: null },
      { id: 'king',      x: 8.5,  y: 0.8, radius: 0.55, pigType: 'king',      hp: 3, moving: null },
    ],
    obstacles: [
      { id: 'ws_pll',   x: 3.0,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'wood',     hp: 2, supports: ['ws_shelf'] },
      { id: 'ws_plr',   x: 4.1,  y: 0.6, width: 0.3,  height: 0.7,  blockType: 'concrete', hp: 2, supports: ['ws_shelf'] },
      { id: 'ws_shelf', x: 3.0,  y: 1.3, width: 1.4,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'cas_wl',   x: 5.3,  y: 0.6, width: 0.35, height: 2.4,  blockType: 'concrete', hp: 2, supports: ['cas_roof'] },
      { id: 'cas_wr',   x: 6.9,  y: 0.6, width: 0.35, height: 2.4,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'cas_roof', x: 5.3,  y: 3.0, width: 2.0,  height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
      { id: 'king_wl',  x: 7.8,  y: 0.6, width: 0.35, height: 2.8,  blockType: 'stone',    hp: 3, supports: [] },
      { id: 'king_wr',  x: 9.3,  y: 0.6, width: 0.35, height: 2.8,  blockType: 'concrete', hp: 2, supports: ['king_roof'] },
      { id: 'king_roof',x: 7.8,  y: 3.4, width: 1.85, height: 0.25, blockType: 'glass',    hp: 1, supports: [] },
    ],
    bonusRing: { x: 5.0, y: 4.5, radius: 0.25 },
    starThresholds: [6, 7], starMode: 'bonus',
    revealAfter: null,
    hint: 'Whistle Pig → Letterman → King. Six shots, plan every one. Bonus ring at the arc peak for 3★.',
    theme: THEME,
  },
];
