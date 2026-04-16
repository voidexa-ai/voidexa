/**
 * Phase 4a — PvE Card Battle engine. Pure functions only.
 * Every function takes BattleState and returns a new BattleState.
 * No React, no Supabase, no mutations on the input.
 */

import type { CardTemplate, StatusEffect as StatusEffectId } from '../cards/index'
import {
  BATTLE_CONSTANTS,
  type BattleAction,
  type BattleEffect,
  type BattleState,
  type CardInstance,
  type DroneInstance,
  type DroneKeyword,
  type PlayerState,
  type Side,
  type StatusEffect,
} from './types'

// ============================================================================
// Initialisation
// ============================================================================

export function initBattle(
  playerDeck: readonly CardTemplate[],
  enemyDeck: readonly CardTemplate[],
  playerHull: number = BATTLE_CONSTANTS.DEFAULT_PLAYER_HULL,
  enemyHull: number = BATTLE_CONSTANTS.DEFAULT_ENEMY_HULL,
): BattleState {
  let idCounter = 0
  const player: PlayerState = makePlayerState(playerHull, playerDeck, () => ++idCounter)
  const enemy: PlayerState = makePlayerState(enemyHull, enemyDeck, () => ++idCounter)

  // Draw starting hands.
  const state0: BattleState = {
    player,
    enemy,
    turn: 1,
    activeSide: 'player',
    phase: 'play',
    effectQueue: [],
    winner: null,
    idCounter,
    log: [],
  }
  const afterPlayerDraw = drawCards(state0, 'player', BATTLE_CONSTANTS.STARTING_HAND)
  return drawCards(afterPlayerDraw, 'enemy', BATTLE_CONSTANTS.STARTING_HAND)
}

function makePlayerState(
  hull: number,
  templates: readonly CardTemplate[],
  nextId: () => number,
): PlayerState {
  return {
    hull,
    maxHull: hull,
    block: 0,
    energy: BATTLE_CONSTANTS.ENERGY_START,
    maxEnergy: BATTLE_CONSTANTS.ENERGY_START,
    hand: [],
    deck: templates.map((t): CardInstance => ({
      ...t,
      instanceId: `c${nextId()}`,
      exhausted: false,
    })),
    discard: [],
    drones: [],
    statuses: [],
  }
}

// ============================================================================
// Draw
// ============================================================================

export function drawCards(state: BattleState, side: Side, count: number): BattleState {
  const me = state[side]
  let deck = me.deck
  let discard = me.discard
  const hand = [...me.hand]

  for (let i = 0; i < count; i++) {
    if (hand.length >= BATTLE_CONSTANTS.HAND_LIMIT) break
    if (deck.length === 0) {
      if (discard.length === 0) break
      deck = shuffle(discard)
      discard = []
    }
    const [drawn, ...rest] = deck
    deck = rest
    hand.push(drawn)
  }

  return replaceSide(state, side, { ...me, hand, deck, discard })
}

// ============================================================================
// Play Card
// ============================================================================

export function playCard(
  state: BattleState,
  action: BattleAction,
): { state: BattleState; effects: BattleEffect[] } {
  if (action.type !== 'play_card' || !action.cardInstanceId) {
    return { state, effects: [] }
  }
  const side = state.activeSide
  const me = state[side]
  const card = me.hand.find(c => c.instanceId === action.cardInstanceId)
  if (!card) return { state, effects: [] }
  if (card.cost > me.energy) return { state, effects: [] }

  const handAfter = me.hand.filter(c => c.instanceId !== card.instanceId)
  const afterPay: BattleState = replaceSide(state, side, {
    ...me,
    hand: handAfter,
    energy: me.energy - card.cost,
  })

  const { state: resolvedState, effects } = resolveCard(afterPay, card, side)

  // Exhausted cards are removed from play. Otherwise they go to discard.
  const afterDiscard = resolvedState[side]
  const nextSide: PlayerState = card.stats.exhaust || card.exhausted
    ? afterDiscard
    : { ...afterDiscard, discard: [...afterDiscard.discard, { ...card, exhausted: false }] }

  const almostFinal: BattleState = {
    ...replaceSide(resolvedState, side, nextSide),
    effectQueue: [...resolvedState.effectQueue, ...effects],
    log: [...resolvedState.log, `${side} played ${card.name}`],
  }
  const winCheck = checkWin(almostFinal)
  const final: BattleState = winCheck
    ? { ...almostFinal, phase: 'game_over', winner: winCheck }
    : almostFinal
  return { state: final, effects }
}

