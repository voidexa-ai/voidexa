// KCP Stacker — Tetris-style block stacker with voidexa aesthetic

import {
  GameState, GameConfig, createGameState,
  setupCanvas, setupInput, gameLoop, drawText, drawHUD
} from './game-engine';

const COLS = 10, ROWS = 20;
const CELL = 24;
const CONFIG: GameConfig = {
  width: COLS * CELL + 160,
  height: ROWS * CELL + 40,
  fps: 60,
  background: '#0a0a1f',
};

type Grid = (string | null)[][];

const COLORS = ['#00d4ff', '#a855f7', '#ff6600', '#22c55e', '#3b82f6', '#f471b5', '#ffd700'];

const PIECES = [
  { shape: [[1,1,1,1]], color: COLORS[0] },                     // I
  { shape: [[1,1],[1,1]], color: COLORS[1] },                    // O
  { shape: [[0,1,0],[1,1,1]], color: COLORS[2] },                // T
  { shape: [[0,1,1],[1,1,0]], color: COLORS[3] },                // S
  { shape: [[1,1,0],[0,1,1]], color: COLORS[4] },                // Z
  { shape: [[1,0,0],[1,1,1]], color: COLORS[5] },                // J
  { shape: [[0,0,1],[1,1,1]], color: COLORS[6] },                // L
];

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

interface StackerState extends GameState {
  grid: Grid;
  current: Piece;
  next: Piece;
  held: Piece | null;
  canHold: boolean;
  dropTimer: number;
  dropInterval: number;
  linesCleared: number;
  totalLines: number;
  lastClearText: string;
  clearTextTimer: number;
}

function createGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece(): Piece {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return {
    shape: p.shape.map(r => [...r]),
    color: p.color,
    x: Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2),
    y: 0,
  };
}

function rotateCW(shape: number[][]): number[][] {
  const rows = shape.length, cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      rotated[c][rows - 1 - r] = shape[r][c];
  return rotated;
}

function fits(grid: Grid, piece: Piece): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const gx = piece.x + c, gy = piece.y + r;
      if (gx < 0 || gx >= COLS || gy >= ROWS) return false;
      if (gy >= 0 && grid[gy][gx]) return false;
    }
  }
  return true;
}

function lockPiece(grid: Grid, piece: Piece) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const gy = piece.y + r, gx = piece.x + c;
      if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
        grid[gy][gx] = piece.color;
      }
    }
  }
}

function clearLines(grid: Grid): number {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r].every(cell => cell !== null)) {
      grid.splice(r, 1);
      grid.unshift(Array(COLS).fill(null));
      cleared++;
      r++; // recheck same row
    }
  }
  return cleared;
}

function ghostY(grid: Grid, piece: Piece): number {
  let gy = piece.y;
  while (fits(grid, { ...piece, y: gy + 1 })) gy++;
  return gy;
}

function createState(): StackerState {
  return {
    ...createGameState(),
    grid: createGrid(),
    current: randomPiece(),
    next: randomPiece(),
    held: null,
    canHold: true,
    dropTimer: 0,
    dropInterval: 800,
    linesCleared: 0,
    totalLines: 0,
    lastClearText: '',
    clearTextTimer: 0,
  };
}

