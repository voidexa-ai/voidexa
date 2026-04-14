/**
 * lib/achievements/tracker.ts
 *
 * Pure functions for checking achievement progress, resolving unlocked title
 * fragments, and composing Game-of-Thrones-style compound titles.
 *
 * No DB, no I/O — callers feed in arrays of AchievementProgress rows and
 * receive derived state. This keeps the logic trivially testable and reusable
 * on both server (Supabase Edge Functions) and client.
 */

import { ACHIEVEMENTS_BY_ID } from "./definitions";
import { ACHIEVEMENT_TITLES, resolveTitleFragment } from "./titles";
import {
  type Achievement,
  type AchievementProgress,
} from "./types";

// ── checkAchievement ───────────────────────────────────────────────────────

export interface CheckAchievementResult {
  /** The achievement's id (echoed for convenience). */
  achievementId: string;
  /** Hit the threshold this call? */
  completed: boolean;
  /** True iff completion JUST happened (count crossed threshold this call). */
  newlyCompleted: boolean;
  /** Threshold from the definition. */
  requiredCount: number;
  /** Normalised currentCount (clamped at requiredCount on completion). */
  currentCount: number;
}

/**
 * Given a player's latest `currentCount` for an achievement, compute whether
 * the achievement is complete and whether this call just flipped it.
 *
 * The caller is responsible for:
 *   - actually persisting the new progress row,
 *   - maintaining `previousCount` tracking if they need strict newly-completed semantics.
 *
 * The simple 2-argument form (achievementId + currentCount) derives
 * newlyCompleted from whether `currentCount` is EXACTLY at the threshold.
 * Pass the optional `previousCount` to get strict "crossed-the-line" behavior.
 */
export function checkAchievement(
  playerId: string, // unused server-side but required by the signature for logging
  achievementId: string,
  currentCount: number,
  previousCount?: number,
): CheckAchievementResult {
  void playerId; // reserved for future telemetry
  const def = ACHIEVEMENTS_BY_ID[achievementId];
  if (!def) {
    throw new Error(`Unknown achievement id: ${achievementId}`);
  }

  const completed = currentCount >= def.requiredCount;
  const clamped = completed ? def.requiredCount : currentCount;

  let newlyCompleted: boolean;
  if (previousCount === undefined) {
    // Without history, "newly completed" == count sits right at the threshold.
    newlyCompleted = completed && currentCount === def.requiredCount;
  } else {
    newlyCompleted = completed && previousCount < def.requiredCount;
  }

  return {
    achievementId,
    completed,
    newlyCompleted,
    requiredCount: def.requiredCount,
    currentCount: clamped,
  };
}

// ── getPlayerAchievements ──────────────────────────────────────────────────

/**
 * Returns the fully-hydrated Achievement rows a player has completed,
 * ordered by `completedAt` ascending (chronological unlock history).
 *
 * Unknown achievement ids in `progress` are skipped silently — the caller
 * may have stale data and shouldn't crash the profile page.
 */
export function getPlayerAchievements(
  progress: ReadonlyArray<AchievementProgress>,
): Achievement[] {
  return progress
    .filter((p) => p.completed)
    .sort(byCompletedAt)
    .map((p) => ACHIEVEMENTS_BY_ID[p.achievementId])
    .filter((a): a is Achievement => Boolean(a));
}

function byCompletedAt(
  a: AchievementProgress,
  b: AchievementProgress,
): number {
  const at = a.completedAt ?? Number.MAX_SAFE_INTEGER;
  const bt = b.completedAt ?? Number.MAX_SAFE_INTEGER;
  return at - bt;
}

// ── title fragments ────────────────────────────────────────────────────────

export interface UnlockedFragment {
  achievementId: string;
  /** Raw fragment (may still contain placeholders like `[planet name]`). */
  fragment: string;
}

/**
 * Returns every title fragment the player has unlocked, in the same order
 * as `getPlayerAchievements`. De-duped by achievementId.
 */
export function getAvailableTitleFragments(
  completedAchievements: ReadonlyArray<Achievement>,
): UnlockedFragment[] {
  const seen = new Set<string>();
  const out: UnlockedFragment[] = [];
  for (const a of completedAchievements) {
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    const fragment = ACHIEVEMENT_TITLES[a.id];
    if (!fragment) continue;
    out.push({ achievementId: a.id, fragment });
  }
  return out;
}

// ── compose title ─────────────────────────────────────────────────────────

export interface ComposeTitleOptions {
  /** Separator between fragments. Default ", ". */
  separator?: string;
  /** Context for placeholder substitution (e.g. planet name for "Pioneer"). */
  context?: { planetName?: string };
}

/**
 * Joins selected title fragments into the final display title.
 * Example: ["Voice of the Consensus", "Scourge of the Void"] →
 *          "Voice of the Consensus, Scourge of the Void"
 *
 * Fragments can be raw strings or `UnlockedFragment` objects — the function
 * normalises both. Placeholders like `[planet name]` are resolved via
 * `options.context`.
 */
export function composeTitle(
  selectedFragments: ReadonlyArray<string | UnlockedFragment>,
  options: ComposeTitleOptions = {},
): string {
  const separator = options.separator ?? ", ";
  return selectedFragments
    .map((f) => (typeof f === "string" ? f : f.fragment))
    .map((f) => resolveTitleFragment(f, options.context ?? {}))
    .filter((f) => f.length > 0)
    .join(separator);
}
