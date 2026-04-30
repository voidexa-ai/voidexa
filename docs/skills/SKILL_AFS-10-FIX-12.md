# SKILL — AFS-10-FIX-12: Corrected Camera Flip + Voidexa/Apps/Station Bumps + Labels

**Sprint:** AFS-10-FIX-12
**Parent sprint:** AFS-10 (visual polish layer, replacement for rolled-back FIX-11)
**Type:** Camera + size + label tuning (CORRECTED direction)
**Priority:** P1 (visual polish — Jix wants depth-perspective from BEHIND claim, not from far front)
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

FIX-11 was rolled back because the camera was flipped to the WRONG side. FIX-11 put camera at z=+90 (further front of system) — same direction as before, just further out. Result: entire system shrank to a small cluster.

**Jix's actual intent:** Camera 180°-flipped to the **BACK side of the system** at negative z, BEHIND claim-your-planet (which sits at z=-60). Camera looks FORWARD toward voidexa at origin.

**Correct geometry:**
- Satellites occupy negative z space: z ranges from -15 (game-hub) to -60 (claim)
- Voidexa at origin [0, 0, 0]
- Old camera: positive z (+12), looking into negative z = looking AT voidexa with satellites behind it
- **NEW camera: negative z (-90), looking toward positive z = looking THROUGH satellites (claim → trading-hub → quantum) toward voidexa**

This produces the depth-line view Jix described: claim in foreground, then trading-hub, then quantum, then voidexa, with apps/game-hub/etc behind voidexa.

---

## SCOPE — 6 changes (same content as FIX-11, corrected camera direction)

### IN SCOPE

1. **Camera position** in `StarMapCanvas.tsx:16` (NOT StarMapScene — file mapping verified during FIX-11):
   - `[0, 0, 12]` → `[0, 5, -90]` (negative z, behind claim at z=-60)

2. **OrbitControls target** in `StarMapScene.tsx:131`:
   - `[0, -0.5, -4]` → `[0, 0, 0]` (mod voidexa direkte)

3. **OrbitControls maxDistance** in `StarMapScene.tsx:128`:
   - `80` → `150`
   - Math: camera at [0, 5, -90] from target [0, 0, 0] = sqrt(0 + 25 + 8100) = **90.14**. Within new maxDistance 150 ✅

