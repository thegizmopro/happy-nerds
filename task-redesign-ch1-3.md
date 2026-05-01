# Task: Level Redesign — Ch1 through Ch3

## Context
You're working on Happy Nerds, a math game where players launch a ball along a parabolic arc to hit targets behind block structures. The game teaches algebra through gameplay.

**Project directory**: `C:\Users\kenzo\.openclaw\workspace\projects\happy_nerds`

## What to Read First
1. `src/levels/chapters/chapter1.js` — current Ch1 levels (understand the data format)
2. `src/levels/chapters/chapter4.js` — example of GOOD redesigned levels (Ch4-Ch8 were already redesigned)
3. `LEVEL_REDESIGN_PLAN.md` — the master plan
4. `COLLISION_AUDIT.md` — target reachability constraints

## Current Problem
Ch1–Ch3 have boring, repetitive structures:
- Most levels are "1 target, 1 shot" with no decisions
- Structures are mostly "2 pillars + 1 beam" repeated
- No cascade chains, no multi-story towers
- Targets always on top, never inside or protected
- No use of glass as shooting lanes

Ch4–Ch8 were already redesigned with complex structures. Ch1–Ch3 need the same treatment BUT scaled for early-game difficulty.

## Material System (CRITICAL)
| Material | blockType | HP | Ball behavior |
|----------|-----------|-----|---------------|
| Wall | (none) | ∞ | Indestructible, bounces |
| Stone | 'stone' | ∞ | Indestructible, bounces |
| Concrete | 'concrete' | 2 | Bounces, 2 hits to break |
| Wood | 'wood' | 2 | Bounces, 2 hits to break |
| Glass | 'glass' | 1 | Ball passes THROUGH, shatters |

## Kill Vectors (3 ways to kill a target)
1. **Direct shot** — arc hits the target directly
2. **Fall** — target's `restingOn` block is destroyed, target falls from height (>1 unit = death)
3. **Crush** — a block above falls and lands on the target (cascade)

## Design Principles for Early Chapters

### Ch1 is the TUTORIAL chapter
- Player just learned y = ax². They control ONE slider: `a`
- Keep it simple but NOT boring
- Introduce concepts gradually: glass shatters, concrete breaks, wood falls
- Targets should sometimes be behind/below structures, not always on top
- L1-L3: Very simple (glass shelf, single wall)
- L4-L6: Introduce concrete (needs 2 hits), basic 2-block structures
- L7-L10: Small towers, targets inside/under structures

### Ch2 introduces h and k (vertex form)
- Player now controls a, h, k — can aim the peak
- Structures should REQUIRE aiming (targets behind walls, need to peak over)
- Introduce multi-story (2 floors)
- Some targets protected by concrete, need 2 bounces
- L1-L3: Simple shifting, targets at different heights
- L4-L7: Multi-story structures, targets inside
- L8-L10: Complex structures requiring precise vertex placement

### Ch3 introduces sign of a (positive vs negative)
- Player experiments with positive AND negative a
- Negative a = arc goes UP first then DOWN (standard projectile)
- Positive a = arc goes DOWN then UP (inverted, rarely useful in practice)
- Some levels should have targets ABOVE the launcher (need positive a)
- Some targets far away requiring precise negative a tuning
- L1-L3: First experience with positive a (arc goes down)
- L4-L7: Targets at various heights, need to pick the right sign
- L8-L10: Complex structures where sign choice matters strategically

## Structural Guidelines
- **Early levels**: 3-8 blocks, 1 target
- **Mid levels**: 8-15 blocks, 1-2 targets
- **Late levels**: 12-20 blocks, 1-2 targets
- **ALWAYS wire `supports` arrays** — beams reference their pillar blocks
- **ALWAYS wire `restingOn`** for targets sitting on blocks
- **Use `cascadeChild`/`cascadeParent`** for chain-reaction structures
- **Include `fallDistance`** for targets that can die by falling

## Constraints
- Launcher for Ch1 is at `{ x: 1, y: 4.5 }` — elevated, shooting down
- Launcher for Ch2-Ch3 varies by level — check each level's config
- World is 10 wide, 6 tall (y: 0 to 6, ground at y: 0.6)
- All coordinates are in world units (1 unit = 70px)
- Ball bounces off concrete/wood/stone walls — use glass for pass-through lanes
- Don't change `equationForm`, `activeCoefficients`, `sliderConfig`, or `defaultParams` — those are the math controls
- Don't change `chapter`, `levelInChapter`, `id` fields
- Keep all existing `revealAfter` values — those were just wired
- Keep all `hint` texts — they explain the math

## Shot Counts
- Ch1: all levels have 1 shot (stretch form only controls width)
- Ch2: L1-L7 have 1 shot, L8-L10 can have 2 shots if multiShot is configured
- Ch3: L1-L7 have 1 shot, L8-L10 can have 2 shots

## Key: Make it FUN
These are the first 30 levels a player sees. If they're boring, players quit.
- Satisfying cascade chains (blocks tumbling down)
- Targets hiding behind walls (need to break through or go around)
- Glass windows that create shooting lanes
- Towers that topple when you hit the base
- Targets inside structures, not just on top

## Output
Rewrite `src/levels/chapters/chapter1.js`, `chapter2.js`, and `chapter3.js`.
Keep the same export name (`CHAPTER_1`, `CHAPTER_2`, `CHAPTER_3`).
Keep the same number of levels (10 each).
Only change: targets, obstacles, bonusRing, starThresholds, and hint fields.
Do NOT change the math/equation settings.
