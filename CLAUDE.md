# voidexa — CLAUDE.md

**Project memory for Claude Code sessions on voidexa repo.**

Location: `C:\Users\Jixwu\Desktop\voidexa\CLAUDE.md`
Repo: `voidexa-ai/voidexa` (Public, TypeScript)
Owner: Jix (Jimmi Wulff, CVR 46343387, Vordingborg DK)
Model: `claude-opus-4-7` only (NOT 4.6)

---

## PROJECT IDENTITY

voidexa.com is a multi-product sovereign AI infrastructure platform combining:
- AI trading bot (live, regime-based, backtested +194.79%)
- Quantum multi-AI debate engine (4 providers: Claude, Gemini, GPT, Perplexity — 960 tests)
- Void Chat (3 providers: Claude, ChatGPT, Gemini)
- Quantum Forge (debate-to-build pipeline)
- Gaming universe (257-card battle, Free Flight, Star Map, 5 zones)
- GHAI virtual currency ($1 = 100 GHAI, V-Bucks model)
- Comlink encrypted messenger (parked)
- KCP-90 compression (v3 95.67% verified, 4-layer)
- Jarvis PC assistant (v4.1.0, 668 tests, 26 voice commands)
- AEGIS security monitor (hardware, AFS-43)
- Break Room social space (Universe dropdown position 8)

---

## CORE STACK

- **Framework:** Next.js 16 + React 19 + TypeScript
- **Deploy:** Vercel Pro (auto-deploy via GitHub)
- **Production branch:** `main` (since April 15 — master is STALE)
- **Database:** Supabase EU (`ihuljnekxkyqgroklurp`, 58 tables, RLS enabled)
- **Storage:** Supabase Storage bucket `models` (3D GLBs), `intro/` (cinematic)
- **Payments:** Stripe (webhook `we_1TLluLDVfBjAC4z8878uAbqXl`)
- **Auth:** Supabase SSR + AuthProvider

---

## CRITICAL RULES (never violate)

### Code delivery
- FULL copy-paste blackbox only — never line-edits
- NO a/b/c option menus — give direct answer
- Short first, expand on request

### Git (voidexa repo)
- `git push origin main` ONLY
- Post-push MANDATORY: `git status` clean + `git log origin/main --oneline -3`
- Commit SKILL.md FIRST in any sprint
- Explicit staging (not `git add .`)

### File size limits
- React components: MAX 300 lines
- page.tsx files: MAX 100 lines
- lib/ files: MAX 500 lines

### PowerShell (if needed)
- Use `;` not `&&`
- ASCII only — NO em-dashes (breaks scripts, proven twice)
- UTF-8 without BOM
- Danish Downloads = "Overførsler"

### Vercel env vars
- ALWAYS `.trim()` in API routes

### Model
- Always `claude-opus-4-7`

---

## SPRINT HISTORY

| Sprint | Commit | Tests | Feature |
|---|---|---|---|
| Sprint 13c | `19f4178` | 658 | Kling/Veo MP4 cinematic |
| Sprint 14a | `6d67a4d` | 718 | Auth-lock storm fix |
| Sprint 15 | `20231ce` | 766 | Flight foundation |
| Sprint 16 | `e833c73` | 800 | BoostTrail GPU |
| Sprint 17 SKILL | `e9d6efa` | — | Pushed, Tasks 2-8 NOT executed |
| Alpha set | `b47053e` | — | 1000-card alpha on main |
| **AFS-1 complete** | `8d3a1e6` | **825** | **Homepage cinematic repair** |
| **AFS-1d** | `357e1a9` | 825 | **Ultrawide backdrop PNG** |
| **AFS-7 complete** | `b58fcb8` | **860** | **Legal pages + sitemap + robots + cookie banner** |
| **AFS-2 complete** | `36d5f62` | **910** | **Auth route infra — 14 redirects + /wallet + /settings** |
| **AFS-3 complete** | `3da828c` | **938** | **Game hub 404 fixes — 8 redirects + tile UX pass** |
| **AFS-4 complete** | `a15e568` | **973** | **Admin Control Plane data pipeline — kcp90_compression_events + 4 product loggers + real dashboard** |
| **AFS-6a complete** | `bf1ce98` | **994** | **In-game Shop GHAI flow — mount ShopCosmeticsClient, /shop modal rewire, /inventory page** |
| **AFS-6a-fix complete** | `6144e08` | **1014** | **Post-ship bugfixes — Universe nav +Inventory, back-link, cross-nav, Alpha copy, pack Coming Soon lockdown** |
| **AFS-6d complete** | `bdc6f3f` | **1087** | **Cards Premium Rebuild — 1000 Alpha cards in DB, paginated catalog, deck builder, 5 saved slots** |
| **AFS-6g complete** | `7f09077` | **1141** | **Battle Scene v2 + Universal Skybox + CSS Hotfix + Security Sweep** |
| **AFS-18 complete** | `fdfca34` | **1240** | **Alpha 1000 Cards Deploy — Storage bucket + 1000 webp uploaded + per-card image wiring + /cards V3→Alpha swap + V3 deck-builder 308 redirects** |
| **AFS-18b complete** | `f1c2cef` | **1286** | **Rarity UX + Mythic Iridescent Frame + TCG Layout Overhaul — rarity filter pill row, mythic conic-gradient border (magenta · cyan · metallic gold), full TCG-grammar restructure (name+cost header, type-line below image, ATK/DEF opposite footer corners)** |

---

## SESSION LOG

### Session 2026-04-28 — AFS-18b COMPLETE (Rarity UX + Mythic Iridescent + TCG Layout Overhaul)

**Status:** ✅ SHIPPED to `origin/main`, live-verified on voidexa.com — every Alpha card now displays a TCG-grammar layout (NAME + COST header, image, TYPE — RARITY type-line, effect + flavor body with separator, ATK/DEF in opposite footer corners). Rarity filter pill row live on `/cards` and `/dk/cards`. Mythic frames render rotating conic-gradient border in magenta · cyan · metallic gold.
**Tag:** `sprint-afs-18b-complete`
**Backup:** `backup/pre-afs-18b-20260428` → `225fb3d` (SKILL v2 commit, before any code change)
**Tests:** 1286/1286 green (was 1240, +46 new AFS-18b assertions)
**Final HEAD:** `f1c2cef`

**Commit chain:**
```
f1c2cef test(afs-18b): coverage for helpers + filter + mythic + TCG layout (Task 6)
c6b7c34 feat(afs-18b): TCG layout overhaul on AlphaCardFrame (Task 5b)
5904592 feat(afs-18b): rarity badge + mythic iridescent frame (Tasks 2 + 5)
7538954 feat(afs-18b): rarity helpers + badge + filter UI + server filter (Tasks 1-4)
225fb3d chore(afs-18b): SKILL v2 with locked decisions + pre-flight findings
f1fb157 chore(afs-18b): SKILL v1 — rarity badge + rarity filter + mythic iridescent frame
```

