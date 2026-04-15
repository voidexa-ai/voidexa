/**
 * lib/shop/items.ts
 *
 * Shop item data foundation for voidexa's Free Flight shop.
 * Anchors:
 *   - Master plan Part 3 (Ship System) — pricing bands, acquisition rules
 *   - Master plan Part 8 (Card System) — card pack pricing
 *
 * Golden rule (Part 3, line 190): Shop sells LOOKS. Gameplay earns STATS. No pay-to-win.
 * Prices are stored in USD cents (integer) for Stripe compatibility.
 */

import { CardRarity } from "../game/cards";

/** Rarity is shared with card system — reuse the enum for consistency. */
export type ShopRarity = CardRarity;
export const ShopRarity = CardRarity;

export enum ShopCategory {
  ShipSkin = "ShipSkin",
  Attachment = "Attachment",
  Effect = "Effect",
  Trail = "Trail",
  CockpitTheme = "CockpitTheme",
  Emote = "Emote",
  CardPack = "CardPack",
}

export interface ShopItem {
  /** Stable slug — used in URLs, DB, Stripe metadata. */
  id: string;
  name: string;
  description: string;
  rarity: CardRarity;
  category: ShopCategory;
  /** Price in USD cents (Stripe-compatible). Must be a non-negative integer. */
  price: number;
  /** Public asset path or CDN URL. Lives under public/shop/ when repo-relative. */
  imageUrl: string;
  /** True for Fortnite-style limited drops that never return. */
  isLimitedEdition: boolean;
  /** ISO timestamp when the limited edition stops being sold. Required when isLimitedEdition=true. */
  availableUntil?: string;
}

/**
 * Pricing bands from master plan Part 3, lines 208–213.
 * Guideline values (USD) used to sanity-check `STARTER_SHOP_ITEMS`.
 * Values are inclusive min/max in CENTS.
 */
export const PRICE_BANDS: Readonly<
  Record<ShopCategory, { min: number; max: number }>
> = {
  // v2 rarity-aligned bands (USD cents). Each category's band spans the rarity
  // tiers it may appear in: Common $0.50 → Legendary $12.
  [ShopCategory.ShipSkin]:     { min: 50,  max: 1200 },
  [ShopCategory.Attachment]:   { min: 50,  max: 700  },
  [ShopCategory.Effect]:       { min: 50,  max: 1200 },
  [ShopCategory.Trail]:        { min: 50,  max: 1200 },
  [ShopCategory.CockpitTheme]: { min: 100, max: 1200 },
  [ShopCategory.Emote]:        { min: 50,  max: 400  },
  [ShopCategory.CardPack]:     { min: 100, max: 1000 },
};

/** Shortcut: true iff item's `price` is inside its category's band. */
export function isPriceInBand(item: Pick<ShopItem, "price" | "category">): boolean {
  const band = PRICE_BANDS[item.category];
  return (
    Number.isInteger(item.price) &&
    item.price >= band.min &&
    item.price <= band.max
  );
}

/**
 * 20 starter items spread across all 7 categories and all 5 rarities.
 * These anchor the shop's visual catalogue until real art/DB data arrives.
 * Image URLs are placeholders under /shop/ — swap for real CDN paths later.
 *
 * Distribution (by category):
 *   ShipSkin × 4, Attachment × 3, Effect × 3, Trail × 3,
 *   CockpitTheme × 2, Emote × 2, CardPack × 3.
 *
 * Distribution (by rarity): Common × 6, Uncommon × 5, Rare × 4, Epic × 3, Legendary × 2.
 */
