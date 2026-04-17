---
name: Sprint 3 — Onboarding + Economy + Reputation
description: Use this skill when building the first-60-minute new-pilot experience on voidexa — the "First Day Real Sky" 4-mission tutorial chain (Jix/GPT-authored, doc-verbatim dialogue), the booster pack shop (Standard/Premium/Legendary GHAI packs with 0.1% Mythic + 50-copy supply cap), unified card drops from all gameplay sources (mission/battle/speedrun/hauling), and the public pilot profile page (reputation card + Tales log). Trigger on "Sprint 3", "First Day Real Sky tutorial", "onboarding tutorial", "booster pack shop", "card packs", "Mythic supply tracking", "card drops from gameplay", "pilot profile page", "reputation system UI", or "Tales log".
---

# Sprint 3 — Onboarding + Economy + Reputation

**Goal:** a brand-new pilot can sign up, be guided through their first hour (tutorial), earn + spend GHAI (shop), collect cards from gameplay (drops), and see proof of their journey (profile).

Companion doc: `docs/SPRINT3_CLAUDE.md` — file sizes, Supabase tables, per-task constraints, locked decisions.

Starting state: **456/456 tests passing**, Sprints 1 + 2 live on voidexa.com, freeflight has 20 landmarks + 10 NPCs + 15 encounters + 90 missions.

---

## Task 1 — First Day Real Sky onboarding tutorial

