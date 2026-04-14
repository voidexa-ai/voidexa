import { describe, it, expect } from "vitest";
import { MissionType, MissionDifficulty, MISSION_TYPES, MISSION_DIFFICULTIES } from "../types";

describe("enum coverage", () => {
  it("MissionType has all 6 values", () => {
    expect(MISSION_TYPES.sort()).toEqual(
      [
        MissionType.AsteroidRun,
        MissionType.SpeedDelivery,
        MissionType.NebulaDash,
        MissionType.ScanMission,
        MissionType.UnchartedSector,
        MissionType.BeaconPlacement,
      ].sort(),
    );
  });

  it("MissionDifficulty has the 4 canonical tiers", () => {
    expect(MISSION_DIFFICULTIES.sort()).toEqual(
      ["Easy", "Extreme", "Hard", "Medium"].sort(),
    );
  });
});
