import { describe, it, expect } from "vitest";
import { CardRarity } from "../../game/cards";
import {
  STARTER_SHOP_ITEMS,
  ShopCategory,
  PRICE_BANDS,
  isPriceInBand,
} from "../items";

describe("STARTER_SHOP_ITEMS", () => {
  it("has exactly 20 items", () => {
    expect(STARTER_SHOP_ITEMS).toHaveLength(20);
  });

  it("has unique ids", () => {
    const ids = STARTER_SHOP_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every item has non-empty name, description, imageUrl", () => {
    for (const i of STARTER_SHOP_ITEMS) {
      expect(i.name.length).toBeGreaterThan(0);
      expect(i.description.length).toBeGreaterThan(0);
      expect(i.imageUrl.length).toBeGreaterThan(0);
    }
  });

  it("prices are integers >= 0 (Stripe cents)", () => {
    for (const i of STARTER_SHOP_ITEMS) {
      expect(Number.isInteger(i.price)).toBe(true);
      expect(i.price).toBeGreaterThanOrEqual(0);
    }
  });

  it("covers all 7 categories", () => {
    const cats = new Set(STARTER_SHOP_ITEMS.map((i) => i.category));
    for (const c of Object.values(ShopCategory)) {
      expect(cats.has(c)).toBe(true);
    }
  });

  it("covers the 5 non-Mythic starter rarities (Mythic added sprint 14h is drop-only)", () => {
    const rarities = new Set(STARTER_SHOP_ITEMS.map((i) => i.rarity));
    for (const r of Object.values(CardRarity)) {
      if (r === CardRarity.Mythic) continue;
      expect(rarities.has(r)).toBe(true);
    }
  });

  it("every item's price sits inside its category's PRICE_BANDS", () => {
    for (const i of STARTER_SHOP_ITEMS) {
      expect(isPriceInBand(i)).toBe(true);
    }
  });

  it("limited-edition items have availableUntil; non-limited don't need it", () => {
    for (const i of STARTER_SHOP_ITEMS) {
      if (i.isLimitedEdition) {
        expect(i.availableUntil).toBeDefined();
        // Must be a parseable ISO timestamp.
        expect(Number.isNaN(Date.parse(i.availableUntil!))).toBe(false);
      }
    }
  });
});

describe("PRICE_BANDS", () => {
  it("min <= max for every band", () => {
    for (const band of Object.values(PRICE_BANDS)) {
      expect(band.min).toBeLessThanOrEqual(band.max);
    }
  });
});
