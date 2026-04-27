## Task: E-51 Destructible Block System (Column Collapse)

### Overview
Add destructible obstacle blocks that can be destroyed by the arc, causing blocks above to fall. Falling blocks damage targets and other blocks. This adds strategic depth: "do I hit the pig directly, or collapse the structure onto it?"

### Block Types (3 materials)
| Type | HP | Color | Description |
|---|---|---|---|
| `glass` | 1 | Light blue, transparent | Shatters easily |
| `wood` | 2 | Brown | Medium toughness |
| `stone` | 3 | Gray | Very tough |

### Data Model Changes

**In level config** — obstacles get new fields:
```js
obstacles: [
  { id: 'b1', x: 5.0, y: 0.8, width: 0.5, height: 0.5, blockType: 'wood', hp: 2, supports: ['b3'] },
  { id: 'b2', x: 5.5, y: 0.8, width: 0.5, height: 0.5, blockType: 'stone', hp: 3, supports: ['b3'] },
  { id: 'b3', x: 5.0, y: 1.3, width: 1.0, height: 0.3, blockType: 'wood', hp: 2, supports: ['b4'] },
  { id: 'b4', x: 5.0, y: 1.6, width: 0.5, height: 0.5, blockType: 'glass', hp: 1, supports: [] },
]
```
- `blockType`: 'glass' | 'wood' | 'stone' (default: 'stone' for backward compat)
- `hp`: hit points (default from blockType if not specified)
- `supports`: array of obstacle IDs that this block is directly holding up

### LevelSession Changes

**New state in LevelSession:**
- `obstacleHP[id]` — current HP for each obstacle
- `obstacleDestroyed[id]` — timestamp when destroyed (for animation)
- `fallingBlocks[]` — array of blocks currently falling { id, startY, endY, currentY, velocity, damage }
- `destroyedById[id]` — what destroyed this block ('arc' | 'falling_block')

**New methods:**
- `hitObstacle(id, damage)` — reduce HP, destroy if 0, trigger cascade
- `cascadeDestroy(destroyedId)` — find blocks supported by destroyedId, make them fall
- `updateFalling(dt)` — advance falling blocks, check landing, apply damage
- `isObstacleAlive(id)` — check if obstacle still exists

**Falling block logic:**
1. When a block is destroyed, find all blocks whose `supports` list includes the destroyed block
2. Check if each such block has ANY remaining supports (other blocks still alive)
3. If no supports remain, start falling: add to `fallingBlocks[]`
4. Falling block: `currentY += velocity * dt; velocity += gravity * dt`
5. Landing check: does the block's bottom reach the ground (y=0.8) or the top of another alive block?
6. On landing: deal damage to whatever is below
   - Landing on target: deal 1 damage
   - Landing on block: deal 1 damage to that block (may cascade further)
   - Landing on ground: stop, stay as rubble
7. Fallen blocks that deal lethal damage continue the cascade

### Renderer Changes

**Block drawing** (`_drawObstacles`):
- Glass: light blue (#93c5fd), semi-transparent, crack lines when damaged
- Wood: brown (#92400e), wood grain lines, splinter effect when damaged
- Stone: gray (#6b7280), rough texture, crack lines when damaged
- Flash white on hit (same as targets)
- On destruction: crack animation (100ms) then disappear
- Falling blocks: drawn at their interpolated `currentY` position
- Rubble: small fragments drawn at landing spot (optional, nice-to-have)

**Block damage visualization:**
- HP = max: clean block
- HP damaged: crack lines overlaid
- HP = 0: shatter animation (brief flash + particles)

### GameController Changes

**In `_animateLaunch`:**
- After arc-to-target collision check, also check arc-to-obstacle collision
- Arc hitting obstacle: call `session.hitObstacle(id, 1)`
- Obstacles block the arc (same as current wall collision)
- Bounce mechanic still works on alive obstacles

**New update loop:**
- After each frame during arc animation, call `session.updateFalling(dt)`
- Falling blocks are visual-only during arc flight — they don't interact with the arc
- After arc animation completes, run falling simulation until all blocks settle
- Once settled, check win condition

### Level Design

**Update existing levels** — add destructible blocks to some levels:
- Ch1-2: Add a few glass/wood blocks near targets
- Ch3-4: Add wood/stone structures protecting targets
- Ch5-6: Add multi-layer structures
- Ch7-8: Add complex structures with strategic choices

**Keep it simple for now** — add blocks to 5-10 existing levels, don't redesign everything.

### Collision Detection

Arc-to-obstacle collision already exists for walls. Extend it:
- Current: arc bounces off obstacles (static walls)
- New: if obstacle has `blockType`, arc can DAMAGE it (reduce HP) instead of just bouncing
- On damage: flash white, reduce HP, if HP=0 then destroy and cascade
- Arc continues past destroyed obstacles (no more collision with that block)

Actually, simpler approach: **arc destroys the block on hit, no bounce**. The arc passes through the destroyed block. This makes blocks more like shields that absorb one (or more) hits.

### Important Constraint
- Do NOT modify the arc equation system, bounce mechanic (max 3 bounces), or target collision
- Do NOT change existing level data files for chapters where no blocks are added
- Falling blocks must not interact with the arc mid-flight (too complex)
- All block art drawn with Canvas 2D API (no new image assets needed)

### Verification
1. Glass blocks break in 1 hit, wood in 2, stone in 3
2. Destroyed blocks cause supported blocks to fall
3. Falling blocks damage targets and other blocks on landing
4. Cascade: destroying a base block can topple a whole tower
5. Visual feedback: flash on hit, cracks when damaged, fall animation
6. Win condition accounts for cascade damage (target killed by falling block counts)
7. Existing levels without blockType still work as before
8. Arc still bounces off alive obstacles
