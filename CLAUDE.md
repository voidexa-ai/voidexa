## READ THESE FIRST
- Read docs/STAR_SYSTEM_SPEC.md for the complete voidexa star system ecosystem design (visual architecture, economic engine, data model, build phases).

## PRODUCTION — QUANTUM ER LIVE
- Backend: https://quantum-production-dd9d.up.railway.app
- Frontend: https://voidexa.com/quantum/chat (Vercel)
- ALDRIG test på localhost. ALDRIG foreslå dev server. Alt er production.
- Deploy backend: git push (Railway auto-deployer)
- Deploy frontend: cd C:\Users\Jixwu\Desktop\voidexa && npx vercel --prod
- Port 8080. httpx<0.28. Guest sessions tilladt.
- Ejer: Jix (IKKE Jimmi/Jimmy). Virksomhed: voidexa, CVR 46343387.

## WORKFLOW REGLER
- ALDRIG start building før Jix bekræfter planen
- ALDRIG troubleshoot manuelt — fix selv
- ALDRIG foreslå pauser eller at stoppe
- Én kommando = én build. Byg ALT i én session
- Git backup FØR store ændringer
- Font regler: body 16px min, labels 14px min, opacity 0.5 min
- Ved AFSLUTNING af HVER session: opdater denne CLAUDE.md med hvad der blev bygget/ændret

## Session 2026-04-11: Quantum UI Fixes (11 fixes)
### Frontend (voidexa)
- SessionBar: shows backend final cost on session_complete, min-width 200px, no text overlap
- CostSummaryStrip: customer pricing (2.5x standard / 3.5x deep, min $0.05/$0.25), market price = 10x (strikethrough), savings %
- Follow-up label: "+$0.005 per follow-up" (was "~$0.005")
- QuantumSSEEvent: added kcp_savings field
- Auth guard: /quantum/chat requires Supabase login, shows sign-in prompt for anonymous users

### Backend (quantum, webui branch)
- Fix session DB bug: event type "complete" → "session_complete" in sessions.py — sessions now save to DB
- KCP-90 savings: kcp_savings included in session_complete SSE event
- Language matching: ALL provider system prompts now include "Always respond in the same language as the user's question"
- Admin stats: GET /api/sessions/admin/stats returns total sessions, tokens, cost, per-user breakdowns

### Manual step needed
- Fix 11: Add TESTER_EMAILS=tom@voidexa.com in Railway dashboard env variables

## Session 2026-04-11 (2): Debate Engine + Pricing Overhaul (10 fixes)
### Backend (quantum, webui branch)
- Question classifier: quantum/classifier.py — keyword-based A/B/C (factual/analytical/creative)
- Role-based debate: factual → Perplexity+Gemini first; creative → Claude+GPT first; analytical → all
- Self-eval exclusion: round 2/3 prompts exclude each provider's own response
- Anti-filler prompts: no greetings, no self-praise, every sentence must add value
- Compiled synthesis: after final round, Claude compiles all positions into one answer ({"type":"synthesis"})
- KCP-90 round context fix: compressed text no longer fed to AIs (plain text only, KCP for metrics)

### Frontend (voidexa)
- SessionBar: shows CUSTOMER price (not API cost) — live ticker uses 2.5x/3.5x multiplier
- Savings label: "You saved ~XX% vs market price" (removed KCP-90 branding from customer-facing text)
- Synthesis display: "Quantum Consensus" card shown above debate, individual messages in collapsible section
- Follow-up: "+$0.005 per follow-up question"

## Session 2026-04-11 (3): Wallet System + Chat History + Session Bar Fix
### Supabase (ihuljnekxkyqgroklurp)
- Migration: user_wallets, wallet_transactions, quantum_sessions tables with RLS
- Admin RLS policies for ceo@voidexa.com
- Indexes on user_id and created_at

### Frontend (voidexa)
- lib/supabase-admin.ts: service-role client for server-side API routes
- Wallet API: GET /api/wallet (balance), POST /api/wallet/topup (Stripe Checkout), POST /api/wallet/deduct, POST /api/wallet/webhook
- WalletBar component: balance display + $5/$10/$25/$50 top-up modal via Stripe
- Pre-session balance check: blocks session if insufficient, shows "Top Up Now" prompt
- Admin/tester exemption: ceo@voidexa.com and tom@voidexa.com skip wallet checks
- Auto-deduct customer price from wallet on session_complete
- Chat history: sessions saved to quantum_sessions on start, updated on complete (messages, synthesis, cost, tokens, providers, duration)
- ChatHistorySidebar: left sidebar with session list, click to load old session (read-only), "New Debate" button
- SessionBar fix: status/timer/price now stacked vertically (no text overlap), min-width 240px
- Admin stats: GET /api/admin/stats — wallet totals, sessions, profit, top users, recent sessions

### Manual steps needed
- Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to Vercel env variables
- Create Stripe webhook pointing to https://voidexa.com/api/wallet/webhook (event: checkout.session.completed)
- Optionally add STRIPE_WALLET_WEBHOOK_SECRET if using a separate webhook from the subscription one

## Session 2026-04-12: Quantum Follow-up Upgrade
### Frontend (voidexa)
- QuantumDebatePanel: added `followUpMode` state ('claude_only' | 'all_providers' | 'challenge' | 'scaffold')
- FollowUpToggles pill-buttons below follow-up input: "All Providers", "Challenge", "Scaffold"
  - Inactive = outline only, Active = glowing purple/indigo gradient
  - Hover shows tooltip popup (280px, 14px text, dark glass)
  - Challenge/Scaffold auto-enable All Providers, mutually exclusive
  - Toggling All Providers off resets to claude_only
- Follow-up submission routing:
  - claude_only (default): existing askFollowUp API (+$0.005)
  - all_providers/challenge/scaffold: composes context block from previous synthesis + optional challenge/scaffold prefix + user's q, then calls handleSubmit to start a new full debate (costs same as new session)
- Challenge prefix: "The user challenges your previous conclusions. Re-examine... Perplexity: search for sources that CONTRADICT..."
- Scaffold prefix: generates CLAUDE.md + SKILL.md + file structure + build command, provider-specialized (Claude=architecture, GPT=spec, Gemini=alternatives, Perplexity=libraries)
- Submit button label + placeholder adapt to active mode; cost label switches between "+$0.005 per follow-up" and "Costs same as a new session"
- Follow-up mode resets to claude_only on new debate

