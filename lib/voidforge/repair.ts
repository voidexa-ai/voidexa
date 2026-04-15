// lib/voidforge/repair.ts
//
// Deterministic repair engine. Given a (plan, assembly, report), walks through
// up to 3 iterations of the following strategies and revalidates after each:
//
//   1. Nudge — for VF_COL_001/002/003 with a defined overlap payload, shove
//      the offender away from the partner along the smallest overlap axis by
//      (overlap + tolerance). Does not alter parent/child relationships.
//   2. Remove — drop the lowest-priority optional instance that still has any
//      attached error. Required roles (core_shell, interior_bay, and anything
//      flagged isRequired in the template) are never removed.
//   3. Swap — for an offender whose plan entry has alternateModelSlugs, swap
//      in the next alternate and re-place it off the same parent socket.
//
// Repair stops as soon as validator.passed becomes true, or after 3 iterations.
// No AI calls.

import type {
  AssemblyInstance,
  AssemblyJson,
  AssemblyPlan,
  CockpitTemplate,
  ModelWithMetadata,
  RepairAction,
  RepairReport,
  RepairStrategy,
  TemplateRole,
  ValidationIssue,
  ValidationReport,
  ValidationRuleCode,
  Vec3,
} from './types'
import { validateAssembly } from './validator'
import { computeWorldAABB, minOverlapAxis } from './utils/collisions'
import { clampScale } from './utils/transforms'

const MAX_ITERATIONS = 3
const COLLISION_TOLERANCE = 0.05

const COLLISION_RULES: Set<ValidationRuleCode> = new Set(['VF_COL_001', 'VF_COL_002', 'VF_COL_003', 'VF_CLIP_003'])

export interface RepairResult {
  assembly: AssemblyJson
  finalReport: ValidationReport
  repairReport: RepairReport
}

function cloneAssembly(a: AssemblyJson): AssemblyJson {
  return {
    ...a,
    instances: a.instances.map((i) => ({ ...i, position: { ...i.position }, rotationEuler: { ...i.rotationEuler }, scale: { ...i.scale } })),
  }
}

// Move `target` away from `related` along the smallest-overlap axis.
function nudgeInstance(
  assembly: AssemblyJson,
  catalog: Map<string, ModelWithMetadata>,
  target: AssemblyInstance,
  related: AssemblyInstance
): boolean {
  const tModel = catalog.get(target.modelSlug)
  const rModel = catalog.get(related.modelSlug)
  if (!tModel || !rModel) return false

  const tBox = computeWorldAABB(target, tModel)
  const rBox = computeWorldAABB(related, rModel)

  // Recompute overlap now — the issue payload could be stale after prior repairs.
  const dx = Math.min(tBox.max.x, rBox.max.x) - Math.max(tBox.min.x, rBox.min.x)
  const dy = Math.min(tBox.max.y, rBox.max.y) - Math.max(tBox.min.y, rBox.min.y)
  const dz = Math.min(tBox.max.z, rBox.max.z) - Math.max(tBox.min.z, rBox.min.z)
  if (dx <= 0 || dy <= 0 || dz <= 0) return false

  const overlap = { overlaps: true, overlapVec: { x: dx, y: dy, z: dz }, volume: dx * dy * dz }
  const axis = minOverlapAxis(overlap)
  const distance = overlap.overlapVec[axis] + COLLISION_TOLERANCE

  // Push target away from related along the chosen axis.
  const sign = tBox.center[axis] < rBox.center[axis] ? -1 : 1
  const delta: Vec3 = { x: 0, y: 0, z: 0 }
  delta[axis] = sign * distance

  target.position = {
    x: target.position.x + delta.x,
    y: target.position.y + delta.y,
    z: target.position.z + delta.z,
  }
  void clampScale // keep util referenced — scale not mutated on nudge
  void assembly // mutation is in place on the instances array
  return true
}

