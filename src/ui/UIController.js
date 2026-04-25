import { CHAPTERS, getChapterForLevel, totalLevels, isChapterLocked } from '../levels/levelLoader.js';
import { getStars, isChapterProgressionUnlocked } from '../save/ProgressStore.js';
import { formatEquation } from '../core/equation.js';
import { COEFF_COLORS } from '../constants.js';
import { starStr } from '../core/scoring.js';
import { Tutorial } from './Tutorial.js';

export class UIController {
  // Callbacks wired by GameController
  onLaunch        = null;
  onRetry         = null;
  onNext          = null;
  onSelectLevel   = null;
  onCoeffChange   = null;
  onMenuOpen      = null; // () => progress object
  onSliderDragStart = null; // (coeff, value) => void
  onSliderDragEnd   = null; // () => void
  onMuteToggle      = null; // () => void

  constructor() {
    this._refs = {};
    this._sliderListeners = {};
    this._tutorial = new Tutorial();
    this._pendingTutorialProgress = null;
    this._buildDOM();
  }

  _buildDOM() {
    document.getElementById('app').innerHTML = `
      <div id="level-header">
        <button id="btn-menu" title="Level select">☰</button>
        <span id="level-num"></span>
        <span id="level-title"></span>
        <span id="timer-display" class="hidden"></span>
        <span id="prev-stars"></span>
        <button id="btn-mute" title="Toggle mute">🔊</button>
      </div>
      <canvas id="game-canvas"></canvas>
      <div id="ui-panel">
        <div id="equation-display"></div>
        <div id="shot-tabs" class="hidden"></div>
        <div id="controls"></div>
        <div id="actions">
          <button id="btn-launch">Launch!</button>
          <button id="btn-retry"  class="hidden">Try Again</button>
          <button id="btn-next"   class="hidden">Next Level →</button>
        </div>
        <div id="result"    class="hidden"></div>
        <div id="math-hint" class="hidden"></div>
      </div>
      <div id="level-select-screen" class="hidden"></div>
      <div id="reveal-card-overlay"  class="hidden"></div>
      <div id="paywall-screen"       class="hidden"></div>
      <div id="toast"                class="hidden"></div>
    `;

    const $ = id => document.getElementById(id);
    this._refs = {
      levelNum: $('level-num'), levelTitle: $('level-title'), prevStars: $('prev-stars'),
      timer: $('timer-display'),
      canvas: $('game-canvas'),
      equationDisplay: $('equation-display'),
      shotTabs: $('shot-tabs'),
      controls: $('controls'),
      btnLaunch: $('btn-launch'), btnRetry: $('btn-retry'), btnNext: $('btn-next'),
      result: $('result'), hint: $('math-hint'),
      levelSelect: $('level-select-screen'),
      revealOverlay: $('reveal-card-overlay'),
      paywall: $('paywall-screen'),
      btnMenu: $('btn-menu'),
      btnMute: $('btn-mute'),
      toast: $('toast'),
    };

    this._refs.btnLaunch.addEventListener('click', () => this.onLaunch?.());
    this._refs.btnRetry.addEventListener('click',  () => this.onRetry?.());
    this._refs.btnNext.addEventListener('click',   () => this.onNext?.());
    this._refs.btnMenu.addEventListener('click',   () => this._toggleLevelSelect());
    this._refs.btnMute.addEventListener('click',   () => {
      this.onMuteToggle?.();
    });
  }

  updateMuteButton(muted) {
    if (this._refs.btnMute) {
      this._refs.btnMute.textContent = muted ? '🔇' : '🔊';
    }
  }

  get canvas() { return this._refs.canvas; }

  // ─── Level Load ─────────────────────────────────────────────────────────────

