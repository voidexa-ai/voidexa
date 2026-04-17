# Sprint 4 — Claude Code Instructions

Sprint 4 goal: **the universe becomes visibly alive + deeply navigable.**
Sprint 3 gave new pilots a tutorial, economy, drops, and a profile. Sprint 4 wires
those individual pilot moments into a **public feed**, gives them a **fast-travel network** to
cross 5 zone shells in seconds, expands the **narrative scaffolding** from 1 tutorial chain to 5 real
chains, and fills out the **shop** with the 5 remaining tabs designed in V3.

---

## Context — what's built

Shipped and live on voidexa.com at the start of Sprint 4:

| Phase | Surface | Commit |
|---|---|---|
| A1 | 16 Supabase gaming tables + RLS + 26 baseline cards + balance validator | `fdf9760` |
| 1b | `/game/mission-board` + `/game/cards/deck-builder` + Dream Mode | `9e1adfb` |
| 2 | `/game/speed-run` — 3 tracks, power-ups, leaderboard | `0ff4522` |
| 3 | `/game/hauling` — 6 contracts, encounter system, delivery grading | `4bfd1f1` |
| 4a | PvE battle engine + Tier 1–5 + Kestrel boss + 27 tests | `4d0a486` |
| 4b | `/game/battle` — 3D scene, card hand, HUD, turn flow | `5d4ad07` |
| Sprint 1 | 257-card library + 4 bosses + mission→freeflight wire + GHAI credit | `2a3c902`, `7bf6d50` |
| Sprint 2 | 20 landmarks + 10 NPCs + 15 exploration encounters + 90-mission catalog | `e36377a`, `35be64a`, `c953638`, `f15643c` |
| Sprint 3 | First Day Real Sky tutorial + booster packs + card drops + pilot profile | `dfc3d51`, `3eddef6`, `9e026fc`, `02fdfc3` |

Test suite: **502/502 green**. Deploy: `git push origin main` → Vercel auto-deploys.

**Key Sprint 3 handoff points:**
- Sprint 3 Task 2 inserts `universe_wall` rows on Mythic pulls — rows exist, no feed renders them yet. **Sprint 4 Task 1 renders them.**
- Warp gates exist in freeflight as 3D objects (`WarpGates.tsx`) but there's no holographic-map UI, no GHAI cost, no station-to-station warp choice. **Sprint 4 Task 2 builds that.**
- Sprint 3 Task 1 built the quest-chain primitive (`useActiveQuestChain` + `user_quest_progress`) for ONE chain (First Day Real Sky). **Sprint 4 Task 3 generalises it to 5 chains.**
- `/shop` currently has ship skin categories + Sprint 3's `/shop/packs`. The 5 other tab designs from V3 PART 8 exist on paper, not in code. **Sprint 4 Task 4 ships them.**

---

## Sprint 4 scope — 4 tasks

### Task 1 — Universe Wall activity feed

**Current state:**
- `universe_wall` table exists with `actor_user_id`, `actor_name`, `event_type` (now includes `mythic_pull` after Sprint 3), `payload` JSONB, `created_at`.
- Mythic pulls already insert rows (Sprint 3 Task 2).
- Mission, speed-run, hauling, battle completions do NOT write to the wall yet.
- No UI renders the feed.

**Required:**
1. **Event emitter integration** — extend the 4 completion paths to write wall events:
   - Boss victories (`battle_sessions.boss_template` ∈ boss set) → `boss_defeat` event with `payload.boss` + `payload.tier`
   - Personal-best speed-run times → `speed_record` event with `payload.track` + `payload.duration_ms`
   - First mission completion by a pilot (debut) → `debut` event
   - Existing Mythic pull (Sprint 3) stays unchanged
2. **Feed component** — `UniverseWallFeed` — a scrollable list of events with formatted lines:
   - "⚔ PilotName defeated Kestrel Reclaimer (Tier 3)"
   - "🏁 PilotName set a new record on Core Circuit: 02:47.33"
   - "💎 PilotName just pulled Temporal Loop! (49 remaining)"
   - "⭐ PilotName just joined the fleet"
