/**
 * lib/race/powerups.ts
 *
 * Mario-Kart-style race power-ups (master plan Part 7).
 *
 * Rules (verbatim from spec):
 *   - Hold 1 power-up at a time; use with Q key.
 *   - New orbs spawn every 15–20s at fixed positions.
 *   - Rubber-banding: player behind gets stronger items.
 *
 * 9 power-ups in 4 categories: Offensive × 3, Defensive × 2, Speed × 2, Sabotage × 2.
 */

export enum PowerUpCategory {
  Offensive = "Offensive",
  Defensive = "Defensive",
  Speed = "Speed",
  Sabotage = "Sabotage",
}

export enum PowerUpId {
  EMPBlast = "EMPBlast",
  AsteroidDrop = "AsteroidDrop",
  TractorBeam = "TractorBeam",
  ShieldBubble = "ShieldBubble",
  StealthCloak = "StealthCloak",
  NitroBoost = "NitroBoost",
  WarpSkip = "WarpSkip",
  Scrambler = "Scrambler",
  NebulaCloud = "NebulaCloud",
}

export interface PowerUpDef {
  id: PowerUpId;
  name: string;
  description: string;
  /** Active effect duration in ms. 0 for instant effects. */
  duration: number;
  category: PowerUpCategory;
  /** True for ultra-rare items that spawn at most once per race. */
  rareOncePerRace: boolean;
  /**
   * Relative weight in the base spawn table. Higher = more common.
   * Rubber-banding adjusts these at pickup time (see spawnPowerUp).
   */
  baseWeight: number;
}

export const POWER_UPS: Readonly<Record<PowerUpId, PowerUpDef>> = {
  // ── Offensive ──
  [PowerUpId.EMPBlast]: {
    id: PowerUpId.EMPBlast,
    name: "EMP Blast",
    description: "Opponent loses control 1.5s (ship spins).",
    duration: 1_500,
    category: PowerUpCategory.Offensive,
    rareOncePerRace: false,
    baseWeight: 12,
  },
  [PowerUpId.AsteroidDrop]: {
    id: PowerUpId.AsteroidDrop,
    name: "Asteroid Drop",
    description: "Drops 3 asteroid mines behind your ship.",
    duration: 0,
    category: PowerUpCategory.Offensive,
    rareOncePerRace: false,
    baseWeight: 10,
  },
  [PowerUpId.TractorBeam]: {
    id: PowerUpId.TractorBeam,
    name: "Tractor Beam",
    description: "Slows the opponent ahead of you for 2s.",
    duration: 2_000,
    category: PowerUpCategory.Offensive,
    rareOncePerRace: false,
    baseWeight: 10,
  },

  // ── Defensive ──
  [PowerUpId.ShieldBubble]: {
    id: PowerUpId.ShieldBubble,
    name: "Shield Bubble",
    description: "Blocks the next incoming hit for 5s.",
    duration: 5_000,
    category: PowerUpCategory.Defensive,
    rareOncePerRace: false,
    baseWeight: 14,
  },
  [PowerUpId.StealthCloak]: {
    id: PowerUpId.StealthCloak,
    name: "Stealth Cloak",
    description: "Invisible for 3s; cannot be targeted.",
    duration: 3_000,
    category: PowerUpCategory.Defensive,
    rareOncePerRace: false,
    baseWeight: 10,
  },

  // ── Speed ──
  [PowerUpId.NitroBoost]: {
    id: PowerUpId.NitroBoost,
    name: "Nitro Boost",
    description: "Massive speed for 2s.",
    duration: 2_000,
    category: PowerUpCategory.Speed,
    rareOncePerRace: false,
    baseWeight: 14,
  },
  [PowerUpId.WarpSkip]: {
    id: PowerUpId.WarpSkip,
    name: "Warp Skip",
    description: "Teleport 1 checkpoint ahead. Spawns at most once per race.",
    duration: 0,
    category: PowerUpCategory.Speed,
    rareOncePerRace: true,
    baseWeight: 2,
  },

  // ── Sabotage ──
  [PowerUpId.Scrambler]: {
    id: PowerUpId.Scrambler,
    name: "Scrambler",
    description: "Inverts the opponent's controls for 2s.",
    duration: 2_000,
    category: PowerUpCategory.Sabotage,
    rareOncePerRace: false,
    baseWeight: 8,
  },
  [PowerUpId.NebulaCloud]: {
    id: PowerUpId.NebulaCloud,
    name: "Nebula Cloud",
    description: "Blinds opponents behind you with a trailing cloud.",
    duration: 4_000,
    category: PowerUpCategory.Sabotage,
    rareOncePerRace: false,
    baseWeight: 8,
  },
};

