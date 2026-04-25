-- ============================================================================
-- AFS-6d — alpha_cards + user_decks
-- ============================================================================
-- Premium 1000-card Alpha set catalog and per-user saved decks (max 5 active).
--
-- V3 "First Edition Free Try-Out" infra (user_cards / decks / deck_cards in
-- 20260417_game_core.sql) is UNTOUCHED. This migration runs in parallel.
--
-- Schema decisions (locked SLUT 9 + AFS-6d pre-flight + post-review fixes):
--   1. Field names match docs/alpha_set/batch_*.json source verbatim:
--      name, energy_cost, effect_text, flavor_text  (NOT title/cost/ability/flavor)
--   2. Stats are flat columns (attack int, defense int). Type-flavor metadata
--      lives in extras jsonb: subsystem_target, escalation, dual_identity, cargo.
--   3. type values are lowercase + underscored. Source uses titlecase
--      ("AI Routine", "Ship Core"); seed script normalizes "AI Routine"
--      -> "ai_routine" and "Ship Core" -> "ship_core".
--   4. alpha_cards.card_set column dropped post-review — the table name is
--      the identifier. user_decks.card_set discriminator remains for the
--      Alpha/V3 future-unification path.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: alpha_cards — 1000-row Alpha catalog (public read of active rows)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alpha_cards (
    id text PRIMARY KEY,
    type text NOT NULL CHECK (
        type IN (
            'weapon',
            'drone',
            'ai_routine',
            'defense',
            'module',
            'maneuver',
            'equipment',
            'field',
            'ship_core'
        )
    ),
    name text NOT NULL,
    energy_cost integer NOT NULL CHECK (energy_cost >= 0),
    attack integer,
    defense integer,
    rarity text NOT NULL CHECK (
        rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')
    ),
    archetype text,
    keywords text[] NOT NULL DEFAULT '{}'::text[],
    effect_text text NOT NULL,
    flavor_text text,
    extras jsonb NOT NULL DEFAULT '{}'::jsonb,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alpha_cards_type ON public.alpha_cards(type);
CREATE INDEX IF NOT EXISTS idx_alpha_cards_rarity ON public.alpha_cards(rarity);
CREATE INDEX IF NOT EXISTS idx_alpha_cards_active ON public.alpha_cards(active);

ALTER TABLE public.alpha_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alpha_cards_public_select" ON public.alpha_cards
    FOR SELECT USING (active = true);

-- ----------------------------------------------------------------------------
-- TABLE: user_decks — saved decks (max 5 active per user, enforced by trigger)
-- ----------------------------------------------------------------------------
-- Parallel to game_core.decks (V3). card_set discriminator leaves the door
-- open for future V3 unification; AFS-6d ships only 'alpha' on day 1.
-- card_ids holds an ordered array of alpha_cards.id (60 for alpha format).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_decks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL DEFAULT 'New Deck',
    card_set text NOT NULL CHECK (card_set IN ('alpha', 'v3')),
    card_ids text[] NOT NULL DEFAULT '{}'::text[],
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_decks_user ON public.user_decks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_decks_user_active
    ON public.user_decks(user_id, active);

ALTER TABLE public.user_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_decks_owner_select" ON public.user_decks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_decks_owner_insert" ON public.user_decks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_decks_owner_update" ON public.user_decks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_decks_owner_delete" ON public.user_decks
    FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- TRIGGER: enforce max 5 ACTIVE decks per user (INSERT or UPDATE OF active)
-- ----------------------------------------------------------------------------
-- Fires BEFORE INSERT and BEFORE UPDATE OF active. Soft-deleted decks
-- (active=false) do not count toward the cap. The function exits early when
-- NEW.active is not TRUE, or when an UPDATE leaves active already TRUE
-- (no change in active count). The count excludes the current row via
-- id IS DISTINCT FROM NEW.id, so plain field edits never trip it.
--
-- Edge case closed vs initial INSERT-only design: a user with 5 active decks
-- who soft-deletes one and then flips an older soft-deleted deck back to
-- active=true via UPDATE is now blocked at the server.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_max_5_decks()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Skip when the operation does not result in an active deck.
    IF NEW.active IS NOT TRUE THEN
        RETURN NEW;
    END IF;

    -- Skip UPDATE that leaves active=true unchanged (e.g. rename, card_ids edit).
    IF TG_OP = 'UPDATE' AND OLD.active IS TRUE THEN
        RETURN NEW;
    END IF;

    -- INSERT, or UPDATE flipping active false -> true: count peers excluding self.
    IF (
        SELECT count(*)
        FROM public.user_decks
        WHERE user_id = NEW.user_id
          AND active = true
          AND id IS DISTINCT FROM NEW.id
    ) >= 5 THEN
        RAISE EXCEPTION 'MAX_5_DECKS_PER_USER';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_decks_max_5 ON public.user_decks;

CREATE TRIGGER user_decks_max_5
    BEFORE INSERT OR UPDATE OF active ON public.user_decks
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_max_5_decks();

-- ============================================================================
-- ROLLBACK (manual, if needed):
--   DROP TRIGGER IF EXISTS user_decks_max_5 ON public.user_decks;
--   DROP FUNCTION IF EXISTS public.enforce_max_5_decks();
--   DROP TABLE IF EXISTS public.user_decks;
--   DROP TABLE IF EXISTS public.alpha_cards;
-- ============================================================================
