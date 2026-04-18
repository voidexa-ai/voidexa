# FREE FLIGHT TEST CHECKLIST
## Last 4-5 days of builds — use this to verify Free Flight features

Test live at https://voidexa.com/freeflight (desktop Chrome required — touch devices show the `DesktopOnlyNotice` banner per Sprint 11).

Every item traces to a real commit. Mark each ❓ → ✅ / ❌ / ⚠️ with evidence.

---

## Scene load + entry

### [ ] 1. `/freeflight` route renders the 3D scene
- **Origin:** Phase 3 — commit `780c35b` (feat: phase 3 Free Flight + galaxy fixes + test runner fix)
- **Route:** `/freeflight`
- **Look for:** Three.js R3F canvas, starfield, cockpit HUD, mission/chain overlay
- **Implementation:** `app/freeflight/page.tsx`, `components/freeflight/FreeFlightPage.tsx`, `FreeFlightCanvas.tsx`, `FreeFlightScene.tsx`
- **Manual verification only** (WebGL surface)

### [ ] 2. Ship Picker opens on first visit
- **Origin:** commit `df3d495` (feat(freeflight): textured .glb models — ship picker, cockpit, NPCs)
- **Route:** `/freeflight`
- **Look for:** Modal "Ship Picker" at load; picks ship from catalog; persists via `getStoredShipId()` localStorage
- **Implementation:** `components/freeflight/FreeFlightPage.tsx:93-100`, `components/freeflight/ships/ShipPicker.tsx`, `ships/catalog.ts`
- **Manual verification only**

### [ ] 3. Desktop-only notice renders on touch devices
- **Origin:** Sprint 11 — commit `75209d8` (feat(sprint-11): mobile responsive audit + DesktopOnlyNotice on 3 desktop-first surfaces)
- **Route:** `/freeflight` on touch device / narrow viewport
- **Look for:** Blocking `DesktopOnlyNotice` banner instead of the WebGL scene
- **Implementation:** `components/ui/DesktopOnlyNotice.tsx`, mounted in `FreeFlightPage.tsx:16`
- **Manual verification only**

---

## Flight controls

### [ ] 4. WASD + mouse + scroll controls respond
- **Origin:** Phase 3 — commit `780c35b`; refined in commit `95698bf` (feat(freeflight): ship rotation, planet collision, cockpit, zoom, free-look, NPCs)
- **Route:** `/freeflight`
- **Action:** Click canvas → pointer lock → W/A/S/D moves ship, mouse rotates, scroll zooms camera
- **Implementation:** `components/freeflight/controls/FlightControls.tsx`, `CameraManager.tsx`
- **Manual verification only**

### [ ] 5. V key toggles cockpit first-person view
- **Origin:** Phase 3 — commit `780c35b`
- **Route:** `/freeflight`
- **Action:** Press V → camera enters cockpit interior; press V again → third-person chase cam returns
- **Implementation:** `components/freeflight/controls/CameraManager.tsx`, `cockpit/CockpitFrame.tsx`
- **Manual verification only**

### [ ] 6. Planet collision prevents ship clipping through planets
- **Origin:** commit `95698bf`
- **Route:** `/freeflight`
- **Action:** Fly directly at a planet → ship halts at surface (not allowed to pass through)
- **Implementation:** `components/freeflight/environment/PlanetCollision.tsx`
- **Manual verification only**

### [ ] 7. Boost trail renders when boosting
- **Origin:** Round 2 polish — commit `9beab8e` (fix: star system polish round 2 (CC-2/3/6/7/8/9/14 + cockpit))
- **Route:** `/freeflight`
- **Action:** Hold boost → glowing trail renders behind ship
- **Implementation:** `components/freeflight/ships/BoostTrail.tsx`
- **Manual verification only**

---

## Cockpit + HUD

### [ ] 8. Cockpit Picker compares 5 Hi-Rez cockpits
- **Origin:** commit `b657dd1` (feat(freeflight): cockpit picker — compare 5 hirez cockpits)
- **Route:** `/freeflight` → open cockpit picker
- **Look for:** 5-cockpit comparison grid with preview; selection persists via `getStoredCockpitId()`
- **Implementation:** `components/freeflight/cockpit/CockpitPicker.tsx`, `cockpit/catalog.ts`
- **Manual verification only**

### [ ] 9. Vattalus Light Fighter cockpit auto-selected for qs_* and small USC ships
- **Origin:** commit `9b3af26` (feat: Vattalus Light Fighter cockpit for qs_* and small USC ships)
- **Route:** `/freeflight` → pick Bob / qs_* ship
- **Look for:** Cockpit loads Vattalus model by default, facing forward through canopy (not backward)
- **Implementation:** `lib/data/shipCockpits.ts` (`getCockpitForShip`), cockpit orientation fix `9a60323`
- **Manual verification only**

