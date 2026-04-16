---
name: cockpit-integration
description: Integrate the Vattalus Sci-Fi Light Fighter Cockpit (purchased from CGTrader April 16, 2026) into voidexa Free Flight. Use this skill when converting the FBX cockpit to GLB, uploading to Supabase Storage, setting up ship-to-cockpit mapping, or wiring the new cockpit into Free Flight view. Triggers on mentions of "light fighter cockpit", "Vattalus cockpit", "ship cockpit mapping", "cockpit integration", or "new cockpit import" in voidexa context.
---

# Cockpit Integration — Vattalus Light Fighter Cockpit

## Context
User purchased Vattalus Sci-Fi Light Fighter Cockpit ($20 CGTrader, April 16, 2026). Royalty Free License (no AI training clause — commercial game use OK). Intended for all small fighter ships (qs_*) and small USC ships in Free Flight.

**Current cockpit problem:** All ships use generic `hirez_cockpit01_interior.glb` regardless of ship size. Small fighters (qs_challenger etc.) end up with industrial bridge interior — visual mismatch. This skill fixes that for the fighter tier.

## Package Contents
User downloaded and uploaded `cockpit-pack-clean.zip` containing:
- `cockpit.fbx` — 4 meshes: Body, Joystick, ThrottleControl, Glass (355 KB)
- `cockpit_with_seat.fbx` — same as above + separated Seat mesh (390 KB)
- `textures/` — 10 PBR PNG textures (Clean variant only, ~47 MB total):
  - body_albedo.png, body_metallic.png, body_roughness.png, body_normal.png, body_ao.png, body_emissive.png
  - glass_albedo.png (has opacity in alpha channel), glass_metallic.png, glass_roughness.png, glass_ao.png

User will unzip to: `C:\Users\Jixwu\Desktop\voidexa\assets\cockpit-vattalus\`

## Build Phases

### Phase 1: FBX to GLB Conversion (Blender required)
Convert both FBX files to GLB with Draco compression and embedded textures.

**Prerequisites check:**
```powershell
# Check if Blender is installed
blender --version
# If not installed: winget install BlenderFoundation.Blender
```

**Create conversion script at `scripts/convert-cockpit-fbx.py`:**

```python
import bpy
import os
import sys

# Args: input_fbx output_glb textures_dir
input_fbx = sys.argv[sys.argv.index("--") + 1]
output_glb = sys.argv[sys.argv.index("--") + 2]
textures_dir = sys.argv[sys.argv.index("--") + 3]

# Clear default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Import FBX
bpy.ops.import_scene.fbx(filepath=input_fbx)

# Setup PBR materials with PNG textures
def setup_material(mat_name, albedo, metallic, roughness, normal, ao=None, emissive=None):
    if mat_name not in bpy.data.materials:
        return
    mat = bpy.data.materials[mat_name]
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Clear existing nodes except Principled BSDF + Output
    for node in list(nodes):
        if node.type not in ('BSDF_PRINCIPLED', 'OUTPUT_MATERIAL'):
            nodes.remove(node)
    
    bsdf = nodes.get('Principled BSDF')
    output = nodes.get('Material Output')
    if not bsdf:
        bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    
    def add_tex(path, non_color=False):
        tex = nodes.new('ShaderNodeTexImage')
        tex.image = bpy.data.images.load(os.path.join(textures_dir, path))
        if non_color:
            tex.image.colorspace_settings.name = 'Non-Color'
        return tex
    
    if albedo:
        t = add_tex(albedo)
        links.new(t.outputs['Color'], bsdf.inputs['Base Color'])
    if metallic:
        t = add_tex(metallic, non_color=True)
        links.new(t.outputs['Color'], bsdf.inputs['Metallic'])
    if roughness:
        t = add_tex(roughness, non_color=True)
        links.new(t.outputs['Color'], bsdf.inputs['Roughness'])
    if normal:
        t = add_tex(normal, non_color=True)
        normal_node = nodes.new('ShaderNodeNormalMap')
        links.new(t.outputs['Color'], normal_node.inputs['Color'])
        links.new(normal_node.outputs['Normal'], bsdf.inputs['Normal'])
    if emissive:
        t = add_tex(emissive)
        links.new(t.outputs['Color'], bsdf.inputs['Emission Color'])

# Apply Body material to Body, Joystick, ThrottleControl meshes
for mesh_name in ['Body', 'Joystick', 'ThrottleControl']:
    obj = bpy.data.objects.get(mesh_name)
    if obj and obj.data.materials:
        setup_material(
            obj.data.materials[0].name,
            'body_albedo.png',
            'body_metallic.png', 
            'body_roughness.png',
            'body_normal.png',
            emissive='body_emissive.png'
        )

