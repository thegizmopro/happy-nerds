# Task: Fix Winnability — Ch4-L6, L7, L8 + Ch5-L1, L3, L5, L9, L10

## Problem
These levels have more target HP than shots. Each shot can only deal 1 HP of damage.

## Current State (unwinnable)
- ch4-l6: 1 shot, 2 total HP → needs 2 shots
- ch4-l7: 1 shot, 2 total HP → needs 2 shots
- ch4-l8: 1 shot, 3 total HP → needs 3 shots
- ch5-l1: 1 shot, 2 total HP → needs 2 shots
- ch5-l3: 1 shot, 2 total HP → needs 2 shots
- ch5-l5: 1 shot, 3 total HP → needs 3 shots
- ch5-l9: 1 shot, 2 total HP → needs 2 shots
- ch5-l10: 1 shot, 3 total HP → needs 3 shots

## Fix Options
1. Add multi-shot (preferred for Ch4/Ch5 — player has seen multi-shot in earlier chapters)
2. Reduce target HP if a 2HP/3HP target feels too hard for the level's difficulty

## Rules
- Keep existing block structures and target positions unchanged
- Don't change equationForm or activeCoefficients
- For multi-shot levels, each shot needs `equationForm` and `targetIds`

## Files to Edit
- `src/levels/chapters/chapter4.js` — fix L6, L7, L8
- `src/levels/chapters/chapter5.js` — fix L1, L3, L5, L9, L10

## Verification
Same as task-fix-winnability.md — run validator and winnability check for ch4+ch5.
