# Happy Nerds — Art Generation Prompts & Specs

## Target Dimensions

| Asset | Canvas Size | Rendered Size | Recommended Source Size |
|---|---|---|---|
| Background | 700 × 420 px | Full canvas | **1400 × 840 px** (2x for retina) |
| Character (nerd) | ~50 × 60 px | ~1 world unit tall | **200 × 240 px** (4x, then scaled down) |
| Target (bully) | ~50 × 50 px | ~0.45 world unit radius | **200 × 200 px** (4x) |
| Target (boss) | ~60 × 60 px | ~0.55 world unit radius | **240 × 240 px** (4x) |

**DPI**: Doesn't matter — these are screen pixels, not print. Just match the pixel dimensions above.

**Format**: PNG with transparent background. Sprite sheets optional (separate frames per animation state).

**Style**: Cartoon, bold outlines, saturated colors, school/college theme. Think *College Humor* meets *Angry Birds* character art. Round features, expressive faces, thick black outlines (#000 or #1e293b).

---

## Character Prompts (3 Nerds)

### Calculator Carl (Chapters 1-2)

**Prompt:**
> Cartoon character sprite, front-facing, transparent background. A nerdy teen boy with short brown hair, thick black-framed glasses, and a friendly determined expression. Wearing a blue t-shirt with a small calculator icon on the chest, dark blue jeans, and brown sneakers. Holding a yellow pencil in his right hand pointing upward. Bold black outlines, saturated colors, school theme. Flat 2D cartoon style, no shading. Standing pose with arms slightly at sides.

**Animation frames needed:**
1. **Idle**: Pencil pointing down at side
2. **Celebrating**: Both arms raised, pencil pointing up, big smile
3. **Miss**: Shoulders slumped, arms down, sad expression

---

### Formula Fiona (Chapters 3-4)

**Prompt:**
> Cartoon character sprite, front-facing, transparent background. A nerdy teen girl with long purple hair falling past shoulders, cat-eye glasses with thick frames, and a confident smirk. Wearing a pink t-shirt with an integral symbol (∫) on the chest, dark indigo jeans, and purple sneakers. Holding a yellow spiral notebook with ruled lines in her right hand. Bold black outlines, saturated colors, school theme. Flat 2D cartoon style, no shading. Standing pose.

**Animation frames needed:**
1. **Idle**: Notebook at side
2. **Celebrating**: Both arms up, notebook raised high, excited expression
3. **Miss**: Shoulders slumped, notebook dropped at side, disappointed

---

### Proof Pete (Chapters 5-7)

**Prompt:**
> Cartoon character sprite, front-facing, transparent background. A nerdy teen boy with spiky white/gray hair, round goggles with blue lenses and a strap, and a focused expression. Wearing a white lab coat over a green shirt, dark gray pants, and black shoes. Holding a test tube with green liquid and a cap in his right hand. Bold black outlines, saturated colors, science lab theme. Flat 2D cartoon style, no shading. Standing pose.

**Animation frames needed:**
1. **Idle**: Test tube at side
2. **Celebrating**: Both arms up, test tube raised, triumphant grin
3. **Miss**: Shoulders slumped, test tube drooping, frustrated

---

## Target Prompts (5 Bullies)

### Jock (helmet type, 1 HP)

**Prompt:**
> Cartoon character sprite, front-facing, transparent background. A beefy teen bully wearing a yellow football helmet with a face mask, blue football jersey with number 99, and a sneering expression. Squinting angry eyes, thick black outlines, saturated colors. Flat 2D cartoon style. Circular composition (head and shoulders filling a round frame).

**Animation frames:**
1. **Alive**: Sneering, arms crossed
2. **Hit**: Flash white
3. **Dead**: X-eyes, tongue out, dazed

---

### Varsity (letterman type, 2 HP)

**Prompt:**
> Cartoon character sprite, front-facing, transparent background. A tough teen bully wearing a red letterman jacket with a big white "B" on the chest, a blue baseball cap worn backwards, and a determined scowl. Square jaw, thick black outlines, saturated colors. Flat 2D cartoon style. Circular composition (head and shoulders filling a round frame).

**Animation frames:**
1. **Alive**: Scowling, confident
2. **Hit**: Flash white
3. **Dead**: X-eyes, tongue out

---

### Skater (cool type, 1 HP, moves)

**Prompt:**
> Cartoon character sprite, front-facing, transparent background. A laid-back teen bully wearing a gray beanie, black sunglasses, a dark purple hoodie, and a cocky smirk. One eyebrow raised, thick black outlines, saturated colors. Flat 2D cartoon style. Circular composition (head and shoulders filling a round frame).

**Animation frames:**
1. **Alive**: Smirking, too cool
2. **Hit**: Flash white
3. **Dead**: X-eyes, tongue out, sunglasses crooked

---

### Coach (whistle type, 1 HP, spawns)

**Prompt:**
> Cartoon character sprite, front-facing, transparent background. An adult coach bully with a red coach's cap, a silver whistle on a white lanyard around the neck, holding a clipboard in one hand, and a shouting open mouth. Angry eyebrows in a V shape, thick black outlines, saturated colors. Flat 2D cartoon style. Circular composition (head and shoulders filling a round frame).

**Animation frames:**
1. **Alive**: Shouting, blowing whistle
2. **Hit**: Flash white
3. **Dead**: X-eyes, tongue out, whistle dangling

---

### Bully Boss (king type, 3 HP)

**Prompt:**
> Cartoon character sprite, front-facing, transparent background. A large intimidating teen bully boss wearing a black leather jacket over a white shirt, slicked-back dark hair, and a menacing sneer. Larger than the other characters. Gold chain necklace visible. Thick black outlines, saturated colors. Flat 2D cartoon style. Circular composition (head and shoulders filling a round frame).

**Animation frames:**
1. **Alive**: Menacing, sneering
2. **Hit**: Flash white (still tough)
3. **Dead**: X-eyes, tongue out, hair messed up

---

## Background Prompts (8 Chapters)

### Ch1: Bus Stop

**Prompt:**
> Cartoon school bus stop background, horizontal landscape 1400x840 pixels. A suburban sidewalk with a yellow school bus stop sign on the left. Gray road at the bottom, green grass strip, blue sky with a few clouds. A red brick school building silhouette in the far distance. Warm morning light. Flat 2D cartoon style, bold outlines on foreground elements, no characters. Game background aesthetic.

---

### Ch2: School Hallway

**Prompt:**
> Cartoon school hallway background, horizontal landscape 1400x840 pixels. A long school corridor with rows of blue metal lockers on both sides. Beige tile floor with a center line, white ceiling with fluorescent light panels. A "MATH WING" sign on the wall. Perspective receding to the right. Flat 2D cartoon style, muted colors, no characters. Game background aesthetic.

---

### Ch3: Classroom

**Prompt:**
> Cartoon classroom background, horizontal landscape 1400x840 pixels. A classroom viewed from the front. Large green chalkboard on the back wall with math equations written on it. Wooden student desks in rows. A round clock on the wall showing 10:00. A window on the right showing a tree and blue sky. Beige walls, brown floor. Flat 2D cartoon style, no characters. Game background aesthetic.

---

### Ch4: Cafeteria

**Prompt:**
> Cartoon school cafeteria background, horizontal landscape 1400x840 pixels. A school lunchroom with long rectangular tables with bench seats. A "TODAY'S SPECIAL" menu board on the back wall. A tray return station on the left. Checkered floor tiles in white and brown. Overhead lights. Flat 2D cartoon style, muted warm colors, no characters. Game background aesthetic.

---

### Ch5: Library

**Prompt:**
> Cartoon school library background, horizontal landscape 1400x840 pixels. A library with tall wooden bookshelves lining the back wall, filled with colorful book spines. Green study carrels (partitioned desks) in the foreground. A "QUIET PLEASE" sign on the wall. A green banker's lamp on a reading table. Warm wood tones, cozy lighting. Flat 2D cartoon style, no characters. Game background aesthetic.

---

### Ch6: Gymnasium

**Prompt:**
> Cartoon school gymnasium background, horizontal landscape 1400x840 pixels. A basketball court with polished wood floor and court lines. Bleachers (tiered seating) on the left side. A scoreboard on the back wall showing "HOME 00 VISITOR 00". A basketball hoop mounted on the right wall. High ceiling with industrial lights. Flat 2D cartoon style, no characters. Game background aesthetic.

---

### Ch7: Science Lab

**Prompt:**
> Cartoon science lab background, horizontal landscape 1400x840 pixels. A school science lab with black-topped lab tables. Glass beakers and flasks on shelves on the back wall. A periodic table poster on the wall. An emergency safety shower station in the corner. Gray tile floor, white walls. Flat 2D cartoon style, no characters. Game background aesthetic.

---

### Ch8: Principal's Office

**Prompt:**
> Cartoon principal's office background, horizontal landscape 1400x840 pixels. A principal's office with a large wooden desk in the center. A leather chair behind it. Framed certificates and diplomas on the wall. A bookshelf with leather-bound books. A "PRINCIPAL" nameplate on the desk. Wood paneling on the lower walls, cream upper walls. A window with blinds. Flat 2D cartoon style, no characters. Game background aesthetic.

---

## File Naming Convention

```
assets/
  characters/
    carl_idle.png
    carl_celebrate.png
    carl_miss.png
    fiona_idle.png
    fiona_celebrate.png
    fiona_miss.png
    pete_idle.png
    pete_celebrate.png
    pete_miss.png
  targets/
    jock_alive.png
    jock_dead.png
    varsity_alive.png
    varsity_dead.png
    skater_alive.png
    skater_dead.png
    coach_alive.png
    coach_dead.png
    bullyboss_alive.png
    bullyboss_dead.png
  backgrounds/
    bg_ch1_busstop.png
    bg_ch2_hallway.png
    bg_ch3_classroom.png
    bg_ch4_cafeteria.png
    bg_ch5_library.png
    bg_ch6_gym.png
    bg_ch7_lab.png
    bg_ch8_office.png
```

## Notes

- **Hit flash** (white overlay) is done in code — no need for separate white-frame images
- **HP dots** are drawn in code — don't include them in the art
- **Bonus rings** and **obstacles** are drawn in code — don't include in backgrounds
- Characters and targets should have **transparent backgrounds** (PNG alpha)
- Backgrounds should be **full opaque** — they fill the entire canvas
- If using AI generation, generate at 2-4x the target size, then downscale for crisp edges
- Consistent style across all assets is more important than individual detail
