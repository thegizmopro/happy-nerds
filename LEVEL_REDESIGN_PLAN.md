# Happy Nerds — Level Redesign Plan (Master)
## Goal: Angry Birds-style Block Structures Across 75 Levels (Ch1–7: 10 each, Ch8: 5 boss levels)

**Last updated**: 2026-04-29  
**Status**: Phase 1 (winnability) complete. Phase 2 (complex structures) pending.

---

## Implementation Status

### What's Done ✅
- All 75 levels have block structures (commits `4b6d20d`→`6deba9c`)
- 25 unwinnable levels fixed (commit `3762705`, pushed)
- Validator passes: `node scripts/validate-levels.mjs` ✓ All clean
- Winnability scan: all 75 levels pass `shots >= totalHP`
- Ch2-L8 arc reach bug fixed (defaultParams corrected)
- Double-comma syntax errors cleaned up

### What's Needed 🔴
The current levels are **structurally boring**:
- **60 of 75 levels have 1 target and 1 shot** — no decisions, no tension
- **Most structures are "2 pillars + 1 beam" shelf** — the same pattern repeated
- **No multi-story towers** — Angry Turds L3 already has 2-story, L5 has 3-story
- **Pigs never inside structures** — always sitting on top, never enclosed
- **No cascade chains** — blocks don't chain-fall because supports aren't wired deep
- **No scoring system** — nothing to optimize, no reason to replay

### Phase 2 TODO (This Plan)
1. [ ] Restructure all 75 levels with complex multi-story structures
2. [ ] Add multi-target + multi-shot to Ch3 onward
3. [ ] Add point-based scoring system (engine change)
4. [ ] Add winnability check to validator script
5. [ ] Playtest pass (3-point checklist per level)

---

## Table of Contents

