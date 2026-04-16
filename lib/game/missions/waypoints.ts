/**
 * Sprint 1 — Task 1: deterministic waypoint generation for accepted missions.
 *
 * Mission templates don't carry explicit waypoint coordinates (they're data,
 * generated UI); we seed them from the mission id so the same mission always
 * spawns in the same place for a given player run.
 */

export interface MissionWaypoint {
  x: number
  y: number
  z: number
  label: string
}

function hashSeed(missionId: string): number {
  let h = 5381
  for (let i = 0; i < missionId.length; i++) {
    h = ((h << 5) + h + missionId.charCodeAt(i)) >>> 0
  }
  return h
}

function mulberry32(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Returns 3–5 waypoints in a loose loop near origin. The first waypoint is
 * always the pickup and the last is the destination (marked in the label).
 * Coordinates live in freeflight's world space (roughly ±300 units).
 */
export function generateMissionWaypoints(missionId: string, count = 4): MissionWaypoint[] {
  const rng = mulberry32(hashSeed(missionId))
  const n = Math.max(3, Math.min(5, count))
  const radius = 160 + rng() * 80
  const yDrift = 30
  const waypoints: MissionWaypoint[] = []
  for (let i = 0; i < n; i++) {
    const t = i / n
    const angle = t * Math.PI * 2 + rng() * 0.6
    waypoints.push({
      x: Math.sin(angle) * radius + (rng() - 0.5) * 60,
      y: (rng() - 0.5) * yDrift,
      z: -Math.cos(angle) * radius + (rng() - 0.5) * 60,
      label: i === 0 ? 'Pickup' : i === n - 1 ? 'Delivery' : `Waypoint ${i}`,
    })
  }
  return waypoints
}

export const MISSION_WAYPOINT_REACH = 25