  loadLevel(cfg, globalIndex, progress) {
    this._tutorial.hide();
    this._pendingTutorialProgress = this._tutorial.shouldShow(globalIndex, progress) ? progress : null;

    const info = getChapterForLevel(globalIndex);
    this._refs.levelNum.textContent = `Ch${cfg.chapter} · L${cfg.levelInChapter}`;
    this._refs.levelTitle.textContent = cfg.title;
    const best = getStars(progress, globalIndex);
    this._refs.prevStars.textContent = best > 0 ? `Best: ${starStr(best)}` : '';

    // Timer
    if (cfg.timer) {
      this._refs.timer.textContent = this._fmtTime(cfg.timer.seconds);
      this._refs.timer.classList.remove('hidden');
    } else {
      this._refs.timer.classList.add('hidden');
    }

    // Shot tabs for multi-shot
    if (cfg.multiShot) {
      this._buildShotTabs(cfg.multiShot.shots, 0);
      this._refs.shotTabs.classList.remove('hidden');
    } else {
      this._refs.shotTabs.innerHTML = '';
      this._refs.shotTabs.classList.add('hidden');
    }

    this._refs.btnRetry.classList.add('hidden');
    this._refs.btnNext.classList.add('hidden');
    this._refs.result.classList.add('hidden');
    this._refs.result.className = 'hidden';
    this._refs.btnLaunch.disabled = false;
  }

  _buildShotTabs(shots, activeIdx) {
    this._refs.shotTabs.innerHTML = shots.map((s, i) =>
      `<button class="shot-tab ${i === activeIdx ? 'active' : ''}" data-idx="${i}">${s.label}</button>`
    ).join('');
  }

  advanceShot(session) {
    const shots = session.config.multiShot.shots;
    this._buildShotTabs(shots, session.activeShotIndex);
    this._buildSliders(session);
    this.updateEquation(session);
  }

  // ─── Sliders ─────────────────────────────────────────────────────────────────

  _buildSliders(session) {
    const sliderCfg = session.currentSliderConfig();
    const activeCoeffs = session.currentActiveCoeffs();
    const params = session.getEffectiveParams();
    const lockedCoeffs = session.config.lockedCoefficients ?? {};
    const controls = this._refs.controls;
    controls.innerHTML = '';
    this._sliderListeners = {};

    for (const coeff of activeCoeffs) {
      const sc = sliderCfg[coeff];
      if (!sc) continue;
      const color = COEFF_COLORS[coeff] ?? '#e2e8f0';
      const val = params[coeff] ?? 0;
      const locked = Object.prototype.hasOwnProperty.call(lockedCoeffs, coeff);

      const label = document.createElement('label');
      if (locked) label.classList.add('slider-locked');
      label.innerHTML = `
        <span class="coeff-label" style="color:${color}">${coeff}${locked ? ' 🔒' : ''}</span>
        <input type="range" id="sl-${coeff}"
          min="${sc.min}" max="${sc.max}" step="${sc.step}" value="${val}"
          style="accent-color:${color}"${locked ? ' disabled' : ''} />
        <span class="coeff-value" id="sv-${coeff}" style="color:${color}">${val.toFixed(2)}</span>
      `;
      controls.appendChild(label);

      const slider = label.querySelector('input');
      const listener = () => {
        if (locked) return;
        const v = parseFloat(slider.value);
        this.onCoeffChange?.(coeff, v);
      };
      slider.addEventListener('input', listener);
      slider.addEventListener('pointerdown', () => {
        if (locked) return;
        this.onSliderDragStart?.(coeff, parseFloat(slider.value));
      });
      slider.addEventListener('pointerup', () => {
        if (locked) return;
        this.onSliderDragEnd?.();
      });
      this._sliderListeners[coeff] = { el: slider, listener, locked };
    }
  }

  // ─── Equation & Hint ─────────────────────────────────────────────────────────

  updateEquation(session) {
    const params = session.getEffectiveParams();
    const form = session.currentForm();
    this._refs.equationDisplay.innerHTML = formatEquation(form, params, COEFF_COLORS);

    // Sync slider position and value label (programmatic value set doesn't fire 'input')
    for (const [coeff, { el }] of Object.entries(this._sliderListeners)) {
      const v = params[coeff] ?? 0;
      el.value = v;
      const valEl = document.getElementById(`sv-${coeff}`);
      if (valEl) valEl.textContent = v.toFixed(2);
    }
  }

