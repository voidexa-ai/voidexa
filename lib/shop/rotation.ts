/**
 * lib/shop/rotation.ts
 *
 * Shop rotation logic (Fortnite-style).
 * Master plan Part 3, lines 201–206:
 *   - Daily: 4–6 items, rotate every 24h
 *   - Weekly: 2–3 premium items
 *   - Limited: 48–72h, NEVER return
 *
 * Rotation is deterministic per date so every viewer sees the same pool,
 * and server/client computations agree without a shared DB lookup.
 * Uses a seeded PRNG (mulberry32) driven by a date-derived seed.
 */

import {
  STARTER_SHOP_ITEMS,
  ShopCategory,
  type ShopItem,
} from "./items";
import { CardRarity } from "../game/cards";

// ── PRNG ────────────────────────────────────────────────────────────────────

/** mulberry32 — small deterministic PRNG, good enough for shop picks. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a string into a 32-bit integer (FNV-1a variant). */
function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// ── date helpers ───────────────────────────────────────────────────────────

/** YYYY-MM-DD in UTC — stable across timezones. */
function dayKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** ISO week key (YYYY-Www) in UTC. */
function weekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

// ── public API ──────────────────────────────────────────────────────────────

export interface RotationOptions {
  /** Override the item catalogue (defaults to STARTER_SHOP_ITEMS). */
  catalogue?: ReadonlyArray<ShopItem>;
}

/**
 * Fisher-Yates shuffle using an injected RNG. Returns a new array.
 */
function shuffle<T>(arr: ReadonlyArray<T>, rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Returns 4–6 daily rotation items for the given date.
 * Same date → same items (deterministic). Limited-edition items are excluded
 * from daily rotation — they live in their own dedicated storefront slot.
 */
export function getDailyItems(
  date: Date,
  options: RotationOptions = {},
): ShopItem[] {
  const catalogue = options.catalogue ?? STARTER_SHOP_ITEMS;
  const eligible = catalogue.filter((i) => !i.isLimitedEdition);
  if (eligible.length === 0) return [];

  const seed = hashString("daily:" + dayKey(date));
  const rng = mulberry32(seed);

  // Deterministic 4–6 count seeded by the date.
  const count = Math.min(4 + Math.floor(rng() * 3), eligible.length); // 4, 5, or 6
  return shuffle(eligible, rng).slice(0, count);
}

/**
 * Returns 2–3 weekly featured premium items (Rare+).
 * Same ISO week → same items.
 */
export function getWeeklyFeatured(
  date: Date,
  options: RotationOptions = {},
): ShopItem[] {
  const catalogue = options.catalogue ?? STARTER_SHOP_ITEMS;
  const premiumRarities: ReadonlyArray<CardRarity> = [
    CardRarity.Rare,
    CardRarity.Epic,
    CardRarity.Legendary,
  ];
  const eligible = catalogue.filter(
    (i) => !i.isLimitedEdition && premiumRarities.includes(i.rarity),
  );
  if (eligible.length === 0) return [];

  const seed = hashString("weekly:" + weekKey(date));
  const rng = mulberry32(seed);

  const count = Math.min(2 + Math.floor(rng() * 2), eligible.length); // 2 or 3
  return shuffle(eligible, rng).slice(0, count);
}

/**
 * Returns true iff `item` is a limited edition AND `now` is strictly before
 * `item.availableUntil`. Non-limited items always return true.
 */
export function isLimitedAvailable(item: ShopItem, now: Date): boolean {
  if (!item.isLimitedEdition) return true;
  if (!item.availableUntil) {
    // Misconfigured: a limited item without an expiry. Treat as unavailable so
    // we don't let the shop sell it indefinitely.
    return false;
  }
  const expires = Date.parse(item.availableUntil);
  if (Number.isNaN(expires)) return false;
  return now.getTime() < expires;
}

/**
 * Convenience: every currently-live limited edition.
 * Use in the storefront's "Last chance" strip.
 */
export function getActiveLimitedEditions(
  now: Date,
  options: RotationOptions = {},
): ShopItem[] {
  const catalogue = options.catalogue ?? STARTER_SHOP_ITEMS;
  return catalogue.filter(
    (i) => i.isLimitedEdition && isLimitedAvailable(i, now),
  );
}

/** Exposed for tests and for callers that want to verify determinism. */
export const __internals = { mulberry32, hashString, dayKey, weekKey, shuffle };
