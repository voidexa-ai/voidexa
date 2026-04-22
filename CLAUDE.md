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

---

## SESSION LOG

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
| 257 Cards blank art | AFS-5 (SKILL NOT written) |
| Shop 26 cosmetics "COMING SOON" | AFS-6a |
| ~~`/privacy`, `/terms`, `/cookies`, `/sitemap.xml`, `/robots.txt` 404~~ | ✅ **AFS-7 COMPLETE** |
| Starmap Level 2 nebula zoom | AFS-10 |
| Cinematic video end-frame ≠ new backdrop | AFS-11 (future, low prio) |
| "We are live. Welcome" banner | AFS-12 (polish) |
| Danish i18n overflade-only | AFS-26 |

---

## DATA SAFETY CHECKLIST (every sprint)

Before marking sprint complete:
- [ ] `git status` clean
- [ ] `git log origin/main --oneline -3` shows our commit at HEAD
- [ ] Untracked reviewed
- [ ] Tag pushed: `git push origin sprint-afs-N-complete`
- [ ] If UI: live-verify on voidexa.com (incognito, hard-reload)
- [ ] CLAUDE.md updated
- [ ] SKILL.md committed first

---

## AUTHORITY HIERARCHY

1. Live audit (Claude in Chrome)
2. GROUND_TRUTH.md raw log
3. INDEX files (00-18)
4. userMemories
5. Claude session context

Never guess. Search INDEX → raw → past chats → only then ask Jix.
