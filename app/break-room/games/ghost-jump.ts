// Ghost Jump — Mario-style platformer with voidexa aesthetic

import {
  GameState, GameConfig, InputState, createGameState,
  setupCanvas, setupInput, gameLoop, drawText, drawHUD, rectCollision
} from './game-engine';

interface Platform {
  x: number; y: number; width: number; height: number;
  type: 'solid' | 'moving' | 'breakable';
  moveDir?: number; moveRange?: number; originX?: number;
  broken?: boolean;
}

interface Enemy {
  x: number; y: number; width: number; height: number;
  direction: 1 | -1; speed: number;
  type: 'bug' | 'exploit';
  minX: number; maxX: number;
}

interface Token {
  x: number; y: number; collected: boolean;
  bobOffset: number;
}

interface Portal {
  x: number; y: number;
  destX: number; destY: number;
}

interface GhostState extends GameState {
  px: number; py: number; pw: number; ph: number;
  vx: number; vy: number;
  onGround: boolean; canDoubleJump: boolean;
  facingRight: boolean;
  cameraX: number;
  platforms: Platform[];
  enemies: Enemy[];
  tokens: Token[];
  portals: Portal[];
  levelWidth: number;
  timer: number;
  tokensCollected: number;
  currentLevel: number;
  invulnTimer: number;
}

const CONFIG: GameConfig = { width: 480, height: 480, fps: 60, background: '#0a0a1f' };
const GRAVITY = 0.5;
const JUMP_VEL = -12;
const MOVE_SPEED = 4;
const TILE = 32;

function generateLevel(levelNum: number): {
  platforms: Platform[]; enemies: Enemy[];
  tokens: Token[]; portals: Portal[];
  levelWidth: number;
} {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const tokens: Token[] = [];
  const portals: Portal[] = [];
  const levelWidth = 2400 + levelNum * 800;

  // Ground
  for (let x = 0; x < levelWidth; x += TILE) {
    if (Math.random() > 0.08) { // Small gaps
      platforms.push({ x, y: CONFIG.height - TILE, width: TILE, height: TILE, type: 'solid' });
    }
  }

  // Platforms
  const numPlatforms = 15 + levelNum * 8;
  for (let i = 0; i < numPlatforms; i++) {
    const px = 100 + Math.random() * (levelWidth - 200);
    const py = 100 + Math.random() * (CONFIG.height - 200);
    const pw = TILE * (2 + Math.floor(Math.random() * 3));
    const type: Platform['type'] = Math.random() > 0.8 ? 'moving' :
      Math.random() > 0.7 ? 'breakable' : 'solid';
    const p: Platform = { x: px, y: py, width: pw, height: TILE / 2, type };
    if (type === 'moving') {
      p.moveDir = 1;
      p.moveRange = 60;
      p.originX = px;
    }
    platforms.push(p);
  }

  // Enemies
  const numEnemies = 5 + levelNum * 3;
  for (let i = 0; i < numEnemies; i++) {
    const ex = 200 + Math.random() * (levelWidth - 400);
    enemies.push({
      x: ex, y: CONFIG.height - TILE - 24,
      width: 24, height: 24,
      direction: Math.random() > 0.5 ? 1 : -1,
      speed: 1 + levelNum * 0.3,
      type: Math.random() > 0.5 ? 'bug' : 'exploit',
      minX: ex - 80, maxX: ex + 80,
    });
  }

  // Tokens (GHAI coins)
  const numTokens = 20 + levelNum * 5;
  for (let i = 0; i < numTokens; i++) {
    tokens.push({
      x: 60 + Math.random() * (levelWidth - 120),
      y: 60 + Math.random() * (CONFIG.height - 160),
      collected: false,
      bobOffset: Math.random() * Math.PI * 2,
    });
  }

  // Portals
  if (levelNum < 3) {
    portals.push({
      x: levelWidth - 80, y: CONFIG.height - TILE - 48,
      destX: 0, destY: 0,
    });
  }

  return { platforms, enemies, tokens, portals, levelWidth };
}

function createState(): GhostState {
  const level = generateLevel(1);
  return {
    ...createGameState(),
    px: 60, py: CONFIG.height - TILE - 32,
    pw: 24, ph: 32,
    vx: 0, vy: 0,
    onGround: false, canDoubleJump: true,
    facingRight: true,
    cameraX: 0,
    ...level,
    timer: 0,
    tokensCollected: 0,
    currentLevel: 1,
    invulnTimer: 0,
  };
}