### Input
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` SECTION 4, chain #1 — 4 missions with Cast dialogue + final reward
- Existing `user_quest_progress` + `quest_templates` tables (Phase A1, unused)
- Existing completion flows for speed-run / mission / landmark-scan / battle (Sprints 1–2)

### Output
- 4 `quest_template` rows inserted via migration: `first_day_loop`, `first_day_coffee`, `first_day_pings`, `first_day_drones`
- `lib/game/quests/firstDayRealSky.ts` — chain definition with doc-verbatim Cast dialogue + per-step completion triggers
- `lib/game/quests/progress.ts` — `useActiveQuestChain()` hook reading `user_quest_progress`
- `components/freeflight/TutorialGuide.tsx` — persistent panel: current objective + Cast line + Skip button
- Chain completion → 600 GHAI bonus via `creditGhai({source: 'quest', sourceId: 'first_day_real_sky'})` + `pilot_reputation.composed_title = "Licensed Breather"`
- Hooks into 5 existing completion paths: speed-run save, mission accept, mission complete, landmark scan, battle victory

### Success criteria
- Brand-new pilot on `/freeflight` sees "Loop Once, Breathe Once" panel + objective + Jix dialogue
- Completing Bob's First Loop speed-run advances to "Coffee to Dock Nine"
- Chain completes after all 4 → 600 GHAI credited, "Licensed Breather" title appears in `pilot_reputation`
- Returning pilot who already completed the chain does NOT see the panel
- "Skip tutorial" button sets localStorage flag + hides panel without marking quest complete
- Idempotent step advancement — re-scanning Saffron Relay does not double-fire chain progress

### Tests (required)
- `lib/game/quests/__tests__/firstDayRealSky.test.ts`:
  - chain has exactly 4 steps in correct order
  - every step has non-empty `castLine` + valid `issuer`
  - every step has a unique `triggerType` + `triggerTarget`
  - final reward is 600 GHAI + "Licensed Breather" title

---

## Task 2 — Booster pack shop

### Input
- V3 PART 5 spec: 3 pack tiers (Standard/Premium/Legendary), 100/300/1000 GHAI, exact rarity distributions, 0.1% Mythic in best slot
- Mythic cap: 50 copies per card universe-wide
- Existing `ghai_transactions`, `user_credits`, `user_cards` tables

### Output
- `lib/game/packs/rollPack.ts` — pure `rollPack(tier, rng)` returning 5 `CardTemplate` ids respecting rarity schedule
- `lib/credits/deduct.ts` — idempotent GHAI spend (mirror of Sprint 1's `creditGhai`)
- `app/shop/packs/page.tsx` + `components/shop/PackShopClient.tsx` — 3 pack cards, purchase flow
- `components/shop/PackOpeningAnimation.tsx` — card-by-card reveal, 600ms per card, Mythic = dramatic pause
- `app/api/shop/open-pack/route.ts` — server-side pack roll + atomic Mythic supply decrement + card grant
- Supabase table `mythic_supply(card_id, total_minted=50, pulled)` with unique constraint
- On Mythic pull: insert `universe_wall` row with event "Pilot {name} pulled {MYTHIC}! (N remaining)"

### Success criteria
- `/shop/packs` renders 3 pack cards with prices + drop-rate hints
- Standard Pack purchase deducts 100 GHAI, returns 5 cards, 4 are Common
- 10,000-roll statistical test: Standard yields 80% ±2% Common, Mythic rate ~0.1%
- When Mythic supply for a card hits 0, subsequent rolls of that mythic downgrade to Legendary (never fail the pack)
- Duplicate pack-open requests with same `tx_signature` do not double-charge or double-grant (idempotency)
- Pack opening animation completes in <4s total

### Tests (required)
- `lib/game/packs/__tests__/rollPack.test.ts`:
  - Standard Pack always returns exactly 5 cards
  - Standard Pack has ≥4 Common cards in any 100-roll sample (tolerance for Mythic upgrades)
  - Premium Pack guarantees ≥1 Uncommon, ≥1 Rare chance
  - Legendary Pack has ≥1 Legendary chance in ≥20% of rolls
  - Mythic rate in any tier is between 0.05% and 0.15% over 10,000 rolls
  - Supply-exhausted mythic is NOT returned; downgraded to Legendary
- `lib/credits/__tests__/deduct.test.ts` — mirror of existing credit.test.ts, input validation + idempotency (keep 410 baseline credit tests green)

---

## Task 3 — Card drops from gameplay

### Input
- Existing `user_cards` table
- Existing `rollPack` from Task 2 (share code for rarity distribution)
- Sprint 1's `creditGhai` pattern for idempotent writes

### Output
- `lib/game/loot/table.ts` — `rollLootCard(source, tier, seed)` returning `{ card, rarity } | null`
- `components/ui/CardDropReveal.tsx` — shared reveal toast (≤150 lines), 3s auto-dismiss
- Wire into 4 call sites: `RaceResults`, `DeliveryResults`, `useActiveMission`, `BattleResults`
- Drop decisions are deterministic per `source_id` — no re-roll on UI re-render

### Success criteria
- Complete a Tier 1 battle → 80% chance of Common drop, 20% chance of no drop (statistical over 100 runs)
- Complete a Gold mission → 65% drop chance, rarity ∈ {uncommon, rare}
- Mythic drop from gameplay: 0.1% max, never exceeds supply cap
- Pilot who already owns 1 Mythic copy cannot receive a second from gameplay (pack-only)
- UI shows reveal toast in bottom-right of the results screen, doesn't block the screen's primary buttons

### Tests (required)
- `lib/game/loot/__tests__/table.test.ts`:
  - 10,000 rolls per activity type — assert drop-rate bounds within ±3%
  - Mythic rate always ≤ 0.15%
  - Tier 1 battle never drops legendary; Tier 5 always has ≥10% legendary chance
  - Deterministic: same seed = same card

---

## Task 4 — Reputation system UI (pilot profile)

### Input
- Existing `pilot_reputation` table (Phase A1, empty)
- Existing activity tables: `mission_acceptances`, `battle_sessions`, `speedrun_times`, `hauling_contracts`
- V3 PART 9a reputation card spec

### Output
- `app/game/profile/page.tsx` (redirects to self) + `app/game/profile/[userId]/page.tsx` (public viewable)
- `components/profile/PilotCard.tsx` — stats block: haul count, rescues, bosses defeated, composed_title, active since
- `components/profile/TalesLog.tsx` — 20 most recent activity rows formatted as one-line Tales
- `components/profile/ProfileEditForm.tsx` — owner-only: edit `pilot_name` (max 32) + `known_for` (max 120)
- `lib/game/reputation/summary.ts` — pure function computing stats from query results
- `lib/game/reputation/tales.ts` — pure function formatting activity rows into Tales strings

### Success criteria
- Signed-in pilot visits `/game/profile` → sees own stats card with real counts
- Profile URL `/game/profile/[userId]` works for any user id (public view)
- Tales log shows ≥5 recent entries if pilot has any activity (mission / battle / speed-run / hauling)
- Edit form: change pilot_name → save → Supabase write → reload shows new name
- Non-owner viewing someone else's profile does NOT see edit controls
- Composed title from quest rewards (Task 1's "Licensed Breather") renders under the pilot name

### Tests (required)
- `lib/game/reputation/__tests__/summary.test.ts`:
  - empty input → zeroed summary
  - mixed activity → correct counts per category
  - tier-5 boss wins counted separately from generic tier victories
- `lib/game/reputation/__tests__/tales.test.ts`:
  - mission completion row → "Delivered {cargo} to {destination} · {grade}"
  - battle victory row → "Defeated {boss_template} · Tier {n}"
  - speed run personal-best row → "Set new personal best on {track}: {time}"
  - handles missing optional fields (null grade etc.) gracefully

---

## Overall success criteria (ship gate)

When Sprint 3 is done:

1. **Tutorial works for new pilots** — a fresh account sees First Day Real Sky panel, completes 4 steps, earns "Licensed Breather" + 600 GHAI
2. **Pack shop live** — can buy a Standard/Premium/Legendary pack with GHAI, see 5-card reveal animation, cards land in collection
3. **Mythic supply enforced** — decrements on every pull, universe_wall row inserted, supply never goes negative
4. **Card drops happen across all gameplay modes** — CardDropReveal fires in battle + race + hauling + mission at expected rates
5. **Pilot profile exists** — signed-in pilots see their reputation card + Tales log + can edit pilot_name
6. **Tests green** — full suite stays ≥485 (was 456), no regressions
7. **Build clean** — `npm run build` only shows pre-existing bigint warning
8. **Deployed** — one final `git push origin main`

## Non-goals

- Universe Wall feed UI (Task 2 inserts rows, feed renders in Sprint 4)
- Pilot-to-pilot card trading (Sprint 4)
- PvP card battle, Void Duel, Void Prix (post-MVP)
- Wreck recovery system (Sprint 4+)
- AI-generated quest rewards (post-MVP)
- Onboarding chains 2–20 (Sprint 4+)

## Pre-work

1. **Git backup first.** Tag current head as `pre-sprint3-<date>`. One-line rollback if any task goes sideways.
2. Read `docs/SPRINT3_CLAUDE.md` end-to-end.
3. Confirm Sprint 1 `ghai_transactions` idempotency index is still live.
4. Verify `mcp__claude_ai_Supabase__list_tables` before creating `mythic_supply` — may already exist.

## Commit style

4 separate commits — each task touches distinct files:

- `feat(sprint3): First Day Real Sky onboarding tutorial`
- `feat(sprint3): booster pack shop with Mythic supply tracking`
- `feat(sprint3): unified card drops from gameplay`
- `feat(sprint3): pilot profile + Tales log`

Each commit: `npm run build` + `npm run test` green before landing. No skip-ci, no `--no-verify`.