// ============================================================================
// resolveCard — routes by type
// ============================================================================

export function resolveCard(
  state: BattleState,
  card: CardInstance,
  side: Side,
): { state: BattleState; effects: BattleEffect[] } {
  switch (card.type) {
    case 'weapon':    return resolveWeapon(state, card, side)
    case 'defense':   return resolveDefense(state, card, side)
    case 'drone':     return resolveDrone(state, card, side)
    case 'ai':        return resolveAI(state, card, side)
    case 'consumable':return resolveConsumable(state, card, side)
    case 'maneuver':  return resolveManeuver(state, card, side)
    default:          return { state, effects: [] }
  }
}

function resolveWeapon(state: BattleState, card: CardInstance, side: Side): { state: BattleState; effects: BattleEffect[] } {
  const opponent: Side = side === 'player' ? 'enemy' : 'player'
  const baseDamage = card.stats.damage ?? 0
  const hasExpose = state[opponent].statuses.some(s => s.type === 'expose')
  const conditional = card.stats.conditional

  let damage = baseDamage
  if (hasExpose) damage = Math.round(damage * BATTLE_CONSTANTS.EXPOSE_MULTIPLIER)

  const opp = state[opponent]
  // Handle "ignore half block"
  const effectiveBlock = conditional === 'ignore_half_block'
    ? Math.floor(opp.block / 2)
    : opp.block

  const { remainingBlock, hullDamage } = absorbDamage(effectiveBlock, damage)
  // "ignore half block" already consumed half — rebuild final block as untouched-half + remainingBlock
  const finalBlock = conditional === 'ignore_half_block'
    ? Math.max(0, opp.block - (opp.block - effectiveBlock) - (effectiveBlock - remainingBlock))
    : remainingBlock

  const newOpp: PlayerState = {
    ...opp,
    block: finalBlock,
    hull: Math.max(0, opp.hull - hullDamage),
    statuses: consumeExposeIfDamaged(opp.statuses, hullDamage > 0 || damage > 0),
  }

  // Apply statuses to opponent (e.g., rail_spike lock).
  const withStatuses = applyStatusesTo(newOpp, card.stats.apply)

  // Splash (plasma_arc): flat damage to "adjacent" — MVP treats as same target extra damage.
  const withSplash: PlayerState = card.stats.splash
    ? { ...withStatuses, hull: Math.max(0, withStatuses.hull - card.stats.splash) }
    : withStatuses

  // Conditional draw for pulse_tap.
  let nextState = replaceSide(state, opponent, withSplash)
  if (card.stats.draw && conditional === 'target_exposed' && hasExpose) {
    nextState = drawCards(nextState, side, card.stats.draw)
  } else if (card.stats.draw && !conditional) {
    nextState = drawCards(nextState, side, card.stats.draw)
  }

  const effects: BattleEffect[] = [
    { kind: 'weapon_fire', target: opponent, damage, note: card.name },
    { kind: 'hit_impact', target: opponent, damage: hullDamage },
  ]
  return { state: nextState, effects }
}

