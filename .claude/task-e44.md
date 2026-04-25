## Task: E-44 — Reveal Card UI Rendering

### Problem
Reveal cards are defined in level data (`revealAfter`) and tracked in ProgressStore (`reveals` array), but they're never displayed to the player. When a concept is discovered, nothing happens visually. The player should see an animated card pop up explaining the concept they just unlocked.

### What to Build

1. **Reveal card popup** — when a concept is discovered (first time a `revealAfter` value is triggered), show an animated card that:
   - Slides up from the bottom of the screen
   - Displays the concept name, a short explanation, and a visual example
   - Has a "Cool!" dismiss button
   - Auto-dismisses after 5 seconds if the player doesn't interact

2. **Card content per concept:**

| Reveal Key | Name | Explanation | Visual |
|---|---|---|---|
| `leading_coefficient` | Leading Coefficient | The `a` in your equation controls how wide or narrow the arc is. Bigger \|a\| = steeper. | Show 3 arcs with different a values |
| `vertex_form` | Vertex Form | y = a(x-h)² + k — h moves the arc left/right, k moves it up/down. The vertex is at (h, k). | Show arc with vertex highlighted |
| `negative_a_intro` | Flipping the Arc | When `a` is negative, the arc flips upside down. This opens up new paths! | Show positive vs negative a arcs |
| `negative_a` | Negative Coefficient | A negative `a` means the parabola opens downward. The arc drops instead of rises. | Show inverted arc hitting a target |
| `factored_form` | Factored Form | y = a(x-r₁)(x-r₂) — r₁ and r₂ are the roots, where the arc crosses y=0. | Show arc with roots marked |
| `standard_form` | Standard Form | y = ax² + bx + c — b shifts the axis of symmetry, c is the y-intercept. | Show arc with intercept marked |
| `multi_shot_strategy` | Multi-Shot Strategy | Some targets need multiple shots. Plan your arcs to hit different targets each time. | Show 2 arcs hitting 2 targets |
| `cubic_intro` | Beyond Quadratic | Not all curves are parabolas! Cubic functions add twists and turns. | Show cubic curve |

3. **Animation:** The card slides up from below the canvas, pauses, then can be dismissed. Use CSS transition (transform: translateY).

4. **Visual example on each card:** Draw a small inline canvas (200×100) on the card that renders the concept illustration. This is a mini-Renderer that draws arcs, labels, and highlights.

### Implementation Details

**New file: `src/ui/RevealCard.js`**

```js
const REVEALS = {
  leading_coefficient: {
    title: 'Leading Coefficient',
    text: 'The a in your equation controls how wide or narrow the arc is. Bigger |a| = steeper.',
    draw: (ctx, w, h) => { /* draw 3 arcs */ },
  },
  vertex_form: {
    title: 'Vertex Form',
    text: 'y = a(x-h)² + k — h moves the arc left/right, k moves it up/down.',
    draw: (ctx, w, h) => { /* draw arc with vertex */ },
  },
  // ... etc
};

export class RevealCard {
  constructor(container) {
    this.container = container;
    this.card = null;
  }

  show(revealKey) {
    const data = REVEALS[revealKey];
    if (!data) return;
    // Create card DOM with title, text, mini-canvas, dismiss button
    // Animate in from bottom
    // Auto-dismiss after 5s
  }

  hide() {
    // Animate out, remove from DOM
  }
}
```

**In `src/game/GameController.js`:**
- After `session.recordReveal(revealKey)` returns true (first discovery), call `revealCard.show(revealKey)`
- Pause the game while the card is showing (prevent interactions)

**In `src/style.css`:**
- `.reveal-card` — card container, fixed position bottom-center
- `.reveal-card-title` — bold heading
- `.reveal-card-text` — explanation
- `.reveal-card-canvas` — inline mini-canvas
- `.reveal-card-dismiss` — "Cool!" button
- `.reveal-card-enter` / `.reveal-card-exit` — slide up/down animations

### Files to Create/Modify
- `src/ui/RevealCard.js` — NEW: card UI + concept data
- `src/game/GameController.js` — trigger reveal card on first discovery
- `src/style.css` — card styling + animation

### Constraints
- Card only shows on FIRST discovery (already tracked by ProgressStore)
- Game pauses while card is visible
- Must work on mobile (touch dismiss)
- Mini-canvas drawings should be simple — just arcs, labels, highlights
- Do NOT modify level data files
- Do NOT modify ProgressStore or scoring logic

### Verification
1. Reveal card appears when a concept is first discovered
2. Card shows correct title, explanation, and visual for each concept
3. Card auto-dismisses after 5 seconds
4. "Cool!" button dismisses immediately
5. Card doesn't show again for the same concept
6. Game is paused while card is visible
7. All 8 concepts have proper content
