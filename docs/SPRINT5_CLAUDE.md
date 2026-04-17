# Sprint 5 — Claude Code Instructions

Sprint 5 goal: **lose a ship, gain a route system, ship quality polish.**
Sprint 4 made the universe visible (wall + warp + chains + shop). Sprint 5 adds the ONE
gameplay loop missing from MVP — the wreck/recovery system — replaces hardcoded hauling
contracts with a real trade-goods economy, verifies every Sprint 1–4 gameplay path end-to-end,
and does the typography/accessibility audit that catches every old voidexa page still
violating the 16px/14px/0.5-opacity rule.

---

## Context — what's built

Shipped and live on voidexa.com at the start of Sprint 5:

| Phase | Surface | Commit |
|---|---|---|
| A1 | 16 Supabase gaming tables + RLS + 26 baseline cards + validator | `fdf9760` |
| 1b | `/game/mission-board` + `/game/cards/deck-builder` | `9e1adfb` |
| 2 | `/game/speed-run` — 3 tracks, power-ups, leaderboard | `0ff4522` |
| 3 | `/game/hauling` — 6 contracts, encounter system | `4bfd1f1` |
| 4a | PvE battle engine + Tier 1–5 + Kestrel boss | `4d0a486` |
| 4b | `/game/battle` — 3D scene, HUD, turn flow | `5d4ad07` |
| Sprint 1 | 257-card library, 4 bosses, mission→freeflight, GHAI credit | `2a3c902`, `7bf6d50` |
| Sprint 2 | 20 landmarks, 10 NPCs, 15 encounters, 90-mission catalog | `e36377a`, `35be64a`, `c953638`, `f15643c` |
| Sprint 3 | First Day Real Sky tutorial, pack shop, card drops, pilot profile | `dfc3d51`, `3eddef6`, `9e026fc`, `02fdfc3` |
| Sprint 4 | Universe Wall, warp system, 5 quest chains, shop tabs | `fe5b511`, `9febe7f`, `c29b6a9`, `2eb451d` |

Test suite: **547/547 green**. Deploy: `git push origin main` → Vercel auto-deploys.

**What's working end-to-end right now (confirmed by tests + manual checks):**
- Mission accept → freeflight waypoints → GHAI credit (Sprint 1)
- Deck builder shows 257 cards (Sprint 1)
- Battle + speed-run + hauling + mission results → `creditGhai` (Sprint 1, 3)
- Packs open → cards grant → Mythic supply decrement (Sprint 3)
- Card drops toast on all modes (Sprint 3)
- Universe Wall events from mythic / boss / speed-record / debut (Sprint 4)
- Warp W → map → teleport + animation (Sprint 4)
- Quest chain 1/5 → auto-unlock 2/5 (Sprint 4)
- Shop 6 tabs purchase cosmetics (Sprint 4)

**What's NOT verified in a real browser yet** — speed run collision detection, power-up activation, hauling encounter-modal triggers during flight, delivery-payout happy path. These all have tests but nobody has flown them end-to-end in production. Sprint 5 Task 3 does that.

**What's NOT built yet that's in scope for Sprint 5:**
- Wreck system (designed in V3 PART 7, `wrecks` table exists from Phase A1, no code wires it)
- Trade goods economy (30 goods in universe doc, nothing loaded)
- Typography audit (unknown violation count on legacy pages)

---

## Sprint 5 scope — 4 tasks

### Task 1 — Wreck system

**Current state:**
- `wrecks` table exists from Phase A1: `id, owner_user_id, ship_id, ship_class, ship_tier, base_price_ghai, position (JSONB), sector, risk_level, phase, spawned_at, protected_until, expires_at, claimed_by_user_id, claimed_at, resolution`.
- No code inserts wreck rows. No code renders them in freeflight. No UI for recovery paths.
- V3 PART 7 locks the design: 3 timer tiers (Low Risk 15/45min, High Risk 5/20min, Instanced = no wreck), 4 recovery paths (self-repair / tow / abandon / buy new), class-based claim economics with 70% off list price, insurance payout to original owner when someone else claims.

