# glb-ready — Phase 1 Test Set (textures bound)

Draco-compressed `.glb` files ready to load with `useGLTF` in the voidexa Phase 1-3 build. This is a **test set**, not the final asset library — pick representative models from each pack before committing to full conversion.

Last updated: 2026-04-15 (full conversion of every paid + free pack — 689 files, 6.8 GB on disk).

## Inventory by prefix

| Prefix | Count | Source pack | Texture status |
|---|---:|---|---|
| `usc_` | 347 | Ultimate Spaceships Creator (paid FBX) | ✅ All carry PBR textures (Grey base) — rebound via fbx2gltf + gltf-transform |
| `uscx_` | 58 | USC Expansion (paid FBX) | ✅ All carry PBR textures (Grey base) |
| `hirez_` | 88 | HiRez Spaceship Creator (paid OBJ) | ✅ All carry PBR textures (Grey base) — see breakdown below |
| `qsk_` | 92 | Quaternius Ultimate Space Kit (CC0 gltf) | ✅ Material colors via `baseColorFactor` (no PNG textures by pack design) |
| `qmsf_` | 91 | Quaternius Ultimate Modular Sci-Fi (CC0 OBJ) | ✅ Material colors via `baseColorFactor` (no PNG textures by pack design) |
| `qs_` | 11 | Quaternius Ultimate Spaceships (CC0 gltf) | ✅ 1 baked atlas per ship |
| `cockpit_free_seat` | 1 | Sketchfab "Spaceship Cockpit + Seat" (CC) | ✅ 30 PBR textures |
| `station_modular_interior` | 1 | Sketchfab "Sci-Fi Ship Interior" (CC) | ✅ 40 PBR textures |
| **Total** | **689** | | **6.8 GB on disk** |

**100% of paid-model glbs** (USC 347 + USCX 58 + Hirez 88 = **493 files**) now carry ≥ 2 PBR texture images. The Quaternius packs (qsk + qmsf + qs = 194 files) use Blender material-color exports — `baseColorFactor` instead of PNG textures — so they don't appear "textured" in image audits but render correctly.

See `../TEXTURE_FIX_GUIDE.md` for the rebinding pipeline. Default base color across every paid model: **Grey** (override per ship by re-running `add_textures.mjs` with a different color preference).

### Hi-Rez breakdown (88 files)

| Subset | Count | Notes |
|---|---:|---|
| Cockpits (exterior) | 5 | `hirez_cockpit01..05.glb` |
| Cockpit interiors + dressing | 7 | `hirez_cockpit01_interior..05_interior.glb` + `hirez_equipments.glb` + `hirez_screens.glb` |
| Engines | 11 | `hirez_engine01..11.glb` |
| Thrusters | 8 | `hirez_thruster01..08.glb` (shared Thrusters_BaseColor + Emission set) |
| MainBodies | 16 | `hirez_mainbody01..16.glb` |
| Wings | 9 | `hirez_wing01..09.glb` (Wing05/06 fall back to Black base — pack lacks Grey) |
| Spaceships (exterior) | 1 | `hirez_spaceship01.glb` |
| Spaceships (with interior, full) | 24 | `hirez_ship01_full..24_full.glb` (rotates MainBody1..16 textures for visual variety) |
| Weapons | 7 | `hirez_weapon_biglauncher`, `_bigmachinegun`, `_blaster`, `_missile`, `_smalllauncher`, `_smallmachinegun`, `_trilauncher` |

## Conversion pipeline

All files produced with Draco geometry compression, level 7:

- **.gltf → .glb**: `npx gltf-pipeline -i input.gltf -o output.glb --draco.compressionLevel=7`
- **.obj → .glb**: `obj2gltf -i input.obj -o intermediate.gltf` → `gltf-pipeline` for Draco
- **.fbx → .glb**: `fbx2gltf in.fbx out.glb` → `gltf-transform` post-process to attach textures → `gltf-pipeline` for Draco

## File manifest

### Free (CC0) — Quaternius "Ultimate Spaceships" May 2021 (11 ships)

