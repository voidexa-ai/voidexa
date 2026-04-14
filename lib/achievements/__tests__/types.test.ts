import { describe, it, expect } from "vitest";
import {
  AchievementCategory,
  AchievementRewardType,
  AchievementTier,
  isComplete,
  type Achievement,
  type AchievementProgress,
} from "../types";

describe("enums", () => {
  it("AchievementCategory covers Product / Exploration / PvP", () => {
    expect(Object.values(AchievementCategory)).toEqual([
      "Product",
      "Exploration",
      "PvP",
    ]);
  });

  it("AchievementTier covers Bronze / Silver / Gold", () => {
    expect(Object.values(AchievementTier)).toEqual([
      "Bronze",
      "Silver",
      "Gold",
    ]);
  });

  it("AchievementRewardType covers all 5 reward kinds", () => {
    expect(Object.values(AchievementRewardType).sort()).toEqual(
      ["Badge", "ChatColor", "ProfileBorder", "Ship", "Title"].sort(),
    );
  });
});

describe("isComplete", () => {
  const ach: Pick<Achievement, "requiredCount"> = { requiredCount: 10 };

  it("false when below threshold", () => {
    const progress: AchievementProgress = {
      achievementId: "x",
      currentCount: 9,
      completed: false,
    };
    expect(isComplete(progress, ach)).toBe(false);
  });

  it("true when at threshold", () => {
    const progress: AchievementProgress = {
      achievementId: "x",
      currentCount: 10,
      completed: true,
    };
    expect(isComplete(progress, ach)).toBe(true);
  });

  it("true when above threshold (count drifted past)", () => {
    const progress: AchievementProgress = {
      achievementId: "x",
      currentCount: 15,
      completed: true,
    };
    expect(isComplete(progress, ach)).toBe(true);
  });
});
