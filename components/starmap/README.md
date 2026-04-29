# Star Map — Design Note

## Current architecture (after AFS-10-FIX-5, Apr 29)

The starmap views (`/starmap` galaxy and `/starmap/voidexa` system) now use a **single-layer background**: only `NebulaBg.tsx` rendering the equirectangular `nebula-backdrop.png` texture on a sphere of radius 1500. There are no star particle systems, no HTML starfield overlays, and no global gradient overlays on these routes.

Stars come exclusively from the nebula texture itself.

## What's gone (chronological)

- **AFS-10-FIX-4 (Apr 29):** `CSSStarfield` HTML overlay removed from both `StarMapPage.tsx` and `GalaxyPage.tsx`. NebulaBg sphere shrunk 5000 → 1500.
- **AFS-10-FIX-5 (Apr 29):** R3F `StarField` (5000 particles) removed from both `StarMapScene.tsx` and `GalaxyScene.tsx`. `AmbientDust` (2000 purple-drift particles) removed from `StarMapScene.tsx`. The global `GlobalStarfield` overlay (3 radial gradients + `ParticleField` 2D canvas) is now path-guarded off the starmap routes via `if (pathname === '/' || pathname === '/starmap' || pathname.startsWith('/starmap/')) return null` in `components/layout/GlobalStarfield.tsx`. `GlobalStarfield` itself stays mounted in `app/layout.tsx` for the rest of the app.

## What stays

- `NebulaBg.tsx` — sphere radius 1500, equirectangular nebula texture, BackSide, fog disabled.
- `Constellations` (galaxy) and `ConstellationLines` + `EnergyPulses` (system) — connect-the-planets visual layer; load-bearing for spatial readability.
- `WarpStreaks`, `CameraRig`, `OrbitControls` — interaction.
- `NodeMesh` planets with their textured spheres + atmosphere shells + glow + center torus + per-node pointLight (AFS-10-FIX, AFS-10-FIX-2).
- Camera Set C from AFS-10-FIX-3: galaxy `position [0, 3, 38]` + maxDistance 100, system `position [0, 0, 12]` + maxDistance 40, both at FOV 60°.
- Bloom / ChromaticAberration / Noise / Vignette postprocessing in both Canvases.

## Earlier rationale (historical, preserved)

The original AFS-6g (Apr 25) design note argued the curated `StarField + CSSStarfield + NebulaBg` chain should stay because the literal star particles were navigable click-targets:

> *"On the Star Map, the visible stars are navigable game elements, not background filler."*

That rationale was incorrect. The actual click-to-travel targets are the planet `<NodeMesh>` instances (12 textured spheres at fixed positions in `nodes.ts`), not the StarField particles. The star particles were decorative. AFS-10-FIX-5 confirmed this with a live audit and removed them without breaking navigation.

## When this could change

If a future sprint wants ambient depth back on the starmap, it should add **one** subtle layer (e.g. a low-density 500-particle `<Stars>` from drei, or a single thin radial vignette) rather than re-stacking multiple particle systems and gradient overlays. Keep the current single-layer architecture as the default; only add atmosphere if a live-verify shows the scene reads as "empty."
