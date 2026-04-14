/**
 * lib/missions/story.ts
 *
 * Story chain logic. 5 missions in order; each unlocks the next.
 * Completing all 5 awards:
 *   - Title: "Chronicler of the Void"
 *   - Epic cosmetic (reward item on the final mission — see catalogue.ts)
 *
 * Story missions are one-time per player (master plan Part 10 — "one-time
 * per player; keeps it special").
 */

import { STORY_MISSIONS } from "./catalogue";
import type { Mission } from "./types";

/** The final-chain rewards, surfaced once `isStoryComplete` flips true. */
export const STORY_COMPLETE_TITLE = "Chronicler of the Void";
export const STORY_COMPLETE_COSMETIC_ID = "chronicler-epic-cosmetic";

/** Story missions in canonical order (storyOrder ascending). */
export const STORY_CHAIN: readonly Mission[] = [...STORY_MISSIONS].sort(
  (a, b) => (a.storyOrder ?? 0) - (b.storyOrder ?? 0),
);

/**
 * Returns the next story mission the player should play, or null if the
 * entire chain is complete.
 *
 * @param completedMissionIds every mission the player has marked Completed
 *                            (story and non-story alike — this fn filters).
 */
export function getNextStoryMission(
  completedMissionIds: ReadonlyArray<string>,
): Mission | null {
  const completed = new Set(completedMissionIds);
  for (const m of STORY_CHAIN) {
    if (!completed.has(m.id)) return m;
  }
  return null;
}

/** True iff every story mission is in `completedMissionIds`. */
export function isStoryComplete(
  completedMissionIds: ReadonlyArray<string>,
): boolean {
  const completed = new Set(completedMissionIds);
  return STORY_CHAIN.every((m) => completed.has(m.id));
}

export interface StoryProgress {
  /** 0..STORY_CHAIN.length. */
  completedCount: number;
  totalCount: number;
  nextMission: Mission | null;
  /** True once every story mission is complete. */
  chainComplete: boolean;
  /** The title awarded on completion (null until chainComplete). */
  title: string | null;
  /** Epic cosmetic id (null until chainComplete). */
  cosmeticId: string | null;
}

/**
 * Snapshot for the UI: how many chapters done, what's next, and whether the
 * title + cosmetic have been unlocked.
 */
export function getStoryProgress(
  completedMissionIds: ReadonlyArray<string>,
): StoryProgress {
  const completed = new Set(completedMissionIds);
  const completedCount = STORY_CHAIN.filter((m) => completed.has(m.id)).length;
  const chainComplete = completedCount === STORY_CHAIN.length;
  return {
    completedCount,
    totalCount: STORY_CHAIN.length,
    nextMission: getNextStoryMission(completedMissionIds),
    chainComplete,
    title: chainComplete ? STORY_COMPLETE_TITLE : null,
    cosmeticId: chainComplete ? STORY_COMPLETE_COSMETIC_ID : null,
  };
}

/**
 * Returns true iff `missionId` is the next story mission for the player.
 * Useful for gating "Start Mission" buttons — only the current chapter is
 * playable at any given time.
 */
export function canPlayStoryMission(
  missionId: string,
  completedMissionIds: ReadonlyArray<string>,
): boolean {
  const next = getNextStoryMission(completedMissionIds);
  return next?.id === missionId;
}