# Glass material
glass_obj = bpy.data.objects.get('Glass')
if glass_obj and glass_obj.data.materials:
    setup_material(
        glass_obj.data.materials[0].name,
        'glass_albedo.png',
        'glass_metallic.png',
        'glass_roughness.png',
        None  # no normal for glass
    )
    # Enable transparency for glass
    glass_obj.data.materials[0].blend_method = 'BLEND'

# Export as GLB with Draco compression
bpy.ops.export_scene.gltf(
    filepath=output_glb,
    export_format='GLB',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_texcoords=True,
    export_normals=True,
    export_materials='EXPORT',
    export_image_format='AUTO',  # JPEG where possible for smaller size
    export_apply=True
)

print(f"Converted {input_fbx} -> {output_glb}")
```

**Run conversion:**
```powershell
cd C:\Users\Jixwu\Desktop\voidexa\assets\cockpit-vattalus
# Convert main cockpit (without seat)
blender --background --python ../../scripts/convert-cockpit-fbx.py -- cockpit.fbx vattalus_fighter_cockpit.glb textures/
# Convert with separated seat
blender --background --python ../../scripts/convert-cockpit-fbx.py -- cockpit_with_seat.fbx vattalus_fighter_cockpit_with_seat.glb textures/
```

Expected output: ~5-10 MB .glb files with embedded textures and Draco compression.

### Phase 2: Upload to Supabase Storage

Create upload script at `scripts/upload-cockpit-to-supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
)

