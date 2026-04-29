# SKILL — AFS-10-FIX-5: Remove R3F StarField Particles + Radial-Gradient Overlays

**Sprint:** AFS-10-FIX-5
**Type:** Remove 3D particle StarFields + remove radial-gradient HTML overlays (no texture changes, no camera changes, no sphere changes)
**Priority:** P1 (visual blocker — actual root cause of "stjerner oven på baggrund" + "baggrund ødelagt fra stretch og zoom" identified Apr 29 SLUT 24 live audit)
**Tag target:** `sprint-afs-10-fix-5-complete`
**Backup tag:** `backup/pre-afs-10-fix-5-20260429`
**Estimated time:** 30-45 min

---

## CONTEXT — Why this sprint exists

After AFS-10-FIX-4 shipped (sphere 5000→1500, CSSStarfield removed), live audit Apr 29 (SLUT 24) revealed the issue is NOT solved:

**Jix complaint persists:** "der er ingen forskel. baggrunden er stadig helt ødelagt. fra stretch og zoom. den rendere stadig stjerner oven på baggrunds billede"

**Live DOM inspection findings (via Chrome bridge JS):**
- ✅ CSSStarfield gone (count 0) — AFS-10-FIX-4 worked for that
- 🔴 **3 radial-gradient HTML overlays** still rendering (1889×827 each, full viewport) — these were NEVER part of CSSStarfield, separate components untouched by previous sprints
- 🔴 **R3F StarField particle systems still rendering** — inline `function StarField()` in StarMapScene.tsx (5000 particles) + GalaxyScene.tsx (2000 particles) — explicitly OUT of scope in AFS-10-FIX-4 per pre-flight flag

**CC's pre-flight in AFS-10-FIX-4 explicitly warned:**
> "If 'stjerner er store grimme prikker' complaint actually refers to those R3F particles too (not just the CSS overlay), removing only CSSStarfield won't fully solve it."

That warning was correct. Claude (this assistant) ignored it and locked R3F StarField as out-of-scope. That decision was wrong. AFS-10-FIX-5 corrects it.

**Root cause now confirmed:** The "stars over nebula" complaint is caused by R3F particle StarField (3D points inside Canvas), NOT by CSSStarfield (which was a non-issue HTML overlay). The radial-gradient overlays separately wash/dim the nebula, contributing to "ødelagt fra stretch og zoom" feeling.

---

## SCOPE LOCK

### IN SCOPE
- ✅ Remove `function StarField()` definition + `<StarField />` render from `components/starmap/StarMapScene.tsx`
- ✅ Remove `function StarField()` definition + `<StarField />` render from `components/galaxy/GalaxyScene.tsx`
- ✅ Locate + remove 3 radial-gradient overlay divs (in StarMapPage.tsx + GalaxyPage.tsx most likely — pre-flight will confirm)
- ✅ Backup tag before any code
- ✅ SKILL committed FIRST
- ✅ Live verify on both `/starmap` AND `/starmap/voidexa`
- ✅ Update design docs (components/starmap/README.md) to reflect new architecture (only NebulaBg + nebula-backdrop.png texture remain)

