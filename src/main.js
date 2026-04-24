import './style.css';
import { UIController } from './ui/UIController.js';
import { Renderer } from './renderer/Renderer.js';
import { GameController } from './game/GameController.js';

const ui = new UIController();
const renderer = new Renderer(ui.canvas);
const game = new GameController({ renderer, ui });

// Resize canvas display on window resize
function resizeCanvas() {
  const maxW = Math.min(window.innerWidth - 24, 700);
  const scale = maxW / 700;
  ui.canvas.style.width  = `${700 * scale}px`;
  ui.canvas.style.height = `${420 * scale}px`;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

game.init();
