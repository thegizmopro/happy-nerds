# Happy Nerds — Engineering Plan

Last updated: 2026-04-24

This is the formal programming plan derived from GAME-DESIGN.md, reconciled against the current codebase (STATUS.md). Tasks are ordered by dependency and priority. Each task is a discrete unit of work that can be handed to Claude Code.

---

## Legend

- ✅ Done (verified in codebase)
- 🔧 Partial (exists but incomplete or broken)
- ❌ Not started
- 🚫 Skipped (design changed, no longer needed)

---

## Phase 0: Foundation

### E-01: Project scaffold & build system ✅
- Vite + vanilla JS, ES modules
- `package.json`, `vite.config.js`, `index.html`
- `npm run dev` / `npm run build` / `npm run preview`
- **Verified**: working, `dist/` builds

### E-02: Canvas renderer base ✅
- 700×420 canvas, responsive scaling
- Coordinate system with ground line
- Grid overlay
- Theme system (desert, forest, mountain, space)
- **Verified**: `Renderer.js` has all four themes, grid, ground

### E-03: Equation system — stretch form ✅
- Parse and evaluate `y = a·x²`
- Coefficient `a` with valid range
- Point sampling for arc rendering
- **Verified**: `equation.js` handles `stretch` form

### E-04: Arc builder & renderer ✅
- Sample 200 display points / 300 launch points from equation
- Early-exit when y < ground (below canvas)
- Draw dashed predicted arc on canvas
- Vertex dot and vertical guide line
- **Verified**: `arc.js`, `trajectory.js`, Renderer `_drawArc`

### E-05: Slider UI for coefficients ✅
- Color-coded sliders per coefficient
- Live value readout
- Drag updates equation → arc redraws in real-time
- **Verified**: `UIController.js` slider system

### E-06: Target & collision system ✅
- Radial collision: arc point within target radius
- AABB obstacle collision (exists but disabled — see E-14)
- Target rendering (pig faces)
- **Verified**: `collision.js`, Renderer pig drawing

### E-07: Launch animation ✅
- Projectile animates along arc over ~1.3s
- Orange circle follows computed path
- Solid trail rendered behind projectile
- **Verified**: `GameController._animateLaunch`

### E-08: Win/lose state ✅
- Hit detection triggers result panel
- Miss detection (arc ends without hit)
- Star calculation by move count
- **Verified**: scoring system, result panel

### E-09: Level definition schema ✅
- JSON schema with id, chapter, equationForm, coefficients, targets, obstacles, stars, revealAfter
- Level loader parses and validates
- **Verified**: `levelLoader.js`, chapter files

### E-10: Progress & save system ✅
- localStorage persistence via ProgressStore
- Stars per level, currentLevel, revealsSeen
- **Verified**: `ProgressStore.js`

---

## Phase 1: Core Gameplay Loop

### E-11: Chapter 1 levels — Stretch ✅
- 10 levels authored in `chapter1.js`
- Ground targets, shelf targets, walls, moving targets
- Equation form: `y = ax²`, only `a` slider
- **Verified**: all 10 levels playable

### E-12: Chapter 2 levels — Shift ✅
- 10 levels authored in `chapter2.js`
- h and k sliders added
- Equation form: `y = a(x-h)² + k`
- **Verified**: all 10 levels playable

### E-13: Chapter 3 levels — Sign & Shape ✅
- 10 levels authored in `chapter3.js`
- Negative `a`, trench/column targets, gauntlet
- **Verified**: all 10 levels playable

### E-14: Obstacle collision blocking ✅
- **Fixed**: `findObstacleIntersection` added to collision.js, `clipArcAtObstacle` added to arc.js
- `_rebuildArc()` now clips preview arc at obstacles — dashed line stops at wall
- `launch()` clips flight arc — projectile stops at obstacle, targets beyond are unreachable
- Removed `|| true` guard entirely
- Bonus ring check uses world coords directly, only triggers if clipped arc reaches it
- Red `×` splat marker drawn on canvas at obstacle intersection point
- **Files**: `collision.js`, `arc.js`, `GameController.js`, `Renderer.js`

