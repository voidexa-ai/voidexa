---
name: 3d-asset-pipeline
description: Manage the voidexa 3D asset library for Free Flight and Star System. Use this skill when adding new ship/cockpit/station models, converting FBX/OBJ to Draco-compressed .glb, regenerating public/models/ASSET_INVENTORY.md, deciding LOD tiers for a new asset, or organizing a new asset pack into the public/models/ folder tree. Triggers on any mention of "add ship model", "convert FBX", "new spaceship asset", "Draco compression", "asset inventory", "model LOD", "cockpit model", "station model", or any .glb/.fbx/.obj/.blend import into voidexa.
---

# 3D Asset Pipeline — voidexa Star System

## Context
voidexa Phase 1-3 build (Star Map premium + Galaxy View + Free Flight) consumes Draco-compressed `.glb` models for ships, cockpits, and stations. Source packs arrive as `.zip` archives containing `.fbx`, `.obj`, `.blend`, or raw `.gltf+.bin` under `public/models/`. This skill is the single source of truth for how those assets are organized, converted, and tracked.

Repo paths are absolute Windows paths: `C:\Users\Jixwu\Desktop\voidexa\public\models\`.
The mounted Linux path (for cowork sessions) is `/sessions/brave-inspiring-rubin/mnt/voidexa/public/models/`.

## Non-negotiable rules
1. **Never commit binary asset files.** `.gitignore` excludes `public/models/ships/`, `public/models/cockpits/`, `public/models/stations/`. Only `ASSET_INVENTORY.md` is tracked.
2. **Never delete the original zips** in `C:\Users\Jixwu\Downloads\`. They are the canonical source.
3. **Never alter the existing Level 2 star map** — see voidexa `CLAUDE.md` Star System section.
4. **Draco compression is mandatory** for any model loaded at runtime via `useGLTF`. Raw `.glb` without Draco is acceptable only in source staging folders.
5. **LOD is mandatory** for ship models. See "LOD tiers" below.
6. **No pay-to-win.** Paid USC/Hirez models are cosmetics or achievement-only — never with better stats than free ships.

## Folder convention (authoritative)

```
public/models/
├── ASSET_INVENTORY.md         ← tracked in git, regenerate after changes
├── ships/
│   ├── paid/
│   │   ├── usc/               ← Ultimate Spaceships Creator (FBX source)
│   │   ├── usc-expansion/     ← USC Expansion pack (FBX source)
│   │   └── hirez/             ← HiRez Spaceship Creator (OBJ source)
│   └── free/
│       ├── quaternius-spaceships/    ← Quaternius "Ultimate Spaceships" May 2021
│       ├── quaternius-space-kit/     ← Quaternius "Ultimate Space Kit" March 2023
│       ├── quaternius-modular-scifi/ ← Quaternius "Ultimate Modular Sci-Fi" Feb 2021
│       └── sketchfab/                ← one subfolder per Sketchfab pack
├── cockpits/                  ← first-person cockpit interiors
└── stations/                  ← space station interiors / exteriors
```

Inside each source folder, a `converted/` subfolder holds the Draco `.glb` files that the app actually loads:

```
ships/paid/usc/
├── USC_FBX/…              (source FBX — never loaded at runtime)
└── converted/
    ├── astroeagle.glb      ← Draco, ready for useGLTF
    ├── astroeagle_med.glb  ← medium LOD (100–500m)
    └── astroeagle_low.glb  ← billboard LOD (> 500m)