### [ ] 10. Pilot seat sits at canopy eye-level (not below dashboard)
- **Origin:** commit `340d729` (fix(cockpit): raise pilot seat to canopy eye-level (offset Y -0.5 → -1.4))
- **Route:** `/freeflight` → press V (first-person)
- **Look for:** View through canopy, not dashboard; horizon visible
- **Manual verification only**

### [ ] 11. CockpitHUD renders hull/shield/velocity/target overlay
- **Origin:** Phase 3 — commit `780c35b`
- **Route:** `/freeflight`
- **Look for:** 2D HUD overlay — hull bar, shield bar, velocity readout, nearest-target chip, dock prompt when near station
- **Implementation:** `components/freeflight/cockpit/CockpitHUD.tsx`
- **Manual verification only**

---

## Universe content — landmarks + NPCs + encounters

### [ ] 12. 20 named landmarks (15 Core + 5 Inner Ring) populate the scene
- **Origin:** Sprint 2 — commit `e36377a` (feat(sprint2): populate freeflight with 20 Core+Inner Ring landmarks)
- **Route:** `/freeflight`
- **Look for:** Distinct primitives (monument, bio_dome, beacon_garden, relay, etc.) with scan-range lore popups
- **Implementation:** `components/freeflight/environment/Landmarks.tsx`, `lib/game/freeflight/landmarks.ts:48+` `LANDMARKS`
- **Test file:** `lib/game/freeflight/__tests__/landmarks.test.ts`

### [ ] 13. Gemini universe catalog adds 160 additional entities
- **Origin:** Sprint 6 — commit `84933b0` (feat(sprint-6): import gemini universe catalog (160 entities) + APIs + freeflight render)
- **Route:** `/freeflight` (extended scene)
- **Look for:** Extra landmark entities from `lib/game/universe/content.json` rendered via `UniverseLandmarks.tsx`
- **Implementation:** `components/freeflight/environment/UniverseLandmarks.tsx`, `lib/game/universe/loaders.ts`
- **Test file:** `lib/game/universe/__tests__/loaders.test.ts`

### [ ] 14. 10 named NPC pilots with dialogue
- **Origin:** Sprint 2 — commit `35be64a` (feat(sprint2): add 10 named NPC pilots with dialogue)
- **Route:** `/freeflight`
- **Action:** Fly close to an NPC → greet → dialogue bubble appears
- **Implementation:** `components/freeflight/environment/NamedNPCs.tsx`, `NPCDialogueBubble.tsx`, `lib/game/freeflight/npcs.ts`
- **Test file:** `lib/game/freeflight/__tests__/npcs.test.ts`

### [ ] 15. 15 scanner-triggered exploration encounters
- **Origin:** Sprint 2 — commit `c953638` (feat(sprint2): 15 scanner-triggered exploration encounters)
- **Route:** `/freeflight`
- **Action:** Scanner sweep near a hidden encounter zone → `ExplorationChoiceModal` opens with choice-outcome pair; resolve → GHAI credited
- **Implementation:** `components/freeflight/environment/ExplorationEncounters.tsx`, `ExplorationChoiceModal.tsx`, `useExplorationResolved.ts`
- **Test file:** `lib/game/freeflight/__tests__/explorationEncounters.test.ts`

### [ ] 16. Nebula zones, derelict ships, warp gates render
- **Origin:** Phase 8 — commit `4bc9d4b` (feat(freeflight): phase 8 stations + universe content (nebula, derelicts, warp gates))
- **Route:** `/freeflight`
- **Look for:** Nebula color zones (tint HUD when inside), derelict ships (scannable, scrap loot), warp gate beacons
- **Implementation:** `components/freeflight/environment/NebulaZones.tsx`, `DerelictShips.tsx`, `WarpGates.tsx`
- **Manual verification only**

---

## Station dock + warp

### [ ] 17. Docking prompt when near Voidexa Hub / stations
- **Origin:** Phase 3 + Phase 8 — commits `780c35b`, `4bc9d4b`
- **Route:** `/freeflight`
- **Action:** Approach station → HUD shows `Press E to Dock` prompt
- **Implementation:** `components/freeflight/environment/SpaceStation.tsx`
- **Manual verification only**

