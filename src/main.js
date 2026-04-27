import './style.css';
import { UIController } from './ui/UIController.js';
import { Renderer } from './renderer/Renderer.js';
import { GameController } from './game/GameController.js';
import { SpriteLoader } from './renderer/SpriteLoader.js';

async function start() {
  const spriteLoader = new SpriteLoader();
  await spriteLoader.loadAll();

  document.getElementById('loading')?.remove();

  const ui = new UIController();
  const renderer = new Renderer(ui.canvas, spriteLoader);
  const game = new GameController({ renderer, ui });

  function resizeCanvas() {
    const maxW = Math.min(window.innerWidth - 24, 700);
    const scale = maxW / 700;
    ui.canvas.style.width  = `${700 * scale}px`;
    ui.canvas.style.height = `${420 * scale}px`;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  game.init();
}

start();
