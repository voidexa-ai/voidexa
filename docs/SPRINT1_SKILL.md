---
name: Sprint 1 — Gameplay Loop Completion
description: Use this skill when closing the first playable voidexa gaming loop — wiring mission accept to freeflight with GHAI payout, expanding the Deck Builder to all 257 cards, adding 4 additional PvE bosses to the battle engine, and unifying GHAI payout across all gameplay modes. Trigger on "Sprint 1", "wire mission board to freeflight", "257 cards in deck builder", "4 new bosses", "GHAI payout from gameplay", or "close the gameplay loop".
---

# Sprint 1 — Gameplay Loop Completion

**Goal:** A player can accept a mission at `/game/mission-board`, fly it in `/freeflight`, reach the final waypoint, and see their GHAI balance increase in Supabase. Same credit path is then reused by speed run, hauling, and battle.

Companion doc with full context: `docs/SPRINT1_CLAUDE.md` (file sizes, rules, Supabase tables, locked decisions).

---

## Task 1 — Mission → Freeflight wire + GHAI payout

### Input
- `mission_acceptances` row with `status='accepted'` inserted by `/game/mission-board`
- Active mission's `waypoints: {x,y,z}[]` from `lib/game/missions/board.ts` (add if missing — generate from seed if needed)

### Output
- Freeflight renders waypoint rings in sequence for the active mission
- `MissionOverlay` HUD component shows current objective + `(cleared/total)` counter
- On last waypoint cleared:
  - `mission_acceptances.status` → `'completed'`, `completed_at` set, `outcome_grade` + `reward_ghai` stored
  - `user_credits.ghai_balance_platform` increased by reward amount (via `lib/credits/credit.ts`)
  - `ghai_transactions` row inserted with `source='mission'`, `source_id=mission_acceptances.id`
  - Toast "+N GHAI" visible for 2.5s in freeflight

### Success criteria
- Accept "Local Parcel Run" → waypoints appear in freeflight → fly through all of them → toast appears → refresh `/game/mission-board` and the mission shows as no longer active → check Supabase, `ghai_balance_platform` increased by 40–60
- Freeflight still works with no accepted mission (no waypoints, no overlay)
- Same mission accepted a second time (if spec permits) does NOT double-credit (idempotency via `ghai_transactions` unique index)

### Tests
- Manual browser verification is acceptable for waypoint rendering + completion
- Unit test on `creditGhai` idempotency is **required** (repeated call with same `source_id` must not duplicate)

---

## Task 2 — Deck Builder loads all 257 cards

### Input
- `lib/game/cards/baseline.json`
- `lib/game/cards/expansion_set_1.json`
- `lib/game/cards/full_card_library.json`
- Existing `CARD_TEMPLATES` in `lib/game/cards/index.ts` (26 cards, must keep exporting)

### Output
- A merged `ALL_CARDS: CardTemplate[]` export available via `lib/game/cards/library.ts` (or `index.ts` if it stays under 500 lines)
- Duplicate `id`s dropped, last write wins
- All three JSON sources normalised to the `CardTemplate` shape — `stats` blob coerced, missing fields defaulted
- Deck Builder filters + list render against `ALL_CARDS` without regressing perceived performance

### Success criteria
- `ALL_CARDS.length === 257` (exact)
- `new Set(ALL_CARDS.map(c => c.id)).size === 257` (no duplicates)
- Every card has `type`, `rarity`, `cost`, `stats`, `abilityText`, `faction`
- Deck Builder renders at least Common, Uncommon, Rare, Legendary, Mythic, Pioneer chips correctly for the larger pool
- **Phase 4a battle tests still pass** (they import `CARDS_BY_ID` from `@/lib/game/cards/index` — that export must stay stable)
- `/game/battle`, `/game/hauling` mini-battle, and Phase 1b deck builder all still function

### Tests (required)
- `lib/game/cards/__tests__/library.test.ts`:
  - 257 unique ids
  - every card validates the `CardTemplate` shape (type union, rarity union, cost in 0..7, faction union)
  - no card has `cost > 7`
  - no card has `ability_text` or `abilityText` missing/empty
  - existing `CARDS_BY_ID` still contains the 26 baseline ids

---

## Task 3 — Add 4 bosses to battle encounters

### Input
- `docs/gpt-outputs/GPT_BOSS_DESIGNS.md` — full design specs for:
  - Boss 1: **The Lantern Auditor** (Tier 2 training)
  - Boss 2: **Varka, Tyrant of the Hollow** (Tier 4 pirate warlord)
  - Boss 3: **Choir-Sight Envoy** (Tier 5 Silent One scout)
  - Boss 4: **The Patient Wreck** (Tier 5+ Deep Void endgame)
- Existing `lib/game/battle/encounters.ts` and `KESTREL_UNIQUE_CARDS` pattern

