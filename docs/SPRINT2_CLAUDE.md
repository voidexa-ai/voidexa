# Sprint 2 — Claude Code Instructions

Sprint 2 goal: **freeflight feels alive.** Places to see, people to meet, things to scan, real missions to pick from.
Sprint 1 closed the first playable loop; Sprint 2 fills the universe with the content already designed in `docs/VOIDEXA_UNIVERSE_CONTENT.md`.

---

## Context — what's built

Shipped and live on voidexa.com at the start of Sprint 2:

| Phase | Surface | Commit |
|---|---|---|
| A1 | 16 Supabase gaming tables + RLS + 26 baseline cards + balance validator | `fdf9760` |
| 1b | `/game/mission-board` (8 missions) + `/game/cards/deck-builder` + Dream Mode | `9e1adfb` |
| 2 | `/game/speed-run` — 3 tracks, power-ups, leaderboard | `0ff4522` |
| 3 | `/game/hauling` — 6 contracts, encounter system, delivery grading | `4bfd1f1` |
| 4a | PvE card battle engine — pure functions, AI, Tier 1–5 + Kestrel, 27 tests | `4d0a486` |
| 4b | `/game/battle` — 3D battle scene, card hand, HUD, turn flow | `5d4ad07` |
| Sprint 1 | 257-card Deck Builder + 4 bosses + mission → freeflight wire + GHAI credit | `2a3c902`, `7bf6d50` |

Test suite: **410/410 green**. Deploy path: `git push origin main` → Vercel auto-deploy.

What already works in `/freeflight` before Sprint 2:
- 5 planet spheres (voidexa hub + 4 generic planets)
- Asteroid field, nebula zones, 3 derelicts, warp gates
- 8-NPC manager with patrol routes (generic NPCs, no personalities)
- 5 stations (hub / repair / trading / abandoned)
- Mission waypoint renderer (Sprint 1 Task 1) — spawns only when a mission is active

What does NOT work yet — the Sprint 2 targets.

---

## Sprint 2 scope — 4 tasks

### Task 1 — Populate freeflight with 20 landmarks

