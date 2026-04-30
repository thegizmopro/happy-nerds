# Task: Level Redesign — Ch4 through Ch8

## Context
You're working on Happy Nerds, a math game where players launch a ball along a parabolic arc to hit targets behind block structures. The game teaches algebra through gameplay.

**Project directory**: `C:\Users\kenzo\.openclaw\workspace\projects\happy_nerds`

## What to Read First
1. `LEVEL_REDESIGN_PLAN.md` — the master plan (Sections 1-13 are most important)
2. `src/levels/chapters/chapter4.js` — current Ch4 levels (to understand the data format)
3. `src/levels/levelLoader.js` — how levels are loaded and indexed
4. `src/levels/revealContent.js` — concept popups

## Material System (CRITICAL — updated tonight)
| Material | blockType | HP | Ball behavior |
|----------|-----------|-----|---------------|
| Wall | (none) | ∞ | Indestructible, bounces |
| Stone | 'stone' | ∞ | Indestructible, bounces |
| Concrete | 'concrete' | 2 | Bounces, 2 hits to break |
| Wood | 'wood' | 2 | Bounces, 2 hits to break |
| Glass | 'glass' | 1 | Ball passes THROUGH, shatters |

**Stone is INDESTRUCTIBLE.** Use it for permanent barriers that force the player to go around.
**Concrete** is the destructible "hard" block (2 hits).
**Glass** is the only material the ball passes through — use for windows/shooting lanes.

## Kill Vectors (3 ways to kill a target)
1. **Direct shot** — arc hits the target directly
2. **Fall** — target's `restingOn` block is destroyed, target falls from height (>1 unit = death)
3. **Crush** — a block above falls and lands on the target (cascade)

## Design Goals
1. **Targets must be PROTECTED** — can't just arc over/through everything. Use concrete/stone walls to force strategic thinking.
2. **Multiple solutions** — at least 2 kill vectors per level (e.g., direct shot through glass window OR destroy supports to crush)
3. **Increasing difficulty** — Ch4 simpler, Ch8 hardest
4. **Glass = shooting lanes** — create glass windows/holes that let the ball through
5. **Concrete/stone = barriers** — force the player to go around or break through
6. **Cascade chains are king** — satisfying destruction is the fun part

## Per-Chapter Guidelines

### Ch4 (Factored Form: y = a(x−r₁)(x−r₂))
- 10 levels, roots control landing precision
- L1-L3: 1 target, simple structures (1-2 concrete walls, glass window)
- L4-L7: 1-2 targets, medium structures (tower + walls, need 2 shots)
- L8-L10: 2-3 targets, multiShot (2-3 shots), compound structures
- Shot counts: L1-L3 = 1, L4-L7 = 2, L8-L9 = 2-3, L10 = 3

### Ch5 (Standard Form: y = ax² + bx + c)
- Full coefficient control = maximum structural complexity
- L1-L3: fortresses with glass windows, 1-2 targets
- L4-L7: multi-room castles, 2 targets, 2-3 shots
- L8-L10: compound structures, 3+ targets, 3-4 shots

### Ch6 (Multi-Shot)
- Sequential destruction is the theme
- L1-L3: 2 shots, clear path then kill
- L4-L7: 3 shots, staged destruction (roof → walls → target)
- L8-L10: 4-5 shots, full castle siege

### Ch7 (Beyond Quadratics: cubic, abs, piecewise)
- Unusual arc shapes need unusual structures
- Vertical gaps, overhangs, ceiling targets
- Cubic S-curves reach behind walls

### Ch8 (Boss Levels — Timed)
- 5 levels, maximum complexity
- Timer pressure + dense structures
- 3-5 targets each, 3-5 shots

## Technical Requirements
- Every level must have proper `supports` arrays (cascade wiring)
- Targets on blocks need `restingOn: 'block_id'`
- `defaultParams` must have correct `k = -a*h²` for vertex form levels
- All block IDs must be unique within a level
- Run `node scripts/validate-levels.mjs` after every chapter
- Build must pass: `npm run build`
- **After building**: commit with message like "feat: redesign Ch4 levels with protected structures"

## Structure Templates to Use (from LEVEL_REDESIGN_PLAN.md Section 4)
- Multi-Story Tower (2-3 stories, concrete→wood→glass layers)
- Enclosed Fortress (walls + roof, target inside, glass window)
- Pig Sandwich (target between floor and ceiling)
- Domino Chain (cascade from one structure to next)
- Multi-Pig Compound (separate structures with different materials)
- Bridge (wide, multiple targets on long beam)
- Castle (multi-room with dividing walls)

## Anti-Repetition Rules
- No two consecutive levels with same template
- Max 2 levels per chapter with simple "2 pillars + 1 beam"
- Block count increases across chapters
- Mix target placements: ground, elevated, enclosed

## CRITICAL: Build + Push After Each Chapter
After editing each chapter file:
1. Run `npm run build`
2. Run `node scripts/validate-levels.mjs`
3. `git add -A && git commit -m "feat: redesign Ch4 levels" && git push`
4. Then move to next chapter

## Don't Touch
- `src/core/arc.js` — bounce/damage logic is working
- `src/game/GameController.js` — animation/bounce is working
- `src/game/LevelSession.js` — cascade/HP is working
- `src/renderer/Renderer.js` — concrete/glass/wood/stone all render correctly
- Ch1, Ch2, Ch3 — redesign later

## Start Here
Read `LEVEL_REDESIGN_PLAN.md`, then `src/levels/chapters/chapter4.js`, then redesign all 10 Ch4 levels. Work chapter by chapter: Ch4 → Ch5 → Ch6 → Ch7 → Ch8.
