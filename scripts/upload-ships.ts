// scripts/upload-ships.ts
//
// Uploads variant-01 of each USC + USCX ship type to Supabase Storage bucket
// "models" and registers them in public.models + public.model_metadata.
// Skips files >25MB. Idempotent via slug upsert.
//
// Usage:
//   npx tsx scripts/upload-ships.ts

import { createClient } from '@supabase/supabase-js'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { NodeIO, type Primitive } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'
import draco3d from 'draco3dgltf'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const GLB_DIR = join(process.cwd(), 'public/models/glb-ready')
const MAX_SIZE_BYTES = 25 * 1024 * 1024

// Ship types to upload (variant 01 / base only).
const SHIPS: Array<{ slug: string; filename: string; displayName: string; category: string; subcategory: string }> = [
  // USC
  { slug: 'usc_astroeagle01', filename: 'usc_astroeagle01.glb', displayName: 'Astro Eagle', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_cosmicshark01', filename: 'usc_cosmicshark01.glb', displayName: 'Cosmic Shark', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_craizanstar01', filename: 'usc_craizanstar01.glb', displayName: 'Craizan Star', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_flyinginsect01', filename: 'usc_flyinginsect01.glb', displayName: 'Flying Insect', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_forcebadger01', filename: 'usc_forcebadger01.glb', displayName: 'Force Badger', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_galacticleopard1', filename: 'usc_galacticleopard1.glb', displayName: 'Galactic Leopard', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_galaxyraptor01', filename: 'usc_galaxyraptor01.glb', displayName: 'Galaxy Raptor', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_genericspaceship01', filename: 'usc_genericspaceship01.glb', displayName: 'Generic Spaceship', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_hyperfalcon01', filename: 'usc_hyperfalcon01.glb', displayName: 'Hyper Falcon', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_lightfox01', filename: 'usc_lightfox01.glb', displayName: 'Light Fox', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_meteormantis01', filename: 'usc_meteormantis01.glb', displayName: 'Meteor Mantis', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_nightaye01', filename: 'usc_nightaye01.glb', displayName: 'Night Aye', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_protonlegacy01', filename: 'usc_protonlegacy01.glb', displayName: 'Proton Legacy', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_spaceexcalibur01', filename: 'usc_spaceexcalibur01.glb', displayName: 'Space Excalibur', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_spacesphinx01', filename: 'usc_spacesphinx01.glb', displayName: 'Space Sphinx', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_starsparrow01', filename: 'usc_starsparrow01.glb', displayName: 'Star Sparrow', category: 'ship', subcategory: 'usc_ship' },
  { slug: 'usc_striderox01', filename: 'usc_striderox01.glb', displayName: 'Strider Ox', category: 'ship', subcategory: 'usc_ship' },
  // voidwhale already in bucket — skip to avoid overwrite ambiguity
  // USCX
  { slug: 'uscx_arrowship', filename: 'uscx_arrowship.glb', displayName: 'Arrow Ship', category: 'ship', subcategory: 'uscx_ship' },
  // galacticokamoto1 already in bucket — skip
  { slug: 'uscx_nova', filename: 'uscx_nova.glb', displayName: 'Nova', category: 'ship', subcategory: 'uscx_ship' },
  { slug: 'uscx_pullora', filename: 'uscx_pullora.glb', displayName: 'Pullora', category: 'ship', subcategory: 'uscx_ship' },
  { slug: 'uscx_scorpionship', filename: 'uscx_scorpionship.glb', displayName: 'Scorpion Ship', category: 'ship', subcategory: 'uscx_ship' },
  { slug: 'uscx_spidership', filename: 'uscx_spidership.glb', displayName: 'Spider Ship', category: 'ship', subcategory: 'uscx_ship' },
  // starforce01 already in bucket — skip
  { slug: 'uscx_starship', filename: 'uscx_starship.glb', displayName: 'Star Ship', category: 'ship', subcategory: 'uscx_ship' },
]

let io: NodeIO
async function initIO() {
  io = new NodeIO()
    .registerExtensions(KHRONOS_EXTENSIONS)
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    })
}

