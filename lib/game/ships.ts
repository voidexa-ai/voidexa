/**
 * lib/game/ships.ts
 *
 * Ship classes for Free Flight and duels.
 * Stats and abilities mirror master plan (COMPLETE_PLAN_v1.2):
 *   - Stats table lines 176–182 (shield / hull / energy/turn / hand size)
 *   - Ability descriptions lines 169–173 (with cooldowns)
 *   - Speed labels lines 631–635 (Fast / Medium / Slow / Fastest → numeric here)
 */

export enum ShipClass {
  Fighter = "Fighter",
  Cruiser = "Cruiser",
  Stealth = "Stealth",
  Tank = "Tank",
  Racer = "Racer",
}

export interface ShipAbility {
  /** Display name, e.g. "Double Fire". */
  name: string;
  /** What the ability does. */
  description: string;
  /** Active duration in seconds. 0 for instant abilities. */
  durationSec: number;
  /** Cooldown in seconds between uses. */
  cooldownSec: number;
}

export interface ShipStats {
  class: ShipClass;
  /** Shield pool (regenerates, typically). */
  shield: number;
  /** Hull pool (does not regen — actual destruction on 0). */
  hull: number;
  /** Movement speed in world units / second. */
  speed: number;
  /** Energy points granted per turn in card combat. */
  energyPerTurn: number;
  /** Cards held in hand in card combat. */
  handSize: number;
  /** Class signature ability. */
  ability: ShipAbility;
}

export const SHIP_STATS: Readonly<Record<ShipClass, ShipStats>> = {
  [ShipClass.Fighter]: {
    class: ShipClass.Fighter,
    shield: 30,
    hull: 70,
    speed: 90,
    energyPerTurn: 4,
    handSize: 6,
    ability: {
      name: "Double Fire",
      description: "Double fire rate for 3 seconds.",
      durationSec: 3,
      cooldownSec: 15,
    },
  },
  [ShipClass.Cruiser]: {
    class: ShipClass.Cruiser,
    shield: 50,
    hull: 100,
    speed: 60,
    energyPerTurn: 4,
    handSize: 5,
    ability: {
      name: "Repair Drone",
      description: "Heal 20 shield over 5 seconds.",
      durationSec: 5,
      cooldownSec: 30,
    },
  },
  [ShipClass.Stealth]: {
    class: ShipClass.Stealth,
    shield: 20,
    hull: 60,
    speed: 75,
    energyPerTurn: 5,
    handSize: 7,
    ability: {
      name: "Cloak",
      description: "Invisible for 4 seconds; broken by attacking.",
      durationSec: 4,
      cooldownSec: 20,
    },
  },
  [ShipClass.Tank]: {
    class: ShipClass.Tank,
    shield: 80,
    hull: 170,
    speed: 35,
    energyPerTurn: 3,
    handSize: 4,
    ability: {
      name: "Fortress Mode",
      description: "50% damage reduction for 5 seconds; immobile while active.",
      durationSec: 5,
      cooldownSec: 25,
    },
  },
  [ShipClass.Racer]: {
    class: ShipClass.Racer,
    shield: 15,
    hull: 50,
    speed: 120,
    energyPerTurn: 5,
    handSize: 6,
    ability: {
      name: "Afterburner",
      description: "Speed boost for 3 seconds.",
      durationSec: 3,
      cooldownSec: 12,
    },
  },
};

export const SHIP_CLASSES: readonly ShipClass[] = Object.values(ShipClass) as ShipClass[];

/** Total HP = shield + hull. Convenience for HUD & matchmaking. */
export function totalHP(cls: ShipClass): number {
  const s = SHIP_STATS[cls];
  return s.shield + s.hull;
}

/**
 * Minimal runtime ship state — what an in-game instance tracks.
 * Keep this small; view-specific state belongs in component hooks.
 */
export interface ShipState {
  class: ShipClass;
  currentShield: number;
  currentHull: number;
  /** Unix ms timestamp when the ability's cooldown ends. 0 = ready. */
  abilityCooldownUntil: number;
  /** True while the ability is actively in effect. */
  abilityActive: boolean;
}

export function createShip(cls: ShipClass): ShipState {
  const s = SHIP_STATS[cls];
  return {
    class: cls,
    currentShield: s.shield,
    currentHull: s.hull,
    abilityCooldownUntil: 0,
    abilityActive: false,
  };
}

/**
 * Returns true iff the ability is off cooldown and not already active.
 * `now` is Unix ms; injectable for tests.
 */
export function canUseAbility(ship: ShipState, now: number): boolean {
  return !ship.abilityActive && now >= ship.abilityCooldownUntil;
}

/**
 * Activates the class ability. Returns a new state (immutable update).
 * Throws if not usable — callers should guard with `canUseAbility` first.
 */
export function useAbility(ship: ShipState, now: number): ShipState {
  if (!canUseAbility(ship, now)) {
    throw new Error(`Ability not ready for ${ship.class}`);
  }
  const def = SHIP_STATS[ship.class].ability;
  return {
    ...ship,
    abilityActive: true,
    abilityCooldownUntil: now + def.cooldownSec * 1000,
  };
}

/**
 * Deactivates the ability once its duration has elapsed.
 * Called from a game tick. Idempotent.
 *
 * @param activatedAt Timestamp when `useAbility` fired.
 */
export function tickAbility(
  ship: ShipState,
  activatedAt: number,
  now: number,
): ShipState {
  if (!ship.abilityActive) return ship;
  const def = SHIP_STATS[ship.class].ability;
  if (now >= activatedAt + def.durationSec * 1000) {
    return { ...ship, abilityActive: false };
  }
  return ship;
}
