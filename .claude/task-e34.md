## Task: E-34 — Draggable Control Points on Arc

### Problem
Players can only manipulate the trajectory via sliders. The design doc specifies that dragging the vertex, roots, and y-intercept directly on the canvas should be a primary input method — more tactile and intuitive than sliders. This is the biggest feel upgrade in the project.

### What to Build

1. **Vertex control point:** A draggable circle on the arc's vertex. Dragging it updates (h, k) in real-time. The sliders should update to match (bidirectional).

2. **Root control points (factored form only):** Draggable circles at the arc's x-intercepts (where y=0). Dragging updates r₁, r₂. Only visible when equation form is `factored`.

3. **Y-intercept control point (standard form only):** Draggable circle at x=0 on the arc. Dragging updates the `c` coefficient. Only visible when equation form is `standard`.

4. **Control point appearance:** 20px filled circles, color-matched to the corresponding coefficient slider. When hovered/dragged, they enlarge slightly and get a white stroke outline.

5. **Touch targets:** 44px minimum invisible hit area around each control point (the visible circle can be 20px, but the clickable/draggable region must be 44px).

6. **Bidirectional slider sync:** Dragging a control point updates the corresponding slider(s). Moving a slider updates the control point position. Neither should cause infinite update loops.

### Implementation Details

**New file: `src/ui/ControlPoints.js`**

This module handles all control point interaction on the canvas:

```
export class ControlPoints {
  constructor(canvas, session, onCoeffChange)
  
  // Hit test: returns { coeff: 'h', ... } or null
  hitTest(canvasX, canvasY)
  
  // Start drag
  startDrag(cp, canvasX, canvasY)
  
  // Update drag — compute new coefficient values from drag position
  updateDrag(canvasX, canvasY)
  
  // End drag
  endDrag()
  
  // Get positions of all control points for current session state
  getControlPoints() → [{ x, y, coeff, color, radius }]
}
```

**Key math — reverse-solving from drag position:**

- **Vertex drag (vertex form):** 
  - Given new vertex position (wx, wy) in world coords:
  - h = wx - launcher.x (local x of vertex)
  - k = wy - launcher.y (local y of vertex)
  - `a` stays the same

- **Vertex drag (standard form):**
  - Given new vertex (vx, vy) and current `a`:
  - h_local = vx - launcher.x, k_local = vy - launcher.y
  - b = -2 * a * h_local
  - c = a * h_local² + k_local

- **Vertex drag (factored form):**
  - Given new vertex (vx, vy) and current `a`:
  - h_local = vx - launcher.x
  - midpoint = h_local
  - discriminant = k_local / (-a)  where k_local = vy - launcher.y
  - r1 = midpoint + sqrt(discriminant)
  - r2 = midpoint - sqrt(discriminant)
  - (If discriminant < 0, vertex can't be dragged there — clamp)

- **Root drag (factored form):**
  - Given new root position at (wx, 0) in world coords:
  - r = wx - launcher.x (local x of root)
  - Update the specific r₁ or r₂

- **Y-intercept drag (standard form):**
  - Given position (0, wy) → local y = wy - launcher.y
  - c = local y

**In `src/renderer/Renderer.js`:**

- Add a `_drawControlPoints(session, controlPoints)` method
- Draw filled circles at each control point position
- Color = COEFF_COLORS[coeff] (h=violet, k=green, r1=sky, r2=pink, c=green)
- Active/dragged point: slightly larger radius + white stroke
- Draw labels near points: "vertex", "root", "y-int"

**In `src/game/GameController.js`:**

- On mouse/touch events on the canvas:
  - mousedown/touchstart: hit test against control points, if hit → start drag
  - mousemove/touchmove: if dragging → update coefficients via onCoeffChange
  - mouseup/touchend: end drag
- The control points module needs access to the session and the coefficient change callback

**In `src/ui/UIController.js`:**

- No changes needed for sliders — they already listen to session state and update. When coefficients change via control point drag, the slider values will update through the existing onCoeffChange flow.

### Coordinate System Reminder
- World coords: x=[0,10], y=[0,6], origin at bottom-left
- Canvas coords: canvasX = worldX * SCALE, canvasY = CANVAS_H - worldY * SCALE
- Launcher is at world position (launcher.x, launcher.y)
- Arc points are in world coords
- Use `w2c()` from constants.js for world-to-canvas conversion
- Use inverse for canvas-to-world: wx = cx / SCALE, wy = (CANVAS_H - cy) / SCALE

### Files to Modify
- `src/ui/ControlPoints.js` — NEW: hit testing, drag handling, reverse-solving
- `src/renderer/Renderer.js` — draw control points on canvas
- `src/game/GameController.js` — wire mouse/touch events to ControlPoints
- `src/constants.js` — no changes needed (w2c already exists)

### Constraints
- Do NOT modify any level data files
- Do NOT modify the equation system
- Do NOT modify the slider system (it works, just needs to stay in sync)
- Control points should only appear when the corresponding coefficient is active and unlocked
- Control points must not appear during flight animation (gameState !== 'idle')
- On mobile, touch drag must work and not conflict with page scrolling (preventDefault on canvas touches)

### Verification
After making changes, verify:
1. Vertex control point appears on the arc and can be dragged
2. Dragging the vertex updates h and k sliders in real-time
3. Moving h or k sliders moves the vertex control point
4. Root control points appear only in factored form and are draggable
5. Y-intercept control point appears only in standard form
6. Control points don't appear during flight
7. No infinite update loops between sliders and control points
8. Touch drag works on mobile (prevent scroll on canvas)
