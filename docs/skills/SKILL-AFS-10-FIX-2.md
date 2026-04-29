# AFS-10-FIX-2 — Equirectangular Planet Textures + Saturn Rings + Space Station Ring

**Sprint type:** Bug-fix sprint on AFS-10-FIX
**Priority:** P1
**Depends on:** AFS-10-FIX (commit 409a006) — texture wiring is in place, this sprint replaces the source PNGs and adds 3D ring geometry
**Parallel-safe with:** Nothing — single-focus sprint

---

## ROOT PROBLEM

After AFS-10-FIX shipped (textures wired via meshBasicMaterial + Suspense), live verification revealed:

1. **Square (1:1) PNGs UV-map incorrectly on sphere geometry** — front-side shows texture but sides/back appear stretched, transparent, or flat. Cause: Three.js sphereGeometry expects **equirectangular (2:1)** texture maps for proper sphere wrapping.

2. **No Saturn rings on Quantum planet** — the saturen_like_rings.png shows planet surface only; rings must be separate 3D geometry.

3. **No orbital ring station on Space Station planet** — spacestation_planet.png shows planet surface only; the metallic ring + station modules visible in reference image must be separate 3D geometry.

---

## SCOPE (LOCKED — DO NOT EXPAND)

1. Move + rename 12 new equirectangular textures from user's Downloads folder to `public/textures/planets/` (overwrite existing 1:1 versions)
2. Verify Three.js loads the new equirectangular textures correctly (no code change needed if AFS-10-FIX wiring is intact)
3. Add Saturn rings to Quantum planet (3D `<torusGeometry>` or `<ringGeometry>` rotated to horizontal plane)
4. Add orbital ring + station modules to Space Station planet (existing torus stays + add visible metallic ring detail — OR keep current HTML thumbnail and skip)
5. Live verify on voidexa.com that all planets now render fully spherical from all camera angles

**OUT OF SCOPE — DO NOT TOUCH:**
- nodes.ts texture path strings (filenames stay the same after rename — voidexa.png, lilla.png etc.)
- StarNode interface
- NodeMesh material type (keep meshBasicMaterial from AFS-10-FIX)
- Sphere radius / camera FOV / OrbitControls / camera position
- NebulaBg.tsx
- Any other route
- Any out-of-scope file
- Atmosphere shells / pointLight / emissive logic on NON-textured elements

**If scope creep is detected — STOP and ask Jix.**

---

## TASK 0 — PRE-FLIGHT (NO CODE)

### 0.1 Repo state

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -5
```

**Confirm:** HEAD = `409a006` (AFS-10-FIX). Working tree clean.

**STOP if:** any other commit at HEAD, or working tree dirty.

### 0.2 Verify source folder contents

```bash
ls "C:\Users\Jixwu\Downloads\overførelser ny mappe\nye planets"
```

**Expected 12 files (with "2" suffix):**
```
voidexa2.png
earth2.png
icy_blue2.png
lilla2.png
orange2.png
pastel_green2.png
pink2.png
purpel-pink2.png
red_rocky2.png
saturen_like_rings2.png
spacestation_planet2.png
golden_elecktrick_gold_all_fasing_voidexa2.png
```

**Report:** All 12 present? Any missing? Sizes (should be 1-3 MB each)?

**STOP if:** Any file missing. Ask Jix to check folder.

### 0.3 Verify destination folder

```bash
ls public/textures/planets/
```

**Expected:** 12 existing PNGs that will be overwritten.

**STOP if:** Folder doesn't exist or has unexpected contents.

### 0.4 Inspect current NodeMesh.tsx (read-only)

```bash
grep -n "useLoader\|TextureLoader\|texture" components/starmap/NodeMesh.tsx
```

**Confirm:** AFS-10-FIX wiring is intact (useLoader + TextureLoader + map prop). If wiring is broken or missing, STOP and report — texture replacement won't help.

### 0.5 Check Quantum and Space Station nodes for ring-relevant data

```bash
grep -A 2 "id: 'quantum'\|id: 'station'" components/starmap/nodes.ts
```

**Report:** Current node config for both. Confirm Quantum is sphere geometry (gas planetType) and Station is current box + HTML thumbnail.

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After 0.1-0.5, output:

```
PRE-FLIGHT REPORT — AFS-10-FIX-2

