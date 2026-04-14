---
name: break-room
description: Build the Break Room feature for voidexa.com. Use this skill when working on /break-room page, arcade games (GHAI Invaders, Ghost Jump, Void Pong, KCP Stacker), AI character chat lounge, jukebox with SUNO music, YouTube lounge, or the highscore leaderboard. Triggers on any mention of "break room", "arcade", "jukebox", "AI lounge", "ghost jump", "ghai invaders", "void pong", "kcp stacker", "beat the CEO", or "character chat" in the context of voidexa.
---

# Break Room — Build Skill

## Context
This is a new page at /break-room on voidexa.com (C:\Users\Jixwu\Desktop\voidexa).
It's a fun, social space with 5 sections: AI Lounge, Arcade Corner (4 games), Jukebox, YouTube Lounge, Highscore Leaderboard.

## Game Development Patterns

### Canvas Game Engine (shared by all 4 games)
```typescript
// game-engine.ts — shared foundation
interface GameState {
  score: number;
  lives: number;
  level: number;
  running: boolean;
  paused: boolean;
}

interface GameConfig {
  width: number;       // canvas width (responsive)
  height: number;      // canvas height (responsive)
  fps: number;         // target frame rate (60)
  background: string;  // dark space color
}

// Standard game loop
function gameLoop(ctx: CanvasRenderingContext2D, state: GameState, update: Function, render: Function) {
  if (!state.running) return;
  update(state);
  render(ctx, state);
  requestAnimationFrame(() => gameLoop(ctx, state, update, render));
}

// Input handler (keyboard + touch)
function setupInput(canvas: HTMLCanvasElement): InputState {
  // Keyboard: arrows + space + escape
  // Touch: virtual d-pad overlay for mobile
}

// Score submission
async function submitScore(game: string, playerName: string, score: number) {
  await fetch('/api/break-room/highscore', {
    method: 'POST',
    body: JSON.stringify({ game, player_name: playerName, score })
  });
}
```

### Ghost Jump (Mario-style platformer) Pattern
```typescript
// ghost-jump.ts
// Physics: gravity 0.5, jump velocity -12, move speed 5
// Double jump: one mid-air jump allowed
// Collision: AABB rectangle overlap
// Levels: tile-based (2D array), each tile 32x32px
// Camera: follows player horizontally, smooth scroll
// Enemies: patrol left-right on platforms, touch = lose life
// Tokens: floating GHAI coins, +100 points each
// Portals: touch = teleport to next section
// Art: 16-bit pixel style, voidexa color palette
// 3 levels: Void Station (easy), Quantum Labs (medium), Trading Floor (hard)

interface Platform { x: number; y: number; width: number; type: 'solid' | 'moving' | 'breakable'; }
interface Enemy { x: number; y: number; direction: 1 | -1; speed: number; type: 'bug' | 'exploit'; }
interface Token { x: number; y: number; collected: boolean; }
interface Portal { x: number; y: number; destination: { x: number; y: number }; }
```

### GHAI Invaders Pattern
```typescript
// Standard space invaders grid: 5 rows x 8 columns
// Row colors: purple (30pt), green (20pt), blue (10pt)
// Movement: step right → drop → step left → drop → repeat
// Speed increases: every 10 enemies killed, step interval -50ms
// Player: 3 lives, shoots upward, 1 bullet at a time (or upgrade to 2)
// Enemy bullets: random enemy fires every 1-2 seconds
// Shields: 3 destructible barriers
```

### Void Pong Pattern
```typescript
// Classic pong with twist: ball splits after 5 paddle hits
// Paddle height: 80px, ball size: 10px
// Ball speed increases 5% each hit
// Split mechanic: both balls active, miss one = opponent scores
// AI opponent: tracks closest ball with slight delay (difficulty)
```

### KCP Stacker Pattern
```typescript
// Standard 10-wide, 20-tall grid
// 7 piece types (I, O, T, S, Z, J, L) in voidexa colors
// Scoring: 1 line = 100, 2 = 300, 3 = 500, 4 = 800 ("KCP Compress!")
// Level up every 10 lines, speed increases
// Ghost piece preview at bottom
// Next piece preview
// Hold piece (one swap per drop)
```

## AI Character Chat Pattern
```typescript
// Each character has a system prompt defining personality
// Max 200 tokens per response (cost control)
// Rate limit: 1 message per 5 seconds per session
// Model routing:
//   Claude character → Anthropic API (claude-sonnet-4-20250514)
//   GPT character → OpenAI API (gpt-4o)
//   Gemini character → Google API (gemini-pro)
//   Perplexity character → Anthropic API with Perplexity persona
//   Llama character → Ollama local if available, else Anthropic
//   Jix character → Anthropic API with founder persona (rare spawn)
```

## Jukebox Pattern
```typescript
// tracks.json format:
{
  "tracks": [
    {
      "id": "dk-001",
      "title": "Kernen i Mig",
      "artist": "Viktor Stål",        // fictive name
      "language": "danish",
      "file": "/music/danish/kernen-i-mig.mp3",
      "duration": "3:42"
    }
  ]
}
// HTML5 Audio API for playback
// Supabase for ratings (one per IP per track)
```

## "Beat the CEO" System
```typescript
// CEO scores stored in tracks.json or hardcoded config
// Display: golden crown icon next to CEO score on leaderboard
// If player beats CEO: confetti animation + "You beat the CEO!" banner
// Optional: GHAI reward badge (visual only for now, real rewards later)
```

## Mobile Touch Controls
```typescript
// Virtual d-pad overlay for all games on mobile
// Left half of screen: movement (swipe or virtual stick)
// Right side: action button (jump/shoot)
// Pause: tap top-center area
```

## Supabase Integration
- Project: ihuljnekxkyqgroklurp (EU)
- Tables: arcade_highscores, jukebox_ratings
- RLS: public read, authenticated or IP-based write with rate limiting
- Admin: ceo@voidexa.com can reset scores

## Hard Rules
1. Vanilla JS + Canvas for all games — no Phaser, no PixiJS, no game frameworks
2. No copyrighted assets — all pixel art and sprites created from scratch
3. Mobile responsive with touch controls
4. Dark space aesthetic matching voidexa.com
5. Each game must load in under 2 seconds
6. AI chat responses capped at 200 tokens
7. One rating per track per IP
8. Rate limit highscore submissions
9. Test with npm run build before committing
