// game-engine.ts — shared canvas game foundation

export interface GameState {
  score: number;
  lives: number;
  level: number;
  running: boolean;
  paused: boolean;
  gameOver: boolean;
}

export interface GameConfig {
  width: number;
  height: number;
  fps: number;
  background: string;
}

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  action: boolean;
  pause: boolean;
}

export const DEFAULT_CONFIG: GameConfig = {
  width: 480,
  height: 640,
  fps: 60,
  background: '#0a0a1f',
};

export function createGameState(): GameState {
  return {
    score: 0,
    lives: 3,
    level: 1,
    running: false,
    paused: false,
    gameOver: false,
  };
}

export function setupCanvas(
  canvas: HTMLCanvasElement,
  config: GameConfig
): CanvasRenderingContext2D {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = config.width * dpr;
  canvas.height = config.height * dpr;
  canvas.style.width = `${config.width}px`;
  canvas.style.height = `${config.height}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

export function setupInput(canvas: HTMLCanvasElement): InputState {
  const input: InputState = {
    left: false, right: false, up: false, down: false,
    action: false, pause: false,
  };

  const keyMap: Record<string, keyof InputState> = {
    ArrowLeft: 'left', ArrowRight: 'right',
    ArrowUp: 'up', ArrowDown: 'down',
    ' ': 'action', Escape: 'pause',
    a: 'left', d: 'right', w: 'up', s: 'down',
  };

  const onKey = (e: KeyboardEvent, pressed: boolean) => {
    const k = keyMap[e.key];
    if (k) {
      e.preventDefault();
      input[k] = pressed;
    }
  };

  window.addEventListener('keydown', (e) => onKey(e, true));
  window.addEventListener('keyup', (e) => onKey(e, false));

  return input;
}

export type TouchCallback = (dir: string) => void;

export function setupTouchControls(
  container: HTMLElement,
  onTouch: TouchCallback
) {
  let startX = 0, startY = 0;
  container.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const threshold = 30;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > threshold) onTouch('right');
      else if (dx < -threshold) onTouch('left');
    } else {
      if (dy > threshold) onTouch('down');
      else if (dy < -threshold) onTouch('up');
    }
  }, { passive: true });

  container.addEventListener('touchstart', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    if (x > rect.width * 0.7) onTouch('action');
  }, { passive: true });
}

export function gameLoop(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  config: GameConfig,
  update: (state: GameState, dt: number) => void,
  render: (ctx: CanvasRenderingContext2D, state: GameState) => void
) {
  let lastTime = 0;
  const interval = 1000 / config.fps;

  function frame(timestamp: number) {
    if (!state.running) return;
    if (state.paused) {
      requestAnimationFrame(frame);
      return;
    }

    const dt = timestamp - lastTime;
    if (dt >= interval) {
      lastTime = timestamp - (dt % interval);
      update(state, dt);
      render(ctx, state);
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  size: number = 14,
  color: string = '#00d4ff',
  align: CanvasTextAlign = 'left'
) {
  ctx.font = `${size}px "Press Start 2P", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

export function drawHUD(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number
) {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, width, 36);
  drawText(ctx, `SCORE ${state.score}`, 8, 24, 10, '#00d4ff');
  drawText(ctx, `LIVES ${state.lives}`, width / 2, 24, 10, '#ff6600', 'center');
  drawText(ctx, `LVL ${state.level}`, width - 8, 24, 10, '#a855f7', 'right');
}

export function rectCollision(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export async function submitScore(game: string, playerName: string, score: number) {
  try {
    await fetch('/api/break-room/highscore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game, player_name: playerName, score }),
    });
  } catch {
    // Silent fail for score submission
  }
}

export const CEO_SCORES: Record<string, number> = {
  'ghai-invaders': 2500,
  'ghost-jump': 5000,
  'void-pong': 15,
  'kcp-stacker': 3000,
};
