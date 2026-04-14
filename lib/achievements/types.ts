/**
 * lib/achievements/types.ts
 *
 * Core types for the voidexa achievement + title system.
 * Master plan Part 6 (Achievement System):
 *   - 3 categories: Product / Exploration / PvP
 *   - Tiers: Bronze / Silver / Gold (applies to 1/10/50 progression chains)
 *   - Every achievement yields a title fragment (Game-of-Thrones-style)
 *   - Primary rewards: Ship / Badge / Title / ChatColor / ProfileBorder
 *
 * Data-only module — no React, no runtime side effects.
 */

export enum AchievementCategory {
  Product = "Product",
  Exploration = "Exploration",
  PvP = "PvP",
}

/**
 * Tier for progression chains. Non-chain achievements pick a tier based on
 * their prestige (e.g. Legend = Gold, Warrior = Bronze).
 */
export enum AchievementTier {
  Bronze = "Bronze",
  Silver = "Silver",
  Gold = "Gold",
}

export enum AchievementRewardType {
  Ship = "Ship",
  Badge = "Badge",
  Title = "Title",
  ChatColor = "ChatColor",
  ProfileBorder = "ProfileBorder",
}

/**
 * A single achievement entry. Immutable / serializable — safe to ship to the
 * client and to persist in Supabase.
 */
export interface Achievement {
  /** Stable slug. Lower-kebab-case by convention. */
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  /** Game-of-Thrones-style title piece — combined into full titles by composeTitle(). */
  titleFragment: string;
  rewardType: AchievementRewardType;
  /** Opaque reward identifier — ship slug, badge slug, chat-color class, etc. */
  rewardId: string;
  /** One-line human description of the trigger condition. */
  requirement: string;
  /**
   * Count required to complete the achievement. Tiered progression uses
   * 1 / 10 / 50 for Bronze / Silver / Gold. One-shot achievements use 1.
   */
  requiredCount: number;
}

/**
 * Per-player progress toward a single achievement. Multiple progress rows
 * exist per player; persisted in Supabase.
 */
export interface AchievementProgress {
  achievementId: string;
  /** Running count of qualifying events. Clamps at requiredCount on complete. */
  currentCount: number;
  completed: boolean;
  /** Unix ms when `completed` flipped to true. Undefined while incomplete. */
  completedAt?: number;
}

/** Convenience: returns true iff `progress` has hit the achievement's threshold. */
export function isComplete(
  progress: AchievementProgress,
  achievement: Pick<Achievement, "requiredCount">,
): boolean {
  return progress.currentCount >= achievement.requiredCount;
}
