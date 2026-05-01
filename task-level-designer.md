# Task: Build Level Designer for Happy Nerds

Build a standalone level designer at `level-designer.html` in the project root.

## Project Context
- Project dir: `C:\Users\kenzo\.openclaw\workspace\projects\happy_nerds`
- Game world: 12 units wide x 9 units tall
- Game canvas renders in a coordinate system where y=0 is ground, y goes up
- Launcher typically at (1, 4.5) but can be anywhere
- Block types: glass (1 HP, blue tint), wood (2 HP, brown), concrete (2 HP, gray), stone (indestructible, dark gray)
- Targets (pigs): types = helmet, letterman, varsity, coach, skater, bully, king — each with radius and optional HP
- Level JSON format matches chapter files — see examples below

## Requirements

### Canvas/Grid
- Full game-world canvas: 12 wide x 9 tall units
- Grid lines every 0.5 units (subtle), major lines every 1 unit
- Coordinate labels on edges
- Background should look like the game (sky blue gradient, ground line at y=0)
- Zoom controls or scroll-to-zoom

### Block Palette (left sidebar)
- Buttons for each block type: glass, wood, concrete, stone
- Width/height inputs (default 0.5 x 0.5)
- Target button with pigType dropdown and HP input
- "Wall" mode (indestructible, no blockType — just coordinates)
- Selected item highlights in palette

### Placement
- Click canvas to place selected item at grid-snapped position (snap to 0.1 units)
- Drag placed items to reposition
- Click placed item to select it (highlight border)
- Delete key or delete button to remove selected item
- Resize handles on selected items (drag corners to resize)

### Properties Panel (right sidebar)
- Shows properties of selected item:
  - Block: id, x, y, width, height, blockType, hp
  - Target: id, x, y, radius, pigType, hp, restingOn (dropdown of obstacle ids)
  - Wall: id, x, y, width, height
- Editable fields that update in real-time
- Auto-generate IDs (obs_1, obs_2, pig_1, pig_2, etc.)

### Arc Testing
- Sliders for all equation params: a, h, k, r1, r2, b, c
- Equation form dropdown: stretch, vertex, factored, standard
- Active coefficients checkboxes (which params the player controls)
- Real-time arc rendering on the canvas (yellow parabola overlay)
- Arc uses same math as the game — import or replicate `evalForm` from `src/core/equation.js`
- Launcher shown as a dot on the canvas (draggable)
- Arc should respect obstacle collision (bounce) — at minimum, show where arc hits first obstacle
- "Fire Test" button that animates the projectile along the arc
- Show hit/miss result

### Level Config
- Form fields for: id, chapter, levelInChapter, title, hint, bonusShots, equationForm
- Star thresholds inputs
- Bonus ring toggle with position inputs
- Generate valid JSON matching this exact format:
```js
{
  id: 'ch1-l1', chapter: 1, levelInChapter: 1,
  title: 'First Shot',
  equationForm: 'stretch',
  activeCoefficients: ['a'],
  sliderConfig: { a: { min: -0.50, max: -0.05, step: 0.01 } },
  defaultParams: { a: -0.20, h: 0, k: 0 },
  launcher: { x: 1, y: 4.5 },
  targets: [{ id: 'main', x: 4.0, y: 0.6, radius: 0.45, pigType: 'helmet', hp: 1, moving: null, restingOn: null }],
  obstacles: [
    { id: 'wall1', x: 4.5, y: 0.6, width: 0.5, height: 3.0, blockType: 'stone', hp: 3, supports: [] },
  ],
  bonusRing: null,
  bonusShots: 0,
  starThresholds: [1, 1],
  starMode: 'moves',
  revealAfter: null,
  hint: 'Some hint text',
  theme: 'desert',
}
```

### Export/Import
- "Copy to Clipboard" button → copies level as JS object literal
- "Save to File" button → downloads as .js
- "Import" button → paste or upload a level config to edit
- Save/load level library to localStorage (named saves)

### Visual Style
- Dark theme matching the game's UI (#0f172a backgrounds, #e2e8f0 text)
- Blocks rendered with same colors as game:
  - Glass: rgba(135, 206, 250, 0.6) with blue border
  - Wood: #8B6914 with brown border  
  - Concrete: #808080 with gray border
  - Stone: #404040 with dark border + hatching pattern
  - Targets: pink circles with face (or just colored circles by pigType)
- Arc: bright yellow line with glow
- Launcher: green dot

### Technical
- Single HTML file with inline CSS and JS (no build step, no imports from game)
- Replicate the arc math locally (evalForm, buildArcPoints, collision detection)
- Use vanilla JS, no frameworks
- Must work in Firefox and Chrome
- Responsive layout — sidebar + canvas fills viewport

## File to Create
- `C:\Users\kenzo\.openclaw\workspace\projects\happy_nerds\level-designer.html`

## IMPORTANT
- This is a standalone tool, NOT part of the game build
- Do NOT modify any existing game files
- The game's arc math is in `src/core/equation.js` and `src/core/arc.js` — read these to replicate
- The collision system is in `src/core/collision.js` — read for bounce detection
- Existing level examples are in `src/levels/chapters/chapter1.js` through `chapter8.js`
- Test by opening the HTML file directly in a browser
