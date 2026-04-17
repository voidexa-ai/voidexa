/**
 * Sprint 9 — formal keyword definitions for voidexa cards.
 *
 * Existing 257-card library uses inline keyword phrases in `abilityText`.
 * This module captures the subset that have crystallized into reusable
 * keywords, plus 3 net-new MTG-inspired additions (Stalwart, Probe, Reactive)
 * that are available for future card sets.
 *
 * Adding a card with `keywords: ['Hot Deploy']` is the supported way to
 * formalize a keyword; engine code should read this list, not parse
 * `abilityText`.
 *
 * No existing cards are modified by this module. See
 * `docs/MTG_MECHANICS_AUDIT.md` for the full audit and rationale.
 */

export type CardKeyword =
  // Existing voidexa keywords (extracted from current library)
  | 'Exhaust'
  | 'Hot Deploy'
  | 'Cold Boot'
  | 'Overcharge'
  | 'Gain Stealth'
  | 'Evade'
  | 'Auto-Repair'
  | 'Apply Lock'
  | 'Tracking Lock'
  | 'Twin Barrels'
  | 'Critical Breach'
  | 'Apply Burn'
  | 'Negate'
  | 'Scrap'
  | 'Disable'
  | 'Priority Fire'
  // Sprint 9 — new keywords (MTG-equivalents, no balance change to existing cards)
  | 'Stalwart'
  | 'Probe'
  | 'Reactive'

export interface KeywordDefinition {
  keyword: CardKeyword
  short: string
  long: string
  /** MTG analog if applicable, for designer reference. */
  mtgAnalog?: string
  /** Sprint that introduced this keyword. */
  introducedSprint: number
}

