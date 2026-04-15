# Balance Sheet: [System Name]

> **Status:** Draft | In Review | Approved
> **Author:** combat-designer / systems-designer
> **Last updated:** [Date]
> **Links to:** `docs/VOIDEXA_STAR_SYSTEM_COMPLETE_PLAN_v1.2_FINAL.md` Part [N]
> **Source modules:** `lib/[area]/...`

---

## Difficulty philosophy

[One paragraph stating this system's relationship with difficulty. Pick one stance and tune everything to it:

1. **Mastery as the reward** (Souls / Celeste) — difficulty is the product. Reducing it removes the point.
2. **Accessible entry, optional depth** (Hades / Hollow Knight) — base experience completable by most; depth opt-in.
3. **Pacing serves narrative** (TLOU / GoW) — challenge rises and falls with story beats.
4. **Relaxed engagement** (Stardew / Animal Crossing) — failure is gentle and infrequent.

For voidexa, default is #2 — accessible entry, optional depth — because the platform serves both casual debaters and competitive PvP pilots.]

---

## Player skill model

| Tier | Bracket | Expected behaviours |
|---|---|---|
| New | Bronze rank, < 5 sessions | Clicks through tutorials, cards used randomly, single-color deck |
| Mid | Silver–Gold, 20–100 sessions | Reads card text, tries fusion, picks a ship class with intent |
| High | Platinum–Diamond, 100–500 sessions | Optimizes for energy efficiency, exploits backfire % math, runs daily challenge |
| Elite | Legendary, 500+ sessions | Theory-crafts decks, frame-perfect race power-up usage, alien tech matrix knowledge |

---

## Tuning levers

Every tunable parameter, its safe range, and gameplay impact at min/max.

| Parameter | File:Line | Current | Safe range | Min effect | Max effect |
|---|---|---|---|---|---|
| `WIN_POINTS` | `lib/game/ranks.ts:39` | 25 | 15–35 | climbing too slow | climbing too fast |
| `LOSS_POINTS` | `lib/game/ranks.ts:41` | 20 | 10–30 | demotion too rare | tilt-quitting |
| `BACKFIRE_CHANCE` | `lib/game/alientech.ts:38` | 0.2 | 0.15–0.3 | risk feels free | players never use alien tech |
| `REPEAT_REWARD_MULTIPLIER` (missions) | `lib/missions/progress.ts:39` | 0.5 | 0.3–0.75 | grinding too valuable | repeats feel pointless |
| `LEADERBOARD_CAP` | `lib/race/scoring.ts:79` | 100 | 50–250 | leaderboard too sparse | leaderboard too noisy |
| `DIFFICULTY_MULTIPLIER[Extreme]` | `lib/race/scoring.ts:48` | 2.0 | 1.5–2.5 | hard tracks underpaid | hard tracks dominant |

---

## Power curves

### Ship class HP curve
| Class | Shield | Hull | Total | Speed | Notes |
|---|---:|---:|---:|---:|---|
| Fighter | 30 | 70 | 100 | 90 | DPS / glass cannon |
| Cruiser | 50 | 100 | 150 | 60 | Sustain |
| Stealth | 20 | 60 | 80 | 75 | Ambush |
| Tank | 80 | 170 | 250 | 35 | Anchor |
| Racer | 15 | 50 | 65 | 120 | Pure speed |

(Locked to master plan lines 176–182. Tests in `lib/game/__tests__/ships.test.ts` enforce these exact values.)

### Card energy bands
| Rarity | Min energy | Max energy | Source |
|---|---:|---:|---|
| Common | 1 | 2 | `lib/game/cards.ts ENERGY_COST_RANGE` |
| Uncommon | 2 | 3 | same |
| Rare | 3 | 4 | same |
| Epic | 4 | 5 | same |
| Legendary | 5 | 7 | same |

### Rank-point curve
| Rank | Threshold | Expected duels to reach (50% WR) |
|---|---:|---:|
| Bronze | 0 | 0 |
| Silver | 100 | ~20 (4 net wins per 5 ranks at +25 / -20) |
| Gold | 300 | ~60 |
| Platinum | 600 | ~120 |
| Diamond | 1000 | ~200 |
| Legendary | 1500 | ~300 |

(Above is at exactly 50% win rate. Above 50% accelerates; below 50% players plateau.)

---

## Interaction matrices

### Card category vs ship class affinity (proposed, not enforced)

| Card category → / Class ↓ | Attack | Defense | Tactical | Deployment | Alien |
|---|---|---|---|---|---|
| Fighter | strong | weak | medium | medium | balanced |
| Cruiser | medium | strong | medium | strong | balanced |
| Stealth | strong | weak | strong | medium | strong |
| Tank | medium | strong | weak | strong | balanced |
| Racer | weak | weak | strong | weak | strong |

(Affinity here is a tuning hint — no card is hard-locked to a class.)

### Alien tech vs ship class

| Alien tech ↓ | Fighter | Cruiser | Stealth | Tank | Racer |
|---|---|---|---|---|---|
| Void Cannon | risky (low HP) | safe | risky | safe | very risky |
| Time Warp | great | great | great | great | great |
| Shield Overcharge | great (low shield) | medium | great | low impact | great |
| ... | ... | ... | ... | ... | ... |

(Fill in the rest as you tune. Use the `combat-designer` to walk through.)

---

## Feedback loops

### Positive (snowball — keep an eye)
- **Win → Higher rank → Better matchmaking → More wins** — dampened by ±1 bracket cap on duels.
- **More cards → More fusion options → Stronger deck → More wins** — dampened by deck cap (20) and copy cap (2 / 1 Legendary).

### Negative (catch-up — confirm they trigger)
- **Lose race → Trailing player gets stronger power-ups** — implemented in `spawnPowerUp(isLeading: false)`.
- **Low rank → Easier matches** — implicit in ±1 bracket rule.

### Intentional snowballs
- Dust accumulation has no cap — the more you play, the more crafting becomes possible. Trades early-game grind for late-game freedom.

---

## Balance verification

How to validate this balance sheet before shipping:

- [ ] Run vitest suites for every module touched: `npm run test`
- [ ] Monte Carlo simulation: 10,000 simulated duels at every rank pair → win-rate matrix should show ≤ 60% advantage at any matchup
- [ ] Hand-played sanity test: Bronze pilot vs Bronze pilot, both starter decks, neither dominates
- [ ] Check `isValidEnergyCost(card)` returns true for every card in `STARTER_CARDS`
- [ ] Telemetry plan: which events to log so we can see drift in production

---

## Open questions

- [ ] [List anything ambiguous, deferred, or pending Jix sign-off]

---

## Change log

| Date | Author | Change | Reason |
|---|---|---|---|
| [yyyy-mm-dd] | [you] | Initial draft | New system |
