# Sprint 3 — Claude Code Instructions

Sprint 3 goal: **new-player onboarding + economy flow.**
Sprint 1 closed the playable loop. Sprint 2 filled freeflight with content.
Sprint 3 makes the first hour survivable for a new pilot — a scripted tutorial,
a real shop to spend GHAI in, card drops that feel earned, and a profile page that proves the universe remembers them.

---

## Context — what's built

Shipped and live on voidexa.com at the start of Sprint 3:

| Phase | Surface | Commit |
|---|---|---|
| A1 | 16 Supabase gaming tables + RLS + 26 baseline cards + balance validator | `fdf9760` |
| 1b | `/game/mission-board` + `/game/cards/deck-builder` with Dream Mode | `9e1adfb` |
| 2 | `/game/speed-run` — 3 tracks, power-ups, leaderboard | `0ff4522` |
| 3 | `/game/hauling` — 6 contracts, encounter system, delivery grading | `4bfd1f1` |
| 4a | PvE card battle engine + Tier 1–5 + Kestrel boss + 27 tests | `4d0a486` |
| 4b | `/game/battle` — 3D scene, card hand, HUD, turn flow, card drops | `5d4ad07` |
| Sprint 1 | 257-card library + 4 bosses + mission→freeflight wire + unified `creditGhai` | `2a3c902`, `7bf6d50` |
| Sprint 2 | 20 landmarks + 10 NPCs + 15 exploration encounters + 90-mission catalog | `e36377a`, `35be64a`, `c953638`, `f15643c` |

Test suite: **456/456 green**. Deploy: `git push origin main` → Vercel auto-deploy.

What a new pilot sees today:
- Mission board with 90 missions, but no narrative guidance on which to pick first.
- Freeflight with 20 landmarks, 10 NPCs, and 15 encounters, but no scripted "do this first" prompt.
- Deck builder with 257 cards, most unowned.
- Battle against Tier 1–5 and 5 bosses.
- Empty profile. No proof anything they did happened. Nowhere to spend the GHAI they earn.

Sprint 3 fills the four gaps that make the game feel real over a 60-minute arc.

---

## Sprint 3 scope — 4 tasks

### Task 1 — First Day Real Sky onboarding tutorial

