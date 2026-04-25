## Task: E-22 — Bounce Mechanic

### Problem
When the projectile hits an obstacle, it simply stops. The design doc specifies that the projectile should **bounce** off obstacles, adding trajectory complexity and making obstacles a strategic tool rather than just a barrier.

### What to Build

1. **On obstacle collision, the projectile bounces** instead of stopping. The bounce reflects the arc's direction at the point of impact.

2. **Bounce physics:** The projectile has a velocity vector at the point of collision. Reflect the velocity vector across the obstacle's surface normal:
   - For horizontal surfaces (platforms): reflect the Y component, keep X → projectile bounces upward/downward
   - For vertical surfaces (walls): reflect the X component, keep Y → projectile bounces left/right
   - Apply a **damping factor** of 0.7 to the reflected velocity (realistic energy loss)
   - After bounce, continue the trajectory as a new arc segment using the new velocity

3. **Post-bounce trajectory:** After bouncing, the projectile follows a parabolic arc starting from the bounce point with the new velocity. This creates a new arc segment that the renderer must draw. Gravity still applies (the projectile is still in a parabolic path, just with new initial conditions).

4. **Maximum 3 bounces** per shot. After the 3rd bounce, the projectile stops dead (prevents infinite bouncing between walls).

5. **Bounce target check:** After each bounce, the new trajectory segment should still be checked for target hits. The projectile can hit a target after bouncing — that's the whole point!

6. **Bounce obstacle check:** Each new trajectory segment is also checked for obstacle collisions, enabling multi-bounce shots.

7. **Visual feedback:** On bounce, render a small "spark" effect at the bounce point (a brief flash — just a circle that appears for 2 frames). The arc changes color slightly after each bounce (progressively more orange/red) to show the energy loss.

### Implementation Details

**The key insight:** The projectile follows a parabolic arc described by the equation y = a(x-h)² + k. At any point on this arc, we can compute the velocity vector (dx, dy). After a bounce, we compute new (a, h, k) from the bounce point and reflected velocity.

**Velocity from parabola:**
Given y = a(x-h)² + k, at any point x:
- dy/dx = 2a(x-h) (the slope of the tangent)
- If the projectile moves in the +x direction, velocity direction = (1, 2a(x-h)) normalized

**After bounce off a horizontal surface:**
- Reflect the Y component: new slope = -2a(x-h)
- At bounce point (xb, yb), the new parabola passes through (xb, yb) with slope = -2a(xb-h)
- New parabola: y = a'(x - hb)² + kb where:
  - hb = xb + (reflected_slope) / (2 * a') ... actually this is getting complex
  
**Simpler approach using physics:**
Instead of deriving new (a,h,k) for the bounced arc, use a **physics-based trajectory**:
- At the point of collision, compute velocity (vx, vy)
- Apply bounce reflection: 
  - Horizontal surface: vy = -vy * 0.7
  - Vertical surface: vx = -vx * 0.7
- Continue as a projectile with position (x, y), velocity (vx, vy), and gravity
- Gravity: ay = constant (derive from the original parabola — since y = a(x-h)² + k, the second derivative d²y/dx² = 2a. But we need acceleration in terms of time, not x-position)

**Even simpler: compute everything frame-by-frame after bounce**

After the first collision:
1. Compute the projectile's position and velocity at the collision frame
2. Store: `(x, y, vx, vy)` at the bounce point
3. Apply bounce reflection to velocity
4. Continue the animation frame-by-frame using Euler integration:
   - x += vx * dt
   - y += vy * dt
   - vy += gravity * dt (gravity = 2a * vx² in world coordinates — derive from original parabola)
5. Check target collisions each frame
6. Check obstacle collisions each frame
7. Render as a series of points

**Deriving gravity from the parabola:**
Given y = a(x-h)² + k with x increasing at constant rate vx per frame:
- dy/dx = 2a(x-h)
- dy/dt = 2a(x-h) * dx/dt = 2a(x-h) * vx
- d²y/dt² = 2a * vx² (since d(x-h)/dt = vx)
So gravity in time units = 2a * vx²

**Velocity at collision:**
- vx = world units per frame (constant, = (WORLD_W - launcher.x) / total_frames)
- vy = 2a(x-h) * vx at the collision point

**In `src/game/GameController.js`:**

Modify `_animateLaunch` to handle bounce state:

```js
// Add to session state:
session.bounceCount = 0;
session.bouncePoints = []; // for rendering arc segments
session.postBounceState = null; // { x, y, vx, vy, gravity }

// In the animation loop, after obstacle collision:
if (hitObstacle && session.bounceCount < 3) {
  session.bounceCount++;
  
  // Compute velocity at collision point
  const pt = session.arcPoints[session.flyFrame];
  const vx = /* constant horizontal velocity */;
  const vy = 2 * params.a * (pt.x - params.h - launcher.x) * vx;
  
  // Determine surface normal from obstacle
  const obs = hitObstacle;
  let newVx = vx, newVy = vy;
  if (/* horizontal surface */) newVy = -newVy * 0.7;
  if (/* vertical surface */) newVx = -newVx * 0.7;
  
  // Store bounce state
  session.postBounceState = {
    x: pt.x, y: pt.y,
    vx: newVx, vy: newVy,
    gravity: 2 * params.a * vx * vx
  };
  session.bouncePoints.push({ x: pt.x, y: pt.y });
  
  // Continue animation from bounce state
}

// In subsequent frames, if postBounceState exists:
const bs = session.postBounceState;
bs.vy += bs.gravity;
bs.x += bs.vx;
bs.y += bs.vy;
// Check target/obstacle collisions at (bs.x, bs.y)
```

**In `src/renderer/Renderer.js`:**

- After each bounce point, draw the arc segment in a progressively warmer color
- Original arc: `#fb923c` (orange)
- After bounce 1: `#f97316` 
- After bounce 2: `#ef4444` (red)
- After bounce 3: `#dc2626` (dark red)
- Draw a small white circle (spark) at each bounce point for 2 frames

**Surface detection:**
To determine if the projectile hit a horizontal or vertical surface:
- Check which face of the obstacle the projectile approached from
- If the projectile entered from the top or bottom (previous y was above/below obstacle bounds): horizontal surface → reflect vy
- If the projectile entered from the left or right (previous x was left/right of obstacle bounds): vertical surface → reflect vx
- Corner hits (both edges): reflect both vx and vy

### Files to Modify
- `src/game/GameController.js` — bounce logic in _animateLaunch
- `src/game/LevelSession.js` — bounce state tracking
- `src/renderer/Renderer.js` — bounce arc segments + spark effect
- `src/core/collision.js` — surface normal detection

### Constraints
- Max 3 bounces per shot
- Damping factor 0.7 on each bounce
- Bounced trajectory can still hit targets (that's the feature!)
- Do NOT modify level data files
- The original pre-bounce arc rendering should still work for levels without obstacles
- Performance: don't recompute the entire arc on bounce — just switch to frame-by-frame for post-bounce

### Verification
After making changes, verify:
1. Projectile bounces off walls (vertical surfaces) — horizontal reflection
2. Projectile bounces off platforms (horizontal surfaces) — vertical reflection
3. Post-bounce trajectory can hit targets
4. Maximum 3 bounces, then stops
5. Bounce arc segments render in progressively warmer colors
6. Spark effect appears at bounce point
7. Levels without obstacles are unaffected
8. The pre-bounce parabolic arc still renders correctly
