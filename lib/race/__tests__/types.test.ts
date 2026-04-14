import { describe, it, expect } from "vitest";
import { RaceDifficulty } from "../types";

describe("RaceDifficulty", () => {
  it("has the 4 canonical difficulty values", () => {
    expect(Object.values(RaceDifficulty).sort()).toEqual(
      ["Easy", "Extreme", "Hard", "Medium"].sort(),
    );
  });
});
