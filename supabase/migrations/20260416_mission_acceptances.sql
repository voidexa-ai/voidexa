-- Phase 1b — Mission Board acceptance tracker.
--
-- The existing `mission_board_state` table holds the daily board rotation
-- (one row per date, all 8 missions in a JSONB blob). It has no user_id and
-- should not be confused with this one. This table records a PLAYER accepting
-- a specific mission from the board.

CREATE TABLE IF NOT EXISTS public.mission_acceptances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'accepted'
        CHECK (status IN ('accepted','in_progress','completed','failed','abandoned')),
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    outcome_grade TEXT CHECK (outcome_grade IN ('bronze','silver','gold')),
    reward_ghai INTEGER
);

CREATE INDEX IF NOT EXISTS idx_mission_acceptances_user
    ON public.mission_acceptances(user_id, accepted_at DESC);
CREATE INDEX IF NOT EXISTS idx_mission_acceptances_mission
    ON public.mission_acceptances(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_acceptances_active
    ON public.mission_acceptances(user_id)
    WHERE status IN ('accepted','in_progress');

ALTER TABLE public.mission_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mission_acceptances_own_select" ON public.mission_acceptances
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "mission_acceptances_own_insert" ON public.mission_acceptances
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mission_acceptances_own_update" ON public.mission_acceptances
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "mission_acceptances_own_delete" ON public.mission_acceptances
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "mission_acceptances_admin_all" ON public.mission_acceptances
    FOR ALL USING (public.is_admin());
