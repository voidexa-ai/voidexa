// lib/voidforge/candidate-pool.ts
//
// Builds a CandidateModelPool for a given cockpit template by matching every
// active model against every role on the template. Each candidate is scored
// twice:
//   styleScore — how well its tags align with the template's style profile
//   fitScore   — combined style + role weight + quality tier, lightly tempered
//                by required/forbidden tags and preferredTemplates hints
//
// The scores feed Opus's planning payload — Opus never chooses models that
// didn't make the pool.

import type {
  CandidateForRole,
  CandidateModelPool,
  CockpitTemplate,
  ModelWithMetadata,
  TemplateRole,
  TemplateStyleProfile,
} from './types'

const QUALITY_WEIGHT: Record<string, number> = {
  starter: 0.2,
  standard: 0.4,
  premium: 0.7,
  legendary: 1.0,
}

function styleMatchScore(tags: string[], profile: TemplateStyleProfile): number {
  if (tags.length === 0) return 0
  let sum = 0
  let hits = 0
  for (const [style, weight] of Object.entries(profile)) {
    if (tags.includes(style)) {
      sum += weight ?? 0
      hits++
    }
  }
  if (hits === 0) return 0
  // Scale by how many of the profile styles we matched.
  const profileSize = Math.max(1, Object.keys(profile).length)
  return Math.min(1, sum / profileSize)
}

function passesRoleGates(model: ModelWithMetadata, role: TemplateRole): boolean {
  // Category gate
  if (role.allowedCategories.length > 0 && !role.allowedCategories.includes(model.metadata.category)) {
    return false
  }
  if (
    role.allowedSubcategories.length > 0 &&
    !role.allowedSubcategories.includes(model.metadata.subcategory)
  ) {
    return false
  }
  // Tag gates
  for (const required of role.requiredTags) {
    if (!model.tags.includes(required)) return false
  }
  for (const forbidden of role.forbiddenTags) {
    if (model.tags.includes(forbidden)) return false
  }
  // Anchor availability — if the role wants a specific anchor socket type,
  // the model must expose at least one socket of that type (only meaningful
  // when the role expects the child to *provide* that anchor).
  //
  // We do NOT enforce the anchor on the child here because the anchor lives
  // on the parent. This gate is the placement engine's concern.
  return true
}

export function scoreCandidate(
  model: ModelWithMetadata,
  role: TemplateRole,
  template: CockpitTemplate
): CandidateForRole | null {
  if (!passesRoleGates(model, role)) return null

  const styleScore = styleMatchScore(model.tags, template.styleProfile)
  const qualityBoost = QUALITY_WEIGHT[model.metadata.qualityTier] ?? 0.3

  // Compatibility.preferredTemplates bonus — explicit curator hint.
  const prefersThisTemplate = (model.metadata.compatibility.preferredTemplates ?? []).includes(template.slug)
  const preferredBonus = prefersThisTemplate ? 0.2 : 0

  // Role-hint alignment — if the model declared role_hints, does this role match?
  const hints = model.metadata.semantics?.role_hints ?? []
  const roleHintBonus = hints.includes(role.roleKey as never) ? 0.15 : 0

  const roleWeight = model.metadata.roleWeight ?? 1

  const fitScore = Math.min(
    1,
    styleScore * 0.45 +
      qualityBoost * 0.25 +
      preferredBonus +
      roleHintBonus +
      Math.min(0.15, (roleWeight - 1) * 0.15 + 0.1)
  )

  return {
    modelSlug: model.slug,
    displayName: model.displayName,
    category: model.metadata.category,
    subcategory: model.metadata.subcategory,
    tags: model.tags,
    roleWeight,
    qualityTier: model.metadata.qualityTier,
    styleScore,
    fitScore,
    sockets: model.sockets,
    aabb: model.metadata.aabb,
    semantics: model.metadata.semantics,
  }
}

export function buildCandidatePool(
  template: CockpitTemplate,
  models: ModelWithMetadata[],
  limitPerRole = 8
): CandidateModelPool {
  const candidatesByRole: Record<string, CandidateForRole[]> = {}

  for (const role of template.roles) {
    const scored: CandidateForRole[] = []
    for (const model of models) {
      const c = scoreCandidate(model, role, template)
      if (c) scored.push(c)
    }
    scored.sort((a, b) => b.fitScore - a.fitScore)
    candidatesByRole[role.roleKey] = scored.slice(0, limitPerRole)
  }

  return {
    templateSlug: template.slug,
    candidatesByRole,
  }
}
