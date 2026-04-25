## Task: E-43 — Pig Art Variants (Canvas-Drawn)

### Problem
All pig targets are drawn as simple colored circles with minimal facial features. Need distinct visual art for each pig type to match the school/sports theme.

### Current Pig Types
- `helmet` — basic pig (1 HP), drawn as green circle
- `letterman` — sports jacket pig (2 HP), drawn as blue circle
- `cool` — moving pig (1 HP), drawn as purple circle
- `whistle` — coach pig (1 HP), draws a whistle shape
- `king` — boss pig (3 HP), drawn as larger red circle

### What to Build

Redraw each pig type with Canvas 2D API as distinctive characters. All pigs are school-themed "bully jocks" that the nerds are fighting with math.

### Pig Designs

**Helmet Pig (1 HP, basic):**
- Green circle body (#4ade80)
- Football helmet on top (#fbbf24 yellow, with face mask lines)
- Small angry eyes (black dots with angled eyebrows)
- Snout: small pink oval
- Size: radius as defined in level data

**Letterman Pig (2 HP, sports jacket):**
- Green circle body (#4ade80)
- Red letterman jacket visible on the body (V-shape in #ef4444)
- "N" letter on chest (for Nerd High)
- Determined expression (flat mouth line)
- Small cap on top (#1e40af blue)

**Cool Pig (1 HP, moving):**
- Green circle body (#4ade80)
- Sunglasses (black filled rectangles covering eyes)
- Smirk (single curved line, one side up)
- Headphones on sides (two circles + band on top, #7c3aed purple)

**Whistle Pig (1 HP, coach):**
- Green circle body (#4ade80)
- Whistle on a lanyard around neck (yellow whistle shape + string)
- Coach's cap (#dc2626 red with white brim)
- Shouting mouth (open oval, #ef4444 inside)
- Angry eyebrows (V-shape)

**King Pig (3 HP, boss):**
- Larger green circle body (#4ade80) — already has bigger radius
- Crown on top (#fbbf24 gold, 3 triangular points)
- Royal cape draped behind (purple #7c3aed, just visible as a shape behind the body)
- Sneering expression (one eyebrow raised)
- HP dots already rendered above — make sure crown doesn't overlap them

### Hit/Flash State
When a pig is hit but not killed (hitFlash), the entire pig briefly turns white (#ffffff) for 200ms.

### Kill State  
When HP reaches 0, the pig shows:
- X-eyes (two small X shapes replacing the eyes)
- Tongue sticking out (small pink shape from mouth)
- Opacity fading from 1.0 to 0.0 over 500ms

### Implementation

**In `src/renderer/Renderer.js`:**

Replace the pig drawing section of `_drawTargets` with a new `_drawPig(ctx, t, session)` method:

```js
_drawPig(ctx, t, session) {
  const wt = session.getTargetWorld(t);
  const { cx, cy } = w2c(wt.x, wt.y);
  const hp = session.targetHP[t.id] ?? 1;
  const dead = hp <= 0;
  const maxHP = t.hp ?? 1;
  
  // Kill fade
  if (dead) {
    const kt = session.killTime?.[t.id];
    const fade = kt ? Math.max(0, 1 - (Date.now() - kt) / 500) : 0;
    ctx.globalAlpha = fade;
  }
  
  // Hit flash
  const flashTime = session.hitFlash?.[t.id];
  const flashing = flashTime && (Date.now() - flashTime < 200);
  const bodyColor = flashing ? '#ffffff' : '#4ade80';
  
  switch (t.pigType) {
    case 'helmet':  this._drawHelmetPig(ctx, cx, cy, wt.radius, bodyColor, dead); break;
    case 'letterman': this._drawLettermanPig(ctx, cx, cy, wt.radius, bodyColor, dead); break;
    case 'cool': this._drawCoolPig(ctx, cx, cy, wt.radius, bodyColor, dead); break;
    case 'whistle': this._drawWhistlePig(ctx, cx, cy, wt.radius, bodyColor, dead); break;
    case 'king': this._drawKingPig(ctx, cx, cy, wt.radius, bodyColor, dead); break;
    default: this._drawHelmetPig(ctx, cx, cy, wt.radius, bodyColor, dead); break;
  }
  
  ctx.globalAlpha = 1;
}
```

Each `_drawXxxPig` method draws the full pig at (cx, cy) with the given radius, body color (white for flash, green normally), and dead state (X-eyes + tongue).

### Constraints
- ALL art drawn with Canvas 2D API — no image files
- Pigs must be recognizable at game scale (radius 0.35-0.55 world units = ~25-40px)
- Keep drawings simple — these are small, need to read clearly
- Flash white on non-lethal hit
- X-eyes + tongue + fade on kill
- HP dots still rendered above (existing code)
- Do NOT modify game logic, level data, or collision detection
- Do NOT change pig sizes or positions

### Verification
1. Helmet pig shows yellow football helmet + face mask
2. Letterman pig shows red jacket + "N" + blue cap
3. Cool pig shows sunglasses + smirk + headphones
4. Whistle pig shows whistle + coach cap + shouting mouth
5. King pig shows gold crown + purple cape (larger)
6. All pigs flash white on non-lethal hit
7. Dead pigs show X-eyes + tongue and fade out
8. HP dots still visible above multi-HP pigs
