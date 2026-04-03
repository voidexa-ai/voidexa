// GHAI Invaders — Space Invaders clone with voidexa aesthetic

import {
  GameState, GameConfig, InputState, createGameState,
  setupCanvas, setupInput, gameLoop, drawText, drawHUD, rectCollision
} from './game-engine';

interface Invader {
  x: number; y: number;
  alive: boolean;
  row: number;
  points: number;
  color: string;
}

interface Bullet {
  x: number; y: number;
  dy: number;
  active: boolean;
}

interface Shield {
  x: number; y: number;
  health: number;
}

interface InvaderState extends GameState {
  player: { x: number; width: number; height: number };
  invaders: Invader[];
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  shields: Shield[];
  direction: number;
  stepTimer: number;
  stepInterval: number;
  dropNext: boolean;
  enemyFireTimer: number;
  ufo: { x: number; active: boolean; direction: number } | null;
  ufoTimer: number;
  wave: number;
}

const CONFIG: GameConfig = { width: 480, height: 640, fps: 60, background: '#0a0a1f' };
const INVADER_W = 32, INVADER_H = 24, GAP_X = 12, GAP_Y = 10;
const COLS = 8, ROWS = 5;
const PLAYER_W = 40, PLAYER_H = 16, PLAYER_Y_OFFSET = 60;
const ROW_COLORS = ['#a855f7', '#a855f7', '#22c55e', '#22c55e', '#3b82f6'];
const ROW_POINTS = [30, 30, 20, 20, 10];

function createInvaders(): Invader[] {
  const invaders: Invader[] = [];
  const startX = (CONFIG.width - COLS * (INVADER_W + GAP_X)) / 2;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      invaders.push({
        x: startX + c * (INVADER_W + GAP_X),
        y: 60 + r * (INVADER_H + GAP_Y),
        alive: true,
        row: r,
        points: ROW_POINTS[r],
        color: ROW_COLORS[r],
      });
    }
  }
  return invaders;
}

function createShields(): Shield[] {
  const positions = [80, 200, 320];
  return positions.map(x => ({ x, y: CONFIG.height - 140, health: 4 }));
}

function createState(): InvaderState {
  return {
    ...createGameState(),
    player: { x: CONFIG.width / 2 - PLAYER_W / 2, width: PLAYER_W, height: PLAYER_H },
    invaders: createInvaders(),
    playerBullets: [],
    enemyBullets: [],
    shields: createShields(),
    direction: 1,
    stepTimer: 0,
    stepInterval: 800,
    dropNext: false,
    enemyFireTimer: 0,
    wave: 1,
    ufo: null,
    ufoTimer: 0,
  };
}

