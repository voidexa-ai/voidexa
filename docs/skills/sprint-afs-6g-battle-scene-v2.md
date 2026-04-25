# Sprint AFS-6g — Battle Scene v2 + Universal Skybox + CSS Hotfix + Security Sweep

**Sprint number:** AFS-6g  
**Author:** Claude (this chat)  
**Date created:** 2026-04-25 (SLUT 12)  
**Status:** READY — pending Jix approval to start  
**Priority:** P0 (visual polish for cards game) + P1 (security CVEs)  
**Estimated:** 1-2 sessions  
**Depends on:** AFS-6d ✅ (battle scene exists, needs upgrade)  
**Parallel-safe with:** AFS-22, AFS-23, manual SSD/USB work  

---

## SCOPE

**Single sprint, 5 logical sections, 11 tasks, one tag.**

This sprint:
1. **Closes 1 critical + 6 high security CVEs** on voidexa repo (AFS-24b folded in)
2. **Hotfixes CSS layout bug** on `/game/battle` (footer overlapping battle viewport)
3. **Builds Universal Skybox component** (cross-app — replaces twinkling stars on battle, freeflight, starmap)
4. **Reworks battle scene camera** (WoW-style scroll zoom, over-the-shoulder perspective)
5. **Mines existing 3D ship assets** from local `voidexa-3d-assets/` archive (no FLUX/Vast.ai needed)

**Sprint does NOT cover:**
- Ship combat reaction animations (skud, shield flash, hit reactions) — separate sprint
- 6-subsystem health UI (Hull/Shield/Reactor/Weapons/Engines/Life Support) — needs Alpha engine extension (AFS-18)
- Heat meter, Pilot select — needs Alpha engine extension (AFS-18)
- Card-to-effect wiring beyond what's already there
- PvP netcode — separate sprint (TBD)

---

## WHY THIS SPRINT

Live audit Apr 25 (this chat) revealed:
- **2 ships already render** in 3D scene at `/game/battle` — player and enemy face-to-face
- BUT: enemy ship is at top of viewport, player ship hidden under cards
- Camera is fixed/static, no zoom, no perspective control
- Background is procedural twinkling stars (Three.js Points particle system) — visually amateur
- `<main>` element is collapsed to 72px on `/game/battle` route, causing footer to render OVER battle viewport (visible in screenshot)
- 1 critical + 6 high CVEs unaddressed

User's vision (Raid Shadow Legends-style ship card battler):
- Over-the-shoulder camera with scroll-zoom (like WoW)
- Static/fixed skybox baggrund (ikke skarende stjerner)
- Bigger battle field with cards in front, ships farther back
- Eventually: ships react to cards (separate sprint)

Existing infrastructure to build on (DO NOT rebuild):
- `components/combat/` — 11 files, 2319 lines (CombatUI, CardHand, BattleLog, HealthBars, TurnIndicator, EnergyDisplay, EndScreen, CardComponent)
- `lib/game/battle/` — 1165 lines (engine.ts, bosses.ts, encounters.ts, ai.ts, types.ts)
- `/game/battle` route exists and works (5 PvE bosses)
- Three.js R128 already integrated

3D assets already on E:\Archives\voidexa-3d-assets:
- `usc_astroeagle01.glb` (uncompressed, ready to drop in)
- 25+ ship asset zips (lowpoly, hi-rez, sci-fi cockpits, Star Trek refit, Ultimate Spaceships May 2021)
- `cockpit-immersive-hud.zip`, `ghai-merge-and-cockpit-fix.zip`

---

## PRE-FLIGHT (TASK 0 — MANDATORY VERIFY-FIRST)

**Per SLUT 8 lesson: do NOT trust INDEX summaries. Grep actual repo before any code change.**

