// lib/voidforge/generate.ts
//
// Top-level orchestrator for the full VoidForge pipeline:
//
//   normalize → fetch catalog → select template → build candidate pool
//     → planVariants (Opus × N) → placement × N → validate × N → repair × N
//       → rank by (validation score, variant index) → return
//
// No DB writes here — persistence is the API-route layer's job. This module
// is pure (given the catalog) and unit-testable.

import type {
  AssemblyJson,
  AssemblyPlan,
  CandidateModelPool,
  CockpitTemplate,
  GenerationStatus,
  ModelWithMetadata,
  NormalizedGenerationInput,
  RepairReport,
  TemplateStyleProfile,
  ValidationReport,
} from './types'
import { ALL_TEMPLATES } from './templates'
import { fetchActiveModelCatalog } from './metadata'
import { buildCandidatePool } from './candidate-pool'
import { planAssembly } from './planner'
import { placeAssembly } from './placement'
import { validateAssembly } from './validator'
import { repairAssembly } from './repair'
import { extractStyleFromPrompt, selectTemplate } from './scoring'

export interface GenerateRequest {
  promptText: string
  style?: TemplateStyleProfile
  templateSlug?: string
  complexity?: 'low' | 'medium' | 'high'
  variantCount?: number
  seed?: number
  // Optional injection for tests or for offline replays.
  catalog?: ModelWithMetadata[]
  templates?: CockpitTemplate[]
}

export interface GeneratedVariant {
  variantIndex: number
  plan: AssemblyPlan
  rawPlannerText: string
  draftAssembly: AssemblyJson
  draftReport: ValidationReport
  finalAssembly: AssemblyJson
  finalReport: ValidationReport
  repairReport: RepairReport
  finalScore: number
  temperature: number
}

export interface GenerateResult {
  input: NormalizedGenerationInput
  template: CockpitTemplate
  pool: CandidateModelPool
  variants: GeneratedVariant[]
  status: GenerationStatus
  errorMessage?: string
}

export function normalizeRequest(req: GenerateRequest): NormalizedGenerationInput {
  const extracted = extractStyleFromPrompt(req.promptText)
  const style = { ...extracted, ...(req.style ?? {}) }
  return {
    promptText: req.promptText,
    style,
    templateSlug: req.templateSlug,
    complexity: req.complexity ?? 'medium',
    variantCount: Math.max(1, Math.min(5, req.variantCount ?? 3)),
    seed: req.seed,
  }
}

const VARIANT_TEMPERATURES = [0.3, 0.55, 0.8, 0.6, 0.9]

export async function generate(req: GenerateRequest): Promise<GenerateResult> {
  const input = normalizeRequest(req)
  const catalog = req.catalog ?? (await fetchActiveModelCatalog())
  const templates = (req.templates ?? ALL_TEMPLATES).filter((t) => t.isActive)
  const template = selectTemplate(templates, input.style, input.templateSlug)
  const pool = buildCandidatePool(template, catalog)

  const variants: GeneratedVariant[] = []
  const temperatures = VARIANT_TEMPERATURES.slice(0, input.variantCount)

  for (let i = 0; i < temperatures.length; i++) {
    const temperature = temperatures[i]
    try {
      const plannerResult = await planAssembly(input, template, pool, { temperature })
      const draft = placeAssembly(plannerResult.plan, template, catalog)
      const draftReport = validateAssembly(draft, template, catalog)
      const repaired = repairAssembly(plannerResult.plan, draft, template, catalog)

      variants.push({
        variantIndex: i,
        plan: plannerResult.plan,
        rawPlannerText: plannerResult.rawResponseText,
        draftAssembly: draft,
        draftReport,
        finalAssembly: repaired.assembly,
        finalReport: repaired.finalReport,
        repairReport: repaired.repairReport,
        finalScore: repaired.repairReport.finalScore,
        temperature,
      })
    } catch (e) {
      // Skip this variant but let siblings continue — a single planner failure
      // shouldn't fail the whole generation.
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(`[voidforge] variant ${i} failed: ${msg}`)
    }
  }

  if (variants.length === 0) {
    return {
      input,
      template,
      pool,
      variants: [],
      status: 'failed',
      errorMessage: 'All variants failed during planning or placement',
    }
  }

  // Rank: passed assemblies first, then by finalScore desc, then by temperature asc.
  variants.sort((a, b) => {
    if (a.finalReport.passed !== b.finalReport.passed) return a.finalReport.passed ? -1 : 1
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore
    return a.temperature - b.temperature
  })

  return {
    input,
    template,
    pool,
    variants,
    status: 'completed',
  }
}
