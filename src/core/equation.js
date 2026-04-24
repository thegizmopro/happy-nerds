// All arc evaluation is local to the launcher (x=0 is the launcher position).

export function evalVertex(x, { a, h = 0, k = 0 }) {
  return a * (x - h) ** 2 + k;
}

export function evalStandard(x, { a, b = 0, c = 0 }) {
  return a * x * x + b * x + c;
}

export function evalFactored(x, { a, r1, r2 }) {
  return a * (x - r1) * (x - r2);
}

export function evalCubic(x, { a, h = 0, k = 0 }) {
  return a * (x - h) ** 3 + k;
}

export function evalAbs(x, { a, h = 0, k = 0 }) {
  return a * Math.abs(x - h) + k;
}

export function evalPiecewise(x, { left, right, breakX }) {
  return x <= breakX
    ? evalForm(x, left.form, left.params)
    : evalForm(x, right.form, right.params);
}

// Single entry point — all arc builders and collision detection use this.
export function evalForm(x, form, params) {
  switch (form) {
    case 'stretch':   return evalVertex(x, { a: params.a, h: 0, k: 0 });
    case 'vertex':    return evalVertex(x, params);
    case 'standard':  return evalStandard(x, params);
    case 'factored':  return evalFactored(x, params);
    case 'cubic':     return evalCubic(x, params);
    case 'abs':       return evalAbs(x, params);
    case 'piecewise': return evalPiecewise(x, params);
    default: throw new Error(`Unknown equation form: ${form}`);
  }
}

// k so the arc passes through the launcher (local origin): 0 = a(0-h)^2 + k → k = -ah^2
export function deriveK(a, h) {
  return -a * h * h;
}

// Vertex of factored form: h = (r1+r2)/2, k = evalFactored(h)
export function factoredVertex(params) {
  const h = (params.r1 + params.r2) / 2;
  const k = evalFactored(h, params);
  return { h, k };
}

// Standard form vertex: h = -b/(2a), k = c - b^2/(4a)
export function standardVertex({ a, b, c }) {
  const h = -b / (2 * a);
  const k = c - (b * b) / (4 * a);
  return { h, k };
}

// Format display strings for each form
export function formatEquation(form, params, colors = {}) {
  const c = k => `<span style="color:${colors[k] || '#fff'};font-weight:bold">${k}</span>`;
  switch (form) {
    case 'stretch':
      return `y = ${c('a')}x²`;
    case 'vertex': {
      const hs = params.h >= 0 ? `− ${Math.abs(params.h).toFixed(1)}` : `+ ${Math.abs(params.h).toFixed(1)}`;
      const ks = params.k >= 0 ? `+ ${params.k.toFixed(2)}` : `− ${Math.abs(params.k).toFixed(2)}`;
      return `y = ${c('a')}(x ${hs})² ${ks}`;
    }
    case 'factored': {
      const r1s = params.r1 >= 0 ? `− ${params.r1.toFixed(2)}` : `+ ${Math.abs(params.r1).toFixed(2)}`;
      const r2s = params.r2 >= 0 ? `− ${params.r2.toFixed(2)}` : `+ ${Math.abs(params.r2).toFixed(2)}`;
      return `y = ${c('a')}(x ${r1s})(x ${r2s})`;
    }
    case 'standard': {
      const bs = params.b >= 0 ? `+ ${params.b.toFixed(2)}x` : `− ${Math.abs(params.b).toFixed(2)}x`;
      const cs = params.c >= 0 ? `+ ${params.c.toFixed(2)}` : `− ${Math.abs(params.c).toFixed(2)}`;
      return `y = ${c('a')}x² ${bs} ${cs}`;
    }
    case 'cubic': {
      const hs = params.h >= 0 ? `− ${params.h.toFixed(1)}` : `+ ${Math.abs(params.h).toFixed(1)}`;
      const ks = params.k >= 0 ? `+ ${params.k.toFixed(2)}` : `− ${Math.abs(params.k).toFixed(2)}`;
      return `y = ${c('a')}(x ${hs})³ ${ks}`;
    }
    case 'abs': {
      const hs = params.h >= 0 ? `− ${params.h.toFixed(1)}` : `+ ${Math.abs(params.h).toFixed(1)}`;
      const ks = params.k >= 0 ? `+ ${params.k.toFixed(2)}` : `− ${Math.abs(params.k).toFixed(2)}`;
      return `y = ${c('a')}|x ${hs}| ${ks}`;
    }
    default:
      return 'y = ?';
  }
}
