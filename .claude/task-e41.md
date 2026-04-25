## Task: E-41 — Tutorial Overlay

### Problem
First-time players don't know how to play. There's no onboarding. The game needs a tutorial overlay that teaches the basic mechanics: drag the slider, watch the arc change, launch the projectile.

### What to Build

1. **Tutorial overlay system** — a modal-like overlay that appears over the game canvas, with:
   - Semi-transparent dark background (rgba 0,0,0,0.7)
   - A speech bubble / tooltip pointing at the relevant UI element
   - Short instruction text (1-2 sentences)
   - A "Got it" button or tap-to-dismiss

2. **Tutorial steps for Ch1-L1 (First Shot):** These appear sequentially when the player first loads the level:
   - Step 1: "Drag the **a** slider to shape your arc. Bigger |a| = steeper drop." (points at the a slider)
   - Step 2: "Watch the arc change as you drag. Find the arc that hits the pig." (points at the canvas arc)
   - Step 3: "Tap **Launch** to fire! If you miss, adjust and try again." (points at the Launch button)

3. **Tutorial triggers:** The tutorial only shows on the very first play of Ch1-L1. After the player dismisses it (or completes the level), it never shows again. Store `tutorialDone: true` in ProgressStore.

4. **Implementation approach:** Use a simple DOM overlay, not canvas-based. Create a `<div class="tutorial-overlay">` that sits on top of the game area. Position tooltip arrows using CSS.

### Implementation Details

**New file: `src/ui/Tutorial.js`**

```js
export class Tutorial {
  constructor(container, progress) {
    this.container = container;  // the game wrapper div
    this.progress = progress;
    this.currentStep = 0;
    this.overlay = null;
  }

  shouldShow(levelId) {
    // Only show for ch1-l1 and if tutorial hasn't been completed
    return levelId === 'ch1-l1' && !this.progress.tutorialDone;
  }

  show(steps) {
    // Create overlay DOM, position tooltip, add dismiss handler
  }

  next() {
    // Advance to next step, or complete
  }

  complete() {
    this.progress.tutorialDone = true;
    this.hide();
  }

  hide() {
    // Remove overlay from DOM
  }
}
```

**Tutorial step format:**
```js
const TUTORIAL_STEPS = [
  {
    text: 'Drag the a slider to shape your arc. Bigger |a| = steeper drop.',
    target: '.slider-a',  // CSS selector for the element to point at
    position: 'left',     // tooltip appears to the left of the target
  },
  {
    text: 'Watch the arc change as you drag. Find the arc that hits the pig.',
    target: '#game-canvas',
    position: 'top',
  },
  {
    text: 'Tap Launch to fire! If you miss, adjust and try again.',
    target: '.btn-launch',
    position: 'top',
  },
];
```

**In `src/ui/UIController.js`:**
- Import Tutorial
- When loading a level, check `tutorial.shouldShow(levelId)` and if true, show the tutorial after the level UI renders
- Add CSS class `tutorial-highlight` to highlighted elements (subtle glow/outline)

**In `src/save/ProgressStore.js`:**
- Add `tutorialDone: false` to DEFAULTS

**In `src/style.css`:**
- `.tutorial-overlay` — full-screen semi-transparent dark overlay
- `.tutorial-bubble` — white speech bubble with text, positioned near target
- `.tutorial-bubble::after` — arrow pointing at the target
- `.tutorial-highlight` — subtle pulsing glow around highlighted element
- `.tutorial-got-it` — dismiss button

### Files to Create/Modify
- `src/ui/Tutorial.js` — NEW: overlay system
- `src/ui/UIController.js` — wire tutorial trigger
- `src/save/ProgressStore.js` — tutorialDone flag
- `src/style.css` — tutorial styling

### Constraints
- Tutorial only shows on first play of Ch1-L1, never again
- Must not block game interaction when dismissed
- Must work on mobile (touch dismiss)
- Simple DOM overlay, not canvas-based
- Do NOT modify level data files or game logic

### Verification
1. Tutorial appears when first loading Ch1-L1
2. Each step points at the correct UI element
3. "Got it" / tap dismisses and moves to next step
4. After completing tutorial, it never shows again (even on reload)
5. Tutorial does NOT appear on any other level
6. Game works normally after tutorial is dismissed
