-- ============================================================================
-- AFS-18 - Cards Storage Bucket
-- ============================================================================
-- Public-read bucket for the 1000 Alpha card webp images.
-- Files live at: cards/alpha/{rarity}/{filename}.webp (path locked by Task 4
-- upload script; see SKILL docs/skills/sprint-afs-18-alpha-deploy.md).
--
-- Decisions (locked per SKILL v2 Apr 28):
--   - public = true (free anonymous reads, fair-use egress on Supabase)
--   - SELECT policy: anyone (anon + authenticated)
--   - INSERT/UPDATE/DELETE policies: NONE on purpose -- the only writer is
--     scripts/upload_alpha_to_supabase.ts running with
--     SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS entirely
--   - Migration is idempotent: re-applying does not duplicate the bucket
--     row or fail on the policy create
-- ============================================================================

-- Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('cards', 'cards', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policy (idempotent via DROP IF EXISTS)
DROP POLICY IF EXISTS "cards_public_read" ON storage.objects;

CREATE POLICY "cards_public_read"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'cards');

-- ----------------------------------------------------------------------------
-- Post-apply verification (run in SQL editor after migration):
--
--   SELECT id, name, public FROM storage.buckets WHERE id = 'cards';
--   -- expect: 1 row, public = true
--
--   SELECT polname FROM pg_policy
--     WHERE polrelid = 'storage.objects'::regclass
--       AND polname = 'cards_public_read';
--   -- expect: 1 row
-- ----------------------------------------------------------------------------
