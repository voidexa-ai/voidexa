import { describe, it, expect } from "vitest";
import {
  STORY_CHAIN,
  STORY_COMPLETE_TITLE,
  STORY_COMPLETE_COSMETIC_ID,
  getNextStoryMission,
  isStoryComplete,
  getStoryProgress,
  canPlayStoryMission,
} from "../story";
import { STORY_MISSIONS } from "../catalogue";

const IDS = STORY_CHAIN.map((m) => m.id);

describe("STORY_CHAIN", () => {
  it("has 5 missions, sorted by storyOrder", () => {
    expect(STORY_CHAIN).toHaveLength(5);
    expect(STORY_CHAIN).toHaveLength(STORY_MISSIONS.length);
    for (let i = 1; i < STORY_CHAIN.length; i++) {
      expect((STORY_CHAIN[i].storyOrder ?? 0)).toBeGreaterThan(
        STORY_CHAIN[i - 1].storyOrder ?? 0,
      );
    }
  });

  it("reward constants are exposed", () => {
    expect(STORY_COMPLETE_TITLE).toBe("Chronicler of the Void");
    expect(STORY_COMPLETE_COSMETIC_ID).toBe("chronicler-epic-cosmetic");
  });
});

describe("getNextStoryMission", () => {
  it("returns the first mission when nothing is completed", () => {
    expect(getNextStoryMission([])).toBe(STORY_CHAIN[0]);
  });

  it("advances as missions are completed", () => {
    expect(getNextStoryMission([IDS[0]])).toBe(STORY_CHAIN[1]);
    expect(getNextStoryMission([IDS[0], IDS[1], IDS[2]])).toBe(STORY_CHAIN[3]);
  });

  it("returns null when every story mission is complete", () => {
    expect(getNextStoryMission(IDS)).toBeNull();
  });

  it("ignores non-story mission ids in the completed list", () => {
    expect(getNextStoryMission(["timed-asteroid-run"])).toBe(STORY_CHAIN[0]);
  });

  it("tolerates out-of-order completion (e.g. debug / migration)", () => {
    // If some mid-chapter was skipped, the first-missing one is still served.
    expect(getNextStoryMission([IDS[0], IDS[2]])).toBe(STORY_CHAIN[1]);
  });
});

describe("isStoryComplete", () => {
  it("true when all 5 done, false otherwise", () => {
    expect(isStoryComplete(IDS)).toBe(true);
    expect(isStoryComplete(IDS.slice(0, 4))).toBe(false);
    expect(isStoryComplete([])).toBe(false);
  });
});

describe("getStoryProgress", () => {
  it("summarizes incomplete progress", () => {
    const p = getStoryProgress([IDS[0], IDS[1]]);
    expect(p.completedCount).toBe(2);
    expect(p.totalCount).toBe(5);
    expect(p.nextMission?.id).toBe(IDS[2]);
    expect(p.chainComplete).toBe(false);
    expect(p.title).toBeNull();
    expect(p.cosmeticId).toBeNull();
  });

  it("exposes the final rewards once complete", () => {
    const p = getStoryProgress(IDS);
    expect(p.chainComplete).toBe(true);
    expect(p.title).toBe(STORY_COMPLETE_TITLE);
    expect(p.cosmeticId).toBe(STORY_COMPLETE_COSMETIC_ID);
    expect(p.nextMission).toBeNull();
  });
});

describe("canPlayStoryMission", () => {
  it("true only for the current chapter", () => {
    expect(canPlayStoryMission(IDS[0], [])).toBe(true);
    expect(canPlayStoryMission(IDS[1], [])).toBe(false);
    expect(canPlayStoryMission(IDS[2], [IDS[0], IDS[1]])).toBe(true);
  });

  it("false for any mission once the chain is complete", () => {
    expect(canPlayStoryMission(IDS[0], IDS)).toBe(false);
  });
});
