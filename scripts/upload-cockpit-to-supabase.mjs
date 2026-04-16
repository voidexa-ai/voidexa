import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { resolve, basename } from 'node:path'

function loadEnv(file) {
  try {
    const text = readFileSync(file, 'utf8')
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
}
loadEnv('.env.local')
loadEnv('.env')

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
if (!URL || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(URL, KEY)

const FILES = [
  {
    local: 'assets/cockpit-vattalus/vattalus_fighter_cockpit.glb',
    remote: 'cockpits/vattalus_fighter_cockpit.glb',
    polygons: 10673,
  },
  {
    local: 'assets/cockpit-vattalus/vattalus_fighter_cockpit_with_seat.glb',
    remote: 'cockpits/vattalus_fighter_cockpit_with_seat.glb',
    polygons: 12284,
  },
]

let hasMetadataTable = true

for (const f of FILES) {
  const buf = readFileSync(resolve(f.local))
  const { error: upErr } = await supabase.storage
    .from('models')
    .upload(f.remote, buf, { contentType: 'model/gltf-binary', upsert: true })
  if (upErr) {
    console.error(`Upload failed: ${f.remote}`, upErr.message)
    process.exit(1)
  }
  console.log(`uploaded ${f.remote} (${(buf.length / 1048576).toFixed(1)} MB)`)

  if (!hasMetadataTable) continue
  const publicUrl = `${URL}/storage/v1/object/public/models/${f.remote}`
  const { error: dbErr } = await supabase
    .from('model_metadata')
    .upsert({
      slug: basename(f.remote, '.glb'),
      category: 'cockpit',
      subcategory: 'fighter',
      url: publicUrl,
      license: 'CGTrader Royalty Free (Vattalus)',
      source: 'CGTrader',
      purchased_at: '2026-04-16',
      polygons: f.polygons,
    }, { onConflict: 'slug' })
  if (dbErr) {
    if (/relation .* does not exist/i.test(dbErr.message) || dbErr.code === '42P01') {
      console.warn('model_metadata table missing — skipping DB registration for remaining files')
      hasMetadataTable = false
    } else {
      console.error(`DB upsert failed for ${f.remote}:`, dbErr.message)
    }
  } else {
    console.log(`  registered in model_metadata: ${basename(f.remote, '.glb')}`)
  }
}

console.log('done')
