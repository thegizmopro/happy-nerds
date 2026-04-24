## Task: E-15 — Chapter Progression Gate

### Problem
All chapters are immediately accessible — there's no unlock flow. Players can jump to any chapter without completing prior ones. The design intends each chapter to unlock when the prior chapter is completed (at least 1 star on every level).

### What to Build

1. **Chapter N unlocks when all levels in Chapter N-1 have at least 1 star.** Chapter 1 is always unlocked.

2. **Chapters 1-3 are free** (always accessible once unlocked by progression).

3. **Chapters 4-8 require both** progression unlock AND premium status. The premium check already exists (`isChapterLocked` in `levelLoader.js`). Just make sure progression works alongside it — a chapter is locked if EITHER the progression gate fails OR the premium gate fails.

4. **Visual lock on level select.** Locked chapters should show a lock icon or visual indicator. The UIController's level select screen should display locked chapters differently (grayed out, lock icon, "Complete Chapter N to unlock" text).

5. **Tapping a locked chapter** should show a brief message explaining why it's locked — either "Complete Chapter N to unlock" or "Premium content — unlock to play" (for chapters 4+).

### Implementation Details

**In `src/save/ProgressStore.js`:**
- Add a function `isChapterProgressionUnlocked(chapterNum, progress)` that returns true if:
  - chapterNum === 1 (always unlocked), OR
  - All levels in chapter (chapterNum - 1) have at least 1 star in `progress.stars`
- This is separate from the premium check

**In `src/levels/levelLoader.js`:**
- Modify `isChapterLocked(chapter, progress)` to check BOTH progression unlock AND premium unlock
- Currently it only checks premium. Add the progression check.
- Import or use the new function from ProgressStore

**In `src/ui/UIController.js`:**
- In the level select screen, visually distinguish locked chapters:
  - Locked chapters: grayed out, show a 🔒 icon
  - Add subtitle text: "Complete Chapter N" or "Premium Content"
- Clicking a locked chapter should show a brief toast/message instead of loading the level

### Files to Modify
- `src/save/ProgressStore.js` — add `isChapterProgressionUnlocked`
- `src/levels/levelLoader.js` — modify `isChapterLocked` to include progression check
- `src/ui/UIController.js` — visual lock state in level select, click handler for locked chapters

### Constraints
- Do NOT modify any level data files
- Do NOT modify GameController.js (the existing paywall check in loadLevel already calls isChapterLocked)
- Do NOT modify the premium system (PREMIUM_CHAPTER_START = 4 stays)
- Keep the existing ProgressStore save/load format (don't break existing saves)
- Chapter level counts are available from the chapter data (each chapter has N levels)

### Verification
After making changes, verify:
1. Chapter 1 is always accessible
2. Chapter 2 is locked until all Ch1 levels have at least 1 star
3. Chapter 3 is locked until all Ch2 levels have at least 1 star
4. Chapters 4-8 are locked by BOTH progression AND premium
5. Level select shows locked chapters with visual indicator
6. Existing saves still work (no format changes)
