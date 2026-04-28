/**
 * scripts/upload_alpha_to_supabase.ts
 *
 * AFS-18 Task 4: upload 1000 Alpha card webp files to Supabase Storage
 * bucket "cards" with deterministic, slug-keyed paths (Option A).
 *
 * Local source (Jix PC):
 *   $env:USERPROFILE\Downloads\soil_1000_voidexa_gpt_image_prompts_v4\images_webp\
 *
 * Local filename pattern (input):
 *   {nnnn}_{rarity}_{slug}.webp        e.g. 0249_common_prime_directive.webp
 *
 * Uploaded path (numeric prefix stripped, slug-keyed):
 *   alpha/{rarity}/{slug}.webp         e.g. alpha/common/prime_directive.webp
 *
 * The slug must match alpha_cards.id (text PK, snake_case). The Task 5 URL
 * helper builds {SUPABASE_URL}/storage/v1/object/public/cards/{path}.
 *
 * Resume-safe: lists existing objects per rarity folder once, skips uploads
 * whose destPath already exists.
 * Concurrency: 10 parallel uploads.
 *
 * Required env (.env.local, loaded by inline parser below):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run:
 *   npx tsx scripts/upload_alpha_to_supabase.ts
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// .env.local loader (zero-dep, only sets keys not already in process.env)
// ---------------------------------------------------------------------------
function loadDotEnvLocal(): void {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf-8')
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadDotEnvLocal()

// ---------------------------------------------------------------------------
// Constants + env
// ---------------------------------------------------------------------------
const RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
] as const
type Rarity = (typeof RARITIES)[number]

const FILENAME_RE =
  /^(\d+)_(common|uncommon|rare|epic|legendary|mythic)_(.+)\.webp$/

const BUCKET = 'cards'
const BUCKET_PREFIX = 'alpha'
const CONCURRENCY = 10

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
  )
  process.exit(1)
}

const sourceDir = join(
  homedir(),
  'Downloads',
  'soil_1000_voidexa_gpt_image_prompts_v4',
  'images_webp',
)

if (!existsSync(sourceDir) || !statSync(sourceDir).isDirectory()) {
  console.error(`Source directory not found: ${sourceDir}`)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// ---------------------------------------------------------------------------
// Filename parsing
// ---------------------------------------------------------------------------
interface ParsedFile {
  localPath: string
  rarity: Rarity
  slug: string
  destPath: string
}

function parseAll(): ParsedFile[] {
  const files = readdirSync(sourceDir).filter((f) => f.endsWith('.webp'))
  const parsed: ParsedFile[] = []
  for (const f of files) {
    const m = FILENAME_RE.exec(f)
    if (!m) {
      console.warn(`Skipping unparseable filename: ${f}`)
      continue
    }
    const rarity = m[2] as Rarity
    const slug = m[3]
    parsed.push({
      localPath: join(sourceDir, f),
      rarity,
      slug,
      destPath: `${BUCKET_PREFIX}/${rarity}/${slug}.webp`,
    })
  }
  return parsed
}

// ---------------------------------------------------------------------------
// Existing-objects lookup (resume support)
// ---------------------------------------------------------------------------
async function existingDestPaths(): Promise<Set<string>> {
  const set = new Set<string>()
  for (const rarity of RARITIES) {
    let offset = 0
    const pageSize = 1000
    while (true) {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(`${BUCKET_PREFIX}/${rarity}`, {
          limit: pageSize,
          offset,
          sortBy: { column: 'name', order: 'asc' },
        })
      if (error) {
        console.warn(
          `list ${rarity} returned error (treating as empty): ${error.message}`,
        )
        break
      }
      if (!data || data.length === 0) break
      for (const obj of data) {
        if (obj.name.endsWith('.webp')) {
          set.add(`${BUCKET_PREFIX}/${rarity}/${obj.name}`)
        }
      }
      if (data.length < pageSize) break
      offset += pageSize
    }
  }
  return set
}

// ---------------------------------------------------------------------------
// Upload one file
// ---------------------------------------------------------------------------
async function uploadOne(file: ParsedFile): Promise<'uploaded' | 'failed'> {
  try {
    const buffer = readFileSync(file.localPath)
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(file.destPath, buffer, {
        contentType: 'image/webp',
        upsert: false,
        cacheControl: '31536000',
      })
    if (error) {
      console.error(`FAIL ${file.destPath}: ${error.message}`)
      return 'failed'
    }
    return 'uploaded'
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`FAIL ${file.destPath}: ${msg}`)
    return 'failed'
  }
}

// ---------------------------------------------------------------------------
// Bounded concurrency pool
// ---------------------------------------------------------------------------
async function runPool<T>(
  items: T[],
  worker: (item: T, idx: number) => Promise<void>,
  concurrency: number,
): Promise<void> {
  let next = 0
  async function lane(): Promise<void> {
    while (true) {
      const idx = next++
      if (idx >= items.length) return
      await worker(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => lane()))
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  const startedAt = Date.now()
  console.log(`Source dir:  ${sourceDir}`)
  console.log(`Dest path:   ${BUCKET}/${BUCKET_PREFIX}/{rarity}/{slug}.webp`)
  console.log(`Concurrency: ${CONCURRENCY}`)
  console.log()

  const allParsed = parseAll()
  console.log(`Local webp parsed: ${allParsed.length}`)

  const existing = await existingDestPaths()
  console.log(`Already in bucket: ${existing.size}`)

  const todo = allParsed.filter((p) => !existing.has(p.destPath))
  const skipped = allParsed.length - todo.length
  console.log(`To upload:         ${todo.length}`)
  console.log()

  let uploaded = 0
  let failed = 0
  let processed = 0

  await runPool(
    todo,
    async (file) => {
      const result = await uploadOne(file)
      processed++
      if (result === 'uploaded') uploaded++
      else failed++
      if (processed % 25 === 0 || processed === todo.length) {
        console.log(
          `[${processed}/${todo.length}] uploaded=${uploaded} failed=${failed}`,
        )
      }
    },
    CONCURRENCY,
  )

  const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1)
  console.log()
  console.log('==========================================')
  console.log('AFS-18 upload summary')
  console.log('==========================================')
  console.log(`Local files parsed: ${allParsed.length}`)
  console.log(`Skipped (resume):   ${skipped}`)
  console.log(`Uploaded:           ${uploaded}`)
  console.log(`Failed:             ${failed}`)
  console.log(`Elapsed:            ${elapsedSec}s`)

  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
