import { describe, it, expect } from "vitest";
import {
  NPCType,
  NPC_DEFS,
  NPC_TYPES,
  generatePatrolRoute,
} from "../npcs";

describe("NPC catalog", () => {
  it("contains all 6 NPC types", () => {
    expect(NPC_TYPES).toHaveLength(6);
    const expected = [
      NPCType.Patrol,
      NPCType.Pirate,
      NPCType.Caravan,
      NPCType.AlienProbe,
      NPCType.OrbitalTraffic,
      NPCType.PlanetaryDefense,
    ];
    for (const t of expected) expect(NPC_DEFS[t]).toBeDefined();
  });

  it("each def has non-empty behavior, speed > 0, boolean hostile", () => {
    for (const t of NPC_TYPES) {
      const d = NPC_DEFS[t];
      expect(d.behavior.length).toBeGreaterThan(0);
      expect(d.speed).toBeGreaterThan(0);
      expect(typeof d.hostile).toBe("boolean");
    }
  });

  it("Pirate and PlanetaryDefense are hostile; others are not", () => {
    expect(NPC_DEFS[NPCType.Pirate].hostile).toBe(true);
    expect(NPC_DEFS[NPCType.PlanetaryDefense].hostile).toBe(true);
    expect(NPC_DEFS[NPCType.Patrol].hostile).toBe(false);
    expect(NPC_DEFS[NPCType.Caravan].hostile).toBe(false);
    expect(NPC_DEFS[NPCType.AlienProbe].hostile).toBe(false);
    expect(NPC_DEFS[NPCType.OrbitalTraffic].hostile).toBe(false);
  });
});

describe("generatePatrolRoute", () => {
  const A = { x: 0, y: 0, z: 0 };
  const B = { x: 100, y: 0, z: 0 };

  it("starts at stationA and ends at stationB", () => {
    const route = generatePatrolRoute(A, B);
    expect(route[0]).toEqual(A);
    expect(route[route.length - 1]).toEqual(B);
  });

  it("honors the `waypoints` option (total length = waypoints + 2)", () => {
    const route = generatePatrolRoute(A, B, { waypoints: 6 });
    expect(route).toHaveLength(8);
  });

  it("returns just the endpoints for 0 waypoints", () => {
    const route = generatePatrolRoute(A, B, { waypoints: 0 });
    expect(route).toHaveLength(2);
  });

  it("is deterministic with a seeded RNG", () => {
    const rng = () => 0.5; // midpoint — perpendicular offsets = 0
    const r1 = generatePatrolRoute(A, B, { waypoints: 3, rng });
    const r2 = generatePatrolRoute(A, B, { waypoints: 3, rng });
    expect(r1).toEqual(r2);
  });

  it("with RNG === 0.5 (spread offset = 0), intermediates lie exactly on the A→B line", () => {
    const rng = () => 0.5;
    const route = generatePatrolRoute(A, B, { waypoints: 3, rng });
    for (const p of route) {
      expect(p.y).toBeCloseTo(0);
      expect(p.z).toBeCloseTo(0);
    }
    // x coordinates ascend from 0 to 100.
    const xs = route.map((p) => p.x);
    for (let i = 1; i < xs.length; i++) {
      expect(xs[i]).toBeGreaterThan(xs[i - 1]);
    }
  });

  it("handles A ≈ B by collapsing to endpoints", () => {
    const r = generatePatrolRoute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(r).toHaveLength(2);
  });

  it("throws on negative waypoints", () => {
    expect(() => generatePatrolRoute(A, B, { waypoints: -1 })).toThrow();
  });
});
