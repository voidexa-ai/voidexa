---
name: Sprint 2 — Fill the Universe
description: Use this skill when populating voidexa freeflight with content designed in VOIDEXA_UNIVERSE_CONTENT.md — 20 landmarks (Core + Inner Ring), 10 named NPC pilots with dialogue, 15 scanner-triggered exploration encounters, and the full 90-mission catalog replacing the 8 hardcoded Sprint 1 missions. Trigger on "Sprint 2", "populate freeflight", "add landmarks", "NPC pilots with dialogue", "exploration encounters", "90 mission templates", or "fill the universe".
---

# Sprint 2 — Fill the Universe

**Goal:** freeflight stops feeling empty. Places to see, people to talk to, surprises to find, real mission variety.

Companion doc: `docs/SPRINT2_CLAUDE.md` (file sizes, Supabase tables, locked decisions, per-task files-touched matrix).

Starting state: 410 tests passing, `/freeflight` has 5 planets + 5 stations + 3 derelicts + 8 unnamed NPCs + Sprint 1's mission waypoint renderer.

---

## Task 1 — 20 landmarks (15 Core + 5 Inner Ring)

### Input
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` SECTION 1 — 100 landmark entries
- Existing FreeFlight environment components for style / pattern reference

### Output
- `lib/game/freeflight/landmarks.ts` — 20 typed defs with coordinates, zone, visual type, lore snippet, scan text
- `components/freeflight/environment/Landmarks.tsx` — R3F renderer with proximity detection + per-type geometry
- Landmarks visible from 300+ units, scan prompt at ~80 units, lore popup on scan
- Scan writes to `user_achievements` as lore fragment (if not already present)

### Success criteria
- Fly into `/freeflight`, see at least 15 distinctly colored/shaped landmarks within Core area
- Approach one → scan prompt appears → press F → lore popup shows doc-sourced text
- Fly farther out → 5 Inner Ring landmarks visible past 150 units
- No two landmarks within 40 units of each other (collision-free placement)

### Tests (required)
- `lib/game/freeflight/__tests__/landmarks.test.ts`:
  - exactly 20 entries
  - all ids unique
  - zone values are 'Core Zone' or 'Inner Ring'
  - type is one of the supported primitive types
  - coordinates distribute (assert min-pairwise-distance ≥ 40)
  - every landmark has name + loreSnippet + scanText

---

## Task 2 — 10 named NPC pilots with dialogue

### Input
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` SECTION 5 — 30 NPC entries across 6 role buckets
- Existing `components/freeflight/environment/NPCManager.tsx` for patrol pattern reference

### Output
- `lib/game/freeflight/npcs.ts` — 10 NPC defs: Hauler(2) + Pirate(2) + Salvager(2) + Scout(2) + CastAdjacent(1) + Wildcard(1)
- `components/freeflight/environment/NamedNPCs.tsx` — renderer + proximity + class-specific geometry / color
- `components/freeflight/NPCDialogueBubble.tsx` — HTML dialogue overlay (6s auto-hide)
- Press G within 30 units to greet; pirates show ⚠ HOSTILE warning instead

### Success criteria
- Fly near a Hauler → greet prompt appears → press G → bubble shows greeting for 6s
- Fly near a Pirate → ⚠ HOSTILE banner instead of greet prompt (no combat in Sprint 2)
- All 10 NPCs patrol independent routes based on their home zone
- Colors distinguish role at a glance (friendly = cyan, pirate = red, salvager = orange, scout = violet)

### Tests (required)
- `lib/game/freeflight/__tests__/npcs.test.ts`:
  - exactly 10 NPCs
  - all ids unique
  - at least 5 role buckets represented
  - every NPC has `greeting`, `combat`, `farewell` strings
  - every NPC has a home zone

---

## Task 3 — 15 exploration encounters

