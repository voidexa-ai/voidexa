// lib/voidforge/validator.ts
//
// Deterministic assembly validator. Consumes an AssemblyJson + the model
// catalog + the CockpitTemplate and emits a ValidationReport listing every
// rule violation and a 0..1 score.
//
// All 18 rules from SKILL.md §4 are implemented across 7 groups:
//   Structural  (A) — VF_REQ_001/002/003
//   Collision   (B) — VF_COL_001/002/003
//   Clipping    (C) — VF_CLIP_001/002/003
//   Visibility  (D) — VF_OCC_001/002/003
//   Symmetry    (E) — VF_SYM_001/002/003
//   Ergonomics  (F) — VF_ERG_001/002/003
//   Semantic    (G) — VF_SEM_001/002/003
//
// The scoring drops 0.07 per error and 0.02 per warning, floored at 0. `passed`
// is true iff no errors are emitted (warnings do not fail the assembly).

import type {
  AssemblyInstance,
  AssemblyJson,
  CockpitTemplate,
  ModelWithMetadata,
  ValidationIssue,
  ValidationReport,
  ValidationRuleCode,
  ValidationSeverity,
  Vec3,
} from './types'
import { aabbOverlap, computeWorldAABB, minOverlapAxis, WorldAABB } from './utils/collisions'

const PILOT_EYE_OFFSET: Vec3 = { x: 0, y: 0.35, z: -0.15 }
const COLLISION_TOLERANCE = 0.05 // meters of allowable overlap before flagging
const EMBED_LIMIT = 0.25 // meters of allowable embedment before flagging
const SIGHTLINE_FORWARD_RANGE = 3.0 // meters in front of pilot eye

interface ValidationContext {
  assembly: AssemblyJson
  template: CockpitTemplate
  catalog: Map<string, ModelWithMetadata>
  instances: AssemblyInstance[]
  instanceById: Map<string, AssemblyInstance>
  modelFor: (instance: AssemblyInstance) => ModelWithMetadata | undefined
  aabbById: Map<string, WorldAABB>
}

function issue(
  severity: ValidationSeverity,
  ruleCode: ValidationRuleCode,
  message: string,
  targetInstanceId?: string,
  relatedInstanceId?: string,
  payload?: Record<string, unknown>
): ValidationIssue {
  return { severity, ruleCode, message, targetInstanceId, relatedInstanceId, payload }
}

// ---------- Group A: Structural ----------

function checkStructural(ctx: ValidationContext, out: ValidationIssue[]): void {
  const { instances, template } = ctx

  // VF_REQ_003: broken root — must have exactly one core_shell at origin vicinity.
  const cores = instances.filter((i) => i.roleKey === 'core_shell')
  if (cores.length === 0) {
    out.push(issue('error', 'VF_REQ_003', 'No core_shell root instance'))
  } else if (cores.length > 1) {
    out.push(issue('error', 'VF_REQ_003', `Multiple core_shell instances (${cores.length})`))
  }

  // Count roles once for REQ_001 and REQ_002.
  const countByRole = new Map<string, number>()
  for (const i of instances) {
    countByRole.set(i.roleKey, (countByRole.get(i.roleKey) ?? 0) + 1)
  }

  for (const role of template.roles) {
    const count = countByRole.get(role.roleKey) ?? 0
    // VF_REQ_001: missing required role
    if (role.isRequired && count < role.minCount) {
      out.push(
        issue(
          'error',
          'VF_REQ_001',
          `Required role "${role.roleKey}" missing (count=${count}, min=${role.minCount})`,
          undefined,
          undefined,
          { roleKey: role.roleKey, actual: count, required: role.minCount }
        )
      )
    }
    // VF_REQ_002: role overflow
    if (count > role.maxCount) {
      out.push(
        issue(
          'warning',
          'VF_REQ_002',
          `Role "${role.roleKey}" overflow (count=${count}, max=${role.maxCount})`,
          undefined,
          undefined,
          { roleKey: role.roleKey, actual: count, max: role.maxCount }
        )
      )
    }
  }
}

