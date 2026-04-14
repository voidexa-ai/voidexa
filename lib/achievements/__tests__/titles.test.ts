import { describe, it, expect } from "vitest";
import {
  ACHIEVEMENT_TITLES,
  TITLE_PLACEHOLDER,
  getTitleFragment,
  resolveTitleFragment,
} from "../titles";
import { ACHIEVEMENTS } from "../definitions";

describe("ACHIEVEMENT_TITLES coverage", () => {
  it("has one fragment per achievement id", () => {
    const achIds = new Set(ACHIEVEMENTS.map((a) => a.id));
    const titleIds = new Set(Object.keys(ACHIEVEMENT_TITLES));
    expect(titleIds).toEqual(achIds);
  });

  it("every fragment is non-empty", () => {
    for (const [id, fragment] of Object.entries(ACHIEVEMENT_TITLES)) {
      expect(fragment.length).toBeGreaterThan(0);
      expect(fragment.trim()).toBe(fragment); // no leading/trailing whitespace
      void id;
    }
  });

  it("matches the master-plan example titles", () => {
    expect(ACHIEVEMENT_TITLES["quantum-master"]).toBe("Voice of the Consensus");
    expect(ACHIEVEMENT_TITLES["champion"]).toBe("Scourge of the Void");
    expect(ACHIEVEMENT_TITLES["archaeologist"]).toBe("Keeper of Lost Worlds");
    expect(ACHIEVEMENT_TITLES["legend"]).toBe("The Unbroken");
  });

  it("Pioneer fragment contains the [planet name] placeholder", () => {
    expect(ACHIEVEMENT_TITLES["pioneer"]).toContain(TITLE_PLACEHOLDER.PLANET);
  });
});

describe("getTitleFragment", () => {
  it("returns the fragment for a known id", () => {
    expect(getTitleFragment("legend")).toBe("The Unbroken");
  });

  it("returns null for unknown id", () => {
    expect(getTitleFragment("does-not-exist")).toBeNull();
  });
});

describe("resolveTitleFragment", () => {
  it("substitutes [planet name] when planetName supplied", () => {
    expect(
      resolveTitleFragment(ACHIEVEMENT_TITLES["pioneer"], { planetName: "Kreos" }),
    ).toBe("Sovereign of Kreos");
  });

  it("leaves fragment unchanged when no context given", () => {
    const raw = ACHIEVEMENT_TITLES["pioneer"];
    expect(resolveTitleFragment(raw)).toBe(raw);
  });

  it("no-op on fragments with no placeholders", () => {
    expect(resolveTitleFragment("The Unbroken", { planetName: "Kreos" })).toBe(
      "The Unbroken",
    );
  });
});
