# SKILL — AFS-18: Alpha 1000 Cards Image Wiring + V3 Replacement (v2)

**Sprint:** AFS-18
**Priority:** P1
**Version:** v2 (reshape after pre-flight revealed AFS-6d already shipped frame + tables + routes)
**Backup tag:** `backup/pre-afs-18-{YYYYMMDD}` (set at Task 0)
**Sprint tag (on completion):** `sprint-afs-18-complete`
**Depends on:** AFS-5 ✅ (1000 PNGs exist), AFS-6d ✅ (Alpha pages + DB shipped)
**Unblocks:** AFS-17 (LoRA training set complete), `/cards` page no longer broken

---

## V1 → V2 RESHAPE RATIONALE

Pre-flight discovered most of v1 SKILL was already shipped under AFS-6d (commit `b5d6161`):

- ✅ `alpha_cards` table populated in Supabase
- ✅ `user_decks` table with 5-slot save
- ✅ `AlphaCardFrame.tsx` component shipped
- ✅ `AlphaCatalog.tsx` paginated grid + 9 type tabs
- ✅ `AlphaDeckBuilder.tsx` + supporting components
- ✅ Routes `/cards/alpha` + `/cards/alpha/deck-builder` (EN + DK)

**Actual remaining gap (the real AFS-18 work):**

1. AlphaCardFrame uses **9 generic category PNGs** instead of the 1000 unique renders Jix paid $41.52 for
2. `/cards` and `/dk/cards` still render V3 (broken frames, missing cards)
3. The 1000 PNGs are not in Supabase Storage yet
4. No image URL mapping between manifest IDs and Supabase paths

V2 narrows AFS-18 to wiring the existing infrastructure to the real assets.

---

## EXECUTION RULE

`claude --dangerously-skip-permissions` mode for sprint execution.

**Stop checkpoints:** Task 0 SKILL commit, Task 1 backup verify (DONE), Task 4 webp conversion review, Task 5 SQL migration apply, Task 11 live verify.

---

## SCOPE

### IN SCOPE

- Convert 1000 PNG → webp (Jix local, ~70% size reduction)
- Create Supabase Storage bucket `cards` with public read RLS
- Upload 1000 webp to bucket at deterministic path: `cards/alpha/{rarity}/{filename}.webp`
- Modify `AlphaCardFrame.tsx` to render unique image per card (replace 9 generic category PNGs with deterministic Supabase URL)
- Replace V3 rendering on `/cards` with `<AlphaCatalog />` component (in-place, keep `/cards/alpha` also live for backward compat)
- Replace V3 rendering on `/dk/cards` same way
- Redirect `/cards/deck-builder` (V3) → `/cards/alpha/deck-builder` via 308
- Redirect `/dk/cards/deck-builder` → `/dk/cards/alpha/deck-builder` via 308
- Tests: image URL resolution, V3 imports removed from `/cards`, redirects in place
- V3 files stay on disk (NOT deleted)

### OUT OF SCOPE

- V3 file deletion from repo (keep, just stop rendering)
- New `image_url` DB column (using deterministic URL pattern instead, no migration)
- AlphaCardFrame visual redesign (RARITY_GLOW stays — AFS-6d "do not touch")
- Pack BUY flow re-enable (`/shop/packs` stays "Coming Soon" — AFS-6a domain)
- LoRA fine-tuning (AFS-17)
- DK route `/dk/cards/alpha/deck-builder` rebuild (AFS-26 scope)
- Battle scene cards (AFS-6h scope)
- Save-deck schema changes (AFS-6d already shipped)

---

## LOCKED DECISIONS (Apr 28, post pre-flight)

| Item | Locked value |
|---|---|
| Backup status | ✅ DONE — D:\krypteret USB + Proton Drive both 1001 files |
| Asset hosting | Supabase Storage bucket `cards` (public read RLS) |
| Asset format | webp quality 85 (converted from source PNG) |
| Image URL pattern | Deterministic: `cards/alpha/{rarity}/{nnnn}_{rarity}_{name}.webp` |
| /cards strategy | Replace V3 import with `<AlphaCatalog />`, keep `/cards/alpha` also live |
| V3 deck-builder | 308 redirect → Alpha deck-builder |
| Frame colors | KEEP existing RARITY_GLOW (per AFS-6d "do not touch") |
| Migration | Jix applies SQL manually in Supabase Editor (project rule) |
| V3 files | KEEP on disk — only stop rendering |
| Manifest field mapping | `rarity` (not tier), `name` (not card_name), `prompt_field` (not prompt_version) |

