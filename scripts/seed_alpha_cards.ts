// scripts/seed_alpha_cards.ts
//
// Upsert all 1000 Alpha cards from docs/alpha_set/batch_*.json into
// public.alpha_cards. Idempotent — re-run is safe.
//
// Usage:
//   npx tsx scripts/seed_alpha_cards.ts
//
// Required env (script exits 1 if missing):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY     (bypasses RLS via supabaseAdmin singleton)
//
// What it does:
//   1. Reads docs/alpha_set/batch_*.json (10 files, 100 cards each).
//   2. Normalizes type names (titlecase -> lowercase + underscore) and rarity.
//   3. Splits source fields:
//        flat columns:  name / energy_cost / attack / defense / effect_text /
//                       flavor_text / keywords / archetype / rarity / type
//        extras jsonb:  subsystem_target / escalation / dual_identity / cargo
//                       (only when present / truthy in source)
//   4. Upserts in 100-card chunks ON CONFLICT (id) DO UPDATE SET ...
//   5. Verifies count = 1000, rarity distribution, and 9 types present.
//   6. Prints a 3-card sanity preview.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { supabaseAdmin } from '../lib/supabase-admin'

interface SourceCard {
  id: string
  name: string
  type: string
  rarity: string
  energy_cost: number
  attack?: number
  defense?: number
  effect_text: string
  keywords?: string[]
  flavor_text?: string
  archetype?: string
  subsystem_target?: string | null
  escalation?: boolean
  dual_identity?: boolean
  cargo?: boolean
}

interface AlphaCardRow {
  id: string
  type: string
  name: string
  energy_cost: number
  attack: number | null
  defense: number | null
  rarity: string
  archetype: string | null
  keywords: string[]
  effect_text: string
  flavor_text: string | null
  extras: Record<string, unknown>
  active: boolean
}

const TYPE_MAP: Readonly<Record<string, string>> = {
  Weapon: 'weapon',
  Drone: 'drone',
  'AI Routine': 'ai_routine',
  Defense: 'defense',
  Module: 'module',
  Maneuver: 'maneuver',
  Equipment: 'equipment',
  Field: 'field',
  'Ship Core': 'ship_core',
}

const VALID_RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
] as const

const EXPECTED_DISTRIBUTION: Readonly<Record<string, number>> = {
  common: 400,
  uncommon: 280,
  rare: 160,
  epic: 90,
  legendary: 50,
  mythic: 20,
}

function loadCards(): SourceCard[] {
  const dir = join(process.cwd(), 'docs', 'alpha_set')
  const files = readdirSync(dir)
    .filter((f) => /^batch_\d+\.json$/.test(f))
    .sort()

  if (files.length !== 10) {
    throw new Error(
      `Expected 10 batch_*.json files in docs/alpha_set, found ${files.length}: ${files.join(', ')}`,
    )
  }

  const all: SourceCard[] = []
  for (const f of files) {
    const raw = readFileSync(join(dir, f), 'utf8')
    const batch = JSON.parse(raw) as SourceCard[]
    console.log(`  ${f}: ${batch.length} cards`)
    all.push(...batch)
  }
  return all
}

function transform(card: SourceCard): AlphaCardRow {
  const dbType = TYPE_MAP[card.type]
  if (!dbType) {
    throw new Error(`Unknown type "${card.type}" in card ${card.id}`)
  }
  const rarity = card.rarity.toLowerCase()
  if (!(VALID_RARITIES as readonly string[]).includes(rarity)) {
    throw new Error(`Unknown rarity "${card.rarity}" in card ${card.id}`)
  }

  const extras: Record<string, unknown> = {}
  if (
    card.subsystem_target !== null &&
    card.subsystem_target !== undefined &&
    card.subsystem_target !== ''
  ) {
    extras.subsystem_target = card.subsystem_target
  }
  if (card.escalation === true) extras.escalation = true
  if (card.dual_identity === true) extras.dual_identity = true
  if (card.cargo === true) extras.cargo = true

  return {
    id: card.id,
    type: dbType,
    name: card.name,
    energy_cost: card.energy_cost,
    attack: typeof card.attack === 'number' ? card.attack : null,
    defense: typeof card.defense === 'number' ? card.defense : null,
    rarity,
    archetype: card.archetype && card.archetype !== '' ? card.archetype : null,
    keywords: Array.isArray(card.keywords) ? card.keywords : [],
    effect_text: card.effect_text,
    flavor_text:
      card.flavor_text && card.flavor_text !== '' ? card.flavor_text : null,
    extras,
    active: true,
  }
}

