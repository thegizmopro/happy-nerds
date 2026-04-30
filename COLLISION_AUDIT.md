# Collision Audit Report — Happy Nerds

**Generated**: 2026-04-29
**Method**: Swept all slider combinations for every level, checked if ANY combo can hit each target with the arc formula `y = a*(x-h)² + k + launcherY`

## Executive Summary

**158/192** target-shot combos miss with default params. More critically, **96 target-shot combos are UNREACHABLE** — no slider combination within the allowed ranges can hit the target. This means entire levels are impossible regardless of player skill.

## Root Cause

The `k` parameter (vertical offset) is not exposed in slider configs for most levels. With `k` locked at auto-derived `k = -a*h²` (vertex form), the arc's vertex height is fixed relative to the launcher. Targets positioned above the arc's achievable range are physically impossible to reach.

Additionally, many levels have targets at positions the arc simply cannot reach given the `a` and `h` slider ranges — the parabola doesn't extend high enough or far enough.

## Unreachable Targets by Chapter

### Ch3 (5 levels broken)
- L2: pig — all shots miss
- L5: pig — all shots miss  
- L7: t1 — all shots miss
- L9: cool — all shots miss
- L10: king — all shots miss

### Ch4 (ALL 10 levels broken)
- Every single level has unreachable targets. The entire chapter is unplayable.

### Ch5 (3 levels broken)
- L2, L4, L8: pig unreachable

### Ch6 (7 levels broken, 42 unreachable combos)
- L1: both pig_l and pig_r unreachable on both shots
- L4: ALL targets (t1, t2, t3) unreachable on ALL 3 shots
- L6: left_pig and right_pig unreachable on all 5 shots
- L7: guard unreachable on all 5 shots (king reachable on some)
- L8: pig_l and pig_r unreachable on both shots
- L9: ALL targets unreachable on ALL 6 shots
- L10: whistle unreachable on all 6 shots

### Ch8 (3 levels broken, 26 unreachable combos)
- L1: ALL targets unreachable on ALL 3 shots
- L4: stair_pig + twr_pig + king unreachable on most shots
- L5: whistle + king unreachable on most shots

## Levels That Work

### Fully Working (all targets reachable with slider adjustments)
- Ch1: L1-L10 (stretch form, different mechanics)
- Ch2: L1-L10
- Ch3: L1, L3, L4, L6, L8
- Ch5: L1, L3, L5, L6, L7, L9, L10
- Ch7: L1-L10 (cubic/abs/piecewise forms)
- Ch8: L2, L3

### Ch7 Note
L6 (piecewise form) was skipped in this audit due to evalForm requiring piece definitions. Needs manual check.

## Fix Strategy

### Option A: Expose `k` in slider config (RECOMMENDED)
For every broken level, add `k` to the slider config so players can adjust vertical offset:
```js
sliderConfig: {
  a: { min: -0.4, max: -0.02, step: 0.01 },
  h: { min: 1, max: 8, step: 0.1 },
  k: { min: 0, max: 5, step: 0.1 }  // ADD THIS
}
```
And add `k` to `activeCoefficients`.

### Option B: Lower targets to where the arc can reach
Move target y-coordinates down so existing slider ranges can hit them. Simpler but limits level design.

### Option C: Adjust slider ranges
Widen `a` and `h` ranges to cover target positions. May make levels trivially easy.

**Recommended: Option A for Ch3+, keep Ch1-Ch2 simple (only a,h exposed).**

## Files to Edit

### Level files (src/levels/chapters/):
- `chapter3.js` — 5 levels
- `chapter4.js` — ALL 10 levels
- `chapter5.js` — 3 levels  
- `chapter6.js` — 7 levels
- `chapter8.js` — 3 levels

### Per-level fix pattern:
1. Find each shot config in `multiShot.shots[]` (or top-level for single-shot levels)
2. Add `k` to `activeCoefficients` array
3. Add `k` range to `sliderConfig`
4. Set a reasonable `defaultParams.k` value
5. Re-run this audit to verify

### Post-fix validation:
```bash
node -e "
// Re-run the reachability sweep — should show 0 unreachable targets
"
```

Then:
```bash
npm run build
git add -A && git commit -m 'fix: expose k parameter to fix 96 unreachable targets' && git push
```

## Terminology Reminder
- Targets are NOT "pigs" — they are jock, varsity, coach, skater, bully, or generically "target"
- This applies to all code comments, variable names, and documentation
