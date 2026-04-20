---
name: sprint-17-completion
description: Complete remaining Sprint 17 work — push nebula to 18000u, fix intro-video autoplay handshake (queueMicrotask + watchdog), retire the "We are live" banner, replace the clustered 2D star-map node ring with 3 concentric Z-depth-staggered orbital rings of textured 3D planets (+ 3 billboards: plasma sun, space station, Saturn-rings shop) around a right-center voidexa plasma sun with realistic per-planet scale variation, add quick-menu-dismissal auto-routing to /starmap/voidexa, wire the voidexa central plasma sun to /home, fix ShipPicker title/badge overlap via 2-line vertical stack, and merge JARVIS + Universe Chat into a single bottom-left bubble with a tabbed panel. Research-only doc; all implementation work happens in a subsequent build sprint.
sprint: 17
priority: P1 (visual match + polish; unblocks public launch audit)
status: pending
estimated_effort: 1 session (8–12 hours)
model: claude-opus-4-7
effort: xhigh
---

## CONTEXT

Sprint 16 landed the BoostTrail GPU fix, USC/USCX/Hi-Rez Supabase upload pipeline, rarity badges, quick menu polish, legend redesign, and starmap HUD declutter (`sprint-16-complete` tag, 800/800 tests green, deployed April 19, 2026). Live audit via Chrome extension on April 20 surfaced eight remaining issues that are all in the "visible surface" category — they block a clean public launch audit but are independent of gameplay systems.

This sprint is the last scheduled visual-polish pass before `mvp-launch-ready-v2`. It does **not** touch the freeflight scene, card combat, hauling, or Supabase schemas. Every task below is UI-layer or asset-layer only.

Sprint 17 preview in `docs/CLAUDE.md` already scopes "Star Map Visual Match — planet textures, station-ring around voidexa sun, nebula backdrop matching quick menu reference image." Tasks 1, 4, 7 and 8 are the star-map rework. Tasks 2 and 3 are the banner removal + intro-video autoplay handshake. Tasks 5 and 6 are ShipPicker + bottom-left bubble merge.

## REQUIRED READING BEFORE STARTING

- `docs/CLAUDE.md` — standards, GHAI policy, file size limits, git discipline
- `docs/VOIDEXA_INTENT_SPEC.md` — canonical product spec
- Current code state of every file below must be read with the `view` tool before editing — **do not guess line numbers, they shift between commits**.

**Files read during research pass (line ranges accurate as of `sprint-16-complete`, commit `93866cc` + local working-tree changes):**

| File | Lines read | Purpose |
|---|---|---|
| `components/starmap/NebulaBg.tsx` | 1–45 (entire file) | nebula radius constant |
| `components/starmap/StarMapCanvas.tsx` | 1–45 (entire file) | camera far plane |
| `components/galaxy/GalaxyCanvas.tsx` | 1–94 (entire file) | camera far plane + focus controller |
| `components/starmap/StarMapScene.tsx` | 1–244 (entire file) | starfield + nodes + orbit controls |
| `components/starmap/NodeMesh.tsx` | 1–80 (top) | atmosphere shells per planet type |
| `components/starmap/nodes.ts` | 1–202 (entire file) | STAR_MAP_NODES array |
| `components/galaxy/CompanyPlanet.tsx` | 1–60 | LOD + mesh patterns to mirror |
| `components/galaxy/GalaxyScene.tsx` | grep only | confirms NebulaBg is shared |
| `app/page.tsx` | 1–161 (entire file) | intro flow state machine |
| `components/home/IntroVideo.tsx` | 1–154 (entire file) | video element + mute control |
| `components/home/AudioGatePopup.tsx` | 1–114 (entire file) | Yes/No audio gate (also Task 7 dismissal) |
| `app/layout.tsx` | 1–77 (entire file) | EarlyAccessBanner + JarvisAssistant + UniverseChat mount |
| `components/layout/EarlyAccessBanner.tsx` | 1–97 (entire file) | "We are live" banner source |
| `components/layout/Navigation.tsx` | 17–97 (nav groups) | About / Contact confirmed to live in nav, not star map |
| `components/freeflight/ships/ShipPicker.tsx` | 1–340 (entire file) | title + badge overflow in list column |
| `components/ui/JarvisAssistant.tsx` | 1–180 (bubble + panel shell) | bottom-left orb at z-[60] |
| `components/chat/UniverseChat.tsx` | 1–80, 230–290 | bottom-left bubble at z-50 collides with Jarvis |
| `app/starmap/voidexa/page.tsx` | 1–123 (entire file) | back-to-galaxy button + company footer |
| `public/textures/planets/` (dir listing) | — | **12 PNGs confirmed on disk** |

**Texture inventory verified on disk (April 20, 2026):**

```
public/textures/planets/
├── voidexa.png              (1024×1024, square)       — central plasma sun, billboard, clicks /home
├── spacestation_planet.png  (1536×1024, aspect 1.5)   — Orbital Space Station, billboard, clicks /space-station
├── saturen_like_rings.png   (1536×1024, aspect 1.5)   — Shop (Coming Soon), billboard, NO route (hover tooltip only)
├── pink.png                 (1024×1024, square)       — Apps, sphere, clicks /apps
├── purpel-pink.png          (1024×1024, square)       — Quantum, sphere, clicks /quantum
├── lilla.png                (1024×1024, square)       — Void Chat, sphere, clicks /void-chat
├── icy_blue.png             (1024×1024, square)       — Quantum Forge, sphere, clicks /quantum-forge
├── orange.png               (1024×1024, square)       — AI Trading, sphere, clicks /ai-trading
├── red_rocky.png            (1024×1024, square)       — Services, sphere, clicks /services
├── earth.png                (1024×1024, square)       — AI Tools, sphere, clicks /ai-tools
├── pastel_green.png         (1024×1024, square)       — Claim Your Planet, sphere, clicks /claim-your-planet
└── goldenblue.png           (1024×1024, square)       — Trading Hub, sphere w/ lookAtSun, clicks /trading-hub
```