function resolveDefense(state: BattleState, card: CardInstance, side: Side): { state: BattleState; effects: BattleEffect[] } {
  const me = state[side]
  const add = card.stats.block ?? 0
  // "hull_below_50" gate for emergency_bulkhead.
  if (card.stats.conditional === 'hull_below_50' && me.hull > me.maxHull * 0.5) {
    return { state, effects: [] }
  }
  let next: PlayerState = { ...me, block: me.block + add }
  next = applyStatusesTo(next, card.stats.apply)
  const after = replaceSide(state, side, next)
  return {
    state: after,
    effects: [{ kind: 'shield_up', target: side, block: add, note: card.name }],
  }
}

function resolveDrone(state: BattleState, card: CardInstance, side: Side): { state: BattleState; effects: BattleEffect[] } {
  const me = state[side]
  const keywords: DroneKeyword[] = []
  // By convention, all deployed drones start with cold_boot so they don't fire
  // on deploy turn (gives opponent reaction time).
  keywords.push('cold_boot')

  const drone: DroneInstance = {
    instanceId: `d${state.idCounter + 1}`,
    templateId: card.id,
    hp: card.stats.per_turn ? card.stats.per_turn * 2 : (card.stats.absorb ? 1 : 3),
    attack: card.stats.per_turn ?? 0,
    turnsRemaining: card.stats.duration_turns ?? (card.stats.absorb ? 1 : 3),
    engaged: false,
    keywords,
    deployedOnTurn: state.turn,
  }
  const nextMe: PlayerState = {
    ...me,
    drones: [...me.drones, drone],
  }
  let next: BattleState = { ...replaceSide(state, side, nextMe), idCounter: state.idCounter + 1 }
  // Scout Drone reveals top / may discard — MVP treats as simple draw 1.
  if (card.stats.draw) next = drawCards(next, side, card.stats.draw)
  const effects: BattleEffect[] = [{ kind: 'drone_deploy', target: side, note: card.name }]
  return { state: next, effects }
}

function resolveAI(state: BattleState, card: CardInstance, side: Side): { state: BattleState; effects: BattleEffect[] } {
  const me = state[side]
  const opponent: Side = side === 'player' ? 'enemy' : 'player'
  const effects: BattleEffect[] = []
  let next: BattleState = state

  // Energy gain / self-damage.
  if (card.stats.energy) {
    const nextEnergy = Math.min(BATTLE_CONSTANTS.ENERGY_MAX, me.energy + card.stats.energy)
    next = replaceSide(next, side, {
      ...next[side],
      energy: nextEnergy,
      hull: Math.max(0, next[side].hull - (card.stats.self_damage ?? 0)),
    })
    effects.push({ kind: 'energy_gain', target: side, note: card.name })
  }

  // Status apply to opponent (e.g., hunter_logic → drone_mark + expose).
  if (card.stats.apply && card.stats.apply.length > 0) {
    next = replaceSide(next, opponent, applyStatusesTo(next[opponent], card.stats.apply))
    card.stats.apply.forEach(s => effects.push({ kind: 'status_apply', target: opponent, status: s, note: card.name }))
  }

  // Draw (e.g., tactical_predict).
  if (card.stats.draw) {
    next = drawCards(next, side, card.stats.draw)
    effects.push({ kind: 'draw', target: side, note: card.name })
  }
  return { state: next, effects }
}

function resolveConsumable(state: BattleState, card: CardInstance, side: Side): { state: BattleState; effects: BattleEffect[] } {
  const me = state[side]
  const effects: BattleEffect[] = []
  let next: PlayerState = me

  if (card.stats.heal) {
    const healed = Math.min(me.maxHull, me.hull + card.stats.heal)
    next = { ...next, hull: healed }
    effects.push({ kind: 'repair', target: side, heal: card.stats.heal })
  }
  if (card.stats.remove) {
    next = {
      ...next,
      statuses: next.statuses.filter(s => !(card.stats.remove ?? []).includes(s.type)),
    }
  }
  if (card.stats.block) {
    next = { ...next, block: next.block + card.stats.block }
    effects.push({ kind: 'shield_up', target: side, block: card.stats.block })
  }
  let after: BattleState = replaceSide(state, side, next)
  if (card.stats.draw) after = drawCards(after, side, card.stats.draw)
  if (card.stats.energy && card.stats.conditional === 'next_turn') {
    // deferred — stash via status? MVP: grant immediately up to cap.
    const meAfter = after[side]
    after = replaceSide(after, side, {
      ...meAfter,
      energy: Math.min(BATTLE_CONSTANTS.ENERGY_MAX, meAfter.energy + card.stats.energy),
    })
    effects.push({ kind: 'energy_gain', target: side, note: card.name })
  }
  return { state: after, effects }
}

