# Sprint 1 — Claude Code Instructions

Sprint 1 goal: **a player can accept a mission, fly it, complete it, and earn GHAI.**
This closes the first playable loop. Every system already exists individually — this sprint wires them together.

---

## Context — what's built

Built and deployed (voidexa.com):

| Phase | Surface | Commit | Status |
|---|---|---|---|
| A1 | 16 Supabase gaming tables, RLS, 26 baseline card templates, balance validator, 361 tests | `fdf9760` | Done |
| 1b | `/game/mission-board` + `/game/cards/deck-builder` (Dream Mode) | `9e1adfb` | Done |
| 2 | `/game/speed-run` — 3 tracks, 15 gates each, pre-race power-ups, leaderboard | `0ff4522` | Done |
| 3 | `/game/hauling` — 6 contracts, weighted encounter system, delivery grading | `4bfd1f1` | Done |
| 4a | PvE battle engine — pure TypeScript, AI, Tier 1–5 + Kestrel Reclaimer, 27 tests | `4d0a486` | Done |
| 4b | `/game/battle` — 3D scene, card hand, HUD, turn flow, results with card drops | `5d4ad07` | Done |

Full test suite is **388/388 green** as of Phase 4a. Sprint 1 must keep it green.

Content designed but NOT wired into gameplay yet:
- **257 total card templates** split across three JSON files in `lib/game/cards/`
- **4 additional bosses** (Lantern Auditor T2, Varka T4, Choir-Sight T5, Patient Wreck T5+) defined in `docs/gpt-outputs/GPT_BOSS_DESIGNS.md`
- **100 landmarks / 90 missions / 60 encounters / 20 quest chains** — out of scope for Sprint 1

---

## Sprint 1 scope — 4 tasks

### Task 1 — Mission → Freeflight wire + GHAI payout
Merged because they share the same plumbing.

**Current state:**
- `/game/mission-board` accepts a mission → inserts a row into `mission_acceptances` with `status='accepted'`
- Nothing happens after accept. No waypoints spawn in freeflight. No completion detection. No reward.
- `lib/credits/deduct.ts` exists for GHAI spending but there's no `credit` counterpart for paying out.

**Required:**
1. When a mission is accepted, freeflight reads the active mission from `mission_acceptances` and spawns **waypoint markers** on the 3D scene (reuse the `WaypointMarker` component from `components/game/hauling/`).
2. Player flies through waypoints in sequence; last waypoint = completion.
3. On completion:
   - Update `mission_acceptances.status` → `'completed'`, set `completed_at`, store `outcome_grade` + `reward_ghai`
   - Add `reward_ghai` to `user_credits.ghai_balance_platform` (new helper: `lib/credits/credit.ts` — mirror of `deduct.ts`)
   - Show a toast/modal in freeflight: "+N GHAI"
4. Handle "no active mission" — freeflight continues to work with no waypoints when the user has no accepted mission.

**Files touched:**
- `app/freeflight/page.tsx` + `components/freeflight/FreeFlightPage.tsx` — read active mission on mount, pass to scene
- `components/freeflight/FreeFlightScene.tsx` — conditionally render waypoint markers for active mission
- `lib/game/missions/board.ts` — add `waypoints: {x,y,z}[]` to each `MissionTemplate` (can be generated from a seed if missing)
- `lib/credits/credit.ts` — new, pure function that adds GHAI to `user_credits.ghai_balance_platform` (idempotent per mission via `mission_acceptances.id`)
- `components/freeflight/MissionOverlay.tsx` — new, small HUD showing current objective + progress

Keep the mission-overlay component under 200 lines. Split if it grows.

---

### Task 2 — Deck Builder loads all 257 cards

**Current state:**
- `/game/cards/deck-builder` reads `CARD_TEMPLATES` from `lib/game/cards/index.ts` (26 baseline cards only).
- `lib/game/cards/` also contains: `baseline.json`, `expansion_set_1.json`, `full_card_library.json`. These together are the full 257-card library.
- These JSON files are NOT currently imported anywhere.

**Required:**
1. Extend `lib/game/cards/index.ts` (or add a sibling loader like `lib/game/cards/library.ts`) that merges all three JSON sources into a single typed `CardTemplate[]` while preserving the existing `CARD_TEMPLATES` export.
2. The loader must normalise keys across the three JSON shapes (baseline.json uses camelCase; full_card_library.json may differ — audit before merging) and drop duplicates by `id`.
3. Deck Builder uses the full 257 list. Filter chips (type / rarity / cost) must stay fast — no 257-card re-renders per keystroke.
4. The **deck build rules stay identical** (max 2 copies, max 3 rare, max 1 legendary, max 1 mythic, max 1 pioneer). Mythic and Pioneer support is already in the UI.
5. `Phase 4b` battle UI, battle engine tests, and the mini card battle in `/game/hauling` all import from `@/lib/game/cards/index`. Do not break those consumers — they must keep resolving to the same `CARDS_BY_ID` shape.