export function startGhaiInvaders(
  canvas: HTMLCanvasElement,
  onGameOver: (score: number) => void
) {
  const ctx = setupCanvas(canvas, CONFIG);
  const input = setupInput(canvas);
  const state = createState();
  state.running = true;

  let shootCooldown = 0;

  function update(s: InvaderState, dt: number) {
    if (s.gameOver) return;

    // Player movement
    if (input.left) s.player.x = Math.max(0, s.player.x - 4);
    if (input.right) s.player.x = Math.min(CONFIG.width - PLAYER_W, s.player.x + 4);

    // Shooting
    shootCooldown = Math.max(0, shootCooldown - dt);
    if (input.action && shootCooldown <= 0 && s.playerBullets.length < 2) {
      s.playerBullets.push({
        x: s.player.x + PLAYER_W / 2 - 2,
        y: CONFIG.height - PLAYER_Y_OFFSET - 10,
        dy: -8,
        active: true,
      });
      shootCooldown = 250;
    }

    // Move player bullets
    s.playerBullets.forEach(b => {
      if (!b.active) return;
      b.y += b.dy;
      if (b.y < 0) b.active = false;
    });

    // Move enemy bullets
    s.enemyBullets.forEach(b => {
      if (!b.active) return;
      b.y += b.dy;
      if (b.y > CONFIG.height) b.active = false;
    });

    // Invader movement
    s.stepTimer += dt;
    if (s.stepTimer >= s.stepInterval) {
      s.stepTimer = 0;
      if (s.dropNext) {
        s.invaders.forEach(inv => { if (inv.alive) inv.y += 20; });
        s.direction *= -1;
        s.dropNext = false;
      } else {
        let hitEdge = false;
        s.invaders.forEach(inv => {
          if (!inv.alive) return;
          inv.x += s.direction * 16;
          if (inv.x <= 0 || inv.x + INVADER_W >= CONFIG.width) hitEdge = true;
        });
        if (hitEdge) s.dropNext = true;
      }
    }

    // Enemy fire
    s.enemyFireTimer += dt;
    if (s.enemyFireTimer > 1000 + Math.random() * 1000) {
      s.enemyFireTimer = 0;
      const alive = s.invaders.filter(i => i.alive);
      if (alive.length > 0) {
        const shooter = alive[Math.floor(Math.random() * alive.length)];
        s.enemyBullets.push({
          x: shooter.x + INVADER_W / 2,
          y: shooter.y + INVADER_H,
          dy: 4,
          active: true,
        });
      }
    }

    // UFO
    s.ufoTimer += dt;
    if (!s.ufo && s.ufoTimer > 15000) {
      s.ufoTimer = 0;
      const dir = Math.random() > 0.5 ? 1 : -1;
      s.ufo = { x: dir > 0 ? -40 : CONFIG.width + 40, active: true, direction: dir };
    }
    if (s.ufo?.active) {
      s.ufo.x += s.ufo.direction * 2;
      if (s.ufo.x < -50 || s.ufo.x > CONFIG.width + 50) s.ufo.active = false;
    }

    // Collision: player bullets → invaders
    s.playerBullets.forEach(b => {
      if (!b.active) return;
      s.invaders.forEach(inv => {
        if (!inv.alive) return;
        if (rectCollision(b.x, b.y, 4, 8, inv.x, inv.y, INVADER_W, INVADER_H)) {
          b.active = false;
          inv.alive = false;
          s.score += inv.points;
          const killed = s.invaders.filter(i => !i.alive).length;
          if (killed % 10 === 0) {
            s.stepInterval = Math.max(200, s.stepInterval - 50);
          }
        }
      });
      // UFO hit
      if (s.ufo?.active && rectCollision(b.x, b.y, 4, 8, s.ufo.x, 30, 36, 16)) {
        b.active = false;
        s.ufo.active = false;
        s.score += 100;
      }
    });

    // Collision: enemy bullets → player
    s.enemyBullets.forEach(b => {
      if (!b.active) return;
      const py = CONFIG.height - PLAYER_Y_OFFSET;
      if (rectCollision(b.x, b.y, 4, 8, s.player.x, py, PLAYER_W, PLAYER_H)) {
        b.active = false;
        s.lives--;
        if (s.lives <= 0) {
          s.gameOver = true;
          s.running = false;
          onGameOver(s.score);
        }
      }
    });

    // Collision: bullets → shields
    s.shields.forEach(sh => {
      if (sh.health <= 0) return;
      [...s.playerBullets, ...s.enemyBullets].forEach(b => {
        if (!b.active) return;
        if (rectCollision(b.x, b.y, 4, 8, sh.x, sh.y, 60, 20)) {
          b.active = false;
          sh.health--;
        }
      });
    });

    // Invaders reach bottom
    if (s.invaders.some(i => i.alive && i.y + INVADER_H > CONFIG.height - 100)) {
      s.gameOver = true;
      s.running = false;
      onGameOver(s.score);
    }

    // All invaders dead → next wave
    if (s.invaders.every(i => !i.alive)) {
      s.wave++;
      s.level = s.wave;
      s.invaders = createInvaders();
      s.stepInterval = Math.max(200, 800 - (s.wave - 1) * 80);
      s.shields = createShields();
    }

    // Cleanup
    s.playerBullets = s.playerBullets.filter(b => b.active);
    s.enemyBullets = s.enemyBullets.filter(b => b.active);
  }

  function render(ctx: CanvasRenderingContext2D, s: InvaderState) {
    // Background
    ctx.fillStyle = CONFIG.background;
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 137 + 31) % CONFIG.width;
      const sy = (i * 89 + 17) % CONFIG.height;
      ctx.fillRect(sx, sy, 1, 1);
    }

    // Invaders
    s.invaders.forEach(inv => {
      if (!inv.alive) return;
      ctx.fillStyle = inv.color;
      // Pixel art invader
      const cx = inv.x, cy = inv.y;
      ctx.fillRect(cx + 4, cy, 24, 4);
      ctx.fillRect(cx, cy + 4, 32, 4);
      ctx.fillRect(cx, cy + 8, 8, 4);
      ctx.fillRect(cx + 12, cy + 8, 8, 4);
      ctx.fillRect(cx + 24, cy + 8, 8, 4);
      ctx.fillRect(cx + 4, cy + 12, 8, 4);
      ctx.fillRect(cx + 20, cy + 12, 8, 4);
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(cx + 8, cy + 4, 4, 4);
      ctx.fillRect(cx + 20, cy + 4, 4, 4);
    });

    // UFO
    if (s.ufo?.active) {
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(s.ufo.x, 30, 36, 8);
      ctx.fillRect(s.ufo.x + 8, 24, 20, 6);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(s.ufo.x + 14, 20, 8, 4);
    }

    // Shields
    s.shields.forEach(sh => {
      if (sh.health <= 0) return;
      const alpha = sh.health / 4;
      ctx.fillStyle = `rgba(0,212,255,${alpha * 0.7})`;
      ctx.fillRect(sh.x, sh.y, 60, 20);
    });

    // Player
    const py = CONFIG.height - PLAYER_Y_OFFSET;
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(s.player.x, py, PLAYER_W, PLAYER_H);
    ctx.fillRect(s.player.x + PLAYER_W / 2 - 3, py - 8, 6, 8);

    // Bullets
    ctx.fillStyle = '#00d4ff';
    s.playerBullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 8));
    ctx.fillStyle = '#ff4444';
    s.enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 8));

    // HUD
    drawHUD(ctx, s, CONFIG.width);

    // Game over
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
      drawText(ctx, 'GAME OVER', CONFIG.width / 2, CONFIG.height / 2 - 20, 20, '#ff4444', 'center');
      drawText(ctx, `SCORE: ${s.score}`, CONFIG.width / 2, CONFIG.height / 2 + 20, 14, '#00d4ff', 'center');
    }
  }

  gameLoop(ctx, state, CONFIG, update as any, render as any);

  return () => { state.running = false; };
}