  updateHint(session) {
    const cfg = session.config;
    const params = session.getEffectiveParams();
    const form = session.currentForm();
    const launcher = cfg.launcher;

    let hintLines = [];

    if (form === 'stretch') {
      const absA = Math.abs(params.a);
      const shape = absA > 0.25 ? 'steep — short range' : absA > 0.10 ? 'medium' : 'gentle — long range';
      hintLines.push(`a = ${params.a.toFixed(3)} → arc is ${shape}`);
    } else if (form === 'vertex') {
      const peakX = (launcher.x + params.h).toFixed(1);
      const peakY = (launcher.y + params.k).toFixed(2);
      const landX = (launcher.x + 2 * params.h).toFixed(1);
      hintLines.push(`Vertex (peak): (${peakX}, ${peakY})`);
      hintLines.push(`Arc lands at x ≈ ${landX}`);
    } else if (form === 'factored') {
      const landX1 = (launcher.x + params.r1).toFixed(1);
      const landX2 = (launcher.x + params.r2).toFixed(1);
      hintLines.push(`Roots: x = ${landX1} and x = ${landX2} (where arc crosses ground)`);
    } else if (form === 'standard') {
      const h = -params.b / (2 * params.a);
      const k = params.c - (params.b ** 2) / (4 * params.a);
      hintLines.push(`Vertex at (${(launcher.x + h).toFixed(1)}, ${(launcher.y + k).toFixed(2)})`);
    }

    hintLines.push(`<em style="color:#64748b">${cfg.hint}</em>`);
    this._refs.hint.innerHTML = hintLines.join('<br>');
    this._refs.hint.classList.remove('hidden');
  }

  // ─── Result Panel ─────────────────────────────────────────────────────────────

  showResult({ hit, stars, moves, isLastLevel, timedOut }) {
    const el = this._refs.result;
    if (hit) {
      el.className = 'hit';
      el.innerHTML =
        `<span class="stars">${starStr(stars)}</span> ` +
        (stars === 3 ? 'Perfect!' : stars === 2 ? 'Nice shot!' : 'Got it!') +
        ` &nbsp;<span style="color:#64748b;font-size:0.85rem">${moves} adjustment${moves !== 1 ? 's' : ''}</span>`;
      if (!isLastLevel) {
        this._refs.btnNext.classList.remove('hidden');
      } else {
        el.innerHTML += '<br><span style="font-size:0.9rem">🎓 You completed Happy Nerds!</span>';
      }
    } else {
      el.className = 'miss';
      el.textContent = timedOut ? '⏰ Time\'s up! Try again.' : '😅 Wah wah... adjust and try again!';
    }
    el.classList.remove('hidden');
    this._refs.btnRetry.classList.remove('hidden');
  }

  // ─── Reveal Card ──────────────────────────────────────────────────────────────

  showRevealCard(data, onDismiss) {
    const overlay = this._refs.revealOverlay;
    overlay.innerHTML = `
      <div id="reveal-card">
        <div class="reveal-title">${data.title}</div>
        <div class="reveal-subtitle">${data.subtitle}</div>
        <div class="reveal-body">${data.body.replace(/\n/g, '<br>')}</div>
        <div class="reveal-vocab">
          ${data.vocabulary.map(v => `<span class="vocab-chip">${v}</span>`).join('')}
        </div>
        <button id="btn-got-it">Got it! →</button>
      </div>
    `;
    overlay.classList.remove('hidden');
    overlay.querySelector('#btn-got-it').addEventListener('click', () => {
      overlay.classList.add('hidden');
      onDismiss?.();
    });
    overlay.addEventListener('click', e => {
      if (e.target === overlay) { overlay.classList.add('hidden'); onDismiss?.(); }
    });
  }