0.1 Repo state: HEAD [hash], clean/dirty
0.2 Source folder: [12/12 files present, sizes]
0.3 Destination folder: [12 existing files to overwrite]
0.4 NodeMesh wiring: [intact/broken]
0.5 Quantum node: [config]
    Station node: [config]
```

**WAIT FOR JIX APPROVAL.** Do NOT proceed to Task 1.

---

## TASK 1 — MOVE + RENAME 12 TEXTURE FILES

PowerShell-style copy + rename in single batch operation. Drop "2" suffix when copying.

**Mapping table (source → destination):**

| Source filename | Destination filename |
|---|---|
| `voidexa2.png` | `voidexa.png` |
| `earth2.png` | `earth.png` |
| `icy_blue2.png` | `icy_blue.png` |
| `lilla2.png` | `lilla.png` |
| `orange2.png` | `orange.png` |
| `pastel_green2.png` | `pastel_green.png` |
| `pink2.png` | `pink.png` |
| `purpel-pink2.png` | `purpel-pink.png` |
| `red_rocky2.png` | `red_rocky.png` |
| `saturen_like_rings2.png` | `saturen_like_rings.png` |
| `spacestation_planet2.png` | `spacestation_planet.png` |
| `golden_elecktrick_gold_all_fasing_voidexa2.png` | `goldenblue.png` |

**Bash (Git Bash on Windows):**

```bash
SRC="/c/Users/Jixwu/Downloads/overførelser ny mappe/nye planets"
DST="public/textures/planets"

cp "$SRC/voidexa2.png" "$DST/voidexa.png"
cp "$SRC/earth2.png" "$DST/earth.png"
cp "$SRC/icy_blue2.png" "$DST/icy_blue.png"
cp "$SRC/lilla2.png" "$DST/lilla.png"
cp "$SRC/orange2.png" "$DST/orange.png"
cp "$SRC/pastel_green2.png" "$DST/pastel_green.png"
cp "$SRC/pink2.png" "$DST/pink.png"
cp "$SRC/purpel-pink2.png" "$DST/purpel-pink.png"
cp "$SRC/red_rocky2.png" "$DST/red_rocky.png"
cp "$SRC/saturen_like_rings2.png" "$DST/saturen_like_rings.png"
cp "$SRC/spacestation_planet2.png" "$DST/spacestation_planet.png"
cp "$SRC/golden_elecktrick_gold_all_fasing_voidexa2.png" "$DST/goldenblue.png"
```

**Verify after copy:**

```bash
ls -la public/textures/planets/
file public/textures/planets/voidexa.png
identify public/textures/planets/voidexa.png  # if ImageMagick available — should report 2:1 dimensions like 2048x1024
```

**Each file should be:**
- 1-3 MB (substantially larger than nothing — confirms not corrupted)
- 2:1 aspect ratio (e.g. 2048×1024)
- PNG format

---

### 🔴 CHECKPOINT 2 — TEXTURE FILES IN PLACE

Output:

```
FILE COPY REPORT
- 12/12 files copied successfully
- All renamed (no "2" suffix)
- Sizes: [list each size]
- Aspect ratios: [if checkable, confirm 2:1]
```

**WAIT FOR JIX APPROVAL.** Do NOT proceed to Task 2.

---

## TASK 2 — SATURN RINGS ON QUANTUM PLANET

In `components/starmap/NodeMesh.tsx`, find the conditional rendering for textured planets. Add Saturn-style rings as additional geometry when `node.id === 'quantum'`.

**Implementation:**

```jsx
{node.id === 'quantum' && (
  <mesh rotation={[Math.PI / 2.2, 0, 0.15]}>
    <ringGeometry args={[size * 1.6, size * 2.4, 64]} />
    <meshBasicMaterial 
      color="#d4b88a" 
      side={THREE.DoubleSide} 
      transparent 
      opacity={0.75}
      depthWrite={false}
    />
  </mesh>
)}
```

**Specs:**
- Inner radius: 1.6× planet radius
- Outer radius: 2.4× planet radius
- Tilted ~80° (matches Saturn's actual tilt)
- Slight z-axis rotation for visual interest
- Tan/beige color (matches saturen_like_rings.png surface tone)
- Double-sided so visible from both above/below
- Slight transparency
- depthWrite false to prevent z-fighting with planet sphere

**Test:** +2 assertions
- Quantum node renders ringGeometry
- Ring inner/outer radii are 1.6 and 2.4 × node size

---

## TASK 3 — SPACE STATION ORBITAL RING (DECISION NEEDED AT CHECKPOINT 2)

**Two options — Jix locks at Checkpoint 2:**

**Option A — Replace HTML thumbnail with full 3D station**
- Use textured sphere (spacestation_planet.png) like other planets
- Add metallic torus ring around it (matching reference image)
- Add 4-6 small box "modules" at intervals on the ring
- Remove existing HTML <img> overlay
- More 3D-consistent with rest of scene

**Option B — Keep HTML thumbnail, do nothing**
- Skip station entirely (per AFS-10-FIX lock decision)
- Less visual change, keeps current behavior

**Default recommendation:** Option A. The new spacestation_planet.png texture is photorealistic and equirectangular — it deserves to be on a sphere, not hidden behind an HTML thumbnail.

**Implementation if Option A:**

```jsx
// Replace boxGeometry + Html block with:
<>
  <mesh ref={meshRef}>
    <sphereGeometry args={[size, 48, 48]} />
    <Suspense fallback={<meshBasicMaterial color={color} />}>
      <TexturedSphereMaterial path={node.texture} />
    </Suspense>
  </mesh>
  
  {/* Orbital metallic ring */}
  <mesh rotation={[Math.PI / 2, 0, 0]}>
    <torusGeometry args={[size * 1.8, size * 0.08, 16, 64]} />
    <meshBasicMaterial color="#88aabb" />
  </mesh>
  
  {/* 4 station modules around the ring */}
  {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
    <mesh
      key={i}
      position={[
        Math.cos(angle) * size * 1.8,
        0,
        Math.sin(angle) * size * 1.8,
      ]}
    >
      <boxGeometry args={[size * 0.2, size * 0.15, size * 0.2]} />
      <meshBasicMaterial color="#aaccdd" />
    </mesh>
  ))}