async function upload() {
  const files = [
    { local: 'assets/cockpit-vattalus/vattalus_fighter_cockpit.glb', remote: 'cockpits/vattalus_fighter_cockpit.glb' },
    { local: 'assets/cockpit-vattalus/vattalus_fighter_cockpit_with_seat.glb', remote: 'cockpits/vattalus_fighter_cockpit_with_seat.glb' },
  ]
  
  for (const f of files) {
    const buf = fs.readFileSync(f.local)
    const { data, error } = await supabase.storage
      .from('models')
      .upload(f.remote, buf, { 
        contentType: 'model/gltf-binary',
        upsert: true 
      })
    if (error) {
      console.error(`Upload failed: ${f.remote}`, error)
      continue
    }
    console.log(`Uploaded: ${f.remote}`)
    
    // Register in model_metadata
    const { error: dbError } = await supabase
      .from('model_metadata')
      .upsert({
        slug: path.basename(f.remote, '.glb'),
        category: 'cockpit',
        subcategory: 'fighter',
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/models/${f.remote}`,
        license: 'CGTrader Royalty Free (Vattalus)',
        source: 'CGTrader',
        purchased_at: '2026-04-16',
        polygons: 4169,
      })
    if (dbError) console.error('DB error:', dbError)
  }
}

upload().catch(console.error)
```

**Run:**
```powershell
cd C:\Users\Jixwu\Desktop\voidexa
npx tsx scripts/upload-cockpit-to-supabase.ts
```

### Phase 3: Ship-to-Cockpit Mapping

Create `lib/data/shipCockpits.ts`:

```typescript
export type CockpitType = 'fighter_light' | 'fighter_medium' | 'bridge_command' | 'hirez_generic'

export const SHIP_COCKPIT_MAP: Record<string, CockpitType> = {
  // Small Quaternius fighters → Vattalus Light Fighter
  'qs_bob': 'fighter_light',
  'qs_challenger': 'fighter_light',
  'qs_striker': 'fighter_light',
  'qs_imperial': 'fighter_light',
  'qs_executioner': 'fighter_light',
  'qs_omen': 'fighter_light',
  'qs_spitfire': 'fighter_light',
  
  // Small-to-medium USC → also Vattalus Light Fighter
  'usc_astroeagle01': 'fighter_light',
  'usc_cosmicshark01': 'fighter_light',
  'usc_stellarflare01': 'fighter_light',
  // ... add other small USC ships
  
  // Medium-large USC → Hi-Rez generic (current)
  // Large USCX → Hi-Rez generic (current, until we get medium/bridge cockpits)
}

export const COCKPIT_MODELS: Record<CockpitType, {
  url: string
  withSeat?: string
  scale: number
  offset: [number, number, number]  // position offset from ship origin
  rotation: [number, number, number]
}> = {
  fighter_light: {
    url: 'https://[supabase-url]/storage/v1/object/public/models/cockpits/vattalus_fighter_cockpit.glb',
    withSeat: 'https://[supabase-url]/storage/v1/object/public/models/cockpits/vattalus_fighter_cockpit_with_seat.glb',
    scale: 1.0,
    offset: [0, -0.5, -0.3],  // tune after testing
    rotation: [0, 0, 0],
  },
  fighter_medium: {
    // Placeholder - same as light for now until we get a medium cockpit
    url: 'https://[supabase-url]/storage/v1/object/public/models/cockpits/vattalus_fighter_cockpit.glb',
    scale: 1.3,
    offset: [0, -0.6, -0.4],
    rotation: [0, 0, 0],
  },
  bridge_command: {
    // Placeholder - use Hi-Rez01 scaled up
    url: 'https://[supabase-url]/storage/v1/object/public/models/hirez_cockpit01_interior.glb',
    scale: 1.5,
    offset: [0, -0.8, -1.5],
    rotation: [0, 0, 0],
  },
  hirez_generic: {
    url: 'https://[supabase-url]/storage/v1/object/public/models/hirez_cockpit01_interior.glb',
    scale: 1.0,
    offset: [0, -0.8, -1.5],
    rotation: [0, 0, 0],
  },
}

export function getCockpitForShip(shipSlug: string): CockpitType {
  return SHIP_COCKPIT_MAP[shipSlug] ?? 'hirez_generic'
}
```

**Important:** Replace `[supabase-url]` placeholders with actual Supabase URL from env (use the same pattern as other model URLs in the codebase).

### Phase 4: Wire into Free Flight

Find the Free Flight cockpit view component (likely `components/freeflight/CockpitView.tsx` or similar).

Current pattern probably loads one generic cockpit. Change to:

```typescript
import { getCockpitForShip, COCKPIT_MODELS } from '@/lib/data/shipCockpits'

// Inside the cockpit view component:
const cockpitType = getCockpitForShip(selectedShip.slug)
const cockpit = COCKPIT_MODELS[cockpitType]

// Use cockpit.url for GLTFLoader
// Apply cockpit.offset as position, cockpit.rotation as rotation, cockpit.scale as scale
```

### Phase 5: Test in Free Flight

```powershell
npm run dev
# Navigate to localhost:3000/freeflight
# Select qs_challenger → press V → verify Vattalus light fighter cockpit loads
# Change to uscx_starforce → press V → verify Hi-Rez generic cockpit loads (no change)
# Back to qs_striker → press V → Vattalus cockpit again
```

**Offset tuning:** Initial offset `[0, -0.5, -0.3]` is a guess. After first load, user will tell you if:
- Interior blocks view → adjust `z` more negative (move further back)
- Dashboard too high → adjust `y` more negative (move down)
- Cockpit looks tiny → adjust `scale` up
- Cockpit too big → adjust `scale` down

### Phase 6: Commit and Deploy

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git add .
git commit -m "feat: Vattalus Light Fighter cockpit for qs_* ships"
git push origin main  # auto-deploys via Vercel
```

## Success Criteria

- [ ] vattalus_fighter_cockpit.glb uploaded to Supabase Storage bucket "models/cockpits/"
- [ ] model_metadata table has entries for the 2 new cockpits with license info
- [ ] lib/data/shipCockpits.ts exists and maps all qs_* ships to fighter_light
- [ ] Free Flight uses correct cockpit per selected ship
- [ ] qs_challenger + V → Vattalus cockpit visible, canopy view clear
- [ ] uscx_starforce + V → Hi-Rez cockpit visible (unchanged)
- [ ] Build passes: `npx next build`
- [ ] Deployed: git push origin main succeeded, Vercel auto-deployed

## License Compliance (IMPORTANT)

**DO NOT:**
- Redistribute the cockpit as a standalone asset
- Include source FBX files in public repo
- Upload PSD files or editable source to any public location
- Use the model to train AI systems (explicit clause in license)

**DO:**
- Keep original zip + FBX in `assets/cockpit-vattalus/` (gitignored, local only)
- Only the final compressed .glb (with baked textures) goes to Supabase/production
- Add `assets/cockpit-vattalus/` to `.gitignore`
- Keep purchase receipt from CGTrader as proof of license

## If Blender Not Installed

Fallback: User runs FBX conversion manually in online converter like AnyConv or Assimp viewer. Export as GLB. Then upload manually to Supabase dashboard and register in model_metadata via SQL insert.

## Notes for Future Sessions

- Medium cockpit (USC ships): still using Vattalus Light Fighter scaled 1.3x. Replace when a proper medium cockpit is purchased.
- Bridge/command cockpit (large USCX): still using Hi-Rez generic. Replace when found or built via Assembly Editor.
- Vattalus cockpit has 4 texture variants (Clean, Weathered, Rusty) + 4 glass variants (Clean, Dirty, Scratched, Dirty&Scratched). Currently using Clean for both. Future: let planet-owners pick variant in their customization.
