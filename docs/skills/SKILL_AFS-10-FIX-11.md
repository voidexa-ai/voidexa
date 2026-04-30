# SKILL — AFS-10-FIX-11: Camera Flip + Voidexa/SpaceStation/Apps Bumps + Labels

**Sprint:** AFS-10-FIX-11
**Parent sprint:** AFS-10 (visual polish layer, follow-up to FIX-10)
**Type:** Camera + size + label tuning
**Priority:** P1 (visual polish — Jix wants depth-perspective view from far side)
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

After AFS-10-FIX-10 shipped (2x satellite size + 2x sun + 1.3x labels), Jix uploaded screenshots showing:

1. The user's manual rotation revealed a "depth perspective" view from the FAR side of claim-your-planet, looking through claim → trading-hub → quantum → voidexa. Jix wants THIS to be the default camera view — not the current front-facing view.

2. From the new POV, Space Station + Game Hub + Contact cluster too tightly together. Space Station needs more distance.

3. Voidexa should be larger to dominate the new POV.

4. Apps (pink gas giant) should be the largest satellite — like the reference image's pink gas giant prominence.

5. Labels still too small — bump again.

6. OrbitControls drag-to-rotate must remain enabled (default = depth view, but user can rotate freely).

---

## SCOPE — 6 changes

### IN SCOPE

1. **Camera flip** in `components/starmap/StarMapScene.tsx`:
   - Position: `[0, 0, 12]` → `[0, 5, 90]`
   - Target (in OrbitControls): `[0, -0.5, -4]` → `[0, 0, -30]`
   - OrbitControls: drag-rotate STAYS ENABLED (do not lock)

2. **Voidexa size** in `nodes.ts`: `1.8` → `3.0`

3. **Space Station size** in `nodes.ts`: `1.26` → `2.5`

4. **Space Station position** in `nodes.ts`: `[4.5, 6, -30]` → `[10, 8, -36]`
   (separation from Contact at [12, 9, -30] and Game Hub at [9, 6, -15])

5. **Apps size** in `nodes.ts`: `2.46` → `3.5`

6. **Labels** in `NodeMesh.tsx`:
   - Sun (isCenter): `35px` → `45px`
   - Satellite: `30px` → `39px`
   - Subtitle: `27px` → `35px`

### OUT OF SCOPE — DO NOT TOUCH

- Other 7 satellite sizes (ai-tools, services, game-hub, contact, quantum, trading-hub, claim-your-planet stay at FIX-10 values)
- Other 7 satellite positions (UNCHANGED from FIX-9)
- Sphere radius (800)
- Camera FOV (60°)
- Camera far plane (20000)
- OrbitControls minDistance / maxDistance (5–80) — but VERIFY new camera at z=90 + maxDistance 80 = camera within range from new target. Math: distance from target [0,0,-30] to camera [0,5,90] = sqrt(0 + 25 + 14400) = ~120. **🔴 EXCEEDS maxDistance 80.**

→ **Lock decision needed at Checkpoint 1:** bump maxDistance to 150, OR reduce camera z to fit within 80?

### Camera distance math

From target `[0, 0, -30]` to candidate camera positions:
- `[0, 5, 90]` → distance = sqrt(0 + 25 + 14400) = **120.1** (exceeds maxDistance 80)
- `[0, 5, 70]` → distance = sqrt(0 + 25 + 10000) = **100.1** (still exceeds)
- `[0, 5, 50]` → distance = sqrt(0 + 25 + 6400) = **80.16** (right at limit)
- `[0, 5, 45]` → distance = sqrt(0 + 25 + 5625) = **75.17** (within)

