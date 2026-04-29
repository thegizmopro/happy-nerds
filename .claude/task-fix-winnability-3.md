# Task: Fix Winnability — Ch6-L9 + Ch7 (L3, L5, L6, L7, L8, L9, L10) + Ch8 (L2, L4, L5)

## Problem
These levels have more target HP than shots.

## Current State (unwinnable)
- ch6-l9: 5 shots, 6 total HP → needs 6 shots
- ch7-l3: 1 shot, 3 total HP → needs 3 shots
- ch7-l5: 1 shot, 2 total HP → needs 2 shots
- ch7-l6: 1 shot, 2 total HP → needs 2 shots
- ch7-l7: 1 shot, 3 total HP → needs 3 shots
- ch7-l8: 1 shot, 3 total HP → needs 3 shots
- ch7-l9: 1 shot, 3 total HP → needs 3 shots
- ch7-l10: 1 shot, 3 total HP → needs 3 shots
- ch8-l2: 1 shot, 3 total HP → needs 3 shots
- ch8-l4: 3 shots, 6 total HP → needs 6 shots
- ch8-l5: 5 shots, 6 total HP → needs 6 shots

## Fix Options
- Ch6: just add 1 more shot to L9
- Ch7: this is the hardest chapter. ALL levels need multi-shot. Make sure structures justify multiple shots — different targets behind different block setups.
- Ch8: boss chapter with timers. L4 and L5 need more shots or fewer HP targets. L2 needs multi-shot.

## Rules
- Keep block structures and target positions where possible
- For Ch7: if adding multi-shot, make each shot target a different part of the structure (use targetIds)
- Ch8 already has timer objects — keep those
- Don't change equationForm or activeCoefficients

## Files to Edit
- `src/levels/chapters/chapter6.js` — fix L9
- `src/levels/chapters/chapter7.js` — fix L3, L5, L6, L7, L8, L9, L10
- `src/levels/chapters/chapter8.js` — fix L2, L4, L5

## Verification
Run validator and winnability check for ch6+ch7+ch8.
