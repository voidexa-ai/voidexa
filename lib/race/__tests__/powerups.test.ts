import { describe, it, expect } from "vitest";
import {
  POWER_UPS,
  POWER_UP_LIST,
  PowerUpCategory,
  PowerUpId,
  spawnPowerUp,
  getPowerUpsByCategory,
} from "../powerups";

describe("POWER_UPS catalogue", () => {
  it("has all 9 power-ups from the master plan", () => {
    expect(POWER_UP_LIST).toHaveLength(9);
    const expected: PowerUpId[] = [
      PowerUpId.EMPBlast, PowerUpId.AsteroidDrop, PowerUpId.TractorBeam,
      PowerUpId.ShieldBubble, PowerUpId.StealthCloak,
      PowerUpId.NitroBoost, PowerUpId.WarpSkip,
      PowerUpId.Scrambler, PowerUpId.NebulaCloud,
    ];
    for (const id of expected) expect(POWER_UPS[id]).toBeDefined();
  });

  it("category distribution: 3 Offensive, 2 Defensive, 2 Speed, 2 Sabotage", () => {
    expect(getPowerUpsByCategory(PowerUpCategory.Offensive)).toHaveLength(3);
    expect(getPowerUpsByCategory(PowerUpCategory.Defensive)).toHaveLength(2);
    expect(getPowerUpsByCategory(PowerUpCategory.Speed)).toHaveLength(2);
    expect(getPowerUpsByCategory(PowerUpCategory.Sabotage)).toHaveLength(2);
  });

  it("durations match spec", () => {
    expect(POWER_UPS[PowerUpId.EMPBlast].duration).toBe(1_500);
    expect(POWER_UPS[PowerUpId.TractorBeam].duration).toBe(2_000);
    expect(POWER_UPS[PowerUpId.ShieldBubble].duration).toBe(5_000);
    expect(POWER_UPS[PowerUpId.StealthCloak].duration).toBe(3_000);
    expect(POWER_UPS[PowerUpId.NitroBoost].duration).toBe(2_000);
    expect(POWER_UPS[PowerUpId.Scrambler].duration).toBe(2_000);
    // AsteroidDrop and WarpSkip are instant (duration 0).
    expect(POWER_UPS[PowerUpId.AsteroidDrop].duration).toBe(0);
    expect(POWER_UPS[PowerUpId.WarpSkip].duration).toBe(0);
  });

  it("WarpSkip is flagged rareOncePerRace", () => {
    expect(POWER_UPS[PowerUpId.WarpSkip].rareOncePerRace).toBe(true);
    // No others.
    for (const p of POWER_UP_LIST) {
      if (p.id !== PowerUpId.WarpSkip) expect(p.rareOncePerRace).toBe(false);
    }
  });
});

describe("spawnPowerUp", () => {
  it("is deterministic with a seeded rng", () => {
    const rng = () => 0; // always picks the first weighted entry
    const a = spawnPowerUp(undefined, true, { rng });
    const b = spawnPowerUp(undefined, true, { rng });
    expect(a).not.toBeNull();
    expect(b?.id).toBe(a?.id);
  });

  it("excludes Warp Skip once it has already spawned", () => {
    const alreadySpawned = new Set<PowerUpId>([PowerUpId.WarpSkip]);
    // Hit every entry — whichever one the RNG picks should not be WarpSkip.
    for (let i = 0; i < 200; i++) {
      const rng = () => i / 200;
      const r = spawnPowerUp(undefined, false, { rng, alreadySpawned });
      expect(r?.id).not.toBe(PowerUpId.WarpSkip);
    }
  });

  it("trailing players are biased toward stronger items (rubber-banding)", () => {
    // Run a many-sample simulation with Math.random and check the distribution
    // of categories differs noticeably between leading and trailing.
    const N = 8_000;
    function simulate(isLeading: boolean) {
      const counts: Record<PowerUpCategory, number> = {
        [PowerUpCategory.Offensive]: 0,
        [PowerUpCategory.Defensive]: 0,
        [PowerUpCategory.Speed]: 0,
        [PowerUpCategory.Sabotage]: 0,
      };
      for (let i = 0; i < N; i++) {
        const r = spawnPowerUp(undefined, isLeading);
        if (r) counts[r.category] += 1;
      }
      return counts;
    }
    const leading = simulate(true);
    const trailing = simulate(false);

    // Trailing players should see proportionally fewer Defensive items.
    const leadingDef = leading[PowerUpCategory.Defensive] / N;
    const trailingDef = trailing[PowerUpCategory.Defensive] / N;
    expect(trailingDef).toBeLessThan(leadingDef);

    // And proportionally more Offensive + Sabotage combined.
    const leadingAgg =
      (leading[PowerUpCategory.Offensive] + leading[PowerUpCategory.Sabotage]) / N;
    const trailingAgg =
      (trailing[PowerUpCategory.Offensive] + trailing[PowerUpCategory.Sabotage]) / N;
    expect(trailingAgg).toBeGreaterThan(leadingAgg);
  });

  it("returns a non-null def when the pool has any eligible entries", () => {
    const r = spawnPowerUp({ x: 0, y: 0, z: 0 }, true, { rng: () => 0.5 });
    expect(r).not.toBeNull();
  });
});
