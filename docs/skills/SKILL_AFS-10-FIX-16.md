# SKILL — AFS-10-FIX-16: Voidexa Bump + Label Readability + HUD Same-Side Flip

**Sprint:** AFS-10-FIX-16
**Parent sprint:** AFS-10 (visual polish layer, follow-up to FIX-15)
**Type:** Voidexa size + default label fontSize + HUD position logic flip
**Priority:** P1 (visual polish — Jix observed labels still small + voidexa not dominant + cross-scene HUD lines)
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

After AFS-10-FIX-15 shipped (hover HUD + auto-rotate + label cleanup), Jix is happy with HUD interaction model. Three remaining issues from screenshots:

1. **Default planet labels still too small** — fontSize 30/36 + distanceFactor=16 makes far-planet names hard to read
2. **Voidexa still not dominant in depth POV background** — current size 3.5 doesn't convey "sun" presence from camera at z=-90 looking toward origin
3. **HUD lines cross the scene** — current logic puts HUD on OPPOSITE side from planet, so the line traverses the entire viewport. Jix wants HUD on SAME side as planet (short line, no scene-crossing)

**Lesson from FIX-14 rollback:** voidexa-bumping itself is safe. The thing that broke FIX-14 was distanceFactor REMOVAL from labels. This sprint touches NEITHER distanceFactor — only fontSize and one node size.

---

## SCOPE

### IN SCOPE

1. **Voidexa size** in `nodes.ts`: `3.5` → `5.0`

2. **Default label fontSize** in `NodeMesh.tsx` (the remaining main label `<Html>` block from FIX-15):
   - Sun (isCenter): `36px` → `48px`
   - Satellite: `30px` → `42px`

3. **HUD side logic flip** in `HoverHUD.tsx`:
   - Current: `isPlanetOnLeft ? 'right' : 'left'` (modsat side)
   - Target: `isPlanetOnLeft ? 'left' : 'right'` (samme side)
   - Same logic for line endpoint X coordinate

### OUT OF SCOPE — DO NOT TOUCH

- Other 9 satellite sizes (apps 3.5, station 2.5, all FIX-10/12/13 values)
- All positions (FIX-13 state preserved)
- Camera position / target / FOV / far plane (FIX-12 state)
- OrbitControls min/maxDistance / autoRotate / autoRotateSpeed
- Sphere radius
- Galaxy view
- distanceFactor on remaining `<Html>` block (stays 16) — DO NOT REMOVE
- HoverHUD design tokens (background, border, glow, line color, panel width 360, edge padding 60, fade timings) — DO NOT TOUCH
- HUD content (planet name, sublabel, "Click to enter") — DO NOT TOUCH
- HUD font sizes (22px title, 14px body, 12px footer) — DO NOT TOUCH
- Per-frame screen position tracking — DO NOT TOUCH
- NodeMesh hover handler logic — DO NOT TOUCH
- Subtitle removal from FIX-15 — STAYS REMOVED
- Decorative dashed ring on claim-your-planet — DO NOT TOUCH
- "While I'm in here..." anything else

---

## VOIDEXA COLLISION CHECK

Voidexa at origin [0, 0, 0] with new size 5.0. Closest satellite is **game-hub at [9, 6, -15]**.

Center distance: sqrt(81 + 36 + 225) = sqrt(342) = **18.49**
Combined radii: 5.0 + 2.46 = 7.46
Edge gap: 18.49 - 7.46 = **11.03 units** ✅ Safe.

Atmosphere ring (size × ~1.65): 5.0 × 1.65 = 8.25 units extent
Game-hub edge from origin: 18.49 - 2.46 = 16.03
Atmosphere edge to game-hub edge: 16.03 - 8.25 = **7.78 units gap** ✅

All other satellites farther. No overlap risk.

---

## HUD SIDE-FLIP MATH

Current logic in HoverHUD.tsx (FIX-15):
```ts
const isPlanetOnLeft = renderedPos.x < viewportWidth / 2
const hudSide: 'left' | 'right' = isPlanetOnLeft ? 'right' : 'left'
const hudX = hudSide === 'left' ? 60 : viewportWidth - 360 - 60
const lineEndX = hudSide === 'left' ? hudX + 360 : hudX
```

New logic (FIX-16):
```ts
const isPlanetOnLeft = renderedPos.x < viewportWidth / 2
const hudSide: 'left' | 'right' = isPlanetOnLeft ? 'left' : 'right'  // SAME side
const hudX = hudSide === 'left' ? 60 : viewportWidth - 360 - 60      // unchanged formula
const lineEndX = hudSide === 'left' ? hudX + 360 : hudX              // unchanged formula
```