function resolveRoleForInstance(instance: AssemblyInstance, template: CockpitTemplate): TemplateRole | undefined {
  return template.roles.find((r) => r.roleKey === instance.roleKey)
}

// Pick the first error issue whose target/related instance isn't the core_shell.
function firstActionableIssue(report: ValidationReport): ValidationIssue | undefined {
  return report.issues.find((i) => i.severity === 'error') ?? report.issues.find((i) => i.severity === 'warning')
}

function tryNudge(
  assembly: AssemblyJson,
  catalog: Map<string, ModelWithMetadata>,
  issue: ValidationIssue
): { success: boolean; description: string; resolved: ValidationRuleCode[] } {
  if (!issue.targetInstanceId || !issue.relatedInstanceId) {
    return { success: false, description: 'nudge needs target + related', resolved: [] }
  }
  if (!COLLISION_RULES.has(issue.ruleCode)) {
    return { success: false, description: `${issue.ruleCode} not a collision rule`, resolved: [] }
  }
  const target = assembly.instances.find((i) => i.instanceId === issue.targetInstanceId)
  const related = assembly.instances.find((i) => i.instanceId === issue.relatedInstanceId)
  if (!target || !related) return { success: false, description: 'instances missing', resolved: [] }
  // Don't nudge the root.
  if (target.roleKey === 'core_shell') {
    return { success: false, description: 'cannot nudge core_shell', resolved: [] }
  }
  const moved = nudgeInstance(assembly, catalog, target, related)
  return {
    success: moved,
    description: `nudged ${target.roleKey} (${target.modelSlug}) away from ${related.roleKey}`,
    resolved: moved ? [issue.ruleCode] : [],
  }
}

function tryRemove(
  assembly: AssemblyJson,
  template: CockpitTemplate,
  report: ValidationReport
): { success: boolean; description: string; removedInstanceId?: string; resolved: ValidationRuleCode[] } {
  // Find instances that appear in any error issue.
  const flagged = new Set<string>()
  const ruleCodesByInstance = new Map<string, Set<ValidationRuleCode>>()
  for (const i of report.issues) {
    if (i.severity !== 'error') continue
    for (const id of [i.targetInstanceId, i.relatedInstanceId]) {
      if (!id) continue
      flagged.add(id)
      const set = ruleCodesByInstance.get(id) ?? new Set<ValidationRuleCode>()
      set.add(i.ruleCode)
      ruleCodesByInstance.set(id, set)
    }
  }

  // Choose the lowest-priority optional instance.
  const candidates = assembly.instances.filter((inst) => {
    if (!flagged.has(inst.instanceId)) return false
    if (inst.roleKey === 'core_shell' || inst.roleKey === 'interior_bay') return false
    const role = resolveRoleForInstance(inst, template)
    if (!role) return true // orphan role → removable
    return !role.isRequired
  })

  if (candidates.length === 0) {
    return { success: false, description: 'no removable candidates', resolved: [] }
  }
  // Pick highest rolePriority number (lowest importance) first.
  candidates.sort((a, b) => {
    const ra = resolveRoleForInstance(a, template)?.rolePriority ?? 999
    const rb = resolveRoleForInstance(b, template)?.rolePriority ?? 999
    return rb - ra
  })
  const victim = candidates[0]
  const codes = Array.from(ruleCodesByInstance.get(victim.instanceId) ?? [])
  assembly.instances = assembly.instances.filter((i) => i.instanceId !== victim.instanceId)
  return {
    success: true,
    description: `removed optional ${victim.roleKey} (${victim.modelSlug})`,
    removedInstanceId: victim.instanceId,
    resolved: codes,
  }
}

