# SKILL — AFS-10-FIX-13: Contact + Space Station Spacing + Label Bump

**Sprint:** AFS-10-FIX-13
**Parent sprint:** AFS-10 (visual polish layer, follow-up to FIX-12)
**Type:** Position spacing tuning + label bump (NO size or camera changes)
**Priority:** P1 (visual polish — Jix observed cluster crowding from rotation angles)
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

After AFS-10-FIX-12 shipped (depth-line camera flip + size bumps + 45/39/35 labels), Jix uploaded 4 screenshots from rotated camera angles:

- **Image 1 (default landing POV)** = perfect
- **Image 4 (one rotation angle)** = perfect
- **Image 2 + Image 3 (other rotation angles)** = Contact + Space Station + Game Hub + Services CLUSTER together

Specifically:
- Contact at `[12, 9, -30]` and Space Station at `[10, 8, -36]` are too close from certain camera angles
- Game Hub at `[9, 6, -15]` and Services at `[15, -3, -21]` add to the cluster from those angles
- There's lots of empty space on the LEFT side of the scene unused

Plus Jix wants ALL planet labels readable at every zoom/angle.

**This sprint:**
- **Moves Contact** to use the empty left-side space + lift it slightly up
- **Moves Space Station** to spread further from Contact + the cluster
- **Bumps labels** by 1.15× for guaranteed readability across all angles
- **NO size changes** — sizes are correct from FIX-12
- **NO camera changes** — depth POV from FIX-12 is correct

---

## SCOPE

### IN SCOPE

1. **Contact position** in `nodes.ts`: `[12, 9, -30]` → `[-6, 11, -28]`
   (move LEFT and UP — uses empty left-side space, separates from cluster)

2. **Space Station position** in `nodes.ts`: `[10, 8, -36]` → `[16, 5, -42]`
   (move further RIGHT, slightly DOWN, deeper INTO scene — separates from Game Hub/Services and from new Contact position)

3. **Labels** in `NodeMesh.tsx` (1.15× bump):
   - Sun (isCenter): `45px` → `52px`
   - Satellite: `39px` → `45px`
   - Subtitle: `35px` → `40px`

### OUT OF SCOPE — DO NOT TOUCH

- Any `size` values (sun 3.5, apps 3.5, station 2.5, all FIX-10 values for the rest)
- Any other satellite position (apps, ai-tools, services, game-hub, quantum, trading-hub, claim — UNCHANGED from FIX-9)
- voidexa size or position
- Camera position / target / FOV / far plane
- OrbitControls min/maxDistance / drag-rotate
- Sphere radius
- Galaxy view
- NodeMesh geometry
- "While I'm in here..." anything else

---

## SPACING MATH — verify no overlap

### New Contact position [-6, 11, -28]

Distance to each neighbor (Contact size 2.10):

| Neighbor | Position | Center distance | Combined radii | Edge gap |
|---|---|---|---|---|
| voidexa | [0,0,0] | sqrt(36+121+784)=30.84 | 2.10+3.5=5.60 | 25.24 ✅ |
| station (new) | [16, 5, -42] | sqrt(484+36+196)=26.46 | 2.10+2.5=4.60 | 21.86 ✅ |
| game-hub | [9, 6, -15] | sqrt(225+25+169)=20.47 | 2.10+2.46=4.56 | 15.91 ✅ |
| apps | [-12, 4.5, -18] | sqrt(36+42.25+100)=13.34 | 2.10+3.5=5.60 | 7.74 ✅ |
| ai-tools | [0, -9, -24] | sqrt(36+400+16)=21.26 | 2.10+2.46=4.56 | 16.70 ✅ |

All gaps comfortable. Closest neighbor: apps at edge gap 7.74. Safe.

### New Space Station position [16, 5, -42]

Distance to each neighbor (Station size 2.5):

| Neighbor | Position | Center distance | Combined radii | Edge gap |
|---|---|---|---|---|
| voidexa | [0,0,0] | sqrt(256+25+1764)=45.18 | 2.5+3.5=6.0 | 39.18 ✅ |
| contact (new) | [-6, 11, -28] | sqrt(484+36+196)=26.46 | 2.5+2.10=4.60 | 21.86 ✅ |
| services | [15, -3, -21] | sqrt(1+64+441)=22.50 | 2.5+2.46=4.96 | 17.54 ✅ |
| quantum | [18, -9, -48] | sqrt(4+196+36)=15.36 | 2.5+2.24=4.74 | 10.62 ✅ |
| trading-hub | [-9, 12, -54] | sqrt(625+49+144)=28.62 | 2.5+1.96=4.46 | 24.16 ✅ |

All gaps comfortable. Closest neighbor: quantum at edge gap 10.62. Safe.

### Distance from origin (FIX-9 spacing test still passes 18-65 range)

- Contact new: sqrt(36+121+784) = 30.84 ✅ (was 33.54)
- Station new: sqrt(256+25+1764) = 45.18 ✅ (was 38.21 at FIX-12, was 30.92 at FIX-9)

