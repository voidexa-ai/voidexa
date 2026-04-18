# CARDS TEST CHECKLIST
## Last 4-5 days of builds — use this to verify Card features

Test live routes:
- https://voidexa.com/cards (Core Set collection)
- https://voidexa.com/cards/deck-builder (20-card deck builder, Core Set)
- https://voidexa.com/game/cards/deck-builder (full 257-card deck builder)
- https://voidexa.com/game/battle (PvE card combat)

Every item traces to a real commit. Mark each ❓ → ✅ / ❌ / ⚠️ with evidence.

---

## Card library (data layer)

### [ ] 1. 257-card library loads across three JSON sources
- **Origin:** commit `7cc6e10` (feat(gaming): 257 cards — 15 keywords, 21 retrofits, 35 new cards, balance verified (10100 matches)), final balance pass commit `58c06f8`
- **File:** `lib/game/cards/library.ts` — merges `baseline.json` (26), `expansion_set_1.json` (54), `full_card_library.json` (177)
- **Test file:** `lib/game/cards/__tests__/library.test.ts` (commit `2a3c902` — feat(sprint1): deck builder loads all 257 cards)
- **Source-inspection:** `grep -c '"id"' lib/game/cards/full_card_library.json` should match doc counts

### [ ] 2. 15 keywords + 3 net-new keywords defined
- **Origin:** Sprint 9 — commit `85c773b` (feat(sprint-9): MTG mechanics audit + 3 net-new keywords (no balance change))
- **File:** `lib/game/cards/keywords.ts` (19 total definitions per Sprint 9 session log — existing 16 + 3 new: Stalwart, Probe, Reactive)
- **Test file:** `lib/game/cards/__tests__/keywords.test.ts`

### [ ] 3. Balance simulator stable at ≥84% cards in 40–60% win-rate band
- **Origin:** commit `fe5b5ed` (feat(gaming): card balance patch — 173 changes, 3 passes, 20200 sim matches, 84% cards in 40-60% WR band); final balance commit `58c06f8`
- **Files:** `lib/game/simulator/results.json`, `lib/game/cards/baseline.json`, `lib/game/cards/full_card_library.json`
- **Source-inspection only** — offline simulator, not a browser surface

---

## Card collection — `/cards`

### [ ] 4. `/cards` route renders the Card Collection view
- **Origin:** commit `24b56f2` (backup: before danish i18n session A), `a9810f1` (feat: card combat + danish i18n session A — 361 tests)
- **Route:** `/cards`
- **Look for:** Collection header, filter sidebar, card grid showing owned + unowned counts
- **Implementation:** `components/combat/CardCollection.tsx`
- **Test files:** `lib/cards/__tests__/collection.test.ts`, `lib/cards/__tests__/starter_set.test.ts` (commit `334fe43`)

### [ ] 5. Core Set collection shows disenchant / craft / fuse actions
- **Origin:** commit `334fe43` (feat: phase 4 shop + card data foundation — 142 tests)
- **Route:** `/cards`
- **Look for:** Per-card actions for Disenchant (to dust), Craft (from dust), Fuse (combine duplicates)
- **Implementation:** `lib/cards/collection.ts`, `components/combat/CardCollection.tsx`
- **Test file:** `lib/cards/__tests__/collection.test.ts`

### [ ] 6. Rendered card art displays on 257 cards
- **Origin:** commit `f16d7eb` (feat: 257 rendered card images with v3 frames, inline keywords, centered text)
- **Route:** `/cards` and any card-rendering surface
- **Look for:** v3 frame, inline keyword chips, centered title + rules text, rarity-coloured border
- **Manual verification only** — asset rendering

---

## Deck builder — `/cards/deck-builder` (Core Set)

### [ ] 7. `/cards/deck-builder` loads the Core Set DeckBuilder component
- **Origin:** commit `24b56f2` / `a9810f1`
- **Route:** `/cards/deck-builder`
- **Look for:** Card list from Core Set only, deck slot counter
- **Implementation:** `components/combat/DeckBuilder.tsx`
- **Test file:** `lib/cards/__tests__/deck.test.ts`

