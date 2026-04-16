// scripts/upload-hirez-ships.ts
//
// Uploads all 24 Hi-Rez complete ships + hirez_spaceship01 to Supabase Storage
// bucket "models" and registers them in public.models + public.model_metadata.
// Skips files >50MB. Idempotent via slug upsert.
//
// Usage:
//   npx tsx scripts/upload-hirez-ships.ts

import { createClient } from '@supabase/supabase-js'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { NodeIO, type Primitive } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'
import draco3d from 'draco3dgltf'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const GLB_DIR = join(process.cwd(), 'public/models/glb-ready')
const MAX_SIZE_BYTES = 50 * 1024 * 1024

// Descriptive display names for the 24 Hi-Rez ship models + spaceship01.
const SHIPS: Array<{ slug: string; filename: string; displayName: string }> = [
  { slug: 'hirez_ship01_full', filename: 'hirez_ship01_full.glb', displayName: 'Hi-Rez Vanguard' },
  { slug: 'hirez_ship02_full', filename: 'hirez_ship02_full.glb', displayName: 'Hi-Rez Corsair' },
  { slug: 'hirez_ship03_full', filename: 'hirez_ship03_full.glb', displayName: 'Hi-Rez Phantom' },
  { slug: 'hirez_ship04_full', filename: 'hirez_ship04_full.glb', displayName: 'Hi-Rez Sentinel' },
  { slug: 'hirez_ship05_full', filename: 'hirez_ship05_full.glb', displayName: 'Hi-Rez Reaver' },
  { slug: 'hirez_ship06_full', filename: 'hirez_ship06_full.glb', displayName: 'Hi-Rez Wraith' },
  { slug: 'hirez_ship07_full', filename: 'hirez_ship07_full.glb', displayName: 'Hi-Rez Tempest' },
  { slug: 'hirez_ship08_full', filename: 'hirez_ship08_full.glb', displayName: 'Hi-Rez Interceptor' },
  { slug: 'hirez_ship09_full', filename: 'hirez_ship09_full.glb', displayName: 'Hi-Rez Valkyrie' },
  { slug: 'hirez_ship10_full', filename: 'hirez_ship10_full.glb', displayName: 'Hi-Rez Mantis' },
  { slug: 'hirez_ship11_full', filename: 'hirez_ship11_full.glb', displayName: 'Hi-Rez Raptor' },
  { slug: 'hirez_ship12_full', filename: 'hirez_ship12_full.glb', displayName: 'Hi-Rez Striker' },
  { slug: 'hirez_ship13_full', filename: 'hirez_ship13_full.glb', displayName: 'Hi-Rez Warden' },
  { slug: 'hirez_ship14_full', filename: 'hirez_ship14_full.glb', displayName: 'Hi-Rez Spectre' },
  { slug: 'hirez_ship15_full', filename: 'hirez_ship15_full.glb', displayName: 'Hi-Rez Marauder' },
  { slug: 'hirez_ship16_full', filename: 'hirez_ship16_full.glb', displayName: 'Hi-Rez Talon' },
  { slug: 'hirez_ship17_full', filename: 'hirez_ship17_full.glb', displayName: 'Hi-Rez Eclipse' },
  { slug: 'hirez_ship18_full', filename: 'hirez_ship18_full.glb', displayName: 'Hi-Rez Falcon' },
  { slug: 'hirez_ship19_full', filename: 'hirez_ship19_full.glb', displayName: 'Hi-Rez Harbinger' },
  { slug: 'hirez_ship20_full', filename: 'hirez_ship20_full.glb', displayName: 'Hi-Rez Vindicator' },
  { slug: 'hirez_ship21_full', filename: 'hirez_ship21_full.glb', displayName: 'Hi-Rez Stinger' },
  { slug: 'hirez_ship22_full', filename: 'hirez_ship22_full.glb', displayName: 'Hi-Rez Nomad' },
  { slug: 'hirez_ship23_full', filename: 'hirez_ship23_full.glb', displayName: 'Hi-Rez Predator' },
  { slug: 'hirez_ship24_full', filename: 'hirez_ship24_full.glb', displayName: 'Hi-Rez Sovereign' },
  { slug: 'hirez_spaceship01', filename: 'hirez_spaceship01.glb', displayName: 'Hi-Rez Spaceship Alpha' },
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

  console.log(`Uploading ${SHIPS.length} Hi-Rez ships to ${SUPABASE_URL}\n`)

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
      console.log(`  SKIP (${(stat.size / 1e6).toFixed(1)}MB > 50MB): ${ship.filename}`)
      skipped++
      continue
    }

    try {
      const bytes = readFileSync(filepath)
      const url = `${SUPABASE_URL}/storage/v1/object/public/models/${ship.filename}`.replace(/\s+/g, '')

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

      // Upsert model row.
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
            source_pack: 'hirez',
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .single()
      if (mErr) throw mErr

      // Upsert model_metadata row.
      const { error: metaErr } = await supabase.from('model_metadata').upsert(
        {
          model_id: modelRow.id,
          category: 'ship_hirez',
          subcategory: 'complete',
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
          quality_tier: 'premium',
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
        `  OK  ${ship.slug}  ${(stat.size / 1e6).toFixed(1)}MB  ${ship.displayName}  aabb=${scan.aabb.x.toFixed(1)}x${scan.aabb.y.toFixed(1)}x${scan.aabb.z.toFixed(1)}  verts=${scan.vertexCount}`
      )
    } catch (e) {
      failed++
      console.error(`  FAIL  ${ship.slug}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed} total=${SHIPS.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
