---
name: sprint-6-universe-import
description: Import gemini universe content (80 landmarks, 45 encounters, 20 NPCs, 15 quest chains) into typed modules + API + freeflight
sprint: 6
status: pending
---

## Inputs
`docs/gemini_universe_content_complete.json` — verified 80KB. Keys (sampled):
- `landmarks[]` — `{ id, name, zone, description, scannable, lore_text, visual_type }`
- `encounters[]`, `npcs[]`, `quest_chains[]` — shape verified by sample read

## Deliverables
1. **Data layer**
   - `lib/game/universe/content.json` — copy of the source (deduped, formatted).
   - `lib/game/universe/types.ts` — discriminated unions for the 4 entity kinds.
   - `lib/game/universe/loaders.ts` — `loadLandmarks()`, `loadEncounters()`,
     `loadNpcs()`, `loadQuestChains()` returning typed arrays.
2. **API**
   - `app/api/universe/landmarks/route.ts` — `GET` paginated + `?zone=` filter.
   - `app/api/universe/encounters/route.ts`
   - `app/api/universe/npcs/route.ts`
   - `app/api/universe/quests/route.ts`
   All edge-runtime, cached.
3. **Free Flight integration**
   - `components/freeflight/environment/UniverseLandmarks.tsx` — renders scannable
     landmarks as low-LOD glyphs with a "scan" prompt (E key) within 30u.
   - Wire into `FreeFlightScene.tsx` behind a `enableUniverseContent` prop.
4. **Tests**
   - `lib/game/universe/__tests__/loaders.test.ts` — count assertions
     (≥80 landmarks, ≥45 encounters, ≥20 NPCs, ≥15 quest chains), schema validation.

## Plan
1. Backup tag.
2. Move JSON into `lib/game/universe/content.json` (typed import). Keep `docs/` copy
   as the editorial source — both kept in sync.
3. Write `types.ts` from observed schema. Use `as const` discriminants.
4. Write `loaders.ts` with cached lazy load.
5. Write 4 API routes (thin pass-through with filter/limit).
6. Write `UniverseLandmarks` instanced mesh + scan prompt.
7. Tests + `npx next build`.
8. Commit, tag `sprint-6-complete`, push.

## Gates
- 4+ new test files green (≥10 cases total).
- API routes return 200 on smoke check (build-time prerender or quick `curl` after deploy).
- Free Flight build size delta < 30KB gz.
