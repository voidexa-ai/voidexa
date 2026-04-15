// lib/voidforge/placement.ts
//
// Deterministic socket-based placement engine. Takes an AssemblyPlan (Opus's
// role → model choices) plus the full model catalog, and produces an
// AssemblyJson of AssemblyInstance rows — one per placed part — with world-
// space transforms. No AI, no raycasts, no geometry math beyond vector add
// and quaternion rotate.
//
// Pipeline per plan:
//   1. Locate core_shell assignment → place at origin as root.
//   2. Walk remaining roles in placement_phase order. For each:
//      a. Resolve parent (usually root).
//      b. Find the anchor socket on the parent (template.preferredAnchor,
//         falling back to role-type → socket-type convention).
//      c. Compose child transform:
//           position = parent.position + parentQuat * socket.localPosition
//           rotation = parent.rotation + socket.localRotationEuler
//           scale    = clamped desired scale
//      d. If the plan demands a symmetry group and there is a mirroredSocketKey,
//         spawn a second instance with mirrored X.

import { randomUUID } from 'node:crypto'
import type {
  AssemblyInstance,
  AssemblyJson,
  AssemblyPlan,
  CockpitTemplate,
  ModelWithMetadata,
  Socket,
  TemplateRole,
  Vec3,
} from './types'
import { addVec3, applyQuat, clampScale, eulerToQuat, mirrorVec3X } from './utils/transforms'

const ROLE_TO_SOCKET: Record<string, string> = {
  interior_bay: 'interior_pair_mount',
  seat: 'seat_mount',
  console_left: 'console_mount_left',
  console_right: 'console_mount_right',
  console_center: 'console_mount_center',
  front_screen: 'screen_mount',
  side_screen_left: 'screen_mount',
  side_screen_right: 'screen_mount',
  hud_overlay: 'hud_anchor',
  floor_equipment: 'floor_anchor',
  ceiling_equipment: 'ceiling_anchor',
  wall_panel: 'wall_anchor',
  accessory: 'accessory_mount',
}

export class PlacementError extends Error {
  constructor(message: string, public readonly roleKey?: string) {
    super(message)
  }
}

function newId(): string {
  return `vf_${randomUUID().slice(0, 8)}`
}

function pickSocket(model: ModelWithMetadata, role: TemplateRole, fallbackKey?: string): Socket | null {
  // 1. Explicit preferredAnchor on role (matches socket_type)
  if (role.preferredAnchor) {
    const byType = model.sockets.find((s) => s.socketType === role.preferredAnchor)
    if (byType) return byType
  }
  // 2. Fallback by role→socket_type convention
  const conventionType = fallbackKey ?? ROLE_TO_SOCKET[role.roleKey]
  if (conventionType) {
    const byConvention = model.sockets.find((s) => s.socketType === conventionType)
    if (byConvention) return byConvention
  }
  // 3. Highest-priority socket (last resort)
  if (model.sockets.length > 0) {
    return [...model.sockets].sort((a, b) => a.priority - b.priority)[0]
  }
  return null
}

interface PlacementContext {
  template: CockpitTemplate
  catalog: Map<string, ModelWithMetadata> // by slug
  instances: AssemblyInstance[]
  rootId: string
}

function placeChild(
  ctx: PlacementContext,
  parent: AssemblyInstance,
  parentModel: ModelWithMetadata,
  childModel: ModelWithMetadata,
  role: TemplateRole,
  mirrored = false
): AssemblyInstance {
  const anchor = pickSocket(parentModel, role)
  if (!anchor) {
    throw new PlacementError(
      `No valid anchor socket on ${parentModel.slug} for role ${role.roleKey}`,
      role.roleKey
    )
  }

  const parentQuat = eulerToQuat(parent.rotationEuler)
  const anchorLocal = mirrored ? mirrorVec3X(anchor.localPosition) : anchor.localPosition
  const worldOffset = applyQuat(anchorLocal, parentQuat)
  const position = addVec3(parent.position, worldOffset)

  const rotationEuler: Vec3 = mirrored
    ? {
        x: parent.rotationEuler.x + anchor.localRotationEuler.x,
        y: parent.rotationEuler.y - anchor.localRotationEuler.y,
        z: parent.rotationEuler.z - anchor.localRotationEuler.z,
      }
    : {
        x: parent.rotationEuler.x + anchor.localRotationEuler.x,
        y: parent.rotationEuler.y + anchor.localRotationEuler.y,
        z: parent.rotationEuler.z + anchor.localRotationEuler.z,
      }

  const baseScale = childModel.metadata.defaultScale
  const sc = clampScale(baseScale, baseScale, anchor.maxScaleDeviation)

  return {
    instanceId: newId(),
    modelSlug: childModel.slug,
    roleKey: role.roleKey,
    parentInstanceId: parent.instanceId,
    parentSocketKey: anchor.socketKey,
    position,
    rotationEuler,
    scale: { x: mirrored ? -sc : sc, y: sc, z: sc },
    mirrored,
    generated: true,
  }
}

