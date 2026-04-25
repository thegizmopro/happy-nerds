## Task: E-42 — Character Art (Canvas-Drawn Nerds)

### Problem
The launcher character is drawn with basic shapes — a yellow circle head, blue rectangle body, glasses made of strokeRect lines. It looks placeholder. Need real character art that matches the "Happy Nerds" theme — school-themed characters with personality.

### What to Build

Replace the current `_drawLauncher` method with character art drawn entirely with Canvas 2D API (no image assets needed). Draw 3 character variants based on the chapter theme:

**Chapter themes:**
- Ch1-2: Desert (math basics) → **Calculator Carl** — nerdy kid with a calculator, warm colors
- Ch3-4: Campus (advanced) → **Formula Fiona** — girl with a notebook, cool colors  
- Ch5-7: Lab (expert) → **Proof Pete** — lab coat and goggles, green/white

### Character Design — Calculator Carl (default, Ch1-2)

Draw at approximately 44x50px canvas size. All coordinates relative to (cx, cy) which is the character's center-bottom.

**Head (circle, radius 14):**
- Skin: #fde68a (warm yellow)
- Hair: #92400e (brown), draw as a swoosh on top — arc from -140° to -20° with fill
- Eyes: two small white circles with black pupils
- Glasses: #78350f, thick frames, bridge connecting them
- Smile: small upward arc

**Body (rounded rect):**
- Shirt: #3b82f6 (blue) with a small calculator icon on chest (tiny 4x4 grid of squares)
- Arms: same blue, slightly bent, one holds a pencil (yellow line)

**Legs:**
- Pants: #1e40af (dark blue)
- Shoes: #78350f (brown)

**Arms animation states:**
- `idle`: arms at sides, pencil pointing down
- `hit`: both arms up, pencil pointing up (celebration)
- `miss`: arms down, shoulders slumped

### Character Design — Formula Fiona (Ch3-4)

Same dimensions. Differences from Carl:
- Hair: #7c3aed (purple), longer — drawn as two side arcs past shoulders
- Glasses: cat-eye shape (slightly angled rectangles)
- Shirt: #ec4899 (pink) with a small ∫ integral symbol on chest
- Holds a notebook instead of pencil (small rectangle with lines)
- No beard/facial hair

### Character Design — Proof Pete (Ch5-7)

Same dimensions. Differences:
- Hair: #e5e7eb (gray/white), spiky
- Goggles instead of glasses (larger circles with strap)
- Lab coat: #f8fafc (white) over #059669 (green) shirt
- Holds a test tube (small cylinder with colored liquid)
- Slightly taller posture

### Implementation

**In `src/renderer/Renderer.js`:**

Replace `_drawLauncher(launcher, session)` with:

```js
_drawLauncher(launcher, session) {
  const ctx = this.ctx;
  const params = session.getEffectiveParams();
  const form = session.currentForm();
  const originLocalY = evalForm(0, form, params);
  const MIN_Y = 0.3;
  const MAX_Y = WORLD_H - 0.5;
  const drawX = launcher.x;
  const drawY = Math.max(MIN_Y, Math.min(MAX_Y, launcher.y + originLocalY));
  const { cx, cy } = w2c(drawX, drawY);
  
  const chapter = session.config.chapter ?? 1;
  const state = session.gameState;
  
  if (chapter <= 2) this._drawCarl(ctx, cx, cy, state);
  else if (chapter <= 4) this._drawFiona(ctx, cx, cy, state);
  else this._drawPete(ctx, cx, cy, state);
}

_drawCarl(ctx, cx, cy, state) { /* ... */ }
_drawFiona(ctx, cx, cy, state) { /* ... */ }
_drawPete(ctx, cx, cy, state) { /* ... */ }
```

### Constraints
- ALL art drawn with Canvas 2D API — no image files
- Characters should be recognizable at the game's scale (~44x50px rendered)
- Keep it simple — these are small characters, not portraits
- Must support the 3 animation states: idle, hit (celebration), miss (slumped)
- Character type selected by chapter number
- Do NOT modify any game logic, level data, or non-renderer files

### Verification
1. Ch1-2 shows Calculator Carl (brown hair, blue shirt, calculator, pencil)
2. Ch3-4 shows Formula Fiona (purple hair, pink shirt, notebook)
3. Ch5-7 shows Proof Pete (white hair, lab coat, test tube)
4. Characters animate on hit (arms up) and miss (slumped)
5. Characters stay within canvas bounds
6. No image assets needed
