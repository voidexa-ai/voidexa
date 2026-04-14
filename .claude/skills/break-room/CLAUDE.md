# Break Room — CLAUDE.md

## What This Is
A /break-room page on voidexa.com where the AI team "hangs out". Users can chat with AI characters in-persona, play retro arcade games, listen to music in a jukebox, and watch YouTube. It's the fun, human side of voidexa.

## Design Language
Same as voidexa.com:
- Background: dark gradients (#0d0a1f → #060412 → #020108)
- Primary accent: cyan (#00d4ff)
- Secondary accent: purple (#a855f7)
- Tertiary: orange (#ff6600)
- Effects: neon glow, CRT scanlines on arcade machines, retro pixel fonts for game UI
- Glass cards: rgba(10,10,25,0.85) with rgba(100,200,255,0.08) borders

## Page Layout

### 1. AI Lounge (top section)
Sci-fi break room background — sofa, table, screens, neon lights.
2-3 AI characters randomly present on each visit.
Each has an avatar + speech bubble with a random quip.
Click a character → opens chat modal. They respond in-character via real AI API.

Characters (from VOIDEXA_CAST.md):
- **Claude** — French architect. Elegant, philosophical, dry humor.
- **GPT** — Ex-military commander. Direct, tactical, competitive.
- **Gemini** — Hippie geek. Chill, creative, tangential.
- **Perplexity** — Sharp female fact-checker. Skeptical, precise.
- **Llama** — 14-year-old intern. Lazy, funny, surprisingly insightful.
- **Jix** — The founder. Rarely appears. Easter egg.

System prompts for each character are in /app/break-room/prompts/.

### 2. Arcade Corner (middle section)
4 arcade machines rendered as retro cabinets. Click to play.

**Game 1: GHAI Invaders** (Space Invaders clone)
- Rows of bug/exploit enemies descend. Shoot them with voidexa laser.
- Enemies shoot back. 3 lives.
- Scoring: purple=30, green=20, blue=10. Bonus UFO = 100.
- Increasing speed per wave.

**Game 2: Ghost Jump** (Mario-style platformer)
- Side-scrolling platformer. Run, jump, double-jump.
- Collect GHAI tokens (coins). Avoid bugs (enemies).
- Portals (pipes) teleport between sections.
- 3 levels: Void Station, Quantum Labs, Trading Floor.
- Timer-based scoring + tokens collected.
- Pixel art style, 16-bit aesthetic.

**Game 3: Void Pong** (Quantum Pong)
- Classic pong but ball splits into 2 after hitting paddle 5 times.
- Must track both balls. Miss one = opponent scores.
- Single player vs AI or local 2-player.

**Game 4: KCP Stacker** (Tetris-style)
- Falling data blocks need to be compressed (stacked tightly).
- Complete rows = "compressed". Score = compression ratio.
- Speed increases. Voidexa color scheme.

All games: vanilla JS + Canvas. No external dependencies.
Each game has a "Beat the CEO" banner showing Jix's highscore.

### 3. Jukebox (right sidebar or bottom section)
Retro jukebox machine design with glowing buttons.
Two tabs: "Danish Tracks" / "International Tracks".
Each track has: fictive artist name, song title, play button, 5-star rating.
Music files served from /public/music/ (uploaded SUNO files).
Ratings stored in Supabase table: jukebox_ratings.
"Most Popular" and "New Releases" sorting.

### 4. YouTube Lounge (bottom)
A laptop prop sitting on a table (CSS/SVG illustration).
Click the laptop screen → YouTube iframe player opens.
Default playlist: voidexa content or curated tech/AI videos.

### 5. Highscore Leaderboard
Floating leaderboard panel (toggleable).
Shows top 10 for each game.
Supabase table: arcade_highscores (game, player_name, score, created_at).
"Beat the CEO" badge next to any score above Jix's score.
Player enters a nickname before submitting score (no auth required).

## Supabase Tables Needed
```sql
-- Arcade highscores
CREATE TABLE arcade_highscores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game TEXT NOT NULL,
  player_name TEXT NOT NULL DEFAULT 'Anonymous',
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_highscores_game_score ON arcade_highscores(game, score DESC);

-- Jukebox ratings
CREATE TABLE jukebox_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(track_id, ip_hash)
);
```

## API Routes Needed
- POST /api/break-room/highscore — submit score
- GET /api/break-room/highscores?game=X — get top 10
- POST /api/break-room/rate — submit jukebox rating
- GET /api/break-room/ratings?track=X — get avg rating
- POST /api/break-room/chat — AI character chat (proxies to Anthropic/OpenAI with character system prompt)

## File Structure
```
app/break-room/
  page.tsx                    # Main layout assembling all sections
  components/
    AILounge.tsx              # Character display + chat modal
    ArcadeCorner.tsx          # 4 game cabinet cards
    Jukebox.tsx               # Music player + ratings
    YouTubeLounge.tsx         # Laptop prop + iframe
    Leaderboard.tsx           # Highscore panel
    CharacterChat.tsx         # Chat modal for AI conversations
    GameModal.tsx             # Fullscreen game wrapper
  games/
    ghai-invaders.ts          # Space invaders game logic
    ghost-jump.ts             # Mario-style platformer logic
    void-pong.ts              # Pong variant logic
    kcp-stacker.ts            # Tetris variant logic
    game-engine.ts            # Shared: canvas setup, input, loop, scoring
  prompts/
    claude.ts                 # French architect system prompt
    gpt.ts                    # Commander system prompt
    gemini.ts                 # Hippie system prompt
    perplexity.ts             # Fact-checker system prompt
    llama.ts                  # Teenager system prompt
    jix.ts                    # Founder easter egg prompt
  styles/
    break-room.css            # CRT effects, neon glow, retro fonts
app/api/break-room/
  highscore/route.ts          # POST/GET highscores
  rate/route.ts               # POST/GET ratings
  chat/route.ts               # AI character chat proxy
public/music/
  danish/                     # Danish SUNO tracks (.mp3)
  international/              # English SUNO tracks (.mp3)
  tracks.json                 # Track metadata (title, artist, filename, language)
```

## Build Order
1. break-room.css (CRT scanlines, neon glow, retro pixel font import)
2. game-engine.ts (shared canvas/input/loop/scoring)
3. ghai-invaders.ts (simplest game — test the engine)
4. ghost-jump.ts (platformer — most complex game)
5. void-pong.ts
6. kcp-stacker.ts
7. GameModal.tsx + ArcadeCorner.tsx
8. Leaderboard.tsx + Supabase tables + API routes
9. Jukebox.tsx + tracks.json + API routes
10. AILounge.tsx + CharacterChat.tsx + prompts/ + API route
11. YouTubeLounge.tsx
12. page.tsx (assemble everything)
13. Navigation: add "Break Room" to nav
14. npm run build — verify
15. Git commit: "feat: Break Room — arcade, jukebox, AI lounge, YouTube, leaderboard"
16. Deploy: npx vercel --prod

## Hard Rules
1. ALL games in vanilla JS + Canvas — zero external game libraries
2. NO copyrighted characters, music, or assets
3. Mobile responsive — games must work on touch (virtual d-pad overlay)
4. Minimum font 13px everywhere
5. AI character chat uses real API but with strict token limits (max 200 tokens/response)
6. Jukebox ratings: one rating per track per IP (prevent spam)
7. Highscores: rate limit to prevent abuse (max 1 submission per 10 seconds)
8. Git backup before build, git commit after build
9. Do NOT modify any existing pages
10. Match voidexa dark space aesthetic
