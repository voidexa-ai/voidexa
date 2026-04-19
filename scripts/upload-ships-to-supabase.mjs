#!/usr/bin/env node
/**
 * Sprint 16 Task 2 — asset pipeline uploader.
 *
 * Reads .glb files from `public/models/glb-ready/` and uploads any that are
 * missing from the Supabase Storage bucket `models`. Idempotent: if a file is
 * already on the CDN it is skipped (HEAD check first, then upsert=false
 * upload that 409s gracefully).
 *
 * Usage:
 *
 *   # Upload only the curated Sprint 16 catalog (~35 files, ~280MB)
 *   node scripts/upload-ships-to-supabase.mjs
 *
 *   # Upload every .glb in glb-ready (~690 files, ~5GB — long-running)
 *   node scripts/upload-ships-to-supabase.mjs --all
 *
 *   # Dry run — list what would be uploaded without writing
 *   node scripts/upload-ships-to-supabase.mjs --dry-run
 *
 * Env (trimmed — .trim() on every read to survive paste artefacts):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFile, readdir, stat } from 'node:fs/promises'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'

// Minimal .env.local loader — avoids adding `dotenv` as a runtime dependency.
// Matches KEY=VALUE per line, strips surrounding quotes, ignores comments.
function loadEnvLocal() {
  const envPath = join(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  const text = readFileSync(envPath, 'utf8')
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    let val = line.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}
loadEnvLocal()

const GLB_DIR = join(process.cwd(), 'public', 'models', 'glb-ready')
const BUCKET = 'models'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const args = new Set(process.argv.slice(2))
const ALL = args.has('--all')
const DRY = args.has('--dry-run')

// Curated Sprint 16 extension: one or two representatives per family so the
// hangar feels populated without shipping 690 × 8MB up front. The full list
// is available with --all.
const CURATED = [
  // Quaternius fillers (already on CDN — no-op on re-run).
  'qs_bob.glb',
  'qs_challenger.glb',
  'qs_striker.glb',
  'qs_imperial.glb',
  'qs_executioner.glb',
  'qs_omen.glb',
  'qs_spitfire.glb',
  'qs_dispatcher.glb',
  'qs_insurgent.glb',
  'qs_zenith.glb',
  'qs_pancake.glb',
  // USC rare (already on CDN).
  'usc_astroeagle01.glb',
  'usc_cosmicshark01.glb',
  'usc_voidwhale01.glb',
  // USC uncommon — one rep per family.
  'usc_hyperfalcon01.glb',
  'usc_lightfox01.glb',
  'usc_starsparrow01.glb',
  'usc_striderox01.glb',
  'usc_nightaye01.glb',
  'usc_meteormantis01.glb',
  'usc_craizanstar01.glb',
  'usc_forcebadger01.glb',
  'usc_protonlegacy01.glb',
  'usc_galacticleopard1.glb',
  'usc_galaxyraptor01.glb',
  'usc_spacesphinx01.glb',
  'usc_spaceexcalibur01.glb',
  'usc_genericspaceship01.glb',
  // USCX legendary — expansion premiums.
  'uscx_starforce01.glb',
  'uscx_galacticokamoto1.glb',
  'uscx_nova.glb',
  'uscx_scorpionship.glb',
  'uscx_spidership.glb',
  'uscx_pullora.glb',
  'uscx_arrowship.glb',
  'uscx_starship.glb',
  // Hi-Rez epic hulls — show off the heavier PBR look.
  'hirez_mainbody01.glb',
  'hirez_mainbody02.glb',
  'hirez_mainbody05.glb',
]

const supa = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function listOnDisk() {
  const entries = await readdir(GLB_DIR)
  return entries.filter(n => n.endsWith('.glb'))
}

async function head(path) {
  const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(path)}`
  const res = await fetch(url, { method: 'HEAD' })
  return res.ok
}

async function upload(name) {
  const localPath = join(GLB_DIR, name)
  const st = await stat(localPath).catch(() => null)
  if (!st) return { name, status: 'missing-local' }
  const body = await readFile(localPath)
  const hash = createHash('sha256').update(body).digest('hex').slice(0, 12)
  const exists = await head(name)
  if (exists) return { name, status: 'exists', bytes: st.size, hash }
  if (DRY) return { name, status: 'would-upload', bytes: st.size, hash }
  const { error } = await supa.storage.from(BUCKET).upload(name, body, {
    contentType: 'model/gltf-binary',
    upsert: false,
    cacheControl: '31536000',
  })
  if (error) return { name, status: 'error', error: error.message, bytes: st.size, hash }
  return { name, status: 'uploaded', bytes: st.size, hash }
}

async function main() {
  const onDisk = new Set(await listOnDisk())
  const target = ALL ? [...onDisk].sort() : CURATED
  console.error(`[upload-ships] target=${target.length} files  dry-run=${DRY}  mode=${ALL ? 'all' : 'curated'}`)

  const report = { exists: [], uploaded: [], skipped: [], errored: [], would: [] }
  let i = 0
  for (const name of target) {
    i++
    if (!onDisk.has(name)) {
      console.error(`  [${i}/${target.length}] SKIP (not on disk): ${name}`)
      report.skipped.push(name)
      continue
    }
    const r = await upload(name)
    const tag = r.status.toUpperCase().padEnd(12)
    const mb = r.bytes ? `${(r.bytes / 1024 / 1024).toFixed(1)}MB` : ''
    console.error(`  [${i}/${target.length}] ${tag} ${name} ${mb} ${r.error ?? ''}`)
    if (r.status === 'uploaded') report.uploaded.push(name)
    else if (r.status === 'exists') report.exists.push(name)
    else if (r.status === 'would-upload') report.would.push(name)
    else if (r.status === 'error') report.errored.push({ name, error: r.error })
  }

  console.error('')
  console.error('[upload-ships] summary:')
  console.error(`  already on CDN : ${report.exists.length}`)
  console.error(`  uploaded       : ${report.uploaded.length}`)
  console.error(`  would-upload   : ${report.would.length}`)
  console.error(`  errored        : ${report.errored.length}`)
  console.error(`  skipped        : ${report.skipped.length}`)
  if (report.errored.length) {
    console.error('errors:')
    for (const e of report.errored) console.error(`  ${e.name}: ${e.error}`)
    process.exit(2)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
