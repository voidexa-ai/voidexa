-- voidexa Gaming — Phase 1 Foundation
-- Source of truth: docs/VOIDEXA_GAMING_COMBINED_V2.md (PART 12)
-- Project: ihuljnekxkyqgroklurp (EU)
-- Scope: 15 core gaming tables + RLS. UI layer comes in later phases.

-- ============================================================================
-- Admin helper
-- ============================================================================
-- Convention across voidexa: ceo@voidexa.com is admin (see app/api/admin/stats).
-- Using a SECURITY DEFINER function keeps policies terse and one-edit updatable.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(auth.jwt() ->> 'email', '') = 'ceo@voidexa.com';
$$;

-- ============================================================================
-- TABLE: user_cards — player's card collection
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    acquired_from TEXT CHECK (acquired_from IN ('starter','mission','exploration','pack','quest','craft','pioneer','achievement')),
    first_acquired_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, template_id)
);

CREATE INDEX idx_user_cards_user ON public.user_cards(user_id);
CREATE INDEX idx_user_cards_template ON public.user_cards(template_id);

ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_cards_own_select" ON public.user_cards
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_cards_own_insert" ON public.user_cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_cards_own_update" ON public.user_cards
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_cards_own_delete" ON public.user_cards
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "user_cards_admin_all" ON public.user_cards
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: decks — saved decks (max 10 per user, enforced app-side)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.decks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'New Deck',
    ship_class_restriction TEXT CHECK (ship_class_restriction IN ('starter','fighter','hauler','explorer','salvager')),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_decks_user ON public.decks(user_id);

ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decks_own_select" ON public.decks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "decks_own_insert" ON public.decks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "decks_own_update" ON public.decks
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "decks_own_delete" ON public.decks
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "decks_admin_all" ON public.decks
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: deck_cards — deck composition (deck size 20, max 2 copies)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.deck_cards (
    deck_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1 CHECK (count BETWEEN 1 AND 2),
    PRIMARY KEY (deck_id, template_id)
);

CREATE INDEX idx_deck_cards_deck ON public.deck_cards(deck_id);

ALTER TABLE public.deck_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deck_cards_own_select" ON public.deck_cards
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.decks d WHERE d.id = deck_cards.deck_id AND d.user_id = auth.uid())
    );
CREATE POLICY "deck_cards_own_insert" ON public.deck_cards
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.decks d WHERE d.id = deck_cards.deck_id AND d.user_id = auth.uid())
    );
CREATE POLICY "deck_cards_own_update" ON public.deck_cards
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.decks d WHERE d.id = deck_cards.deck_id AND d.user_id = auth.uid())
    );
CREATE POLICY "deck_cards_own_delete" ON public.deck_cards
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.decks d WHERE d.id = deck_cards.deck_id AND d.user_id = auth.uid())
    );
CREATE POLICY "deck_cards_admin_all" ON public.deck_cards
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: battle_sessions — PvE and PvP match records
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.battle_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL CHECK (mode IN ('pve','pvp')),
    opponent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    boss_template TEXT,
    ship_id TEXT,
    deck_id UUID REFERENCES public.decks(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','won','lost','abandoned','draw')),
    seed TEXT NOT NULL,
    turns_played INTEGER DEFAULT 0,
    reward_ghai INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX idx_battle_sessions_user ON public.battle_sessions(user_id, started_at DESC);
CREATE INDEX idx_battle_sessions_opponent ON public.battle_sessions(opponent_user_id) WHERE opponent_user_id IS NOT NULL;
CREATE INDEX idx_battle_sessions_active ON public.battle_sessions(status) WHERE status = 'active';

ALTER TABLE public.battle_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "battle_sessions_own_select" ON public.battle_sessions
    FOR SELECT USING (auth.uid() IN (user_id, opponent_user_id));
CREATE POLICY "battle_sessions_own_insert" ON public.battle_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "battle_sessions_own_update" ON public.battle_sessions
    FOR UPDATE USING (auth.uid() IN (user_id, opponent_user_id));
CREATE POLICY "battle_sessions_admin_all" ON public.battle_sessions
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: battle_turns — per-turn audit trail for replay validation
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.battle_turns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.battle_sessions(id) ON DELETE CASCADE,
    turn_number INTEGER NOT NULL,
    actor TEXT NOT NULL CHECK (actor IN ('player','opponent','boss')),
    action JSONB NOT NULL,
    state_snapshot JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_battle_turns_session ON public.battle_turns(session_id, turn_number);

ALTER TABLE public.battle_turns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "battle_turns_participants_select" ON public.battle_turns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.battle_sessions s
            WHERE s.id = battle_turns.session_id
              AND auth.uid() IN (s.user_id, s.opponent_user_id)
        )
    );
