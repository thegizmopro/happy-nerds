## Task: E-33 — Multi-HP Targets

### Problem
All pigs are hp: 1. The design has letterman (2 HP) and king (3 HP) pigs. Multi-HP infrastructure exists in the code but is disabled — every pig dies in one hit.

### What to Build

1. **Re-enable multi-HP for letterman and king pigs.** Check level data — letterman should have `hp: 2` and king should have `hp: 3`. Currently they're all `hp: 1`.

2. **HP decrement on hit.** When the projectile hits a target, decrement its HP by 1. Only mark it as "dead" when HP reaches 0.

3. **Visual feedback per hit:**
   - On hit (not killed): pig flashes white for 200ms, then returns to normal color
   - On kill (HP reaches 0): pig shows X-eyes and fades out over 500ms
   - Show HP remaining as small dots/circles above the pig (1-3 dots)

4. **Multi-shot levels:** The same target can be hit across multiple shots. HP persists between shots.

5. **Single-shot arc pass-through:** If the arc passes through the same target twice (going up through it, then coming down through it on a bounce), each pass counts as a separate hit. The projectile should NOT be destroyed on first hit with a multi-HP target — it continues through.

### Implementation Details

**In level data files (chapter1-8.js):**
- Find all targets with `pigType: 'letterman'` and set `hp: 2`
- Find all targets with `pigType: 'king'` and set `hp: 3`
- Helmet, cool, and whistle pigs stay at `hp: 1`

**In `src/game/GameController.js`:**
- In the collision detection frame, when a target is hit:
  - Decrement `session.targetHP[t.id]` by 1
  - If HP > 0: flash the pig (mark as `hitFlash`), play hit sound, but do NOT remove the target and do NOT stop the projectile
  - If HP reaches 0: mark target as killed (existing logic), play hit sound, stop projectile or let it continue (depending on whether other targets exist)

**In `src/renderer/Renderer.js`:**
- `_drawTargets`: 
  - Draw HP dots above the pig (1-3 small filled circles)
  - If target has `hitFlash` property and it was set recently (< 200ms ago), draw the pig in white
  - On kill (HP 0): draw X-eyes and reduce opacity over 500ms

**In `src/game/LevelSession.js`:**
- The `targetHP` map already exists. Verify that `recordHit` only removes from `targetsHit` when HP reaches 0.

### Files to Modify
- `src/levels/chapters/chapter1.js` through `chapter8.js` — set correct HP values
- `src/game/GameController.js` — HP decrement + projectile continuation
- `src/renderer/Renderer.js` — HP dots, hit flash, kill animation
- `src/game/LevelSession.js` — verify recordHit respects HP

### Constraints
- Only letterman (2 HP) and king (3 HP) get multi-HP
- All other pig types remain 1 HP
- HP persists between shots in multi-shot levels
- Projectile continues through multi-HP targets (doesn't stop on first hit)
- Do NOT modify the collision system itself

### Verification
1. Letterman pig takes 2 hits to kill
2. King pig takes 3 hits to kill
3. HP dots appear above multi-HP pigs
4. Pig flashes white on non-lethal hit
5. Pig shows X-eyes and fades on kill
6. Projectile continues through multi-HP targets after first hit
7. Helmet/cool/whistle pigs still die in 1 hit