### E-15: Chapter progression gate ✅
- **Fixed**: Chapters now unlock sequentially — Ch N unlocks when all Ch N-1 levels have ≥1 star
- Ch1 always unlocked, Ch2-3 require progression only, Ch4-8 require progression AND premium
- Level select shows 🔒 on locked chapters with reason ("Complete Chapter N" or "Premium content")
- Toast on tapping locked chapters
- **Files**: `ProgressStore.js`, `levelLoader.js`, `UIController.js`, `style.css`

### E-16: Star criteria enforcement 🔧
- **Current state**: stars based on move count only, bonus ring infrastructure exists but few levels have rings
- **What to build**:
  1. Author bonus rings for chapters 1-5 (at least 3 per chapter)
  2. 3-star = hit target AND pass through bonus ring
  3. 2-star = hit target with ≤ N coefficient changes
  4. 1-star = hit target any way
  5. Add more bonus rings to chapter level data
- **Depends on**: E-09
- **Files**: chapter1-5.js, `scoring.js`

---

## Phase 2: Equation Forms & Education

### E-17: Factored form equation system ✅
- `y = a(x-r₁)(x-r₂)` parsing, evaluation, sliders for r₁, r₂
- **Verified**: `equation.js` handles `factored` form

### E-18: Standard form equation system ✅
- `y = ax² + bx + c` parsing, evaluation, sliders for a, b, c
- **Verified**: `equation.js` handles `standard` form

### E-19: Chapter 4 levels — Roots ✅
- 10 levels authored in `chapter4.js`
- Factored form, root targeting
- **Verified**: all 10 levels playable

### E-20: Chapter 5 levels — Standard Form ✅
- 10 levels authored in `chapter5.js`
- Standard form, all three coefficients
- **Verified**: all 10 levels playable

### E-21: Reveal system — wire all cards ✅
- **Fixed**: All 8 reveal cards now wired to correct levels
- Ch1-L3 → leading_coefficient, Ch2-L3 → vertex_form
- Ch3-L1 → negative_a_intro, Ch3-L5 → negative_a
- Ch4-L2 → factored_form, Ch5-L1 → standard_form
- Ch6-L1 → multi_shot_strategy (new card), Ch7-L1 → cubic_intro (new card)
- Removed duplicates: negative_a_intro was in Ch1-L7 (moved to Ch3), factored_form was in Ch4-L1 and Ch4-L2 (kept only L2)
- **Files**: `chapter1.js`, `chapter3.js`, `chapter4.js`, `chapter6.js`, `chapter7.js`, `revealContent.js`

### E-22: Bounce mechanic ❌
- **Current state**: Chapter 4 levels 6-7 mention bounce but arc system doesn't model it
- **What to build**:
  1. When arc reaches a root (y=0), compute a reflected arc
  2. Reflection: new parabola with `a` negated, vertex at bounce point
  3. Projectile visually bounces and continues on new arc
  4. Collision detection continues on second arc
  5. Max 2 bounces per launch
- **Design decision**: The bounce should produce a *visually obvious* second arc. Consider drawing it in a different shade to show "this is the bounce path"
- **Depends on**: E-17
- **Files**: `arc.js`, `trajectory.js`, `GameController.js`, `Renderer.js`

---

## Phase 3: Advanced Mechanics

### E-23: Multi-shot system ✅
- Sequential shots with per-shot slider configs
- Ghost arc display for prior shots
- Shot tabs for navigation
- **Verified**: `GameController` multi-shot flow

### E-24: Chapter 6 levels — Multi-Shot ✅
- 10 levels authored in `chapter6.js`
- Two and three projectile combos
- **Verified**: all 10 levels playable

### E-25: Cubic equation system ✅
- `y = a(x-h)³ + k` parsing, evaluation
- **Verified**: `equation.js` handles `cubic` form

### E-26: Absolute value equation system ✅
- `y = a|x-h| + k` parsing, evaluation
- **Verified**: `equation.js` handles `abs` form

### E-27: Piecewise equation system ✅
- Two functions joined at a breakpoint
- **Verified**: `equation.js` handles `piecewise` form

### E-28: Chapter 7 levels — Beyond Quadratics ✅
- 10 levels authored in `chapter7.js`
- Cubic, absolute value, piecewise
- **Verified**: all 10 levels playable

