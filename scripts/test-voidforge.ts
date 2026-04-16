// scripts/test-voidforge.ts
//
// End-to-end VoidForge diagnostic. Runs the full pipeline with console
// output at every stage so we can see exactly where a generation fails.
//
// Usage:
//   npx tsx scripts/test-voidforge.ts
//
// Requires:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   ANTHROPIC_API_KEY

import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import type {
  Axis,
  CandidateModelPool,
  CockpitTemplate,
  Model,
  ModelCategory,
  ModelMetadata,
  ModelWithMetadata,
  QualityTier,
  Socket,
  SocketType,
  SymmetryType,
} from '../lib/voidforge/types'
import { ALL_TEMPLATES, getTemplateBySlug } from '../lib/voidforge/templates'
import { buildCandidatePool } from '../lib/voidforge/candidate-pool'
import { buildPlannerPayload, buildUserMessage, VOIDFORGE_SYSTEM_PROMPT } from '../lib/voidforge/prompts'
import { placeAssembly } from '../lib/voidforge/placement'
import { validateAssembly } from '../lib/voidforge/validator'

// ---- Env + clients ----
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const OPUS_MODEL = process.env.VOIDFORGE_OPUS_MODEL || 'claude-opus-4-6'
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY })

// ---- Duplicated catalog fetch (server-only imports break tsx otherwise) ----
async function fetchCatalog(): Promise<ModelWithMetadata[]> {
  const [models, metas, tags, sockets] = await Promise.all([
    supabase.from('models').select('*').eq('is_active', true),
    supabase.from('model_metadata').select('*'),
    supabase.from('model_tags').select('*'),
    supabase.from('model_sockets').select('*'),
  ])
  if (models.error) throw models.error
  if (metas.error) throw metas.error
  if (tags.error) throw tags.error
  if (sockets.error) throw sockets.error

  const metaByModelId = new Map<string, (typeof metas.data)[number]>()
  for (const m of metas.data || []) metaByModelId.set(m.model_id, m)
  const tagsByModelId = new Map<string, string[]>()
  for (const t of tags.data || []) {
    const arr = tagsByModelId.get(t.model_id) || []
    arr.push(t.tag)
    tagsByModelId.set(t.model_id, arr)
  }
  const socketsByModelId = new Map<string, Socket[]>()
  for (const s of sockets.data || []) {
    const arr = socketsByModelId.get(s.model_id) || []
    arr.push({
      socketKey: s.socket_key,
      name: s.name,
      socketType: s.socket_type as SocketType,
      occupancy: s.occupancy as 'single' | 'multi',
      localPosition: { x: s.local_pos_x, y: s.local_pos_y, z: s.local_pos_z },
      localRotationEuler: { x: s.local_rot_x, y: s.local_rot_y, z: s.local_rot_z },
      normal: { x: s.normal_x, y: s.normal_y, z: s.normal_z },
      priority: s.priority,
      maxScaleDeviation: s.max_scale_deviation ?? undefined,
      mirroredSocketKey: s.mirrored_socket_key ?? undefined,
      metadata: s.metadata ?? {},
    })
    socketsByModelId.set(s.model_id, arr)
  }

  const out: ModelWithMetadata[] = []
  for (const m of models.data || []) {
    const meta = metaByModelId.get(m.id)
    if (!meta) continue
    const model: Model = {
      id: m.id,
      slug: m.slug,
      name: m.name,
      displayName: m.display_name,
      storagePath: m.storage_path,
      publicUrl: m.public_url,
      thumbnailUrl: m.thumbnail_url ?? undefined,
      isUploaded: m.is_uploaded,
      isActive: m.is_active,
      sourcePack: m.source_pack ?? undefined,
      sourceLicense: m.source_license ?? undefined,
      version: m.version,
    }
    const metadata: ModelMetadata = {
      id: meta.id,
      modelId: meta.model_id,
      category: meta.category as ModelCategory,
      subcategory: meta.subcategory,
      aabb: { x: meta.aabb_x, y: meta.aabb_y, z: meta.aabb_z },
      pivot: { x: meta.pivot_x, y: meta.pivot_y, z: meta.pivot_z },
      defaultScale: meta.default_scale,
      forwardAxis: meta.forward_axis as Axis,
      upAxis: meta.up_axis as Axis,
      symmetryType: meta.symmetry_type as SymmetryType,
      roleWeight: meta.role_weight,
      qualityTier: meta.quality_tier as QualityTier,
      metadataVersion: meta.metadata_version,
      semantics: (meta.semantics ?? {}) as ModelMetadata['semantics'],
      compatibility: (meta.compatibility ?? {}) as ModelMetadata['compatibility'],
      validation: (meta.validation ?? {}) as ModelMetadata['validation'],
    }
    out.push({
      ...model,
      metadata,
      tags: tagsByModelId.get(m.id) ?? [],
      sockets: socketsByModelId.get(m.id) ?? [],
    })
  }
  return out
}

