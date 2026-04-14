/**
 * lib/game/physics.ts
 *
 * Minimal collision detection for Phase 3 Free Flight.
 * No physics engine — pure distance-based sphere collision.
 *
 * Typical usage:
 *   const hit = checkCollision({x,y,z}, [{pos:{x,y,z}, radius:5}, ...], shipRadius);
 *
 * For asteroid fields with many instances, prefer checkAnyCollision / getCollisions
 * so callers can react per-obstacle (camera shake, hull damage, bounce).
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Obstacle {
  /** Unique identifier — useful for logging & damage attribution. Optional. */
  id?: string;
  /** World-space center of the obstacle. */
  pos: Vec3;
  /** Collision sphere radius. Must be >= 0. */
  radius: number;
}

/** Squared distance between two points (avoids sqrt; cheaper for comparisons). */
export function distanceSquared(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

/** Straight-line distance between two points. */
export function distance(a: Vec3, b: Vec3): number {
  return Math.sqrt(distanceSquared(a, b));
}

/**
 * Returns true iff the ship (treated as a sphere of `shipRadius`) overlaps
 * ANY obstacle's collision sphere.
 *
 * @param shipPos    Ship center in world space.
 * @param obstacles  Array of collision spheres.
 * @param shipRadius Ship collision radius. Default 1.
 */
export function checkCollision(
  shipPos: Vec3,
  obstacles: ReadonlyArray<Obstacle>,
  shipRadius = 1,
): boolean {
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    const threshold = shipRadius + o.radius;
    if (distanceSquared(shipPos, o.pos) <= threshold * threshold) {
      return true;
    }
  }
  return false;
}

/** Alias matching the Phase 3 spec naming. */
export const checkAnyCollision = checkCollision;

/**
 * Returns every obstacle the ship currently overlaps.
 * Use this when the caller needs to know which obstacles were hit
 * (for damage attribution, bounce vector calculation, etc.).
 */
export function getCollisions(
  shipPos: Vec3,
  obstacles: ReadonlyArray<Obstacle>,
  shipRadius = 1,
): Obstacle[] {
  const hits: Obstacle[] = [];
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    const threshold = shipRadius + o.radius;
    if (distanceSquared(shipPos, o.pos) <= threshold * threshold) {
      hits.push(o);
    }
  }
  return hits;
}

/**
 * Returns the nearest obstacle within `maxRange` (or null).
 * Useful for "Press E to interact/collect" prompts — docking, alien tech pickups, etc.
 */
export function nearestObstacle(
  shipPos: Vec3,
  obstacles: ReadonlyArray<Obstacle>,
  maxRange: number,
): Obstacle | null {
  let nearest: Obstacle | null = null;
  let nearestSq = maxRange * maxRange;
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    const d2 = distanceSquared(shipPos, o.pos);
    if (d2 <= nearestSq) {
      nearest = o;
      nearestSq = d2;
    }
  }
  return nearest;
}
