# SKILL — AFS-18: Alpha 1000 Cards Deploy + V3 Removal

**Sprint:** AFS-18
**Priority:** P1
**Status:** v1 (pre-flight required before Task 0)
**Backup tag:** `backup/pre-afs-18-{YYYYMMDD}` (set at Task 0)
**Sprint tag (on completion):** `sprint-afs-18-complete`
**Depends on:** AFS-5 ✅ COMPLETE (1000 alpha PNGs on Jix PC)
**Unblocks:** AFS-17 (LoRA pipeline can train against deployed set)

---

## EXECUTION RULE

`claude --dangerously-skip-permissions` mode for sprint execution.

**Stop checkpoints:** Pre-flight, Task 1 backup verify, Task 2 asset migration, Task 7 final test, Task 8 live verify.

---

## SCOPE

Deploy 1000 Alpha card images to /cards page. Remove V3 First Edition surface from /cards rendering (V3 missing cards + wrong images per Jix Apr 28). Apply single thin premium frame styling. Use Supabase Storage bucket for asset hosting. Convert PNG → webp for ~70% size reduction.

### IN SCOPE

- Convert 1000 PNG → webp (Jix local, before push)
- Upload converted webp to Supabase Storage bucket `cards` (public read)
- Wire `/cards` to render only Alpha 1000 (read from bucket)
- Apply thin premium frame (rarity → frame color)
- Pagination 20 per page, filter by type (9 types)
- Remove V3 from /cards rendering path (keep V3 files in repo, do not delete)
- Update `app/cards/alpha/deck-builder` to read alpha set
- Tests: frame consistency, asset path resolution, type filter, pagination, regression on V3 file existence (still on disk)

### OUT OF SCOPE

- V3 file deletion from repo (keep, just stop rendering)
- Game Hub migration (separate sprint, not yet planned)
- Pack BUY flow re-enable (`/shop/packs` stays "Coming Soon" — AFS-6a domain)
- Card text/stats/abilities authoring (data exists in `alpha_set_master.md` + `batch_*.json`)
- LoRA fine-tuning (AFS-17)
- DK route `/dk/cards` (AFS-26 scope)
- Battle scene cards (AFS-6h scope)
- /shop/packs library count copy (still "ALPHA LIBRARY" without count, per AFS-6a-fix lockdown)

---

## LOCKED DECISIONS (Apr 28)

| Item | Locked value |
|---|---|
| Cleanup level | (a) slet V3 fra /cards rendering, behold filer i repo |
| Asset hosting | Supabase Storage bucket `cards` (public read RLS) |
| Asset format | webp (converted from source PNG) |
| Tab structure | NONE — single Alpha view, no tabs |
| Page size | 20 cards per page |
| Filter | By card type (9 types from ETAPE 3) |
| Frame | Single thin premium frame, rarity → color |
| Frame colors | Common grey, Uncommon green, Rare cyan, Epic purple, Legendary gold, Mythic magenta |
| Public name | "Alpha Premium" (under Universe → Cards in nav) |
| Total cards | 1000 (399c + 280u + 160r + 90e + 50l + 20m) |
| Asset size budget | ~450 MB after webp conversion (down from 1.5 GB PNG) |

---

## PRE-FLIGHT (mandatory — STOP after for Jix approval)

Per AFS-6b SKILL v2 reshape lesson: SKILL.md written from INDEX context can be wrong. Verify against actual repo state before any code.

### Step 0.1 — /cards route inventory

```bash
find app/cards -type f | sort
find app/dk/cards -type f 2>/dev/null | sort
ls public/cards/ 2>/dev/null
```

Expected unknowns:
- Does `app/cards/page.tsx` exist? Or is it nested?
- Does `app/cards/alpha/deck-builder/page.tsx` exist? (SLUT 16 verified yes)
- Where do the bad V3 frames render today?
- What's in `public/cards/` currently?

### Step 0.2 — V3 frame implementation

```bash
grep -rn "frame" components/cards/ lib/cards/ app/cards/ 2>/dev/null | head -50
grep -rn "card_frame\|cardFrame\|CardFrame" --include="*.tsx" --include="*.ts" | head -30
git log --oneline --all -- "**/CardFrame*" "**/card-frame*" "**/cardframe*" 2>/dev/null | head -20
```

Goal: locate (a) the broken custom frames laid over V3 and (b) any earlier thin-frame variant before custom-frame attempts.

