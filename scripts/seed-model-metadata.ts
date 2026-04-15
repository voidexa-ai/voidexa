// scripts/seed-model-metadata.ts
//
// Apply curated semantic metadata to every model row extracted by
// extract-model-metadata.ts. Sets:
//   - category / subcategory (overrides)
//   - quality_tier, symmetry_type, role_weight
//   - semantics.role_hints, descriptor, maturity
//   - compatibility.preferredTemplates, allowedSocketTypes
//   - style + context tags in model_tags table
//
// Usage:
//   npx tsx scripts/seed-model-metadata.ts
//
// Idempotent. Safe to rerun. Unknown slugs are skipped with a warning.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

type Seed = {
  slug: string
  category: string
  subcategory: string
  qualityTier: 'starter' | 'standard' | 'premium' | 'legendary'
  symmetryType: 'none' | 'bilateral' | 'radial' | 'mirrored_pair'
  roleWeight: number
  semantics: {
    descriptor: string
    role_hints: string[]
    maturity?: 'clean' | 'worn' | 'battle_damaged'
    notes?: string
  }
  compatibility: {
    preferredTemplates?: string[]
    allowedSocketTypes?: string[]
  }
  styleTags: string[]
  contextTags: string[]
}

// ---------- Seed table — one row per known .glb slug ----------
const SEEDS: Seed[] = [
  // ---- Hi-Rez cockpit frames ----
  {
    slug: 'hirez_cockpit01',
    category: 'cockpit_frame',
    subcategory: 'hirez_frame',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.0,
    semantics: {
      descriptor: 'Rounded multipurpose cockpit shell, moderate visibility',
      role_hints: ['core_shell'],
      maturity: 'clean',
    },
    compatibility: {
      preferredTemplates: ['compact_fighter', 'industrial_hauler'],
      allowedSocketTypes: ['interior_pair_mount'],
    },
    styleTags: ['sleek', 'civilian'],
    contextTags: ['cockpit', 'exterior_shell'],
  },
  {
    slug: 'hirez_cockpit02',
    category: 'cockpit_frame',
    subcategory: 'hirez_frame',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.0,
    semantics: {
      descriptor: 'Wide panoramic command bridge shell',
      role_hints: ['core_shell'],
      maturity: 'clean',
    },
    compatibility: {
      preferredTemplates: ['panoramic_bridge'],
      allowedSocketTypes: ['interior_pair_mount'],
    },
    styleTags: ['sleek', 'ceremonial'],
    contextTags: ['cockpit', 'exterior_shell', 'bridge'],
  },
  {
    slug: 'hirez_cockpit03',
    category: 'cockpit_frame',
    subcategory: 'hirez_frame',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.1,
    semantics: {
      descriptor: 'Narrow aggressive canopy, fighter-style pilot focus',
      role_hints: ['core_shell'],
      maturity: 'clean',
    },
    compatibility: {
      preferredTemplates: ['compact_fighter'],
      allowedSocketTypes: ['interior_pair_mount'],
    },
    styleTags: ['aggressive', 'military'],
    contextTags: ['cockpit', 'exterior_shell', 'fighter'],
  },
  {
    slug: 'hirez_cockpit04',
    category: 'cockpit_frame',
    subcategory: 'hirez_frame',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.0,
    semantics: {
      descriptor: 'Heavy armored cockpit shell, dense frontal armor',
      role_hints: ['core_shell'],
      maturity: 'worn',
    },
    compatibility: {
      preferredTemplates: ['heavy_military'],
      allowedSocketTypes: ['interior_pair_mount'],
    },
    styleTags: ['aggressive', 'military', 'industrial'],
    contextTags: ['cockpit', 'exterior_shell', 'armored'],
  },
  {
    slug: 'hirez_cockpit05',
    category: 'cockpit_frame',
    subcategory: 'hirez_frame',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.0,
    semantics: {
      descriptor: 'Pressure-vessel style hull, claustrophobic submarine feel',
      role_hints: ['core_shell'],
      maturity: 'worn',
    },
    compatibility: {
      preferredTemplates: ['submarine_command'],
      allowedSocketTypes: ['interior_pair_mount'],
    },
    styleTags: ['submarine', 'industrial', 'military'],
    contextTags: ['cockpit', 'exterior_shell', 'pressure_vessel'],
  },

  // ---- Hi-Rez cockpit interiors ----
  {
    slug: 'hirez_cockpit01_interior',
    category: 'cockpit_interior',
    subcategory: 'hirez_interior',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.0,
    semantics: {
      descriptor: 'Clean interior bay with seat + dual console',
      role_hints: ['interior_bay'],
      maturity: 'clean',
    },
    compatibility: {
      preferredTemplates: ['compact_fighter', 'industrial_hauler'],
      allowedSocketTypes: ['seat_mount', 'console_mount_left', 'console_mount_right', 'screen_mount'],
    },
    styleTags: ['sleek', 'civilian'],
    contextTags: ['cockpit', 'interior'],
  },
  {
    slug: 'hirez_cockpit02_interior',
    category: 'cockpit_interior',
    subcategory: 'hirez_interior',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.0,
    semantics: {
      descriptor: 'Wide bridge interior with open sightlines',
      role_hints: ['interior_bay'],
      maturity: 'clean',
    },
    compatibility: {
      preferredTemplates: ['panoramic_bridge'],
      allowedSocketTypes: ['seat_mount', 'console_mount_center', 'screen_mount'],
    },
    styleTags: ['sleek', 'ceremonial'],
    contextTags: ['cockpit', 'interior', 'bridge'],
  },
  {
    slug: 'hirez_cockpit03_interior',
    category: 'cockpit_interior',
    subcategory: 'hirez_interior',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.0,
    semantics: {
      descriptor: 'Tight fighter interior, single seat, forward focus',
      role_hints: ['interior_bay'],
      maturity: 'clean',
    },
    compatibility: {
      preferredTemplates: ['compact_fighter'],
      allowedSocketTypes: ['seat_mount', 'console_mount_left', 'console_mount_right', 'screen_mount', 'hud_anchor'],
    },
    styleTags: ['aggressive', 'military'],
    contextTags: ['cockpit', 'interior', 'fighter'],
  },
  {
    slug: 'hirez_cockpit04_interior',
    category: 'cockpit_interior',
    subcategory: 'hirez_interior',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.0,
    semantics: {
      descriptor: 'Armored interior with command-seat arrangement',
      role_hints: ['interior_bay'],
      maturity: 'worn',
    },
    compatibility: {
      preferredTemplates: ['heavy_military'],
      allowedSocketTypes: ['seat_mount', 'console_mount_left', 'console_mount_right', 'screen_mount', 'equipment_mount'],
    },
    styleTags: ['aggressive', 'military', 'industrial'],
    contextTags: ['cockpit', 'interior', 'armored'],
  },
  {
    slug: 'hirez_cockpit05_interior',
    category: 'cockpit_interior',
    subcategory: 'hirez_interior',
    qualityTier: 'premium',
    symmetryType: 'bilateral',
    roleWeight: 1.0,
    semantics: {
      descriptor: 'Screen-heavy submarine bay with dense equipment',
      role_hints: ['interior_bay'],
      maturity: 'worn',
    },
    compatibility: {
      preferredTemplates: ['submarine_command'],
      allowedSocketTypes: ['seat_mount', 'screen_mount', 'equipment_mount', 'wall_anchor'],
    },
    styleTags: ['submarine', 'industrial', 'military'],
    contextTags: ['cockpit', 'interior', 'pressure_vessel', 'dense'],
  },

  // ---- Equipment + screens ----
  {
    slug: 'hirez_equipments',
    category: 'equipment',
    subcategory: 'hirez_equipment',
    qualityTier: 'standard',
    symmetryType: 'none',
    roleWeight: 0.7,
    semantics: {
      descriptor: 'Misc floor/wall equipment accessory pack',
      role_hints: ['floor_equipment', 'wall_panel', 'accessory'],
      maturity: 'worn',
    },
    compatibility: {
      preferredTemplates: ['heavy_military', 'submarine_command', 'industrial_hauler'],
      allowedSocketTypes: ['floor_anchor', 'wall_anchor', 'equipment_mount', 'accessory_mount'],
    },
    styleTags: ['industrial', 'military'],
    contextTags: ['equipment', 'accessory'],
  },
  {
    slug: 'hirez_screens',
    category: 'screen',
    subcategory: 'hirez_screen',
    qualityTier: 'standard',
    symmetryType: 'mirrored_pair',
    roleWeight: 0.8,
    semantics: {
      descriptor: 'Cockpit screen pack — front + side displays',
      role_hints: ['front_screen', 'side_screen_left', 'side_screen_right', 'hud_overlay'],
      maturity: 'clean',
    },
    compatibility: {
      preferredTemplates: ['compact_fighter', 'heavy_military', 'submarine_command', 'panoramic_bridge'],
      allowedSocketTypes: ['screen_mount', 'hud_anchor'],
    },
    styleTags: ['sleek', 'military'],
    contextTags: ['screen', 'display', 'hud'],
  },

  // ---- Ships (not cockpit parts — tagged for future use) ----
  ...['qs_bob', 'qs_challenger', 'qs_executioner', 'qs_imperial', 'qs_omen', 'qs_spitfire', 'qs_striker'].map(
    (slug): Seed => ({
      slug,
      category: 'ship',
      subcategory: 'quaternius_ship',
      qualityTier: 'starter',
      symmetryType: 'bilateral',
      roleWeight: 0.5,
      semantics: { descriptor: 'Quaternius stylized ship hull', role_hints: [], maturity: 'clean' },
      compatibility: {},
      styleTags: ['sleek', 'civilian'],
      contextTags: ['ship', 'external'],
    })
  ),
  ...['usc_astroeagle01', 'usc_cosmicshark01', 'usc_voidwhale01'].map(
    (slug): Seed => ({
      slug,
      category: 'ship',
      subcategory: 'usc_ship',
      qualityTier: 'standard',
      symmetryType: 'bilateral',
      roleWeight: 0.5,
      semantics: { descriptor: 'USC ship hull', role_hints: [], maturity: 'clean' },
      compatibility: {},
      styleTags: ['sleek', 'military'],
      contextTags: ['ship', 'external'],
    })
  ),
  ...['uscx_galacticokamoto1', 'uscx_starforce01'].map(
    (slug): Seed => ({
      slug,
      category: 'ship',
      subcategory: 'uscx_ship',
      qualityTier: 'premium',
      symmetryType: 'bilateral',
      roleWeight: 0.6,
      semantics: { descriptor: 'USC Expansion ship hull', role_hints: [], maturity: 'clean' },
      compatibility: {},
      styleTags: ['sleek', 'military', 'aggressive'],
      contextTags: ['ship', 'external'],
    })
  ),
]

