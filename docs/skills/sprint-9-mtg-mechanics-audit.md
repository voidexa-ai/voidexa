---
name: sprint-9-mtg-mechanics-audit
description: Audit 257 voidexa cards against the canonical MTG keyword set, document gaps, add missing keywords where they fit the design
sprint: 9
status: pending
---

## Scope
Card data lives in `lib/game/cards/library.ts` (and ancillary set files). 257 cards
across rarities. MTG has ~150 evergreen + deciduous keywords; voidexa is a sci-fi
CCG so only a subset transfers.

## Reference set (evergreen subset to compare against)
Flying, Trample, Vigilance, Haste, First Strike, Double Strike, Lifelink, Deathtouch,
Reach, Hexproof, Indestructible, Menace, Defender, Flash, Ward, Prowess, Scry,
Surveil, Mill, Convoke, Cycling, Embalm, Equip, Kicker, Flashback, Madness, Storm,
Affinity, Dredge, Suspend.

## Voidexa equivalents already in the codebase (to map)
Examples to look for: `Charge` (haste), `Pierce` (trample), `Cloak` (hexproof),
`Stalwart` (vigilance), `Volley` (first strike), `Salvage` (lifelink),
`Corrosive` (deathtouch). Audit confirms which exist.

## Deliverables
1. **Audit report** `docs/MTG_MECHANICS_AUDIT.md`
   - Section A: voidexa keyword inventory (extracted from card library).
   - Section B: MTG keyword → voidexa equivalent table (Existing / Missing / N-A).
   - Section C: Gap recommendations (which to add, justification, impact on balance).
2. **Code changes** (only if gap is small + design-safe)
   - `lib/game/cards/keywords.ts` — add new keyword definitions for accepted gaps.
   - Apply 1–2 keywords to existing cards as flavor adds (no power level change).
3. **Tests**
   - `lib/game/cards/__tests__/keywords.test.ts` — schema test for any new keyword.

## Plan
1. Backup tag.
2. Grep `lib/game/cards/` for keyword field name (`keywords:` or similar).
3. Build a script `scripts/audit-card-keywords.ts` that prints a histogram of
   keyword usage across the 257 cards.
4. Write the audit doc from histogram + manual MTG equivalence call.
5. If ≤3 net-new keywords accepted, code them in. Otherwise list as backlog.
6. Tests + build + commit + tag `sprint-9-complete` + push.

## Gates
- Audit doc exists and lists all 257 cards' current keyword profile.
- No power-level change to any card (combat math tests still green).
