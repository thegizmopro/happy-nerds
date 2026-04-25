## Task: E-28 — Premium Chapter Gate

### Problem
All chapters are currently unlocked. The design calls for chapters 1-3 free, chapters 4-7 premium (one-time purchase or subscription).

### What to Build

1. **Premium gate on chapters 4-7.** When a player tries to access a premium chapter, show a modal explaining the premium content with a "Buy" button and a "Maybe Later" dismiss.

2. **Premium modal:**
   - Title: "Unlock Full Curriculum"
   - Body: "Chapters 1-3 teach the basics. Chapters 4-7 unlock advanced math — factored form, standard form, multi-shot strategy, and cubic functions. Support the nerds and level up!"
   - Button: "Unlock — $4.99" (or whatever the price is)
   - Dismiss: "Maybe Later"
   - The buy button doesn't need to actually process payment yet — just call a stub function `purchasePremium()` that sets `isPremium: true` in ProgressStore. The real payment integration comes later.

3. **Premium status check:** `isPremium` stored in ProgressStore, default false. When true, all chapters are accessible.

4. **Chapter select UI:** Premium chapters show a lock icon 🔒 overlay on the chapter card. Clicking a locked chapter opens the premium modal instead of the chapter.

5. **The progression gate (E-15) and premium gate stack:** A chapter is locked if EITHER:
   - Previous chapter isn't complete (progression gate)
   - Chapter is premium AND player isn't premium
   
   The lock reason should differ: "Complete Chapter N first" vs "Premium content — unlock to play"

### Implementation Details

**In `src/save/ProgressStore.js`:**
- Add `isPremium: false` to DEFAULTS
- Add `purchasePremium()` function that sets `isPremium: true` and saves

**In `src/levels/levelLoader.js`:**
- Add `PREMIUM_CHAPTERS = [4, 5, 6, 7]` constant
- Modify `isChapterLocked` to check premium status:
  ```js
  if (PREMIUM_CHAPTERS.includes(chapterNum) && !progress.isPremium) return true;
  ```
- Modify `getLockReason` to return appropriate message

**In `src/ui/UIController.js`:**
- In `_renderChapterSelect`, add 🔒 overlay for premium chapters when not premium
- Add premium modal rendering method `_showPremiumModal()`
- Click handler on locked premium chapters opens the modal
- Modal has "Unlock" button (calls `purchasePremium()` stub) and "Maybe Later" dismiss

**In `src/style.css`:**
- `.premium-lock` — lock icon overlay on chapter card
- `.premium-modal` — centered modal with dark backdrop
- `.premium-modal button.premium-buy` — primary action button
- `.premium-modal button.premium-dismiss` — secondary text button

### Files to Modify
- `src/save/ProgressStore.js` — isPremium flag + purchasePremium()
- `src/levels/levelLoader.js` — premium chapter check
- `src/ui/UIController.js` — premium modal + lock icon
- `src/style.css` — premium modal styling

### Constraints
- No real payment processing — just a stub that sets isPremium: true
- Premium gate stacks with progression gate (E-15)
- Different lock reasons for progression vs premium
- Do NOT modify level data files
- Do NOT modify game logic or rendering

### Verification
1. Chapters 1-3 are always accessible (if progression is met)
2. Chapters 4-7 show 🔒 when player is not premium
3. Clicking locked premium chapter opens the premium modal
4. "Unlock" button sets isPremium: true and closes modal
5. After purchasing, premium chapters are accessible
6. Premium status persists across sessions
7. Progression gate still works (can't skip chapters even if premium)