4. **Voidexa size** in `nodes.ts`: `1.8` → `3.5` (bigger than FIX-11's 3.0 — sun is now THE focal point of the depth line)

5. **Apps size** in `nodes.ts`: `2.46` → `3.5` (pink gas giant, matches voidexa size — they're both prominent from new POV)

6. **Space Station size + position** in `nodes.ts`:
   - size: `1.26` → `2.5`
   - position: `[4.5, 6, -30]` → `[10, 8, -36]` (separation from Contact + Game Hub cluster)

7. **Labels** in `NodeMesh.tsx`:
   - Sun (isCenter): `35px` → `45px`
   - Satellite: `30px` → `39px`
   - Subtitle: `27px` → `35px`

### OUT OF SCOPE

- Other 7 satellite sizes (ai-tools, services, game-hub, contact, quantum, trading-hub, claim-your-planet at FIX-10 values)
- Other 7 satellite positions UNCHANGED from FIX-9
- Sphere radius (800)
- Camera FOV (60°)
- Camera far plane (20000)
- OrbitControls minDistance (5)
- OrbitControls drag-rotate — STAYS ENABLED
- Galaxy view `/starmap`
- NodeMesh geometry (Saturn rings, Space Station modules — auto-scale with size)
- "While I'm in here..." anything else

---

## CRITICAL — APPARENT-SIZE CHECK FOR NEW CAMERA

Camera at [0, 5, -90], target [0, 0, 0]. Distances from camera to each node:

| ID | Position | Distance from camera | Apparent size (size/dist) |
|---|---|---|---|
| voidexa | [0, 0, 0] | sqrt(0+25+8100) = 90.14 | 3.5/90.14 = **0.0388** ← biggest |
| claim-your-planet | [-18, -6, -60] | sqrt(324+121+900) = 36.69 | 1.54/36.69 = **0.0420** ← BIGGER than voidexa! |
| trading-hub | [-9, 12, -54] | sqrt(81+49+1296) = 37.77 | 1.96/37.77 = **0.0519** ← BIGGER |
| quantum | [18, -9, -48] | sqrt(324+196+1764) = 47.79 | 2.24/47.79 = **0.0469** ← BIGGER |
| station | [10, 8, -36] | sqrt(100+9+2916) = 55.00 | 2.5/55.00 = **0.0455** ← BIGGER |
| contact | [12, 9, -30] | sqrt(144+16+3600) = 61.32 | 2.10/61.32 = 0.0342 |
| game-hub | [9, 6, -15] | sqrt(81+1+5625) = 75.54 | 2.46/75.54 = 0.0326 |
| ai-tools | [0, -9, -24] | sqrt(0+196+4356) = 67.47 | 2.46/67.47 = 0.0365 |
| services | [15, -3, -21] | sqrt(225+64+4761) = 71.04 | 2.46/71.04 = 0.0346 |
| apps | [-12, 4.5, -18] | sqrt(144+0.25+5184) = 73.00 | 3.5/73.00 = 0.0479 ← BIGGER |

**🔴 PROBLEM: From new camera, voidexa is NOT apparent-largest.** 5 satellites appear bigger:
- trading-hub 0.0519, quantum 0.0469, station 0.0455, claim 0.0420, apps 0.0479

This is the **intended visual** per Jix: claim/trading-hub/quantum are CLOSER to camera (foreground) so they SHOULD look bigger. Voidexa sits in mid-distance. The "depth line" effect requires this.

**Test impact:** FIX-8 apparent-size assertion (which assumes voidexa is always apparent-biggest) MUST be relaxed or rewritten. The assumption is no longer valid when camera is on far side.

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `191f9f2` (post-rollback FIX-10 state)
- Working tree clean
- backup tag `backup/pre-afs-10-fix-11-20260430` may still exist (orphaned, harmless — Jix said leave it)

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-12-20260430
git push origin backup/pre-afs-10-fix-12-20260430
```

### Task 0.3 — Verify current state matches FIX-10

```bash
cat components/starmap/nodes.ts
grep -A 2 "fontSize\|position={\[" components/starmap/NodeMesh.tsx components/starmap/StarMapScene.tsx components/starmap/StarMapCanvas.tsx | head -50
```

**Cross-check:**
- voidexa size = 1.8
- apps size = 2.46
- station size = 1.26
- station position = [4.5, 6, -30]
- Camera position in StarMapCanvas.tsx = [0, 0, 12]
- OrbitControls target in StarMapScene.tsx = [0, -0.5, -4]
- maxDistance in StarMapScene.tsx = 80
- Label fontSize sun=35, sat=30, sub=27

**Report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-12

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Current state cross-check:
    All FIX-10 baseline values match: [✅/🔴 list]

Computed FIX-12 targets:
    voidexa size:      1.8 → 3.5
    apps size:         2.46 → 3.5
    station size:      1.26 → 2.5
    station position:  [4.5, 6, -30] → [10, 8, -36]
    camera position:   [0, 0, 12] → [0, 5, -90]   (StarMapCanvas.tsx:16)
    camera target:     [0, -0.5, -4] → [0, 0, 0]   (StarMapScene.tsx:131)
    maxDistance:       80 → 150                    (StarMapScene.tsx:128)
    labels:            35/30/27 → 45/39/35

Camera-to-target distance: 90.14 (within new maxDistance 150 ✅)

Apparent-size analysis from new POV:
    Voidexa is NOT apparent-largest (claim/trading-hub/quantum are closer to camera).
    This is INTENTIONAL per Jix's depth-line design.
    FIX-8 apparent-size assertion must be replaced.
```

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After Task 0.1-0.3, output the pre-flight report.

**WAIT FOR JIX EXPLICIT APPROVAL.**

Lock format:
```
LOCKED:
- Camera: [0, 5, -90] (negative z — BEHIND claim)
- Target: [0, 0, 0]
- maxDistance: 150
- voidexa: 3.5
- apps: 3.5
- station: 2.5 + [10, 8, -36]
- labels: 45/39/35
- FIX-8 apparent-size assertion: REPLACE with depth-aware version
- OrbitControls drag-rotate: stays enabled
```

---

## TASK 1 — UPDATE nodes.ts

Edit `components/starmap/nodes.ts`:

1. voidexa: `size: 1.8` → `size: 3.5`
2. apps: `size: 2.46` → `size: 3.5`
3. station: `size: 1.26` → `size: 2.5`, `position: [4.5, 6, -30]` → `position: [10, 8, -36]`

DO NOT touch any other size or position.

```bash
npx tsc --noEmit
```

---

## TASK 2 — UPDATE NodeMesh.tsx

- Main label (isCenter): `'35px'` → `'45px'`
- Main label (satellite): `'30px'` → `'39px'`
- Subtitle: `'27px'` → `'35px'`

```bash
npx tsc --noEmit
```

---

## TASK 3 — UPDATE StarMapCanvas.tsx + StarMapScene.tsx

`StarMapCanvas.tsx:16`:
- `camera={{ position: [0, 0, 12], ... }}` → `camera={{ position: [0, 5, -90], ... }}`

`StarMapScene.tsx:131`:
- OrbitControls `target={[0, -0.5, -4]}` → `target={[0, 0, 0]}`

`StarMapScene.tsx:128`:
- `maxDistance={80}` → `maxDistance={150}`

OrbitControls drag-rotate UNCHANGED (do not pass `enableRotate={false}`).

```bash
npx tsc --noEmit
```

---

## TASK 4 — UPDATE EXISTING TESTS

### Same updates as FIX-11 attempted (positions/sizes/camera/maxDistance/labels), PLUS one new override:

**FIX-8 apparent-size assertion** (afs-10-fix-8-planet-scale.test.ts) — currently asserts voidexa apparent-biggest. From new camera, this is FALSE.

REPLACE with:

```ts
it('voidexa is the largest body by raw size or matched by 1 satellite (apps)', () => {
  const voidexa = nodes.find(n => n.id === 'voidexa')!
  const satellites = nodes.filter(n => n.id !== 'voidexa')
  const biggerOrEqual = satellites.filter(n => n.size >= voidexa.size)
  // From depth POV (FIX-12), apparent size depends on camera distance.
  // Raw size invariant: at most 1 satellite (apps) matches voidexa.
  expect(biggerOrEqual.length).toBeLessThanOrEqual(1)
})
```

This makes the assertion camera-independent — it's about raw geometry, which we control.

### Other test updates (same as FIX-11 list):

- FIX-3 camera regex: `[0, 0, 12]` → `[0, 5, -90]`
- FIX-3 maxDistance regex: `80` → `150`
- FIX-8 hardcoded camera in apparent-size: `[0, 0, 12]` → `[0, 5, -90]`
- FIX-8 voidexa.size: `0.9` or `1.8` → `3.5`
- FIX-8 apps.size: `2.46` → `3.5`
- FIX-9 voidexa.size: `1.8` → `3.5`
- FIX-9 fontSize regex: `35/30/27` → `45/39/35`
- FIX-10 voidexa.size: `1.8` → `3.5`
- FIX-10 apps.size: `2.46` → `3.5`
- FIX-10 sun×4 sanity: still passes (3.5 × 4 = 14, max satellite 3.5)

### Distance-based assertions in FIX-9:
- station distance after move: was 30.92, new sqrt(100+64+1296) = 37.42. Still in 18-65 range ✅

```bash
npm test -- --run
```

Report exact count delta.

---

## TASK 5 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-12-camera-flip.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nodes } from '../nodes'

describe('AFS-10-FIX-12 — corrected camera flip (negative z)', () => {
  it('voidexa size is 3.5 (focal point from depth POV)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(3.5, 1)
  })

  it('apps size matches voidexa at 3.5 (pink gas giant prominence)', () => {
    const apps = nodes.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(3.5, 1)
  })

  it('station size 2.5 + relocated to [10, 8, -36]', () => {
    const station = nodes.find(n => n.id === 'station')!
    expect(station.size).toBeCloseTo(2.5, 1)
    expect(station.position).toEqual([10, 8, -36])
  })

  it('voidexa position UNCHANGED at origin', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
  })

  it('non-station satellite positions UNCHANGED from FIX-9', () => {
    const apps = nodes.find(n => n.id === 'apps')!
    expect(apps.position).toEqual([-12, 4.5, -18])
    
    const claim = nodes.find(n => n.id === 'claim-your-planet')!
    expect(claim.position).toEqual([-18, -6, -60])
    
    const gameHub = nodes.find(n => n.id === 'game-hub')!
    expect(gameHub.position).toEqual([9, 6, -15])
  })

  it('all 10 nodes preserved', () => {
    expect(nodes.length).toBe(10)
  })

  it('claim-your-planet sits at most-negative z (back of system from old POV, FRONT from new POV)', () => {
    const claim = nodes.find(n => n.id === 'claim-your-planet')!
    const otherSatellites = nodes.filter(n => n.id !== 'voidexa' && n.id !== 'claim-your-planet')
    for (const node of otherSatellites) {
      expect(claim.position[2]).toBeLessThanOrEqual(node.position[2])
    }
  })
})
```

```bash
npm test -- --run afs-10-fix-12-camera-flip
```

Expected: 7/7 green.

---

## TASK 6 — BUILD VERIFICATION

```bash
npm run build
```

---

## TASK 7 — COMMIT + TAG + PUSH

SKILL first if not committed:
```bash
git add docs/skills/SKILL_AFS-10-FIX-12.md
git commit -m "chore(afs-10-fix-12): add corrected camera flip SKILL"
```

Sprint:
```bash
git add components/starmap/nodes.ts
git add components/starmap/NodeMesh.tsx
git add components/starmap/StarMapCanvas.tsx
git add components/starmap/StarMapScene.tsx
git add components/starmap/__tests__/afs-10-fix-12-camera-flip.test.ts
git add [test files updated in Task 4]
git status
```

```bash
git commit -m "fix(afs-10-fix-12): camera flip BEHIND claim looking toward voidexa

