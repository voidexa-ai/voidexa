# Sprint 5 — Manual Verification Checklist

**Purpose:** every gameplay mode has unit tests, but the browser-level
integration has never been clicked through in production. This doc is a
scripted run-through a human performs before any deploy that touches
gameplay code. Each step has an expected observable outcome and, where
applicable, the pure-function contract that the integration test suite
pins in `lib/game/__tests__/integration.test.ts`.

**Env:** run against production (`https://voidexa.com`). `ALDRIG test på
localhost` per project rule. Set `NEXT_PUBLIC_DEBUG_GAMEPLAY=true` in
Vercel preview if you need the `gplog()` trace to fire in DevTools.

---

## 1. Speed Run — `/game/speedrun`

1. Pick **Core Circuit** from the track list.
2. Fly through the first gate.
   - [ ] Gate collision detection registers (gate color changes / clear SFX).
   - [ ] Timer ticks.
3. Pick up a power-up (look for a glowing cube on the route).
   - [ ] Active power-up indicator shows in HUD.
   - [ ] Boost / shield / whatever the power-up does fires visibly.
4. Finish the run under par.
   - [ ] Grade resolves to **gold** (pinned by `calculateGrade(timeMs<=par, par, true) === 'gold'`).
5. "Save Run" commits.
   - [ ] Leaderboard list shows the new entry within one refresh cycle.
   - [ ] If not auto-refreshing, refresh button works. If neither, file a fix.

## 2. Hauling — `/game/hauling`

1. Open the hub. Confirm two tabs: **Legacy Routes** (6 contracts) and
   **Dynamic Routes** (8 contracts for today's UTC date).
   - [ ] Tab badge on Dynamic shows `8/day`.
   - [ ] Tab hint shows today's date seed (YYYY-MM-DD UTC).
2. Accept one **Legacy** "Core Parcel Run".
   - [ ] Row inserts in `hauling_contracts` with `status='active'`.
3. Fly to the first checkpoint.
   - [ ] Encounter modal may fire (weights pinned by `rollEncounter`).
   - [ ] Ship controls pause while modal is open (pointer-lock released).
4. Resolve the encounter, continue to destination.
5. Deliver with ≥90% integrity.
   - [ ] `DeliveryResults` shows **Gold** (pinned by `deliveryGrade('delivered', 90)`).
   - [ ] GHAI balance increments by `deliveryBaseReward(...)` + bonus.
6. Repeat once with a **Dynamic Routes** contract.
   - [ ] Same delivery flow works.
   - [ ] `mission_template` starts with `dynamic_` so Sprint 3 credit flow fires unchanged.

## 3. Missions — `/game/mission-board`

1. Accept a timed mission.
2. Fly to its waypoint in Free Flight.
   - [ ] Waypoint marker visible in the scene.
   - [ ] Pass-through triggers mission completion.
3. [ ] GHAI credited server-side (`creditGhai({source:'mission'})`).

## 4. Battle — `/game/battle`

1. Pick a tier 1 encounter.
2. Win the fight.
   - [ ] Loot card drops.
   - [ ] GHAI reward credits to wallet.

## 5. Packs — `/shop/packs`

1. Open a Standard Pack.
   - [ ] 5 cards reveal with rarity animation.
   - [ ] Collection updates.

## 6. Wreck (new) — Free Flight

1. Take damage until `health <= 0`.
   - [ ] `ShipDownModal` opens with four options:
         Self-Repair / Tow / Abandon / Buy New.
2. Click **Self-Repair**.
   - [ ] GHAI deducts via `spendGhai({source:'repair'})`.
   - [ ] Ship restores, wreck dissolves from scene.
3. In a second browser (or incognito), approach an abandoned wreck.
   - [ ] `ClaimModal` offers the claim with class-tier economics visible.
   - [ ] Accept → ship enters `ship_inventory`, original owner receives 10%.

## 7. Warp — `/freeflight`

1. Approach a warp gate.
2. Press **W**.
   - [ ] Star map overlay opens.
3. Pick a destination.
   - [ ] Ship teleports to destination coordinates.

## 8. Tutorial — new-pilot account

1. Sign in as a freshly created account.
2. Do a speed run + save.
   - [ ] "First Day Real Sky" tutorial advances to the next step.

---

## Known fragile areas — extra attention needed

| Area | Risk | What to watch |
|------|------|---------------|
| Leaderboard post-save refresh | Medium | Old list may cache. Hard-reload after save if not updating. |
| Encounter modal pointer-lock | Medium | Confirm mouse is released while modal is open. |
| GHAI toast race | Low | Toast should appear AFTER `creditGhai` resolves, not before. |
| Wreck expiry | Unknown | Wreck should disappear after `expires_at` — verify with short timer tier. |

## Pure-function contracts pinned by integration tests

- `calculateGrade(time, par, completed)` — speed run
- `deliveryGrade(outcome, integrity)` / `deliveryBaseReward(...)` — hauling
- `rollEncounter(weights, rand)` + `weightsForRisk(risk)` — hauling encounters
- `generateRoute(contract)` — hauling route shape
- `generateDailyContracts(seed)` + `distanceMultiplier` + `riskMultiplier`
- `riskTierForZone` + `timerWindow` + `computeClaimEconomics` — wrecks

If any of these signatures change, the integration suite in
`lib/game/__tests__/integration.test.ts` breaks first.

## Debug trace

Set `NEXT_PUBLIC_DEBUG_GAMEPLAY=true` (remember the `.trim()`) to enable
`gplog()` output in DevTools. Sample events once call sites are wired:

```
[SPEEDRUN] gate cleared 1/8
[HAULING] encounter fired combat
[WRECK] phase transition protected → abandoned
```

Call `gplogEnabled()` at runtime to assert the flag is on.
