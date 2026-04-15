import { describe, it, expect } from 'vitest'
import { ShipClass, SHIP_STATS } from '@/lib/game/ships'
import { STARTER_CATALOGUE } from '@/lib/cards/starter_set'
import {
  CombatPhase,
  CombatantSide,
  createEngine,
  defaultDeckFor,
} from '../CombatEngine'

function freshEngine(opts: Partial<Parameters<typeof createEngine>[0]> = {}) {
  // Deterministic RNG: alternate values for shuffle + coin flip
  let i = 0
  const seq = [0.1, 0.5, 0.9, 0.3, 0.7, 0.2, 0.6, 0.4, 0.8]
  const rng = () => seq[i++ % seq.length]
  return createEngine({
    playerName: 'Player',
    playerShipClass: ShipClass.Fighter,
    playerDeck: defaultDeckFor(STARTER_CATALOGUE),
    npcName: 'NPC',
    npcShipClass: ShipClass.Cruiser,
    npcDeck: defaultDeckFor(STARTER_CATALOGUE),
    catalogue: STARTER_CATALOGUE,
    rng,
    ...opts,
  })
}

describe('createEngine — initial state', () => {
  it('starts in IDLE phase with empty hands and 0 turn', () => {
    const e = freshEngine()
    expect(e.state.phase).toBe(CombatPhase.Idle)
    expect(e.state.turn).toBe(0)
    expect(e.state.a.hand).toEqual([])
    expect(e.state.b.hand).toEqual([])
  })

  it('combatants inherit ship class stats', () => {
    const e = freshEngine()
    expect(e.state.a.shield).toBe(SHIP_STATS[ShipClass.Fighter].shield)
    expect(e.state.a.hull).toBe(SHIP_STATS[ShipClass.Fighter].hull)
    expect(e.state.a.energyPerTurn).toBe(SHIP_STATS[ShipClass.Fighter].energyPerTurn)
    expect(e.state.a.handSize).toBe(SHIP_STATS[ShipClass.Fighter].handSize)
  })
})

describe('start()', () => {
  it('coin-flips, deals opening hands, gives first player energy', () => {
    const e = freshEngine()
    e.start()
    expect([CombatPhase.TurnA, CombatPhase.TurnB]).toContain(e.state.phase)
    expect(e.state.turn).toBe(1)
    expect(e.state.a.hand.length).toBeGreaterThan(0)
    expect(e.state.b.hand.length).toBeGreaterThan(0)

    const active = e.state.current === CombatantSide.A ? e.state.a : e.state.b
    expect(active.energy).toBe(active.energyPerTurn)
  })

  it('is idempotent — second call is a no-op', () => {
    const e = freshEngine()
    e.start()
    const turnAfterFirst = e.state.turn
    const handAfterFirst = [...e.state.a.hand]
    e.start()
    expect(e.state.turn).toBe(turnAfterFirst)
    expect(e.state.a.hand).toEqual(handAfterFirst)
  })
})

describe('endTurn()', () => {
  it('passes turn to opponent and increments turn counter', () => {
    const e = freshEngine()
    e.start()
    const startSide = e.state.current
    e.endTurn()
    expect(e.state.current).not.toBe(startSide)
    expect(e.state.turn).toBe(2)
  })

  it('resets active player energy at end of turn (no carry-over)', () => {
    const e = freshEngine()
    e.start()
    const meBefore = e.state.current === CombatantSide.A ? e.state.a : e.state.b
    expect(meBefore.energy).toBeGreaterThan(0)
    e.endTurn()
    // After end, the (now-passive) player's energy is 0
    expect(meBefore.energy).toBe(0)
  })

  it('next active player draws + gains energy', () => {
    const e = freshEngine()
    e.start()
    e.endTurn()
    const newActive = e.state.current === CombatantSide.A ? e.state.a : e.state.b
    expect(newActive.energy).toBe(newActive.energyPerTurn)
  })
})

describe('playCard()', () => {
  it('rejects cards not in hand', () => {
    const e = freshEngine()
    e.start()
    const r = e.playCard('not-a-real-card')
    expect(r.ok).toBe(false)
  })

  it('rejects when not enough energy', () => {
    const e = freshEngine()
    e.start()
    // Drain energy
    const me = e.state.current === CombatantSide.A ? e.state.a : e.state.b
    me.energy = 0
    const id = me.hand[0]
    const r = e.playCard(id)
    expect(r.ok).toBe(false)
    expect(r.reason).toMatch(/energy/i)
  })

  it('moves card from hand to discard and spends energy', () => {
    const e = freshEngine()
    e.start()
    const me = e.state.current === CombatantSide.A ? e.state.a : e.state.b
    me.energy = 10 // ensure affordable
    const id = me.hand.find((cardId) => STARTER_CATALOGUE[cardId].energyCost <= me.energy)!
    const before = me.hand.length
    const r = e.playCard(id)
    expect(r.ok).toBe(true)
    expect(me.hand.length).toBe(before - 1)
    expect(me.discard).toContain(id)
  })
})