| Output | Source | Size |
|---|---|---|
| `qs_bob.glb`          | `ships/free/quaternius-spaceships/.../Bob/glTF/Bob.gltf`                 | 2.6 MB |
| `qs_challenger.glb`   | `ships/free/quaternius-spaceships/.../Challenger/glTF/Challenger.gltf`   | 3.3 MB |
| `qs_dispatcher.glb`   | `ships/free/quaternius-spaceships/.../Dispatcher/glTF/Dispatcher.gltf`   | 2.2 MB |
| `qs_executioner.glb`  | `ships/free/quaternius-spaceships/.../Executioner/glTF/Executioner.gltf` | 3.0 MB |
| `qs_imperial.glb`     | `ships/free/quaternius-spaceships/.../Imperial/glTF/Imperial.gltf`       | 3.1 MB |
| `qs_insurgent.glb`    | `ships/free/quaternius-spaceships/.../Insurgent/glTF/Insurgent.gltf`     | 2.1 MB |
| `qs_omen.glb`         | `ships/free/quaternius-spaceships/.../Omen/glTF/Omen.gltf`               | 3.1 MB |
| `qs_pancake.glb`      | `ships/free/quaternius-spaceships/.../Pancake/glTF/Pancake.gltf`         | 3.2 MB |
| `qs_spitfire.glb`     | `ships/free/quaternius-spaceships/.../Spitfire/glTF/Spitfire.gltf`       | 3.2 MB |
| `qs_striker.glb`      | `ships/free/quaternius-spaceships/.../Striker/glTF/Striker.gltf`         | 1.8 MB |
| `qs_zenith.glb`       | `ships/free/quaternius-spaceships/.../Zenith/glTF/Zenith.gltf`           | 3.2 MB |

### Paid — USC (Ultimate Spaceships Creator), 3 different ship types

Base color set to **Grey**. Each ship's Textures/ folder contains many color variants; swap by rebuilding with a different base in `TEXTURE_FIX_GUIDE.md`.

| Output | Source | Size | Textures |
|---|---|---|---|
| `usc_astroeagle01.glb`   | `ships/paid/usc/USC_FBX/AstroEagle/AstroEagle01.FBX`   | 15 MB | BaseColor (Grey), Metallic, Normal |
| `usc_cosmicshark01.glb`  | `ships/paid/usc/USC_FBX/CosmicShark/CosmicShark01.fbx` | 12 MB | BaseColor (Grey), Metallic, Normal, Emission |
| `usc_voidwhale01.glb`    | `ships/paid/usc/USC_FBX/VoidWhale/VoidWhale01.fbx`     | 17 MB | BaseColor (Grey), Metallic, Normal |

### Paid — USC Expansion, 2 ship types

| Output | Source | Size | Textures |
|---|---|---|---|
| `uscx_galacticokamoto1.glb` | `ships/paid/usc-expansion/GalacticOkamoto/GalacticOkamoto1.fbx` | 20 MB | BaseColor (Grey), Metallic, Normal, Emission |
| `uscx_starforce01.glb`      | `ships/paid/usc-expansion/StarForce/StarForce01.fbx`            | 3.6 MB | BaseColor (Grey), Metallic, Normal, Emission |

### Paid — HiRez Spaceships Creator

Full pack converted 2026-04-15. All Hi-Rez models default to **Grey** base color via the MTL-patch + Draco-compress pipeline (see `../TEXTURE_FIX_GUIDE.md`).

#### Cockpits — exterior only (5)

| Output | Source | Size | Textures |
|---|---|---|---|
| `hirez_cockpit01.glb` | `Cockpits/Cockpit01.obj` | 5.5 MB | 4 |
| `hirez_cockpit02.glb` | `Cockpits/Cockpit02.obj` | 6.1 MB | 4 |
| `hirez_cockpit03.glb` | `Cockpits/Cockpit03.obj` | 6.6 MB | 4 |
| `hirez_cockpit04.glb` | `Cockpits/Cockpit04.obj` | 6.1 MB | 4 |
| `hirez_cockpit05.glb` | `Cockpits/Cockpit05.obj` | 4.5 MB | 4 |

#### Cockpits — with interior detail (5 + dressing)

Use these inside the FPV cockpit camera. Material name in source OBJs is `None` (interiors) and `(null)` (Equipments / Screens).

