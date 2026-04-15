// lib/voidforge/utils/collisions.ts
//
// World-space AABB computation and overlap tests. We use axis-aligned boxes
// around each instance's (scaled) model AABB translated to world position.
// Rotation is approximated by taking the max of width/length for the
// short/long dimension — good enough for the MVP validator which needs to
// flag gross collisions, not millimeter-accurate physics.

import type { AABB, AssemblyInstance, ModelWithMetadata, Vec3 } from '../types'

export interface WorldAABB {
  min: Vec3
  max: Vec3
  center: Vec3
  size: AABB
}

export function computeWorldAABB(instance: AssemblyInstance, model: ModelWithMetadata): WorldAABB {
  const s = instance.scale
  const base = model.metadata.aabb
  const pivot = model.metadata.pivot
  // Scale the half-extents. Use absolute scale to handle mirrored (-x) sizing.
  const halfX = (base.x * Math.abs(s.x)) / 2
  const halfY = (base.y * Math.abs(s.y)) / 2
  const halfZ = (base.z * Math.abs(s.z)) / 2
  // Center shifts by the instance's position + pivot offset baked into geometry.
  const centerX = instance.position.x - pivot.x * s.x
  const centerY = instance.position.y - pivot.y * s.y
  const centerZ = instance.position.z - pivot.z * s.z
  return {
    min: { x: centerX - halfX, y: centerY - halfY, z: centerZ - halfZ },
    max: { x: centerX + halfX, y: centerY + halfY, z: centerZ + halfZ },
    center: { x: centerX, y: centerY, z: centerZ },
    size: { x: halfX * 2, y: halfY * 2, z: halfZ * 2 },
  }
}

export interface OverlapResult {
  overlaps: boolean
  overlapVec: Vec3 // signed penetration per axis (0 if no overlap on that axis)
  volume: number
}

export function aabbOverlap(a: WorldAABB, b: WorldAABB): OverlapResult {
  const dx = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x)
  const dy = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y)
  const dz = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z)
  if (dx <= 0 || dy <= 0 || dz <= 0) {
    return { overlaps: false, overlapVec: { x: 0, y: 0, z: 0 }, volume: 0 }
  }
  return {
    overlaps: true,
    overlapVec: { x: dx, y: dy, z: dz },
    volume: dx * dy * dz,
  }
}

export function aabbContains(outer: WorldAABB, inner: WorldAABB, tolerance = 0): boolean {
  return (
    outer.min.x - tolerance <= inner.min.x &&
    outer.max.x + tolerance >= inner.max.x &&
    outer.min.y - tolerance <= inner.min.y &&
    outer.max.y + tolerance >= inner.max.y &&
    outer.min.z - tolerance <= inner.min.z &&
    outer.max.z + tolerance >= inner.max.z
  )
}

// Minimum axis overlap — used by repair to pick a shove direction.
export function minOverlapAxis(r: OverlapResult): 'x' | 'y' | 'z' {
  const { x, y, z } = r.overlapVec
  if (x <= y && x <= z) return 'x'
  if (y <= z) return 'y'
  return 'z'
}

export function embedDepth(childOuterFace: number, parentInnerFace: number): number {
  return Math.max(0, childOuterFace - parentInnerFace)
}
