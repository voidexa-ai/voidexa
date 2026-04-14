/**
 * lib/game/ranks.ts
 *
 * Rank ladder for PvP duels. Mirrors master plan (COMPLETE_PLAN_v1.2, line 235):
 *   Bronze → Silver → Gold → Platinum → Diamond → Legendary
 *
 * Rules:
 *   - Duels permitted only within ±1 rank bracket (line 237).
 *   - Win = points up. Loss = points down. Crossing a threshold promotes/demotes.
 */

export enum Rank {
  Bronze = "Bronze",
  Silver = "Silver",
  Gold = "Gold",
  Platinum = "Platinum",
  Diamond = "Diamond",
  Legendary = "Legendary",
}

/** Ordered ladder (low → high). Index = bracket. */
export const RANK_ORDER: readonly Rank[] = [
  Rank.Bronze,
  Rank.Silver,
  Rank.Gold,
  Rank.Platinum,
  Rank.Diamond,
  Rank.Legendary,
];

/**
 * Cumulative point thresholds — reaching or exceeding a threshold means the player
 * is AT that rank. Bronze starts at 0 and has no lower bound.
 */
export const RANK_THRESHOLDS: Readonly<Record<Rank, number>> = {
  [Rank.Bronze]: 0,
  [Rank.Silver]: 100,
  [Rank.Gold]: 300,
  [Rank.Platinum]: 600,
  [Rank.Diamond]: 1000,
  [Rank.Legendary]: 1500,
};

/** Points awarded on a win. Tunable. */
export const WIN_POINTS = 25;
/** Points deducted on a loss. Tunable. */
export const LOSS_POINTS = 20;

export function rankIndex(rank: Rank): number {
  return RANK_ORDER.indexOf(rank);
}

/**
 * Returns the current rank for a given cumulative point total.
 * Points below 0 are treated as 0 (Bronze floor).
 */
export function rankFromPoints(points: number): Rank {
  const pts = Math.max(0, points);
  let current: Rank = Rank.Bronze;
  for (const r of RANK_ORDER) {
    if (pts >= RANK_THRESHOLDS[r]) current = r;
    else break;
  }
  return current;
}

/**
 * Duels are allowed only within ±1 rank bracket.
 * Bronze ↔ Silver ✔, Bronze ↔ Gold ✘, same rank ✔.
 */
export function canDuel(rankA: Rank, rankB: Rank): boolean {
  const delta = Math.abs(rankIndex(rankA) - rankIndex(rankB));
  return delta <= 1;
}

/**
 * Returns the updated point total after a duel result.
 * Does NOT mutate. Points floor at 0 (cannot go negative).
 *
 * @param currentPoints Points before the duel.
 * @param won           True if the player won this duel.
 */
export function updateRank(currentPoints: number, won: boolean): number {
  const delta = won ? WIN_POINTS : -LOSS_POINTS;
  return Math.max(0, currentPoints + delta);
}

/**
 * Convenience: returns both the new point total and the resulting rank,
 * along with a promoted/demoted flag to trigger UI celebrations or warnings.
 */
export interface RankUpdateResult {
  points: number;
  rank: Rank;
  promoted: boolean;
  demoted: boolean;
}

export function applyDuelResult(
  currentPoints: number,
  won: boolean,
): RankUpdateResult {
  const beforeRank = rankFromPoints(currentPoints);
  const points = updateRank(currentPoints, won);
  const rank = rankFromPoints(points);
  return {
    points,
    rank,
    promoted: rankIndex(rank) > rankIndex(beforeRank),
    demoted: rankIndex(rank) < rankIndex(beforeRank),
  };
}
