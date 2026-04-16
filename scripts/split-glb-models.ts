// scripts/split-glb-models.ts
//
// Splits multi-part source GLBs (hirez_equipments.glb, hirez_screens.glb) into
// one .glb per top-level scene node. Each split is uploaded to the Supabase
// Storage "models" bucket and registered in the models + model_metadata tables.
// The originals are deactivated (is_active=false) so the UI stops showing them.
//
// Usage:
//   npx tsx scripts/split-glb-models.ts
//
// Idempotent: by slug. Reruns overwrite the split outputs + metadata rows.

import { createClient } from '@supabase/supabase-js'
import { NodeIO, type Document, type Node, type Primitive } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'
import { prune } from '@gltf-transform/functions'
import draco3d from 'draco3dgltf'
import { createHash } from 'node:crypto'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Sources to split. The script generalises — add entries here to handle more.
const SOURCES: Array<{
  slug: string
  filename: string
  partPrefix: string
  category: string
  subcategory: string
  displayCategoryPrefix: string
}> = [
  {
    slug: 'hirez_equipments',
    filename: 'hirez_equipments.glb',
    partPrefix: 'equipment',
    category: 'equipment',
    subcategory: 'hirez_equipment_split',
    displayCategoryPrefix: 'Equipment',
  },
  {
    slug: 'hirez_screens',
    filename: 'hirez_screens.glb',
    partPrefix: 'screen',
    category: 'screen',
    subcategory: 'hirez_screen_split',
    displayCategoryPrefix: 'Screens',
  },
]

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    || 'part'
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

async function fetchGlb(filename: string): Promise<Uint8Array> {
  const url = `${SUPABASE_URL}/storage/v1/object/public/models/${filename}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`)
  return new Uint8Array(await res.arrayBuffer())
}

interface PartScan {
  aabb: { x: number; y: number; z: number }
  pivot: { x: number; y: number; z: number }
  meshCount: number
  vertexCount: number
  materialCount: number
}

// Accumulates AABB + counts across every primitive under a given root subtree.
function scanSubtree(root: Node): PartScan {
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  let meshCount = 0
  let vertexCount = 0
  const mats = new Set<unknown>()

  const walk = (node: Node) => {
    const mesh = node.getMesh()
    if (mesh) {
      for (const prim of mesh.listPrimitives() as Primitive[]) {
        meshCount++
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
        const m = prim.getMaterial()
        if (m) mats.add(m)
      }
    }
    for (const child of node.listChildren()) walk(child)
  }
  walk(root)
  if (!isFinite(minX)) {
    minX = minY = minZ = 0
    maxX = maxY = maxZ = 0
  }
  return {
    aabb: { x: maxX - minX, y: maxY - minY, z: maxZ - minZ },
    pivot: { x: (minX + maxX) / 2, y: (minY + maxY) / 2, z: (minZ + maxZ) / 2 },
    meshCount,
    vertexCount,
    materialCount: mats.size,
  }
}

async function buildSubtreeGlb(sourceBytes: Uint8Array, keepNodeName: string): Promise<Uint8Array> {
  const doc: Document = await io.readBinary(sourceBytes)
  const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0]
  if (!scene) throw new Error('source has no scene')
  const keepList = scene.listChildren().filter((n) => n.getName() === keepNodeName)
  if (keepList.length === 0) throw new Error(`no root node named "${keepNodeName}"`)
  // Detach every sibling — leave only the desired node in the default scene.
  for (const child of scene.listChildren()) {
    if (child.getName() !== keepNodeName) scene.removeChild(child)
  }
  // prune() removes unused accessors, meshes, materials, textures, etc.
  await doc.transform(prune())
  return io.writeBinary(doc)
}

async function listRootNodeNames(sourceBytes: Uint8Array): Promise<string[]> {
  const doc: Document = await io.readBinary(sourceBytes)
  const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0]
  if (!scene) return []
  return scene
    .listChildren()
    .map((n, i) => n.getName() || `node_${i}`)
}

async function scanPartFromSource(sourceBytes: Uint8Array, keepNodeName: string): Promise<PartScan> {
  const doc: Document = await io.readBinary(sourceBytes)
  const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0]
  if (!scene) throw new Error('no scene')
  const node = scene.listChildren().find((n) => n.getName() === keepNodeName)
  if (!node) throw new Error(`no node "${keepNodeName}"`)
  return scanSubtree(node)
}

async function uploadGlb(filename: string, bytes: Uint8Array): Promise<void> {
  const { error } = await supabase.storage.from('models').upload(filename, bytes, {
    contentType: 'model/gltf-binary',
    upsert: true,
  })
  if (error) throw error
}

async function upsertModel(
  partSlug: string,
  filename: string,
  displayName: string,
  sourcePack: string,
  scan: PartScan,
  category: string,
  subcategory: string
): Promise<void> {
  const url = `${SUPABASE_URL}/storage/v1/object/public/models/${filename}`
  const { data: modelRow, error: mErr } = await supabase
    .from('models')
    .upsert(
      {
        slug: partSlug,
        name: partSlug,
        display_name: displayName,
        storage_path: filename,
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

  const hash = createHash('sha1')
    .update(`${scan.meshCount}|${scan.vertexCount}|${scan.aabb.x.toFixed(4)}|${scan.aabb.y.toFixed(4)}|${scan.aabb.z.toFixed(4)}`)
    .digest('hex')

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
      quality_tier: 'standard',
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
}

async function deactivateOriginal(slug: string): Promise<void> {
  const { error } = await supabase.from('models').update({ is_active: false }).eq('slug', slug)
  if (error) throw error
}

async function main() {
  await initIO()

  for (const source of SOURCES) {
    console.log(`\n══ ${source.filename} ═══════════════════════════════════`)
    const bytes = await fetchGlb(source.filename)
    const nodeNames = await listRootNodeNames(bytes)
    const uniqueNames = Array.from(new Set(nodeNames))
    console.log(`  found ${uniqueNames.length} root nodes: ${uniqueNames.slice(0, 10).join(', ')}${uniqueNames.length > 10 ? '…' : ''}`)
    if (uniqueNames.length < 2) {
      console.log(`  ↻ ${source.filename} has only ${uniqueNames.length} root node — nothing to split. Skipping.`)
      continue
    }

    let splitIdx = 0
    for (const nodeName of uniqueNames) {
      splitIdx++
      const cleanName = slugify(nodeName)
      const partSlug = `${source.partPrefix}_${cleanName}`
      const partFile = `${partSlug}.glb`
      const displayName = `${source.displayCategoryPrefix} · ${cleanName}`

      try {
        const glbBytes = await buildSubtreeGlb(bytes, nodeName)
        const scan = await scanPartFromSource(bytes, nodeName)
        await uploadGlb(partFile, glbBytes)
        await upsertModel(partSlug, partFile, displayName, source.slug, scan, source.category, source.subcategory)
        console.log(
          `  [${splitIdx}/${uniqueNames.length}] ${partSlug} uploaded (${(glbBytes.byteLength / 1024).toFixed(1)}kb, aabb=${scan.aabb.x.toFixed(2)}×${scan.aabb.y.toFixed(2)}×${scan.aabb.z.toFixed(2)})`
        )
      } catch (e) {
        console.error(`  FAIL ${partSlug}: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    await deactivateOriginal(source.slug)
    console.log(`  ↳ deactivated original ${source.slug} in models table (is_active=false)`)
  }

  console.log('\n✓ split complete.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