async function main() {
  const { data: models, error } = await supabase.from('models').select('id, slug')
  if (error) throw error
  const bySlug = new Map<string, string>()
  for (const m of models || []) bySlug.set(m.slug, m.id)

  let ok = 0
  let skipped = 0
  let failed = 0

  for (const seed of SEEDS) {
    const modelId = bySlug.get(seed.slug)
    if (!modelId) {
      console.warn(`skip ${seed.slug} — no matching row in models (run extract-model-metadata.ts first)`)
      skipped++
      continue
    }
    try {
      const { error: uErr } = await supabase
        .from('model_metadata')
        .update({
          category: seed.category,
          subcategory: seed.subcategory,
          quality_tier: seed.qualityTier,
          symmetry_type: seed.symmetryType,
          role_weight: seed.roleWeight,
          semantics: seed.semantics,
          compatibility: seed.compatibility,
          updated_at: new Date().toISOString(),
        })
        .eq('model_id', modelId)
      if (uErr) throw uErr

      // Tags: wipe + re-insert for this model (idempotent rerun).
      const { error: delErr } = await supabase.from('model_tags').delete().eq('model_id', modelId)
      if (delErr) throw delErr

      const tagRows = [
        ...seed.styleTags.map((tag) => ({ model_id: modelId, tag, tag_type: 'style' })),
        ...seed.contextTags.map((tag) => ({ model_id: modelId, tag, tag_type: 'context' })),
      ]
      if (tagRows.length > 0) {
        const { error: insErr } = await supabase.from('model_tags').insert(tagRows)
        if (insErr) throw insErr
      }

      ok++
      console.log(`seeded ${seed.slug}`)
    } catch (e) {
      failed++
      console.error(`  FAIL ${seed.slug}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed} total=${SEEDS.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
