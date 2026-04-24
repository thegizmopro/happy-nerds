## Task: E-32 — Whistle Pig Spawn Mechanic

### Problem
Whistle pig is only visual — different face color and a whistle drawing. When hit, it dies like any other pig. The design calls for it to spawn a new Jock Pig on hit, adding chaos and a strategic decision point.

### What to Build

1. **On whistle pig hit, spawn a new helmet pig** at a random valid position near the whistle pig's location. The new pig is a real target that must be hit to complete the level.

2. **Max 1 spawn per whistle pig.** Prevent infinite chains — once a whistle pig has spawned, it won't spawn again (even though it's already dead, this is defensive).

3. **Spawn position logic:** The new helmet pig appears within 1.5 world units of the whistle pig's position, but:
   - Not inside an obstacle
   - Not overlapping another target
   - Not below the ground line (y must be ≥ launcher.y)
   - Not off-screen (x must be between 1 and WORLD_W - 1)
   - If no valid position found after 10 attempts, spawn at the whistle pig's exact position

4. **Visual feedback:** When the new pig spawns, it should appear with a brief "pop-in" animation — start at radius 0 and scale up to full radius over 200ms.

5. **Sound:** Play the `playWhistleTweet()` sound effect when the whistle pig is hit (before it spawns the new pig).

6. **The spawned pig uses a unique ID** like `spawn-{originalTargetId}-{timestamp}` to avoid ID collisions.

7. **Multi-shot consideration:** In multi-shot levels, the spawned pig counts as a target for the current shot's targetIds if the whistle pig was in that shot's target set. If not, it's an "extra" target that any subsequent shot can hit.

### Implementation Details

**In `src/game/GameController.js`:**

In the `_animateLaunch` frame loop, after `this.session.recordHit(t.id)`, check if `t.pigType === 'whistle'`. If so:
1. Play `this.sound.playWhistleTweet()`
2. Create a new target object:
   ```js
   {
     id: `spawn-${t.id}-${Date.now()}`,
     x: spawnX, y: spawnY,  // computed near whistle pig
     radius: t.radius,
     pigType: 'helmet',
     hp: 1,
     moving: null
   }
   ```
3. Add it to `session.config.targets` (the live target list)
4. Add it to `session.targetHP` with hp=1
5. If multi-shot and `targetIds` exists, add the new target's id to `targetIds` so it's hittable on this shot
6. Store a `hasSpawned` flag on the original target to prevent re-spawning

**In `src/game/LevelSession.js`:**

Add a method `spawnTarget(newTarget)` that:
- Pushes the target onto `config.targets`
- Initializes `targetHP[newTarget.id] = newTarget.hp`
- Sets `targetsHit.delete(newTarget.id)` to ensure it's not pre-hit
- Returns the new target

**In `src/renderer/Renderer.js`:**

- When drawing a pig with id starting with `spawn-`, check if it was recently created (within 200ms). If so, scale the radius from 0 to full over 200ms. Use a `spawnTime` property on the target or a map in the session.

### Files to Modify
- `src/game/GameController.js` — spawn logic on whistle pig hit
- `src/game/LevelSession.js` — `spawnTarget` method
- `src/renderer/Renderer.js` — pop-in animation for spawned pigs

### Constraints
- Do NOT modify any level data files (whistle pigs already exist in levels)
- Do NOT modify the collision system
- The spawn must happen during the launch animation (real-time), not after
- Max 1 spawn per whistle pig, no chains
- The spawned helmet pig is a standard 1 HP target

### Verification
After making changes, verify:
1. Hitting a whistle pig spawns a new helmet pig nearby
2. The tweet sound plays on whistle pig hit
3. The new pig has a pop-in animation
4. The new pig is a valid target — level only completes when it's also hit
5. Only 1 pig spawns per whistle pig (no chain)
6. Levels without whistle pigs are unaffected
