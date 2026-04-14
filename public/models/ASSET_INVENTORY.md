# 3D Asset Inventory

Generated: 2026-04-14T20:47Z
Last texture rebind: 2026-04-15 (all paid models now have PBR textures bound — see `TEXTURE_FIX_GUIDE.md`).

Location: `public/models/`

Binary assets are gitignored — this file is the authoritative record of what should be on disk. Re-extract from the original zips in `Downloads/` if anything is missing.

Hidden-file note: USC and Hirez packs contain many Adobe Fuse `.fuse_hidden*` tempfiles. They are counted in the totals but excluded from the Formats list; counted separately as "Fuse hidden".

## glb-ready texture status (2026-04-15)

| File | Pack | Images | Textures bound? |
|---|---|---:|---|
| `qs_bob.glb` … `qs_zenith.glb` (11) | Quaternius (CC0) | 1 each | ✅ Baked atlas from source gltf |
| `cockpit_free_seat.glb` | Sketchfab (free) | 30 | ✅ PBR preserved from pack |
| `station_modular_interior.glb` | Sketchfab (free) | 40 | ✅ PBR preserved from pack |
| `hirez_cockpit01.glb` | Hi-Rez (paid) | 4 | ✅ Rebound 2026-04-15 (BaseColor Grey + Normal + Roughness + Emission) |
| `hirez_spaceship01.glb` | Hi-Rez (paid) | 3 | ✅ Rebound 2026-04-15 (BaseColor Grey + Normal + Roughness) |
| `usc_astroeagle01.glb` | USC (paid) | 3 | ✅ Rebound 2026-04-15 |
| `usc_cosmicshark01.glb` | USC (paid) | 4 | ✅ Rebound 2026-04-15 |
| `usc_voidwhale01.glb` | USC (paid) | 3 | ✅ Rebound 2026-04-15 |
| `uscx_galacticokamoto1.glb` | USC Expansion (paid) | 4 | ✅ Rebound 2026-04-15 |
| `uscx_starforce01.glb` | USC Expansion (paid) | 4 | ✅ Rebound 2026-04-15 |

All paid-model rebinds default to the **Grey** color variant. Each pack ships multiple color options (Blue / Red / Silver / Purple / etc.) — see `TEXTURE_FIX_GUIDE.md` for swapping the base color or adding variant glbs.

Paid-model texture-rebind summary: **7 of 7** paid ship/cockpit models in the current test set have working PBR textures.

## ships/paid/usc

- File count: 956
- Formats: db,fbx,png,psd,txt
- Total size: 1439.91 MB

## ships/paid/usc-expansion

- File count: 172
- Formats: fbx,png,psd
- Total size: 174.88 MB

## ships/paid/hirez

- File count: 1308
- Formats: db,obj,png
- Total size: 2144.54 MB

## ships/free/quaternius-spaceships

- File count: 129
- Formats: blend,blend1,fbx,gltf,jpg,mtl,obj,png,txt
- Total size: 295.08 MB

## ships/free/quaternius-space-kit

- File count: 467
- Formats: blend,fbx,gltf,jpg,mtl,obj,png,txt
- Total size: 142.50 MB

## ships/free/quaternius-modular-scifi

- File count: 366
- Formats: blend,fbx,jpg,mtl,obj,txt
- Total size: 53.03 MB

## ships/free/sketchfab

- File count: 103
- Formats: bin,gltf,jpeg,md,png,txt
- Total size: 199.29 MB

### Sketchfab pack breakdown

- `aquaris/` — 3 files, 1.49 MB, formats: bin,gltf,txt
- `bff3-212-cyclone_recreation_2018_archived_work/` — 47 files, 52.69 MB, formats: bin,gltf,jpeg,png,txt
- `files/` — 3 files, 0.05 MB, formats: md
- `galaxy_on_fire_2_-_supernova_dlc_terran_carrier/` — 9 files, 33.16 MB, formats: bin,gltf,jpeg,png,txt
- `lowpoly_spaceships/` — 3 files, 7.22 MB, formats: bin,gltf,txt
- `sci-fi_aircraft__spaceship_fighter/` — 7 files, 41.52 MB, formats: bin,gltf,png,txt
- `ship/` — 6 files, 8.66 MB, formats: bin,gltf,png,txt
- `spaceship/` — 7 files, 38.35 MB, formats: bin,gltf,jpeg,png,txt
- `star_trek_online__eisenberg_class__uss_nog/` — 11 files, 5.07 MB, formats: bin,gltf,png,txt
- `uss_enterprise_refit_battle_damage/` — 7 files, 11.07 MB, formats: bin,gltf,png,txt

## cockpits

- File count: 62
- Formats: bin,gltf,jpeg,png,txt
- Total size: 107.31 MB

## stations

- File count: 43
- Formats: bin,gltf,png,txt
- Total size: 33.96 MB

---

**Grand total:** 3606 files, 4590.50 MB (4.48 GB)

## Source zip mapping

| Zip in Downloads/ | Target folder |
|---|---|
| usc_fbx.zip | ships/paid/usc/ |
| usc_expansion_fbx.zip | ships/paid/usc-expansion/ |
| hirezspaceshipscreator_obj.zip | ships/paid/hirez/ |
| Ultimate Spaceships - May 2021*.zip | ships/free/quaternius-spaceships/ |
| Ultimate Space Kit - March 2023*.zip | ships/free/quaternius-space-kit/ |
| Ultimate Modular Sci-Fi - Feb 2021*.zip | ships/free/quaternius-modular-scifi/ |
| spaceship_cockpit__seat.zip | cockpits/ |
| sci-fi_spaceship_cockpit_02.zip | cockpits/ |
| sci-fi_ship_interior_-_modular_asset_pack.zip | stations/ |
| aquaris.zip | ships/free/sketchfab/aquaris/ |
| bff3-212-cyclone_recreation_2018_archived_work.zip | ships/free/sketchfab/bff3-212-cyclone_recreation_2018_archived_work/ |
| files.zip | ships/free/sketchfab/files/ |
| galaxy_on_fire_2_-_supernova_dlc_terran_carrier.zip | ships/free/sketchfab/galaxy_on_fire_2_-_supernova_dlc_terran_carrier/ |
| lowpoly_spaceships.zip | ships/free/sketchfab/lowpoly_spaceships/ |
| sci-fi_aircraft__spaceship_fighter.zip | ships/free/sketchfab/sci-fi_aircraft__spaceship_fighter/ |
| ship.zip | ships/free/sketchfab/ship/ |
| spaceship.zip | ships/free/sketchfab/spaceship/ |
| star_trek_online__eisenberg_class__uss_nog.zip | ships/free/sketchfab/star_trek_online__eisenberg_class__uss_nog/ |
| uss_enterprise_refit_battle_damage.zip | ships/free/sketchfab/uss_enterprise_refit_battle_damage/ |

## Notes

- Task spec referenced `sci_fi_spaceship_cockpit_02.zip` (underscores); actual file is `sci-fi_spaceship_cockpit_02.zip` (dash) — used the real filename.
- Two Quaternius Spaceships bundles were present (`*-194756Z-*` and `*-195142Z-*`); both extracted into the same folder, identical contents verified by file count.
- All original zips preserved in `C:\Users\Jixwu\Downloads\` — nothing deleted.
