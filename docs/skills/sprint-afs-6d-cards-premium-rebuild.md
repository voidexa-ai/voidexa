# SKILL — AFS-6d: Cards Premium Frame + 1000 Alpha + Deck Builder + 9-image wiring

**Repo:** `voidexa-ai/voidexa` (main app)
**Branch:** `main`
**Status:** 🔴 NEEDS EXECUTION
**Priority:** P0
**Strategy locked:** SLUT 9 (Apr 25 2026)
**Replaces:** AFS-5 1000-unique-render scope (SUPERSEDED)
**Position:** After AFS-6a-fix (`6144e08`), parallel to AFS-6f (shop cosmetics bug)

---

## CONTEXT

### Why this sprint
The 1000 Alpha card data has existed locally since Apr 19 (`b47053e` merge commit) but has never been deployable because:
1. No premium frame component existed (V3 frame style is the only frame in the codebase)
2. No 1000-card art was renderable at scale (9-image strategy locked SLUT 9 fixes this)
3. No deck builder UX for 60-card decks (V3 used 20-card decks)
4. No 9-type catalog (V3 had 6 types, Alpha adds Equipment + Field + Ship Core)

This sprint ships the entire Alpha set as a playable system using the 9-image art strategy as art layer, while leaving V3 ("First Edition · Free Try-Out") completely untouched.

### Previous sprint state
- AFS-6a-fix complete: `/shop/cosmetics`, `/inventory`, Universe nav 9-item, pack shop "Coming Soon" lockdown until Alpha 1000 ships (this sprint un-locks it)
- HEAD: `6144e08`
- Tests: 1014/1014 green
- Working tree: clean (5 V3 reference files intentionally untracked)

### What MUST NOT change
- V3 catalog at `/cards` (or wherever it currently lives) — V3 stays as-is, becomes "First Edition · Free Try-Out"
- V3 frame component
- V3 art (mismatched or otherwise — leave it)
- `/wallet` GHAI balance logic (AFS-2)
- `/shop/cosmetics` cosmetic flow (AFS-6a-fix)
- `/inventory` page (AFS-6a-fix)
- Real-world Shop v1 (`/shop`, AFS-6a)

### What SHIPS
1. New premium frame component with rarity-based color
2. 9 type-category art images wired (jix delivers PNGs to `public/cards/category-art/`)
3. Paginated Alpha catalog at new route (max 20/page, 9 type tabs)
4. Deck builder UX with horizontal active-deck bar
5. `alpha_cards` Supabase table + 1000-row seed
6. `user_decks` Supabase table for 5 saved decks per user
7. Alpha pack shop unlock (un-disable BUY button per AFS-6a-fix lockdown)

---

## ART ASSET INVENTORY (jix delivers before Task 1)

Required at `public/cards/category-art/`:

| File | Status |
|---|---|
| `01_weapon.png` | ✅ delivered (Apr 25, 512×341 placeholder) |
| `02_drone.png` | ✅ delivered |
| `03_ai_routing.png` | ✅ delivered (note: filename uses "routing", check Alpha data uses "AI Routine" or "AI Routing") |
| `04_defense.png` | ✅ delivered |
| `05_module.png` | ✅ delivered |
| `06_maneuver.png` | ✅ delivered |
| `07_equipment.png` | ✅ delivered |
| `08_field.png` | ✅ delivered |
| `09_ship_core.png` | ✅ delivered |

Optional asset for catalog header:
| `tcg_category_panels_3x3_selected.png` | ✅ delivered (use as `/shop/packs` or catalog landing hero) |

**NOTE on dimensions:** 512×341 placeholders ARE the final assets for AFS-6d. Higher-res Flux renders can land later as drop-in replacements (same filenames). Sprint does NOT block on higher-res.

**NOTE on `03_ai_routing` vs `ai_routine`:** Alpha source data may use either spelling. Pre-flight Task 0.5 grep MUST resolve canonical type name before wiring image lookup.

---

## RARITY → FRAME COLOR MAPPING (locked)

| Rarity | Color hex/token | CSS var |
|---|---|---|
| Common | grey/silver | `--frame-common` (e.g., `#9ca3af`) |
| Uncommon | green | `--frame-uncommon` (e.g., `#22c55e`) |
| Rare | cyan/blue | `--frame-rare` (e.g., `#06b6d4`) |
| Epic | purple | `--frame-epic` (e.g., `#a855f7`) |
| Legendary | gold | `--frame-legendary` (e.g., `#eab308`) |
| Mythic | magenta/red-pink | `--frame-mythic` (e.g., `#ec4899`) |

