---
name: Sprint 4 — Universe Wall + Warp + Quest Chains + Shop Tabs
description: Use this skill when building the Sprint 4 voidexa layer — public Universe Wall activity feed (Realtime subscription, formatter library, emit helpers for boss kills / speed records / debuts / mythic pulls), station-to-station warp system with holographic map UI and GHAI fuel costs, quest-chain system generalised from 1 to 5 starter chains (First Day Real Sky, Shape of Safe, Small Rescue Matters, Lantern Grave Rebuild, Bent Quorum), and shop expansion to 5 new tabs (Racing / Combat / Pilot / Packs / Premium) with cosmetic catalog + purchase flow. Trigger on "Sprint 4", "universe wall feed", "activity feed", "warp system", "holographic map", "warp gate", "quest chain system", "5 starter chains", "Shape of Safe", "Small Rescue Matters", "shop tabs", "racing tab", "premium items", or "cosmetic catalog".
---

# Sprint 4 — Universe Wall + Warp + Quest Chains + Shop Tabs

**Goal:** the universe stops feeling solo. Pilots see each other's wins, cross zones in seconds, follow a 5-chain narrative arc, and spend GHAI on 20+ new cosmetic items.

Companion doc: `docs/SPRINT4_CLAUDE.md` — file sizes, Supabase tables, per-task constraints, locked decisions.

Starting state: **502/502 tests passing**, Sprints 1 + 2 + 3 live on voidexa.com.

---

## Task 1 — Universe Wall activity feed

### Input
- Existing `universe_wall` table (`actor_user_id`, `actor_name`, `event_type`, `payload`, `created_at`). Sprint 3 extended `event_type` check with `mythic_pull`.
- Existing Sprint 3 Mythic-pull emit at `app/api/shop/open-pack/route.ts`.
- 4 completion paths that don't emit yet: `BattleResults`, `RaceResults`, `useActiveMission`, `DeliveryResults`.

### Output
- `lib/game/universeWall/events.ts` — pure `formatWallEvent(row)` handling every event_type with icons + text
- `lib/game/universeWall/emit.ts` — `emitBossDefeat`, `emitSpeedRecord`, `emitDebut` Supabase-insert helpers
- `components/universe-wall/UniverseWallFeed.tsx` — Realtime-subscribed feed (client), polling fallback
- `components/universe-wall/WallEventRow.tsx` — single row with icon + formatted text + relative timestamp
- `app/game/universe-wall/page.tsx` — full-page feed with pagination
- `app/game/page.tsx` — game landing with top 3 events + nav
- Embedded widget on `/game/profile/[userId]` — pilot's own events + 5 global

### Success criteria
- Complete a boss battle → row appears in `universe_wall` → `/game/universe-wall` renders it with "⚔ PilotName defeated {Boss}"
- Set a speed-run personal best → wall shows "🏁 PilotName set a new record on {Track}: mm:ss.cc"
- First mission completion for a new pilot → "⭐ PilotName just joined the fleet"
- Mythic pull (from Sprint 3) formats as "💎 PilotName just pulled {Mythic}! (N remaining)"
- Realtime subscription pushes new events to open viewers without page reload; falls back to 30s polling if Realtime errors

### Tests (required)
- `lib/game/universeWall/__tests__/events.test.ts`:
  - every event type formats into a non-empty string
  - Mythic pull formatter reads `payload.remaining` correctly
  - Boss defeat uses boss display names (Kestrel Reclaimer, The Lantern Auditor, etc.)
  - Speed record formats duration_ms as mm:ss.cc
  - Unknown event_type returns a safe fallback

---

## Task 2 — Warp system

### Input
- V3 PART 1 warp rules: known stations warp-eligible, GHAI fuel cost, Deep Void has no gates
- Sprint 2 landmarks + existing stations (5 from freeflight types)
- Sprint 3 `spendGhai({ source: 'warp', sourceId: ... })` helper

### Output
- `lib/game/warp/network.ts` — pure `buildWarpGraph()` returns warp-eligible nodes + `warpCost(from, to)` function (ceil distance × 0.3, clamp 30–180)
- `components/freeflight/HolographicMap.tsx` — 2D projection, destination selection, confirm modal
- `components/freeflight/WarpAnimation.tsx` — 2-second fade + streak + destination reveal
- `components/freeflight/useWarp.ts` — client hook: map-open / warping / cooldown state
- Extended `WarpGates.tsx` with proximity detection + "Press W" prompt
- Integration into `FreeFlightPage` — W keypress handler when near gate

### Success criteria
- Flying into a warp gate → "Press W to warp" prompt appears
- W → holographic map opens, current location pulses, all warp-enabled destinations listed with costs
- Pick destination with enough GHAI → confirm → 2s animation → ship at new position → GHAI balance updated
- Pick destination without enough GHAI → error "Need {N} GHAI, you have {M}"
- Try to warp twice within 30s → cooldown message, not a double-spend
- Deep Void destinations do NOT appear in the map
- `user_credits` balance decreases by exactly the quoted amount
- `ghai_transactions` has a debit row with `source='warp'`, unique `tx_signature`

### Tests (required)
- `lib/game/warp/__tests__/network.test.ts`:
  - `warpCost(a, a) === 0` (same-node case)
  - cost respects 30 minimum, 180 maximum
  - cost is symmetric: `warpCost(a, b) === warpCost(b, a)`
  - cost is deterministic: same pair always returns same number
  - Deep Void landmarks are excluded from the graph
  - graph has at least 10 warp-eligible nodes (Core + Inner Ring + Mid Ring)

---

## Task 3 — Quest chain system + 5 starter chains