---

## TASK 0 — SKILL v2 commit (mandatory rule)

```bash
# v2 SKILL must be committed before any other code changes
git add docs/skills/sprint-afs-18-alpha-deploy.md
git commit -m "chore(afs-18): SKILL v2 reshape — narrow scope after pre-flight"
git push origin main

# Backup tag
git tag backup/pre-afs-18-{YYYYMMDD}
git push origin backup/pre-afs-18-{YYYYMMDD}
```

---

## TASK 1 — Backup verification ✅ COMPLETE

Verified Apr 28:
- Source: `C:\Users\Jixwu\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_tiered\` — 1001 files
- D:\krypteret USB: `D:\krypteret usb\afs-5-alpha-1000-backup-20260428\` — 1001 files
- Proton Drive: `C:\Users\Jixwu\Proton Drive\jix.wulff\My files\afs-5-alpha-1000-backup-20260428\` — 1001 files

No further action.

---

## TASK 2 — PNG → webp conversion (Jix local)

### Sub-task 2.1: Install cwebp

```powershell
winget install Google.LibWebP
cwebp -version
```

If winget unavailable, fallback: download `libwebp` release from Google.

### Sub-task 2.2: Conversion script

Claude Code writes: `scripts/convert_alpha_to_webp.ps1`

Behavior:
- Source: `C:\Users\Jixwu\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_tiered\`
- Output: `C:\Users\Jixwu\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_webp\`
- Quality: 85
- Naming: `{nnnn}_{rarity}_{name}.png` → `{nnnn}_{rarity}_{name}.webp`
- Skip files already converted (resume safe)
- Per-file log: source size, output size, ratio
- Final report: total source MB, total output MB, ratio

### Sub-task 2.3: Run + spot check

```powershell
.\scripts\convert_alpha_to_webp.ps1
```

Spot check 6 webp (1 per rarity tier) — visual quality acceptable, no compression artifacts. Especially mythic + legendary (most detail).

**STOP CHECKPOINT:** Jix confirms quality OK before Task 3.

---

## TASK 3 — Supabase Storage bucket migration

Claude Code writes: `supabase/migrations/{timestamp}_create_cards_bucket.sql`

```sql
-- AFS-18: Cards storage bucket
-- Public read access for card art

INSERT INTO storage.buckets (id, name, public)
VALUES ('cards', 'cards', true)
ON CONFLICT (id) DO NOTHING;

-- RLS: anyone can read
CREATE POLICY "cards_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'cards');
```

No INSERT policy — uploads happen via SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.

**Jix applies migration manually in Supabase SQL Editor (Results tab).**

Verify after apply:
```sql
SELECT id, name, public FROM storage.buckets WHERE id = 'cards';
```

---

## TASK 4 — Upload script

Claude Code writes: `scripts/upload_alpha_to_supabase.ts`

Behavior:
- Read all webp from `images_webp/`
- For each file, parse rarity from filename: `{nnnn}_{rarity}_{name}.webp`
- Upload to bucket `cards` with path: `alpha/{rarity}/{filename}.webp`
- Use `SUPABASE_SERVICE_ROLE_KEY` from env
- Concurrency: 10 parallel uploads
- Resume safe: skip files already in bucket (use `head` request)
- Final report: uploaded, skipped, failed

Required env (in `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Run:
```bash
npx tsx scripts/upload_alpha_to_supabase.ts
```

**Verify via Supabase Dashboard:** bucket `cards` → folder `alpha` → 6 rarity folders → 1000 total files.

---

## TASK 5 — Image URL helper

