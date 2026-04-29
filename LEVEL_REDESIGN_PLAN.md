# Happy Nerds — Level Redesign Plan
## Goal: Angry Birds-style Block Structures Across 76 Levels (Ch1–7: 10 each, Ch8: 6 boss levels)

---

## 1. Problem Statement

The current game is deterministic and low-surprise. The player sees the arc preview, adjusts `a`, fires, and the outcome is known before the ball lands. Levels without block structures offer no secondary challenge — only "did I pick the right coefficient?"

Angry Birds works because:
- The pig sits inside or on top of a structure
- Hitting the structure differently produces wildly different outcomes
- Cascading collapses make each shot feel physical and alive
- The player must reason about *where* to hit, not just *whether* they'll hit

The arc preview is fine to keep. The surprise comes from the structure physics — whether a tower tips, a shelf collapses on the pig, or a missed hit leaves the pig alive but the structure wrecked.

---

## 2. Design Principles

### 2.1 Every Level Gets a Structure
All 80 levels should have at least one block structure. Simple structures (single shelf) in early levels; complex multi-layer fortresses by late chapters. "No obstacles" is only acceptable for the very first tutorial level of each chapter.

### 2.2 Pig Always Sits On, In, or Behind a Structure
Never a pig floating in open air. Pigs should be:
- **On top** of a block (shelf/platform)
- **Behind** a wall of blocks (shoot through glass to reach it)
- **Inside** a structure (enclosed on 2-3 sides)
- **Underneath** a block that can fall on it

### 2.3 The "Wrong Hit" Must Have Consequences
The structure should be designed so that hitting the wrong part damages blocks but leaves the pig alive — forcing the player to retry and think about angle. A full miss should visibly wreck something. A perfect hit triggers a satisfying cascade.

### 2.4 Structures Match Equation Complexity
Simple equations (single coefficient, stretch form) → simple structures (1-2 blocks, obvious cascade).  
Complex equations (multi-coefficient, standard form) → complex structures (4-6 blocks, non-obvious cascade).

### 2.5 Block Material Tells a Story
- **Glass**: fragile, shatters on first hit. Used for shelves holding pigs, thin walls.
- **Wood**: two hits. Used for middle tiers, horizontal planks between pillars.
- **Stone**: three hits. Used for bases, protected fortresses, boss-level cores.

The player reads the structure and estimates how many hits are needed before a cascade can happen.

### 2.6 Cascade Must Be Visible and Satisfying
A destroyed block should cause something to move. Every structure should have at least one `supports` chain so that destroying a key block triggers a falling animation — not just a block disappearing.

### 2.7 Pig Placement Formula
The pig's `y` coordinate is its **center**. Block `y` is its **bottom edge**. To place a pig sitting on top of a block:
```
pig.y = block.y + block.height + pig_radius
```
Standard pig radius is 0.45. So a glass shelf at `y: 1.3, height: 0.3` puts the pig center at `y = 1.3 + 0.3 + 0.45 = 2.05`. Always calculate this — never eyeball it.

### 2.8 Arc Pass-Through Rule
The ball arc is **pre-calculated once** at launch. It passes through all destructible blocks on its trajectory — the engine applies damage frame-by-frame but does not reroute the arc around destroyed blocks. This means:
- Blocks stacked vertically in front of each other on the arc path will ALL be hit in sequence.
- You cannot use one block to "stop" the ball from reaching a block behind it.
- Design structures so the interesting cascade happens **perpendicular to the arc** (blocks fall sideways or downward), not inline with it.
- Use this intentionally: a shot that destroys a glass shelf AND the wood pillar below in one pass is satisfying.

### 2.9 Supports Wiring Checklist
The cascade system requires **explicit wiring**. The engine does NOT infer supports geometrically. For every block that physically holds up another block:

1. The **lower** block's `supports` array must list the **upper** block's ID.
2. If two pillars jointly support a shelf, BOTH pillar `supports` arrays must list the shelf ID.
3. If the shelf only falls when BOTH pillars are gone, this is correct — it checks for any remaining supporter.
4. Missing a `supports` link = no cascade. The upper block floats in mid-air after the lower block is destroyed.