**Recommendation:** bump maxDistance 80 → 150 to allow camera at z=90 + future user zoom-out room. Bumping maxDistance is safer than truncating Jix's intent.

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `191f9f2` (post AFS-10-FIX-10) or newer
- Working tree clean (carryover untracked OK)

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-11-20260430
git push origin backup/pre-afs-10-fix-11-20260430
```

### Task 0.3 — Verify current state matches FIX-10

```bash
cat components/starmap/nodes.ts
grep -A 2 "fontSize\|position={\[" components/starmap/NodeMesh.tsx components/starmap/StarMapScene.tsx | head -40
```

**Cross-check:**
- voidexa size = 1.8
- apps size = 2.46
- station size = 1.26
- station position = [4.5, 6, -30]
- Other nodes match FIX-10 expected
- Camera position = `[0, 0, 12]`
- OrbitControls target = `[0, -0.5, -4]`
- OrbitControls maxDistance = 80
- Label fontSize sun=35, sat=30, sub=27

**Report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-11

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Current state cross-check:
    voidexa size: 1.8 [✅/🔴]
    apps size: 2.46 [✅/🔴]
    station size: 1.26 [✅/🔴]
    station position: [4.5, 6, -30] [✅/🔴]
    camera position: [0, 0, 12] [✅/🔴]
    camera target: [0, -0.5, -4] [✅/🔴]
    maxDistance: 80 [✅/🔴]
    label fontSize: 35/30/27 [✅/🔴]

Computed FIX-11 targets:
    voidexa size: 1.8 → 3.0
    apps size: 2.46 → 3.5
    station size: 1.26 → 2.5
    station position: [4.5, 6, -30] → [10, 8, -36]
    camera position: [0, 0, 12] → [0, 5, 90]
    camera target: [0, -0.5, -4] → [0, 0, -30]
    maxDistance: 80 → 150 (proposed)
    label fontSize: 35/30/27 → 45/39/35

Camera-to-target distance check:
    New camera distance from new target: 120.1
    Current maxDistance: 80
    Required maxDistance: ≥120 (proposed 150 for zoom room)
```

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After Task 0.1-0.3, output the pre-flight report.

**WAIT FOR JIX EXPLICIT APPROVAL** with locked values (especially maxDistance — see math above).

Lock format:
```
LOCKED:
- voidexa size: 3.0
- apps size: 3.5
- station size: 2.5
- station position: [10, 8, -36]
- camera position: [0, 5, 90]
- camera target: [0, 0, -30]
- maxDistance: 150
- labels: 45/39/35
- OrbitControls drag-rotate: STAYS ENABLED
```

---

## TASK 1 — UPDATE nodes.ts

Edit `components/starmap/nodes.ts`:

1. voidexa: `size: 1.8` → `size: 3.0`
2. apps: `size: 2.46` → `size: 3.5`
3. station: `size: 1.26` → `size: 2.5`, `position: [4.5, 6, -30]` → `position: [10, 8, -36]`

**DO NOT touch:** voidexa position, any other satellite size or position.

Run typecheck:
```bash
npx tsc --noEmit
```

---

## TASK 2 — UPDATE NodeMesh.tsx labels

Edit `components/starmap/NodeMesh.tsx`:

- Main label (isCenter): `'35px'` → `'45px'`
- Main label (satellite): `'30px'` → `'39px'`
- Subtitle: `'27px'` → `'35px'`

Label position offset `position={[0, -(size + 0.55), 0]}` UNCHANGED — auto-scales with size.

Run typecheck:
```bash
npx tsc --noEmit
```

---

## TASK 3 — UPDATE StarMapScene.tsx camera + OrbitControls

Edit `components/starmap/StarMapScene.tsx`:

1. Camera initial position: `[0, 0, 12]` → `[0, 5, 90]`
2. OrbitControls `target` prop: `[0, -0.5, -4]` → `[0, 0, -30]`
3. OrbitControls `maxDistance` prop: `80` → `150`
4. OrbitControls `minDistance` UNCHANGED at 5
5. OrbitControls drag-rotate UNCHANGED (do not pass `enableRotate={false}` or similar)

**Verify:** The component still mounts; camera + controls are at top of scene component.

Run typecheck:
```bash
npx tsc --noEmit
```

---

## TASK 4 — UPDATE EXISTING TESTS

```bash
grep -rn "voidexa.*size\|apps.*size\|station.*size\|station.*position\|camera.*position\|maxDistance\|fontSize" tests/ components/starmap/__tests__/ 2>/dev/null | head -40
```

