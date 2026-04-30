// Validates all level configs before play-testing.
// Run: node scripts/validate-levels.mjs
// Exit 0 = clean. Exit 1 = errors found.

import { CHAPTER_1 } from '../src/levels/chapters/chapter1.js';
import { CHAPTER_2 } from '../src/levels/chapters/chapter2.js';
import { CHAPTER_3 } from '../src/levels/chapters/chapter3.js';
import { CHAPTER_4 } from '../src/levels/chapters/chapter4.js';
import { CHAPTER_5 } from '../src/levels/chapters/chapter5.js';
import { CHAPTER_6 } from '../src/levels/chapters/chapter6.js';
import { CHAPTER_7 } from '../src/levels/chapters/chapter7.js';
import { CHAPTER_8 } from '../src/levels/chapters/chapter8.js';

const WORLD_W = 10;
const WORLD_H = 6;
const GROUND_Y = 0.6;
const VALID_BLOCK_TYPES = new Set(['glass', 'wood', 'stone', 'concrete']);
const DEFAULT_HP = { glass: 1, wood: 2, stone: 3, concrete: 2 };

// ── Arc reachability ──────────────────────────────────────────────────────────
// Iterates a coarse grid of slider values and checks whether any combination
// produces an arc that lands within pig.radius of the target centre.
// Skips piecewise form (too complex to evaluate inline).

const REACH_STEPS = 40; // grid points per active coefficient

function evalFormLocal(localX, form, p) {
  switch (form) {
    case 'stretch':  return p.a * localX * localX;
    case 'vertex':   return p.a * (localX - (p.h ?? 0)) ** 2 + (p.k ?? 0);
    case 'standard': return p.a * localX * localX + (p.b ?? 0) * localX + (p.c ?? 0);
    case 'factored': return p.a * (localX - (p.r1 ?? 0)) * (localX - (p.r2 ?? 0));
    case 'cubic':    return p.a * (localX - (p.h ?? 0)) ** 3 + (p.k ?? 0);
    case 'abs':      return p.a * Math.abs(localX - (p.h ?? 0)) + (p.k ?? 0);
    default:         return null;
  }
}

function gridValues(cfg) {
  if (!cfg) return null;
  const { min, max, step } = cfg;
  const count = Math.min(REACH_STEPS, Math.round((max - min) / step));
  const vals = [];
  for (let i = 0; i <= count; i++) vals.push(min + (max - min) * (i / count));
  return vals;
}

function buildCombinations(activeCoefficients, sliderConfig, defaultParams) {
  let combos = [{ ...(defaultParams ?? {}) }];
  for (const coeff of (activeCoefficients ?? [])) {
    const vals = gridValues(sliderConfig?.[coeff]);
    if (!vals) continue;
    const next = [];
    for (const combo of combos)
      for (const v of vals) next.push({ ...combo, [coeff]: v });
    combos = next;
  }
  return combos;
}

function checkReachability(level) {
  const id = level.id ?? '(no id)';
  const { equationForm: form, launcher, activeCoefficients, sliderConfig, defaultParams } = level;
  if (!form || !launcher || form === 'piecewise') return;

  const combos = buildCombinations(activeCoefficients, sliderConfig, defaultParams);

  for (const t of (level.targets ?? [])) {
    if (typeof t.x !== 'number' || typeof t.y !== 'number') continue;

    // For a moving target any x in its travel range is valid
    const worldXs = t.moving
      ? Array.from({ length: 21 }, (_, i) => t.moving.min + (t.moving.max - t.moving.min) * i / 20)
      : [t.x];

    let reachable = false;
    outer: for (const params of combos) {
      // Apply auto-derived k for vertex/stretch when k is not an active slider
      const p = (form === 'vertex' || form === 'stretch') && !(activeCoefficients ?? []).includes('k')
        ? { ...params, k: -(params.a ?? 0) * ((params.h ?? 0) ** 2) }
        : params;
      for (const wx of worldXs) {
        const localY = evalFormLocal(wx - launcher.x, form, p);
        if (localY === null) continue;
        if (Math.abs(launcher.y + localY - t.y) <= t.radius + 0.05) {
          reachable = true;
          break outer;
        }
      }
    }

    if (!reachable) {
      err(id, `target "${t.id}" at (${t.x}, ${t.y}) is unreachable — no slider combination lands within radius of target`);
    }
  }
}

