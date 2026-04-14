import { describe, it, expect } from "vitest";
import {
  MISSIONS,
  MISSIONS_BY_ID,
  TIMED_MISSIONS,
  EXPLORATION_MISSIONS,
  STORY_MISSIONS,
  DAILY_CHALLENGE_TEMPLATE,
} from "../catalogue";
import { MissionType, MissionDifficulty } from "../types";

describe("catalogue composition", () => {
  it("total count is 12 (3 timed + 3 exploration + 1 daily + 5 story)", () => {
    expect(MISSIONS).toHaveLength(12);
    expect(TIMED_MISSIONS).toHaveLength(3);
    expect(EXPLORATION_MISSIONS).toHaveLength(3);
    expect(STORY_MISSIONS).toHaveLength(5);
  });

  it("every mission id is unique", () => {
    const ids = MISSIONS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("MISSIONS_BY_ID indexes every mission", () => {
    for (const m of MISSIONS) expect(MISSIONS_BY_ID[m.id]).toBe(m);
  });
});

describe("field validity", () => {
  it("every mission has a non-empty name, description, and ≥1 objective", () => {
    for (const m of MISSIONS) {
      expect(m.name.length).toBeGreaterThan(0);
      expect(m.description.length).toBeGreaterThan(0);
      expect(m.objectives.length).toBeGreaterThanOrEqual(1);
      for (const o of m.objectives) {
        expect(o.id.length).toBeGreaterThan(0);
        expect(o.description.length).toBeGreaterThan(0);
        expect(o.target).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("objective ids are unique within each mission", () => {
    for (const m of MISSIONS) {
      const ids = m.objectives.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("timeLimit non-negative; positive on timed missions", () => {
    for (const m of MISSIONS) {
      expect(m.timeLimit).toBeGreaterThanOrEqual(0);
    }
    for (const m of TIMED_MISSIONS) {
      expect(m.timeLimit).toBeGreaterThan(0);
    }
  });

  it("rewards are non-negative integers", () => {
    for (const m of MISSIONS) {
      expect(Number.isInteger(m.rewardXP)).toBe(true);
      expect(Number.isInteger(m.rewardCredits)).toBe(true);
      expect(m.rewardXP).toBeGreaterThanOrEqual(0);
      expect(m.rewardCredits).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("story chain", () => {
  it("every story mission has storyOrder set and unique", () => {
    const orders = STORY_MISSIONS.map((m) => m.storyOrder);
    expect(new Set(orders).size).toBe(orders.length);
    for (const m of STORY_MISSIONS) {
      expect(m.isStory).toBe(true);
      expect(m.isRepeatable).toBe(false);
      expect(typeof m.storyOrder).toBe("number");
    }
  });

  it("final story mission (order 4) carries the epic cosmetic reward", () => {
    const final = STORY_MISSIONS.find((m) => m.storyOrder === 4)!;
    expect(final.rewardItem).toBe("chronicler-epic-cosmetic");
    expect(final.difficulty).toBe(MissionDifficulty.Extreme);
  });
});

describe("daily template", () => {
  it("is marked isDaily, non-repeatable, and has the rare reward", () => {
    expect(DAILY_CHALLENGE_TEMPLATE.isDaily).toBe(true);
    expect(DAILY_CHALLENGE_TEMPLATE.isRepeatable).toBe(false);
    expect(DAILY_CHALLENGE_TEMPLATE.rewardItem).toBe("daily-challenge-rare-reward");
  });
});

describe("timed missions", () => {
  it("are repeatable and cover all three Timed MissionTypes", () => {
    const types = TIMED_MISSIONS.map((m) => m.type);
    expect(types.sort()).toEqual(
      [MissionType.AsteroidRun, MissionType.SpeedDelivery, MissionType.NebulaDash].sort(),
    );
    for (const m of TIMED_MISSIONS) expect(m.isRepeatable).toBe(true);
  });
});
