import { describe, it, expect } from "vitest";
import {
  AlienTechType,
  ALIEN_TECH,
  ALIEN_TECH_TYPES,
  BACKFIRE_CHANCE,
  CAPACITY,
  INSTALL_TIME_MS,
  rollBackfire,
  createInventory,
  canPickup,
  pickup,
  beginInstall,
  tickInstall,
} from "../alientech";

describe("AlienTech constants", () => {
  it("defines all 10 types", () => {
    expect(ALIEN_TECH_TYPES).toHaveLength(10);
    expect(Object.keys(ALIEN_TECH)).toHaveLength(10);
  });

  it("BACKFIRE_CHANCE is 0.2 per spec", () => {
    expect(BACKFIRE_CHANCE).toBe(0.2);
  });

  it("capacity is 1 installed + 1 stored (2 total)", () => {
    expect(CAPACITY.installed).toBe(1);
    expect(CAPACITY.stored).toBe(1);
    expect(CAPACITY.total).toBe(2);
  });

  it("install time is 10 seconds", () => {
    expect(INSTALL_TIME_MS).toBe(10_000);
  });

  it("every type has primary + backfire effects and 0.2 chance", () => {
    for (const t of ALIEN_TECH_TYPES) {
      const def = ALIEN_TECH[t];
      expect(def.primaryEffect.length).toBeGreaterThan(0);
      expect(def.backfireEffect.length).toBeGreaterThan(0);
      expect(def.backfireChance).toBe(0.2);
    }
  });
});

describe("rollBackfire", () => {
  it("returns true when RNG < 0.2", () => {
    expect(rollBackfire(() => 0.1)).toBe(true);
    expect(rollBackfire(() => 0.199999)).toBe(true);
  });

  it("returns false when RNG >= 0.2", () => {
    expect(rollBackfire(() => 0.2)).toBe(false);
    expect(rollBackfire(() => 0.5)).toBe(false);
    expect(rollBackfire(() => 0.999)).toBe(false);
  });

  it("approximates 20% across many rolls with Math.random", () => {
    let hits = 0;
    const N = 20_000;
    for (let i = 0; i < N; i++) if (rollBackfire()) hits++;
    const rate = hits / N;
    // Loose band — just prove it's in the right neighborhood.
    expect(rate).toBeGreaterThan(0.17);
    expect(rate).toBeLessThan(0.23);
  });
});

describe("inventory capacity", () => {
  it("canPickup true when empty, false when full (2 items)", () => {
    let inv = createInventory();
    expect(canPickup(inv)).toBe(true);
    inv = pickup(inv, AlienTechType.VoidCannon);
    expect(canPickup(inv)).toBe(true);
    inv = pickup(inv, AlienTechType.TimeWarp);
    expect(canPickup(inv)).toBe(false);
  });

  it("pickup throws when full", () => {
    let inv = createInventory();
    inv = pickup(inv, AlienTechType.VoidCannon);
    inv = pickup(inv, AlienTechType.TimeWarp);
    expect(() => pickup(inv, AlienTechType.EMPNova)).toThrow();
  });

  it("pickup does not mutate the original inventory", () => {
    const inv = createInventory();
    const next = pickup(inv, AlienTechType.VoidCannon);
    expect(inv.slots).toHaveLength(0);
    expect(next.slots).toHaveLength(1);
  });
});

describe("install lifecycle", () => {
  it("beginInstall sets status and completion timestamp", () => {
    let inv = pickup(createInventory(), AlienTechType.VoidCannon);
    inv = beginInstall(inv, 0, 1000);
    expect(inv.slots[0].status).toBe("installing");
    expect(inv.slots[0].installingUntil).toBe(1000 + INSTALL_TIME_MS);
  });

  it("beginInstall refuses if another item is already installed or installing", () => {
    let inv = createInventory();
    inv = pickup(inv, AlienTechType.VoidCannon);
    inv = pickup(inv, AlienTechType.TimeWarp);
    inv = beginInstall(inv, 0, 0);
    expect(() => beginInstall(inv, 1, 0)).toThrow();
  });

  it("tickInstall promotes installing → installed only after the timer elapses", () => {
    let inv = pickup(createInventory(), AlienTechType.VoidCannon);
    inv = beginInstall(inv, 0, 0);

    // Before completion: no promotion.
    inv = tickInstall(inv, INSTALL_TIME_MS - 1);
    expect(inv.slots[0].status).toBe("installing");

    // At completion: promoted.
    inv = tickInstall(inv, INSTALL_TIME_MS);
    expect(inv.slots[0].status).toBe("installed");
    // installingUntil field is dropped once installed.
    expect(inv.slots[0].installingUntil).toBeUndefined();
  });

  it("tickInstall is idempotent when nothing changes", () => {
    const inv = pickup(createInventory(), AlienTechType.VoidCannon);
    expect(tickInstall(inv, 0)).toBe(inv);
  });
});
