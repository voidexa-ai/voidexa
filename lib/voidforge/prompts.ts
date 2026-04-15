// lib/voidforge/prompts.ts
//
// Opus system prompt + payload construction for VoidForge planning calls.
// Opus only chooses models for each role — never transforms, never geometry.

import type {
  CandidateModelPool,
  CockpitTemplate,
  NormalizedGenerationInput,
} from './types'

export const VOIDFORGE_SYSTEM_PROMPT = `You are the planning engine for VoidForge, a modular cockpit assembly system.

You do not produce transforms, geometry math, or freeform prose.
You only choose the best model for each role from the provided model pool.

Your job:
1. Respect the selected cockpit template.
2. Choose models that are stylistically coherent.
3. Respect compatibility, role hints, and context tags.
4. Favor parts that fit the user's requested feel.
5. Prefer parts with stronger template compatibility.
6. Return strict JSON only.

Never invent models that are not in the provided list.
Never return coordinates.
Never return markdown.`

export interface PlannerPayload {
  user: {
    prompt: string
    style: NormalizedGenerationInput['style']
    complexity: NormalizedGenerationInput['complexity']
  }
  template: {
    slug: string
    name: string
    description?: string
    styleProfile: CockpitTemplate['styleProfile']
    rules: CockpitTemplate['rules']
    roles: Array<{
      roleKey: string
      roleName: string
      isRequired: boolean
      minCount: number
      maxCount: number
      symmetryGroup?: string
      placementPhase: number
      rolePriority: number
    }>
  }
  modelPool: CandidateModelPool['candidatesByRole']
  responseSchema: {
    templateSlug: string
    styleSummary: string
    roleAssignments: Array<{
      roleKey: string
      chosenModelSlug: string
      alternateModelSlugs: string[]
      rationale: string
      confidence: number
    }>
  }
}

export function buildPlannerPayload(
  input: NormalizedGenerationInput,
  template: CockpitTemplate,
  pool: CandidateModelPool
): PlannerPayload {
  return {
    user: {
      prompt: input.promptText,
      style: input.style,
      complexity: input.complexity,
    },
    template: {
      slug: template.slug,
      name: template.name,
      description: template.description,
      styleProfile: template.styleProfile,
      rules: template.rules,
      roles: template.roles.map((r) => ({
        roleKey: r.roleKey,
        roleName: r.roleName,
        isRequired: r.isRequired,
        minCount: r.minCount,
        maxCount: r.maxCount,
        symmetryGroup: r.symmetryGroup,
        placementPhase: r.placementPhase,
        rolePriority: r.rolePriority,
      })),
    },
    modelPool: pool.candidatesByRole,
    responseSchema: {
      templateSlug: template.slug,
      styleSummary: 'short description of the style you chose',
      roleAssignments: [
        {
          roleKey: 'example_role_key',
          chosenModelSlug: 'example_model_slug',
          alternateModelSlugs: ['alt1', 'alt2'],
          rationale: 'one sentence',
          confidence: 0.0,
        },
      ],
    },
  }
}

export function buildUserMessage(payload: PlannerPayload): string {
  return (
    'Plan a cockpit assembly using the following inputs. Return strict JSON only, ' +
    'matching the responseSchema shape. Choose exactly one chosenModelSlug per ' +
    'required role from its candidate list; optional roles may be omitted by ' +
    'setting chosenModelSlug to an empty string. alternateModelSlugs must also be ' +
    'drawn from the same candidate list. Do not invent slugs.\n\n' +
    JSON.stringify(payload, null, 2)
  )
}