### [ ] 8. 20-card deck limit enforced
- **Origin:** commit `334fe43`
- **Route:** `/cards/deck-builder` and `/game/cards/deck-builder`
- **Action:** Attempt to add a 21st card → rejected with an inline flash / toast
- **Implementation:** `app/game/cards/deck-builder/DeckBuilderClient.tsx:13` `DECK_SIZE = 20`
- **Test file:** `lib/cards/__tests__/deck.test.ts`

### [ ] 9. 2-copies-of-normal / 1-of-Legendary / 1-of-Mythic rule
- **Origin:** commit `334fe43`, extended in commit `2a3c902`
- **Route:** `/game/cards/deck-builder`
- **Action:** Try to add a 3rd copy of a Common → rejected. Try to add a 2nd copy of a Legendary → rejected. Try to add a 2nd copy of a Mythic → rejected.
- **Implementation:** `app/game/cards/deck-builder/DeckBuilderClient.tsx:14-17` (`MAX_COPIES=2`, `MAX_RARE=3`, `MAX_LEGENDARY=1`, `MAX_MYTHIC=1`)
- **Test file:** `lib/cards/__tests__/deck.test.ts`

### [ ] 10. Deck save requires sign-in; writes to Supabase `decks` + `deck_cards`
- **Origin:** commit `9e1adfb` (feat(gaming): Phase 1b — Mission Board UI + Deck Builder with Dream Mode)
- **Route:** `/game/cards/deck-builder` (signed in)
- **Action:** Name deck → Save → toast confirms; reload page, saved deck appears in list
- **Implementation:** `app/game/cards/deck-builder/DeckBuilderClient.tsx` (saved deck fetch + save)
- **Manual verification only**

---

## Deck builder — `/game/cards/deck-builder` (full 257 lib + Dream Mode)

### [ ] 11. Full 257-card pool available by default (Dream Mode)
- **Origin:** commit `2a3c902` (feat(sprint1): deck builder loads all 257 cards); commit `9e1adfb`
- **Route:** `/game/cards/deck-builder`
- **Look for:** Dream Mode toggle ON by default → every card in `ALL_CARDS` appears in the pool regardless of ownership
- **Implementation:** `app/game/cards/deck-builder/DeckBuilderClient.tsx:65` `const [dreamMode, setDreamMode] = useState(true)`
- **Test file:** `lib/game/cards/__tests__/library.test.ts`

### [ ] 12. Type filter: all / weapon / defense / maneuver / drone / ai / consumable
- **Origin:** commit `9e1adfb`
- **Route:** `/game/cards/deck-builder`
- **Action:** Click each type → card list filters; "all" resets
- **Implementation:** `app/game/cards/deck-builder/DeckBuilderClient.tsx:19-21` `TYPE_OPTIONS`
- **Manual verification only**

### [ ] 13. Rarity filter: all / common / uncommon / rare / legendary / mythic / pioneer
- **Origin:** commit `9e1adfb`
- **Route:** `/game/cards/deck-builder`
- **Action:** Click each rarity → grid filters; border color on each card matches rarity
- **Implementation:** `app/game/cards/deck-builder/DeckBuilderClient.tsx:23-25` `RARITY_OPTIONS`
- **Manual verification only**

### [ ] 14. Max-cost slider (0–7) filters high-cost cards
- **Origin:** commit `9e1adfb`
- **Route:** `/game/cards/deck-builder`
- **Action:** Drag max cost down → cards with cost > max disappear
- **Implementation:** `app/game/cards/deck-builder/DeckBuilderClient.tsx:63` `const [maxCost, setMaxCost] = useState(7)`
- **Manual verification only**

### [ ] 15. "Owned only" toggle filters to cards player has collected
- **Origin:** commit `9e1adfb`
- **Route:** `/game/cards/deck-builder`
- **Action:** Toggle Owned only ON (signed in) → hides un-owned cards
- **Implementation:** `app/game/cards/deck-builder/DeckBuilderClient.tsx:64` `const [ownedOnly, setOwnedOnly] = useState(false)`
- **Manual verification only**

