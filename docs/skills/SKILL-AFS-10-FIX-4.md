# SKILL — AFS-10-FIX-4: Sphere Shrink + Remove Double-Stars Overlay

**Sprint:** AFS-10-FIX-4
**Type:** Sphere radius reduction + CSSStarfield removal (no texture changes, no camera changes)
**Priority:** P1 (visual blocker — root cause of "too zoomed in" complaint identified Apr 29 SLUT 24)
**Tag target:** `sprint-afs-10-fix-4-complete`
**Backup tag:** `backup/pre-afs-10-fix-4-20260429`
**Estimated time:** 30-45 min

---

## CONTEXT — Why this sprint exists

Live audit Apr 29 (SLUT 24) revealed the **actual root cause** of "starmap zoomed in" complaint that was misdiagnosed for months:

**Root cause:** NebulaBg.tsx sphere radius is 5000. Camera at z=12 (system view) sees only ~10% of the texture stretched across the giant sphere. Texture is fine. Camera is fine. **Sphere is too big** — texture gets cropped to a small section of itself.

**Secondary issue:** CSSStarfield.tsx overlay renders extra HTML stars on top of nebula sphere — creates ugly "double stars" effect (Jix complaint: "stjerner er store grimme prikker").

**What we already tried and learned:**
- AFS-10-FIX-3 (Set C — pull camera back) — minimal improvement, didn't address root cause
- AFS-10-FIX-B (sphere 5000→12000) — ROLLED BACK (made sun gigantic, wrong direction)
- fal.ai FLUX nebula generation — confirmed FLUX cannot replicate starmap aesthetic, dropped

**This sprint goes the OPPOSITE direction of AFS-10-FIX-B:** sphere DOWN, not up.

---

## SCOPE LOCK

### IN SCOPE
- ✅ NebulaBg.tsx sphere radius reduction (test 800, 1200, 1500 — find sweet spot)
- ✅ Remove `<CSSStarfield />` import + render from system view (StarMapScene.tsx)
- ✅ Remove `<CSSStarfield />` import + render from galaxy view (GalaxyScene.tsx) IF it's used there too
- ✅ Backup tag before any code
- ✅ SKILL committed FIRST
- ✅ Live verify on both `/starmap` AND `/starmap/voidexa`