### OUT OF SCOPE — DO NOT TOUCH
- ❌ NebulaBg.tsx (sphere radius stays at 1500 from AFS-10-FIX-4)
- ❌ Camera FOV / position (Set C from AFS-10-FIX-3 stays)
- ❌ OrbitControls
- ❌ Texture file `/textures/nebula-backdrop.png` — DO NOT replace, DO NOT regenerate
- ❌ Planet positions / nodes (nodes.ts unchanged)
- ❌ Sun rendering / scale
- ❌ CSSStarfield.tsx file (already orphaned, no consumers, leave on disk)
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
git log origin/main --oneline -5              # confirm HEAD = bb0a461 (post AFS-10-FIX-4)
git pull origin main
npm test 2>&1 | Select-Object -Last 5         # must show 1401+ passing
```

**STOP if:** working tree dirty, tests failing, HEAD doesn't match.

### 0.2 Locate R3F StarField definitions

```powershell
Select-String -Path "components/starmap/*.tsx" -Pattern "function StarField|<StarField"
Select-String -Path "components/galaxy/*.tsx" -Pattern "function StarField|<StarField"
```

**Report tabular:**

| File | function StarField definition (line) | <StarField /> render (line) | Particle count | Material props |
|---|---|---|---|---|
| StarMapScene.tsx | ? | ? | ~5000? | ? |
| GalaxyScene.tsx | ? | ? | ~2000? | ? |

Read each `function StarField()` body and report:
- How particles are generated (random spread? Grid?)
- Material type (PointMaterial? Points?)
- Color, size, opacity values
- Any animation/useFrame logic

### 0.3 Locate 3 radial-gradient overlays

Live DOM showed 3 overlays at 1889×827 (full viewport):
```
radial-gradient(120% 80% at 50% -10%, rgba(20, 10, 50, 0.7) ...)
radial-gradient(60% 40% at 85% 15%, rgba(0, 100, 180, 0.07) ...)
radial-gradient(50% 35% at 10% 85%, rgba(80, 0, 140, 0.06) ...)
```

```powershell
Select-String -Path "components/starmap/*.tsx" -Pattern "radial-gradient"
Select-String -Path "components/galaxy/*.tsx" -Pattern "radial-gradient"
Select-String -Path "app/starmap/**/*.tsx" -Pattern "radial-gradient"
Select-String -Path "components/starmap/StarMapPage.tsx" -Pattern "radial|gradient|absolute"
Select-String -Path "components/galaxy/GalaxyPage.tsx" -Pattern "radial|gradient|absolute"
```

**Report tabular:**

| File | Line(s) | What it is | Color values |
|---|---|---|---|
| ? | ? | radial-gradient overlay 1 | ? |
| ? | ? | radial-gradient overlay 2 | ? |
| ? | ? | radial-gradient overlay 3 | ? |

Note: These may be inline JSX style attributes, separate `<div style={{ background: 'radial-gradient(...)' }}>` elements, or imported components. Pre-flight must identify exact location.

### 0.4 Verify scope expectations

Confirm these are still in place (do NOT change):
- NebulaBg.tsx SPHERE_RADIUS = 1500 (from AFS-10-FIX-4)
- GalaxyCanvas.tsx camera position = [0, 3, 38] (from AFS-10-FIX-3)
- StarMapCanvas.tsx camera position = [0, 0, 12] (from AFS-10-FIX-3)
- All 12 planet textures wired (from AFS-10-FIX-2)

If any of above doesn't match → STOP and investigate before proceeding.

### 0.5 Risk assessment

**Risk: Removing R3F StarField makes scene feel empty**
- Mitigation: nebula texture has stars baked in. After overlays removed, nebula will be visibly dense with stars from the texture itself.
- Fallback: if scene feels too empty, can re-add a single low-density StarField (500 particles, dim) in follow-up sprint. Don't add back in this sprint.

**Risk: Removing radial-gradient overlays makes nebula too bright/saturated**
- Mitigation: live verify will show. If too bright → add a single subtle vignette in follow-up sprint. Don't tune in this sprint.
- Fallback: keep one of the three overlays if it's a critical vignette (likely the first one — `120% 80% at 50% -10%` looks like top vignette). But default plan = remove all 3.

**Risk: Tests reference StarField particles**
- Mitigation: pre-flight grep tests for StarField references, update in same commit.

**STOP HERE.** Present pre-flight findings + recommendation to Jix. Wait for explicit approval before proceeding.

---

## TASK 1 — Backup tag

```powershell
git tag backup/pre-afs-10-fix-5-20260429
git push origin backup/pre-afs-10-fix-5-20260429
```

Verify:
```powershell
git tag --list "backup/pre-afs-10-fix-5*"
git ls-remote --tags origin | Select-String "afs-10-fix-5"
```

---

## TASK 2 — Remove R3F StarField from StarMapScene.tsx

**Edit `components/starmap/StarMapScene.tsx`:**

1. Remove `function StarField() { ... }` definition entirely
2. Remove `<StarField />` from JSX render
3. Remove any imports that become orphaned (e.g., `BufferGeometry`, `PointMaterial` if only used by StarField)
4. Keep all other scene content (lights, planets, OrbitControls, NebulaBg)

**Commit message format:**
```
fix(afs-10-fix-5): remove R3F StarField from StarMapScene

