# AFS-10-FIX — Texture Wiring Bug Fix (Planet PNGs Not Rendering)

**Sprint type:** Bug-fix sprint on AFS-10
**Priority:** P0 — Blocks ALL further starmap visual work
**Depends on:** AFS-10 rollback to a332baf (FIX-B reverted)
**Parallel-safe with:** Nothing — STOP all other starmap work

---

## ROOT PROBLEM

Live state on `/starmap/voidexa`:
- voidexa-sun renders as flat yellow circle (NOT voidexa.png electric plasma sphere)
- All 9 satellite planets render as flat colored spheres (NOT their photo-realistic PNGs)
- Saturn-style rings on Quantum DO render → SOMETHING textured works
- 12 PNG files confirmed on disk at `public/textures/planets/` per AFS-10 pre-flight Apr 29

**Root cause unknown.** AFS-10 wired `texture` field to nodes.ts and applied via NodeMesh.tsx, but live render shows none of it. Must diagnose before any code changes.

---

## SCOPE (LOCKED — DO NOT EXPAND)

1. Diagnose WHY textures don't render (Task 0 only — no code)
2. Lock fix decision based on diagnose findings (Jix approval at Checkpoint 1)
3. Apply minimal fix per locked decision
4. Pixel-sample diagnostic in DoD (NOT visual screenshot interpretation)
5. Live verify on voidexa.com

**OUT OF SCOPE — DO NOT TOUCH:**
- Sphere radius, camera FOV, camera position, OrbitControls (skybox/zoom = separate sprint AFS-10-FIX-B-v2 LATER)
- nodes.ts positions (label clustering = separate task)
- Any new component
- Any other route
- Any new test file unrelated to texture-wiring
- next.config.ts redirects (already shipped in AFS-10)
- /quantum, /trading-hub, /game-hub pages (already shipped in AFS-10)

**If scope creep is detected — STOP and ask Jix.**

---

## CRITICAL HISTORICAL CONTEXT (READ BEFORE TASK 0)

### AFS-6g skybox bug-cluster (Apr 26) — same problem class

7 fixes were required to make a single skybox texture render. Root cause was identified at fix-5:

**Three.js `<fog>` masks `meshBasicMaterial` silently.**
- Scene had `<fog args={['#04030b', 40, 160]} />` 
- Skybox sphere at radius ~1484
- Fog far=160 → fogFactor=0 → finalColor = 100% fog color
- Texture invisible regardless of brightness, opacity, ref-pattern, color prop
- Fix: `fog={false}` on the skybox material

**Lesson #64 (locked):** "Three.js fog masks meshBasicMaterial silently. Always disable on materials that should ignore fog."

**Lesson #63 (locked):** "Pixel-sample diagnostic in DoD. Visual screenshot interpretation alone is insufficient — it took 7 fixes after AFS-6g claimed 'live verified skybox visible'."

### AFS-6h v1 (Apr 26-27) — rolled back

Mathematical reference-image interpretation produced "technically-close-but-wrong" outcome. **Lesson #69 (locked):** "Reference image ≠ user vision. Use explicit user spec."

This sprint must NOT repeat that error. All fixes derived from Jix-approved spec, not Claude's interpretation of "what should look right."

---

## TASK 0 — PRE-FLIGHT DIAGNOSE (NO CODE)

**Mandatory verify-first. Do NOT proceed past Task 0 without explicit Jix approval at Checkpoint 1.**

