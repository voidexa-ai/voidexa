/**
 * lib/missions/progress.ts
 *
 * Per-player mission run-state. All mutators are IMMUTABLE — they return new
 * `MissionProgress` objects.
 *
 * A single row tracks one attempt at one mission. Callers (API routes, game
 * server) decide whether to allow multiple rows per (player, mission) — that
 * lets repeatable missions accumulate historical runs while enforcing
 * "one-time" semantics on story missions via `isRepeatable`.
 */

import {
  MISSIONS_BY_ID,
} from "./catalogue";
import type { Mission } from "./types";

export enum MissionStatus {
  NotStarted = "NotStarted",
  Active = "Active",
  Completed = "Completed",
  Failed = "Failed",
}

export interface MissionProgress {
  missionId: string;
  playerId: string;
  status: MissionStatus;
  /** Objective ids already completed. */
  objectivesCompleted: string[];
  /** Unix ms. Undefined while status === NotStarted. */
  startedAt?: number;
  /** Unix ms. Undefined until Completed or Failed. */
  completedAt?: number;
  /**
   * Cumulative ms the player spent Active on this attempt (kept for
   * timed-mission leaderboards). Set on transition to Completed/Failed.
   */
  timeElapsed?: number;
}

export interface MissionRewards {
  /** XP granted. Scaled by `repeatMultiplier` for repeat runs. */
  xp: number;
  credits: number;
  /** Item id if any; absent for missions without an item reward. */
  itemId?: string;
  /** Reward multiplier actually applied. 1.0 for first completion. */
  repeatMultiplier: number;
}

/** Multiplier applied to XP/credits on repeat completions of repeatable missions. */
export const REPEAT_REWARD_MULTIPLIER = 0.5;

// ── lifecycle ──────────────────────────────────────────────────────────────

/** Initial state for a freshly-surfaced mission card. Not yet started. */
export function createProgress(
  missionId: string,
  playerId: string,
): MissionProgress {
  requireMission(missionId);
  return {
    missionId,
    playerId,
    status: MissionStatus.NotStarted,
    objectivesCompleted: [],
  };
}

/**
 * Transitions NotStarted → Active. Sets `startedAt`. Throws if already started.
 */
export function startMission(
  progress: MissionProgress,
  now: number = Date.now(),
): MissionProgress {
  if (progress.status !== MissionStatus.NotStarted) {
    throw new Error(
      `Cannot start mission ${progress.missionId}: status is ${progress.status}`,
    );
  }
  return { ...progress, status: MissionStatus.Active, startedAt: now };
}

/**
 * Marks a single objective complete. No-op if already completed. Returns the
 * same progress reference in the no-op case so callers can detect it.
 *
 * Does NOT auto-transition to Completed — call `completeMission` explicitly
 * so the caller controls success validation (timer, coop checks, etc.).
 */
export function completeObjective(
  progress: MissionProgress,
  objectiveId: string,
): MissionProgress {
  if (progress.status !== MissionStatus.Active) {
    throw new Error(
      `Cannot complete objective — mission is ${progress.status}`,
    );
  }
  const mission = requireMission(progress.missionId);
  if (!mission.objectives.some((o) => o.id === objectiveId)) {
    throw new Error(
      `Unknown objective "${objectiveId}" on mission ${mission.id}`,
    );
  }
  if (progress.objectivesCompleted.includes(objectiveId)) return progress;
  return {
    ...progress,
    objectivesCompleted: [...progress.objectivesCompleted, objectiveId],
  };
}

/** Active → Failed. Records elapsed time. */
export function failMission(
  progress: MissionProgress,
  now: number = Date.now(),
): MissionProgress {
  if (progress.status !== MissionStatus.Active) {
    throw new Error(
      `Cannot fail mission — status is ${progress.status}`,
    );
  }
  return {
    ...progress,
    status: MissionStatus.Failed,
    completedAt: now,
    timeElapsed: (progress.startedAt ?? now) <= now ? now - (progress.startedAt ?? now) : 0,
  };
}

/**
 * Active → Completed. Validates that every objective is marked done.
 * Throws otherwise — the caller should finish objectives first.
 */
export function completeMission(
  progress: MissionProgress,
  now: number = Date.now(),
): MissionProgress {
  if (progress.status !== MissionStatus.Active) {
    throw new Error(
      `Cannot complete mission — status is ${progress.status}`,
    );
  }
  const mission = requireMission(progress.missionId);
  const missing = mission.objectives.filter(
    (o) => !progress.objectivesCompleted.includes(o.id),
  );
  if (missing.length > 0) {
    throw new Error(
      `Cannot complete mission ${mission.id}: ${missing.length} objective(s) pending`,
    );
  }
  return {
    ...progress,
    status: MissionStatus.Completed,
    completedAt: now,
    timeElapsed: (progress.startedAt ?? now) <= now ? now - (progress.startedAt ?? now) : 0,
  };
}

// ── rewards ────────────────────────────────────────────────────────────────

/**
 * Returns the reward payout for this completion.
 * `priorCompletions` is the number of times this player has completed this
 * mission before this run (0 for first completion).
 *
 * Non-repeatable missions always yield full rewards on their single
 * completion; `priorCompletions` is ignored for them.
 */
export function getMissionRewards(
  progress: MissionProgress,
  priorCompletions: number = 0,
): MissionRewards {
  if (progress.status !== MissionStatus.Completed) {
    throw new Error(
      `getMissionRewards: mission is ${progress.status}, not Completed`,
    );
  }
  const mission = requireMission(progress.missionId);
  const multiplier =
    mission.isRepeatable && priorCompletions > 0 ? REPEAT_REWARD_MULTIPLIER : 1.0;
  return {
    xp: Math.round(mission.rewardXP * multiplier),
    credits: Math.round(mission.rewardCredits * multiplier),
    itemId: mission.rewardItem,
    repeatMultiplier: multiplier,
  };
}

// ── internals ──────────────────────────────────────────────────────────────

function requireMission(missionId: string): Mission {
  const m = MISSIONS_BY_ID[missionId];
  if (!m) throw new Error(`Unknown mission: ${missionId}`);
  return m;
}