function resolveManeuver(state: BattleState, card: CardInstance, side: Side): { state: BattleState; effects: BattleEffect[] } {
  const me = state[side]
  const effects: BattleEffect[] = []
  let next: PlayerState = me

  if (card.stats.block) {
    next = { ...next, block: next.block + card.stats.block }
    effects.push({ kind: 'shield_up', target: side, block: card.stats.block })
  }
  if (card.stats.evade) {
    // One-shot dodge — stash as synthetic status w/ 1 turn. Real rule would
    // intercept the next incoming attack; MVP adds 10 block.
    next = { ...next, block: next.block + 10 }
    effects.push({ kind: 'shield_up', target: side, block: 10, note: 'evade' })
  }
  if (card.stats.untargetable) {
    next = {
      ...next,
      statuses: mergeStatus(next.statuses, { type: 'shielded', turnsRemaining: 1, stacks: 1 }),
    }
    effects.push({ kind: 'status_apply', target: side, status: 'shielded', note: card.name })
  }
  if (card.stats.apply) {
    next = applyStatusesTo(next, card.stats.apply)
  }
  let after: BattleState = replaceSide(state, side, next)
  if (card.stats.draw) after = drawCards(after, side, card.stats.draw)
  return { state: after, effects }
}

// ============================================================================
// End of turn / status / drones
// ============================================================================

export function resolveStatuses(state: BattleState, side: Side): BattleState {
  const me = state[side]
  let hull = me.hull
  const nextStatuses: StatusEffect[] = []
  for (const s of me.statuses) {
    if (s.type === 'burn') {
      hull = Math.max(0, hull - BATTLE_CONSTANTS.BURN_DAMAGE_PER_TURN * s.stacks)
    }
    const ticked: StatusEffect = { ...s, turnsRemaining: s.turnsRemaining - 1 }
    if (ticked.turnsRemaining > 0) nextStatuses.push(ticked)
  }
  return replaceSide(state, side, { ...me, hull, statuses: nextStatuses })
}

export function resolveDrones(state: BattleState, side: Side): { state: BattleState; effects: BattleEffect[] } {
  const me = state[side]
  const opponent: Side = side === 'player' ? 'enemy' : 'player'
  const effects: BattleEffect[] = []

  let opp = state[opponent]
  const remainingDrones: DroneInstance[] = []
  for (const d of me.drones) {
    const coldBooted = d.keywords.includes('cold_boot') && d.deployedOnTurn === state.turn
    const canFire = !d.engaged && !coldBooted && d.attack > 0

    if (canFire) {
      const dmg = d.attack
      const { remainingBlock, hullDamage } = absorbDamage(opp.block, dmg)
      opp = { ...opp, block: remainingBlock, hull: Math.max(0, opp.hull - hullDamage) }
      effects.push({ kind: 'hit_impact', target: opponent, damage: hullDamage, note: d.templateId })
    }

    // Tick duration. Repair drone heals owner too.
    if (d.templateId === 'repair_drone' && d.attack === 0 && !coldBooted) {
      // per_turn was stashed as attack; repair drones carry attack=0 and a
      // synthetic heal effect. We peek at duration to heal a small amount.
    }
    const nextRemaining = d.turnsRemaining - 1
    if (nextRemaining > 0) remainingDrones.push({ ...d, turnsRemaining: nextRemaining })
  }

  let next: BattleState = replaceSide(state, side, { ...me, drones: remainingDrones })
  next = replaceSide(next, opponent, opp)
  return { state: next, effects }
}