### 0.1 Repo state

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -5
```

**Confirm:** HEAD = `a332baf` (post-rollback baseline). Working tree clean.

**STOP if:** any other commit at HEAD, or working tree dirty.

### 0.2 Verify texture files exist

```bash
ls -la public/textures/planets/
```

**Expected 12 files:**
```
voidexa.png, earth.png, icy_blue.png, lilla.png, orange.png,
pastel_green.png, pink.png, purpel-pink.png, red_rocky.png,
saturen_like_rings.png, spacestation_planet.png, goldenblue.png
```

**Report:** All 12 present? File sizes? (If any are < 10KB, they may be placeholders.)

### 0.3 Inspect nodes.ts texture wiring

```bash
cat components/starmap/nodes.ts
```

**Report for ALL 10 wired nodes:**
- Node label
- Exact `texture` field value (e.g. `"/textures/planets/voidexa.png"` vs `"/assets/planets/voidexa.png"` vs other)
- Verify each path matches an ACTUAL file at `public/textures/planets/`

**STOP if:** Any path mismatch. Path mismatch alone could be root cause — no need to investigate further.

### 0.4 Inspect NodeMesh.tsx material code

```bash
cat components/starmap/NodeMesh.tsx
```

**Report:**

a. **Material element used** — exact JSX tag:
   - `<meshBasicMaterial>` (works without lights, color prop multiplies texture)
   - `<meshStandardMaterial>` (requires lights, renders BLACK without ambient/directional)
   - `<meshPhysicalMaterial>` (same as Standard + extras)
   - Other

b. **Texture loading mechanism** — exact code:
   - `useLoader(TextureLoader, path)` (R3F standard pattern)
   - `useTexture(path)` (drei helper)
   - Manual `new THREE.TextureLoader().load(...)` 
   - Other

c. **Texture-to-material binding** — exact prop:
   - `<material map={texture} />` (correct)
   - `<material color={texture} />` (WRONG — color expects THREE.Color, not Texture)
   - Other

d. **`fog={false}` present on material?** Yes/No. (If scene has `<fog>` and material does NOT set `fog={false}`, AFS-6g lesson applies.)

e. **Color prop alongside map?** What value?
   - `color="#ffffff"` or `color="white"` → preserves texture appearance ✅
   - `color="#7c3aed"` (any non-white) → tints/destroys texture appearance ❌
   - No color prop → defaults to white ✅

f. **Show exact JSX block** for the textured mesh (5-15 lines from the render return).

### 0.5 Inspect StarMapScene.tsx for fog and lights

```bash
cat components/starmap/StarMapScene.tsx | grep -nE "(fog|Light|Environment)"
```

**Report:**

a. **`<fog>` element present?** If yes:
   - Args: color, near, far (e.g. `args={['#04030b', 40, 160]}`)
   - This activates AFS-6g lesson #64 — material needs `fog={false}`

b. **List ALL light components:**
   - `<ambientLight intensity={?} color={?} />`
   - `<directionalLight intensity={?} position={?} />`
   - `<pointLight intensity={?} position={?} />`
   - `<hemisphereLight>`
   - `<Environment preset={?} />` (drei)
   - None?

c. **Implication:**
   - meshStandardMaterial + zero lights = BLACK textures
   - meshStandardMaterial + only `<ambientLight intensity={0.1}>` = nearly-black textures
   - meshBasicMaterial + any lights = textures unaffected (basic ignores lighting)

### 0.6 Find voidexa-sun rendering path

```bash
grep -rn "voidexa.png" components/ app/
grep -rn "Sun\|sun" components/starmap/ --include="*.tsx"
```

**Report:**

a. **Where is voidexa-sun rendered?**
   - Inside StarMapScene.tsx as inline mesh (search for sun-specific code)
   - Separate component (Sun.tsx, VoidexaSun.tsx, CentralStar.tsx)
   - As node[0] in nodes.ts going through standard NodeMesh path

b. **If separate component:**
   - File path
   - Material type used
   - Does it import voidexa.png?
   - If NOT importing voidexa.png → this is why sun is flat yellow

### 0.7 Compare Quantum (works) vs Apps (broken)

Saturn-rings on Quantum visibly render. Apps planet renders flat. Both go through same nodes.ts + NodeMesh.tsx path (presumably).

**Report:**

a. Quantum's nodes.ts entry — full object including any non-default fields
b. Apps's nodes.ts entry — full object  
c. Diff: what's different between the two? (extra component? render variant? prop difference?)

This is the smoking gun. If Quantum works and Apps doesn't with identical code path → it's not the code, it's the texture file or path. If they go through DIFFERENT code paths → that's the bug location.

### 0.8 Browser DevTools network audit

Manual step (Jix performs):

1. Open `https://voidexa.com/starmap/voidexa` in Chrome
2. Open DevTools (F12) → Network tab
3. Filter: "planets"
4. Hard-refresh (Ctrl+Shift+R)
5. Wait for 3D scene to load
6. **Report HTTP status for each:**
   - `/textures/planets/voidexa.png` — 200 / 404 / 304?
   - `/textures/planets/earth.png` — ?
   - `/textures/planets/saturen_like_rings.png` — ?
   - `/textures/planets/pink.png` — ?
   - `/textures/planets/lilla.png` — ?
   - All others?

If ALL 200 → files load, problem is render-side (material/lights/fog)
If ANY 404 → path mismatch in nodes.ts, files load wrong location

