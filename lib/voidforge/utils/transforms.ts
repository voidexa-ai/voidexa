// lib/voidforge/utils/transforms.ts
//
// Minimal transform math — no three.js dependency on the server path.
// Euler rotations use XYZ intrinsic order to match three.js Object3D.rotation
// defaults, so values are interchangeable with the live editor.

import type { Quat, Vec3 } from '../types'

export function addVec3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

export function scaleVec3(a: Vec3, s: number): Vec3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s }
}

export function mulVec3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x * b.x, y: a.y * b.y, z: a.z * b.z }
}

export function eulerToQuat(e: Vec3): Quat {
  const c1 = Math.cos(e.x / 2)
  const c2 = Math.cos(e.y / 2)
  const c3 = Math.cos(e.z / 2)
  const s1 = Math.sin(e.x / 2)
  const s2 = Math.sin(e.y / 2)
  const s3 = Math.sin(e.z / 2)
  return {
    x: s1 * c2 * c3 + c1 * s2 * s3,
    y: c1 * s2 * c3 - s1 * c2 * s3,
    z: c1 * c2 * s3 + s1 * s2 * c3,
    w: c1 * c2 * c3 - s1 * s2 * s3,
  }
}

// Rotate vector v by quaternion q.
export function applyQuat(v: Vec3, q: Quat): Vec3 {
  const ix = q.w * v.x + q.y * v.z - q.z * v.y
  const iy = q.w * v.y + q.z * v.x - q.x * v.z
  const iz = q.w * v.z + q.x * v.y - q.y * v.x
  const iw = -q.x * v.x - q.y * v.y - q.z * v.z
  return {
    x: ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y,
    y: iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z,
    z: iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x,
  }
}

export function mirrorVec3X(v: Vec3): Vec3 {
  return { x: -v.x, y: v.y, z: v.z }
}

export function clampScale(desired: number, base: number, maxDev?: number): number {
  if (maxDev == null) return desired
  const min = base * (1 - maxDev)
  const max = base * (1 + maxDev)
  return Math.max(min, Math.min(max, desired))
}