Both within FIX-9 18-65 distance band.

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `bf608a1` (post AFS-10-FIX-12) or newer
- Working tree clean

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-13-20260430
git push origin backup/pre-afs-10-fix-13-20260430
```

### Task 0.3 — Verify current state matches FIX-12

```bash
cat components/starmap/nodes.ts
grep -A 2 "fontSize" components/starmap/NodeMesh.tsx | head -20
```

**Cross-check:**
- voidexa size = 3.5
- apps size = 3.5
- station size = 2.5
- station position = [10, 8, -36]
- contact size = 2.10
- contact position = [12, 9, -30]
- Label fontSize sun=45, sat=39, sub=35

**Report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-13

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Current state cross-check:
    voidexa size: 3.5 [✅/🔴]
    apps size: 3.5 [✅/🔴]
    station size: 2.5 [✅/🔴]
    station position: [10, 8, -36] [✅/🔴]
    contact size: 2.10 [✅/🔴]
    contact position: [12, 9, -30] [✅/🔴]
    label fontSize: 45/39/35 [✅/🔴]

Computed FIX-13 targets:
    contact position: [12, 9, -30] → [-6, 11, -28]
    station position: [10, 8, -36] → [16, 5, -42]
    labels: 45/39/35 → 52/45/40
```

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

**WAIT FOR JIX EXPLICIT APPROVAL.**

Lock format:
```
LOCKED:
- contact position: [-6, 11, -28]
- station position: [16, 5, -42]
- labels: 52/45/40
- ALL sizes UNCHANGED
- ALL camera/orbit settings UNCHANGED
- ALL other positions UNCHANGED
```

---

## TASK 1 — UPDATE nodes.ts

Edit `components/starmap/nodes.ts`:

1. contact: `position: [12, 9, -30]` → `position: [-6, 11, -28]`
2. station: `position: [10, 8, -36]` → `position: [16, 5, -42]`

**DO NOT touch:** any size, voidexa, apps/ai-tools/services/game-hub/quantum/trading-hub/claim positions.

```bash
npx tsc --noEmit
```

---

## TASK 2 — UPDATE NodeMesh.tsx labels

- Main label (isCenter): `'45px'` → `'52px'`
- Main label (satellite): `'39px'` → `'45px'`
- Subtitle: `'35px'` → `'40px'`

```bash
npx tsc --noEmit
```

---

## TASK 3 — UPDATE EXISTING TESTS

```bash
grep -rn "contact.*position\|station.*position\|fontSize\|font-size" tests/ components/starmap/__tests__/ 2>/dev/null | head -40
```

Update:

**Position assertions:**
- contact `[12, 9, -30]` → `[-6, 11, -28]`
- station `[10, 8, -36]` → `[16, 5, -42]`

**Label fontSize assertions (regex):**
- `45px` → `52px` (sun)
- `39px` → `45px` (satellite)
- `35px` → `40px` (subtitle)

**FIX-9 spacing test distance band (18-65):**
- contact new distance 30.84 ✅
- station new distance 45.18 ✅
- Both in band, no test update needed for distance assertions

**FIX-11/FIX-12 test files:**
- FIX-12 `afs-10-fix-12-camera-flip.test.ts` — station position assertion `[10, 8, -36]` → `[16, 5, -42]` ✅ MUST UPDATE

```bash
npm test -- --run
```

Report exact count delta.

---

## TASK 4 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-13-spacing.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nodes } from '../nodes'

describe('AFS-10-FIX-13 — contact + space station spacing fix', () => {
  it('contact moved to left side at [-6, 11, -28]', () => {
    const contact = nodes.find(n => n.id === 'contact')!
    expect(contact.position).toEqual([-6, 11, -28])
  })

  it('station moved to right-deep at [16, 5, -42]', () => {
    const station = nodes.find(n => n.id === 'station')!
    expect(station.position).toEqual([16, 5, -42])
  })

  it('contact and station are at least 25 units apart (no clustering)', () => {
    const contact = nodes.find(n => n.id === 'contact')!
    const station = nodes.find(n => n.id === 'station')!
    const [cx, cy, cz] = contact.position
    const [sx, sy, sz] = station.position
    const dist = Math.sqrt((cx-sx)**2 + (cy-sy)**2 + (cz-sz)**2)
    expect(dist).toBeGreaterThan(25)
  })

  it('contact is on negative-x side (left), separating from game-hub at +9', () => {
    const contact = nodes.find(n => n.id === 'contact')!
    expect(contact.position[0]).toBeLessThan(0)
  })

  it('all 10 nodes preserved', () => {
    expect(nodes.length).toBe(10)
  })

  it('no size or voidexa-position regression from FIX-12', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(3.5, 1)
    expect(voidexa.position).toEqual([0, 0, 0])
    
    const apps = nodes.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(3.5, 1)
    
    const station = nodes.find(n => n.id === 'station')!
    expect(station.size).toBeCloseTo(2.5, 1)
  })

  it('non-affected satellite positions UNCHANGED from FIX-9', () => {
    const apps = nodes.find(n => n.id === 'apps')!
    expect(apps.position).toEqual([-12, 4.5, -18])
    
    const claim = nodes.find(n => n.id === 'claim-your-planet')!
    expect(claim.position).toEqual([-18, -6, -60])
    
    const gameHub = nodes.find(n => n.id === 'game-hub')!
    expect(gameHub.position).toEqual([9, 6, -15])
    
    const services = nodes.find(n => n.id === 'services')!
    expect(services.position).toEqual([15, -3, -21])
  })
})
```

```bash
npm test -- --run afs-10-fix-13-spacing
```

Expected: 7/7 green.

---

## TASK 5 — BUILD VERIFICATION

```bash
npm run build
```

---

## TASK 6 — COMMIT + TAG + PUSH

SKILL first:
```bash
git add docs/skills/SKILL_AFS-10-FIX-13.md
git commit -m "chore(afs-10-fix-13): add spacing fix + label bump SKILL"
```

Sprint:
```bash
git add components/starmap/nodes.ts
git add components/starmap/NodeMesh.tsx
git add components/starmap/__tests__/afs-10-fix-13-spacing.test.ts
git add [updated test files from Task 3]
git status
```

```bash
git commit -m "fix(afs-10-fix-13): spread contact + space station + 1.15x labels