export function startKcpStacker(
  canvas: HTMLCanvasElement,
  onGameOver: (score: number) => void
) {
  const ctx = setupCanvas(canvas, CONFIG);
  const input = setupInput(canvas);
  const state = createState();
  state.running = true;

  let moveTimer = 0;
  let moveDelay = 150;
  let rotateReady = true;
  let holdReady = true;

  function update(s: StackerState, dt: number) {
    if (s.gameOver) return;

    // Move left/right
    moveTimer += dt;
    if (moveTimer >= moveDelay) {
      if (input.left) {
        const moved = { ...s.current, x: s.current.x - 1 };
        if (fits(s.grid, moved)) s.current.x--;
        moveTimer = 0;
        moveDelay = 80;
      }
      if (input.right) {
        const moved = { ...s.current, x: s.current.x + 1 };
        if (fits(s.grid, moved)) s.current.x++;
        moveTimer = 0;
        moveDelay = 80;
      }
    }
    if (!input.left && !input.right) moveDelay = 150;

    // Rotate
    if (input.up && rotateReady) {
      const rotated = { ...s.current, shape: rotateCW(s.current.shape) };
      if (fits(s.grid, rotated)) s.current.shape = rotated.shape;
      rotateReady = false;
    }
    if (!input.up) rotateReady = true;

    // Soft drop
    const dropSpeed = input.down ? 40 : s.dropInterval;

    // Hold
    if (input.action && holdReady && s.canHold) {
      holdReady = false;
      const saved = { ...s.current };
      if (s.held) {
        s.current = { ...s.held, x: Math.floor(COLS / 2) - 1, y: 0 };
      } else {
        s.current = s.next;
        s.next = randomPiece();
      }
      s.held = { shape: saved.shape, color: saved.color, x: 0, y: 0 };
      s.canHold = false;
    }
    if (!input.action) holdReady = true;

    // Drop timer
    s.dropTimer += dt;
    if (s.dropTimer >= dropSpeed) {
      s.dropTimer = 0;
      const dropped = { ...s.current, y: s.current.y + 1 };
      if (fits(s.grid, dropped)) {
        s.current.y++;
      } else {
        // Lock
        lockPiece(s.grid, s.current);
        const lines = clearLines(s.grid);
        if (lines > 0) {
          const scoring = [0, 100, 300, 500, 800];
          s.score += scoring[lines] * s.level;
          s.totalLines += lines;
          s.level = Math.floor(s.totalLines / 10) + 1;
          s.dropInterval = Math.max(80, 800 - (s.level - 1) * 60);
          const labels = ['', 'SINGLE', 'DOUBLE', 'TRIPLE', 'KCP COMPRESS!'];
          s.lastClearText = labels[lines];
          s.clearTextTimer = 1500;
        }
        s.current = s.next;
        s.next = randomPiece();
        s.canHold = true;
        if (!fits(s.grid, s.current)) {
          s.gameOver = true;
          s.running = false;
          onGameOver(s.score);
        }
      }
    }

    if (s.clearTextTimer > 0) s.clearTextTimer -= dt;
  }

  function render(ctx: CanvasRenderingContext2D, s: StackerState) {
    ctx.fillStyle = CONFIG.background;
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    const offsetX = 10, offsetY = 40;

    // Grid background
    ctx.fillStyle = 'rgba(10,10,30,0.8)';
    ctx.fillRect(offsetX, offsetY, COLS * CELL, ROWS * CELL);

    // Grid lines
    ctx.strokeStyle = 'rgba(100,200,255,0.05)';
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + r * CELL);
      ctx.lineTo(offsetX + COLS * CELL, offsetY + r * CELL);
      ctx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + c * CELL, offsetY);
      ctx.lineTo(offsetX + c * CELL, offsetY + ROWS * CELL);
      ctx.stroke();
    }

    // Locked cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (s.grid[r][c]) {
          ctx.fillStyle = s.grid[r][c]!;
          ctx.fillRect(offsetX + c * CELL + 1, offsetY + r * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    }

    // Ghost piece
    const gy = ghostY(s.grid, s.current);
    s.current.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const gx2 = s.current.x + c, gy2 = gy + r;
        if (gy2 >= 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(offsetX + gx2 * CELL + 1, offsetY + gy2 * CELL + 1, CELL - 2, CELL - 2);
        }
      });
    });

    // Current piece
    s.current.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const px = s.current.x + c, py = s.current.y + r;
        if (py >= 0) {
          ctx.fillStyle = s.current.color;
          ctx.fillRect(offsetX + px * CELL + 1, offsetY + py * CELL + 1, CELL - 2, CELL - 2);
        }
      });
    });

    // Side panel
    const panelX = offsetX + COLS * CELL + 16;

    // Next piece
    drawText(ctx, 'NEXT', panelX, offsetY + 16, 8, '#a855f7');
    ctx.fillStyle = 'rgba(10,10,30,0.6)';
    ctx.fillRect(panelX, offsetY + 24, 80, 60);
    s.next.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        ctx.fillStyle = s.next.color;
        ctx.fillRect(panelX + 10 + c * 16, offsetY + 32 + r * 16, 14, 14);
      });
    });

    // Hold
    drawText(ctx, 'HOLD', panelX, offsetY + 104, 8, '#00d4ff');
    ctx.fillStyle = 'rgba(10,10,30,0.6)';
    ctx.fillRect(panelX, offsetY + 112, 80, 60);
    if (s.held) {
      s.held.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell) return;
          ctx.fillStyle = s.canHold ? s.held!.color : 'rgba(100,100,100,0.4)';
          ctx.fillRect(panelX + 10 + c * 16, offsetY + 120 + r * 16, 14, 14);
        });
      });
    }

    // Stats
    drawText(ctx, 'SCORE', panelX, offsetY + 200, 8, '#888');
    drawText(ctx, `${s.score}`, panelX, offsetY + 216, 10, '#00d4ff');
    drawText(ctx, 'LEVEL', panelX, offsetY + 244, 8, '#888');
    drawText(ctx, `${s.level}`, panelX, offsetY + 260, 10, '#a855f7');
    drawText(ctx, 'LINES', panelX, offsetY + 288, 8, '#888');
    drawText(ctx, `${s.totalLines}`, panelX, offsetY + 304, 10, '#ff6600');

    // Clear text
    if (s.clearTextTimer > 0) {
      const alpha = Math.min(1, s.clearTextTimer / 500);
      drawText(ctx, s.lastClearText, offsetX + COLS * CELL / 2, offsetY + ROWS * CELL / 2,
        s.lastClearText === 'KCP COMPRESS!' ? 12 : 10,
        `rgba(255,215,0,${alpha})`, 'center');
    }

    // Game over
    if (s.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
      drawText(ctx, 'GAME OVER', CONFIG.width / 2, CONFIG.height / 2 - 20, 18, '#ff4444', 'center');
      drawText(ctx, `SCORE: ${s.score}`, CONFIG.width / 2, CONFIG.height / 2 + 20, 12, '#00d4ff', 'center');
    }
  }

  gameLoop(ctx, state, CONFIG, update as any, render as any);
  return () => { state.running = false; };
}
