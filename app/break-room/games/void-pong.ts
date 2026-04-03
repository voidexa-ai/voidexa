// Void Pong — Classic pong with ball-split mechanic

import {
  GameState, GameConfig, createGameState,
  setupCanvas, setupInput, gameLoop, drawText
} from './game-engine';

interface Ball {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  active: boolean;
}

interface PongState extends GameState {
  playerY: number;
  aiY: number;
  playerScore: number;
  aiScore: number;
  balls: Ball[];
  hitCount: number;
  hasSplit: boolean;
  paddleW: number;
  paddleH: number;
  serving: boolean;
  serveTimer: number;
  winScore: number;
}

const CONFIG: GameConfig = { width: 480, height: 400, fps: 60, background: '#0a0a1f' };
const PADDLE_W = 12, PADDLE_H = 80;
const BALL_SIZE = 10;
const BALL_SPEED = 4;
const AI_SPEED = 3.5;
const WIN_SCORE = 11;

function createBall(toRight: boolean): Ball {
  const angle = (Math.random() * 0.8 - 0.4);
  return {
    x: CONFIG.width / 2,
    y: CONFIG.height / 2,
    vx: BALL_SPEED * (toRight ? 1 : -1) * Math.cos(angle),
    vy: BALL_SPEED * Math.sin(angle),
    size: BALL_SIZE,
    active: true,
  };
}

function createState(): PongState {
  return {
    ...createGameState(),
    playerY: CONFIG.height / 2 - PADDLE_H / 2,
    aiY: CONFIG.height / 2 - PADDLE_H / 2,
    playerScore: 0,
    aiScore: 0,
    balls: [createBall(true)],
    hitCount: 0,
    hasSplit: false,
    paddleW: PADDLE_W,
    paddleH: PADDLE_H,
    serving: true,
    serveTimer: 1000,
    winScore: WIN_SCORE,
  };
}