export const KEYWORD_DEFINITIONS: Readonly<Record<CardKeyword, KeywordDefinition>> = {
  Exhaust: {
    keyword: 'Exhaust',
    short: 'Tap to use.',
    long: 'Mark this card or unit as Exhausted, preventing further actions until refreshed at the next turn start.',
    mtgAnalog: 'tap (universal cost)',
    introducedSprint: 1,
  },
  'Hot Deploy': {
    keyword: 'Hot Deploy',
    short: 'May act on the turn it enters play.',
    long: 'A unit with Hot Deploy can attack or activate abilities on the turn it is summoned, bypassing the usual one-turn delay.',
    mtgAnalog: 'Haste',
    introducedSprint: 1,
  },
  'Cold Boot': {
    keyword: 'Cold Boot',
    short: 'Enters play disabled for N turns.',
    long: 'A unit with Cold Boot N enters play with N cooldown counters; remove one at each turn start, and it acts normally once empty.',
    mtgAnalog: 'Suspend (different timing model)',
    introducedSprint: 1,
  },
  Overcharge: {
    keyword: 'Overcharge',
    short: 'Pay extra cost for stronger effect.',
    long: 'When playing a card with Overcharge, you may pay an additional cost for an enhanced effect listed in the ability text.',
    mtgAnalog: 'Kicker',
    introducedSprint: 1,
  },
  'Gain Stealth': {
    keyword: 'Gain Stealth',
    short: 'Cannot be targeted by opponent abilities.',
    long: 'A unit with Stealth cannot be the target of opponent abilities or attacks for the duration; it can still be affected by area effects.',
    mtgAnalog: 'Hexproof',
    introducedSprint: 1,
  },
  Evade: {
    keyword: 'Evade',
    short: 'X% chance to dodge incoming damage.',
    long: 'When this unit would take damage, roll for Evade; on success, the damage is negated.',
    mtgAnalog: 'Hexproof (probabilistic variant)',
    introducedSprint: 1,
  },
  'Auto-Repair': {
    keyword: 'Auto-Repair',
    short: 'Heals N at end of turn.',
    long: 'At the end of your turn, this unit regenerates N health, up to its maximum.',
    mtgAnalog: 'regenerate (passive variant)',
    introducedSprint: 1,
  },
  'Apply Lock': {
    keyword: 'Apply Lock',
    short: 'Target cannot Untap next turn.',
    long: 'The targeted unit gains a Lock counter; it skips its next refresh phase, remaining Exhausted for an additional turn.',
    introducedSprint: 1,
  },
  'Tracking Lock': {
    keyword: 'Tracking Lock',
    short: 'Designate a target for boosted attacks.',
    long: 'Place a Tracking Lock on an enemy unit; subsequent attacks against that unit deal +N damage until the Lock is removed.',
    introducedSprint: 1,
  },
  'Twin Barrels': {
    keyword: 'Twin Barrels',
    short: 'Attack triggers twice.',
    long: 'When this card resolves an attack, the damage roll fires twice; each roll is independent.',
    mtgAnalog: 'Double Strike (partial)',
    introducedSprint: 1,
  },
  'Critical Breach': {
    keyword: 'Critical Breach',
    short: 'Trigger an effect when this unit is destroyed.',
    long: 'When this unit is destroyed, resolve the Critical Breach effect listed on the card.',
    introducedSprint: 1,
  },
  'Apply Burn': {
    keyword: 'Apply Burn',
    short: 'Inflict damage over time.',
    long: 'Place a Burn counter on the target; at the start of each subsequent turn, the target takes N damage. Burn counters stack.',
    introducedSprint: 1,
  },
  Negate: {
    keyword: 'Negate',
    short: 'Counter an opponent action.',
    long: 'Cancel the targeted opponent card or ability, sending it to the discard with no effect.',
    mtgAnalog: 'counterspell',
    introducedSprint: 1,
  },
  Scrap: {
    keyword: 'Scrap',
    short: 'Sacrifice for resource gain.',
    long: 'Send this unit or card to the scrap pile to gain the listed reward (energy, draw, healing, etc.).',
    introducedSprint: 1,
  },
  Disable: {
    keyword: 'Disable',
    short: 'Target cannot activate abilities next turn.',
    long: 'The targeted unit cannot use activated abilities or trigger effects until the start of your next turn.',
    introducedSprint: 1,
  },
  'Priority Fire': {
    keyword: 'Priority Fire',
    short: 'Resolves before opponent attacks this turn.',
    long: 'When combat begins, units with Priority Fire deal damage before any non-Priority units, even on the opponent turn.',
    mtgAnalog: 'First Strike',
    introducedSprint: 1,
  },

  // ─── Sprint 9 — net-new keywords ────────────────────────────────────────
  Stalwart: {
    keyword: 'Stalwart',
    short: 'Does not Exhaust when attacking.',
    long: 'A Stalwart unit attacks without becoming Exhausted, allowing it to defend during the opponent turn.',
    mtgAnalog: 'Vigilance',
    introducedSprint: 9,
  },
  Probe: {
    keyword: 'Probe',
    short: 'Look at the top N cards of your deck.',
    long: 'When this card resolves, look at the top N cards of your draw pile; you may rearrange them in any order before placing them back on top.',
    mtgAnalog: 'Scry',
    introducedSprint: 9,
  },
  Reactive: {
    keyword: 'Reactive',
    short: 'May be played on the opponent turn.',
    long: 'A Reactive card can be played in response to an opponent card resolution, before its effects fully resolve. Subject to standard timing windows.',
    mtgAnalog: 'Flash',
    introducedSprint: 9,
  },
}

export const ALL_KEYWORDS: readonly CardKeyword[] = Object.keys(
  KEYWORD_DEFINITIONS
) as CardKeyword[]

/** Sprint 9 net-new additions — for tooling that wants to flag "future set" keywords. */
export const NEW_KEYWORDS_SPRINT_9: readonly CardKeyword[] = [
  'Stalwart',
  'Probe',
  'Reactive',
]

export function getKeywordDefinition(kw: CardKeyword): KeywordDefinition {
  return KEYWORD_DEFINITIONS[kw]
}
