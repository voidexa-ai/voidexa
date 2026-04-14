import { describe, it, expect } from "vitest";
import { CardCategory, CardRarity, DUST_VALUES, CRAFT_COSTS, type Card } from "../../game/cards";
import { type CardCatalogue } from "../deck";
import {
  createCollection,
  addCardToCollection,
  ownedCount,
  disenchantCard,
  craftCard,
  fuseCards,
  totalDustValue,
  uniqueByRarity,
} from "../collection";

function mkCard(id: string, rarity: CardRarity): Card {
  return {
    id,
    name: id,
    rarity,
    category: CardCategory.Attack,
    energyCost: 2,
    description: "t",
    primaryEffect: "t",
  };
}

const CATALOGUE: CardCatalogue = {
  c1: mkCard("c1", CardRarity.Common),
  c2: mkCard("c2", CardRarity.Common),
  u1: mkCard("u1", CardRarity.Uncommon),
  u2: mkCard("u2", CardRarity.Uncommon),
  r1: mkCard("r1", CardRarity.Rare),
  e1: mkCard("e1", CardRarity.Epic),
  l1: mkCard("l1", CardRarity.Legendary),
};

describe("createCollection / addCardToCollection", () => {
  it("starts empty with 0 dust", () => {
    const c = createCollection();
    expect(c.cards).toEqual({});
    expect(c.dust).toBe(0);
  });

  it("addCardToCollection increments copy count immutably", () => {
    const c0 = createCollection();
    const c1 = addCardToCollection(c0, "c1");
    const c2 = addCardToCollection(c1, "c1");
    expect(c0.cards).toEqual({}); // original untouched
    expect(ownedCount(c1, "c1")).toBe(1);
    expect(ownedCount(c2, "c1")).toBe(2);
  });

  it("addCardToCollection supports batch count", () => {
    const c = addCardToCollection(createCollection(), "c1", 5);
    expect(ownedCount(c, "c1")).toBe(5);
  });
});

describe("disenchantCard", () => {
  it("grants correct dust per rarity and decrements copies", () => {
    let c = addCardToCollection(createCollection(), "r1", 2);
    const result = disenchantCard(c, "r1", CATALOGUE);
    expect(result.dustGained).toBe(DUST_VALUES[CardRarity.Rare]); // 100
    expect(result.collection.dust).toBe(100);
    expect(ownedCount(result.collection, "r1")).toBe(1);
  });

  it("removes the card entry when last copy is disenchanted", () => {
    let c = addCardToCollection(createCollection(), "c1", 1);
    const result = disenchantCard(c, "c1", CATALOGUE);
    expect("c1" in result.collection.cards).toBe(false);
  });

  it("throws when not owned", () => {
    expect(() => disenchantCard(createCollection(), "c1", CATALOGUE)).toThrow();
  });
});

describe("craftCard", () => {
  it("spends dust and grants 1 copy", () => {
    const c = { cards: {}, dust: 500 };
    const next = craftCard(c, "r1", CATALOGUE); // costs 400
    expect(next.dust).toBe(100);
    expect(ownedCount(next, "r1")).toBe(1);
  });

  it("throws when dust is insufficient", () => {
    const c = { cards: {}, dust: CRAFT_COSTS[CardRarity.Legendary] - 1 };
    expect(() => craftCard(c, "l1", CATALOGUE)).toThrow();
  });
});

describe("fuseCards", () => {
  it("fuses two Commons into an Uncommon", () => {
    let c = addCardToCollection(createCollection(), "c1", 2);
    const rng = () => 0; // picks first Uncommon in the pool (u1)
    const res = fuseCards(c, "c1", "c1", CATALOGUE, { rng });
    expect(res.resultRarity).toBe(CardRarity.Uncommon);
    expect([CATALOGUE.u1.id, CATALOGUE.u2.id]).toContain(res.resultCardId);
    expect(ownedCount(res.collection, "c1")).toBe(0);
    expect(ownedCount(res.collection, res.resultCardId)).toBe(1);
  });

  it("fuses two different same-rarity cards", () => {
    let c = addCardToCollection(createCollection(), "c1");
    c = addCardToCollection(c, "c2");
    const res = fuseCards(c, "c1", "c2", CATALOGUE, { rng: () => 0 });
    expect(res.resultRarity).toBe(CardRarity.Uncommon);
    expect(ownedCount(res.collection, "c1")).toBe(0);
    expect(ownedCount(res.collection, "c2")).toBe(0);
  });

  it("refuses mismatched rarities", () => {
    let c = addCardToCollection(createCollection(), "c1");
    c = addCardToCollection(c, "u1");
    expect(() => fuseCards(c, "c1", "u1", CATALOGUE)).toThrow();
  });

  it("refuses Legendary fusion (no tier above)", () => {
    // Need 2 Legendary cards to even attempt — contrive a catalogue with 2.
    const cat2: CardCatalogue = {
      ...CATALOGUE,
      l2: mkCard("l2", CardRarity.Legendary),
    };
    let c = addCardToCollection(createCollection(), "l1");
    c = addCardToCollection(c, "l2");
    expect(() => fuseCards(c, "l1", "l2", cat2)).toThrow();
  });

  it("refuses when player doesn't own 2 copies of a same-id fusion", () => {
    let c = addCardToCollection(createCollection(), "c1", 1); // only 1 copy
    expect(() => fuseCards(c, "c1", "c1", CATALOGUE)).toThrow();
  });

  it("is deterministic with a seeded rng", () => {
    let c = addCardToCollection(createCollection(), "c1", 4);
    const r1 = fuseCards(c, "c1", "c1", CATALOGUE, { rng: () => 0.9999 });
    const r2 = fuseCards(c, "c1", "c1", CATALOGUE, { rng: () => 0.9999 });
    expect(r1.resultCardId).toBe(r2.resultCardId);
  });
});

describe("aggregates", () => {
  it("totalDustValue sums correctly", () => {
    let c = addCardToCollection(createCollection(), "c1", 3); // 3 × 5 = 15
    c = addCardToCollection(c, "e1", 1); // 1 × 400 = 400
    expect(totalDustValue(c, CATALOGUE)).toBe(415);
  });

  it("uniqueByRarity counts distinct cards per rarity", () => {
    let c = addCardToCollection(createCollection(), "c1", 1);
    c = addCardToCollection(c, "c2", 1);
    c = addCardToCollection(c, "u1", 5);
    const r = uniqueByRarity(c, CATALOGUE);
    expect(r[CardRarity.Common]).toBe(2);
    expect(r[CardRarity.Uncommon]).toBe(1);
    expect(r[CardRarity.Rare]).toBe(0);
  });
});
