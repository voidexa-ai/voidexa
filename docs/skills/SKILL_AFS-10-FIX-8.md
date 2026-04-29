# SKILL — AFS-10-FIX-8: Planet Scale Increase

**Sprint:** AFS-10-FIX-8
**Parent sprint:** AFS-10 (visual polish layer)
**Type:** Visual scale tuning (data-only changes in nodes.ts)
**Priority:** P1 (visual polish — Jix complaint: "planeterne skal være større")
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

Jix uploaded a reference image showing planets that take up ~15-30% of scene height each, with a sun ratio of ~3:1 to planet size. Live `/starmap/voidexa` after AFS-10-FIX-7 has planets at ~8-12 px on screen with sun ~140 px, giving a sun:planet ratio of ~14:1. Planets feel like "tiny dots in a huge universe".

This sprint scales:
- **Sun (voidexa center)**: ~1.5x bigger (gentle increase — stays dominant but less so)
- **Satellite planets (9 nodes)**: ~4x bigger
- **Planet positions**: ~4x further from origin (preserves spacing relative to new sizes — prevents overlap)

The visual end-state should match the reference image's "planets present in the scene, sun dominant but not overwhelming".

---

## SCOPE

### IN SCOPE
1. Bump satellite node `size` (or radius) by ~4x in `components/starmap/nodes.ts`
2. Bump satellite node `position` (x, y, z) by ~4x — same multiplier as size
3. Bump voidexa-center node size by ~1.5x (NOT 4x — sun stays anchored)
4. Verify cameras still frame the scene correctly (camera at z=12 may need check)
5. Update tests if any reference exact size/position values
6. Live verify: planets feel "present", no overlap, no clipping at sphere edge

### OUT OF SCOPE — DO NOT TOUCH
- Sphere radius (locked at 800 from AFS-10-FIX-6)
- Camera FOV (60° locked from AFS-10-FIX-3)
- Camera z-position (galaxy z=38, system z=12 locked from AFS-10-FIX-3) — UNLESS pre-flight reveals planets clip out of view
- OrbitControls min/max distance — UNLESS pre-flight reveals scaled planets push past max zoom-out
- nodes.ts other props (id, label, route, texture, color, planetType, etc.)
- NodeMesh.tsx component (no rendering logic changes)
- Galaxy view `/starmap` (only 2 nodes there: voidexa sun + Your Planet — handle carefully)
- Texture files
- Any other route or component
- "While I'm in here, let me also..."

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `b8a435d` (post AFS-10-FIX-7) or newer
- Working tree clean

**STOP if:** dirty tree.

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-8-20260430
git push origin backup/pre-afs-10-fix-8-20260430
```

### Task 0.3 — Read current nodes.ts size + position values

```bash
cat components/starmap/nodes.ts
```

**Report back to Jix in this exact format:**

```
PRE-FLIGHT REPORT — AFS-10-FIX-8

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Current size + position values:

| ID                | size | position [x, y, z]   | distance from origin |
|-------------------|------|----------------------|----------------------|
| voidexa           | ?    | [?, ?, ?]            | ?                    |
| station           | ?    | [?, ?, ?]            | ?                    |
| apps              | ?    | [?, ?, ?]            | ?                    |
| quantum           | ?    | [?, ?, ?]            | ?                    |
| trading-hub       | ?    | [?, ?, ?]            | ?                    |
| services          | ?    | [?, ?, ?]            | ?                    |
| game-hub          | ?    | [?, ?, ?]            | ?                    |
| ai-tools          | ?    | [?, ?, ?]            | ?                    |
| contact           | ?    | [?, ?, ?]            | ?                    |
| claim-your-planet | ?    | [?, ?, ?]            | ?                    |

Compute distance: sqrt(x² + y² + z²) per node.

Min satellite size: ?
Max satellite size: ?
Min satellite distance: ?
Max satellite distance: ?

