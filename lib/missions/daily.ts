/**
 * lib/missions/daily.ts
 *
 * Daily Challenge selection + leaderboard.
 * Master plan Part 10: "Daily challenge winner: rare shop item", "Daily: resets midnight".
 *
 * The challenge is deterministic per UTC day so every player in every region
 * sees the same mission today. The template from `catalogue.ts` is overlaid
 * with the selected Timed mission's type + objectives so the UI just reads
 * one Mission record.
 */

import { TIMED_MISSIONS, DAILY_CHALLENGE_TEMPLATE } from "./catalogue";
import type { Mission } from "./types";

// ── seeded random ──────────────────────────────────────────────────────────

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

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

/** UTC day key — resets at midnight UTC. */
function dayKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ── daily challenge ───────────────────────────────────────────────────────

/**
 * Returns the daily challenge for `date`. Picks one Timed mission from the
 * pool using a date-seeded PRNG and overlays it on the daily template.
 * The returned mission has its own id (`daily-<date>`), so leaderboards and
 * progress stay scoped per-day even though the underlying objectives rotate.
 */
export function getDailyChallenge(date: Date): Mission {
  const key = dayKey(date);
  const rng = mulberry32(hashString("daily-mission:" + key));
  const pick = TIMED_MISSIONS[Math.floor(rng() * TIMED_MISSIONS.length)];
  return {
    ...DAILY_CHALLENGE_TEMPLATE,
    id: `daily-${key}`,
    type: pick.type,
    // Prefix the source mission's name so players can see what rolled today.
    name: `Daily Challenge — ${pick.name}`,
    description: `${DAILY_CHALLENGE_TEMPLATE.description}\n\nToday's route: ${pick.description}`,
    objectives: pick.objectives.map((o) => ({ ...o })),
    timeLimit: pick.timeLimit,
  };
}

// ── leaderboard ───────────────────────────────────────────────────────────

export interface DailyLeaderboardEntry {
  playerId: string;
  /** Total completion time in ms (lower is better). */
  timeMs: number;
  /** Unix ms when the run was submitted. */
  submittedAt: number;
}

/** Top-100 per spec — "Daily random: top 100, resets daily". */
export const DAILY_LEADERBOARD_CAP = 100;

/**
 * Returns the leaderboard for a given UTC day, filtered to entries submitted
 * within that same UTC day. Callers pass the storage-layer rows; this module
 * doesn't talk to a DB.
 *
 * Sorts ascending by time and caps at 100.
 */
export function getDailyLeaderboard(
  date: Date,
  allEntries: ReadonlyArray<DailyLeaderboardEntry>,
): DailyLeaderboardEntry[] {
  const startOfDay = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  const startOfNextDay = startOfDay + 86_400_000;

  // Keep best-per-player, then filter to the UTC day window, then sort/cap.
  const bestByPlayer = new Map<string, DailyLeaderboardEntry>();
  for (const e of allEntries) {
    if (e.submittedAt < startOfDay || e.submittedAt >= startOfNextDay) continue;
    const prev = bestByPlayer.get(e.playerId);
    if (!prev || e.timeMs < prev.timeMs) bestByPlayer.set(e.playerId, e);
  }
  return Array.from(bestByPlayer.values())
    .sort((a, b) => a.timeMs - b.timeMs)
    .slice(0, DAILY_LEADERBOARD_CAP);
}

/**
 * Returns the ms until the next UTC midnight, given `now`. Useful for UI
 * countdown timers. Never negative.
 */
export function msUntilNextDaily(now: Date): number {
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
  return Math.max(0, next - now.getTime());
}