/** All defs in declaration order. */
export const POWER_UP_LIST: readonly PowerUpDef[] = Object.values(POWER_UPS);

// ── spawn logic ────────────────────────────────────────────────────────────

export interface SpawnOptions {
  /**
   * Power-up ids that have already been given out this race. Rare items in
   * this set are excluded (enforces "spawns once per race" for Warp Skip).
   */
  alreadySpawned?: ReadonlySet<PowerUpId>;
  /** RNG for deterministic tests. Defaults to Math.random. */
  rng?: () => number;
  /**
   * Optional nominal position — currently unused by the algorithm, kept so
   * callers that pass it (see spec) don't need to change signatures later
   * when location-aware spawn tables ship.
   */
  playerPosition?: { x: number; y: number; z: number };
}

/**
 * Picks a power-up for a player based on whether they're leading the race.
 * "Rubber-banding" — players behind are biased toward stronger items to keep
 * races competitive (master plan line 390: "Rubber-banding: player behind
 * gets stronger power-ups").
 *
 * Implementation:
 *   - Leading player: base weights, rare items stay rare.
 *   - Trailing player: offensive/speed/sabotage items get +50% weight,
 *     defensive items get -30% (they're less impactful when behind),
 *     and rare items (Warp Skip) get a 3× bump.
 *
 * Returns null iff every remaining power-up has been filtered out.
 */
export function spawnPowerUp(
  playerPosition: { x: number; y: number; z: number } | undefined,
  isLeading: boolean,
  options: SpawnOptions = {},
): PowerUpDef | null {
  void playerPosition; // reserved — see SpawnOptions.playerPosition
  const rng = options.rng ?? Math.random;
  const alreadySpawned = options.alreadySpawned ?? new Set<PowerUpId>();

  // Build the weighted pool.
  const weights: Array<{ def: PowerUpDef; weight: number }> = [];
  for (const def of POWER_UP_LIST) {
    if (def.rareOncePerRace && alreadySpawned.has(def.id)) continue;
    let w = def.baseWeight;
    if (!isLeading) {
      // Trailing-player rubber-banding bias.
      switch (def.category) {
        case PowerUpCategory.Offensive:
        case PowerUpCategory.Sabotage:
          w = Math.round(w * 1.5);
          break;
        case PowerUpCategory.Speed:
          w = def.rareOncePerRace ? w * 3 : Math.round(w * 1.5);
          break;
        case PowerUpCategory.Defensive:
          w = Math.round(w * 0.7);
          break;
      }
    }
    if (w > 0) weights.push({ def, weight: w });
  }

  if (weights.length === 0) return null;

  const total = weights.reduce((sum, x) => sum + x.weight, 0);
  let roll = rng() * total;
  for (const { def, weight } of weights) {
    roll -= weight;
    if (roll <= 0) return def;
  }
  // Defensive — floating-point slop can leave roll just > 0 on the last item.
  return weights[weights.length - 1].def;
}

/**
 * Convenience: returns every power-up in a given category. Used by UI to
 * render the categorized help overlay.
 */
export function getPowerUpsByCategory(cat: PowerUpCategory): PowerUpDef[] {
  return POWER_UP_LIST.filter((p) => p.category === cat);
}
