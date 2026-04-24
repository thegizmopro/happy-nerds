# Happy Nerds — Project Status

Last updated: 2026-04-24

---

## What's Done

### Core Engine
- **GameController / UIController / Renderer** — full MVC split, event-driven, no globals
- **Equation system** — all forms implemented and tested: `stretch`, `vertex`, `standard`, `factored`, `cubic`, `abs`, `piecewise`
- **Arc builder** — samples 200 pts (display) / 300 pts (launch), early-exits below ground
- **Collision detection** — real-time per-frame, arc-vs-target (radial), arc-vs-obstacle (AABB), both form-agnostic
- **Scoring** — 1–3 stars by move count or timer, bonus ring support
- **Progress / save** — localStorage via ProgressStore, stars per level, revealsSeen, currentLevel
- **Multi-shot system** — sequential shots with ghost-arc display, per-shot slider configs
- **Moving targets** — bounce between min/max on x or y axis, delta-time capped at 100ms; keep moving during ball flight
- **Timer levels** — countdown with red warning under 10s, auto-miss on expiry
- **Paywall gate** — chapters 4–8 locked behind `progress.unlocked`, shows paywall card

### Levels
- **75 levels total** across 8 chapters (10 each for Ch1–7, 5 for Ch8), all authored and playable
- **Chapter 1** — Stretch (`y = ax²`): ground targets, shelf targets, walls, moving targets
- **Chapter 2** — Shift (`y = a(x−h)² + k`): horizontal/vertical shift, wall-clearing, two-target
- **Chapter 3** — Sign & Shape: positive/negative `a`, trench/column targets, gauntlet
- **Chapter 4** — Roots / Factored form (`y = a(x−r₁)(x−r₂)`): root-at-target, multi-target
- **Chapter 5** — Standard form (`y = ax² + bx + c`): all three coefficients, constrained shots
- **Chapter 6** — Multi-shot: two/three-projectile combos, obstacle-clearing sequences
- **Chapter 7** — Beyond quadratics: cubic (S-curve), absolute value (V-path), piecewise
- **Chapter 8** — Boss levels: timed, multi-target, mixed equation forms
- **All targets have `hp: 1`** — multi-HP mechanic removed globally (see Bug Fixes)

### Reveal System
- 6 reveal cards authored: `leading_coefficient`, `negative_a_intro`, `vertex_form`, `negative_a`, `factored_form`, `standard_form`
- Triggers once after designated level, never repeats (tracked in progress)
- Dismissable overlay with vocabulary chips

### Renderer
- **Canvas 700×420**, scales responsively to window width
- **4 themes**: desert, forest, mountain, space (different sky/ground colors)
- **Grid** (subtle, always visible)
- **Ground fill** and ground line at launcher y-position
- **Obstacles** — gray brick-pattern rectangles
- **Bonus ring** — dashed gold ring, filled gold on achievement
- **Pig targets** — 5 types (helmet, letterman, cool, whistle, king) with distinct face colors and accessories; X-eyes when dead; face flips at the moment the ball reaches the target (not at launch)
- **Launcher character** — stick-figure nerd with glasses; arms raise on win
- **Predicted arc** — dashed cyan line with vertex dot and guide line
- **Ghost arcs** — faded dashed lines from prior shots in multi-shot levels
- **Launch trail** — solid orange trail (rendering bug fixed)
- **Animated projectile** — orange circle follows arc over 1.3 seconds

### UI
- Level header: chapter/level label, title, timer, best-stars display
- Coefficient sliders with color-coded labels and live value readout
- Equation display updates in real-time with color-matched coefficient terms
- Math hint panel with contextual advice per equation form
- Shot tabs for multi-shot navigation
- Result panel (hit/miss) with star display and move count
- Level select screen with chapter grouping and per-level star display