Example:
```js
{ id: 'pillar_l', ..., supports: ['shelf'] },
{ id: 'pillar_r', ..., supports: ['shelf'] },
{ id: 'shelf', ..., supports: [] },
```

### 2.10 Level Acceptance Checklist (Playtest Protocol)
A level is done when all three pass:
1. **Solvable**: There exists at least one arc (within the chapter's slider range) that destroys or knocks out the pig.
2. **Punishing on miss**: At least one visually distinct "wrong" arc hits the structure but leaves the pig alive.
3. **Cascade fires**: Destroying the intended block visibly triggers a falling animation on at least one other block.

---

## 3. Structure Archetypes

These are the building blocks of level design. Each chapter introduces new archetypes on top of previous ones.

| # | Archetype | Description | Blocks | Cascade? |
|---|-----------|-------------|--------|----------|
| A | Simple Shelf | Glass plank with pig on top, supported by 2 wood pillars | 3 | Yes — hit one pillar, shelf falls |
| B | Single Tower | Stone base, wood mid, glass top, pig on top | 3-4 | Yes — destroy base, all fall |
| C | Fortress Wall | 3-4 blocks side by side, pig behind/inside | 3-4 | Partial — must clear full wall |
| D | Hanging Platform | Glass block supported by two pillars (pig on glass) | 3 | Yes — glass shatters, pig drops |
| E | Double Tower | Two towers, pig on a shared glass shelf between them | 5 | Yes — destroy either tower |
| F | Castle | Stone outer walls, wood inner walls, glass roof, pig inside | 6-8 | Yes — complex cascade |
| G | Pyramid | Stone base wide, wood mid, glass top, pig atop | 4-5 | Yes — topple from base |
| H | Staircase | Blocks at ascending heights, pig at top | 3-4 | Partial — domino potential |
| I | Buried Pig | Pig under 2-3 stacked blocks | 3-4 | Yes — blocks must be destroyed |
| J | Moat + Tower | Static wall beside destructible tower, pig behind tower | 4-5 | Yes — must navigate wall then tower |

---

## 4. Chapter-by-Chapter Redesign

### Chapter 1: Stretch Form (y = ax²)
**Launcher**: (1, 4.5) elevated. Arc descends.  
**Single coefficient**: `a` only.  
**Structure progression**: Introduce A (shelf) → B (tower) → add walls.  
**Block teaching goal**: Players are seeing glass, wood, and stone for the first time. Early levels (L2–L4) should use only one block type per level and make the cascade obvious — a single glass shelf shattering under the pig, not a 4-block puzzle. Complexity ramps across L5–L10 only after the player has seen each material break at least once.

| Level | Title (keep or rename) | Structure Goal | Archetype | Notes |
|-------|------------------------|---------------|-----------|-------|
| 1-1 | First Shot | No structure — arc only. Tutorial. | — | Keep as-is |
| 1-2 | Shelf Shot | Pig on glass shelf (2 wood pillars + glass). Hit glass → pig drops | A | Simplest cascade, obvious |
| 1-3 | Wide Shelf | Same as 1-2 but target is farther, shelf is higher | A | Wider arc needed |
| 1-4 | Leaning Tower | 3-block tower (stone/wood/glass), pig on top | B | Hit wood base → cascade |
| 1-5 | The Penthouse | Pig on glass shelf atop two stone pillars, high up | A (elevated) | Arc must reach height |
| 1-6 | Behind the Wall | Static wall + pig inside simple 2-block wood enclosure | C | Clear wall then enclosure |
| 1-7 | Double Tower | Two wood towers sharing a glass shelf. Pig on shelf | E | Destroying either tower enough |
| 1-8 | Moving Shelf | Pig on shelf (A), target moves slightly side to side | A + moving | First moving target + structure |
| 1-9 | Speed Tower | Fast moving pig behind glass wall | C + moving | Structure gives "cover" |
| 1-10 | The Gauntlet | Static wall + pyramid structure behind it | J + G | Hardest Ch1 level |

---

### Chapter 2: Vertex Form (y = a(x−h)² + k)
**Launcher**: (1, 0.8) ground level.  
**Two/three coefficients**: `a`, `h` (required), `k` auto-derived in some levels.  
**Structure progression**: Introduce D (hanging) and F (castle basics).  
**Block teaching goal**: Players now know all three block types from Ch1 but are still getting used to mixed structures. Ch2 L1–L3 should still feel readable — one dominant block type per structure, with the second type used sparingly as accent. Full multi-material structures (glass + wood + stone in one build) start at L5.

| Level | Structure Goal | Archetype |
|-------|---------------|-----------|
| 2-1 | Tutorial intro: pig behind single glass block | C (1 block) |
| 2-2 | Pig on hanging glass platform (D) | D |
| 2-3 | Two-level tower: wood base + glass shelf, bonus ring above | B partial |
| 2-4 | Short castle: 2 stone sides, wood top, pig inside | F partial |
| 2-5 | Tall tower: stone/wood/wood/glass, pig at top (high k needed) | B tall |
| 2-6 | Pig behind glass wall (1 block thick). Bonus ring in open | C thin |
| 2-7 | Wall + tower: static wall + D archetype behind it | J + D |
| 2-8 | Double platform: 2 pigs each on separate shelves | A × 2 |
| 2-9 | Suspended pig: hanging glass with pig, must time arc under ceiling obstacle | D + ceiling |
| 2-10 | Moving pig in castle courtyard (F), static walls on sides | F + moving |

---

### Chapter 3: Sign & Shape (a can be positive)
**Launcher**: (1, 0.8).  
**Insight**: Positive `a` creates upward arcs — can hit the underside of elevated platforms.  
**Structure progression**: Introduce I (buried pig) and G (pyramid). Upward arcs unlock hitting ceilings of structures.

| Level | Structure Goal | Archetype |
|-------|---------------|-----------|
| 3-1 | Intro to positive a: pig on elevated platform, must arc up to reach | A elevated |
| 3-2 | Pig buried under glass + wood blocks | I |
| 3-3 | Wide pyramid, pig at top | G |
| 3-4 | Pig in a trench: walls on sides, glass ceiling above pig | F partial |
| 3-5 | Tall stone column with pig on top | B tall stone |
| 3-6 | Three structures in a row at different heights | A × 3 |
| 3-7 | Two pigs: one on shelf, one in open (test arc shape) | A + open |
| 3-8 | Whistle pig in tower — spawns second pig when hit, second in another structure | B + B |
| 3-9 | Moving pig patrolling behind glass wall | C + moving |
| 3-10 | King pig in pyramid fortress | G + F (king) |

---

### Chapter 4: Factored Form (y = a(x−r₁)(x−r₂))
**Launcher**: (1, 0.8).  
**Insight**: Roots control landing spot — precision of second root determines where arc ends.  
**Structure progression**: Introduce H (staircase), J (moat + tower). Precision of landing matters more.

| Level | Structure Goal | Archetype |
|-------|---------------|-----------|
| 4-1 | r₂ controls landing — pig on ground near glass block | C (1 block) |
| 4-2 | Pig on low shelf — must pick r₂ to pass through gap in structure | A gap |
| 4-3 | Pig on high shelf — requires r₁ precision to arc up before landing | A elevated |
| 4-4 | Staircase of blocks, pig at top | H |
| 4-5 | Moat wall + tower | J |
| 4-6 | Two pigs: r₁ hits one structure, r₂ hits another | A + A two-pig |
| 4-7 | Pig elevated inside a castle with small window | F (window) |
| 4-8 | King pig inside double-layered fortress | F thick |
| 4-9 | Bonus ring above structure, pig inside structure | G + bonus |
| 4-10 | Moving pig behind staircase structure | H + moving |

---

### Chapter 5: Standard Form (y = ax² + bx + c)
**Launcher**: (1, 0.8).  
**Insight**: Three coefficients give full control. Structures can be larger, more complex, more precise targeting needed.  
**Structure progression**: Introduce full F (castle), complex cascades, multi-layer.

| Level | Structure Goal | Archetype |
|-------|---------------|-----------|
| 5-1 | Full castle, pig inside, glass window to shoot through | F |
| 5-2 | c locked at 0: pig on simple shelf (constrains launch height) | A |
| 5-3 | Two-layer pyramid, pig behind inner stone wall | G + C |
| 5-4 | Pig on shelf, bonus ring on other side of static wall | A + J |
| 5-5 | King pig in stone fortress, protected by two static walls | F + static walls |
| 5-6 | Inverted structure: pig under overhanging blocks | I complex |
| 5-7 | Moving pig in open courtyard between two block towers | E + moving |
| 5-8 | Three-structure obstacle course, 1 pig at end | B + C + A |
| 5-9 | Two pigs: one in glass box, one on a tower | F partial + B |
| 5-10 | King in fortress, stone base with glass ceiling, bonus ring | F (grand) |

---

### Chapter 6: Multi-Shot
**Launcher**: (1, 0.8).  
**Insight**: Each shot can weaken a structure before the killing shot. Early shots knock off glass; later shots hit exposed wood/stone/pig.  
**Structure progression**: Structures require multiple hits in sequence. First shot weakens, second kills.

| Level | Structure Goal | Notes |
|-------|---------------|-------|
| 6-1 | Shot 1: pig on shelf A. Shot 2: pig on tower B | Simple introduction to sequential |
| 6-2 | 3 shots: stone castle (shot 1 hits glass roof, shot 2 hits wood, shot 3 hits pig) | Staged destruction |
| 6-3 | 4 shots: clear a path (shot 1-2 destroy wall blocks, shot 3-4 hit pigs) | Path-clearing |
| 6-4 | 3 shots: 3 separate towers, one pig each | Independent structures |
| 6-5 | 3 shots: moving pig behind wall (shot 1 breaks wall, shot 2 times moving pig) | Timing + structure |
| 6-6 | 5 shots: two sides of a divided castle, king pig in center | Complex F |
| 6-7 | 5 shots: guard pig in tower (kill guard first), king pig in fortress | Sequence matters |
| 6-8 | 2 shots: each must collapse a structure, bonus ring between | A + A + bonus |
| 6-9 | 5 shots: relay of structures at varying heights | H × multiple |
| 6-10 | 6 shots: grand finale — full castle with whistle pig, guard pigs, king | F (max) |

---

### Chapter 7: Beyond Quadratics (Cubic, Absolute Value, Piecewise)
**Launcher**: (1, 0.8).  
**Insight**: Unusual arc shapes (S-curve, V-shape) can reach positions quadratics cannot. Structures designed to exploit these unique paths.  
**Structure progression**: Structures placed where only the special arc shape can reach inside them.

| Level | Form | Structure Goal | Notes |
|-------|------|---------------|-------|
| 7-1 | Cubic | Pig on high shelf, only S-curve arc can reach under overhanging wall | A under ceiling |
| 7-2 | Cubic | Pig behind wall that forces arc to dip then rise (cubic path essential) | J (dip) |
| 7-3 | Cubic | Two pigs at different levels connected by a chain structure | B double |
| 7-4 | Absolute | V-arc through narrow horizontal gap between stacked blocks | C (gap) |
| 7-5 | Absolute | Pig enclosed in box with top opening only — V-arc drops in | F (top opening) |
| 7-6 | Piecewise | Pig behind partial structure, arc must come from specific angle | C (angle) |
| 7-7 | Cubic | Two pigs on separate structures, S-curve hits both | A + A |
| 7-8 | Vertex | Complex multi-block fortress — test all learned forms | F complex |
| 7-9 | Absolute | King pig under glass overhangs — V-arc must go OVER the glass | I (inverted) |
| 7-10 | Cubic | Grand finale: castle with multiple block types, bonus ring | F (grand) |

---

### Chapter 8: Boss Levels (Timed)
**Launcher**: (1, 0.8).  
**Insight**: Time pressure + complex structures. Player must think fast.  
**Structure progression**: All archetypes combined. Maximum density of blocks and targets.  
**Note**: 6 levels only — 10 timed boss levels would slog. Total across all chapters = 76.

| Level | Time | Shots | Structure Goal | Notes |
|-------|------|-------|---------------|-------|
| 8-1 | 60s | 3 | Two shelves (A × 2), decide which to hit first | Speed decision, simplest boss |
| 8-2 | 90s | 1 | The Fortress: stone walls + wood inner walls + glass roof + king | F (maximum), single equation |
| 8-3 | 90s | 3 | 3 moving pigs each in a small glass cage | C × 3 + moving |
| 8-4 | 90s | 3 | Mixed structures at every height — stairs + castle + tower | H + F + B |
| 8-5 | 100s | 4 | Moving king pig behind a collapsing stone castle | F (stone heavy) + moving king |
| 8-6 | 120s | 6 | Final exam: every archetype in one level, king pig at the center | All archetypes, grand finale |

---

## 5. Block Coordinate & Size Guidelines

**World space**: 0–10 wide, 0–6 tall. Ground at y=0.6.  
**Standard block sizes** (w × h in world units):

| Role | Width | Height | Notes |
|------|-------|--------|-------|
| Thin pillar | 0.4 | 0.8–1.2 | Tower legs, wall segments |
| Wide pillar | 0.6 | 0.8–1.2 | Sturdier base |
| Shelf (short) | 1.3 | 0.25 | Rests on 2 pillars |
| Shelf (wide) | 2.0 | 0.25 | Spans wider gap |
| Floor block | 0.5 | 0.5 | Square brick |
| Wall segment | 0.4 | 0.6 | Vertical wall bricks |
| Ceiling slab | 1.5 | 0.3 | Overhanging top |

**Structure placement rule**: Leave at least 0.5 world units between any structure and the world edges. Pig target center should be 0.3–0.5 above the top of any block it sits on (so it overlaps slightly, looks "resting on" the block).

---

## 6. Support Chain Rules

The `supports` array on each block means "when I am destroyed, these blocks may fall."

**Tower (bottom-to-top)**:
```
stone_base: supports: ['wood_mid']
wood_mid:   supports: ['glass_top']
glass_top:  supports: []
```
Destroy base → mid falls → top falls → pig (sitting on top) is now on the ground.

**Shelf on pillars**:
```
pillar_left:  supports: ['shelf']
pillar_right: supports: ['shelf']
shelf:        supports: []
```
Both pillars must be destroyed for shelf to fall. Destroy one → shelf stays but structure is weakened. This creates a "partial progress" state.

**Cascade fortress**:
```
outer_glass: supports: ['wood_inner']
wood_inner:  supports: ['stone_core']
stone_core:  supports: []
```
Destroy glass → wood falls → landing on stone causes damage to stone.

---

## 7. Difficulty Progression Framework

| Stage | Chapters | Structure Complexity | Blocks per Level | Cascade Depth |
|-------|----------|---------------------|-----------------|---------------|
| Tutorial | Ch1 L1–L3 | 0–1 block | 0–3 | 0 |
| Introduction | Ch1 L4–L7, Ch2 L1–L4 | 2–3 blocks | 3–4 | 1 level |
| Intermediate | Ch2 L5+, Ch3, Ch4 | 3–5 blocks | 4–6 | 1–2 levels |
| Advanced | Ch5, Ch6 | 4–7 blocks | 5–8 | 2–3 levels |
| Expert | Ch7, Ch8 | 6–10 blocks | 6–10 | 2–4 levels |

---

## 8. Files to Modify

| File | Change |
|------|--------|
| `src/levels/chapters/chapter1.js` | Full level redesign |
| `src/levels/chapters/chapter2.js` | Full level redesign |
| `src/levels/chapters/chapter3.js` | Full level redesign |
| `src/levels/chapters/chapter4.js` | Full level redesign |
| `src/levels/chapters/chapter5.js` | Full level redesign |
| `src/levels/chapters/chapter6.js` | Full level redesign |
| `src/levels/chapters/chapter7.js` | Full level redesign |
| `src/levels/chapters/chapter8.js` | Full level redesign |

**No engine changes required.** The block system, cascade physics, renderer, and arc-through-block behavior already exist and work. This is purely a data/level-design change.

---

## 9. Implementation Order

**Step 0 — Write the validator first** (Section 10). ✅ DONE — `scripts/validate-levels.mjs` passes cleanly on all 75 existing levels.

Then, one chapter at a time:

1. Write level data for the chapter
2. `node scripts/validate-levels.js` — fix any errors before play-testing
3. Play-test using the 3-point acceptance checklist (Section 2.10)
4. Move to the next chapter only when all levels pass

**Order**: Ch1 → Ch2 → Ch3 → Ch4 → Ch5 → Ch6 → Ch7 → Ch8  
Ch6 (multi-shot) depends on block feel being dialled in from Ch1–5 — do not skip ahead.  
Ch8 (timed) last — boss levels reuse proven archetypes from all prior chapters.

---

## 10. Dev-Time Validator

Add a script at `scripts/validate-levels.js` that imports all chapter files and checks:

1. **ID uniqueness**: No two obstacles or targets share an ID within a level
2. **Supports references exist**: Every ID in any `supports` array is a real obstacle ID in the same level
3. **Pig above ground**: `pig.y >= 0.6 + pig.radius` (pig center is above ground)
4. **Pig above its block**: If a pig is intended to sit on a block, `pig.y >= block.y + block.height + pig.radius - 0.05` (small tolerance)
5. **Blocks within world bounds**: `block.x >= 0`, `block.x + block.width <= 10`, `block.y >= 0.6`
6. **No overlapping blocks**: No two blocks in the same level share significant area

Run with: `node scripts/validate-levels.js`

---

## 11. What Already Exists (No Engine Changes Needed)

| Feature | Where | Status |
|---------|-------|--------|
| Block HP system (glass/wood/stone) | `LevelSession.js` | Complete |
| Cascade via `supports` array | `LevelSession._getSupportedBlocks` | Complete |
| Falling animation with gravity | `LevelSession.updateFalling` | Complete |
| Block rendering (3 types + cracks + flash) | `Renderer._drawBlockByType` | Complete |
| Arc passes through blocks (no clip) | `arc.js clipArcAtObstacle` | Complete |
| Frame-by-frame block damage | `GameController._animateLaunch` | Fixed (this session) |
| Falling block lands on targets | `LevelSession._onBlockLand` | Complete |
| Falling block damages other blocks | `LevelSession._onBlockLand` | Complete |

---

## 12. NOT In Scope

- **Engine changes**: No modifications to arc math, bounce physics, or rendering code
- **New block types**: Only glass/wood/stone — no new materials
- **Block art/sprites**: Current procedural drawing stays as-is
- **Level select UI changes**: Grid layout stays the same
- **Dynamic block spawning**: Blocks are static at level load; no mid-level block placement
- **Block-on-block stacking physics**: Blocks only fall to ground or to the top of another fixed block — they don't stack dynamically on each other after landing
- **Arc redirection**: The ball's path does not change after hitting/destroying a block

---

## 13. Open Questions

- Should pigs be placed slightly *inside* block bounding boxes (so they appear "protected") or always above them? (Recommendation: always above, using the section 2.7 formula)
- Should moving targets ever sit on destructible blocks? (Block destroyed → pig lands on ground, keeps moving?)
- **Crack preview on arc (RESOLVED)**: Show a crack indicator on blocks the preview arc passes through. Ch1: all levels (tutorial crutch). Ch2: levels 1-3 only, gone by level 4. Ch3+: no crack preview. The player learns to read the arc themselves early on.

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR (PLAN) | 6 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**UNRESOLVED:** 0  
**VERDICT:** ENG CLEARED — ready to implement. Build the validator first (Section 10), then Ch1.
- Should stone blocks ever be used as indestructible obstacles in early levels to teach the player that not everything breaks?
