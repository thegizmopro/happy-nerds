import math

# 1-4: Launcher at (1, 2.5), stone wall at x=4.5, height=2.0
# The arc must clear x=4.5..5.0 at y=2.0 (top of wall)
# Then come back down to hit target at (6.8, 0)
#
# worldY = 2.5 + a*(worldX - 1)^2
# At wall front (x=4.5): y = 2.5 + a*(3.5)^2 = 2.5 + 12.25a  -- needs to be > 2.0
# At target (x=6.8):     y = 2.5 + a*(5.8)^2 = 2.5 + 33.64a  -- needs to equal ~0.45 (radius above ground)
#
# From target: a = (0.45 - 2.5) / 33.64 = -2.05/33.64 = -0.0609
# Check wall clearance: y = 2.5 + (-0.0609)*12.25 = 2.5 - 0.746 = 1.754
# Wall is 2.0 tall -> 1.754 < 2.0 -> BLOCKED. Confirmed.

# Options:
# 1. Lower wall height to 1.5 -> clearance needed: y > 1.5
#    At a=-0.0609: y at wall = 1.754 > 1.5 -> clears! ✓
# 2. Move wall closer (smaller dx -> less drop)
# 3. Raise launcher for this level only

# Let's check option 1: wall height 1.5
# Also need to check the glass_lane obstacle: x=5.8, height=1.2
# At x=5.8: y = 2.5 + (-0.0609)*(4.8)^2 = 2.5 - 1.404 = 1.096
# Glass lane top = 1.2 -> 1.096 < 1.2 -> also blocked!
# Lower glass_lane to height 0.8

# Let's verify with wall=1.5, glass=0.8
launcher_x, launcher_y = 1.0, 2.5
exact_a = (0.45 - launcher_y) / (6.8 - launcher_x)**2
print(f"Exact a for target hit: {exact_a:.4f}")

for x, label in [(4.5, "wall_front"), (5.0, "wall_back"), (5.8, "glass_lane")]:
    y = launcher_y + exact_a * (x - launcher_x)**2
    print(f"  {label} at x={x}: arc y={y:.3f}")

print()
print("Wall height 1.5: ", "CLEAR" if 2.5 + exact_a * 12.25 > 1.5 else "BLOCKED")
print("Glass height 0.8: ", "CLEAR" if 2.5 + exact_a * 23.04 > 0.8 else "BLOCKED")

# Also check: target at y=0, radius 0.45 -> center should be at y=0.45 so it sits ON ground
print()
print("--- Target Y fix ---")
print(f"Targets at y=0 should be y=0.45 (radius) so they sit on ground, not sink")
