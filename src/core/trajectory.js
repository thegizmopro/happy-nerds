import { evalVertex } from './equation.js';

// Draws the predicted arc as a dotted line.
// Canvas uses standard math coords (y up) — the transform is applied in main.js.
export function drawArc(ctx, coeffs, worldWidth, worldHeight, launchX) {
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  let started = false;
  const steps = 300;
  for (let i = 0; i <= steps; i++) {
    const x = launchX + (i / steps) * (worldWidth - launchX);
    const y = evalVertex(x - launchX, coeffs); // x relative to launcher
    if (y < -worldHeight * 0.1 || y > worldHeight * 1.5) {
      started = false;
      continue;
    }
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

// Returns array of {x, y} world-space points along the arc for animation.
export function buildArcPoints(coeffs, worldWidth, launchX, steps = 120) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = launchX + t * (worldWidth - launchX);
    const y = evalVertex(x - launchX, coeffs);
    points.push({ x, y });
  }
  return points;
}