### Output
- `makeLanternAuditorEncounter()`, `makeVarkaEncounter()`, `makeChoirSightEncounter()`, `makePatientWreckEncounter()` — each returns `EncounterConfig`
- Per-boss unique card arrays (1–3 cards each), NOT added to `CARD_TEMPLATES` (kept out of the player pool)
- `BossId = 'kestrel' | 'lantern_auditor' | 'varka' | 'choir_sight' | 'patient_wreck'` union
- `BattleEntry` renders a "Boss Fights" section with 4 cards (Kestrel lives on its own existing path, can be optionally surfaced here too)
- `BattleController` accepts a discriminated union:
  ```ts
  type BattleConfig =
    | { kind: 'tier'; tier: PveTierId }
    | { kind: 'boss'; bossId: BossId }
  ```

### Success criteria
- Each boss fight loads with correct hull, deck, and bonusEnergyPerTurn
- Each boss deck contains the expected unique cards
- Boss-specific passives (e.g. Varka +1 energy per turn, Patient Wreck damage scaling) fire correctly without branching the pure engine — passives are data-encoded in `EncounterConfig` or applied by AI helpers, not by modifying `lib/game/battle/engine.ts`
- Completing a boss fight writes to `battle_sessions` with `boss_template = '<bossId>'` (not `'tier_N'`)
- Card drops from boss victories pull from a boss-specific loot table, with a chance to drop a boss-unique card (design choice — can be 0% in Sprint 1 if unclear; document which)

### Tests (required)
- Extend `lib/game/battle/__tests__/engine.test.ts` with 4 new tests:
  - `makeLanternAuditorEncounter()` produces a valid `EncounterConfig` with correct hull + deck size
  - Varka's deck contains all of Varka's unique cards
  - Choir-Sight's deck has the expected rarity mix
  - Patient Wreck has `bonusEnergyPerTurn >= 1` and correct phase data
- **All 388 existing tests must remain green** (run full suite, not just battle tests)

---

## Task 4 — Unified GHAI payout across all gameplay modes

### Input
- `lib/credits/credit.ts` from Task 1
- Existing reward calculations in:
  - `components/game/speedrun/RaceResults.tsx` → `GRADE_REWARDS`
  - `components/game/hauling/DeliveryResults.tsx` → `baseReward + bonusGhai`
  - `components/game/battle/BattleResults.tsx` → `TIER_REWARDS`

### Output
- Every mode's results screen calls `creditGhai(userId, amount, { source, source_id })` exactly once on finalize
- Supabase `ghai_transactions` table enforces uniqueness of `(user_id, source, source_id)`
- Users see their updated balance reflected in any future balance check

### Success criteria
- **Speed Run**: finish a race → save to leaderboard → balance increases by the grade reward; clicking Save twice does not double-credit
- **Hauling**: finish a delivery → `DeliveryResults` finalizes → balance increases; refresh page → no re-credit
- **Battle**: win a battle → `BattleResults` finalizes → balance increases; "Retry" then finishing again credits the new run (different `source_id`)
- **Mission**: already covered in Task 1
- A single user's `ghai_transactions` rows form a complete audit trail for Sprint 1 activity

### Tests (required)
- `lib/credits/__tests__/credit.test.ts` (new):
  - `creditGhai` with a fresh `source_id` increases `ghai_balance_platform`
  - `creditGhai` with a duplicate `source_id` returns `{ alreadyCredited: true }` and leaves balance unchanged
  - `creditGhai` with amount <= 0 throws / returns an error (no zero-dollar writes to the ledger)
- If `ghai_transactions` table needs a migration, the migration is applied via `mcp__claude_ai_Supabase__apply_migration` on project `ihuljnekxkyqgroklurp` and the SQL committed to `supabase/migrations/`

---

## Overall success criteria

When Sprint 1 is done:

1. **Playable loop closed** — one user can accept a mission, fly it in freeflight, reach the last waypoint, and see +N GHAI credited in Supabase
2. **257 cards available** — `/game/cards/deck-builder` shows the full library with filters working
3. **4 new bosses fightable** — `/game/battle` exposes Lantern Auditor, Varka, Choir-Sight, Patient Wreck alongside Tier 1–5
4. **Every mode credits GHAI** — speed run, hauling, battle, mission all pay into `user_credits.ghai_balance_platform` through the same helper
5. **No regressions** — `npm run build` clean, `npm run test` all green (currently 388 tests, Sprint 1 should end around 395+)
6. **Deployed** — one final `git push origin main` lands all four tasks on voidexa.com

## Non-goals

- Populating freeflight with 100 landmarks (Sprint 2)
- 90-mission library expansion (Sprint 2)
- Card illustrations (parallel AI image track)
- Quest chain state machine (Sprint 3)
- PvP, Void Duel, Void Prix (post-MVP)

## Commit style

One commit per task (4 total) or one bundled commit — both OK. Preferred messages:
- `feat(sprint1): mission → freeflight waypoints + GHAI payout`
- `feat(sprint1): deck builder loads all 257 cards`
- `feat(sprint1): 4 PvE bosses (lantern, varka, choir-sight, patient wreck)`
- `feat(sprint1): unified GHAI credit across all gameplay modes`

Each commit must leave `npm run test` green. No skip-ci, no `--no-verify`.