### E-29: Chapter 8 levels — Boss ✅
- 5 levels authored in `chapter8.js`
- Timed, multi-target, mixed forms
- **Verified**: all 5 levels playable

### E-30: Moving targets ✅
- Targets bounce between min/max on x or y axis
- Delta-time capped at 100ms
- Keep moving during ball flight
- **Verified**: `MovingTarget.js`, real-time collision

### E-31: Timer levels ✅
- Countdown timer with red warning under 10s
- Auto-miss on expiry
- **Verified**: `GameController` timer flow

### E-32: Whistle pig spawn mechanic ✅
- **Built**: On whistle pig hit → tweet sound + new helmet pig spawns nearby
- Spawn position: random within 1.5 units, avoids obstacles/overlaps/ground, fallback to exact position
- Max 1 spawn per whistle pig (hasSpawned flag, no chains)
- Pop-in animation: radius scales 0→full over 200ms
- Multi-shot: spawned pig added to current shot's targetIds
- **Files**: `GameController.js`, `LevelSession.js`, `Renderer.js`

### E-33: Multi-HP targets 🔧
- **Current state**: all pigs are `hp: 1`, multi-HP infrastructure exists but disabled
- **Design decision**: The original design had letterman (2 HP) and king (3 HP) pigs. These were removed because single-launch-hit logic couldn't decrement HP. Now that collision is real-time per-frame, multi-HP works naturally.
- **What to build**:
  1. Re-enable letterman pig (2 HP) and king pig (3 HP) in level data
  2. Visual feedback: pig flashes/changes on each hit, X-eyes only on final hit
  3. In multi-shot levels, same target can be hit across multiple shots
  4. Single-shot levels: if arc passes through target multiple times (e.g., peaks through it going up and coming down), each pass counts as a hit
- **Depends on**: E-06, E-32
- **Files**: `GameController.js`, chapter level files, `Renderer.js`

---

## Phase 4: Input Polish

### E-34: Draggable control points on arc ✅
- **Built**: Full ControlPoints.js with hit testing, drag lifecycle, reverse-solving
- Vertex drag works in vertex form (h,k), standard form (b,c), factored form (r1,r2)
- Root points draggable in factored form, y-intercept draggable in standard form
- 44px touch targets, color-matched to coefficient sliders
- Bidirectional sync: dragging updates sliders, slider moves update control points
- Touch events with passive:false prevent scroll on canvas
- Control points hidden during flight, only shown when idle
- **Files**: new `ControlPoints.js`, `GameController.js`, `Renderer.js`, `UIController.js`

### E-35: Direct coefficient text entry ❌
- **Current state**: sliders only
- **What to build**:
  1. Tap/click a coefficient value display to enter edit mode
  2. Show a small input field over the coefficient
  3. Type a number, press Enter or click away to apply
  4. Invalid values revert to previous
  5. Available from Chapter 3 onward (early levels are slider-only by design)
- **Depends on**: E-05
- **Files**: `UIController.js`

### E-36: Grid toggle ❌
- **Current state**: grid always visible
- **What to build**:
  1. Toggle button (grid icon) in HUD
  2. Toggles grid lines on/off
  3. Persist preference in ProgressStore
  4. Default: on for chapters 1-3, off for 4+ (encourages estimation)
- **Depends on**: E-02
- **Files**: `UIController.js`, `Renderer.js`, `ProgressStore.js`

### E-37: Coefficient locking ❌
- **Current state**: all available coefficients are editable
- **What to build**:
  1. Level schema already has `lockedCoefficients` field
  2. Implement: locked sliders are grayed out and non-draggable
  3. Locked values shown but not changeable
  4. Use existing level data (many levels already define locked coefficients)
- **Depends on**: E-05
- **Files**: `UIController.js`

---

## Phase 5: Audio & Feel

### E-38: Audio system — core ✅
- **Built**: SoundManager.js with Web Audio API, lazy init on first interaction
- Volume/muted persistence in ProgressStore
- Mute toggle button (🔊/🔇) in HUD
- Silent fallback if AudioContext unavailable
- **Files**: new `SoundManager.js`, `ProgressStore.js`, `UIController.js`

