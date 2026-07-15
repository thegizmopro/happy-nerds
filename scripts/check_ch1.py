# 1-6: Launcher at (1, 2.5), enclosed chamber
# stone_left at x=6.0 height=2.4, concrete_right at x=8.4 height=2.4
# glass ceiling at y=2.4 spanning x=6.0..8.8
# Target at (7.2, 0.45) inside chamber at ground level
#
# The arc must either:
#   (a) pass THROUGH the glass ceiling (glass doesn't block arc) -> direct hit
#   (b) arc over everything and come down inside
#
# Glass is pass-through for arc (clipArcAtObstacle skips glass)!
# So the arc just needs to reach x=7.2, y=0.45
# a = (0.45 - 2.5) / (7.2 - 1)^2 = -2.05 / 38.44 = -0.0533
#
# Check: does stone_left block it? stone at x=6.0, width=0.4, height=2.4
# Arc y at x=6.0: 2.5 + (-0.0533)*(5.0)^2 = 2.5 - 1.333 = 1.167
# Stone height = 2.4 -> 1.167 < 2.4 -> BLOCKED by stone!
#
# The stone wall is too tall. Arc hits it going in.
# Need to lower stone_left so arc clears it.
# Arc y at x=6.0 is 1.167. Stone must be < 1.167.
# Set stone_left height = 1.0

# Also check concrete_right at x=8.4:
# Arc y at x=8.4: 2.5 + (-0.0533)*(7.4)^2 = 2.5 - 2.919 = -0.419
# That's below ground -- arc has already landed at x=7.2
# So concrete_right doesn't matter for the winning arc.

# With stone_left at 1.0, ceiling must also come down
# ceiling sits on top of stone_left and concrete_right
# If stone=1.0 and concrete=1.0, ceiling at y=1.0
# But that changes the level aesthetic... let's think about this differently.

# Actually the KEY insight: the kill vector for 1-6 is supposed to be
# "arc through glass ceiling". Glass doesn't block arcs. So the winning
# shot goes: launcher -> over/through stone_left -> through glass ceiling -> hit target.
# But stone DOES block. So arc must clear stone_left.
#
# With launcher at 2.5 and a=-0.0533:
#   At stone_left front (x=6.0): y = 1.167
#   Stone height needs to be < 1.167 for arc to clear
#
# Let's set both walls to 1.0 and ceiling at 1.0

import math

lx, ly = 1.0, 2.5
tx, ty = 7.2, 0.45
a = (ty - ly) / (tx - lx)**2
print(f"Exact a: {a:.4f}")

# Check arc height at key x positions
for x, label in [(4.5, "bonus_ring"), (6.0, "stone_left_front"), (6.4, "stone_left_back"),
                  (7.2, "target"), (8.4, "concrete_right_front"), (8.8, "concrete_right_back")]:
    y = ly + a * (x - lx)**2
    print(f"  x={x:5.1f} ({label:25s}): arc_y={y:.3f}")

print()
print("Stone wall at 1.0: arc clears at y=1.167 > 1.0:", 1.167 > 1.0)
print("Concrete wall at 1.0: arc already past target by x=8.4, doesn't matter")
print()
print("New structure: stone_left h=1.0, concrete_right h=1.0, ceiling at y=1.0")
print("Ceiling still supported by walls. Target still inside. Just shorter chamber.")

# Verify ceiling span: stone_left at x=6.0 w=0.4 -> top at x=6.0..6.4
# concrete_right at x=8.4 w=0.4 -> top at x=8.4..8.8
# ceiling spans x=6.0..8.8 (width 2.8) at y=1.0
# Target at (7.2, 0.45) is inside, below ceiling. Good.
