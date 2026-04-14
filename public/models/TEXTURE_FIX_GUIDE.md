# Texture Fix Guide — voidexa 3D assets

How the paid 3D models (USC, USC-Expansion, Hi-Rez) got their textures rebound after fbx2gltf / obj2gltf dropped them, and how to redo it for additional models.

Last updated: 2026-04-15. Pipeline run: 7 paid models rebound, all outputs in `public/models/glb-ready/`.

## The problem

- USC `.FBX` files reference textures by Unity-style material names, not embedded paths. `fbx2gltf --embed` produces a valid `.glb` with 1 material but 0 images and 0 textures.
- Hi-Rez `.OBJ` files reference a `.mtl` file that does not ship with the pack. `obj2gltf` therefore emits geometry only.
- Quaternius `.gltf` files include their own bundled textures — they convert cleanly and don't need this workflow.

Textures exist on disk alongside the source models:

| Pack | Texture folder pattern | File layout |
|---|---|---|
| USC | `ships/paid/usc/USC_FBX/<ShipName>/Textures/` | `<ShipName>_{Color}.png` + `<ShipName>_Normal.png` etc. |
| USC Expansion | `ships/paid/usc-expansion/<ShipName>/Textures/` | Same convention |
| Hi-Rez | `ships/paid/hirez/Textures/<Category>/<Part><N>/` | `<Part><N>_{Color}.png` + shared PBR maps |

Default base color used during the 2026-04-15 run: **Grey**. Every pack ships multiple color variants; pick one per ship at build time.

## Required tools (pure-Node, no Blender)

```bash
npm install -g fbx2gltf obj2gltf gltf-pipeline @gltf-transform/core @gltf-transform/functions
```

`fbx2gltf` ships a native Linux binary — it needs a 64-bit Linux host. On Windows use WSL.

No Blender, no Maya, no commercial licenses required.

## Pipeline A — OBJ (Hi-Rez)

The Hi-Rez pack uses the string literal `usemtl None` for every mesh. You supply the missing `Cockpit01.mtl` with a material named `None` pointing at the texture files you want bound.

1. **Copy the source OBJ and chosen textures into a staging directory.** Never mutate the source files.

   ```bash
   STAGE=/tmp/stage/cockpit01
   mkdir -p "$STAGE/textures"
   cp public/models/ships/paid/hirez/Cockpits/Cockpit01.obj "$STAGE/Cockpit01.obj"

   # Pick the color variant you want (Grey shown)
   TEX=public/models/ships/paid/hirez/Textures/Cockpits/Cockpit1
   cp "$TEX/Cockpit1_Grey.png"      "$STAGE/textures/Cockpit01_BaseColor.png"
   cp "$TEX/Cockpit1_Normal.png"    "$STAGE/textures/Cockpit01_Normal.png"
   cp "$TEX/Cockpit1_Roughness.png" "$STAGE/textures/Cockpit01_Roughness.png"
   cp "$TEX/Cockpit1_Emission.png"  "$STAGE/textures/Cockpit01_Emission.png"
   ```

2. **Write the MTL.** Material name MUST match what's in the `.obj` (check with `grep usemtl`).

   ```
   newmtl None
   Ka 1.000 1.000 1.000
   Kd 1.000 1.000 1.000
   Ks 0.500 0.500 0.500
   Ns 250
   illum 2
   map_Kd textures/Cockpit01_BaseColor.png
   map_Bump textures/Cockpit01_Normal.png
   map_Ns textures/Cockpit01_Roughness.png
   map_Ke textures/Cockpit01_Emission.png
   ```

3. **Convert + Draco-compress.**

   ```bash
   npx obj2gltf -i "$STAGE/Cockpit01.obj" -o "$STAGE/interim.gltf"
   npx gltf-pipeline -i "$STAGE/interim.gltf" -o public/models/glb-ready/hirez_cockpit01.glb --draco.compressionLevel=7
   ```

4. **Verify.**

   ```bash
   node -e "
   const buf = require('fs').readFileSync('public/models/glb-ready/hirez_cockpit01.glb');
   const l = buf.readUInt32LE(12);
   const j = JSON.parse(buf.slice(20, 20+l).toString());
   console.log('images:', (j.images||[]).length, 'textures:', (j.textures||[]).length);
   "
   # Expect: images: 4 textures: 4
   ```

## Pipeline B — FBX (USC / USC-Expansion)

Two stages: fbx2gltf first, then a gltf-transform post-pass attaches textures to the empty PBR material.

1. **Convert FBX → glb (untextured).**

   ```bash
   # Drop into your conversion project (where fbx2gltf was npm-installed):
   cat > fbx_to_glb.cjs <<'EOF'
   const convert = require('fbx2gltf');
   convert(process.argv[2], process.argv[3]).then(
     () => process.exit(0),
     (e) => { console.error(e); process.exit(1); }
   );
   EOF
   node fbx_to_glb.cjs \
     public/models/ships/paid/usc/USC_FBX/AstroEagle/AstroEagle01.FBX \
     /tmp/astroeagle01_raw.glb
   ```

