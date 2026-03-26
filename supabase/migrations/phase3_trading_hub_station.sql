-- Phase 3: Trading Hub + Space Station
-- Run in Supabase SQL Editor (project: ihuljnekxkyqgroklurp, EU)

-- ============================================================
-- TABLE: trading_hub_bots
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trading_hub_bots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    return_pct DECIMAL(10, 2) DEFAULT 0,
    sharpe_ratio DECIMAL(8, 4) DEFAULT 0,
    max_drawdown DECIMAL(8, 4) DEFAULT 0,
    regime_score TEXT DEFAULT 'all' CHECK (regime_score IN ('btc','eth','alt','risk-off','all')),
    strategy_type TEXT,
    upload_date TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','paused','rejected')),
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_trading_hub_bots_user ON public.trading_hub_bots(user_id);
CREATE INDEX idx_trading_hub_bots_return ON public.trading_hub_bots(return_pct DESC);

ALTER TABLE public.trading_hub_bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active bots"
    ON public.trading_hub_bots FOR SELECT
    USING (status = 'active');

CREATE POLICY "Users manage own bots"
    ON public.trading_hub_bots FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access bots"
    ON public.trading_hub_bots FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: trading_hub_uploads
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trading_hub_uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_size INTEGER,
    upload_date TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'scanning' CHECK (status IN ('scanning','analyzed','failed','rejected')),
    ai_scan_result JSONB,
    strategy_type_detected TEXT,
    similar_bots_found INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_trading_hub_uploads_user ON public.trading_hub_uploads(user_id);

ALTER TABLE public.trading_hub_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own uploads"
    ON public.trading_hub_uploads FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users create uploads"
    ON public.trading_hub_uploads FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access uploads"
    ON public.trading_hub_uploads FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: forum_threads
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('strategy','post-mortem','market','help','competition')),
    content TEXT NOT NULL,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_forum_threads_created ON public.forum_threads(created_at DESC);
CREATE INDEX idx_forum_threads_category ON public.forum_threads(category);

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read threads"
    ON public.forum_threads FOR SELECT USING (true);

CREATE POLICY "Authenticated create threads"
    ON public.forum_threads FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own threads"
    ON public.forum_threads FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admin full access threads"
    ON public.forum_threads FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: forum_replies
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_forum_replies_thread ON public.forum_replies(thread_id, created_at ASC);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read replies"
    ON public.forum_replies FOR SELECT USING (true);

CREATE POLICY "Authenticated create replies"
    ON public.forum_replies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access replies"
    ON public.forum_replies FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Auto-increment reply_count on new reply
CREATE OR REPLACE FUNCTION public.increment_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.forum_threads SET reply_count = reply_count + 1, updated_at = now()
    WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_forum_reply ON public.forum_replies;
CREATE TRIGGER on_new_forum_reply
    AFTER INSERT ON public.forum_replies
    FOR EACH ROW EXECUTE FUNCTION public.increment_thread_reply_count();

-- ============================================================
-- TABLE: competitions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    prizes JSONB DEFAULT '{"first": 10000, "second": 5000, "third": 2500}'::jsonb,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','active','ended')),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read competitions"
    ON public.competitions FOR SELECT USING (true);

CREATE POLICY "Admin full access competitions"
    ON public.competitions FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: competition_entries
-- ============================================================
CREATE TABLE IF NOT EXISTS public.competition_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bot_id UUID REFERENCES public.trading_hub_bots(id) ON DELETE SET NULL,
    score DECIMAL(10, 4) DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(competition_id, user_id)
);

CREATE INDEX idx_competition_entries_comp ON public.competition_entries(competition_id, score DESC);

ALTER TABLE public.competition_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read entries"
    ON public.competition_entries FOR SELECT USING (true);

CREATE POLICY "Authenticated enter competition"
    ON public.competition_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access entries"
    ON public.competition_entries FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: station_ideas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.station_ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_station_ideas_votes ON public.station_ideas(votes DESC);

ALTER TABLE public.station_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read ideas"
    ON public.station_ideas FOR SELECT USING (true);

CREATE POLICY "Authenticated submit ideas"
    ON public.station_ideas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated upvote ideas"
    ON public.station_ideas FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access ideas"
    ON public.station_ideas FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed: sample competition
INSERT INTO public.competitions (title, description, start_date, end_date, prizes, status)
VALUES (
    'April Regime Challenge',
    'Build a bot that outperforms in the current BTC-dominated regime. All strategies welcome.',
    '2026-04-01T00:00:00Z',
    '2026-04-30T23:59:59Z',
    '{"first": 10000, "second": 5000, "third": 2500}',
    'upcoming'
) ON CONFLICT DO NOTHING;
