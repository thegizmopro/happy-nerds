import { saveProgress } from '../save/ProgressStore.js';

const STEPS = [
  {
    html: 'Drag the <strong>a</strong> slider to shape your arc. Bigger |a| = steeper drop.',
    targetId: 'sl-a',
    position: 'above',
  },
  {
    html: 'Watch the arc change as you drag. Find the arc that hits the pig.',
    targetId: 'game-canvas',
    position: 'below',
  },
  {
    html: 'Tap <strong>Launch</strong> to fire! If you miss, adjust and try again.',
    targetId: 'btn-launch',
    position: 'above',
  },
];

export class Tutorial {
  constructor() {
    this._overlay = null;
    this._step = 0;
    this._progress = null;
  }

  shouldShow(globalIndex, progress) {
    return globalIndex === 0 && !progress.tutorialDone;
  }

  show(progress) {
    this._progress = progress;
    this._step = 0;
    this._render();
  }

  _render() {
    this._removeOverlay();

    const step = STEPS[this._step];
    const overlay = document.createElement('div');
    overlay.className = 'tutorial-overlay';

    const bubble = document.createElement('div');
    bubble.className = `tutorial-bubble tutorial-bubble-${step.position}`;
    bubble.innerHTML = `<p>${step.html}</p><button class="tutorial-got-it">Got it</button>`;
    overlay.appendChild(bubble);
    document.body.appendChild(overlay);
    this._overlay = overlay;

    const target = document.getElementById(step.targetId);
    if (target) {
      target.classList.add('tutorial-highlight');
      // Position after paint so offsetWidth/Height are available
      requestAnimationFrame(() => this._positionBubble(bubble, target, step.position));
    }

    const btn = bubble.querySelector('.tutorial-got-it');
    btn.addEventListener('click', () => this._next());
    btn.addEventListener('touchend', e => { e.preventDefault(); this._next(); });
  }

  _positionBubble(bubble, target, position) {
    const rect = target.getBoundingClientRect();
    const bw = bubble.offsetWidth;
    const bh = bubble.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const GAP = 14;

    let top = position === 'above'
      ? rect.top - bh - GAP
      : rect.bottom + GAP;
    let left = rect.left + rect.width / 2 - bw / 2;

    // Clamp to viewport with 8px margin
    left = Math.max(8, Math.min(left, vw - bw - 8));
    top  = Math.max(8, Math.min(top,  vh - bh - 8));

    bubble.style.top  = `${top}px`;
    bubble.style.left = `${left}px`;
  }

  _next() {
    document.getElementById(STEPS[this._step].targetId)?.classList.remove('tutorial-highlight');
    this._step++;
    if (this._step >= STEPS.length) {
      this._complete();
    } else {
      this._render();
    }
  }

  _complete() {
    this._progress.tutorialDone = true;
    saveProgress(this._progress);
    this._removeOverlay();
  }

  hide() {
    STEPS.forEach(s => document.getElementById(s.targetId)?.classList.remove('tutorial-highlight'));
    this._removeOverlay();
  }

  _removeOverlay() {
    if (this._overlay) {
      this._overlay.remove();
      this._overlay = null;
    }
  }
}
