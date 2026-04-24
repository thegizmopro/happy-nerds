## Task: E-21 — Wire Reveal Cards to Chapters 2-5

### Problem
6 reveal cards are authored in `src/levels/revealContent.js`, but most levels have `revealAfter: null`. The educational reveal system only triggers on Chapter 1 Level 3. The other 5 cards are never shown.

### What to Build

Assign `revealAfter` to the designated levels in chapter data files. The mapping is:

1. Ch1-L3 → `leading_coefficulty` ✅ (already wired — verify, don't change)
2. Ch2-L3 → `vertex_form`
3. Ch3-L2 → `negative_a_intro`
4. Ch3-L5 → `negative_a`
5. Ch4-L2 → `factored_form`
6. Ch5-L1 → `standard_form`

Also add reveal cards for Ch6-7 concepts:
7. Add a new reveal card `multi_shot_strategy` in revealContent.js with content about using multiple projectiles strategically
8. Add a new reveal card `cubic_intro` in revealContent.js about cubic functions and S-curves
9. Ch6-L1 → `multi_shot_strategy`
10. Ch7-L1 → `cubic_intro`

### Implementation Details

**In chapter2.js through chapter5.js:**
- Find the level object for the designated level (e.g., chapter 2, level index 2 which is the 3rd level)
- Set `revealAfter: "vertex_form"` (or whichever card ID)
- The existing reveal system in GameController already handles showing the card and marking it seen — no changes needed there

**In revealContent.js:**
- Add two new reveal card objects following the existing format:
  ```
  multi_shot_strategy: {
    concept: "multi_shot_strategy",
    title: "Multi-Shot Strategy",
    body: "Sometimes one equation isn't enough. In multi-shot levels, you launch multiple projectiles — each with its own equation. Use your first shot to clear the path, and your second to hit the target. Think of it as solving a system: each equation does a different job.",
    vocabulary: ["system of equations", "multi-shot", "strategic launch"]
  },
  cubic_intro: {
    concept: "cubic_intro",
    title: "Beyond Parabolas: Cubic Functions",
    body: "Not every path is a parabola. Cubic functions like y = a(x-h)³ + k create S-shaped curves that can loop around obstacles. The cube (³) means the curve can change direction — going up, then leveling, then going up again. This opens up entirely new paths that parabolas can't reach.",
    vocabulary: ["cubic function", "inflection point", "S-curve", "degree"]
  }
  ```

**In chapter6.js and chapter7.js:**
- Ch6-L1 (first level in chapter 6): set `revealAfter: "multi_shot_strategy"`
- Ch7-L1 (first level in chapter 7): set `revealAfter: "cubic_intro"`

### Files to Modify
- `src/levels/chapters/chapter2.js` — add revealAfter to level at index 2
- `src/levels/chapters/chapter3.js` — add revealAfter to levels at index 1 and 4
- `src/levels/chapters/chapter4.js` — add revealAfter to level at index 1
- `src/levels/chapters/chapter5.js` — add revealAfter to level at index 0
- `src/levels/chapters/chapter6.js` — add revealAfter to level at index 0
- `src/levels/chapters/chapter7.js` — add revealAfter to level at index 0
- `src/levels/revealContent.js` — add multi_shot_strategy and cubic_intro cards

### Constraints
- Do NOT modify GameController.js, Renderer.js, or any engine code
- Do NOT modify chapter1.js (already working)
- Do NOT modify chapter8.js (boss levels don't need reveals)
- Do NOT change any level gameplay data (targets, obstacles, coefficients) — only add revealAfter
- Make sure the reveal card IDs match exactly between the level data and revealContent.js
- Level indices are 0-based in the chapter arrays

### Verification
After making changes, verify:
1. Ch1-L3 still shows the leading_coefficient reveal (unchanged)
2. Ch2-L3, Ch3-L2, Ch3-L5, Ch4-L2, Ch5-L1 now show their respective reveals
3. Ch6-L1 and Ch7-L1 show the new reveals
4. Reveal cards never repeat (if you replay a level, the reveal doesn't show again)
5. No reveals trigger on levels that shouldn't have them