### OUT OF SCOPE — DO NOT TOUCH
- ❌ Camera FOV (60° stays)
- ❌ Camera z-position (Set C values from AFS-10-FIX-3 stay: galaxy z=38, system z=12)
- ❌ OrbitControls (min/max distance stay)
- ❌ Texture file `/textures/nebula-backdrop.png` — DO NOT replace, DO NOT regenerate
- ❌ Planet positions / nodes (nodes.ts unchanged)
- ❌ Sun rendering / scale
- ❌ NebulaBg material settings (only radius changes)
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
git log origin/main --oneline -3              # confirm HEAD = 3ad2405 (post AFS-10-FIX-3)
git pull origin main
npm test 2>&1 | Select-Object -Last 5         # must show 1393+ passing
```

**STOP if:** working tree dirty, tests failing, HEAD doesn't match.

### 0.2 Read NebulaBg.tsx current state

```powershell
Get-Content components/starmap/NebulaBg.tsx
```

**Report:**
- Sphere radius value + line number
- Material element (meshBasicMaterial / meshStandardMaterial)
- Texture loading method (useLoader vs direct)
- side prop value (THREE.BackSide / FrontSide / DoubleSide)
- Any `<fog>` references (kill them — see AFS-6g lessons)

### 0.3 Locate CSSStarfield usage

```powershell
Select-String -Path "components/starmap/*.tsx" -Pattern "CSSStarfield"
Select-String -Path "components/galaxy/*.tsx" -Pattern "CSSStarfield"
Select-String -Path "app/starmap/**/*.tsx" -Pattern "CSSStarfield"
```

**Report:**
- Every file that imports CSSStarfield
- Every file that renders `<CSSStarfield />`
- Whether it's a Three.js component (R3F) or HTML overlay (DOM CSS)

### 0.4 Camera + sphere relationship math

**Confirm (read-only, don't change):**
- Galaxy view camera z (should be 38 post AFS-10-FIX-3)
- System view camera z (should be 12 post AFS-10-FIX-3)
- Camera far plane (should be 20000)
- Current sphere radius (expected: 5000)

**Math gut-check before approval:**
- Sphere radius MUST be > camera maxDistance (galaxy 100, system 40) so user can't fly out of sphere
- Sphere radius MUST be < camera far plane (20000) so it doesn't get frustum-culled
- Current: 5000 (works mathematically but texture stretched)
- Target: 800-1500 (texture more visible but sphere closer to camera)

**Math validation:**
- System view camera at z=12, OrbitControls maxDistance=40 from target [0,-0.5,-4] → effective max distance from origin = 44
- Galaxy view camera at z=38, OrbitControls maxDistance=100 from target [0,0,0] → effective max distance from origin = 100
- **Sphere radius must be > 100** to handle galaxy view zoom-out
- **Recommended target: 1500** (safe margin, texture much more visible than at 5000)

### 0.5 Propose 3 candidate sphere radius values

Based on math above, propose:

**Conservative: 2500**
- Half of current 5000 — moderate texture visibility increase
- 25× larger than galaxy maxDistance 100 — very safe
- Risk: may not be small enough to "feel like the texture"

**Recommended: 1500**
- 30% of current 5000 — significant texture visibility
- 15× larger than galaxy maxDistance 100 — safe
- Likely sweet spot

**Aggressive: 800**
- 16% of current 5000 — texture fills view
- 8× larger than galaxy maxDistance 100 — tight but safe
- Risk: galaxy view may show sphere edge / horizon

**STOP HERE.** Present all 3 to Jix. Wait for explicit approval before proceeding.

---

## TASK 1 — Backup tag

```powershell
git tag backup/pre-afs-10-fix-4-20260429
git push origin backup/pre-afs-10-fix-4-20260429
```

Verify:
```powershell
git tag --list "backup/pre-afs-10-fix-4*"
git ls-remote --tags origin | Select-String "afs-10-fix-4"
```

---

## TASK 2 — Apply approved sphere radius

**Single file edit only.**

Edit `components/starmap/NebulaBg.tsx`:
- Change sphere radius from 5000 to approved value (800 / 1500 / 2500)

**Commit message format:**
```
fix(afs-10-fix-4): shrink nebula sphere radius for texture visibility

- NebulaBg sphere radius 5000 → <approved>
- Root cause of "too zoomed in" complaint
- Texture file unchanged
- Camera unchanged
```

**STOP after Task 2 commit.** Do NOT push yet. Continue to Task 3.

---

## TASK 3 — Remove CSSStarfield overlay

For EACH file from Task 0.3 that imports/renders CSSStarfield:

1. Remove import line: `import CSSStarfield from "..."` (or similar)
2. Remove render: `<CSSStarfield ... />` JSX line
3. If CSSStarfield is the ONLY content of a wrapper div, remove the wrapper too

**Files expected (from prior session knowledge — VERIFY in 0.3):**
- `components/starmap/StarMapScene.tsx`
- Maybe `components/galaxy/GalaxyScene.tsx`
- Maybe `app/starmap/page.tsx` or `app/starmap/voidexa/page.tsx`

**Commit message format:**
```
fix(afs-10-fix-4): remove CSSStarfield overlay (double-stars bug)

- Remove CSSStarfield import + render from <files>
- Stars now only from nebula texture (single layer)
- Eliminates "ugly bright dots over nebula" complaint
```

**STOP after Task 3 commit.** Do NOT push yet. Continue to Task 4.

---

## TASK 4 — Tests

Update or add minimal assertions:

```typescript
// tests/afs-10-fix-4-sphere-stars.test.ts (or update existing)
test('NebulaBg sphere radius is <approved value>', () => { ... })
test('CSSStarfield not imported in StarMapScene', () => { ... })
test('CSSStarfield not rendered in starmap views', () => { ... })
```

Target: +3-5 assertions

**Test count:** 1393 → 1396-1398

---

## TASK 5 — Build + lint check

```powershell
npm run build
npm run lint -- --max-warnings 0  # 222 pre-existing OK, no NEW errors
```

Build must pass. Lint = same baseline (222 pre-existing — confirm not increased).

---

## TASK 6 — Push + tag

```powershell
git push origin main
git tag sprint-afs-10-fix-4-complete
git push origin sprint-afs-10-fix-4-complete

