import sys

launcher_x = 1.0
new_y = 2.5

levels = {
    'ch1-l1':  {'tx': 4.0,  'ty': 0.0},
    'ch1-l2':  {'tx': 5.8,  'ty': 1.05},
    'ch1-l3':  {'tx': 6.5,  'ty': 1.25},
    'ch1-l4':  {'tx': 6.8,  'ty': 0.0},
    'ch1-l5':  {'tx': 5.8,  'ty': 1.7},
    'ch1-l6':  {'tx': 7.2,  'ty': 0.0},
    'ch1-l7':  {'tx': 6.5,  'ty': 2.2},
    'ch1-l8':  {'tx': 6.2,  'ty': 1.15},
    'ch1-l9':  {'tx': 7.2,  'ty': 0.25},
    'ch1-l10': {'tx': 7.2,  'ty': 0.2},
}

for lid, d in levels.items():
    dx = d['tx'] - launcher_x
    exact_a = (d['ty'] - new_y) / (dx**2)
    slider_min = exact_a * 2.5
    slider_max = exact_a * 0.35
    default_a = exact_a * 0.6
    print(f"{lid}: ty={d['ty']:5.2f}  a={exact_a:.4f}  slider[{slider_min:.4f}, {slider_max:.4f}]  default={default_a:.4f}")