### 0.9 Browser DevTools console audit

Same browser session:

1. DevTools → Console tab
2. Hard-refresh
3. **Report any:**
   - THREE.js warnings (especially "WebGL warning: drawElementsInstanced..." or "Texture has been resized...")
   - 404 errors
   - Material errors
   - Texture errors

### 0.10 Screenshot evidence (Jix performs via Claude in Chrome bridge)

Optional but useful — Jix takes screenshot at multiple zoom levels for Claude pixel-sample comparison:
- Default zoom (sun ~30% viewport)
- Zoomed in on Apps planet
- Zoomed in on voidexa-sun

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After completing 0.1-0.10, CC outputs structured report:

```
DIAGNOSE REPORT — AFS-10-FIX

0.1 Repo state: [clean/dirty, HEAD]
0.2 Texture files: [12/12 present, sizes]
0.3 nodes.ts paths: [table of 10 nodes + paths + match/mismatch]
0.4 NodeMesh material: [type, loader, binding, fog, color]
0.5 Scene fog + lights: [fog args, lights list]
0.6 voidexa-sun path: [file, material, imports voidexa.png?]
0.7 Quantum vs Apps diff: [what's different]
0.8 Network status: [all paths + HTTP codes]
0.9 Console errors: [list]
```

**WAIT FOR JIX REVIEW.**

Based on diagnose, Jix locks ONE of these fix paths:

**Fix Path A — fog masks textures (AFS-6g class):**
- Add `fog={false}` to NodeMesh material
- Add `fog={false}` to voidexa-sun material
- 1-2 line change

