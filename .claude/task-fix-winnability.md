# Task: Fix Winnability — Ch2-L2, L5, L8 + Ch3-L5, L7, L8, L10

## Problem
These levels have more target HP than shots. Each shot can only deal 1 HP of damage. A level is winnable only when `shotCount >= sum of all target HP`.

## Current State (unwinnable)
- ch2-l2: 1 shot, 2 total HP → needs 2 shots
- ch2-l5: 1 shot, 2 total HP → needs 2 shots
- ch2-l8: 1 shot, 2 total HP → needs 2 shots (ALSO: arc doesn't reach target — see bonus fix below)
- ch3-l5: 1 shot, 2 total HP → needs 2 shots
- ch3-l7: 1 shot, 2 total HP → needs 2 shots
- ch3-l8: 1 shot, 2 total HP → needs 2 shots
- ch3-l10: 1 shot, 3 total HP → needs 3 shots

## Fix Options (pick the best per level)
1. **Add shots**: change single-shot to multiShot with enough shots to cover HP
2. **Reduce target HP**: if a target has hp:2, consider if hp:1 makes sense for that chapter's difficulty
3. **For Ch2/Ch3** (early chapters, still teaching): prefer reducing HP over adding multi-shot complexity

## Rules
- Keep existing block structures and target positions unchanged
- Don't change equationForm or activeCoefficients
- For multi-shot levels, each shot in `multiShot.shots` needs `equationForm` and `targetIds` (null = all targets)
- Ch2-L8 BONUS: also check that the default arc parameters allow the ball to reach the target area. If the arc falls short, adjust `defaultParams` so the preview arc at least reaches near the target.

## Files to Edit
- `src/levels/chapters/chapter2.js` — fix L2, L5, L8
- `src/levels/chapters/chapter3.js` — fix L5, L7, L8, L10

## Verification
After editing, run: `node scripts/validate-levels.mjs`
Then verify winnability:
```js
node --input-type=module -e "
for (let i = 2; i <= 3; i++) {
  const mod = await import('./src/levels/chapters/chapter' + i + '.js');
  const ch = mod['CHAPTER_' + i];
  for (const l of ch) {
    const totalHP = l.targets.reduce((s,t) => s + t.hp, 0);
    const shots = l.multiShot?.shots?.length ?? 1;
    if (shots < totalHP) console.log('STILL UNWINNABLE:', l.id);
  }
}
"
```
