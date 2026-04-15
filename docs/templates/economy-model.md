# Economy Model: [System Name]

*Created: [Date]*
*Owner: economy-designer*
*Status: Draft | Balanced | Live*

---

## Overview

[What resources, currencies, and exchange systems does this economy cover? Which voidexa player behaviours does it incentivise? Reference Part 3 / Part 8 / Part 10 of the master plan as appropriate.]

---

## Currencies

| Currency | Type | Earn rate | Sink rate | Cap | Notes |
|---|---|---|---|---|---|
| **USD (Stripe wallet)** | Real | n/a (top-up only) | session cost, shop purchases | none | Cannot be converted back to real money. Tested with sk_test in dev. |
| **Dust** | Crafting | varies (disenchant) | craft / fuse | none | In-game only. From `lib/cards/collection.ts`. |
| **GHAI** | Future native | gameplay (post-ADVORA) | shop discount, governance | none | Reserved — not in v1. |

### Currency rules
- USD wallet top-ups go through Stripe Checkout. See `app/api/wallet/topup/route.ts`.
- Dust accumulates from `disenchantCard()`. Values: Common 5, Uncommon 20, Rare 100, Epic 400, Legendary 1600.
- Dust spends via `craftCard()`. Costs: Common 30, Uncommon 100, Rare 400, Epic 1600, Legendary 6400.
- No currency may be sold outside the platform (no GHAI sales until ADVORA).

---

## Sources (faucets)

| Source | Currency | Amount | Frequency | Conditions |
|---|---|---|---|---|
| Quantum debate | session credit (USD) | $0.05 / $0.25 | per session | tester emails skip; admins skip |
| Mission completion (first) | XP + credits | per mission rewardXP/Credits | per first run | from `lib/missions/catalogue.ts` |
| Mission completion (repeat) | XP + credits | × 0.5 | per subsequent run | REPEAT_REWARD_MULTIPLIER |
| Race finish (top 8) | rank points | 30 → 2 | per race | × DIFFICULTY_MULTIPLIER |
| Disenchant card | Dust | DUST_VALUES[rarity] | on demand | one card destroyed per call |
| Daily challenge winner | rare shop item | 1 | per day | top-1 only |

---

## Sinks (drains)

| Sink | Currency | Cost | Frequency | Purpose |
|---|---|---|---|---|
| Quantum debate | USD wallet | $0.05–$0.25 | per session | actual API + margin |
| Card pack (Standard) | USD wallet | $2.00 | optional | acquisition variety |
| Card pack (Legendary) | USD wallet | $20.00 | max 1 / week | guaranteed Legendary |
| Craft Common card | Dust | 30 | optional | targeted acquisition |
| Craft Legendary card | Dust | 6400 | rare | endgame goal |
| Repair station | (future) credits | TBD | post-PvP-loss | only when PvP combat lands |

---

## Balance targets

| Metric | Target | Rationale |
|---|---|---|
| Time to first Stripe top-up | within first 5 sessions | give value first, ask later |
| Mid-tier player Dust / week | 200–500 | enough to craft 5–15 Common cards weekly |
| Time to first Epic craft (no top-ups) | 4–6 weeks | aspirational but reachable |
| Sink-to-source ratio (USD) | tracked, not enforced | platform takes margin, not profit |
| % players hitting any cap | 0% (no caps in v1) | unlimited stockpile by design |

---

## Loot tables — card packs

### Standard pack ($2)
| Slot | Rarity | Drop rate | Pity |
|---|---|---|---|
| 1–4 | Common | 100% | n/a |
| 5 | Uncommon | 100% (guaranteed) | n/a |

### Premium pack ($5)
| Slot | Rarity | Drop rate | Pity |
|---|---|---|---|
| 1–3 | Common | 100% | n/a |
| 4 | Uncommon | 100% | n/a |
| 5 | Rare | 100% (guaranteed) | n/a |

### Ultimate pack ($10)
| Slot | Rarity | Drop rate | Pity |
|---|---|---|---|
| 1–2 | Uncommon | 100% | n/a |
| 3–4 | Rare | 100% | n/a |
| 5 | Epic | 100% (guaranteed) | n/a |

### Legendary pack ($20)
| Slot | Rarity | Drop rate | Pity |
|---|---|---|---|
| 1–9 | Random tier | varies | n/a |
| 10 | Legendary | 100% (guaranteed) | n/a |

(Max 1 Legendary pack purchase per player per week — anti-binge rule from Part 8.)

---

## Economic health metrics

| Metric | Healthy range | Warning threshold | Action |
|---|---|---|---|
| Average wallet balance | $2–$8 | < $0.50 (push to top-up too aggressively) | review session pricing |
| Dust accumulation rate | 50–150 / day active | > 500/day | review disenchant value |
| Craft → disenchant ratio | 1:3 | > 1:1 (players churning packs without crafting) | improve targeted craft UX |
| % sessions failing wallet pre-check | < 5% | > 10% | clarify top-up flow earlier |
| Time-on-site per session | tracked | < 5 min avg | UX or value problem |

---

## Ethical guardrails

- No pay-to-win — shop sells looks, gameplay earns stats (master plan Part 3 line 190)
- Achievement ships are soulbound — never wagerable, never sellable
- Pity timer on Legendary card pack: 1 guaranteed Legendary every $20 pack
- No FOMO timer < 48 h on essential items (cosmetics-only on shorter timers)
- Wallet cap reviewed quarterly (currently no cap)
- Spending visibility — full wallet history queryable from `/account/wallet`

---

## Dependencies

- Depends on: card system (`lib/cards/`), shop pricing (`lib/shop/items.ts`), Stripe wallet (`app/api/wallet/`)
- Affects: retention curve, Stripe revenue, leaderboard fairness
- Coordinates with: `combat-designer`, `systems-designer`, `live-ops` (when it exists)
