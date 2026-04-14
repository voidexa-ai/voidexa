/**
 * lib/achievements/definitions.ts
 *
 * Authoritative list of every achievement in voidexa v1.
 * Mirrors master plan Part 6 exactly — 23 entries across 3 categories.
 * (Master plan phrases this as "~25"; the 1/10/50 tier chains account for
 * every listed bullet without adding extras.)
 *
 * Tier semantics:
 *   - Bronze/Silver/Gold map to 1/10/50 on progression chains
 *     (First Debate → Debater → Quantum Master, Warrior → Veteran → Champion).
 *   - Standalone achievements pick a tier matching their prestige.
 *
 * Title fragments are sourced from `./titles.ts` — kept separate so they can be
 * validated 1:1 against achievement ids in tests.
 */

import {
  AchievementCategory,
  AchievementRewardType,
  AchievementTier,
  type Achievement,
} from "./types";
import { ACHIEVEMENT_TITLES } from "./titles";

/** Shorthand to pull a fragment and fail loudly at import time if missing. */
function titleFor(id: string): string {
  const t = ACHIEVEMENT_TITLES[id];
  if (!t) throw new Error(`Missing title fragment for achievement "${id}"`);
  return t;
}

// ── Product (8) ────────────────────────────────────────────────────────────

const PRODUCT: Achievement[] = [
  {
    id: "first-debate",
    name: "First Debate",
    description: "Run your first Quantum debate.",
    category: AchievementCategory.Product,
    tier: AchievementTier.Bronze,
    titleFragment: titleFor("first-debate"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "first-debate-badge",
    requirement: "Complete 1 Quantum debate session.",
    requiredCount: 1,
  },
  {
    id: "debater",
    name: "Debater",
    description: "Run ten Quantum debates.",
    category: AchievementCategory.Product,
    tier: AchievementTier.Silver,
    titleFragment: titleFor("debater"),
    rewardType: AchievementRewardType.Ship,
    rewardId: "ai-class-cruiser",
    requirement: "Complete 10 Quantum debate sessions.",
    requiredCount: 10,
  },
  {
    id: "quantum-master",
    name: "Quantum Master",
    description: "Run fifty Quantum debates.",
    category: AchievementCategory.Product,
    tier: AchievementTier.Gold,
    titleFragment: titleFor("quantum-master"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "quantum-master-gold-badge",
    requirement: "Complete 50 Quantum debate sessions.",
    requiredCount: 50,
  },
  {
    id: "paper-trader",
    name: "Paper Trader",
    description: "Try the Trading Bot in paper mode.",
    category: AchievementCategory.Product,
    tier: AchievementTier.Bronze,
    titleFragment: titleFor("paper-trader"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "paper-trader-badge",
    requirement: "Run 1 paper-trading session with the Trading Bot.",
    requiredCount: 1,
  },
  {
    id: "trader",
    name: "Trader",
    description: "Earn over 10% profit with the Trading Bot.",
    category: AchievementCategory.Product,
    tier: AchievementTier.Silver,
    titleFragment: titleFor("trader"),
    rewardType: AchievementRewardType.Ship,
    rewardId: "trader-vessel",
    requirement: "Close a Trading Bot session with >= 10% profit.",
    requiredCount: 1,
  },
  {
    id: "pioneer",
    name: "Pioneer",
    description: "Claim a planet on the voidexa galaxy map.",
    category: AchievementCategory.Product,
    tier: AchievementTier.Gold,
    titleFragment: titleFor("pioneer"),
    rewardType: AchievementRewardType.Ship,
    rewardId: "pioneer-frigate",
    requirement: "Successfully claim a planet.",
    requiredCount: 1,
  },
  {
    id: "investor",
    name: "Investor",
    description: "Top up your wallet for the first time.",
    category: AchievementCategory.Product,
    tier: AchievementTier.Bronze,
    titleFragment: titleFor("investor"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "investor-badge",
    requirement: "Complete 1 wallet top-up.",
    requiredCount: 1,
  },
  {
    id: "communicator",
    name: "Communicator",
    description: "Send ten messages in Universe Chat.",
    category: AchievementCategory.Product,
    tier: AchievementTier.Bronze,
    titleFragment: titleFor("communicator"),
    rewardType: AchievementRewardType.Title,
    rewardId: "communicator-title",
    requirement: "Send 10 Universe Chat messages.",
    requiredCount: 10,
  },
];

// ── Exploration (7) ────────────────────────────────────────────────────────

const EXPLORATION: Achievement[] = [
  {
    id: "explorer",
    name: "Explorer",
    description: "Visit every planet in the voidexa galaxy.",
    category: AchievementCategory.Exploration,
    tier: AchievementTier.Silver,
    titleFragment: titleFor("explorer"),
    rewardType: AchievementRewardType.Ship,
    rewardId: "scout-ship",
    requirement: "Visit all voidexa planets.",
    requiredCount: 1,
  },
  {
    id: "archaeologist",
    name: "Archaeologist",
    description: "Find every abandoned station.",
    category: AchievementCategory.Exploration,
    tier: AchievementTier.Gold,
    titleFragment: titleFor("archaeologist"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "archaeologist-unique-badge",
    requirement: "Discover all abandoned stations.",
    requiredCount: 1,
  },
  {
    id: "voyager",
    name: "Voyager",
    description: "Fly 1000 km in total.",
    category: AchievementCategory.Exploration,
    tier: AchievementTier.Silver,
    titleFragment: titleFor("voyager"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "voyager-badge",
    requirement: "Travel a cumulative 1000 km in Free Flight.",
    requiredCount: 1000,
  },
  {
    id: "nebula-runner",
    name: "Nebula Runner",
    description: "Enter every nebula zone.",
    category: AchievementCategory.Exploration,
    tier: AchievementTier.Silver,
    titleFragment: titleFor("nebula-runner"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "nebula-runner-badge",
    requirement: "Enter every nebula zone at least once.",
    requiredCount: 1,
  },
  {
    id: "secret",
    name: "Secret",
    description: "Find the hidden easter egg.",
    category: AchievementCategory.Exploration,
    tier: AchievementTier.Gold,
    titleFragment: titleFor("secret"),
    rewardType: AchievementRewardType.Ship,
    rewardId: "mystery-ship",
    requirement: "Discover the hidden easter egg location.",
    requiredCount: 1,
  },
  {
    id: "station-hopper",
    name: "Station Hopper",
    description: "Dock at every station type.",
    category: AchievementCategory.Exploration,
    tier: AchievementTier.Silver,
    titleFragment: titleFor("station-hopper"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "station-hopper-badge",
    requirement: "Dock at every distinct station type.",
    requiredCount: 1,
  },
  {
    id: "salvager",
    name: "Salvager",
    description: "Scan ten derelict ships.",
    category: AchievementCategory.Exploration,
    tier: AchievementTier.Silver,
    titleFragment: titleFor("salvager"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "salvager-badge",
    requirement: "Scan 10 derelict ships.",
    requiredCount: 10,
  },
];

// ── PvP / Social (8) ───────────────────────────────────────────────────────

const PVP: Achievement[] = [
  {
    id: "warrior",
    name: "Warrior",
    description: "Win your first duel.",
    category: AchievementCategory.PvP,
    tier: AchievementTier.Bronze,
    titleFragment: titleFor("warrior"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "warrior-badge",
    requirement: "Win 1 duel.",
    requiredCount: 1,
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Win ten duels.",
    category: AchievementCategory.PvP,
    tier: AchievementTier.Silver,
    titleFragment: titleFor("veteran"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "veteran-badge",
    requirement: "Win 10 duels.",
    requiredCount: 10,
  },
  {
    id: "champion",
    name: "Champion",
    description: "Win fifty duels.",
    category: AchievementCategory.PvP,
    tier: AchievementTier.Gold,
    titleFragment: titleFor("champion"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "champion-badge",
    requirement: "Win 50 duels.",
    requiredCount: 50,
  },
  {
    id: "gold-ace",
    name: "Gold Ace",
    description: "Reach Gold rank.",
    category: AchievementCategory.PvP,
    tier: AchievementTier.Gold,
    titleFragment: titleFor("gold-ace"),
    rewardType: AchievementRewardType.ProfileBorder,
    rewardId: "gold-trail-border",
    requirement: "Reach Gold rank in duel ladder.",
    requiredCount: 1,
  },
  {
    id: "legend",
    name: "Legend",
    description: "Reach Legendary rank.",
    category: AchievementCategory.PvP,
    tier: AchievementTier.Gold,
    titleFragment: titleFor("legend"),
    rewardType: AchievementRewardType.ChatColor,
    rewardId: "legendary-animated-chat",
    requirement: "Reach Legendary rank in duel ladder.",
    requiredCount: 1,
  },
  {
    id: "racer",
    name: "Racer",
    description: "Complete your first race.",
    category: AchievementCategory.PvP,
    tier: AchievementTier.Bronze,
    titleFragment: titleFor("racer"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "racer-badge",
    requirement: "Finish 1 race to the end.",
    requiredCount: 1,
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Win a race.",
    category: AchievementCategory.PvP,
    tier: AchievementTier.Silver,
    titleFragment: titleFor("speed-demon"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "speed-demon-badge",
    requirement: "Finish a race in 1st place.",
    requiredCount: 1,
  },
  {
    id: "merchant",
    name: "Merchant",
    description: "Trade with another player.",
    category: AchievementCategory.PvP,
    tier: AchievementTier.Bronze,
    titleFragment: titleFor("merchant"),
    rewardType: AchievementRewardType.Badge,
    rewardId: "merchant-badge",
    requirement: "Complete 1 player-to-player trade.",
    requiredCount: 1,
  },
];

// ── exported catalogue ─────────────────────────────────────────────────────

/** All 23 achievements in declaration order. */
export const ACHIEVEMENTS: ReadonlyArray<Achievement> = [
  ...PRODUCT,
  ...EXPLORATION,
  ...PVP,
];

/**
 * Map of id → Achievement for O(1) lookup. Frozen at module load.
 */
export const ACHIEVEMENTS_BY_ID: Readonly<Record<string, Achievement>> = Object.freeze(
  Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a])),
);

/** Returns every achievement in a single category. */
export function getAchievementsByCategory(
  category: AchievementCategory,
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}
