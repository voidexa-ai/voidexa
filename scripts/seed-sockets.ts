// scripts/seed-sockets.ts
//
// Adds attachment sockets to every cockpit frame and every cockpit interior in
// public.models, using each model's recorded AABB to derive sensible default
// local positions. Socket normals follow glTF convention (-Z forward, +Y up).
//
//   Frames    → interior_pair_mount, seat_mount, console_mount_{left,right,center},
//               hud_anchor, rear_anchor, ceiling_anchor   (8 sockets)
//   Interiors → screen_mount, equipment_mount, control_mount,
//               wall_anchor, floor_anchor                 (5 sockets)
//
// Left/right console mounts are linked via mirrored_socket_key so the placement
// engine can enforce bilateral symmetry on assemblies that demand it.
//
// Usage:
//   npx tsx scripts/seed-sockets.ts
//
// Idempotent. Safe to rerun — deletes existing sockets per model before insert.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

interface SocketSeed {
  socket_key: string
  name: string
  socket_type: string
  occupancy: 'single' | 'multi'
  local_pos_x: number
  local_pos_y: number
  local_pos_z: number
  local_rot_x?: number
  local_rot_y?: number
  local_rot_z?: number
  normal_x?: number
  normal_y?: number
  normal_z?: number
  priority: number
  max_scale_deviation?: number
  mirrored_socket_key?: string
  metadata?: Record<string, unknown>
}

// ---------- Default socket layouts ----------

function frameSockets(aabb_x: number, aabb_y: number, aabb_z: number): SocketSeed[] {
  const x = aabb_x
  const y = aabb_y
  const z = aabb_z
  return [
    {
      socket_key: 'interior_pair_mount',
      name: 'Interior bay mount',
      socket_type: 'interior_pair_mount',
      occupancy: 'single',
      local_pos_x: 0,
      local_pos_y: 0,
      local_pos_z: 0,
      normal_y: 1,
      priority: 10,
      max_scale_deviation: 0.0,
    },
    {
      socket_key: 'seat_mount',
      name: 'Seat mount',
      socket_type: 'seat_mount',
      occupancy: 'single',
      local_pos_x: 0,
      local_pos_y: -y * 0.18,
      local_pos_z: z * 0.08,
      normal_y: 1,
      priority: 20,
      max_scale_deviation: 0.1,
    },
    {
      socket_key: 'console_mount_left',
      name: 'Left console mount',
      socket_type: 'console_mount_left',
      occupancy: 'single',
      local_pos_x: -x * 0.28,
      local_pos_y: -y * 0.08,
      local_pos_z: -z * 0.18,
      normal_x: 1,
      normal_y: 0,
      normal_z: 0,
      priority: 30,
      max_scale_deviation: 0.15,
      mirrored_socket_key: 'console_mount_right',
    },
    {
      socket_key: 'console_mount_right',
      name: 'Right console mount',
      socket_type: 'console_mount_right',
      occupancy: 'single',
      local_pos_x: x * 0.28,
      local_pos_y: -y * 0.08,
      local_pos_z: -z * 0.18,
      normal_x: -1,
      normal_y: 0,
      normal_z: 0,
      priority: 30,
      max_scale_deviation: 0.15,
      mirrored_socket_key: 'console_mount_left',
    },
    {
      socket_key: 'console_mount_center',
      name: 'Center console mount',
      socket_type: 'console_mount_center',
      occupancy: 'single',
      local_pos_x: 0,
      local_pos_y: -y * 0.08,
      local_pos_z: -z * 0.22,
      normal_y: 1,
      priority: 35,
      max_scale_deviation: 0.1,
    },
    {
      socket_key: 'hud_anchor',
      name: 'HUD anchor',
      socket_type: 'hud_anchor',
      occupancy: 'single',
      local_pos_x: 0,
      local_pos_y: y * 0.15,
      local_pos_z: -z * 0.32,
      normal_x: 0,
      normal_y: 0,
      normal_z: -1,
      priority: 50,
      max_scale_deviation: 0.3,
    },
    {
      socket_key: 'rear_anchor',
      name: 'Rear anchor',
      socket_type: 'accessory_mount',
      occupancy: 'multi',
      local_pos_x: 0,
      local_pos_y: 0,
      local_pos_z: z * 0.4,
      normal_z: 1,
      priority: 80,
      max_scale_deviation: 0.3,
    },
    {
      socket_key: 'ceiling_anchor',
      name: 'Ceiling anchor',
      socket_type: 'ceiling_anchor',
      occupancy: 'multi',
      local_pos_x: 0,
      local_pos_y: y * 0.4,
      local_pos_z: 0,
      normal_y: -1,
      priority: 70,
      max_scale_deviation: 0.3,
    },
  ]
}