async function scanGlb(bytes: Uint8Array) {
  const doc = await io.readBinary(bytes)
  const root = doc.getRoot()
  const meshes = root.listMeshes()
  const materials = root.listMaterials()
  let vertexCount = 0
  let meshPrimCount = 0
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  for (const mesh of meshes) {
    for (const prim of mesh.listPrimitives() as Primitive[]) {
      meshPrimCount++
      const pos = prim.getAttribute('POSITION')
      if (!pos) continue
      vertexCount += pos.getCount()
      const pMin = pos.getMin([0, 0, 0]) as number[]
      const pMax = pos.getMax([0, 0, 0]) as number[]
      if (pMin[0] < minX) minX = pMin[0]
      if (pMin[1] < minY) minY = pMin[1]
      if (pMin[2] < minZ) minZ = pMin[2]
      if (pMax[0] > maxX) maxX = pMax[0]
      if (pMax[1] > maxY) maxY = pMax[1]
      if (pMax[2] > maxZ) maxZ = pMax[2]
    }
  }
  if (!isFinite(minX)) { minX = minY = minZ = maxX = maxY = maxZ = 0 }
  return {
    aabb: { x: maxX - minX, y: maxY - minY, z: maxZ - minZ },
    pivot: { x: (minX + maxX) / 2, y: (minY + maxY) / 2, z: (minZ + maxZ) / 2 },
    meshCount: meshPrimCount,
    materialCount: materials.length,
    vertexCount,
  }
}

async function main() {
  await initIO()
  let ok = 0
  let skipped = 0
  let failed = 0

  for (const ship of SHIPS) {
    const filepath = join(GLB_DIR, ship.filename)
    let stat
    try {
      stat = statSync(filepath)
    } catch {
      console.warn(`  MISSING: ${ship.filename}`)
      skipped++
      continue
    }
    if (stat.size > MAX_SIZE_BYTES) {
      console.log(`  SKIP (${(stat.size / 1e6).toFixed(1)}MB > 25MB): ${ship.filename}`)
      skipped++
      continue
    }

    try {
      const bytes = readFileSync(filepath)
      const url = `${SUPABASE_URL}/storage/v1/object/public/models/${ship.filename}`

      // Upload to Storage.
      const { error: upErr } = await supabase.storage.from('models').upload(ship.filename, bytes, {
        contentType: 'model/gltf-binary',
        upsert: true,
      })
      if (upErr) throw upErr

      // Scan geometry.
      const scan = await scanGlb(new Uint8Array(bytes))
      const hash = createHash('sha1')
        .update(`${scan.meshCount}|${scan.vertexCount}|${scan.aabb.x.toFixed(4)}|${scan.aabb.y.toFixed(4)}|${scan.aabb.z.toFixed(4)}`)
        .digest('hex')

      // Upsert model + metadata.
      const { data: modelRow, error: mErr } = await supabase
        .from('models')
        .upsert(
          {
            slug: ship.slug,
            name: ship.slug,
            display_name: ship.displayName,
            storage_path: ship.filename,
            public_url: url,
            is_uploaded: true,
            is_active: true,
            source_pack: ship.subcategory === 'uscx_ship' ? 'usc_expansion' : 'usc',
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .single()
      if (mErr) throw mErr

      const { error: metaErr } = await supabase.from('model_metadata').upsert(
        {
          model_id: modelRow.id,
          category: ship.category,
          subcategory: ship.subcategory,
          aabb_x: scan.aabb.x,
          aabb_y: scan.aabb.y,
          aabb_z: scan.aabb.z,
          pivot_x: scan.pivot.x,
          pivot_y: scan.pivot.y,
          pivot_z: scan.pivot.z,
          default_scale: 1,
          forward_axis: '-z',
          up_axis: 'y',
          symmetry_type: 'bilateral',
          role_weight: 0.5,
          quality_tier: ship.subcategory === 'uscx_ship' ? 'premium' : 'standard',
          geometry_hash: hash,
          mesh_count: scan.meshCount,
          material_count: scan.materialCount,
          vertex_count: scan.vertexCount,
          semantics: {},
          compatibility: {},
          validation: {},
          metadata_version: 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'model_id' }
      )
      if (metaErr) throw metaErr

      ok++
      console.log(
        `  ✓ ${ship.slug} (${(stat.size / 1e6).toFixed(1)}MB) aabb=${scan.aabb.x.toFixed(1)}×${scan.aabb.y.toFixed(1)}×${scan.aabb.z.toFixed(1)}`
      )
    } catch (e) {
      failed++
      console.error(`  ✖ ${ship.slug}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed} total=${SHIPS.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
