/**
 * lib/race/scoring.ts
 *
 * Rank points, penalties, and leaderboard updates for PvP Races.
 * Penalty values are locked to the Part 7 spec:
 *   - Crash = +3s
 *   - Missed checkpoint = +5s
 */

import { RaceDifficulty } from "./types";

/** Crash penalty in milliseconds (master plan Part 7, race flow step 6). */
export const CRASH_PENALTY_MS = 3_000;

/** Missed-checkpoint penalty in milliseconds (step 7). */
export const MISSED_CHECKPOINT_PENALTY_MS = 5_000;

/** Convenience accessors — requested by the task spec. */
export function getCrashPenalty(): number {
  return CRASH_PENALTY_MS;
}
export function getMissedCheckpointPenalty(): number {
  return MISSED_CHECKPOINT_PENALTY_MS;
}

// ── rank points ────────────────────────────────────────────────────────────

/**
 * Points a race position yields as BASE (before difficulty multiplier).
 * Positions 1..8 reward a descending curve. Positions 9+ give zero.
 */
const BASE_POSITION_POINTS: readonly number[] = [
  0,   // index 0 — unused (positions are 1-indexed)
  30,  // 1st
  20,  // 2nd
  14,  // 3rd
  10,  // 4th
  7,   // 5th
  5,   // 6th
  3,   // 7th
  2,   // 8th
];

/** Difficulty multiplier for race rank points. */
export const DIFFICULTY_MULTIPLIER: Readonly<Record<RaceDifficulty, number>> = {
  [RaceDifficulty.Easy]:    1.0,
  [RaceDifficulty.Medium]:  1.25,
  [RaceDifficulty.Hard]:    1.5,
  [RaceDifficulty.Extreme]: 2.0,
};

/**
 * Returns integer rank points earned by finishing at `position` on a track of
 * `trackDifficulty`. Position is 1-indexed; 0 (DNF) awards 0.
 */
export function calculateRacePoints(
  position: number,
  trackDifficulty: RaceDifficulty,
): number {
  if (!Number.isInteger(position) || position < 1) return 0;
  const base =
    position < BASE_POSITION_POINTS.length ? BASE_POSITION_POINTS[position] : 0;
  if (base === 0) return 0;
  const multiplier = DIFFICULTY_MULTIPLIER[trackDifficulty] ?? 1.0;
  return Math.round(base * multiplier);
}

// ── leaderboards ──────────────────────────────────────────────────────────

/** One row of a track leaderboard. */
export interface LeaderboardEntry {
  playerId: string;
  /** Best time in ms, penalties included. */
  timeMs: number;
  /** Unix ms when the record was set. */
  setAt: number;
}

/** Fixed cap per the spec (line 392: "top 100 all-time"). */
export const LEADERBOARD_CAP = 100;

export interface LeaderboardUpdateResult {
  leaderboard: LeaderboardEntry[];
  /** True if the submitted run is now the player's best on this track. */
  newPersonalBest: boolean;
  /** True if the submitted run is the new #1 record on this track. */
  newTrackRecord: boolean;
  /** 1-indexed position the player landed at, or 0 if outside the top 100. */
  newPosition: number;
}

/**
 * Applies a new run to the leaderboard immutably. Keeps only the player's
 * personal best per track; evicts the slowest entry once the cap is hit.
 *
 * Current leaderboard is passed in so callers can swap storage (memory/DB)
 * without this module needing to know about their backend.
 */
export function updateLeaderboard(
  trackId: string,
  playerId: string,
  timeMs: number,
  currentLeaderboard: ReadonlyArray<LeaderboardEntry>,
  now: number = Date.now(),
): LeaderboardUpdateResult {
  void trackId; // caller scopes leaderboards per-track; parameter kept for logging
  if (!Number.isFinite(timeMs) || timeMs <= 0) {
    throw new Error("timeMs must be a positive finite number");
  }

  const existing = currentLeaderboard.find((e) => e.playerId === playerId);
  const isNewPB = !existing || timeMs < existing.timeMs;

  if (!isNewPB) {
    // Not an improvement — leaderboard unchanged.
    const idx = currentLeaderboard.findIndex((e) => e.playerId === playerId);
    return {
      leaderboard: [...currentLeaderboard],
      newPersonalBest: false,
      newTrackRecord: false,
      newPosition: idx >= 0 ? idx + 1 : 0,
    };
  }

  // Build the next leaderboard: drop the player's old entry (if any) and insert
  // the new one, then sort + cap.
  const next = currentLeaderboard
    .filter((e) => e.playerId !== playerId)
    .concat({ playerId, timeMs, setAt: now })
    .sort(byTime)
    .slice(0, LEADERBOARD_CAP);

  const newIdx = next.findIndex((e) => e.playerId === playerId);
  return {
    leaderboard: next,
    newPersonalBest: true,
    newTrackRecord: newIdx === 0,
    newPosition: newIdx >= 0 ? newIdx + 1 : 0,
  };
}

function byTime(a: LeaderboardEntry, b: LeaderboardEntry): number {
  return a.timeMs - b.timeMs;
}
