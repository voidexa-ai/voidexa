import { describe, it, expect } from "vitest";
import {
  calculateRacePoints,
  updateLeaderboard,
  getCrashPenalty,
  getMissedCheckpointPenalty,
  CRASH_PENALTY_MS,
  MISSED_CHECKPOINT_PENALTY_MS,
  LEADERBOARD_CAP,
  DIFFICULTY_MULTIPLIER,
  type LeaderboardEntry,
} from "../scoring";
import { RaceDifficulty } from "../types";

describe("penalty constants", () => {
  it("crash penalty is 3000 ms", () => {
    expect(CRASH_PENALTY_MS).toBe(3_000);
    expect(getCrashPenalty()).toBe(3_000);
  });

  it("missed-checkpoint penalty is 5000 ms", () => {
    expect(MISSED_CHECKPOINT_PENALTY_MS).toBe(5_000);
    expect(getMissedCheckpointPenalty()).toBe(5_000);
  });
});

describe("calculateRacePoints", () => {
  it("returns 0 for DNF (position 0)", () => {
    expect(calculateRacePoints(0, RaceDifficulty.Easy)).toBe(0);
  });

  it("returns 0 for positions beyond 8th", () => {
    expect(calculateRacePoints(9, RaceDifficulty.Easy)).toBe(0);
  });

  it("base points descend with position on Easy difficulty", () => {
    const pts = [1, 2, 3, 4, 5, 6, 7, 8].map((p) =>
      calculateRacePoints(p, RaceDifficulty.Easy),
    );
    for (let i = 1; i < pts.length; i++) {
      expect(pts[i]).toBeLessThanOrEqual(pts[i - 1]);
    }
    expect(pts[0]).toBeGreaterThan(pts[pts.length - 1]);
  });

  it("scales by difficulty multiplier", () => {
    const easy = calculateRacePoints(1, RaceDifficulty.Easy);
    const extreme = calculateRacePoints(1, RaceDifficulty.Extreme);
    expect(extreme).toBe(Math.round(easy * DIFFICULTY_MULTIPLIER[RaceDifficulty.Extreme]));
    expect(extreme).toBe(60); // 30 × 2.0
  });

  it("rejects non-integer positions", () => {
    expect(calculateRacePoints(1.5, RaceDifficulty.Easy)).toBe(0);
    expect(calculateRacePoints(-1, RaceDifficulty.Easy)).toBe(0);
  });
});

describe("updateLeaderboard", () => {
  const TRACK = "asteroid-alley";

  it("adds the first entry to an empty board as #1 + track record", () => {
    const r = updateLeaderboard(TRACK, "alice", 45_000, [], 1_000);
    expect(r.newPersonalBest).toBe(true);
    expect(r.newTrackRecord).toBe(true);
    expect(r.newPosition).toBe(1);
    expect(r.leaderboard[0]).toEqual({ playerId: "alice", timeMs: 45_000, setAt: 1_000 });
  });

  it("improves a player's existing PB and preserves the input board", () => {
    const start: LeaderboardEntry[] = [
      { playerId: "alice", timeMs: 50_000, setAt: 0 },
      { playerId: "bob",   timeMs: 48_000, setAt: 0 },
    ];
    const r = updateLeaderboard(TRACK, "alice", 45_000, start, 100);
    expect(start.find((e) => e.playerId === "alice")?.timeMs).toBe(50_000); // original untouched
    expect(r.newPersonalBest).toBe(true);
    expect(r.newTrackRecord).toBe(true); // 45_000 beats Bob's 48_000
    expect(r.leaderboard[0].playerId).toBe("alice");
  });

  it("rejects non-improvements (no change to board, newPersonalBest=false)", () => {
    const start: LeaderboardEntry[] = [
      { playerId: "alice", timeMs: 40_000, setAt: 0 },
    ];
    const r = updateLeaderboard(TRACK, "alice", 50_000, start);
    expect(r.newPersonalBest).toBe(false);
    expect(r.newTrackRecord).toBe(false);
    expect(r.leaderboard).toEqual(start);
    expect(r.newPosition).toBe(1);
  });

  it("evicts the slowest entry once the 100-player cap is hit", () => {
    const full: LeaderboardEntry[] = Array.from({ length: LEADERBOARD_CAP }, (_, i) => ({
      playerId: `p${i}`,
      timeMs: 10_000 + i * 10,
      setAt: 0,
    }));
    // Submit a time faster than the slowest entry.
    const r = updateLeaderboard(TRACK, "new", 10_005, full, 1);
    expect(r.leaderboard).toHaveLength(LEADERBOARD_CAP);
    // The slowest original (p99) should be gone.
    expect(r.leaderboard.find((e) => e.playerId === `p${LEADERBOARD_CAP - 1}`)).toBeUndefined();
  });

  it("throws on invalid time", () => {
    expect(() => updateLeaderboard(TRACK, "alice", 0, [])).toThrow();
    expect(() => updateLeaderboard(TRACK, "alice", -5, [])).toThrow();
    expect(() => updateLeaderboard(TRACK, "alice", Infinity, [])).toThrow();
  });
});
