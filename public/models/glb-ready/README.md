# glb-ready — Phase 1 Test Set (textures bound)

Draco-compressed `.glb` files ready to load with `useGLTF` in the voidexa Phase 1-3 build. This is a **test set**, not the final asset library — pick representative models from each pack before committing to full conversion.

Last updated: 2026-04-15 (textures bound on all paid models; full Hi-Rez cockpit set added). Total: 24 files, 160 MB on disk.

## Texture status

| Model | Images | Status |
|---|---:|---|
| qs_bob.glb … qs_zenith.glb (11 files) | 1 each | ✅ Baked atlas from source gltf |
| cockpit_free_seat.glb | 30 | ✅ Sketchfab pack (full PBR) |
| station_modular_interior.glb | 40 | ✅ Sketchfab pack (full PBR) |
| hirez_cockpit01.glb | 4 | ✅ Rebound via MTL patch (BaseColor/Normal/Roughness/Emission) |
| hirez_cockpit02.glb | 4 | ✅ Rebound via MTL patch (BaseColor/Normal/Roughness/Emission) |
| hirez_cockpit03.glb | 4 | ✅ Rebound via MTL patch (BaseColor/Normal/Roughness/Emission) |
| hirez_cockpit04.glb | 4 | ✅ Rebound via MTL patch (BaseColor/Normal/Roughness/Emission) |
| hirez_cockpit05.glb | 4 | ✅ Rebound via MTL patch (BaseColor/Normal/Roughness/Emission) |
| hirez_spaceship01.glb | 3 | ✅ Rebound via MTL patch |
| usc_astroeagle01.glb | 3 | ✅ Rebound via gltf-transform post-process |
| usc_cosmicshark01.glb | 4 | ✅ Rebound via gltf-transform post-process |
| usc_voidwhale01.glb | 3 | ✅ Rebound via gltf-transform post-process |
| uscx_galacticokamoto1.glb | 4 | ✅ Rebound via gltf-transform post-process |
| uscx_starforce01.glb | 4 | ✅ Rebound via gltf-transform post-process |

Every `.glb` in this folder now carries bound PBR textures. See `../TEXTURE_FIX_GUIDE.md` for the rebinding pipeline.

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

### Paid — HiRez Spaceships Creator (5 cockpits + 1 spaceship)

Full cockpit set converted 2026-04-15. All cockpits use Grey base color with the same PBR texture set (BaseColor / Normal / Roughness / Emission) sourced from `Textures/Cockpits/Cockpit<N>/`.

| Output | Source | Size | Textures |
|---|---|---|---|
| `hirez_cockpit01.glb`   | `ships/paid/hirez/Cockpits/Cockpit01.obj`     | 5.5 MB | 4 (Grey) |
| `hirez_cockpit02.glb`   | `ships/paid/hirez/Cockpits/Cockpit02.obj`     | 6.1 MB | 4 (Grey) |
| `hirez_cockpit03.glb`   | `ships/paid/hirez/Cockpits/Cockpit03.obj`     | 6.6 MB | 4 (Grey) |
| `hirez_cockpit04.glb`   | `ships/paid/hirez/Cockpits/Cockpit04.obj`     | 6.1 MB | 4 (Grey) |
| `hirez_cockpit05.glb`   | `ships/paid/hirez/Cockpits/Cockpit05.obj`     | 4.5 MB | 4 (Grey) |
| `hirez_spaceship01.glb` | `ships/paid/hirez/Spaceships/Spaceship01.obj` | 8.4 MB | 3 (Grey, no Emission) |

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
