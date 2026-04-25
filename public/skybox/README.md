# voidexa Skybox Assets

Equirectangular textures used by `components/three/SpaceSkybox.tsx` as backdrops for in-app 3D scenes (battle, freeflight, starmap).

## Files

| File | Resolution | Size | Format |
|---|---|---|---|
| `deep_space_01.png` | 8192×4096 | ~7.6 MB | PNG, 24bpp RGB equirectangular |

## Attribution

`deep_space_01.png` is sourced from **Space Spheremaps** (`hazy_nebulae_1.png`).

- Source: https://www.spacespheremaps.com/hazy-nebulae-spheremaps/
- License: Creative Commons Attribution 4.0 International (CC-BY 4.0), with attribution made optional by the author. Permits redistribution, modification, and commercial use.
- Restriction: cannot be used for AI training datasets (per spacespheremaps.com licensing terms).
- Attribution notice (not legally required, but appreciated): textures by Space Spheremaps.

## Format note

The `.png` extension is intentional and matches the source file. The original SKILL placeholder specified `.jpg`; PNG was chosen because the source publishes PNG natively (no transcoding loss) and the 7.6 MB size is acceptable for a one-time cached load.
