# SKILL — AFS-10-FIX-6: Sphere Radius Fine-Tune (1500 → 800)

**Sprint:** AFS-10-FIX-6
**Type:** Single-value fine-tune (sphere radius only — no other changes)
**Priority:** P1 (visual fine-tune — Jix confirmed AFS-10-FIX-5 fixed overlay/star problems but background still feels too zoomed at 1500)
**Tag target:** `sprint-afs-10-fix-6-complete`
**Backup tag:** `backup/pre-afs-10-fix-6-20260429`
**Estimated time:** 15-25 min

---

## CONTEXT — Why this sprint exists

After AFS-10-FIX-5 shipped (R3F StarField + AmbientDust + GlobalStarfield overlays removed for starmap routes), live audit Apr 29 (SLUT 24) revealed:

**Jix's verdict on AFS-10-FIX-5:**
1. ✅ "stjerner væk" — overlay stars problem SOLVED
2. 🟡 "lidt forbedring men ikke nok. det ligner lidt 640×860"

Translation: overlays are fully removed, but the visible portion of the nebula texture still feels too cropped. User sees only a small section of the texture due to sphere radius being too large relative to camera position.

**Root cause:** Sphere radius 1500 (from AFS-10-FIX-4) is still too large. Camera at z=12 (system view) sees only a fraction of the texture stretched across the sphere surface.

**Fine-tune dial:** This is the same lever from AFS-10-FIX-4. Going from 5000 → 1500 was a major step (texture surface area shrunk to 9% of original). Going from 1500 → 800 is a smaller refinement (surface area shrunk to ~28% of FIX-4 level, ~2.5% of original 5000).

---

## SCOPE LOCK

### IN SCOPE
- ✅ NebulaBg.tsx SPHERE_RADIUS constant: 1500 → 800
- ✅ Backup tag before any code
- ✅ SKILL committed FIRST
- ✅ Live verify on both `/starmap` AND `/starmap/voidexa`
- ✅ Verify NO sphere edge / horizon visible at galaxy max zoom-out
- ✅ Update tests if any reference SPHERE_RADIUS=1500

### OUT OF SCOPE — DO NOT TOUCH
- ❌ Camera FOV / position (Set C from AFS-10-FIX-3 stays)
- ❌ OrbitControls (min/max distance stay)
- ❌ Texture file `/textures/nebula-backdrop.png` — DO NOT replace, DO NOT regenerate
- ❌ Planet positions / nodes (nodes.ts unchanged)
- ❌ Sun rendering / scale
- ❌ NebulaBg material settings (only radius constant changes)
- ❌ GlobalStarfield (AFS-10-FIX-5 guard stays in place)
- ❌ Any other route or component
- ❌ "While I'm in here, let me also..."

If diagnose reveals other bugs → log for backlog, do NOT fix in this sprint.

---

## TASK 0 — PRE-FLIGHT (MANDATORY STOP FOR APPROVAL)

**Do NOT proceed past Task 0 without explicit Jix approval.**

### 0.1 Repo state verification

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git status                                    # must be clean
git log origin/main --oneline -7              # confirm HEAD = 9b52918 (post AFS-10-FIX-5)
git pull origin main
npm test 2>&1 | Select-Object -Last 5         # must show 1415+ passing
```

**STOP if:** working tree dirty, tests failing, HEAD doesn't match.

### 0.2 Read NebulaBg.tsx current state

```powershell
Select-String -Path "components/starmap/NebulaBg.tsx" -Pattern "SPHERE_RADIUS"
```

**Confirm:**
- Line 8 (or current): `const SPHERE_RADIUS = 1500`
- This is the only place SPHERE_RADIUS is defined
- Line 34 (or current) uses `<sphereGeometry args={[SPHERE_RADIUS, 64, 32]}>`

### 0.3 Camera math validation for radius=800

**Read-only — do not change:**
- Galaxy view camera z = 38, OrbitControls maxDistance = 100, target = [0,0,0]
- System view camera z = 12, OrbitControls maxDistance = 40, target = [0,-0.5,-4] (effective max from origin ~44)
- Camera far plane = 20000

**Math check for radius=800:**
- Galaxy max zoom-out distance from origin = 100
- Sphere radius 800 / max distance 100 = **8× margin** ✅
- Camera always inside sphere (100 < 800) ✅
- Sphere always within far plane (800 < 20000) ✅

**Edge case risk:** At galaxy max zoom-out (orbit distance 100), camera is 12.5% of the way to sphere wall. With FOV=60°, viewport corners may show sphere "horizon" or texture seam. Live verify will confirm.

### 0.4 Risk summary for radius=800

**Risk 1: Sphere edge / horizon visible at galaxy max zoom-out**
- Probability: Medium
- Mitigation: If visible → AFS-10-FIX-7 bumps to 1000-1200. Fast follow-up sprint, easy to fix.
- Severity if it happens: cosmetic (visible edge on extreme zoom-out only)

**Risk 2: Texture appears pixelated at this radius**
- Probability: Low — texture is 4800×3200, plenty of pixels per 3D unit at radius 800
- Mitigation: visual check during live verify

**Risk 3: AFS-10-FIX-B replay (gigantic sun)**
- Probability: Zero — sun radius is independent of sphere radius. Sun stays scale 0.6 in nodes.ts.

**Risk 4: Tests hard-coded to 1500**
- Probability: Possible — AFS-10-FIX-4 added test asserting SPHERE_RADIUS=1500
- Mitigation: pre-flight grep tests, update assertion in same commit

### 0.5 Pre-flight grep for tests referencing SPHERE_RADIUS

```powershell
Select-String -Path "tests/*.ts" -Pattern "SPHERE_RADIUS|1500"
Select-String -Path "tests/*.test.ts" -Pattern "sphere.*radius|SPHERE_RADIUS"
```

**Report:** all test files + lines referencing SPHERE_RADIUS or hardcoded 1500. Update list will be used in Task 4.

**STOP HERE.** Present pre-flight findings to Jix. Wait for explicit approval before proceeding.

---

## TASK 1 — Backup tag

```powershell
git tag backup/pre-afs-10-fix-6-20260429
git push origin backup/pre-afs-10-fix-6-20260429
```

Verify:
```powershell
git tag --list "backup/pre-afs-10-fix-6*"
git ls-remote --tags origin | Select-String "afs-10-fix-6"
```

---

## TASK 2 — Change sphere radius

**Single file edit only.**

Edit `components/starmap/NebulaBg.tsx`:
- Change `const SPHERE_RADIUS = 1500` → `const SPHERE_RADIUS = 800`

**Commit message format:**
```
fix(afs-10-fix-6): sphere radius fine-tune 1500 → 800