| Output | Source | Size | Textures |
|---|---|---|---|
| `hirez_cockpit01_interior.glb` | `Cockpits/WithInterior/Cockpit01Interior.obj` | 6.6 MB | 3 |
| `hirez_cockpit02_interior.glb` | `Cockpits/WithInterior/Cockpit02Interior.obj` | 7.3 MB | 3 |
| `hirez_cockpit03_interior.glb` | `Cockpits/WithInterior/Cockpit03Interior.obj` | 7.1 MB | 3 |
| `hirez_cockpit04_interior.glb` | `Cockpits/WithInterior/Cockpit04Interior.obj` | 7.7 MB | 3 |
| `hirez_cockpit05_interior.glb` | `Cockpits/WithInterior/Cockpit05Interior.obj` | 7.0 MB | 3 |
| `hirez_equipments.glb`         | `Cockpits/WithInterior/Equipments.obj`        | 7.6 MB | 3 |
| `hirez_screens.glb`            | `Cockpits/WithInterior/Screens.obj`           | 3.5 MB | 2 (BaseColor + Emission combined) |

#### Complete ships with interior (24)

Each ship uses a single material slot; the pipeline rotates through `MainBody1`–`MainBody16` Grey/Normal/Roughness/Metallic textures so consecutive ships look visually distinct (`Spaceship01 → MainBody1`, `Spaceship02 → MainBody2`, …, wrap on 17). Sub-meshes (cockpit / engines / wings) inherit the hull skin — Blender pass needed if you want per-mesh PBR sets.

| Output | Source | Size | Textures |
|---|---|---|---|
| `hirez_ship01_full.glb` … `hirez_ship24_full.glb` | `Spaceships/WithInterior/Spaceship01.obj` … `Spaceship24.obj` | 6.5–8.7 MB each | 3 each (avg 7.9 MB) |

#### Weapons (7)

| Output | Source | Size | Textures |
|---|---|---|---|
| `hirez_weapon_biglauncher.glb`     | `Weapons/BigLauncher.obj`     | 6.9 MB | 3 |
| `hirez_weapon_bigmachinegun.glb`   | `Weapons/BigMachineGun.obj`   | 9.9 MB | 3 |
| `hirez_weapon_blaster.glb`         | `Weapons/Blaster.obj`         | 7.5 MB | 3 |
| `hirez_weapon_missile.glb`         | `Weapons/Missile.obj`         | 6.8 MB | 3 |
| `hirez_weapon_smalllauncher.glb`   | `Weapons/SmallLauncher.obj`   | 7.8 MB | 3 |
| `hirez_weapon_smallmachinegun.glb` | `Weapons/SmallMachineGun.obj` | 6.9 MB | 3 |
| `hirez_weapon_trilauncher.glb`     | `Weapons/TriLauncher.obj`     | 7.3 MB | 3 |

#### Spaceships — exterior only (1)

| Output | Source | Size | Textures |
|---|---|---|---|
| `hirez_spaceship01.glb` | `Spaceships/Spaceship01.obj` | 8.4 MB | 3 (Grey, no Emission) |

### Cockpit (free, Sketchfab pack)

| Output | Source | Size |
|---|---|---|
| `cockpit_free_seat.glb` | `cockpits/scene.gltf` | 16 MB |

### Station (free, Sketchfab pack)

| Output | Source | Size |
|---|---|---|
| `station_modular_interior.glb` | `stations/scene.gltf` | 10 MB |

## Loading example (React Three Fiber)

```tsx
import { useGLTF } from '@react-three/drei';

// Note: drei/three needs the DracoLoader configured to decompress Draco geometry.
// See existing loader setup in components/starmap/ (or add one if absent).
export function StrikerShip() {
  const { scene } = useGLTF('/models/glb-ready/qs_striker.glb');
  return <primitive object={scene} />;
}
```

## Notes

- All paid models defaulted to the **Grey** color variant. To use a different variant (Red/Blue/Green/Silver/etc.), re-run the post-processing pipeline with a different base color — see `../TEXTURE_FIX_GUIDE.md`.
- USC/Hirez packs still lack Specular/Glossiness on the rebound models — glTF uses Metallic/Roughness instead. Visually close; rebuilding with explicit Specular extension is documented in the guide.
- Metallic and Roughness are currently separate textures on USC ships; combining them into a single MetallicRoughness PBR texture (G channel = roughness, B channel = metallic) would cut file size by ~30%. See guide for the channel-packing workflow.
- No LOD variants produced yet. Each output is a single high-detail mesh.