### E-39: Dynamic arc tone ✅
- **Built**: Sine oscillator mapping |a| → 220-880Hz while dragging
- Plays on slider drag and control point drag, stops on release
- 15% of master volume — subtle background texture
- **Files**: `SoundManager.js`, `GameController.js`

### E-40: Sound effects ✅
- **Built**: 8 synthesized effects, no audio files:
  - Click (pitch-mapped), launch whoosh, hit crash+chord, miss wah-wah
  - Star arpeggio, whistle tweet, bonus chime, obstacle splat
- All wired into GameController at appropriate trigger points
- **Files**: `SoundManager.js`, `GameController.js`

### E-41: Nerd voice lines ❌
- **What to build**:
  1. On hit: random cheer ("NICE!", "Calculated!", "That's what I call a solution!", "Bullseye!")
  2. On 3-star: extra celebration ("Elegant!", "Textbook!", "Now THAT'S math!")
  3. On miss: encouraging ("Close!", "Recalculate!", "Almost!")
  4. Display as text bubble near launcher character (no voice acting needed for MVP)
- **Depends on**: E-07
- **Files**: `GameController.js`, `Renderer.js`

---

## Phase 6: Visual Polish

### E-42: Character art — named nerds ❌
- **Current state**: generic stick figure
- **What to build**:
  1. Canvas-drawn characters with distinguishing features:
     - Para Bella: glasses with parabola frames, ponytail
     - Root Two-Shoes: √2 on shirt, sneakers
     - Stretch Armstrong: tall/lanky, slinky toy in hand
     - Sign Language: +/- tattoo on arm, confident pose
     - Cubic Sam: cube-shaped head, drone remote in hand
  2. Chapter→character mapping: Ch1-3 = Para Bella, Ch4 = Root Two-Shoes, Ch5 = Stretch Armstrong, Ch6 = Sign Language, Ch7 = Cubic Sam, Ch8 = all
  3. Win animation: arms raise + character-specific celebration
- **Depends on**: E-02
- **Files**: `Renderer.js` (or new `src/entities/nerd.js`)

### E-43: Pig art variants ❌
- **Current state**: 5 pig types drawn with face color + accessories, but letterman/king lack jacket/crown
- **What to build**:
  1. Jock Pig: football helmet (already drawn) ✅
  2. Letterman Pig: draw letterman jacket body below face
  3. Cool Pig: draw sunglasses (already drawn) ✅
  4. Whistle Pig: draw whistle on lanyard
  5. King Pig: draw crown on head
  6. Hit animation: helmet/crown/whistle flies off, pig pops
- **Depends on**: E-02
- **Files**: `Renderer.js`

### E-44: Themed obstacles ❌
- **Current state**: all obstacles are plain gray rectangles
- **What to build**:
  1. Desert theme: cacti, sand dunes, tumbleweeds
  2. Forest theme: tree stumps, log piles, mushroom caps
  3. Mountain theme: rock formations, boulders, ice blocks
  4. Space theme: asteroids, satellite debris, space station walls
  5. Each is a canvas-drawn overlay on the AABB rectangle
- **Depends on**: E-02
- **Files**: `Renderer.js`

### E-45: Projectile art per character ❌
- **Current state**: generic orange circle
- **What to build**:
  1. Para Bella → rocket shape (triangle with flame trail)
  2. Root Two-Shoes → bouncing ball (circle with stitch lines)
  3. Stretch Armstrong → slinky (spring coil shape that stretches/compresses)
  4. Sign Language → boomerang (V-shape that rotates)
  5. Cubic Sam → drone (rectangle with spinning propellers)
  6. Projectile shape determined by chapter→character mapping
- **Depends on**: E-42
- **Files**: `Renderer.js`

### E-46: Nerd animations ❌
- **Current state**: arms raise on win only
- **What to build**:
  1. Idle: slight bob, glasses adjustment every 5s
  2. Aiming: lean forward, track arc with gaze
  3. Launch: arm throw motion
  4. Win: arms raise (done) + high-five + fist pump
  5. Miss: encouraging shrug, hand wave
  6. 3-star: jump + glasses gleam
- **Depends on**: E-42
- **Files**: `Renderer.js`, `GameController.js`

---

## Phase 7: Mobile & Accessibility