Hex values above are starting suggestions. Frame component takes color as prop or CSS-var binding, so swap is one-line if visual review wants different shades.

---

## PRE-FLIGHT (mandatory — STOP for Jix approval)

Run from `C:\Users\Jixwu\Desktop\voidexa\` (voidexa main repo).

### Task 0.5a — Locate canonical Alpha card data

```powershell
# Find Alpha source file
Get-ChildItem -Recurse -Filter "alpha_set_master*"
Get-ChildItem -Recurse -Filter "batch_*.json" | Select-Object FullName
Get-ChildItem -Recurse -Filter "card_art_prompts_ai.json"

# Confirm 1000 cards present
# Expected: 10 batch JSON files OR 1 master file with 1000 rows
```

### Task 0.5b — Locate current V3 cards code

```powershell
# Find V3 catalog page
Get-ChildItem -Recurse -Path "app" -Filter "page.tsx" | Select-String -Pattern "card" -List | Select-Object Filename, Path

# Find V3 deck builder
Get-ChildItem -Recurse -Filter "*deck*"

# Find V3 card rendering component
Get-ChildItem -Recurse -Path "components" -Filter "*card*"

# Search for V3 references
Select-String -Path "src\**\*.ts*","app\**\*.ts*","components\**\*.ts*" -Pattern "v3_cards|card_v3|full_card_library" -List
```

### Task 0.5c — Verify Supabase state

```powershell
# Find existing card-related tables in migrations
Get-ChildItem -Recurse -Path "supabase\migrations" | Select-String -Pattern "card|deck" -List

# Confirm profiles.ghai_balance exists (AFS-2)
# Confirm user_inventory exists (AFS-6a)
# Confirm shop_packs exists (AFS-6a)
# Confirm NO alpha_cards yet
# Confirm NO user_decks yet
```

### Task 0.5d — Verify Alpha card type names

Open one batch JSON, check the `type` field. Resolve canonical spelling:
- "AI Routine" vs "AI Routing"
- "Ship Core" vs "ShipCore" vs "ship_core"
- All 9: Weapon, Drone, AI Routine/Routing, Defense, Module, Maneuver, Equipment, Field, Ship Core

This determines image filename mapping in Task 3.

### Task 0.5e — Confirm `/cards` route current state

Via Chrome bridge OR curl:
```powershell
curl -I https://voidexa.com/cards
curl -I https://voidexa.com/game/cards/deck-builder
```

Document what currently renders. New Alpha catalog must NOT replace V3 — it's a NEW route.

**STOP HERE. Jix reviews findings. Confirm:**
- [ ] Alpha source data file path + format known
- [ ] V3 page path identified, will NOT be modified
- [ ] Supabase tables: alpha_cards/user_decks confirmed missing (will create)
- [ ] Canonical type names locked (especially "AI Routine" vs "AI Routing")
- [ ] New Alpha route name decided (suggested: `/cards/alpha` or `/alpha-cards` or `/library`)

If pre-flight reveals Alpha data is missing or malformed → REWRITE this SKILL before Task 1.

---

## TASKS (after pre-flight approval)

### Task 0 — Backup tag

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git tag backup/pre-afs-6d-20260425
git push origin backup/pre-afs-6d-20260425
```

### Task 1 — Commit SKILL.md FIRST

```powershell
mkdir -p docs/skills
# Place this SKILL.md at docs/skills/sprint-afs-6d-cards-premium-rebuild.md
git add docs/skills/sprint-afs-6d-cards-premium-rebuild.md
git commit -m "docs(afs-6d): SKILL for cards premium rebuild + deck builder + 9-image wiring"
git push origin main
```

### Task 2 — Drop art assets into repo

```powershell
mkdir -p public/cards/category-art
# Copy 9 PNGs from category_icons.zip to public/cards/category-art/
# Filenames must match canonical type names from pre-flight Task 0.5d

git add public/cards/category-art/
git commit -m "feat(afs-6d): add 9 category art placeholders for Alpha cards"
git push origin main
```

### Task 3 — Premium frame component

**File:** `components/cards/AlphaCardFrame.tsx`