function interiorSockets(aabb_x: number, aabb_y: number, aabb_z: number): SocketSeed[] {
  const x = aabb_x
  const y = aabb_y
  const z = aabb_z
  return [
    {
      socket_key: 'screen_mount',
      name: 'Front screen mount',
      socket_type: 'screen_mount',
      occupancy: 'multi',
      local_pos_x: 0,
      local_pos_y: y * 0.1,
      local_pos_z: -z * 0.28,
      normal_z: -1,
      priority: 40,
      max_scale_deviation: 0.25,
    },
    {
      socket_key: 'equipment_mount',
      name: 'Equipment mount',
      socket_type: 'equipment_mount',
      occupancy: 'multi',
      local_pos_x: 0,
      local_pos_y: -y * 0.3,
      local_pos_z: z * 0.1,
      normal_y: 1,
      priority: 60,
      max_scale_deviation: 0.3,
    },
    {
      socket_key: 'control_mount',
      name: 'Control mount',
      socket_type: 'control_mount',
      occupancy: 'multi',
      local_pos_x: 0,
      local_pos_y: -y * 0.12,
      local_pos_z: -z * 0.18,
      normal_y: 1,
      priority: 45,
      max_scale_deviation: 0.2,
    },
    {
      socket_key: 'wall_anchor',
      name: 'Wall anchor',
      socket_type: 'wall_anchor',
      occupancy: 'multi',
      local_pos_x: x * 0.35,
      local_pos_y: 0,
      local_pos_z: 0,
      normal_x: -1,
      priority: 65,
      max_scale_deviation: 0.3,
    },
    {
      socket_key: 'floor_anchor',
      name: 'Floor anchor',
      socket_type: 'floor_anchor',
      occupancy: 'multi',
      local_pos_x: 0,
      local_pos_y: -y * 0.4,
      local_pos_z: 0,
      normal_y: 1,
      priority: 75,
      max_scale_deviation: 0.3,
    },
  ]
}

// ---------- Main ----------

async function main() {
  const { data: models, error: mErr } = await supabase.from('models').select('id, slug')
  if (mErr) throw mErr
  const { data: metas, error: meErr } = await supabase
    .from('model_metadata')
    .select('model_id, category, aabb_x, aabb_y, aabb_z')
  if (meErr) throw meErr

  const metaByModelId = new Map<string, { category: string; aabb_x: number; aabb_y: number; aabb_z: number }>()
  for (const m of metas || []) metaByModelId.set(m.model_id, m)

  let ok = 0
  let skipped = 0
  let failed = 0
  let totalSockets = 0

  for (const row of models || []) {
    const meta = metaByModelId.get(row.id)
    if (!meta) {
      skipped++
      continue
    }
    let sockets: SocketSeed[]
    if (meta.category === 'cockpit_frame') {
      sockets = frameSockets(meta.aabb_x, meta.aabb_y, meta.aabb_z)
    } else if (meta.category === 'cockpit_interior') {
      sockets = interiorSockets(meta.aabb_x, meta.aabb_y, meta.aabb_z)
    } else {
      skipped++
      continue
    }

    try {
      const { error: delErr } = await supabase.from('model_sockets').delete().eq('model_id', row.id)
      if (delErr) throw delErr

      const insertRows = sockets.map((s) => ({
        model_id: row.id,
        socket_key: s.socket_key,
        name: s.name,
        socket_type: s.socket_type,
        occupancy: s.occupancy,
        local_pos_x: s.local_pos_x,
        local_pos_y: s.local_pos_y,
        local_pos_z: s.local_pos_z,
        local_rot_x: s.local_rot_x ?? 0,
        local_rot_y: s.local_rot_y ?? 0,
        local_rot_z: s.local_rot_z ?? 0,
        normal_x: s.normal_x ?? 0,
        normal_y: s.normal_y ?? 1,
        normal_z: s.normal_z ?? 0,
        priority: s.priority,
        max_scale_deviation: s.max_scale_deviation,
        mirrored_socket_key: s.mirrored_socket_key,
        metadata: s.metadata ?? {},
      }))

      const { error: insErr } = await supabase.from('model_sockets').insert(insertRows)
      if (insErr) throw insErr

      ok++
      totalSockets += sockets.length
      console.log(`sockets ${row.slug} (${meta.category}) → ${sockets.length}`)
    } catch (e) {
      failed++
      console.error(`  FAIL ${row.slug}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed} sockets=${totalSockets}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