export const STARTER_SHOP_ITEMS: ReadonlyArray<ShopItem> = [
  // --- Ship Skins ---
  {
    id: "skin-crimson-fighter",
    name: "Crimson Fighter Skin",
    description: "A deep red hull finish with subtle black racing stripes.",
    rarity: CardRarity.Common,
    category: ShopCategory.ShipSkin,
    price: 50,
    imageUrl: "/shop/skins/crimson-fighter.webp",
    isLimitedEdition: false,
  },
  {
    id: "skin-chrome-cruiser",
    name: "Chrome Cruiser Plating",
    description: "Polished chrome with animated reflections of nearby nebulae.",
    rarity: CardRarity.Rare,
    category: ShopCategory.ShipSkin,
    price: 300,
    imageUrl: "/shop/skins/chrome-cruiser.webp",
    isLimitedEdition: false,
  },
  {
    id: "skin-obsidian-stealth",
    name: "Obsidian Stealth Coating",
    description: "Light-absorbing matte finish. Makes radar lock 10% slower (cosmetic; no stat change).",
    rarity: CardRarity.Epic,
    category: ShopCategory.ShipSkin,
    price: 600,
    imageUrl: "/shop/skins/obsidian-stealth.webp",
    isLimitedEdition: false,
  },
  {
    id: "skin-void-legend",
    name: "Voidrunner Legendary Hull",
    description: "A seasonal hull with animated star-map etching. Limited drop.",
    rarity: CardRarity.Legendary,
    category: ShopCategory.ShipSkin,
    price: 1000,
    imageUrl: "/shop/skins/void-legend.webp",
    isLimitedEdition: true,
    availableUntil: "2026-05-15T00:00:00.000Z",
  },

  // --- Attachments ---
  {
    id: "attach-swept-wings",
    name: "Swept Wing Fins",
    description: "Decorative swept fins that fold when docked.",
    rarity: CardRarity.Common,
    category: ShopCategory.Attachment,
    price: 50,
    imageUrl: "/shop/attachments/swept-wings.webp",
    isLimitedEdition: false,
  },
  {
    id: "attach-sensor-array",
    name: "Sensor Antenna Array",
    description: "Cluster of antennas that pulse with signal activity.",
    rarity: CardRarity.Uncommon,
    category: ShopCategory.Attachment,
    price: 150,
    imageUrl: "/shop/attachments/sensor-array.webp",
    isLimitedEdition: false,
  },
  {
    id: "attach-vanity-guns",
    name: "Ornamental Cannons",
    description: "Non-functional cosmetic gun pods — pure drip.",
    rarity: CardRarity.Rare,
    category: ShopCategory.Attachment,
    price: 300,
    imageUrl: "/shop/attachments/vanity-guns.webp",
    isLimitedEdition: false,
  },

  // --- Effects ---
  {
    id: "effect-warp-bloom",
    name: "Warp Bloom",
    description: "Extra bloom halo when your ship exits warp.",
    rarity: CardRarity.Common,
    category: ShopCategory.Effect,
    price: 50,
    imageUrl: "/shop/effects/warp-bloom.webp",
    isLimitedEdition: false,
  },
  {
    id: "effect-nebula-wake",
    name: "Nebula Wake",
    description: "A trailing cloud of colored gas behind your engines.",
    rarity: CardRarity.Uncommon,
    category: ShopCategory.Effect,
    price: 150,
    imageUrl: "/shop/effects/nebula-wake.webp",
    isLimitedEdition: false,
  },
  {
    id: "effect-ion-corona",
    name: "Ion Corona",
    description: "Crackling electrical aura around your hull.",
    rarity: CardRarity.Epic,
    category: ShopCategory.Effect,
    price: 600,
    imageUrl: "/shop/effects/ion-corona.webp",
    isLimitedEdition: false,
  },

  // --- Trails ---
  {
    id: "trail-blue-ion",
    name: "Blue Ion Trail",
    description: "Classic cyan engine trail.",
    rarity: CardRarity.Common,
    category: ShopCategory.Trail,
    price: 50,
    imageUrl: "/shop/trails/blue-ion.webp",
    isLimitedEdition: false,
  },
  {
    id: "trail-solar-flare",
    name: "Solar Flare Trail",
    description: "Orange plasma streaks that ripple as you accelerate.",
    rarity: CardRarity.Uncommon,
    category: ShopCategory.Trail,
    price: 150,
    imageUrl: "/shop/trails/solar-flare.webp",
    isLimitedEdition: false,
  },
  {
    id: "trail-rainbow-legend",
    name: "Aurora Legendary Trail",
    description: "Rotating rainbow aurora trail — Legendary, seasonal.",
    rarity: CardRarity.Legendary,
    category: ShopCategory.Trail,
    price: 1000,
    imageUrl: "/shop/trails/aurora-legend.webp",
    isLimitedEdition: true,
    availableUntil: "2026-06-01T00:00:00.000Z",
  },

  // --- Cockpit Themes ---
  {
    id: "cockpit-carbon",
    name: "Carbon Fiber Cockpit",
    description: "Dark carbon-weave dashboard with red accents.",
    rarity: CardRarity.Uncommon,
    category: ShopCategory.CockpitTheme,
    price: 150,
    imageUrl: "/shop/cockpits/carbon.webp",
    isLimitedEdition: false,
  },
  {
    id: "cockpit-gilded",
    name: "Gilded Cockpit",
    description: "Brass and wood dashboard with filigree trim.",
    rarity: CardRarity.Rare,
    category: ShopCategory.CockpitTheme,
    price: 300,
    imageUrl: "/shop/cockpits/gilded.webp",
    isLimitedEdition: false,
  },

  // --- Emotes ---
  {
    id: "emote-salute",
    name: "Pilot Salute",
    description: "A crisp salute emote visible to nearby players.",
    rarity: CardRarity.Common,
    category: ShopCategory.Emote,
    price: 50,
    imageUrl: "/shop/emotes/salute.webp",
    isLimitedEdition: false,
  },
  {
    id: "emote-victory-roll",
    name: "Victory Roll",
    description: "Barrel-roll emote performed by your ship.",
    rarity: CardRarity.Rare,
    category: ShopCategory.Emote,
    price: 300,
    imageUrl: "/shop/emotes/victory-roll.webp",
    isLimitedEdition: false,
  },

  // --- Card Packs (per Part 8) ---
  {
    id: "pack-standard",
    name: "Standard Card Pack",
    description: "5 cards: 4 Common + 1 guaranteed Uncommon.",
    rarity: CardRarity.Common,
    category: ShopCategory.CardPack,
    price: 100,
    imageUrl: "/shop/packs/standard.webp",
    isLimitedEdition: false,
  },
  {
    id: "pack-premium",
    name: "Premium Card Pack",
    description: "5 cards: 3 Common + 1 Uncommon + 1 guaranteed Rare.",
    rarity: CardRarity.Uncommon,
    category: ShopCategory.CardPack,
    price: 200,
    imageUrl: "/shop/packs/premium.webp",
    isLimitedEdition: false,
  },
  {
    id: "pack-ultimate",
    name: "Ultimate Card Pack",
    description: "5 cards: 2 Uncommon + 2 Rare + 1 guaranteed Epic.",
    rarity: CardRarity.Epic,
    category: ShopCategory.CardPack,
    price: 500,
    imageUrl: "/shop/packs/ultimate.webp",
    isLimitedEdition: false,
  },
];