export function startVoidPong(
  canvas: HTMLCanvasElement,
  onGameOver: (score: number) => void
) {
  const ctx = setupCanvas(canvas, CONFIG);
  const input = setupInput(canvas);
  const state = createState();
  state.running = true;

  function update(s: PongState, dt: number) {
    if (s.gameOver) return;

    // Serve delay
    if (s.serving) {
      s.serveTimer -= dt;
      if (s.serveTimer <= 0) s.serving = false;
      return;
    }

    // Player paddle
    if (input.up) s.playerY = Math.max(0, s.playerY - 6);
    if (input.down) s.playerY = Math.min(CONFIG.height - PADDLE_H, s.playerY + 6);

    // AI paddle — tracks closest ball
    const activeBalls = s.balls.filter(b => b.active);
    if (activeBalls.length > 0) {
      const closest = activeBalls.reduce((a, b) =>
        Math.abs(a.x - (CONFIG.width - 30)) < Math.abs(b.x - (CONFIG.width - 30)) ? a : b
      );
      const aiCenter = s.aiY + PADDLE_H / 2;
      const diff = closest.y - aiCenter;
      const aiActualSpeed = AI_SPEED + s.hitCount * 0.05;
      if (Math.abs(diff) > 8) {
        s.aiY += Math.sign(diff) * Math.min(aiActualSpeed, Math.abs(diff));
      }
      s.aiY = Math.max(0, Math.min(CONFIG.height - PADDLE_H, s.aiY));
    }

    // Move balls
    s.balls.forEach(ball => {
      if (!ball.active) return;

      ball.x += ball.vx;
      ball.y += ball.vy;

      // Top/bottom bounce
      if (ball.y <= 0 || ball.y + ball.size >= CONFIG.height) {
        ball.vy *= -1;
        ball.y = Math.max(0, Math.min(CONFIG.height - ball.size, ball.y));
      }

      // Player paddle hit (left)
      if (ball.vx < 0 && ball.x <= 30 + PADDLE_W &&
          ball.y + ball.size >= s.playerY && ball.y <= s.playerY + PADDLE_H &&
          ball.x >= 30) {
        ball.vx = Math.abs(ball.vx) * 1.05;
        ball.vy += (ball.y - (s.playerY + PADDLE_H / 2)) * 0.05;
        s.hitCount++;

        // Split after 5 hits
        if (s.hitCount >= 5 && !s.hasSplit) {
          s.hasSplit = true;
          s.balls.push({
            x: ball.x,
            y: ball.y,
            vx: ball.vx,
            vy: -ball.vy * 1.2,
            size: BALL_SIZE,
            active: true,
          });
        }
      }

      // AI paddle hit (right)
      if (ball.vx > 0 && ball.x + ball.size >= CONFIG.width - 30 - PADDLE_W &&
          ball.y + ball.size >= s.aiY && ball.y <= s.aiY + PADDLE_H &&
          ball.x + ball.size <= CONFIG.width - 30) {
        ball.vx = -Math.abs(ball.vx) * 1.05;
        ball.vy += (ball.y - (s.aiY + PADDLE_H / 2)) * 0.05;
        s.hitCount++;
      }

      // Score — ball goes past left or right
      if (ball.x < -20) {
        ball.active = false;
        s.aiScore++;
      }
      if (ball.x > CONFIG.width + 20) {
        ball.active = false;
        s.playerScore++;
      }
    });

    // If no active balls, serve new
    if (s.balls.every(b => !b.active)) {
      s.balls = [createBall(s.aiScore > s.playerScore)];
      s.hasSplit = false;
      s.hitCount = 0;
      s.serving = true;
      s.serveTimer = 800;
    }

    // Check win
    if (s.playerScore >= WIN_SCORE || s.aiScore >= WIN_SCORE) {
      s.gameOver = true;
      s.running = false;
      s.score = s.playerScore;
      onGameOver(s.playerScore);
    }
  }

  function render(ctx: CanvasRenderingContext2D, s: PongState) {
    ctx.fillStyle = CONFIG.background;
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    // Center line
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(100,200,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(CONFIG.width / 2, 0);
    ctx.lineTo(CONFIG.width / 2, CONFIG.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Scores
    drawText(ctx, `${s.playerScore}`, CONFIG.width / 2 - 40, 40, 20, 'rgba(0,212,255,0.3)', 'right');
    drawText(ctx, `${s.aiScore}`, CONFIG.width / 2 + 40, 40, 20, 'rgba(168,85,247,0.3)', 'left');

    // Player paddle
    ctx.fillStyle = '#00d4ff';
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(30, s.playerY, PADDLE_W, PADDLE_H);

    // AI paddle
    ctx.fillStyle = '#a855f7';
    ctx.shadowColor = '#a855f7';
    ctx.fillRect(CONFIG.width - 30 - PADDLE_W, s.aiY, PADDLE_W, PADDLE_H);
    ctx.shadowBlur = 0;

    // Balls
    s.balls.forEach(ball => {
      if (!ball.active) return;
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
    });
    ctx.shadowBlur = 0;

    // Split warning
    if (s.hitCount >= 3 && !s.hasSplit) {
      drawText(ctx, `SPLIT IN ${5 - s.hitCount}`, CONFIG.width / 2, CONFIG.height - 20, 8, '#ff6600', 'center');
    }
    if (s.hasSplit) {
      drawText(ctx, 'QUANTUM SPLIT!', CONFIG.width / 2, CONFIG.height - 20, 8, '#a855f7', 'center');
    }

    // Serve text
    if (s.serving) {
      drawText(ctx, 'GET READY', CONFIG.width / 2, CONFIG.height / 2, 12, '#00d4ff', 'center');
    }

    // Game over
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
      const won = s.playerScore >= WIN_SCORE;
      drawText(ctx, won ? 'YOU WIN!' : 'AI WINS', CONFIG.width / 2, CONFIG.height / 2 - 20, 20, won ? '#00d4ff' : '#ff4444', 'center');
      drawText(ctx, `${s.playerScore} - ${s.aiScore}`, CONFIG.width / 2, CONFIG.height / 2 + 20, 14, '#a855f7', 'center');
    }
  }

  gameLoop(ctx, state, CONFIG, update as any, render as any);
  return () => { state.running = false; };
}