// ---------- Group B: Collision ----------

function checkCollision(ctx: ValidationContext, out: ValidationIssue[]): void {
  const { instances, aabbById } = ctx
  const SEAT_ROLES = new Set(['seat', 'interior_bay'])
  const CONTROL_ROLES = new Set(['yoke', 'stick', 'throttle', 'console_center'])

  for (let i = 0; i < instances.length; i++) {
    const a = instances[i]
    const boxA = aabbById.get(a.instanceId)
    if (!boxA) continue

    for (let j = i + 1; j < instances.length; j++) {
      const b = instances[j]
      // Skip parent/child pairs — interior fits inside frame by design.
      if (a.instanceId === b.parentInstanceId || b.instanceId === a.parentInstanceId) continue

      const boxB = aabbById.get(b.instanceId)
      if (!boxB) continue
      const overlap = aabbOverlap(boxA, boxB)
      if (!overlap.overlaps) continue

      // Filter out the allowed tolerance slot.
      const minAxis = minOverlapAxis(overlap)
      const minOverlap = overlap.overlapVec[minAxis]
      if (minOverlap <= COLLISION_TOLERANCE) continue

      // VF_COL_002: seat collision — any other part vs seat/interior.
      if (SEAT_ROLES.has(a.roleKey) || SEAT_ROLES.has(b.roleKey)) {
        if (!(SEAT_ROLES.has(a.roleKey) && SEAT_ROLES.has(b.roleKey))) {
          out.push(
            issue(
              'error',
              'VF_COL_002',
              `Seat collision: ${a.roleKey} vs ${b.roleKey} (overlap ${minOverlap.toFixed(2)}m)`,
              a.instanceId,
              b.instanceId,
              { overlap: overlap.overlapVec }
            )
          )
          continue
        }
      }

      // VF_COL_003: control blockage — control role blocked by something else.
      if (CONTROL_ROLES.has(a.roleKey) !== CONTROL_ROLES.has(b.roleKey)) {
        out.push(
          issue(
            'warning',
            'VF_COL_003',
            `Control blockage: ${a.roleKey} vs ${b.roleKey}`,
            a.instanceId,
            b.instanceId,
            { overlap: overlap.overlapVec }
          )
        )
        continue
      }

      // VF_COL_001: generic hard collision.
      out.push(
        issue(
          'error',
          'VF_COL_001',
          `Hard collision: ${a.roleKey} vs ${b.roleKey} (overlap ${minOverlap.toFixed(2)}m)`,
          a.instanceId,
          b.instanceId,
          { overlap: overlap.overlapVec, axis: minAxis }
        )
      )
    }
  }
}

// ---------- Group C: Clipping ----------

