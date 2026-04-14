import { describe, it, expect } from "vitest";
import {
  createBracket,
  advanceWinner,
  getTournamentStatus,
  seededOrder,
} from "../tournament";

const EIGHT = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];
const SIXTEEN = Array.from({ length: 16 }, (_, i) => `p${i + 1}`);

describe("createBracket", () => {
  it("builds an 8-player bracket with 7 matches across 3 rounds", () => {
    const b = createBracket(EIGHT);
    expect(b.size).toBe(8);
    expect(b.rounds).toBe(3);
    expect(b.matches).toHaveLength(7);
    expect(b.matches.filter((m) => m.round === 0)).toHaveLength(4);
    expect(b.matches.filter((m) => m.round === 1)).toHaveLength(2);
    expect(b.matches.filter((m) => m.round === 2)).toHaveLength(1);
  });

  it("builds a 16-player bracket with 15 matches across 4 rounds", () => {
    const b = createBracket(SIXTEEN);
    expect(b.size).toBe(16);
    expect(b.rounds).toBe(4);
    expect(b.matches).toHaveLength(15);
  });

  it("round-0 matches have both competitors; later rounds start empty", () => {
    const b = createBracket(EIGHT);
    for (const m of b.matches) {
      if (m.round === 0) {
        expect(m.playerA).not.toBeNull();
        expect(m.playerB).not.toBeNull();
      } else {
        expect(m.playerA).toBeNull();
        expect(m.playerB).toBeNull();
      }
    }
  });

  it("final match's nextMatchId is null", () => {
    const b = createBracket(EIGHT);
    const final = b.matches.find((m) => m.round === b.rounds - 1)!;
    expect(final.nextMatchId).toBeNull();
  });

  it("refuses non-8, non-16 sizes", () => {
    expect(() => createBracket(["a", "b", "c", "d"])).toThrow();
    expect(() => createBracket([])).toThrow();
  });

  it("refuses duplicate player ids", () => {
    const dupes = ["a", "a", "c", "d", "e", "f", "g", "h"];
    expect(() => createBracket(dupes)).toThrow();
  });
});

describe("seededOrder", () => {
  it("8-player seeding: top seed is #1, every round-0 pair is (k, 9-k)", () => {
    const out = seededOrder(EIGHT);
    expect(out[0]).toBe("p1");
    expect(out[1]).toBe("p8");
    for (let i = 0; i < out.length; i += 2) {
      const a = Number(out[i].slice(1));
      const b = Number(out[i + 1].slice(1));
      expect(a + b).toBe(9);
    }
  });

  it("16-player seeding pairs 1,16 and keeps 1 & 2 in opposite halves", () => {
    const out = seededOrder(SIXTEEN);
    expect(out[0]).toBe("p1");
    expect(out[1]).toBe("p16");
    // Every round-0 pair sums to size+1 (classic bracket property).
    for (let i = 0; i < out.length; i += 2) {
      const a = Number(out[i].slice(1));
      const b = Number(out[i + 1].slice(1));
      expect(a + b).toBe(17);
    }
    // #2 sits in the bottom half so it can only meet #1 in the final.
    const top = out.slice(0, 8);
    const bottom = out.slice(8);
    expect(top).toContain("p1");
    expect(bottom).toContain("p2");
  });
});

describe("advanceWinner", () => {
  it("propagates the winner into the next match's A slot (even source slot)", () => {
    const b = createBracket(EIGHT);
    const first = b.matches.find((m) => m.round === 0 && m.slot === 0)!;
    const updated = advanceWinner(b, first.id, first.playerA!);
    const next = updated.matches.find((m) => m.id === first.nextMatchId!)!;
    expect(next.playerA).toBe(first.playerA);
    expect(next.playerB).toBeNull();
  });

  it("propagates the winner into the B slot for odd source slots", () => {
    const b = createBracket(EIGHT);
    const second = b.matches.find((m) => m.round === 0 && m.slot === 1)!;
    const updated = advanceWinner(b, second.id, second.playerB!);
    const next = updated.matches.find((m) => m.id === second.nextMatchId!)!;
    expect(next.playerB).toBe(second.playerB);
  });

  it("refuses a winnerId that didn't compete in the match", () => {
    const b = createBracket(EIGHT);
    const m = b.matches[0];
    expect(() => advanceWinner(b, m.id, "outsider")).toThrow();
  });

  it("refuses unknown match ids", () => {
    const b = createBracket(EIGHT);
    expect(() => advanceWinner(b, "R9M9", "p1")).toThrow();
  });
});

describe("getTournamentStatus", () => {
  it("reports currentRound=0 when nothing has been played", () => {
    const b = createBracket(EIGHT);
    const s = getTournamentStatus(b);
    expect(s.currentRound).toBe(0);
    expect(s.remainingMatches).toHaveLength(4);
    expect(s.isComplete).toBe(false);
    expect(s.championId).toBeNull();
  });

  it("advances to round 1 once every round-0 match resolves", () => {
    let b = createBracket(EIGHT);
    const r0 = b.matches.filter((m) => m.round === 0);
    for (const m of r0) {
      b = advanceWinner(b, m.id, m.playerA!);
    }
    const s = getTournamentStatus(b);
    expect(s.currentRound).toBe(1);
    expect(s.remainingMatches).toHaveLength(2);
  });

  it("flags isComplete + champion once the final resolves", () => {
    let b = createBracket(EIGHT);
    for (const m of b.matches.filter((mm) => mm.round === 0)) {
      b = advanceWinner(b, m.id, m.playerA!);
    }
    for (const m of b.matches.filter((mm) => mm.round === 1)) {
      b = advanceWinner(b, m.id, m.playerA!);
    }
    const final = b.matches.find((m) => m.round === 2)!;
    b = advanceWinner(b, final.id, final.playerA!);
    const s = getTournamentStatus(b);
    expect(s.isComplete).toBe(true);
    expect(s.championId).toBe(final.playerA);
  });

  it("supports 16-player tournaments end to end", () => {
    let b = createBracket(SIXTEEN);
    for (let r = 0; r < b.rounds; r++) {
      for (const m of b.matches.filter((mm) => mm.round === r)) {
        b = advanceWinner(b, m.id, m.playerA!);
      }
    }
    const s = getTournamentStatus(b);
    expect(s.isComplete).toBe(true);
    expect(s.championId).not.toBeNull();
  });
});
