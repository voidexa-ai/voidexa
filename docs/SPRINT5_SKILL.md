---
name: Sprint 5 — Wreck System + Trade Goods + Verification + Typography Audit
description: Use this skill when building the Sprint 5 voidexa layer — the wreck/recovery system (ship-down modal with self-repair/tow/abandon/buy-new paths, V3 timer phases by risk tier, class-based claim economics, insurance payouts), hauling trade goods expansion (30 goods from universe doc, dynamic contract generator with zone-distance + risk multipliers, daily rotation), end-to-end gameplay verification of Sprint 1–4 flows (speed run / hauling / mission / battle / pack / warp / tutorial golden paths), and a typography + opacity audit fixing every pre-Sprint-1 voidexa page. Trigger on "Sprint 5", "wreck system", "ship-down modal", "self-repair / tow / abandon", "trade goods", "dynamic hauling contracts", "gameplay verification", "font audit", "typography audit", "opacity audit", or "accessibility polish".
---

# Sprint 5 — Wreck System + Trade Goods + Verification + Typography Audit

**Goal:** MVP completeness. The wreck loop is the one gameplay system missing from the V3 spec. Trade goods turn hauling from a static demo into a real economy. Verification catches regressions before players do. Typography audit fixes the inconsistency between Sprint 1+ pages and legacy.

Companion doc: `docs/SPRINT5_CLAUDE.md` — file sizes, Supabase tables, per-task constraints, locked decisions.

Starting state: **547/547 tests passing**, Sprints 1–4 all live on voidexa.com.

---

## Task 1 — Wreck system

### Input
- V3 PART 7 design: 3 timer tiers, 4 recovery paths, class-based claim fees with 70% discount vs new-ship price, 10% insurance payout to original owner
- Existing `wrecks` table (Phase A1) with full column shape
- Sprint 3 `spendGhai` helper for repair/claim GHAI deductions
- Sprint 1 `creditGhai` helper for insurance payouts

### Output
- `lib/game/wrecks/types.ts` — WreckPhase, WreckRiskTier, RecoveryOption types
- `lib/game/wrecks/economics.ts` — pure `computeClaimCost`, `repairCost`, `timerWindows(riskTier)` per V3 table
- `components/wrecks/ShipDownModal.tsx` — 4-option recovery modal (self-repair / tow / abandon / buy-new)
- `components/wrecks/ClaimModal.tsx` — for third-party pilots approaching an abandoned wreck
- `components/freeflight/environment/Wrecks.tsx` — R3F renderer for active wrecks + proximity detection
- `components/freeflight/useWrecks.ts` — client hook reading active wrecks, handling claim + repair flows, timer phase transitions
- `app/api/wrecks/spawn/route.ts` — server-side insert on ship-down with validated risk + computed timers
- `app/api/wrecks/claim/route.ts` — atomic claim: deduct fees, insert insurance credit for original owner, update phase
- Ship-down trigger wired into `FreeFlightPage` on `shipState.health <= 0`

### Success criteria
- Ship destroyed in freeflight → `wrecks` row inserted, modal opens
- Self-repair: `spendGhai({source: 'repair', sourceId: wreck.id})` deducts GHAI, ship health restored, wreck row marked `resolution = 'self_repair'`
- Abandon: modal dismissed, wreck stays in freeflight scene with `phase = 'protected'` countdown
- After `protected_until`: phase auto-transitions to `abandoned` (other pilots can now claim)
- After `expires_at`: phase = `expired`, renderer stops drawing the wreck
- Another pilot claims an `abandoned` wreck → claim fee deducted, owner gets 10% insurance via `creditGhai`, wreck `resolution = 'claimed_by_other'`
- Buy-new flow: full base price deducted, new ship spawned at Break Room Halo

### Tests (required)
- `lib/game/wrecks/__tests__/economics.test.ts`:
  - class-based claim-cost table matches V3 (Common 150 total, Uncommon 300, Rare 750, Legendary 1500)
  - repair cost is 10% of base price per tier
  - timer windows: Low Risk = 15/45min, High Risk = 5/20min, Instanced = no wreck
  - insurance is 10% of base price (not total recovery cost)

---

## Task 2 — Hauling trade goods expansion