```bash
# Verify current battle scene structure
cd C:\Users\Jixwu\Desktop\voidexa
grep -rn "BattleScene\|CombatUI\|BattleView" components/ --include="*.tsx" | head -20

# Find Three.js scene initialization in battle
grep -rn "new THREE\|<Canvas\|@react-three\|useThree" components/combat/ --include="*.tsx"

# Check if Universal Skybox already exists (might have been built earlier)
find components/three -type f -iname "*skybox*" 2>/dev/null
find components/three -type f -iname "*background*" 2>/dev/null
grep -rn "SpaceSkybox\|StarField\|StarBackground" components/ --include="*.tsx" | head -10

# Check current camera implementation
grep -rn "PerspectiveCamera\|OrbitControls\|camera.position" components/combat/ --include="*.tsx"

# Find current "stars" twinkling implementation
grep -rn "Points\|BufferGeometry.*star\|twinkle" components/ --include="*.tsx" | head -10

# Check freeflight + starmap to know what we're replacing skybox in
ls components/freeflight/
ls components/starmap/
grep -rn "Points\|Stars" components/freeflight/ components/starmap/ --include="*.tsx" | head -10

# Find /game/battle route file (CSS layout bug source)
cat app/game/battle/page.tsx 2>/dev/null || cat app/game/card-battle/page.tsx 2>/dev/null
ls app/game/battle/ app/game/card-battle/ 2>/dev/null

# Check public/models/ structure (where to drop new ship .glb)
ls public/models/ 2>/dev/null
ls public/skybox/ 2>/dev/null

# Test count baseline
npm test 2>&1 | tail -5

# Security CVE list (AFS-24b)
npm audit --json | jq '.metadata.vulnerabilities' 2>/dev/null || npm audit
```

**Expected output to confirm before proceeding:**

