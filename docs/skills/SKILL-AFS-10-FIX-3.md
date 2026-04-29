# SKILL — AFS-10-FIX-3: Starmap Camera Zoom-Out

**Sprint:** AFS-10-FIX-3
**Type:** Camera-only fix (no texture, no sphere, no planet, no node changes)
**Priority:** P1 (visual blocker — Jix flagged repeatedly since Apr 21)
**Tag target:** `sprint-afs-10-fix-3-complete`
**Backup tag:** `backup/pre-afs-10-fix-3-20260429`
**Estimated time:** 30-45 min

---

## CONTEXT — Why this sprint exists

Starmap baggrund føles "for tæt på" — nebula fylder hele skærmen, ingen "vast universe"-følelse. Jix har flagget det siden Apr 21. AFS-10-FIX-B forsøgte at fikse det Apr 29 men blev rolled back fordi:

1. Ingen SKILL skrevet først
2. Ingen pre-flight read af current values
3. 3 værdier ændret samtidig (sphere radius + FOV + camera z) — solen blev gigantisk
4. Ingen rollback path defineret

**Lesson learned (locked Rule C, SLUT 23):** Every code change requires SKILL committed FIRST. Zero exceptions.

---

## SCOPE LOCK

### IN SCOPE
- ✅ Camera FOV change (StarMapScene.tsx)
- ✅ Camera z-position change (StarMapScene.tsx)
- ✅ OrbitControls min/max distance adjustment IF needed
- ✅ Backup tag before any code
- ✅ SKILL committed FIRST
- ✅ Live verify on both `/starmap` AND `/starmap/voidexa` before closing

### OUT OF SCOPE — DO NOT TOUCH
- ❌ Sphere radius (NebulaBg.tsx) — caused gigantic sun bug Apr 29
- ❌ Texture file — `/textures/nebula-backdrop.png` stays unchanged
- ❌ Planet positions / nodes (nodes.ts unchanged)
- ❌ Sun rendering / scale
- ❌ CSSStarfield.tsx — separate problem (double-stars), separate sprint
- ❌ NebulaBg.tsx component — texture stays as-is
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
git log origin/main --oneline -3              # confirm HEAD
git pull origin main
npm test 2>&1 | Select-Object -Last 5         # must show 1385+ passing
```

**STOP if:** working tree dirty, tests failing, HEAD doesn't match expected.

### 0.2 Locate Three.js source files

```powershell
Get-ChildItem -Recurse -Filter "*.tsx" -Path "components/starmap" | Select-Object FullName
Get-ChildItem -Recurse -Filter "*.tsx" -Path "src/components/starmap" -ErrorAction SilentlyContinue | Select-Object FullName
```

**Report exact paths of:**
- Galaxy view scene (`/starmap`)
- System view scene (`/starmap/voidexa`)
- Camera component / config
- OrbitControls config
- NebulaBg component (read-only — for context)

### 0.3 Read current camera baseline values

Grep target file(s):

```powershell
Select-String -Path "components/starmap/*.tsx" -Pattern "fov=|<PerspectiveCamera|position=\["
Select-String -Path "components/starmap/*.tsx" -Pattern "OrbitControls|minDistance|maxDistance"
Select-String -Path "components/starmap/*.tsx" -Pattern "<Sphere|sphere radius|args=\["
```

**Report tabular — current values:**

| Parameter | Galaxy view (`/starmap`) | System view (`/starmap/voidexa`) | Source file:line |
|---|---|---|---|
| Camera FOV | ? | ? | ? |
| Camera position (x, y, z) | ? | ? | ? |
| Camera far plane | ? | ? | ? |
| OrbitControls minDistance | ? | ? | ? |
| OrbitControls maxDistance | ? | ? | ? |
| Skybox sphere radius (read-only) | ? | ? | ? |
| Sun position + scale (read-only) | ? | ? | ? |

### 0.4 Identify "smaller change wins" candidate values

**Based on current values from 0.3, propose 2 sets:**

**Conservative set (minimal change):**
- FOV: current → current - 5
- Camera z: current → current × 1.3 (pull back 30%)
- OrbitControls maxDistance: bump if needed so user can still zoom in to current view

**Aggressive set (Apr 26 plan):**
- FOV: current → 48
- Camera z: pull back ~40%
- OrbitControls maxDistance: bump

**STOP HERE.** Present both sets to Jix. Wait for explicit approval before proceeding.

---

## TASK 1 — Backup tag

```powershell
git tag backup/pre-afs-10-fix-3-20260429
git push origin backup/pre-afs-10-fix-3-20260429
```

Verify:
```powershell
git tag --list "backup/pre-afs-10-fix-3*"
git ls-remote --tags origin | Select-String "afs-10-fix-3"
```

---

## TASK 2 — Apply approved camera values

**Single file edits only. No multi-file changes.**

### 2.1 Galaxy view (`/starmap`)
Edit identified file from 0.2. Change:
- FOV value
- Camera z value
- OrbitControls maxDistance (if approved)

### 2.2 System view (`/starmap/voidexa`)
Edit identified file from 0.2. Change:
- FOV value
- Camera z value
- OrbitControls maxDistance (if approved)

**Commit message format:**
```
fix(afs-10-fix-3): zoom camera out on starmap views