- AFS-10-FIX-4 reduced 5000 → 1500 (major step)
- AFS-10-FIX-5 removed all overlay layers (proved single-source render)
- Live verify Apr 29 SLUT 24: still feels "640×860 cropped" at 1500
- Reduce to 800 for ~28% of FIX-4 visible texture area
- Math: 800/100 = 8× margin galaxy maxDistance, safe
```

---

## TASK 3 — Update tests

For each test file from Task 0.5:
- Update `expect(SPHERE_RADIUS).toBe(1500)` → `expect(SPHERE_RADIUS).toBe(800)`
- Or update grep-based file-content assertions to match new value

Target: maintain 1415+ test count, no new tests needed.

---

## TASK 4 — Build + lint check

```powershell
npm run build
npm run lint -- --max-warnings 0  # 206 baseline post-FIX-5, no new errors
```

Build must pass. Lint = same baseline (206 pre-existing per FIX-5 closeout).

---

## TASK 5 — Push + tag

```powershell
git push origin main
git tag sprint-afs-10-fix-6-complete
git push origin sprint-afs-10-fix-6-complete

# Verify pushed
git status                                    # must be clean
git log origin/main --oneline -3              # confirm commit on remote
git ls-remote --tags origin | Select-String "afs-10-fix-6"
```

**Wait ≥90s for Vercel deploy before live verify.**

---

## TASK 6 — Live verify (Jix via Chrome bridge, incognito + hard reload)

**Hand off to Jix. Do NOT run live verify yourself.**

### 6.1 Galaxy view `/starmap`
- ✅ Nebula visible, fills more of frame than at radius 1500
- ✅ Universe feels less "huge and empty"
- ✅ NO sphere edge / horizon visible at any zoom level
- ✅ Voidexa + Your Planet visible at proper scale
- ✅ Zoom in/out still works

**At galaxy max zoom-out (scroll wheel out fully):**
- ✅ NO sphere "wall" visible at viewport edges
- ✅ NO texture seam visible
- If either appears → flag for AFS-10-FIX-7 bump

### 6.2 System view `/starmap/voidexa`
- ✅ Nebula fills more of frame than at radius 1500
- ✅ All 10 nodes visible
- ✅ Saturn rings on Quantum still visible
- ✅ Voidexa-sun electric blue plasma still visible
- ✅ Zoom in/out still works

**At system max zoom-out:**
- ✅ NO sphere edge visible
- ✅ Universe feels right-sized for the scene

### 6.3 Regression check
- ✅ No new console errors
- ✅ Network tab clean (no texture 404s)
- ✅ Tests still 1415+ passing

**Decision tree after live verify:**

| Outcome | Next action |
|---|---|
| Looks great, no edges visible | ✅ CLOSE sprint, proceed to SLUT |
| Still feels too zoomed in | AFS-10-FIX-7 reduce to 600 |
| Sphere edge visible at zoom-out | AFS-10-FIX-7 bump to 1000-1200 |
| Texture pixelated | AFS-10-FIX-7 bump to 1200-1500 (1500 was the prior baseline) |
| Genuine break (black screen, error) | ROLLBACK |

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST (this file)
- [ ] Backup tag pushed
- [ ] Pre-flight 0.1-0.5 reported to Jix + approval received
- [ ] SPHERE_RADIUS changed 1500 → 800
- [ ] Tests updated if any referenced 1500
- [ ] Tests green (1415+)
- [ ] Build clean, lint baseline unchanged (206 pre-existing OK)
- [ ] Pushed + tagged
- [ ] `git status` clean post-push
- [ ] Live verify 6.1-6.3 passed (handed off to Jix)
- [ ] Jix sign-off on visual result OR clear next-step decision

---

## ROLLBACK

```powershell
git reset --hard backup/pre-afs-10-fix-6-20260429
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-6-complete
```

No data migrations. No schema changes. Pure single-value fine-tune.

---

## REFERENCES

- AFS-10-FIX-3 (Apr 29) — camera Set C. Tag at `3ad2405`.
- AFS-10-FIX-4 (Apr 29) — sphere 5000→1500 + CSSStarfield removed. Tag at `bb0a461`.
- AFS-10-FIX-5 (Apr 29) — R3F StarField + AmbientDust + GlobalStarfield path-guard. Tag at `9b52918`.
- AFS-10-FIX-B (Apr 29) — ROLLED BACK. Sphere went WRONG direction (5000→12000). Lesson: down is correct.
- This sprint continues the right direction (down) from AFS-10-FIX-4's halved value.
- Locked Rule C: "NO code without SKILL — zero exceptions."

---

# END SKILL — AFS-10-FIX-6
