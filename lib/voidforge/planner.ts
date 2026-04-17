// lib/voidforge/planner.ts
//
// Calls Opus 4.7 to produce an AssemblyPlan: which model plays which role,
// plus alternates for the repair engine to swap in. Opus never sees or emits
// transforms — the placement engine handles geometry downstream.

import Anthropic from '@anthropic-ai/sdk'
import type {
  AssemblyPlan,
  CandidateModelPool,
  CockpitTemplate,
  NormalizedGenerationInput,
  RoleAssignment,
} from './types'
import { buildPlannerPayload, buildUserMessage, VOIDFORGE_SYSTEM_PROMPT } from './prompts'

// Opus 4.7 model ID. Override with VOIDFORGE_OPUS_MODEL env var if Anthropic
// ships a new snapshot and the alias lags.
const OPUS_MODEL = (process.env.VOIDFORGE_OPUS_MODEL || 'claude-opus-4-7').trim()

let _client: Anthropic | null = null
function client(): Anthropic {
  if (_client) return _client
  // Defensive trim — Vercel env values often carry paste-artifact trailing
  // "\r\n" that round-trips through the dashboard as literal text. Anthropic
  // then rejects the x-api-key header with 401. Seen before in this repo on
  // Stripe keys (session 2026-04-13).
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim().replace(/\\r?\\n$/g, '')
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing')
  _client = new Anthropic({ apiKey })
  return _client
}

export interface PlannerOptions {
  temperature?: number
  maxTokens?: number
  signal?: AbortSignal
}

export interface PlannerResult {
  plan: AssemblyPlan
  rawResponseText: string
}

// ---------- Helpers ----------

function stripCodeFence(text: string): string {
  const fenced = text.trim().match(/^```(?:json)?\s*([\s\S]*?)```$/i)
  return fenced ? fenced[1].trim() : text.trim()
}

function firstJsonObject(text: string): string {
  const cleaned = stripCodeFence(text)
  const start = cleaned.indexOf('{')
  if (start < 0) throw new Error('planner returned no JSON object')
  let depth = 0
  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return cleaned.slice(start, i + 1)
    }
  }
  throw new Error('planner JSON object not closed')
}

function validatePlan(
  raw: unknown,
  template: CockpitTemplate,
  pool: CandidateModelPool
): AssemblyPlan {
  if (!raw || typeof raw !== 'object') throw new Error('planner response not an object')
  const obj = raw as Record<string, unknown>

  const templateSlug = typeof obj.templateSlug === 'string' ? obj.templateSlug : template.slug
  if (templateSlug !== template.slug) {
    throw new Error(`planner returned templateSlug=${templateSlug}, expected ${template.slug}`)
  }

  const styleSummary = typeof obj.styleSummary === 'string' ? obj.styleSummary : ''
  const rawAssignments = Array.isArray(obj.roleAssignments) ? obj.roleAssignments : []

  const validRoleKeys = new Set(template.roles.map((r) => r.roleKey))
  const assignments: RoleAssignment[] = []

  for (const a of rawAssignments as Array<Record<string, unknown>>) {
    const roleKey = String(a.roleKey ?? '')
    if (!validRoleKeys.has(roleKey)) continue
    const roleCandidates = pool.candidatesByRole[roleKey] ?? []
    const allowedSlugs = new Set(roleCandidates.map((c) => c.modelSlug))

    const chosen = typeof a.chosenModelSlug === 'string' ? a.chosenModelSlug : ''
    if (chosen && !allowedSlugs.has(chosen)) {
      throw new Error(`planner chose "${chosen}" for ${roleKey}, not in candidate pool`)
    }
    const alternates = Array.isArray(a.alternateModelSlugs)
      ? (a.alternateModelSlugs as unknown[])
          .filter((s): s is string => typeof s === 'string')
          .filter((s) => allowedSlugs.has(s) && s !== chosen)
      : []

    assignments.push({
      roleKey,
      chosenModelSlug: chosen,
      alternateModelSlugs: alternates,
      rationale: typeof a.rationale === 'string' ? a.rationale : '',
      confidence:
        typeof a.confidence === 'number' ? Math.max(0, Math.min(1, a.confidence)) : 0.5,
    })
  }

  // Ensure every required role got an assignment with a non-empty chosenModelSlug.
  for (const role of template.roles) {
    if (!role.isRequired) continue
    const match = assignments.find((a) => a.roleKey === role.roleKey)
    if (!match || !match.chosenModelSlug) {
      throw new Error(`planner missing required role "${role.roleKey}"`)
    }
  }

  return { templateSlug, styleSummary, roleAssignments: assignments }
}

// ---------- Main entrypoint ----------

export async function planAssembly(
  input: NormalizedGenerationInput,
  template: CockpitTemplate,
  pool: CandidateModelPool,
  opts: PlannerOptions = {}
): Promise<PlannerResult> {
  const payload = buildPlannerPayload(input, template, pool)
  const userMessage = buildUserMessage(payload)

  const response = await client().messages.create(
    {
      model: OPUS_MODEL,
      max_tokens: opts.maxTokens ?? 2048,
      temperature: opts.temperature ?? 0.4,
      system: VOIDFORGE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    },
    { signal: opts.signal }
  )

  const rawText = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')

  const jsonText = firstJsonObject(rawText)
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch (e) {
    throw new Error(`planner JSON parse failed: ${e instanceof Error ? e.message : String(e)}`)
  }

  const plan = validatePlan(parsed, template, pool)
  return { plan, rawResponseText: rawText }
}

export async function planVariants(
  input: NormalizedGenerationInput,
  template: CockpitTemplate,
  pool: CandidateModelPool,
  variantCount = 3
): Promise<PlannerResult[]> {
  const temperatures = [0.3, 0.55, 0.8].slice(0, variantCount)
  const results: PlannerResult[] = []
  for (const t of temperatures) {
    results.push(await planAssembly(input, template, pool, { temperature: t }))
  }
  return results
}
