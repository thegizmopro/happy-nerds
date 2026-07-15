# Full recalculation with per-level launcher heights where needed
# Rule: launcher must be above target for stretch form (a must be negative)

levels = [
    # id,        tx,   ty,   launcher_y, note
    ('ch1-l1',   4.0,  0.45, 2.5,        'ground target'),
    ('ch1-l2',   5.8,  1.2,  2.5,        'glass floor'),
    ('ch1-l3',   6.5,  1.7,  2.5,        'shelf'),
    ('ch1-l4',   6.8,  0.45, 2.5,        'ground + wall(1.5) + glass(0.8)'),
    ('ch1-l5',   5.8,  2.5,  3.5,        'tower top -- raise launcher to 3.5'),
    ('ch1-l6',   7.2,  0.45, 2.5,        'ground in chamber'),
    ('ch1-l7',   6.5,  2.9,  4.0,        '2nd floor -- raise launcher to 4.0'),
    ('ch1-l8',   6.2,  1.6,  2.5,        'moving on shelf'),
    ('ch1-l9',   7.2,  0.8,  2.5,        'glass cage'),
    ('ch1-l10',  7.2,  0.55, 2.5,        'king in fortress'),
]

lx = 1.0  # launcher x

for lid, tx, ty, ly, note in levels:
    dx = tx - lx
    exact_a = (ty - ly) / (dx**2)
    
    if exact_a >= 0:
        print(f"!!! {lid}: POSITIVE a={exact_a:.4f} -- BROKEN!")
        continue
    
    # Slider: 2.5x below exact (flatter) to 0.35x above (steeper)
    s_min = exact_a * 2.5
    s_max = exact_a * 0.35
    s_min_r = round(s_min, 4)
    s_max_r = round(s_max, 4)
    default_r = round(exact_a * 0.6, 4)
    
    rng = abs(s_min_r - s_max_r)
    if rng > 0.15:
        step = 0.01
    elif rng > 0.05:
        step = 0.005
    else:
        step = 0.002
    
    print(f"{lid}: ly={ly} ty={ty} a={exact_a:.4f} slider=[{s_min_r}, {s_max_r}] step={step} default={default_r}  # {note}")