Per Jix rotation-angle screenshots — Contact + Space Station +
Game Hub + Services clustered from certain camera angles. Empty
space on left side unused.

Contact: [12, 9, -30] → [-6, 11, -28] (left side, slightly up)
Station: [10, 8, -36] → [16, 5, -42] (right, deeper, slightly down)

All sizes UNCHANGED. All other positions UNCHANGED.
Camera + orbit settings UNCHANGED.

Labels 45/39/35 → 52/45/40 (1.15x bump for full-zoom readability)."

git tag sprint-afs-10-fix-13-complete
git push origin main
git push origin sprint-afs-10-fix-13-complete
```

```bash
git status
git log origin/main --oneline -3
```

---

## TASK 7 — LIVE VERIFY (Jix-performed)

Wait ≥90s for Vercel deploy. Hard-refresh `/starmap/voidexa` incognito.

### 7.1 Default depth-line view
- ✅ Contact now appears on LEFT side of scene (was right)
- ✅ Space Station appears further RIGHT and DEEPER
- ✅ No clustering with Game Hub / Services / Apps
- ✅ Empty left-side space now used productively

### 7.2 Rotation test (most important)
**Drag camera to rotate through multiple angles** — repeat for:
- Top-down view
- Side view (90° rotation)
- Bottom-up view  
- Reverse depth-line (back to old front-facing)

In every angle:
- ✅ Contact + Station never cluster with each other or with Game Hub/Services
- ✅ All labels readable (52/45/40px should be clear at any zoom)
- ✅ No planet overlap in any angle

### 7.3 Regression
- ✅ Voidexa still 3.5 (unchanged)
- ✅ Apps still 3.5 (unchanged)
- ✅ Saturn rings on Quantum still proportional
- ✅ All 10 planets visible
- ✅ Galaxy view UNCHANGED
- ✅ Routes load (/game-hub 404 = pre-existing P0-NEW-8)
- ✅ No new console errors

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST
- [ ] Backup tag pushed
- [ ] Pre-flight report delivered + locks confirmed
- [ ] nodes.ts: contact `[-6, 11, -28]`, station `[16, 5, -42]`
- [ ] NodeMesh.tsx: 52/45/40
- [ ] Existing tests updated (FIX-12 regression test, label fontSize regexes)
- [ ] FIX-13 regression test (7 assertions) green
- [ ] `npm run build` succeeds
- [ ] Committed + tagged + pushed
- [ ] Vercel deployed
- [ ] Jix live-verifies multiple rotation angles

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-13-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-13-complete
git tag -d sprint-afs-10-fix-13-complete
```

---

## RISKS

- **R1 — Contact at x=-6 conflicts with Apps at x=-12.** Apps z=-18, Contact z=-28. Edge gap calculated at 7.74 — safe but moderate.
- **R2 — Station at x=16, z=-42 sits between Quantum (z=-48) and Services (z=-21).** Edge gap to Quantum 10.62 — safe.
- **R3 — Labels 52px on small zoom may dominate planets.** Live verify; if too big, FIX-14 trims to 1.1×.
- **R4 — Voidexa label drop offset = -(3.5+0.55) = -4.05 unchanged from FIX-12.** No regression.
- **R5 — From the original front-facing POV (rotated back via drag), new positions may look different from FIX-12 default. Live verify both POVs.**

---

## RULES APPLIED

- **Rule A:** Searched conversation_search — FIX-12 state confirmed ✅
- **Rule B:** Math verified — all neighbor pairs comfortable edge gaps
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Locks from Jix in chat (specific positions, label bump confirmed) captured
- **Rule E:** Scope respects all FIX-3 through FIX-12 locked items — only Contact + Station positions + labels touched

---

# END SKILL — AFS-10-FIX-13
