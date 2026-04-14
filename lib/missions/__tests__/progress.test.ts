import { describe, it, expect } from "vitest";
import {
  MissionStatus,
  createProgress,
  startMission,
  completeObjective,
  failMission,
  completeMission,
  getMissionRewards,
  REPEAT_REWARD_MULTIPLIER,
} from "../progress";
import { MISSIONS_BY_ID } from "../catalogue";

const TIMED_ID = "timed-asteroid-run"; // has 2 objectives
const SCAN_ID  = "explore-scan-mission";  // repeatable exploration
const STORY_FINAL_ID = "story-5-chroniclers-pact"; // non-repeatable, epic cosmetic

describe("createProgress", () => {
  it("throws for unknown mission id", () => {
    expect(() => createProgress("does-not-exist", "p1")).toThrow();
  });

  it("initial state is NotStarted with empty objectives", () => {
    const p = createProgress(TIMED_ID, "p1");
    expect(p.status).toBe(MissionStatus.NotStarted);
    expect(p.objectivesCompleted).toEqual([]);
    expect(p.startedAt).toBeUndefined();
  });
});

describe("startMission", () => {
  it("NotStarted → Active and records startedAt", () => {
    const p = startMission(createProgress(TIMED_ID, "p1"), 5_000);
    expect(p.status).toBe(MissionStatus.Active);
    expect(p.startedAt).toBe(5_000);
  });

  it("throws when already started", () => {
    const p = startMission(createProgress(TIMED_ID, "p1"));
    expect(() => startMission(p)).toThrow();
  });
});

describe("completeObjective", () => {
  it("adds the objective id to objectivesCompleted", () => {
    let p = startMission(createProgress(TIMED_ID, "p1"));
    p = completeObjective(p, "reach-end");
    expect(p.objectivesCompleted).toEqual(["reach-end"]);
  });

  it("is a no-op on double-complete (same reference returned)", () => {
    let p = startMission(createProgress(TIMED_ID, "p1"));
    p = completeObjective(p, "reach-end");
    const same = completeObjective(p, "reach-end");
    expect(same).toBe(p);
  });

  it("throws for unknown objective id", () => {
    const p = startMission(createProgress(TIMED_ID, "p1"));
    expect(() => completeObjective(p, "nope")).toThrow();
  });

  it("throws when mission is not Active", () => {
    const p = createProgress(TIMED_ID, "p1");
    expect(() => completeObjective(p, "reach-end")).toThrow();
  });
});

describe("completeMission", () => {
  it("throws if any objective is still pending", () => {
    let p = startMission(createProgress(TIMED_ID, "p1"));
    p = completeObjective(p, "reach-end");
    // second objective "no-crashes" still pending
    expect(() => completeMission(p)).toThrow();
  });

  it("transitions Active → Completed when all objectives are done", () => {
    const mission = MISSIONS_BY_ID[TIMED_ID];
    let p = startMission(createProgress(TIMED_ID, "p1"), 100);
    for (const o of mission.objectives) p = completeObjective(p, o.id);
    const done = completeMission(p, 2_100);
    expect(done.status).toBe(MissionStatus.Completed);
    expect(done.completedAt).toBe(2_100);
    expect(done.timeElapsed).toBe(2_000);
  });
});

describe("failMission", () => {
  it("Active → Failed with elapsed time", () => {
    const p = startMission(createProgress(TIMED_ID, "p1"), 1_000);
    const failed = failMission(p, 4_000);
    expect(failed.status).toBe(MissionStatus.Failed);
    expect(failed.timeElapsed).toBe(3_000);
  });

  it("throws when mission is not Active", () => {
    const p = createProgress(TIMED_ID, "p1");
    expect(() => failMission(p)).toThrow();
  });
});

describe("getMissionRewards", () => {
  function completeAll(missionId: string, start = 0, end = 1000) {
    const mission = MISSIONS_BY_ID[missionId];
    let p = startMission(createProgress(missionId, "p1"), start);
    for (const o of mission.objectives) p = completeObjective(p, o.id);
    return completeMission(p, end);
  }

  it("throws if the mission is not Completed", () => {
    const p = createProgress(TIMED_ID, "p1");
    expect(() => getMissionRewards(p)).toThrow();
  });

  it("first completion of a repeatable mission yields full rewards", () => {
    const done = completeAll(SCAN_ID);
    const r = getMissionRewards(done, 0);
    expect(r.repeatMultiplier).toBe(1.0);
    expect(r.xp).toBe(MISSIONS_BY_ID[SCAN_ID].rewardXP);
    expect(r.credits).toBe(MISSIONS_BY_ID[SCAN_ID].rewardCredits);
  });

  it("repeat completion applies REPEAT_REWARD_MULTIPLIER", () => {
    const done = completeAll(SCAN_ID);
    const r = getMissionRewards(done, 5);
    expect(r.repeatMultiplier).toBe(REPEAT_REWARD_MULTIPLIER);
    expect(r.xp).toBe(Math.round(MISSIONS_BY_ID[SCAN_ID].rewardXP * REPEAT_REWARD_MULTIPLIER));
  });

  it("non-repeatable story mission ignores priorCompletions and includes epic cosmetic", () => {
    const done = completeAll(STORY_FINAL_ID);
    // priorCompletions > 0 should be impossible in practice, but function still gives full rewards.
    const r = getMissionRewards(done, 3);
    expect(r.repeatMultiplier).toBe(1.0);
    expect(r.itemId).toBe("chronicler-epic-cosmetic");
  });
});
