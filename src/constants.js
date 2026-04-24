export const WORLD_W = 10;
export const WORLD_H = 6;
export const SCALE   = 70;
export const CANVAS_W = WORLD_W * SCALE;
export const CANVAS_H = WORLD_H * SCALE;

export const GROUND_Y = 0.6; // world y of the ground line

export function w2c(wx, wy) {
  return { cx: wx * SCALE, cy: CANVAS_H - wy * SCALE };
}

// Coefficient color palette — consistent across sliders, equation display, canvas
export const COEFF_COLORS = {
  a:  '#fb923c', // orange
  h:  '#a78bfa', // violet
  k:  '#34d399', // green (often derived)
  r1: '#38bdf8', // sky
  r2: '#f472b6', // pink
  b:  '#facc15', // yellow
  c:  '#34d399', // green
};

export const PREMIUM_CHAPTER_START = 4; // chapters 4-8 require unlock