Categorize and update:
- voidexa size assertions: `1.8` → `3.0`
- apps size assertions: `2.46` → `3.5`
- station size assertions (if any): `1.26` → `2.5`
- station position assertions: `[4.5, 6, -30]` → `[10, 8, -36]`
- camera position assertions (FIX-3 era): `[0, 0, 12]` → `[0, 5, 90]`
- camera target assertions: `[0, -0.5, -4]` → `[0, 0, -30]`
- maxDistance assertions: `80` → `150`
- fontSize regex assertions: `27px/23px/21px` or `35px/30px/27px` → `45px/39px/35px`

**FIX-9 spacing test (afs-10-fix-9-spacing-labels.test.ts):**
- Distance assertion for station: was [4.5, 6, -30] → distance ~30.92. New [10, 8, -36] → distance ~38.0. Still within 18-65 range, but UPDATE the explicit position assertion if any.

**FIX-10 size-bump test (afs-10-fix-10-size-bump.test.ts):**
- voidexa size assertion: `toBeCloseTo(1.8, 1)` → `toBeCloseTo(3.0, 1)`
- apps size assertion: `toBeCloseTo(2.46, 2)` → `toBeCloseTo(3.5, 1)`
- "no satellite is bigger than sun × 4" sanity: Apps 3.5 vs sun 3.0. Sun × 4 = 12. Still passes.

Run:
```bash
npm test -- --run components/starmap
npm test -- --run
```

**Expected:** all green. Report exact count delta.

---

## TASK 5 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-11-camera-flip.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nodes } from '../nodes'

describe('AFS-10-FIX-11 — camera flip + size adjustments', () => {
  it('voidexa sun is 3.0 (largest by raw size)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(3.0, 1)
  })

  it('apps is 3.5 (biggest satellite — pink gas giant prominence)', () => {
    const apps = nodes.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(3.5, 1)
  })

  it('station is 2.5 (bumped for visibility from new POV)', () => {
    const station = nodes.find(n => n.id === 'station')!
    expect(station.size).toBeCloseTo(2.5, 1)
  })

  it('station moved to [10, 8, -36] (away from contact + game-hub)', () => {
    const station = nodes.find(n => n.id === 'station')!
    expect(station.position[0]).toBeCloseTo(10, 1)
    expect(station.position[1]).toBeCloseTo(8, 1)
    expect(station.position[2]).toBeCloseTo(-36, 1)
  })

  it('apps is the only satellite larger than voidexa (3.5 > 3.0)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    const biggerThanSun = satellites.filter(n => n.size > voidexa.size)
    expect(biggerThanSun.length).toBe(1)
    expect(biggerThanSun[0].id).toBe('apps')
  })

  it('positions UNCHANGED for non-station satellites (FIX-9 lock)', () => {
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
})
```

Run:
```bash
npm test -- --run afs-10-fix-11-camera-flip
```

Expected: 7/7 green.

---

## TASK 6 — BUILD VERIFICATION

```bash
npm run build
```

---

## TASK 7 — COMMIT + TAG + PUSH

Commit SKILL first (if not already):
```bash
git add docs/skills/SKILL_AFS-10-FIX-11.md
git commit -m "chore(afs-10-fix-11): add camera flip + size SKILL"
```

Then sprint:
```bash
git add components/starmap/nodes.ts
git add components/starmap/NodeMesh.tsx
git add components/starmap/StarMapScene.tsx
git add components/starmap/__tests__/afs-10-fix-11-camera-flip.test.ts
git add [any test files updated in Task 4]
git status
```

```bash
git commit -m "fix(afs-10-fix-11): flip camera to depth-perspective POV + bump sun/apps/station

Camera moves from front-facing [0,0,12] to far-side [0,5,90] looking
toward [0,0,-30]. User now sees 'through' claim → trading-hub →
quantum → voidexa. OrbitControls drag-rotate stays enabled.

Voidexa 1.8 → 3.0 (dominant from new POV).
Apps 2.46 → 3.5 (pink gas giant prominence).
Station 1.26 → 2.5 + position [4.5,6,-30] → [10,8,-36] (separation
from Contact + Game Hub cluster).

Labels 35/30/27 → 45/39/35.
maxDistance 80 → 150 (camera at distance ~120 from new target)."

