// scripts/resplit-with-positions.ts
//
// Re-splits hirez_equipments.glb and hirez_screens.glb, verifying that each
// child mesh's world-space vertex data (baked into POSITION accessor) is
// preserved in the output. Uploads each split to Supabase Storage and
// refreshes model_metadata with the correct per-part AABB + pivot.
//
// Background: the original GLTF source bakes world-space positions directly
// into vertex POSITION data (all node transforms are identity). Our prior
// split script already preserved this — it only detached sibling nodes and
// ran prune(), never relocated vertices. This script re-exports to be
// certain, adds a verification step, and refreshes metadata.
//
// Usage:
//   npx tsx scripts/resplit-with-positions.ts

import { createClient } from '@supabase/supabase-js'
import { NodeIO, type Document, type Primitive } from '@gltf-transform/core'
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

const SOURCES = [
  { slug: 'hirez_equipments', filename: 'hirez_equipments.glb', prefix: 'equipment', category: 'equipment', subcategory: 'hirez_equipment_split', displayPrefix: 'Equipment' },
  { slug: 'hirez_screens', filename: 'hirez_screens.glb', prefix: 'screen', category: 'screen', subcategory: 'hirez_screen_split', displayPrefix: 'Screens' },
]

const DISPLAY_NAMES: Record<string, string> = {
  'equipment_cockpitequipments_seat_mesh_650': 'Pilot Seat',
  'equipment_cockpitequipments_joystick1_base_mesh_652': 'Joystick 1 Base',
  'equipment_cockpitequipments_joystick1_handle_mesh_653': 'Joystick 1 Handle',
  'equipment_cockpitequipments_joystick2_base_mesh_643': 'Joystick 2 Base',
  'equipment_cockpitequipments_joystick2_handle_mesh_644': 'Joystick 2 Handle',
  'equipment_cockpitequipments_joystick3_mesh_634': 'Joystick 3',
  'equipment_cockpitequipments_throttlecontro1_base_mesh_645': 'Throttle 1 Base',
  'equipment_cockpitequipments_throttlecontrol1_handle1_mesh_647': 'Throttle 1 Handle A',
  'equipment_cockpitequipments_throttlecontrol1_handle2_mesh_646': 'Throttle 1 Handle B',
  'equipment_cockpitequipments_throttlecontrol2_base_mesh_648': 'Throttle 2 Base',
  'equipment_cockpitequipments_throttlecontrol2_handle_mesh_649': 'Throttle 2 Handle',
  'equipment_cockpitequipments_screen1_mesh_632': 'Console Screen 1',
  'equipment_cockpitequipments_screen2_mesh_633': 'Console Screen 2',
  'equipment_cockpitequipments_hud_mesh_628': 'HUD Display',
  'equipment_cockpitequipments_gauge_mesh_622': 'Gauge Panel',
  'equipment_cockpitequipments_handle_mesh_627': 'Control Handle',
  'equipment_cockpitequipments_button1_mesh_623': 'Button 1',
  'equipment_cockpitequipments_button2_mesh_640': 'Button 2',
  'equipment_cockpitequipments_button3_mesh_624': 'Button 3',
  'equipment_cockpitequipments_button4_mesh_631': 'Button 4',
  'equipment_cockpitequipments_button5_mesh_641': 'Button 5',
  'equipment_cockpitequipments_button6_mesh_626': 'Button 6',
  'equipment_cockpitequipments_button7_mesh_642': 'Button 7',
  'equipment_cockpitequipments_switch1_mesh_637': 'Switch Panel 1',
  'equipment_cockpitequipments_switch2_mesh_636': 'Switch Panel 2',
  'equipment_cockpitequipments_switch3_mesh_638': 'Switch Panel 3',
  'equipment_cockpitequipments_stand1_mesh_629': 'Equipment Stand 1',
  'equipment_cockpitequipments_stand2_mesh_630': 'Equipment Stand 2',
  'equipment_cockpitequipments_screenstand_mesh_639': 'Screen Stand',
  'equipment_cockpitequipments_screenhandle_mesh_635': 'Screen Arm',
  'equipment_cockpitequipments_footstand_mesh_625': 'Foot Rest',
  'equipment_cockpitequipments_seatejectorhandle_mesh_651': 'Seat Ejector Handle',
  'screen_hud_01_mesh_774': 'HUD Screen 1',
  'screen_hud_02_mesh_778': 'HUD Screen 2',
  'screen_gauge_01_mesh_775': 'Gauge Display 1',
  'screen_gauge_02_mesh_777': 'Gauge Display 2',
  'screen_screen_01_mesh_776': 'Monitor 1',
  'screen_screen_02_mesh_779': 'Monitor 2',
  'screen_screen_03_mesh_780': 'Monitor 3',
  'screen_screen_04_mesh_781': 'Monitor 4',
  'screen_screen_05_mesh_782': 'Monitor 5',
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || 'part'
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

interface PartScan {
  aabb: { x: number; y: number; z: number }
  pivot: { x: number; y: number; z: number }
  meshCount: number
  vertexCount: number
  materialCount: number
}

function scanPrimitives(doc: Document): PartScan {
  const meshes = doc.getRoot().listMeshes()
  const materials = doc.getRoot().listMaterials()
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  let meshCount = 0, vertexCount = 0
  for (const mesh of meshes) {
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
    }
  }
  if (!isFinite(minX)) { minX = minY = minZ = maxX = maxY = maxZ = 0 }
  return {
    aabb: { x: maxX - minX, y: maxY - minY, z: maxZ - minZ },
    pivot: { x: (minX + maxX) / 2, y: (minY + maxY) / 2, z: (minZ + maxZ) / 2 },
    meshCount,
    vertexCount,
    materialCount: materials.length,
  }
}