### E-47: Mobile touch optimization ❌
- **Current state**: canvas scales but sliders/touch not tested on mobile
- **What to build**:
  1. Test on iOS Safari and Android Chrome
  2. Verify 44px minimum touch targets on all interactive elements
  3. Prevent scroll/zoom on canvas touch
  4. Responsive layout: stack equation below canvas on narrow screens
  5. Touch-specific: haptic feedback on coefficient change (if available)
- **Depends on**: E-34, E-35
- **Files**: `UIController.js`, `style.css`, `index.html`

### E-48: Accessibility ❌
- **What to build**:
  1. Color-blind: don't rely solely on color for coefficient mapping. Add shape/pattern to each coefficient's slider and display
  2. Screen reader: aria-live region for equation readout ("y equals negative 2 times x squared")
  3. Keyboard: arrow keys to adjust selected coefficient, Tab to cycle coefficients, Enter to launch
  4. Reduced motion: respect `prefers-reduced-motion` — skip launch animation, show result immediately
- **Depends on**: E-05, E-34
- **Files**: `UIController.js`, `style.css`, `index.html`

---

## Phase 8: Deploy & Monetization

### E-49: Production build & deploy ❌
- **What to build**:
  1. Test `vite build` output
  2. Deploy to Vercel or Netlify (one-click, free tier)
  3. Custom domain if desired (happynerds.game or similar)
  4. HTTPS, meta tags, social share image
- **Depends on**: E-14, E-21, E-34, E-38
- **Files**: `vite.config.js`, new `vercel.json` or `netlify.toml`

### E-50: Paywall integration ❌
- **Current state**: static "coming soon" card
- **What to build**:
  1. Stripe Checkout or Gumroad for $4.99 unlock
  2. Unlock stored in localStorage (honor system for MVP)
  3. Cloud save for premium users (future)
- **Files**: new `src/paywall.js`, `UIController.js`

---

## Dependency Graph (Critical Path)

```
E-01 → E-02 → E-03 → E-04 → E-06 → E-07 → E-08
                   ↓
                  E-05 → E-34 (control points) → E-47 (mobile)
                   ↓       ↓
                  E-35     E-37 (coefficient locking)
                   ↓
                  E-36 (grid toggle)

E-06 → E-14 (obstacle fix) ← BLOCKS: proper gameplay
E-09 → E-16 (star criteria)
E-10 → E-15 (chapter gate)

E-17 → E-19 → E-21 (reveal wiring)
E-18 → E-20 → E-21
E-17 → E-22 (bounce)

E-06 → E-32 (whistle pig) → E-33 (multi-HP)

E-38 → E-39 (arc tone)
E-38 → E-40 (sound effects)

E-02 → E-42 (character art) → E-45 (projectile art) → E-46 (animations)
E-02 → E-43 (pig art)
E-02 → E-44 (themed obstacles)

E-34 + E-35 → E-47 → E-49 (deploy)
E-47 → E-48 (accessibility)
E-49 → E-50 (paywall)
```

---

## Recommended Next Steps (Priority Order)

These are the tasks that give the most gameplay and feel improvement per unit of effort:

1. **E-14: Obstacle collision** — broken gameplay, 30 min fix
2. **E-21: Wire reveal cards** — core educational feature missing, 20 min
3. **E-15: Chapter progression gate** — no progression feeling, 30 min
4. **E-37: Coefficient locking** — level data already supports it, 15 min
5. **E-34: Draggable control points** — biggest feel improvement, 2-3 hr
6. **E-38+E-39+E-40: Audio** — transforms the experience, 3-4 hr
7. **E-32: Whistle pig spawn** — fun mechanic, 1 hr
8. **E-16: Star criteria + bonus rings** — gives replay value, 1 hr
9. **E-42+E-43: Character & pig art** — visual identity, 3-4 hr
10. **E-22: Bounce mechanic** — unlocks Ch4 levels 6-7, 2 hr

---

## Out of Scope (Future)

- E-45: Projectile art per character (nice-to-have, not critical)
- E-44: Themed obstacles (visual only)
- E-46: Full nerd animations (win animation sufficient for MVP)
- E-47: Mobile QA (needs device testing)
- E-48: Accessibility (important but post-MVP)
- E-50: Paywall (post-launch)
- Multiplayer / challenge mode
- Cloud save