git tag sprint-afs-10-fix-11-complete
git push origin main
git push origin sprint-afs-10-fix-11-complete
```

Post-push verify:
```bash
git status
git log origin/main --oneline -3
```

---

## TASK 8 — LIVE VERIFY (Jix-performed)

Wait ≥90s for Vercel deploy. Hard-refresh `/starmap/voidexa` incognito.

### 8.1 Default view
- ✅ Camera looks "through" the system from far side — claim-your-planet / trading-hub / quantum visible in foreground, voidexa visible in middle-distance, apps + nearer planets behind
- ✅ Voidexa visibly the biggest body OR matched by Apps (3.0 vs 3.5)
- ✅ Space Station clearly separated from Contact + Game Hub
- ✅ Labels readable (45/39/35px) at default zoom
- ✅ Depth/parallax visible — feels "3D scene" not "flat circle"

### 8.2 Drag-rotate
- ✅ Drag with mouse → camera rotates around target [0, 0, -30]
- ✅ Can rotate to old POV (front-facing voidexa) and other angles
- ✅ No camera lock

### 8.3 Zoom
- ✅ Scroll-out works up to maxDistance 150 (much further than before)
- ✅ Scroll-in works to minDistance 5 (close to target)

### 8.4 Regression
- ✅ Saturn rings on Quantum still proportional
- ✅ Game-hub doesn't overlap voidexa atmosphere ring
- ✅ All 10 planets visible (zoom out if needed)
- ✅ Galaxy view `/starmap` UNCHANGED
- ✅ Routes still load: /about, /trading, /quantum, /void-pro-ai (`/game-hub` 404 = pre-existing P0-NEW-8)
- ✅ No new console errors

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST
- [ ] Backup tag pushed
- [ ] Pre-flight report delivered + locks confirmed
- [ ] nodes.ts: voidexa 3.0, apps 3.5, station 2.5 + position [10,8,-36]
- [ ] NodeMesh.tsx: 45/39/35
- [ ] StarMapScene.tsx: camera [0,5,90] / target [0,0,-30] / maxDistance 150
- [ ] Existing tests updated, all green
- [ ] Regression test (afs-10-fix-11-camera-flip.test.ts) 7 assertions, all green
- [ ] `npm run build` succeeds
- [ ] Committed + tagged + pushed
- [ ] Vercel deployed
- [ ] Jix live-verifies + signs off

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-11-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-11-complete
git tag -d sprint-afs-10-fix-11-complete
```

---

## RISKS

- **R1 — Camera at z=90 puts user inside or behind sphere edge.** Sphere radius 800 — camera at z=90 is well within. Safe.
- **R2 — Apps (3.5) competes with voidexa (3.0) for visual dominance.** Intentional per Jix. Reference image's pink gas giant IS prominent.
- **R3 — OrbitControls target [0,0,-30] feels off-axis.** Target is mid-system. User can drag to reframe. Acceptable.
- **R4 — maxDistance 150 lets user zoom past the system entirely.** Sphere 800 still bounds the universe. Stars + nebula visible at any zoom.
- **R5 — Tests assume FIX-10 camera state.** Task 4 updates them.
- **R6 — Station new position causes overlap with another planet.** Closest neighbors after move:
  - Station [10, 8, -36] vs Contact [12, 9, -30]: distance ~6.4. Station radius 2.5 + Contact radius 2.10 = 4.6. Gap 1.8. **🟡 Tight but not overlapping. Live verify will tell.**
  - Station vs Quantum [18, -9, -48]: distance ~22. Safe.
  
  If Station-Contact overlap visually grotesque, FIX-12 micro-tunes either position.

---

## RULES APPLIED

- **Rule A:** Searched conversation_search for prior camera flips — none ✅
- **Rule B:** Math verified — camera distance 120 > maxDistance 80, lock requires bump
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Locks from Jix in chat (1=ja big four, 2=ja drag stays) captured
- **Rule E:** Scope respects all FIX-3 through FIX-10 locked items except where explicitly changed (camera, maxDistance)

---

# END SKILL — AFS-10-FIX-11
