import { describe, it, expect } from "vitest";
import {
  ShipClass,
  SHIP_STATS,
  SHIP_CLASSES,
  totalHP,
  createShip,
  canUseAbility,
  useAbility,
  tickAbility,
} from "../ships";

describe("SHIP_STATS — master plan values", () => {
  it("Fighter: 30/70/energy 4/hand 6", () => {
    const s = SHIP_STATS[ShipClass.Fighter];
    expect(s.shield).toBe(30);
    expect(s.hull).toBe(70);
    expect(s.energyPerTurn).toBe(4);
    expect(s.handSize).toBe(6);
  });

  it("Cruiser: 50/100/energy 4/hand 5", () => {
    const s = SHIP_STATS[ShipClass.Cruiser];
    expect(s.shield).toBe(50);
    expect(s.hull).toBe(100);
    expect(s.energyPerTurn).toBe(4);
    expect(s.handSize).toBe(5);
  });

  it("Stealth: 20/60/energy 5/hand 7", () => {
    const s = SHIP_STATS[ShipClass.Stealth];
    expect(s.shield).toBe(20);
    expect(s.hull).toBe(60);
    expect(s.energyPerTurn).toBe(5);
    expect(s.handSize).toBe(7);
  });

  it("Tank: 80/170/energy 3/hand 4", () => {
    const s = SHIP_STATS[ShipClass.Tank];
    expect(s.shield).toBe(80);
    expect(s.hull).toBe(170);
    expect(s.energyPerTurn).toBe(3);
    expect(s.handSize).toBe(4);
  });

  it("Racer: 15/50/energy 5/hand 6", () => {
    const s = SHIP_STATS[ShipClass.Racer];
    expect(s.shield).toBe(15);
    expect(s.hull).toBe(50);
    expect(s.energyPerTurn).toBe(5);
    expect(s.handSize).toBe(6);
  });

  it("has all five ship classes", () => {
    expect(SHIP_CLASSES).toHaveLength(5);
  });

  it("every class has an ability with a positive cooldown", () => {
    for (const c of SHIP_CLASSES) {
      const a = SHIP_STATS[c].ability;
      expect(a.name.length).toBeGreaterThan(0);
      expect(a.cooldownSec).toBeGreaterThan(0);
    }
  });
});

describe("totalHP", () => {
  it("sums shield + hull per class", () => {
    expect(totalHP(ShipClass.Fighter)).toBe(100);
    expect(totalHP(ShipClass.Cruiser)).toBe(150);
    expect(totalHP(ShipClass.Stealth)).toBe(80);
    expect(totalHP(ShipClass.Tank)).toBe(250);
    expect(totalHP(ShipClass.Racer)).toBe(65);
  });
});

describe("ship state lifecycle", () => {
  it("createShip initializes at full shield + hull, no cooldown", () => {
    const s = createShip(ShipClass.Fighter);
    expect(s.currentShield).toBe(30);
    expect(s.currentHull).toBe(70);
    expect(s.abilityCooldownUntil).toBe(0);
    expect(s.abilityActive).toBe(false);
  });

  it("canUseAbility true at t=0 for a fresh ship, false while active", () => {
    const s = createShip(ShipClass.Fighter);
    expect(canUseAbility(s, 0)).toBe(true);
    const activated = useAbility(s, 0);
    expect(canUseAbility(activated, 0)).toBe(false);
  });

  it("useAbility sets active=true and cooldown = now + cooldownSec*1000", () => {
    const s = createShip(ShipClass.Racer); // cooldown 12s
    const t = 5_000;
    const next = useAbility(s, t);
    expect(next.abilityActive).toBe(true);
    expect(next.abilityCooldownUntil).toBe(t + 12_000);
  });

  it("useAbility throws if not ready", () => {
    const s = createShip(ShipClass.Fighter);
    const activated = useAbility(s, 0);
    expect(() => useAbility(activated, 1)).toThrow();
  });

  it("tickAbility deactivates after the duration elapses", () => {
    const s = createShip(ShipClass.Fighter); // duration 3s
    const activatedAt = 1_000;
    const active = useAbility(s, activatedAt);
    expect(tickAbility(active, activatedAt, activatedAt + 2_999).abilityActive).toBe(true);
    expect(tickAbility(active, activatedAt, activatedAt + 3_000).abilityActive).toBe(false);
  });

  it("canUseAbility becomes true again after the cooldown elapses", () => {
    const s = createShip(ShipClass.Fighter); // cooldown 15s
    const activated = useAbility(s, 0);
    // Simulate ability ending after its 3s duration
    const ended = tickAbility(activated, 0, 3_000);
    expect(ended.abilityActive).toBe(false);
    // Still on cooldown until 15_000
    expect(canUseAbility(ended, 14_999)).toBe(false);
    expect(canUseAbility(ended, 15_000)).toBe(true);
  });
});
