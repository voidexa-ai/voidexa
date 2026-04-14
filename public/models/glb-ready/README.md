# glb-ready — Phase 1 Test Set

Draco-compressed `.glb` files ready to load with `useGLTF` in the voidexa Phase 1-3 build. This is a **test set**, not the final asset library — pick representative models from each pack before committing to full conversion.

Converted: 2026-04-14. Total: 20 files, 57 MB on disk.

## Conversion pipeline

All files produced with Draco geometry compression, level 7:

- **.gltf → .glb**: `npx gltf-pipeline -i input.gltf -o output.glb --draco.compressionLevel=7`
- **.obj → .glb**: `npx obj2gltf -i input.obj -o intermediate.gltf` → then gltf-pipeline above
- **.fbx → .glb**: `node -e "require('fbx2gltf')(in, out)"` (fbx2gltf v… facebook's wrapper) → then gltf-pipeline above

Tools: `gltf-pipeline`, `obj2gltf`, `fbx2gltf` (all npm packages).

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

Quaternius models retain PBR textures (embedded in source `.gltf`); Draco applies to geometry only.

### Paid — USC (Ultimate Spaceships Creator), 3 different ship types

| Output | Source | Size |
|---|---|---|
| `usc_astroeagle01.glb`   | `ships/paid/usc/USC_FBX/AstroEagle/AstroEagle01.FBX`   | 10 KB |
| `usc_cosmicshark01.glb`  | `ships/paid/usc/USC_FBX/CosmicShark/CosmicShark01.fbx` | 14 KB |
| `usc_voidwhale01.glb`    | `ships/paid/usc/USC_FBX/VoidWhale/VoidWhale01.fbx`     | 80 KB |

### Paid — USC Expansion, 2 ship types

| Output | Source | Size |
|---|---|---|
| `uscx_galacticokamoto1.glb` | `ships/paid/usc-expansion/GalacticOkamoto/GalacticOkamoto1.fbx` | 40 KB |
| `uscx_starforce01.glb`      | `ships/paid/usc-expansion/StarForce/StarForce01.fbx`            | 13 KB |

### Paid — HiRez Spaceships Creator (2 OBJ, one cockpit)

| Output | Source | Size |
|---|---|---|
| `hirez_cockpit01.glb`   | `ships/paid/hirez/Cockpits/Cockpit01.obj`     | 10 KB |
| `hirez_spaceship01.glb` | `ships/paid/hirez/Spaceships/Spaceship01.obj` | 64 KB |

### Cockpit (free, Sketchfab pack)

| Output | Source | Size |
|---|---|---|
| `cockpit_free_seat.glb` | `cockpits/scene.gltf` | 16 MB |

Corresponds to Sketchfab "Spaceship Cockpit + Seat" pack. Licensing per `public/models/cockpits/license.txt`.

### Station (free, Sketchfab pack)

| Output | Source | Size |
|---|---|---|
| `station_modular_interior.glb` | `stations/scene.gltf` | 10 MB |

Corresponds to Sketchfab "Sci-Fi Ship Interior — Modular Asset Pack". Licensing per `public/models/stations/license.txt`.

## Important caveats

- **USC / USC-Expansion / HiRez outputs are untextured.** The source FBX and OBJ files reference `.mtl` and texture assets that are organized in separate sibling folders (e.g., `hirez/Textures/`). Neither `fbx2gltf` nor `obj2gltf` resolves those bindings automatically. For final integration, rebind textures in Blender or via a custom conversion script before distributing.
- **Quaternius, cockpit, and station outputs retain textures** (source `.gltf` already bundled or referenced them; conversion preserved the bundle).
- **No LOD variants produced yet.** Each output is a single high-detail mesh. See `.claude/skills/3d-asset-pipeline/SKILL.md` for the LOD tier requirements (`_high` / `_med` / `_low` suffixes) before shipping to runtime.
- **.glb magic number verified** (`glTF` header present at offset 0) on all outputs.

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

## Not touched

Only files inside `public/models/glb-ready/` were created. No changes to `components/`, source model folders, or any other repo path.