CORRECTED direction vs rolled-back FIX-11. Camera now at z=-90
(behind claim at z=-60), looking toward voidexa at origin.
Depth-line view: claim → trading-hub → quantum → voidexa →
apps/game-hub behind sun.

Voidexa 1.8 → 3.5 (focal point of depth line).
Apps 2.46 → 3.5 (pink gas giant prominence).
Station 1.26 → 2.5 + position [4.5,6,-30] → [10,8,-36].

Labels 35/30/27 → 45/39/35.
maxDistance 80 → 150 (camera dist 90 to target [0,0,0]).

FIX-8 apparent-size assertion replaced with raw-size-invariant
version (apparent size now camera-dependent by design)."

git tag sprint-afs-10-fix-12-complete
git push origin main
git push origin sprint-afs-10-fix-12-complete
```

```bash
git status
git log origin/main --oneline -3
```

---

## TASK 8 — LIVE VERIFY (Jix-performed)

Wait ≥90s for Vercel deploy. Hard-refresh `/starmap/voidexa` incognito.

### 8.1 Default view — DEPTH LINE
- ✅ **Claim-your-planet visible LARGE in foreground** (it's the closest to camera now)
- ✅ Behind claim: trading-hub
- ✅ Behind trading-hub: quantum (Saturn rings)
- ✅ In middle distance: voidexa (sun) — bigger than FIX-10
- ✅ Behind voidexa: apps + game-hub + station + others
- ✅ Visible depth-line gradient — far planets smaller, near planets bigger
- ✅ Apps prominent (3.5)
- ✅ Station separated from Contact + Game Hub
- ✅ Labels readable (45/39/35px)

### 8.2 Drag-rotate
- ✅ Drag → camera rotates around target [0, 0, 0]
- ✅ Can rotate to old front-view POV
- ✅ No camera lock

### 8.3 Zoom
- ✅ Scroll-out works up to 150
- ✅ Scroll-in to 5

### 8.4 Regression
- ✅ All 10 planets visible
- ✅ Galaxy view UNCHANGED
- ✅ Routes load (/game-hub 404 = pre-existing)
- ✅ No new console errors

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST
- [ ] Backup tag pushed
- [ ] Pre-flight report delivered + locks confirmed
- [ ] nodes.ts: voidexa 3.5, apps 3.5, station 2.5 + [10,8,-36]
- [ ] NodeMesh.tsx: 45/39/35
- [ ] StarMapCanvas.tsx: camera [0, 5, -90]
- [ ] StarMapScene.tsx: target [0, 0, 0], maxDistance 150
- [ ] FIX-8 apparent-size assertion replaced with raw-size version
- [ ] All other tests updated
- [ ] FIX-12 regression test (7 assertions) green
- [ ] `npm run build` succeeds
- [ ] Committed + tagged + pushed
- [ ] Vercel deployed
- [ ] Jix live-verifies depth-line view from BEHIND claim toward voidexa

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-12-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-12-complete
git tag -d sprint-afs-10-fix-12-complete
```

