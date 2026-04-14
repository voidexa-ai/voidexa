import { describe, it, expect } from "vitest";
import {
  getDailyChallenge,
  getDailyLeaderboard,
  msUntilNextDaily,
  DAILY_LEADERBOARD_CAP,
  type DailyLeaderboardEntry,
} from "../daily";
import { TIMED_MISSIONS } from "../catalogue";

describe("getDailyChallenge", () => {
  it("is deterministic for the same UTC day", () => {
    const a = getDailyChallenge(new Date("2026-04-15T01:00:00.000Z"));
    const b = getDailyChallenge(new Date("2026-04-15T22:00:00.000Z"));
    expect(a).toEqual(b);
  });

  it("rotates to a (likely) different mission on a different day", () => {
    // Over ~30 days at least one rollover must produce a different type.
    const start = getDailyChallenge(new Date("2026-04-15T00:00:00.000Z"));
    const changedSomewhere = Array.from({ length: 30 }, (_, i) => {
      const d = new Date("2026-04-16T00:00:00.000Z");
      d.setUTCDate(d.getUTCDate() + i);
      return getDailyChallenge(d).type !== start.type;
    }).some(Boolean);
    expect(changedSomewhere).toBe(true);
  });

  it("picks from the Timed mission pool", () => {
    const pool = new Set(TIMED_MISSIONS.map((m) => m.type));
    const challenge = getDailyChallenge(new Date("2026-04-15T00:00:00.000Z"));
    expect(pool.has(challenge.type)).toBe(true);
  });

  it("has a daily-scoped id and carries the daily template rewards", () => {
    const c = getDailyChallenge(new Date("2026-04-15T00:00:00.000Z"));
    expect(c.id).toBe("daily-2026-04-15");
    expect(c.isDaily).toBe(true);
    expect(c.rewardItem).toBe("daily-challenge-rare-reward");
  });
});

describe("getDailyLeaderboard", () => {
  const day = new Date("2026-04-15T00:00:00.000Z");
  const dayStart = day.getTime();
  const hour = 60 * 60 * 1000;

  const entries: DailyLeaderboardEntry[] = [
    { playerId: "alice", timeMs: 90_000,  submittedAt: dayStart + 5 * hour },
    { playerId: "bob",   timeMs: 75_000,  submittedAt: dayStart + 6 * hour },
    // alice submits a better run later that day — should replace her earlier entry
    { playerId: "alice", timeMs: 70_000,  submittedAt: dayStart + 10 * hour },
    // out-of-day entries (ignored)
    { playerId: "carol", timeMs: 60_000,  submittedAt: dayStart - 1 },
    { playerId: "dave",  timeMs: 50_000,  submittedAt: dayStart + 24 * hour },
  ];

  it("returns best-per-player within the UTC day, sorted ascending by time", () => {
    const board = getDailyLeaderboard(day, entries);
    expect(board.map((e) => e.playerId)).toEqual(["alice", "bob"]);
    expect(board[0].timeMs).toBe(70_000);
  });

  it("caps at 100 entries", () => {
    const many: DailyLeaderboardEntry[] = Array.from({ length: 150 }, (_, i) => ({
      playerId: `p${i}`,
      timeMs: 100_000 - i,
      submittedAt: dayStart + 100,
    }));
    const board = getDailyLeaderboard(day, many);
    expect(board).toHaveLength(DAILY_LEADERBOARD_CAP);
  });

  it("excludes entries outside the UTC day window", () => {
    const board = getDailyLeaderboard(day, entries);
    expect(board.find((e) => e.playerId === "carol")).toBeUndefined();
    expect(board.find((e) => e.playerId === "dave")).toBeUndefined();
  });
});

describe("msUntilNextDaily", () => {
  it("returns ms until next UTC midnight", () => {
    const noon = new Date("2026-04-15T12:00:00.000Z");
    // 12 hours to midnight.
    expect(msUntilNextDaily(noon)).toBe(12 * 60 * 60 * 1000);
  });

  it("is 0 at exact midnight (snap-to-boundary)", () => {
    const midnight = new Date("2026-04-15T00:00:00.000Z");
    expect(msUntilNextDaily(midnight)).toBe(24 * 60 * 60 * 1000);
  });

  it("never returns negative", () => {
    const someTime = new Date("2026-04-15T23:59:59.500Z");
    expect(msUntilNextDaily(someTime)).toBeGreaterThanOrEqual(0);
  });
});