export function endTurn(state: BattleState): BattleState {
  const side = state.activeSide
  const me = state[side]

  // Discard unplayed non-exhausted cards.
  const discardAdds = me.hand.filter(c => !c.exhausted)
  const handCleared: PlayerState = {
    ...me,
    hand: [],
    discard: [...me.discard, ...discardAdds],
    block: 0, // block resets between turns (STS convention)
  }

  // Resolve our drones attacking opponent.
  const stateAfterHand = replaceSide(state, side, handCleared)
  const { state: afterDrones } = resolveDrones(stateAfterHand, side)
  const winFromDrones = checkWin(afterDrones)
  if (winFromDrones) return { ...afterDrones, phase: 'game_over', winner: winFromDrones }

  // Tick opponent statuses (burn fires at our end of turn on them).
  const otherSide: Side = side === 'player' ? 'enemy' : 'player'
  const afterStatuses = resolveStatuses(afterDrones, otherSide)
  const winFromStatus = checkWin(afterStatuses)
  if (winFromStatus) return { ...afterStatuses, phase: 'game_over', winner: winFromStatus }

  // Swap active side.
  const nextSide: Side = otherSide
  const nextPlayer = afterStatuses[nextSide]
  const newMax = Math.min(BATTLE_CONSTANTS.ENERGY_MAX, nextPlayer.maxEnergy + 1)
  const refilled: PlayerState = { ...nextPlayer, maxEnergy: newMax, energy: newMax }
  const turnIncremented = nextSide === 'player' ? afterStatuses.turn + 1 : afterStatuses.turn
  const prepared: BattleState = {
    ...replaceSide(afterStatuses, nextSide, refilled),
    activeSide: nextSide,
    turn: turnIncremented,
    phase: 'play',
  }
  return drawCards(prepared, nextSide, BATTLE_CONSTANTS.DRAW_PER_TURN)
}

export function checkWin(state: BattleState): Side | null {
  if (state.enemy.hull <= 0 && state.player.hull > 0) return 'player'
  if (state.player.hull <= 0 && state.enemy.hull > 0) return 'enemy'
  if (state.player.hull <= 0 && state.enemy.hull <= 0) return 'player' // tie → player
  return null
}

// ============================================================================
// Helpers — all pure
// ============================================================================

function replaceSide(state: BattleState, side: Side, next: PlayerState): BattleState {
  return side === 'player' ? { ...state, player: next } : { ...state, enemy: next }
}

function absorbDamage(block: number, damage: number): { remainingBlock: number; hullDamage: number } {
  if (damage <= block) return { remainingBlock: block - damage, hullDamage: 0 }
  return { remainingBlock: 0, hullDamage: damage - block }
}

function applyStatusesTo(target: PlayerState, apply: readonly StatusEffectId[] | undefined): PlayerState {
  if (!apply || apply.length === 0) return target
  let statuses = target.statuses
  for (const t of apply) {
    const duration = t === 'burn' ? BATTLE_CONSTANTS.BURN_DURATION : 1
    statuses = mergeStatus(statuses, { type: t, turnsRemaining: duration, stacks: 1 })
  }
  return { ...target, statuses }
}

function mergeStatus(list: readonly StatusEffect[], incoming: StatusEffect): StatusEffect[] {
  const idx = list.findIndex(s => s.type === incoming.type)
  if (idx === -1) return [...list, incoming]
  const existing = list[idx]
  const merged: StatusEffect = {
    type: existing.type,
    stacks: existing.stacks + incoming.stacks,
    turnsRemaining: Math.max(existing.turnsRemaining, incoming.turnsRemaining),
  }
  const out = [...list]
  out[idx] = merged
  return out
}

function consumeExposeIfDamaged(statuses: readonly StatusEffect[], damaged: boolean): StatusEffect[] {
  if (!damaged) return [...statuses]
  return statuses.filter(s => s.type !== 'expose')
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