### [ ] 16. Drag-and-drop card → deck slot
- **Origin:** commit `9e1adfb`
- **Route:** `/game/cards/deck-builder`
- **Action:** Drag a card onto the deck panel → copy increments
- **Implementation:** `app/game/cards/deck-builder/DeckBuilderClient.tsx` (DragEvent handling)
- **Manual verification only**

### [ ] 17. Deck persistence round-trip
- **Origin:** commit `9e1adfb`
- **Route:** `/game/cards/deck-builder` (signed in)
- **Action:** Build deck → Save → reload → open deck list → load saved deck → cards restored with correct counts
- **Manual verification only**

---

## Battle tier selection — `/game/battle`

### [ ] 18. Battle Entry screen lists 5 tiers
- **Origin:** Phase 4b — commit `5d4ad07` (feat(gaming): Phase 4b — PvE card battle scene with effects, HUD, turn flow)
- **Route:** `/game/battle`
- **Look for:** Tier cards T1 Core Patrol (hull 60), T2 Inner Scout (hull 80), T3 Mid Enforcer (hull 100), T4 Outer Marauder (hull 120), T5 Deep Void Prowler (hull 150); each color-coded (green → red)
- **Implementation:** `lib/game/battle/encounters.ts:27-32` `PVE_TIERS`, `components/game/battle/BattleEntry.tsx:24-26` `TIER_COLORS`
- **Test file:** `lib/game/battle/__tests__/engine.test.ts`

### [ ] 19. Four PvE bosses listed alongside tiers
- **Origin:** Sprint 1 — commit `7bf6d50` (feat(sprint1): mission wire, 4 PvE bosses, unified GHAI credit)
- **Route:** `/game/battle`
- **Look for:** The Lantern Auditor (T2, gold), Varka Tyrant of the Hollow (T4, red), Choir-Sight Envoy (T5, purple), The Patient Wreck (T5+, cyan)
- **Implementation:** `lib/game/battle/bosses.ts:71-124` `BOSS_DEFS`; `components/game/battle/BattleEntry.tsx:14-22`
- **Manual verification only** for rendering

### [ ] 20. Boss GHAI reward amounts match design
- **Origin:** Sprint 1 — commit `7bf6d50`
- **Route:** `/game/battle`
- **Look for:** Lantern Auditor 140 GHAI · Varka 360 GHAI · Choir-Sight 520 GHAI · Patient Wreck 900 GHAI
- **Implementation:** `lib/game/battle/bosses.ts:83,96,109,122`
- **Manual verification only**

### [ ] 21. Boss title fragments awarded on victory
- **Origin:** Sprint 1 — commit `7bf6d50`
- **Route:** `/game/battle` → complete boss fight
- **Look for:** Post-victory toast crediting title fragments — Lantern "Passed Inspection", Varka "Hangar Breaker", Choir "Heard by the Choir", Wreck "Long Return"
- **Implementation:** `lib/game/battle/bosses.ts:83,96,109,122` `reward.titleFragment`
- **Manual verification only**

### [ ] 22. Starter deck loads when user has no saved decks
- **Origin:** commit `5d4ad07` + Sprint 1 wiring commit `7bf6d50`
- **Route:** `/game/battle`
- **Look for:** `STARTER_DECK_IDS` → 20 cards (Pulse Tap ×2, Quick Shield ×2, etc.); deck source labeled "starter"
- **Implementation:** `components/game/battle/BattleEntry.tsx:28-40`
- **Manual verification only**

### [ ] 23. Saved deck auto-loads for signed-in users
- **Origin:** commit `5d4ad07` + Sprint 1 `7bf6d50`
- **Route:** `/game/battle` (signed in, ≥10-card deck saved)
- **Look for:** `deckSource = 'saved'` — entry screen reflects loaded saved deck
- **Implementation:** `components/game/battle/BattleEntry.tsx:49-80`
- **Manual verification only**

---

## Battle scene — Phase 4b (WIP surface)