CREATE POLICY "battle_turns_participants_insert" ON public.battle_turns
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.battle_sessions s
            WHERE s.id = battle_turns.session_id
              AND auth.uid() IN (s.user_id, s.opponent_user_id)
        )
    );
CREATE POLICY "battle_turns_admin_all" ON public.battle_turns
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: pvp_queue — matchmaking
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pvp_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ship_id TEXT NOT NULL,
    deck_id UUID REFERENCES public.decks(id) ON DELETE SET NULL,
    rank INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','matched','cancelled','timeout')),
    session_id UUID REFERENCES public.battle_sessions(id) ON DELETE SET NULL,
    queued_at TIMESTAMPTZ DEFAULT now(),
    matched_at TIMESTAMPTZ
);

-- At most one active queue entry per user (waiting or matched). History rows stay.
CREATE UNIQUE INDEX idx_pvp_queue_one_active_per_user
    ON public.pvp_queue(user_id)
    WHERE status IN ('waiting','matched');
CREATE INDEX idx_pvp_queue_waiting ON public.pvp_queue(rank, queued_at) WHERE status = 'waiting';
CREATE INDEX idx_pvp_queue_user ON public.pvp_queue(user_id);

ALTER TABLE public.pvp_queue ENABLE ROW LEVEL SECURITY;

-- Queue is effectively public-read so clients can see estimated wait; writes are own-only.
CREATE POLICY "pvp_queue_public_select" ON public.pvp_queue
    FOR SELECT USING (true);
CREATE POLICY "pvp_queue_own_insert" ON public.pvp_queue
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pvp_queue_own_update" ON public.pvp_queue
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "pvp_queue_own_delete" ON public.pvp_queue
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "pvp_queue_admin_all" ON public.pvp_queue
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: speedrun_times — leaderboard (public read)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.speedrun_times (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pilot_name TEXT,
    track_id TEXT NOT NULL,
    ship_id TEXT NOT NULL,
    duration_ms INTEGER NOT NULL CHECK (duration_ms > 0),
    checkpoints JSONB NOT NULL DEFAULT '[]'::jsonb,
    validated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_speedrun_track_time ON public.speedrun_times(track_id, duration_ms ASC);
CREATE INDEX idx_speedrun_user ON public.speedrun_times(user_id);

ALTER TABLE public.speedrun_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY "speedrun_public_select" ON public.speedrun_times
    FOR SELECT USING (true);
CREATE POLICY "speedrun_own_insert" ON public.speedrun_times
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "speedrun_own_update" ON public.speedrun_times
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "speedrun_admin_all" ON public.speedrun_times
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: hauling_contracts — hauling mode contract ledger
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.hauling_contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_template TEXT NOT NULL,
    origin_planet TEXT NOT NULL,
    destination_planet TEXT NOT NULL,
    cargo_type TEXT,
    cargo_units INTEGER DEFAULT 1,
    risk_level TEXT NOT NULL DEFAULT 'safe' CHECK (risk_level IN ('safe','low','medium','wreck_risk')),
    reward_ghai INTEGER NOT NULL,
    route_seed TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','failed','abandoned','expired')),
    outcome_grade TEXT CHECK (outcome_grade IN ('bronze','silver','gold')),
    accepted_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_hauling_user ON public.hauling_contracts(user_id, status);
CREATE INDEX idx_hauling_status ON public.hauling_contracts(status);

ALTER TABLE public.hauling_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hauling_own_select" ON public.hauling_contracts
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "hauling_own_insert" ON public.hauling_contracts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hauling_own_update" ON public.hauling_contracts
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "hauling_admin_all" ON public.hauling_contracts
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: ship_tags — ship catalog tagging (admin-only write, public read)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ship_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ship_id TEXT NOT NULL UNIQUE,
    ship_class TEXT CHECK (ship_class IN ('starter','fighter','hauler','explorer','salvager')),
    tier TEXT CHECK (tier IN ('free','achievement','common','uncommon','rare','legendary','pioneer','soulbound')),
    role TEXT,
    suggested_price_usd NUMERIC(8,2),
    suggested_price_ghai INTEGER,
    achievement_requirement TEXT,
    notes TEXT,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ship_tags_class ON public.ship_tags(ship_class);
CREATE INDEX idx_ship_tags_tier ON public.ship_tags(tier);

ALTER TABLE public.ship_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ship_tags_public_select" ON public.ship_tags
    FOR SELECT USING (true);
CREATE POLICY "ship_tags_admin_insert" ON public.ship_tags
    FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "ship_tags_admin_update" ON public.ship_tags
    FOR UPDATE USING (public.is_admin());
CREATE POLICY "ship_tags_admin_delete" ON public.ship_tags
    FOR DELETE USING (public.is_admin());

-- ============================================================================
-- TABLE: wrecks — downed-ship recovery system
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wrecks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ship_id TEXT NOT NULL,
    ship_class TEXT,
    ship_tier TEXT,
    base_price_ghai INTEGER NOT NULL DEFAULT 500,
    position JSONB NOT NULL,
    sector TEXT,
    risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low','high')),
    phase TEXT NOT NULL DEFAULT 'protected' CHECK (phase IN ('protected','abandoned','expired','claimed','scrapped','repaired')),
    spawned_at TIMESTAMPTZ DEFAULT now(),
    protected_until TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    claimed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    claimed_at TIMESTAMPTZ,
    resolution TEXT CHECK (resolution IN ('self_repair','towed','claimed_by_other','scrapped','abandoned'))
);

