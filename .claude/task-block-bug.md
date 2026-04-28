## Bug: Game freezes when ball hits destructible block (Ch1-L4)

### Symptoms
- Game freezes (locks up, needs refresh) when the ball reaches a destructible block
- No hit sound plays
- Glass block doesn't change visually
- Ball is visible, stuck at the block position

### Context
Ch1-L4 has 3 destructible blocks:
- b1: wood pillar at x=4.2, y=0.8
- b2: wood pillar at x=5.5, y=0.8  
- b3: glass shelf at x=4.2, y=1.3, width=1.8, height=0.3

The arc passes through destructible blocks (clipArcAtObstacle skips them).
Block damage is applied frame-by-frame in `_animateLaunch`.

### Likely Causes
1. The frame-by-frame block collision in `_animateLaunch` might throw an error (e.g., accessing `session.obstacleHP` before it's initialized for some obstacle)
2. The `_animateFalling` callback chain might loop infinitely
3. The `_onLaunchComplete` might be called in a bad state
4. The block collision detection might match on every single frame (not just first entry), causing repeated damage calls that fail

### What to Fix
1. Read GameController.js and trace the exact flow when a ball hits a destructible block
2. Make sure obstacleHP is properly initialized for ALL obstacles with blockType
3. Make sure block hit detection only fires once per block per shot (track which blocks were hit)
4. Add error handling so a bug doesn't freeze the game
5. Make sure glass blocks (1HP) are destroyed on first hit and visually disappear
6. Make sure the ball animation continues past the destroyed block
7. Make sure falling blocks animate properly and cascade works
8. Play the hit sound when a block is damaged

### Files to Check
- `src/game/GameController.js` — `_animateLaunch`, `_animateFalling`, `_onLaunchComplete`
- `src/game/LevelSession.js` — `hitObstacle`, `isObstacleAlive`, `startFalling`, `updateFalling`, `getFallingSupports`
- `src/core/arc.js` — `clipArcAtObstacle`
- `src/renderer/Renderer.js` — `_drawObstacles`, `_drawBlock`
- `src/levels/chapters/chapter1.js` — Ch1-L4 level config

### Constraints
- Do NOT modify the arc equation system, bounce mechanic, or target collision
- Do NOT remove or change non-destructible wall behavior
- Do NOT change level data for levels without blockType
