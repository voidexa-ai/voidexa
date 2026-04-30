# SKILL — AFS-10-FIX-14: Voidexa Aggressive Bump + Label Distance Scaling

**Sprint:** AFS-10-FIX-14
**Parent sprint:** AFS-10 (visual polish layer, follow-up to FIX-13)
**Type:** Voidexa size + label distanceFactor tuning
**Priority:** P1 (visual polish — Jix wants sun more dominant + labels readable on far planets)
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

After AFS-10-FIX-13 shipped (Contact + Station spacing fix + 1.15× labels), Jix is happy with spacing/positions on ALL planets. Two remaining issues:

1. **Voidexa still not dominant enough** — current 3.5, needs aggressive bump to 5.0
2. **Labels don't scale with distance** — current `<Html distanceFactor={16}>` makes labels SHRINK on far planets. Jix wants the OPPOSITE: labels stay readable regardless of distance.

The drei `<Html distanceFactor>` prop controls how aggressively HTML overlays scale with camera distance:
- `distanceFactor={16}` (current FIX-13) = labels shrink moderately with distance
- `distanceFactor={6}` (FIX-14 target) = labels much less affected by distance — far planets get noticeably bigger relative size

This is NOT a fontSize change. fontSize stays at 52/45/40 from FIX-13.

---

## SCOPE

### IN SCOPE

1. **voidexa size** in `nodes.ts`: `3.5` → `5.0` (aggressive 1.43× bump)

2. **Label distanceFactor** in `NodeMesh.tsx`:
   - Current: `distanceFactor={16}` (likely on `<Html>` component)
   - Target: `distanceFactor={6}`
   - Both main label and subtitle (if separate `<Html>` blocks)

### OUT OF SCOPE — DO NOT TOUCH

- All satellite sizes (apps 3.5, station 2.5, all FIX-10/12/13 values for the rest)
- All positions (FIX-13 state for contact/station, FIX-9 state for the rest)
- Label fontSize values (52/45/40 stay)
- Camera position / target / FOV / far plane (FIX-12 state)
- OrbitControls min/maxDistance / drag-rotate
- Sphere radius (800)
- Galaxy view
- NodeMesh rendering geometry (Saturn rings, Space Station modules)
- Background nebula
- "While I'm in here..." anything else

---

## VOIDEXA SIZE COLLISION CHECK

Voidexa at origin [0, 0, 0] with new size 5.0. Closest satellite is **game-hub at [9, 6, -15]**.

Center distance: sqrt(81 + 36 + 225) = sqrt(342) = **18.49**

Combined radii: 5.0 + 2.46 = 7.46
Edge gap: 18.49 - 7.46 = **11.03 units** ✅ Safe.

Closest other neighbors:
- apps [-12, 4.5, -18]: distance 22.10, combined radii 5.0+3.5=8.50, gap 13.60 ✅
- ai-tools [0, -9, -24]: distance 25.63, combined radii 5.0+2.46=7.46, gap 18.17 ✅

All gaps comfortable. No overlap risk.

**Voidexa atmosphere ring (in NodeMesh.tsx)** — typically `size * 1.5` to `size * 2.0`. New atmosphere extent: 5.0 × 1.6 ≈ 8.0 units. Game-hub edge: 18.49 - 2.46 = 16.03. Atmosphere edge: 8.0. Clear 8-unit gap. ✅

---

## DISTANCEFACTOR MATH

drei `<Html distanceFactor>` formula (simplified): rendered scale = baseScale × (distanceFactor / cameraDistance)

At camera distance ~90 (FIX-12 default POV) for various planets:
- voidexa (cam dist 90.14): scale factor = 16/90 = 0.178 → next: 6/90 = 0.067
- claim (cam dist 36.69): scale factor = 16/37 = 0.432 → next: 6/37 = 0.162
- game-hub (cam dist 75.54): scale factor = 16/76 = 0.211 → next: 6/76 = 0.079

The ratio stays the same per planet, but the OVERALL scale is smaller — which means labels drop BELOW the planet body proportionally less. Effective behavior: **labels become more "screen-stable"** — less affected by zoom and distance.