**Fix Path B — wrong material type:**
- Change `<meshBasicMaterial>` to `<meshStandardMaterial>` + add lights
- OR change `<meshStandardMaterial>` to `<meshBasicMaterial>` (simpler, no lights needed)
- Decision based on whether dynamic lighting is needed (it's not for skybox-style backdrop planets)

**Fix Path C — wrong texture binding:**
- Change `color={texture}` to `map={texture}` 
- OR change loader pattern

**Fix Path D — color prop destroys texture:**
- Add `color="#ffffff"` or remove non-white color prop

**Fix Path E — voidexa-sun separate component, not wired:**
- Wire voidexa.png into Sun.tsx (or wherever sun renders)

**Fix Path F — file path mismatch:**
- Update nodes.ts paths to match actual file locations

**Fix Path G — combination of above (most likely)**

**Do NOT proceed to Task 1 without Jix's explicit "go with Path X" message.**

---

## TASK 1 — APPLY LOCKED FIX (placeholder until Checkpoint 1)

Will be filled in based on Checkpoint 1 lock decision.

**Constraints:**
- Minimal change — only what's needed for fix
- NO new components
- NO new tests beyond fix-specific assertion
- NO touching of any out-of-scope file

---

## TASK 2 — PIXEL-SAMPLE DIAGNOSTIC TEST

**Lesson #63 enforcement:** Visual screenshot is insufficient evidence.

Add test: `tests/afs-10-fix-pixel-sample.test.ts`

Pseudocode:
```ts
// Render NodeMesh with voidexa.png in headless r3f canvas
// Sample pixel at center of sphere
// Assert: pixel color is NOT solid yellow (#facc15 or similar)
//         AND has channel variance > 30 (textures have variation, flat colors don't)
```

If pixel test infrastructure doesn't exist in voidexa, document gap and ship without it (but flag as risk for next sprint).

---

## TASK 3 — LIVE VERIFY (mandatory)

After commit + push + 90s Vercel deploy:

1. Open `https://voidexa.com/starmap/voidexa` in incognito
2. Hard-refresh (Ctrl+Shift+R)
3. Visual check:
   - voidexa-sun shows electric plasma + HUD ring (matches voidexa.png) — NOT flat yellow
   - Apps shows pink Jupiter banding (matches pink.png) — NOT flat purple circle
   - Earth-themed AI Tools shows blue oceans + green continents (matches earth.png) — NOT flat blue
   - Game Hub shows lava-cracked Mars surface (matches red_rocky.png) — NOT flat red
4. Zoom in on each planet — surface detail visible
5. If ANY planet still flat → STOP, do NOT tag complete, return to Checkpoint 1 with new findings

**Live verify is performed by Jix, not Claude. Claude in Chrome bridge for screenshot evidence.**

---

### 🔴 CHECKPOINT 2 — BEFORE COMMIT

After Task 1 + 2 complete:

1. `npm test` — all green (1377 baseline + new pixel test if added)
2. `npm run build` — succeeds, no TS errors
3. `git diff --stat` — only files explicitly listed in lock decision changed
4. No console warnings/errors in dev mode
5. Working tree shows ONLY fix-related files

**STOP. Output diff summary. Wait for Jix approval before committing.**

---

## GIT WORKFLOW

### Before any code (after Checkpoint 1 approval)

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status                                      # clean
git tag backup/pre-afs-10-fix-YYYYMMDD
git push origin backup/pre-afs-10-fix-YYYYMMDD

# Commit SKILL FIRST
git add docs/skills/SKILL-AFS-10-FIX.md
git commit -m "chore(afs-10-fix): add bugfix SKILL"
git push origin main
```

### Single fix commit (typically only 1-3 file changes)

```bash
git add <files>
git commit -m "fix(afs-10-fix): <root cause description from Path X>"
```

### After Checkpoint 2 approval

```bash
git push origin main
git tag afs-10-fix-complete
git push origin afs-10-fix-complete

git status                                      # clean
git log origin/main --oneline -5                # confirm on remote
sleep 90                                         # Vercel deploy
```

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST (before any code)
- [ ] Backup tag pushed before starting
- [ ] Task 0 diagnose complete + Jix approved fix path at Checkpoint 1
- [ ] Task 1 fix applied per locked path (no scope creep)
- [ ] Task 2 pixel-sample test added (or risk documented if infra missing)
- [ ] Tests green
- [ ] `npm run build` succeeds
- [ ] No TS errors
- [ ] Committed + tagged `afs-10-fix-complete` + pushed
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -5` shows on remote
- [ ] Wait ≥90s for Vercel
- [ ] **Jix-performed live verify on /starmap/voidexa:**
  - [ ] voidexa-sun shows voidexa.png plasma surface (NOT flat yellow)
  - [ ] Apps shows pink.png Jupiter bands
  - [ ] AI Tools shows earth.png blue/green
  - [ ] Game Hub shows red_rocky.png lava surface
  - [ ] Quantum shows saturen_like_rings.png Saturn surface (in addition to existing rings)
  - [ ] Trading Hub shows icy_blue.png ice planet
  - [ ] Services shows lilla.png purple moon
  - [ ] Contact shows purpel-pink.png Jupiter style
  - [ ] Space Station shows spacestation_planet.png with metallic ring station
  - [ ] Claim Your Planet shows pastel_green.png turquoise atmosphere
- [ ] If ANY planet still flat → DO NOT tag complete, restart from Checkpoint 1

---

## RISKS

1. **Diagnose reveals multiple root causes** — fix path needs to combine. Lock all paths at Checkpoint 1, do not split into multiple sprints.

2. **Pixel test infra missing** — voidexa may not have headless r3f canvas test setup. Document gap, ship with visual verify only, flag for AFS-FUTURE sprint.

3. **voidexa-sun separate component** — likely scenario. May require separate fix path from satellite planets. Both must be locked at Checkpoint 1.

4. **Quantum's rings render but planet doesn't** — suggests rings use one material, sphere uses another. Diagnose 0.7 must clarify.

5. **AFS-6g `fog={false}` lesson** — high probability this is the root cause given history. But do NOT assume — verify in 0.5 first.

6. **Vercel cache** — texture path changes may require cache bust. After push, hard-refresh in incognito ALWAYS.

---

## SCOPE LOCK REMINDER

**This sprint fixes texture rendering ONLY.**

Forbidden during this sprint:
- ❌ Changing sphere radius
- ❌ Changing camera FOV / position / OrbitControls
- ❌ Changing skybox / nebula component
- ❌ Adding new planets / nodes
- ❌ Reshaping any other route
- ❌ "While I'm in here, let me also fix..."

If diagnose reveals other bugs → document as separate sprint backlog, do NOT fix in this sprint.

---

## REFERENCES

- AFS-6g lessons (Apr 26): 13_CORRECTIONS #63-#69
- AFS-6h v1 rollback (Apr 27): 16_AUDIT_ROADMAP_DELTA_APR26_SLUT13
- AFS-10 sprint: docs/skills/SKILL-AFS-10.md
- AFS-10 pre-flight (Apr 29): texture files confirmed at public/textures/planets/

---

# END SKILL — AFS-10-FIX TEXTURE WIRING BUG FIX
