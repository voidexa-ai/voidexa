import { describe, it, expect } from "vitest";
import {
  Rank,
  RANK_ORDER,
  RANK_THRESHOLDS,
  WIN_POINTS,
  LOSS_POINTS,
  rankFromPoints,
  canDuel,
  updateRank,
  applyDuelResult,
} from "../ranks";

describe("ladder constants", () => {
  it("contains all 6 ranks in order", () => {
    expect(RANK_ORDER).toEqual([
      Rank.Bronze,
      Rank.Silver,
      Rank.Gold,
      Rank.Platinum,
      Rank.Diamond,
      Rank.Legendary,
    ]);
  });

  it("thresholds are monotonically increasing", () => {
    const values = RANK_ORDER.map((r) => RANK_THRESHOLDS[r]);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
    expect(RANK_THRESHOLDS[Rank.Bronze]).toBe(0);
  });
});

describe("rankFromPoints", () => {
  it("returns Bronze for 0 and negative points", () => {
    expect(rankFromPoints(0)).toBe(Rank.Bronze);
    expect(rankFromPoints(-50)).toBe(Rank.Bronze);
  });

  it("returns the highest rank whose threshold is <= points", () => {
    expect(rankFromPoints(99)).toBe(Rank.Bronze);
    expect(rankFromPoints(100)).toBe(Rank.Silver);
    expect(rankFromPoints(299)).toBe(Rank.Silver);
    expect(rankFromPoints(300)).toBe(Rank.Gold);
    expect(rankFromPoints(1500)).toBe(Rank.Legendary);
    expect(rankFromPoints(999_999)).toBe(Rank.Legendary);
  });
});

describe("canDuel (±1 bracket)", () => {
  it("allows same-rank duels", () => {
    expect(canDuel(Rank.Gold, Rank.Gold)).toBe(true);
  });

  it("allows adjacent ranks", () => {
    expect(canDuel(Rank.Bronze, Rank.Silver)).toBe(true);
    expect(canDuel(Rank.Silver, Rank.Bronze)).toBe(true);
    expect(canDuel(Rank.Diamond, Rank.Legendary)).toBe(true);
  });

  it("forbids 2+ brackets of distance", () => {
    expect(canDuel(Rank.Bronze, Rank.Gold)).toBe(false);
    expect(canDuel(Rank.Bronze, Rank.Legendary)).toBe(false);
    expect(canDuel(Rank.Silver, Rank.Platinum)).toBe(false);
  });
});

describe("updateRank", () => {
  it("adds WIN_POINTS on a win", () => {
    expect(updateRank(50, true)).toBe(50 + WIN_POINTS);
  });

  it("subtracts LOSS_POINTS on a loss", () => {
    expect(updateRank(50, false)).toBe(50 - LOSS_POINTS);
  });

  it("floors at 0 (cannot go negative)", () => {
    expect(updateRank(5, false)).toBe(0);
    expect(updateRank(0, false)).toBe(0);
  });
});

describe("applyDuelResult", () => {
  it("flags promoted=true when crossing a threshold up", () => {
    // Bronze at 99, +25 = 124 → Silver (100 threshold)
    const r = applyDuelResult(99, true);
    expect(r.rank).toBe(Rank.Silver);
    expect(r.promoted).toBe(true);
    expect(r.demoted).toBe(false);
  });

  it("flags demoted=true when crossing a threshold down", () => {
    // Silver at 105, -20 = 85 → Bronze (below 100)
    const r = applyDuelResult(105, false);
    expect(r.rank).toBe(Rank.Bronze);
    expect(r.demoted).toBe(true);
    expect(r.promoted).toBe(false);
  });

  it("neither promoted nor demoted when within the same bracket", () => {
    const r = applyDuelResult(200, true); // still Silver
    expect(r.rank).toBe(Rank.Silver);
    expect(r.promoted).toBe(false);
    expect(r.demoted).toBe(false);
  });
});
