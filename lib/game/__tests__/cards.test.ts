import { describe, it, expect } from "vitest";
import {
  CardRarity,
  CardCategory,
  RARITY_ORDER,
  DUST_VALUES,
  CRAFT_COSTS,
  ENERGY_COST_RANGE,
  maxCopiesInDeck,
  calculateDust,
  canFuse,
  nextRarity,
  isValidEnergyCost,
  type Card,
} from "../cards";

const sample = (over: Partial<Card> = {}): Card => ({
  id: "test-1",
  name: "Test Card",
  rarity: CardRarity.Common,
  category: CardCategory.Attack,
  energyCost: 1,
  description: "Test",
  primaryEffect: "Do a thing.",
  ...over,
});

describe("constants", () => {
  it("rarity ladder is low → high", () => {
    expect(RARITY_ORDER).toEqual([
      CardRarity.Common,
      CardRarity.Uncommon,
      CardRarity.Rare,
      CardRarity.Epic,
      CardRarity.Legendary,
    ]);
  });

  it("dust values match master plan (5 / 20 / 100 / 400 / 1600)", () => {
    expect(DUST_VALUES[CardRarity.Common]).toBe(5);
    expect(DUST_VALUES[CardRarity.Uncommon]).toBe(20);
    expect(DUST_VALUES[CardRarity.Rare]).toBe(100);
    expect(DUST_VALUES[CardRarity.Epic]).toBe(400);
    expect(DUST_VALUES[CardRarity.Legendary]).toBe(1600);
  });

  it("craft costs match master plan", () => {
    expect(CRAFT_COSTS[CardRarity.Common]).toBe(30);
    expect(CRAFT_COSTS[CardRarity.Legendary]).toBe(6400);
  });
});

describe("calculateDust", () => {
  it("returns the rarity's dust value", () => {
    expect(calculateDust(CardRarity.Rare)).toBe(100);
    expect(calculateDust(CardRarity.Legendary)).toBe(1600);
  });
});

describe("canFuse", () => {
  it("true when both cards share a non-Legendary rarity", () => {
    const a = sample({ id: "a", rarity: CardRarity.Rare });
    const b = sample({ id: "b", rarity: CardRarity.Rare });
    expect(canFuse(a, b)).toBe(true);
  });

  it("false when rarities differ", () => {
    const a = sample({ id: "a", rarity: CardRarity.Rare });
    const b = sample({ id: "b", rarity: CardRarity.Epic });
    expect(canFuse(a, b)).toBe(false);
  });

  it("false when both are Legendary (no next tier)", () => {
    const a = sample({ id: "a", rarity: CardRarity.Legendary, energyCost: 6 });
    const b = sample({ id: "b", rarity: CardRarity.Legendary, energyCost: 6 });
    expect(canFuse(a, b)).toBe(false);
  });
});

describe("nextRarity", () => {
  it("returns the next rarity up", () => {
    expect(nextRarity(CardRarity.Common)).toBe(CardRarity.Uncommon);
    expect(nextRarity(CardRarity.Epic)).toBe(CardRarity.Legendary);
  });

  it("returns null for Legendary", () => {
    expect(nextRarity(CardRarity.Legendary)).toBeNull();
  });
});

describe("maxCopiesInDeck", () => {
  it("is 2 for normal rarities and 1 for Legendary", () => {
    expect(maxCopiesInDeck(CardRarity.Common)).toBe(2);
    expect(maxCopiesInDeck(CardRarity.Epic)).toBe(2);
    expect(maxCopiesInDeck(CardRarity.Legendary)).toBe(1);
  });
});

describe("isValidEnergyCost", () => {
  it("accepts costs inside the rarity band", () => {
    expect(isValidEnergyCost({ rarity: CardRarity.Common, energyCost: 1 })).toBe(true);
    expect(isValidEnergyCost({ rarity: CardRarity.Common, energyCost: 2 })).toBe(true);
    expect(isValidEnergyCost({ rarity: CardRarity.Legendary, energyCost: 7 })).toBe(true);
  });

  it("rejects costs outside the rarity band", () => {
    expect(isValidEnergyCost({ rarity: CardRarity.Common, energyCost: 3 })).toBe(false);
    expect(isValidEnergyCost({ rarity: CardRarity.Legendary, energyCost: 4 })).toBe(false);
  });

  it("all ENERGY_COST_RANGE bands are min <= max", () => {
    for (const r of RARITY_ORDER) {
      const b = ENERGY_COST_RANGE[r];
      expect(b.min).toBeLessThanOrEqual(b.max);
    }
  });
});

describe("CardCategory", () => {
  it("has the five required categories", () => {
    const values = Object.values(CardCategory);
    for (const c of ["Attack", "Defense", "Tactical", "Deployment", "Alien"]) {
      expect(values).toContain(c);
    }
  });
});