**Required:**
1. **Ship-down trigger** — currently there's no "your ship is destroyed" flow in freeflight. Add a handler that fires when `shipState.health <= 0`:
   - Insert a `wrecks` row with the ship's last position, risk level (based on current zone), and timer phases per V3 tier table.
   - Show a full-screen "Ship Down" modal with the 4 recovery options.
2. **Recovery option UI** (`ShipDownModal`):
   - **Self-repair** — costs 50–500 GHAI tier-dependent, restores ship, wreck dissolves. Uses `spendGhai({source: 'repair', sourceId: wreck.id})`.
   - **Tow request** — leaves wreck in space, returns player to nearest station via temporary teleport. Future players in freeflight will see the wreck; if someone claims it, original owner gets 10% insurance.
   - **Abandon** — starts the timer. Wreck sits in space until claim or expiry.
   - **Buy new ship** — spends full base price, spawns fresh ship at Break Room Halo.
3. **Wreck rendering in freeflight** — new `<Wrecks>` R3F component reads active `wrecks` rows (phase in 'protected' | 'abandoned'), renders a glowing derelict object at each wreck's position. Proximity detection → "Press E to inspect / claim" prompt.
4. **Claim flow** — another pilot approaches an abandoned wreck → "Claim" button → deducts claim fee + repair cost, grants the ship id to their ship inventory (use existing `ship_inventory` table? If it doesn't exist, use `user_cards`-style table), credits 10% insurance payout to the original owner via `creditGhai({source: 'hauling', sourceId: wreck.id})`.
5. **Timer tick** — Supabase trigger OR a simple client-side computed state: if `now >= protected_until` then phase transitions to `abandoned`; if `now >= expires_at` then phase = `expired` and the wreck row stops rendering.

**Files touched:**
- `lib/game/wrecks/types.ts` — NEW, WreckPhase, WreckRisk, ClaimEconomics types
- `lib/game/wrecks/economics.ts` — NEW, `computeClaimCost(ship_class, ship_tier)`, `repairCost(ship_tier)`, timer phase windows per V3 table
- `lib/game/wrecks/__tests__/economics.test.ts` — NEW
- `components/wrecks/ShipDownModal.tsx` — NEW, 4-option recovery modal
- `components/wrecks/ClaimModal.tsx` — NEW, for pilots approaching someone else's wreck
- `components/freeflight/environment/Wrecks.tsx` — NEW, R3F wreck renderer + proximity
- `components/freeflight/useWrecks.ts` — NEW, client hook that reads active wrecks + handles claim flow
- `components/freeflight/FreeFlightPage.tsx` — wire ship-down detection + modals
- `app/api/wrecks/spawn/route.ts` — NEW, server-side wreck insert (validates risk level + computes timers)
- `app/api/wrecks/claim/route.ts` — NEW, atomic claim flow (deduct fees, insurance payout, phase transition)

**Constraints:**
- `buy new ship` is the simplest path — reset health + spawn at Break Room Halo. Full ship catalog picker is Sprint 6+ scope.
- Wreck rendering caps at 20 active wrecks globally in the render query — no need to paginate for MVP.
- Timer tick checks happen on mount + every 30s poll — no Realtime subscription this sprint (avoid another subscription if one is already on the Universe Wall).

---

### Task 2 — Hauling trade goods expansion

**Current state:**
- `lib/game/hauling/contracts.ts` has 6 hardcoded contracts.
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` SECTION 7 has 36 trade goods with source zone, destination zone, base value GHAI/unit, weight, risk notes, lore.
- The 6 hardcoded contracts work end-to-end (Sprint 3 tested encounter system flows). Sprint 5 keeps them functional but adds a dynamic layer on top.

**Required:**
1. **Trade goods catalog** — hand-transcribe the first **30 trade goods** from SECTION 7 into `lib/game/hauling/tradeGoods.ts` (JSON file imported + typed shim, same pattern as Sprint 2 mission catalog).
2. **Contract generator** — `lib/game/hauling/generateContract.ts` — pure function that takes `(sourceZone, destinationZone, rng)` and picks an eligible trade good + computes reward with multipliers:
   - Base reward = `good.baseValue * good.weight * units * distanceMultiplier`
   - Distance multiplier: same zone 1.0x, adjacent 1.5x, cross-zone 2.2x, Deep Void 3.0x
   - Risk modifier: contested zone +30%, wreck risk +60%
3. **Daily rotation** — `/game/hauling` page seeds 8 dynamic contracts per day based on a date-keyed seed. The 6 legacy contracts remain available as "Legacy Routes" tab for flavor.
4. **Contract UI** — extend existing `HaulingHub.tsx` with a second tab "Dynamic Routes" rendering today's 8 generated contracts. Each card shows: origin → destination, trade good name + category, risk badge, reward range.
5. **Flight integration** — generated contract acceptance flow reuses the existing `hauling_contracts` table with `mission_template = "dynamic_{goodId}_{dateSeed}"` so the Sprint 3 encounter system + credit flow work unchanged.

**Files touched:**
- `lib/game/hauling/tradeGoods.json` — NEW, 30 goods
- `lib/game/hauling/tradeGoods.ts` — NEW, loader + type-coerced exports
- `lib/game/hauling/generateContract.ts` — NEW, pure contract-synthesis function
- `lib/game/hauling/__tests__/generateContract.test.ts` — NEW
- `components/game/hauling/HaulingHub.tsx` — extend with tab bar
- `components/game/hauling/DynamicRoutesTab.tsx` — NEW, renders today's 8 generated contracts

**Constraints:**
- Keep existing `HAULING_CONTRACTS` (6 legacy) export available. Don't break Phase 3.
- Daily seed = `YYYY-MM-DD` string. Pilots on the same date see the same 8 contracts — the rotation is global.
- Generator must be pure — no Supabase. Pilots who accept write to existing `hauling_contracts` table just like before.

---

### Task 3 — Gameplay verification

**Current state:**
- Unit tests cover logic for every mode. Browser-level integration isn't verified.
- Sprint 2 shipped hauling encounters (modal choice, navigation encounters, combat encounters). None of these have been clicked through in production.
- Speed Run has `RaceResults.tsx` committing times but no one has manually confirmed the leaderboard renders new entries.
- Hauling encounter triggers fire at checkpoints — spot-check timing.

**Required:**
1. **Write a verification checklist document** — `docs/SPRINT5_VERIFICATION.md` — a pilot-run-through script covering every mode's golden path:
   - Speed Run: pick Core Circuit → gate collision → power-up activate → finish → save → leaderboard updates
   - Hauling: accept Local Parcel Run → fly to first checkpoint → encounter modal fires → resolve → reach destination → GHAI credited
   - Mission: accept on board → waypoint spawn in freeflight → fly through → GHAI credited
   - Battle: tier 1 → win → loot drop + GHAI
   - Pack: Standard Pack → 5 cards reveal
   - Wreck (new): destroy ship → modal appears → self-repair restores
   - Warp: W near gate → map → destination → teleport
   - Tutorial: new pilot → First Day Real Sky advances on speed run save
2. **Add instrumentation** where verification reveals missing telemetry:
   - Console-log key transition events during dev (`[SPEEDRUN] gate cleared`, `[HAULING] encounter fired`, etc.) behind a `NEXT_PUBLIC_DEBUG_GAMEPLAY` env flag (default off)
3. **Fix any broken flows discovered** during verification. Expected touch-ups:
   - Leaderboard UI may not auto-refresh after save — add a post-save refresh
   - Encounter modal might not block ship controls during display — audit pointer-lock release
   - GHAI toast timing — some may fire before `creditGhai` resolves (race condition)
4. **Lightweight integration test** — one vitest suite exercising the pure-function contracts for each mode (no DOM, no Supabase):
   - `computeGrade(timeMs, parMs, completed) → 'gold'|'silver'|'bronze'|'dnf'` matrix
   - `calculateGrade(integrity) → delivery grade` for hauling
   - `rollEncounter(risk, rng) → encounter type` distribution
   - `calculateGrade(timeMs, parMs, true) === 'gold'` when under par

**Files touched:**
- `docs/SPRINT5_VERIFICATION.md` — NEW, manual run-through checklist (committed doc, keeps visible)
- `lib/game/__tests__/integration.test.ts` — NEW, cross-mode pure-function integration tests
- Any fix needed in `components/game/*` — file-by-file, only what verification surfaces
- Optional: `lib/debug/gameplayLog.ts` — NEW, tiny `gplog(area, ...args)` helper that noops when `NEXT_PUBLIC_DEBUG_GAMEPLAY !== 'true'`

**Constraints:**
- Sprint 5 does **not** attempt to automate browser testing. Sprint 6+ can add Playwright if needed. For now, manual verification + checklist doc is the deliverable.
- Fixes to any broken flow must come with a test that would have caught the bug.
- `NEXT_PUBLIC_DEBUG_GAMEPLAY` must be `.trim()`'d.

---

### Task 4 — Font + opacity audit

**Current state:**
- Since Sprint 1 all new components follow the 16px body / 14px label / 0.5 opacity minimum rule.
- Pre-Sprint-1 pages (homepage, `/home`, `/quantum`, `/about`, `/services`, `/ai-tools`, `/trading`, `/trading-hub`, `/apps`, `/break-room`, etc.) were never audited. Violations unknown.

**Required:**
1. **Grep-based violation census** — sweep `app/` and `components/` for:
   - `fontSize: 12` or smaller in visible text contexts
   - `opacity: 0.3` or lower on visible text/chrome
   - `fontSize: 13` used in body text (labels OK)
2. **Produce an audit report** — `docs/FONT_OPACITY_AUDIT.md` — list every violation with file:line and the proposed fix.
3. **Fix violations** in batch:
   - Body copy <16px → bump to 16
   - Labels/eyebrows <14px → bump to 14
   - Text opacity <0.5 → bump to 0.5 (or replace with a proper color)
   - Accept `fontSize: 11–13` for badges / pills / counters that are **decorative**, not core body text. Document the exception in the audit report.
4. **Don't touch:**
   - Code blocks / monospace numeric displays (they're non-body text)
   - 3D scene overlay components where the viewport is large (those texts can stay at 12px if they're HUD chips)
   - Shop badges, category pills, progress pip labels — already established as decorative-only

**Files touched:**
- `docs/FONT_OPACITY_AUDIT.md` — NEW
- Fixes scatter across `app/**/*.tsx`, `components/**/*.tsx` — scope depends on the audit outcome. Preserve existing structure; only touch the style values.

**Constraints:**
- No new features in this task. Just typography consistency.
- Fix in batches per-directory so commits stay reviewable (`app/home/*`, `app/quantum/*`, etc.).
- If a page needs a full rewrite rather than patching, defer to Sprint 6+.

---

## Rules

### File sizes
- React component max **300 lines**
- `page.tsx` max **100 lines**
- `lib/` file max **500 lines**
- **Split at 200+**

### Fonts + opacity
- Body ≥ **16 px**, labels ≥ **14 px**, min text opacity **0.5**

### Env vars
- Every `process.env.*` read must be `.trim()`'d (including `NEXT_PUBLIC_DEBUG_GAMEPLAY`)

### Deploy
- `git push origin main` — Vercel auto-deploys.
- **Git backup first** — tag `pre-sprint5-<date>`.

### Test discipline
- `npm run build` after each task
- Full test suite stays green. Baseline **547**. Sprint 5 targets ~570+.
- Every new lib file gets shape + behaviour tests.

### Per-task verification checkpoints
1. After Task 1: destroy ship in freeflight → Ship Down modal → self-repair → ship restored + GHAI deducted
2. After Task 2: `/game/hauling` shows Dynamic Routes tab with 8 generated contracts, accepting one works
3. After Task 3: `docs/SPRINT5_VERIFICATION.md` committed, every mode's golden path has a ✅ or explicit issue noted
4. After Task 4: `docs/FONT_OPACITY_AUDIT.md` committed, all critical (body text) violations fixed

Stop on failure. Don't stack.

---

## Files touched summary

| Area | New | Modified |
|---|---|---|
| Task 1 — Wreck system | `lib/game/wrecks/{types,economics}.ts` + tests, `components/wrecks/{ShipDownModal,ClaimModal}.tsx`, `components/freeflight/environment/Wrecks.tsx`, `components/freeflight/useWrecks.ts`, `app/api/wrecks/{spawn,claim}/route.ts` | `FreeFlightPage.tsx` |
| Task 2 — Trade goods | `lib/game/hauling/{tradeGoods.json,tradeGoods.ts,generateContract.ts}` + tests, `components/game/hauling/DynamicRoutesTab.tsx` | `HaulingHub.tsx` |
| Task 3 — Verification | `docs/SPRINT5_VERIFICATION.md`, `lib/game/__tests__/integration.test.ts`, optional `lib/debug/gameplayLog.ts` | any bug fix surfaced |
| Task 4 — Audit | `docs/FONT_OPACITY_AUDIT.md` | scatter across `app/**/*.tsx`, `components/**/*.tsx` |

---

## Supabase tables in play

| Table | Notes |
|---|---|
| `wrecks` | Existing (Phase A1). Task 1 inserts on ship-down, updates on claim/repair/abandon, reads for render. |
| `user_credits` | Existing. Task 1 spends GHAI for repair/claim/buy-new + credits insurance payouts. |
| `ghai_transactions` | Existing. Task 1 writes via `spendGhai` (repair / module_purchase) and `creditGhai` (insurance). |
| `hauling_contracts` | Existing. Task 2 dynamic contracts use `mission_template = 'dynamic_{goodId}_{dateSeed}'` and reuse the Sprint 3 flow. |
| `ship_inventory` | **Check before assuming exists.** Needed for "claim the wreck → own that ship". If not present, defer visual ship-pick logic to Sprint 6+ and just mark the wreck claimed. |

---

## Locked decisions (unchanged from Sprint 1–4)

- **GHAI is a platform credit.** $1 USD = 100 GHAI. No crypto.
- **5 zone shells**: Core → Inner Ring → Mid Ring → Outer Ring → Deep Void.
- **Cast = contract issuers, not playable.** No new Cast-member mechanics in Sprint 5.
- **Bob is the free starter ship.** Soulbound. Wreck system never deletes Bob — if you lose Bob, you're respawned with Bob intact.
- **Deep Void has no warp gates.** Wreck claim path does not teleport anyone into Deep Void zones.
- **Wreck economics scale by class, not cosmetic tier** (V3 PART 7 GPT fix). Task 1 implements via `lib/game/wrecks/economics.ts`.
- **Insurance** = 10% of base price to original owner on third-party claim.
- **No pay-to-win.** Wreck buy-new-ship path monetizes convenience, not power.

---

## Out of scope for Sprint 5 (Sprint 6+)

- Remaining 15 quest chains (chains 6–20)
- Subscription products (insurance / matchmaking / scanner)
- PvP card battle, Void Duel, Void Prix (post-MVP)
- Player-to-player card trading
- AI-generated quest rewards
- The Hive Champion skin + Hive record mechanic
- 3D visual integration of equipped cosmetics
- Remaining 70+ landmarks, 20+ NPCs, 45 exploration encounters
- Playwright browser tests (if deemed needed after Task 3 manual verification)
- Ship inventory UI (if `ship_inventory` table isn't present — claim path just flags the wreck)