**Files touched:**
- `lib/game/cards/index.ts` — extend with loader, keep existing exports stable
- `lib/game/cards/library.ts` — NEW, if the loader grows beyond ~80 lines
- `app/game/cards/deck-builder/DeckBuilderClient.tsx` — no logic change expected; it imports `CARD_TEMPLATES` by reference
- `lib/game/cards/__tests__/library.test.ts` — NEW, asserts 257 unique ids, every card validates against `CardTemplate`

**Constraint:** keep `lib/game/cards/index.ts` under 500 lines. If extending pushes it over, split the baseline registry into `baseline.ts` and re-export.

---

### Task 3 — Add 4 bosses to battle encounters

**Current state:**
- `lib/game/battle/encounters.ts` has `PVE_TIERS[1..5]` (generic enemies) and the Kestrel Reclaimer boss.
- The 4 additional bosses exist as design specs only in `docs/gpt-outputs/GPT_BOSS_DESIGNS.md`.

**Required:**
1. In `lib/game/battle/encounters.ts`, add exports:
   - `makeLanternAuditorEncounter()` — Tier 2 training boss
   - `makeVarkaEncounter()` — Tier 4 Hollow Tyrant pirate warlord
   - `makeChoirSightEncounter()` — Tier 5 Silent One scout at The Unlit Choir
   - `makePatientWreckEncounter()` — Tier 5+ Deep Void endgame
2. Each boss returns an `EncounterConfig` with a dedicated deck, hull, and `bonusEnergyPerTurn` where the design requires it.
3. Each boss needs unique cards (1–3 per boss) added to `KESTREL_UNIQUE_CARDS`-style constants, not into the player card pool.
4. `/game/battle` BattleEntry gets a new section "Boss Fights" below the 5 tiers — 4 selectable boss cards.
5. `BattleController` must accept either a tier id OR a boss encounter builder. Refactor the `tierId` prop into a discriminated union `{ kind: 'tier', tier: PveTierId } | { kind: 'boss', bossId: BossId }`.

**Files touched:**
- `lib/game/battle/encounters.ts` — extend (target ≤450 lines; split to `lib/game/battle/bosses.ts` if it exceeds 500)
- `lib/game/battle/__tests__/engine.test.ts` — extend with 4 more tests (one per boss: deck size, unique card presence, phase transitions if applicable)
- `components/game/battle/BattleEntry.tsx` — add Boss Fights row
- `components/game/battle/BattleController.tsx` — accept boss encounters
- `components/game/battle/BattleClient.tsx` — propagate the selection

**Constraint:** the 4 boss phase/passive behaviors (e.g. Varka +1 energy, Patient Wreck scaling) must be either (a) data-encoded in `EncounterConfig` so the engine consumes them generically, OR (b) implemented as boss-specific helpers called by the AI. Do **not** branch the pure engine on boss identity — keep the engine generic.

---

### Task 4 — GHAI payout from ALL gameplay modes

Task 1 credits GHAI from missions. Task 4 generalises that so **every mode** credits GHAI on success:
- Mission complete → credits via `lib/credits/credit.ts`
- Speed run save to leaderboard → credits `GRADE_REWARDS` (Gold 80, Silver 50, Bronze 30)
- Hauling delivery → credits the `base + bonus` total from `DeliveryResults`
- Battle victory → credits tier reward from `BattleResults.TIER_REWARDS`