</>
```

**Test:** +3 assertions
- Station renders sphereGeometry (not boxGeometry)
- Orbital torus present
- 4 module boxes positioned around ring

---

## TASK 4 — TESTS

Add to `tests/afs-10-fix-2-rings.test.ts`:

```ts
describe('AFS-10-FIX-2 — Quantum rings + Station orbital', () => {
  test('Quantum node has ringGeometry', () => { /* ... */ });
  test('Station node has torusGeometry orbital ring', () => { /* ... */ });
  test('Station has 4 module boxes positioned on ring', () => { /* ... */ });
  // ...
});
```

**Cumulative target:** 1377 (baseline) + 5-6 new = ~1382-1383.

---

## TASK 5 — LIVE VERIFY

After commit + push + 90s Vercel deploy:

1. Open `https://voidexa.com/starmap/voidexa` in incognito
2. Hard-refresh (Ctrl+Shift+R) — IMPORTANT: textures cached, must bypass
3. **Visual verify (Jix-performed):**
   - Each planet shows its full equirectangular texture wrapping smoothly around the sphere
   - Rotate camera (drag) — planets look textured from ALL angles, not just front
   - voidexa-sun shows electric plasma surface (matches voidexa.png)
   - Quantum has visible Saturn-style rings tilted ~80°
   - Space Station shows blue planet + metallic orbital ring + 4 station modules (if Option A) or HTML thumbnail (if Option B)
   - No transparent/missing back-sides on any planet
   - All textures look "wrapped" not "stretched"

If ANY planet still has visible stretching or missing back-side → STOP, report specifics, do not tag complete.

---

### 🔴 CHECKPOINT 3 — BEFORE COMMIT

After all tasks complete:

1. `npm test` — green (1382-1383 passing)
2. `npm run build` — succeeds, no TS errors
3. `git diff --stat` — only NodeMesh.tsx + 12 PNG files + 1 test file changed
4. No console warnings/errors in dev mode
5. Working tree shows ONLY in-scope files

**STOP. Output diff summary. Wait for Jix approval before committing.**

---

## GIT WORKFLOW

### Before any code (after Checkpoint 1 approval)