export function startGhostJump(
  canvas: HTMLCanvasElement,
  onGameOver: (score: number) => void
) {
  const ctx = setupCanvas(canvas, CONFIG);
  const input = setupInput(canvas);
  const state = createState();
  state.running = true;

  function update(s: GhostState, dt: number) {
    if (s.gameOver) return;
    s.timer += dt;
    if (s.invulnTimer > 0) s.invulnTimer -= dt;

    // Horizontal movement
    s.vx = 0;
    if (input.left) { s.vx = -MOVE_SPEED; s.facingRight = false; }
    if (input.right) { s.vx = MOVE_SPEED; s.facingRight = true; }

    // Jumping
    if (input.up || input.action) {
      if (s.onGround) {
        s.vy = JUMP_VEL;
        s.onGround = false;
        s.canDoubleJump = true;
      } else if (s.canDoubleJump) {
        s.vy = JUMP_VEL;
        s.canDoubleJump = false;
      }
      input.up = false;
      input.action = false;
    }

    // Gravity
    s.vy += GRAVITY;
    s.px += s.vx;
    s.py += s.vy;

    // Platform collision
    s.onGround = false;
    s.platforms.forEach(p => {
      if (p.type === 'breakable' && p.broken) return;
      if (p.type === 'moving' && p.originX !== undefined && p.moveDir !== undefined) {
        p.x += p.moveDir * 0.5;
        if (Math.abs(p.x - p.originX) > (p.moveRange || 60)) p.moveDir *= -1;
      }
      if (s.vy >= 0 && rectCollision(s.px, s.py, s.pw, s.ph, p.x, p.y, p.width, p.height)) {
        if (s.py + s.ph - s.vy <= p.y + 4) {
          s.py = p.y - s.ph;
          s.vy = 0;
          s.onGround = true;
          s.canDoubleJump = true;
          if (p.type === 'breakable') p.broken = true;
        }
      }
    });

    // Fall death
    if (s.py > CONFIG.height + 50) {
      s.lives--;
      if (s.lives <= 0) {
        s.gameOver = true;
        s.running = false;
        onGameOver(s.score);
        return;
      }
      s.px = 60;
      s.py = CONFIG.height - TILE - 60;
      s.vy = 0;
      s.cameraX = 0;
      s.invulnTimer = 2000;
    }

    // Enemy movement + collision
    s.enemies.forEach(e => {
      e.x += e.direction * e.speed;
      if (e.x <= e.minX || e.x >= e.maxX) e.direction *= -1 as 1 | -1;

      if (s.invulnTimer <= 0 && rectCollision(s.px, s.py, s.pw, s.ph, e.x, e.y, e.width, e.height)) {
        // Stomp from above
        if (s.vy > 0 && s.py + s.ph < e.y + e.height / 2) {
          e.minX = -999; e.maxX = -999; e.x = -999;
          s.vy = JUMP_VEL / 2;
          s.score += 200;
        } else {
          s.lives--;
          s.invulnTimer = 2000;
          s.vy = JUMP_VEL / 2;
          if (s.lives <= 0) {
            s.gameOver = true;
            s.running = false;
            onGameOver(s.score);
          }
        }
      }
    });

    // Token collection
    s.tokens.forEach(t => {
      if (t.collected) return;
      if (rectCollision(s.px, s.py, s.pw, s.ph, t.x, t.y, 16, 16)) {
        t.collected = true;
        s.score += 100;
        s.tokensCollected++;
      }
    });

    // Portal
    s.portals.forEach(p => {
      if (rectCollision(s.px, s.py, s.pw, s.ph, p.x, p.y, 32, 48)) {
        if (s.currentLevel < 3) {
          s.currentLevel++;
          s.level = s.currentLevel;
          const level = generateLevel(s.currentLevel);
          Object.assign(s, level);
          s.px = 60;
          s.py = CONFIG.height - TILE - 60;
          s.cameraX = 0;
          s.vy = 0;
        } else {
          s.score += 2000; // Bonus for completing all levels
          s.gameOver = true;
          s.running = false;
          onGameOver(s.score);
        }
      }
    });

    // Camera follow
    const targetCam = s.px - CONFIG.width / 3;
    s.cameraX += (targetCam - s.cameraX) * 0.1;
    s.cameraX = Math.max(0, Math.min(s.levelWidth - CONFIG.width, s.cameraX));

    // Boundaries
    s.px = Math.max(0, Math.min(s.levelWidth - s.pw, s.px));
  }

  function render(ctx: CanvasRenderingContext2D, s: GhostState) {
    ctx.fillStyle = CONFIG.background;
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    ctx.save();
    ctx.translate(-s.cameraX, 0);

    // Background stars (parallax)
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let i = 0; i < 60; i++) {
      const sx = (i * 173 + 11) % s.levelWidth;
      const sy = (i * 97 + 23) % CONFIG.height;
      ctx.fillRect(sx - s.cameraX * 0.3, sy, 1, 1);
    }

    // Platforms
    s.platforms.forEach(p => {
      if (p.type === 'breakable' && p.broken) return;
      if (p.x + p.width < s.cameraX - 20 || p.x > s.cameraX + CONFIG.width + 20) return;
      ctx.fillStyle = p.type === 'solid' ? '#1a1040' :
        p.type === 'moving' ? '#2a1060' : '#3a1020';
      ctx.fillRect(p.x, p.y, p.width, p.height);
      ctx.strokeStyle = p.type === 'moving' ? '#a855f7' : 'rgba(0,212,255,0.3)';
      ctx.strokeRect(p.x, p.y, p.width, p.height);
    });

    // Enemies
    s.enemies.forEach(e => {
      if (e.x < -100) return;
      ctx.fillStyle = e.type === 'bug' ? '#ff4444' : '#ff8800';
      ctx.fillRect(e.x, e.y, e.width, e.height);
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(e.x + 4, e.y + 4, 6, 6);
      ctx.fillRect(e.x + 14, e.y + 4, 6, 6);
      ctx.fillStyle = '#000';
      ctx.fillRect(e.x + (e.direction > 0 ? 7 : 5), e.y + 6, 3, 3);
      ctx.fillRect(e.x + (e.direction > 0 ? 17 : 15), e.y + 6, 3, 3);
    });

    // Tokens (GHAI coins)
    s.tokens.forEach(t => {
      if (t.collected) return;
      if (t.x < s.cameraX - 20 || t.x > s.cameraX + CONFIG.width + 20) return;
      const bobY = Math.sin((s.timer / 500) + t.bobOffset) * 3;
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(t.x + 8, t.y + 8 + bobY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffaa00';
      drawText(ctx, 'G', t.x + 3, t.y + 13 + bobY, 8, '#0a0a1f');
    });

    // Portals
    s.portals.forEach(p => {
      ctx.fillStyle = `rgba(168,85,247,${0.5 + Math.sin(s.timer / 300) * 0.3})`;
      ctx.fillRect(p.x, p.y, 32, 48);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, 32, 48);
      ctx.lineWidth = 1;
      drawText(ctx, 'EXIT', p.x + 16, p.y + 28, 6, '#fff', 'center');
    });

    // Player (ghost character)
    if (s.invulnTimer <= 0 || Math.floor(s.timer / 100) % 2 === 0) {
      // Body
      ctx.fillStyle = '#00d4ff';
      ctx.fillRect(s.px + 4, s.py, s.pw - 8, s.ph - 4);
      ctx.fillRect(s.px, s.py + 4, s.pw, s.ph - 12);
      // Ghost tail
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(s.px + i * 8, s.py + s.ph - 8, 6, 8);
      }
      // Eyes
      ctx.fillStyle = '#fff';
      const eyeOffset = s.facingRight ? 2 : -2;
      ctx.fillRect(s.px + 6 + eyeOffset, s.py + 8, 4, 6);
      ctx.fillRect(s.px + 14 + eyeOffset, s.py + 8, 4, 6);
      ctx.fillStyle = '#000';
      ctx.fillRect(s.px + 7 + eyeOffset, s.py + 10, 2, 3);
      ctx.fillRect(s.px + 15 + eyeOffset, s.py + 10, 2, 3);
    }

    ctx.restore();

    // HUD
    drawHUD(ctx, s, CONFIG.width);
    const levelNames = ['Void Station', 'Quantum Labs', 'Trading Floor'];
    drawText(ctx, levelNames[s.currentLevel - 1] || '', CONFIG.width / 2, 55, 8, '#a855f7', 'center');
    drawText(ctx, `GHAI: ${s.tokensCollected}`, CONFIG.width - 8, 55, 8, '#ffd700', 'right');

    // Game over
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
      drawText(ctx, s.currentLevel > 3 ? 'YOU WIN!' : 'GAME OVER', CONFIG.width / 2, CONFIG.height / 2 - 20, 20, s.currentLevel > 3 ? '#00d4ff' : '#ff4444', 'center');
      drawText(ctx, `SCORE: ${s.score}`, CONFIG.width / 2, CONFIG.height / 2 + 20, 14, '#00d4ff', 'center');
    }
  }

  gameLoop(ctx, state, CONFIG, update as any, render as any);
  return () => { state.running = false; };
}