1. Battle scene file location (likely `components/combat/CombatUI.tsx` or sub-component with Canvas)
2. SpaceSkybox does NOT exist yet (if it does → use existing, don't rebuild)
3. Current camera setup type (fixed, OrbitControls, custom)
4. Test baseline = 1087 (post AFS-6d)
5. Number of CVEs by severity

**STOP. Report findings to Jix. Await approval before Task 1.**

If pre-flight reveals scope is wrong (e.g. skybox already exists, or battle scene uses different file paths) → STOP, rewrite SKILL, re-commit. Don't execute SKILL known to duplicate working code.

---

## SECTION A — SECURITY SWEEP (Tasks 1-2)

### TASK 1: Address 1 critical CVE

```bash
cd C:\Users\Jixwu\Desktop\voidexa

# Identify critical CVE
npm audit --json | jq '.vulnerabilities | to_entries[] | select(.value.severity == "critical")'

# Try automated fix first
npm audit fix --force=false

# If automated fix not available, manual update:
# npm install <package>@latest
# Verify breaking changes via package CHANGELOG before pushing

npm test
npm run build
```

**Commit pattern (per package):**
```bash
git add package.json package-lock.json
git commit -m "chore(security): bump <package> to fix CVE-XXXX-YYYY (critical)"
```

**Stop if:** Build fails, tests fail, or breaking changes detected. Document and skip.

### TASK 2: Address 6 high CVEs (batched)

```bash
# List high severity
npm audit --json | jq '.vulnerabilities | to_entries[] | select(.value.severity == "high")'

# Batch by package family if possible (e.g. all eslint-* together)
npm audit fix --force=false --audit-level=high

npm test
npm run build
```

**DoD for Section A:**
- [ ] Critical CVE resolved or documented as not-fixable (with reason)
- [ ] All 6 high CVEs resolved or documented
- [ ] 8 moderate CVEs deferred (next sprint)
- [ ] Tests still 1087+ green
- [ ] Build clean
- [ ] One commit per CVE or batch

---

## SECTION B — CSS HOTFIX (Task 3)

### TASK 3: Fix `<main>` collapse + footer overlap on `/game/battle`

**Problem (verified live Apr 25):**
- `<main>` height = 72px (collapsed)
- Footer renders at y=72px (immediately below)
- Battle scene canvas is `position: absolute inset-0` with collapsed parent
- Result: footer ("Operating globally...") visible OVER battle scene

**Fix approach:**

```bash
# Find the battle page layout
cat app/game/battle/page.tsx
# Check if it uses default layout (with footer) or has its own
cat app/game/battle/layout.tsx 2>/dev/null
cat app/game/layout.tsx 2>/dev/null
cat app/layout.tsx | head -40
```

**Likely fix:** Battle page should use a fullscreen layout WITHOUT footer, OR the battle component should set parent height correctly.

**Two paths:**

**Option A (recommended):** Add `app/game/battle/layout.tsx` that wraps children in a fullscreen container without footer:
```tsx
// app/game/battle/layout.tsx
export default function BattleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      {children}
    </div>
  );
}
```

**Option B:** Set explicit height on `<main>` in battle page:
```tsx
// app/game/battle/page.tsx
<main className="relative w-screen h-screen overflow-hidden">
  ...
</main>
```

**Pre-flight grep determines which option fits the existing layout system.**

**DoD for Section B:**
- [ ] `/game/battle` route renders battle scene fullscreen
- [ ] Footer no longer overlaps battle viewport
- [ ] Other game routes (`/game`, `/game/deck-builder`) still show footer correctly
- [ ] No regressions on `/game/card-battle` lobby

---

## SECTION C — UNIVERSAL SKYBOX COMPONENT (Tasks 4-5)

### TASK 4: Mine 3D assets from local archive

**Source:** `E:\Archives\voidexa-3d-assets\` (verified Apr 25)

**Steps:**

1. Open `E:\Archives\voidexa-3d-assets\` in File Explorer
2. Copy `usc_astroeagle01.glb` to `C:\Users\Jixwu\Desktop\voidexa\public\models\ships\enemy_default.glb`
3. Inspect zip files for additional ships if needed:
   - `lowpoly_spaceships.zip` — extract to temp, pick 1-2 candidates for player/enemy
   - `Ultimate Spaceships - May 2021-*.zip` — extract, pick variants
4. For SKYBOX texture (Task 5), need separate equirectangular HDRI:
   - Download from Polyhaven.com (free CC0): "deep_space_01" or similar
   - OR use existing 3D asset pack background if any has equirectangular skybox
   - Save to `public/skybox/deep_space_01.jpg` (or .hdr if format supported)

**Decision needed from Jix:**
- Are these 3D asset packs LICENSED for commercial use? Some "Ultimate Spaceships" packs require attribution or paid license.
- Polyhaven HDRI is CC0 (no attribution needed) — safe default.

**DoD for Task 4:**
- [ ] At least 1 ship `.glb` model copied to `public/models/ships/`
- [ ] At least 1 skybox texture copied to `public/skybox/`
- [ ] License status documented per asset (CC0, CC-BY, paid, unknown)
- [ ] Files added to git LFS if >10MB (per repo size policy)

### TASK 5: Build Universal SpaceSkybox component

**File:** `components/three/SpaceSkybox.tsx`

```tsx
'use client';

import { useLoader } from '@react-three/fiber';
import { TextureLoader, BackSide, SphereGeometry, MeshBasicMaterial } from 'three';
import { useMemo } from 'react';

interface SpaceSkyboxProps {
  /** Path to equirectangular texture in /public */
  texture?: string;
  /** Sphere radius — 1000+ recommended for backdrop */
  radius?: number;
  /** Whether skybox rotates with camera (true for backdrop, false for first-person) */
  rotateWithCamera?: boolean;
  /** Texture intensity 0-1 */
  intensity?: number;
}

const DEFAULT_TEXTURE = '/skybox/deep_space_01.jpg';

export function SpaceSkybox({
  texture = DEFAULT_TEXTURE,
  radius = 1000,
  rotateWithCamera = false,
  intensity = 1,
}: SpaceSkyboxProps) {
  const tex = useLoader(TextureLoader, texture);
  
  // Memoize geometry/material for performance
  const geometry = useMemo(() => new SphereGeometry(radius, 60, 40), [radius]);
  const material = useMemo(
    () => new MeshBasicMaterial({
      map: tex,
      side: BackSide,
      depthWrite: false,
      opacity: intensity,
      transparent: intensity < 1,
    }),
    [tex, intensity]
  );

  return (
    <mesh geometry={geometry} material={material} renderOrder={-1} />
  );
}
```

**Tests:** `tests/afs-6g-skybox.test.ts`
- Component exists and exports `SpaceSkybox`
- Default texture path constant
- Props interface accepts all 4 props
- Default radius = 1000, default intensity = 1
- ~5 invariants

**DoD for Section C:**
- [ ] `components/three/SpaceSkybox.tsx` exists, ~50 lines
- [ ] Test file with 5+ assertions
- [ ] Used in battle scene (Task 6) — verifiable via grep

---

## SECTION D — BATTLE SCENE CAMERA REWORK (Tasks 6-8)

### TASK 6: Replace battle scene background with SpaceSkybox

**File to modify:** Identified in pre-flight grep (likely `components/combat/CombatUI.tsx` or its child)

**Replace existing twinkling stars with:**
```tsx
import { SpaceSkybox } from '@/components/three/SpaceSkybox';

// Inside Three.js Canvas:
<SpaceSkybox texture="/skybox/deep_space_01.jpg" radius={1500} />
// Remove old <Points>/<Stars> particle system
```

### TASK 7: Implement WoW-style camera

**File to modify:** Same battle scene component

**Camera setup:**
```tsx
import { OrbitControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

// Camera config:
const CAMERA_DEFAULT_DISTANCE = 8;  // units from player ship
const CAMERA_MIN_ZOOM = 4;          // closest zoom
const CAMERA_MAX_ZOOM = 15;         // farthest zoom
const CAMERA_HEIGHT_ANGLE = 0.5;    // ~30° downward
const PLAYER_SHIP_POSITION = [0, -2, 5];   // player at bottom-front
const ENEMY_SHIP_POSITION = [0, 0, -8];    // enemy farther back, slightly up

// Camera initial position: behind and slightly above player ship
<PerspectiveCamera
  makeDefault
  fov={55}
  position={[0, 1, 10]}
  near={0.1}
  far={5000}
/>

<OrbitControls
  enableZoom={true}
  enablePan={false}              // no panning, only rotate + zoom
  enableRotate={true}            // right-click drag = orbit
  minDistance={CAMERA_MIN_ZOOM}
  maxDistance={CAMERA_MAX_ZOOM}
  maxPolarAngle={Math.PI / 2.2}  // can't go fully overhead
  minPolarAngle={Math.PI / 6}    // can't go below player ship
  target={[0, 0, 0]}             // orbit center between ships
  zoomSpeed={0.6}
  rotateSpeed={0.4}
/>
```

### TASK 8: Reposition ships in scene

**Before (current):**
- Player ship: y-position likely 0 or -1 (low, hidden by cards)
- Enemy ship: y-position likely 2 (top of viewport)
- Distance between: small

**After (target):**
- Player ship at [0, -2, 5] — visible above cards in foreground
- Enemy ship at [0, 0, -8] — smaller, in background
- Total z-distance: 13 units (gives perspective depth)

**Verify ship models load correctly:**
```tsx
import { useGLTF } from '@react-three/drei';

// Player ship
const { scene: playerScene } = useGLTF('/models/ships/player_default.glb');
// Enemy ship
const { scene: enemyScene } = useGLTF('/models/ships/enemy_default.glb');

// Render with rotation so ships face each other
<primitive object={playerScene} position={[0, -2, 5]} rotation={[0, Math.PI, 0]} scale={1} />
<primitive object={enemyScene} position={[0, 0, -8]} rotation={[0, 0, 0]} scale={0.7} />
```

**DoD for Section D:**
- [ ] Battle scene uses SpaceSkybox instead of twinkling stars
- [ ] Mouse scroll wheel zooms in/out (4-15 unit range)
- [ ] Right-click drag orbits camera around battlefield
- [ ] Player ship visible foreground, enemy visible background
- [ ] No FPS drops compared to baseline (record FPS before/after)
- [ ] Ship models load without errors

---

## SECTION E — CROSS-APP SKYBOX REPLACEMENT (Tasks 9-10)

### TASK 9: Replace twinkling stars in Free Flight

**Note:** Free Flight has BUG-04 memory leak (frozen, can't audit live). Apply skybox carefully without re-introducing leak patterns.

```bash
# Find current free flight stars
grep -rn "Stars\|Points.*star\|StarField" components/freeflight/

# Replace with rotating skybox (player rotates through space)
# In free flight, skybox should rotate WITH camera (rotateWithCamera={true})
```

**Use different texture** to differentiate from battle:
- `/skybox/free_flight_nebula.jpg` (separate file, can be same image initially if only 1 HDRI available)

### TASK 10: Replace stars in Star Map

```bash
grep -rn "Stars\|Points" components/starmap/
```

Star Map has its own visual style — may already use a different background. **Verify before changing.** If existing implementation works, skip this sub-task and document.

**DoD for Section E:**
- [ ] Battle scene uses SpaceSkybox (verified live)
- [ ] Free Flight uses SpaceSkybox if previously had twinkle stars (verified — but DON'T enter freeflight live audit due to BUG-04)
- [ ] Star Map skybox status documented (replaced OR explicitly kept as-is with reason)

---

## SECTION F — CLOSEOUT (Task 11)

### TASK 11: Tests + commit + tag + verify + CLAUDE.md

**Test count target:** 1087 + ~15 new = ~1102 total

**New test files:**
- `tests/afs-6g-skybox.test.ts` (5+ assertions)
- `tests/afs-6g-battle-camera.test.ts` (5+ assertions for OrbitControls config, camera bounds)
- `tests/afs-6g-ship-positions.test.ts` (3+ assertions for ship constants)

**Git workflow:**

```bash
# Backup tag BEFORE starting (CRITICAL — every sprint per AFS-46 standard)
cd C:\Users\Jixwu\Desktop\voidexa
git tag backup/pre-afs-6g-20260425
git push origin backup/pre-afs-6g-20260425

# After all tasks complete:
git status                       # should be clean except expected new files
git add -A
git commit -m "feat(afs-6g): battle scene v2 + universal skybox + CSS hotfix + security sweep"
git tag sprint-afs-6g-complete
git push origin main
git push origin sprint-afs-6g-complete

# Post-push verify (per Jix rules):
git status                                    # clean
git log origin/main --oneline -5             # HEAD shown

# Wait for Vercel deploy
sleep 90  # or wait_for_vercel.sh
```

**Live verify (Claude in Chrome bridge with Jix permission):**

1. Navigate to `https://voidexa.com/game/card-battle` (lobby)
2. Click "Fight" to start battle
3. Verify:
   - Footer NOT overlapping battle scene ✅
   - Skybox visible (no twinkling stars) ✅
   - Camera scroll-wheel zoom works ✅
   - Right-click drag rotates view ✅
   - Player ship visible in foreground ✅
   - Enemy ship visible in background ✅

**CLAUDE.md update:**
- Append session entry per SLUT 8 protocol (full replacement file at SLUT)
- Document: what shipped, deviations from SKILL, test count progression, files added/modified

**SLUT delivery (after sprint):**
- Updated CLAUDE.md to Project Knowledge
- INDEX deltas: 04, 08, 11, 13, 15, 16
- README-slut-20260425-12.md
- GROUND_TRUTH_APPENDIX_SLUT12.md

---

## DEFINITION OF DONE (full sprint)

### Code
- [ ] Pre-flight (Task 0) findings documented and approved by Jix
- [ ] Task 1: Critical CVE addressed
- [ ] Task 2: 6 high CVEs addressed
- [ ] Task 3: CSS hotfix applied — footer no longer overlaps battle
- [ ] Task 4: 3D ship assets mined to `public/models/ships/`
- [ ] Task 5: SpaceSkybox component built + tested
- [ ] Task 6: Battle scene uses SpaceSkybox
- [ ] Task 7: WoW-style camera with scroll zoom + orbit
- [ ] Task 8: Ship positions reworked (player foreground, enemy background)
- [ ] Task 9: Free Flight skybox replaced (or status documented)
- [ ] Task 10: Star Map skybox replaced (or status documented)

### Quality
- [ ] Tests 1087 → ~1102 green
- [ ] Build succeeds (`npm run build` clean)
- [ ] No new console errors in battle scene
- [ ] FPS measured and not degraded vs baseline

### Git
- [ ] SKILL committed FIRST (before any code)
- [ ] Backup tag pushed: `backup/pre-afs-6g-20260425`
- [ ] Sprint tag pushed: `sprint-afs-6g-complete`
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -5` shows commits on remote

### Verification
- [ ] Wait ≥90s for Vercel deploy
- [ ] Hard-refresh incognito live-verify on `/game/battle`
- [ ] Jix manual confirmation: camera + skybox + ship positions match vision

### Documentation (SLUT)
- [ ] Full CLAUDE.md replacement uploaded to Project Knowledge
- [ ] INDEX deltas delivered (04, 08, 11, 13, 15, 16)
- [ ] README-slut-20260425-12.md
- [ ] GROUND_TRUTH appendix
- [ ] All decisions from this chat documented (battle scene scope, trade fee, GHAI rules, parallel sprints, SSD decision)

---

## ROLLBACK PATH

If sprint fails or Jix wants to undo:

```bash
git reset --hard backup/pre-afs-6g-20260425
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-6g-complete

# 3D assets removal
rm -rf public/models/ships/enemy_default.glb
rm -rf public/skybox/deep_space_01.jpg

# Optional: full undo of dependency updates
# (only if CVE updates broke something)
git checkout backup/pre-afs-6g-20260425 -- package.json package-lock.json
npm install
```

---

## RISKS

| Risk | Mitigation |
|---|---|
| 3D asset license unclear (some packs from "Ultimate Spaceships May 2021" require paid license) | Use Polyhaven CC0 HDRI for skybox; `usc_astroeagle01.glb` license verify before commit |
| OrbitControls causes UX regression (some users may not expect orbit controls in card battle) | Provide reset button to default camera position; document in tooltip |
| Battle scene component is heavily intertwined — refactor breaks something | Pre-flight grep MUST identify all consumers before changes |
| BUG-04 memory leak in Free Flight prevents live verify of Task 9 | Skip live verify on freeflight; rely on grep + unit test only |
| Vercel deploy fails on Three.js GLB loading (needs special config) | Verify build locally first with `npm run build`; add `.glb` to webpack config if missing |
| CVE updates introduce breaking changes | Test after each update; revert if breaking; document deferred CVEs |
| `usc_astroeagle01.glb` is corrupt or not a valid model | Verify in Blender or online viewer before committing; have backup ship model from another zip |

---

## CLAUDE CODE EXECUTION

**To start this sprint, run:**

```bash
cd C:\Users\Jixwu\Desktop\voidexa
claude --dangerously-skip-permissions
```

Then in Claude Code chat:
```
Read docs/skills/sprint-afs-6g-battle-scene-v2.md and execute Task 0 (pre-flight). Stop at end of Task 0 with findings report.
```

Wait for findings, approve, then continue with `Execute Task 1` etc.

---

## OUT-OF-SCOPE (DO NOT TOUCH)

- AFS-6e Pack Shop Alpha rewire (separate sprint)
- AFS-13 CommBubble merge (separate sprint)
- AFS-18 Alpha engine extension (Heat, 6-subsystem) (separate sprint)
- AFS-9 Free Flight memory leak (separate sprint, BUG-04)
- AFS-10 Starmap Level 2 repair (separate sprint)
- Card combat reactions (skud, shield flash) (future sprint)
- PvP netcode (future sprint)
- Trading hub (future sprint, depends on AFS-6e)
- Universal Chat (future sprint)
- Replay system (future sprint)

---

# END SKILL.md