export function placeAssembly(
  plan: AssemblyPlan,
  template: CockpitTemplate,
  models: ModelWithMetadata[]
): AssemblyJson {
  const catalog = new Map<string, ModelWithMetadata>()
  for (const m of models) catalog.set(m.slug, m)

  // 1. Core shell at origin.
  const coreAssignment = plan.roleAssignments.find((a) => a.roleKey === 'core_shell')
  if (!coreAssignment || !coreAssignment.chosenModelSlug) {
    throw new PlacementError('plan missing core_shell assignment', 'core_shell')
  }
  const coreModel = catalog.get(coreAssignment.chosenModelSlug)
  if (!coreModel) throw new PlacementError(`unknown model ${coreAssignment.chosenModelSlug}`, 'core_shell')

  const rootId = newId()
  const root: AssemblyInstance = {
    instanceId: rootId,
    modelSlug: coreModel.slug,
    roleKey: 'core_shell',
    position: { x: 0, y: 0, z: 0 },
    rotationEuler: { x: 0, y: 0, z: 0 },
    scale: { x: coreModel.metadata.defaultScale, y: coreModel.metadata.defaultScale, z: coreModel.metadata.defaultScale },
    mirrored: false,
    generated: true,
  }

  const ctx: PlacementContext = {
    template,
    catalog,
    instances: [root],
    rootId,
  }

  // 2. Remaining roles in placement_phase → role_priority order.
  const remainingRoles = template.roles
    .filter((r) => r.roleKey !== 'core_shell')
    .sort((a, b) => a.placementPhase - b.placementPhase || a.rolePriority - b.rolePriority)

  const bySymmetryGroup = new Map<string, TemplateRole[]>()
  for (const r of remainingRoles) {
    if (r.symmetryGroup) {
      const arr = bySymmetryGroup.get(r.symmetryGroup) ?? []
      arr.push(r)
      bySymmetryGroup.set(r.symmetryGroup, arr)
    }
  }

  const placedRoles = new Set<string>()

  for (const role of remainingRoles) {
    if (placedRoles.has(role.roleKey)) continue

    const assignment = plan.roleAssignments.find((a) => a.roleKey === role.roleKey)
    if (!assignment || !assignment.chosenModelSlug) {
      if (role.isRequired) {
        throw new PlacementError(`required role ${role.roleKey} not assigned`, role.roleKey)
      }
      placedRoles.add(role.roleKey)
      continue
    }

    const childModel = catalog.get(assignment.chosenModelSlug)
    if (!childModel) {
      throw new PlacementError(`unknown model ${assignment.chosenModelSlug}`, role.roleKey)
    }

    // Choose parent. Interior bay parents to core; everything else parents to the
    // interior when present, else to core (keeps hierarchy close to real cockpits).
    const interior = ctx.instances.find((i) => i.roleKey === 'interior_bay')
    const parentInstance =
      role.roleKey === 'interior_bay' || !interior ? root : interior
    const parentModel = catalog.get(parentInstance.modelSlug)
    if (!parentModel) {
      throw new PlacementError(`parent model ${parentInstance.modelSlug} missing from catalog`, role.roleKey)
    }

    const child = placeChild(ctx, parentInstance, parentModel, childModel, role)
    ctx.instances.push(child)
    placedRoles.add(role.roleKey)

    // Symmetry partner handling. If this role is in a symmetry_group with exactly
    // one sibling and the sibling also has an assignment, place the sibling mirrored.
    if (role.symmetryGroup) {
      const siblings = (bySymmetryGroup.get(role.symmetryGroup) ?? []).filter((r) => r.roleKey !== role.roleKey)
      if (siblings.length === 1) {
        const sibling = siblings[0]
        const sibAssignment = plan.roleAssignments.find((a) => a.roleKey === sibling.roleKey)
        if (sibAssignment?.chosenModelSlug) {
          const sibModel = catalog.get(sibAssignment.chosenModelSlug)
          if (sibModel) {
            const sibChild = placeChild(ctx, parentInstance, parentModel, sibModel, sibling, true)
            ctx.instances.push(sibChild)
            placedRoles.add(sibling.roleKey)
          }
        }
      }
    }
  }

  return {
    version: 1,
    templateSlug: template.slug,
    rootInstanceId: rootId,
    instances: ctx.instances,
    createdAt: new Date().toISOString(),
  }
}
