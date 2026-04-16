import { describe, it, expect } from 'vitest'
import { CARDS_BY_ID, type CardTemplate } from '../../cards/index'
import {
  BATTLE_CONSTANTS,
  type BattleState,
  type CardInstance,
} from '../types'
import {
  checkWin,
  drawCards,
  endTurn,
  initBattle,
  playCard,
  resolveDrones,
  resolveStatuses,
} from '../engine'
import { selectAction } from '../ai'
import { buildEnemyDeck, buildKestrelDeck, KESTREL_UNIQUE_CARDS, PVE_TIERS, kestrelPhaseForHull } from '../encounters'

// --- helpers ---------------------------------------------------------------

function mkDeck(ids: string[]): CardTemplate[] {
  return ids.map(id => {
    const t = CARDS_BY_ID[id]
    if (!t) throw new Error(`unknown card id: ${id}`)
    return t
  })
}

function padDeck(base: string[], pad = 'quick_shield'): string[] {
  // Ensure decks are long enough that starting hand draws don't empty the deck.
  const out = [...base]
  while (out.length < 8) out.push(pad)
  return out
}

function findInHand(state: BattleState, side: 'player' | 'enemy', id: string): CardInstance | undefined {
  return state[side].hand.find(c => c.id === id)
}

function moveToHand(state: BattleState, side: 'player' | 'enemy', id: string): BattleState {
  // Place card from deck/discard onto hand deterministically for test setup.
  const me = state[side]
  const fromDeck = me.deck.findIndex(c => c.id === id)
  if (fromDeck >= 0) {
    const card = me.deck[fromDeck]
    return {
      ...state,
      [side]: {
        ...me,
        deck: [...me.deck.slice(0, fromDeck), ...me.deck.slice(fromDeck + 1)],
        hand: [...me.hand, card],
      },
    } as BattleState
  }
  const fromDiscard = me.discard.findIndex(c => c.id === id)
  if (fromDiscard >= 0) {
    const card = me.discard[fromDiscard]
    return {
      ...state,
      [side]: {
        ...me,
        discard: [...me.discard.slice(0, fromDiscard), ...me.discard.slice(fromDiscard + 1)],
        hand: [...me.hand, card],
      },
    } as BattleState
  }
  return state
}

// --- tests -----------------------------------------------------------------