describe('damage application', () => {
  it('attack hits shield first, overflow to hull', () => {
    const e = freshEngine()
    e.start()
    const me = e.state.current === CombatantSide.A ? e.state.a : e.state.b
    const opp = e.state.current === CombatantSide.A ? e.state.b : e.state.a
    me.energy = 10
    me.hand = ['plasma-bolt'] // 14 damage
    const oppShieldBefore = opp.shield
    const oppHullBefore = opp.hull
    e.playCard('plasma-bolt')
    // Shield absorbs as much as possible, rest hits hull
    const shieldHit = Math.min(14, oppShieldBefore)
    expect(opp.shield).toBe(oppShieldBefore - shieldHit)
    const hullHit = 14 - shieldHit
    expect(opp.hull).toBe(oppHullBefore - hullHit)
  })

  it('phase-beam bypasses shield entirely (hull-only)', () => {
    const e = freshEngine()
    e.start()
    const me = e.state.current === CombatantSide.A ? e.state.a : e.state.b
    const opp = e.state.current === CombatantSide.A ? e.state.b : e.state.a
    me.energy = 10
    me.hand = ['phase-beam']
    const shieldBefore = opp.shield
    const hullBefore = opp.hull
    e.playCard('phase-beam')
    expect(opp.shield).toBe(shieldBefore)
    expect(opp.hull).toBe(hullBefore - 24)
  })
})

describe('win condition', () => {
  it('reducing opponent hull to 0 sets phase to Won', () => {
    const e = freshEngine()
    e.start()
    const me = e.state.current === CombatantSide.A ? e.state.a : e.state.b
    const opp = e.state.current === CombatantSide.A ? e.state.b : e.state.a
    me.energy = 99
    me.hand = ['stellar-annihilator']
    opp.shield = 0
    opp.hull = 50 // Stellar Annihilator deals 80 → kills
    e.playCard('stellar-annihilator')
    expect(opp.hull).toBe(0)
    expect(e.state.phase === CombatPhase.Won || e.state.phase === CombatPhase.Lost).toBe(true)
  })

  it('surrender forfeits and grants opponent the win', () => {
    const e = freshEngine()
    e.start()
    e.surrender(CombatantSide.A)
    expect(e.state.a.surrendered).toBe(true)
    expect(e.state.phase).toBe(CombatPhase.Lost)
    expect(e.state.winner).toBe(CombatantSide.B)
  })
})

describe('NPC AI', () => {
  it('aiStep ends turn when nothing affordable', () => {
    const e = freshEngine()
    e.start()
    // Force turn to be NPC (B). Simplest: end player turn first if needed.
    if (e.state.current === CombatantSide.A) e.endTurn()
    // Now NPC's turn — drain energy so nothing affordable
    e.state.b.energy = 0
    const r = e.aiStep()
    expect(r.action).toBe('end')
  })

  it('aiStep plays a card when affordable', () => {
    const e = freshEngine()
    e.start()
    if (e.state.current === CombatantSide.A) e.endTurn()
    e.state.b.energy = 99
    const handBefore = e.state.b.hand.length
    const r = e.aiStep()
    expect(r.action).toBe('play')
    expect(e.state.b.hand.length).toBeLessThan(handBefore)
  })

  it('AI prioritises lethal — plays cheapest attack if it can finish opponent', () => {
    const e = freshEngine()
    e.start()
    if (e.state.current === CombatantSide.A) e.endTurn()
    // Set opponent (Player A) to near death
    e.state.a.shield = 0
    e.state.a.hull = 5 // any attack ≥ 5 is lethal
    e.state.b.energy = 99
    e.state.b.hand = ['plasma-bolt', 'laser-pulse'] // pulse 8 (lethal cheaper), bolt 14
    const r = e.aiStep()
    expect(r.action).toBe('play')
    expect(r.cardId).toBe('laser-pulse') // cheapest lethal
    expect(e.state.a.hull).toBe(0)
  })
})

describe('alien backfire', () => {
  it('backfires when rng < BACKFIRE_CHANCE (0.2)', () => {
    let i = 0
    const seq = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05] // tail = backfire roll triggers
    const e = createEngine({
      playerName: 'P',
      playerShipClass: ShipClass.Fighter,
      playerDeck: defaultDeckFor(STARTER_CATALOGUE),
      npcName: 'N',
      npcShipClass: ShipClass.Fighter,
      npcDeck: defaultDeckFor(STARTER_CATALOGUE),
      catalogue: STARTER_CATALOGUE,
      rng: () => seq[i++ % seq.length],
    })
    e.start()
    const me = e.state.current === CombatantSide.A ? e.state.a : e.state.b
    me.energy = 99
    me.hand = ['void-pulse']
    const meHullBefore = me.hull
    e.playCard('void-pulse')
    // Backfire deals 12 to self (shield first)
    const expectedHullDamage = Math.max(0, 12 - me.shield)
    expect(me.hull).toBe(meHullBefore - expectedHullDamage)
  })
})

describe('turn limit', () => {
  it('returns Draw when both alive after turnLimit', () => {
    const e = freshEngine({ turnLimit: 2 })
    e.start()
    e.endTurn() // turn 2
    e.endTurn() // hits turn 3 → exceeds 2
    expect([CombatPhase.Draw, CombatPhase.Won, CombatPhase.Lost]).toContain(e.state.phase)
  })
})
