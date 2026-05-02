import { evalForm } from './equation.js';
import { findObstacleIntersection } from './collision.js';
import { GROUND_Y } from '../constants.js';

// Build world-space arc points for a given equation form and params.
// launcher: { x, y } in world coords.
// worldSpan: how far right to evaluate (WORLD_W - launcher.x).
// Returns [{x, y}] in world coords.
export function buildArcPoints(form, params, launcher, worldSpan, steps = 200) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const localX = (i / steps) * worldSpan;
    const localY = evalForm(localX, form, params);
    pts.push({ x: launcher.x + localX, y: launcher.y + localY });

    // Stop once arc has clearly gone below ground (saves samples for descending arcs)
    if (i > 10 && localY < -5) break;
  }
  return pts;
}

// Find x where arc returns to local y=0 after its peak (the "landing x").
// Returns world x, or null if arc never returns.
export function findLandingX(form, params, launcher, worldSpan) {
  const steps = 500;
  let peakPassed = false;
  let peakY = -Infinity;

  for (let i = 0; i <= steps; i++) {
    const localX = (i / steps) * worldSpan;
    const localY = evalForm(localX, form, params);
    if (localY > peakY) peakY = localY;
    else if (peakY > 0 && !peakPassed) peakPassed = true;

    if (peakPassed && localY <= 0) {
      return launcher.x + localX;
    }
  }
  return null;
}

// Returns arc points clipped at the first obstacle intersection.
// If no obstacle is hit, returns the original array unchanged.
// If session is provided, destroyed destructible blocks are skipped.
// Destructible blocks are NOT clipped — the arc passes through them (damage is applied frame-by-frame).
export function clipArcAtObstacle(arcPoints, obstacles, session) {
  let clipIdx = arcPoints.length; // sentinel: no clip

  // Ground collision — only clip after the arc has risen above ground
  // (In factored form, the arc can start below ground before its first root)
  let hasBeenAboveGround = false;
  for (let i = 1; i < arcPoints.length; i++) {
    if (arcPoints[i].y >= GROUND_Y) hasBeenAboveGround = true;
    if (hasBeenAboveGround && arcPoints[i].y < GROUND_Y) {
      // Interpolate to exact ground hit
      const prev = arcPoints[i - 1];
      const cur = arcPoints[i];
      const t = (prev.y - GROUND_Y) / (prev.y - cur.y);
      arcPoints[i] = {
        x: prev.x + t * (cur.x - prev.x),
        y: GROUND_Y,
      };
      if (i < clipIdx) clipIdx = i;
      break;
    }
  }

  // Obstacle collision
  if (obstacles?.length) {
    for (const obs of obstacles) {
      if (session && obs.blockType && !session.isObstacleAlive(obs.id)) continue;
      if (obs.blockType === 'glass') continue;
      // Destructible blocks with hp <= 1 break on contact — arc passes through
      if (obs.blockType === 'concrete' || obs.blockType === 'wood') {
        const curHP = session?.obstacleHP?.[obs.id] ?? obs.hp ?? 2;
        if (curHP <= 1) continue;
      }
      const idx = findObstacleIntersection(arcPoints, obs);
      if (idx !== -1 && idx < clipIdx) clipIdx = idx;
    }
  }

  if (clipIdx === arcPoints.length) return arcPoints;
  return arcPoints.slice(0, clipIdx + 1); // include the hit point
}

// Find the vertex (max local y) along the arc.
// Returns { x, y } in world coords.
export function findVertexPoint(form, params, launcher, worldSpan) {
  const steps = 400;
  let bestY = -Infinity;
  let bestX = launcher.x;

  for (let i = 0; i <= steps; i++) {
    const localX = (i / steps) * worldSpan;
    const localY = evalForm(localX, form, params);
    if (localY > bestY) {
      bestY = localY;
      bestX = launcher.x + localX;
    }
  }
  return { x: bestX, y: launcher.y + bestY };
}
