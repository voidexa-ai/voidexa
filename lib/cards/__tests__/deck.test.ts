import { describe, it, expect } from "vitest";
import { CardCategory, CardRarity, type Card } from "../../game/cards";
import {
  DECK_SIZE,
  MAX_COPIES_DEFAULT,
  MAX_COPIES_LEGENDARY,
  MAX_HAND_SIZE,
  STARTING_HAND_SIZE,
  createDeck,
  addCard,
  removeCard,
  isValidDeck,
  getHandFromDeck,
  drawOne,
  maxCopies,
  type CardCatalogue,
} from "../deck";

// ── fixtures ───────────────────────────────────────────────────────────────

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
  r1: mkCard("r1", CardRarity.Rare),
  e1: mkCard("e1", CardRarity.Epic),
  l1: mkCard("l1", CardRarity.Legendary),
};

function fillDeckTo(size: number, id: string, catalogue: CardCatalogue) {
  let d = createDeck();
  for (let i = 0; i < size; i++) d = addCard(d, id, catalogue);
  return d;
}

// ── tests ──────────────────────────────────────────────────────────────────

describe("constants", () => {
  it("match Part 8 spec", () => {
    expect(DECK_SIZE).toBe(20);
    expect(MAX_COPIES_DEFAULT).toBe(2);
    expect(MAX_COPIES_LEGENDARY).toBe(1);
    expect(STARTING_HAND_SIZE).toBe(5);
    expect(MAX_HAND_SIZE).toBe(7);
  });

  it("maxCopies is 1 only for Legendary", () => {
    expect(maxCopies(CardRarity.Common)).toBe(2);
    expect(maxCopies(CardRarity.Epic)).toBe(2);
    expect(maxCopies(CardRarity.Legendary)).toBe(1);
  });
});

describe("addCard / removeCard", () => {
  it("addCard grows the deck immutably", () => {
    const d0 = createDeck();
    const d1 = addCard(d0, "c1", CATALOGUE);
    expect(d0.cardIds).toEqual([]); // original untouched
    expect(d1.cardIds).toEqual(["c1"]);
  });

  it("addCard throws on unknown card", () => {
    expect(() => addCard(createDeck(), "nope", CATALOGUE)).toThrow();
  });

  it("addCard throws when deck is full", () => {
    // Build a deck with 10 copies of c1 + 10 copies of c2... but that's 10>2 per card.
    // Instead: fill with 10 different Common pairs. For this test we loosen to any full deck.
    let d = createDeck();
    // Use 10 unique cards × 2 copies.
    const ids = Array.from({ length: 10 }, (_, i) => `gen${i}`);
    const cat: CardCatalogue = Object.fromEntries(
      ids.map((id) => [id, mkCard(id, CardRarity.Common)]),
    );
    for (const id of ids) {
      d = addCard(d, id, cat);
      d = addCard(d, id, cat);
    }
    expect(d.cardIds).toHaveLength(DECK_SIZE);
    expect(() => addCard(d, ids[0], cat)).toThrow();
  });

  it("addCard caps normal rarities at 2 copies", () => {
    let d = createDeck();
    d = addCard(d, "c1", CATALOGUE);
    d = addCard(d, "c1", CATALOGUE);
    expect(() => addCard(d, "c1", CATALOGUE)).toThrow();
  });

  it("addCard caps Legendary at 1 copy", () => {
    let d = createDeck();
    d = addCard(d, "l1", CATALOGUE);
    expect(() => addCard(d, "l1", CATALOGUE)).toThrow();
  });

  it("removeCard removes exactly 1 occurrence", () => {
    let d = createDeck();
    d = addCard(d, "c1", CATALOGUE);
    d = addCard(d, "c1", CATALOGUE);
    d = removeCard(d, "c1");
    expect(d.cardIds).toEqual(["c1"]);
  });

  it("removeCard no-ops when card not present", () => {
    const d = createDeck();
    expect(removeCard(d, "nope")).toBe(d);
  });
});

describe("isValidDeck", () => {
  it("empty deck is invalid (wrong size)", () => {
    const r = isValidDeck(createDeck(), CATALOGUE);
    expect(r.valid).toBe(false);
    expect(r.errors.join(" ")).toMatch(/exactly 20 cards/);
  });

  it("20-card deck with legal copy counts is valid", () => {
    const ids = Array.from({ length: 10 }, (_, i) => `g${i}`);
    const cat: CardCatalogue = Object.fromEntries(
      ids.map((id) => [id, mkCard(id, CardRarity.Common)]),
    );
    let d = createDeck();
    for (const id of ids) {
      d = addCard(d, id, cat);
      d = addCard(d, id, cat);
    }
    expect(isValidDeck(d, cat)).toEqual({ valid: true, errors: [] });
  });

  it("flags unknown cards in the deck", () => {
    const d = { name: "bad", cardIds: Array(20).fill("not-in-cat") };
    const r = isValidDeck(d, CATALOGUE);
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => /Unknown card/.test(e))).toBe(true);
  });
});

describe("getHandFromDeck", () => {
  it("draws STARTING_HAND_SIZE by default", () => {
    // Build a 20-card deck manually — addCard enforces the 2-copy limit.
    const deck = { name: "t", cardIds: Array(20).fill("c1") };
    const { hand, remaining } = getHandFromDeck(deck);
    expect(hand).toHaveLength(STARTING_HAND_SIZE);
    expect(remaining).toHaveLength(20 - STARTING_HAND_SIZE);
  });

  it("is deterministic with a seeded rng", () => {
    const deck = { name: "t", cardIds: ["a", "b", "c", "d", "e", "f"] };
    const rng = () => 0;
    const r1 = getHandFromDeck(deck, 3, rng);
    const r2 = getHandFromDeck(deck, 3, rng);
    expect(r1).toEqual(r2);
    // With rng=0 we always draw index 0 → first card each time.
    expect(r1.hand[0]).toBe("a");
  });

  it("never returns more cards than the deck has (clamped to deck length)", () => {
    // handSize <= MAX_HAND_SIZE but larger than deck → hand equals deck length.
    const deck = { name: "t", cardIds: ["a", "b"] };
    const { hand, remaining } = getHandFromDeck(deck, MAX_HAND_SIZE);
    expect(hand).toHaveLength(2);
    expect(remaining).toHaveLength(0);
  });

  it("throws when handSize is negative or exceeds MAX_HAND_SIZE", () => {
    const deck = { name: "t", cardIds: [] };
    expect(() => getHandFromDeck(deck, -1)).toThrow();
    expect(() => getHandFromDeck(deck, MAX_HAND_SIZE + 1)).toThrow();
  });
});

describe("drawOne", () => {
  it("returns null on empty pile", () => {
    expect(drawOne([])).toEqual({ drawn: null, remaining: [] });
  });

  it("removes the drawn card from remaining", () => {
    const r = drawOne(["a", "b", "c"], () => 0);
    expect(r.drawn).toBe("a");
    expect(r.remaining).toEqual(["b", "c"]);
  });
});
