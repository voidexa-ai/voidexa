import { describe, it, expect } from "vitest";
import {
  CardCategory,
  CardRarity,
  isValidEnergyCost,
} from "../../game/cards";
import {
  STARTER_CARDS,
  STARTER_CATALOGUE,
  ALIEN_BACKFIRE_CHANCE,
  countByRarity,
} from "../starter_set";

describe("STARTER_CARDS composition", () => {
  it("contains exactly 40 cards", () => {
    expect(STARTER_CARDS).toHaveLength(40);
  });

  it("has unique card ids", () => {
    const ids = STARTER_CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("rarity distribution matches Part 8 (15 / 10 / 8 / 5 / 2)", () => {
    expect(countByRarity()).toEqual({
      [CardRarity.Common]: 15,
      [CardRarity.Uncommon]: 10,
      [CardRarity.Rare]: 8,
      [CardRarity.Epic]: 5,
      [CardRarity.Legendary]: 2,
      [CardRarity.Mythic]: 0,
    });
  });

  it("covers all 5 CardCategory values", () => {
    const cats = new Set(STARTER_CARDS.map((c) => c.category));
    for (const c of Object.values(CardCategory)) expect(cats.has(c)).toBe(true);
  });
});

describe("energy costs stay inside rarity bands", () => {
  it("isValidEnergyCost passes for every Core Set card", () => {
    for (const c of STARTER_CARDS) {
      expect(isValidEnergyCost(c)).toBe(true);
    }
  });
});

describe("Alien cards", () => {
  it("every Alien card has backfireEffect AND backfireChance === 0.2", () => {
    const aliens = STARTER_CARDS.filter((c) => c.category === CardCategory.Alien);
    expect(aliens.length).toBeGreaterThan(0);
    for (const a of aliens) {
      expect(a.backfireEffect).toBeDefined();
      expect(a.backfireEffect!.length).toBeGreaterThan(0);
      expect(a.backfireChance).toBe(ALIEN_BACKFIRE_CHANCE);
    }
  });

  it("non-Alien cards do NOT have a backfireChance", () => {
    const nonAliens = STARTER_CARDS.filter((c) => c.category !== CardCategory.Alien);
    for (const c of nonAliens) {
      expect(c.backfireChance).toBeUndefined();
    }
  });
});

describe("STARTER_CATALOGUE", () => {
  it("has one entry per card, keyed by id", () => {
    expect(Object.keys(STARTER_CATALOGUE)).toHaveLength(STARTER_CARDS.length);
    for (const c of STARTER_CARDS) {
      expect(STARTER_CATALOGUE[c.id]).toBeDefined();
      expect(STARTER_CATALOGUE[c.id].id).toBe(c.id);
    }
  });
});