// ---- Pretty-print helpers ----
function divider(title: string): void {
  console.log('\n' + '═'.repeat(72))
  console.log('  ' + title)
  console.log('═'.repeat(72))
}

function printPool(pool: CandidateModelPool, template: CockpitTemplate): void {
  for (const role of template.roles) {
    const list = pool.candidatesByRole[role.roleKey] ?? []
    console.log(
      `  [${role.isRequired ? 'REQ' : 'opt'}] ${role.roleKey} (${role.allowedCategories.join('|') || '*'}) → ${list.length} candidates`
    )
    for (const c of list.slice(0, 4)) {
      console.log(
        `        · ${c.modelSlug} (${c.category}) fit=${c.fitScore.toFixed(2)} style=${c.styleScore.toFixed(2)} tags=${c.tags.join(',')}`
      )
    }
    if (list.length === 0 && role.isRequired) {
      console.log('        ⚠ EMPTY and required — planner will fail')
    }
  }
}

// ---- Main ----
async function main() {
  divider('0. Environment')
  console.log('  OPUS_MODEL =', OPUS_MODEL)
  console.log('  SUPABASE_URL =', SUPABASE_URL?.slice(0, 40) + '…')

  divider('1. Catalog fetch')
  const catalog = await fetchCatalog()
  console.log(`  Models: ${catalog.length}`)
  const byCategory = new Map<string, number>()
  for (const m of catalog) {
    byCategory.set(m.metadata.category, (byCategory.get(m.metadata.category) ?? 0) + 1)
  }
  for (const [cat, n] of byCategory) console.log(`    ${cat}: ${n}`)
  const cockpitFrames = catalog.filter((m) => m.metadata.category === 'cockpit_frame')
  const cockpitInteriors = catalog.filter((m) => m.metadata.category === 'cockpit_interior')
  console.log(`  Frames w/ sockets: ${cockpitFrames.filter((f) => f.sockets.length > 0).length}/${cockpitFrames.length}`)
  console.log(`  Interiors w/ sockets: ${cockpitInteriors.filter((i) => i.sockets.length > 0).length}/${cockpitInteriors.length}`)

  divider('2. Template + candidate pool (compact_fighter)')
  const template = getTemplateBySlug('compact_fighter') ?? ALL_TEMPLATES[0]
  if (!template) throw new Error('no templates available')
  const pool = buildCandidatePool(template, catalog)
  printPool(pool, template)

  const requiredRolesWithNoCandidates = template.roles.filter(
    (r) => r.isRequired && (pool.candidatesByRole[r.roleKey] ?? []).length === 0
  )
  if (requiredRolesWithNoCandidates.length > 0) {
    console.log('\n  ✖ Pool is missing required candidates — Opus will be asked to pick from empty lists.')
  }

  divider('3. Opus planning call')
  const input = {
    promptText: 'aggressive fighter cockpit with sharp canopy',
    style: { aggressive: 0.8, military: 0.6 },
    complexity: 'medium' as const,
    variantCount: 1,
  }
  const payload = buildPlannerPayload(input, template, pool)
  const userMessage = buildUserMessage(payload)
  console.log(`  user message length: ${userMessage.length} chars`)
  console.log(`  candidate pool size: ${Object.values(pool.candidatesByRole).reduce((n, arr) => n + arr.length, 0)}`)

  let rawText = ''
  try {
    const response = await anthropic.messages.create({
      model: OPUS_MODEL,
      max_tokens: 2048,
      temperature: 0.4,
      system: VOIDFORGE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })
    rawText = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    console.log('  ✓ Opus responded. Length:', rawText.length)
    console.log('  ---- RAW RESPONSE (first 2000 chars) ----')
    console.log(rawText.slice(0, 2000))
    console.log('  ---- END RAW ----')
  } catch (e) {
    console.error('  ✖ Opus call failed:', e instanceof Error ? e.message : String(e))
    if (e instanceof Error && e.stack) console.error(e.stack)
    process.exit(2)
  }

  divider('4. JSON parse + validate')
  // Replicate planner's parse logic inline so we can see exactly what fails.
  function stripFence(text: string): string {
    const fenced = text.trim().match(/^```(?:json)?\s*([\s\S]*?)```$/i)
    return fenced ? fenced[1].trim() : text.trim()
  }
  function extractJson(text: string): string {
    const cleaned = stripFence(text)
    const start = cleaned.indexOf('{')
    if (start < 0) throw new Error('no JSON object found in response')
    let depth = 0
    for (let i = start; i < cleaned.length; i++) {
      const ch = cleaned[i]
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) return cleaned.slice(start, i + 1)
      }
    }
    throw new Error('unclosed JSON object')
  }

  let parsedPlan: { templateSlug: string; styleSummary: string; roleAssignments: Array<Record<string, unknown>> }
  try {
    const jsonText = extractJson(rawText)
    parsedPlan = JSON.parse(jsonText)
    console.log('  ✓ JSON parsed.')
    console.log('    templateSlug:', parsedPlan.templateSlug)
    console.log('    styleSummary:', parsedPlan.styleSummary)
    console.log('    roleAssignments:', parsedPlan.roleAssignments.length)
    for (const a of parsedPlan.roleAssignments) {
      console.log(
        `      · ${a.roleKey} → ${a.chosenModelSlug} (alternates: ${Array.isArray(a.alternateModelSlugs) ? (a.alternateModelSlugs as string[]).join(', ') : 'none'})`
      )
    }
  } catch (e) {
    console.error('  ✖ JSON parse failed:', e instanceof Error ? e.message : String(e))
    process.exit(3)
  }

  divider('5. Placement')
  try {
    const plan = {
      templateSlug: parsedPlan.templateSlug,
      styleSummary: parsedPlan.styleSummary,
      roleAssignments: parsedPlan.roleAssignments.map((a) => ({
        roleKey: String(a.roleKey),
        chosenModelSlug: String(a.chosenModelSlug ?? ''),
        alternateModelSlugs: Array.isArray(a.alternateModelSlugs) ? (a.alternateModelSlugs as string[]) : [],
        rationale: typeof a.rationale === 'string' ? a.rationale : '',
        confidence: typeof a.confidence === 'number' ? a.confidence : 0.5,
      })),
    }
    const assembly = placeAssembly(plan, template, catalog)
    console.log('  ✓ Placement succeeded. Instances:', assembly.instances.length)
    for (const inst of assembly.instances) {
      console.log(
        `    · ${inst.roleKey} ${inst.modelSlug} pos=(${inst.position.x.toFixed(2)},${inst.position.y.toFixed(2)},${inst.position.z.toFixed(2)}) parent=${inst.parentInstanceId ?? 'root'} socket=${inst.parentSocketKey ?? '-'}`
      )
    }

    divider('6. Validation')
    const report = validateAssembly(assembly, template, catalog)
    console.log(`  score=${report.score.toFixed(2)} passed=${report.passed} issues=${report.issues.length}`)
    for (const issue of report.issues.slice(0, 15)) {
      console.log(`    [${issue.severity.toUpperCase()}] ${issue.ruleCode}: ${issue.message}`)
    }
    if (report.issues.length > 15) console.log(`    … ${report.issues.length - 15} more`)
  } catch (e) {
    console.error('  ✖ Placement failed:', e instanceof Error ? e.message : String(e))
    if (e instanceof Error && e.stack) console.error(e.stack)
    process.exit(4)
  }

  console.log('\n✓ Diagnostic complete.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
