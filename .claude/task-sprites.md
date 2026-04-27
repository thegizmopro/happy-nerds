## Task: Sprite Art Integration — Replace Canvas Code Art with PNG Sprites

### Problem
The game currently draws all characters, targets, and backgrounds using Canvas 2D API shape-by-shape code. We now have proper PNG sprite art that needs to be loaded and rendered instead.

### Art Assets Available in `src/assets/`:

**Characters (3 states each):**
- `carl_idle.png`, `carl_celebrate.png`, `carl_miss.png`
- `fiona_idle.png`, `fiona_celebrate.png`, `fiona_miss.png`
- `pete_idle.png`, `pete_celebrate.png`, `pete_miss.png`

**Targets (2 states each):**
- `jock_alive.png`, `jock_dead.png`
- `varsity_alive.png`, `varsity_dead.png`
- `skater_alive.png`, `skater_dead.png`
- `coach_alive.png`, `coach_dead.png`
- `bullyboss_alive.png`, `bullyboss_dead.png`

**Backgrounds (8):**
- `bg_ch1_busstop.png` through `bg_ch8_office.png`

### What to Build

**1. New file: `src/renderer/SpriteLoader.js`**

```js
export class SpriteLoader {
  constructor() {
    this._cache = {};
    this._loading = 0;
    this._ready = false;
  }

  // Load all sprites, returns a promise that resolves when all are loaded
  async loadAll() { ... }

  // Get a loaded Image object by key
  get(key) { return this._cache[key]; }

  get ready() { return this._ready; }
}
```

Load all PNGs at game startup using `new Image()` + `onload` promises. Keys match filenames without extension.

**2. In `src/renderer/Renderer.js`:**

Replace the canvas-drawn methods with sprite rendering:

**Backgrounds** — replace `_drawBusStop`, `_drawHallway`, etc. with a single method:
```js
_drawBackground(launcher, chapter) {
  const bgKey = `bg_ch${chapter}_...`; // map chapter to filename
  const img = this._sprites.get(bgKey);
  if (img) {
    ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
  }
}
```

**Characters** — replace `_drawCarl`, `_drawFiona`, `_drawPete` with:
```js
_drawLauncher(launcher, session) {
  const chapter = session.config.chapter ?? 1;
  const state = session.gameState;
  const charName = chapter <= 2 ? 'carl' : chapter <= 4 ? 'fiona' : 'pete';
  const stateName = state === 'hit' ? 'celebrate' : state === 'miss' ? 'miss' : 'idle';
  const key = `${charName}_${stateName}`;
  const img = this._sprites.get(key);
  if (img) {
    // Compute position (same as current code)
    // Draw centered at the computed position, scaled to ~50px tall
    const drawH = 50;
    const drawW = drawH * (img.naturalWidth / img.naturalHeight);
    ctx.drawImage(img, cx - drawW/2, cy - drawH, drawW, drawH);
  }
}
```

**Targets** — replace `_drawJock`, `_drawVarsity`, etc. with:
```js
_drawPig(wx, wy, radius, type, dead, celebrating, flashWhite, opacity) {
  const nameMap = { helmet: 'jock', letterman: 'varsity', cool: 'skater', whistle: 'coach', king: 'bullyboss' };
  const name = nameMap[type] ?? 'jock';
  const state = dead ? 'dead' : 'alive';
  const key = `${name}_${state}`;
  const img = this._sprites.get(key);
  if (img) {
    // Draw at world position, scaled to fit the radius
    const { cx, cy } = w2c(wx, wy);
    const r = radius * SCALE; // pixel radius
    const drawH = r * 2;
    const drawW = drawH * (img.naturalWidth / img.naturalHeight);
    ctx.globalAlpha = opacity;
    if (flashWhite) {
      // Draw white overlay for hit flash
      ctx.filter = 'brightness(3)';
    }
    ctx.drawImage(img, cx - drawW/2, cy - drawH/2, drawW, drawH);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
  }
}
```

**3. In `src/game/GameController.js`:**

- Create SpriteLoader in constructor
- Call `await spriteLoader.loadAll()` before first render
- Pass spriteLoader to Renderer

**4. In `index.html` or game init:**

- Show a loading screen while sprites load
- Only start the game after `spriteLoader.ready` is true

### Constraints
- DELETE all the canvas-drawn art methods (_drawCarl, _drawFiona, _drawPete, _drawJock, _drawVarsity, _drawSkater, _drawCoach, _drawBullyBoss, _drawBusStop, _drawHallway, _drawClassroom, _drawCafeteria, _drawLibrary, _drawGym, _drawLab, _drawOffice)
- Replace with sprite-based rendering
- HP dots still drawn in code (on top of sprites)
- Bonus rings still drawn in code
- Obstacles still drawn in code
- Arc and projectile still drawn in code
- Hit flash: use `ctx.filter = 'brightness(3)'` for white flash effect
- Kill fade: use `ctx.globalAlpha` as before
- Characters scaled to ~50px tall, targets scaled to fit their radius
- Backgrounds stretched to fill the full canvas (700x420)

### Verification
1. All backgrounds render correctly for each chapter
2. Carl shows for Ch1-2, Fiona for Ch3-4, Pete for Ch5-7
3. Characters switch between idle/celebrate/miss states
4. All 5 target types render with their correct sprite
5. Dead targets show the dead sprite + fade out
6. Hit flash works (brief white flash on non-lethal hit)
7. HP dots still render above multi-HP targets
8. Game shows loading screen while sprites load
9. No canvas code art remains — all replaced by PNG sprites
