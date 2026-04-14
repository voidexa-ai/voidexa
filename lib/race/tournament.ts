/**
 * lib/race/tournament.ts
 *
 * Single-elimination tournament brackets (master plan Part 7, "Tournaments").
 * Supports 8 or 16 players. Each match points to the next one via `nextMatchId`
 * so `advanceWinner` can propagate a result with no extra bookkeeping on the
 * caller side.
 *
 * Bracket layout for 8 players (3 rounds, 7 matches total):
 *   Round 0: R0M0, R0M1, R0M2, R0M3   (4 matches)
 *   Round 1: R1M0, R1M1               (2 matches)
 *   Round 2: R2M0                     (1 match — final)
 *
 * Layout for 16 players: 4 rounds, 15 matches.
 */

export type BracketSize = 8 | 16;

export interface TournamentMatch {
  /** Stable match id. Format: `R<round>M<slot>`. */
  id: string;
  /** 0-indexed round number (0 = first round). */
  round: number;
  /** 0-indexed slot within the round. */
  slot: number;
  /** Competitors. Populated as earlier rounds resolve. null = TBD. */
  playerA: string | null;
  playerB: string | null;
  /** null until the match completes. */
  winnerId: string | null;
  /** Id of the match that consumes this match's winner, or null for the final. */
  nextMatchId: string | null;
}

export interface TournamentBracket {
  size: BracketSize;
  /** Total rounds (log2(size)). 8 → 3, 16 → 4. */
  rounds: number;
  matches: TournamentMatch[];
}

/**
 * Builds an 8- or 16-player single-elimination bracket. `playerIds.length`
 * must equal `8` or `16` exactly — the code intentionally refuses to generate
 * byes to keep the competitive structure clean.
 *
 * The first-round seeding pairs (1,8), (4,5), (3,6), (2,7) in an 8-player
 * bracket (standard "bracket seeding" so #1 and #2 only meet in the final).
 * Callers can pass already-seeded playerIds; see `seededOrder` below.
 */
export function createBracket(playerIds: ReadonlyArray<string>): TournamentBracket {
  const size = playerIds.length;
  if (size !== 8 && size !== 16) {
    throw new Error(
      `Bracket size must be 8 or 16 players (got ${size}).`,
    );
  }
  if (new Set(playerIds).size !== size) {
    throw new Error("Bracket player ids must be unique.");
  }

  const seeded = seededOrder(playerIds);
  const rounds = Math.log2(size);

  // Pre-create matches for every round; later rounds have null competitors.
  const matches: TournamentMatch[] = [];
  for (let r = 0; r < rounds; r++) {
    const roundMatches = size / Math.pow(2, r + 1); // 4, 2, 1 for size=8
    for (let s = 0; s < roundMatches; s++) {
      matches.push({
        id: matchId(r, s),
        round: r,
        slot: s,
        playerA: null,
        playerB: null,
        winnerId: null,
        nextMatchId: r + 1 < rounds ? matchId(r + 1, Math.floor(s / 2)) : null,
      });
    }
  }

  // Fill round-0 matches from the seeded pairing.
  for (let s = 0; s < size / 2; s++) {
    const m = matches.find((mm) => mm.round === 0 && mm.slot === s);
    if (!m) continue;
    m.playerA = seeded[s * 2];
    m.playerB = seeded[s * 2 + 1];
  }

  return { size: size as BracketSize, rounds, matches };
}

/**
 * Marks a match winner and forwards the winner to the next match.
 * Throws if:
 *   - match not found,
 *   - winnerId isn't one of the two competitors,
 *   - winnerId is null (use explicit string).
 *
 * Returns a new bracket (immutable update).
 */
export function advanceWinner(
  bracket: TournamentBracket,
  matchId: string,
  winnerId: string,
): TournamentBracket {
  const match = bracket.matches.find((m) => m.id === matchId);
  if (!match) throw new Error(`Match not found: ${matchId}`);
  if (!winnerId) throw new Error("winnerId is required");
  if (winnerId !== match.playerA && winnerId !== match.playerB) {
    throw new Error(
      `Winner ${winnerId} is not a competitor in ${matchId}`,
    );
  }

  const nextMatches = bracket.matches.map((m) => {
    if (m.id === match.id) {
      return { ...m, winnerId };
    }
    if (match.nextMatchId && m.id === match.nextMatchId) {
      // Place the winner into A for even-slot parents, B for odd-slot.
      const slotInNext = match.slot % 2 === 0 ? "playerA" : "playerB";
      return { ...m, [slotInNext]: winnerId };
    }
    return m;
  });

  return { ...bracket, matches: nextMatches };
}

// ── status & helpers ───────────────────────────────────────────────────────

export interface TournamentStatus {
  /** Current round (0-indexed). `rounds` once the tournament is finished. */
  currentRound: number;
  /** Matches in the current round that have not yet completed. */
  remainingMatches: TournamentMatch[];
  /** True iff every match in every round has a winner. */
  isComplete: boolean;
  /** Id of the winner of the final match, null until the tournament is decided. */
  championId: string | null;
}

/**
 * Returns a snapshot of tournament progress: which round is active, which
 * matches are still pending, and the champion (if any).
 */
export function getTournamentStatus(bracket: TournamentBracket): TournamentStatus {
  for (let r = 0; r < bracket.rounds; r++) {
    const roundMatches = bracket.matches.filter((m) => m.round === r);
    const unfinished = roundMatches.filter((m) => m.winnerId === null);
    if (unfinished.length > 0) {
      return {
        currentRound: r,
        remainingMatches: unfinished,
        isComplete: false,
        championId: null,
      };
    }
  }
  const final = bracket.matches.find(
    (m) => m.round === bracket.rounds - 1,
  );
  return {
    currentRound: bracket.rounds,
    remainingMatches: [],
    isComplete: true,
    championId: final?.winnerId ?? null,
  };
}

// ── internals ──────────────────────────────────────────────────────────────

function matchId(round: number, slot: number): string {
  return `R${round}M${slot}`;
}

/**
 * Standard tournament seeding ("natural" bracket).
 * For 8 players (indices 0..7 = seeds 1..8): pairs are
 * (1,8), (4,5), (3,6), (2,7). For 16 players, the recursive equivalent.
 *
 * Accepts an arbitrary input order — the caller's `playerIds[i]` is treated
 * as seed `i+1`. Returns the input reshuffled into round-0 match order.
 */
export function seededOrder<T>(playerIds: ReadonlyArray<T>): T[] {
  const n = playerIds.length;
  // Classic recursive bracket order: start with [1, 2], then for each step
  // expand each number i into [i, size+1-i].
  let order: number[] = [1, 2];
  while (order.length < n) {
    const size = order.length * 2;
    const expanded: number[] = [];
    for (const x of order) {
      expanded.push(x, size + 1 - x);
    }
    order = expanded;
  }
  return order.map((seed) => playerIds[seed - 1]);
}