CREATE INDEX idx_wrecks_owner ON public.wrecks(owner_user_id);
CREATE INDEX idx_wrecks_phase ON public.wrecks(phase);
CREATE INDEX idx_wrecks_expires ON public.wrecks(expires_at);

ALTER TABLE public.wrecks ENABLE ROW LEVEL SECURITY;

-- Wrecks are visible to everyone (needed for other pilots to claim/tow), writes are own-only or admin.
CREATE POLICY "wrecks_public_select" ON public.wrecks
    FOR SELECT USING (true);
CREATE POLICY "wrecks_owner_insert" ON public.wrecks
    FOR INSERT WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "wrecks_participants_update" ON public.wrecks
    FOR UPDATE USING (auth.uid() IN (owner_user_id, claimed_by_user_id));
CREATE POLICY "wrecks_admin_all" ON public.wrecks
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: pilot_reputation — public pilot cards
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pilot_reputation (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    pilot_name TEXT,
    successful_hauls INTEGER DEFAULT 0,
    pilots_rescued INTEGER DEFAULT 0,
    bosses_defeated INTEGER DEFAULT 0,
    speedrun_wins INTEGER DEFAULT 0,
    pvp_wins INTEGER DEFAULT 0,
    pvp_losses INTEGER DEFAULT 0,
    planet_owner TEXT,
    known_for TEXT,
    composed_title TEXT,
    active_since TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pilot_rep_hauls ON public.pilot_reputation(successful_hauls DESC);
CREATE INDEX idx_pilot_rep_rescues ON public.pilot_reputation(pilots_rescued DESC);

ALTER TABLE public.pilot_reputation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pilot_rep_public_select" ON public.pilot_reputation
    FOR SELECT USING (true);
CREATE POLICY "pilot_rep_own_insert" ON public.pilot_reputation
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pilot_rep_own_update" ON public.pilot_reputation
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "pilot_rep_admin_all" ON public.pilot_reputation
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: universe_wall — public activity feed
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.universe_wall (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL CHECK (event_type IN ('rescue','claim_planet','speed_record','boss_defeat','wreck_claim','tournament','quest_complete','pioneer_milestone','debut')),
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    subject_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subject_name TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_wall_created ON public.universe_wall(created_at DESC);
CREATE INDEX idx_wall_event_type ON public.universe_wall(event_type);
CREATE INDEX idx_wall_actor ON public.universe_wall(actor_user_id);

ALTER TABLE public.universe_wall ENABLE ROW LEVEL SECURITY;

-- Public read. Writes by service role (server-side event emitter) or admin.
-- Users CANNOT self-publish to the wall to prevent spam.
CREATE POLICY "wall_public_select" ON public.universe_wall
    FOR SELECT USING (true);
CREATE POLICY "wall_admin_all" ON public.universe_wall
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: pilot_encounters — "you've flown with this pilot before"
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pilot_encounters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pilot_a UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pilot_b UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    encounter_type TEXT CHECK (encounter_type IN ('passby','rescue','trade','duel','convoy')),
    sector TEXT,
    first_met_at TIMESTAMPTZ DEFAULT now(),
    last_met_at TIMESTAMPTZ DEFAULT now(),
    encounter_count INTEGER DEFAULT 1,
    CHECK (pilot_a <> pilot_b),
    UNIQUE (pilot_a, pilot_b)
);

CREATE INDEX idx_encounters_pilot_a ON public.pilot_encounters(pilot_a);
CREATE INDEX idx_encounters_pilot_b ON public.pilot_encounters(pilot_b);

ALTER TABLE public.pilot_encounters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "encounters_own_select" ON public.pilot_encounters
    FOR SELECT USING (auth.uid() IN (pilot_a, pilot_b));
CREATE POLICY "encounters_own_insert" ON public.pilot_encounters
    FOR INSERT WITH CHECK (auth.uid() IN (pilot_a, pilot_b));
CREATE POLICY "encounters_own_update" ON public.pilot_encounters
    FOR UPDATE USING (auth.uid() IN (pilot_a, pilot_b));
CREATE POLICY "encounters_admin_all" ON public.pilot_encounters
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: quest_templates — quest library (admin-only write, public read)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.quest_templates (
    id TEXT PRIMARY KEY,
    arc TEXT NOT NULL CHECK (arc IN ('onboarding','main','exploration','side','seasonal')),
    title TEXT NOT NULL,
    cast_issuer TEXT CHECK (cast_issuer IN ('jix','claude','gpt','gemini','perplexity','llama')),
    description TEXT NOT NULL,
    objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
    reward_ghai INTEGER DEFAULT 0,
    reward_card_template TEXT,
    reward_title TEXT,
    prerequisite_quest TEXT REFERENCES public.quest_templates(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_quest_templates_arc ON public.quest_templates(arc, sort_order);
CREATE INDEX idx_quest_templates_active ON public.quest_templates(active) WHERE active = true;

ALTER TABLE public.quest_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quest_templates_public_select" ON public.quest_templates
    FOR SELECT USING (true);
CREATE POLICY "quest_templates_admin_insert" ON public.quest_templates
    FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "quest_templates_admin_update" ON public.quest_templates
    FOR UPDATE USING (public.is_admin());
CREATE POLICY "quest_templates_admin_delete" ON public.quest_templates
    FOR DELETE USING (public.is_admin());

-- ============================================================================
-- TABLE: user_quest_progress — per-user quest state
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_quest_progress (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_id TEXT NOT NULL REFERENCES public.quest_templates(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','active','completed','failed')),
    objectives_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, quest_id)
);

CREATE INDEX idx_uqp_user ON public.user_quest_progress(user_id, status);

ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "uqp_own_select" ON public.user_quest_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "uqp_own_insert" ON public.user_quest_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "uqp_own_update" ON public.user_quest_progress
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "uqp_own_delete" ON public.user_quest_progress
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "uqp_admin_all" ON public.user_quest_progress
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- TABLE: mission_board_state — daily mission board rotation
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mission_board_state (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    board_date DATE NOT NULL UNIQUE,
    missions JSONB NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mission_board_date ON public.mission_board_state(board_date DESC);

ALTER TABLE public.mission_board_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mission_board_public_select" ON public.mission_board_state
    FOR SELECT USING (true);
CREATE POLICY "mission_board_admin_all" ON public.mission_board_state
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- updated_at triggers
-- ============================================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'user_cards','decks','ship_tags','pilot_reputation',
        'quest_templates','user_quest_progress'
    ] LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I;
             CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I
             FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();',
            t, t, t, t
        );
    END LOOP;
END$$;
