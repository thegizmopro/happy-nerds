// Manages a single oscillating target. tick(dt) advances state.
// config: { axis: 'x'|'y', min, max, speed }  — world units/second
export class MovingTarget {
  constructor(baseX, baseY, config) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.config = config;
    // Start at center of range
    this._t = 0; // phase 0-1 through one full oscillation
    this._dir = 1;
    const { min, max } = config;
    this._pos = (min + max) / 2;
  }

  tick(dt) {
    const { min, max, speed } = this.config;
    const range = max - min;
    if (range <= 0) return;
    const step = (speed * dt) / range; // fraction of range per second
    this._t += step * this._dir;
    if (this._t >= 1) { this._t = 1; this._dir = -1; }
    if (this._t <= 0) { this._t = 0; this._dir = 1; }
    this._pos = min + this._t * range;
  }

  get worldX() {
    return this.config.axis === 'x' ? this._pos : this.baseX;
  }

  get worldY() {
    return this.config.axis === 'y' ? this._pos : this.baseY;
  }

  snapshot() {
    return { x: this.worldX, y: this.worldY };
  }
}