**v1 → v2 flow:** SKILL v1 paused for Jix to lock 20 OPEN DECISIONS. Pre-flight 0.1-0.6 confirmed v1 structure was sound. v2 baked in 18 default-locked decisions + 2 overrides (Q13 mythic palette = magenta/cyan/gold not yellow; Q16 RPM fallback = static conic so all 3 colors visible). Hex palette locked to `#ec4899` (RARITY_GLOW.Mythic for badge coherence) · `#22d3ee` (cyan-400) · `#d4af37` (metallic gold, distinct from legendary's `#f59e0b` amber to avoid mid-rotation stripe collision). v2 also corrected an off-by-one in v1's stop checkpoint list (visual review is between Task 5 and Task 6, not "Task 4").

**5b layout overhaul (mid-sprint scope expansion):** After Tasks 1-5 shipped and Jix did an interim eyeball check, Jix flagged that the AFS-18b header (TYPE pill + rarity badge + cost circle in a single row) broke TCG player muscle memory. Per MTG / Hearthstone / Yu-Gi-Oh convention, rarity belongs in a type-line UNDER the image, not in a separate badge in the upper area, and ATK/DEF belongs in the opposite footer corners, not inline mid-body. Task 5b restructured `AlphaCardFrame.tsx` end-to-end while keeping all existing infrastructure (mythic frame, RARITY_GLOW colors, imageUrl wiring, deck-builder inheritance) untouched.

**What shipped:**

**Section A — Rarity helpers (Task 1):**
- `lib/cards/alpha-types.ts` extended with `VALID_ALPHA_RARITIES`, `AlphaRarityDb` type, `ALPHA_RARITY_LABELS` map, `isValidAlphaRarity` type guard. Mirrors AFS-6d's type-side helpers, all six rarities in power order

**Section B — Rarity filter (Tasks 3+4):**
- `components/cards/AlphaCatalog.tsx` adds `activeRarity?: AlphaRarityDb | null` prop, extracts `pillClass()` + `buildHref()` helpers, renders second nav with `aria-label="Card rarity filter"` (All + 6 rarity pills in power order), refactors type tabs and pagination to route through `buildHref` so changing type preserves activeRarity (and vice versa)
- `app/cards/page.tsx` + `app/dk/cards/page.tsx` parse `?rarity=` via `isValidAlphaRarity`, conditionally apply `.eq('rarity', rarity)` on count + cards queries (uses existing `idx_alpha_cards_rarity` index), pass `activeRarity` to AlphaCatalog
- 2 obsolete AFS-6d catalog test assertions (pinned to old inline `${basePath}?type=...&page=1` template strings) updated to assert the new `buildHref(...)` invocation. Original intent ("tab change resets page", "pagination preserves type") preserved through the helper

**Section C — Mythic iridescent frame (Task 5):**
- `components/cards/AlphaCardFrame.tsx`: `isMythic` branch toggles className between `mythic-frame` (animated conic gradient) and `border-2` (solid RARITY_GLOW border). Mythic outer glow uses pink + cyan RGBA; gold deliberately omitted from halo so it doesn't read as warm-yellow
- `app/globals.css` adds `@property --mythic-angle` (first `@property` usage in repo — graceful degradation on unsupporting browsers), `.mythic-frame` class using padding-box + border-box gradient trick, `@keyframes mythic-rotate` (6s linear infinite, `--mythic-angle` 0deg → 360deg), `@media (prefers-reduced-motion: reduce)` block (first RPM usage in repo — sets repo precedent for future animated surfaces). Conic gradient stays the same in RPM mode (animation: none) so all 3 colors remain visible around the perimeter

**Section D — TCG layout overhaul (Task 5b):**
- `components/cards/AlphaCardFrame.tsx` restructured to MTG/Hearthstone/Yu-Gi-Oh grammar:
  - **Header:** card NAME on the left (`<h3 truncate>`), COST circle on the right
  - **Image:** unchanged 3:2 aspect, per-card webp + onError fallback
  - **Type-line:** `<p data-testid="type-line">` below image, `{type} — {rarity}` em-dash separator, uppercase + tracking-wider, rarity color text + tinted bottom border
  - **Body:** effect text in regular weight, flavor text below with thin top-border separator + extra padding-top + italic + opacity-70
  - **Footer:** `<footer flex justify-between>`, ATK left + DEF right, gated on `hasStats` so spell-style cards omit it. `aria-hidden="true"` empty placeholder spans preserve corner alignment when only one stat is set
- TYPE pill + rarity badge from earlier AFS-18b iteration removed entirely. Rarity color hierarchy preserved via type-line text + cost circle background + ATK/DEF text + frame border (or mythic conic) all using the rarity color
- AlphaDeckBuilder inheritance unchanged — same component, same props, same visual upgrade in the deck-builder inventory grid

**Section E — Tests (+46 assertions across 4 files):**
- `tests/afs-18b-rarity-helpers.test.ts` (7 — runtime unit, not walker) — VALID_ALPHA_RARITIES + ALPHA_RARITY_LABELS + isValidAlphaRarity + AFS-6d invariant regressions
- `tests/afs-18b-rarity-filter.test.ts` (13 — walker) — AlphaCatalog rarity nav + EN/DK pages server-side filter
- `tests/afs-18b-mythic-frame.test.ts` (10 — walker) — isMythic branch + globals.css `@property` + `@keyframes` + RPM block + 3 hex palette stops + zinc-950 hardcoded
- `tests/afs-18b-tcg-layout.test.ts` (16 — walker) — header name+cost + type-line + body separator + footer ATK/DEF justify-between + aria-hidden placeholder spans

**Sprint deviations from SKILL v2:**
1. Task 5b layout overhaul added mid-sprint per Jix scope expansion. Was not in v2 SKILL; commit message documents the rationale (TCG industry-standard grammar)
2. Test count overshoot — 46 vs target 18-22 (rarity-helpers as runtime unit tests added 7 quick smoke checks; tcg-layout split into 4 sub-describes with 16 assertions covering each card region)
3. The earlier SKILL v2 mention of a `data-testid="rarity-badge"` element was made obsolete by Task 5b. Tests for that pattern were not written; new tests assert the post-5b structure (type-line below image, no rarity badge in source)

**New patterns AFS-18b establishes in the codebase (first usages):**
1. **`@property` declaration** — `--mythic-angle` registered as `<angle>` for smooth keyframe interpolation. Browsers without `@property` support degrade to a static gradient (no bug, equivalent to RPM fallback)
2. **`prefers-reduced-motion` media query** — first repo usage. Future animated surfaces should adopt the same pattern

**Live verified by Jix (Apr 28):** Rarity badge → type-line restructure shipped via Task 5b second visual review. All 8 visual checks passed on production: header name+cost, per-card webp art, type-line `WEAPON — RARITY` in rarity color, effect+flavor separator, ATK/DEF in opposite footer corners, rarity color hierarchy preserved, mythic iridescent rotation working (after enabling Windows animation effects), deck-builder inheritance via shared AlphaCardFrame. Rarity filter pill row also verified working (All · Common · Uncommon · Rare · Epic · Legendary · Mythic).

**Known items out-of-scope (carried forward):**
- DK strings for rarity labels and type-line — English UI per AFS-26 deferral
- AlphaDeckBuilder filter UI redesign — its existing dropdown rarity filter stays until a convergence sprint
- Pack-opening reveal animation — AFS-6c domain
- Battle scene mythic visual — AFS-6h domain
- Audit of other animated surfaces for RPM compliance — follow-up sprint

**Rollback:**
```bash
git reset --hard backup/pre-afs-18b-20260428
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-18b-complete
```

No Supabase changes in this sprint.

---

### Session 2026-04-28 — AFS-18 COMPLETE (Alpha 1000 Cards Deploy + V3 Retirement)

**Status:** ✅ SHIPPED to `origin/main`, live-verified on voidexa.com — `/cards` now renders the 1000-card Alpha catalog with unique per-card art, V3 First Edition retired from `/cards` rendering, V3 deck-builder 308 redirects to Alpha deck-builder. Bucket "cards" applied to Supabase, 1000 webp uploaded.
**Tag:** `sprint-afs-18-complete`
**Backup:** `backup/pre-afs-18-20260428` → `8235a35` (existed pre-sprint, predates both v1 and v2 SKILL commits — cleaner rollback than HEAD~1)
**Tests:** 1240/1240 green (was 1204, +36 new AFS-18 assertions)
**Final HEAD:** `fdfca34`

**Commit chain:**
```
fdfca34 test(afs-18): coverage for image URL helper + page swap + frame wiring (Task 10)
7c86d9d feat(afs-18): /cards renders AlphaCatalog + V3 deck-builder redirects (Tasks 7-9)
246266d feat(afs-18): per-card image wiring on AlphaCardFrame (Tasks 5+6)
a975add feat(afs-18): upload script for Alpha webp to Supabase Storage (Task 4)
0593446 feat(afs-18): Supabase Storage bucket "cards" migration (Task 3)
b1c204f chore(afs-18): PNG to webp conversion script (Task 2)
e9396a5 chore(afs-18): SKILL v2 reshape — narrow scope after pre-flight
7ad3c91 chore(afs-18): add sprint SKILL documentation
```

**v1 → v2 reshape (caught by mandatory pre-flight):** Pre-flight 0.1-0.6 discovered AFS-6d had already shipped most of the v1 SKILL premise — `alpha_cards` table, `AlphaCardFrame`, `AlphaCatalog`, `AlphaDeckBuilder`, `/cards/alpha` + `/cards/alpha/deck-builder` routes (EN+DK). The actual remaining gap was narrower:

1. `AlphaCardFrame` rendered 9 generic category PNGs instead of the 1000 unique webp Jix paid $41.52 for
2. `/cards` and `/dk/cards` still rendered V3 (broken frames + missing cards per Jix audit)
3. The 1000 PNGs weren't in Supabase Storage yet
4. No image URL mapping between manifest IDs and Supabase paths

v2 narrowed AFS-18 to wiring existing infrastructure to real assets. Locked decisions:
- /cards: replace V3 import with `<AlphaCatalog />` server-rendered, keep `/cards/alpha` live as backward-compat alias
- V3 deck-builder: 308 permanent redirect → `/cards/alpha/deck-builder` (V3 file stays on disk)
- Image URL: deterministic `cards/alpha/{rarity}/{id}.webp` (Option A — strip numeric prefix on upload, no DB column, slug = `alpha_cards.id`)
- Frame colors: keep `RARITY_GLOW` (per AFS-6d "do not touch")
- Backup: D:\krypteret USB + Proton Drive both verified 1001 files before any source-touching task

**What shipped:**

**Section A — webp conversion + Supabase Storage:**
- `scripts/convert_alpha_to_webp.ps1` — quality 85, resume-safe, 1000 PNG → 96 MB webp (**93.8% reduction**, beat 70% target)
- `supabase/migrations/20260428_afs18_cards_bucket.sql` — public-read bucket "cards" with single SELECT policy `cards_public_read` on `bucket_id = 'cards'`. Idempotent (`ON CONFLICT DO NOTHING` + `DROP POLICY IF EXISTS`)
- `scripts/upload_alpha_to_supabase.ts` — strips numeric prefix per Option A, uploads to `cards/alpha/{rarity}/{slug}.webp`, concurrency 10, resume-safe via per-rarity list call. 1000 files uploaded, distribution **400 common / 280 uncommon / 160 rare / 90 epic / 50 legendary / 20 mythic = 1000 total** (Jix verified via `storage.objects` SQL count + spot-check public URL)

**Section B — URL helper + frame wiring:**
- `lib/cards/alpha-image-url.ts` — `getAlphaCardImageUrl(id, rarity)` returns deterministic public URL. Reads `NEXT_PUBLIC_SUPABASE_URL` with `.trim()` per project rule
- `components/cards/AlphaCardFrame.tsx` — `'use client'` added (onError requires it), new optional `imageUrl?: string` prop. Replaced `next/image <Image>` with plain `<img>` to avoid coupling to `images.remotePatterns` (CSP `img-src 'self' data: https:` already permits Supabase). onError fallback to category PNG via `dataset.fallbackTried` flag (one-shot, no infinite loop). RARITY_GLOW + TYPE_TO_IMAGE preserved
- `components/cards/AlphaCatalog.tsx` + `components/cards/AlphaDeckBuilder.tsx` — both wire `imageUrl={getAlphaCardImageUrl(card.id, card.rarity)}` per row. Data shapes (`AlphaCatalogCard`, `DeckBuilderCard`) untouched — URL is derived at render time, not stored

**Section C — /cards page swap:**
- `app/cards/page.tsx` — replaced V3 `<CardCollectionView>` import with server-side AlphaCatalog (basePath="/cards"). Same data fetch as `/cards/alpha`. Canonical metadata moved to `/cards`
- `app/dk/cards/page.tsx` — same swap, DK metadata, basePath="/dk/cards", UI strings English (AFS-26 deferral)
- `next.config.ts` — added two 308 redirects: `/cards/deck-builder` → `/cards/alpha/deck-builder`, `/dk/cards/deck-builder` → `/dk/cards/alpha/deck-builder`. V3 page files stay on disk; redirect intercepts before Next routes to them

**Section D — Tests (+36 assertions):**
- `tests/afs-18-alpha-image-url.test.ts` (10) — URL helper unit tests with `process.env.NEXT_PUBLIC_SUPABASE_URL` set before dynamic import so the test value beats anything inherited from `.env.local`
- `tests/afs-18-cards-page-swap.test.ts` (13) — walker pattern: `/cards` + `/dk/cards` do not import V3 (anchored `^\s*import` so comment-level mentions of V3 path remain valid for future readers), import AlphaCatalog, pass right basePath, query alpha_cards. `next.config.ts` contains both redirects. Regression: V3 files still readable on disk
- `tests/afs-18-frame-image-wiring.test.ts` (13) — AlphaCardFrame: 'use client', imageUrl prop, `<img>` not `<Image>`, onError + fallbackTried guard, TYPE_TO_IMAGE preserved. AlphaCatalog + AlphaDeckBuilder both import + pass `imageUrl`. Helper hygiene checks (`.trim()`, no signed token)

**Sprint deviations from SKILL v2:**
1. Test split into 3 flat `tests/afs-18-*.test.ts` files (matching AFS-6d split-by-concern naming) vs SKILL's suggested `tests/cards/` subfolder
2. `<img>` over `<Image>` — avoids `images.remotePatterns` coupling to Supabase URL; webp at 96 KB avg makes Next image optimization marginal; CSP already permits any HTTPS image
3. Test count overshoot — 36 vs target 20-30 (10/13/13 split, all source-level invariants)
4. Backup tag `backup/pre-afs-18-20260428` already existed on origin pointing to `8235a35` (pre-AFS-18 state) — left untouched
5. First test run exposed comment-level mention of V3 path tripping a broad `not.toMatch(/CardCollection/)` assertion. Tightened to anchored `^\s*import` so future devs can still grep V3 path from the source comment

**Known items out-of-scope (carried forward to AFS-18b candidate):**
- Rarity badge text on card (only TYPE shown; color alone insufficient)
- Rarity filter on `/cards` page (only type filter exists)
- Mythic frame visual: solid magenta vs Jix's locked vision of rainbow/iridescent apex tier
- DK route `/dk/cards/alpha/deck-builder` real translation (AFS-26 owns)
- Battle scene cards (AFS-6h scope)

**Supabase Storage state (project `ihuljnekxkyqgroklurp`, EU):**
- Bucket `cards`: public=true, single SELECT policy `cards_public_read` on `bucket_id = 'cards'`
- Folder layout: `alpha/{common,uncommon,rare,epic,legendary,mythic}/{slug}.webp`, 1000 files total

**Live verified by Jix (Apr 28):** `/cards` renders Alpha 1000 with unique per-card art, `/cards/alpha` backward-compat works, `/cards/deck-builder` + `/dk/cards/deck-builder` 308 redirect to Alpha builder, `/dk/cards` renders, 6 spot-check cards (1 per rarity tier) all show unique art.

**P0 status update:**
- AFS-5 dependency unblocked (1000 cards live in production)
- AFS-17 unblocked (LoRA pipeline can now train against deployed set)
- `/cards` "blank art + missing cards" P0 closed

**Rollback:**
```bash
git reset --hard backup/pre-afs-18-20260428
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-18-complete
# Supabase: bucket can stay (no harm) or empty alpha/ folder via dashboard
```

---

### Session 2026-04-27 — AFS-5 COMPLETE confirmed + AFS-6b SKILL.md ready

**Status:** ✅ AFS-5 1000-card generation finished on Jix PC (tiered pipeline $41.52, manifest.json + images_tiered/ output). 🔴 AFS-6b SKILL.md drafted and ready for pre-flight execution in Claude Code.

**AFS-5 outcome:**
- 1000 alpha cards generated successfully via gpt-image-1-mini tiered tier strategy
- Cost: $41.52 actual (matched estimate)
- Output location: `images_tiered/` on Jix's local PC
- manifest.json tracks per-card cost + tier + prompt version
- Unblocks: AFS-17 (LoRA pipeline), AFS-18 (Alpha 1000 deploy to /cards page)

**AFS-6b SKILL.md contents (delivered this session):**
- File: `skills/AFS-6b-realworld-ghai-ux/SKILL.md`
- Scope: GHAI vs DKK/EUR disambiguation across contact form + product pages + /wallet + FAQ
- 6 tasks (SKILL commit + contact form + RealWorldPaymentNotice component + wallet section + FAQ + tests)
- Pre-flight VERIFY-FIRST mandatory STOP point with grep commands
- Test target: 1168 → ~1173
- Backup tag: `backup/pre-afs-6b-YYYYMMDD`
- Sprint tag: `sprint-afs-6b-complete`
- Risks documented: missing product pages defer to AFS-6c, DK copy drift defer to AFS-26, Resend payload schema test required, GHAI top-up modal bug stays out of scope

**No code shipped this session.** SKILL is ready for Jix to run via Claude Code with `claude --dangerously-skip-permissions`.

**Decisions locked this session:**
- AFS-5 status flipped from RUNNING to COMPLETE
- AFS-6b prioritized before AFS-6c (copy decisions must lock first)
- AFS-6b stays parallel-safe with AFS-24b/c/d and any GHAI top-up modal investigation

**Files added to Project Knowledge:**
- `skills/AFS-6b-realworld-ghai-ux/SKILL.md`
- Updated `CLAUDE.md` (this file)

**Next session entry points:**
1. Run AFS-6b pre-flight in Claude Code → STOP for approval → execute
2. OR start GHAI top-up modal investigation sprint (P0 bug still open)
3. OR begin AFS-6c Shop v1 catalog SKILL drafting (depends on AFS-6b copy lock)

---

### Session 2026-04-25 — SLUT 12 — AFS-6g COMPLETE + Brain-storm + Secrets migration

**Status:** ✅ AFS-6g SHIPPED. Brain-storm decisions locked. Secrets migrated to D:\krypteret usb. Battle scene v3 vision captured via reference image.
**Tag:** `sprint-afs-6g-complete`
**Backup:** `backup/pre-afs-6g-20260425` → `bdc6f3f`
**Tests:** 1141/1141 green (was 1087, +54)
**Final HEAD:** `7f09077`

**Commit chain (AFS-6g, chronological):**
```
docs(afs-6g): SKILL for battle scene v2 + skybox + security sweep
docs(afs-6g): deferred CVE register
fix(afs-6g): one-line ConditionalFooter hide-list for /game/battle
feat(afs-6g): SpaceSkybox component + skybox texture asset
feat(afs-6g): battle scene Stars→SpaceSkybox + OrbitControls
feat(afs-6g): freeflight Stars→SpaceSkybox source-level
docs(afs-6g): starmap README explaining intentional retention
test(afs-6g): skybox + battle camera + ship positions + freeflight invariants
docs(afs-6g): session log + sprint complete
```

**5 sections shipped:**

**Section A — Security:**
- 0 critical CVEs (none existed)
- 3 high CVEs from Solana wallet-adapter chain documented as deferred-pending-ADVORA in `docs/security/deferred-cves.md`
- 24 moderate CVEs deferred (next sprint)
- Crypto-GHAI parked, code not exploitable in current build

**Section B — CSS Hotfix:**
- One-line edit to `components/layout/ConditionalFooter.tsx` adding `pathname.startsWith('/game/battle')` to existing hide-list
- Footer no longer overlaps battle viewport
- No new layout file needed (SKILL Option A/B both unnecessary)

**Section C — Universal Skybox:**
- `components/three/SpaceSkybox.tsx` (53 lines, R3F primitives, SRGBColorSpace, toneMapped={false}, useFrame for rotateWithCamera)
- `public/skybox/deep_space_01.png` (8K equirectangular, 7.6 MB) from spacespheremaps.com (CC-BY 4.0, attribution optional)
- Polyhaven has zero space HDRIs — pivoted to spacespheremaps.com
- `public/skybox/README.md` with full attribution + license
- 19 assertions in `tests/afs-6g-skybox.test.ts`

**Section D — Battle Scene Camera:**
- `<Stars>` (2500 Points particle system) replaced with `<SpaceSkybox>` (Suspense-wrapped) in `components/game/battle/BattleScene.tsx`
- `OrbitControls` added in `components/game/battle/BattleCanvas.tsx`:
  - enableZoom={true}, minDistance={10}, maxDistance={24}
  - enableRotate={true}, enablePan={false}
  - Limited azimuth ±π/9 (~±20°)
  - Polar π/3 to π/2.2 (~60°-82°)
- Camera far plane bumped 800 → 4000 (proactive — skybox sphere radius 1500 would frustum-cull at 800)
- Ship positions UNCHANGED — verified via 8-assertion regression test
- 19 assertions in `tests/afs-6g-battle-camera.test.ts`

**Section E — Cross-app:**
- Free Flight: `<Stars>` swapped for `<SpaceSkybox rotateWithCamera={true}>` in `components/freeflight/FreeFlightScene.tsx`
- Live verify SKIPPED for Free Flight due to BUG-04 memory leak — source-tested only
- Star Map: intentionally retained (curated multi-layer starfield via `StarMapScene.tsx` + `CSSStarfield.tsx` + `NebulaBg.tsx` is by design) — documented in `components/starmap/README.md`
- Hauling, speedrun, galaxy, preview canvases: out of scope per "no scope creep" rule
- 8 assertions in `tests/afs-6g-freeflight-skybox.test.ts`

**Sprint deviations from SKILL:**
1. Skybox texture is `.png` not `.jpg` (source publishes PNG, no point transcoding)
2. Camera far plane 800 → 4000 (proactive fix, in-code commented)
3. Ship asset mining DROPPED (license unverified for `voidexa-3d-assets/`, deferred to separate sprint)
4. Star Map skybox replacement DROPPED (curated by design, not a regression)
5. Free Flight got 8 assertions vs ~5 nominal (over-tested, not a regression)
6. Test count overshoot — 54 new vs ~26 nominal target

**Live verification (Claude in Chrome):**
- ✅ Footer no longer overlaps battle viewport
- ✅ Skybox visible (no twinkling stars)
- ✅ Bloom acceptable (no oversaturation)
- ⚠️ OrbitControls interaction not screenshot-verifiable; source-tested + Jix manual sign-off

### Brain-storm decisions locked SLUT 12

**Trade fee economy:**
- 5 GHAI flat per trade, paid by initiator alone
- GHAI as trade asset (cards + GHAI ↔ cards): ✅ allowed
- P2P GHAI gift / send to friend: ❌ never (regulatory landmine — money laundering risk under MiCA/PSD2)
- P2P item gift from inventory: ❌ never
- "Gift a pack" (real money in, item out): ⚪ future feature, safe legally

**Universal inventory:**
- Cross-app ownership model
- All apps (shop, game, trading, cosmetics) read from same `user_inventory`

**Battle scene v3 vision LOCKED via AI-generated reference image:**
- Reference saved as `docs/design/battle_scene_v3_reference.png`
- 3rd person drone-camera 80m bag player ship, slight downward angle
- Player ship medium-small, enemy small-far, same horizontal level
- 360° nebula skybox with visible purple/blue/red nebula clouds
- 5 floating subsystem panels with connector lines around player ship
- Cards as flat rectangular buttons side-by-side (NOT fanned hand)
- Pilot panel top-left with buff icons row
- Target panel top-center with enemy faction logo + name + hull bar
- Turn counter top-right
- Energy orb large bottom-left + Heat meter
- End Turn button prominent bottom-right

### Secrets migration (E:\ → D:\krypteret usb)

USB tree analysis identified 8 unique sensitive files on E:\ that needed sikring + 9 duplicates of files already on D:\.

**Migrated to `D:\krypteret usb\fra-e-drev-20260425\`:**
- github-recovery-codes.txt (206 B)
- Wallet.json (10 B, Samsung backup)
- Exodus sf.pdf (217 KB)
- konto-hos-binance.pdf (466 KB)
- 3x wallet transaction CSVs
- Kostplan - Jimmi.pdf (68 KB)

**Deleted from E:\ (already on D:):**
- 5x Google Passwords.csv
- 1x proton_2FA_recovery_codes.txt
- 1x github-recovery-codes.txt (extra)
- 2x konto-hos-binance.pdf (extras)

**Migration log:** `D:\krypteret usb\migration-log-20260425-184210.txt`

### Backup strategy decision (locked)

**No 2-SSD purchase needed currently.** Jix has D:\ + Google Drive + Proton Drive + local PC. AFS-24e SSD rotation deferred. Memory updated.

### 3D assets goldmine identified (deferred)

`E:\Archives\voidexa-3d-assets\` contains 25+ ship asset zips + uncompressed `usc_astroeagle01.glb`. License status UNKNOWN. Deferred to separate audit sprint (W-104) before any commit.

### New sprints added to roadmap

- **AFS-6h** (proposed) — Battle Scene v3 (Camera + Ship positions per reference image)
- **AFS-?? Skybox brighter nebula** — match reference image visual
- **AFS-?? Battle HUD v1** — Static panels per reference
- **AFS-?? Battle HUD v2** — 6 floating subsystem panels (depends on AFS-18)
- **AFS-?? Card UI Rebuild** — flat rectangles side-by-side
- **AFS-?? Universal Inventory Layer** — cross-app
- **AFS-?? Trading Hub v1** — 5 GHAI flat fee swap
- **AFS-?? Trade Chat Channel** — `/trade` in universal chat
- **AFS-?? 3D Asset License Audit** — verify E:\ assets
- **AFS-?? CVE source-of-truth audit** — Dependabot vs npm audit reconcile

### Outstanding open items

- [ ] Battle scene v3 sprint (AFS-6h) using reference image as authoritative spec
- [ ] Verify license status of `voidexa-3d-assets/` packs before any commit
- [ ] PvP scope decision (card PvP async vs real-time — discussed, not locked)
- [ ] Cross-set trading rules (Alpha ↔ V3) for Trading Hub v1
- [ ] Soulbound rules (mythics, mission rewards)
- [ ] Captain tier pricing
- [ ] Chat moderation strategy (LLM only vs human escalation)
- [ ] Replay system tier limits

### Lessons learned this session

- **Pre-flight VERIFY-FIRST is mandatory** — caught 5 wrong assumptions in this sprint alone
- **Reference images > prose specs** — AI-generated reference image communicated more in 1 image than hours of mockups
- **Communication style matters** — match person's level, especially when ADHD/tired
- **Don't oversell shipped work** — honest framing prevents trust drift
- **Single-sprint discipline holds** — 11 tasks with 4 checkpoint pauses worked well

### Mid-session corrections (Jix → Claude)

1. SKILL had wrong file paths (components/combat/ vs components/game/battle/) — pre-flight caught
2. SKILL had wrong CVE counts (1 critical + 6 high vs actual 0 + 3) — pre-flight caught
3. SKILL would have moved ships closer not farther (opposite of goal) — pre-flight caught
4. Claude oversold AFS-6g visual results — Jix corrected, framing adjusted
5. Claude wrote in too complex language — Jix corrected, simplified
6. Claude attempted Playwright live audit when Jix said no — acknowledged

### Rollback (if needed):

```bash
git reset --hard backup/pre-afs-6g-20260425
git push --force-with-lease origin main
git push origin :refs/tags/sprint-afs-6g-complete
```

---

### Session 2026-04-25 — AFS-6a-fix COMPLETE (Post-ship live audit bugfixes)

**Status:** ✅ SHIPPED to `origin/main`, tag `afs-6a-fix-complete` pushed, build clean, all 5 bugs fixed
**Tag:** `afs-6a-fix-complete`
**Backup:** `backup/pre-afs-6a-fix-20260425`
**Tests:** 1014/1014 green (was 994, +20 new AFS-6a-fix assertions — target was +5)
**Final HEAD:** `6144e08`

**Commit chain:**
```
6144e08 test(afs-6a-fix): nav + back-link + coming-soon invariants
cc5c2e3 test(afs-6a-fix): update nav-dropdown test for 9-item Universe
c095fc8 fix(afs-6a-fix): pack shop Coming Soon lockdown until Alpha 1000 ships
4c46411 fix(afs-6a-fix): pack shop copy 257-card -> Alpha library
afde42e fix(afs-6a-fix): cross-nav links from /shop to cosmetics + packs
84ae49f fix(afs-6a-fix): back-link on /shop/cosmetics points to /shop not /
47eb0cc fix(afs-6a-fix): add Inventory as 9th Universe nav item
f817347 docs(afs-6a-fix): bugfix SKILL for post-ship live audit
```

**5 bugs fixed:**

**Bug 1 — Universe dropdown missing Inventory.** Pre-flight revealed the other 8 items (Shop, Cards, etc.) were already wired in `components/layout/Navigation.tsx:70-77` (SKILL's premise that Shop/Cards were missing was wrong — live audit miss likely due to mid-rollout Vercel deploy). Real gap: only `/inventory` was unwired. Appended as 9th item at line 78. Added EN "Inventory" + DK "Beholdning" i18n keys.

**Bug 2 — Back-link on /shop/cosmetics.** `ShopCosmeticsClient.tsx:20` had `<Link href="/">← voidexa</Link>` leftover from orphan state. Changed to `<Link href="/shop">← Shop</Link>`.

**Bug 3 — No cross-nav between /shop and /shop/cosmetics.** Extracted `components/shop/ShopCrossNav.tsx` (42 lines) with pill links — cyan to `/shop/cosmetics`, gold to `/shop/packs`. Rendered in ShopPage hero. ShopPage stayed inside 1050-line budget (1040 → 1042).

**Bug 4 — "257-CARD LIBRARY" copy.** Per Jix: neutral "ALPHA LIBRARY" without count (avoids overstating since `library.test.ts` still asserts 257). `PackShopClient.tsx:76` → "BOOSTER PACKS · ALPHA LIBRARY". `app/shop/packs/page.tsx` metadata "257 cards" removed. Code/test references deliberately untouched — still reflect actual loader state.

**Bug 5 — Pack BUY lockdown.** All 3 tiers now render unconditionally disabled "Coming Soon" button. Italic lockdown note under YOUR BALANCE: "Coming soon — Alpha library launches when art is ready." Dead client state (`openPack`, `opening/result/err`, `PackOpeningAnimation`, `canAfford`) removed with pointer comment to predecessor commit for future restoration. `/api/shop/open-pack` endpoint untouched — infrastructure stays ready for when AFS-5 + AFS-18 complete. Matches Apr 24 powerplan decision: eliminate V3-card-id retirement risk + DK 2-year reklamationsret refund risk.

**Sprint deviations from SKILL:**
1. DK copy for Bug 4 deferred — no `/dk/shop/packs` route exists; DK pack surface is AFS-26 scope.
2. Test overshoot — 20 new assertions vs SKILL target of 5 (source-level invariants for all 5 bugs + API route existence tripwire).
3. Extra sweep-up commit `cc5c2e3` — pre-existing Sprint 13e test asserted "Break Room is LAST" in Universe; flipped to assert Inventory last / Break Room second-to-last.
4. Bug 3 refactor — extracted `ShopCrossNav` rather than inlining to respect 1050-line trigger.

**Files added:**
- `docs/skills/bugfix-afs-6a-fix.md`
- `components/shop/ShopCrossNav.tsx` (42 lines)

**Files modified:**
- `components/layout/Navigation.tsx` (+Inventory entry)
- `components/shop/ShopCosmeticsClient.tsx` (back-link href)
- `components/shop/ShopPage.tsx` (cross-nav rendering, 1040 → 1042 lines)
- `components/shop/PackShopClient.tsx` (Alpha library copy + Coming Soon lockdown + dead state cleanup)
- `app/shop/packs/page.tsx` (metadata copy)
- `lib/i18n/en.ts`, `lib/i18n/da.ts` (Inventory / Beholdning keys)
- Existing nav-dropdown test (flipped Break Room-last assertion)

**Known gaps (unchanged):**
- DK `/dk/shop/packs` route still missing (AFS-26)
- 5 V3 reference files still untracked (intentional)
- GHAI top-up modal stuck-open bug (out of scope, pre-existing)

**Rollback:**
```bash
git reset --hard backup/pre-afs-6a-fix-20260425
git push --force-with-lease origin main
git push origin :refs/tags/afs-6a-fix-complete
```

---

### Session 2026-04-24 — Sprint AFS-6a COMPLETE (In-game Shop GHAI Flow)

**Status:** ✅ SHIPPED to `origin/main`, tag `sprint-afs-6a-complete` pushed, build clean, 4 new routes (/shop/cosmetics, /dk/shop/cosmetics, /inventory, /dk/inventory)
**Tag:** `sprint-afs-6a-complete`
**Backup:** `backup/pre-sprint-afs-6a-20260424`
**Tests:** 994/994 green (was 973, +21 new AFS-6a assertions — target was +10)
**Final HEAD:** `bf1ce98`

**Commit chain:**
```
bf1ce98 test(afs-6a): playwright e2e spec (voidexa-tests handoff)
21bbaf3 test(afs-6a): vitest unit coverage
525afde feat(afs-6a): /inventory page read view
f607377 feat(afs-6a): rewire ShopPage ItemModal BUY to spendGhai + packs redirect
e2c99fa feat(afs-6a): mount ShopCosmeticsClient at /shop/cosmetics
4e9a333 docs(afs-6a): SKILL v2 based on live codebase audit
```

**SKILL v2 reason:** Claude Code pre-flight 2026-04-24 exposed v1 SKILL built on false premise. Reality: GHAI purchases already shipped for packs (`/shop/packs` via `PackShopClient` + `/api/shop/open-pack` with Mythic supply, optimistic concurrency, Universe Wall broadcast, ghai_transactions ledger) AND cosmetics (`CosmeticTab` via `spendGhai()`). The real bug was narrower: `/shop` rendered `ShopPage` with dead "Coming Soon · Stripe" modal buttons, and `ShopCosmeticsClient` was orphan code (zero `app/` imports). v1 would have duplicated working schema (proposed new `shop_packs`, `user_inventory`, `shop_transactions`, `purchase_pack_atomic` RPC — all already exist via `user_credits.ghai_balance_platform` + `user_cards` + `user_cosmetics` + `ghai_transactions` + `mythic_supply`). v2 reshaped to narrow fix.

**What shipped:**
- `/shop/cosmetics` + `/dk/shop/cosmetics` — mount previously orphaned `ShopCosmeticsClient` with Next.js 16 async `searchParams`, SEO canonical+alternates, default `tab=racing`
- `ShopTabs` push target retargeted from `/shop` → `/shop/cosmetics` so tab nav stays inside cosmetics surface
- `ShopPage.tsx` ItemModal BUY rewired — dead "Coming Soon · Stripe" button replaced with new `<ItemBuyButton>`. Card packs redirect to `/shop/packs`; all other categories spend via `spendGhai` + insert `user_cosmetics`. Error branches link to `/wallet` (low GHAI) and `/auth/login` (unauth)
- `lib/shop/buy-handler.ts` — pure helper, no new tables/RPC; reuses existing `spendGhai` + `user_cosmetics` schema per SKILL v2
- `/inventory` + `/dk/inventory` — auth-gated server page (`redirect('/auth/login?redirect=/inventory')`), reads `user_cards` + `user_cosmetics`, client grid with All/Cards/Cosmetics tabs, empty state CTA, links to `/shop/packs` + `/shop/cosmetics`
- `ShopPage.tsx` went 1055 → 1040 lines (15-line reduction)

**Sprint deviations from SKILL v2:**
1. Vitest over Playwright in-repo — Playwright is not installed in `voidexa-ai/voidexa`; lives in `voidexa-tests`. Matches AFS-4 precedent. Spec committed to `tests/e2e/afs6a-shop-buy.spec.ts` as handoff artifact for voidexa-tests maintainer.
2. Test count overshoot — 21 new assertions vs SKILL target of ~10 (source-level invariants + mocked buy-handler unit tests).
3. Minor SKILL text note — PACK_DEFS third tier is actually `legendary`, not `ultimate` as sanity-check comment claimed (line 86 of SKILL v2). No code impact.

**Known items out-of-scope (per SKILL v2 exclusions):**
- No new Supabase tables / RPC (existing schema reused)
- ShopPage still 1040 lines (pre-existing debt)
- STARTER_SHOP_ITEMS acquired via /shop BUY own `user_cosmetics` row keyed by starter id (skin-crimson-fighter etc.) — the game doesn't yet render these as visuals because rendering code is keyed off separate COSMETIC_CATALOG IDs. Ownership flow is real; visual application is a future rebuild concern
- `t.shop.comingSoonStripe` translation key left in `lib/i18n/*` as harmless dead code
- No PACK_DEFS expansion to 5 tiers
- Danish copy in new cosmetic/inventory pages uses English handler (AFS-28)
- 400-item catalog rebuild from `shop_alpha_master.md` remains a future multi-sprint chain
- Playwright spec file is source-only in this repo — not executed

**Post-ship live audit findings (handled in AFS-6a-fix above):**
- Universe dropdown missing Inventory entry
- `/shop/cosmetics` back-link pointed to `/` not `/shop`
- No cross-nav between `/shop` and `/shop/cosmetics`
- `/shop/packs` copy said "257-CARD LIBRARY"
- `/shop/packs` BUY was active — locked to "Coming Soon" until AFS-5 + AFS-18 complete

**Files added:**
- `docs/skills/sprint-afs-6a-shop-ghai-flow.md` (SKILL v2)
- `app/shop/cosmetics/page.tsx` + `app/dk/shop/cosmetics/page.tsx`
- `app/inventory/page.tsx` + `app/dk/inventory/page.tsx`
- `components/inventory/InventoryGrid.tsx`
- `components/shop/ItemBuyButton.tsx`
- `lib/shop/buy-handler.ts`
- `tests/afs-6a-shop-rewire.test.ts`
- `tests/e2e/afs6a-shop-buy.spec.ts` (handoff to voidexa-tests)

**Files modified:**
- `components/shop/ShopPage.tsx` (1055 → 1040, BUY rewire)
- `components/shop/ShopTabs.tsx` (retargeted push)

**Rollback:**
```bash
git reset --hard backup/pre-sprint-afs-6a-20260424
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-6a-complete
```

---

### Session 2026-04-22 — Sprint AFS-4 COMPLETE (Admin Control Plane Data Pipeline)

**Status:** ✅ SHIPPED to `origin/main`, migration applied in Supabase
(`ihuljnekxkyqgroklurp`), tests green, build clean. Live dashboard
verification to be done by Jix after first real events land.
**Tag:** `sprint-afs-4-complete`
**Backup:** `backup/pre-afs-4-20260422`
**Tests:** 973/973 green (was 938, +35 new AFS-4 assertions)
**Final HEAD:** `a15e568`

**Commit chain:**
```
a15e568 test(afs-4): playwright admin flow + unit tests
b455380 feat(afs-4): rewire control plane dashboard to real data
3d2b3da feat(afs-4): rewire /api/kcp90/stats to aggregate real events
8233b93 feat(afs-4): trading bot events endpoint stub
6eb13b5 feat(afs-4): wire break room logging
3e20887 feat(afs-4): wire quantum session logging via proxy endpoint
42a4f62 feat(afs-4): wire void chat compression logging
72b2459 feat(afs-4): server-side log-event helper
b91ec9e feat(afs-4): kcp90_compression_events migration
6f5bcbf docs(afs-4): SKILL v2 for admin data pipeline
```

**What shipped:**
- New Supabase table `kcp90_compression_events` (13 cols + 3 indexes),
  RLS enabled, exactly one policy `admin_read_all` using existing
  `public.is_admin()` — default-deny for everyone else; service-role
  bypass handles writes by design
- Server-only helper `lib/kcp90/log-event.ts` — fire-and-forget,
  `import 'server-only'`, singleton `supabaseAdmin`, never throws to
  caller, console-only error path
- **Void Chat:** `app/api/chat/send/route.ts` now captures raw vs
  compressed history byte sizes around the existing
  `compressForContext()` call and logs a `product: 'void-chat'` event
  in `onDone` after GHAI deduction (non-blocking)
- **Quantum:** new proxy endpoint `/api/quantum/log-session` so the
  browser-side SSE loop can report without ever touching the
  service-role key. `lib/quantum/client.ts` posts to it on
  `session_complete` events, carrying `mode`, `rounds`,
  `providers_used`, `kcp_savings`, `cost`
- **Break Room:** `app/api/break-room/chat/route.ts` logs each chat
  turn with `product: 'break-room'`, token counts estimated from
  character counts (`~4 chars/token`) and flagged
  `tokensEstimated: true` in `meta`
- **Trading Bot:** new `/api/trading-bot/events` endpoint using the
  shared `KCP90_API_SECRET` + Bearer convention (no new bespoke
  secret). Bot repo wiring stays out of scope (AFS-16)
- **`/api/kcp90/stats` overwrite (not new path):** preserved POST
  contract with external callers but migrated writes to new table via
  `logKcp90Event`; GET now enforces `profile.role === 'admin'` and
  returns `{ generatedAt, windows: {24h,7d,30d}, recent }` aggregated
  from `kcp90_compression_events`. Public consumer
  `/api/kcp90/public-stats` untouched
- **Dashboard rewire:** extracted `lib/kcp90/dashboard-adapter.ts` with
  pure `toLegacySummary` + `toLegacyRecent` that map the new API shape
  onto the existing `Summary`/`RecentStat` UI types, so no panel
  code had to change. Dashboard fetches on mount + every 30s, keeps
  previous data on network error. `app/control-plane/page.tsx`
  dropped legacy SSR fetch of `kcp90_summary`/`kcp90_daily_stats`
  and now uses `createServerSupabaseClient` + `supabaseAdmin` for
  auth + role check

**Sprint scope deviations from SKILL v2 (documented):**
1. **Server-client export name** — SKILL's VERIFY-FIRST tag flagged
   correctly: `lib/supabase-server.ts` exports
   `createServerSupabaseClient`, not `createServerClient`. Tasks 4, 7,
   and 8 adjusted.
2. **Admin-client shape** — `lib/supabase-admin.ts` exports the
   pre-built `supabaseAdmin` singleton, not a factory. Task 2 helper
   uses the singleton directly (dropped the local `serviceClient()`
   factory from the SKILL's "universally safe" variant in favour of
   the SKILL's own "Alternative" block).
3. **Test framework** — Vitest, not Playwright. AFS-1/2/3 precedent
   was explicit. Playwright is in a separate `voidexa-tests` repo.
   35 assertions shipped against the SKILL's target of ~20.
4. **Task 7 existing POST ingest** — SKILL assumed the endpoint
   "returns nulls". Reality: it had a working POST path writing to
   legacy `kcp90_stats` table via `KCP90_API_SECRET` + Bearer. Per
   approved plan: preserved the POST body contract for external
   callers, delegated writes to `logKcp90Event` so legacy callers
   start contributing to the new table.
5. **Shared secret for trading-bot** — SKILL proposed a new
   `TRADING_BOT_WEBHOOK_SECRET`. Per approved plan: reused the
   existing `KCP90_API_SECRET` so there is ONE machine-to-machine
   secret across all product ingest endpoints. No new env var.
6. **Dashboard adapter extracted** — originally inlined in
   `ControlPlaneDashboard.tsx` but that put the file at 944 lines
   (SKILL target 900). Extracted the pure functions to
   `lib/kcp90/dashboard-adapter.ts` — kept the dashboard under budget
   AND gave Task 9 real unit tests (not just source-level grep).

**Files added:**
- `docs/skills/sprint-afs-4-admin-data-pipeline.md` (Task 0)
- `supabase/migrations/20260422_kcp90_compression_events.sql`
- `lib/kcp90/log-event.ts` (73 lines, server-only)
- `lib/kcp90/dashboard-adapter.ts` (108 lines, pure)
- `app/api/quantum/log-session/route.ts` (48 lines)
- `app/api/trading-bot/events/route.ts` (49 lines)
- `tests/afs-4-admin-data-pipeline.test.ts` (35 assertions)

**Files modified:**
- `app/api/chat/send/route.ts` (Void Chat wire, +17 lines)
- `app/api/break-room/chat/route.ts` (Break Room wire, +19 lines)
- `app/api/kcp90/stats/route.ts` (OVERWRITE — 131 → 191 lines)
- `lib/quantum/client.ts` (session_complete hook, +30 lines)
- `app/control-plane/page.tsx` (dropped legacy SSR fetch, 66 → 36
  lines)
- `components/control-plane/ControlPlaneDashboard.tsx` (adapter fetch
  + mount-refresh, 861 → 872 lines, still over component 300-line
  limit — pre-existing debt, not introduced by AFS-4)
- `CLAUDE.md` (this entry + sprint history row + P0 bug row update)

**Supabase changes (project `ihuljnekxkyqgroklurp`, EU):**
- Table `kcp90_compression_events` — created + smoke-tested by Jix
  (insert → count=1 → delete)
- RLS enabled with 1 policy (`admin_read_all`)
- Legacy `kcp90_stats` / `kcp90_summary` / `kcp90_daily_stats` tables
  untouched — frozen for historical data, no longer written to

**Known items out-of-scope:**
- AFS-16 — Trading Bot repo-side wiring (endpoint stub built here,
  bot still needs to POST to `/api/trading-bot/events`)
- AFS-26 — Danish translation of dashboard copy
- Live dashboard screenshot verification — waits for Void Chat /
  Quantum / Break Room traffic to generate real events. Jix to
  confirm once numbers appear
- Legacy `kcp90_stats` table migration into new table — data remains
  queryable in Supabase, never auto-merged
- `components/control-plane/ControlPlaneDashboard.tsx` at 872 lines
  still violates the 300-line component limit (inherited from
  pre-sprint state; touching it here was constrained to a minimal
  adapter wire-up)

**Rollback:**
```bash
git reset --hard backup/pre-afs-4-20260422
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-4-complete
# Supabase: drop table kcp90_compression_events (no production data yet)
```

---

### Session 2026-04-22 — Sprint AFS-3 COMPLETE (Game Hub 404 Fixes)

**Status:** ✅ SHIPPED to `origin/main`, live-verified on voidexa.com
**Tag:** `sprint-afs-3-complete`
**Backup:** `backup/pre-sprint-afs-3-20260422`
**Tests:** 938/938 green (was 910, +28 new AFS-3 assertions)
**Final HEAD:** `3da828c`

**Commit chain:**
```
3da828c test(afs-3): game hub redirects + tile UX coverage
83c798b feat(afs-3): game hub tile UX with icons and descriptions
631d08d feat(afs-3): 308 redirects for canonical game hub aliases
ebd6a8b chore(afs-3): add sprint SKILL documentation
```

**What shipped:**
- 8 permanent (308) redirects in `next.config.ts`: 4 EN canonicals
  (`/game/card-battle` → `/game/battle`, `/game/deck-builder` →
  `/game/cards/deck-builder`, `/game/pilot-profile` → `/game/profile`,
  `/game/shop` → `/shop`) plus 4 DK mirrors pointing at the same
  English destinations (DK game surface is untranslated for now —
  tracked under AFS-26)
- Game Hub tile UX refresh: extracted to `components/game/GameHubTiles.tsx`,
  every tile now carries a lucide-react icon, a 1-line description, a
  responsive grid (1 col mobile / 2 tablet / 4 desktop), hover + focus
  states, and a `data-testid` hook for future E2E
- UniverseWallFeed retained below the grid

**Sprint scope deviation (documented):** The AFS-3 SKILL (pushed as
`ebd6a8b`) was written assuming `/game/card-battle`, `/game/deck-builder`,
and `/game/pilot-profile` did not exist. Task 1 inventory proved the
features **already ship** at non-canonical URLs — `/game/battle`
(BattleClient + BattleEntry + BattleController, 12 components),
`/game/cards/deck-builder` (DeckBuilderClient, 584 lines), and
`/game/profile[/userId]` (PilotCard + TalesLog + ProfileEditForm). The
Shop tile in the hub already pointed at `/shop`, not the dead
`/game/shop`. Re-implementing these from `components/combat/*` would
have produced two live URLs for every feature and ~2000 lines of
duplicated code. Using the AFS-2 redirect pattern instead delivers the
P0 fix (canonical URLs no longer 404) without touching working
battle/deck/profile code.

**Files added:**
- `components/game/GameHubTiles.tsx` (141 lines, exports `GAME_HUB_TILES`)
- `tests/afs-3-game-hub.test.ts` (28 assertions)

**Files modified:** `next.config.ts`, `app/game/page.tsx`, `CLAUDE.md`.

**Live verification (2026-04-22 via curl):**
- 308 with `Location: /game/battle` for `/game/card-battle`
- 308 with `Location: /game/cards/deck-builder` for `/game/deck-builder`
- 308 with `Location: /game/profile` for `/game/pilot-profile`
- 308 with `Location: /shop` for `/game/shop`
- Same 308s for all 4 DK mirror URLs
- Destinations: `/game/battle` 200, `/game/cards/deck-builder` 200,
  `/game/profile` 307 (server-component auth redirect, expected),
  `/shop` 200, `/game` 200

**Known items out-of-scope (unchanged):**
- AFS-26 — Danish translation of the game surface; DK redirects
  currently land on English destinations on purpose
- AFS-12 — sound wiring on battle events (5 boss themes still unwired)
- AFS-4 — Admin Control Plane data pipeline
- AFS-5 — 257-card art pipeline
- Tutorial flow for first-time card battle players

**Rollback:**
```bash
git reset --hard backup/pre-sprint-afs-3-20260422
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-3-complete
```

---

### Session 2026-04-22 — Sprint AFS-2 COMPLETE (Auth Route Infrastructure)

**Status:** ✅ SHIPPED to `origin/main`, live verification pending Vercel deploy
**Tag:** `sprint-afs-2-complete`
**Backup:** `backup/pre-sprint-afs-2-20260422`
**Tests:** 910/910 green (was 860, +50 new AFS-2 assertions)
**Final HEAD:** `36d5f62`

**Commit chain:**
```
36d5f62 test(afs-2): wallet/settings/smoke coverage
ee70831 feat(afs-2): wallet + settings in user dropdown
11055b1 feat(afs-2): /settings page MVP
6ec6c2e feat(afs-2): /wallet page binds existing backend APIs
e223382 feat(afs-2): 308 redirects for canonical auth aliases
00c6c0c chore(afs-2): add sprint SKILL documentation
```

**What shipped:**
- 14 permanent (308) redirects in `next.config.ts`: 7 EN canonicals
  (`/login`, `/signin`, `/signup`, `/register`, `/auth/signin`,
  `/auth/register`, `/account`) plus 7 DK mirrors
- `/wallet` (+ `/dk/wallet`) — server-rendered auth-gated page that
  redirects unauthenticated visitors to `/auth/login?redirect=/wallet`,
  reuses the existing `WalletBar` component for Stripe top-up, and
  shows the last 10 `wallet_transactions` with Stripe flag + running
  balance
- `/settings` (+ `/dk/settings`) — MVP account settings: display name
  (writes to `profiles.name`), read-only email, language preference
  stored under `voidexa_locale_pref_v1`, notifications stub, sign-out,
  delete-account hand-off to `/contact`
- DK auth re-export pages: `/dk/auth/login`, `/dk/auth/signup`,
  `/dk/profile` — thin wrappers around the English pages with DK
  metadata, matching the AFS-7 locale-mirror pattern
- `app/auth/login/page.tsx` — now reads `?redirect=` and sends users
  back to their intended destination after signing in, with an
  allowlist that blocks open-redirect abuse; wrapped in Suspense to
  keep Next.js 16 prerender happy
- `components/AuthButton.tsx` — user dropdown now contains Profile +
  Wallet + Settings + Sign out with Danish labels (Profil, Tegnebog,
  Indstillinger, Log ud, Tilmeld); all links route through
  `localizeHref`

**Files added:**
- `app/wallet/page.tsx` + `layout.tsx`
- `app/settings/page.tsx` + `layout.tsx`
- `app/dk/wallet/page.tsx`, `app/dk/settings/page.tsx`
- `app/dk/auth/login/page.tsx`, `app/dk/auth/signup/page.tsx`
- `app/dk/profile/page.tsx`
- `components/wallet/WalletPageClient.tsx`
- `components/settings/SettingsPageClient.tsx`
- `tests/afs-2-auth-routes.test.ts` (50 assertions)

**Files modified:** `next.config.ts`, `app/auth/login/page.tsx`,
`components/AuthButton.tsx`.

**Known items out-of-scope (unchanged):**
- Password reset flow (separate sprint)
- 2FA / MFA
- OAuth provider expansion
- Deeper wallet analytics (GHAI balance, per-product spend)
- Deeper settings (email change, notification backend, GDPR-automation
  delete) — currently stub/toast only, handled by support
- Danish translation of the auth forms themselves (AFS-26)

**Rollback:**
```bash
git reset --hard backup/pre-sprint-afs-2-20260422
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-2-complete
```

---

### Session 2026-04-22 — Sprint AFS-1 COMPLETE (+ 1b, 1c, 1d hotfixes)

**Status:** ✅ SHIPPED to production, live verified
**Tag:** `sprint-afs-1-complete`
**Tests:** 825/825 green
**Final HEAD:** `357e1a9`

**Full commit chain on main:**
```
357e1a9 feat(afs-1d): add ultrawide 1928x816 still frame, matches viewport aspect
fa01588 Revert "fix(afs-1c): still frame object-fit cover to contain, full scene visible"
dee8ffa fix(afs-1c): still frame object-fit cover to contain, full scene visible (reverted)
8d3a1e6 docs(sprint-afs-1): mark sprint complete, record 7 commits + 825 tests green
b8aed26 test(homepage): AFS-1 regression suite (25 tests)
85c830f fix(afs-1): checkbox + replay link contrast
228d79e fix(afs-1): Bespoke -> Custom-built apps
122ac57 fix(afs-1): per-session audio gate via sessionStorage
cb16c40 fix(afs-1): MUTE button deleted (IntroVideo 151 -> 73 lines)
fa5d379 fix(afs-1): matched-aspect still frame upload
a819608 chore(sprint-afs-1): SKILL.md + upload script
```

**6 tasks executed:**
1. FFmpeg extracted video last frame (WRONG — see AFS-1b)
2. MUTE button deleted from IntroVideo.tsx
3. Sound popup moved to sessionStorage
4. "Bespoke" → "Custom-built apps" (EN + DA)
5. Checkbox + Replay link contrast (opacity 0.95, weight 500, text-shadow)
6. Vitest regression suite (25 tests) — deviation from Playwright in SKILL (saved ~300MB deps)

**Hotfixes chain:**

**AFS-1b:** Restored Jix's original 1536×1024 Runway PNG to Supabase (overwrote video-frame extract which had wrong composition — camera-through-window reveal was cropped)

**AFS-1c:** Changed `object-fit: cover` to `contain` on still frame (`app/page.tsx:122`) — revealed full scene but introduced black pillar-bars on ultrawide

**AFS-1d:** Final fix. Jix generated new 1928×816 ultrawide PNG (aspect 2.363, matches viewport 2.386). Uploaded to Supabase, reverted AFS-1c (object-fit back to cover). Result: full screen + full composition + no bars.

**Live verified:** Jix confirmed "det virker nu" after Chrome cache clear.

**Known items out-of-scope (unchanged):**
- "We are live. Welcome to voidexa" banner still top of page (Sprint 17 Task 3)
- Starmap nebula zoom too close (AFS-10 Starmap Level 2)
- Video cinematic still ends on OLD still composition, not new ultrawide (Jix: "skal have ændret filmen til den nye baggrund på et tidspunkt — ikke vigtigt nu")
- 15 Dependabot advisories unrelated to AFS-1 (AFS-22 repo hygiene)
- `app/page.tsx` 166 lines (over 100 target)
- "Bespoke" still in HomeProducts.tsx + ProductPanels.tsx (different sections, explicitly excluded from AFS-1)

**Files changed (this sprint):**
- `docs/skills/sprint-afs-1-homepage-repair.md` (new)
- `scripts/upload-intro-frame.mjs` (new)
- `components/IntroVideo.tsx`
- `components/QuickMenuOverlay.tsx`
- `components/SoundPopup.tsx`
- `app/page.tsx` (line 122 reverted to cover after AFS-1d)
- `lib/i18n/en.ts`
- `lib/i18n/da.ts`
- `tests/homepage-flow.test.ts` (Vitest, 25 assertions)
- `CLAUDE.md` (session log)
- `assets/intro/stil_picture_intro_ultrawide.png` (new, committed for provenance)

**Supabase Storage:**
- `intro/stil_picture_intro.png` = 1928×816 ultrawide (current live)

**Rollback tags available:**
- `backup/pre-sprint-afs-1-20260422`
- `backup/pre-sprint-afs-1b-20260422`

---

### Session 2026-04-22 — Sprint AFS-7 COMPLETE (Legal Pages)

**Status:** ✅ SHIPPED to production, 8/8 routes live-verified (200)
**Tag:** `sprint-afs-7-complete`
**Backup:** `backup/pre-sprint-afs-7-20260422`
**Tests:** 860/860 green (was 825, +35 new AFS-7 assertions)
**Final HEAD:** `b58fcb8`

**Commit chain:**
```
b58fcb8 feat(afs-7): legal pages + sitemap + robots + cookie banner
5971d52 chore(afs-7): add sprint SKILL documentation
```

**What shipped:**
- `/privacy` (+ `/dk/privacy`) — GDPR policy: data controller (CVR 46343387),
  7 sub-processors (Supabase EU, Stripe, Vercel, Anthropic, OpenAI, Google,
  Perplexity), retention table, GDPR rights, Datatilsynet escalation, Danish
  governing law
- `/terms` (+ `/dk/terms`) — commercial ToS: GHAI as non-refundable digital
  platform credit (not crypto / not investment / not security / not legal
  tender / not cash-redeemable), UGC license, 2-year reklamationsret for
  physical products, 14-day distance-sales return right, Vordingborg
  retskreds jurisdiction
- `/cookies` (+ `/dk/cookies`) — policy + inline `CookieSettings` mid-page
  consent toggle. Key `voidexa_cookie_consent_v1` stores `essential` or `all`.
- `/sitemap.xml` — 48 URLs (34 EN + 14 DK), change-frequency and priority
  tuned per route class
- `/robots.txt` — allow `/`, disallow `/admin`, `/control-plane`, `/auth`,
  `/api` (with + without trailing slash), Sitemap + Host point to voidexa.com
- `CookieBanner` wired globally via `app/layout.tsx`; pure helpers in
  `lib/cookies/consent.ts` so Vitest exercises them without a DOM

**Files added:**
- `docs/skills/sprint-afs-7-legal-pages.md` (new)
- `app/privacy/page.tsx` + `layout.tsx`
- `app/terms/page.tsx` + `layout.tsx`
- `app/cookies/page.tsx` + `layout.tsx`
- `app/dk/privacy/page.tsx`, `app/dk/terms/page.tsx`, `app/dk/cookies/page.tsx`
- `app/sitemap.ts`, `app/robots.ts`
- `components/legal/LegalPage.tsx`
- `components/legal/CookieBanner.tsx`, `components/legal/CookieSettings.tsx`
- `lib/cookies/consent.ts`
- `tests/afs-7-legal-pages.test.ts` (35 assertions)

**Files modified:** `app/layout.tsx` (CookieBanner import + render).

**Live verification (2026-04-22 via curl):**
- 200 `/privacy`, `/terms`, `/cookies`, `/sitemap.xml`, `/robots.txt`
- 200 `/dk/privacy`, `/dk/terms`, `/dk/cookies`
- Content checks: CVR 46343387 + Datatilsynet render on `/privacy`;
  non-refundable + Vordingborg + reklamationsret render on `/terms`;
  consent key + CookieSettings id render on `/cookies`

**Legal disclaimer baked into both /privacy and /terms:** boilerplate
sufficient for technical compliance. Full solicitor review tracked as
**AFS-37** before any major marketing push.

**Known items out-of-scope:**
- AFS-26 — proper Danish translations (DK routes re-export English)
- AFS-37 — ADVORA attorney review of legal copy
- CW-4 — cookie banner copy polish with i18n strings
- Analytics SDK not yet installed; when added, it must read
  `getCookieConsent()` and gate itself on `'all'` before firing

**Prior CLAUDE.md claim that AFS-4 + AFS-5 SKILL files were pushed was
incorrect** — only AFS-1 was actually committed before this sprint. AFS-4
and AFS-5 SKILL files still do not exist and need to be written before they
can be executed.

---

## ACTIVE P0 BUGS (remaining)

| Bug | Fix |
|---|---|
| ~~Homepage cinematic + quick menu~~ | ✅ **AFS-1 COMPLETE** |
| ~~`/login`, `/signin`, `/wallet`, `/settings`, `/account` 404~~ | ✅ **AFS-2 COMPLETE** |
| ~~`/game/card-battle`, `/game/deck-builder`, `/game/pilot-profile`, `/game/shop` 404~~ | ✅ **AFS-3 COMPLETE** |
| ~~Admin Control Plane ZERO data~~ | ✅ **AFS-4 COMPLETE** |
| ~~Cards blank art (1000 Alpha scope)~~ | ✅ **AFS-5 COMPLETE** (Apr 27, 1000 cards generated tiered $41.52, manifest.json on Jix PC) |
| ~~Shop 26 cosmetics "COMING SOON"~~ | ✅ **AFS-6a COMPLETE** (reality was narrower — see SKILL v2 reshape) |
| ~~Shop nav + cross-nav + copy + pack lockdown~~ | ✅ **AFS-6a-fix COMPLETE** |
| ~~`/privacy`, `/terms`, `/cookies`, `/sitemap.xml`, `/robots.txt` 404~~ | ✅ **AFS-7 COMPLETE** |
| GHAI top-up modal stuck open across pages | **NEW — needs investigation sprint** |
| Starmap Level 2 nebula zoom | AFS-10 |
| Cinematic video end-frame ≠ new backdrop | AFS-11 (future, low prio) |
| "We are live. Welcome" banner | AFS-12 (polish) |
| Danish i18n overflade-only | AFS-26 |
| `/dk/shop/packs` route missing | AFS-26 |
| STARTER_SHOP_ITEMS ownership → visual render gap | Future rebuild (tracked, not P0) |

---

## PENDING SPRINTS (this chat)

- **AFS-6b** — Real-world GHAI Commerce UX (disambiguation: DKK/EUR disclaimer on AEGIS/Comlink/Consulting pages, contact form "Ghost AI Chat" rename, wallet clarification) — **SKILL.md ready (Apr 27), pre-flight pending**
- **AFS-6c** — voidexa Shop v1: catalog + "Kontakt for køb" form → contact@voidexa.com via Resend. Products: AEGIS Monitor, Comlink Node, Website Builder, AI Consulting. NO checkout/payment in v1. 2-year DK reklamationsret.

---

## DATA SAFETY CHECKLIST (every sprint)

Before marking sprint complete:
- [ ] `git status` clean
- [ ] `git log origin/main --oneline -3` shows our commit at HEAD
- [ ] Untracked reviewed
- [ ] Tag pushed: `git push origin sprint-afs-N-complete`
- [ ] If UI: live-verify on voidexa.com (incognito, hard-reload)
- [ ] CLAUDE.md updated AND uploaded to Project Knowledge (new Apr 25 rule)
- [ ] SKILL.md committed first

---

## AUTHORITY HIERARCHY

1. Live audit (Claude in Chrome)
2. GROUND_TRUTH.md raw log
3. INDEX files (00-18)
4. userMemories
5. Claude session context

Never guess. Search INDEX → raw → past chats → only then ask Jix.
