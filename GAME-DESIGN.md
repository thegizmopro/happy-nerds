# Happy Nerds — Game Design Document

## Elevator Pitch

A physics-slinger game where the launcher is a parabola. Instead of pulling back and releasing, you manipulate the coefficients of a quadratic function to control the trajectory arc and hit targets. The math IS the mechanic.

The nerds aren't angry — they're happy. They're winning. Every launch is a "watch this 😏" moment. They launch their inventions at bullies, not themselves.

**Inspired by:** Angry Birds, DragonBox, GeoGebra

**Why not "Angry Nerds":** Name already taken as an app. More importantly, in Angry Birds the birds suffer — they're victims being flung. Happy Nerds flips the power dynamic: the nerds are in control, launching inventions at bullies. They're not angry, they're delighted. The tone is triumph, not revenge.

---

## Core Mechanic

The player sees:
1. A launcher (left side of screen)
2. A target structure (right side, various positions and elevations)
3. A **live equation** (bottom of screen) — the function that defines the projectile's path
4. A **visual arc** (dotted/dashed line) — the predicted trajectory from the current equation

The player modifies the equation → the arc updates in real-time → they launch → the projectile follows the arc → hit or miss.

**Key design principle:** The arc must update *instantly* as coefficients change. No "submit and wait." The equation is a live instrument, not a form.

---

## Input Methods

The primary interface is **not a text field**. It's physical/direct:

### Early Levels (Tactile)
- **Sliders** on each coefficient — drag left/right, arc warps in real-time
- **Draggable control points** on the arc itself — vertex, roots, y-intercept. Drag a point, equation updates to match
- The equation is a *readout* of your physical manipulation, not an input field

### Mid Levels (Hybrid)
- Sliders + direct equation editing (tap a coefficient to type)
- "Lock" certain parameters — e.g., "the vertex x-coordinate is locked at 5, find the right stretch factor"

### Late Levels (Pure Math)
- Equation editor only — type the function, see the arc, fire
- Multiple equations (multi-shot — launch 2-3 projectiles with different functions)
- Constraints: "Your function must pass through (2, 7) AND hit the target"

---

## Level Progression

### Chapter 1: Stretch — "The Basics" (10 levels)

**Math concept:** Vertical stretch/compression of a parabola

**Equation form:** y = a·x² (vary `a` only)

- Levels 1-3: Target at ground level, vary distance. Slider on `a`. Learn: bigger |a| = narrower arc
- Levels 4-5: Target above ground (on a shelf). Need the arc to peak at the right height
- Levels 6-7: Obstacle in the middle — arc must go over it. Learn: negative `a` = upside down
- Levels 8-10: Moving targets (slow). Must find the right `a` quickly — introduces time pressure

**Reveal moment (Level 3):** "You've been using y = a·x². The number `a` is called the **leading coefficient** — it controls how wide or narrow the parabola opens."

### Chapter 2: Shift — "Side Steps" (10 levels)

**Math concept:** Horizontal and vertical shifts (vertex form)

**Equation form:** y = a·(x - h)² + k (vary `h`, `k`, with `a` still available)

- Levels 1-3: Target off to the right. Drag the vertex horizontally. Learn: `h` shifts the parabola left/right
- Levels 4-6: Target at a specific height. Drag the vertex vertically. Learn: `k` shifts up/down
- Levels 7-8: Target behind a wall — need to peak over it and come down. Must set vertex above and past the wall
- Levels 9-10: Two targets — one shot must arc over obstacle and hit target behind it. Requires precise vertex placement

**Reveal moment (Level 3):** "The point (h, k) is the **vertex** — the peak or valley of the parabola. Every parabola is just y = x² shifted so its vertex sits at (h, k)."

### Chapter 3: Sign & Shape — "Flip Out" (10 levels)

**Math concept:** Sign of leading coefficient, width comparisons

**Equation form:** y = a·(x - h)² + k (focus on `a` sign and magnitude with shifts active)

