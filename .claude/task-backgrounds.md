## Task: Chapter Backgrounds (Canvas-Drawn School Environments)

Replace the plain gradient background with themed school environments. Each chapter gets a distinct setting.

**Background designs (all Canvas 2D API, no images):**

| Ch | Theme | Background |
|---|---|---|
| 1 | Stretch | **Bus stop** — road, bus stop sign post, sky gradient, school silhouette in distance |
| 2 | Vertex | **Hallway** — lockers on left/right, tile floor, ceiling lights |
| 3 | Sign | **Classroom** — chalkboard, desks, clock, window |
| 4 | Factored | **Cafeteria** — lunch tables, tray return, floor tiles |
| 5 | Standard | **Library** — bookshelves, study carrels, lamp |
| 6 | Multi-shot | **Gym** — court lines, bleachers, scoreboard |
| 7 | Cubic | **Science lab** — lab tables, beakers, periodic table |
| 8 | Boss | **Principal's office** — desk, bookshelf, nameplate |

**Rules:**
- Keep simple — geometric shapes, not detailed art
- Muted colors so gameplay pops against them
- Ground line is the floor level
- Background fills the entire canvas
- Read the chapter number from session.config.chapter

**In `src/renderer/Renderer.js`:**
Replace `_drawBackground(launcher)` with chapter-aware version that calls `_drawBusStop(ctx)`, `_drawHallway(ctx)`, etc. based on the chapter number stored in a new instance variable set during `draw()`.

**Also: rename pig drawing methods from `_drawHelmetPig` etc to human names:**
- `_drawHelmetPig` → `_drawJock`
- `_drawLettermanPig` → `_drawVarsity`  
- `_drawCoolPig` → `_drawSkater`
- `_drawWhistlePig` → `_drawCoach`
- `_drawKingPig` → `_drawBullyBoss`

Change the target visuals to human characters:
- Flesh-colored head (#fde68a) instead of green body
- Hair, accessories, clothing instead of pig features
- Jock: football helmet on flesh head, jersey shoulders
- Varsity: letterman jacket, backwards cap on flesh head
- Skater: beanie, sunglasses on flesh head
- Coach: whistle on lanyard, clipboard, coach cap on flesh head
- BullyBoss: larger, leather jacket, slicked hair on flesh head

Do NOT change the pigType field name or game logic. Only change visuals.

### Constraints
- Canvas 2D only, no images
- Backgrounds must not obscure targets/arc
- Human targets fit inside existing circle hitbox
- Do NOT change hitbox sizes, positions, or game logic
- Do NOT change pigType field names