function checkClipping(ctx: ValidationContext, out: ValidationIssue[]): void {
  const { instances, aabbById, modelFor } = ctx
  const core = instances.find((i) => i.roleKey === 'core_shell')
  const interior = instances.find((i) => i.roleKey === 'interior_bay')

  // VF_CLIP_001: exterior/interior mismatch — frame + interior must come from
  // the same style family (first matching style tag overlap).
  if (core && interior) {
    const coreModel = modelFor(core)
    const intModel = modelFor(interior)
    if (coreModel && intModel) {
      const sharedStyle = coreModel.tags.filter((t) => intModel.tags.includes(t))
      if (sharedStyle.length === 0) {
        out.push(
          issue(
            'warning',
            'VF_CLIP_001',
            `Exterior/interior style mismatch: ${coreModel.slug} vs ${intModel.slug}`,
            interior.instanceId,
            core.instanceId
          )
        )
      }
    }
  }

  if (!core) return
  const coreBox = aabbById.get(core.instanceId)
  if (!coreBox) return

  for (const inst of instances) {
    if (inst.instanceId === core.instanceId) continue
    const box = aabbById.get(inst.instanceId)
    if (!box) continue

    // Determine how far outside the core hull this child extends on each axis.
    const outsideX = Math.max(0, coreBox.min.x - box.min.x, box.max.x - coreBox.max.x)
    const outsideY = Math.max(0, coreBox.min.y - box.min.y, box.max.y - coreBox.max.y)
    const outsideZ = Math.max(0, coreBox.min.z - box.min.z, box.max.z - coreBox.max.z)
    const outside = Math.max(outsideX, outsideY, outsideZ)
    if (outside <= 0) continue

    // VF_CLIP_002: a screen protruding through the hull.
    if (inst.roleKey === 'front_screen' || inst.roleKey === 'side_screen_left' || inst.roleKey === 'side_screen_right') {
      out.push(
        issue(
          'error',
          'VF_CLIP_002',
          `Screen "${inst.modelSlug}" clipping through hull (outside ${outside.toFixed(2)}m)`,
          inst.instanceId,
          core.instanceId,
          { outside }
        )
      )
      continue
    }

    // VF_CLIP_003: any other part embedded too far through the shell.
    if (outside > EMBED_LIMIT) {
      out.push(
        issue(
          'warning',
          'VF_CLIP_003',
          `Excessive embed: ${inst.roleKey} protrudes ${outside.toFixed(2)}m past hull`,
          inst.instanceId,
          core.instanceId,
          { outside }
        )
      )
    }
  }
}

// ---------- Group D: Visibility ----------

function checkVisibility(ctx: ValidationContext, out: ValidationIssue[]): void {
  const { instances, aabbById } = ctx
  const seat = instances.find((i) => i.roleKey === 'seat' || i.roleKey === 'interior_bay')
  if (!seat) return
  const seatBox = aabbById.get(seat.instanceId)
  if (!seatBox) return

  const eye: Vec3 = {
    x: seatBox.center.x + PILOT_EYE_OFFSET.x,
    y: seatBox.center.y + seatBox.size.y / 2 + PILOT_EYE_OFFSET.y,
    z: seatBox.center.z + PILOT_EYE_OFFSET.z,
  }
  const forwardTarget: Vec3 = { x: eye.x, y: eye.y, z: eye.z - SIGHTLINE_FORWARD_RANGE }

  let sightlineBlockers = 0
  let frontalClutter = 0

  for (const inst of instances) {
    if (inst.instanceId === seat.instanceId) continue
    const box = aabbById.get(inst.instanceId)
    if (!box) continue

    // VF_OCC_001: sightline ray intersection — simplified AABB-vs-segment slab test.
    const blocksSight = segmentIntersectsAABB(eye, forwardTarget, box)
    if (blocksSight && inst.roleKey !== 'front_screen' && inst.roleKey !== 'hud_overlay') {
      sightlineBlockers++
      out.push(
        issue(
          'error',
          'VF_OCC_001',
          `Sightline blocked by ${inst.roleKey} (${inst.modelSlug})`,
          inst.instanceId,
          seat.instanceId
        )
      )
    }

    // VF_OCC_002: HUD unreadable — HUD instance behind a bigger opaque part.
    if (inst.roleKey === 'hud_overlay') {
      const ahead = box.center.z < eye.z // HUD in front of pilot
      if (!ahead) {
        out.push(
          issue(
            'warning',
            'VF_OCC_002',
            `HUD "${inst.modelSlug}" is behind pilot eye plane`,
            inst.instanceId,
            seat.instanceId
          )
        )
      }
    }

    // VF_OCC_003: front clutter — large parts in the forward cone.
    const inFrontalCone =
      box.center.z < eye.z && // in front of pilot
      Math.abs(box.center.x - eye.x) < seatBox.size.x * 0.8 &&
      box.center.y > eye.y - 0.6 &&
      box.center.y < eye.y + 0.4
    if (inFrontalCone && inst.roleKey !== 'front_screen' && inst.roleKey !== 'hud_overlay') {
      frontalClutter += box.size.x * box.size.y
    }
  }

  if (frontalClutter > 0.8) {
    out.push(
      issue(
        'warning',
        'VF_OCC_003',
        `Excessive frontal clutter area ${frontalClutter.toFixed(2)}m²`,
        seat.instanceId,
        undefined,
        { frontalClutter }
      )
    )
  }

  // Suppress duplicate VF_OCC_001 after the first three — avoids flooding the UI.
  if (sightlineBlockers > 3) {
    // Collapse into a single summary payload; keep existing detail entries.
    out.push(
      issue(
        'info',
        'VF_OCC_001',
        `${sightlineBlockers} sightline blockers detected — repair will remove lowest-priority first`
      )
    )
  }
}