### Bug Fixes (all sessions)
- **Menu blank page** — `_renderLevelSelect` called without `progress`; `progress.stars` was undefined, crashing the render. Fixed with an `onMenuOpen` callback wired from GameController.
- **All `hp > 1` targets unwinnable** — `letterman` pigs had `hp: 2`, `king` pigs had `hp: 3`. Each launch can only strike a target once in the pre-computed model, so HP never reached 0. Fixed in two passes: first ch1-l4/l5, then a global sweep changing every `hp: 2` and `hp: 3` to `hp: 1` across all 8 chapters (24 targets total).
- **Moving targets froze on launch** — `_stopLoop()` cancelled `session.tick()`, freezing targets the instant Launch was pressed. Collision was also pre-computed against frozen positions. Fixed by moving collision detection into `_animateLaunch` frame loop: `session.tick()` now runs every frame so targets keep moving, and hits are checked against current target position each frame.
- **Dead face shown at launch, not on impact** — `recordHit` was called before animation started, so `targetHP` dropped to 0 immediately. Fixed as a side effect of real-time collision: `recordHit` is now called the frame the ball reaches the target.
- **Launch trail never rendered** — `_drawTrail` guard was `if (!trail?.length < 2)` (operator precedence bug, always `false`). Fixed to `if (!trail || trail.length < 2)`.
- **Timer display broken on non-timer levels** — `updateTimer` guard was `if (!seconds === null)` (always `false`), causing a crash when `seconds` was `null`. Fixed to `if (seconds === null)`.

---

## What's Left To Do

### High Priority (affects playability)

- **Reveal cards not wired for Ch2–8** — most levels have `revealAfter: null`. The authored reveals (`vertex_form`, `negative_a`, `factored_form`, `standard_form`) exist but are never triggered. Need to assign `revealAfter` to the right levels in chapters 2–5.
- **Whistle pig spawn mechanic** — design calls for whistle pig to spawn a new helmet pig on hit. Not implemented; `pigType: 'whistle'` is only visual.
- **Chapter progression gate** — free chapters (1–3) are all immediately accessible with no unlock flow. Design intends each chapter to unlock on completing the prior one.

### Medium Priority (core design goals not yet built)

- **No audio whatsoever** — zero sound implementation. Design specifies: pitch-shifting arc tone on slider drag, click-with-pitch on coefficient change, crash + chord on hit, wah-wah on miss, ascending arpeggio for stars. This is a significant feel gap.
- **Draggable arc control points** — design calls for dragging the vertex or roots directly on the canvas as a primary input mode (not just sliders). Not implemented. Requires reverse-solving the equation from a drag position.
- **Direct coefficient text entry** — mid-level design intent: tap a coefficient to type a number. Not implemented.
- **Grid toggle** — grid is always on; design wants a show/hide toggle to train estimation before precision.
- **Bounce levels** — chapter 4 levels 6–7 mention a "bounce" mechanic (projectile rebounds at root). The arc system does not model bounces; these levels likely play incorrectly.

### Lower Priority (polish)

- **Character art** — launcher is a generic stick figure. Design defines named characters: Para Bella (ch1–3), Root Two-Shoes (ch4), Sign Language (ch3), Cubic Sam (ch7). No sprites built.
- **Nerd animations** — arms raise on win (done), but no: high-five animation, glasses-adjust on elegant solution, encouraging shrug on miss.
- **Environment decoration** — levels are stark. Design calls for thematic obstacles: book stacks, protractors, football goalposts, trophy cases, locker rooms. Currently all obstacles render as plain brick rectangles.
- **Letterman/king pig visuals** — no jacket or crown drawn; only face color differs from helmet pig.
- **Mobile / touch QA** — canvas scales responsively but sliders and touch targets have not been tested on actual devices. Minimum 44px touch target requirement from design not verified.
- **Coordinate axis labels** — would help players build intuition (x/y labels on grid edges).
- **Bonus rings** — infrastructure exists but `bonusRing: null` on almost all levels (ch2-l6 and ch2-l9 have rings authored). More needed.
- **Paywall** — shows a "coming soon" card. No actual payment integration.
- **Deploy** — no Vercel/Netlify config, no CI, no production build tested.

---

## Tech Debt

- **Obstacle collision doesn't block hits** — `if (!hitObstacle || true)` in `GameController.launch()` disables obstacle blocking entirely. The arc stops visually at an obstacle, but the hit still registers. The `|| true` was intentional scaffolding and needs a design decision.
- **Multi-HP targets shelved** — all pigs are `hp: 1`. The `recordHit` / `targetHP` / `targetsHit` infrastructure supports multi-HP, and the real-time collision loop would naturally deal multiple hits (multiple arc points within radius per pass). If multi-HP pigs are revisited, the mechanic to use is assigning the same target ID to multiple shots in a multi-shot level.
- **No error boundary on bad level data** — a malformed chapter export silently returns `null` from `getLevelConfig` and the game freezes with no feedback.
