-- Break Room: Arcade highscores
CREATE TABLE IF NOT EXISTS arcade_highscores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game TEXT NOT NULL,
  player_name TEXT NOT NULL DEFAULT 'Anonymous',
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_highscores_game_score ON arcade_highscores(game, score DESC);

-- Break Room: Jukebox ratings
CREATE TABLE IF NOT EXISTS jukebox_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(track_id, ip_hash)
);

-- RLS: public read for highscores
ALTER TABLE arcade_highscores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read highscores" ON arcade_highscores FOR SELECT USING (true);
CREATE POLICY "Anyone can insert highscores" ON arcade_highscores FOR INSERT WITH CHECK (true);

-- RLS: public read for jukebox ratings
ALTER TABLE jukebox_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ratings" ON jukebox_ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ratings" ON jukebox_ratings FOR INSERT WITH CHECK (true);