- Removed function StarField() (5000 3D particles)
- Removed <StarField /> from JSX
- Stars now only from nebula texture
- Eliminates "stars over background" complaint (system view)
```

**STOP after Task 2 commit.** Continue to Task 3.

---

## TASK 3 — Remove R3F StarField from GalaxyScene.tsx

**Edit `components/galaxy/GalaxyScene.tsx`:**

Same pattern as Task 2 — remove definition + render.

**Commit message format:**
```
fix(afs-10-fix-5): remove R3F StarField from GalaxyScene

- Removed function StarField() (2000 3D particles)
- Removed <StarField /> from JSX
- Stars now only from nebula texture
- Eliminates "stars over background" complaint (galaxy view)
```

**STOP after Task 3 commit.** Continue to Task 4.

---

## TASK 4 — Remove 3 radial-gradient overlays

**Based on Task 0.3 findings, edit identified files.**

For each radial-gradient overlay div:
1. Remove the `<div style={{ background: 'radial-gradient(...)' }}>` element entirely
2. If wrapped in a fragment that becomes empty, remove the wrapper too
3. Keep page layout intact (nav, sidebar, content)

**Commit message format:**
```
fix(afs-10-fix-5): remove 3 radial-gradient overlays from starmap pages

- Removed top vignette overlay
- Removed top-right blue glow overlay
- Removed bottom-left purple glow overlay
- Nebula texture now visible without color wash
- Eliminates "baggrund ødelagt fra stretch og zoom" complaint
```

**STOP after Task 4 commit.** Continue to Task 5.

---

## TASK 5 — Update design docs

**Edit `components/starmap/README.md`:**

Update architecture section to reflect:
- Only `<NebulaBg />` provides background (single layer)
- Stars come from nebula-backdrop.png texture (no overlay layers)
- No CSSStarfield, no R3F StarField, no radial-gradient overlays
- Sphere radius 1500 (from AFS-10-FIX-4)
- Camera Set C values (from AFS-10-FIX-3)

**Commit message format:**
```
docs(afs-10-fix-5): update starmap README to reflect single-layer nebula

- Reflects AFS-10-FIX-3, FIX-4, FIX-5 changes cumulatively
- Architecture: NebulaBg only, no overlay layers
```

---

## TASK 6 — Tests

Update or add minimal assertions:

```typescript
// tests/afs-10-fix-5-overlays.test.ts (or update existing)
test('StarMapScene does not render <StarField />', () => { ... })
test('GalaxyScene does not render <StarField />', () => { ... })
test('No radial-gradient overlay divs in StarMapPage', () => { ... })
test('No radial-gradient overlay divs in GalaxyPage', () => { ... })
```

Target: +4-6 assertions

**Test count:** 1401 → 1405-1407

**Update existing tests if any reference StarField particle counts.**

---

## TASK 7 — Build + lint check

```powershell
npm run build
npm run lint -- --max-warnings 0  # 222 pre-existing OK, no NEW errors
```

Build must pass. Lint = same baseline (222 pre-existing — confirm not increased).

---

## TASK 8 — Push + tag

```powershell
git push origin main
git tag sprint-afs-10-fix-5-complete
git push origin sprint-afs-10-fix-5-complete