Only the conditional in `hudSide` flips. Everything else stays identical.

**Result:** Planet on left → HUD on left → short line stays on left half. Planet on right → HUD on right → short line stays on right half. No scene-crossing.

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `b5d3554` (post AFS-10-FIX-15) or newer
- Working tree clean

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-16-20260430
git push origin backup/pre-afs-10-fix-16-20260430
```

### Task 0.3 — Verify current state matches FIX-15

```bash
cat components/starmap/nodes.ts
grep -A 2 "fontSize" components/starmap/NodeMesh.tsx | head -20
grep -A 4 "isPlanetOnLeft\|hudSide" components/starmap/HoverHUD.tsx
```

**Cross-check:**
- voidexa size = 3.5
- All other sizes/positions at FIX-13 state
- NodeMesh.tsx fontSize: sun 36px, satellite 30px (post-FIX-15 reduction)
- HoverHUD.tsx hudSide logic: `isPlanetOnLeft ? 'right' : 'left'` (current FIX-15 modsat-side logic)

**Report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-16

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Current state cross-check:
    voidexa size: 3.5 [✅/🔴]
    all other FIX-13 sizes/positions: [✅/🔴 list]
    NodeMesh fontSize sun=36, sat=30 [✅/🔴]
    HoverHUD hudSide logic: opposite side [✅/🔴]

Computed FIX-16 targets:
    voidexa size: 3.5 → 5.0
    NodeMesh fontSize: 36/30 → 48/42
    HoverHUD hudSide: opposite → same side
```

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

**WAIT FOR JIX EXPLICIT APPROVAL.**

Lock format:
```
LOCKED:
- voidexa size: 5.0
- NodeMesh fontSize: 48 (sun) / 42 (satellite)
- HoverHUD hudSide: same side as planet
- ALL other sizes/positions UNCHANGED
- ALL camera/orbit settings UNCHANGED
- distanceFactor=16 stays on remaining label block
- HoverHUD design tokens UNCHANGED
```

---

## TASK 1 — UPDATE nodes.ts

Edit `components/starmap/nodes.ts`:

1. voidexa: `size: 3.5` → `size: 5.0`

DO NOT touch any other size or position.

```bash
npx tsc --noEmit
```

---

## TASK 2 — UPDATE NodeMesh.tsx fontSize

Edit `components/starmap/NodeMesh.tsx`:

Locate the main label `<Html>` block (the one that survived FIX-15 — the subtitle block was deleted in FIX-15).

- Sun (isCenter branch): `'36px'` → `'48px'`
- Satellite branch: `'30px'` → `'42px'`

DO NOT touch:
- distanceFactor (stays 16)
- position offset
- styling (color, fontWeight, fontFamily, letterSpacing, textShadow, lineHeight)
- onPointerEnter / onPointerLeave / hover handler logic
- Decorative dashed ring `<Html>` block on claim-your-planet (separate block, also distanceFactor=16, untouched)

```bash
npx tsc --noEmit
```

---

## TASK 3 — UPDATE HoverHUD.tsx side logic

Edit `components/starmap/HoverHUD.tsx`:

Find the line:
```ts
const hudSide: 'left' | 'right' = isPlanetOnLeft ? 'right' : 'left'
```

Replace with:
```ts
const hudSide: 'left' | 'right' = isPlanetOnLeft ? 'left' : 'right'
```

