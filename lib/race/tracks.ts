/**
 * lib/race/tracks.ts
 *
 * Five fixed tracks (learn-and-master, master plan Part 7) plus a
 * deterministic daily-random generator seeded by UTC date.
 *
 * Coordinates are world units; ~100 units between checkpoints keeps races
 * brisk without blowing past the Free Flight scene size.
 */

import type { Vec3 } from "../game/physics";
import { RaceDifficulty, type RaceTrack } from "./types";

// ── shared helpers ─────────────────────────────────────────────────────────

const DEFAULT_CHECKPOINT_RADIUS = 12;

/** Utility: generate a checkpoint ring along a parameterized curve. */
function curve(
  n: number,
  fn: (t: number) => Vec3,
): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    out.push(fn(t));
  }
  return out;
}

// ── fixed tracks ───────────────────────────────────────────────────────────

/**
 * Asteroid Alley — straight shot through an asteroid field. Easy — great
 * for learning the controls. 12 checkpoints, slight vertical wobble.
 */
const ASTEROID_ALLEY: RaceTrack = {
  id: "asteroid-alley",
  name: "Asteroid Alley",
  difficulty: RaceDifficulty.Easy,
  isDaily: false,
  checkpointRadius: DEFAULT_CHECKPOINT_RADIUS,
  checkpoints: curve(12, (t) => ({
    x: t * 1000,
    y: Math.sin(t * Math.PI * 2) * 25,
    z: 0,
  })),
};

/**
 * Nebula Sprint — serpentine weave through coloured nebula zones. Medium
 * difficulty, 13 checkpoints with tight lateral swings.
 */
const NEBULA_SPRINT: RaceTrack = {
  id: "nebula-sprint",
  name: "Nebula Sprint",
  difficulty: RaceDifficulty.Medium,
  isDaily: false,
  checkpointRadius: DEFAULT_CHECKPOINT_RADIUS,
  checkpoints: curve(13, (t) => ({
    x: t * 1100,
    y: Math.sin(t * Math.PI * 4) * 80,
    z: Math.cos(t * Math.PI * 3) * 40,
  })),
};

/**
 * Orbital Run — full orbit around a planet body. Medium-hard, 14 checkpoints,
 * constant banking turn.
 */
const ORBITAL_RUN: RaceTrack = {
  id: "orbital-run",
  name: "Orbital Run",
  difficulty: RaceDifficulty.Hard,
  isDaily: false,
  checkpointRadius: DEFAULT_CHECKPOINT_RADIUS,
  checkpoints: curve(14, (t) => {
    const angle = t * Math.PI * 2;
    return {
      x: Math.cos(angle) * 350,
      y: Math.sin(angle * 2) * 35,
      z: Math.sin(angle) * 350,
    };
  }),
};

/**
 * Void Corridor — long straight corridor between black holes, narrow window.
 * Hard, 11 checkpoints. Small checkpoint radius forces precision.
 */
const VOID_CORRIDOR: RaceTrack = {
  id: "void-corridor",
  name: "Void Corridor",
  difficulty: RaceDifficulty.Hard,
  isDaily: false,
  checkpointRadius: 8, // narrower than standard
  checkpoints: curve(11, (t) => ({
    x: t * 1400,
    y: 0,
    z: Math.sin(t * Math.PI * 2) * 15,
  })),
};

/**
 * Solar Slingshot — two full loops around a sun, using its gravity for
 * slingshot. Extreme difficulty, 15 checkpoints with spiral approach.
 */
const SOLAR_SLINGSHOT: RaceTrack = {
  id: "solar-slingshot",
  name: "Solar Slingshot",
  difficulty: RaceDifficulty.Extreme,
  isDaily: false,
  checkpointRadius: DEFAULT_CHECKPOINT_RADIUS,
  checkpoints: curve(15, (t) => {
    const angle = t * Math.PI * 4; // two full loops
    const radius = 250 - t * 120;
    return {
      x: Math.cos(angle) * radius,
      y: (t - 0.5) * 140,
      z: Math.sin(angle) * radius,
    };
  }),
};

/** Five fixed tracks shipped with v1. Order reflects difficulty ramp. */
export const FIXED_TRACKS: readonly RaceTrack[] = [
  ASTEROID_ALLEY,
  NEBULA_SPRINT,
  ORBITAL_RUN,
  VOID_CORRIDOR,
  SOLAR_SLINGSHOT,
];

/** id → track lookup. */
export const TRACKS_BY_ID: Readonly<Record<string, RaceTrack>> = Object.freeze(
  Object.fromEntries(FIXED_TRACKS.map((t) => [t.id, t])),
);

// ── daily random ───────────────────────────────────────────────────────────

/** FNV-1a 32-bit string hash. */
function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32 PRNG — deterministic, 1D seed. */
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

/** UTC day key — stable across timezones. */
function dayKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Generates a deterministic random track for the given UTC date.
 * Same date → same track → consistent leaderboards across regions.
 *
 * Difficulty rotates through all four values; checkpoint count picks
 * uniformly from 10..15.
 */
export function generateDailyTrack(date: Date): RaceTrack {
  const seedStr = "daily:" + dayKey(date);
  const seed = hashString(seedStr);
  const rng = mulberry32(seed);

  // Checkpoint count in [10, 15].
  const checkpointCount = 10 + Math.floor(rng() * 6);

  // Pick a difficulty deterministically from the seed (not from the RNG stream,
  // so flavor and length vary independently).
  const difficulties = Object.values(RaceDifficulty) as RaceDifficulty[];
  const difficulty = difficulties[seed % difficulties.length];

  // Build a smooth 3D spline by summing a few sine waves.
  // Frequencies chosen from the RNG so no two days share a shape.
  const freqX = 1 + Math.floor(rng() * 3);
  const freqY = 1 + Math.floor(rng() * 4);
  const freqZ = 1 + Math.floor(rng() * 3);
  const phaseY = rng() * Math.PI * 2;
  const phaseZ = rng() * Math.PI * 2;
  const length = 900 + Math.floor(rng() * 600); // 900–1500 units

  const checkpoints = curve(checkpointCount, (t) => ({
    x: t * length,
    y: Math.sin(t * Math.PI * 2 * freqY + phaseY) * 80,
    z: Math.sin(t * Math.PI * 2 * freqZ + phaseZ) * 60 + Math.cos(t * Math.PI * 2 * freqX) * 25,
  }));

  return {
    id: `daily-${dayKey(date)}`,
    name: `Daily Random — ${dayKey(date)}`,
    difficulty,
    isDaily: true,
    checkpointRadius: DEFAULT_CHECKPOINT_RADIUS,
    checkpoints,
  };
}

/** Returns every track available today (5 fixed + 1 daily). */
export function getAllTracksForDate(date: Date): RaceTrack[] {
  return [...FIXED_TRACKS, generateDailyTrack(date)];
}