### Input
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` SECTION 3 — 60 encounters
- Sprint 1's `lib/credits/credit.ts` for reward payout

### Output
- `lib/game/freeflight/explorationEncounters.ts` — 15 encounter defs with coords, trigger type, 2–4 choices, per-choice outcome
- `components/freeflight/environment/ExplorationEncounters.tsx` — R3F renderer + trigger detection
- `components/freeflight/ExplorationChoiceModal.tsx` — HTML choice modal
- New Supabase table `exploration_encounters_resolved(user_id, encounter_id, outcome, created_at)` with RLS
- Reward credits via `creditGhai(..., { source: 'mission', sourceId: encounter_id })`

### Success criteria
- Fly close to a scanner-ping encounter → HUD blip appears → approach closer → choice modal opens, game pauses
- Pick "Recover" on Loose Breakfast Crate → GHAI balance increases by the reward amount (verify via Supabase or balance readout)
- Fly back to same encounter → does NOT re-trigger (it's in `exploration_encounters_resolved`)
- Choice modal respects 16px body / 14px label minimums, opacity ≥ 0.55

### Tests (required)
- `lib/game/freeflight/__tests__/explorationEncounters.test.ts`:
  - exactly 15 encounters
  - every encounter has 2–4 choices
  - every choice has label + outcome type
  - all 4 trigger types ('visual' | 'audio' | 'scanner_ping' | 'proximity') represented
  - coords seeded from id — calling twice returns the same position
- Existing `lib/credits/__tests__/credit.test.ts` must stay green — encounter payouts must not break idempotency

---

## Task 4 — 90 mission templates

### Input
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` SECTION 2 — 90 missions in 5 categories
- Existing `lib/game/missions/board.ts` with 8 hardcoded `MISSION_TEMPLATES`
- Existing `MissionTemplate` type (keep the shape stable)

### Output
- `lib/game/missions/catalog.ts` — 90 mission defs conforming to `MissionTemplate`
- `lib/game/missions/board.ts` — merged export: union of the 8 hardcoded + 90 catalog, de-duped by id (target: 90 unique, since the 8 are superseded)
- `/game/mission-board` renders all 90 with existing 5 category tabs + All + Recommended (3)
- Mission waypoint generator (Sprint 1) continues to work for all 90 ids (no code change needed — it hashes the id)

### Success criteria
- `/game/mission-board` shows at least 90 mission tiles
- All 5 category filters work (Courier / Rush / Hunt / Recovery / Signal)
- Clicking any mission tile opens the detail modal with doc-sourced objective + flavor + Cast issuer
- Accept button still inserts into `mission_acceptances` (Sprint 1 flow unchanged)
- Flying in `/freeflight` after accepting a new-catalog mission produces waypoints

### Tests (required)
- `lib/game/missions/__tests__/catalog.test.ts`:
  - ≥ 90 entries
  - all ids unique across the merged export
  - all 5 categories represented with ≥ 10 missions each
  - every mission has name, category, issuer, zone, objective, rewardMin/Max, risk, timeEstimate, flavor
  - rewardMin ≤ rewardMax for every mission
  - every `issuer` is a valid Cast member id

---

## Overall success criteria (ship gate)

When Sprint 2 is done:

1. **Freeflight feels alive** — fly for 60 seconds and encounter at least: 3 landmarks, 2 NPCs, 1 scanner blip
2. **Scan flow works** — can scan a landmark + get lore popup
3. **Greet flow works** — can approach an NPC + get a dialogue bubble
4. **Encounter flow works** — one encounter run end-to-end, choice → GHAI credited → idempotent on re-approach
5. **90 missions live** — `/game/mission-board` shows the full catalog, all filters functional
6. **Tests green** — full suite (targeting ~425+), no regressions from the 410 baseline
7. **Build clean** — `npm run build` passes with only the pre-existing bigint warning
8. **Deployed** — one final `git push origin main` lands Sprint 2 on voidexa.com

## Non-goals

- Remaining 80 landmarks / 20 NPCs / 45 encounters (Sprint 3)
- Quest chain state machine (Sprint 3)
- Hostile NPC combat (Sprint 3+)
- Reputation UI (Sprint 3+)
- Trade goods expansion, arena modifiers (Sprint 4+)

## Pre-work

1. **Git backup first.** Tag current head as `pre-sprint2-<date>` OR create a backup commit. One-line rollback if a task goes wrong.
2. Read `docs/SPRINT2_CLAUDE.md` end-to-end before touching code.
3. Confirm `ghai_transactions` index from Sprint 1 is still live (`mcp__claude_ai_Supabase__list_tables` → inspect indexes).

## Commit style

Sprint 1 bundled 3 tasks into 1 commit when they shared plumbing. For Sprint 2, 4 separate commits is cleaner because each task touches distinct files:

- `feat(sprint2): populate freeflight with 20 Core+Inner Ring landmarks`
- `feat(sprint2): add 10 named NPC pilots with dialogue`
- `feat(sprint2): 15 scanner-triggered exploration encounters`
- `feat(sprint2): full 90-mission catalog`

Each commit runs `npm run build` + `npm run test` before landing. No skip-ci, no `--no-verify`.