All four modes currently compute a reward locally but never call a credit helper. Wire them to the same `creditGhai(userId, amount, source)` function (source is an enum used for audit logging in a new `ghai_transactions` table if it doesn't exist — check Supabase before creating).

**Files touched:**
- `lib/credits/credit.ts` — NEW, the single pure credit helper
- `components/game/speedrun/RaceResults.tsx` — call `creditGhai` on save
- `components/game/hauling/DeliveryResults.tsx` — call `creditGhai` on finalize
- `components/game/battle/BattleResults.tsx` — call `creditGhai` on victory
- Mission board completion screen (from Task 1) — call `creditGhai`

**Idempotency:** every call must be idempotent. Use the run/contract/battle id as the dedupe key so retries don't double-pay. Supabase table `ghai_transactions(user_id, source, source_id, amount, created_at)` with unique `(user_id, source, source_id)` index is the simplest enforcement; create a migration if needed.

---

## Rules

### File sizes
- React component max **300 lines**
- `page.tsx` max **100 lines** — delegate to a client component in `components/`
- `lib/` file max **500 lines**
- **Split at 200+** — don't wait until you hit the ceiling

### Fonts + opacity
- Body ≥ **16 px**
- Labels ≥ **14 px**
- Minimum opacity on visible text/chrome: **0.5**

### Env vars
- Every `process.env.*` read must be `.trim()`'d (see `lib/stripe/client.ts` and `app/api/wallet/topup/route.ts` — the pattern is already established)

### Deploy
- `git push origin main` is the only deploy action. Vercel auto-deploys on push.
- Never deploy incomplete features — commit small, test green, then push.

### Test discipline
- `npm run test` before every commit (`node node_modules/vitest/vitest.mjs run`)
- **All 388 existing tests must keep passing.**
- Every task adds tests where engine/data logic changes (Task 2 adds card library tests; Task 3 adds boss tests; Task 4 adds credit idempotency tests if a credit helper is introduced).
- No tests needed for UI-only changes (Task 1 mission overlay is a component — manual browser verification is fine).

---

## Files touched summary (by area)

| Area | New | Modified |
|---|---|---|
| Freeflight mission wiring | `components/freeflight/MissionOverlay.tsx` | `app/freeflight/page.tsx`, `components/freeflight/FreeFlightScene.tsx`, `lib/game/missions/board.ts` |
| GHAI credit | `lib/credits/credit.ts`, maybe `supabase/migrations/20260417_ghai_transactions.sql` | `RaceResults.tsx`, `DeliveryResults.tsx`, `BattleResults.tsx` |
| Full card library | `lib/game/cards/library.ts`, `lib/game/cards/__tests__/library.test.ts` | `lib/game/cards/index.ts` |
| Bosses | `lib/game/battle/bosses.ts` (if split), new tests | `lib/game/battle/encounters.ts`, `BattleEntry.tsx`, `BattleController.tsx`, `BattleClient.tsx` |

---

## Supabase tables in play this sprint

| Table | Columns used | Writes | Reads |
|---|---|---|---|
| `mission_acceptances` | `user_id, mission_id, status, accepted_at, completed_at, outcome_grade, reward_ghai` | T1 completion | T1 spawn waypoints |
| `user_credits` | `user_id, ghai_balance_platform, total_ghai_earned?, updated_at` | T1, T4 all modes | T4 balance check |
| `ghai_transactions` (maybe new) | `user_id, source, source_id, amount, created_at` | T4 every credit | idempotency check |
| `battle_sessions` | already written by Phase 4b | T3 boss runs record the `boss_template` | BattleResults |
| `hauling_contracts` | already in use | T4 adds credit call | DeliveryResults |
| `speedrun_times` | already in use | T4 adds credit call | Leaderboard |
| `decks` + `deck_cards` | already in use | unchanged | BattleEntry + DeckBuilder |
| `user_cards` | already written by Phase 4b | card drops flow unchanged | - |

**Check before creating `ghai_transactions`:** it may already exist — `ls supabase/migrations/` and grep before writing a new migration.

---

## Locked decisions (do not re-litigate)

- **GHAI is a platform credit.** $1 USD = 100 GHAI (V-Bucks model). Not a token. Not crypto. `ghai_balance_platform` is the one true column. MiCA compliance is the reason; don't reintroduce token supply, mint/burn, or "utility token" framing anywhere in Sprint 1.
- **5 zone shells**, in order: Core → Inner Ring → Mid Ring → Outer Ring → Deep Void. Every mission, landmark, and encounter belongs to exactly one zone. Tier 1 = Core, Tier 5 = Deep Void.
- **The Cast are contract issuers, not playable characters.** Jix, Claude, GPT, Gemini, Perplexity, Llama post missions, narrate quests, and appear in radio chatter. The player is an unnamed pilot. Never expose Cast members as selectable pilots or heroes.
- **Bob is the free starter ship.** Bob is soulbound — never tradeable, never wagerable. Player always has Bob as a fallback.
- **No pay-to-win.** Shop sells cosmetics only. Gameplay earns stats. If Task 3 boss rewards include a card drop, it must be a drop (earned), not a purchase.

---

## Out of scope for Sprint 1 (save for Sprint 2+)

- Landmarks / NPCs / exploration encounters in freeflight — Sprint 2
- Quest chain state machine — Sprint 3
- Mission template expansion from 8 → 90 — Sprint 2
- Card illustrations (AI image gen) — parallel track
- Shop expansion, wreck system, reputation UI — Sprint 3+