**Props:**
- `rarity`: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
- `type`: one of 9 type strings (canonical)
- `title`: string
- `cost`: number
- `stats`: { attack?: number; defense?: number; ... } (per Alpha schema)
- `ability`: string (truncate if too long, full on hover/click)
- `flavor`: string (italic, smaller font)
- `comingSoon`: boolean (show overlay if true — used for tier launch staging)

**Layout:**
- Outer frame: rounded-rect, color = `--frame-${rarity}`, glow on hover
- Top: type badge (small) + title (large)
- Middle: art image full-width (`/public/cards/category-art/${typeToFilename[type]}.png`)
- Bottom: cost badge + stats row + ability text + flavor (italic)
- Mobile responsive (use Tailwind v4)

**Test:** snapshot render for each of 6 rarities + each of 9 types = 54 combinations (sample 6 representative).

### Task 4 — Supabase migration

**File:** `supabase/migrations/YYYYMMDDHHMM_afs6d_alpha_cards_decks.sql`

```sql
-- alpha_cards: 1000-row catalog
create table public.alpha_cards (
  id text primary key,                 -- e.g. "alpha_w_001"
  card_set text not null default 'alpha',
  type text not null,                  -- weapon, drone, ai_routine, defense, module, maneuver, equipment, field, ship_core
  title text not null,
  cost integer not null check (cost >= 0),
  rarity text not null check (rarity in ('common','uncommon','rare','epic','legendary','mythic')),
  archetype text,                      -- aggro, control, midrange, combo, ramp, utility
  stats jsonb,                         -- { attack: 3, defense: 2, ... }
  ability text not null,
  flavor text,
  keywords text[],                     -- ["pierce", "burn"] etc
  active boolean default true,
  created_at timestamptz default now()
);

create index alpha_cards_type_idx on public.alpha_cards(type);
create index alpha_cards_rarity_idx on public.alpha_cards(rarity);

alter table public.alpha_cards enable row level security;
create policy "alpha_cards_public_read" on public.alpha_cards
  for select using (active = true);

-- user_decks: saved decks (max 5 per user)
create table public.user_decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  card_set text not null check (card_set in ('alpha','v3')),
  card_ids text[] not null,            -- array of alpha_cards.id (60 for alpha, 20 for v3)
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index user_decks_user_idx on public.user_decks(user_id);

alter table public.user_decks enable row level security;

create policy "user_decks_owner_read" on public.user_decks
  for select using (auth.uid() = user_id);
create policy "user_decks_owner_write" on public.user_decks
  for insert with check (auth.uid() = user_id);
create policy "user_decks_owner_update" on public.user_decks
  for update using (auth.uid() = user_id);
create policy "user_decks_owner_delete" on public.user_decks
  for delete using (auth.uid() = user_id);

-- Enforce 5-decks-per-user via trigger
create or replace function public.enforce_max_5_decks()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.user_decks where user_id = new.user_id and active = true) >= 5 then
    raise exception 'MAX_5_DECKS_PER_USER';
  end if;
  return new;
end $$;

create trigger user_decks_max_5
  before insert on public.user_decks
  for each row execute function public.enforce_max_5_decks();
```

**Apply:** Jix runs manually in Supabase SQL Editor (per AFS-4 standard).

### Task 5 — Seed alpha_cards from JSON

**File:** `scripts/seed_alpha_cards.ts`

- Read all 10 batch JSON files (or single master) from pre-flight path
- Transform to `alpha_cards` schema
- Use `supabaseAdmin` from `lib/supabase-admin.ts` (per AFS-6a pattern)
- Idempotent: `on conflict (id) do update set ...`
- Validate: `select count(*) from alpha_cards` returns 1000

```powershell
# Run via tsx or node after migration applied
npx tsx scripts/seed_alpha_cards.ts
```

**Validation:**
- [ ] 1000 rows in `alpha_cards`
- [ ] Distribution matches: Common 400 / Uncommon 280 / Rare 160 / Epic 90 / Legendary 50 / Mythic 20
- [ ] All 9 types represented

### Task 6 — Catalog page

**File:** `app/cards/alpha/page.tsx` (or whichever route locked in pre-flight)
**File:** `app/dk/cards/alpha/page.tsx` (i18n shell, English content per AFS-26 deferral)
**File:** `components/cards/AlphaCatalog.tsx`

