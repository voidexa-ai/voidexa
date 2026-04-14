import { describe, it, expect } from "vitest";
import {
  checkAchievement,
  getPlayerAchievements,
  getAvailableTitleFragments,
  composeTitle,
} from "../tracker";
import { ACHIEVEMENTS_BY_ID } from "../definitions";
import { ACHIEVEMENT_TITLES } from "../titles";
import { type AchievementProgress } from "../types";

// ── checkAchievement ───────────────────────────────────────────────────────

describe("checkAchievement", () => {
  const PLAYER = "player-1";

  it("throws for unknown achievement id", () => {
    expect(() => checkAchievement(PLAYER, "does-not-exist", 1)).toThrow();
  });

  it("flags completion when count hits the threshold", () => {
    const r = checkAchievement(PLAYER, "debater", 10);
    expect(r.completed).toBe(true);
    expect(r.newlyCompleted).toBe(true);
    expect(r.currentCount).toBe(10);
    expect(r.requiredCount).toBe(10);
  });

  it("completed but not newly-completed when count drifted past", () => {
    const r = checkAchievement(PLAYER, "debater", 15);
    expect(r.completed).toBe(true);
    // Without previousCount, 15 !== threshold → not "newly" completed.
    expect(r.newlyCompleted).toBe(false);
    // currentCount clamps at requiredCount once completed.
    expect(r.currentCount).toBe(10);
  });

  it("uses previousCount for strict newly-completed detection", () => {
    // previous=9 → current=10 → crossed the line
    const crossed = checkAchievement(PLAYER, "debater", 10, 9);
    expect(crossed.newlyCompleted).toBe(true);
    // previous=10 → current=11 → already complete before, not newly
    const notNewly = checkAchievement(PLAYER, "debater", 11, 10);
    expect(notNewly.newlyCompleted).toBe(false);
  });

  it("incomplete progress is reported without clamping currentCount", () => {
    const r = checkAchievement(PLAYER, "voyager", 500);
    expect(r.completed).toBe(false);
    expect(r.currentCount).toBe(500);
    expect(r.requiredCount).toBe(1000);
  });
});

// ── getPlayerAchievements ──────────────────────────────────────────────────

describe("getPlayerAchievements", () => {
  const progress: AchievementProgress[] = [
    { achievementId: "warrior", currentCount: 1, completed: true, completedAt: 200 },
    { achievementId: "first-debate", currentCount: 1, completed: true, completedAt: 100 },
    { achievementId: "debater", currentCount: 5, completed: false },
    { achievementId: "unknown-id", currentCount: 1, completed: true, completedAt: 150 },
  ];

  it("returns only completed achievements, chronologically", () => {
    const out = getPlayerAchievements(progress);
    expect(out.map((a) => a.id)).toEqual(["first-debate", "warrior"]);
  });

  it("drops unknown achievement ids silently (stale data tolerance)", () => {
    const out = getPlayerAchievements(progress);
    expect(out.every((a) => a.id !== "unknown-id")).toBe(true);
  });
});

// ── getAvailableTitleFragments ─────────────────────────────────────────────

describe("getAvailableTitleFragments", () => {
  it("returns one fragment per unique achievement", () => {
    const completed = [
      ACHIEVEMENTS_BY_ID["quantum-master"],
      ACHIEVEMENTS_BY_ID["champion"],
      ACHIEVEMENTS_BY_ID["archaeologist"],
    ];
    const out = getAvailableTitleFragments(completed);
    expect(out.map((o) => o.fragment)).toEqual([
      ACHIEVEMENT_TITLES["quantum-master"],
      ACHIEVEMENT_TITLES["champion"],
      ACHIEVEMENT_TITLES["archaeologist"],
    ]);
  });

  it("de-duplicates by achievementId", () => {
    const completed = [
      ACHIEVEMENTS_BY_ID["champion"],
      ACHIEVEMENTS_BY_ID["champion"],
    ];
    expect(getAvailableTitleFragments(completed)).toHaveLength(1);
  });
});

// ── composeTitle ───────────────────────────────────────────────────────────

describe("composeTitle", () => {
  it("joins string fragments with ', ' by default", () => {
    expect(
      composeTitle(["Voice of the Consensus", "Scourge of the Void"]),
    ).toBe("Voice of the Consensus, Scourge of the Void");
  });

  it("accepts UnlockedFragment objects", () => {
    expect(
      composeTitle([
        { achievementId: "quantum-master", fragment: "Voice of the Consensus" },
        { achievementId: "champion", fragment: "Scourge of the Void" },
        { achievementId: "archaeologist", fragment: "Keeper of Lost Worlds" },
      ]),
    ).toBe("Voice of the Consensus, Scourge of the Void, Keeper of Lost Worlds");
  });

  it("accepts a custom separator", () => {
    expect(
      composeTitle(["Alpha", "Beta"], { separator: " · " }),
    ).toBe("Alpha · Beta");
  });

  it("substitutes placeholder via context (Pioneer)", () => {
    const pioneerFragment = ACHIEVEMENT_TITLES["pioneer"];
    const result = composeTitle([pioneerFragment, "The Unbroken"], {
      context: { planetName: "Kreos" },
    });
    expect(result).toBe("Sovereign of Kreos, The Unbroken");
  });

  it("drops empty fragments", () => {
    expect(composeTitle(["Alpha", "", "Beta"])).toBe("Alpha, Beta");
  });

  it("returns empty string when nothing selected", () => {
    expect(composeTitle([])).toBe("");
  });
});