```bash
git tag backup/pre-afs-10-fix-2-20260429
git push origin backup/pre-afs-10-fix-2-20260429

git add docs/skills/SKILL-AFS-10-FIX-2.md
git commit -m "chore(afs-10-fix-2): add texture replacement + rings SKILL"
git push origin main
```

### File copy commit (after Checkpoint 2)

```bash
git add public/textures/planets/
git commit -m "feat(afs-10-fix-2): replace 12 planet PNGs with equirectangular versions"
```

### Code commit (after Tasks 2-4)

```bash
git add components/starmap/NodeMesh.tsx tests/afs-10-fix-2-rings.test.ts
git commit -m "feat(afs-10-fix-2): add Saturn rings + Space Station orbital ring 3D geometry"
```

### After Checkpoint 3 approval

```bash
git push origin main
git tag afs-10-fix-2-complete
git push origin afs-10-fix-2-complete

git status
git log origin/main --oneline -5
sleep 90
```

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST
- [ ] Backup tag pushed
- [ ] 12 source files verified at Checkpoint 1
- [ ] 12 files copied + renamed at Checkpoint 2 (Jix approved)
- [ ] Saturn rings on Quantum sphere (tilted, double-sided, tan color)
- [ ] Space Station decision locked at Checkpoint 2 (Option A or B)
- [ ] If Option A: orbital ring + 4 modules visible on Space Station
- [ ] Tests green: 1382-1383 passing
- [ ] `npm run build` succeeds
- [ ] No TS errors
- [ ] No new console warnings
- [ ] Committed + tagged `afs-10-fix-2-complete` + pushed
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -5` shows on remote
- [ ] Wait ≥90s for Vercel
- [ ] **Jix-performed live verify on /starmap/voidexa:**
  - [ ] All planets fully spherical, no transparent back-sides
  - [ ] Textures wrap smoothly when camera rotates
  - [ ] Quantum has Saturn rings
  - [ ] Space Station per locked Option (A or B)
- [ ] If verify fails → DO NOT tag complete, restart from Checkpoint 1 with new findings

---

## RISKS

1. **Source folder path with æ/ø/special chars** — `overførelser ny mappe` contains æ. Bash on Windows should handle UTF-8, but if cp fails, fall back to PowerShell `Copy-Item` or use ASCII-safe path.

2. **PNG file dimensions might not be exactly 2:1** — if textures are 2048×1000 (close but not exact), Three.js will still wrap but with slight distortion. Document any non-2:1 files in Checkpoint 2 report.

3. **Vercel cache** — old textures cached at CDN edge. Hard-refresh in incognito after deploy is mandatory. If still showing old textures after hard-refresh, may need to wait 5 min for full CDN invalidation.

4. **Saturn ring z-fighting** — if ring intersects sphere visually, increase ring inner radius (1.6 → 1.7) or add `polygonOffset`.

5. **Space Station Option A breaks if HTML <Html> import is removed but still referenced elsewhere** — check imports carefully.

6. **goldenblue.png renaming** — source is `golden_elecktrick_gold_all_fasing_voidexa2.png`. Long name. Confirm file actually exists before copy attempt.

---

## SCOPE LOCK REMINDER

**Forbidden during this sprint:**
- ❌ Changing sphere radius
- ❌ Changing camera FOV / position / OrbitControls
- ❌ Changing skybox / nebula component
- ❌ Adding new planets / nodes
- ❌ Reshaping any other route
- ❌ "While I'm in here, let me also fix..."
- ❌ Changing meshBasicMaterial → other material type
- ❌ Touching Suspense fallback logic
- ❌ Touching nodes.ts texture path strings (filenames are unchanged)

If diagnose reveals other bugs → document for next sprint backlog, do NOT fix in this sprint.

---

## REFERENCES

- AFS-10-FIX (Apr 29): commit `409a006` — texture wiring complete
- AFS-10 (Apr 29): commit `82bafba` — original starmap rebuild
- AFS-6g lessons (Apr 26): 13_CORRECTIONS #63-#69
- Equirectangular projection: 2:1 aspect ratio required for proper sphere UV mapping in Three.js

---

# END SKILL — AFS-10-FIX-2 EQUIRECTANGULAR TEXTURES + RINGS