- Galaxy view: FOV X→Y, camera z A→B
- System view: FOV X→Y, camera z A→B
- No texture / sphere / planet changes
- Tag: sprint-afs-10-fix-3-complete
```

---

## TASK 3 — Tests

**Update existing camera-related assertions OR add minimal new ones.**

Target: +2-4 assertions

```typescript
// tests/afs-10-fix-3-camera.test.ts (or update existing)
test('Galaxy view camera FOV is <approved value>', () => { ... })
test('System view camera FOV is <approved value>', () => { ... })
test('Galaxy view camera z position is <approved value>', () => { ... })
test('System view camera z position is <approved value>', () => { ... })
```

**STOP if test count drops** — investigate before push.

---

## TASK 4 — Build + lint

```powershell
npm run build
npm run lint -- --max-warnings 0
```

Both must pass. No new warnings, no new errors.

---

## TASK 5 — Push + tag

```powershell
git push origin main
git tag sprint-afs-10-fix-3-complete
git push origin sprint-afs-10-fix-3-complete

# Verify pushed
git status                                    # must be clean
git log origin/main --oneline -3              # confirm commit on remote
git ls-remote --tags origin | Select-String "afs-10-fix-3"
```

**Wait ≥90s for Vercel deploy before live verify.**

---

## TASK 6 — Live verify (Claude in Chrome, incognito + hard reload)

### 6.1 Galaxy view `/starmap`
- ✅ Sun NOT gigantic (size relative to viewport same or smaller than baseline)
- ✅ Nebula feels MORE distant (deep universe feel)
- ✅ "voidexa" label still readable
- ✅ All 2 planets still visible (voidexa + Your Planet)
- ✅ DirectorySidebar functional
- ✅ Zoom in still works (user can still get close via scroll)

### 6.2 System view `/starmap/voidexa`
- ✅ Sun NOT gigantic
- ✅ All 10 nodes visible (voidexa sun + Space Station + 8 planets)
- ✅ Saturn rings on Quantum still visible
- ✅ Equirectangular textures still wrapping correctly
- ✅ Nebula feels more distant
- ✅ Zoom in still works

### 6.3 Regression check
- ✅ No new console errors
- ✅ No texture loading failures (Network tab clean)
- ✅ Tests still 1385+ passing

**If ANY 6.1-6.3 fails → ROLLBACK immediately:**

```powershell
git reset --hard backup/pre-afs-10-fix-3-20260429
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-3-complete
```

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST (this file)
- [ ] Backup tag pushed
- [ ] Pre-flight 0.1-0.4 reported to Jix + approval received
- [ ] Camera values changed per approved set
- [ ] Tests green (1385+)
- [ ] Build clean, lint clean
- [ ] Pushed + tagged
- [ ] `git status` clean post-push
- [ ] Live verify 6.1-6.3 passed on incognito + hard reload
- [ ] Jix sign-off on visual result

---

## ROLLBACK

```powershell
git reset --hard backup/pre-afs-10-fix-3-20260429
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-3-complete
```

No data migrations. No schema changes. Pure code.

---

## RISKS

- **Risk: Sun becomes gigantic again (AFS-10-FIX-B replay)**
  → Mitigation: NO sphere radius change in this sprint. Only camera FOV + camera z. Sun stays fixed-scale.

- **Risk: Camera pulls back so far that planets become invisible specks**
  → Mitigation: Conservative set first. Live verify after Task 6. Rollback if planets unreadable.

- **Risk: OrbitControls maxDistance too small — user can't zoom out**
  → Mitigation: Bump maxDistance proportional to camera z change.

- **Risk: Tests fail because hardcoded camera values changed**
  → Mitigation: Update test assertions in Task 3 in same commit as code change.

- **Risk: Different scenes share same camera config — change affects 1, breaks other**
  → Mitigation: Pre-flight 0.2 explicitly identifies BOTH scene files. Edits applied to both.

---

## REFERENCES

- AFS-10-FIX-B (Apr 29) — ROLLED BACK. Commit `9145bd1`. Lesson: 3-value change without SKILL = scene break.
- AFS-6h scope (Apr 26) — original camera reframing plan. FOV 55→48, sphere 1500→2500, z pull back. **Sphere change deferred to separate future sprint.**
- SLUT 23 corrections #70-#74 — locked rules A-E.
- Locked Rule C: "NO code without SKILL — zero exceptions."

---

# END SKILL — AFS-10-FIX-3