**Current state:**
- `components/freeflight/types.ts` holds 5 planets and 5 stations — hardcoded, arbitrary positions.
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` SECTION 1 has 100 named landmarks with zone assignments, visual descriptions, lore, and gameplay hooks. None are wired.

**Required:**
1. Pick the first **15 Core Zone + 5 Inner Ring** landmarks from `VOIDEXA_UNIVERSE_CONTENT.md` SECTION 1.
2. Define explicit `{x, y, z}` coordinates for each (distributed in a 3D sphere — NOT a plane — with Core closer to origin and Inner Ring further out).
3. Each landmark has a **type** that drives its 3D representation. Reuse primitives:
   - `station` → cylinder or box with emissive panels
   - `monument` / `beacon_cluster` → small emissive shapes
   - `training_ring` / `beacon_garden` → torus ring
   - `bio_dome` → semi-transparent sphere
   - `relay` / `gate_marker` → slim antenna mast
4. When the player approaches within scan range (~80 units), a prompt appears: "Press F to scan · {name}".
5. Scanning shows a lore popup using the existing lore popup pattern (`lorePopup` state in `FreeFlightPage`). Popup body uses the `lore snippet` + `visual description` fields from the doc.
6. Each landmark is visible from a distance (≥ 300 units) via an emissive core + glow, so they stand out against the starfield.

**Files touched:**
- `lib/game/freeflight/landmarks.ts` — NEW, 20 landmark defs with coords + metadata
- `components/freeflight/environment/Landmarks.tsx` — NEW, R3F component rendering all 20, proximity detection, onScan callback
- `components/freeflight/FreeFlightScene.tsx` — mount `<Landmarks />` + thread `onNearLandmarkChange` prop
- `components/freeflight/FreeFlightCanvas.tsx` — pass props through
- `components/freeflight/FreeFlightPage.tsx` — consume `onNearLandmarkChange` to drive scan prompt + lore popup
- `lib/game/freeflight/__tests__/landmarks.test.ts` — NEW, asserts 20 landmarks, all have valid zone/type/coords, no overlaps within 40 units

**Constraints:**
- Landmarks component must stay under **300 lines**. If it grows, split into `Landmarks.tsx` (renderer) + `useNearestLandmark.ts` (proximity hook).
- Emissive glow must be visible at 300+ units without blowing out the existing bloom post-process. Use `toneMapped={false}` sparingly.
- Scan detection uses simple distance-to-camera (or distance-to-ship). No raycasts.

---

### Task 2 — Add 10 NPC pilots to freeflight

**Current state:**
- `components/freeflight/environment/NPCManager.tsx` spawns 8 generic cone-shaped NPCs on patrol routes. They have no names, no dialogue, no reputation.
- `VOIDEXA_UNIVERSE_CONTENT.md` SECTION 5 has 30 named NPCs: Friendly Haulers (1–5), Pirates (6–10), Salvagers (11–15), Scouts (16–20), Cast-adjacent Pilots (21–25), Wildcards (26–30). Each has personality, home zone, behavior, dialogue samples, reputation.

**Required:**
1. Pick **10 NPCs** spanning all roles — recommended: 2 Haulers + 2 Pirates + 2 Salvagers + 2 Scouts + 1 Cast-adjacent + 1 Wildcard — enough variety that freeflight feels populated with distinct personalities.
2. Each NPC has:
   - Ship class (maps to visual: Hauler = box, Fighter = cone, Salvager = triangular, Scout = arrow, Explorer = rhomboid)
   - Home zone → spawn radius (Core = ±80 from origin, Inner Ring = 150–220, Mid Ring = 250–350, Outer = 380+)
   - Patrol route (reuse existing NPC patrol pattern, seeded by NPC id)
   - Greeting / Combat / Farewell dialogue
   - Color tint: friendly = cyan, pirate = red, salvager = orange, scout = violet, cast-adjacent = yellow, wildcard = white
3. **Interaction:** when the player's ship is within 30 units of an NPC:
   - A prompt appears: "Press G to greet · {NPC.name}"
   - Press G → radio-style dialogue bubble shows the NPC's greeting line for 6 seconds
   - Hostile NPCs (pirates) show "⚠ HOSTILE · {NPC.name}" instead of greet prompt
4. NPC behavior does NOT become combat-active in Sprint 2. Pirates flash a warning but still patrol peacefully. Full hostile AI is post-MVP.
5. Replace the old generic NPCManager OR extend it — pick the cleaner path. Keep old code only if there's a real reason.

**Files touched:**
- `lib/game/freeflight/npcs.ts` — NEW, 10 NPC defs with zone / patrol seed / class / dialogue
- `components/freeflight/environment/NamedNPCs.tsx` — NEW, replaces or sits alongside NPCManager; handles rendering + proximity
- `components/freeflight/NPCDialogueBubble.tsx` — NEW, HTML overlay showing the current greeting line, auto-hides after 6s
- `components/freeflight/FreeFlightScene.tsx` — mount NamedNPCs, thread `onNearNPCChange`
- `components/freeflight/FreeFlightCanvas.tsx` + `FreeFlightPage.tsx` — props + G-keypress handler + dialogue state
- `lib/game/freeflight/__tests__/npcs.test.ts` — NEW, asserts 10 NPCs with distinct ids, valid roles, dialogue present for each

**Constraints:**
- Instanced geometry for NPCs if performance dips. 10 is fine as individual meshes.
- Dialogue bubble is 14px min body, 12px min for speaker label. Opacity ≥ 0.55.
- NPC component must stay under **300 lines** — split off dialogue bubble as its own file (already in plan).

---

### Task 3 — 15 scanner-triggered exploration encounters

**Current state:**
- Nothing. The derelict system (`DerelictShips.tsx`) is the closest analog — 3 hardcoded derelicts, scan triggers a lore popup.
- `VOIDEXA_UNIVERSE_CONTENT.md` SECTION 3 has 60 exploration encounters with rarity tiers (Common / Uncommon / Rare), trigger types (visual / audio / scanner ping / proximity), and choice outcomes.

**Required:**
1. Pick **15 encounters** — recommended mix: 8 Core Zone + 5 Inner Ring + 2 crossover — covering all 4 trigger types (visual, audio, scanner ping, proximity).
2. Place each at a deterministic coordinate (seeded from encounter id). Scatter across the 3D sphere.
3. **Trigger system:**
   - Scanner-ping encounters show a blip on the HUD when within 150 units
   - Visual encounters render a small emissive glyph visible at 120 units
   - Proximity encounters activate when within 50 units regardless of action
   - Audio encounters (just cosmetic sound cue in Sprint 2 — visual placeholder OK for MVP)
4. When activated, the player sees a **choice modal** with 2–4 options drawn from the doc (e.g. Loose Breakfast Crate: Recover / Ignore / Scan origin / Return to sender).
5. Each choice has an outcome: GHAI reward, lore fragment, small rep bump, or nothing. Keep outcomes simple in Sprint 2 — GHAI credit via the Sprint 1 `creditGhai` helper, lore fragments stored in `user_achievements` as text blobs, rep is a placeholder (write to console for now if `pilot_reputation` integration is too heavy).
6. Once resolved per player, encounters don't re-trigger for that player (write to a new Supabase table `exploration_encounters_resolved(user_id, encounter_id, outcome, created_at)`).

**Files touched:**
- `lib/game/freeflight/explorationEncounters.ts` — NEW, 15 encounter defs with coords + trigger type + choices + outcomes
- `components/freeflight/environment/ExplorationEncounters.tsx` — NEW, R3F component rendering glyphs + proximity detection
- `components/freeflight/ExplorationChoiceModal.tsx` — NEW, HTML choice modal
- `supabase/migrations/<timestamp>_exploration_encounters_resolved.sql` — NEW, table + RLS policies
- `components/freeflight/FreeFlightScene.tsx` — mount encounters
- `components/freeflight/FreeFlightPage.tsx` — mount choice modal, wire reward → `creditGhai`
- `lib/game/freeflight/__tests__/explorationEncounters.test.ts` — NEW, validates shape

**Constraints:**
- Choice modal must pause the game (unlock pointer lock, dim background).
- Reward credit uses `source: 'mission'` with `sourceId = encounter_id` (piggyback on existing `ghai_transactions` idempotency — encounters count as mission-adjacent events).
- **Verify ghai_transactions still idempotent** after adding encounter payouts. Run `lib/credits/__tests__/credit.test.ts` after changes.

---

### Task 4 — Replace 8 hardcoded missions with full 90-template library

**Current state:**
- `lib/game/missions/board.ts` exports `MISSION_TEMPLATES` — 8 hardcoded templates.
- `VOIDEXA_UNIVERSE_CONTENT.md` SECTION 2 has 90 missions: 20 Courier + 15 Rush + 15 Hunt + 15 Recovery + 25 Signal, each with name, category, Cast issuer, zone, objective, time estimate, reward range, risk badge, difficulty, encounter chance, progression tie, flavor text.

**Required:**
1. Parse SECTION 2 into structured data. Either:
   - **(a)** A single `lib/game/missions/catalog.json` with 90 rows (manual one-time transcription; do NOT scrape the markdown at runtime), OR
   - **(b)** A TypeScript array `lib/game/missions/catalog.ts` (same shape).
   - Pick (b) for type safety.
2. All 90 missions must conform to the existing `MissionTemplate` shape in `lib/game/missions/board.ts`. Extend the type minimally if needed — don't rewrite it.
3. The 8 existing missions stay importable by id (for any callers that hardcode one). Merge — not replace.
4. Mission Board UI (`/game/mission-board`) shows all 90 by default, with the existing 5 category tabs + All. Pagination or scroll-tracking if the list is too long for a single viewport.
5. "Recommended" section at top picks 3 — by tier appropriate for new players (first two categories Courier Easy + Rush Easy from Core) or by Cast variety.
6. **Mission waypoints in freeflight** (from Sprint 1) must still work with the 90-mission library. The `generateMissionWaypoints` helper is keyed by mission id — any new id will produce a new deterministic layout, no code change needed.

**Files touched:**
- `lib/game/missions/catalog.ts` — NEW, 90 mission templates (big file — allowed up to 500 lines, `lib/` exemption)
- `lib/game/missions/board.ts` — extend to merge 8 hardcoded + 90 catalog; the `MISSION_TEMPLATES` export becomes the full 98-item list (or 90, if the 8 are all in the catalog already — de-dupe by id)
- `app/game/mission-board/MissionBoardClient.tsx` — may need scroll container or pagination; category tab filtering should already handle the larger list
- `lib/game/missions/__tests__/catalog.test.ts` — NEW, asserts 90+ unique ids, every mission passes `MissionTemplate` validation, all 5 categories present

**Constraints:**
- `catalog.ts` can exceed 300 lines because it's data — keep under **500** per the lib rule.
- No runtime markdown parsing. Data is hand-transcribed once.
- Mission Board rendering cost: 90 tiles at mount is fine, but virtualization is overkill for Sprint 2. If perceived slowness, add a "Load more" pattern — don't optimize prematurely.

---

## Rules

### File sizes
- React component max **300 lines**
- `page.tsx` max **100 lines**
- `lib/` file max **500 lines**
- **Split at 200+** — don't wait until the ceiling

### Fonts + opacity
- Body ≥ **16 px**
- Labels ≥ **14 px**
- Minimum opacity on visible text/chrome: **0.5**

### Env vars
- Every `process.env.*` read must be `.trim()`'d

### Deploy
- `git push origin main` — the only deploy action. Vercel auto-deploys on push.
- Deploy ONLY when all 4 tasks are green (`npm run build` + `npm run test`).
- **Git backup first** — create a backup commit or tag before starting Sprint 2 work so rollback is one command if a task goes sideways.

### Test discipline
- `npm run build` after **each task** — not just at the end.
- `npm run test` full suite must stay green. Starting baseline: **410 tests passing**. Sprint 2 should land around 425+.
- Every data file (landmarks, NPCs, encounters, mission catalog) gets a shape-validation test.

### Per-task verification checkpoints
1. After Task 1: `npm run build` green + landmarks visible in freeflight + scan works on at least 1 landmark
2. After Task 2: `npm run build` green + NPCs visible + greet works on at least 1 friendly
3. After Task 3: `npm run build` green + at least 1 encounter fires choice modal
4. After Task 4: `npm run build` green + `/game/mission-board` shows 90+ missions with filter tabs working

If a checkpoint fails, fix before moving on. Do not stack failures.

---

## Files touched summary

| Area | New | Modified |
|---|---|---|
| Task 1 — Landmarks | `lib/game/freeflight/landmarks.ts`, `components/freeflight/environment/Landmarks.tsx`, `lib/game/freeflight/__tests__/landmarks.test.ts` | `FreeFlightScene.tsx`, `FreeFlightCanvas.tsx`, `FreeFlightPage.tsx` |
| Task 2 — NPCs | `lib/game/freeflight/npcs.ts`, `components/freeflight/environment/NamedNPCs.tsx`, `components/freeflight/NPCDialogueBubble.tsx`, `lib/game/freeflight/__tests__/npcs.test.ts` | `FreeFlightScene.tsx`, `FreeFlightCanvas.tsx`, `FreeFlightPage.tsx` |
| Task 3 — Encounters | `lib/game/freeflight/explorationEncounters.ts`, `components/freeflight/environment/ExplorationEncounters.tsx`, `components/freeflight/ExplorationChoiceModal.tsx`, `supabase/migrations/<ts>_exploration_encounters_resolved.sql`, `lib/game/freeflight/__tests__/explorationEncounters.test.ts` | `FreeFlightScene.tsx`, `FreeFlightPage.tsx` |
| Task 4 — 90 missions | `lib/game/missions/catalog.ts`, `lib/game/missions/__tests__/catalog.test.ts` | `lib/game/missions/board.ts`, optionally `app/game/mission-board/MissionBoardClient.tsx` |

---

## Supabase tables in play

| Table | Notes |
|---|---|
| `ghai_transactions` | Sprint 1's idempotent credit ledger. Task 3 reuses `source='mission'` for encounter payouts. |
| `user_credits` | Same Sprint 1 path. |
| `mission_acceptances` | Existing. Mission board reads/writes here — unchanged. |
| `exploration_encounters_resolved` | NEW. Tracks per-player encounter outcomes. RLS: select/insert own rows, admin all. |
| `user_achievements` | Used lightly for lore fragments in Task 3. Field to use is existing text/JSON payload. |

**Before creating `exploration_encounters_resolved`** — check `mcp__claude_ai_Supabase__list_tables` first. May already exist.

---

## Locked decisions (do not re-litigate)

- **GHAI is a platform credit.** $1 USD = 100 GHAI. No token, no crypto. All encounter rewards credit `user_credits.ghai_balance_platform` via `creditGhai`.
- **5 zone shells**, in order: Core → Inner Ring → Mid Ring → Outer Ring → Deep Void. Landmarks and NPCs in Sprint 2 target Core + Inner Ring only.
- **The Cast are contract issuers, not playable.** Named NPCs are a different pool (30 designed pilots). They share space with the Cast but are independent.
- **Bob is the free starter ship.** Soulbound. Not relevant to Sprint 2 directly but keep in mind for any new ship-tier logic.
- **No pay-to-win.** Encounter rewards are earned, not purchased.

---

## Out of scope for Sprint 2 (Sprint 3+)

- Hostile NPC combat AI (pirates flash hostile warnings but don't attack in Sprint 2)
- Full reputation system UI (Task 3 writes rep changes but doesn't surface them)
- 60+ remaining landmarks, 50+ remaining NPCs, 45+ remaining encounters — Sprint 3 batch
- Quest chain state machine (SECTION 4 of universe doc)
- Onboarding tutorial (First Day Real Sky chain)
- Trade goods expansion (SECTION 7)
- Arena modifiers for PvP (SECTION 8)
