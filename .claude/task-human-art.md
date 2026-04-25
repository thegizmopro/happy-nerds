## Task: Redesign Targets as Humans + Chapter Backgrounds

### Part 1: Human Target Characters (Replace Pigs)

Remove all pig/animal references. Targets are now human bully characters that the nerd fights with math. The pigType field stays as internal identifiers but visuals are all human.

**Target types → Human characters:**

| pigType (internal) | Visual Name | Description | Canvas Drawing |
|---|---|---|---|
| `helmet` | **Jock** | Football player, basic bully | Flesh face, blue football helmet, shoulder pads, jersey |
| `letterman` | **Varsity** | Letterman jacket, tougher | Flesh face, red letterman jacket with "B" (for Bully), backwards cap |
| `cool` | **Skater** | Moves around, sunglasses | Flesh face, beanie, sunglasses, hoodie |
| `whistle` | **Coach** | Blows whistle, spawns more | Flesh face, clipboard, whistle on lanyard, coach cap |
| `king` | **Bully Boss** | Big, takes 3 hits | Larger, leather jacket, slicked hair, intimidating |

All characters are human-shaped: circular head (flesh colored #fde68a), simple body below. They stand on the ground/floor level. Keep the same hitbox (circle radius) — the visual is a head+shoulders bust drawn inside that circle area.

**Drawing approach for each:**
- Circle body/head in flesh tone (#fde68a)
- Hair on top (varies by type)
- Eyes (small dots, angry expression)
- Mouth (varies — smirk, shouting, etc)
- Distinctive feature on head/body (helmet, cap, beanie, etc)
- Shoulders visible at circle edge

**Hit states:**
- Flash white on non-lethal hit (same as current)
- X-eyes + tongue on kill (same as current)
- Fade out on death (same as current)

### Part 2: Chapter Backgrounds

Replace the plain gradient backgrounds with themed school environments. Each chapter gets a distinct setting drawn with Canvas 2D API.

**Chapter backgrounds:**

| Chapter | Theme | Background |
|---|---|---|
| Ch1 | Desert/Basic | **School bus stop** — road at bottom, bus stop sign, sky gradient, distant school building silhouette |
| Ch2 | Vertex/Shift | **School hallway** — lockers on left and right sides, tile floor, fluorescent lights on ceiling, "MATH WING" sign |
| Ch3 | Sign/Shape | **Classroom** — chalkboard on back wall, desks in foreground, clock on wall, window with tree visible |
| Ch4 | Roots/Factored | **Cafeteria** — lunch tables, tray return, "TODAY'S SPECIAL" menu board, floor tiles |
| Ch5 | Standard | **Library** — bookshelves lining walls, study carrels, "QUIET PLEASE" sign, lamp |
| Ch6 | Multi-shot | **Gym** — basketball court lines, bleachers, scoreboard, hoop on wall |
| Ch7 | Cubic | **Science lab** — lab tables, beakers on shelves, periodic table on wall, safety shower |
| Ch8 | Boss | **Principal's office** — desk, bookshelf, "PRINCIPAL" nameplate, certificates on wall |

**Background drawing approach:**
- Draw in `_drawBackground(launcher)` method (already exists)
- Keep it simple — architectural shapes, not detailed illustrations
- The ground line (y = launcher.y for most chapters) is the floor level
- Background elements should NOT interfere with gameplay visibility
- Use muted, slightly dark colors so the arc and targets pop against them
- Static elements only — no animation needed

### Implementation

**In `src/renderer/Renderer.js`:**

1. Replace `_drawXxxPig` methods with `_drawJock`, `_drawVarsity`, `_drawSkater`, `_drawCoach`, `_drawBullyBoss`
2. Replace `_drawBackground(launcher)` with chapter-aware background selection
3. Add background drawing methods: `_drawBusStop`, `_drawHallway`, `_drawClassroom`, `_drawCafeteria`, `_drawLibrary`, `_drawGym`, `_drawLab`, `_drawOffice`

**In level data files:**
- Add `theme` field if not present (most already have it: 'desert', 'campus', 'lab')
- Map themes to backgrounds

### Constraints
- ALL art drawn with Canvas 2D API — no image files
- Human targets must fit inside the existing circle hitbox radius
- Backgrounds must not obscure targets or arc
- Keep drawings simple and clear at game scale
- Do NOT change hitbox sizes, positions, or game logic
- Do NOT change the `pigType` field name (internal only, not shown to player)
- The word "pig" should not appear in any user-visible text

### Verification
1. All targets appear as human characters (not pigs)
2. Each target type is visually distinct
3. Chapter backgrounds match the theme (bus stop, hallway, classroom, etc.)
4. Backgrounds don't obscure gameplay
5. Hit/kill animations still work (flash white, X-eyes, fade)
6. HP dots still render above multi-HP targets