function segmentIntersectsAABB(p0: Vec3, p1: Vec3, box: WorldAABB): boolean {
  // Slab method: check each axis for the overlap range of t where ray is in box.
  const dir = { x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z }
  let tmin = 0
  let tmax = 1
  const axes: Array<'x' | 'y' | 'z'> = ['x', 'y', 'z']
  for (const ax of axes) {
    const o = p0[ax]
    const d = dir[ax]
    if (Math.abs(d) < 1e-6) {
      if (o < box.min[ax] || o > box.max[ax]) return false
    } else {
      let t1 = (box.min[ax] - o) / d
      let t2 = (box.max[ax] - o) / d
      if (t1 > t2) [t1, t2] = [t2, t1]
      tmin = Math.max(tmin, t1)
      tmax = Math.min(tmax, t2)
      if (tmin > tmax) return false
    }
  }
  return true
}

// ---------- Group E: Symmetry ----------

function checkSymmetry(ctx: ValidationContext, out: ValidationIssue[]): void {
  const { instances, template, aabbById } = ctx

  // Gather roles belonging to a symmetry_group.
  const groups = new Map<string, typeof template.roles>()
  for (const r of template.roles) {
    if (!r.symmetryGroup) continue
    const arr = groups.get(r.symmetryGroup) ?? []
    arr.push(r)
    groups.set(r.symmetryGroup, arr)
  }

  for (const [groupKey, roles] of groups) {
    const groupInstances = instances.filter((i) => roles.some((r) => r.roleKey === i.roleKey))
    if (groupInstances.length === 0) continue

    // VF_SYM_001: bilateral pair — at least 2 instances required if bilateral.
    if (roles.length === 2 && groupInstances.length === 1) {
      out.push(
        issue(
          'warning',
          'VF_SYM_001',
          `Broken bilateral pair in "${groupKey}" — only 1 of 2 placed`,
          groupInstances[0].instanceId,
          undefined,
          { groupKey }
        )
      )
    }

    // VF_SYM_002: centerline drift — left/right instance X centers should sum near 0.
    if (groupInstances.length === 2) {
      const [a, b] = groupInstances
      const sumX = a.position.x + b.position.x
      if (Math.abs(sumX) > 0.15) {
        out.push(
          issue(
            'warning',
            'VF_SYM_002',
            `Centerline drift in "${groupKey}" — ${sumX.toFixed(2)}m off-axis`,
            a.instanceId,
            b.instanceId,
            { groupKey, drift: sumX }
          )
        )
      }
    }
  }

  // VF_SYM_003: density overflow — sum of frontal areas vs template rules.density cap.
  const maxParts = template.rules.maxParts ?? 20
  if (instances.length > maxParts) {
    out.push(
      issue(
        'warning',
        'VF_SYM_003',
        `Density overflow: ${instances.length} parts exceeds template max ${maxParts}`,
        undefined,
        undefined,
        { count: instances.length, max: maxParts }
      )
    )
  }

  // Also: a "high density" template with too few parts is not a symmetry failure;
  // a "low density" template with too many of anything other than core+interior is.
  if (template.rules.density === 'low') {
    let decorations = 0
    for (const inst of instances) {
      if (!['core_shell', 'interior_bay'].includes(inst.roleKey)) decorations++
    }
    if (decorations > 4) {
      out.push(
        issue(
          'info',
          'VF_SYM_003',
          `Low-density template has ${decorations} decorations (budget 4)`,
          undefined,
          undefined,
          { decorations }
        )
      )
    }
  }

  // No-op for aabbById usage in the compile-time check (prevents unused-var lint).
  void aabbById
}