- Levels 1-3: Targets *below* the launch point. Must use negative `a` (downward-opening parabola)
- Levels 4-5: Target in a trench — narrow arc needed (large |a|) to dive in
- Levels 6-7: Target on a tall column — wide arc (small |a|) to gently reach the top
- Levels 8-10: "The Gauntlet" — obstacles at multiple heights, need specific width AND direction

**Reveal moment (Level 2):** "Negative `a` flips the parabola upside down. Positive = smile, Negative = frown. Easy to remember: the parabola smiles when the math is nice 😊"

### Chapter 4: Roots — "Ground Zero" (10 levels)

**Math concept:** Roots/zeros of a quadratic, factored form

**Equation form:** y = a·(x - r₁)·(x - r₂) (factored form introduced alongside vertex form)

- Levels 1-3: Target at ground level at a specific distance. Set one root at the target x-coordinate. Learn: roots = where arc meets the ground
- Levels 4-5: Target elevated — must set roots to bracket it, arc passes through target on the way up or down
- Levels 6-7: "Bounce" levels — projectile bounces off ground at root, continues on new (given) arc. Must set first root correctly
- Levels 8-10: Two targets on the ground at different distances. Must set both roots to hit both (one projectile, two ground contacts? or one root + arc passes through elevated target)

**Reveal moment (Level 2):** "The roots r₁ and r₂ are where the parabola crosses the x-axis — where y = 0. Every quadratic can be written as y = a(x - r₁)(x - r₂). This is called **factored form**."

### Chapter 5: Standard Form — "Expand Your Mind" (10 levels)

**Math concept:** Standard form y = ax² + bx + c, converting between forms

**Equation form:** y = ax² + bx + c (all three coefficients, no shortcuts)

- Levels 1-3: Given a target, must write the equation in standard form. Convert from mental vertex form if needed
- Levels 4-5: "Equation decoder" — shown an arc, must determine the standard form equation
- Levels 6-7: Constraints: "c must be 0" (launch from ground level) — now b controls the angle
- Levels 8-10: Must hit target AND satisfy an additional constraint (passes through a checkpoint, vertex at specific height)

**Reveal moment (Level 1):** "All three forms — vertex, factored, standard — describe the same parabola. They're just different ways of looking at the same shape. Standard form y = ax² + bx + c tells you the overall shape and y-intercept directly."

### Chapter 6: Multi-Shot — "Combo Breaker" (10 levels)

**Math concept:** Systems of equations, optimizing multiple functions

- Levels 1-3: Launch TWO projectiles — set both equations. Must hit two different targets
- Levels 4-5: One projectile clears a path (destroys obstacle), second hits now-exposed target
- Levels 6-7: Three projectiles, limited budget — "total |a| values must sum to < 10" (introduces optimization)
- Levels 8-10: Chain reaction — first projectile moves the target, second must adjust in real-time

### Chapter 7: Beyond Quadratics — "Higher Ground" (10 levels)

**Math concept:** Higher-degree polynomials, absolute value, piecewise

- Levels 1-3: Cubic functions — y = a(x - h)³ + k. S-curve trajectories, loop around obstacles
- Levels 4-5: Absolute value — y = a|x - h| + k. V-shaped paths, bounce off walls
- Levels 6-7: Piecewise — two different functions joined at a point. Must specify the join point
- Levels 8-10: "Choose your function type" — given a complex obstacle course, pick the right function family and parameters

### Chapter 8: Boss Levels — "The Final Exam" (5 levels)

- Massive multi-target levels with complex obstacle configurations
- Must use multiple function types across multiple shots
- Timed — adds pressure
- Final boss: target moves, must write a function of *time* (parametric equations)

---

## Star Rating System

Each level awards 1-3 stars:

| Stars | Criteria |
|-------|----------|
| ⭐ | Hit the target (any valid equation) |
| ⭐⭐ | Hit the target with elegance — fewer total coefficients changed, or exact integer values |
| ⭐⭐⭐ | Hit the target AND solve the "bonus challenge" — e.g., "Also pass through the golden ring" or "Use a = -3 exactly" |

