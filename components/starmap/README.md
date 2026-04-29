# Star Map — Design Note

**AFS-6g Task 10 (Apr 25):** SKIPPED. Star Map skybox replacement was deliberately not performed.

**AFS-10-FIX-4 (Apr 29) updated this design.** `CSSStarfield` was removed from both `/starmap` (galaxy) and `/starmap/voidexa` (system) views, and `NebulaBg` sphere radius was shrunk from 5000 to 1500. Reason: at radius 5000 the nebula texture was stretched across so much sphere surface that camera saw a tiny, washed-out fragment, which read as "too zoomed in" / "boring background." The CSSStarfield HTML overlay also produced a "double-stars" overlay on top of the nebula texture's already-baked-in stars. The current chain on the Star Map is `StarField` (R3F particles, in-canvas, navigable) + `NebulaBg` (sphere radius 1500, equirectangular nebula texture). See "Why the stars stay" below for the parts of the original rationale that still hold.

## Why the stars stay (R3F StarField only)

In every other 3D surface (battle scene, free flight) a Three.js `<Stars>` particle system is purely decorative — a generic twinkling backdrop. On the Star Map, the visible R3F StarField points are **navigable game elements**, not background filler:

- `StarField` (defined inside `StarMapScene.tsx`) renders the per-system star points the player clicks to travel between zones. **Retained.**
- ~~`CSSStarfield.tsx` adds a subtle parallax layer behind the 3D scene~~ — **removed in AFS-10-FIX-4**. The parallax was producing a competing dot-layer on top of the nebula. The R3F StarField alone now provides the click-targets.
- `NebulaBg.tsx` provides hand-tuned colour zones used by the Mini-Nav and zone-warp UI. **Retained**, sphere radius now 1500 (was 5000) for better texture visibility.

Replacing the R3F `StarField` with the Universal SpaceSkybox would still either:

1. Hide the navigable stars behind an opaque equirectangular sphere, breaking the click-to-travel interaction, or
2. Visually flatten the parallax, making it harder for players to read the camera distance from a node.

So `StarField` (R3F, in-canvas) is **load-bearing** and must not be touched. `CSSStarfield` (HTML overlay) was decorative-only and could be removed without harming gameplay; it has been.

## When this could change

If/when zone navigation moves from clickable star points to a different metaphor (icon nodes, 3D station glyphs, etc.), revisit the R3F `StarField` decision: at that point the literal stars are decorative again and the universal skybox could be appropriate. Until then, leave `StarField` + `NebulaBg` alone.
