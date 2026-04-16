/**
 * Phase 4a — enemy AI selector. Greedy but not stupid.
 * Pure function: input BattleState, output BattleAction. No side effects.
 */

import type { CardInstance, BattleAction, BattleState, Side } from './types'

const LOW_HULL_THRESHOLD = 0.3
const FINISHER_THRESHOLD = 0.25

export function selectAction(state: BattleState): BattleAction {
  const me: Side = state.activeSide
  const opponent: Side = me === 'player' ? 'enemy' : 'player'
  const myState = state[me]
  const oppState = state[opponent]

  const affordable = myState.hand.filter(c => c.cost <= myState.energy)
  if (affordable.length === 0) return { type: 'end_turn' }

  // Priority 1: Finisher — if opponent can be killed this play, do it.
  if (oppState.hull / oppState.maxHull <= FINISHER_THRESHOLD || oppState.hull <= 30) {
    const finisher = pickHighestImmediateDamage(affordable, state)
    if (finisher && estimateDamage(finisher, state) >= oppState.hull - oppState.block) {
      return { type: 'play_card', cardInstanceId: finisher.instanceId }
    }
  }

  // Priority 2: Defense/heal when low hull.
  if (myState.hull / myState.maxHull < LOW_HULL_THRESHOLD) {
    const savior = pickBest(affordable, c => defenseValue(c))
    if (savior && defenseValue(savior) > 0) {
      return { type: 'play_card', cardInstanceId: savior.instanceId }
    }
  }

  // Priority 3: Set up Expose before a big weapon when possible.
  const hasExposeCard = affordable.find(c => (c.stats.apply ?? []).includes('expose'))
  const bigWeapon = affordable.find(c => c.type === 'weapon' && (c.stats.damage ?? 0) >= 14)
  const opponentHasExpose = oppState.statuses.some(s => s.type === 'expose')
  if (hasExposeCard && bigWeapon && !opponentHasExpose && myState.energy >= hasExposeCard.cost + bigWeapon.cost) {
    return { type: 'play_card', cardInstanceId: hasExposeCard.instanceId }
  }

  // Priority 4: Apply Burn to healthy target.
  const healthyTarget = oppState.hull / oppState.maxHull > 0.7
  if (healthyTarget) {
    const burner = affordable.find(c => (c.stats.apply ?? []).includes('burn'))
    if (burner) return { type: 'play_card', cardInstanceId: burner.instanceId }
  }

  // Priority 5: Deploy drones early if energy allows and we don't have many.
  if (state.turn <= 3 && myState.drones.length < 2) {
    const drone = affordable.find(c => c.type === 'drone')
    if (drone) return { type: 'play_card', cardInstanceId: drone.instanceId }
  }

  // Default: play highest value-per-energy affordable card.
  const best = pickBest(affordable, c => {
    const ratio = valuePerEnergy(c, state)
    // Penalise over-spending when low-cost alternative achieves same.
    const penalty = c.cost > 3 && hasCheaperSimilarCard(affordable, c) ? -0.5 : 0
    return ratio + penalty
  })
  if (best) return { type: 'play_card', cardInstanceId: best.instanceId }

  return { type: 'end_turn' }
}

// --- Value heuristics ---

function estimateDamage(card: CardInstance, state: BattleState): number {
  if (card.type !== 'weapon') return 0
  const base = card.stats.damage ?? 0
  const opponent: Side = state.activeSide === 'player' ? 'enemy' : 'player'
  const hasExpose = state[opponent].statuses.some(s => s.type === 'expose')
  return hasExpose ? Math.round(base * 1.25) : base
}

function defenseValue(card: CardInstance): number {
  const block = card.stats.block ?? 0
  const heal = card.stats.heal ?? 0
  return block + heal * 1.5
}

function valuePerEnergy(card: CardInstance, state: BattleState): number {
  const cost = Math.max(1, card.cost)
  let value = 0
  if (card.type === 'weapon') value += estimateDamage(card, state) + (card.stats.splash ?? 0)
  if (card.type === 'defense') value += defenseValue(card)
  if (card.type === 'consumable') value += (card.stats.heal ?? 0) * 1.2 + (card.stats.block ?? 0)
  if (card.type === 'drone') {
    const perTurn = card.stats.per_turn ?? 0
    const dur = card.stats.duration_turns ?? 1
    value += perTurn * dur
  }
  if (card.type === 'ai') value += ((card.stats.draw ?? 0) * 3) + ((card.stats.energy ?? 0) * 4)
  if (card.type === 'maneuver') value += (card.stats.block ?? 0) + (card.stats.evade ? 6 : 0)
  // Small bump for status apply to healthy opponents.
  value += (card.stats.apply?.length ?? 0) * 2
  return value / cost
}

function pickHighestImmediateDamage(
  cards: readonly CardInstance[],
  state: BattleState,
): CardInstance | undefined {
  return pickBest(cards, c => estimateDamage(c, state))
}

function pickBest<T>(list: readonly T[], score: (t: T) => number): T | undefined {
  let best: T | undefined
  let bestScore = -Infinity
  for (const item of list) {
    const s = score(item)
    if (s > bestScore) { best = item; bestScore = s }
  }
  return best
}

function hasCheaperSimilarCard(list: readonly CardInstance[], card: CardInstance): boolean {
  return list.some(c => c.instanceId !== card.instanceId && c.type === card.type && c.cost < card.cost)
}