### Step 0.3 — Card data sources

```bash
ls lib/cards/ 2>/dev/null
ls docs/alpha_set/ 2>/dev/null
test -f lib/cards/full_card_library.json && echo "V3 data: yes" || echo "V3 data: no"
test -f docs/alpha_set/alpha_set_master.md && echo "Alpha master: yes" || echo "Alpha master: no"
ls docs/alpha_set/batch_*.json 2>/dev/null | wc -l
```

### Step 0.4 — Supabase Storage state

```bash
# Via Supabase CLI or admin client — check if bucket "cards" exists
# (Jix may need to apply migration manually per project rule)
```

Expected: bucket does not exist yet. Migration creates bucket + RLS policy for public read.

### Step 0.5 — Manifest + asset path

Verify Jix PC location:
```
C:\Users\Jixwu\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_tiered\manifest.json
C:\Users\Jixwu\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_tiered\*.png
```

Manifest format check: does each entry have `id`, `tier`, `card_name`, `prompt_version`?

### Step 0.6 — Backup status check

Per Apr 27 SLUT 17 backup risk note: `images_tiered/` is single-disk SPOF.

**Question for Jix:** Has `images_tiered/` been copied to Google Drive or D:\krypteret USB yet? If NO, Task 1 below is blocking.

### STOP CHECKPOINT — Pre-flight findings report

Claude Code reports findings to Jix in this format:

```
PRE-FLIGHT FINDINGS

1. /cards route: [actual structure]
2. V3 frame: located at [paths], rendering pattern is [X]
3. Pre-custom thin frame: [found at commit X / not found]
4. Card data: V3 [Y/N], Alpha master [Y/N], batches [N/10]
5. Supabase bucket "cards": [exists / does not exist]
6. Manifest format: [matches expected / differs in: ...]
7. Backup status: [done / NOT DONE — blocking Task 1]

PROPOSED SKILL v2 RESHAPE (if any):
- [bullet list of corrections needed]

WAITING FOR JIX APPROVAL TO PROCEED.
```

If reshape needed: write SKILL v2, commit, then proceed. Do NOT execute v1 if pre-flight reveals premise wrong.

---

## TASK 1 — Backup verification (BLOCKING)

**Owner:** Jix (manual)

Single-disk SPOF on 1.5 GB images_tiered/ must be resolved before any conversion that overwrites or moves source files.

**Required before Task 2:**
1. Copy entire `images_tiered/` folder to Google Drive
2. Copy entire `images_tiered/` folder to D:\krypteret USB
3. Verify both copies have correct file count (1001 files including manifest.json)
4. Confirm to Claude Code: "Backup done"

**Test:**
```powershell
# Verify file count
(Get-ChildItem "C:\Users\Jixwu\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_tiered\" -File).Count
# Should be ~1001 (1000 PNGs + manifest.json)
```

DO NOT PROCEED to Task 2 without explicit "backup done" from Jix.

---

## TASK 2 — PNG → webp conversion (Jix local + Claude Code script)

**Goal:** Convert 1000 PNG files to webp, ~70% size reduction (1.5 GB → ~450 MB).

### Sub-task 2.1: Install conversion tooling

```powershell
# On Jix PC, install ImageMagick or use cwebp directly
# cwebp comes with libwebp — recommended for batch
winget install Google.LibWebP
```

Verify:
```powershell
cwebp -version
```

### Sub-task 2.2: Conversion script

Claude Code writes: `scripts/convert_alpha_to_webp.ps1`

Script behavior:
- Read source dir: `C:\Users\Jixwu\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_tiered\`
- Output dir: `C:\Users\Jixwu\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_webp\`
- Quality: 85 (good balance, premium look preserved)
- Preserve naming: `{id}_{tier}_{card_name}.png` → `{id}_{tier}_{card_name}.webp`
- Log per-file: source size, output size, ratio
- Final report: total source MB, total output MB, ratio

### Sub-task 2.3: Run conversion + spot check

```powershell
.\scripts\convert_alpha_to_webp.ps1
```

Spot check 6 sample webp (1 per tier) — open, verify quality acceptable, no compression artifacts.

### Stop checkpoint

Jix confirms quality OK before Task 3 upload.

---

## TASK 3 — Supabase Storage bucket setup

**Owner:** Jix manually applies migration (project rule: Claude does not run migrations).

### Sub-task 3.1: Migration SQL

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

-- RLS: only authenticated admins can insert (initial seeding via service key bypass)
CREATE POLICY "cards_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cards' AND public.is_admin());
```