describe('initBattle', () => {
  it('creates valid state with both sides drawn to 5', () => {
    const state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    expect(state.player.hand.length).toBe(BATTLE_CONSTANTS.STARTING_HAND)
    expect(state.enemy.hand.length).toBe(BATTLE_CONSTANTS.STARTING_HAND)
    expect(state.player.hull).toBe(BATTLE_CONSTANTS.DEFAULT_PLAYER_HULL)
    expect(state.enemy.hull).toBe(BATTLE_CONSTANTS.DEFAULT_ENEMY_HULL)
    expect(state.turn).toBe(1)
    expect(state.activeSide).toBe('player')
    expect(state.winner).toBeNull()
  })

  it('assigns unique instance ids to each card', () => {
    const state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    const ids = [
      ...state.player.hand.map(c => c.instanceId),
      ...state.player.deck.map(c => c.instanceId),
      ...state.enemy.hand.map(c => c.instanceId),
      ...state.enemy.deck.map(c => c.instanceId),
    ]
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('drawCards', () => {
  it('respects hand limit of 8', () => {
    const state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    const drawn = drawCards(state, 'player', 20)
    expect(drawn.player.hand.length).toBeLessThanOrEqual(BATTLE_CONSTANTS.HAND_LIMIT)
  })

  it('reshuffles discard when deck empties', () => {
    let state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    // Move every card from deck into discard manually.
    state = {
      ...state,
      player: {
        ...state.player,
        discard: [...state.player.deck],
        deck: [],
      },
    }
    const after = drawCards(state, 'player', 1)
    // We should have drawn from the reshuffled discard.
    expect(after.player.discard.length).toBeLessThan(state.player.discard.length)
    expect(after.player.hand.length).toBe(state.player.hand.length + 1)
  })
})

describe('weapon damage', () => {
  it('reduces hull after block', () => {
    let state = initBattle(mkDeck(padDeck(['pulse_tap'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'pulse_tap')
    state = { ...state, enemy: { ...state.enemy, block: 4 } }
    const pulse = findInHand(state, 'player', 'pulse_tap')!
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: pulse.instanceId })
    // Damage 6, block absorbs 4, hull takes 2.
    expect(after.enemy.block).toBe(0)
    expect(after.enemy.hull).toBe(BATTLE_CONSTANTS.DEFAULT_ENEMY_HULL - 2)
  })

  it('Expose multiplies damage by 1.25', () => {
    let state = initBattle(mkDeck(padDeck(['rail_spike', 'pulse_tap'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'rail_spike')
    state = { ...state, player: { ...state.player, energy: 7 } }
    // Apply expose to enemy manually so the next weapon benefits.
    state = {
      ...state,
      enemy: {
        ...state.enemy,
        statuses: [{ type: 'expose', turnsRemaining: 1, stacks: 1 }],
      },
    }
    const rail = findInHand(state, 'player', 'rail_spike')!
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: rail.instanceId })
    // Rail Spike: 10 dmg * 1.25 = 12.5 → round → 13.
    expect(after.enemy.hull).toBe(BATTLE_CONSTANTS.DEFAULT_ENEMY_HULL - 13)
  })

  it('breach cannon ignores half block', () => {
    let state = initBattle(mkDeck(padDeck(['breach_cannon'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'breach_cannon')
    state = { ...state, player: { ...state.player, energy: 7 }, enemy: { ...state.enemy, block: 20 } }
    const breach = findInHand(state, 'player', 'breach_cannon')!
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: breach.instanceId })
    // Effective block = floor(20/2)=10. Damage 20 - 10 = 10 to hull.
    expect(after.enemy.hull).toBe(BATTLE_CONSTANTS.DEFAULT_ENEMY_HULL - 10)
  })
})

describe('defense', () => {
  it('adds block to caster', () => {
    let state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'quick_shield')
    const qs = findInHand(state, 'player', 'quick_shield')!
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: qs.instanceId })
    expect(after.player.block).toBe(6)
  })
})

describe('status effects', () => {
  it('Burn ticks 4 damage per turn', () => {
    let state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    state = {
      ...state,
      enemy: {
        ...state.enemy,
        statuses: [{ type: 'burn', turnsRemaining: 2, stacks: 1 }],
      },
    }
    const afterTick = resolveStatuses(state, 'enemy')
    expect(afterTick.enemy.hull).toBe(BATTLE_CONSTANTS.DEFAULT_ENEMY_HULL - BATTLE_CONSTANTS.BURN_DAMAGE_PER_TURN)
    expect(afterTick.enemy.statuses[0].turnsRemaining).toBe(1)
  })

  it('statuses expire after turnsRemaining reaches 0', () => {
    let state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    state = {
      ...state,
      enemy: { ...state.enemy, statuses: [{ type: 'lock', turnsRemaining: 1, stacks: 1 }] },
    }
    const after = resolveStatuses(state, 'enemy')
    expect(after.enemy.statuses).toEqual([])
  })

  it('hunter_logic applies drone_mark + expose to opponent', () => {
    let state = initBattle(mkDeck(padDeck(['hunter_logic'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'hunter_logic')
    state = { ...state, player: { ...state.player, energy: 7 } }
    const hl = findInHand(state, 'player', 'hunter_logic')!
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: hl.instanceId })
    const types = after.enemy.statuses.map(s => s.type)
    expect(types).toContain('expose')
    expect(types).toContain('drone_mark')
  })
})

describe('drones', () => {
  it('deploying a drone adds to player drones list', () => {
    let state = initBattle(mkDeck(padDeck(['gun_drone'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'gun_drone')
    state = { ...state, player: { ...state.player, energy: 7 } }
    const gd = findInHand(state, 'player', 'gun_drone')!
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: gd.instanceId })
    expect(after.player.drones.length).toBe(1)
    expect(after.player.drones[0].templateId).toBe('gun_drone')
  })

  it('Cold Boot prevents drone firing on its deploy turn', () => {
    let state = initBattle(mkDeck(padDeck(['gun_drone'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'gun_drone')
    state = { ...state, player: { ...state.player, energy: 7 } }
    const gd = findInHand(state, 'player', 'gun_drone')!
    const deployed = playCard(state, { type: 'play_card', cardInstanceId: gd.instanceId }).state
    const beforeHull = deployed.enemy.hull
    const { state: afterResolve } = resolveDrones(deployed, 'player')
    expect(afterResolve.enemy.hull).toBe(beforeHull) // didn't fire
  })

  it('Gun Drone fires on subsequent turn', () => {
    let state = initBattle(mkDeck(padDeck(['gun_drone'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'gun_drone')
    state = { ...state, player: { ...state.player, energy: 7 } }
    const gd = findInHand(state, 'player', 'gun_drone')!
    const deployed = playCard(state, { type: 'play_card', cardInstanceId: gd.instanceId }).state
    // Simulate advancing turn — bypass endTurn logic to isolate.
    const nextTurnState: BattleState = { ...deployed, turn: deployed.turn + 1 }
    const before = nextTurnState.enemy.hull
    const { state: afterResolve } = resolveDrones(nextTurnState, 'player')
    expect(afterResolve.enemy.hull).toBeLessThan(before)
  })
})

describe('energy', () => {
  it('increments max energy each turn, capped at 7', () => {
    let state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    // Advance 10 turns — energy should cap at 7.
    for (let i = 0; i < 20; i++) state = endTurn(state)
    expect(state.player.energy).toBeLessThanOrEqual(BATTLE_CONSTANTS.ENERGY_MAX)
    expect(state.enemy.energy).toBeLessThanOrEqual(BATTLE_CONSTANTS.ENERGY_MAX)
  })

  it('consumes energy when card is played', () => {
    let state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'quick_shield')
    const qs = findInHand(state, 'player', 'quick_shield')!
    const energyBefore = state.player.energy
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: qs.instanceId })
    expect(after.player.energy).toBe(energyBefore - 1)
  })

  it('does not play a card the player cannot afford', () => {
    let state = initBattle(mkDeck(padDeck(['breach_cannon'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'breach_cannon')
    // starting energy is 1, breach_cannon costs 4
    const bc = findInHand(state, 'player', 'breach_cannon')!
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: bc.instanceId })
    expect(after).toBe(state) // unchanged
  })
})

describe('win check + game over', () => {
  it('game ends when enemy hull reaches 0', () => {
    const state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    const zeroed: BattleState = { ...state, enemy: { ...state.enemy, hull: 0 } }
    expect(checkWin(zeroed)).toBe('player')
  })

  it('game ends when player hull reaches 0', () => {
    const state = initBattle(mkDeck(padDeck(['quick_shield'])), mkDeck(padDeck(['quick_shield'])))
    const zeroed: BattleState = { ...state, player: { ...state.player, hull: 0 } }
    expect(checkWin(zeroed)).toBe('enemy')
  })

  it('phase becomes game_over after lethal card', () => {
    let state = initBattle(mkDeck(padDeck(['pulse_tap'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'pulse_tap')
    state = { ...state, enemy: { ...state.enemy, hull: 1 } }
    const tap = findInHand(state, 'player', 'pulse_tap')!
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: tap.instanceId })
    expect(after.phase).toBe('game_over')
    expect(after.winner).toBe('player')
  })
})

describe('exhaust', () => {
  it('exhausted cards do not return to discard', () => {
    let state = initBattle(mkDeck(padDeck(['repair_foam'])), mkDeck(padDeck(['quick_shield'])))
    state = moveToHand(state, 'player', 'repair_foam')
    state = { ...state, player: { ...state.player, energy: 7, hull: 50 } }
    const rf = findInHand(state, 'player', 'repair_foam')!
    const discardBefore = state.player.discard.length
    const { state: after } = playCard(state, { type: 'play_card', cardInstanceId: rf.instanceId })
    expect(after.player.discard.length).toBe(discardBefore) // no discard add
    expect(after.player.hull).toBeGreaterThan(50)
  })
})

describe('AI selectAction', () => {
  it('selects only affordable cards', () => {
    let state = initBattle(mkDeck(padDeck(['breach_cannon', 'quick_shield'])), mkDeck(padDeck(['breach_cannon', 'quick_shield'])))
    state = { ...state, activeSide: 'enemy' }
    // Ensure enemy has both cards in hand and energy 1.
    state = moveToHand(state, 'enemy', 'breach_cannon')
    state = moveToHand(state, 'enemy', 'quick_shield')
    state = { ...state, enemy: { ...state.enemy, energy: 1 } }
    const action = selectAction(state)
    if (action.type === 'play_card') {
      const card = state.enemy.hand.find(c => c.instanceId === action.cardInstanceId)
      expect(card?.cost).toBeLessThanOrEqual(1)
    } else {
      expect(action.type).toBe('end_turn')
    }
  })

  it('prioritizes defense at low hull', () => {
    let state = initBattle(mkDeck(padDeck(['quick_shield', 'pulse_tap'])), mkDeck(padDeck(['quick_shield', 'pulse_tap'])))
    state = { ...state, activeSide: 'enemy' }
    state = moveToHand(state, 'enemy', 'quick_shield')
    state = moveToHand(state, 'enemy', 'pulse_tap')
    state = { ...state, enemy: { ...state.enemy, hull: 10, maxHull: 100, energy: 1 } }
    const action = selectAction(state)
    const played = state.enemy.hand.find(c => c.instanceId === action.cardInstanceId)
    expect(played?.id).toBe('quick_shield')
  })

  it('ends turn when no cards are affordable', () => {
    let state = initBattle(mkDeck(padDeck(['breach_cannon'])), mkDeck(padDeck(['breach_cannon'])))
    state = { ...state, activeSide: 'enemy' }
    state = moveToHand(state, 'enemy', 'breach_cannon')
    state = { ...state, enemy: { ...state.enemy, energy: 0 } }
    const action = selectAction(state)
    expect(action.type).toBe('end_turn')
  })
})

describe('encounters', () => {
  it('builds decks of the correct size for each tier', () => {
    for (const id of [1, 2, 3, 4, 5] as const) {
      const deck = buildEnemyDeck(PVE_TIERS[id])
      expect(deck.length).toBe(PVE_TIERS[id].deckSize)
    }
  })

  it('Kestrel deck contains all 3 unique boss cards', () => {
    const deck = buildKestrelDeck()
    for (const uniq of KESTREL_UNIQUE_CARDS) {
      expect(deck.some(c => c.id === uniq.id)).toBe(true)
    }
  })

  it('Kestrel phase maps by hull threshold', () => {
    expect(kestrelPhaseForHull(140).phase).toBe(1)
    expect(kestrelPhaseForHull(80).phase).toBe(2)
    expect(kestrelPhaseForHull(20).phase).toBe(3)
  })
})