Sun (voidexa) size: ?
Sun (voidexa) position: ?
```

**STOP and wait.** I (Jix-side Claude) need these numbers to lock exact multipliers.

### Task 0.4 — Galaxy view check

```bash
cat components/starmap/galaxyNodes.ts 2>/dev/null || echo "no galaxy nodes file"
grep -rn "galaxy.*node\|Your Planet\|claim-your-planet.*galaxy" components/starmap/ 2>/dev/null | head -20
```

**Report:** how the galaxy view's 2 nodes (voidexa + Your Planet) are defined. Are they the same `nodes` array filtered by view, or a separate file/array?

### Task 0.5 — Camera + OrbitControls config check

```bash
grep -n "OrbitControls\|maxDistance\|minDistance\|position={\[" components/starmap/StarMapScene.tsx components/starmap/GalaxyScene.tsx 2>/dev/null
```

**Report:** current camera position values + OrbitControls min/max distance. We need to verify scaled planets won't push past maxDistance or get camera-clipped.

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After Task 0.1-0.5, output the full pre-flight report.

**WAIT FOR JIX TO LOCK MULTIPLIERS** before Task 1.

The lock decision will look like:

```
LOCKED:
- satellite_size_multiplier: 4.0
- satellite_position_multiplier: 4.0
- voidexa_size_multiplier: 1.5
- voidexa_position: unchanged (stays at [0, 0, 0] or wherever)
- camera_z system view: [unchanged | bump to N]
- OrbitControls maxDistance: [unchanged | bump to N]
```

Do NOT proceed without explicit numeric lock. Do NOT propose defaults.

---

## TASK 1 — APPLY MULTIPLIERS TO nodes.ts

Edit `components/starmap/nodes.ts`:

For each satellite node (all 9 except voidexa):
- Multiply `size` by satellite_size_multiplier
- Multiply each `position` array element [x, y, z] by satellite_position_multiplier

For voidexa node (id === 'voidexa'):
- Multiply `size` by voidexa_size_multiplier
- Position unchanged

Compute exact new values. Round size to 2 decimals, position to 2 decimals.

**IMPORTANT:** If any node has additional size-related props (atmosphereSize, ringInnerRadius, ringOuterRadius — Quantum has these from AFS-10-FIX-2; Space Station has torusGeometry args from AFS-10-FIX-2), those are computed RELATIVE to size in NodeMesh.tsx (e.g. `size * 1.6`). Do NOT touch those — they scale automatically with size.

**Verify:** rings, atmosphere shells, torus modules will scale correctly because they reference `size` × constant in NodeMesh.tsx.

Run typecheck:
```bash
npx tsc --noEmit
```

**STOP if:** typecheck fails.

---

## TASK 2 — UPDATE TESTS

Find tests that reference exact size or position values:

```bash
grep -rn "size:\s*[0-9]\|position:\s*\[\|size === \|position\[0\] ===" tests/ components/starmap/__tests__/ 2>/dev/null | head -40
```

Categorize:
- **Tests asserting exact values** (e.g. `expect(node.size).toBe(0.6)`) → MUST UPDATE to new value
- **Tests asserting relative values** (e.g. `expect(node.size).toBeGreaterThan(0)`) → keep as-is
- **Tests asserting count/structure** (e.g. node count = 10) → keep as-is

Update only the exact-value tests. Run:
```bash
npm test -- --run components/starmap
npm test -- --run
```

**Expected:** All tests green. Report exact count delta.

---

## TASK 3 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-8-planet-scale.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nodes } from '../nodes'

describe('AFS-10-FIX-8 — planet scale increase', () => {
  it('voidexa sun is the largest node', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    const maxSatelliteSize = Math.max(...satellites.map(n => n.size))
    expect(voidexa.size).toBeGreaterThan(maxSatelliteSize)
  })

  it('sun:satellite ratio is between 1.5x and 5x (not the old ~14x)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    const avgSatelliteSize = satellites.reduce((s, n) => s + n.size, 0) / satellites.length
    const ratio = voidexa.size / avgSatelliteSize
    expect(ratio).toBeGreaterThan(1.5)
    expect(ratio).toBeLessThan(5.0)
  })

  it('satellite planets are bigger than 1 unit', () => {
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      expect(node.size).toBeGreaterThan(1.0)
    }
  })

  it('satellite distances from origin are scaled (no clustering at center)', () => {
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      const [x, y, z] = node.position
      const distance = Math.sqrt(x*x + y*y + z*z)
      expect(distance).toBeGreaterThan(2.0)
    }
  })
})
```

Run:
```bash
npm test -- --run afs-10-fix-8-planet-scale
```

Expected: 4/4 green.

---

## TASK 4 — BUILD VERIFICATION

```bash
npm run build
```

**STOP if:** build fails.

---

## TASK 5 — COMMIT + TAG + PUSH

```bash
git add components/starmap/nodes.ts
git add components/starmap/__tests__/afs-10-fix-8-planet-scale.test.ts
git add [any test files updated in Task 2]
git status
```

**Verify:** only expected files staged.

```bash
git commit -m "fix(afs-10-fix-8): scale planets ~4x and sun ~1.5x for visual presence

Per Jix reference image. Satellite planets and positions both scaled
by same multiplier to preserve relative spacing without overlap.
Voidexa sun gently bumped to keep it dominant but less overwhelming.

Sun:satellite ratio: ~14:1 -> ~3:1
Sphere radius (800), camera, overlays unchanged."

git tag sprint-afs-10-fix-8-complete
git push origin main
git push origin sprint-afs-10-fix-8-complete
```