3. **Where it lives:**
   - Full-page feed at `/game/universe-wall`
   - Collapsible sidebar widget on `/game/profile/[userId]` (shows the viewed pilot's own events + 5 recent global events)
   - A compact "3 latest events" strip at the top of `/game` (if that landing page exists — otherwise new `/game/page.tsx` scaffolded in this task)
4. **Live updates** — Supabase Realtime subscription to `universe_wall` new rows. Fall back to 30-second polling if Realtime fails.
5. **Pagination** — 25 rows per page, "Load more" pattern.

**Files touched:**
- `lib/game/universeWall/events.ts` — NEW, pure event-formatter library (`formatWallEvent(row) → string`)
- `lib/game/universeWall/emit.ts` — NEW, thin helpers `emitBossDefeat(...)`, `emitSpeedRecord(...)`, `emitDebut(...)` that insert into the table
- `components/universe-wall/UniverseWallFeed.tsx` — NEW, Realtime-subscribed feed (≤300 lines)
- `components/universe-wall/WallEventRow.tsx` — NEW, single-row formatter + icon + timestamp
- `app/game/universe-wall/page.tsx` — NEW, full-page feed
- `app/game/page.tsx` — NEW or updated, shows top 3 events + nav to `/game/universe-wall`
- `app/game/profile/[userId]/page.tsx` — mount the sidebar widget
- `components/game/battle/BattleResults.tsx` — emit on boss victory
- `components/game/speedrun/RaceResults.tsx` — emit on personal best
- `components/freeflight/useActiveMission.ts` — emit on first-ever mission completion
- `lib/game/universeWall/__tests__/events.test.ts` — NEW, validates formatter output for every event type

**Constraints:**
- Realtime subscription is a **client component only**. Wrap with `'use client'` and gracefully degrade to polling.
- Event formatting is pure — don't call Supabase inside `formatWallEvent`. Query once, format many.
- A pilot viewing their own profile should see a blended feed: their own events interleaved with 5 global recent events so a new pilot doesn't stare at an empty wall.
- Boss-defeat events only fire when `boss_template` matches the 5 known boss ids (`kestrel`, `lantern_auditor`, `varka`, `choir_sight`, `patient_wreck`). Tier-N battles don't flood the wall.

---

### Task 2 — Warp system

**Current state:**
- `WarpGates.tsx` renders 2 warp-gate 3D objects in freeflight. Flying close to one does nothing useful.
- V3 line 191: "Known stations have warp gates. Warp cuts travel time but costs GHAI fuel. You can always fly manually for free — warp is convenience, not necessity."
- V3 line 198: "Deep Void has no warp gates. Must fly manually."
- 20 landmarks from Sprint 2 + 5 existing stations. Many are warp-gate-eligible (Core + Inner Ring), Deep Void ones are not.

**Required:**
1. **Warp eligibility** — tag each station/landmark with a `warpEnabled` boolean. Core + Inner Ring + Mid Ring = enabled. Outer Ring + Deep Void = disabled (must fly manually per V3).
2. **Holographic map UI** — opens when the player approaches a warp gate and presses W:
   - 2D top-down projection of the universe showing all warp-enabled destinations
   - Current location marked with a pulsing cyan dot
   - Click a destination → confirm modal with GHAI cost (distance-scaled)
   - "Manual flight is free · Warp costs 30–180 GHAI depending on distance" hint
3. **Warp cost formula** — `ceil(distance_world_units * 0.3)` with a minimum of 30 GHAI and a maximum of 180. Deterministic per station pair.
4. **Warp animation** — 2-second transition:
   - Screen fades to white/blue
   - Stars blur into streaks
   - Fade back to the ship now positioned at the destination station
5. **GHAI deduction** — uses Sprint 3's `spendGhai` helper with `source: 'warp'`, `sourceId: <warp_transaction_uuid>`. Idempotent.
6. **Cooldown** — 30-second cooldown between warps (prevents spam-travel glitches during dev). Store locally in a ref.

**Files touched:**
- `lib/game/warp/network.ts` — NEW, station-to-station warp graph + distance-based cost calc (pure)
- `lib/game/warp/__tests__/network.test.ts` — NEW, cost formula tests + eligibility assertions
- `components/freeflight/HolographicMap.tsx` — NEW, 2D canvas/SVG top-down projection (≤300 lines)
- `components/freeflight/WarpAnimation.tsx` — NEW, full-screen transition (≤150 lines)
- `components/freeflight/useWarp.ts` — NEW, client hook managing state: map-open / warp-in-progress / cooldown
- `components/freeflight/environment/WarpGates.tsx` — extend: proximity detection → show "Press W" prompt
- `components/freeflight/FreeFlightPage.tsx` — mount HolographicMap + WarpAnimation, wire `W` keypress

**Constraints:**
- Warp animation must not block input — a cancel/abort is allowed during the first 500ms (before the actual position swap).
- Insufficient GHAI → show "Not enough GHAI" in the confirm modal, don't execute warp.
- **Teleport safety** — the ship's position snap must respect planet collision + station docking state. Warp to a station places the ship at `station.position + offset` (not inside the station mesh).

---

### Task 3 — Quest chain system + 5 starter chains

**Current state:**
- Sprint 3 Task 1 built `useActiveQuestChain` for First Day Real Sky (chain id `first_day_real_sky`). The hook reads `user_quest_progress`, advances on trigger events, credits final reward.
- 19 more chains exist as design specs in `VOIDEXA_UNIVERSE_CONTENT.md` SECTION 4 — only the first chain is implemented.

**Required:**
1. **Generalise the quest engine** to support multiple chains simultaneously:
   - A pilot can have multiple chains active at once (e.g. First Day Real Sky + The Shape of Safe)
   - UI shows all active chains in a stack in the tutorial side panel
   - Completing one chain auto-unlocks the next in the linear arc (First Day → Shape of Safe → Small Rescue Matters → Lantern Grave Rebuild → Bent Quorum)
2. **Rename + refactor** — `lib/game/quests/firstDayRealSky.ts` → `lib/game/quests/chains/` directory with one file per chain + a `chains/index.ts` that exports the union.
3. **5 starter chains** implemented end-to-end:
   - **First Day, Real Sky** — ALREADY DONE (Sprint 3), move to new directory
   - **The Shape of Safe** (Claude, Perplexity) — 4 missions: Courier → Signal → Rush → Final safe-lane test. Reward: "Patient Course" title.
   - **A Small Rescue Matters** (Gemini, GPT) — 4 missions: Recovery → Signal → Courier → Hunt-Escort. Reward: "Soft Hands" title + Rescue Beacon Charm cosmetic.
   - **The Lantern Grave Rebuild** — 5 missions: Recovery → Courier → Signal → Hunt → Rush. Reward: Relit Wake Beacon Trail cosmetic + Beaconheart Relay card.
   - **Bent Quorum, Unfinished Meeting** — 5 missions: Signal → Recovery → Hunt → Courier → Signal. Reward: "Closer of Motions" title.
4. **Linear unlock chain** — each chain's first step checks "previous chain complete" before it becomes available. First Day Real Sky has no prerequisite.
5. **Chain catalog + progression UI** — `/game/quests` page listing all 5 chains, showing locked / active / completed states with step progress bars.

**Files touched:**
- `lib/game/quests/chains/firstDayRealSky.ts` — MOVED from `lib/game/quests/firstDayRealSky.ts`
- `lib/game/quests/chains/shapeOfSafe.ts` — NEW
- `lib/game/quests/chains/smallRescueMatters.ts` — NEW
- `lib/game/quests/chains/lanternGraveRebuild.ts` — NEW
- `lib/game/quests/chains/bentQuorum.ts` — NEW
- `lib/game/quests/chains/index.ts` — NEW, registry + unlock order
- `lib/game/quests/progress.ts` — extend to handle N chains instead of 1
- `components/freeflight/TutorialGuide.tsx` — render stack of active chains
- `app/game/quests/page.tsx` — NEW, catalog view (≤100 lines)
- `components/quests/QuestCatalogClient.tsx` — NEW, 5-chain list with progress bars
- `lib/game/quests/__tests__/chains.test.ts` — NEW, validates chain registry, unlock order, trigger uniqueness across chains

**Constraints:**
- Trigger targets across chains must be **disambiguated** — if two chains have a step that fires on mission_complete with the same mission id, only the active chain advances. Idempotency stays per-step.
- Cast dialogue uses V3 issuer ids (jix/claude/gpt/gemini/perplexity/llama). For chain #3 "A Small Rescue Matters" supporting Cast is Gemini+GPT. For #2 "Shape of Safe" is Claude+Perplexity. Do not invent new Cast members.
- The mission ids referenced in each chain must resolve to real missions — use `getMissionById` to assert at module load (throw in dev if a chain references a missing id).

---

### Task 4 — Shop expansion (5 new tabs)

**Current state:**
- `/shop` has cosmetic ship-skin categories + `/shop/packs` from Sprint 3.
- V3 PART 8 spec: 7 shop tabs (Ships, Racing, Combat, Pilot, Consumables, Packs, Premium). Ships + Packs exist. Consumables needs no separate tab for Sprint 4.
- V3 Premium items table defines:
  - Legendary ship trail 2000–5000
  - Custom cockpit interior 1500–3000
  - Holographic ship badge 1000–2000
  - Named asteroid (prestige) 5000
  - The Hive Champion skin 3000 (requires Hive record — out of scope)
  - Insurance 200/month, Priority matchmaking 100/month, Scanner extension 50/month (subscriptions — out of scope for Sprint 4)

**Required:**
1. Tab bar in `/shop` showing: **Ships · Racing · Combat · Pilot · Packs · Premium** (Consumables folded into Pilot as utility items for Sprint 4).
2. Per-tab item lists (seeded catalog, not dynamic):
   - **Racing** — 5 items: blue/red/gold engine glow (300/500/1200 GHAI), finish-line victory effect (800 GHAI), boost afterburner plume (600 GHAI)
   - **Combat** — 5 items: 3 card sleeve styles (400/600/900 GHAI), battle camera shake toggle (200 GHAI), victory pose animation (700 GHAI)
   - **Pilot** — 5 items: 3 pilot avatars (300 GHAI each), title slot expansion (800 GHAI), profile background (500 GHAI)
   - **Packs** — reuse existing `/shop/packs` content via a tab link (no duplicate UI)
   - **Premium** — 4 items from V3: Legendary ship trail (3500 GHAI average), Custom cockpit interior (2200 GHAI), Holographic ship badge (1500 GHAI), Named asteroid (5000 GHAI)
3. Purchase flow reuses Sprint 3's `spendGhai` helper — all cosmetic purchases credit into a new `user_cosmetics(user_id, cosmetic_id, equipped, acquired_at)` table.
4. "Equipped" toggle — only one cosmetic per slot can be equipped at a time. Slots: engine_glow, card_sleeve, avatar, badge, cockpit_interior, named_asteroid, victory_effect, etc.

**Files touched:**
- `lib/game/shop/catalog.ts` — NEW, hand-authored cosmetic item list with id / name / category / slot / price / description
- `lib/game/shop/types.ts` — NEW, `CosmeticCategory`, `CosmeticSlot`, `CosmeticDef` types
- `app/shop/page.tsx` — update to show tab navigation
- `components/shop/ShopTabs.tsx` — NEW, tab bar
- `components/shop/CosmeticTab.tsx` — NEW, generic list component for Racing/Combat/Pilot/Premium
- `components/shop/CosmeticPurchaseModal.tsx` — NEW, confirm + spendGhai + toast
- `supabase/migrations/<ts>_user_cosmetics.sql` — NEW, per-user owned + equipped cosmetics table
- `lib/game/shop/__tests__/catalog.test.ts` — NEW, validates catalog shape + pricing bands

**Constraints:**
- All purchases go through `spendGhai({ source: 'module_purchase', sourceId: <cosmetic_id> })` — one cosmetic id can only be bought once per pilot (idempotency).
- "Equipped" is a pure UI state for Sprint 4 — no 3D visual integration in freeflight yet (that's Sprint 5+).
- Shop tabs respect URL state: `/shop?tab=racing` deep-links to the Racing tab. Next.js route group under `/shop/[tab]` is acceptable too.

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
- Every `process.env.*` read must be `.trim()`'d

### Deploy
- `git push origin main` — Vercel auto-deploys.
- **Git backup first** — tag `pre-sprint4-<date>`.

### Test discipline
- `npm run build` after each task
- Full test suite stays green. Baseline **502**. Sprint 4 targets ~530+.
- Every new lib file gets shape + behaviour tests.

### Per-task verification checkpoints
1. After Task 1: `/game/universe-wall` renders 3+ formatted events (seeded test data OK), `npm run build` green
2. After Task 2: Approach warp gate → W opens map → pick destination → ship teleports with animation → GHAI deducted in `user_credits`
3. After Task 3: `/game/quests` shows 5 chains (1 active, 4 locked for brand-new pilot), completing First Day unlocks Shape of Safe
4. After Task 4: `/shop?tab=racing` shows 5 Racing items, purchase one → GHAI deducted → `user_cosmetics` row inserted

Stop on failure. Don't stack.

---

## Files touched summary

| Area | New | Modified |
|---|---|---|
| Task 1 — Universe Wall | `lib/game/universeWall/{events,emit}.ts` + tests, `components/universe-wall/{UniverseWallFeed,WallEventRow}.tsx`, `app/game/universe-wall/page.tsx`, `app/game/page.tsx` | `BattleResults.tsx`, `RaceResults.tsx`, `useActiveMission.ts`, `app/game/profile/[userId]/page.tsx` |
| Task 2 — Warp system | `lib/game/warp/network.ts` + tests, `components/freeflight/{HolographicMap,WarpAnimation,useWarp}.tsx` | `WarpGates.tsx`, `FreeFlightPage.tsx` |
| Task 3 — Quest chains | `lib/game/quests/chains/` directory with 5 chain files + index + tests, `app/game/quests/page.tsx`, `components/quests/QuestCatalogClient.tsx` | `lib/game/quests/progress.ts`, `TutorialGuide.tsx`, delete old `firstDayRealSky.ts` |
| Task 4 — Shop tabs | `lib/game/shop/{types,catalog}.ts` + tests, `components/shop/{ShopTabs,CosmeticTab,CosmeticPurchaseModal}.tsx`, migration for `user_cosmetics` | `app/shop/page.tsx` |

---

## Supabase tables in play

| Table | Notes |
|---|---|
| `universe_wall` | Existing. Task 1 reads + writes. Event types extended in Sprint 3 with `mythic_pull`. |
| `ghai_transactions` | Existing. Task 2 writes debit rows via `spendGhai` for warps. Task 4 same for cosmetics. |
| `user_credits` | Existing. Tasks 2 + 4 decrement. |
| `user_quest_progress` | Existing. Task 3 writes completion rows for all 5 chains. |
| `pilot_reputation` | Existing. Task 3 updates `composed_title` on chain completion (5 new titles). |
| `user_cosmetics` | **NEW** in Task 4. `(user_id, cosmetic_id)` primary key, `equipped` bool, `acquired_at`. RLS: own select/insert/update. |

**Check before creating `user_cosmetics`** — `mcp__claude_ai_Supabase__list_tables` first.

---

## Locked decisions (unchanged from Sprint 1/2/3)

- **GHAI is a platform credit.** $1 USD = 100 GHAI. `ghai_balance_platform` column. No crypto.
- **5 zone shells**: Core → Inner Ring → Mid Ring → Outer Ring → Deep Void.
- **Cast = contract issuers, not playable.** Task 3 quest issuers are all from the Cast set.
- **Bob is the free starter ship.** Soulbound.
- **Deep Void has no warp gates.** Must fly manually. Task 2 excludes Deep Void landmarks from the warp graph.
- **No pay-to-win.** Shop is cosmetics + convenience. Consumables and premium cosmetics don't affect gameplay stats.
- **Mythic cap = 50 per card.** Supply-tracked.

---

## Out of scope for Sprint 4 (Sprint 5+)

- Remaining 15 quest chains (chains 6–20 in SECTION 4)
- Subscription products (Insurance / Priority matchmaking / Scanner range extension)
- The Hive Champion skin (requires Hive record mechanic — separate system)
- PvP card battle, Void Duel, Void Prix (post-MVP)
- Wreck recovery system
- Player-to-player card trading
- AI-generated quest rewards
- Remaining landmarks / NPCs / exploration encounters
- 3D visual integration of equipped cosmetics (trails, cockpit interiors render in freeflight) — Sprint 5
