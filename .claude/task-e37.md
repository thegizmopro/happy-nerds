## Task: E-37 — Coefficient Locking

### Problem
The level schema already has `lockedCoefficients` and some levels define it, but locked sliders are still fully draggable. There's no visual or functional lock.

### What to Build

1. **Locked sliders are non-draggable.** When a coefficient is in the level's `lockedCoefficients` object, its slider should be disabled — no drag, no value change.

2. **Locked sliders are visually distinct.** Grayed out, reduced opacity, with a 🔒 icon or "locked" indicator next to the label.

3. **Locked values are displayed but not changeable.** The coefficient value still shows in the equation display and on the slider, it just can't be changed.

### Implementation Details

**In `src/ui/UIController.js`:**
- When rendering sliders, check if the coefficient is in the level's `lockedCoefficients`
- If locked: set the slider's `disabled` attribute, add a CSS class `slider-locked`, show 🔒 next to the label
- The `onCoeffChange` callback should also guard against changes to locked coefficients (defense in depth)

**In `src/style.css`:**
- Add `.slider-locked` styles: reduced opacity (0.5), grayed-out colors, pointer-events: none on the slider track

### Files to Modify
- `src/ui/UIController.js` — disable locked sliders, add lock indicator
- `src/style.css` — `.slider-locked` styles

### Constraints
- Do NOT modify any level data files
- Do NOT modify the equation system or GameController
- The lockedCoefficients format is already defined in level data: `{ "h": 0, "k": 0 }` means h and k are locked at 0
- Some levels also have `activeCoefficients` which already hides non-active coefficients — locking is different (visible but not changeable)

### Verification
After making changes:
1. Levels with `lockedCoefficients` (check chapter data) show locked sliders that can't be dragged
2. Levels without locked coefficients are unchanged
3. Locked coefficient values still appear in the equation display