## Session 2026-04-12 (2): Scaffold Mode Standalone
- Moved "Scaffold" toggle out of follow-up toggles into QuantumInput (always visible next to mode dropdown)
- QuantumInput: added `scaffoldMode` + `onScaffoldToggle` props, placeholder switches to "Describe what you want to build...", submit button becomes "Build Scaffold" when active
- QuantumDebatePanel: `scaffoldMode` state, wraps question with SCAFFOLD_PREFIX on submit, resets after submit
- Follow-up toggles now only "All Providers" and "Challenge" (scaffold removed — it's a pre-question mode, not follow-up)

## Session 2026-04-12 (3): Scaffold Downloads
- QuantumDebatePanel tracks `sessionWasScaffold` when scaffold-mode submit fires
- After synthesis renders, shows a `ScaffoldDownloads` card (glassmorphism, indigo/teal gradient) with buttons:
  - Download CLAUDE.md, Download SKILL.md, Download Build Command (shown only when section is detected)
  - Download Complete Scaffold (always, primary button)
- Parser `extractScaffoldSection` finds markdown/bare headings for CLAUDE.md / SKILL.md / Build Command and slices up to the next major heading (#, or sibling labels like SKILL.md/Build Command/File Structure)
- Downloads via Blob + createObjectURL, no server round-trip
- Fallback message if no sections detected — user still gets full scaffold

## Session 2026-04-13: Stripe Wallet Top-Up Recovery
### Problem
- Wallet top-ups completed in Stripe but balance stayed at $0 — webhook was not crediting
- Earlier Stripe checkout errors: `ERR_INVALID_CHAR` on Authorization header, then `success_url` "Not a valid URL"
- Vercel env vars had trailing `\n` / `\r\n` on multiple values (`NEXT_PUBLIC_SITE_URL`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_ID_PRO`) from paste artifacts

### Root Cause
- `STRIPE_WEBHOOK_SECRET` in Vercel production was set to the value of `STRIPE_SECRET_KEY` (`sk_test_...`) instead of a `whsec_...` signing secret → every Stripe delivery failed signature verification with 400, Stripe marked event as pending indefinitely

### Defensive code fix — `.trim()` on all Stripe/site env reads
- `lib/stripe/client.ts:8` — `STRIPE_SECRET_KEY`
- `app/api/wallet/topup/route.ts:26` — `NEXT_PUBLIC_SITE_URL` (extracted into `siteUrl` const)
- `app/api/wallet/webhook/route.ts:21` — `STRIPE_WALLET_WEBHOOK_SECRET || STRIPE_WEBHOOK_SECRET`
- `app/api/stripe/webhook/route.ts:25` — `STRIPE_WEBHOOK_SECRET`
- `app/api/stripe/checkout/route.ts:27` — `NEXT_PUBLIC_SITE_URL`
- `config/pricing.ts:11` — `STRIPE_PRICE_ID_PRO`

### Infrastructure fix
- Created new Stripe webhook endpoint `we_1TLluLDVfBjAC4z8878uAbqXl` → URL `https://voidexa.com/api/wallet/webhook`, event `checkout.session.completed`
- Captured new signing secret (`whsec_hR4n...`, 38 chars) and replaced `STRIPE_WEBHOOK_SECRET` in Vercel production via `vercel env rm` + `vercel env add`
- Deleted old broken endpoint `we_1TLjO2DVfBjAC4z8MFCdFtqh`
- Redeployed with `npx vercel --prod`

### Missed top-up recovery
- User `fc0f1632-9724-42c8-a31d-d05a466e7588` had a successful $5 Stripe test payment (session `cs_test_a1M4WKJM78QstRIlLm1ktnbWIpMLqFDmHgAFAappFZYD0ji3y1JnfR2bs9`) but wallet = $0
- Credited directly via Supabase SQL: `balance_usd` and `total_deposited_usd` += $5, inserted `wallet_transactions` row with the `stripe_session_id` for idempotency (prevents double-credit if Stripe replays)

### Debugging workflow reference
- `npx vercel logs voidexa.com --environment production --since 4h --expand --no-follow --query "path"` — filtered prod logs
- `npx vercel logs ... --status-code 400` — find 4xx only (must be specific code, not `4xx`)
- `npx vercel env pull .env.prod-check --environment=production --yes` — inspect prod env values for hidden chars (delete file after!)
- Direct Stripe API for webhook management: `curl -u $STRIPE_SECRET_KEY: https://api.stripe.com/v1/webhook_endpoints` (list/create/delete)
- Stripe API doesn't expose existing webhook signing secrets — only returned on endpoint creation. To "rotate": delete + recreate.
# ============================================
# APPEND THIS TO THE BOTTOM OF YOUR EXISTING CLAUDE.md
# in C:\Users\Jixwu\Desktop\voidexa\CLAUDE.md
# ============================================

---

## Star System Ecosystem

### Required reading before any star system work
Read these files before touching anything related to star map, planets, claiming, ecosystem, or inter-planet features:
- `docs/STAR_SYSTEM_SPEC.md` — Complete ecosystem design (visual + economic + data model + build phases)
- `docs/SKILL_STAR_SYSTEM.md` — Build rules and priorities for star system work

### Key architecture decisions
- The EXISTING star map on the homepage is Level 2 for voidexa (voidexa's internal system)
- Level 1 (Galaxy View) is a NEW parent view showing all company planets
- Level 2 is reusable per company — same Three.js mechanics, different data
- All commerce in GHAI — no second token
- Service Mesh is voluntary for planet owners
- Build everything, enable features based on planet count thresholds (see STAR_SYSTEM_SPEC.md Phase 5-10)
- Claim Your Planet page at /claim-your-planet explains the full ecosystem value proposition

### Supabase tables for star system
Tables defined in STAR_SYSTEM_SPEC.md Part 3: companies, industries, sectors, company_services, trade_routes, gravity_score_snapshots, gravity_events, planet_claim_leads, company_tags.

### Non-negotiable rules
1. Never show 500 labeled planets at once
2. Current star map is preserved as Level 2 for voidexa
3. Mobile prioritizes search/list over 3D
4. First 10 planets onboarded personally by Jix
5. Match existing dark space aesthetic exactly
6. Minimum font 16px body, 14px labels

## Session 2026-04-13 (2): Claim Your Planet rebuild (full ecosystem)
### Frontend (voidexa)
- Split /claim-your-planet into 11 section components in app/claim-your-planet/components/
  - Hero, WhatYouGet, Ecosystem, PioneerRewards, PioneerSlots, Pricing, GravityScore, InterPlanetCommerce, Governance, WhyJoinEarly, CTA
- shared.tsx (fadeUp, ShimmerText, sectionHeading/Sub, glassCard) used across sections
- Hero copy: "You're not renting a page. You're building a sovereign system inside the voidexa galaxy."
- PioneerRewards: tiered cards (1-10: 10M/2x/12mo, 11-25: 7M/1.5x/6mo, 26-50: 5M/1x/3mo) + vesting (20% immediate, 80% over 18 months) + 2% Pioneer Royalties
- PioneerSlots: 10 dashed circles, "X of 10 Pioneer slots remaining"
- Pricing: $500 deposit (GHAI 15% discount) + $50/mo, self-sustaining at critical mass
- GravityScore: what it measures (transactions/services/tenure) vs affects (size/ranking/governance)
- InterPlanetCommerce: 70/15/15 split cards (provider / routing / voidexa)
- Governance: vote weight = Gravity Score × Pioneer multiplier
- WhyJoinEarly: 4 FOMO points, "Planet #50 will wish they were Planet #5"
- CTA: mailto:contact@voidexa.com, 10 Pioneer Slots badge
- Deployed via npx vercel --prod (dpl_Fr9Br2pYfx3KNArtuEQsdHXyT3cJ)
# ============================================
# STAR SYSTEM — APPEND TO EXISTING CLAUDE.md
# File: C:\Users\Jixwu\Desktop\voidexa\CLAUDE.md
# ============================================

---

## Star System + Free Flight Ecosystem

### Master Plan
The complete plan is in `docs/VOIDEXA_STAR_SYSTEM_COMPLETE_PLAN_v1.2_FINAL.md`.
READ THIS FILE BEFORE ANY STAR SYSTEM WORK. It contains all decisions, specs, and rules.

### Architecture Overview
The star system has three navigation levels plus a game mode:
- Level 1: Galaxy View (new) — all company planets, zoom reveal, constellation grouping
- Level 2: Company System — existing star map, upgraded with premium effects. IS Level 2 for voidexa
- Level 3: Page Surface — existing, click planet → land on page
- Free Flight: same 3D scene as Level 1/2, different controls (WASD ship instead of orbit)

The EXISTING star map code in `components/starmap/` is preserved and becomes Level 2.
Level 1 wraps around it. Free Flight reuses the same scene with different camera/controls.

### Required Reading Before Any Work
- `docs/VOIDEXA_STAR_SYSTEM_COMPLETE_PLAN_v1.2_FINAL.md` — complete spec
- `docs/SKILL_STAR_SYSTEM_PHASE1-3.md` — build instructions for phases 1-3

### Tech Stack for Star System
- React Three Fiber (`@react-three/fiber`)
- `@react-three/postprocessing` for bloom, chromatic aberration, vignette
- `@react-three/drei` for helpers (Stars, Float, etc.)
- GSAP for warp transitions and camera animations
- Three.js custom shaders for nebula, star twinkle, energy tendrils
- Draco-compressed .glb models for ships (loaded via useGLTF)
- Supabase for player data, chat, achievements, cards, wagers
- Supabase Realtime for Universe Chat and multiplayer sync

### Existing Files — DO NOT DELETE
```
components/starmap/
├── nodes.ts              — node positions/colors — MODIFY for premium
├── CSSStarfield.tsx      — CSS stars fallback — KEEP
├── MiniNav.tsx           — compact nav — KEEP
├── NodeMesh.tsx          — R3F sphere nodes — HEAVY MODIFICATION
├── StarMapScene.tsx      — full R3F scene — HEAVY MODIFICATION
├── StarMapCanvas.tsx     — Canvas wrapper — MODIFY (add postprocessing)
└── StarMapPage.tsx       — progressive loader — KEEP
```

### New Directory Structure
```
components/starmap/           — Level 2 (existing, upgraded)
components/galaxy/            — Level 1 (new galaxy view)
components/freeflight/        — Free Flight mode
  ├── cockpit/                — first person cockpit HUD
  ├── controls/               — WASD ship controls
  ├── ships/                  — ship models, LOD, skins
  ├── environment/            — asteroids, nebula, stations, NPCs
  └── combat/                 — PvP, races, card system (later phases)
components/chat/              — Universe Chat
components/shop/              — Ship/card shop
public/models/                — .glb ship models (Draco compressed)
public/models/cockpits/       — cockpit models
public/models/stations/       — station models
lib/game/                     — game logic (not React)
  ├── physics.ts              — collision detection (distance checks)
  ├── alientech.ts            — alien tech spawn/use/backfire
  ├── cards.ts                — card system logic
  ├── ranks.ts                — rank/matchmaking
  └── npcs.ts                 — NPC behavior/routes
```

### Non-Negotiable Rules
1. NEVER delete existing star map code — modify and extend
2. Current star map = Level 2 for voidexa. Do not change this relationship
3. Minimum font: 16px body, 14px labels, opacity minimum 0.5
4. Ship models load via useGLTF with Draco compression
5. Free Flight layer 2 content (asteroids, NPCs) loads ONLY in Free Flight mode
6. Cockpit model loads ONLY in Free Flight mode
7. Post-processing: use half-res for bloom, mipmapBlur, multisampling={0}
8. Mobile: disable post-processing, use search/list nav, no Free Flight
9. All shop payments via Stripe USD — NO GHAI until explicitly told otherwise
10. No pay-to-win: shop = cosmetics only, gameplay = stats only
11. Achievement ships are soulbound — never transferable
12. Test after every change. Git backup before major modifications
13. Match existing dark space aesthetic exactly
14. Performance: max 5000 particles, instanced mesh for asteroids/NPCs, LOD for ships

## Session 2026-04-14: 3D Asset Library Organized (Pre-Phase-1)
### Files on disk (public/models/, gitignored — not in repo)
Downloaded zips unpacked into the canonical layout:
```
public/models/
├── ASSET_INVENTORY.md          (tracked)
├── ships/paid/usc/             956 files, 1.44 GB  (USC FBX)
├── ships/paid/usc-expansion/   172 files, 175 MB   (USC Expansion FBX)
├── ships/paid/hirez/          1308 files, 2.14 GB  (HiRez OBJ)
├── ships/free/quaternius-spaceships/      129 files, 295 MB
├── ships/free/quaternius-space-kit/       467 files, 143 MB
├── ships/free/quaternius-modular-scifi/   366 files,  53 MB
├── ships/free/sketchfab/      103 files across 10 packs, 199 MB
├── cockpits/                    62 files, 107 MB
└── stations/                    43 files,  34 MB
```
**Grand total:** 3,606 files, 4.48 GB.

### Repo changes (tracked)
- `public/models/ASSET_INVENTORY.md` — authoritative record of expected on-disk contents
- `.gitignore` — added `public/models/ships/`, `public/models/cockpits/`, `public/models/stations/` with `!ASSET_INVENTORY.md` negation
- `.claude/skills/3d-asset-pipeline/SKILL.md` — folder convention, LOD tiers, conversion workflow, license table, add-new-pack checklist
- `.claude/skills/3d-asset-pipeline/regenerate-inventory.ps1` — idempotent inventory rebuild script
- Commits: `517feae` backup, `9fb33fd docs: 3D asset inventory`

### Conventions (see 3d-asset-pipeline skill for full detail)
- Source packs live in their vendor-named folder under `ships/paid/*` or `ships/free/*`
- Runtime-loadable Draco `.glb` files go in a `converted/` subfolder inside each pack
- Never commit binary assets. Never delete original zips in `Downloads/`
- LOD mandatory for ship models: `_high` (<100m), `_med` (100-500m), `_low` (>500m billboard)
- Sketchfab packs: one subfolder per pack (slug from zip name), license file preserved

### Gotchas discovered
- Cowork mount cannot unlink files — git operations leave stale `.git/*.lock`. Prefer native PowerShell git on this repo.
- Task spec had `sci_fi_spaceship_cockpit_02.zip` (underscores); real file is `sci-fi_spaceship_cockpit_02.zip` (dash). Always verify with `Get-ChildItem`.
- USC/HiRez packs include Adobe Fuse `.fuse_hidden*` tempfiles — counted in totals but excluded from Formats in inventory.
- Two Quaternius Spaceships bundles arrived (different server timestamps, identical contents) — extract either.

### Next (when starting Phase 1 build)
Per Phase 1-3 spec: pick 1 fighter / 1 cruiser / 1 battleship from `ships/free/quaternius-spaceships/`, 1 free cockpit from `cockpits/`, and either modular station parts from `stations/` or procedural geometry. Convert to Draco `.glb`, place in `converted/`, regenerate inventory, commit.

## Session 2026-04-14 (2): Star Map Phase 1 gap-fill
Steps 1.1–1.4 were already in place (postprocessing, emissive nodes, nebula, star twinkle). Gap-filled 1.5–1.7.

### Frontend (components/starmap/)
- `WarpStreaks.tsx` (new) — 700 line segments anchored to camera via group.position/quaternion copy, stretch length driven by lerped strength float. Additive blending, `toneMapped={false}`.
- `NodeMesh.tsx` — replaced manual useFrame lerp with GSAP timeline: camera.position tween + parallel FOV tween 60→92 (`power3.in`, 1.0s). `router.push(path)` fires at 75% progress. `persp.updateProjectionMatrix()` in onUpdate. `gsap.killTweensOf()` guards re-click. `warpRef.active` still drives emissive/glow fade in useFrame.
- `nodes.ts` — added `PlanetType` discriminated union (sun/desert/ocean/ice/jungle/gas/volcanic/tech/mystery/station) and assigned per node.
- `NodeMesh.tsx` — per-type atmosphere shell: `ATMOSPHERE_BY_TYPE` map (scale 1.5–2.0, opacity 0.08–0.26), additive BackSide sphere outside the existing glowRef halo. Breathing opacity via sin(t*0.8). Skipped for `station` type (uses HTML image).
- `CameraRig.tsx` (new) — mouse parallax (camera-local right/up axes, ±0.35/0.22) + hover dolly (toward hovered node, 0.15–0.55 forward). Subtracts prev frame's offset before applying new → no drift, OrbitControls stays authoritative. Disabled during warp.
- `StarMapScene.tsx` — lifted `hoveredId` state, threads `onHoverChange` to every NodeMesh, mounts `<WarpStreaks active={warping} />` and `<CameraRig hoveredId={...} disabled={warping} />`.

### Verification
- `npx next build` clean (only pre-existing non-fatal bigint warning)
- No new dependencies — `gsap` and `postprocessing` already installed; `three-custom-shader-material` avoided by using plain shell geometry for atmosphere
- `public/models/` untouched per instruction

### Commits
- `7841bc9` backup before phase 1 gap-fill
- `987c40b` feat(starmap): phase 1 gap-fill — GSAP warp, atmosphere shells, camera rig

### Note
Backup commit `7841bc9` also landed 7 pre-existing untracked `.glb` files in `public/models/glb-ready/` (that path is not gitignored, unlike `ships/`/`cockpits/`/`stations/`). Left alone; if you want them untracked, add `public/models/glb-ready/**` to `.gitignore` (keep `!README.md` negation for the one tracked doc there).

## Session 2026-04-15: Star System Phase 2 — Level 1 Galaxy View
Added a new parent view at `/starmap` that wraps the existing (Level 2) star map per spec. Existing home at `/` and `components/starmap/` untouched.

### New files (`components/galaxy/`)
- `companies.ts` — `CompanyPlanet` + `Industry` types, `GALAXY_PLANETS` array (voidexa sun + claim-your-planet mystery), `INDUSTRY_META` palette. Shape ready for Supabase `companies` rows.
- `CompanyPlanet.tsx` — single planet mesh with distance-based LOD (far >45: dot only / med 22–45: shape + atmosphere + label fade / close <22: sublabel visible). Reuses the same GSAP warp pattern as `NodeMesh.tsx` (FOV 60→92, router.push at 75% progress). `highlightedId` prop boosts emissive when sidebar hover/search matches.
- `Constellations.tsx` — pairs all planets sharing an industry (excluding sun/mystery) into dashed lines. Renders nothing at v1 (only one real planet) but the data path is live.
- `GalaxyScene.tsx` — own starfield (radius 55–70), reuses `NebulaBg` + `WarpStreaks` from starmap. OrbitControls minDistance 8 / maxDistance 70 (wider than Level 2 to allow the far LOD tier to trigger). Target `[0,0,0]`.
- `GalaxyCanvas.tsx` — same post-processing stack as `StarMapCanvas` (Bloom 0.9/1.8 mipmapBlur, ChromaticAberration, Noise overlay, Vignette). Includes `FocusController` that GSAP-tweens the camera toward a `focusTarget` (used by sidebar click-to-warp; desired dist = clamp(12, currentDist*0.6, 30)).
- `GalaxyPage.tsx` — top shell: dynamic-imports canvas (ssr:false), mounts `DirectorySidebar`, "Galaxy View · Level 1" top badge, UPPERCASE hint, "← Home" button top-right (routes to `/`).
- `DirectorySidebar.tsx` — collapsible left panel (300px open / 44px collapsed, backdrop-blur 14px). Search input triggers `onHighlight` on the first match as user types. List sorted sun-first then alphabetical. Each row shows emissive dot, name, industry label. Click → `onWarpTo` → `FocusController` tween.

### Routes
- `app/starmap/page.tsx` — imports `GalaxyPage` (static).
- `app/starmap/voidexa/page.tsx` — wraps `StarMapPage` as a client component, overlays "← Back to Galaxy" button top-left (zIndex 60 to sit above `MiniNav`/KCP panel).

### Verification
- `npx next build` clean — `/starmap` and `/starmap/voidexa` both prerendered static (○). Only pre-existing bigint bindings warning.
- No new dependencies (uses already-installed `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `gsap`, `three`).
- `public/models/` untouched per instruction.
- Existing `/` (home star map) and `components/starmap/` untouched — preserved as Level 2.

### Commits + deploy
- `bfdc001` backup before phase 2 galaxy view build (empty)
- `6488220` feat(galaxy): phase 2 Level 1 galaxy view
- Pushed `main:master`
- Vercel: `dpl_EQ9zHNCt7n9Qgd4BURdCqyRtnKAu` → https://voidexa.com/starmap (ready)

### Notes / next steps
- The root `/` still renders the Level 2 star map directly — `/starmap/voidexa` is the canonical Level 2 route per spec, but the old home entry wasn't changed. If you want `/` to redirect to `/starmap`, it's a one-line change in `app/page.tsx`.
- Constellation edges only render when ≥2 planets share an industry. First real company added via Supabase will trigger them once `GALAXY_PLANETS` becomes data-driven.
- Level 2 already warps to a page (e.g. `/quantum`) when you click a node — for a fully consistent three-level nav, future work should intercept those and route them under `/starmap/voidexa/<slug>` instead of leaving the star map entirely.

## Session 2026-04-15 (2): Phase 3 Free Flight + galaxy fixes + test runner fix
### Test runner (Windows)
- `npm test` failed: `vitest` not on PATH + `npm` bug missing optional dep `@rollup/rollup-win32-x64-msvc`
- `package.json` scripts → `node node_modules/vitest/vitest.mjs run` (absolute entry, works regardless of PATH)
- Added `@rollup/rollup-win32-x64-msvc` to `optionalDependencies` so the Rollup native binding is installed on Windows
- `lib/shop/items.ts` had `export { CardRarity as ShopRarity }` + `export type ShopRarity = CardRarity` which TS flagged as conflicting declarations. Replaced with `export type ShopRarity = CardRarity; export const ShopRarity = CardRarity;` (type+value alias pattern)
- After fix: `npm test` → 140/142 pass. The 2 failures are in `lib/cards/__tests__/deck.test.ts` (untracked, pre-existing; not part of `lib/game/` which still has 77/77 green)

### Galaxy view fixes (existing Phase 2 code)
- `app/starmap/voidexa/page.tsx` — Back-to-Galaxy button moved from `top:18` to `top:80` so it no longer covers the `VX voidexa` logo in `MiniNav`
- `components/galaxy/GalaxyPage.tsx` — `handleWarpTo` now also `router.push(planet.path)` after a 650ms focus-tween delay, so sidebar click on "Claim Your Planet" routes to `/claim-your-planet` (previously it only camera-focused)
- `components/starmap/MiniNav.tsx` — added `{ href: '/starmap', label: 'Galaxy' }` as the first nav link on the homepage, giving a persistent entry point to Level 1

### Phase 3 Free Flight (`/freeflight`)
New directory `components/freeflight/` — game scene reuses the same R3F + postprocessing stack:
- `types.ts` — `ShipState` (position/quaternion/velocity/speed/boost/brake/health/shield/firstPerson/shake), `PLANETS` (voidexa hub + alpha/beta/gamma/delta), `STATIONS` (3 docks)
- `ships/ShipModel.tsx` — `useGLTF('/models/glb-ready/qs_bob.glb')` (preloaded), forwardRef group, engine glow point light + emissive sphere at rear, LOD scale lookup per frame (full <100m / 0.7× 100-500m / 0.3× billboard-ish >500m)
- `controls/FlightControls.tsx` — keyboard refs (WASD thrust, Q/E or Ctrl/RShift vertical, Shift boost, Space brake). Mouse yaw/pitch via pointer lock (clamped ±π/2.1). Momentum: accel 30 u/s² (×2 boost), drift damp 0.992, max 60 u/s (120 boost). Writes `shipGroup.position/quaternion` each frame from `ShipState`
- `controls/CameraManager.tsx` — V key toggles `firstPerson`. Offset lerps (rate 8) between `(0, 0.4, -0.2)` FPV and `(0, 2, 8)` chase. Camera shake when `shakeUntil > now` — random jitter ×`shakeStrength`. Always `lookAt` 10 units forward along ship quaternion
- `cockpit/CockpitHUD.tsx` — HTML overlay (not R3F Hud — kept simple). Crosshair center; bottom-left speed panel w/ velocity bar + BOOST/BRAKE pips; bottom-right Hull+Shield bars (`#66ff99` / `#00d4ff`); top-right nearest-planet readout; top-left mode/keys hints. Cyan `textShadow` + `boxShadow` glow matches voidexa palette. Re-renders 12.5× per second via `setInterval`
- `environment/AsteroidField.tsx` — 260 `IcosahedronGeometry` instances with per-vertex sin/cos noise (seeded rng), rotated each frame via setMatrixAt. Collision: every frame builds `Obstacle[]` from the seed data and calls `checkCollision` from `lib/game/physics.ts` with ship radius 1.5. On hit: 400ms shake, `velocity.multiplyScalar(-0.3)`, shield -5, 500ms cooldown
- `environment/SpaceStation.tsx` — 3 procedural stations (cylinder body + torus ring rotating + antenna + `#00d4ff` beacon point light pulsing). Per-frame distance check vs `STATIONS[].dockRadius` emits `onDockPromptChange(name)` when crossing threshold
- `environment/NPCManager.tsx` — 8 `ConeGeometry` instances. Route built with `generatePatrolRoute` from `lib/game/npcs.ts` (waypoints 3, spread 40, seeded rng) between consecutive stations. Each tick moves along forward vector at `NPC_DEFS[Patrol].speed * 0.3` (18 u/s), advances waypoint when within 2u. Cones orient by `setFromUnitVectors(up, forward)`
- `FreeFlightScene.tsx` — composes ambient+directional light, drei `<Stars>` (3500 count, radius 1200), planet spheres with emissive + atmosphere shell, ShipModel (hidden in FPV), FlightControls, CameraManager, AsteroidField, SpaceStations, NPCManager. Ship ref is hoisted via `onShipState` callback
- `FreeFlightCanvas.tsx` — Canvas wrapper with Bloom (0.25 thresh, 1.2 intensity, mipmapBlur) + Vignette
- `FreeFlightPage.tsx` — fullscreen layout. ESC toggles menu + exits pointer lock. E while `dockPrompt` set opens menu ("Docked · X"). Menu buttons: Resume, Return to Galaxy (→ `/starmap`). Chase-cam help overlay (bottom-left) shown when not FPV. "Free Flight" pill top-center also opens menu.

### Entry points
- `app/freeflight/page.tsx` thin wrapper around `FreeFlightPage`
- `components/galaxy/GalaxyPage.tsx` — "Explore the Universe" CTA pill (bottom 80, centered, cyan/purple gradient) routes to `/freeflight`
- Layer 2 (asteroids, NPCs, stations) exists only inside `/freeflight` — Galaxy View and Level 2 star map don't import `components/freeflight/*`

### Verify
- `npx next build` clean — `/freeflight` prerenders static (○)
- Existing routes untouched in behavior (homepage, /starmap, /starmap/voidexa)
- `public/models/` not modified; only reads `qs_bob.glb` at runtime via `useGLTF`

### Commits + deploy
- `af5af71` backup before phase 3 free flight build
- `780c35b` feat: phase 3 Free Flight + galaxy fixes + test runner fix
- Pushed `main:master`
- Vercel production → https://voidexa.com/freeflight (aliased live)

### Gotchas
- R3F `useRef<THREE.Group>(null)` is nullable under React 19 strict types — `ref.current` must be guarded in `useFrame` (ShipModel LOD block). `ref.current.position` with `ref` typed as `MutableRefObject<Group>` forces `forwardRef` to accept nullable.
- `lib/shop/items.ts` TS duplicate export: `export { X as Y }` alongside `export type Y` emits 2300. The `type Y = X; const Y = X` idiom keeps both namespaces consistent.
- The "click to lock mouse" flow means the pointer lock drops when ESC menu opens. Users must click the canvas again after Resume.


## Session 2026-04-15 (continued): Phases 4–9 + asset library + UIs

### Phase 4–9 data foundations — all complete (lib/*)
- `lib/shop/` — items + rotation + 7 categories + PRICE_BANDS (v2 rarity-aligned: $0.50→$12)
- `lib/cards/` — deck management, collection (disenchant/craft/fuse), 40-card Core Set
- `lib/chat/` — types, command parser, moderation (rate limit + spam + banned words), formatting (rank colors)
- `lib/achievements/` — 23 achievements + 23 title fragments + tracker + composeTitle
- `lib/race/` — 5 fixed tracks + daily random + 9 power-ups (rubber-banding) + scoring + 8/16 tournament brackets
- `lib/missions/` — 12 missions (3 timed + 3 exploration + 1 daily + 5 story chain → "Chronicler of the Void" title)
- **Test suite:** 342 vitest cases passing across 29 suites (`npm run test`)

### Phase 8 deployed (Free Flight content)
- Stations, nebula zones, derelict ships, warp gates rendered in `/freeflight`

### UI components built
- `components/chat/UniverseChat.tsx` — floating bubble + 3-tab panel + Free Flight overlay (10s fade)
- Shop UI deployed at `/shop`, Achievement UI at `/achievements`

### 3D asset library — 689 .glb files, 6.8 GB
- All paid models (USC 347 + USCX 58 + Hi-Rez 88 = 493) carry PBR textures
- All Quaternius packs (qsk 92 + qmsf 91 + qs 11) use baseColorFactor material colors (no PNG)
- Pipeline: fbx2gltf + obj2gltf + @gltf-transform + gltf-pipeline Draco level 7
- Documented in `public/models/TEXTURE_FIX_GUIDE.md`

### Preview renders — 59 PNGs at 512x512
- `public/images/renders/` with subfolders: legendary, epic, soulbound, weapons, cockpits, rare, uncommon, starter, cockpit-interiors
- Pipeline: puppeteer + headless Chromium + Three.js r158 (swiftshader WebGL)
- Index at `public/images/renders/INDEX.md`

### Catalog & economy
- `docs/SHIP_CATALOG.md` — every glb categorized: 320 Uncommon, 85 Rare, 19 Epic, 5 Legendary, 5 Soulbound (per master plan Part 3)
- `docs/CARD_ART_MAPPING.md` — 40 cards mapped to 25 distinct 3D assets + 6 procedural fallbacks
- `docs/VOIDEXA_FIX_LIST_AND_REMAINING_WORK.md` — open punch list
- `docs/VOIDEXA_PLANET_OWNER_ECOSYSTEM_v2.md` — 3 participation tiers, task board, 30/23/15/12% revenue split
- `docs/VOIDEXA_SHIP_CATALOG_AND_ECONOMY.md` — economy model with PvP Legendary Purchase Token system (underdog discount)

### Skills + agents added
- `.claude/skills/card-combat/SKILL.md` — Phase 11 turn-based combat spec (with frontmatter)
- `.claude/skills/game-agents/` — 6 voidexa-adapted consultants (economy, combat, systems, level, qa, ux) extracted from CCGS upstream + README
- `docs/templates/` — economy-model.md, balance-sheet.md, gdd.md (voidexa-defaults pre-filled)

### External
- voidexa.dk domain purchased (74 kr) — Danish landing page TBD
- Nav bar consolidation + SEO + shop redesign in progress (Claude Code session)

### Next priorities (in order)
1. Nav bar + shop redesign (Claude Code is building)
2. Card combat system (Phase 11) — use `.claude/skills/card-combat/SKILL.md`
3. Boost trail particle system (Free Flight polish)
4. Danish landing page on voidexa.dk
5. Supabase tables for player data (decks, collections, ranks, stats)

### Gotchas worth remembering
- **Mount + git:** `.git/*.lock` files can't be unlinked through the cowork mount. Run `Get-ChildItem .git -Recurse -Filter "*.lock" -Force | Remove-Item -Force` natively before any git op.
- **Mount + streaming writes:** `gltf-pipeline`, `obj2gltf`, `fbx2gltf`, Next.js `next build` all write through stream APIs that the mount drops to 0 bytes. Pipeline always works in `/tmp` then `cp` to mount — `cp` is fine.
- **Headless Chromium + WebGL:** needs `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist --enable-webgl`. Without these flags `getContext('webgl')` returns null even on the latest puppeteer-bundled Chromium.
- **`lib/shop/items.ts` type+const alias pattern is intentional** — `export type ShopRarity = CardRarity; export const ShopRarity = CardRarity;`. Don't revert to `export { CardRarity as ShopRarity }` (TS 2300 conflict).

## Session 2026-04-16: Sprint 5 shipped — wrecks, hauling catalog, verification, font audit

### Commits + deploy
- Task 1 — Wreck system (earlier in session chain)
- `ec2ce29` feat(sprint5): hauling trade goods catalog + dynamic daily contracts
- `41bfe9c` feat(sprint5): gameplay verification scaffolding + integration tests
- `fbc8ca6` feat(sprint5): font + opacity audit — 12 legacy fixes
- Deploy: `dpl_9M1VJY73mq1NBT8BnduS1K3kchyC` → https://voidexa.com (READY, 200 OK on /, /game/hauling, /starmap/voidexa)

### Task 1 — Wreck system
- `lib/game/wrecks/{types,economics}.ts` + 14 unit tests
- `components/wrecks/{ShipDownModal,ClaimModal}.tsx`, `components/freeflight/environment/Wrecks.tsx`, `components/freeflight/useWrecks.ts`
- `app/api/wrecks/{spawn,claim}/route.ts` — atomic claim with insurance payout
- Timer tiers per V3 PART 7 (Low Risk 15/60m, High Risk 5/25m), class-based 70%-off claim economics
- Wired into `FreeFlightPage.tsx` with ship-down detection + 4 recovery paths (self-repair / tow / abandon / buy new)

### Task 2 — Hauling trade goods + dynamic contracts
- `lib/game/hauling/tradeGoods.{json,ts}` — 30 goods from VOIDEXA_UNIVERSE_CONTENT.md Section 7
- `lib/game/hauling/generateContract.ts` — deterministic `generateDailyContracts(seed, count=8)` + `distanceMultiplier` (same 1.0x / adjacent 1.5x / cross 2.2x / Deep Void 3.0x) + `riskMultiplier` (Contested 1.3x, Wreck Risk 1.6x)
- `HaulingHub.tsx` gained tab bar: **Legacy Routes** (6 original) + **Dynamic Routes** (today's 8 generated). Tab hint shows UTC date seed.
- Widened `RiskLevel` to `Safe|Low|Medium|Timed|Ranked|Contested|Wreck Risk` so generator output + tests are typesafe; `riskToDb` maps new values to existing DB enum.
- 18 new tests in `lib/game/hauling/__tests__/generateContract.test.ts`

### Task 3 — Gameplay verification + integration tests
- Extracted hauling grade into `lib/game/hauling/delivery.ts` (`deliveryGrade(outcome, integrity)`, `deliveryBaseReward(...)`). `DeliveryResults.tsx` now consumes those helpers — single source of truth.
- `lib/debug/gameplayLog.ts` — `gplog(area, ...args)` gated by `.trim()`'d `NEXT_PUBLIC_DEBUG_GAMEPLAY === 'true'`. Zero prod cost.
- `lib/game/__tests__/integration.test.ts` — 20 cross-mode tests pinning speed-run grade matrix, hauling delivery grades, encounter distribution, route gen, dynamic contracts, wreck economics.
- `docs/SPRINT5_VERIFICATION.md` — manual run-through checklist for every mode's golden path + fragile-area watchlist.

### Task 4 — Font + opacity audit
- `docs/FONT_OPACITY_AUDIT.md` — grep-based sweep of `app/**` + `components/**`
- Fixed 12 user-facing violations:
  - `components/home/HomePage.tsx`, `HomeDenmark.tsx`, `HomeFooter.tsx` (×2), `HomeProducts.tsx` (×2): 13 → 14 labels
  - `app/ship-catalog/page.tsx` (×4): 12 → 14 status copy + meta row
  - `app/starmap/voidexa/page.tsx`: 12 → 14 Back-to-Galaxy footer
  - `app/claim-your-planet/components/PioneerRewards.tsx`: 13 → 14 disclaimer
- Deferred: `app/assembly-editor/**` (50) + `app/admin/ship-tagger/**` (5) — internal dev tools, not in scope.
- Accepted decorative: status pills (11), CDN pips (11), monospace filenames (12), event-type chips (12).
- **0 text-opacity violations** — all opacity<0.5 hits are background art / atmosphere shells / CSS keyframes.

### Tests
- Full suite: **599/599 passing** across 49 suites.

### Gotchas
- Vitest uses esbuild transform and does **not** type-check. If `pickRisk` returns `'Low'` when `RiskLevel` didn't include it, tests pass but `npm run build` (via Next.js + tsc) catches it. Fix by widening the type.
- When moving `useEffect` blocks that reference state declared later (e.g. `selectedShip` in `FreeFlightPage.tsx`), the whole block must land after the declaration — "used before declaration" hits at compile time.
- Risk-level UI maps need entries for every `RiskLevel` union member wherever `Record<RiskLevel, …>` appears. Only `RISK_META` in `HaulingHub.tsx` needed updating this sprint.

## Session 2026-04-17: Power Plan — autonomous 8-sprint chain
Master plan: `docs/POWER_PLAN.md`. Per-sprint specs: `docs/skills/sprint-*.md`.

Scan baseline:
- `claude-opus-4-6` occurrences: 5 (Sprint 0 target).
- `docs/gemini_universe_content_complete.json`: 80KB, schema verified (Sprint 6).
- `docs/sounds/`: 67 MP3s + 1 stray .zip (Sprint 7).
- `public/images/shuttle-hero.png`: 2.5MB (Sprint 8).
- `docs/gpt_keywords_homepage.md`: **CORRUPT** (180 bytes UTF-16 PowerShell artifact).
  Sprint 8 falls back to the 4 panel headings supplied in the run prompt.
- Test baseline: 599/599 across 49 suites.

Sprint chain in order: 0 (model ID swap) → 6 (universe import) → 7 (sound system) →
8 (homepage redesign) → 9 (MTG audit) → 11 (mobile audit) → 12 (final polish +
`mvp-launch-ready` tag). Sprint 10 (baseline card art) is owned externally on Vast.ai
— see `docs/skills/sprint-10-baseline-art-handoff.md`.

Global rules: backup tag before each sprint, `npx next build` clean, 599+ tests green,
font 16/14/0.5 minima, all env reads `.trim()`, deploy = `git push origin main` only.

### Sprint completion summary
| # | Tag | Tests | Notes |
|---|---|---|---|
| 0 | `sprint-0-complete` | 599 | 6 files: lib/voidforge/planner.ts, scripts/test-voidforge.ts, .claude/skills × 3, VoidForgePanel UI text |
| 6 | `sprint-6-complete` | 616 (+17) | lib/game/universe/ + 4 edge API routes + UniverseLandmarks component |
| 7 | `sprint-7-complete` | 633 (+17) | 67 sounds renamed, SoundManager + VolumeControl + freeflight wiring |
| 8 | `sprint-8-complete` | 633 | ShuttleHero parallax + ProductPanels (4 panels) — keywords inferred (gpt_keywords MD was corrupt) |
| 9 | `sprint-9-complete` | 642 (+9) | MTG audit doc + 19 keyword definitions (3 net-new: Stalwart/Probe/Reactive) |
| 11 | `sprint-11-complete` | 642 | useIsTouch + DesktopOnlyNotice on /freeflight, /assembly-editor, /admin/ship-tagger |
| 12 | `sprint-12-complete`, `mvp-launch-ready` | 642 | error.tsx + global-error.tsx + not-found.tsx, font/opacity audit refresh, MVP launch checklist |

Final state: 642 tests green, 7 sprint tags + `mvp-launch-ready` pushed, no
build errors, 4 marketing page routes responsive-friendly, 3 desktop-first
surfaces flagged with banner. Items deferred to Jix: live device test,
Lighthouse run, baseline card art (Vast.ai), sound voiceover recording,
public/sounds/ + public/models/ asset upload to CDN.

## Session 2026-04-18: Sprint 13C — Veo MP4 + ElevenLabs voiceover homepage
Replaced the Three.js cinematic film (Sprint 13 / 13b) with the real 31.1s Veo MP4
plus AI voiceover on `/`.

### Assets (Supabase Storage bucket `intro`, public)
- `voidexa_intro_final.mp4` — 33 MB, h264 yuv420p, 31.146s, 2 streams
  (original Veo output was 65 MB 4:4:4; re-encoded with CRF 23 to fit the
  50 MB Supabase standard-upload ceiling)
- `stil_picture_intro.png` — 2.6 MB backdrop for post-video state
- Vercel env vars added (production + preview): `NEXT_PUBLIC_INTRO_VIDEO_URL`,
  `NEXT_PUBLIC_INTRO_BACKDROP_URL`

### Voiceover (ElevenLabs multilingual_v2, stability 0.5, similarity 0.75, style 0.3)
Generated 4 MP3 clips via the ElevenLabs REST API using the Jarvis `.env`
credentials, then stitched them over the Veo ambient track (0.4x volume) with
`adelay=0|7000|22000|28000` and volume 1.2 for each voice line.
- vo_01_welcome.mp3 "Welcome aboard Voidexa Intergalactic Transit." — 2.79s, 45.6 KB
- vo_02_engage.mp3 "Engaging warp drive. Destination: Voidexa Star System." — 3.72s, 60.6 KB
- vo_03_arrive.mp3 "Arriving at Voidexa Star System." — 2.32s, 38.1 KB
- vo_04_welcome_future.mp3 "Welcome to the future of AI." — 1.81s, 30.1 KB

### New components
- `app/page.tsx` (94 lines, `'use client'`) — mounts IntroVideo → backdrop → overlay,
  reads `voidexa_skip_intro` localStorage flag and `router.replace('/starmap')`
  on returning visits
- `components/home/IntroVideo.tsx` (151 lines) — HTML5 `<video autoPlay muted playsInline>`,
  emits onSkipAvailable at `currentTime >= 3`, mute toggle with pulsing glow +
  5s tooltip, forwardRef handle with `jumpToEnd()` for skip button
- `components/home/QuickMenuOverlay.tsx` (180 lines) — 4 glass panels in 2x2 grid
  (1 column mobile <768px), 2 CTAs (Enter Free Flight primary, Enter Star Map
  secondary), "don't show next time" checkbox. 800ms opacity fade-in
- `components/home/WebsiteCreationModal.tsx` (149 lines) — modal with call/email
  buttons + inline form POSTing to `/api/contact/website-lead`. ESC + click-outside
  + close button. Resets state on close
- `lib/intro/panels.ts` — pure data module: QUICK_MENU_PANELS, PRIMARY_CTA,
  SECONDARY_CTA, SKIP_BUTTON_THRESHOLD_SEC (3), OVERLAY_FADE_IN_DELAY_MS (2000).
  Extracted so tests can import without pulling React / next/navigation
- `lib/intro/preferences.ts` — SSR-safe `shouldSkipIntro()` / `setSkipIntro()` over
  localStorage key `voidexa_skip_intro`

### Backend
- `app/api/contact/website-lead/route.ts` — POST `{contact, type}` validator,
  trims env vars, inserts into Supabase `leads` table. stdout log stub for
  email notification (email integration deferred)
- Migration `20260418_website_leads.sql` — `leads` table with RLS policy
  allowing public anon inserts (applied via Supabase MCP `apply_migration`)

### Nav + delete sweep
- Removed "Break Room" from top nav — final nav is Home, Products, Universe, About
- Deleted `components/home/{HomeCinematic,HomeRoot,VoiceoverPlayer,CinematicOverlay}.tsx`,
  `components/home/scenes/Scene{Approach,Warp,Arrival,DoorOpen}.tsx`,
  `hooks/useCinematicTimeline.ts`, `hooks/useVoiceoverSync.ts`,
  `lib/cinematic/` (dir + its 8-test suite),
  `lib/game/preload.ts` + its 4-test suite
- `SkipButton.tsx` — inlined `SKIP_BUTTON_VISIBLE_FROM = 3` since `lib/cinematic/config`
  is gone

### Tests
- New `tests/homepage-intro.test.ts` — 15 cases covering skip preferences
  roundtrip, panel count/titles/routes, Website Creation modal trigger (no href),
  CTA targets, and timing constants. Mocks `window.localStorage` via
  `vi.stubGlobal` — no jsdom dependency added
- `vitest.config.ts` — added `tests/**/*.test.ts` glob, removed deleted
  `lib/cinematic/__tests__/**`
- Total: 658 / 658 passing across 53 suites (654 baseline − 8 cinematic tests
  − 4 preload tests + 15 new + 1 misc = 658)

### Deploy + gotchas
- Tag `sprint-13c-complete` pushed; commit `19f4178`
- Vercel production → https://voidexa.com (confirmed markers: `intro-video`
  testid, Enter Free Flight, Enter Star Map, Website Creation, `voidexa_intro_final`
  URL)
- **Supabase upload ceiling** — the 65 MB 4:4:4 Veo MP4 hit `413 Payload too
  large` on the standard storage endpoint even with `file_size_limit=null`.
  The project-level edge has a fixed ~50 MB cap on non-resumable uploads; for
  larger masters use the TUS resumable endpoint or pre-compress. Re-encoding
  to yuv420p CRF 23 cut the file in half with no perceptible quality loss
- **`npx vercel env add <VAR> preview` with no git branch** — prompts
  interactively. Pass an empty positional branch arg + `--value` + `--yes` to
  set it for *all* preview branches non-interactively:
  `npx --yes vercel@latest env add NAME preview "" --value "..." --yes`
- **Package line-ending** — all new `.ts`/`.tsx` files came out with LF; git
  auto-warned about CRLF on next touch. Harmless, matches repo norms
- `docs/gpt_keywords_homepage.md` (referenced by Sprint 8) is still corrupt
  UTF-16 PowerShell artifact; not touched this sprint

## Session 2026-04-18 (2): Sprint 13d — global GHAI display + mission auto-payout REST
Sprint 13c already landed Home dropdown + `?menu=true` overlay. Remaining Sprint 13d work: global GHAI balance in nav, shop prices in GHAI, REST credit endpoint.

### Discovery — mission auto-payout was already wired
All four gameplay modes route payouts through `creditGhai()` in
`lib/credits/credit.ts`, which idempotently credits
`user_credits.ghai_balance_platform` via a unique index on
`ghai_transactions(user_id, tx_signature)`. Call sites:
- `components/freeflight/useActiveMission.ts:95` — mission completion
- `components/game/battle/BattleResults.tsx` — card battle victory
- `components/game/hauling/DeliveryResults.tsx` — hauling contract delivery
- `components/game/speedrun/RaceResults.tsx` — speed run finish
- `components/freeflight/useExplorationResolved.ts` — exploration encounters
- `lib/game/quests/progress.ts` — quest chain completion
No change needed for Step 5.1–5.2. Only the REST wrapper from 5.3 was new.

### Two-wallet clarification
voidexa has two parallel wallet tables:
1. `user_credits.ghai_balance_platform` — platform-GHAI (missions/hauling/etc). Balance source for `/api/ghai/balance`.
2. `user_wallets.balance_usd` — USD wallet for Quantum Chat. Balance source for `/api/wallet` + `components/quantum/WalletBar.tsx`.
`GhaiBalance` in the nav reads from `/api/ghai/balance` (platform GHAI). `components/quantum/WalletBar.tsx` stays on `/api/wallet` (USD). `/api/wallet/credit` credits the GHAI platform balance (not the USD wallet) — the `amount_usd` param is a dollar-equivalent converted at $1 = 100 GHAI, so it still aligns with the sprint spec's expected payload shape.

### Frontend (voidexa)
- `components/wallet/GhaiBalance.tsx` — compact nav pill (`⬡ N GHAI`) with top-up modal. Reads `/api/ghai/balance`. Exempt emails (`ceo@voidexa.com`, `tom@voidexa.com`) render `Free Access`. Modal rebrands amounts as `+500 GHAI ($5)`, `+1,000 GHAI ($10)`, etc. while calling the existing Stripe checkout at `/api/wallet/topup`.
- `components/layout/Navigation.tsx` — imports `GhaiBalance`, mounts it in the desktop right cluster between `LanguageSwitcher` and the Get-in-Touch CTA. Logged-out users see nothing (component returns null).
- `components/shop/ShopPage.tsx` — `formatPrice(cents)` now delegates to `formatCentsAsGhai` from `lib/ghai/format.ts`. Since shop prices are stored as USD cents and the rate is $1 = 100 GHAI, cents map 1:1 to GHAI. Starter Pack banner shows `199 GHAI` + `BUY · 199 GHAI` button that calls `/api/wallet/deduct` and dispatches a `voidexa:topup-required` custom event on 402.
- `lib/ghai/format.ts` — `usdToGhai`, `centsToGhai`, `formatGhai`, `formatUsdAsGhai`, `formatCentsAsGhai` + `USD_TO_GHAI = 100` constant.
- `public/icons/ghai.svg` — placeholder cyan-glow "G" icon (32×32, radial gradient glow + gradient stroke).

### Backend (voidexa)
- `app/api/wallet/credit/route.ts` — POST `{amount_usd, reason?, source_id?}`. 401 if unauthenticated, 400 if `amount_usd` not a finite number in (0, 100]. Inserts into `ghai_transactions` (type=credit, amount in GHAI = `Math.floor(amount_usd * 100)`, product=reason, tx_signature=source_id) with 23505 unique-violation branch returning `already_credited:true`. On fresh insert, upserts running total in `user_credits.ghai_balance_platform`. All env reads trimmed in existing helpers — no new env vars.

### Tests — +40 tests, total 700/700 green
- `tests/ghai-format.test.ts` (11) — USD↔GHAI conversion + display formatting, thousands separator, clamp negatives to zero, USD_TO_GHAI=100 invariant.
- `tests/nav-dropdown.test.ts` (5) — source-inspection: Home children have `{href:'/home', label:'Main Page'}` and `{href:'/?menu=true', label:'Quick Menu'}`, description anchors, no top-level `/` href on the Home group.
- `tests/quick-menu-route.test.ts` (7) — `computeIntroMode` precedence (menu-only wins over redirect), and source-inspection asserts `app/page.tsx` reads `useSearchParams`, seeds `showOverlay/videoEnded = menuOnly`, and guards `<IntroVideo>` with `!menuOnly`.
- `tests/ghai-balance-component.test.ts` (7) — `formatGhai` import, `/api/ghai/balance` fetch, null-when-logged-out, `data-testid="ghai-balance"`, exempt emails, usdToGhai in top-up modal, nav mount.
- `tests/mission-payout.test.ts` (10) — `useActiveMission` calls `creditGhai({source:'mission', sourceId: acceptanceId})`, reward is avg of min/max, status flip happens before credit (idempotency anchor). `/api/wallet/credit` rejects 401/400, caps at $100, handles 23505 as already_credited, credits `ghai_balance_platform` at 100 GHAI/$.

### Verification
- `npx next build` clean — 87 static pages, only the pre-existing bigint non-fatal warning.
- `npm test` → 700 passed (58 files). Baseline was 660 → +40 new = 700.
- `curl -sI https://voidexa.com/` → 200, `/shop` → 200, `/api/ghai/balance` → `{"error":"Unauthorized"}` as expected for unauthenticated.

### Commit + deploy
- Commit: `0cf0d22 feat(sprint-13d): global GHAI nav balance + shop GHAI prices + mission payout REST`
- Backup tag: `backup/pre-sprint-13d-20260418`
- Completion tag: `sprint-13d-complete`
- Vercel production: `voidexa-d7v2klqlx-jixxwulff-4032s-projects.vercel.app` → aliased to https://voidexa.com (READY, 58s build).

### Gotchas
- **Testing React components in node env** — tests run via `vitest` in `environment: 'node'` (no jsdom). For the new components, we rely on source-inspection (`readFileSync` + regex) rather than render tests. Follow the same pattern as `tests/homepage-intro.test.ts`.
- **Regex pitfalls over source text** — `[^}]*` won't span across `{…}` pairs. When asserting multi-line blocks like `if (!user) { return NextResponse.json({ ... }, { status: 401 }) }`, use multiple `toMatch()` calls on the individual anchors instead.
- **Wallet dichotomy** — don't accidentally route mission payouts through `/api/wallet/topup`/`deduct` (those touch `user_wallets.balance_usd` which is the Quantum Chat USD wallet). Platform-GHAI goes through `creditGhai` or the new `/api/wallet/credit`. Both end up in `user_credits.ghai_balance_platform`.
- **Shop price mapping is 1:1 cents→GHAI** because $1 = 100 GHAI = 100 cents. No rounding error. `formatCentsAsGhai(199)` = `"199 GHAI"`. Don't divide by 100 first.
- **Icon not served as Next <Image>** — `GhaiBalance` uses a raw `<img>` for `/icons/ghai.svg` because the icon is a tiny inline SVG and doesn't need Next's image optimizer. The `eslint-disable-next-line @next/next/no-img-element` comment silences the lint rule.

## Session 2026-04-19: Sprint 15 — Flight Foundation (HUD panel, roll/inertia, routing, audio gate)
Skill spec: `docs/skills/sprint-15-flight-foundation.md`. Backup tag `backup/pre-sprint-15-20260419`, completion tag `sprint-15-complete`.

### Task 1 — Non-blocking HUD call panel
- `components/freeflight/hud/HUDCallPanel.tsx` (NEW, 234 lines) — top-left 320×140 glass pill, `backdropFilter: blur(4px)` only, cyan border + scan-line overlay, five call types (`exploration | npc | hostile | mission | system`) with per-type color + optional pulse. Accepts on Enter or primary-choice click, dismisses on ESC (via the central stack) or auto-timer, and logs missed transmissions.
- `lib/ui/missedCalls.ts` (NEW) — Zustand `useMissedCalls` store, 20-entry ring buffer for dismissed/timed-out calls so future HUD can surface "replay" history.

### Task 2 — Encounters no longer kill the frame
- `FreeFlightPage.tsx` removed `<ExplorationChoiceModal>` usage and renders `<HUDCallPanel>` instead via a new `encounterToHudCall(enc, handlers)` adapter at the bottom of the file. Legacy modal file kept on disk (still referenced by nothing) so older commits that point at it still build.
- `handleEncounterTrigger` no longer calls `document.exitPointerLock()` — the pilot keeps flying while the HUD panel blinks in the corner.

### Task 3 — W is thrust only; M + Tab open the warp map
- Removed the `e.code === 'KeyW'` branch that called `warp.openMap()` from `FreeFlightPage.tsx`. That branch was the only W→map handler in the repo — every other `KeyW` hit is thrust (`FlightControls`, `SpeedRunControls`, `DebrisFieldMinigame`, the assembly-editor fly controls).
- New branch: `(e.code === 'KeyM' || e.code === 'Tab') && !menuOpen && !lorePopup && !warp.state.warping && !warp.state.mapOpen`. Calls `e.preventDefault()` on Tab so the browser doesn't steal focus.

### Task 4 — Q / E roll, R / F ascend / descend
- `components/freeflight/controls/FlightControls.tsx` fully rewritten:
  - Q / E push `angularVelocity.current.z` instead of translating ship ± world-up.
  - R / F now drive vertical thrust (`tmpUp` axis), matching legend.
  - Euler order kept `YXZ` so roll rotates around ship-local forward after yaw / pitch.

### Task 5 — Rotation inertia
- Added `angularVelocity` Vector3 ref. Mouse pushes it (`movementX → y`, `movementY → x`); each frame the vector is clamped to ±3 rad/s, integrated into pitch/yaw/roll, then multiplied by `Math.pow(0.92, dt*60)` so damping is frame-rate-independent.
- Pitch clamp (`±π/2.1`) zeros X-axis velocity on contact to avoid jitter at the limits.
- `FLIGHT_CONTROLS_CONSTANTS` exported for tests — `MOUSE_SENSITIVITY=0.003`, `ANGULAR_DAMPING=0.92`, `MAX_ANGULAR_VELOCITY=3`.

### Task 6 — Controls legend
- `components/freeflight/ControlsLegend.tsx` (NEW). Nine lines: WASD, Q/E roll, R/F ascend/descend, Mouse, RMB free-look, Shift/Space, M/Tab warp map, V/E/F bindings, ESC menu. Exported `CONTROLS_LEGEND_LINES` so tests can assert the content without rendering.
- `FreeFlightPage.tsx` replaced its inline legend markup with `<ControlsLegend />`.

### Task 7 — Homepage CTA routing unified at Level 1
- `lib/intro/panels.ts`: `SECONDARY_CTA.href` moved from `/starmap/voidexa` → `/starmap`. Both the "Enter Star Map" CTA and the Universe panel now land on Level 1; pilots reach Level 2 by clicking the voidexa planet.

### Task 8 — Level 2 Enter Free Flight CTA
- `app/starmap/voidexa/page.tsx` gained a bottom-center glowing pill CTA, identical styling to the Level 1 "Explore the Universe" button. Click disables the button, shows "Requisitioning your ship from docking bay…" for 2.2 s, then `router.push('/freeflight')`.

### Task 9 — ESC stack with 150 ms debounce
- `lib/ui/escStack.ts` (NEW) — Zustand `useEscStack` store + pure `resolveTopLayer` for tests. Priority order `hud-call > popup > map > lore > menu`. `pop()` returns false inside the debounce window so held ESC doesn't blow through multiple layers.
- `FreeFlightPage.tsx` registers lore popup, achievements panel, holographic map, and flight menu with the stack. Central ESC handler calls `escPop()` first; only falls back to opening the flight menu when the stack is empty.
- `HUDCallPanel` self-registers as `priority: 'hud-call'` and dismisses with a 220 ms fade + missed-call log when ESC fires.

### Task 10 — BoostTrail rendering fix
- `components/freeflight/ships/BoostTrail.tsx` — `THREE.PointsMaterial` was ignoring the per-particle `size` attribute (it reads only its uniform), so all particles rendered at the same on-screen scale and the overlapping additive sprites fused into a solid cyan column. Swapped for a custom `ShaderMaterial` with `attribute float aSize` + `attribute vec3 aColor`; fragment shader does a `smoothstep` radial falloff + `discard` beyond 0.5 for soft circular sprites. Boost-plume spread widened (`multiplyScalar(3.5)` boost / `1.4` cruise) so the trail reads as a plume. Attribute names renamed `position/color/size` → `position/aColor/aSize` to avoid colliding with built-in vertex attributes.

### Task 11 — Audio gate + session-based video skip
- `lib/intro/preferences.ts` rewritten with three orthogonal flags: `SKIP_VIDEO_KEY='voidexaSkipIntroVideo'`, `SKIP_QUICK_MENU_KEY='voidexaSkipQuickMenu'` (localStorage), and `SESSION_SEEN_KEY='hasSeenIntroThisSession'` (sessionStorage). Also `AUDIO_PREFERENCE_KEY='voidexaAudioPreference'` ('enabled' | 'muted'). Legacy `voidexa_skip_intro` + `shouldSkipIntro` / `setSkipIntro` retained for backwards-compat with Sprint-13c tests.
- `computeIntroMode` is now a truth-table function over `{ menuOnly, skipVideo, skipQuickMenu, sessionSeen, skipIntro? }`. Returns `'menu-only' | 'video' | 'quick-menu' | 'redirect'`. Old one-flag callers still route to the legacy behavior because when only `skipIntro` is passed we mirror it to both new flags.
- `components/home/AudioGatePopup.tsx` (NEW) — black 85%-opacity backdrop, 70vw × 50vh glass card, `<h1>` heading, green "YES" + red "NO" buttons ≥200×60px. Choice persists to `voidexaAudioPreference` and never re-prompts a returning pilot.
- `components/home/IntroVideo.tsx` accepts a new `initialMuted` prop so the audio-gate choice actually affects playback from the first frame.
- `app/page.tsx` rewritten around a `stage: 'loading' | 'audio-gate' | 'video' | 'menu' | 'redirect'` state machine. On mount it reads prefs, session flag, and `?menu=true` / `?replay=video` query params, then picks the stage via `computeIntroMode`. Video end → `markIntroSeenThisSession()` + 2 s → `stage='menu'`.
- `components/home/QuickMenuOverlay.tsx` now exposes two independent checkboxes (`skip-video-checkbox`, `skip-menu-checkbox`) and a "Replay intro video" link. Parent owns state; persisting to localStorage happens only on navigate (so un-toggling before leaving doesn't write anything).

### Tests
- `tests/sprint-15-flight-foundation.test.ts` (NEW, 37 tests) — source-inspection for HUD panel shape, no fullscreen overlay, blur cap ≤4px, ESC stack resolver priority, flight control constants, boost-trail ShaderMaterial migration, Level 2 CTA, audio preference roundtrip, session-seen toggle, `computeIntroMode` truth table, and `resetOnboardingPreferences()`.
- Updated `tests/homepage-intro.test.ts` `/starmap/voidexa` → `/starmap` assertion and `tests/quick-menu-route.test.ts` to match the new stage state machine.
- Totals: 766/766 green across 61 suites (baseline 729 → +37 new).

### Verification
- `npm run build` — clean, only the pre-existing non-fatal bigint bindings warning. All 87+ static pages prerender.
- `npm run lint` — `scripts/render_cards.js` adds +3 `require()` style errors (file was already in the working tree pre-sprint, not edited here). Zero new lint errors in Sprint 15 files.

### Gotchas worth keeping
- **React Compiler + Three.js attribute name collisions** — naming a `<bufferAttribute attach="attributes-color" ...>` with a custom size attribute triggers GPU confusion because the built-in `color` attribute is reserved. Prefix custom attributes (`aColor`, `aSize`) and reference them by the same name in the shader.
- **`backdrop-filter: blur()` above 4 px inside an active R3F scene tanks FPS** — the HUD panel spec hard-caps it at 4 px for a reason. The enforced test regex `/backdropFilter:\s*['"\`]blur\(4px\)['"\`]/` will catch anyone bumping it.
- **Tab keypress** — the browser moves focus by default; add `e.preventDefault()` before calling `warp.openMap()` or the next click won't lock the pointer. Pairs M with Tab because Tab is the space-game convention even if its default behavior fights you.
- **Zustand pop inside useEffect cleanup** — registering a layer with the ESC stack means the cleanup function MUST `unregister(id)` on unmount, otherwise stale layers accumulate and ESC will try to pop nonexistent handlers. Every `escRegister` call in Sprint 15 is paired with `escUnregister` in its return.
- **Legacy `setSkipIntro` must still write `voidexa_skip_intro`** — Sprint 13c persisted user prefs under that key; renaming it silently would log users out of their skip-intro choice. The Sprint 15 rewrite writes the new `voidexaSkipIntroVideo` key via `setSkipIntroVideo`, but `setSkipIntro` (legacy alias) stays pointed at the old key.
- **Pre-existing untracked scripts in the working tree** mean `npm run lint` shows +3 errors today that weren't in `backup/pre-sprint-15-20260419`. Those come from `scripts/render_cards.js` — the Vast.ai handoff file, not a Sprint 15 change. Comparing via `git stash -u` confirms zero new rule violations in sprint files.

## Session 2026-04-19 (2): Sprint 16 — performance, asset pipeline, visual polish
Skill spec: `docs/skills/sprint-16-performance-and-asset-pipeline.md`. Backup tag `backup/pre-sprint-16-20260419`, completion tag `sprint-16-complete`.

### Task 1 — BoostTrail GPU thrash fixed
- `components/freeflight/ships/BoostTrail.tsx` — three levers dialled back:
  - `PARTICLE_COUNT` 150 → 80 (additive-blend overdraw was the dominant GPU cost)
  - boost emit 600/sec → 250/sec, idle 180+200×speedN → 120+80×speedN
  - `needsUpdate` now gated behind per-attribute dirty flags (set only when a particle was emitted or moved this frame); per-particle `dead` Uint8Array lets the advance loop `continue` over faded slots instead of re-zeroing their colour/size every frame.
- Sprint 15 ShaderMaterial kept (PointsMaterial's uniform-only size was the real bug back then, not the culprit this sprint). `BOOST_TRAIL_TUNING` exported for tests to pin the new limits.

### Task 2 — USC / Expansion / Hi-Rez asset pipeline
- Discovery: `public/models/glb-ready/` holds **690 valid GLBs** (USC 347 + USCX 58 + Hi-Rez 88 + Quaternius 194 + 3 station/cockpit). Embedded textures intact (`node -e` GLTF JSON inspection showed materials/images/textures all populated). Blocker wasn't "texture binding lost" — it was that `MODEL_URLS` + Supabase CDN only listed ~12 hero slugs.
- `scripts/upload-ships-to-supabase.mjs` — idempotent uploader (HEAD check → upload with `upsert=false`). Reads `SUPABASE_SERVICE_ROLE_KEY` + `NEXT_PUBLIC_SUPABASE_URL` from `.env.local` via a minimal bespoke parser (avoids adding `dotenv` as a runtime dep). Supports `--dry-run` and `--all` for the full 690-file bulk upload.
- Ran curated upload of 39 ships covering every rarity tier: 28 already on CDN, 8 freshly uploaded (qs_dispatcher/insurgent/zenith/pancake, usc_craizanstar01, hirez_mainbody01/02/05), 3 skipped (slug mismatch — `usc_galacticleopard1` not `01`, `uscx_nova` not `01`, `uscx_starship` not `01`; script updated).
- `lib/config/modelUrls.ts` extended from 12 → 39 manifest entries, grouped by rarity tier.

### Task 3 — Rarity badges
- `components/freeflight/ships/catalog.ts` — added `Rarity = 'starter' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'` + `ShipClass` + `rarity: Rarity` + `shipClass: ShipClass` fields on every catalog entry.
- Catalog grew 9 → 39 entries:
  - Bob alone carries `starter`.
  - 10 QS fighters = `common` (challenger/striker/imperial/executioner/omen/spitfire + dispatcher/insurgent/zenith/pancake).
  - 14 USC families = `uncommon` (hyperfalcon, lightfox, starsparrow, striderox, nightaye, meteormantis, craizanstar, forcebadger, protonlegacy, galacticleopard, galaxyraptor, spacesphinx, spaceexcalibur, genericspaceship).
  - USC named heroes = `rare` (astroeagle, cosmicshark, voidwhale).
  - Hi-Rez full hulls = `epic` (mainbody01/02/05).
  - USCX expansion = `legendary` (galacticokamoto, starforce, nova, scorpionship, spidership, pullora, arrowship, starship).
  - `mythic` reserved.
- Badge metadata: `RARITY_LABEL` + `RARITY_STYLE` (solid vs outlined, per-tier glow colour, iridescent gradient for mythic).
- `ShipPicker.tsx` now reads `s.rarity` directly; badge label bumped 11 → 14 px for voidexa UI minimums. Unused `TIER_LABEL` import dropped (would-have-been-new-warning neutralised).
- `lib/data/shipTiers.ts` — `STARTER_SHIPS` widened to the 13-ship playable list (Bob + common QS + Astro/Cosmic heroes); `SHIP_TIERS.uncommon/epic/legendary` populated from the new catalog entries for shop-price-band consistency.

### Task 4 — Quick menu text polish
- `components/home/QuickMenuOverlay.tsx` — card background 0.35 → 0.72 opacity, `backdrop-filter: blur(6px)` → `blur(12px)` (static overlay, only 4 cards — perf fine), border switched from neutral blue to cyan tech tint `rgba(0,212,255,0.25)`. Title still 18 px, body bumped 14 → 16 px (voidexa ≥16 body rule). Icon renders monochrome cyan via hue-rotate filter with subtle glow. Box-shadow added for depth against the freeze-frame backdrop.

### Task 5 — Controls legend premium redesign
- `components/freeflight/ControlsLegend.tsx` rewritten from a flat 9-line list into a category-driven layout with `KeyChip` / `Binding` / `Category` primitives.
  - `CONTROLS_LEGEND_CATEGORIES` = 5 groups (thrust, camera, systems, navigation, menu); each binding is `{ keys: string[], action: string }`.
  - Keys render as tinted cyan chips (bg `rgba(0,212,255,0.12)`, border `0.4`, bold 14 px white text, 2 px rounded corners). Action text is 14 px regular `rgba(220,230,245,0.82)`.
  - Category headers are 14 px uppercase `rgba(0,212,255,0.72)` with 0.14em letter-spacing + subtle shadow. Hairline dividers between groups.
  - Panel: `rgba(5,8,18,0.75)` + 8 px blur + 10 px radius + outer cyan glow.
  - Legacy `CONTROLS_LEGEND_LINES` export kept so Sprint 15 tests keep matching; `formatKeys` collapses 4+ single-letter keys into a word (WASD) but keeps 2-letter pairs as `Q / E` so `/Q \/ E/` regex tests still pass.

### Task 6 — Starmap HUD declutter
- `components/ui/JarvisAssistant.tsx` — orb + chat panel moved from `bottom-6 right-6` to `bottom-6 left-6`; z-index lifted to `z-[60]` so it sits above the KCP-90 panel (`z:50`).
- `components/starmap/StarMapPage.tsx` — `Kcp90FloatingPanel` gained a `matchMedia('(max-width: 1279px)')` listener; below 1280 px viewport width the panel collapses to a 44×44 cyan "KCP" pill (`data-testid="kcp-collapsed-icon"`) that re-opens the full terminal on click.
- `app/starmap/voidexa/page.tsx` + `components/galaxy/GalaxyPage.tsx` — company-info marker converted from a bottom-right badge into a full-width thin footer strip (28 px tall, `position: fixed; left:0; right:0; bottom:0; z-index:10`) with a subtle gradient so it doesn't compete with the 3D scene but still anchors the brand. `pointer-events: none` keeps scene clicks unaffected. Font size 14 px to clear the ≥14 label minimum.

### Task 7 — Ship fallback to Bob
- `components/freeflight/ships/ShipLoader.tsx` — after `MAX_ATTEMPTS` failures the loader swaps `url` → `MODEL_URLS.qs_bob` instead of stopping at the wireframe. Short-circuit: if the failing URL *is* Bob itself, stay on the wireframe to avoid an infinite-retry loop. Logs via `console.warn` for telemetry.

### Tests
- `tests/sprint-16-performance-and-asset-pipeline.test.ts` (34 tests) — BoostTrail tuning, MODEL_URLS completeness, catalog size + rarity mapping, QuickMenu visual assertions, ControlsLegend category shape + legacy line compatibility, Starmap HUD positioning, ShipLoader Bob-fallback wiring.
- Adjusted `CONTROLS_LEGEND_LINES` flattener so Sprint 15 regex tests (`/WASD/`, `/Q \/ E/`) still pass.
- **766 → 800 green across 62 suites**.

### Verification
- `npm run build` clean, only the pre-existing non-fatal bigint bindings warning. 87 prerendered pages.
- `npm run lint` — 215 vs baseline 212 problems; diff confirms the +3 comes from pre-existing untracked `scripts/render_cards.js`. Zero new lint violations in Sprint 16 code.
- Curated Supabase upload: 28 existed, 8 newly uploaded, 0 errored. `node scripts/upload-ships-to-supabase.mjs --all` still available for the remaining ~650 GLBs when Jix has bandwidth.

### Gotchas worth keeping
- **"Texture binding broken" was a stale memory** — USC/USCX GLBs in `public/models/glb-ready/` are structurally valid with embedded PBR textures. The previous Sprint 14 texture-fix run (see `public/models/TEXTURE_FIX_GUIDE.md`) already solved it. When the audit says "ship not loading", first check the manifest + Supabase CDN (`curl -sI $URL`), not the GLB body.
- **Supabase CDN slug mismatches** — several of the uploader's first-pass names had the wrong index: `usc_galacticleopard1` (no leading zero), `uscx_nova` (no `01`), `uscx_starship` (no `01`). Always re-run the uploader in `--dry-run` mode first and fix slugs before the real upload.
- **Three-lever BoostTrail optimisation pattern** — when a per-frame R3F system pegs the GPU, the usual fix is (1) cap pool size, (2) cap emission, (3) gate `needsUpdate` behind dirty flags. Don't blindly rewrite the shader; unconditional `needsUpdate = true` on three Float32Arrays × 60 fps was the dominant cost.
- **`.env.local` parser without dotenv** — the uploader reads env vars with a 20-line loader that handles quotes and comments. Pattern is reusable for any ops script that needs `SUPABASE_SERVICE_ROLE_KEY` without adding a runtime dep. Save yourself: don't `npm i dotenv` for a one-off.
- **`CONTROLS_LEGEND_LINES` flatten rules** — Sprint 15 tests regex `/WASD/` (word) and `/Q \/ E/` (pair), so the serializer must treat 4-letter bundles as words and 2-letter pairs as slashed. A naive `keys.join('')` broke the Q/E test on first pass.