### [ ] 24. Battle scene renders turn-based 3D combat
- **Origin:** Phase 4b — commit `5d4ad07`
- **Route:** `/game/battle` → pick tier → Start
- **Look for:** 3D `BattleScene` canvas with player and enemy ships, card hand at bottom, HUD top, turn indicator, card play triggers damage numbers + ability effects
- **Implementation:** `components/game/battle/BattleController.tsx`, `BattleScene.tsx`, `BattleShip.tsx`, `CardHand.tsx`, `BattleHUD.tsx`, `DamageNumbers.tsx`, `AbilityEffects.tsx`
- **Test file:** `lib/game/battle/__tests__/engine.test.ts` (engine logic only)
- **Known partial/WIP** per memory — verify whether the 3D scene still crashes on "Fight" click or renders cleanly now

### [ ] 25. Battle end screen credits GHAI on victory (unified card drop)
- **Origin:** Sprint 3 — commit `9e026fc` (feat(sprint3): unified card drops from gameplay)
- **Route:** `/game/battle` → win
- **Look for:** Victory card drop overlay; GHAI payout posted to `/api/wallet/credit`
- **Implementation:** `components/game/battle/BattleResults.tsx`, `lib/game/loot/table.ts`, `lib/credits/credit.ts`
- **Test files:** `lib/game/loot/__tests__/table.test.ts`, `tests/mission-payout.test.ts`

### [ ] 26. Kestrel Reclaimer end-game boss data exists
- **Origin:** Phase 4a — commit `4d0a486` (feat(gaming): Phase 4a — PvE card battle engine, AI, encounters, tests)
- **File:** `lib/game/battle/encounters.ts:76-176`
- **Look for:** `KESTREL_HULL = 140`, three unique cards (Mag Clamp, Salvage Sweep, Hull Breach), 3-phase escalation (standard → drone cadence → 2 cards/turn)
- **Test file:** `lib/game/battle/__tests__/engine.test.ts`
- **Source-inspection only** — Kestrel UI entry may not be exposed yet

---

## Mission + quest chain integration

### [ ] 27. Quest chain "First Day Real Sky" seeds the onboarding flow
- **Origin:** Sprint 3 — commit `dfc3d51` (feat(sprint3): First Day Real Sky onboarding tutorial)
- **Route:** `/freeflight` (first visit)
- **Look for:** 4-step tutorial pulled from `lib/game/quests/chains/firstDayRealSky.ts`
- **Test file:** `lib/game/quests/__tests__/firstDayRealSky.test.ts`
- (Tutorial is Free Flight surface; listed here because it gates card-battle onboarding.)

### [ ] 28. 5 starter quest chains defined
- **Origin:** Sprint 4 — commit `c29b6a9` (feat(sprint4): quest chain system + 5 starter chains)
- **Files:** `lib/game/quests/chains/{firstDayRealSky,bentQuorum,lanternGraveRebuild,shapeOfSafe,smallRescueMatters}.ts`
- **Test file:** `lib/game/quests/__tests__/chains.test.ts`

---

## Mythic supply (universe-wide rarity cap)

### [ ] 29. Mythic cards carry universe-wide cap of 50 copies
- **Origin:** Sprint 3 — commit `3eddef6` (booster pack shop with Mythic supply tracking)
- **Route:** `/shop/packs` (copy + data)
- **Look for:** Subtitle copy "Mythic cards have a universe-wide cap of 50 copies each — when they run out, that card is trade-only forever."
- **Implementation:** `lib/game/packs/types.ts:71-77` `MythicSupply`
- **Test file:** `lib/game/packs/__tests__/rollPack.test.ts`

---

## Known partial / in-progress

- **Phase 4b 3D battle scene** — per session memory, the `/game/battle` scene was flagged WIP at some point. Verify explicitly whether clicking **Fight** now renders the 3D scene without crashing. If it still crashes, mark item 24 ⚠️ with the browser console error.
- **Per-item Stripe purchase** — item modal CTA reads `COMING SOON · STRIPE` (item 20). This is intentional deferred state, not a bug.