### Sub-task 3.2: Jix applies migration

Jix runs in Supabase SQL Editor (Results tab, single statement at a time if needed).

Verify bucket exists:
```sql
SELECT id, name, public FROM storage.buckets WHERE id = 'cards';
```

### Sub-task 3.3: Upload script

Claude Code writes: `scripts/upload_alpha_to_supabase.ts`

Behavior:
- Read all webp from `images_webp/`
- Upload to bucket `cards` with path: `alpha/{tier}/{filename}.webp`
- Use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS for seeding)
- Concurrency: 10 parallel uploads
- Resume capability: skip files already in bucket
- Final report: total uploaded, total skipped, total failed

### Sub-task 3.4: Run upload

```bash
node scripts/upload_alpha_to_supabase.ts
```

Verify via Supabase dashboard: bucket "cards" → folder "alpha" → 6 tier folders, ~1000 files total.

---

## TASK 4 — Manifest seeding to repo

Claude Code:
- Copy `manifest.json` from Jix PC to `lib/cards/alpha_manifest.json`
- Validate: 1000 entries, all have id+tier+card_name+prompt_version
- Add helper `lib/cards/alpha-loader.ts` exposing:
  - `getAllAlpha()` returns 1000 cards
  - `getByType(type)` filters by card type
  - `getByTier(tier)` filters by rarity
  - `getCardImageUrl(id)` returns Supabase public URL

URL pattern:
```
https://{project}.supabase.co/storage/v1/object/public/cards/alpha/{tier}/{filename}.webp
```

Use existing Supabase client from `lib/supabase-server.ts` if needed for signed URLs (probably not — public read).

---

## TASK 5 — Frame component

Claude Code:

1. Locate broken custom V3 frame layer (per pre-flight finding)
2. Either restore pre-custom thin frame OR write fresh thin frame component if pre-custom doesn't exist in git history
3. Component: `components/cards/AlphaFrame.tsx`
4. Props: `rarity`, `cardId`, `imageUrl`, `name`, `type`, `text` (optional for catalog vs full card view)
5. Style: thin border (~2-3px), color from rarity map, subtle premium gradient/shadow
6. Single shared frame — no per-tier custom geometry, only color shift

Rarity → color map (locked):
```ts
export const RARITY_FRAME_COLORS = {
  common: 'border-slate-400',      // grey
  uncommon: 'border-emerald-500',   // green
  rare: 'border-cyan-400',          // cyan/blue
  epic: 'border-purple-500',        // purple
  legendary: 'border-amber-400',    // gold
  mythic: 'border-fuchsia-500',     // magenta
} as const;
```

Tailwind v4 — verify these tokens render in current build.

---

## TASK 6 — /cards page rewrite

### Sub-task 6.1: Page structure

`app/cards/page.tsx`:
- Header: "Alpha Premium · 1000 Cards"
- Filter bar: 9 type pills (Weapon / Drone / Defense / Maneuver / AI Routine / Module / Equipment / Field / Ship Core) + "All"
- Card grid: 20 per page (4×5 or 5×4 responsive)
- Pagination controls (page N of 50)
- Each card: AlphaFrame with image + name + type + tier label

### Sub-task 6.2: Remove V3 rendering

- Identify V3 render entry (likely something like `<V3CardLibrary />` or similar)
- Remove from `/cards` rendering only (keep file)
- Add comment block at removed line:
  ```tsx
  // V3 First Edition removed from /cards Apr 28 (AFS-18) — missing
  // cards + wrong images per Jix. V3 data + components remain in repo
  // (lib/cards/full_card_library.json, components/cards/v3/*) for
  // possible future restoration. Do not re-import without Jix approval.
  ```

### Sub-task 6.3: Filter + pagination logic

Server component if possible (no useState needed for static filter), or thin client component with URL search params (`?type=weapon&page=3`).

---

## TASK 7 — Deck builder Alpha wire

