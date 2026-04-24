## Task: E-16 — Star Criteria & Bonus Rings

### Problem
Star ratings are based on move count only, and almost no levels have bonus rings. The design doc specifies: 1 star = hit target, 2 stars = hit with elegance (few coefficient changes), 3 stars = hit AND pass through bonus ring. Most levels have `bonusRing: null`, so 3 stars is impossible on almost every level.

### What to Build

1. **Add bonus rings to chapters 1-5.** At least 3 bonus rings per chapter (15 total). Place them at interesting arc positions — near the vertex, at a root, between obstacles. Each ring should require the player to find a specific arc shape that both hits the target AND passes through the ring.

2. **Verify star criteria logic.** The scoring system in `scoring.js` should already handle the 3-tier system. Verify it works:
   - 1 star: hit target (any way)
   - 2 stars: hit target + ≤ N coefficient moves (from `starThresholds`)
   - 3 stars: hit target + bonus ring achieved

3. **Star display in level select.** Verify the level select screen shows 1-3 stars correctly per level.

### Bonus Ring Design Guidelines

When authoring bonus rings, follow these principles:

- **Position:** Place rings at points the arc would naturally pass through if the player found an "elegant" solution — near the vertex, at the peak, or at a meaningful mathematical point
- **Radius:** 0.25-0.35 world units (small enough to require precision, large enough to be achievable)
- **Accessibility:** The ring should be reachable with the available coefficients but require a more specific arc than just hitting the target. If the target can be hit with a wide range of `a` values, the ring should require a specific `a` value.
- **Never behind an obstacle** — the arc must be able to reach the ring
- **Don't make rings trivial** — if the ring is on the direct path to the target, it's not a bonus

### Implementation Details

**In chapter1.js through chapter5.js:**

Add `bonusRing: { x, y, radius: 0.3 }` to at least 3 levels per chapter. Choose levels that have open space for an interesting ring placement.

Here are suggested positions (adjust if they conflict with obstacles in the actual level data):

**Chapter 1 (Stretch form, y = ax²):**
- Ch1-L2: Ring near the peak of the arc, e.g. { x: 4.5, y: 3.0, radius: 0.3 } — requires a specific `a` to peak through it
- Ch1-L5: Ring above the shelf target, e.g. { x: 6.0, y: 3.5, radius: 0.3 } — requires the arc to peak high enough
- Ch1-L8: Ring between the two walls, e.g. { x: 4.5, y: 2.5, radius: 0.3 } — threading the arc through

**Chapter 2 (Vertex form, y = a(x-h)² + k):**
- Ch2-L2: Ring at a position requiring precise h, e.g. { x: 5.0, y: 3.5, radius: 0.3 }
- Ch2-L5: Ring requiring precise k, e.g. { x: 6.5, y: 4.0, radius: 0.3 }
- Ch2-L8: Ring behind the wall peak, e.g. { x: 5.5, y: 4.5, radius: 0.3 }

**Chapter 3 (Sign & Shape):**
- Ch3-L3: Ring requiring a specific arc width, e.g. { x: 5.0, y: 2.5, radius: 0.3 }
- Ch3-L6: Ring at the trench entrance, e.g. { x: 5.0, y: 1.5, radius: 0.3 }
- Ch3-L9: Ring in the gauntlet, e.g. { x: 5.5, y: 3.0, radius: 0.3 }

**Chapter 4 (Roots / Factored form):**
- Ch4-L3: Ring at a position between the roots, e.g. { x: 4.0, y: 3.0, radius: 0.3 }
- Ch4-L6: Ring at the bounce point, e.g. { x: 3.5, y: 0.8, radius: 0.3 }
- Ch4-L9: Ring requiring both roots set precisely, e.g. { x: 5.0, y: 2.0, radius: 0.3 }

**Chapter 5 (Standard form):**
- Ch5-L3: Ring requiring specific b value, e.g. { x: 5.0, y: 3.5, radius: 0.3 }
- Ch5-L6: Ring at a checkpoint position, e.g. { x: 4.0, y: 2.5, radius: 0.3 }
- Ch5-L9: Ring for the constrained shot, e.g. { x: 6.0, y: 3.0, radius: 0.3 }

**IMPORTANT:** Before adding a ring to a level, read the level's actual data (targets, obstacles, launcher position) to make sure the ring position:
1. Doesn't overlap with any obstacle
2. Is reachable from the launcher with available coefficients
3. Isn't on the trivial path to the target
4. Is in a position where the arc would pass if the player found a precise solution

**Also:** Change `starMode` from `'moves'` to `'bonus'` for levels that now have bonus rings, so 3-star requires the ring. Levels without rings keep `'moves'` mode where 3-star is based on fewer moves.

### Files to Modify
- `src/levels/chapters/chapter1.js` — add 3 bonus rings
- `src/levels/chapters/chapter2.js` — add 3 bonus rings
- `src/levels/chapters/chapter3.js` — add 3 bonus rings
- `src/levels/chapters/chapter4.js` — add 3 bonus rings
- `src/levels/chapters/chapter5.js` — add 3 bonus rings

### Constraints
- Do NOT modify any engine code (scoring.js, GameController.js, Renderer.js)
- Do NOT modify chapter6-8 level data
- Do NOT change any existing level gameplay (targets, obstacles, coefficients)
- Only add/modify `bonusRing` and `starMode` fields
- Existing levels that already have bonus rings (ch2-l6, ch2-l9) should be left as-is if the ring is good, or improved if the ring is poorly placed

### Verification
After making changes, verify:
1. 15 new bonus rings across chapters 1-5 (3 per chapter)
2. No rings overlap with obstacles
3. Levels with rings have `starMode: 'bonus'`
4. Levels without rings keep their existing starMode
5. The bonus ring renders correctly on these levels
