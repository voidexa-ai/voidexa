// scripts/extract-model-metadata.ts
//
// Extract geometry metadata from every .glb in the Supabase Storage "models"
// bucket and upsert into public.models + public.model_metadata.
//
// Uses @gltf-transform/core (Node-native, decodes Draco via draco3dgltf)
// instead of three's GLTFLoader because the bucket contents are Draco-
// compressed and DRACOLoader does not run cleanly outside the browser.
// Three.js is the runtime loader in the frontend; this is the offline scanner.
//
// Usage (run from repo root, requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL):
//   npx tsx scripts/extract-model-metadata.ts
//
// Idempotent: uses slug unique constraint + unique(model_id) on metadata.

import { createClient } from '@supabase/supabase-js'
import { NodeIO, Primitive, type Document } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'
import draco3d from 'draco3dgltf'
import { createHash } from 'node:crypto'
import { deriveCategory } from '../app/assembly-editor/lib/editorTypes'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

function categorize(filename: string): { category: string; subcategory: string } {
  const n = filename.replace(/\.glb$/i, '').toLowerCase()
  if (/^hirez_cockpit\d+_interior$/.test(n)) return { category: 'cockpit_interior', subcategory: 'hirez_interior' }
  if (/^hirez_cockpit\d+$/.test(n)) return { category: 'cockpit_frame', subcategory: 'hirez_frame' }
  if (n.startsWith('hirez_equipment')) return { category: 'equipment', subcategory: 'hirez_equipment' }
  if (n.startsWith('hirez_screen')) return { category: 'screen', subcategory: 'hirez_screen' }
  if (n.startsWith('hirez_ship')) return { category: 'ship', subcategory: 'hirez_ship' }
  if (n.startsWith('uscx_')) return { category: 'ship', subcategory: 'uscx_ship' }
  if (n.startsWith('usc_')) return { category: 'ship', subcategory: 'usc_ship' }
  if (n.startsWith('qs_')) return { category: 'ship', subcategory: 'quaternius_ship' }
  return { category: 'prop', subcategory: 'unknown' }
}

function detectSourcePack(filename: string): string {
  const n = filename.toLowerCase()
  if (n.startsWith('hirez_')) return 'hirez'
  if (n.startsWith('uscx_')) return 'usc_expansion'
  if (n.startsWith('usc_')) return 'usc'
  if (n.startsWith('qs_')) return 'quaternius_spaceships'
  return 'unknown'
}

interface GlbScan {
  aabb: { x: number; y: number; z: number }
  pivot: { x: number; y: number; z: number }
  meshCount: number
  materialCount: number
  vertexCount: number
  geometryHash: string
}

let io: NodeIO
async function initIO() {
  io = new NodeIO()
    .registerExtensions(KHRONOS_EXTENSIONS)
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    })
}

async function scanGlb(url: string): Promise<GlbScan> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`)
  const buf = new Uint8Array(await res.arrayBuffer())

  const doc: Document = await io.readBinary(buf)
  const root = doc.getRoot()

  const meshes = root.listMeshes()
  const materials = root.listMaterials()

  let vertexCount = 0
  let meshPrimCount = 0
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

  // Compute AABB in model-local space from each primitive's POSITION min/max.
  // These are accessor-level min/max already aggregated per primitive by glTF spec.
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

  if (!isFinite(minX)) {
    minX = minY = minZ = 0
    maxX = maxY = maxZ = 0
  }

  const sizeX = Math.max(0, maxX - minX)
  const sizeY = Math.max(0, maxY - minY)
  const sizeZ = Math.max(0, maxZ - minZ)
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const centerZ = (minZ + maxZ) / 2

  const hash = createHash('sha1')
    .update(`${meshPrimCount}|${vertexCount}|${sizeX.toFixed(4)}|${sizeY.toFixed(4)}|${sizeZ.toFixed(4)}`)
    .digest('hex')

  return {
    aabb: { x: sizeX, y: sizeY, z: sizeZ },
    pivot: { x: centerX, y: centerY, z: centerZ },
    meshCount: meshPrimCount,
    materialCount: materials.length,
    vertexCount,
    geometryHash: hash,
  }
}

async function main() {
  await initIO()
  const { data: files, error } = await supabase.storage
    .from('models')
    .list('', { limit: 500, sortBy: { column: 'name', order: 'asc' } })
  if (error) throw error
  const glbs = (files || []).filter((f) => f.name.toLowerCase().endsWith('.glb'))
  console.log(`Found ${glbs.length} .glb files`)

  let ok = 0
  let failed = 0

  for (const file of glbs) {
    const slug = file.name.replace(/\.glb$/i, '')
    const url = `${SUPABASE_URL}/storage/v1/object/public/models/${file.name}`
    const { category, subcategory } = categorize(file.name)
    const sourcePack = detectSourcePack(file.name)
    const displayCategory = deriveCategory(file.name)

    try {
      console.log(`[scan] ${slug}`)
      const scan = await scanGlb(url)

      const { data: modelRow, error: mErr } = await supabase
        .from('models')
        .upsert(
          {
            slug,
            name: slug,
            display_name: displayCategory + ' · ' + slug,
            storage_path: file.name,
            public_url: url,
            is_uploaded: true,
            is_active: true,
            source_pack: sourcePack,
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .single()
      if (mErr) throw mErr

      const { error: metaErr } = await supabase.from('model_metadata').upsert(
        {
          model_id: modelRow.id,
          category,
          subcategory,
          aabb_x: scan.aabb.x,
          aabb_y: scan.aabb.y,
          aabb_z: scan.aabb.z,
          pivot_x: scan.pivot.x,
          pivot_y: scan.pivot.y,
          pivot_z: scan.pivot.z,
          default_scale: 1,
          forward_axis: '-z',
          up_axis: 'y',
          symmetry_type: 'none',
          role_weight: 1,
          quality_tier: 'starter',
          geometry_hash: scan.geometryHash,
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
        `  ok  aabb=(${scan.aabb.x.toFixed(2)},${scan.aabb.y.toFixed(2)},${scan.aabb.z.toFixed(2)}) meshes=${scan.meshCount} verts=${scan.vertexCount}`
      )
    } catch (e) {
      failed++
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`  FAIL ${slug}: ${msg}`)
    }
  }

  console.log(`\nDone. ok=${ok} failed=${failed} total=${glbs.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
