// All collision checks operate on pre-built world-space arc point arrays.
// This keeps collision detection form-agnostic.

// Returns true if any arc point is within target.radius of (target.x, target.y).
export function arcHitsTarget(arcPoints, target) {
  const { x: tx, y: ty, radius } = target;
  const r2 = radius * radius;
  for (const { x, y } of arcPoints) {
    if ((x - tx) ** 2 + (y - ty) ** 2 <= r2) return true;
  }
  return false;
}

// Returns true if any arc point is inside the obstacle rectangle.
// obstacle: { x, y, width, height } — all world coords.
// x,y is the bottom-left corner.
export function arcHitsObstacle(arcPoints, obstacle) {
  const { x: ox, y: oy, width, height } = obstacle;
  for (const { x, y } of arcPoints) {
    if (x >= ox && x <= ox + width && y >= oy && y <= oy + height) return true;
  }
  return false;
}

// Returns true if the arc clears ALL obstacles (hits none).
export function arcClearsAllObstacles(arcPoints, obstacles) {
  return obstacles.every(obs => !arcHitsObstacle(arcPoints, obs));
}

// Returns the index of the first arc point that intersects the obstacle, or -1.
export function findObstacleIntersection(arcPoints, obstacle) {
  const { x: ox, y: oy, width, height } = obstacle;
  for (let i = 0; i < arcPoints.length; i++) {
    const { x, y } = arcPoints[i];
    if (x >= ox && x <= ox + width && y >= oy && y <= oy + height) return i;
  }
  return -1;
}