function trySwap(
  assembly: AssemblyJson,
  plan: AssemblyPlan,
  catalog: Map<string, ModelWithMetadata>,
  report: ValidationReport
): { success: boolean; description: string; swapped?: { instanceId: string; newSlug: string }; resolved: ValidationRuleCode[] } {
  // Find an error-flagged instance whose plan entry has remaining alternates.
  for (const issue of report.issues) {
    if (issue.severity !== 'error' || !issue.targetInstanceId) continue
    const inst = assembly.instances.find((i) => i.instanceId === issue.targetInstanceId)
    if (!inst) continue
    const assignment = plan.roleAssignments.find((a) => a.roleKey === inst.roleKey)
    if (!assignment || assignment.alternateModelSlugs.length === 0) continue
    const nextSlug = assignment.alternateModelSlugs[0]
    const nextModel = catalog.get(nextSlug)
    if (!nextModel) continue
    const currentModel = catalog.get(inst.modelSlug)
    if (!currentModel) continue

    // Swap slug + scale to the new model's defaultScale — reuse same socket offsets.
    inst.modelSlug = nextSlug
    const base = nextModel.metadata.defaultScale
    inst.scale = {
      x: inst.scale.x < 0 ? -base : base,
      y: base,
      z: base,
    }

    // Consume the alternate so we don't retry it.
    assignment.alternateModelSlugs = assignment.alternateModelSlugs.slice(1)
    // The original chosen becomes a fallback alternate.
    if (!assignment.alternateModelSlugs.includes(currentModel.slug)) {
      assignment.alternateModelSlugs.push(currentModel.slug)
    }
    assignment.chosenModelSlug = nextSlug

    return {
      success: true,
      description: `swapped ${inst.roleKey}: ${currentModel.slug} → ${nextSlug}`,
      swapped: { instanceId: inst.instanceId, newSlug: nextSlug },
      resolved: [issue.ruleCode],
    }
  }
  return { success: false, description: 'no swap candidate with alternates', resolved: [] }
}

export function repairAssembly(
  plan: AssemblyPlan,
  assembly: AssemblyJson,
  template: CockpitTemplate,
  models: ModelWithMetadata[]
): RepairResult {
  const catalog = new Map<string, ModelWithMetadata>()
  for (const m of models) catalog.set(m.slug, m)

  let current = cloneAssembly(assembly)
  let report = validateAssembly(current, template, models)
  const actions: RepairAction[] = []

  for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
    if (report.passed) break

    const focus = firstActionableIssue(report)
    if (!focus) break

    let action: RepairAction | null = null

    // Strategy 1: nudge (only for collision rules with both target + related).
    if (!action && focus.targetInstanceId && focus.relatedInstanceId && COLLISION_RULES.has(focus.ruleCode)) {
      const r = tryNudge(current, catalog, focus)
      action = {
        iteration,
        strategy: 'nudge' as RepairStrategy,
        targetInstanceId: focus.targetInstanceId,
        description: r.description,
        success: r.success,
        resolvedRuleCodes: r.resolved,
      }
      if (!r.success) action = null
    }

    // Strategy 2: remove
    if (!action) {
      const r = tryRemove(current, template, report)
      if (r.success) {
        action = {
          iteration,
          strategy: 'remove_optional' as RepairStrategy,
          targetInstanceId: r.removedInstanceId ?? '',
          description: r.description,
          success: true,
          resolvedRuleCodes: r.resolved,
        }
      }
    }

    // Strategy 3: swap
    if (!action) {
      const r = trySwap(current, plan, catalog, report)
      if (r.success && r.swapped) {
        action = {
          iteration,
          strategy: 'swap_alternate' as RepairStrategy,
          targetInstanceId: r.swapped.instanceId,
          description: r.description,
          success: true,
          resolvedRuleCodes: r.resolved,
        }
      }
    }

    if (!action) break
    actions.push(action)

    // Revalidate.
    report = validateAssembly(current, template, models)
  }

  return {
    assembly: current,
    finalReport: report,
    repairReport: {
      iterations: actions.length,
      actions,
      finalScore: report.score,
    },
  }
}