### Input
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` SECTION 7 — 36 goods (first 30 used)
- Existing 6 hardcoded contracts in `lib/game/hauling/contracts.ts` — kept intact
- Sprint 3 encounter system + credit flow — unchanged

### Output
- `lib/game/hauling/tradeGoods.json` — 30 goods hand-transcribed
- `lib/game/hauling/tradeGoods.ts` — thin loader + typed shim
- `lib/game/hauling/generateContract.ts` — pure contract synthesiser: `generateDailyContracts(dateSeed, count=8)` returns 8 contracts
- Distance multiplier: same-zone 1.0x, adjacent 1.5x, cross-zone 2.2x, Deep Void 3.0x
- Risk multiplier: contested +30%, wreck-risk +60%
- `components/game/hauling/DynamicRoutesTab.tsx` — render today's 8 generated contracts
- `HaulingHub.tsx` — extended with "Legacy Routes" + "Dynamic Routes" tabs

### Success criteria
- `/game/hauling` shows two tabs; Dynamic Routes has 8 contracts
- Accepting a dynamic contract inserts a `hauling_contracts` row with `mission_template = "dynamic_<goodId>_<dateSeed>"`
- Sprint 3's encounter system still fires at checkpoints
- Delivery grade + GHAI payout flow unchanged
- Daily rotation: two pilots on the same date see the same 8 contracts (global seed by date string)

### Tests (required)
- `lib/game/hauling/__tests__/generateContract.test.ts`:
  - `generateDailyContracts(seed, 8).length === 8`
  - deterministic per seed (same seed → same contracts)
  - different seeds → different contract selections
  - reward range stays positive and scales with zone distance
  - every generated contract references a real trade good id
  - at least 3 distinct zones appear across 30 daily rotations

---

## Task 3 — Gameplay verification

### Input
- All Sprint 1–4 committed code + tests
- No prior production manual verification document

### Output
- `docs/SPRINT5_VERIFICATION.md` — pilot-run-through checklist covering every mode's golden path
- Instrumentation helper `lib/debug/gameplayLog.ts` (optional, behind `NEXT_PUBLIC_DEBUG_GAMEPLAY` env flag)
- Cross-mode integration test `lib/game/__tests__/integration.test.ts`
- Bug fixes on any broken flow surfaced during the run-through

### Success criteria
- Verification doc committed with every mode marked ✅ (or explicit issue logged + fixed)
- `npm run test` still green after any fixes
- No net-new features — only stability/correctness work

### Tests (required)
- `lib/game/__tests__/integration.test.ts`:
  - speed-run `calculateGrade(timeMs, parMs, completed)` matrix — gold/silver/bronze/dnf thresholds
  - hauling `grade-from-integrity` math reproduces 90/60 thresholds
  - encounter `rollEncounter(risk, rand)` distribution within tolerance for Safe vs Risky
  - mission-complete GHAI payout value equals average of min/max

---

## Task 4 — Font + opacity audit

### Input
- All `app/**/*.tsx` and `components/**/*.tsx` files
- Accessibility rules: body ≥ 16px, labels ≥ 14px, text opacity ≥ 0.5

### Output
- `docs/FONT_OPACITY_AUDIT.md` — violation census + per-file fix list
- Fixes applied across legacy pages (homepage, `/home`, `/quantum`, `/about`, `/services`, `/ai-tools`, `/trading`, `/trading-hub`, `/apps`, `/break-room`, etc.)
- Decorative exception list documented (badges, HUD chips, progress pips)

### Success criteria
- Zero body-text violations of the 16px rule across the codebase
- Zero label-text violations of the 14px rule
- Zero visible-chrome violations of the 0.5 opacity rule
- Exceptions (decorative pills) explicitly listed in the audit doc
- Every touched page renders visually sane — no accidental layout break from the font bumps

### Tests (not required)
- Pure visual fixes; no new automated tests. Manual spot check per touched page.

---

## Overall success criteria (ship gate)

When Sprint 5 is done:

1. **Wreck system works** — destroy a ship → modal → self-repair or abandon → wreck lives in freeflight with timer phases
2. **30 trade goods live** — dynamic hauling contracts visible and acceptable
3. **Verification doc committed** — every Sprint 1–4 gameplay path verified manually
4. **Typography audit committed + fixed** — all legacy pages meet the 16/14/0.5 rule
5. **Tests green** — full suite stays ≥570 (was 547), no regressions
6. **Build clean** — `npm run build` only shows pre-existing bigint warning
7. **Deployed** — one final `git push origin main`

## Non-goals

- Remaining quest chains (Sprint 6+)
- PvP, Void Duel, Void Prix (post-MVP)
- Playwright / automated browser tests
- 3D cockpit-interior cosmetic integration (Sprint 6+)
- Ship catalog UI (defer if `ship_inventory` doesn't exist)

## Pre-work

1. **Git backup first.** Tag current head as `pre-sprint5-<date>`.
2. Read `docs/SPRINT5_CLAUDE.md` end-to-end.
3. `mcp__claude_ai_Supabase__list_tables` — confirm `wrecks` exists; check whether `ship_inventory` exists (informs Task 1 claim flow scope).

## Commit style

4 separate commits — each task touches distinct areas:

- `feat(sprint5): wreck system with 4-path recovery and timer phases`
- `feat(sprint5): hauling trade goods catalog + dynamic daily contracts`
- `chore(sprint5): gameplay verification + integration tests`
- `chore(sprint5): typography + opacity audit fixes`

Each commit: `npm run build` + `npm run test` green before landing. No skip-ci, no `--no-verify`.