### [ ] 18. Station-to-station warp via holographic map
- **Origin:** Sprint 4 — commit `9febe7f` (feat(sprint4): station-to-station warp with holographic map)
- **Route:** `/freeflight` → dock → open holographic map
- **Look for:** Map overlay of warp-eligible nodes (Core Zone + Inner Ring), GHAI cost per destination
- **Action:** Select destination → `WarpAnimation` plays → ship repositions at target
- **Implementation:** `components/freeflight/HolographicMap.tsx`, `WarpAnimation.tsx`, `useWarp.ts`, `lib/game/warp/network.ts`
- **Test file:** `lib/game/warp/__tests__/network.test.ts`

### [ ] 19. Warp cost formula ceil(distance × 0.3), clamped [30, 180] GHAI
- **Origin:** Sprint 4 — commit `9febe7f`
- **File:** `lib/game/warp/network.ts:18-20` (`WARP_MIN_COST=30`, `WARP_MAX_COST=180`, `WARP_COST_PER_UNIT=0.3`)
- **Look for:** Long-distance warps cap at 180 GHAI; short hops floor at 30 GHAI
- **Test file:** `lib/game/warp/__tests__/network.test.ts`

### [ ] 20. Deep Void has no warp gates (flag ineligible nodes)
- **Origin:** Sprint 4 — commit `9febe7f`
- **Route:** `/freeflight` → open map
- **Look for:** Only Core Zone + Inner Ring nodes are targetable. Deep Void destinations absent per V3 rule.
- **Implementation:** `lib/game/warp/network.ts:16` `WARP_ELIGIBLE_ZONES`

---

## Missions + quest chains + onboarding

### [ ] 21. Tutorial guide (First Day Real Sky) mounts on first visit
- **Origin:** Sprint 3 — commit `dfc3d51` (feat(sprint3): First Day Real Sky onboarding tutorial); extended Sprint 4 `c29b6a9`
- **Route:** `/freeflight` (fresh localStorage)
- **Look for:** Glass `TutorialGuide` panel top-right with step header, issuer quote (Jix/Claude/GPT/etc.), step pips
- **Implementation:** `components/freeflight/TutorialGuide.tsx`, quest chain in `lib/game/quests/chains/firstDayRealSky.ts`
- **Test file:** `lib/game/quests/__tests__/firstDayRealSky.test.ts`

### [ ] 22. "Skip tutorial" button dismisses the onboarding
- **Origin:** Sprint 3 — commit `dfc3d51`
- **Route:** `/freeflight`
- **Action:** Click top-right "Skip tutorial" in TutorialGuide → panel disappears, steps ignored
- **Implementation:** `components/freeflight/TutorialGuide.tsx:35`
- **Manual verification only**

### [ ] 23. 90-mission catalog loads in mission board
- **Origin:** Sprint 2 — commit `f15643c` (feat(sprint2): full 90-mission catalog)
- **File:** `lib/game/missions/catalog.json`, `catalog.ts`
- **Test file:** `lib/game/missions/__tests__/catalog.test.ts`
- **Manual verification only** for UI (mission board UI in `app/game/cards/deck-builder/` per commit `9e1adfb`)

### [ ] 24. Mission completion credits GHAI via unified `creditGhai`
- **Origin:** Sprint 1 — commit `7bf6d50` (feat(sprint1): mission wire, 4 PvE bosses, unified GHAI credit); Sprint 3 unified drop `9e026fc`
- **Route:** `/freeflight` → complete mission
- **Look for:** `useActiveMission` dispatches reward (avg of min/max); toast `+N GHAI`; balance bar increments in nav
- **Implementation:** `components/freeflight/useActiveMission.ts`, `lib/credits/credit.ts`
- **Test file:** `tests/mission-payout.test.ts` (idempotency + 402/23505 paths)

### [ ] 25. Universe Wall activity feed emits events
- **Origin:** Sprint 4 — commit `fe5b511` (feat(sprint4): Universe Wall activity feed with Realtime subscription)
- **Route:** `/freeflight` → complete mission / discover landmark
- **Look for:** Supabase Realtime event broadcast to `universe_wall_events` consumers
- **Implementation:** `lib/game/universeWall/emit.ts`, `events.ts`
- **Test file:** `lib/game/universeWall/__tests__/events.test.ts`

---

## Wrecks + ship recovery

### [ ] 26. Ship destruction → `ShipDownModal` with 4 recovery paths
- **Origin:** Sprint 5 — commit `02605da` (feat(sprint5): wreck system with 4-path recovery and timer phases)
- **Route:** `/freeflight`
- **Action:** Die (0 hull) → modal offers: self-repair, call tow, abandon, buy new ship
- **Implementation:** `components/wrecks/ShipDownModal.tsx`, `components/freeflight/useWrecks.ts`, `lib/game/wrecks/types.ts`
- **Test file:** `lib/game/wrecks/__tests__/economics.test.ts`