**Caveat:** Lower distanceFactor means labels at default zoom are SMALLER (since they don't get the 16/distance multiplier). This might counter-act the "make far planets readable" goal.

**Better understanding:** Jix's actual issue is that labels at default zoom on FAR planets (game-hub, ai-tools, services) look small. The current distanceFactor=16 gives them moderate scale-down. Lowering to 6 makes them MORE scale-down on close planets and LESS scale-down on far planets — but baseline pixel size at every distance becomes smaller too.

**Best solution may actually be to keep distanceFactor=16 OR raise it to 24+ to make far-planet labels bigger.** OR remove distanceFactor entirely (constant pixel size).

⚠️ **Pre-flight Task 0.4 must report current behavior** — the math above is theoretical. Need to read `<Html>` setup in NodeMesh.tsx to confirm exact prop usage before locking direction.

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `34f8c58` (post AFS-10-FIX-13) or newer
- Working tree clean

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-14-20260430
git push origin backup/pre-afs-10-fix-14-20260430
```

### Task 0.3 — Verify current state matches FIX-13

```bash
cat components/starmap/nodes.ts
```

**Cross-check:**
- voidexa size = 3.5
- contact position = [-6, 11, -28]
- station position = [16, 5, -42]
- All other FIX-10/12/13 values intact

### Task 0.4 — Read current `<Html>` setup in NodeMesh.tsx

```bash
grep -B 2 -A 8 "<Html" components/starmap/NodeMesh.tsx
```

**Report exact:**
- All `<Html>` component declarations (there may be 2: one for main label, one for subtitle, OR one combined)
- Current `distanceFactor` prop value(s)
- Current `position` prop value(s) for label offset
- Any `transform`, `occlude`, `pointerEvents`, `zIndexRange` props
- How fontSize is applied — inline style? CSS class?
- Whether the main label and subtitle share a single `<Html>` or have separate ones

**Report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-14

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Current state cross-check:
    voidexa size: 3.5 [✅/🔴]
    contact position: [-6, 11, -28] [✅/🔴]
    station position: [16, 5, -42] [✅/🔴]

0.4 Current <Html> setup in NodeMesh.tsx:
    [paste exact source lines]
    Number of <Html> blocks: [N]
    distanceFactor values: [list each]
    position offsets: [list each]
    fontSize render method: [inline style | CSS class | other]
    Other relevant props: [list]

Computed FIX-14 targets (PROVISIONAL — pending Jix lock based on actual <Html> setup):
    voidexa size: 3.5 → 5.0
    distanceFactor: [current] → [target — see lock options below]
```

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After Task 0.1-0.4, output the pre-flight report.

**Lock decision needed AFTER reading actual `<Html>` setup:**

**Option A (lower distanceFactor — Jix's stated preference):**
- distanceFactor 16 → 6
- Labels become more screen-stable but baseline smaller
- Risk: may make labels overall SMALLER, not bigger

**Option B (HIGHER distanceFactor):**
- distanceFactor 16 → 24 or 32
- Labels scale UP more aggressively at distance
- Far-planet labels become larger relative

**Option C (remove distanceFactor — constant pixel size):**
- Labels always render at fontSize px regardless of distance
- Most consistent readability
- Loses depth cues (labels don't shrink with distance at all)

**Jix already locked Option A in chat ("A (lavere distanceFactor)").** Default proceed with distanceFactor=6, but recommend live-verify shows whether this delivered intent or if Option B/C needed.

Lock format:
```
LOCKED:
- voidexa size: 5.0
- distanceFactor: [current N] → [target M, default 6 per Jix]
- ALL other sizes UNCHANGED
- ALL positions UNCHANGED
- ALL camera/orbit settings UNCHANGED
- fontSize 52/45/40 UNCHANGED
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

## TASK 2 — UPDATE NodeMesh.tsx distanceFactor

Edit each `<Html>` block in `components/starmap/NodeMesh.tsx`:

- `distanceFactor={16}` → `distanceFactor={6}` (or locked target)

If there are multiple `<Html>` blocks (main label + subtitle), update ALL of them to the same value.

Do NOT touch:
- fontSize values (52/45/40)
- position offsets
- transform / occlude / zIndexRange / pointerEvents
- styling (textShadow, fontWeight, fontFamily, etc)

```bash
npx tsc --noEmit
```

---

## TASK 3 — UPDATE EXISTING TESTS

```bash
grep -rn "voidexa.*size\|distanceFactor\|toBeCloseTo.*3\.5" tests/ components/starmap/__tests__/ 2>/dev/null | head -30
```

Update:
- voidexa size assertions: `3.5` → `5.0`
- distanceFactor assertions (if any in test files): `16` → `6`

**FIX-12 test (afs-10-fix-12-camera-flip.test.ts):**
- voidexa.size assertion: `3.5` → `5.0`

**FIX-13 test (afs-10-fix-13-spacing.test.ts):**
- voidexa.size assertion in regression block: `3.5` → `5.0`

**FIX-10 sun×4 sanity:**
- New: 5.0 × 4 = 20. Largest satellite 3.5. Still passes ✅

**FIX-12 "biggerOrEqual.length ≤ 1" assertion:**
- Apps 3.5 vs voidexa 5.0. Apps NO LONGER ≥ voidexa. biggerOrEqual.length = 0.
- Assertion still passes (≤ 1 includes 0) ✅
- BUT: assertion description "apps may match voidexa raw" becomes stale. Consider rewording test name to "no satellite matches or exceeds voidexa raw size" — minor cleanup.

```bash
npm test -- --run
```

Report exact count delta.

---

## TASK 4 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-14-voidexa-bump.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { nodes } from '../nodes'

describe('AFS-10-FIX-14 — voidexa aggressive bump + label distanceFactor', () => {
  it('voidexa size is 5.0 (aggressive bump from FIX-13 3.5)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(5.0, 1)
  })

  it('voidexa is now strictly larger than every satellite (no ties)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      expect(node.size).toBeLessThan(voidexa.size)
    }
  })

  it('apps no longer matches voidexa (3.5 < 5.0)', () => {
    const apps = nodes.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(3.5, 1)
    
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(apps.size).toBeLessThan(voidexa.size)
  })

  it('voidexa size : largest-satellite ratio is ~1.43 (5.0/3.5)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    const maxSatSize = Math.max(...satellites.map(n => n.size))
    const ratio = voidexa.size / maxSatSize
    expect(ratio).toBeGreaterThan(1.3)
    expect(ratio).toBeLessThan(1.6)
  })

  it('positions UNCHANGED (no spacing regression)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
    
    const contact = nodes.find(n => n.id === 'contact')!
    expect(contact.position).toEqual([-6, 11, -28])
    
    const station = nodes.find(n => n.id === 'station')!
    expect(station.position).toEqual([16, 5, -42])
  })

  it('NodeMesh.tsx uses distanceFactor 6 (lowered from FIX-13 16)', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/NodeMesh.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/distanceFactor=\{6\}/)
    expect(file).not.toMatch(/distanceFactor=\{16\}/)
  })

  it('all 10 nodes preserved', () => {
    expect(nodes.length).toBe(10)
  })
})
```

```bash
npm test -- --run afs-10-fix-14-voidexa-bump
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
git add docs/skills/SKILL_AFS-10-FIX-14.md
git commit -m "chore(afs-10-fix-14): add voidexa bump + distanceFactor SKILL"
```

Sprint:
```bash
git add components/starmap/nodes.ts
git add components/starmap/NodeMesh.tsx
git add components/starmap/__tests__/afs-10-fix-14-voidexa-bump.test.ts
git add [updated test files from Task 3]
git status
```

```bash
git commit -m "fix(afs-10-fix-14): voidexa 5.0 + label distanceFactor 16 -> 6

Per Jix — voidexa needed more dominance (was 3.5, matched by apps).
Now strictly largest at 5.0 (1.43x bump). Closest neighbor edge gap
11.03 units, comfortable.

Label <Html distanceFactor> reduced 16 -> 6 — labels become more
screen-stable, less affected by camera distance. Far-planet labels
expected to become more readable.

ALL positions UNCHANGED.
ALL other sizes UNCHANGED.
fontSize 52/45/40 UNCHANGED.
Camera + orbit + sphere settings UNCHANGED."

git tag sprint-afs-10-fix-14-complete
git push origin main
git push origin sprint-afs-10-fix-14-complete
```

```bash
git status
git log origin/main --oneline -3
```

---

## TASK 7 — LIVE VERIFY (Jix-performed)

Wait ≥90s for Vercel deploy. Hard-refresh `/starmap/voidexa` incognito.

### 7.1 Voidexa dominance
- ✅ Voidexa visibly the LARGEST body in scene (no longer matched by apps)
- ✅ Voidexa atmosphere ring more prominent
- ✅ No overlap with game-hub or other near satellites

### 7.2 Label readability across distance
- ✅ Far planets (game-hub, contact, ai-tools, services) labels readable at default zoom
- ✅ Near planets (claim, trading-hub, quantum) labels not grotesquely huge
- ✅ Labels remain readable as user zooms in and out
- ✅ Labels remain readable as user rotates camera through angles

### 7.3 Regression
- ✅ All 10 planets visible
- ✅ Spacing UNCHANGED (FIX-13 layout preserved)
- ✅ Saturn rings on Quantum proportional
- ✅ Galaxy view UNCHANGED
- ✅ Routes load (/game-hub 404 = pre-existing)
- ✅ No new console errors

### 7.4 Possible follow-ups (FIX-15 if needed)
- If distanceFactor=6 made labels too small overall: try removing distanceFactor entirely (constant pixel size)
- If voidexa now too big for the scene: reduce to 4.5
- If apps looks too small relative to voidexa: bump apps too (but then we lose pink-gas-giant prominence balance)

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST
- [ ] Backup tag pushed
- [ ] Pre-flight report delivered + locks confirmed (especially distanceFactor direction after seeing actual code)
- [ ] nodes.ts: voidexa 5.0
- [ ] NodeMesh.tsx: distanceFactor 6
- [ ] Existing tests updated (FIX-12, FIX-13 voidexa.size assertions)
- [ ] FIX-14 regression test (7 assertions) green
- [ ] `npm run build` succeeds
- [ ] Committed + tagged + pushed
- [ ] Vercel deployed
- [ ] Jix live-verifies sun dominance + label readability across angles

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-14-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-14-complete
git tag -d sprint-afs-10-fix-14-complete
```

---

## RISKS

- **R1 — Voidexa atmosphere ring overlaps game-hub.** Math: ring extent ~8.0, game-hub edge 16.03 from origin. 8-unit clear gap ✅.
- **R2 — distanceFactor=6 makes labels SMALLER overall.** This is the opposite of intent. Mitigation: live-verify carefully. If wrong, FIX-15 tries higher value (e.g. 24) or removes prop entirely.
- **R3 — Voidexa label position offset.** Currently `-(size + 0.55)` = -(5.0 + 0.55) = -5.55 (was -4.05 at FIX-13's 3.5). Label drops further below sun body. May need adjustment in NodeMesh.tsx position prop. Live-verify.
- **R4 — Voidexa as 5.0 raw size dwarfs all satellites.** Sun:satellite ratio 5.0:3.5 = 1.43 (was 1:1). New visual hierarchy: sun first, apps second tier (3.5), then station/quantum/etc (1.5-2.5). Per Jix intent — sun should dominate.
- **R5 — Tests assuming voidexa = 3.5.** Mitigation: Task 3 grep + categorize.

---

## RULES APPLIED

- **Rule A:** Searched conversation_search — FIX-13 state confirmed ✅
- **Rule B:** Math verified — voidexa collision check, atmosphere ring check, distanceFactor formula
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Locks from Jix in chat ("aggressivt fx 5.0", "A (lavere distanceFactor)") captured
- **Rule E:** Scope respects all FIX-3 through FIX-13 locked items — only voidexa size + distanceFactor touched

---

# END SKILL — AFS-10-FIX-14
