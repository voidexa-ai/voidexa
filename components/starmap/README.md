# Star Map — Design Note

**AFS-6g Task 10:** SKIPPED. Star Map skybox replacement was deliberately not performed.

## Why the stars stay

In every other 3D surface (battle scene, free flight) a Three.js `<Stars>` particle system is purely decorative — a generic twinkling backdrop. On the Star Map, the visible stars are **navigable game elements**, not background filler:

- `StarField` (defined inside `StarMapScene.tsx`) renders the per-system star points the player clicks to travel between zones.
- `CSSStarfield.tsx` adds a subtle parallax layer behind the 3D scene to convey depth without competing with the navigable points.
- `NebulaBg.tsx` provides hand-tuned colour zones used by the Mini-Nav and zone-warp UI.

Replacing any of these with the Universal SpaceSkybox would either:

1. Hide the navigable stars behind an opaque equirectangular sphere, breaking the click-to-travel interaction, or
2. Visually flatten the parallax, making it harder for players to read the camera distance from a node.

The Star Map is a UI surface dressed up in 3D, not a "scene with stars in the background" — so the SKILL's universal-skybox logic does not apply here.

## When this could change

If/when zone navigation moves from clickable star points to a different metaphor (icon nodes, 3D station glyphs, etc.), revisit this decision: at that point the literal stars are decorative again and the skybox is appropriate. Until then, leave the curated `StarField` + `CSSStarfield` + `NebulaBg` chain alone.