  // ─── Paywall ──────────────────────────────────────────────────────────────────

  showPaywall(chapterNum) {
    const el = this._refs.paywall;
    el.innerHTML = `
      <div id="paywall-card">
        <div class="paywall-title">Chapter ${chapterNum} — Premium</div>
        <div class="paywall-body">Chapters 4–8 cover factored form, standard form, multi-shot, and cubic functions.</div>
        <div class="paywall-price">$4.99 — coming soon</div>
        <button id="btn-paywall-back">← Back</button>
      </div>
    `;
    el.classList.remove('hidden');
    el.querySelector('#btn-paywall-back').addEventListener('click', () => el.classList.add('hidden'));
  }

  // ─── Level Select ─────────────────────────────────────────────────────────────

  _toggleLevelSelect() {
    const el = this._refs.levelSelect;
    el.classList.toggle('hidden');
    if (!el.classList.contains('hidden')) this._renderLevelSelect(this.onMenuOpen?.() ?? { stars: [] });
  }

  _renderLevelSelect(progress = {}) {
    const el = this._refs.levelSelect;
    let offset = 0;
    el.innerHTML = `<div id="ls-inner">
      <button id="ls-close">✕</button>
      <h2>Level Select</h2>
      ${CHAPTERS.map(ch => {
        const locked = isChapterLocked(ch.num, progress);
        let lockReason = '';
        if (locked) {
          lockReason = isChapterProgressionUnlocked(ch.num, progress, CHAPTERS)
            ? 'Premium content — unlock to play'
            : `Complete Chapter ${ch.num - 1} to unlock`;
        }
        const chHTML = locked
          ? `<div class="ls-lock-info">🔒 ${lockReason}</div>`
          : ch.levels.map((lvl, i) => {
              const gi = offset + i;
              const s = getStars(progress, gi) || 0;
              return `<button class="ls-level-btn" data-idx="${gi}" title="${lvl.title}">
                <span class="ls-lvl-num">${i + 1}</span>
                <span class="ls-stars">${starStr(s)}</span>
              </button>`;
            }).join('');
        offset += ch.levels.length;
        return `<div class="ls-chapter${locked ? ' ls-chapter-locked' : ''}" ${locked ? `data-lock-reason="${lockReason}"` : ''}>
          <div class="ls-chapter-title">Ch${ch.num}: ${ch.title}${locked ? ' 🔒' : ''}</div>
          <div class="ls-levels">${chHTML}</div>
        </div>`;
      }).join('')}
    </div>`;

    el.querySelector('#ls-close').addEventListener('click', () => el.classList.add('hidden'));
    el.querySelectorAll('.ls-chapter-locked').forEach(chDiv => {
      chDiv.addEventListener('click', () => {
        this._showToast(chDiv.dataset.lockReason);
      });
    });
    el.querySelectorAll('.ls-level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        el.classList.add('hidden');
        this.onSelectLevel?.(idx);
      });
    });
  }

  _showToast(msg) {
    const el = this._refs.toast;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.add('hidden'), 2500);
  }

  // ─── Misc ──────────────────────────────────────────────────────────────────────

  setControlsEnabled(enabled) {
    this._refs.btnLaunch.disabled = !enabled;
    for (const { el, locked } of Object.values(this._sliderListeners)) {
      el.disabled = !enabled || locked;
    }
  }

  updateTimer(seconds) {
    if (seconds === null) return;
    const el = this._refs.timer;
    el.textContent = this._fmtTime(Math.ceil(seconds));
    el.style.color = seconds < 10 ? '#ef4444' : '#e2e8f0';
  }

  _fmtTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  // Called by GameController after init so sliders match first level
  initialRender(session) {
    this._buildSliders(session);
    this.updateEquation(session);
    this.updateHint(session);
    if (this._pendingTutorialProgress) {
      this._tutorial.show(this._pendingTutorialProgress);
      this._pendingTutorialProgress = null;
    }
  }
}