---

## RISKS

- **R1 — Camera at z=-90 puts user behind sphere edge.** Sphere radius 800. Camera at z=-90 well within (8.9× margin). Safe.
- **R2 — Apparent-size assertion break.** Mitigation: replaced with raw-size-invariant version in Task 4.
- **R3 — Claim-your-planet (1.54 size) appears HUGE in foreground.** This is intended depth perspective. If Jix wants claim smaller, FIX-13 reduces claim size.
- **R4 — Voidexa label drops below planet body now (label position offset = -(3.5 + 0.55) = -4.05).** Should still be readable, just lower.
- **R5 — Station↔Contact 1.8-unit gap (same as FIX-11 risk).** Live verify will tell. FIX-13 micro-tunes if grotesque.
- **R6 — Saturn rings on Quantum: from new camera, Quantum is 47.79 units away. Rings still proportional (auto-scale with size).**

---

## RULES APPLIED

- **Rule A:** Searched conversation_search — FIX-11 rolled back, learned from wrong direction ✅
- **Rule B:** Math verified — camera distance 90.14 within maxDistance 150
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Locks from Jix in chat (camera at z=-90 behind claim, looking toward voidexa) captured
- **Rule E:** Scope respects all FIX-3 through FIX-10 except where explicitly changed
- **Rule F:** apparent-size FIX-8 assertion explicitly replaced (camera-dependent → camera-independent)

---

# END SKILL — AFS-10-FIX-12