Claude Code writes: `lib/cards/alpha-image-url.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const PUBLIC_BUCKET_BASE = `${SUPABASE_URL}/storage/v1/object/public/cards`;

/**
 * Returns deterministic public URL for an Alpha card webp.
 * Pattern: {SUPABASE_URL}/storage/v1/object/public/cards/alpha/{rarity}/{nnnn}_{rarity}_{name}.webp
 *
 * Inputs come from alpha_cards row (already in DB):
 *   - id (number 0-999)
 *   - rarity ('common'|'uncommon'|'rare'|'epic'|'legendary'|'mythic')
 *   - name (snake_case from manifest)
 */
export function getAlphaCardImageUrl(
  id: number,
  rarity: string,
  name: string
): string {
  const padded = String(id).padStart(4, '0');
  const filename = `${padded}_${rarity}_${name}.webp`;
  return `${PUBLIC_BUCKET_BASE}/alpha/${rarity}/${filename}`;
}

/** Fallback if card image fails to load (404) — return generic category PNG. */
export function getAlphaCardFallbackUrl(type: string): string {
  // Existing 9 generic PNGs in public/cards/category-art/
  return `/cards/category-art/${type}.png`;
}
```

**Reconciliation note:** alpha_cards row column names must match manifest. Pre-flight inferred id+rarity+name fields exist. Claude Code verifies actual column names in Task 5.5 before writing helper.

### Sub-task 5.5: Verify alpha_cards schema

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'alpha_cards'
ORDER BY ordinal_position;
```

If actual column for snake_name is different (e.g. `card_name`, `name`, `internal_name`), adjust `getAlphaCardImageUrl` parameters to match.

---

## TASK 6 — AlphaCardFrame image wiring

Modify `components/cards/AlphaCardFrame.tsx`:

**Current behavior (per pre-flight):** uses `TYPE_TO_IMAGE` map to pick 1 of 9 generic category PNGs.

**New behavior:** receive `imageUrl` prop, fall back to category PNG only if image fails to load.

Changes:
1. Add `imageUrl?: string` to component props
2. Render `<img src={imageUrl ?? fallbackUrl} onError={swapToFallback} />` for the art slot
3. Keep all RARITY_GLOW logic untouched
4. Keep all existing styling untouched

Update callers (`AlphaCatalog.tsx`):
- Import `getAlphaCardImageUrl` from `lib/cards/alpha-image-url.ts`
- Pass `imageUrl={getAlphaCardImageUrl(card.id, card.rarity, card.name)}` to each `<AlphaCardFrame />`

Update other callers (AlphaDeckBuilder, AlphaDeckBar, AlphaDeckSlots if they render cards).

---

## TASK 7 — Replace V3 on /cards (EN)

Modify `app/cards/page.tsx`:

**Current:** imports + renders `<CardCollection />` (V3, from `components/combat/CardCollection.tsx`)

**New:** import + render `<AlphaCatalog />` (already shipped under AFS-6d)

Add comment block at the change point:
```tsx
// AFS-18 (Apr 28): /cards now renders Alpha 1000 instead of V3 First Edition.
// V3 had missing cards + broken custom frames per Jix audit. V3 components
// (components/combat/CardCollection.tsx, lib/cards/full_library.ts) remain
// in repo for possible future restoration. Do not re-import without explicit
// approval. /cards/alpha route stays live as backward-compat alias.
```

Page metadata: update title from V3-specific to Alpha-focused.

---

## TASK 8 — Replace V3 on /dk/cards

Same change as Task 7 applied to `app/dk/cards/page.tsx`. Title in DK if applicable.

---

## TASK 9 — Redirect V3 deck-builder routes

Modify `next.config.ts` to add 308 redirects:

```ts
// AFS-18: V3 deck-builder is broken. Redirect to Alpha deck-builder.
{
  source: '/cards/deck-builder',
  destination: '/cards/alpha/deck-builder',
  permanent: true,
},
{
  source: '/dk/cards/deck-builder',
  destination: '/dk/cards/alpha/deck-builder',
  permanent: true,
},
```

(If V3 deck-builder route doesn't exist as a redirect target — pre-flight implied it does — verify and adjust.)

---

## TASK 10 — Tests

Target: ~+20-30 assertions

### tests/cards/alpha-image-url.test.ts
- `getAlphaCardImageUrl(0, 'common', 'spark_discharge')` returns expected pattern
- All 6 rarities produce valid URLs
- Padding: id=42 → "0042"
- Edge case: id=999 → "0999"

### tests/cards/cards-page-afs18.test.ts (walker pattern)
- `app/cards/page.tsx` does NOT import `CardCollection`
- `app/cards/page.tsx` DOES import `AlphaCatalog`
- `app/dk/cards/page.tsx` same checks
- `next.config.ts` contains the two new 308 redirects

### tests/cards/alpha-frame-image.test.ts
- AlphaCardFrame accepts `imageUrl` prop
- Fallback to category PNG when imageUrl undefined
- Fallback triggers on `onError`

### Regression
- V3 files still on disk: `components/combat/CardCollection.tsx`, `lib/cards/full_library.ts`
- `alpha_cards` schema unchanged (no migration this sprint)
- `user_decks` schema unchanged

---

## TASK 11 — Live verification (Claude in Chrome bridge)

Requires Jix click "Connect" in Chrome extension.

Routes:
- `/cards` — renders Alpha 1000 (not V3), pagination works, type filter works, sample card shows unique art (not generic category PNG)
- `/cards/alpha` — still works (backward compat)
- `/cards/deck-builder` — 308 redirects to `/cards/alpha/deck-builder`
- `/cards/alpha/deck-builder` — Alpha cards visible with unique art, deck save works
- `/dk/cards` — same as `/cards`

Spot check 6 cards (1 per rarity) — verify each shows its unique art, not a fallback generic PNG.

Screenshot evidence stored in session log.

---

## TASK 12 — Sprint close

```bash
# Tag
git tag sprint-afs-18-complete
git push origin sprint-afs-18-complete

