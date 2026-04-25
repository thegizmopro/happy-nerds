## Task: E-41 — Nerd Voice Lines (Text Bubbles)

### Problem
No feedback text when the player hits or misses. The game needs character voice lines shown as text bubbles near the launcher character.

### What to Build

1. **Text bubble system** — a floating text bubble that appears near the launcher position on the canvas, displays a voice line for 1.5 seconds, then fades out.

2. **Voice line triggers:**
   - On target hit: random cheer ("NICE!", "Calculated!", "Bullseye!", "That's what I call a solution!", "Textbook!")
   - On 3-star result: extra celebration ("Elegant!", "Now THAT'S math!", "Beautiful solution!", "A+!")
   - On miss: encouraging ("Close!", "Recalculate!", "Almost!", "Try again!", "Adjust and fire!")
   - On obstacle hit (no target): "Blocked!", "Find another path!", "Wrong angle!"

3. **Visual:** 
   - White rounded rectangle with slight shadow
   - Black text, bold, 14px
   - Appears at the launcher's position (top of canvas, left side)
   - Fades in over 200ms, stays for 1300ms, fades out over 500ms
   - If a new bubble appears while one is showing, replace it

### Implementation Details

**In `src/renderer/Renderer.js`:**

Add a `_voiceBubble` state and `_drawVoiceBubble` method:

```js
// State
this._voiceBubble = null; // { text, startTime, duration }

showVoiceBubble(text) {
  this._voiceBubble = { text, startTime: performance.now(), duration: 1500 };
}

_drawVoiceBubble() {
  const b = this._voiceBubble;
  if (!b) return;
  const elapsed = performance.now() - b.startTime;
  if (elapsed > b.duration) { this._voiceBubble = null; return; }
  
  // Compute opacity: fade in 0-200ms, solid 200-1000ms, fade out 1000-1500ms
  let alpha;
  if (elapsed < 200) alpha = elapsed / 200;
  else if (elapsed < 1000) alpha = 1;
  else alpha = 1 - (elapsed - 1000) / 500;
  
  // Position near launcher
  const x = 60, y = 30;
  const ctx = this.ctx;
  ctx.save();
  ctx.globalAlpha = alpha;
  // Draw rounded rect background
  // Draw text
  ctx.restore();
}
```

**In `src/game/GameController.js`:**

After each result:
- Target hit → `this.renderer.showVoiceBubble(randomFrom(HIT_LINES))`
- 3 stars → `this.renderer.showVoiceBubble(randomFrom(STAR_LINES))`
- Miss → `this.renderer.showVoiceBubble(randomFrom(MISS_LINES))`
- Obstacle only → `this.renderer.showVoiceBubble(randomFrom(BLOCK_LINES))`

**Lines arrays (in GameController or a constants file):**

```js
const HIT_LINES  = ['NICE!', 'Calculated!', 'Bullseye!', "That's what I call a solution!", 'Textbook!'];
const STAR_LINES = ['Elegant!', "Now THAT'S math!", 'Beautiful solution!', 'A+!'];
const MISS_LINES = ['Close!', 'Recalculate!', 'Almost!', 'Try again!', 'Adjust and fire!'];
const BLOCK_LINES = ['Blocked!', 'Find another path!', 'Wrong angle!'];
```

### Files to Modify
- `src/renderer/Renderer.js` — voice bubble rendering + state
- `src/game/GameController.js` — trigger voice lines on hit/miss/block/star

### Constraints
- Text only, no voice acting
- Single bubble at a time (new replaces old)
- Must not block game interaction
- Simple fade in/out animation
- Do NOT modify level data files

### Verification
1. Hit a target → cheer text bubble appears near launcher
2. Get 3 stars → celebration text bubble
3. Miss → encouraging text bubble
4. Hit obstacle only → "Blocked!" text bubble
5. Bubbles fade in, stay, and fade out correctly
6. New bubble replaces old one