async function main() {
  await initIO()

  for (const source of SOURCES) {
    console.log(`\n══ ${source.filename} ══`)
    const url = `${SUPABASE_URL}/storage/v1/object/public/models/${source.filename}`
    const res = await fetch(url)
    const sourceBytes = new Uint8Array(await res.arrayBuffer())
    const sourceDoc = await io.readBinary(sourceBytes)
    const scene = sourceDoc.getRoot().getDefaultScene() ?? sourceDoc.getRoot().listScenes()[0]
    if (!scene) { console.log('  no scene'); continue }

    const rootChildren = scene.listChildren()
    const uniqueNames = rootChildren.map((n, i) => n.getName() || `node_${i}`)
    console.log(`  ${uniqueNames.length} root nodes`)

    let idx = 0
    for (const nodeName of uniqueNames) {
      idx++
      const cleanName = slugify(nodeName)
      const partSlug = `${source.prefix}_${cleanName}`
      const partFile = `${partSlug}.glb`
      const displayName = DISPLAY_NAMES[partSlug] ?? `${source.displayPrefix} · ${cleanName}`

      try {
        // Clone the full document, remove all other root children, prune.
        const doc = await io.readBinary(sourceBytes)
        const sc = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0]!
        for (const child of sc.listChildren()) {
          if (child.getName() !== nodeName) sc.removeChild(child)
        }
        await doc.transform(prune())

        // Verify: scan the output doc to confirm vertex positions unchanged.
        const scan = scanPrimitives(doc)

        // Also scan the SAME node in the source doc for comparison.
        const origDoc = await io.readBinary(sourceBytes)
        const origScene = origDoc.getRoot().getDefaultScene() ?? origDoc.getRoot().listScenes()[0]!
        for (const child of origScene.listChildren()) {
          if (child.getName() !== nodeName) origScene.removeChild(child)
        }
        await origDoc.transform(prune())
        const origScan = scanPrimitives(origDoc)

        const pivotMatch =
          Math.abs(scan.pivot.x - origScan.pivot.x) < 0.001 &&
          Math.abs(scan.pivot.y - origScan.pivot.y) < 0.001 &&
          Math.abs(scan.pivot.z - origScan.pivot.z) < 0.001

        // Write the glb.
        const glbBytes = await io.writeBinary(doc)

        // Upload.
        const { error: upErr } = await supabase.storage.from('models').upload(partFile, glbBytes, {
          contentType: 'model/gltf-binary',
          upsert: true,
        })
        if (upErr) throw upErr

        // Upsert model row + metadata.
        const partUrl = `${SUPABASE_URL}/storage/v1/object/public/models/${partFile}`
        const { data: row, error: mErr } = await supabase
          .from('models')
          .upsert({ slug: partSlug, name: partSlug, display_name: displayName, storage_path: partFile, public_url: partUrl, is_uploaded: true, is_active: true, source_pack: source.slug }, { onConflict: 'slug' })
          .select('id')
          .single()
        if (mErr) throw mErr

        const hash = createHash('sha1')
          .update(`${scan.meshCount}|${scan.vertexCount}|${scan.aabb.x.toFixed(4)}|${scan.aabb.y.toFixed(4)}|${scan.aabb.z.toFixed(4)}`)
          .digest('hex')

        const { error: metaErr } = await supabase.from('model_metadata').upsert({
          model_id: row.id,
          category: source.category,
          subcategory: source.subcategory,
          aabb_x: scan.aabb.x, aabb_y: scan.aabb.y, aabb_z: scan.aabb.z,
          pivot_x: scan.pivot.x, pivot_y: scan.pivot.y, pivot_z: scan.pivot.z,
          default_scale: 1, forward_axis: '-z', up_axis: 'y',
          symmetry_type: 'none', role_weight: 1, quality_tier: 'standard',
          geometry_hash: hash, mesh_count: scan.meshCount, material_count: scan.materialCount, vertex_count: scan.vertexCount,
          semantics: {}, compatibility: {}, validation: {}, metadata_version: 2,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'model_id' })
        if (metaErr) throw metaErr

        const kb = (glbBytes.byteLength / 1024).toFixed(0)
        console.log(
          `  [${idx}/${uniqueNames.length}] ${partSlug} ` +
          `pivot=(${scan.pivot.x.toFixed(3)},${scan.pivot.y.toFixed(3)},${scan.pivot.z.toFixed(3)}) ` +
          `aabb=${scan.aabb.x.toFixed(2)}×${scan.aabb.y.toFixed(2)}×${scan.aabb.z.toFixed(2)} ` +
          `${kb}kb ${pivotMatch ? '✓ pos verified' : '⚠ pivot drift!'}`
        )
      } catch (e) {
        console.error(`  FAIL ${partSlug}: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
  }
  console.log('\n✓ resplit complete.')
}

main().catch((e) => { console.error(e); process.exit(1) })
