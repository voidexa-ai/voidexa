import { describe, it, expect } from "vitest";
import {
  ACHIEVEMENTS,
  ACHIEVEMENTS_BY_ID,
  getAchievementsByCategory,
} from "../definitions";
import {
  AchievementCategory,
  AchievementTier,
  AchievementRewardType,
} from "../types";
import { ACHIEVEMENT_TITLES } from "../titles";

describe("catalogue shape", () => {
  it("has 23 achievements (master plan '~25' with shared tier chains)", () => {
    expect(ACHIEVEMENTS).toHaveLength(23);
  });

  it("every id is unique", () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ACHIEVEMENTS_BY_ID has one entry per achievement", () => {
    expect(Object.keys(ACHIEVEMENTS_BY_ID)).toHaveLength(ACHIEVEMENTS.length);
    for (const a of ACHIEVEMENTS) {
      expect(ACHIEVEMENTS_BY_ID[a.id]).toBe(a);
    }
  });
});

describe("category counts", () => {
  it("8 Product, 7 Exploration, 8 PvP", () => {
    expect(
      getAchievementsByCategory(AchievementCategory.Product),
    ).toHaveLength(8);
    expect(
      getAchievementsByCategory(AchievementCategory.Exploration),
    ).toHaveLength(7);
    expect(getAchievementsByCategory(AchievementCategory.PvP)).toHaveLength(8);
  });
});

describe("every achievement has sane fields", () => {
  it("name/description/requirement are non-empty", () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.name.length).toBeGreaterThan(0);
      expect(a.description.length).toBeGreaterThan(0);
      expect(a.requirement.length).toBeGreaterThan(0);
    }
  });

  it("tier is Bronze/Silver/Gold", () => {
    for (const a of ACHIEVEMENTS) {
      expect(Object.values(AchievementTier)).toContain(a.tier);
    }
  });

  it("rewardType is one of the 5 allowed values and rewardId is non-empty", () => {
    for (const a of ACHIEVEMENTS) {
      expect(Object.values(AchievementRewardType)).toContain(a.rewardType);
      expect(a.rewardId.length).toBeGreaterThan(0);
    }
  });

  it("requiredCount is a positive integer", () => {
    for (const a of ACHIEVEMENTS) {
      expect(Number.isInteger(a.requiredCount)).toBe(true);
      expect(a.requiredCount).toBeGreaterThanOrEqual(1);
    }
  });

  it("titleFragment matches ACHIEVEMENT_TITLES[id]", () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.titleFragment).toBe(ACHIEVEMENT_TITLES[a.id]);
    }
  });
});

describe("tier chain semantics (1/10/50)", () => {
  it("First Debate / Debater / Quantum Master form a 1/10/50 chain", () => {
    expect(ACHIEVEMENTS_BY_ID["first-debate"].requiredCount).toBe(1);
    expect(ACHIEVEMENTS_BY_ID["first-debate"].tier).toBe(AchievementTier.Bronze);
    expect(ACHIEVEMENTS_BY_ID["debater"].requiredCount).toBe(10);
    expect(ACHIEVEMENTS_BY_ID["debater"].tier).toBe(AchievementTier.Silver);
    expect(ACHIEVEMENTS_BY_ID["quantum-master"].requiredCount).toBe(50);
    expect(ACHIEVEMENTS_BY_ID["quantum-master"].tier).toBe(AchievementTier.Gold);
  });

  it("Warrior / Veteran / Champion form a 1/10/50 chain", () => {
    expect(ACHIEVEMENTS_BY_ID["warrior"].requiredCount).toBe(1);
    expect(ACHIEVEMENTS_BY_ID["veteran"].requiredCount).toBe(10);
    expect(ACHIEVEMENTS_BY_ID["champion"].requiredCount).toBe(50);
    expect(ACHIEVEMENTS_BY_ID["warrior"].tier).toBe(AchievementTier.Bronze);
    expect(ACHIEVEMENTS_BY_ID["veteran"].tier).toBe(AchievementTier.Silver);
    expect(ACHIEVEMENTS_BY_ID["champion"].tier).toBe(AchievementTier.Gold);
  });
});

describe("ship rewards", () => {
  it("5 achievements award ships (Debater, Trader, Pioneer, Explorer, Secret)", () => {
    const shipAchievements = ACHIEVEMENTS.filter(
      (a) => a.rewardType === AchievementRewardType.Ship,
    ).map((a) => a.id).sort();
    expect(shipAchievements).toEqual(
      ["debater", "explorer", "pioneer", "secret", "trader"].sort(),
    );
  });
});
