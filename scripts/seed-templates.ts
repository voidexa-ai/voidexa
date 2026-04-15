// scripts/seed-templates.ts
//
// Upsert the 5 cockpit templates from lib/voidforge/templates.ts into
// public.templates + public.template_roles.
//
// Usage:
//   npx tsx scripts/seed-templates.ts
//
// Idempotent. Safe to rerun — deletes + reinserts roles per template.

import { createClient } from '@supabase/supabase-js'
import { ALL_TEMPLATES } from '../lib/voidforge/templates'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function main() {
  let ok = 0
  for (const tpl of ALL_TEMPLATES) {
    const { data: tplRow, error: tErr } = await supabase
      .from('templates')
      .upsert(
        {
          slug: tpl.slug,
          name: tpl.name,
          template_type: tpl.templateType,
          description: tpl.description,
          style_profile: tpl.styleProfile,
          rules: tpl.rules,
          is_active: tpl.isActive,
          version: tpl.version,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single()
    if (tErr) throw tErr

    // Replace role set for this template.
    const { error: delErr } = await supabase.from('template_roles').delete().eq('template_id', tplRow.id)
    if (delErr) throw delErr

    const roleRows = tpl.roles.map((r) => ({
      template_id: tplRow.id,
      role_key: r.roleKey,
      role_name: r.roleName,
      role_type: r.roleType,
      is_required: r.isRequired,
      min_count: r.minCount,
      max_count: r.maxCount,
      allowed_categories: r.allowedCategories,
      allowed_subcategories: r.allowedSubcategories,
      required_tags: r.requiredTags,
      forbidden_tags: r.forbiddenTags,
      preferred_anchor: r.preferredAnchor,
      symmetry_group: r.symmetryGroup,
      placement_phase: r.placementPhase,
      role_priority: r.rolePriority,
      rules: r.rules ?? {},
    }))
    if (roleRows.length > 0) {
      const { error: rErr } = await supabase.from('template_roles').insert(roleRows)
      if (rErr) throw rErr
    }

    ok++
    console.log(`seeded ${tpl.slug} (${roleRows.length} roles)`)
  }
  console.log(`\nDone. ${ok}/${ALL_TEMPLATES.length} templates seeded.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