**Current state:**
- No tutorial. New pilot lands on `/freeflight` with a ship picker and no guidance.
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` SECTION 4 specifies "First Day, Real Sky" — a 4-mission chain issued by Jix (supporting GPT, Gemini), each with objective, Cast dialogue, and final reward "Licensed Breather" title + Halo Starter Stripe cosmetic + 600 GHAI bonus.
- `user_quest_progress` + `quest_templates` tables exist from Phase A1 (unused).

**Required:**
1. Seed 4 quest_template rows for First Day Real Sky:
   - **Loop Once, Breathe Once** (Rush, 4–6 min, 180 GHAI) — tutorial loop on Bob's First Loop
   - **Coffee to Dock Nine** (Courier, 5–7 min, 240 GHAI) — delivery to Dock Nine-Lark with cargo-integrity check
   - **Three Clean Pings** (Signal, 6–8 min, 300 GHAI) — scan 3 nav nodes, upload to Saffron Relay
   - **Loose Drone, Short Work** (Hunt, 7–10 min, 420 GHAI) — neutralize 6 rogue drones near Echo Gymnasium (first battle intro)
2. A `TutorialGuide` component in `/freeflight` that appears for new pilots:
   - Persistent sidebar-style panel showing current quest + objective + Cast line
   - Hides when quest chain is complete
   - Skippable via `localStorage` flag — don't force it on returning players, but the panel reappears if their `user_quest_progress` shows no `first_day_real_sky_*` entries completed
3. Per-quest success detection hooks into existing systems:
   - Loop Once → reuse speed-run track "Core Circuit" par time detection (or a narrower tutorial target) via the speed-run `RaceResults` flow
   - Coffee to Dock Nine → reuse mission-acceptance flow, custom mission id `first_day_coffee`
   - Three Clean Pings → reuse landmark scanning flow (Saffron Relay + 2 others already-scanned)
   - Loose Drone → reuse `/game/battle` Tier 1 encounter with a custom entry point tagged `first_day_drones`
4. Completion of all 4 → write `user_quest_progress` completion row + credit 600 GHAI bonus via `creditGhai` (`source: 'quest'`, `sourceId: 'first_day_real_sky'`) + unlock the "Licensed Breather" title in `pilot_reputation.composed_title`
5. Cast dialogue uses the doc's exact lines:
   - Jix: "Don't overthink the ship. Fly it." / "Breathe once. Then move."
   - Jix: "Congratulations. You can now be trusted with coffee."
   - GPT: "Scanning is not passive. It is awareness."
   - GPT: "Simple targets. Don't decorate the engagement."

**Files touched:**
- `lib/game/quests/firstDayRealSky.ts` — NEW, 4-quest chain definition with triggers + Cast dialogue
- `lib/game/quests/progress.ts` — NEW, reads `user_quest_progress`, exposes `useActiveQuestChain()` hook
- `components/freeflight/TutorialGuide.tsx` — NEW, the persistent side panel (≤300 lines)
- `components/freeflight/FreeFlightPage.tsx` — mount `TutorialGuide` when a chain is active
- `supabase/migrations/<ts>_first_day_real_sky_quests.sql` — inserts quest_template rows
- `lib/game/quests/__tests__/firstDayRealSky.test.ts` — NEW, validates chain definition shape
- Hooks into existing completion paths:
  - `components/game/speedrun/RaceResults.tsx` — on speed-run save, check if current chain step is "Loop Once" and mark complete
  - `app/game/mission-board/MissionBoardClient.tsx` — on mission accept that matches `first_day_coffee`, track
  - `components/freeflight/useActiveMission.ts` — on mission complete, advance chain
  - `components/freeflight/FreeFlightPage.tsx` — landmark scan → advance "Three Clean Pings"
  - `components/game/battle/BattleResults.tsx` — on Tier 1 victory, advance "Loose Drone"

**Constraints:**
- The tutorial must be **opt-out, not mandatory** — a "Skip tutorial" button in TutorialGuide lands the player back to open freeflight with a `tutorial_skipped=true` localStorage flag
- No hard blocks on gameplay. Players can ignore the tutorial and still fly, accept other missions, enter battle. The tutorial just doesn't advance.
- Each step update must be idempotent — if a pilot scans Saffron Relay twice, don't double-fire the chain step

---

### Task 2 — Booster pack shop

**Current state:**
- `/shop` exists but sells ship skins / cosmetics. No card packs.
- V3 PART 5 defines 3 pack tiers with exact drop rates:
  - **Standard Pack** — 100 GHAI — 5 cards, 4 Common + 1 Uncommon+
  - **Premium Pack** — 300 GHAI — 5 cards, 3 Common + 1 Uncommon + 1 Rare+
  - **Legendary Pack** — 1000 GHAI — 5 cards, 2 Uncommon + 2 Rare + 1 Legendary chance
  - All packs have **0.1% Mythic chance** in their best slot
- Mythic cap: **50 copies per mythic card exist in the universe**. When a mythic is pulled, the remaining count decreases. When 0, that mythic is trade-only.
- No `card_packs`, `pack_openings`, or `mythic_supply` tables exist yet.

**Required:**
1. New route `/shop/packs` (or integrate into `/shop` as a tab) rendering 3 pack cards with GHAI prices and drop-rate hints
2. Purchase flow:
   - Click pack → confirm modal "Open 1 Standard Pack for 100 GHAI?" → deduct GHAI via a new `lib/credits/deduct.ts` helper (mirror of `creditGhai` for spending) → generate 5 cards server-side-equivalent → grant to `user_cards` → show opening animation
3. Pack opening animation:
   - Full-screen black overlay
   - Card-by-card reveal with rarity glow (framer-motion, ~600ms per card)
   - Mythic pull = dramatic pause + "Universe Wall announcement" toast format ("Pilot [name] just pulled [MYTHIC CARD]! (N remaining)")
4. Drop-rate generator pure function `rollPack(tier, rng)` that returns 5 `CardTemplate` ids respecting the rarity distribution + Mythic 0.1% chance in best slot, respecting remaining Mythic supply
5. Mythic supply tracking:
   - Table `mythic_supply(card_id text primary key, total_minted int, pulled int)` — seed with all Mythic cards at `total_minted=50, pulled=0`
   - Atomic decrement on pull: `UPDATE ... SET pulled = pulled + 1 WHERE pulled < total_minted RETURNING pulled` — if no row returned, reroll to next rarity tier
   - Universe Wall row inserted on successful Mythic pull

**Files touched:**
- `lib/game/packs/types.ts` — NEW, PackTier, PackResult types
- `lib/game/packs/rollPack.ts` — NEW, pure function for pack content generation
- `lib/game/packs/__tests__/rollPack.test.ts` — NEW, stats validation (10k-roll test that Standard yields ~80% Common, etc.)
- `lib/credits/deduct.ts` — NEW (mirror of `credit.ts`), idempotent GHAI spend with `ghai_transactions` reuse
- `app/shop/packs/page.tsx` — NEW, thin page wrapper
- `components/shop/PackShopClient.tsx` — NEW, 3 pack cards + purchase flow
- `components/shop/PackOpeningAnimation.tsx` — NEW, the reveal sequence
- `supabase/migrations/<ts>_mythic_supply.sql` — NEW table + seed rows
- `app/api/shop/open-pack/route.ts` — NEW, server-side pack roll + mythic supply decrement + card grant (use Supabase service role)

**Constraints:**
- **Pack rolling must happen server-side** so client can't cheat by re-rolling. API route validates GHAI balance, decrements mythic supply atomically, returns the 5 card ids.
- If the roll selects a Mythic but supply is 0, the roller downgrades to Legendary — never fail the whole pack.
- GHAI deduction uses `ghai_transactions` with `type='debit'`, `product='pack_standard' | 'pack_premium' | 'pack_legendary'`, `tx_signature` = unique pack-open id. Idempotent so double-click doesn't double-charge.
- Mythic toast announcement is local-only in Sprint 3 — Universe Wall wire-through is Sprint 4 (just insert the row, don't build the feed UI).

---

### Task 3 — Card drops from gameplay

**Current state:**
- `BattleResults.tsx` already grants 1 random card on battle victory (Phase 4b).
- Mission, speed-run, and hauling completion: **no card drops**. Only GHAI credits (Sprint 1).
- Loot table design not written anywhere — every caller just picks a random template.

**Required:**
1. Centralised `lib/game/loot/table.ts`:
   - `rollLootCard(source: 'mission' | 'speedrun' | 'hauling' | 'battle', tier: number | 'low' | 'mid' | 'high', rng?)` — returns `{ card, rarity } | null` (null = no drop, which is sometimes the right answer)
   - Drop chance schedule:
     - Mission completion (by grade): Bronze 20% common, Silver 40% common/uncommon, Gold 65% uncommon/rare
     - Speed run save: Bronze 15% common, Silver 30% common/uncommon, Gold 55% uncommon/rare
     - Hauling delivery: Bronze 20% common, Silver 35% common/uncommon, Gold 50% uncommon/rare
     - Battle victory: Tier 1 = 80% common, Tier 5 = 30% rare + 15% legendary, boss = guaranteed rare + 20% legendary + 0.1% mythic from loot pool (not pack pool)
   - All rolls respect the Mythic supply cap (share code with Task 2)
2. Unified `CardDropReveal` component — small toast-like widget bottom-right of any results screen showing "NEW CARD · {name} · {rarity}" with rarity glow, 3s auto-dismiss
3. Wire into 4 call sites:
   - `RaceResults` — after save, call `rollLootCard('speedrun', grade)` → if card, grant via `user_cards` upsert + show reveal
   - `DeliveryResults` — after finalize, roll for hauling
   - `useActiveMission` (Sprint 1 hook) — after mission completion, roll for mission
   - `BattleResults` — replace the ad-hoc picker with `rollLootCard('battle', tierOrBossId)`
4. Idempotency: drop decisions are deterministic per `source_id` (mission_acceptance id, speedrun_time id, etc.) — if the UI re-renders, don't re-roll a new card. Seed the RNG with a hash of the source_id.

**Files touched:**
- `lib/game/loot/table.ts` — NEW, rollLootCard + drop schedule constants
- `lib/game/loot/__tests__/table.test.ts` — NEW, drop-rate sanity checks (per-activity test with 10k rolls asserting bounds)
- `components/ui/CardDropReveal.tsx` — NEW, shared reveal component
- `components/game/speedrun/RaceResults.tsx` — wire drop
- `components/game/hauling/DeliveryResults.tsx` — wire drop
- `components/freeflight/useActiveMission.ts` — wire drop on mission complete
- `components/game/battle/BattleResults.tsx` — replace ad-hoc with central helper

**Constraints:**
- Don't block the results screen on the card grant — fire-and-forget, show reveal.
- Never give a Mythic from gameplay sources to a pilot who already owns 1 copy. Check `user_cards` first.
- Reveal component must stay under 150 lines (it's small).

---

### Task 4 — Reputation system UI (pilot profile)

**Current state:**
- `pilot_reputation` table exists (Phase A1) with columns for `successful_hauls`, `pilots_rescued`, `bosses_defeated`, `pvp_wins`, `planet_owner`, `known_for`, `composed_title`, etc.
- Nothing writes to it yet except stub data. Nothing reads from it.
- V3 PART 9a specifies the public reputation card shape. PART 9b defines the Tales log as a one-line record: what, when, where.

**Required:**
1. New route `/game/profile` (or `/profile` if not taken) showing the signed-in pilot's reputation card:
   ```
   PilotName
   ├── 127 successful hauls
   ├── 34 pilots rescued
   ├── 2 tier-5 bosses defeated
   ├── Planet owner: "AquaForge Studios"
   ├── Active member since: Mar 18
   └── Known for: Saving pilots in high-risk zones
   ```
2. **Tales log** section below the card — scrollable list of notable events sourced from existing tables:
   - Mission completions → "Delivered {cargo} to {destination} · {grade}"
   - Battle victories → "Defeated {boss_template} · Tier {n}"
   - Speed run records → "Set new personal best on {track}: {time}"
   - Mythic pulls → "Pulled {mythic_card} from a {tier} pack"
   - Pulled from `mission_acceptances`, `battle_sessions`, `speedrun_times`, `ghai_transactions` (mythic type rows)
3. Activity totals auto-computed from those same tables — reputation card numbers update on page load, they don't need a separate denormalized write path in Sprint 3
4. Shareable pilot URL: `/game/profile/[userId]` — anyone signed-in can view another pilot's public profile
5. **Edit section** — own profile only — lets pilot set their `pilot_name` and `known_for` (free-text 120 chars)
6. `composed_title` displays as a subtitle under pilot name, read-only (comes from quest rewards like "Licensed Breather")

**Files touched:**
- `app/game/profile/page.tsx` — NEW, redirects to `/game/profile/[self]`
- `app/game/profile/[userId]/page.tsx` — NEW, server-renders the profile
- `components/profile/PilotCard.tsx` — NEW, stats block
- `components/profile/TalesLog.tsx` — NEW, activity feed
- `components/profile/ProfileEditForm.tsx` — NEW, owner-only edit controls
- `lib/game/reputation/summary.ts` — NEW, pure function computing the reputation card from table query results (for testability)
- `lib/game/reputation/tales.ts` — NEW, derives Tales log entries from activity rows
- `lib/game/reputation/__tests__/summary.test.ts` — NEW, validates summary math
- `lib/game/reputation/__tests__/tales.test.ts` — NEW, validates tale formatting

**Constraints:**
- Profile page must be a **Server Component** for fast initial render. The edit form is a client island.
- All Supabase queries read existing tables — no new tables added in Task 4.
- Tales log pagination: show 20 most recent, "Load more" button reveals older.
- The activity summary math is pure — all counts computed from table queries. No stored totals in Sprint 3 (can denormalize later if profile page gets slow).

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
- **Git backup first** — tag `pre-sprint3-<date>` before starting.

### Test discipline
- `npm run build` after each task
- Full test suite stays green. Baseline **456**. Sprint 3 targets ~485+.
- Every lib file (quests, packs, loot, reputation) gets shape + behaviour tests.

### Per-task verification checkpoints
1. After Task 1: `npm run build` green + new account entering `/freeflight` sees "Loop Once, Breathe Once" panel + Skip button works + completing speed-run Core Circuit advances chain
2. After Task 2: `npm run build` green + `/shop/packs` renders 3 pack cards + purchase Standard Pack deducts 100 GHAI + reveal animation plays + `user_cards` inserted for all 5 + Mythic supply decrements correctly if a mythic is rolled
3. After Task 3: `npm run build` green + complete a battle/race/mission/haul → CardDropReveal fires in ~50% of runs (rolling within expected distribution) + `user_cards` updated
4. After Task 4: `npm run build` green + `/game/profile` shows current pilot's stats + Tales log lists ≥5 recent events + editing pilot_name writes back to Supabase

Stop on failure. Don't stack.

---

## Files touched summary

| Area | New | Modified |
|---|---|---|
| Task 1 — Tutorial | `lib/game/quests/firstDayRealSky.ts`, `lib/game/quests/progress.ts`, `components/freeflight/TutorialGuide.tsx`, `supabase/migrations/<ts>_first_day_real_sky_quests.sql`, tests | `FreeFlightPage.tsx`, `RaceResults.tsx`, `MissionBoardClient.tsx`, `useActiveMission.ts`, `BattleResults.tsx` |
| Task 2 — Pack shop | `lib/game/packs/{types,rollPack}.ts`, `lib/credits/deduct.ts`, `app/shop/packs/page.tsx`, `components/shop/{PackShopClient,PackOpeningAnimation}.tsx`, `app/api/shop/open-pack/route.ts`, migration, tests | none required |
| Task 3 — Card drops | `lib/game/loot/table.ts`, `components/ui/CardDropReveal.tsx`, tests | `RaceResults.tsx`, `DeliveryResults.tsx`, `useActiveMission.ts`, `BattleResults.tsx` |
| Task 4 — Profile | `app/game/profile/{page,[userId]/page}.tsx`, `components/profile/{PilotCard,TalesLog,ProfileEditForm}.tsx`, `lib/game/reputation/{summary,tales}.ts`, tests | none required |

---

## Supabase tables in play

| Table | Notes |
|---|---|
| `user_quest_progress` | Existing. Task 1 writes chain step completion rows. |
| `quest_templates` | Existing. Task 1 seeds 4 new rows via migration. |
| `ghai_transactions` | Existing. Task 2 writes debit rows for pack purchases; Task 3 unchanged. |
| `user_credits` | Existing. Task 2 reads balance + decrements. |
| `user_cards` | Existing. Task 2 + Task 3 both insert on pack open / gameplay drop. |
| `mythic_supply` | **NEW**. Global supply counter, seeded with all Mythic cards at 50. |
| `universe_wall` | Existing. Task 2 inserts announcement row on Mythic pull. |
| `pilot_reputation` | Existing. Task 4 reads + updates `pilot_name`, `known_for`, `composed_title`. |
| `mission_acceptances`, `battle_sessions`, `speedrun_times`, `hauling_contracts` | Existing. Task 4 reads as Tales log sources. |

**Check before creating new tables** — `mcp__claude_ai_Supabase__list_tables` first. Some may already exist from Phase A1.

---

## Locked decisions (unchanged from Sprint 1/2)

- **GHAI is a platform credit.** $1 USD = 100 GHAI. `ghai_balance_platform` column. No crypto.
- **5 zone shells**: Core → Inner Ring → Mid Ring → Outer Ring → Deep Void.
- **Cast = contract issuers, not playable.** Tutorial Cast lines are doc-verbatim (Jix + GPT).
- **Bob is the free starter ship.** Soulbound.
- **No pay-to-win.** Pack purchases are card *variety*, not power — 257-card pool is balanced.
- **Mythic cap = 50 per card.** Supply-tracked globally, decrements on every successful pull (pack or gameplay).

---

## Out of scope for Sprint 3 (Sprint 4+)

- Universe Wall feed UI — Task 2 inserts rows but no feed renders them yet
- Pilot-to-pilot trading
- PvP card battle (dome, simultaneous reveal)
- Void Duel / Void Prix multiplayer
- Warp system UI
- Wreck recovery system
- AI-generated quest rewards
- Remaining 80 landmarks / 20 NPCs / 45 exploration encounters (Sprint 4–5)
- Onboarding tutorial chains 2–5 (Shape of Safe, Small Rescue Matters, etc.) — Sprint 4