function tally(rows: ReadonlyArray<{ rarity: string; type: string }>) {
  const rarity: Record<string, number> = {}
  const type: Record<string, number> = {}
  for (const r of rows) {
    rarity[r.rarity] = (rarity[r.rarity] ?? 0) + 1
    type[r.type] = (type[r.type] ?? 0) + 1
  }
  return { rarity, type }
}

async function main() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.',
    )
    console.error(
      'Set them via .env.local source or shell export before running.',
    )
    process.exit(1)
  }

  console.log('AFS-6d alpha_cards seed — loading source data...')
  const source = loadCards()
  console.log(`Loaded ${source.length} source cards.`)

  console.log('Transforming to schema...')
  const rows = source.map(transform)

  const local = tally(rows)
  console.log('Local rarity distribution:', local.rarity)
  console.log('Local type distribution:', local.type)

  for (const [r, expected] of Object.entries(EXPECTED_DISTRIBUTION)) {
    if (local.rarity[r] !== expected) {
      throw new Error(
        `Local rarity mismatch for "${r}": got ${local.rarity[r] ?? 0}, expected ${expected}`,
      )
    }
  }
  if (Object.keys(local.type).length !== 9) {
    throw new Error(
      `Expected 9 types, got ${Object.keys(local.type).length}: ${Object.keys(local.type).join(', ')}`,
    )
  }

  const CHUNK = 100
  const totalChunks = Math.ceil(rows.length / CHUNK)
  console.log(`Upserting ${rows.length} cards in ${totalChunks} chunks of ${CHUNK}...`)
  let written = 0
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK)
    const { error } = await supabaseAdmin
      .from('alpha_cards')
      .upsert(chunk, { onConflict: 'id' })
    if (error) {
      console.error(`Chunk ${i / CHUNK + 1} failed:`, error.message)
      throw error
    }
    written += chunk.length
    console.log(
      `  chunk ${i / CHUNK + 1}/${totalChunks}: ${chunk.length} cards (cumulative ${written})`,
    )
  }

  console.log('Verifying via SELECT count + distribution...')
  const { count: totalCount, error: countErr } = await supabaseAdmin
    .from('alpha_cards')
    .select('*', { count: 'exact', head: true })
  if (countErr) throw countErr
  console.log(`alpha_cards total rows: ${totalCount}`)
  if (totalCount !== 1000) {
    throw new Error(`Expected 1000 rows after seed, got ${totalCount}`)
  }

  const { data: dbRows, error: rErr } = await supabaseAdmin
    .from('alpha_cards')
    .select('rarity, type')
  if (rErr) throw rErr

  const db = tally(dbRows ?? [])
  console.log('DB rarity distribution:', db.rarity)
  console.log('DB type distribution:', db.type)

  for (const [r, expected] of Object.entries(EXPECTED_DISTRIBUTION)) {
    if (db.rarity[r] !== expected) {
      throw new Error(
        `DB rarity mismatch for "${r}": got ${db.rarity[r] ?? 0}, expected ${expected}`,
      )
    }
  }
  if (Object.keys(db.type).length !== 9) {
    throw new Error(
      `DB has ${Object.keys(db.type).length} types, expected 9: ${Object.keys(db.type).join(', ')}`,
    )
  }

  const { data: samples, error: sErr } = await supabaseAdmin
    .from('alpha_cards')
    .select('id, name, type, rarity, energy_cost, attack, defense, archetype')
    .order('id', { ascending: true })
    .limit(3)
  if (sErr) throw sErr
  console.log('First 3 cards by id (sanity check):')
  for (const c of samples ?? []) {
    console.log(
      `  ${c.id}: "${c.name}" [${c.type}/${c.rarity}] cost=${c.energy_cost} atk=${c.attack ?? '-'} def=${c.defense ?? '-'} archetype=${c.archetype ?? '-'}`,
    )
  }

  console.log('AFS-6d seed complete: 1000 cards verified.')
}

main().catch((err) => {
  console.error('SEED FAILED:', err)
  process.exit(1)
})