DO NOT touch:
- `isPlanetOnLeft` calculation (still `renderedPos.x < viewportWidth / 2`)
- `hudX` formula (still uses hudSide ternary correctly — flipping `hudSide` flips `hudX` correctly)
- `lineEndX` formula (same — flips correctly with hudSide)
- `hudY` clamping
- All design tokens (background, border, glow, panel width, padding, fade timings)
- All HUD content (title, body, footer text + their fontSize)
- SVG line color (#00d4ff), strokeWidth 1.5, opacity 0.6

```bash
npx tsc --noEmit
```

---

## TASK 4 — UPDATE EXISTING TESTS

```bash
grep -rn "voidexa.*size\|toBeCloseTo.*3\.5\|fontSize.*36\|fontSize.*30\|hudSide\|isPlanetOnLeft" tests/ components/starmap/__tests__/ 2>/dev/null | head -40
```

Update:

**voidexa size assertions:**
- FIX-12 `voidexa.size` assertion: `3.5` → `5.0`
- FIX-13 voidexa size regression: `3.5` → `5.0`
- FIX-15 voidexa size invariant: `3.5` → `5.0`

**fontSize regex assertions:**
- FIX-9 fontSize regex: `36/30` → `48/42`
- FIX-15 fontSize regex (if any): `36/30` → `48/42`

**HUD side logic test (if any in FIX-15 file):**
- If FIX-15 test asserted opposite-side logic verbatim, update to same-side
- If FIX-15 test was generic "HUD has hudSide variable", no update needed

**FIX-12 "biggerOrEqual.length ≤ 1" assertion:**
- Apps 3.5 vs voidexa 5.0. Apps no longer ≥ voidexa → biggerOrEqual.length = 0 → still ≤ 1 ✅

**FIX-10 sun×4 sanity:**
- 5.0 × 4 = 20. Largest satellite 3.5. Still passes ✅

**FIX-14 regression test (if any survived rollback):**
- Should not exist on disk per CC's rollback report (FIX-14 SKILL was wiped). Skip.

```bash
npm test -- --run
```

Report exact count delta.

---

## TASK 5 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-16-voidexa-labels-hud.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { nodes } from '../nodes'

describe('AFS-10-FIX-16 — voidexa bump + label readability + HUD same-side', () => {
  it('voidexa size is 5.0 (aggressive bump from FIX-13 3.5)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(5.0, 1)
  })

  it('voidexa is strictly larger than every satellite', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      expect(node.size).toBeLessThan(voidexa.size)
    }
  })

  it('apps no longer ties with voidexa (3.5 < 5.0)', () => {
    const apps = nodes.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(3.5, 1)
    
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(apps.size).toBeLessThan(voidexa.size)
  })

  it('NodeMesh.tsx uses 48px sun and 42px satellite fontSize (1.4x bump from FIX-15)', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/NodeMesh.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/48px/)
    expect(file).toMatch(/42px/)
    // Old FIX-15 values should be gone from main label
    expect(file).not.toMatch(/'36px'/)
    expect(file).not.toMatch(/'30px'/)
  })

  it('NodeMesh.tsx still has distanceFactor=16 (NOT removed — FIX-14 lesson)', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/NodeMesh.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/distanceFactor=\{16\}/)
  })

  it('HoverHUD.tsx uses SAME-SIDE logic (planet left -> HUD left)', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/HoverHUD.tsx'),
      'utf-8'
    )
    // New same-side logic: isPlanetOnLeft ? 'left' : 'right'
    expect(file).toMatch(/isPlanetOnLeft\s*\?\s*['"]left['"]\s*:\s*['"]right['"]/)
    // Old opposite-side logic should NOT be present
    expect(file).not.toMatch(/isPlanetOnLeft\s*\?\s*['"]right['"]\s*:\s*['"]left['"]/)
  })

  it('HoverHUD design tokens UNCHANGED from FIX-15', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/HoverHUD.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/#00d4ff/)              // line + accent color
    expect(file).toMatch(/rgba\(10,\s*14,\s*28/) // panel background
    expect(file).toMatch(/360/)                  // panel width
  })

  it('positions UNCHANGED from FIX-13', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
    
    const contact = nodes.find(n => n.id === 'contact')!
    expect(contact.position).toEqual([-6, 11, -28])
    
    const station = nodes.find(n => n.id === 'station')!
    expect(station.position).toEqual([16, 5, -42])
    
    const apps = nodes.find(n => n.id === 'apps')!
    expect(apps.position).toEqual([-12, 4.5, -18])
  })

  it('all 10 nodes preserved', () => {
    expect(nodes.length).toBe(10)
  })
})
```

```bash
npm test -- --run afs-10-fix-16
```

Expected: 9/9 green.

---

## TASK 6 — BUILD VERIFICATION

```bash
npm run build
```

---

## TASK 7 — COMMIT + TAG + PUSH

SKILL first:
```bash
git add docs/skills/SKILL_AFS-10-FIX-16.md
git commit -m "chore(afs-10-fix-16): add voidexa bump + label + HUD same-side SKILL"
```

Sprint:
```bash
git add components/starmap/nodes.ts
git add components/starmap/NodeMesh.tsx
git add components/starmap/HoverHUD.tsx
git add components/starmap/__tests__/afs-10-fix-16-voidexa-labels-hud.test.ts
git add [updated test files from Task 4]
git status
```

```bash
git commit -m "fix(afs-10-fix-16): voidexa 5.0 + labels 48/42 + HUD same-side