# Verify pushed
git status                                    # must be clean
git log origin/main --oneline -7              # confirm 4 commits on remote
git ls-remote --tags origin | Select-String "afs-10-fix-5"
```

**Wait ≥90s for Vercel deploy before live verify.**

---

## TASK 9 — Live verify (Jix via Chrome bridge, incognito + hard reload)

**Hand off to Jix. Do NOT run live verify yourself.**

### 9.1 Galaxy view `/starmap`
- ✅ Nebula visible, NO color wash from gradient overlays
- ✅ NO bright pinpoint stars over nebula (R3F StarField gone)
- ✅ Stars are now only the texture-baked stars (natural distribution within nebula)
- ✅ voidexa + Your Planet visible at proper scale
- ✅ Background looks like a "single image" — no layered effects
- ✅ Zoom in/out still works

### 9.2 System view `/starmap/voidexa`
- ✅ Nebula visible, NO color wash
- ✅ NO bright pinpoint stars over nebula
- ✅ All 10 nodes visible
- ✅ Saturn rings on Quantum still visible
- ✅ voidexa-sun electric blue plasma still visible
- ✅ Background looks like a "single image"
- ✅ Zoom in/out still works

### 9.3 DOM inspection (Claude via Chrome bridge JS)
Run after live verify visual confirmation:
```javascript
({
  starfieldDivs: document.querySelectorAll('[class*="starfield" i]').length,  // expect 0
  radialGradientOverlays: Array.from(document.querySelectorAll('div')).filter(d => {
    const cs = window.getComputedStyle(d);
    return cs.backgroundImage && cs.backgroundImage.includes('radial-gradient');
  }).length,  // expect 0 (or close to 0 — small UI glow gradients on buttons OK)
  canvasCount: document.querySelectorAll('canvas').length  // expect 1 or 2 (R3F + maybe Jarvis chat)
})
```

Expected: starfieldDivs=0, full-viewport radial-gradient overlays=0.

### 9.4 Regression check
- ✅ No new console errors
- ✅ Network tab clean (no texture 404s)
- ✅ Tests still 1405+ passing

**If ANY 9.1-9.4 fails → ROLLBACK immediately:**

```powershell
git reset --hard backup/pre-afs-10-fix-5-20260429
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-5-complete
```

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST (this file)
- [ ] Backup tag pushed
- [ ] Pre-flight 0.1-0.5 reported to Jix + approval received
- [ ] R3F StarField removed from StarMapScene.tsx + GalaxyScene.tsx
- [ ] 3 radial-gradient overlays removed
- [ ] Design doc updated (components/starmap/README.md)
- [ ] Tests green (1405+)
- [ ] Build clean, lint baseline unchanged (222 pre-existing OK)
- [ ] Pushed + tagged
- [ ] `git status` clean post-push
- [ ] Live verify 9.1-9.4 passed (handed off to Jix)
- [ ] DOM inspection confirms starfield + overlay divs gone
- [ ] Jix sign-off on visual result

---

## ROLLBACK

```powershell
git reset --hard backup/pre-afs-10-fix-5-20260429
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-5-complete
```

No data migrations. No schema changes. Pure code.

---

## RISKS

- **Risk: Scene feels empty after removing all overlays + StarField particles**
  → Mitigation: nebula texture has stars baked in. Verify on live audit. If genuinely empty, follow-up sprint adds back ONE low-density StarField (500 particles, very dim).

- **Risk: One of the radial-gradients was actually a vignette holding the look together**
  → Mitigation: live verify with Jix. If "too bright/raw" feedback, add back ONE subtle vignette in follow-up. Don't add back in this sprint.

- **Risk: StarField is referenced elsewhere (deeper than scene component)**
  → Mitigation: pre-flight grep covers all components/* and app/* paths. If found elsewhere, scope expands proportionally.

- **Risk: Tests hard-coded to expect StarField particle counts**
  → Mitigation: update test assertions in Task 6.

- **Risk: Misidentified overlay ownership — overlays might be from a layout component, not StarMapPage/GalaxyPage**
  → Mitigation: pre-flight Task 0.3 explicit grep across all relevant paths. If they're from a global layout, scope expands.

- **Risk: Removing both StarField AND overlays at once → too many variables, hard to A/B**
  → Mitigation: commit chain has 3 separate commits (StarMapScene, GalaxyScene, overlays). If issue arises, can revert specific commit instead of full rollback.

---

## REFERENCES

- AFS-10-FIX-3 (Apr 29) — camera pull-back. Set C live. Tag at `3ad2405`.
- AFS-10-FIX-4 (Apr 29) — sphere shrink + CSSStarfield removal. Tag at `bb0a461`.
- AFS-10-FIX-4 pre-flight CC warning (ignored): "If 'stjerner er store grimme prikker' refers to R3F particles too, removing only CSSStarfield won't fully solve it." That warning was correct.
- AFS-10-FIX-B (Apr 29) — ROLLED BACK. Sphere 5000→12000 made sun gigantic.
- SLUT 23 corrections #70-#74 — locked rules A-E.
- SLUT 24 lesson (this session): Pre-flight warnings from CC must be heeded — locking out-of-scope without verifying complaint scope is a process failure.
- Locked Rule C: "NO code without SKILL — zero exceptions."

---

# END SKILL — AFS-10-FIX-5