const CHAPTERS = [
  { num: 1, levels: CHAPTER_1 },
  { num: 2, levels: CHAPTER_2 },
  { num: 3, levels: CHAPTER_3 },
  { num: 4, levels: CHAPTER_4 },
  { num: 5, levels: CHAPTER_5 },
  { num: 6, levels: CHAPTER_6 },
  { num: 7, levels: CHAPTER_7 },
  { num: 8, levels: CHAPTER_8 },
];

let errors = 0;
let warnings = 0;
const globalLevelIds = new Set();

function err(levelId, msg) {
  console.error(`  [ERROR] ${levelId}: ${msg}`);
  errors++;
}

function warn(levelId, msg) {
  console.warn(`  [WARN]  ${levelId}: ${msg}`);
  warnings++;
}

function validateLevel(level) {
  const id = level.id ?? '(no id)';

  // ── Global ID uniqueness ──────────────────────────────────────────────────
  if (!level.id) {
    err(id, 'missing level id');
  } else if (globalLevelIds.has(level.id)) {
    err(id, `duplicate level id "${level.id}"`);
  } else {
    globalLevelIds.add(level.id);
  }

  // ── Required fields ───────────────────────────────────────────────────────
  for (const f of ['chapter', 'levelInChapter', 'title', 'launcher', 'targets']) {
    if (level[f] === undefined || level[f] === null) err(id, `missing required field: ${f}`);
  }

  const obstacles = level.obstacles ?? [];
  const targets = level.targets ?? [];

  // ── Obstacle ID uniqueness within level ───────────────────────────────────
  const obsIds = new Set();
  for (const obs of obstacles) {
    if (!obs.id) { err(id, `obstacle missing id: ${JSON.stringify(obs)}`); continue; }
    if (obsIds.has(obs.id)) err(id, `duplicate obstacle id "${obs.id}"`);
    obsIds.add(obs.id);
  }

  // ── Target ID uniqueness within level ────────────────────────────────────
  const tgtIds = new Set();
  for (const t of targets) {
    if (!t.id) { err(id, `target missing id: ${JSON.stringify(t)}`); continue; }
    if (tgtIds.has(t.id)) err(id, `duplicate target id "${t.id}"`);
    tgtIds.add(t.id);
  }

  // ── Destructible block checks ─────────────────────────────────────────────
  for (const obs of obstacles) {
    if (!obs.blockType) continue; // static wall, skip block-specific checks

    // blockType must be valid
    if (!VALID_BLOCK_TYPES.has(obs.blockType)) {
      err(id, `obstacle "${obs.id}" has invalid blockType "${obs.blockType}" (must be glass|wood|stone)`);
    }

    // hp must be a positive integer if specified
    if (obs.hp !== undefined) {
      if (!Number.isInteger(obs.hp) || obs.hp < 1) {
        err(id, `obstacle "${obs.id}" has invalid hp ${obs.hp} (must be positive integer)`);
      }
    } else {
      // hp will default from blockType — just a sanity check that blockType is known
      if (!DEFAULT_HP[obs.blockType]) {
        err(id, `obstacle "${obs.id}" has no hp and unknown blockType "${obs.blockType}"`);
      }
    }

    // supports references must exist as obstacle IDs in this same level
    for (const supportedId of (obs.supports ?? [])) {
      if (!obsIds.has(supportedId)) {
        err(id, `obstacle "${obs.id}" supports unknown id "${supportedId}" (not found in this level's obstacles)`);
      }
    }
  }

  // ── Block geometry ────────────────────────────────────────────────────────
  for (const obs of obstacles) {
    if (typeof obs.x !== 'number' || typeof obs.y !== 'number' ||
        typeof obs.width !== 'number' || typeof obs.height !== 'number') {
      err(id, `obstacle "${obs.id}" has non-numeric geometry`);
      continue;
    }
    if (obs.width <= 0 || obs.height <= 0) {
      err(id, `obstacle "${obs.id}" has zero or negative dimensions (${obs.width}×${obs.height})`);
    }
    if (obs.x < 0 || obs.x + obs.width > WORLD_W) {
      warn(id, `obstacle "${obs.id}" extends outside world x bounds [0, ${WORLD_W}]`);
    }
    if (obs.y < GROUND_Y) {
      err(id, `obstacle "${obs.id}" bottom edge (y=${obs.y}) is below ground (${GROUND_Y})`);
    }
    if (obs.y + obs.height > WORLD_H) {
      warn(id, `obstacle "${obs.id}" top edge (y=${obs.y + obs.height}) exceeds world height ${WORLD_H}`);
    }
  }

  // ── Overlapping blocks ────────────────────────────────────────────────────
  for (let i = 0; i < obstacles.length; i++) {
    for (let j = i + 1; j < obstacles.length; j++) {
      const a = obstacles[i], b = obstacles[j];
      if (typeof a.x !== 'number' || typeof b.x !== 'number') continue;
      const overlapX = a.x < b.x + b.width && a.x + a.width > b.x;
      const overlapY = a.y < b.y + b.height && a.y + a.height > b.y;
      if (overlapX && overlapY) {
        // Allow tiny overlaps (floating point tolerance of 0.01)
        const ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
        const oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
        if (ox > 0.01 && oy > 0.01) {
          warn(id, `obstacles "${a.id}" and "${b.id}" overlap by (${ox.toFixed(2)}×${oy.toFixed(2)})`);
        }
      }
    }
  }

  // ── Target geometry ───────────────────────────────────────────────────────
  for (const t of targets) {
    if (typeof t.x !== 'number' || typeof t.y !== 'number' || typeof t.radius !== 'number') {
      err(id, `target "${t.id}" has non-numeric geometry`);
      continue;
    }
    if (t.y < GROUND_Y) {
      err(id, `target "${t.id}" center y=${t.y} is below ground line (${GROUND_Y})`);
    }
    if (t.x < t.radius || t.x > WORLD_W - t.radius) {
      warn(id, `target "${t.id}" at x=${t.x} is very close to or outside world x bounds`);
    }
    // Check pig isn't clipping inside a static (non-destructible) obstacle
    for (const obs of obstacles) {
      if (obs.blockType) continue; // destructible blocks: pig can sit on top, minor overlap is fine
      if (typeof obs.x !== 'number') continue;
      const inside = t.x > obs.x && t.x < obs.x + obs.width &&
                     t.y > obs.y && t.y < obs.y + obs.height;
      if (inside) {
        err(id, `target "${t.id}" center is inside static obstacle "${obs.id}"`);
      }
    }
  }

  // ── Launcher ──────────────────────────────────────────────────────────────
  const launcher = level.launcher;
  if (launcher) {
    if (typeof launcher.x !== 'number' || typeof launcher.y !== 'number') {
      err(id, 'launcher has non-numeric coordinates');
    }
  }
}

// ── Run validation ────────────────────────────────────────────────────────────
let totalLevels = 0;
for (const ch of CHAPTERS) {
  console.log(`\nChapter ${ch.num} (${ch.levels.length} levels)`);
  for (const level of ch.levels) {
    validateLevel(level);
    checkReachability(level);
    totalLevels++;
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`Validated ${totalLevels} levels across ${CHAPTERS.length} chapters`);
if (errors === 0 && warnings === 0) {
  console.log('✓ All clean — no errors or warnings.');
} else {
  if (errors > 0)   console.error(`✗ ${errors} error(s) found`);
  if (warnings > 0) console.warn(`⚠ ${warnings} warning(s) found`);
}
console.log('─'.repeat(50));

process.exit(errors > 0 ? 1 : 0);