1. [Problem Statement & Design Principles](#1-problem-statement--design-principles)
2. [Engine Capabilities Audit](#2-engine-capabilities-audit)
3. [Angry Turds Reference Analysis](#3-angry-turds-reference-analysis)
4. [Structure Templates](#4-structure-templates)
5. [Level Complexity Rules](#5-level-complexity-rules)
6. [Chapter-by-Chapter Redesign](#6-chapter-by-chapter-redesign)
7. [Scoring System (Engine Addition)](#7-scoring-system-engine-addition)
8. [Block Coordinate & Size Guidelines](#8-block-coordinate--size-guidelines)
9. [Support Chain Wiring Rules](#9-support-chain-wiring-rules)
10. [Winnability & Shot Economy](#10-winnability--shot-economy)
11. [Difficulty Progression](#11-difficulty-progression)
12. [Files to Modify](#12-files-to-modify)
13. [Implementation Order](#13-implementation-order)
14. [Validator Spec](#14-validator-spec)
15. [Winnability Fixes Applied (Phase 1)](#15-winnability-fixes-applied-phase-1)
16. [Not In Scope](#16-not-in-scope)
17. [Open Questions](#17-open-questions)

---

## 1. Problem Statement & Design Principles

### Why Current Levels Fail
The game is deterministic and low-surprise. The player sees the arc preview, adjusts `a`, fires, and the outcome is known before the ball lands. 60 of 75 levels have exactly 1 target and 1 shot — no decisions to make.

Angry Birds (and Angry Turds) work because:
1. **Multi-layer towers** — stone base, wood middle, glass top, pig at the apex
2. **Pigs inside structures** — must breach walls to reach them
3. **Cascade physics** — one block falls, hits another, domino effect
4. **Multiple pigs** — some easy, some protected, creates priority decisions
5. **Limited shots** — running out of tries creates tension
6. **Scoring** — points for destruction, bonus for unused shots, star ratings

### Design Principles

**2.1 Every Level Gets a Structure (except Ch1-L1 tutorial)**  
Simple structures (single shelf) in early levels; complex multi-layer fortresses by late chapters.

**2.2 Pig Always Sits On, In, or Behind a Structure**  
Never a pig floating in open air. Pigs should be:
- **On top** of a block (shelf/platform) — use `restingOn: 'block_id'`
- **Behind** a wall of blocks (shoot through glass to reach it)
- **Inside** a structure (enclosed on 2-3 sides)
- **Underneath** a block that can fall on it

**2.3 The "Wrong Hit" Must Have Consequences**  
Hitting the wrong part damages blocks but leaves the pig alive. A full miss visibly wrecks something. A perfect hit triggers a satisfying cascade.

**2.4 Structures Match Equation Complexity**  
Simple equations → simple structures. Complex equations → complex structures.

**2.5 Block Material Tells a Story**  
- **Glass**: 1 hit, shatters. Shelves, thin walls.
- **Wood**: 2 hits. Middle tiers, planks between pillars.
- **Stone**: 3 hits. Bases, fortresses, boss-level cores.

**2.6 Cascade Must Be Visible and Satisfying**  
Every structure needs at least one `supports` chain. Destroying a key block triggers falling animation.

**2.7 Pig Placement Formula**  
```
pig.y = block.y + block.height + pig_radius
```
Standard pig radius = 0.45. Always calculate, never eyeball.

**2.8 Arc Pass-Through Rule**  
The ball arc is pre-calculated once at launch. It passes through ALL destructible blocks on its trajectory. Cannot use one block to "shield" a block behind it. Design cascades perpendicular to the arc path.

**2.9 Supports Wiring Required**  
The engine does NOT infer supports geometrically. Explicit `supports` arrays required for every physical relationship.

**2.10 Level Acceptance Checklist (Playtest Protocol)**  
A level is done when:
1. **Solvable**: An arc within slider range can destroy the pig
2. **Punishing on miss**: A "wrong" arc hits structure but leaves pig alive
3. **Cascade fires**: Destroying the intended block triggers falling animation

---

## 2. Engine Capabilities Audit

Everything needed for complex structures already exists. No engine changes required for Phase 2 level work.

| Feature | Supported? | Where |
|---------|-----------|-------|
| Multi-hit blocks (glass 1 / wood 2 / stone 3) | ✅ | `obstacleHP`, `hitObstacle()` |
| Cascade (block falls when support destroyed) | ✅ | `supports` wiring, `_startFalling()` |
| Falling blocks damage targets | ✅ | `_onBlockLand()` checks pig overlap |
| Falling blocks damage other blocks | ✅ | `_onBlockLand()` cascade damage |
| Targets resting on blocks (fall when block dies) | ✅ | `restingOn`, `_startFallingTargets()` |
| Multi-HP targets (dodge after hit) | ✅ | `recordHit()`, `_dodgeTarget()` |
| Moving targets | ✅ | `MovingTarget`, `moving: { axis, range, speed }` |
| Multi-shot (sequential shots) | ✅ | `multiShot`, `advanceShot()` |
| Timer pressure | ✅ | `timer: { seconds }` |
| Bonus rings | ✅ | `bonusRing: { x, y, radius }` |
| Star ratings | ✅ | `starThresholds`, `starMode: 'moves'/'bonus'` |
| Bounce off indestructible walls | ✅ | `detectBounceSurface()`, bounce frames |
| Whistle pig (spawns second pig on death) | ✅ | `pigType: 'whistle'` |
| King pig (higher HP) | ✅ | `pigType: 'king'`, `hp: N` |

**What's missing (needs engine work):**
- Point-based scoring (destruction points, accuracy bonus)
- "Shots remaining" display for multi-shot levels
- Combo/chain detection for cascade kills
- Score persistence / leaderboard

---

## 3. Angry Turds Reference Analysis

**Source**: `github.com/theCAMML/angry-turds` (single `index.html` file)

### Key Differences from Happy Nerds
Angry Turds has **real momentum-transfer physics** — blocks are `Body` objects with velocity, gravity, rotation, and bouncing. When a turd hits a block, it transfers momentum. Blocks that were resting "wake up" and start falling. Falling blocks crush pigs below.

**Our engine does NOT have momentum transfer.** Our collision is binary: arc point enters block rectangle → block takes 1 damage. Blocks only fall straight down when `supports` link is severed.

### Structure Patterns to Copy
Despite the physics difference, the structural layouts are directly applicable:

| Pattern | Angry Turds Level | Block Count | Pigs | How to Adapt |
|---------|------------------|-------------|------|-------------|
| **2-story tower** (stone pillars → beam → wood pillars → beam → pig) | L3, L5, L8 | 6-7 | 1-2 | Stack with `supports` chains. Destroy base → entire tower cascades. |
| **3-story tower** (stone→wood→glass layers) | L5 | 7 | 1 | 9 blocks total. 3 `supports` chain levels. |
| **Bridge** (3 stone pillars, long wood beams, pigs ON beams) | L6 | 8 | 3 | Pigs use `restingOn: beam_id`. Wide structures. |
| **Fortress** (4 stone walls, beams, wood 2nd floor, pigs inside) | L7 | 12+ | 4 | Multiple `supports` chains. Pigs inside on floor beams. |
| **Twin towers** (2 independent stacked towers) | L8 | 10+ | 2 | Separate `supports` chains per tower. |
| **Bunker** (stone roof, glass interior columns, pigs sandwiched) | L9 | 10+ | 2 | Pig between floor and ceiling blocks. |
| **Gauntlet** (4 structures in a line: glass→stone→wood→glass) | L10 | 16-24 | 5 | Multiple independent structures at different x positions. |

### Scale Comparison
Angry Turds L10 has **16-24 structures** per level. Happy Nerds currently has **3-9**. Target:
- Ch1: 3-6 blocks (tutorial, keep simple)
- Ch2-Ch3: 5-9 blocks (introduce stacking)
- Ch4-Ch5: 8-14 blocks (multi-story, multi-structure)
- Ch6: 10-18 blocks (multi-shot justifies complex layouts)
- Ch7-Ch8: 12-24 blocks (maximum complexity)

---

## 4. Structure Templates

These replace the current "2 pillars + 1 beam" pattern with actual variety.

### Template 1: Multi-Story Tower (2-3 stories)
```
        [pig]              ← pig on top beam
    ┌───glass───┐          ← glass beam (1hp)
    │           │          ← glass pillars (1hp each)
    ├────wood───┤          ← wood beam (2hp)
    │           │          ← wood pillars (2hp each)
    ├───stone───┤          ← stone beam (3hp)
    │           │          ← stone pillars (3hp each)
    ╘═══════════╛          ← ground
```
**Blocks**: 9 (3 beams + 6 pillars)  
**Supports chain**: stone_pillars → stone_beam → wood_pillars → wood_beam → glass_pillars → glass_beam  
**Cascade**: Destroy stone pillar → stone beam falls → wood pillars lose support → fall → glass falls → pig drops  
**Variants**: 2-story (6 blocks), 3-story (9 blocks), asymmetric (different widths per story)

### Template 2: Enclosed Fortress (pig inside)
```
    ┌───glass───┐          ← glass roof (1hp)
    │           │
 stone  [pig]  stone       ← stone walls (3hp each), pig restingOn floor
    │           │
    └───wood────┘          ← wood floor (2hp), supported by stone base pillars
    ┌─stone─┐ ┌─stone─┐   ← stone base pillars
```
**Blocks**: 6-7  
**Key**: Pig has `restingOn: 'floor'`. Floor has `supports: ['base_l', 'base_r']`. Destroy base pillars → floor falls → pig falls to ground.  
**Shot options**: Arc through glass roof, or destroy base to drop pig, or arc through gap between walls.

### Template 3: Pig Sandwich (pig between floor and ceiling)
```
    ┌───stone───┐          ← stone ceiling (3hp)
    │   [pig]   │          ← pig restingOn glass_floor
    ├───glass───┤          ← glass floor (1hp, fragile!)
    │           │          ← support pillars
    ╘═══════════╛
```
**Blocks**: 5-6  
**Strategy**: Hit glass floor → pig falls to ground → easier second shot. Or arc through side gap.

### Template 4: Domino Chain
```
    ┌┐  ┌┐  ┌┐  ┌┐
    ││  ││  ││  ││       ← thin pillars (different materials)
    ││  ││  ││  [pig]    ← pig behind last tower
    ╘╧  ╘╧  ╘╧  ╘╧
```
**Blocks**: 8-12 (4 mini-towers, each 2-3 blocks)  
**Supports wiring**: Each tower's beam supports the next tower's base pillar. Hit first tower → chain reaction → last tower falls on pig.

### Template 5: Multi-Pig Compound (separate structures)
```
    ┌─glass─┐  ┌─wood──┐  ┌stone──┐
    │ [pig1]│  │[pig2] │  │[pig3] │
    └───────┘  └───────┘  └───────┘
```
**Blocks**: 6-9 (2-3 per structure)  
**Strategy**: Easy glass pig first (1 shot), then wood pig (1-2 shots), then stone pig (2-3 shots). Player must prioritize.

### Template 6: Stacked Cages (2 pigs, one above the other)
```
    ┌──glass──┐           ← top cage
    │ [pig_t] │           ← top pig restingOn mid_floor
    ├──wood───┤           ← middle floor (separates cages)
    │ [pig_b] │           ← bottom pig restingOn base
    └──stone──┘           ← base
```
**Blocks**: 7-8  
**Strategy**: Top pig easy (glass). Bottom pig harder. Destroy mid_floor → top pig falls into bottom cage area.  
**Cascade potential**: Destroy base → everything falls, both pigs land on ground.

### Template 7: Bridge (wide, multi-pig)
```
    ┌─beam1─┐ ┌─beam2─┐  ← long wood beams spanning pillars
    [pig1]  [pig2]  [pig3] ← pigs restingOn beams
    ┌pillar┐ ┌pillar┐ ┌pillar┐ ← stone pillars
```
**Blocks**: 6-8  
**Key**: Long beams supported by multiple pillars. Destroy one pillar → that section of beam falls → pigs drop.

### Template 8: Castle (multi-room)
```
    ┌─glass─┬─glass─┐     ← glass roof
    │ [pig1]│ [pig2]│     ← pigs in separate rooms
    ├─stone─┼─stone─┤     ← stone dividing wall + outer walls
    └───────┴───────┘     ← wood floor
    ┌pill┐ ┌pill┐ ┌pill┐  ← floor support pillars
```
**Blocks**: 10-14  
**Key**: Dividing wall creates two rooms. Each room is independent. Player can go for either pig first.

---

## 5. Level Complexity Rules

These rules prevent the "every level looks the same" problem.

### Anti-Repetition Rules
1. **No two consecutive levels with the same template** — alternate tower/fortress/compound
2. **No more than 2 levels per chapter with "2 pillars + 1 beam" simple shelf** pattern
3. **Block count must increase across chapters** (see Section 11)
4. **Every chapter's L10 must use ≥3 structure templates in one level** (compound layout)
5. **At least 2 levels per chapter (L6+) with 3+ targets**
6. **Pig placement variety per chapter**: at least 1 ground pig, 1 elevated pig, 1 enclosed pig

### Multi-Target + Multi-Shot Rules
For every chapter:
- **L1–L3**: 1 target, 1 shot, simple structures (tutorial)
- **L4–L6**: 1–2 targets, 1 shot (must cascade-hit second, or arc hits both)
- **L7–L9**: 2–3 targets, multiShot 2–3 shots
- **L10 (boss)**: 3–4 targets, multiShot 3–5 shots, compound structure

### Targets Inside Structures
At least 1 target per level from L4 onward should have `restingOn` pointing to a destructible block. Destroying that block drops the pig to ground level.

---

## 6. Chapter-by-Chapter Redesign

### Chapter 1: Stretch Form (y = ax²)
**Launcher**: (1, 4.5) elevated. Arc descends.  
**Single coefficient**: `a` only.  
**Teaching goal**: Introduce blocks, materials, and cascade one at a time.

| Level | Targets | Shots | Template | Blocks | Notes |
|-------|---------|-------|----------|--------|-------|
| 1-1 | 1 | 1 | None (tutorial) | 0 | Arc only, no structure |
| 1-2 | 1 | 1 | Simple Shelf (A) | 3 | First cascade — glass shelf drops pig |
| 1-3 | 1 | 1 | Shelf (farther) | 3 | Wider arc needed |
| 1-4 | 1 | 1 | 2-Story Tower | 6 | Stone base + glass top, pig at apex |
| 1-5 | 1 | 1 | Elevated Shelf | 4 | Pig high up, arc must reach height |
| 1-6 | 1 | 1 | Fortress Wall (C) | 4 | Pig behind wall |
| 1-7 | 1 | 1 | Twin Towers (E) | 7 | Shared shelf between two towers |
| 1-8 | 1 | 1 | Shelf + Moving | 3 | First moving target + structure |
| 1-9 | 1 | 1 | Wall + Moving | 4 | Moving pig behind glass wall |
| 1-10 | 2 | 2 (multi) | Compound (A+B) | 8 | Two structures, 2 shots, first "real" level |

### Chapter 2: Vertex Form (y = a(x−h)² + k)
**Launcher**: (1, 0.8) ground level.  
**Coefficients**: `a`, `h` (required), `k` auto-derived.  
**Teaching goal**: Mixed materials, hanging platforms, tall towers.

| Level | Targets | Shots | Template | Blocks | Notes |
|-------|---------|-------|----------|--------|-------|
| 2-1 | 1 | 1 | Wall (C) | 2 | Single glass block intro |
| 2-2 | 1 | 1 | Hanging Platform (D) | 3 | Pig on glass, pillars below |
| 2-3 | 1 | 1 | 2-Story Tower | 6 | Wood base + glass top |
| 2-4 | 1 | 1 | Partial Castle (F) | 5 | 2 stone walls, wood top, pig inside |
| 2-5 | 1 | 1 | 3-Story Tower | 9 | Stone/wood/glass layers, tall, needs high k |
| 2-6 | 1 | 1 | Thin Wall (C) | 3 | Glass wall + bonus ring |
| 2-7 | 1 | 1 | Moat + Tower (J) | 5 | Static wall + hanging platform behind |
| 2-8 | 2 | 1 | Double Shelf (A×2) | 6 | 2 pigs, 2 shelves, arc must hit both or cascade kills one |
| 2-9 | 1 | 1 | Hanging + Ceiling | 4 | Glass platform, arc must go under ceiling |
| 2-10 | 2 | 2 (multi) | Castle + Moving (F) | 8 | Moving pig in castle, 2 shots |

### Chapter 3: Sign & Shape (a can be positive)
**Launcher**: (1, 0.8).  
**Teaching goal**: Upward arcs, buried pigs, pyramids, multiple targets.

| Level | Targets | Shots | Template | Blocks | Notes |
|-------|---------|-------|----------|--------|-------|
| 3-1 | 1 | 1 | Elevated Shelf | 4 | Must arc UP to reach |
| 3-2 | 1 | 1 | Buried Pig (I) | 4 | Pig under glass + wood blocks |
| 3-3 | 1 | 1 | Pyramid (G) | 5 | Wide stone base, pig at top |
| 3-4 | 1 | 1 | Trench Fortress | 5 | Walls on sides, glass ceiling above pig |
| 3-5 | 1 | 1 | Tall Stone Tower | 7 | 2-story stone, pig at top |
| 3-6 | 2 | 1 | Triple Shelf (A×3) | 9 | 3 structures at different heights, 2 pigs |
| 3-7 | 2 | 1 | Shelf + Open | 5 | One pig on shelf, one in open (arc shape test) |
| 3-8 | 2 | 2 (multi) | Tower + Tower | 10 | Whistle pig in tower → spawns pig in second tower |
| 3-9 | 1 | 1 | Wall + Moving | 4 | Moving pig behind glass wall |
| 3-10 | 2 | 2 (multi) | Pyramid Fortress | 10 | King pig (hp:2) in pyramid + guard pig |

### Chapter 4: Factored Form (y = a(x−r₁)(x−r₂))
**Launcher**: (1, 0.8).  
**Teaching goal**: Roots control landing precision. Multi-structure, multi-pig.

| Level | Targets | Shots | Template | Blocks | Notes |
|-------|---------|-------|----------|--------|-------|
| 4-1 | 1 | 1 | Wall (C) | 2 | r₂ controls landing behind glass |
| 4-2 | 1 | 1 | Shelf through Gap (A) | 4 | Must pick r₂ to arc through gap |
| 4-3 | 1 | 1 | Elevated Shelf | 5 | r₁ precision to arc up before landing |
| 4-4 | 2 | 1 | Staircase (H) | 6 | Blocks ascending, pig at top + bonus ring |
| 4-5 | 1 | 1 | Moat + Tower (J) | 6 | Static wall + fortress behind |
| 4-6 | 2 | 1 | Twin Shelf (A+A) | 6 | r₁ hits one structure, r₂ hits another |
| 4-7 | 2 | 2 (multi) | Castle Window (F) | 8 | Pig inside fortress with small window + pig on roof |
| 4-8 | 1 | 1 | Double Fortress | 10 | King (hp:2) inside double-layered fortress |
| 4-9 | 2 | 2 (multi) | Tower + Bonus (G) | 8 | Pig in tower + bonus ring over separate structure |
| 4-10 | 3 | 3 (multi) | Compound | 14 | Moving pig behind staircase + 2 pigs in separate structures |

### Chapter 5: Standard Form (y = ax² + bx + c)
**Launcher**: (1, 0.8).  
**Teaching goal**: Full coefficient control = maximum structural complexity.

| Level | Targets | Shots | Template | Blocks | Notes |
|-------|---------|-------|----------|--------|-------|
| 5-1 | 1 | 1 | Full Castle (F) | 8 | Pig inside, glass window to shoot through |
| 5-2 | 2 | 1 | Shelf + Open | 4 | c=0 constrains height, 2 pigs |
| 5-3 | 1 | 1 | Two-Layer Pyramid | 8 | Pig behind inner stone wall |
| 5-4 | 2 | 2 (multi) | Shelf + Moat (A+J) | 7 | Pig on shelf + bonus ring behind wall |
| 5-5 | 2 | 2 (multi) | King Fortress + Walls | 10 | King (hp:2) in stone fortress + guard pig |
| 5-6 | 2 | 1 | Inverted Structure (I) | 8 | Pig under overhanging blocks, cascade releases them |
| 5-7 | 2 | 2 (multi) | Twin Towers + Moving | 10 | Moving pig between two block towers |
| 5-8 | 3 | 3 (multi) | Obstacle Course | 12 | Three structures in a row, 1 pig each |
| 5-9 | 3 | 3 (multi) | Glass Box + Tower | 10 | Pig in glass box + pig on tower + guard pig |
| 5-10 | 3 | 4 (multi) | Grand Fortress | 14 | King (hp:3) in stone fortress + 2 guards + bonus ring |

### Chapter 6: Multi-Shot
**Launcher**: (1, 0.8).  
**Teaching goal**: Sequential destruction. Early shots weaken, later shots kill.

| Level | Targets | Shots | Template | Blocks | Notes |
|-------|---------|-------|----------|--------|-------|
| 6-1 | 2 | 2 | Shelf + Tower | 8 | Shot 1: shelf pig. Shot 2: tower pig |
| 6-2 | 1 | 3 | 3-Story Castle | 12 | Shot 1: glass roof, Shot 2: wood walls, Shot 3: king pig (hp:2) |
| 6-3 | 2 | 4 | Fortress + Guards | 14 | Clear wall blocks (shots 1-2), hit pigs (shots 3-4) |
| 6-4 | 3 | 3 | Triple Tower | 12 | 3 separate towers, one pig each |
| 6-5 | 2 | 3 | Wall + Moving Pig | 8 | Shot 1: break wall. Shots 2-3: time moving pig |
| 6-6 | 3 | 5 | Divided Castle | 16 | Two rooms, king pig in center + 2 guards |
| 6-7 | 2 | 5 | Guard + King | 14 | Guard in tower (kill first), king (hp:3) in fortress |
| 6-8 | 2 | 2 | Double Collapse + Bonus | 10 | Each shot must collapse a structure, bonus ring between |
| 6-9 | 3 | 5 | Relay Towers | 16 | Structures at varying heights, whistle pig + guard + king |
| 6-10 | 4 | 6 | Grand Finale Castle | 20+ | Full castle: whistle pig, 2 guards, king (hp:3), bonus ring |

### Chapter 7: Beyond Quadratics (Cubic, Absolute Value, Piecewise)
**Launcher**: (1, 0.8).  
**Teaching goal**: Unusual arc shapes reach positions quadratics can't.

| Level | Targets | Shots | Form | Template | Blocks | Notes |
|-------|---------|-------|------|----------|--------|-------|
| 7-1 | 1 | 1 | Cubic | Shelf under Ceiling | 6 | S-curve arc reaches under overhang |
| 7-2 | 2 | 1 | Cubic | Moat + Dip (J) | 8 | Arc dips then rises — hits pig behind wall |
| 7-3 | 2 | 2 (multi) | Cubic | Double Tower | 10 | Two pigs at different levels, S-curve hits both |
| 7-4 | 1 | 1 | Absolute | Gap Shot (C) | 6 | V-arc through narrow horizontal gap |
| 7-5 | 2 | 2 (multi) | Absolute | Top-Entry Box (F) | 10 | Pig enclosed, V-arc drops in through top opening |
| 7-6 | 2 | 2 (multi) | Piecewise | Angle Shot (C) | 8 | Pig behind partial structure, arc from specific angle |
| 7-7 | 3 | 3 (multi) | Cubic | Twin Towers | 12 | S-curve hits both towers, 3 pigs total |
| 7-8 | 2 | 2 (multi) | Vertex | Complex Fortress | 14 | Multi-block fortress, king (hp:2) + guard |
| 7-9 | 2 | 2 (multi) | Absolute | Inverted Bunker | 12 | King (hp:2) under glass overhangs, V-arc goes OVER glass |
| 7-10 | 3 | 3 (multi) | Cubic | Grand Castle | 18 | Castle with multiple block types, king (hp:3) + guard + whistle |

### Chapter 8: Boss Levels (Timed)
**Launcher**: (1, 0.8).  
**Teaching goal**: Time pressure + maximum complexity.

| Level | Time | Targets | Shots | Template | Blocks | Notes |
|-------|------|---------|-------|----------|--------|-------|
| 8-1 | 60s | 2 | 3 | Twin Shelf (A×2) | 8 | Speed decision — which to hit first |
| 8-2 | 90s | 1 | 1 | Maximum Fortress | 14 | Stone walls + wood inner + glass roof + king (hp:1) |
| 8-3 | 90s | 3 | 3 | Triple Cage | 12 | 3 moving pigs each in glass cage |
| 8-4 | 90s | 3 | 3 | Mixed Compound | 16 | Stairs + castle + tower, guard + 2 pigs |
| 8-5 | 120s | 4 | 5 | Ultimate Castle | 20+ | Moving king (hp:2) + guard + whistle + bonus ring |

---

## 7. Scoring System (Engine Addition)

### Formula
```
basePoints     = 1000 per target killed
blockBonus     = 50 × glass blocks + 100 × wood blocks + 200 × stone blocks
shotBonus      = 500 × unused shots
ringBonus      = 300 if bonus ring collected
cascadeBonus   = 200 per cascade kill (falling block kills pig)
```

### Star Thresholds (point-based)
- ⭐ = completed (any score)
- ⭐⭐ = 60% of max possible points
- ⭐⭐⭐ = 90% of max possible points

### Implementation
- Add `scoringMode: 'points'` to level config
- Add `calcPoints()` to `src/core/scoring.js`
- Track `blocksDestroyed`, `unusedShots`, `cascadeKills` in `LevelSession`
- Display running score in UI
- Persist high scores per level

---

## 8. Block Coordinate & Size Guidelines

**World space**: 0–10 wide, 0–6 tall. Ground at y=0.6.  
**Standard block sizes** (w × h in world units):

| Role | Width | Height | Notes |
|------|-------|--------|-------|
| Thin pillar | 0.3-0.4 | 0.5-1.2 | Tower legs, wall segments |
| Wide pillar | 0.5-0.6 | 0.8-1.2 | Sturdier base |
| Shelf (short) | 1.0-1.3 | 0.2-0.25 | Rests on 2 pillars |
| Shelf (wide) | 1.5-2.0 | 0.2-0.25 | Spans wider gap |
| Floor block | 0.5 | 0.5 | Square brick |
| Wall segment | 0.3-0.4 | 0.5-0.8 | Vertical wall bricks |
| Ceiling slab | 1.5 | 0.3 | Overhanging top |

**Placement**: Leave ≥0.5 world units between structure and world edges. Pig center should be 0.3-0.5 above block top (slight overlap looks "resting").

---

## 9. Support Chain Wiring Rules

The `supports` array means "when I am destroyed, these blocks may fall."

### Multi-Story Tower
```js
stone_pillar_l: supports: ['stone_beam']
stone_pillar_r: supports: ['stone_beam']
stone_beam:     supports: ['wood_pillar_l', 'wood_pillar_r']
wood_pillar_l:  supports: ['wood_beam']
wood_pillar_r:  supports: ['wood_beam']
wood_beam:      supports: ['glass_pillar_l', 'glass_pillar_r']
glass_pillar_l: supports: ['glass_beam']
glass_pillar_r: supports: ['glass_beam']
glass_beam:     supports: []  // topmost — nothing above
```
Destroy stone pillar → stone beam falls → lands on wood pillars (damages them) → if wood dies → wood beam falls → etc.

### Enclosed Fortress
```js
base_l:     supports: ['floor']
base_r:     supports: ['floor']
floor:      supports: []  // floor has pig restingOn it
wall_l:     supports: ['ceiling']
wall_r:     supports: ['ceiling']
ceiling:    supports: []  // ceiling can fall if walls die
```
Destroy base → floor falls → pig drops. Destroy wall → ceiling falls → lands on pig (cascade kill).

---

## 10. Winnability & Shot Economy

### Rule
A level is winnable if: `shots >= totalTargetHP`

BUT cascade kills (falling blocks crushing pigs) mean `shots < totalHP` can still be winnable. Design intent:

| Tightness | Formula | Feel |
|-----------|---------|------|
| Comfortable | shots = totalHP + 1 | Learn the level |
| Tight | shots = totalHP | Must be efficient |
| Expert | shots = totalHP - 1 | Requires cascade kill to win |

For Phase 2: default to `shots = totalHP` (tight). Use `shots = totalHP - 1` only for late-chapter levels where cascade path is guaranteed.

---

## 11. Difficulty Progression

| Stage | Chapters | Targets/Level | Blocks/Level | Shots | Cascade Depth |
|-------|----------|---------------|-------------|-------|---------------|
| Tutorial | Ch1 L1-L3 | 1 | 0-3 | 1 | 0 |
| Introduction | Ch1 L4-L7, Ch2 L1-L4 | 1 | 3-6 | 1 | 1 |
| Intermediate | Ch2 L5+, Ch3, Ch4 | 1-2 | 5-10 | 1-2 | 1-2 |
| Advanced | Ch5, Ch6 | 2-3 | 8-14 | 2-5 | 2-3 |
| Expert | Ch7, Ch8 | 2-4 | 12-20+ | 2-5 | 2-4 |

---

## 12. Files to Modify

| File | Change | Phase |
|------|--------|-------|
| `src/levels/chapters/chapter1.js` | Restructure all 10 levels | 2 |
| `src/levels/chapters/chapter2.js` | Restructure all 10 levels | 2 |
| `src/levels/chapters/chapter3.js` | Restructure all 10 levels | 2 |
| `src/levels/chapters/chapter4.js` | Restructure all 10 levels | 2 |
| `src/levels/chapters/chapter5.js` | Restructure all 10 levels | 2 |
| `src/levels/chapters/chapter6.js` | Restructure all 10 levels | 2 |
| `src/levels/chapters/chapter7.js` | Restructure all 10 levels | 2 |
| `src/levels/chapters/chapter8.js` | Restructure all 5 levels | 2 |
| `src/core/scoring.js` | Add `calcPoints()` | 2 |
| `src/game/LevelSession.js` | Track cascadeKills, blocksDestroyed | 2 |
| `src/ui/*` | Score display, shots remaining | 2 |
| `scripts/validate-levels.mjs` | Add winnability check | 2 |

---

## 13. Implementation Order

**Phase 2A — Restructure Ch4–Ch8** (these benefit most from complexity)
1. Ch4 (factored form — precision landing → multi-structure)
2. Ch5 (standard form — full control → complex fortresses)
3. Ch6 (multi-shot — sequential destruction → staged layouts)
4. Ch7 (beyond quadratics — unique arcs → unique structure placement)
5. Ch8 (boss — timed, maximum density)

**Phase 2B — Restructure Ch1–Ch3** (restraint — keep tutorial feel)
6. Ch1 (stretch form — introduce blocks one at a time)
7. Ch2 (vertex form — introduce mixed materials, towers)
8. Ch3 (sign & shape — upward arcs, buried pigs, multi-target)

**Phase 2C — Scoring System**
9. Add `calcPoints()` to scoring.js
10. Track cascadeKills, blocksDestroyed in LevelSession
11. Add score display to UI
12. Persist high scores

**Phase 2D — Validator Enhancement**
13. Add winnability check to `scripts/validate-levels.mjs`
14. Add `restingOn` reference validation
15. Add block overlap detection

**Phase 2E — Playtest**
16. Run 3-point checklist on every level
17. Fix any solvability issues
18. Fine-tune difficulty

**Per-chapter workflow:**
1. Read current level data
2. Design new structures per the template rules above
3. Write level data with proper `supports` chains
4. `node scripts/validate-levels.mjs` — fix errors
5. Winnability scan — `shots >= totalHP`
6. Playtest (3-point checklist from Section 2.10)
7. Move to next chapter

---

## 14. Validator Spec

`scripts/validate-levels.mjs` should check:

1. **ID uniqueness**: No two obstacles or targets share an ID within a level
2. **Supports references exist**: Every ID in any `supports` array is a real obstacle ID
3. **Pig above ground**: `pig.y >= 0.6 + pig.radius`
4. **Pig above its block**: If `restingOn` is set, `pig.y >= block.y + block.height + pig.radius - 0.05`
5. **Blocks within world bounds**: `block.x >= 0`, `block.x + block.width <= 10`, `block.y >= 0.6`
6. **No overlapping blocks**: No two blocks share significant area
7. **Winnability**: `shots >= sum of all target HP` for every level
8. **Supports chains**: Every destructible block with blocks above it must have `supports` wiring

Run with: `node scripts/validate-levels.mjs`

---

## 15. Winnability Fixes Applied (Phase 1)

| Chapter | Levels Fixed | Fix Applied |
|---------|-------------|-------------|
| Ch2 | L5, L8 | HP 2→1; L8 defaultParams arc fix |
| Ch3 | L5, L7, L8, L10 | HP reduced; L7/L8 removed second target |
| Ch4 | L6, L7, L8 | HP reduced; L6 removed second target |
| Ch5 | L1, L3, L5, L9, L10 | HP reduced; L9 removed second target |
| Ch6 | L9 | Added 6th shot to multiShot (5→6) |
| Ch7 | L3, L5, L6, L7, L8, L9, L10 | HP reduced; L3/L7 removed first target |
| Ch8 | L2, L4, L5 | HP reduced to match shot counts |

These were emergency fixes. Phase 2 will supersede most of them with proper multi-shot + multi-target designs.

---

## 16. Not In Scope

- **Engine physics changes** — no momentum transfer, no block rotation
- **New block types** — only glass/wood/stone
- **Block art/sprites** — procedural drawing stays
- **Level select UI** — grid layout stays
- **Dynamic block spawning** — blocks are static at level load
- **Arc redirection** — ball path doesn't change after hitting a block

---

## 17. Open Questions

- [ ] Should stone blocks ever be indestructible in early levels (teach that not everything breaks)?
- [ ] Should moving targets ever sit on destructible blocks? (Block destroyed → pig lands on ground, keeps moving?)
- [ ] Crack preview: Ch1 all levels, Ch2 L1-L3 only, Ch3+ none? (Previously resolved — confirm still desired)
- [ ] Should multi-shot levels show "shots remaining" counter?
- [ ] Should cascade kills be highlighted visually (different explosion particle)?
- [ ] Score persistence: localStorage only, or backend?

---

## 18. Budget & Delegation Rules

**Coding tasks should be outsourced to Claude Code when possible.** Kenzo does not want to spend per-token for coding work. The plan is designed so that any agent can pick up a chapter and implement it.

### Delegation Protocol
1. **Primary**: Delegate to Claude Code (`claude --model sonnet`) for all level restructuring work
2. **Fallback**: If Claude gets rate limited, **pause** and notify Kenzo — do not burn tokens doing the work manually
3. **Z.ai rate limit**: If the current model gets rate limited, **pause** and notify Kenzo — do not substitute with paid models
4. **Manual edits**: Only for small fixes (syntax errors, single-line HP changes), not for restructuring chapters

### Notification Triggers
- Claude Code rate limited → notify Kenzo, wait for reset (5:30 PM America/Los_Angeles)
- Z.ai/model rate limited → notify Kenzo immediately, ask how to proceed
- Unexpected token spend → flag it
- Chapter complete → show results, move to next
- Plan needs clarification → ask before spending tokens
