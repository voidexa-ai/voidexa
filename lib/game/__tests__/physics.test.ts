import { describe, it, expect } from "vitest";
import {
  distance,
  distanceSquared,
  checkCollision,
  checkAnyCollision,
  getCollisions,
  nearestObstacle,
  type Obstacle,
  type Vec3,
} from "../physics";

const origin: Vec3 = { x: 0, y: 0, z: 0 };

describe("distanceSquared / distance", () => {
  it("returns 0 for identical points", () => {
    expect(distanceSquared(origin, origin)).toBe(0);
    expect(distance(origin, origin)).toBe(0);
  });

  it("computes Pythagorean distance correctly", () => {
    expect(distanceSquared(origin, { x: 3, y: 4, z: 0 })).toBe(25);
    expect(distance(origin, { x: 3, y: 4, z: 0 })).toBe(5);
  });

  it("handles negative coordinates", () => {
    expect(distance({ x: -1, y: -1, z: -1 }, { x: 1, y: 1, z: 1 })).toBeCloseTo(
      Math.sqrt(12),
    );
  });
});

describe("checkCollision", () => {
  const asteroids: Obstacle[] = [
    { id: "a", pos: { x: 10, y: 0, z: 0 }, radius: 2 },
    { id: "b", pos: { x: 0, y: 100, z: 0 }, radius: 5 },
  ];

  it("returns false when ship is far from every obstacle", () => {
    expect(checkCollision({ x: 0, y: 0, z: 0 }, asteroids, 1)).toBe(false);
  });

  it("returns true when ship's sphere overlaps an obstacle's sphere", () => {
    // Ship at (8,0,0) radius 1, asteroid at (10,0,0) radius 2 → gap = 10-8 = 2 = 1+2, boundary hit
    expect(checkCollision({ x: 8, y: 0, z: 0 }, asteroids, 1)).toBe(true);
  });

  it("treats boundary (distance === sum of radii) as a hit", () => {
    const obs: Obstacle[] = [{ pos: { x: 5, y: 0, z: 0 }, radius: 2 }];
    expect(checkCollision({ x: 2, y: 0, z: 0 }, obs, 1)).toBe(true);
  });

  it("handles empty obstacle list", () => {
    expect(checkCollision({ x: 0, y: 0, z: 0 }, [], 1)).toBe(false);
  });

  it("checkAnyCollision is an alias for checkCollision", () => {
    expect(checkAnyCollision).toBe(checkCollision);
  });
});

describe("getCollisions", () => {
  it("returns every overlapping obstacle", () => {
    const obs: Obstacle[] = [
      { id: "a", pos: { x: 1, y: 0, z: 0 }, radius: 1 },
      { id: "b", pos: { x: -1, y: 0, z: 0 }, radius: 1 },
      { id: "c", pos: { x: 100, y: 0, z: 0 }, radius: 1 },
    ];
    const hits = getCollisions({ x: 0, y: 0, z: 0 }, obs, 1);
    expect(hits.map((h) => h.id).sort()).toEqual(["a", "b"]);
  });
});

describe("nearestObstacle", () => {
  it("returns the closest obstacle within range", () => {
    const obs: Obstacle[] = [
      { id: "far",  pos: { x: 50, y: 0, z: 0 }, radius: 1 },
      { id: "near", pos: { x: 10, y: 0, z: 0 }, radius: 1 },
    ];
    const n = nearestObstacle({ x: 0, y: 0, z: 0 }, obs, 60);
    expect(n?.id).toBe("near");
  });

  it("returns null when nothing is within range", () => {
    const obs: Obstacle[] = [{ pos: { x: 1000, y: 0, z: 0 }, radius: 1 }];
    expect(nearestObstacle({ x: 0, y: 0, z: 0 }, obs, 50)).toBeNull();
  });
});
