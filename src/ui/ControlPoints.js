import { CANVAS_H, SCALE, COEFF_COLORS, WORLD_W } from '../constants.js';
import { findVertexPoint } from '../core/arc.js';

const HIT_RADIUS  = 22; // 44px touch target / 2
const VISUAL_R    = 10;
const ACTIVE_R    = 13;

function c2w(cx, cy) {
  return { wx: cx / SCALE, wy: (CANVAS_H - cy) / SCALE };
}

export class ControlPoints {
  constructor(getSession, onDrag) {
    this._getSession  = getSession;
    this._onDrag      = onDrag;
    this._dragging    = null; // { cp }
    this._hoveredCoeff = null;
  }

  get _session() { return this._getSession(); }

  getControlPoints() {
    const session = this._session;
    if (!session || session.gameState !== 'idle') return [];

    const form        = session.currentForm();
    const params      = session.getEffectiveParams();
    const launcher    = session.config.launcher;
    const activeSet   = new Set(session.currentActiveCoeffs());
    const locked      = session.config.lockedCoefficients ?? {};
    const active      = this._dragging?.cp.coeff ?? this._hoveredCoeff;

    const avail = (c) => activeSet.has(c) && !Object.prototype.hasOwnProperty.call(locked, c);
    const pt = (coeff, x, y, color, label) => ({
      coeff, x, y, color, label,
      radius: coeff === active ? ACTIVE_R : VISUAL_R,
      active: coeff === active,
    });

    const points = [];

    // Vertex (all forms except stretch)
    if (form !== 'stretch') {
      const vertexCoeffsByForm = { vertex: ['h','k'], standard: ['b','c'], factored: ['r1','r2'] };
      const vCoeffs = vertexCoeffsByForm[form] ?? [];
      if (vCoeffs.some(avail)) {
        const v = findVertexPoint(form, params, launcher, WORLD_W - launcher.x);
        if (v.y > launcher.y + 0.05) {
          points.push(pt('vertex', v.x, v.y, COEFF_COLORS.h, 'vertex'));
        }
      }
    }

    // Root points (factored only)
    if (form === 'factored') {
      if (avail('r1')) points.push(pt('r1', launcher.x + params.r1, launcher.y, COEFF_COLORS.r1, 'root₁'));
      if (avail('r2')) points.push(pt('r2', launcher.x + params.r2, launcher.y, COEFF_COLORS.r2, 'root₂'));
    }

    // Y-intercept (standard only)
    if (form === 'standard' && avail('c')) {
      points.push(pt('c', launcher.x, launcher.y + params.c, COEFF_COLORS.c, 'y-int'));
    }

    return points;
  }

  hitTest(canvasX, canvasY) {
    for (const cp of this.getControlPoints()) {
      const cx = cp.x * SCALE;
      const cy = CANVAS_H - cp.y * SCALE;
      const dx = canvasX - cx, dy = canvasY - cy;
      if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) return cp;
    }
    return null;
  }

  startDrag(cp) {
    this._dragging = { cp };
  }

  updateDrag(canvasX, canvasY) {
    if (!this._dragging) return;
    const session  = this._session;
    if (!session)  return;

    const { cp }   = this._dragging;
    const launcher = session.config.launcher;
    const params   = session.getEffectiveParams();
    const form     = session.currentForm();
    const sliderCfg = session.currentSliderConfig();

    const { wx, wy } = c2w(canvasX, canvasY);
    const localX = wx - launcher.x;
    const localY = wy - launcher.y;

    const clamp = (coeff, val) => {
      const sc = sliderCfg[coeff];
      return sc ? Math.max(sc.min, Math.min(sc.max, val)) : val;
    };

    const changes = {};

    if (cp.coeff === 'vertex') {
      if (form === 'vertex') {
        changes.h = clamp('h', localX);
        changes.k = clamp('k', localY);
      } else if (form === 'standard') {
        const a = params.a;
        changes.b = clamp('b', -2 * a * localX);
        changes.c = clamp('c', a * localX * localX + localY);
      } else if (form === 'factored') {
        const a = params.a;
        const disc = localY / (-a);
        if (disc >= 0) {
          const sqrtD = Math.sqrt(disc);
          changes.r1 = clamp('r1', localX + sqrtD);
          changes.r2 = clamp('r2', localX - sqrtD);
        }
        // disc < 0 → vertex below axis → ignore drag
      }
    } else if (cp.coeff === 'r1' || cp.coeff === 'r2') {
      changes[cp.coeff] = clamp(cp.coeff, localX);
    } else if (cp.coeff === 'c') {
      changes.c = clamp('c', localY);
    }

    if (Object.keys(changes).length) this._onDrag(changes);
  }

  endDrag() {
    this._dragging = null;
  }

  setHovered(coeff) {
    this._hoveredCoeff = coeff;
  }

  isDragging() {
    return this._dragging !== null;
  }
}
