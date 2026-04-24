import { loadProgress, saveProgress } from '../save/ProgressStore.js';

export class SoundManager {
  constructor() {
    this._ctx = null;
    this._arcOsc = null;
    this._arcGain = null;
    this._progress = null;
  }

  // Called on first user interaction to comply with autoplay policy
  init(progress) {
    this._progress = progress;
    if (this._ctx) return;
    if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') return;
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      this._ctx = null;
    }
  }

  _resume() {
    if (this._ctx?.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }
  }

  get volume() { return this._progress?.volume ?? 70; }
  set volume(v) {
    if (!this._progress) return;
    this._progress.volume = Math.max(0, Math.min(100, v));
    saveProgress(this._progress);
  }

  get muted() { return this._progress?.muted ?? false; }
  set muted(m) {
    if (!this._progress) return;
    this._progress.muted = m;
    saveProgress(this._progress);
  }

  _masterGain() {
    if (this.muted) return 0;
    return (this.volume / 100);
  }

  // ─── Arc Tone ────────────────────────────────────────────────────────────────

  startArcTone(aValue) {
    if (!this._ctx) return;
    this._resume();
    this.stopArcTone();
    const freq = this._aToFreq(aValue);
    const ctx = this._ctx;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15 * this._masterGain(), ctx.currentTime + 0.05);
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(gain);
    osc.start();
    this._arcOsc = osc;
    this._arcGain = gain;
  }

  updateArcTone(aValue) {
    if (!this._arcOsc || !this._ctx) return;
    const freq = this._aToFreq(aValue);
    this._arcOsc.frequency.linearRampToValueAtTime(freq, this._ctx.currentTime + 0.02);
    this._arcGain.gain.setValueAtTime(0.15 * this._masterGain(), this._ctx.currentTime);
  }

  stopArcTone() {
    if (!this._arcOsc || !this._ctx) return;
    const gain = this._arcGain;
    const osc = this._arcOsc;
    this._arcOsc = null;
    this._arcGain = null;
    gain.gain.linearRampToValueAtTime(0, this._ctx.currentTime + 0.05);
    osc.stop(this._ctx.currentTime + 0.06);
  }

  _aToFreq(a) {
    const absA = Math.abs(a ?? 0.2);
    const clamped = Math.max(0.05, Math.min(0.5, absA));
    return 220 + ((clamped - 0.05) / (0.5 - 0.05)) * 660;
  }

  // ─── Sound Effects ───────────────────────────────────────────────────────────

  playClick(pitch) {
    const ctx = this._ctx;
    if (!ctx) return;
    this._resume();
    const g = this._masterGain();
    if (g === 0) return;
    const now = ctx.currentTime;
    const freq = 400 + (pitch ?? 0.5) * 800;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3 * g, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  playLaunch() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._resume();
    const g = this._masterGain();
    if (g === 0) return;
    const now = ctx.currentTime;
    const buf = this._whiteNoiseBuf(0.35);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2, now);
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(2000, now + 0.3);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4 * g, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
    src.stop(now + 0.35);
  }

  playHit() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._resume();
    const g = this._masterGain();
    if (g === 0) return;
    const now = ctx.currentTime;
    // Crash noise
    const buf = this._whiteNoiseBuf(0.15);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const crashGain = ctx.createGain();
    crashGain.gain.setValueAtTime(0.4 * g, now);
    crashGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    src.connect(crashGain);
    crashGain.connect(ctx.destination);
    src.start(now);
    src.stop(now + 0.15);
    // Major chord: C4 E4 G4
    for (const [freq, delay] of [[262, 0], [330, 0.03], [392, 0.06]]) {
      const osc = ctx.createOscillator();
      const chordGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      chordGain.gain.setValueAtTime(0.2 * g, now + delay);
      chordGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.5);
      osc.connect(chordGain);
      chordGain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.55);
    }
  }

  playMiss() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._resume();
    const g = this._masterGain();
    if (g === 0) return;
    const now = ctx.currentTime;
    for (const startFreq of [400, 402]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(150 + (startFreq - 400), now + 0.8);
      gain.gain.setValueAtTime(0.25 * g, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    }
  }

  playStar() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._resume();
    const g = this._masterGain();
    if (g === 0) return;
    const now = ctx.currentTime;
    // C5 E5 G5 C6 arpeggio, 100ms per note
    for (const [freq, i] of [[523, 0], [659, 1], [784, 2], [1047, 3]]) {
      const t = now + i * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.3 * g, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    }
  }

  playWhistleTweet() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._resume();
    const g = this._masterGain();
    if (g === 0) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.linearRampToValueAtTime(2500, now + 0.15);
    gain.gain.setValueAtTime(0.2 * g, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playBonusChime() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._resume();
    const g = this._masterGain();
    if (g === 0) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(0.25 * g, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playObstacleSplat() {
    const ctx = this._ctx;
    if (!ctx) return;
    this._resume();
    const g = this._masterGain();
    if (g === 0) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    gain.gain.setValueAtTime(0.35 * g, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  _whiteNoiseBuf(durationSec) {
    const ctx = this._ctx;
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.ceil(sampleRate * durationSec);
    const buf = ctx.createBuffer(1, frameCount, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buf;
  }
}
