/**
 * lib/game/alientech.ts
 *
 * Alien Tech items — high-risk, high-reward consumables that can backfire.
 * Mirrors the master plan (COMPLETE_PLAN_v1.2, lines 541–550).
 *
 * Rules (per Phase 3 spec):
 *   - 20% backfire chance on every use (BACKFIRE_CHANCE).
 *   - Inventory capacity: 2 slots total (1 installed, 1 stored). See CAPACITY.
 *   - Installing an item takes 10 seconds (INSTALL_TIME_MS).
 */

export enum AlienTechType {
  VoidCannon = "VoidCannon",
  TimeWarp = "TimeWarp",
  ShieldOvercharge = "ShieldOvercharge",
  GravityWell = "GravityWell",
  PhaseShift = "PhaseShift",
  NanoSwarm = "NanoSwarm",
  EMPNova = "EMPNova",
  CloakingField = "CloakingField",
  BerserkerCore = "BerserkerCore",
  RepairPulse = "RepairPulse",
}

export interface AlienTechDef {
  type: AlienTechType;
  primaryEffect: string;
  backfireEffect: string;
  /** Chance [0..1] that using the item triggers `backfireEffect` instead of `primaryEffect`. */
  backfireChance: number;
}

export const BACKFIRE_CHANCE = 0.2;

/** Inventory capacity: 1 installed + 1 stored = 2 total. */
export const CAPACITY = {
  installed: 1,
  stored: 1,
  total: 2,
} as const;

/** Time required to install an alien tech item, in milliseconds. */
export const INSTALL_TIME_MS = 10_000;

export const ALIEN_TECH: Readonly<Record<AlienTechType, AlienTechDef>> = {
  [AlienTechType.VoidCannon]: {
    type: AlienTechType.VoidCannon,
    primaryEffect: "Massive damage burst to target.",
    backfireEffect: "Damages yourself.",
    backfireChance: BACKFIRE_CHANCE,
  },
  [AlienTechType.TimeWarp]: {
    type: AlienTechType.TimeWarp,
    primaryEffect: "Freeze opponent for 3 seconds.",
    backfireEffect: "You freeze for 3 seconds.",
    backfireChance: BACKFIRE_CHANCE,
  },
  [AlienTechType.ShieldOvercharge]: {
    type: AlienTechType.ShieldOvercharge,
    primaryEffect: "Full shield + 200% overcharge for 10 seconds.",
    backfireEffect: "Shield drops to 0.",
    backfireChance: BACKFIRE_CHANCE,
  },
  [AlienTechType.GravityWell]: {
    type: AlienTechType.GravityWell,
    primaryEffect: "Pull opponent toward you.",
    backfireEffect: "You are pulled toward the opponent.",
    backfireChance: BACKFIRE_CHANCE,
  },
  [AlienTechType.PhaseShift]: {
    type: AlienTechType.PhaseShift,
    primaryEffect: "Teleport 500m in any direction.",
    backfireEffect: "Random teleport — may materialize inside an asteroid.",
    backfireChance: BACKFIRE_CHANCE,
  },
  [AlienTechType.NanoSwarm]: {
    type: AlienTechType.NanoSwarm,
    primaryEffect: "Drain opponent's shield over time.",
    backfireEffect: "Drains your own shield instead.",
    backfireChance: BACKFIRE_CHANCE,
  },
  [AlienTechType.EMPNova]: {
    type: AlienTechType.EMPNova,
    primaryEffect: "Disable all ships in radius.",
    backfireEffect: "Only disables you.",
    backfireChance: BACKFIRE_CHANCE,
  },
  [AlienTechType.CloakingField]: {
    type: AlienTechType.CloakingField,
    primaryEffect: "Total invisibility for 10 seconds.",
    backfireEffect: "Become extra-visible as a beacon for 10 seconds.",
    backfireChance: BACKFIRE_CHANCE,
  },
  [AlienTechType.BerserkerCore]: {
    type: AlienTechType.BerserkerCore,
    primaryEffect: "Double damage and speed for 5 seconds.",
    backfireEffect: "Double damage TAKEN for 5 seconds.",
    backfireChance: BACKFIRE_CHANCE,
  },
  [AlienTechType.RepairPulse]: {
    type: AlienTechType.RepairPulse,
    primaryEffect: "Full heal shield and hull.",
    backfireEffect: "Heals everyone in radius, including enemies.",
    backfireChance: BACKFIRE_CHANCE,
  },
};

/** All alien tech types in declaration order — useful for iteration and UI. */
export const ALIEN_TECH_TYPES: readonly AlienTechType[] = Object.values(AlienTechType) as AlienTechType[];

/**
 * Rolls for backfire with the global BACKFIRE_CHANCE (0.2).
 * Accepts an optional RNG so tests can be deterministic.
 */
export function rollBackfire(rng: () => number = Math.random): boolean {
  return rng() < BACKFIRE_CHANCE;
}

/**
 * Inventory slot state for a single alien tech item.
 * `status` transitions: stored → installing → installed.
 * `installingUntil` is set while status === "installing".
 */
export interface AlienTechSlot {
  type: AlienTechType;
  status: "stored" | "installing" | "installed";
  /** Unix ms timestamp when installation completes. Only set for status === "installing". */
  installingUntil?: number;
}

export interface AlienTechInventory {
  slots: AlienTechSlot[];
}

export function createInventory(): AlienTechInventory {
  return { slots: [] };
}

/** Returns true iff the inventory has room for another item. */
export function canPickup(inv: AlienTechInventory): boolean {
  return inv.slots.length < CAPACITY.total;
}

/**
 * Adds an item in "stored" status. Throws if inventory is full.
 * Callers should check `canPickup` first.
 */
export function pickup(
  inv: AlienTechInventory,
  type: AlienTechType,
): AlienTechInventory {
  if (!canPickup(inv)) {
    throw new Error(
      `Alien tech inventory full (${CAPACITY.total}/${CAPACITY.total})`,
    );
  }
  return { slots: [...inv.slots, { type, status: "stored" }] };
}

/**
 * Begins installing a stored item. Sets status → "installing"
 * and records the completion timestamp.
 *
 * @param now    Current time in ms (Date.now()). Injectable for tests.
 */
export function beginInstall(
  inv: AlienTechInventory,
  slotIndex: number,
  now: number,
): AlienTechInventory {
  const slot = inv.slots[slotIndex];
  if (!slot) throw new Error(`No alien tech slot at index ${slotIndex}`);
  if (slot.status !== "stored") {
    throw new Error(`Slot already ${slot.status}`);
  }
  // Only 1 installed slot allowed — enforce no second concurrent install.
  if (inv.slots.some((s) => s.status === "installed" || s.status === "installing")) {
    throw new Error("Another alien tech is already installed or installing");
  }
  const updated = [...inv.slots];
  updated[slotIndex] = {
    ...slot,
    status: "installing",
    installingUntil: now + INSTALL_TIME_MS,
  };
  return { slots: updated };
}

/**
 * If the installing slot's timer has elapsed, promotes it to "installed".
 * Idempotent: returns the same inventory if nothing's ready.
 */
export function tickInstall(
  inv: AlienTechInventory,
  now: number,
): AlienTechInventory {
  let changed = false;
  const slots = inv.slots.map((s) => {
    if (s.status === "installing" && s.installingUntil !== undefined && now >= s.installingUntil) {
      changed = true;
      const { installingUntil: _ignored, ...rest } = s;
      return { ...rest, status: "installed" as const };
    }
    return s;
  });
  return changed ? { slots } : inv;
}