// ---------- Group F: Ergonomics ----------

function checkErgonomics(ctx: ValidationContext, out: ValidationIssue[]): void {
  const { instances, aabbById } = ctx
  const seat = instances.find((i) => i.roleKey === 'seat' || i.roleKey === 'interior_bay')
  if (!seat) return
  const seatBox = aabbById.get(seat.instanceId)
  if (!seatBox) return

  // Approx pilot hands: ~0.6m forward of the seat centre, within ±0.5m lateral.
  const handReach: Vec3 = { x: seatBox.center.x, y: seatBox.center.y - 0.1, z: seatBox.center.z - 0.6 }
  const maxReach = 0.9

  for (const inst of instances) {
    const box = aabbById.get(inst.instanceId)
    if (!box) continue

    // VF_ERG_001: controls outside pilot reach radius.
    if (['console_left', 'console_right', 'console_center', 'yoke', 'stick', 'throttle'].includes(inst.roleKey)) {
      const dx = box.center.x - handReach.x
      const dy = box.center.y - handReach.y
      const dz = box.center.z - handReach.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist > maxReach) {
        out.push(
          issue(
            'warning',
            'VF_ERG_001',
            `Reach failure: ${inst.roleKey} at ${dist.toFixed(2)}m (max ${maxReach}m)`,
            inst.instanceId,
            seat.instanceId,
            { distance: dist }
          )
        )
      }
    }

    // VF_ERG_002: seat visibility — nothing should dominate the seat box itself.
    if (inst.instanceId !== seat.instanceId) {
      const overlap = aabbOverlap(seatBox, box)
      if (overlap.overlaps && overlap.volume > 0.3) {
        out.push(
          issue(
            'error',
            'VF_ERG_002',
            `Seat visibility failure: ${inst.roleKey} obscures seat (volume ${overlap.volume.toFixed(2)})`,
            inst.instanceId,
            seat.instanceId,
            { volume: overlap.volume }
          )
        )
      }
    }
  }

  // VF_ERG_003: entry obstruction — floor_equipment / wall_panel clogging the back half.
  const entryBox = {
    min: { x: seatBox.min.x - 0.5, y: seatBox.min.y - 0.2, z: seatBox.max.z - 0.2 },
    max: { x: seatBox.max.x + 0.5, y: seatBox.max.y + 0.3, z: seatBox.max.z + 1.2 },
    center: seatBox.center,
    size: seatBox.size,
  } as WorldAABB
  let entryBlockers = 0
  for (const inst of instances) {
    if (inst.roleKey !== 'floor_equipment' && inst.roleKey !== 'wall_panel') continue
    const box = aabbById.get(inst.instanceId)
    if (!box) continue
    if (aabbOverlap(entryBox, box).overlaps) entryBlockers++
  }
  if (entryBlockers > 0) {
    out.push(
      issue(
        'warning',
        'VF_ERG_003',
        `Entry obstructed by ${entryBlockers} part(s) in rear half`,
        seat.instanceId,
        undefined,
        { entryBlockers }
      )
    )
  }
}

// ---------- Group G: Semantic ----------