Star ratings incentivize *mathematical elegance*, not just completion. A kid who brute-forces gets 1 star; a kid who finds the clean solution gets 3.

---

## Educational Layers (Reveal System)

**Never teach first.** The cycle is:

1. **Experiment** — player messes with sliders, discovers what happens
2. **Achieve** — hits the target through trial and error
3. **Reveal** — game shows the mathematical concept they just used, with name and notation
4. **Apply** — next levels require intentional use of the named concept

This mirrors how DragonBox teaches algebra — the math is already happening, you just name it after the player discovers it.

**Reveal cards** (unlocked after key levels):
- "What is a coefficient?"
- "Vertex form vs. standard form"
- "How roots predict where the arc lands"
- "Why negative flips the parabola"
- Optional deep-dive — not required to progress, but available for curious players

---

## Visual Design Notes

### Art Style
- Bright, colorful, slightly cartoonish (think Alto's Odyssey meets Desmos)
- Each "nerd" character has a personality tied to their math specialty:
  - **Para Bella** — parabola expert, launches with grace, wears glasses with parabola-shaped frames
  - **Root Two-Shoes** — always hits the ground running, has √2 on his shirt
  - **Stretch Armstrong** — loves vertical stretch, tall and lanky character
  - **Sign Language** — flips between positive and negative, has a +/- tattoo
  - **Cubic Sam** — shows up in Chapter 7, does things differently, cube-shaped head

### Environment
- Desert → Forest → Mountains → Space (progresses with chapters)
- Obstacles are academic — book stacks, calculators, protractors, abacuses, chalkboards
- Structures hiding Jock Pigs: football goalposts, trophy cases, dumbbell forts, locker rooms

### Arc Visualization
- **Dotted arc** = predicted trajectory (updates live)
- **Solid trail** = actual path after launch (fades over time)
- **Color coding** — each coefficient has a color. Slider = same color. Equation term = same color. Visual consistency across input and readout
- **Grid toggle** — show/hide coordinate grid. Encourages estimation first, precision later

### Enemies: Bully Pigs
- The targets — round pig faces, each a different bully stereotype
- 🏈 **Jock Pig** — football helmet, basic (1 HP). "Oink and pop" on hit, helmet flies off
- 💰 **Prep Pig** — polo shirt, snooty expression, hides behind expensive barriers (2 HP — polo absorbs one hit)
- 😎 **Cool Pig** — sunglasses, dodges slowly (moving target, 1 HP)
- 👑 **King Pig** — sits on a throne of stolen lunch money, boss (3 HP, reinforced crown)
- 📢 **Whistle Pig** — coach whistle, blows it when hit and spawns a new Jock Pig
- Structures they hide in: football goalposts, trophy cases, luxury car barriers, locker rooms, bleachers

### Nerd Characters (Launchers — they stay put, they launch inventions!)
- **Para Bella** — parabola expert, launches a **rocket** 🚀 (sleek, clean arc), wears glasses with parabola-shaped frames
- **Root Two-Shoes** — always hits the ground running, launches a **bouncing ball** ⚾ (hits ground at roots, bounces up), has √2 on his shirt
- **Stretch Armstrong** — loves vertical stretch, launches a **slinky** 🌀 (visibly stretches/compresses with the arc), tall and lanky
- **Sign Language** — flips between positive and negative, launches a **boomerang** 🪃 (flips direction with sign change), has a +/- tattoo
- **Cubic Sam** — shows up in Chapter 7, does things differently, launches a **drone** 🛸 (S-curve paths), cube-shaped head

The nerds are PUMPED. They high-five on hits. They adjust their glasses and nod approvingly on elegant solutions. They celebrate the math.

---

## Sound & Feedback

- Arc warping: subtle pitch-shifted tone (higher = tighter arc, lower = wider) — synesthetic reinforcement
- Coefficient change: soft "click" with pitch mapped to value
- Target hit: satisfying crash + celebratory chord + nerd cheers ("NICE!" / "Calculated!" / "That's what I call a solution!")
- Miss: comedy "wah wah" — never punishing, always funny. Nerd does an encouraging shrug
- Star earn: ascending arpeggio + nerd fist pump

---

## Monetization

- **Free:** Chapters 1-3 (30 levels) — complete experience, teaches full vertex form
- **Premium unlock:** Chapters 4-8 — advanced forms, multi-shot, non-quadratic functions ($4.99)
- **No ads, no IAP currency, no energy system.** Educational games with predatory monetization are gross.

---

## Technical Architecture (for Claude Code implementation)

### Stack
- **Frontend:** HTML5 Canvas + vanilla JS (or Phaser 3 if heavier game feel desired)
- **Physics:** No physics engine needed — trajectory IS the math function. Projectile follows y = f(x) exactly.
- **State:** Level definitions as JSON, progress in localStorage (upgrade to cloud save later)
- **Build:** Vite, deploy to Vercel/Netlify

### Core Loop (pseudocode)
```
1. Player modifies equation → coefficients update
2. Arc renderer redraws y = f(x) from x=0 to x=screenWidth
3. Player hits "Launch"
4. Projectile animates along the arc (position at time t = f(x), dt per frame)
5. Collision check: does arc pass through target hitbox?
6. Score + stars calculated
7. Next level or retry
```

### File Structure
```
angry-nerds/
├── index.html
├── src/
│   ├── main.js              # Entry point, game loop
│   ├── core/
│   │   ├── equation.js      # Parse, evaluate, render equations
│   │   ├── trajectory.js    # Arc calculation and rendering
│   │   ├── collision.js     # Target hit detection
│   │   └── scoring.js       # Star calculation
│   ├── ui/
│   │   ├── sliders.js       # Coefficient slider controls
│   │   ├── equation-display.js  # Live equation readout
│   │   ├── control-points.js    # Draggable vertex/roots on arc
│   │   └── hud.js           # Stars, level info, buttons
│   ├── levels/
│   │   ├── level-loader.js  # Parse level JSON
│   │   ├── chapters/
│   │   │   ├── chapter1.js  # Stretch levels
│   │   │   ├── chapter2.js  # Shift levels
│   │   │   └── ...
│   │   └── level-schema.json    # Level definition format
│   ├── entities/
│   │   ├── projectile.js    # Animated projectile
│   │   ├── target.js        # Target structures
│   │   ├── jock-pig.js      # Jock Pig variants (helmet, letterman, whistle, captain)
│   │   ├── obstacle.js      # Walls, barriers
│   │   └── nerd.js          # Launcher character
│   ├── education/
│   │   ├── reveal-system.js # Concept reveal triggers
│   │   ├── reveal-cards/    # Educational content per concept
│   │   └── vocabulary.js    # Math term definitions
│   ├── audio/
│   │   └── sound.js         # SFX + dynamic tone
│   └── save/
│       ├── progress.js      # localStorage save/load
│       └── stars.js         # Star tracking
├── assets/
│   ├── sprites/             # Character + obstacle art
│   ├── audio/               # SFX files
│   └── levels/              # Level definition JSONs
├── public/
│   └── ...
├── package.json
├── vite.config.js
└── README.md
```

### Level JSON Schema
```json
{
  "id": "ch1-l03",
  "chapter": 1,
  "name": "Wide Receivers",
  "equationForm": "vertex",
  "lockedCoefficients": { "h": 0, "k": 0 },
  "availableCoefficients": ["a"],
  "coefficientRange": { "a": [-5, -0.1] },
  "defaultEquation": { "a": -1, "h": 0, "k": 0 },
  "launcher": { "x": 50, "y": 400 },
  "targets": [
    { "x": 600, "y": 400, "radius": 30, "type": "primary", "pigType": "helmet" }
  ],
  "obstacles": [],
  "bonusChallenge": {
    "type": "checkpoint",
    "point": { "x": 300, "y": 200 },
    "radius": 20
  },
  "starCriteria": {
    "oneStar": "hitTarget",
    "twoStar": { "maxCoefficientChanges": 2 },
    "threeStar": "hitBonus"
  },
  "revealAfter": {
    "concept": "leading_coefficient",
    "title": "The Leading Coefficient",
    "body": "The number `a` in y = ax² is called the leading coefficient. It controls how wide or narrow the parabola opens. |a| > 1 makes it narrower, |a| < 1 makes it wider.",
    "vocabulary": ["leading coefficient", "vertical stretch", "compression"]
  }
}
```

### Jock Pig Types
```json
{
  "pigTypes": {
    "helmet": { "hp": 1, "helmet": "football", "sound": "oink", "description": "Basic Jock Pig in a football helmet" },
    "letterman": { "hp": 2, "helmet": "none", "jacket": true, "sound": "bro_oink", "description": "Letterman jacket absorbs one hit" },
    "whistle": { "hp": 1, "helmet": "football", "whistle": true, "sound": "tweet_oink", "spawnsPig": true, "description": "Blows whistle on hit, spawns a new Helmet Pig" },
    "captain": { "hp": 3, "helmet": "reinforced", "sound": "boss_oink", "description": "Boss pig with reinforced helmet, takes 3 hits" }
  }
}
```

### Key Implementation Notes
- **No physics engine.** The trajectory is a pure mathematical function. Collision = "does the arc y=f(x) pass within radius r of target center (tx, ty)?" This is a simple distance check, not a simulation.
- **Real-time arc update.** On every slider/control-point drag event, recalculate and redraw the arc. Should be 60fps with no visible lag.
- **Control points.** Dragging the vertex on the arc should solve for (h,k) in real-time. Dragging a root should solve for r₁ or r₂. This requires solving the equation backwards from the point position — straightforward algebra, not numerical optimization.
- **Animation.** The projectile launch is just parameterizing x from 0 to target over ~1.5 seconds, computing y = f(x) per frame. No physics, no gravity, no delta-time. Pure math.
- **Mobile-first.** Sliders must work with touch. Control points must be large enough to grab on a phone screen. Minimum touch target: 44px.

---

## Phase Plan (for Claude Code)

### Phase 1: Core Prototype
- Canvas rendering of a parabola arc
- One slider (coefficient `a`) that updates the arc in real-time
- One target hitbox
- Collision detection (arc passes through target)
- Launch animation (projectile follows arc)
- Basic win/lose state

### Phase 2: Vertex Form
- Add h, k sliders
- Draggable vertex control point on arc
- 10 test levels (Chapter 1 + 2)
- Star rating system
- Level select screen

### Phase 3: Full Equation System
- Factored form (roots) as input
- Standard form input
- Form switching (same parabola, different view)
- Chapters 1-5 levels (50 levels)
- Reveal system with educational cards
- Save/load progress

### Phase 4: Polish & Advanced
- Character art and animations
- Sound effects + dynamic tone
- Multi-shot levels (Chapters 6)
- Non-quadratic functions (Chapters 7-8)
- Mobile touch optimization
- Deploy to web

---

## Open Questions
- **Phaser vs vanilla Canvas?** Phaser gives sprite management, scene transitions, and audio for free. Vanilla gives lighter weight and more control. Recommend Phaser for anything beyond prototype.
- **Touch targets on mobile** — will sliders + control points + equation display fit on a phone screen? May need to toggle between "arc view" and "equation view" on small screens.
- **Accessibility** — color-blind friendly (don't rely solely on color for coefficient mapping), screen reader support for equation readout, keyboard-only play.
- **Multiplayer?** Asynchronous "challenge a friend" — share a level + your equation, friend tries to beat your star count. Low-effort viral loop.
