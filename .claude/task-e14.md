## Task: E-14 — Fix Obstacle Collision Blocking

### Problem
In GameController.js, the launch() method has this line:
if (!hitObstacle || true)
The || true disables obstacle collision entirely. The arc stops visually at obstacles but hits still register. This is broken gameplay.

### What to Build

1. **Obstacle collision should block the projectile.** When the arc intersects an obstacle (AABB), the projectile should stop at the obstacle. Any targets beyond the obstacle on that arc path should be unreachable for that shot.

2. **Visual behavior:** When the projectile hits an obstacle, it should splat against it — the animation stops at the obstacle collision point. No need for a complex splat animation, just stop the projectile there.

3. **Arc preview:** The predicted arc (dashed line) should visually stop at the first obstacle intersection. The portion of the arc beyond the obstacle should NOT be drawn. This gives the player clear feedback that the obstacle blocks the path.

4. **Targets before the obstacle are still hittable.** If a target is positioned before (to the left of) the obstacle, and the arc passes through it, the hit should register normally.

5. **Bonus ring before the obstacle is still achievable.** Same logic — if the ring is before the obstacle, it counts.

6. **Multi-shot levels:** Obstacles only block the current shot's arc. Other shots may have different arcs that clear the obstacle.

### Implementation Details

**In collision.js:**
- Add a new function findObstacleIntersection(arcPoints, obstacle) that returns the index of the first arc point that intersects the obstacle, or -1 if no intersection.

**In arc.js:**
- Add a function clipArcAtObstacle(arcPoints, obstacles) that returns a clipped arc — points up to and including the first obstacle intersection point, discarding the rest.

**In GameController.js:**
- Remove the || true guard
- Use the clipped arc for both the preview display and the launch animation
- When the projectile reaches the obstacle intersection point, stop the animation and treat it as a miss (no targets hit)
- The hitObstacle flag should still be computed, but now it should actually block hits on targets beyond the obstacle

**In Renderer.js:**
- _drawPredictedArc should draw only the clipped arc (stops at obstacle)
- Optionally draw a small splat indicator at the obstacle intersection point on the arc preview (e.g., a small red X or burst mark)

### Files to Modify
- src/core/collision.js — add findObstacleIntersection
- src/core/arc.js — add clipArcAtObstacle
- src/game/GameController.js — remove || true, use clipped arc, stop animation at obstacle
- src/renderer/Renderer.js — draw clipped arc preview, optional splat marker

### Constraints
- Do NOT modify any level data files
- Do NOT modify the equation system
- Do NOT change any existing collision logic for targets
- Keep the existing AABB obstacle collision model
- The arc points are in world coordinates (see constants.js for WORLD_W=10, WORLD_H=6, SCALE=70)
- Obstacles have { x, y, width, height } where x,y is bottom-left in world coords
- Test by running npm run dev and playing a level with obstacles (Chapter 1 levels 6-7 have walls)

### Verification
After making changes, verify:
1. Levels WITHOUT obstacles play exactly as before
2. Levels WITH obstacles: arc preview stops at obstacle, projectile stops at obstacle, targets behind obstacles cannot be hit
3. Targets BEFORE obstacles can still be hit
4. Multi-shot levels still work (each shot clips independently)