`app/cards/alpha/deck-builder/page.tsx`:
- Verify it currently exists (per SLUT 16 audit, yes)
- Wire to alpha-loader.ts (replace whatever data source it uses today)
- Inventory pane (bottom): all 1000 alpha cards, filterable by type
- Active deck pane (top): horizontal bar, drag cards up
- Toggle 5/10/15 cards (per SLUT 9 lock)
- 5 saved decks per user (per SLUT 9 lock — schema check needed: does `user_decks` table exist?)

If `user_decks` table doesn't exist: defer save-deck functionality to follow-up sprint, ship view-only deck builder in AFS-18.

---

## TASK 8 — Tests

Target: +20-30 assertions

### Unit tests
- `tests/cards/alpha-loader.test.ts`
  - 1000 cards loadable
  - All 9 types represented
  - All 6 tiers represented
  - Tier counts: 399 / 280 / 160 / 90 / 50 / 20

- `tests/cards/alpha-frame.test.ts`
  - Each rarity renders with correct border color class
  - Frame component accepts all 6 rarity values
  - Image src maps to Supabase URL pattern

- `tests/cards/cards-page.test.ts` (walker pattern per AFS-6b lesson)
  - `/cards` page does NOT import V3 components
  - `/cards` page DOES import alpha-loader
  - Filter pills count = 10 (9 types + All)

### Regression tests
- V3 files still exist on disk (`lib/cards/full_card_library.json` present)
- V3 components still in repo (no accidental delete)

### Live verify (Task 9)
- /cards loads, shows Alpha grid
- Tier color visible on cards (sample: 1 common + 1 mythic)
- Filter by "Weapon" reduces grid
- Pagination works (page 2 → different cards)
- Deck builder loads Alpha cards

---

## TASK 9 — Live verification (Claude in Chrome bridge)

Requires Jix click "Connect" in Chrome extension.

Routes to verify:
- `/cards` — Alpha 1000 visible, filter works, pagination works
- `/cards/alpha/deck-builder` — inventory shows Alpha cards
- One sample card detail view (if route exists)
- `/dk/cards` — should still work (currently mirrors EN, AFS-26 owns DK build)

Screenshot evidence stored in session log.

---

## TASK 10 — Sprint close

- Tag: `sprint-afs-18-complete`
- Backup tag: `backup/pre-afs-18-{date}`
- Update `CLAUDE.md` with sprint history row
- Update INDEX deltas at SLUT
- Commit count expected: ~8-10

---

## DEFINITION OF DONE

- [ ] 1000 webp files in Supabase Storage `cards/alpha/{tier}/`
- [ ] Manifest in `lib/cards/alpha_manifest.json` (1000 entries)
- [ ] AlphaFrame component renders with rarity colors
- [ ] /cards renders only Alpha (V3 not visible)
- [ ] Filter + pagination working
- [ ] Deck builder loads Alpha
- [ ] Tests +20-30, all green
- [ ] Live verified
- [ ] Tagged + pushed
- [ ] V3 files still on disk (not deleted)
- [ ] Backup confirmed (Google Drive + USB) before any source-touching task

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-18-{date}
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-18-complete
```

Supabase Storage rollback (optional, if needed):
- Bucket can stay (no harm)
- Or empty alpha/ folder via Supabase dashboard

---

## RISKS

| Risk | Mitigation |
|---|---|
| Backup not done before conversion | Task 1 BLOCKING — verify before Task 2 |
| webp quality unacceptable on premium tiers | Quality 85 spot check Task 2.3, can re-run with 90+ |
| Supabase bucket egress cost | Public bucket has free egress for fair use; monitor |
| /cards regression breaks /cards/alpha/deck-builder | Test 7 covers, regression catch |
| V3 files accidentally deleted | DoD explicit: V3 files still on disk |
| `user_decks` table missing | Defer save-deck to follow-up, ship view-only |
| Pre-flight reveals broken assumption | SKILL v2 reshape protocol (per AFS-6b lesson) |

---

## NOTES FOR CLAUDE CODE

1. **Pre-flight is mandatory** — STOP at Step 0.6 checkpoint, report findings.
2. **Backup verification is BLOCKING** — Task 2 requires Jix "backup done" confirmation.
3. **Migration applied by Jix manually** — Claude does not run Supabase migrations.
4. **Single thin frame, no per-tier geometry** — only color shift.
5. **V3 stays on disk** — only stop rendering, don't delete.
6. **CLAUDE.md update at end** — sprint history row required.
7. **No new Stripe/payment code** — pack BUY stays "Coming Soon" (AFS-6a domain).