### Input
- Sprint 3 Task 1 `useActiveQuestChain` (single-chain version)
- `VOIDEXA_UNIVERSE_CONTENT.md` SECTION 4 chains #1–5

### Output
- `lib/game/quests/chains/` directory:
  - `firstDayRealSky.ts` (moved from Sprint 3)
  - `shapeOfSafe.ts` (NEW — Claude + Perplexity)
  - `smallRescueMatters.ts` (NEW — Gemini + GPT)
  - `lanternGraveRebuild.ts` (NEW)
  - `bentQuorum.ts` (NEW)
  - `index.ts` (registry + linear unlock order)
- Generalised `lib/game/quests/progress.ts` — `useActiveQuestChains()` returns ALL active chains, not just one
- `app/game/quests/page.tsx` — 5-chain catalog page with status pills (locked / active / completed)
- `components/quests/QuestCatalogClient.tsx` — list with progress bars
- Extended `TutorialGuide.tsx` to stack multiple active chains

### Success criteria
- `/game/quests` lists all 5 chains with distinct cover styling
- Fresh pilot: only First Day Real Sky is active, 4 are locked
- Complete First Day Real Sky → Shape of Safe auto-unlocks (new step shows in TutorialGuide)
- Trigger events from 2 overlapping active chains resolve correctly (e.g. both chains waiting on `mission_complete:x` — the chain that's earlier in the unlock order wins)
- Each chain's final reward grants its specific title into `pilot_reputation.composed_title`
- Chain advancement is idempotent — re-firing the same trigger does not double-credit

### Tests (required)
- `lib/game/quests/__tests__/chains.test.ts`:
  - all 5 chains registered
  - chain unlock order is a strict linear sequence
  - no duplicate step ids across chains
  - every mission id referenced in chain steps resolves via `getMissionById`
  - every chain's final reward has `ghai > 0` and a `title`
- `lib/game/quests/__tests__/progress.test.ts`:
  - trigger advancing the correct chain when multiple are active
  - unlock gate blocks subsequent chains until prerequisite is complete

---

## Task 4 — Shop expansion (5 new tabs)

### Input
- Existing `/shop` (ship skins) + `/shop/packs` (Sprint 3)
- V3 PART 8 shop tab spec + premium items table

### Output
- `lib/game/shop/types.ts` — `CosmeticCategory`, `CosmeticSlot`, `CosmeticDef` types
- `lib/game/shop/catalog.ts` — ~20 items seeded across 4 new tabs (Racing/Combat/Pilot/Premium)
- `components/shop/ShopTabs.tsx` — tab navigation (reflects URL query `?tab=`)
- `components/shop/CosmeticTab.tsx` — generic list for Racing/Combat/Pilot/Premium
- `components/shop/CosmeticPurchaseModal.tsx` — confirm + spendGhai + user_cosmetics insert + toast
- Supabase table `user_cosmetics(user_id, cosmetic_id, equipped, acquired_at)` with RLS
- `app/shop/page.tsx` updated to host the tab bar

### Success criteria
- `/shop` shows 6 tabs (Ships · Racing · Combat · Pilot · Packs · Premium)
- Click Racing → 5 items listed with prices
- Purchase one → confirm modal → GHAI deducted → item appears in "Owned" state → `user_cosmetics` row inserted
- Re-purchase the same item → blocked with "already owned"
- Equip toggle on owned item → only one per slot active at a time (pure UI state for Sprint 4)
- `/shop?tab=premium` deep-links to Premium tab

### Tests (required)
- `lib/game/shop/__tests__/catalog.test.ts`:
  - catalog has entries for all 4 new tabs
  - every item has id / name / category / slot / price / description
  - every price is in 100–5000 GHAI range
  - no duplicate ids
  - at least 5 items per tab

---

## Overall success criteria (ship gate)

When Sprint 4 is done:

1. **Universe Wall live** — a boss kill, speed record, or mythic pull appears on `/game/universe-wall` within seconds
2. **Warp works end-to-end** — from any warp gate, the player can pick a destination, spend GHAI, and arrive
3. **5 quest chains live** — a new pilot can finish First Day → Shape of Safe → Small Rescue Matters in order, each granting a title
4. **Shop has 6 tabs** — 20+ cosmetics purchasable, at least 4 tabs populated
5. **Tests green** — full suite stays ≥530 (was 502), no regressions
6. **Build clean** — `npm run build` only shows pre-existing bigint warning
7. **Deployed** — one final `git push origin main`

## Non-goals

- Remaining 15 quest chains (Sprint 5+)
- Subscription products (insurance, matchmaking, scanner)
- The Hive Champion skin + Hive record mechanic
- 3D visual integration of equipped cosmetics (Sprint 5)
- PvP, Void Duel, Void Prix (post-MVP)
- Wreck recovery system
- Player-to-player trading

## Pre-work

1. **Git backup first.** Tag current head as `pre-sprint4-<date>`. One-line rollback if any task derails.
2. Read `docs/SPRINT4_CLAUDE.md` end-to-end.
3. Verify `universe_wall` + `pilot_reputation` + `ghai_transactions` tables still exist with Sprint 3 extensions.
4. Run `mcp__claude_ai_Supabase__list_tables` before creating `user_cosmetics`.

## Commit style

4 separate commits — each task touches distinct files:

- `feat(sprint4): Universe Wall activity feed with Realtime subscription`
- `feat(sprint4): station-to-station warp with holographic map`
- `feat(sprint4): quest chain system + 5 starter chains`
- `feat(sprint4): shop expansion — Racing, Combat, Pilot, Premium tabs`

Each commit: `npm run build` + `npm run test` green before landing. No skip-ci, no `--no-verify`.