**Layout:**
- 9 tabs at top (Weapon, Drone, AI Routine, Defense, Module, Maneuver, Equipment, Field, Ship Core)
- Active tab loads cards of that type
- Pagination: max 20 cards per page, page selector at bottom
- Each card uses `AlphaCardFrame` component
- Server-component data fetch via `createServerSupabaseClient` (per AFS-4/6a pattern)
- URL state: `/cards/alpha?type=weapon&page=2`

**Coming Soon overlay:**
- Render overlay if cards have NOT yet been balanced/released (use `active` flag in DB)
- Initial seed: all `active = true` for visibility OR set portion to false if staged release wanted

### Task 7 — Deck builder

**File:** `app/cards/alpha/deck-builder/page.tsx`
**File:** `components/cards/AlphaDeckBuilder.tsx`

**UX (locked SLUT 9):**
- Top: horizontal active-deck bar (sticky)
  - 3 toggle buttons: 5 / 10 / 15 visible
  - Counter: `X / 60` cards
  - Click card in bar → remove
  - Drag card from inventory UP into bar → add
- Below: inventory grid
  - Filter dropdown by type (9 options + "All")
  - Filter dropdown by rarity (6 options + "All")
  - Search by name (debounced)
- Right side: 5 saved deck slots
  - Click slot to load
  - Save button writes current bar to selected slot
  - Slot title editable inline
- Validation:
  - Cannot save deck < 60 cards (warning)
  - Cannot save deck > 60 cards (block)
  - Max 5 decks (server enforces via trigger; client warns)

**State:** React state for current deck, server actions for save/load/delete.

### Task 8 — Pack shop unlock

**File modify:** `components/shop/ShopPage.tsx` (or `/shop/packs/page.tsx` per AFS-6a-fix)

- Remove "Coming Soon" lockdown that AFS-6a-fix added (`c095fc8` commit)
- Wire BUY button to existing `purchase_pack_atomic` RPC (AFS-6a)
- Verify pack contents reference `alpha_cards.id` not V3 ids
- If pack data needs reshuffling for Alpha → separate task, document don't ship in this sprint

**If pack data already references Alpha ids:** unlock and ship.
**If pack data still references V3:** add OUT OF SCOPE note, leave Coming Soon, defer to AFS-6e.

### Task 9 — Tests

**File:** `tests/afs-6d-alpha-cards.test.ts`

Targets (+15-20 new):
- Frame renders all 6 rarities with correct color
- Frame renders all 9 types with correct image
- Catalog paginates correctly (20/page)
- Catalog filters by type
- Deck builder enforces 60-card limit
- Deck builder enforces 5-deck max (mocked Supabase response)
- Server action saves deck correctly
- V3 catalog still renders (regression guard)

**File:** `tests/e2e/afs6d-deck-builder.spec.ts` (handoff to voidexa-tests)

Smoke E2E: load /cards/alpha, click Weapon tab, verify 20 cards visible.

### Task 10 — Commit + push + tag

```powershell
git add .
git commit -m "feat(afs-6d): cards premium rebuild — alpha catalog, deck builder, 9-image art wiring"
git push origin main

# After Vercel deploy + 90s wait + live verify:
git tag sprint-afs-6d-complete
git push origin sprint-afs-6d-complete
```

### Task 11 — Live verify (Jix via Chrome bridge)

- [ ] `/cards/alpha` loads 200, shows 9 type tabs
- [ ] Weapon tab shows 20 cards, page 2 shows next 20
- [ ] Each card renders with correct frame color per rarity
- [ ] Each card shows correct category art
- [ ] `/cards/alpha/deck-builder` loads 200
- [ ] Drag-up-to-add works in browser
- [ ] Toggle 5/10/15 changes visible bar count
- [ ] Save deck writes to Supabase, reloads correctly
- [ ] V3 catalog at `/cards` (or wherever) STILL works (regression check)
- [ ] `/shop/packs` BUY button: either active (if Alpha pack data ready) OR still locked (documented)

---

## DEFINITION OF DONE

