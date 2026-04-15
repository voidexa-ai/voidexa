import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) { console.error('Missing Supabase env'); process.exit(1) }

const supabase = createClient(URL, KEY)

const FILES = [
  'hirez_cockpit02.glb', 'hirez_cockpit02_interior.glb',
  'hirez_cockpit03.glb', 'hirez_cockpit03_interior.glb',
  'hirez_cockpit04.glb', 'hirez_cockpit04_interior.glb',
  'hirez_cockpit05.glb', 'hirez_cockpit05_interior.glb',
  'qs_striker.glb', 'qs_imperial.glb',
  'qs_omen.glb', 'qs_spitfire.glb',
]

for (const name of FILES) {
  const path = resolve('public/models/glb-ready', name)
  const data = readFileSync(path)
  const { error } = await supabase.storage
    .from('models')
    .upload(name, data, { contentType: 'model/gltf-binary', upsert: true })
  if (error) { console.error(name, error.message); process.exit(1) }
  console.log('uploaded', name, data.length, 'bytes')
}
console.log('done')
