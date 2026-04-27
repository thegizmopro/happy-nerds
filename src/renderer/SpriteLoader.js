// Import all sprites so Vite bundles them
import carl_idle from '../assets/carl_idle.webp';
import carl_celebrate from '../assets/carl_celebrate.webp';
import carl_miss from '../assets/carl_miss.webp';
import fiona_idle from '../assets/fiona_idle.webp';
import fiona_celebrate from '../assets/fiona_celebrate.webp';
import fiona_miss from '../assets/fiona_miss.webp';
import pete_idle from '../assets/pete_idle.webp';
import pete_celebrate from '../assets/pete_celebrate.webp';
import pete_miss from '../assets/pete_miss.webp';
import jock_alive from '../assets/jock_alive.webp';
import jock_dead from '../assets/jock_dead.webp';
import varsity_alive from '../assets/varsity_alive.webp';
import varsity_dead from '../assets/varsity_dead.webp';
import skater_alive from '../assets/skater_alive.webp';
import skater_dead from '../assets/skater_dead.webp';
import coach_alive from '../assets/coach_alive.webp';
import coach_dead from '../assets/coach_dead.webp';
import bullyboss_alive from '../assets/bullyboss_alive.webp';
import bullyboss_dead from '../assets/bullyboss_dead.webp';
import bg_ch1 from '../assets/bg_ch1_busstop.webp';
import bg_ch2 from '../assets/bg_ch2_hallway.webp';
import bg_ch3 from '../assets/bg_ch3_classroom.webp';
import bg_ch4 from '../assets/bg_ch4_cafeteria.webp';
import bg_ch5 from '../assets/bg_ch5_library.webp';
import bg_ch6 from '../assets/bg_ch6_gym.webp';
import bg_ch7 from '../assets/bg_ch7_lab.webp';
import bg_ch8 from '../assets/bg_ch8_office.webp';

const SPRITES = {
  carl_idle, carl_celebrate, carl_miss,
  fiona_idle, fiona_celebrate, fiona_miss,
  pete_idle, pete_celebrate, pete_miss,
  jock_alive, jock_dead,
  varsity_alive, varsity_dead,
  skater_alive, skater_dead,
  coach_alive, coach_dead,
  bullyboss_alive, bullyboss_dead,
  bg_ch1, bg_ch2, bg_ch3, bg_ch4, bg_ch5, bg_ch6, bg_ch7, bg_ch8,
};

export class SpriteLoader {
  constructor() {
    this._cache = {};
    this._ready = false;
  }

  async loadAll() {
    await Promise.all(Object.entries(SPRITES).map(([key, url]) => this._load(key, url)));
    this._ready = true;
  }

  _load(key, url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { this._cache[key] = img; resolve(); };
      img.onerror = () => { console.warn('Sprite failed:', key); resolve(); };
      img.src = url;
    });
  }

  get(key) { return this._cache[key]; }
  get ready() { return this._ready; }
}
