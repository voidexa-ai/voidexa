/**
 * lib/race/types.ts
 *
 * Core types for PvP Races (master plan Part 7).
 *   - 5 fixed tracks + 1 daily random
 *   - 10–15 checkpoints per track
 *   - Crash = +3s penalty; miss checkpoint = +5s penalty
 *   - Mario-Kart-style power-ups with rubber-banding
 */

import type { Vec3 } from "../game/physics";

export enum RaceDifficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
  Extreme = "Extreme",
}

export interface RaceTrack {
  id: string;
  name: string;
  /** Ordered checkpoint positions. Pilots must pass through in order. */
  checkpoints: Vec3[];
  difficulty: RaceDifficulty;
  /** True for the daily random route; false for the 5 fixed tracks. */
  isDaily: boolean;
  /** Ring radius at each checkpoint — the "window" a ship must fly through. */
  checkpointRadius: number;
}

/**
 * Per-player race state tracked at runtime. The server authoritatively owns
 * this for live races; ghost races compute it from the recording.
 */
export interface RacePlayerState {
  playerId: string;
  /** 0-indexed next checkpoint to hit. Equals `checkpoints.length` once finished. */
  currentCheckpoint: number;
  /** Current power-up held (max 1). null if empty. */
  powerUp: string | null;
  /** Accumulated time penalty in ms (crashes + missed checkpoints). */
  penaltyMs: number;
  /** True when the pilot has cleared every checkpoint. */
  finished: boolean;
  /** Finish time in ms since race start. Undefined until `finished = true`. */
  finishTimeMs?: number;
}

export interface RaceState {
  trackId: string;
  players: RacePlayerState[];
  /** Unix ms of race start (after countdown). */
  startTime: number;
  /** PowerUp ids already picked up from the track this race. Prevents double-spawn at same orb. */
  powerUpsCollected: string[];
}

/** Per-player time entry in the final result. */
export interface PlayerTime {
  playerId: string;
  /** Total ms from GO to finish-line, penalties included. Infinity for DNF. */
  totalMs: number;
  penaltyMs: number;
  /** Final standing, 1-indexed. 0 = DNF. */
  position: number;
}

export interface RaceResult {
  trackId: string;
  /** playerId of the winner. Empty string if everyone DNF'd. */
  winnerId: string;
  times: PlayerTime[];
  /** Every power-up that was actually triggered this race, by any player. */
  powerUpsUsed: Array<{ playerId: string; powerUpId: string }>;
}