```

Anything the app imports must live under a `converted/` subfolder. The app never loads directly from the raw FBX/OBJ/blend source folders.

## Source pack provenance (current state as of 2026-04-14)

| Pack | License | Naming prefix | Use in app |
|---|---|---|---|
| USC (Ultimate Spaceships Creator) | Paid, per-seat | `usc_*.glb` | Premium skins, achievement ships |
| USC Expansion | Paid, per-seat | `uscx_*.glb` | Premium skins |
| HiRez Spaceship Creator | Paid, per-seat | `hirez_*.glb` | Premium/cinematic |
| Quaternius Ultimate Spaceships | CC0 | `qs_*.glb` | Default fighter/cruiser/battleship |
| Quaternius Space Kit | CC0 | `qk_*.glb` | Stations, props, asteroid detail |
| Quaternius Modular Sci-Fi | CC0 | `qm_*.glb` | Interiors, modular station parts |
| Sketchfab (various) | Check per-model LICENSE file | keep original slug | Experimental, one-off |

Per-model license files (sketchfab packs especially) are inside the pack folder. Do not move them — they document redistribution rights.

## Conversion workflow

### FBX / OBJ → .gltf
```bash
# Requires Blender CLI or FBX2glTF
FBX2glTF --input ship.fbx --output ship.gltf --khr-materials-unlit --draco
```

### .gltf → Draco-compressed .glb
```bash
npx gltf-pipeline -i ship.gltf -o ship.glb --draco.compressionLevel 7
```

Typical size target after Draco level 7: **1–5 MB for a fighter, 5–15 MB for a capital ship, <1 MB for a LOD billboard.**

### Validation
Load the `.glb` in a test page via `useGLTF('/models/ships/free/quaternius-spaceships/converted/qs_fighter.glb')`. Check:
- Geometry renders without missing materials
- File size is reasonable (see targets above)
- No console warnings about missing Draco loader

### Batch conversion
Prefer a single Blender headless script over hand-invoking CLIs. Keep the script next to the source pack:

```
ships/free/quaternius-spaceships/
└── convert_all.py          # blender --background --python convert_all.py
```

Commit conversion scripts (they are text). Never commit the `.glb` output.

## LOD tiers

Defined in `docs/SKILL_STAR_SYSTEM_PHASE1-3.md` Step 3.1. Must hold for every ship:

| LOD | Distance | Triangle budget | Filename suffix |
|---|---|---|---|
| High | < 100 m | full detail (10k–50k) | `_high.glb` or no suffix |
| Med | 100–500 m | ~25% (2.5k–12k) | `_med.glb` |
| Low | > 500 m | billboard or <500 tris | `_low.glb` |

Ship loader (`components/freeflight/ships/ShipModel.tsx`) selects LOD via camera distance. If only one LOD exists, falls back to high — acceptable for capital ships or static scenery but never for NPC swarms (use InstancedMesh).

## Adding a new asset pack — checklist

1. Drop the zip into `C:\Users\Jixwu\Downloads\` (never delete existing zips)
2. Decide folder:
   - Ship model → `ships/paid/<vendor>/` or `ships/free/<slug>/` (sketchfab packs: `ships/free/sketchfab/<slug>/`)
   - Cockpit → `cockpits/`
   - Station interior/exterior → `stations/`
3. Unzip (see `regenerate-inventory.ps1` for the canonical extraction pattern)
4. Check license file in the extracted pack — record in inventory table
5. Pick 1–3 representative models from the pack to convert first; defer the rest until needed
6. Convert chosen models to Draco `.glb` under `converted/`, generate LODs
7. Regenerate `ASSET_INVENTORY.md` via `regenerate-inventory.ps1`
8. Commit: only `.gitignore` changes, `ASSET_INVENTORY.md`, and any new conversion scripts — never the binaries

## Regenerating the inventory

Run from PowerShell in repo root:

```powershell
pwsh .claude/skills/3d-asset-pipeline/regenerate-inventory.ps1
```

The script walks `public/models/`, counts files, sums sizes, lists real file extensions (filters out Adobe Fuse `.fuse_hidden*` pseudo-extensions), and overwrites `public/models/ASSET_INVENTORY.md`. It is idempotent and safe to re-run.

## Known gotchas

- **USC and HiRez packs contain Adobe Fuse `.fuse_hidden*` files** — these are hidden Fuse tempfiles, not real assets. Count them but keep them out of the Formats list. The inventory script handles this.
- **Mount filesystem blocks unlinks** when working via cowork mount (not native Windows). Git operations leave stale `.git/*.lock` files that require Windows-side cleanup. Prefer native PowerShell for git operations on this repo.
- **Two Quaternius Spaceships bundles arrived in the initial download** (both timestamped May 2021, different server timestamps `194756Z` vs `195142Z`). They contain identical files — extract either one.
- **Task specs may contain underscores where filenames use dashes** (`sci_fi_…` vs `sci-fi_…`). Always verify against `Get-ChildItem`.
- **Original zip size vs extracted size**: USC/HiRez compress ~40% (1.2 GB zip → 1.4 GB on disk; 1.3 GB zip → 2.1 GB on disk). Leave disk headroom.

## Related files
- `docs/SKILL_STAR_SYSTEM_PHASE1-3.md` — how assets feed into Phase 1-3 build
- `docs/VOIDEXA_STAR_SYSTEM_COMPLETE_PLAN_v1.2_FINAL.md` — master spec
- `public/models/ASSET_INVENTORY.md` — current inventory snapshot
- `.gitignore` — binary exclusion rules
- `.claude/skills/3d-asset-pipeline/regenerate-inventory.ps1` — inventory script
