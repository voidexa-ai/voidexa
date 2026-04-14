/**
 * lib/game/npcs.ts
 *
 * NPC types and route generation for Phase 3 Free Flight.
 * Speed values are world units per second; calibrate against the ship stats
 * in `ships.ts` so relative speed feels right.
 */

import type { Vec3 } from "./physics";

export enum NPCType {
  Patrol = "Patrol",
  Pirate = "Pirate",
  Caravan = "Caravan",
  AlienProbe = "AlienProbe",
  OrbitalTraffic = "OrbitalTraffic",
  PlanetaryDefense = "PlanetaryDefense",
}

export interface NPCDef {
  type: NPCType;
  behavior: string;
  /** World units per second. */
  speed: number;
  /** True if this NPC will attack the player on sight. */
  hostile: boolean;
}

export const NPC_DEFS: Readonly<Record<NPCType, NPCDef>> = {
  [NPCType.Patrol]: {
    type: NPCType.Patrol,
    behavior: "Flies predefined routes between stations in a loop. Does not attack unless provoked.",
    speed: 60,
    hostile: false,
  },
  [NPCType.Pirate]: {
    type: NPCType.Pirate,
    behavior: "Spawns in dangerous zones. Flies aggressively toward the nearest player within attack range.",
    speed: 80,
    hostile: true,
  },
  [NPCType.Caravan]: {
    type: NPCType.Caravan,
    behavior: "Slow cargo ship travelling between trading posts. Non-combatant.",
    speed: 35,
    hostile: false,
  },
  [NPCType.AlienProbe]: {
    type: NPCType.AlienProbe,
    behavior: "Small, fast scout that appears near alien tech spawns. Scans briefly and flees.",
    speed: 110,
    hostile: false,
  },
  [NPCType.OrbitalTraffic]: {
    type: NPCType.OrbitalTraffic,
    behavior: "Civilian ships circling planets at various altitudes. Background ambience.",
    speed: 45,
    hostile: false,
  },
  [NPCType.PlanetaryDefense]: {
    type: NPCType.PlanetaryDefense,
    behavior: "Stationary-patrol escort around owner planets. Attacks trespassers inside defensive radius.",
    speed: 70,
    hostile: true,
  },
};

export const NPC_TYPES: readonly NPCType[] = Object.values(NPCType) as NPCType[];

/** Options for `generatePatrolRoute`. */
export interface PatrolRouteOptions {
  /** Number of intermediate waypoints between endpoints. Default 4. */
  waypoints?: number;
  /** Max lateral offset (world units) applied perpendicular to the A→B line. Default 50. */
  spread?: number;
  /**
   * Seeded RNG (returns [0,1)). Default Math.random.
   * Inject for deterministic tests.
   */
  rng?: () => number;
}

/**
 * Generates a patrol route between two stations as an array of waypoints.
 * The returned array starts at `stationA`, ends at `stationB`, and contains
 * `waypoints` intermediate points offset perpendicular to the direct path.
 *
 * Ideal for `NPCManager.tsx` — NPC interpolates between consecutive points.
 */
export function generatePatrolRoute(
  stationA: Vec3,
  stationB: Vec3,
  options: PatrolRouteOptions = {},
): Vec3[] {
  const waypoints = options.waypoints ?? 4;
  const spread = options.spread ?? 50;
  const rng = options.rng ?? Math.random;

  if (waypoints < 0) {
    throw new Error("waypoints must be >= 0");
  }

  const route: Vec3[] = [{ ...stationA }];

  // Direction A → B
  const dx = stationB.x - stationA.x;
  const dy = stationB.y - stationA.y;
  const dz = stationB.z - stationA.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Build an orthonormal perpendicular basis so offsets stay off-axis.
  // If A ≈ B, skip intermediate points and return just the endpoints.
  if (length < 1e-6) {
    route.push({ ...stationB });
    return route;
  }

  const nx = dx / length;
  const ny = dy / length;
  const nz = dz / length;

  // Choose a reference vector not parallel to the direction, then cross-product
  // to get two perpendicular basis vectors (u, v).
  const refX = Math.abs(nx) < 0.9 ? 1 : 0;
  const refY = Math.abs(nx) < 0.9 ? 0 : 1;
  const refZ = 0;
  // u = normalize(n × ref)
  let ux = ny * refZ - nz * refY;
  let uy = nz * refX - nx * refZ;
  let uz = nx * refY - ny * refX;
  const uLen = Math.sqrt(ux * ux + uy * uy + uz * uz) || 1;
  ux /= uLen; uy /= uLen; uz /= uLen;
  // v = n × u
  const vx = ny * uz - nz * uy;
  const vy = nz * ux - nx * uz;
  const vz = nx * uy - ny * ux;

  for (let i = 1; i <= waypoints; i++) {
    const t = i / (waypoints + 1);
    const baseX = stationA.x + dx * t;
    const baseY = stationA.y + dy * t;
    const baseZ = stationA.z + dz * t;

    const offU = (rng() * 2 - 1) * spread;
    const offV = (rng() * 2 - 1) * spread;

    route.push({
      x: baseX + ux * offU + vx * offV,
      y: baseY + uy * offU + vy * offV,
      z: baseZ + uz * offU + vz * offV,
    });
  }

  route.push({ ...stationB });
  return route;
}
