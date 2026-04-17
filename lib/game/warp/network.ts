/**
 * Sprint 4 — Task 2: warp network + cost calc.
 *
 * V3 rule: Deep Void has no warp gates. Must fly manually.
 * Cost formula: ceil(distance_world_units * 0.3), clamped [30, 180] GHAI.
 * Pure — no Supabase, no network.
 */

import { LANDMARKS, type LandmarkDef } from '@/lib/game/freeflight/landmarks'

// Sprint 2 landmarks cover only Core + Inner Ring. Mid Ring is reserved for
// future landmark expansion (Sprint 5+) but not warp-eligible yet since
// there are no Mid Ring nodes on disk.
export type WarpZone = 'Core Zone' | 'Inner Ring'

export const WARP_ELIGIBLE_ZONES: readonly WarpZone[] = ['Core Zone', 'Inner Ring']

export const WARP_MIN_COST = 30
export const WARP_MAX_COST = 180
export const WARP_COST_PER_UNIT = 0.3

/**
 * Warp-enabled node (station or landmark with warp gate infrastructure).
 * Adds a synthetic "voidexa_hub" at origin so newly spawned pilots can warp
 * from the hub even before visiting a gate.
 */
export interface WarpNode {
  id: string
  name: string
  zone: WarpZone
  x: number
  y: number
  z: number
}

const HUB: WarpNode = {
  id: 'voidexa_hub',
  name: 'voidexa Hub',
  zone: 'Core Zone',
  x: 0, y: 0, z: 0,
}

export function buildWarpGraph(): WarpNode[] {
  const landmarkNodes: WarpNode[] = LANDMARKS
    .filter(l => isWarpEligibleZone(l.zone))
    .map(toWarpNode)
  return [HUB, ...landmarkNodes]
}

function isWarpEligibleZone(zone: LandmarkDef['zone']): boolean {
  return (WARP_ELIGIBLE_ZONES as readonly string[]).includes(zone)
}

function toWarpNode(l: LandmarkDef): WarpNode {
  return {
    id: l.id,
    name: l.name,
    zone: l.zone as WarpZone,
    x: l.x,
    y: l.y,
    z: l.z,
  }
}

export function warpDistance(a: WarpNode, b: WarpNode): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

export function warpCost(a: WarpNode, b: WarpNode): number {
  if (a.id === b.id) return 0
  const d = warpDistance(a, b)
  const raw = Math.ceil(d * WARP_COST_PER_UNIT)
  return Math.min(WARP_MAX_COST, Math.max(WARP_MIN_COST, raw))
}

export function findNode(id: string): WarpNode | undefined {
  return buildWarpGraph().find(n => n.id === id)
}