# Verify pushed
git status                                    # must be clean
git log origin/main --oneline -5              # confirm both commits on remote
git ls-remote --tags origin | Select-String "afs-10-fix-4"
```

**Wait ≥90s for Vercel deploy before live verify.**

---

## TASK 7 — Live verify (Jix via Chrome bridge, incognito + hard reload)

**Hand off to Jix. Do NOT run live verify yourself.**

### 7.1 Galaxy view `/starmap`
- ✅ Nebula visible (no black background)
- ✅ MORE of nebula visible than before — feels like a "real space scene", not zoomed in
- ✅ Sun + Your Planet visible at proper scale
- ✅ NO ugly bright pinpoint stars overlaying nebula (CSSStarfield removed)
- ✅ Stars only from nebula texture (natural distribution)
- ✅ Zoom in/out still works (scroll wheel)
- ✅ No sphere edge / horizon visible (if Aggressive 800 chosen, may need bump)

### 7.2 System view `/starmap/voidexa`
- ✅ Nebula visible, fills more of frame
- ✅ All 10 nodes visible
- ✅ Saturn rings on Quantum still visible
- ✅ Voidexa-sun electric blue plasma still visible
- ✅ NO ugly bright pinpoint stars overlaying nebula
- ✅ Universe feels less "huge and empty" — planets feel more present in the scene
- ✅ Zoom in/out still works

### 7.3 Regression check
- ✅ No new console errors
- ✅ Network tab clean (no texture 404s)
- ✅ Tests still 1396+ passing

**If ANY 7.1-7.3 fails → ROLLBACK immediately:**

```powershell
git reset --hard backup/pre-afs-10-fix-4-20260429
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-4-complete
```

**If sphere radius too small (sphere edge visible)** → bump radius up next iteration (don't rollback, just adjust).

**If sphere radius still too big (still feels zoomed in)** → bump radius down next iteration.

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST (this file)
- [ ] Backup tag pushed
- [ ] Pre-flight 0.1-0.5 reported to Jix + approval received
- [ ] Sphere radius changed per approved value
- [ ] CSSStarfield removed from all identified files
- [ ] Tests green (1396+)
- [ ] Build clean, lint baseline unchanged (222 pre-existing OK)
- [ ] Pushed + tagged
- [ ] `git status` clean post-push
- [ ] Live verify 7.1-7.3 passed (handed off to Jix)
- [ ] Jix sign-off on visual result

---

## ROLLBACK

```powershell
git reset --hard backup/pre-afs-10-fix-4-20260429
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-4-complete
```

No data migrations. No schema changes. Pure code.

---

## RISKS

- **Risk: Sphere edge becomes visible (texture seam at "horizon")**
  → Mitigation: Start with Recommended 1500, test before going to Aggressive 800. If edge shows on galaxy view zoom-out, bump back up.

- **Risk: Texture appears too low-res when sphere is small**
  → Mitigation: Texture is 4800×3200 — at sphere radius 1500 it should still look sharp. If pixelated, bump radius up slightly (to 2000-2500).

- **Risk: Removing CSSStarfield reveals nebula has too few stars**
  → Mitigation: Texture has stars baked in. If genuinely lacking stars, can re-add CSSStarfield in future sprint with reduced density. Don't add back in this sprint.

- **Risk: Galaxy view sphere too small for OrbitControls maxDistance=100**
  → Mitigation: 1500 > 100, safe. 800 still > 100, safe.

- **Risk: AFS-10-FIX-B replay (gigantic sun)**
  → Mitigation: Sun radius is independent of sphere radius. We are reducing sphere, not changing sun. Sun stays at scale 0.6 in nodes.ts.

- **Risk: Tests break because hardcoded sphere radius changed**
  → Mitigation: Update test assertions in Task 4 in same commit chain as code changes.

---

## REFERENCES

- AFS-10-FIX-3 (Apr 29) — camera pull-back. Set C live. Tag `sprint-afs-10-fix-3-complete` at 3ad2405.
- AFS-10-FIX-B (Apr 29) — ROLLED BACK. Sphere 5000→12000 made sun gigantic. Lesson: bigger sphere = wrong direction.
- AFS-6g (Apr 25-26) — battle scene skybox. Lessons on Three.js fog masking, sphere/camera math.
- SLUT 23 corrections #70-#74 — locked rules A-E.
- Locked Rule C: "NO code without SKILL — zero exceptions."

---

# END SKILL — AFS-10-FIX-4