2. **Post-process with `@gltf-transform`.** Looks for `<Prefix>_{Grey|Silver|White|Blue}.png` as base color (first match wins), `<Prefix>_Normal.png`, `<Prefix>_Metallic.png`, `<Prefix>_Roughness.png`, `<Prefix>_Emission.png`.

   ```js
   // add_textures.mjs
   import { NodeIO } from '@gltf-transform/core';
   import fs from 'node:fs/promises';
   import path from 'node:path';

   const [, , inGlb, outGlb, textureDir, prefix] = process.argv;
   const io = new NodeIO();
   const doc = await io.read(inGlb);
   const root = doc.getRoot();
   const load = async (n) => {
     try { return await fs.readFile(path.join(textureDir, `${prefix}_${n}.png`)); }
     catch { return null; }
   };

   async function baseColor() {
     for (const c of ['Grey', 'Silver', 'White', 'Blue']) {
       const buf = await load(c);
       if (buf) return { buf, name: c };
     }
     return null;
   }
   const tex = (buf, label) =>
     doc.createTexture(`${prefix}_${label}`).setMimeType('image/png').setImage(buf);

   const bc  = await baseColor();
   const nr  = await load('Normal');
   const me  = await load('Metallic');
   const ro  = await load('Roughness');
   const em  = await load('Emission');

   for (const mat of root.listMaterials()) {
     if (bc) mat.setBaseColorTexture(tex(bc.buf, bc.name));
     if (nr) mat.setNormalTexture(tex(nr, 'Normal'));
     if (me) { mat.setMetallicRoughnessTexture(tex(me, 'Metallic')); mat.setMetallicFactor(1); mat.setRoughnessFactor(1); }
     else if (ro) { mat.setMetallicRoughnessTexture(tex(ro, 'Roughness')); mat.setMetallicFactor(0.5); mat.setRoughnessFactor(1); }
     if (em) { mat.setEmissiveTexture(tex(em, 'Emission')); mat.setEmissiveFactor([1,1,1]); }
   }
   await io.write(outGlb, doc);
   console.log(`wrote ${outGlb}; base=${bc?.name}`);
   ```

   Run:

   ```bash
   node add_textures.mjs \
     /tmp/astroeagle01_raw.glb \
     /tmp/astroeagle01_textured.glb \
     public/models/ships/paid/usc/USC_FBX/AstroEagle/Textures \
     AstroEagle
   ```

3. **Draco compress.**

   ```bash
   npx gltf-pipeline \
     -i /tmp/astroeagle01_textured.glb \
     -o public/models/glb-ready/usc_astroeagle01.glb \
     --draco.compressionLevel=7
   ```

## Changing the base color variant

USC / USC-Expansion ships ship with many color variants (Blue, Red, Purple, Aqua, etc.). Edit `baseColor()` in `add_textures.mjs` to prefer a different color, or convert once per variant and save as `usc_astroeagle01_blue.glb` / `_red.glb` / etc.

Hi-Rez variant swap: change which `Cockpit1_{Color}.png` is copied to `Cockpit01_BaseColor.png` in the staging step.

## Channel-packing Metallic + Roughness (optional optimization)

PBR glTF wants a single `metallicRoughness` texture with roughness in the G channel and metallic in the B channel. The rebound USC models currently ship `Metallic.png` AS the combined texture — visually correct but not optimal. To pack properly:

```bash
# Requires sharp or imagemagick
node -e "
const sharp = require('sharp');
(async () => {
  const r = await sharp('Roughness.png').extractChannel(0).toBuffer();
  const m = await sharp('Metallic.png').extractChannel(0).toBuffer();
  // compose: G=r, B=m, R=0xff, A=0xff
  await sharp({ create: { width: 2048, height: 2048, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 255 } } })
    .joinChannel([r, m])
    .png().toFile('MetallicRoughness.png');
})();
"
```

Then use `MetallicRoughness.png` as the metallicRoughnessTexture and skip the `else if` branch in the post-processor.

## Specular-Glossiness fallback (if you need it)

Some engines prefer the legacy Specular/Glossiness workflow. USC ships include `_Specular.png` and `_Glossiness.png` — to use them, install and apply the `KHR_materials_pbrSpecularGlossiness` extension via `@gltf-transform/extensions`. glTF's specification deprecates this extension, so prefer Metallic/Roughness unless you have a specific renderer requirement.

## Known limitations

- **fbx2gltf discards bone animations** from packs that use them (none of the voidexa paid packs have animations, but worth noting for future purchases).
- **Color choice is global per build** — no per-instance color tinting yet. For in-game customization, shader-level color replacement is cheaper than shipping N glbs.
- **LOD variants still missing.** Rebound textures inflate memory; `_med` and `_low` LODs with downscaled textures (1K/512) are a Phase 1-3 pre-build task. See `.claude/skills/3d-asset-pipeline/SKILL.md` for the LOD tier rules.

## Mount-specific gotchas

When running the pipeline through a cowork mount rather than the native Windows filesystem:

- `gltf-pipeline` and `obj2gltf` stream their output to the mount via `fs.createWriteStream`, which the mount drops (file ends up 0 bytes). Work in `/tmp` then `cp` the final glb to `public/models/glb-ready/` — `cp` works on the mount, the streaming writes don't.
- fbx2gltf's native binary also streams — same workaround.
- git `.git/*.lock` files can't be removed from the mount. Run `Get-ChildItem .git -Recurse -Filter "*.lock" -Force | Remove-Item -Force` in native PowerShell if commits start failing.

## Files produced on 2026-04-15

All 7 paid models rebound with Grey base color:

| glb | Pack | Images | Size |
|---|---|---:|---:|
| `hirez_cockpit01.glb` | Hi-Rez | 4 | 5.5 MB |
| `hirez_spaceship01.glb` | Hi-Rez | 3 | 8.4 MB |
| `usc_astroeagle01.glb` | USC | 3 | 15 MB |
| `usc_cosmicshark01.glb` | USC | 4 | 12 MB |
| `usc_voidwhale01.glb` | USC | 3 | 17 MB |
| `uscx_galacticokamoto1.glb` | USC Expansion | 4 | 20 MB |
| `uscx_starforce01.glb` | USC Expansion | 4 | 3.6 MB |

Next step when extending the test set to more ships: copy the `add_textures.mjs` invocation from step 2 above and swap in the new ship's prefix + Textures path.