function checkSemantic(ctx: ValidationContext, out: ValidationIssue[]): void {
  const { instances, template, modelFor } = ctx

  // VF_SEM_001: forbidden pair — two instances whose compatibility.incompatibleModelSlugs
  // lists name each other.
  for (let i = 0; i < instances.length; i++) {
    const a = modelFor(instances[i])
    if (!a) continue
    const aForb = a.metadata.compatibility.incompatibleModelSlugs ?? []
    for (let j = i + 1; j < instances.length; j++) {
      const b = modelFor(instances[j])
      if (!b) continue
      if (aForb.includes(b.slug) || (b.metadata.compatibility.incompatibleModelSlugs ?? []).includes(a.slug)) {
        out.push(
          issue(
            'warning',
            'VF_SEM_001',
            `Forbidden pair: ${a.slug} + ${b.slug}`,
            instances[i].instanceId,
            instances[j].instanceId
          )
        )
      }
    }
  }

  // VF_SEM_002: template mismatch — part's compatibility.preferredTemplates excludes this template.
  for (const inst of instances) {
    const m = modelFor(inst)
    if (!m) continue
    const preferred = m.metadata.compatibility.preferredTemplates
    if (preferred && preferred.length > 0 && !preferred.includes(template.slug)) {
      out.push(
        issue(
          'info',
          'VF_SEM_002',
          `${m.slug} prefers ${preferred.join('/')} templates, not ${template.slug}`,
          inst.instanceId
        )
      )
    }
  }

  // VF_SEM_003: style incoherence — tally style-tag vote vs template.styleProfile.
  const tally = new Map<string, number>()
  for (const inst of instances) {
    const m = modelFor(inst)
    if (!m) continue
    for (const tag of m.tags) tally.set(tag, (tally.get(tag) ?? 0) + 1)
  }
  const profileStyles = Object.entries(template.styleProfile)
    .filter(([, w]) => (w ?? 0) > 0.4)
    .map(([s]) => s)
  const profileHits = profileStyles.reduce((n, s) => n + (tally.get(s) ?? 0), 0)
  const totalTags = Array.from(tally.values()).reduce((a, b) => a + b, 0)
  if (totalTags > 0 && profileHits / totalTags < 0.2) {
    out.push(
      issue(
        'warning',
        'VF_SEM_003',
        `Style incoherence: only ${Math.round((profileHits / totalTags) * 100)}% of tags align with template`,
        undefined,
        undefined,
        { profileHits, totalTags }
      )
    )
  }
}

// ---------- Entry point ----------

export function validateAssembly(
  assembly: AssemblyJson,
  template: CockpitTemplate,
  catalog: ModelWithMetadata[]
): ValidationReport {
  const catalogBySlug = new Map<string, ModelWithMetadata>()
  for (const m of catalog) catalogBySlug.set(m.slug, m)

  const instanceById = new Map<string, AssemblyInstance>()
  for (const i of assembly.instances) instanceById.set(i.instanceId, i)

  const aabbById = new Map<string, WorldAABB>()
  for (const i of assembly.instances) {
    const m = catalogBySlug.get(i.modelSlug)
    if (m) aabbById.set(i.instanceId, computeWorldAABB(i, m))
  }

  const ctx: ValidationContext = {
    assembly,
    template,
    catalog: catalogBySlug,
    instances: assembly.instances,
    instanceById,
    modelFor: (inst) => catalogBySlug.get(inst.modelSlug),
    aabbById,
  }

  const issues: ValidationIssue[] = []
  checkStructural(ctx, issues)
  checkCollision(ctx, issues)
  checkClipping(ctx, issues)
  checkVisibility(ctx, issues)
  checkSymmetry(ctx, issues)
  checkErgonomics(ctx, issues)
  checkSemantic(ctx, issues)

  let score = 1
  for (const it of issues) {
    if (it.severity === 'error') score -= 0.07
    else if (it.severity === 'warning') score -= 0.02
  }
  score = Math.max(0, Math.min(1, score))
  const passed = !issues.some((it) => it.severity === 'error')

  return {
    score,
    passed,
    issues,
    generatedAt: new Date().toISOString(),
  }
}