# CLAUDE.md sprint history row
# (update with HEAD, tests count, test delta, key files changed)

# Push final state
git status  # clean
git log origin/main --oneline -5
```

Update `CLAUDE.md`:
- Add SLUT 18 entry with sprint summary
- Update test count
- Mark AFS-18 ✅ in P0 bug table

---

## DEFINITION OF DONE

- [x] Backup verified (Task 1 — DONE pre-execution)
- [ ] 1000 webp files in Supabase Storage `cards/alpha/{rarity}/`
- [ ] AlphaCardFrame renders unique image per card with category-PNG fallback
- [ ] `/cards` renders AlphaCatalog (no V3 imports in page)
- [ ] `/dk/cards` same
- [ ] V3 deck-builder routes 308 to Alpha deck-builder
- [ ] V3 files still on disk
- [ ] Tests +20-30, all green
- [ ] Live verified — 6 sample cards show unique art on each rarity
- [ ] Tagged + pushed
- [ ] CLAUDE.md updated

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-18-{YYYYMMDD}
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-18-complete
```

Supabase Storage rollback (optional):
- Bucket can stay empty (no harm)
- Or empty alpha/ folder via Supabase Dashboard

---

## RISKS

| Risk | Mitigation |
|---|---|
| webp quality unacceptable on mythic/legendary | Quality 85 spot check Task 2.3, can re-run with 90+ |
| alpha_cards schema column names differ from manifest | Task 5.5 verifies before helper code |
| Image URL 404 if name mismatch between DB and webp filename | onError fallback to category PNG, log to console for debugging |
| Vercel deploy size if any large file accidentally committed | Spot check git diff before push — only code changes, no PNGs/webp |
| V3 imports still pulled by some test harness | Walker pattern test catches |
| Pre-flight missed something else | Continue STOP-checkpoint discipline at Task 4, 5, 11 |

---

## NOTES FOR CLAUDE CODE

1. **V2 SKILL is locked.** No further reshape unless Task 5.5 reveals schema surprise.
2. **Backup confirmed DONE.** Safe to convert PNGs.
3. **Migration applied by Jix manually** — Claude does not run Supabase migrations.
4. **V3 stays on disk** — only stop rendering.
5. **CLAUDE.md update at end** — sprint history row required.
6. **No new Stripe/payment code.**
7. **Frame colors UNCHANGED** — RARITY_GLOW stays per AFS-6d "do not touch".
