/**
 * lib/missions/types.ts
 *
 * Core types for PvE Missions (master plan Part 10).
 *   - Timed / Exploration / (future) Combat / Story categories
 *   - Solo by default; exploration can be co-op
 *   - Daily challenge resets midnight UTC; story is one-time per player
 */

export enum MissionType {
  // Timed
  AsteroidRun = "AsteroidRun",
  SpeedDelivery = "SpeedDelivery",
  NebulaDash = "NebulaDash",
  // Exploration
  ScanMission = "ScanMission",
  UnchartedSector = "UnchartedSector",
  BeaconPlacement = "BeaconPlacement",
}

export enum MissionDifficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
  Extreme = "Extreme",
}

/**
 * A single objective inside a mission. Keep these short and testable —
 * the UI shows them as a checklist.
 */
export interface MissionObjective {
  /** Stable slug inside the mission (unique per-mission only). */
  id: string;
  description: string;
  /** Count required (e.g. "scan 3 derelicts"). Use 1 for boolean objectives. */
  target: number;
}

export interface Mission {
  id: string;
  name: string;
  type: MissionType;
  difficulty: MissionDifficulty;
  description: string;
  objectives: MissionObjective[];
  /**
   * Hard time limit in seconds. 0 = untimed (exploration / story without clock).
   * Timed missions always set a positive value.
   */
  timeLimit: number;
  rewardXP: number;
  /** In-game credits. */
  rewardCredits: number;
  /** Optional unique drop — shop item id, card id, etc. */
  rewardItem?: string;
  isDaily: boolean;
  isStory: boolean;
  /** Can be run again for reduced rewards (repeat multiplier applied by progress.ts). */
  isRepeatable: boolean;
  /** Can be run with a second pilot. */
  coopAllowed: boolean;
  /** Story chain index (0-based). Undefined for non-story missions. */
  storyOrder?: number;
}

/** Exhaustive list of the mission types we've defined v1 for. */
export const MISSION_TYPES: readonly MissionType[] = Object.values(MissionType) as MissionType[];
export const MISSION_DIFFICULTIES: readonly MissionDifficulty[] =
  Object.values(MissionDifficulty) as MissionDifficulty[];