**Post-push verify:**
```bash
git status
git log origin/main --oneline -3
```

---

## TASK 6 — LIVE VERIFY (Jix-performed via Claude in Chrome bridge)

Wait ≥90s for Vercel deploy.

### 6.1 System view `/starmap/voidexa`
Hard-refresh incognito → check:
- ✅ All 10 planets visibly bigger than before (subjective: "present in scene", not "tiny dots")
- ✅ Sun still dominant but not overwhelming (subjective ratio match to reference image)
- ✅ NO planet overlap — spacing preserved by position multiplier
- ✅ Saturn rings on Quantum still proportional and visible
- ✅ Space Station orbital ring + 4 modules still proportional
- ✅ All texture details visible (planets big enough to actually see their surfaces)
- ✅ Zoom in/out still functional
- ✅ NO planets clipped out of camera frustum at default zoom
- ✅ NO sphere edge / horizon visible
- ✅ Background nebula sphere unchanged

### 6.2 Galaxy view `/starmap`
- ✅ Voidexa sun + Your Planet visible
- ✅ Sun is bigger than before (galaxy view uses same node OR scales here too — depends on Task 0.4 finding)
- ✅ NO clipping or weirdness

### 6.3 Regression check
- ✅ No new console errors
- ✅ Tests still 1422+ (per Task 2/3 delta)
- ✅ All routes `/about`, `/trading`, `/quantum`, `/void-pro-ai`, `/game-hub` still load (404 on /game-hub is pre-existing P0-NEW-8)

**If any planet overlaps or clips out of view → not a rollback yet, just report which. Likely needs camera maxDistance bump (deferred sprint).**

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST (this file)
- [ ] Backup tag `backup/pre-afs-10-fix-8-20260430` pushed
- [ ] Pre-flight report delivered + multipliers locked by Jix
- [ ] `nodes.ts` updated: 9 satellite sizes × multiplier, 9 satellite positions × multiplier, voidexa size × 1.5
- [ ] Existing tests updated where they referenced exact values — all green
- [ ] Regression test file created (`afs-10-fix-8-planet-scale.test.ts`) with 4 assertions, all green
- [ ] `npm test` full suite green (count delta reported)
- [ ] `npm run build` succeeds
- [ ] Committed + tagged `sprint-afs-10-fix-8-complete` + pushed
- [ ] `git status` clean post-push
- [ ] Wait ≥90s for Vercel deploy
- [ ] Live verify: planets visibly bigger, no overlap, no clipping
- [ ] Jix sign-off on visual result vs reference image
- [ ] No regressions on other starmap features (sphere, overlays, camera state preserved from FIX-3/4/5/6/7)

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-8-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-8-complete
git tag -d sprint-afs-10-fix-8-complete
```

---

## RISKS

- **R1 — Planet overlap.** Mitigation: position scaled by SAME multiplier as size. If size 4x and position 4x, relative geometry is preserved → no new overlap. (Original design didn't have overlap; scale-up shouldn't introduce it.)
- **R2 — Planets clip out of camera frustum at zoom-out.** Mitigation: Task 0.5 reads OrbitControls maxDistance. If new max planet distance > maxDistance, lock decision should bump maxDistance. If pre-flight reveals this, surface in Checkpoint 1.
- **R3 — Saturn rings / Space Station orbital ring become disproportionate.** Mitigation: those use `size * constant` in NodeMesh.tsx → scale automatically. Verified in Task 1.
- **R4 — Galaxy view breaks.** Mitigation: Task 0.4 establishes if galaxy view shares nodes.ts or has separate definitions. If shared, voidexa scales 1.5x there too (acceptable). If separate, leave galaxy view alone for now (separate sprint if needed).
- **R5 — Multiplier wrong.** Mitigation: lock value AFTER pre-flight report. Don't guess; let actual current values inform multiplier choice. If 4x is too aggressive, fix in FIX-9.
- **R6 — Wrong-emissive `services` (red glow on lilla texture from AFS-10-FIX-7) — out of scope here. Tracked separately.**

---

## RULES APPLIED

- **Rule A:** Searched conversation_search + project_knowledge_search for prior planet-size locks — none found ✅
- **Rule B:** No defaults proposed — multipliers locked AFTER pre-flight numeric report
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Jix decisions in chat (1.5x sun, 4x planets, 4x positions) explicitly captured here
- **Rule E:** Scope respects all locked items from FIX-3/4/5/6/7

---

# END SKILL — AFS-10-FIX-8