### [ ] 27. Class-based claim economics (70% off original price)
- **Origin:** Sprint 5 — commit `02605da`
- **File:** `lib/game/wrecks/economics.ts:33-38`
- **Look for:** Claim totals — common 150 / uncommon 300 / rare 750 / legendary 1500 GHAI; all 70% savings vs new
- **Test file:** `lib/game/wrecks/__tests__/economics.test.ts`

### [ ] 28. Wreck timer windows (15/60m Low Risk, 5/25m High Risk)
- **Origin:** Sprint 5 — commit `02605da`
- **File:** `lib/game/wrecks/types.ts` (`TIMER_WINDOWS`)
- **Route:** `/freeflight` — wreck marker on map
- **Look for:** Visible wreck countdown; expires → despawn
- **Implementation:** `components/freeflight/environment/Wrecks.tsx`

### [ ] 29. Atomic claim API with insurance payout to owner
- **Origin:** Sprint 5 — commit `02605da`
- **Files:** `app/api/wrecks/spawn/route.ts`, `app/api/wrecks/claim/route.ts`
- **Look for:** Third-party claim pays original owner 10% of base price (`insurancePayout`)
- **Manual verification only** for API — unit-tested via `economics.test.ts`

---

## Hauling (trade goods)

### [ ] 30. 30-good trade catalog drives dynamic daily contracts
- **Origin:** Sprint 5 — commit `ec2ce29` (feat(sprint5): hauling trade goods catalog + dynamic daily contracts)
- **Files:** `lib/game/hauling/tradeGoods.json`, `generateContract.ts`
- **Route:** Hauling Hub (`/game/hauling`) → "Dynamic Routes" tab
- **Look for:** 8 procedurally-generated contracts seeded from UTC date; tab hint shows date seed
- **Test file:** `lib/game/hauling/__tests__/generateContract.test.ts`

### [ ] 31. Risk levels map to GHAI multipliers
- **Origin:** Sprint 5 — commit `ec2ce29`
- **Look for:** Safe = 1.0x, Low = 1.0x, Medium = 1.1x, Contested = 1.3x, Wreck Risk = 1.6x (per session log Sprint 5)
- **Implementation:** `lib/game/hauling/generateContract.ts` `riskMultiplier`

---

## Sound system (Sprint 7)

### [ ] 32. 67 renamed sound files load under `public/sounds/`
- **Origin:** Sprint 7 — commit `a7c48de` (feat(sprint-7): sound system — 67 sounds + manager + volume control + freeflight wiring)
- **Route:** `/freeflight`
- **Look for:** SFX triggers on engine start, boost, weapon fire, dock, warp, mission complete (no 404s in DevTools Network)
- **Implementation:** sound manager + volume control wired into `FreeFlightPage.tsx`

### [ ] 33. Volume control overlay functional
- **Origin:** Sprint 7 — commit `a7c48de`
- **Route:** `/freeflight`
- **Look for:** Volume slider overlay; adjusting persists across reloads
- **Manual verification only**

---

## GHAI payouts (cross-cutting)

### [ ] 34. Global GHAI balance pill updates after mission/encounter completion
- **Origin:** Sprint 13d — commit `0cf0d22` (feat(sprint-13d): global GHAI nav balance + shop GHAI prices + mission payout REST)
- **Route:** `/freeflight` with signed-in user
- **Action:** Complete any credit-earning action → `⬡ N GHAI` nav pill increments after REST roundtrip
- **Implementation:** `components/wallet/GhaiBalance.tsx`, `/api/ghai/balance`, `/api/wallet/credit`
- **Test files:** `tests/ghai-balance-component.test.ts`, `tests/mission-payout.test.ts`

### [ ] 35. Exempt accounts (ceo@voidexa.com, tom@voidexa.com) show `Free Access`
- **Origin:** Sprint 13d — commit `0cf0d22`
- **Route:** Any page, signed in as exempt
- **Look for:** Nav balance chip reads `Free Access` instead of numeric balance
- **Implementation:** `components/wallet/GhaiBalance.tsx`

---

## Known gotchas worth re-checking

- **Menu open / Escape** — Escape exits pointer lock AND opens menu. Clicking canvas after Resume re-locks (per Phase 3 session notes).
- **Model load from Supabase CDN** — commit `5a24aa4` moved all `.glb` models to Supabase Storage. If a ship or cockpit shows as the placeholder wireframe, check the model URL in DevTools Network (HEAD check done by `ShipLoader.tsx`).
- **Vercel env trimming** — commit `c073733` trimmed whitespace from SUPABASE_URL and model URLs. If previews regress, inspect env values in Vercel.