- [ ] Backup tag pushed
- [ ] SKILL.md committed FIRST
- [ ] 9 art assets in `public/cards/category-art/`
- [ ] `AlphaCardFrame` renders all 6 rarities with distinct colors
- [ ] `alpha_cards` table created with 1000 rows
- [ ] `user_decks` table created with RLS + 5-deck trigger
- [ ] Catalog `/cards/alpha` paginated, 9 tabs, 20/page
- [ ] Deck builder `/cards/alpha/deck-builder` full UX (drag, click-remove, toggle, filter, save)
- [ ] V3 catalog UNTOUCHED (regression test passes)
- [ ] Tests +15-20, all green
- [ ] `vitest run` clean
- [ ] `npm run build` clean
- [ ] Committed + pushed to `main`
- [ ] ≥90s wait + hard-refresh live verify
- [ ] Sprint tag `sprint-afs-6d-complete` pushed
- [ ] CLAUDE.md updated at next SLUT
- [ ] INDEX deltas at next SLUT (04, 08, 11, 13, 15, 16)

---

## ROLLBACK

```powershell
git reset --hard backup/pre-afs-6d-20260425
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-6d-complete
```

Supabase rollback (manual via SQL Editor):
```sql
drop trigger if exists user_decks_max_5 on public.user_decks;
drop function if exists public.enforce_max_5_decks();
drop table if exists public.user_decks;
drop table if exists public.alpha_cards;
```

---

## RISKS

1. **Alpha data schema mismatch.** Pre-flight Task 0.5a/d MUST verify the source JSON structure matches the migration schema. If `archetype`, `keywords`, or `stats` shape differs, the migration must be adjusted BEFORE seeding. Mitigation: pre-flight stops sprint until verified.

2. **Type name canonicalization.** "AI Routine" vs "AI Routing" — wrong choice breaks image lookup for ~140 cards. Mitigation: pre-flight Task 0.5d resolves before Task 3. Once locked, document in `lib/cards/types.ts` constants.

3. **Pack data still V3-referenced.** Task 8 may not unlock pack shop if `pack_contents` references `cards_v3` ids. Mitigation: scope-out into AFS-6e if encountered, ship rest of sprint, leave pack lockdown intact.

4. **Deck builder drag-and-drop on mobile.** Touch drag is finicky. Mitigation: provide tap-to-add fallback. Document mobile UX as "best on desktop" in `/cards/alpha/deck-builder`.

5. **Trigger preventing 5+ decks may surprise users.** Mitigation: client checks count first, shows "Delete a deck to save a new one" message. Server trigger is last-resort safety.

6. **/cards may already exist as V3 route.** Pre-flight Task 0.5e MUST NOT modify it. New Alpha catalog goes to `/cards/alpha` or `/library` — pre-flight locks the path.

---

## OUT OF SCOPE

- Higher-resolution Flux art renders (drop-in replacement later, same filenames)
- Card balance / playtesting tweaks (separate concern, separate sprint)
- AI opponent that uses Alpha decks (game engine work — AFS-18 territory)
- Pack contents redesign for Alpha (AFS-6e if needed)
- Card combat mechanics (existing engine reused; this sprint is catalog + deck builder + art)
- Animations / particle effects on rare card hover (P2 polish, not P0)
- Card trading between users (AFS-? future)
- Deck import/export to JSON or share-codes (AFS-? future)
- Danish translation of catalog/deck builder UI (AFS-26)
- Mobile-optimized deck builder (mobile = best-effort, desktop is target)
- 60-card Constructed format game mode wiring (existing engine, separate sprint to switch from 20→60)

---

## NOTES FOR EXECUTION

- This SKILL runs in `voidexa` main repo. Claude Code session opens at `C:\Users\Jixwu\Desktop\voidexa\`.
- Migration applied MANUALLY by Jix in Supabase SQL Editor (NEVER via MCP per memory rule).
- `supabaseAdmin` import path: `lib/supabase-admin.ts` (singleton, per AFS-4 fix).
- Server-side Supabase: `createServerSupabaseClient` from `lib/supabase-server.ts`.
- Test framework: Vitest (NOT Jest, NOT Playwright in this repo — Playwright = `voidexa-tests` separate repo).
- Tailwind v4: use core utilities only, no custom @apply unless absolutely needed.
- Per JIX_RULES: `git push origin main` only. NEVER `master`. Verify with `git status` + `git log origin/main --oneline -3` after push.
- Per SLUT 8 lesson: STOP at every defined checkpoint. Wait for explicit Jix approval.
- 5 V3 reference files in working tree are intentionally untracked. Do NOT add or delete them.

---

# END SKILL
