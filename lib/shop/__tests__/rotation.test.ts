import { describe, it, expect } from "vitest";
import {
  getDailyItems,
  getWeeklyFeatured,
  isLimitedAvailable,
  getActiveLimitedEditions,
} from "../rotation";
import {
  STARTER_SHOP_ITEMS,
  type ShopItem,
  ShopCategory,
} from "../items";
import { CardRarity } from "../../game/cards";

const SAMPLE_DATE = new Date("2026-04-15T12:00:00.000Z");

describe("getDailyItems", () => {
  it("returns 4–6 items", () => {
    const items = getDailyItems(SAMPLE_DATE);
    expect(items.length).toBeGreaterThanOrEqual(4);
    expect(items.length).toBeLessThanOrEqual(6);
  });

  it("is deterministic for the same UTC day", () => {
    const morning = new Date("2026-04-15T00:30:00.000Z");
    const evening = new Date("2026-04-15T23:30:00.000Z");
    expect(getDailyItems(morning)).toEqual(getDailyItems(evening));
  });

  it("rotates to different items on different days", () => {
    const d1 = getDailyItems(new Date("2026-04-15T12:00:00.000Z"));
    const d2 = getDailyItems(new Date("2026-04-16T12:00:00.000Z"));
    const ids1 = d1.map((i) => i.id).sort().join(",");
    const ids2 = d2.map((i) => i.id).sort().join(",");
    expect(ids1).not.toBe(ids2);
  });

  it("excludes limited-edition items", () => {
    const items = getDailyItems(SAMPLE_DATE);
    for (const i of items) expect(i.isLimitedEdition).toBe(false);
  });

  it("returns only items from the provided catalogue override", () => {
    const catalogue: ShopItem[] = [
      {
        id: "only-one",
        name: "Only One",
        description: "x",
        rarity: CardRarity.Common,
        category: ShopCategory.Emote,
        price: 100,
        imageUrl: "/x.png",
        isLimitedEdition: false,
      },
    ];
    const items = getDailyItems(SAMPLE_DATE, { catalogue });
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("only-one");
  });
});

describe("getWeeklyFeatured", () => {
  it("returns 2–3 items", () => {
    const items = getWeeklyFeatured(SAMPLE_DATE);
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items.length).toBeLessThanOrEqual(3);
  });

  it("only includes Rare / Epic / Legendary (premium) rarities", () => {
    const items = getWeeklyFeatured(SAMPLE_DATE);
    for (const i of items) {
      expect([CardRarity.Rare, CardRarity.Epic, CardRarity.Legendary]).toContain(
        i.rarity,
      );
    }
  });

  it("is deterministic across the same ISO week", () => {
    const mon = new Date("2026-04-13T12:00:00.000Z");
    const fri = new Date("2026-04-17T12:00:00.000Z");
    expect(getWeeklyFeatured(mon)).toEqual(getWeeklyFeatured(fri));
  });
});

describe("isLimitedAvailable", () => {
  const limited: ShopItem = {
    id: "x",
    name: "x",
    description: "x",
    rarity: CardRarity.Legendary,
    category: ShopCategory.Trail,
    price: 1500,
    imageUrl: "/x.png",
    isLimitedEdition: true,
    availableUntil: "2026-05-01T00:00:00.000Z",
  };

  it("true before availableUntil", () => {
    expect(isLimitedAvailable(limited, new Date("2026-04-30T23:59:00.000Z"))).toBe(true);
  });

  it("false at/after availableUntil", () => {
    expect(isLimitedAvailable(limited, new Date("2026-05-01T00:00:00.000Z"))).toBe(false);
    expect(isLimitedAvailable(limited, new Date("2026-06-01T00:00:00.000Z"))).toBe(false);
  });

  it("non-limited items always true", () => {
    const notLimited = { ...limited, isLimitedEdition: false, availableUntil: undefined };
    expect(isLimitedAvailable(notLimited, new Date())).toBe(true);
  });

  it("misconfigured limited (no availableUntil) returns false", () => {
    const bad = { ...limited, availableUntil: undefined };
    expect(isLimitedAvailable(bad, new Date())).toBe(false);
  });
});

describe("getActiveLimitedEditions", () => {
  it("returns only currently-live limited items", () => {
    const items = getActiveLimitedEditions(new Date("2026-04-15T12:00:00.000Z"));
    for (const i of items) {
      expect(i.isLimitedEdition).toBe(true);
      expect(Date.parse(i.availableUntil!)).toBeGreaterThan(Date.now() - 1);
    }
  });

  it("STARTER_SHOP_ITEMS contains at least one live limited edition on 2026-04-15", () => {
    const items = getActiveLimitedEditions(
      new Date("2026-04-15T12:00:00.000Z"),
      { catalogue: STARTER_SHOP_ITEMS },
    );
    expect(items.length).toBeGreaterThan(0);
  });
});