Per Jix screenshots — voidexa needed more dominance, default labels
needed readability bump, HUD lines were crossing entire scene.

voidexa: 3.5 -> 5.0 (apps 3.5 no longer matches; sun strictly largest)
labels: 36/30 -> 48/42 (1.33x bump for default readability)
HUD side: opposite -> same as planet (short line, no scene cross)

distanceFactor=16 PRESERVED on labels (FIX-14 lesson learned).
ALL positions UNCHANGED.
Other satellite sizes UNCHANGED.
Camera + orbit + sphere + HUD design tokens UNCHANGED."

git tag sprint-afs-10-fix-16-complete
git push origin main
git push origin sprint-afs-10-fix-16-complete
```

```bash
git status
git log origin/main --oneline -3
```

---

## TASK 8 — LIVE VERIFY (Jix-performed)

Wait ≥90s for Vercel deploy. Hard-refresh `/starmap/voidexa` incognito.

### 8.1 Voidexa dominance
- ✅ Voidexa visibly the LARGEST body in scene
- ✅ Sun atmosphere ring more prominent vs FIX-15
- ✅ No overlap with game-hub or other near satellites

### 8.2 Default label readability
- ✅ Planet names noticeably bigger and easier to read at default zoom
- ✅ Far planets (game-hub, ai-tools) labels still readable
- ✅ Labels not so big they dominate the scene

### 8.3 HUD same-side hover
- ✅ Hover planet on LEFT → HUD appears on LEFT (no scene crossing)
- ✅ Hover planet on RIGHT → HUD appears on RIGHT
- ✅ Line is short, stays in same half of viewport
- ✅ HUD content unchanged (name + sublabel + "Click to enter")

### 8.4 Regression
- ✅ Auto-rotation still works
- ✅ Hover-pause still works
- ✅ Per-frame line tracking still works (drag while hovering)
- ✅ Subtitle still removed from default labels
- ✅ Saturn rings on Quantum proportional
- ✅ All 10 planets visible
- ✅ Galaxy view UNCHANGED
- ✅ Routes load
- ✅ No new console errors

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST
- [ ] Backup tag pushed
- [ ] Pre-flight report delivered + locks confirmed
- [ ] nodes.ts: voidexa 5.0
- [ ] NodeMesh.tsx: 48/42 fontSize, distanceFactor=16 PRESERVED
- [ ] HoverHUD.tsx: hudSide flipped to same-side
- [ ] Existing tests updated (voidexa.size, fontSize regex, HUD side logic if applicable)
- [ ] FIX-16 regression test (9 assertions) green
- [ ] `npm run build` succeeds
- [ ] Committed + tagged + pushed
- [ ] Vercel deployed
- [ ] Jix live-verifies sun dominance + label readability + HUD same-side

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-16-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-16-complete
git tag -d sprint-afs-10-fix-16-complete
```

---

## RISKS

- **R1 — Voidexa atmosphere ring too close to game-hub.** Math: 7.78-unit gap. Safe, verified.
- **R2 — 48px sun label overflows planet body.** Voidexa size 5.0 = larger body, can absorb larger label. 42px on satellites may overflow smaller bodies (station 2.5, claim 1.54). Live verify; FIX-17 trims if grotesque.
- **R3 — HUD same-side covers important UI.** Left side has "Back to Galaxy" button (top-left) — HUD top is clamped at `max(60, planet.y - 80)` so it sits below button. Right side has KCP-90 panel (bottom-right) — HUD bottom-clamped at `min(planet.y - 80, viewport.h - 200)`. May still overlap KCP-90 at small viewport heights. Live verify.
- **R4 — Tests assume voidexa = 3.5 across multiple files.** Mitigation: Task 4 grep + categorize.
- **R5 — distanceFactor accidentally removed.** Mitigation: Task 5 regression test #5 explicitly asserts `distanceFactor={16}` is present. Catches FIX-14 mistake recurrence.

---

## RULES APPLIED

- **Rule A:** Searched conversation_search — FIX-14 lessons captured (distanceFactor stays) ✅
- **Rule B:** Math verified — voidexa collision check, HUD side-flip logic
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Locks from Jix in chat (voidexa 5.0, labels 48/42, HUD same-side) captured
- **Rule E:** Scope respects all FIX-3 through FIX-15 locked items — only voidexa size + 2 fontSize values + 1 conditional touched

---

# END SKILL — AFS-10-FIX-16