Two-hemisphere texture detail for `goldenblue.png` — one side golden (sunlit), opposite side blue with lightning (dark). Must be kept oriented so the golden hemisphere always faces the voidexa sun at scene origin; the free-flight pilot can circle to see the blue side as a deliberate easter egg (narrative justification: voidexa is the system's light source, one hemisphere is permanently lit).

**NOT verified (must check at build time):**
- Whether any other page mounts `<EarlyAccessBanner />` outside `app/layout.tsx` (grep before removing).
- Whether any test snapshot locks the exact `STAR_MAP_NODES` array length or specific node IDs (Task 4 empties it).
- Whether Tailwind `z-[60]` / `z-50` are the only stacking tokens in play (there is also `zIndex: 60` inline on `/starmap/voidexa` CTA and company footer `zIndex: 10`).
- Whether `/space-station`, `/apps`, `/void-chat`, `/quantum-forge`, `/ai-trading`, `/services`, `/ai-tools`, `/trading-hub` routes all exist or need stub pages (grep `app/**/page.tsx`).

## TOM'S FILE SIZE LIMITS (from `docs/CLAUDE.md`)

| File kind | Max lines |
|---|---|
| React component (`*.tsx` under `components/`) | 300 |
| Next.js route (`app/**/page.tsx`) | 100 |
| Library (`lib/**`) | 500 |
| Hooks (`hooks/**`) | 300 |

Task 4 is the primary risk. `PlanetSphere.tsx`, `BillboardPlanet.tsx` must each stay under 300. `planetConfig.ts` is pure data but lives under `components/starmap/` or `lib/starmap/` — 500-line lib cap applies. Split into sub-files if it threatens 300. Task 6 (Jarvis/UniverseChat merge) must split into `CommBubble.tsx` (<150 lines) + `CommPanel.tsx` (<300 lines) + data modules under `lib/comm/`.

## PRE-FLIGHT

```powershell
# 1. Backup tag (commit hash at sprint start will differ — confirm with git log -1 --oneline)
git tag backup/pre-sprint-17-20260420
git push origin backup/pre-sprint-17-20260420

# 2. Confirm baseline green
npm test     # expect 800+ green across 62 suites
npm run build  # expect clean, only pre-existing bigint non-fatal warning

# 3. Working-tree hygiene — these already exist from render-pipeline work; confirm none are staged
git status --short | Select-String "render_cards|card_art|PHASE1_14|VOIDEXA_CARD_ART|card-frames"
```

## TASK ORDER (dependency-sorted)

| # | Task | Files touched | Blast radius | Dep |
|---|---|---|---|---|
| 1 | Nebula zoom-out to 18000u | `NebulaBg.tsx` | star map + galaxy scenes (shared) | — |
| 3 | Remove "We are live" banner | `app/layout.tsx`, `EarlyAccessBanner.tsx` | every page | — |
| 4 | Planets + clustering + textures + scale | `public/textures/planets/*` (already on disk), new `PlanetSphere.tsx` + `BillboardPlanet.tsx` + `planetConfig.ts` + `lib/starmap/warp.ts`, `nodes.ts` shim, `StarMapScene.tsx` rewrite | starmap screen | Task 1 landed first (prevents visual regression during ring placement) |
| 8 | Voidexa sun → /home click route | `planetConfig.ts` (part of Task 4) | star map center node | part of Task 4 |
| 2 | Intro-video autoplay handshake | `app/page.tsx`, `IntroVideo.tsx`, `AudioGatePopup.tsx` | homepage only | — |
| 7 | Quick-menu dismissal auto-routes to /starmap/voidexa | `app/page.tsx`, `AudioGatePopup.tsx`, `QuickMenuOverlay.tsx` | homepage only | Task 2 must land first (stage machine stable) |
| 5 | ShipPicker badge overflow | `ShipPicker.tsx` | hangar only | — |
| 6 | Jarvis + Universe Chat merge | `app/layout.tsx`, new `components/comm/*`, `lib/comm/*`, deprecate old files | bottom-left on every page | last (biggest refactor) |

**Build order rationale (as requested by Jix):** 1 → 3 → 4 → 8 → 2 → 7 → 5 → 6. Tasks 1 and 3 are trivial constants/deletions and can batch in a single commit. Task 4 + 8 form the core visual rework. Task 2 must precede 7 because 7 depends on a stable intro state machine. Tasks 5 and 6 are isolated and land last.

---

### TASK 1 — Nebula sphere zoom-out

**File:** `components/starmap/NebulaBg.tsx` (45 lines total, 1 constant to change)

**Current:** `const SPHERE_RADIUS = 5000` (line 8).

**Target:** `const SPHERE_RADIUS = 18000`.

**Why 18000, not the full 20000:** camera far plane in both canvases is 20000 (`StarMapCanvas.tsx:16`, `GalaxyCanvas.tsx:60`). 20000 would place the sphere on the far clipping plane, risking clip + depth-fight with star points. 18000 gives a 10% safety margin and still reads as "infinite distance". Both `/starmap` and `/starmap/voidexa` use the same `NebulaBg`, so this single constant change fixes both.

**Acceptance:**
- Screenshot `/starmap/voidexa` at default camera distance. Nebula should feel distant + soft, not tight and grainy.
- No clipping or depth-fighting when camera dollies to `maxDistance: 30`.
- No FPS regression (single texture, no geometry count change, no shader change).

**Tests (`tests/sprint-17-completion.test.ts`):**
- `readFileSync('components/starmap/NebulaBg.tsx')` must match `/SPHERE_RADIUS\s*=\s*(\d+)/` and the captured integer must equal `18000`.
- Both canvas files must match `/far:\s*20000/`.

---

### TASK 2 — Intro-video sound popup + autoplay handshake

**Files:**
- `app/page.tsx` (161 lines — rewrite state-machine effect block)
- `components/home/IntroVideo.tsx` (154 lines — add `autoplayFailed` surfacing)
- `components/home/AudioGatePopup.tsx` — no change (Task 7 adds dismissal routing)

**Current behaviour (Jix audit April 20):** "Intro video shows but doesn't autoplay. User has to click into navbar to enter star map."

**Root cause:** When the user clicks **"Yes"** on AudioGatePopup, `videoMuted` resolves to `false` (`app/page.tsx:94`), so `IntroVideo` mounts with `muted={false}`. Chrome's autoplay policy treats the AudioGatePopup button click as a user gesture, **but only for the synchronous call stack of that click event**. Mounting a fresh `<video autoPlay>` in a subsequent React render is NOT in the same task, so Chromium rejects the unmuted autoplay and the video sits paused on frame 1. Second bug: `onEnded` is the only path to `stage='menu'`; if the video errors or stalls there's no fallback — stage stays `'video'` indefinitely (matches Jix's observation).

**Target state — three layers of fix:**

**(a) Imperatively unmute + play() inside the same user-gesture call stack via `queueMicrotask`.**

In `app/page.tsx` rewrite `handleAudioChoice` (around line 81):
```ts
const handleAudioChoice = useCallback((choice: 'enabled' | 'muted') => {
  setAudioPreference(choice)
  setAudioPrefState(choice)
  setStage('video')
  // queueMicrotask fires AFTER React commit but in the SAME task as the user click —
  // satisfies Chrome's autoplay policy. useEffect would be a new task and fail.
  queueMicrotask(() => {
    const el = videoRef.current?.getVideoEl?.()
    if (!el) return
    if (choice === 'enabled') el.muted = false
    el.play().catch(() => videoRef.current?.surfaceAutoplayFailed?.())
  })
}, [])
```

Extend `IntroVideoHandle` in `IntroVideo.tsx`:
```ts
export interface IntroVideoHandle {
  jumpToEnd: () => void
  getVideoEl: () => HTMLVideoElement | null  // NEW
  surfaceAutoplayFailed: () => void           // NEW
}
```
Internal `[autoplayFailed, setAutoplayFailed]` state; when `surfaceAutoplayFailed()` fires, render a large centered "Tap to play" pill that calls `videoRef.current?.play()` on click.

**(b) 3-second watchdog.** In `IntroVideo.tsx` useEffect:
```ts
useEffect(() => {
  let sawProgress = false
  const onProgress = () => { sawProgress = true }
  const v = videoRef.current
  v?.addEventListener('timeupdate', onProgress)
  const watchdog = window.setTimeout(() => {
    if (!sawProgress && (v?.readyState ?? 0) < 2) setAutoplayFailed(true)
  }, 3000)
  return () => {
    v?.removeEventListener('timeupdate', onProgress)
    window.clearTimeout(watchdog)
  }
}, [])
```

**(c) `onError` fallback to menu.** Add `onError={() => onEnded?.()}` to the `<video>` tag so a failed load advances stage instead of stalling.

**Acceptance:**
- First visit: AudioGatePopup → Yes → video plays with audio, no manual click.
- First visit: AudioGatePopup → No → video plays muted, mute toggle works.
- Returning visit: video plays per saved pref.
- Chrome devtools "Block autoplay" → "Tap to play" overlay within 3s.
- 404 on video URL → advances to menu on error event.
- No regression to existing `homepage-intro.test.ts` (15 tests).

**Tests:**
- `IntroVideo.tsx` source exposes `getVideoEl` + `surfaceAutoplayFailed` in `IntroVideoHandle`.
- `app/page.tsx` source matches `/queueMicrotask\(/` inside `handleAudioChoice`.
- `IntroVideo.tsx` matches `/onError=/` and `/watchdog/i`.
- Autoplay-failed overlay matches `/tap to play/i`.

---

### TASK 3 — Remove "We are live" banner

**Files:**
- `components/layout/EarlyAccessBanner.tsx` (97 lines — full component, deprecate in place)
- `app/layout.tsx:5, :61` — import + mount point

**Current:** banner renders "We are live. Welcome to voidexa." on every page (except `/freeflight`, `/assembly-editor` per pathname guard at line 52) because `TARGET_UTC` (2026-04-05) has passed.

**Grep before removing** to ensure no other page mounts it:
```powershell
git grep -l "EarlyAccessBanner" -- "*.tsx"
```
Expected result: only `app/layout.tsx` imports it (+ the component file itself).

**Target:**
1. Remove `<EarlyAccessBanner />` tag from `app/layout.tsx:61`.
2. Remove the import at `app/layout.tsx:5`.
3. Leave the component file on disk — add a one-line `@deprecated Not mounted — retained for future re-use. See sprint-17-completion.md` JSDoc at the top. No source changes beyond the JSDoc.
4. `paddingTop: 72` on `<main>` (`app/layout.tsx:66`) stays — it accounts for the fixed `<Navigation />` (69 px), not the banner.

**Acceptance:**
- Load any page — no purple banner at top, nav sits at `top: 0`.
- Freeflight / assembly-editor unchanged.
- No regression in nav dropdown positioning or hero offsets.

**Tests:**
- `readFileSync('app/layout.tsx')` must NOT match `/EarlyAccessBanner/`.
- `readFileSync('components/layout/EarlyAccessBanner.tsx')` must still exist and match `/@deprecated/` in the first 5 lines.

---

### TASK 4 — Star map clustering fix + 3D textured planets + scale variation

Sprint's biggest task. Full replacement of the clustered 2D node ring with a 3-ring orbital distribution of textured 3D planets around a right-center plasma sun, with **realistic per-planet scale variation** and **Z-depth ring stagger**.

#### 4.1 Texture prerequisites — ALL ON DISK (verified April 20)

No copy step needed. All 12 PNGs present under `public/textures/planets/` (see inventory table in "REQUIRED READING"). Aspect ratios to hard-code:

| Filename | Aspect (w/h) | Rendering mode |
|---|---|---|
| `voidexa.png` | 1.0 | Billboard (plasma sun — texture IS the mesh) |
| `spacestation_planet.png` | 1.5 | Billboard (wide station silhouette) |
| `saturen_like_rings.png` | 1.5 | Billboard (Saturn-style rings) |
| `pink.png` / `purpel-pink.png` / `lilla.png` / `icy_blue.png` / `orange.png` / `red_rocky.png` / `earth.png` / `pastel_green.png` / `goldenblue.png` | 1.0 | Sphere (UV-wrapped) |

**File size verification after sprint lands:**
```powershell
Get-ChildItem public/textures/planets/*.png | Select Name, @{N='KB';E={[math]::Round($_.Length/1KB)}}
# Any texture > 2 MB: re-compress with squoosh before deploy.
```

#### 4.2 New component: `components/starmap/PlanetSphere.tsx` (target <200 lines)

Takes `{ config: PlanetConfig, onWarpStart, onHoverChange }` and renders a textured sphere with an atmosphere shell.

Key details:
- `useLoader(THREE.TextureLoader, config.texture!)` with `colorSpace: SRGBColorSpace`, `anisotropy: min(8, gl.capabilities.getMaxAnisotropy())` — mirror `NebulaBg.tsx:17–22`.
- `<sphereGeometry args={[config.size, 64, 32]} />` — 64/32 segments keep poly count sane with ≤ 10 spheres (total vertex budget <18k).
- Atmosphere shell reuses `ATMOSPHERE_BY_TYPE` from `NodeMesh.tsx:18–29`. Move into `lib/starmap/planetTypes.ts` and import from both places.
- **`lookAtSun` prop (new, for Trading Hub).** When `config.lookAtSun === true`:
  ```ts
  useFrame(() => {
    if (!meshRef.current || !config.lookAtSun) return
    // Direction vector from this planet's world position toward SUN_POSITION
    const planetWorldPos = new THREE.Vector3()
    meshRef.current.getWorldPosition(planetWorldPos)
    const sunWorld = new THREE.Vector3(...SUN_POSITION)
    const dir = sunWorld.clone().sub(planetWorldPos).normalize()
    // Build a quaternion that rotates the golden hemisphere (assume +X local) toward the sun.
    const localForward = new THREE.Vector3(1, 0, 0)
    const q = new THREE.Quaternion().setFromUnitVectors(localForward, dir)
    meshRef.current.quaternion.copy(q)
  })
  ```
  The texture's UV layout places the golden hemisphere on the +X local face. The blue/lightning hemisphere faces -X, permanently away from the sun; free-flight pilots can circle the planet to see it. This is intentional narrative — voidexa is the light source, one side is always dark.
- GSAP warp sequence extracted into `lib/starmap/warp.ts` (pure function `warpToPath(camera, targetPos, router, path) => gsap.Timeline`) — shared with `BillboardPlanet.tsx`.
- Pointer-down vs drag guard copied from `NodeMesh.tsx:45`.

#### 4.3 New component: `components/starmap/BillboardPlanet.tsx` (target <200 lines)

For billboard textures (sun, station, Saturn-rings shop). Uses drei `<Billboard>` + `<planeGeometry>`:

```tsx
import { Billboard } from '@react-three/drei'
// …
<Billboard>
  <mesh>
    <planeGeometry args={[config.size * config.aspect!, config.size, 1, 1]} />
    <meshBasicMaterial
      map={texture}
      transparent
      depthWrite={false}          // billboards with alpha must not write depth
      toneMapped={false}          // keep highlights above Bloom threshold
    />
  </mesh>
</Billboard>
```

**Special: "Shop (Coming Soon)" has `path: null`.** Click handler must NOT call `warpToPath`. Instead:
- Hover → show HTML tooltip "Shop — Coming Soon" (via drei `<Html>` or pointer-enter state).
- Click → no-op (or optional subtle pulse animation for feedback).

#### 4.4 New config: `lib/starmap/planetConfig.ts` (pure data, target <200 lines)

Replaces `STAR_MAP_NODES`. Three concentric rings around the voidexa sun (right-of-center). **Ring Z-depth stagger is the critical spec change** — each ring sits at a different Z so perspective makes inner-ring planets visually larger than outer-ring planets even when their mesh size would be comparable.

```ts
// Sun at right-of-center so visual weight is asymmetric (matches quick-menu reference).
export const SUN_POSITION: [number, number, number] = [3.5, 0, -2]

// Ring radii — scaled x3-4 from original Sprint 17 draft because planet scale went up 1.5x-5x.
// Empirically tuned to prevent overlap at new scales; verify at build with a top-down
// screenshot before committing.
export const RING_1_RADIUS = 14
export const RING_2_RADIUS = 26
export const RING_3_RADIUS = 38

// Ring Z-depth stagger — INNER RING APPEARS LARGEST due to camera proximity.
//   Ring 1 at Z = 0 (planets appear largest — closest to camera default eye)
//   Ring 2 at Z = -2 (medium apparent size)
//   Ring 3 at Z = -4 (smallest apparent size)
// These offsets are ADDED to SUN_POSITION[2] so absolute Z is SUN_POSITION[2] + stagger.
export const RING_Z_STAGGER: Record<1 | 2 | 3, number> = { 1: 0, 2: -2, 3: -4 }

export type PlanetKind = 'sphere' | 'billboard' | 'procedural'

export interface PlanetConfig {
  id: string
  label: string
  path: string | null          // null = no route (Shop — Coming Soon)
  tooltip?: string             // shown on hover when path === null
  kind: PlanetKind
  texture?: string             // /textures/planets/<name>.png — required unless kind==='procedural'
  aspect?: number              // required when kind==='billboard' (width / height)
  size: number                 // mesh size in world units (see scale table below)
  ring: 0 | 1 | 2 | 3          // 0 = sun (center), 1 = inner, 2 = mid, 3 = outer
  ringAngleRad: number         // 0 = right, PI/2 = up, PI = left, -PI/2 = down
  emissive: string
  emissiveIntensity: number
  sublabel: string
  isDiscovered: boolean
  planetType: PlanetType
  lookAtSun?: boolean          // only true for trading-hub
}

function placeOnRing(ring: 0 | 1 | 2 | 3, angleRad: number): [number, number, number] {
  if (ring === 0) return SUN_POSITION
  const r = ring === 1 ? RING_1_RADIUS : ring === 2 ? RING_2_RADIUS : RING_3_RADIUS
  const zStagger = RING_Z_STAGGER[ring]
  const tiltY = ring === 1 ? 1.0 : ring === 2 ? 2.4 : -1.6  // scaled up with ring radius
  return [
    SUN_POSITION[0] + r * Math.cos(angleRad),
    SUN_POSITION[1] + tiltY + Math.sin(angleRad) * 0.8,
    SUN_POSITION[2] + zStagger + r * Math.sin(angleRad),
  ]
}
```

**Per-planet scale variation (realistic sizing; base unit = 0.4 world units):**

| Tier | Multiplier | Final size | Planets |
|---|---|---|---|
| Central plasma sun | ×5 | 2.0 | voidexa |
| Large structure / ringed | ×3 | 1.2 | space-station, shop (saturn-rings) |
| Gas giant | ×2 | 0.8 | apps (pink), quantum (purpel-pink) |
| Standard planet | ×1.5 | 0.6 | earth, orange (ai-trading), red_rocky (services), icy_blue (quantum-forge), lilla (void-chat), pastel_green (claim-your-planet), goldenblue (trading-hub) |

**Final planet roster — 12 nodes (About + Contact removed entirely; they live in nav/footer only):**

| ID | Label | Path | Kind | Texture | Aspect | Ring | Angle (rad) | Size | lookAtSun |
|---|---|---|---|---|---|---|---|---|---|
| `voidexa` | voidexa | `/home` | billboard | voidexa.png | 1.0 | 0 | — | 2.0 | — |
| `space-station` | Orbital Space Station | `/space-station` | billboard | spacestation_planet.png | 1.5 | 1 | `-Math.PI / 2` (top) | 1.2 | — |
| `apps` | Apps | `/apps` | sphere | pink.png | — | 1 | `Math.PI / 6` (upper-right) | 0.8 | — |
| `quantum` | Quantum | `/quantum` | sphere | purpel-pink.png | — | 1 | `Math.PI * 0.85` (upper-left) | 0.8 | — |
| `void-chat` | Void Chat | `/void-chat` | sphere | lilla.png | — | 2 | `-Math.PI / 3` | 0.6 | — |
| `quantum-forge` | Quantum Forge | `/quantum-forge` | sphere | icy_blue.png | — | 2 | `Math.PI / 4` | 0.6 | — |
| `ai-trading` | AI Trading | `/ai-trading` | sphere | orange.png | — | 2 | `Math.PI * 0.75` | 0.6 | — |
| `services` | Services | `/services` | sphere | red_rocky.png | — | 2 | `Math.PI * 1.25` | 0.6 | — |
| `ai-tools` | AI Tools | `/ai-tools` | sphere | earth.png | — | 3 | `-Math.PI / 4` | 0.6 | — |
| `shop` | Shop (Coming Soon) | `null` | billboard | saturen_like_rings.png | 1.5 | 3 | `Math.PI / 3` | 1.2 | — |
| `trading-hub` | Trading Hub | `/trading-hub` | sphere | goldenblue.png | — | 3 | `Math.PI * 0.8` | 0.6 | **true** |
| `claim-your-planet` | Yours? | `/claim-your-planet` | sphere | pastel_green.png | — | 3 | `Math.PI * 1.35` | 0.6 | — |

**Collision verification:** with ring radii 14 / 26 / 38 and planet sizes ≤ 1.2 (ring 1) / 0.6 (rings 2-3), the nearest-neighbor gap on each ring is:
- Ring 1: min chord between apps (π/6) and space-station (-π/2) → ~14 × |sin((π/6 + π/2) / 2)| ≈ 14 × 0.87 = 12.2 units → 10× the largest planet radius. Safe.
- Ring 2: 4 planets evenly spread, min chord ~26 × sin(π/4) ≈ 18.4 units. Safe.
- Ring 3: 4 planets with angles -π/4, π/3, 0.8π, 1.35π. Min adjacent angle = |π/3 - (-π/4)| = 7π/12 ≈ 105°, chord ≈ 41 units. Safe.

**Route notes:**
- `/home` is the voidexa sun's click target (Task 8). Confirm `app/home/page.tsx` exists or create a stub; alternative is to route sun → `/` (root), but Jix specified `/home` explicitly.
- `/space-station` is a **new route** that absorbs existing `/about` content. Existing `/about` can redirect or remain; decision logged during build.
- `/quantum-forge` internal vs external (`https://forge.voidexa.com`) — keep star map link internal (`/quantum-forge`) and let that page decide whether to redirect.
- `/shop` route intentionally absent — hover tooltip only.

#### 4.5 `nodes.ts` replacement strategy

Do **not** delete outright — `NodeMesh.tsx` imports `StarNode` and `PlanetType` types.
1. Move `PlanetType` + `ATMOSPHERE_BY_TYPE` to `lib/starmap/planetTypes.ts`.
2. Re-export `PlanetType` from `nodes.ts` for backwards compatibility.
3. Reduce `nodes.ts` STAR_MAP_NODES/NODES to empty arrays with `@deprecated use planetConfig.ts` JSDoc.
4. Grep all consumers first: `git grep "STAR_MAP_NODES\|from.*nodes'" -- "*.ts" "*.tsx"` — migrate any real consumer to `PLANET_CONFIGS`.

#### 4.6 `StarMapScene.tsx` integration

**Current (~line 217–224):**
```tsx
{STAR_MAP_NODES.map(node => <NodeMesh … />)}
```

**Target:**
```tsx
{PLANET_CONFIGS.map(p => {
  const onWarp = () => setWarping(true)
  if (p.kind === 'billboard') return <BillboardPlanet key={p.id} config={p} onWarpStart={onWarp} onHoverChange={setHoveredId} />
  if (p.kind === 'sphere')    return <PlanetSphere   key={p.id} config={p} onWarpStart={onWarp} onHoverChange={setHoveredId} />
  return null  // procedural kind reserved; none used in current roster
})}
```

- OrbitControls target: move from `[0, -0.5, -4]` to `SUN_POSITION` so auto-rotate pivots around the sun, not origin.
- **Bump OrbitControls `maxDistance`** from 30 to ~60 — ring 3 at radius 38 requires a bigger zoom envelope so the outer planets sit in-frame at default camera angle. Alternatively start camera further back (`position: [40, 15, 50]` or similar).
- `ConstellationLines` (`StarMapScene.tsx:116`) and `EnergyPulses` (`:139`) — delete or re-anchor from `SUN_POSITION`. Recommendation: **delete both**. The ring geometry itself creates visual structure; radial lines from the sun add clutter on top of the already-busy scene.

**Acceptance (Task 4 + 8 as a whole):**
- `/starmap/voidexa` renders voidexa plasma sun right-of-center at scale ×5.
- 3 concentric rings visible; ring 1 planets read visibly larger than ring 3 planets due to Z-stagger.
- All 10 textured entries show PNGs sharp; goldenblue's golden side faces the sun from every camera angle.
- Space Station + Saturn-rings render as camera-facing billboards (no distortion on rotation).
- About and Contact do NOT appear on star map.
- Shop (Saturn rings) hover shows "Shop — Coming Soon" tooltip; click is no-op.
- Click voidexa sun → warps to `/home` (Task 8).
- Click any other planet → GSAP warp → routes correctly.
- OrbitControls auto-rotate pivots around SUN_POSITION.
- FPS ≥ 60 at default camera distance.

**Tests:**
- `PLANET_CONFIGS` length === 12.
- Exactly one entry `{ id: 'voidexa', ring: 0, kind: 'billboard', path: '/home' }`.
- NO entries with `id` in `['about', 'contact']`.
- Required ids present: `space-station`, `apps`, `quantum`, `void-chat`, `quantum-forge`, `ai-trading`, `services`, `ai-tools`, `shop`, `trading-hub`, `claim-your-planet`.
- `PLANET_CONFIGS.find(p => p.id === 'shop').path === null`.
- `PLANET_CONFIGS.find(p => p.id === 'shop').tooltip` matches `/coming soon/i`.
- `PLANET_CONFIGS.find(p => p.id === 'trading-hub').lookAtSun === true`.
- `PLANET_CONFIGS.find(p => p.id === 'voidexa').size === 2.0`.
- `SUN_POSITION[0] > 0` (sun right-of-center).
- `RING_1_RADIUS < RING_2_RADIUS < RING_3_RADIUS`.
- `RING_Z_STAGGER[1] > RING_Z_STAGGER[2] && RING_Z_STAGGER[2] > RING_Z_STAGGER[3]` (inner ring at highest Z = closest to camera).
- `PlanetSphere.tsx` source matches `/useLoader\(.*TextureLoader/` and `/sphereGeometry/` and `/lookAtSun/`.
- `BillboardPlanet.tsx` source matches `/Billboard/` and `/planeGeometry/` and `/depthWrite:\s*false/`.
- `lib/starmap/warp.ts` exists and exports a function.

---

### TASK 5 — ShipPicker badge overflow

**File:** `components/freeflight/ships/ShipPicker.tsx` (340 lines)

**Current state (lines 225–262):** single-flex row with name + rarity badge on the same line. Long names like "Galactic Okamoto" (16 chars) + LEGENDARY badge (letter-spaced) + 🔒 prefix exceed the 360 px list column width, causing visual collision.

**Target: 3-line vertical stack per row** —

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
  {/* LINE 1 — name + lock icon, ellipsis on overflow */}
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em',
    fontFamily: 'var(--font-space, system-ui)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  }}>
    {!starter && <span style={{ fontSize: 14, opacity: 0.7 }}>🔒</span>}
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
  </div>
  {/* LINE 2 — rarity badge + price pip (both move here from the cluttered header) */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span data-testid={`rarity-badge-${rarity}`} style={{…existing badge style…}}>
      {RARITY_LABEL[rarity]}
    </span>
    <span style={{
      fontSize: 13, letterSpacing: '0.06em',
      color: starter ? '#86efac' : 'rgba(255,255,255,0.7)',
      fontFamily: 'var(--font-space, monospace)',
    }}>
      {starter ? 'Play now · Free' : `Unlock · ${priceLabel ?? 'See shop'}`}
    </span>
  </div>
  {/* LINE 3 — description (unchanged from existing 263–270, just moved below) */}
  <p style={{ fontSize: 14, opacity: 0.75, margin: 0 }}>{s.description}</p>
</div>
```

Keep the outer `<button title="Unlock in shop">` for native hover help.

**File size watch:** current 340 lines. New layout adds ~20, so total stays around 360. **If under 350 after the change, leave in place.** If over, flag extraction of `ShipListRow.tsx` as an optional follow-up — but since Tom's 300-line cap applies to React components, a refactor may be required. Decide at build time.

**Acceptance:**
- All 40 ships render rarity badge below the name.
- No name clipped mid-character in visible UI.
- Badge glow/border unchanged.
- Price pip moves from old line 3 to new line 2.
- Description stays on line 3.

**Tests:**
- `ShipPicker.tsx` matches `/flexDirection:\s*['"]column['"]/` within 200 lines of `.map(s =>`.
- Matches `/textOverflow:\s*['"]ellipsis['"]/`.

---

### TASK 6 — Jarvis + Universe Chat merge

**Files:**
- `app/layout.tsx:8–9` — imports
- `app/layout.tsx:68–69` — mount points
- `components/ui/JarvisAssistant.tsx` (~500 lines)
- `components/chat/UniverseChat.tsx` (~600 lines)

**Current:** Both mount at `bottom-6 left-6`. Jarvis at `z-[60]` visually covers UniverseChat at `z-50` on every non-freeflight page. UniverseChat unread badge is hidden behind Jarvis orb.

**Target — single `<CommBubble />` with 2-tab panel:**

```
components/comm/
├── CommBubble.tsx        — shared bottom-left orb (<150 lines)
├── CommPanel.tsx         — tab bar + content swap (<300 lines)
├── JarvisTab.tsx         — panel body extracted from JarvisAssistant (<250 lines)
├── UniverseTab.tsx       — panel body extracted from UniverseChat (<300 lines)
└── types.ts              — `Tab = 'jarvis' | 'universe'` union

lib/comm/
├── jarvisResponses.ts    — RESPONSES record + getResponse() (pure data + fn)
└── universeSeed.ts       — MOCK_MESSAGES + channel config (pure data)
```

**CommBubble.tsx** (<150 lines): ONE orb at `bottom-6 left-6 z-[60]`. Shows "AI" glyph as primary icon + MessageCircle as small secondary badge. Combined unread badge (sourced from UniverseChat state only — Jarvis has no unread). On click, opens `CommPanel` with most-recently-used tab (`localStorage['voidexa_comm_tab_v1']`, default `'jarvis'`).

**CommPanel.tsx** (<300 lines): tab bar "JARVIS" | "Universe Chat" at top, body swap based on active tab, close/minimize buttons preserved. Panel grows up-and-right from bubble.

**Legacy file disposition:**
- Add `@deprecated` JSDoc to both old components.
- **Do not delete `UniverseChat.tsx`** — it exports `FreeFlightOverlay` which is consumed separately. Grep first: `git grep "FreeFlightOverlay" -- "*.tsx"`.
- Next.js tree-shakes unused components, so leaving the files costs nothing at runtime.

**`app/layout.tsx` changes:**
```tsx
- import JarvisAssistant from '@/components/ui/JarvisAssistant'
- import UniverseChat from '@/components/chat/UniverseChat'
+ import CommBubble from '@/components/comm/CommBubble'

  // in body:
- <JarvisAssistant />
- <UniverseChat />
+ <CommBubble />
```

**Hide guards (preserve existing):**
- `/` homepage — hide (Jarvis already guards this at line 60).
- `/freeflight` — hide `CommBubble`; keep separate `FreeFlightOverlay` from old `UniverseChat.tsx` export.
- `/assembly-editor` — hide.

**Acceptance:**
- One bottom-left orb on every non-excluded page.
- Click → panel opens with last-used tab.
- Both tabs function identically to their standalone predecessors.
- FreeFlightOverlay on `/freeflight` still renders.
- No duplicate z-index / pointer-event overlap.

**Tests:**
- `app/layout.tsx` NOT matches `/JarvisAssistant/` or `/UniverseChat/`.
- `app/layout.tsx` matches `/CommBubble/`.
- `components/comm/CommBubble.tsx` exists, renders at `bottom-6 left-6`.
- `components/comm/CommPanel.tsx` exports `TABS` (or equivalent) containing `'jarvis'` and `'universe'`.
- `lib/comm/jarvisResponses.ts` exports `RESPONSES` and `getResponse`.
- `lib/comm/universeSeed.ts` exports `MOCK_MESSAGES`.

---

### TASK 7 — Quick menu dismissal auto-routes to /starmap/voidexa (NEW)

**Files:**
- `app/page.tsx` — stage machine dismissal handler
- `components/home/AudioGatePopup.tsx` — may need onDismiss callback
- `components/home/QuickMenuOverlay.tsx` — dismissal path

**Current bug (Jix audit April 20):** After the intro video ends (or the user picks Yes/No on AudioGatePopup), they land on the quick-menu overlay. If they dismiss (e.g. press ESC, or close without picking a CTA), they stay on the homepage staring at the backdrop. There is no auto-nav to the star map.

**Root cause:** `computeIntroMode` state machine ends at `stage='menu'` with no follow-up transition. `QuickMenuOverlay` has CTAs for Free Flight and Star Map, but no default navigation when the overlay is dismissed.

**Target behaviour:**
- When `QuickMenuOverlay` dismisses (via its existing close button, ESC key, or clicking outside the glass card) and the user has NOT clicked a primary CTA, `router.replace('/starmap/voidexa')` fires.
- The `voidexaSkipQuickMenu` localStorage flag is written (if user had the checkbox toggled), OR respected on subsequent visits.
- If the user explicitly picks "Enter Free Flight" CTA, do NOT redirect to star map — follow the CTA target.

**Implementation sketch in `app/page.tsx`:**
```ts
const handleQuickMenuDismiss = useCallback(() => {
  // Only auto-route if no explicit CTA was taken. The overlay's onCtaClick handler
  // should short-circuit (call router.push then guard against this dismissal path).
  router.replace('/starmap/voidexa')
}, [router])
```

In `QuickMenuOverlay.tsx`:
- Add `onDismiss` prop (required).
- Wire ESC listener, backdrop click, and close-button click to call `onDismiss()`.
- CTA click handlers: first `router.push(cta.href)`, then mark an internal ref so the dismissal path becomes a no-op.

**AudioGatePopup dismissal:** if user dismisses the audio gate without choosing (ESC), default to `'muted'` preference and still advance to stage='video'. This is an edge case; most users pick Yes or No.

**Acceptance:**
- First visit: AudioGate → Yes → video → quick menu overlay. Press ESC → lands on `/starmap/voidexa`.
- First visit: AudioGate → Yes → video → quick menu overlay. Click outside the glass card → lands on `/starmap/voidexa`.
- First visit: AudioGate → Yes → video → quick menu overlay. Click "Enter Free Flight" → lands on `/freeflight` (not star map).
- Returning visit with `voidexaSkipQuickMenu=true`: video ends, skips overlay entirely, lands on `/starmap/voidexa` directly.
- Session flag `hasSeenIntroThisSession` is still respected for Sprint 15 logic.

**Tests:**
- `QuickMenuOverlay.tsx` exports an `onDismiss` prop in its component type.
- `app/page.tsx` source matches `/router\.replace\(['"]\/starmap\/voidexa['"]\)/` inside a handler that does NOT fire when a CTA is clicked.
- `QuickMenuOverlay.tsx` source matches `/onDismiss\(\)/` in an ESC handler.

---

### TASK 8 — Voidexa central plasma sun click routes to /home (NEW)

**File:** `lib/starmap/planetConfig.ts` (created in Task 4)

This task is a single-line verification inside the planetConfig roster, separated out for clarity because it's a distinct user-visible behavior (the sun is the visual centerpiece and the only zero-ring element).

**Target behavior:**
- Clicking the voidexa plasma sun (centerpiece billboard at `SUN_POSITION`) triggers the standard GSAP warp and navigates to `/home`.
- The sun is NOT a "you are here" inert decoration — it IS a clickable planet with the highest visual weight.
- Warp duration and FOV envelope match other planets (1.0s, FOV 60→92).

**Verification in `planetConfig.ts`:**
```ts
// voidexa sun entry (ring: 0, kind: 'billboard'):
{
  id: 'voidexa',
  label: 'voidexa',
  path: '/home',               // <-- must be '/home', not null, not '/'
  kind: 'billboard',
  texture: '/textures/planets/voidexa.png',
  aspect: 1.0,
  size: 2.0,
  ring: 0,
  ringAngleRad: 0,             // unused for ring 0 but required by shape
  emissive: '#00ffff',
  emissiveIntensity: 1.2,
  sublabel: 'core',
  isDiscovered: true,
  planetType: 'sun',
}
```

**Route confirmation:** ensure `app/home/page.tsx` exists. If it does not, create a minimal redirect page (`return redirect('/')`) OR change the config to `path: '/'` — decide with Jix during build.

**Acceptance:**
- Click voidexa sun → GSAP warp (same animation as other planets) → `router.push('/home')`.
- No click-pass-through onto background starfield when clicking the sun.
- No "you are here" inert marker replaces the sun — it remains interactive.

**Tests:**
- `PLANET_CONFIGS.find(p => p.id === 'voidexa').path === '/home'`.
- `PLANET_CONFIGS.find(p => p.id === 'voidexa').ring === 0`.
- `BillboardPlanet.tsx` source matches `/warpToPath\(.*,\s*.*,\s*router,\s*config\.path\)/` (or equivalent that verifies path-null billboards short-circuit while path-set billboards warp).

---

## POST-BUILD VERIFICATION

```powershell
# 1. Full test suite — expect 800 + (tests added this sprint) green
npm test

# 2. Clean build
npm run build

# 3. Chrome devtools audit
#    a) /starmap/voidexa — screenshot, compare nebula+ring composition against quick-menu reference
#    b) / homepage — first visit (incognito), AudioGate → Yes → video plays unmuted without manual click (Task 2)
#    c) / homepage — Chrome devtools > Block autoplay → "Tap to play" overlay appears within 3s (Task 2)
#    d) / homepage — video ends → quick menu → press ESC → lands on /starmap/voidexa (Task 7)
#    e) any page — one bottom-left orb, no banner at top (Tasks 3, 6)
#    f) /starmap/voidexa — click voidexa sun → warps to /home (Task 8)
#    g) /starmap/voidexa — hover Saturn rings → "Coming Soon" tooltip; click does nothing (Task 4)
#    h) /starmap/voidexa — orbit camera around goldenblue (Trading Hub) → golden side always faces sun, blue lightning visible from opposite angle (Task 4)
#    i) /freeflight > Ship hangar — badges stack below titles, no overflow (Task 5)

# 4. Deploy
git add .
git commit -m "feat(sprint-17): complete visual polish + star map 3D textured planets + quick-menu dismissal + sun click route"
git push origin main
# Vercel auto-deploys. Confirm build green on dashboard before post-deploy audit.

# 5. Tag
git tag sprint-17-complete
git push origin sprint-17-complete
```

## CLEANUP CHECKLIST

- [ ] Task 1: Nebula radius at 18000, both canvases confirmed far:20000
- [ ] Task 2: AudioGate → Yes path imperatively unmutes + plays within user-gesture microtask; watchdog + onError fallbacks wired
- [ ] Task 3: Banner removed from layout, component deprecated on disk
- [ ] Task 4: 12 planet PNGs confirmed at `public/textures/planets/` (already on disk, 11 ≤ 2 MB verified)
- [ ] Task 4: `PlanetSphere.tsx`, `BillboardPlanet.tsx`, `planetConfig.ts`, `lib/starmap/warp.ts` all under file-size caps
- [ ] Task 4: Old `STAR_MAP_NODES` reduced to empty array + `@deprecated`
- [ ] Task 4: About + Contact entirely removed from star map (live in nav/footer only)
- [ ] Task 4: Shop (Saturn rings) has `path: null` + hover tooltip "Shop — Coming Soon"
- [ ] Task 4: Trading Hub (goldenblue) uses `lookAtSun` quaternion rotation, golden side faces sun every frame
- [ ] Task 4: Ring Z-depth stagger implemented — ring 1 at Z=0, ring 2 at Z=-2, ring 3 at Z=-4
- [ ] Task 4: Planet scale variation — voidexa ×5, large ×3, gas giants ×2, standard ×1.5
- [ ] Task 4: OrbitControls target moved to SUN_POSITION; maxDistance bumped to accommodate ring 3 at r=38
- [ ] Task 5: `ShipPicker` rows use vertical stack; no name clips into badge
- [ ] Task 6: `CommBubble` replaces both standalone bubbles in `app/layout.tsx`
- [ ] Task 6: Legacy `JarvisAssistant.tsx` + `UniverseChat.tsx` carry `@deprecated` JSDoc
- [ ] Task 7: Quick menu dismissal (ESC / backdrop click / close button) auto-routes to `/starmap/voidexa` unless a CTA was clicked
- [ ] Task 8: Voidexa sun `path: '/home'`; click warps and navigates; `/home` route exists or decision logged
- [ ] `sprint-17-complete` tag pushed
- [ ] `docs/CLAUDE.md` CURRENT SPRINT header bumped to Sprint 18 preview

## GOTCHAS WORTH KEEPING

- **Nebula at 20000 clips against far plane.** Keep radius ≤ 18000 or bump far to 25000.
- **Chrome autoplay policy treats the AudioGate click as a gesture, but ONLY for the synchronous call stack.** `queueMicrotask` (same task) satisfies policy; `useEffect` (next tick) does not.
- **Billboard textures with alpha + Bloom.** Shop (Saturn rings) and space station have transparency; `transparent: true` + `depthWrite: false` is required or the ring halo punches holes in the atmosphere behind it.
- **`STAR_MAP_NODES` is referenced from `NODES` at `nodes.ts:201`.** Both need to become empty arrays in the deprecation shim or legacy consumers crash.
- **OrbitControls target must move when the sun moves.** Forgetting to update `target={SUN_POSITION}` on `StarMapScene.tsx:237` leaves auto-rotate pivoting around origin — sun swings in and out of frame.
- **Ring radii scaled 3-4× from draft** because planet scale went up 1.5×-5×. Inner ring at r=14, outer at r=38. OrbitControls maxDistance must follow or the outer ring clips the camera envelope.
- **Ring Z-stagger is the whole point of perspective-driven depth.** If all three rings sit at the same Z, the size variation alone won't read as "inner planets are closer" — you need both scale AND depth stagger to sell it.
- **`lookAtSun` UV convention.** goldenblue.png's golden hemisphere must wrap to the +X local face for the quaternion rotation to work. If the texture's UV orientation is different, flip the local forward vector (e.g. `new Vector3(-1,0,0)`) instead of rotating the texture.
- **Shop click with path:null must not warp.** The warp helper must short-circuit when `config.path === null`. Alternatively, only attach the click handler when `path !== null`. Either way, verify Shop is unclickable by testing.
- **`z-[60]` (Tailwind arbitrary) vs `zIndex: 60` (inline).** They resolve the same but mixing reads as inconsistent. New comm components use inline `zIndex` since old Jarvis/UniverseChat code mixes both.
- **Native `title=""` tooltips cannot be styled.** If Jix wants a custom Shop tooltip, it must be a controlled React popover (hover + mouseout listeners) via drei `<Html>` — not `title`.
- **`components/galaxy/GalaxyScene.tsx:7` imports `NebulaBg` from `../starmap/NebulaBg`.** Both scenes share the same sphere. Bumping the radius affects both views in one change — good.
- **Commented-line count tripwire.** When extracting Jarvis responses + Universe seed into `lib/comm/*`, the data modules are large. Tom's 500-line lib cap covers both; if either hits 450+, split per-domain.
- **Task 7 dismissal must not fire when a CTA was clicked.** Use an internal ref in `QuickMenuOverlay` to short-circuit the dismissal path after `router.push(cta.href)`.
- **`/home` route existence.** Task 8 assumes `app/home/page.tsx` exists. Verify at build time. If it doesn't, either create a minimal redirect page or change `path: '/home'` → `path: '/'`. Log the decision.
- **Test file naming.** Follow sprint-16 pattern: `tests/sprint-17-completion.test.ts`. Keep assertions source-inspection style (readFileSync + regex), no jsdom / React rendering — matches repo norms.
