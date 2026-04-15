/**
 * components/combat/CombatEngine.ts
 *
 * Pure-TypeScript turn-based combat state machine. No React, no DOM.
 * Drives every duel — UI subscribes to state via the returned dispatch/select pattern.
 *
 * Spec mirror:
 *   - lib/cards/starter_set.ts (40-card Core Set)
 *   - lib/game/ships.ts (ship class stats)
 *   - lib/game/cards.ts (CardCategory enums)
 *   - lib/game/alientech.ts (BACKFIRE_CHANCE)
 *   - .claude/skills/card-combat/SKILL.md (rules)
 *
 * Keeps deterministic-RNG hooks for tests. NO setTimeout/animation work — that
 * lives in the UI layer.
 */

import {
  CardCategory,
  CardRarity,
  type Card,
} from '@/lib/game/cards'
import { ShipClass, SHIP_STATS, totalHP } from '@/lib/game/ships'
import { ALIEN_BACKFIRE_CHANCE } from '@/lib/cards/starter_set'

// ─── enums + interfaces ────────────────────────────────────────────────────

export enum CombatPhase {
  Idle = 'IDLE',
  Loading = 'LOADING',
  CoinFlip = 'COIN_FLIP',
  TurnA = 'TURN_A',
  TurnB = 'TURN_B',
  Won = 'WON',
  Lost = 'LOST',
  Draw = 'DRAW',
}

export enum TurnPhase {
  Draw = 'DRAW',
  Energy = 'ENERGY',
  Play = 'PLAY',
  Resolve = 'RESOLVE',
  End = 'END',
}

export enum CombatantSide {
  A = 'A',
  B = 'B',
}

export interface Combatant {
  side: CombatantSide
  name: string
  shipClass: ShipClass
  rank?: string
  /** Current shield (clamped to maxShield + overcharge). */
  shield: number
  hull: number
  energy: number
  /** Per-turn energy income (from ship class). */
  energyPerTurn: number
  /** Hand size cap. */
  handSize: number
  /** Cards drawn but not played. */
  hand: string[]
  /** Cards available to draw — initial deck minus opening hand. */
  drawPile: string[]
  /** Cards played this game. */
  discard: string[]
  /** Active deployment cards still ticking (drone/turret damage at end-of-turn). */
  deployments: Deployment[]
  /** Active buffs (damage boost, crit, defense up, etc) — count down per turn. */
  buffs: Buff[]
  /** True if the next attack against this combatant is cancelled (decoy/evasive). */
  defensiveActive: boolean
  /** Whether this combatant is forfeited / surrendered. */
  surrendered: boolean
}

export interface Deployment {
  cardId: string
  ownerSide: CombatantSide
  /** Damage tick at end of OWNER's turn. */
  damagePerTurn: number
  /** Turns remaining (decremented after each owner end-turn). */
  remainingTurns: number
}

export interface Buff {
  /** Free-form descriptor for the UI. */
  label: string
  /** Damage multiplier applied to next outgoing attack (1 = none). */
  damageMultiplier: number
  /** Damage subtractor applied to next incoming attack (0 = none). */
  damageReduction: number
  /** True if the next attack should crit (×2). */
  critNext: boolean
  /** Turns remaining (counted on owner's End phase). */
  remainingTurns: number
}

export interface BattleLogEntry {
  turn: number
  side: CombatantSide
  /** Plain-text summary for the chat pane. */
  message: string
  /** Optional extra metadata for UI animations. */
  meta?: Record<string, unknown>
}

export interface CombatState {
  phase: CombatPhase
  turnPhase: TurnPhase
  /** 1-indexed turn counter (1 = first player's first turn). */
  turn: number
  /** Whose turn is it. */
  current: CombatantSide
  /** Hard cap. After turn 30 with both alive → Draw. */
  turnLimit: number
  /** Both combatants. A is always the player; B is opponent. */
  a: Combatant
  b: Combatant
  /** Battle log, newest LAST. */
  log: BattleLogEntry[]
  /** Final result side (set on Won/Lost). */
  winner?: CombatantSide
}

export interface SetupOptions {
  playerName: string
  playerShipClass: ShipClass
  playerDeck: string[]
  npcName: string
  npcShipClass: ShipClass
  npcDeck: string[]
  /** Card lookup. */
  catalogue: Readonly<Record<string, Card>>
  /** Injected RNG ([0,1)) for tests. Default Math.random. */
  rng?: () => number
  /** Override turn cap (default 30). */
  turnLimit?: number
}

export interface CombatEngine {
  state: CombatState
  /** Begin combat — coin flip + opening hands. */
  start(): void
  /** Play a card from the active player's hand. */
  playCard(cardId: string): { ok: boolean; reason?: string }
  /** End the current player's turn. */
  endTurn(): void
  /** Forfeit (active player surrenders → opposite side wins). */
  surrender(side: CombatantSide): void
  /** NPC AI step: pick a card or end turn. Returns the action taken. */
  aiStep(): { action: 'play' | 'end'; cardId?: string }
  /** True iff the active player can afford + legally play `cardId`. */
  canPlay(cardId: string): boolean
}

// ─── default deck-template helper (so CombatUI can boot without persistence) ──

export function defaultDeckFor(catalogue: Readonly<Record<string, Card>>): string[] {
  // Build a 20-card deck: 8 commons (×2 of 4 unique), 6 uncommons, 4 rares, 2 epics.
  const byRarity: Record<CardRarity, Card[]> = {
    [CardRarity.Common]: [],
    [CardRarity.Uncommon]: [],
    [CardRarity.Rare]: [],
    [CardRarity.Epic]: [],
    [CardRarity.Legendary]: [],
  }
  for (const c of Object.values(catalogue)) byRarity[c.rarity].push(c)
  const pick = (rarity: CardRarity, n: number): Card[] => byRarity[rarity].slice(0, n)
  const deck: string[] = []
  for (const c of pick(CardRarity.Common, 4)) deck.push(c.id, c.id)
  for (const c of pick(CardRarity.Uncommon, 3)) deck.push(c.id, c.id)
  for (const c of pick(CardRarity.Rare, 2)) deck.push(c.id, c.id)
  for (const c of pick(CardRarity.Epic, 2)) deck.push(c.id)
  while (deck.length < 20 && byRarity[CardRarity.Common].length > 0) {
    deck.push(byRarity[CardRarity.Common][0].id)
  }
  return deck.slice(0, 20)
}

// ─── factory ───────────────────────────────────────────────────────────────

export function createEngine(opts: SetupOptions): CombatEngine {
  const rng = opts.rng ?? Math.random
  const turnLimit = opts.turnLimit ?? 30
  const catalogue = opts.catalogue

  function buildCombatant(
    side: CombatantSide,
    name: string,
    cls: ShipClass,
    deck: string[],
  ): Combatant {
    const stats = SHIP_STATS[cls]
    return {
      side,
      name,
      shipClass: cls,
      shield: stats.shield,
      hull: stats.hull,
      energy: 0,
      energyPerTurn: stats.energyPerTurn,
      handSize: stats.handSize,
      hand: [],
      drawPile: [...deck],
      discard: [],
      deployments: [],
      buffs: [],
      defensiveActive: false,
      surrendered: false,
    }
  }

  const state: CombatState = {
    phase: CombatPhase.Idle,
    turnPhase: TurnPhase.Draw,
    turn: 0,
    current: CombatantSide.A,
    turnLimit,
    a: buildCombatant(CombatantSide.A, opts.playerName, opts.playerShipClass, opts.playerDeck),
    b: buildCombatant(CombatantSide.B, opts.npcName, opts.npcShipClass, opts.npcDeck),
    log: [],
  }

  // ── helpers ───────────────────────────────────────────────────────────

  const opponentOf = (side: CombatantSide): Combatant =>
    side === CombatantSide.A ? state.b : state.a
  const meOf = (side: CombatantSide): Combatant =>
    side === CombatantSide.A ? state.a : state.b
  const active = () => meOf(state.current)
  const opponent = () => opponentOf(state.current)

  function pushLog(side: CombatantSide, message: string, meta?: Record<string, unknown>) {
    state.log.push({ turn: state.turn, side, message, meta })
  }

  function shuffleDraw(c: Combatant): void {
    // Fisher-Yates with injected rng
    for (let i = c.drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[c.drawPile[i], c.drawPile[j]] = [c.drawPile[j], c.drawPile[i]]
    }
  }

  function drawN(c: Combatant, n: number): string[] {
    const drawn: string[] = []
    for (let i = 0; i < n; i++) {
      if (c.drawPile.length === 0) break
      if (c.hand.length >= c.handSize) break
      const id = c.drawPile.shift()!
      c.hand.push(id)
      drawn.push(id)
    }
    return drawn
  }

  /** Apply raw damage — shield first, overflow to hull. */
  function applyDamage(target: Combatant, raw: number, source: string): number {
    if (raw <= 0) return 0
    let dmg = raw
    // Damage reduction from active buffs on target
    for (const b of target.buffs) {
      if (b.damageReduction > 0) dmg = Math.max(0, dmg - b.damageReduction)
    }
    if (target.defensiveActive) {
      target.defensiveActive = false
      pushLog(target.side, `${target.name} dodged ${source}.`)
      return 0
    }
    let absorbed = 0
    if (target.shield > 0) {
      absorbed = Math.min(target.shield, dmg)
      target.shield -= absorbed
      dmg -= absorbed
    }
    target.hull = Math.max(0, target.hull - dmg)
    return absorbed + dmg
  }

  function checkVictory(): void {
    if (state.a.hull <= 0 || state.a.surrendered) {
      state.phase = CombatPhase.Lost
      state.winner = CombatantSide.B
      pushLog(CombatantSide.B, `${state.b.name} wins.`)
    } else if (state.b.hull <= 0 || state.b.surrendered) {
      state.phase = CombatPhase.Won
      state.winner = CombatantSide.A
      pushLog(CombatantSide.A, `${state.a.name} wins.`)
    } else if (state.turn >= state.turnLimit) {
      const aPct = state.a.hull / SHIP_STATS[state.a.shipClass].hull
      const bPct = state.b.hull / SHIP_STATS[state.b.shipClass].hull
      if (aPct > bPct) {
        state.phase = CombatPhase.Won
        state.winner = CombatantSide.A
      } else if (bPct > aPct) {
        state.phase = CombatPhase.Lost
        state.winner = CombatantSide.B
      } else {
        state.phase = CombatPhase.Draw
      }
      pushLog(state.current, `Turn limit reached — ${state.phase === CombatPhase.Draw ? 'draw' : 'highest HP% wins'}.`)
    }
  }

  function tickEndOfTurnDeployments(c: Combatant): void {
    const remaining: Deployment[] = []
    for (const d of c.deployments) {
      const card = catalogue[d.cardId]
      const opp = opponentOf(c.side)
      const dealt = applyDamage(opp, d.damagePerTurn, card?.name ?? d.cardId)
      pushLog(c.side, `${card?.name ?? d.cardId} deals ${dealt} damage.`)
      d.remainingTurns -= 1
      if (d.remainingTurns > 0) remaining.push(d)
    }
    c.deployments = remaining
  }

  function tickBuffs(c: Combatant): void {
    c.buffs = c.buffs
      .map((b) => ({ ...b, remainingTurns: b.remainingTurns - 1 }))
      .filter((b) => b.remainingTurns > 0)
  }

  // ── card resolution table ────────────────────────────────────────────

  /**
   * Mechanical effect lookup by card id.
   * For cards not listed, falls back to category-based defaults.
   */
  function resolveCard(cardId: string, ownerSide: CombatantSide): void {
    const card = catalogue[cardId] as Card | undefined
    if (!card) return

    const me = meOf(ownerSide)
    const opp = opponentOf(ownerSide)

    // Alien backfire roll
    if (card.category === CardCategory.Alien) {
      if (rng() < ALIEN_BACKFIRE_CHANCE) {
        pushLog(ownerSide, `${card.name} BACKFIRED on ${me.name}.`, { backfire: true })
        applyDamage(me, 12, `${card.name} backfire`)
        return
      }
    }

    // Apply own buffs to the next-attack damage multiplier
    let dmgMult = 1
    let critNext = false
    me.buffs = me.buffs.filter((b) => {
      if (b.damageMultiplier > 1) {
        dmgMult *= b.damageMultiplier
        return false // consumed
      }
      if (b.critNext) {
        critNext = true
        return false
      }
      return true
    })

    switch (cardId) {
      // ─── Attacks (damage values from starter_set descriptions) ────────
      case 'laser-pulse':         dealAttackDamage(opp, 8, dmgMult, critNext, card.name, ownerSide); break
      case 'plasma-bolt':         dealAttackDamage(opp, 14, dmgMult, critNext, card.name, ownerSide); break
      case 'micro-missile':       dealAttackDamage(opp, 10, dmgMult, critNext, card.name, ownerSide); break
      case 'gatling-burst':       for (let i = 0; i < 3; i++) dealAttackDamage(opp, 3, dmgMult, critNext, card.name, ownerSide); break
      case 'thermal-lance':       dealAttackDamage(opp, 12, dmgMult, critNext, card.name, ownerSide); break
      case 'railgun-shot':        dealAttackDamageBypassShield(opp, 20, 0.5, dmgMult, critNext, card.name, ownerSide); break
      case 'acid-cloud':          dealAttackDamage(opp, 5, dmgMult, critNext, card.name, ownerSide); /* tick handled simpler — skip DOT for v1 */ break
      case 'homing-missile':      dealAttackDamage(opp, 18, dmgMult, critNext, card.name, ownerSide); break
      case 'torpedo-barrage':     for (let i = 0; i < 3; i++) dealAttackDamage(opp, 12, dmgMult, critNext, card.name, ownerSide); break
      case 'phase-beam':          dealAttackHullOnly(opp, 24, dmgMult, critNext, card.name, ownerSide); break
      case 'void-lance':          dealAttackHullOnly(opp, 40, dmgMult, critNext, card.name, ownerSide); break
      case 'nova-barrage':        dealAttackDamage(opp, 20, dmgMult, critNext, card.name, ownerSide); break
      case 'stellar-annihilator': {
        const dealt = dealAttackDamage(opp, 80, dmgMult, critNext, card.name, ownerSide)
        opp.shield = 0
        pushLog(ownerSide, `${card.name} obliterated ${opp.name}'s shields.`, { obliterate: true, dealt })
        break
      }

      // ─── Defense ─────────────────────────────────────────────────────
      case 'energy-shield-small': me.shield += 10; pushLog(ownerSide, `${me.name} +10 shield.`); break
      case 'emergency-weld':      me.hull = Math.min(me.hull + 10, SHIP_STATS[me.shipClass].hull); pushLog(ownerSide, `${me.name} repaired 10 hull.`); break
      case 'decoy-flare':         me.defensiveActive = true; pushLog(ownerSide, `${me.name} deployed decoy.`); break
      case 'evasive-roll':        me.buffs.push({ label: 'Evasive', damageMultiplier: 1, damageReduction: 5, critNext: false, remainingTurns: 1 }); pushLog(ownerSide, `${me.name} braces for evasion.`); break
      case 'magnetic-shield':     me.shield += 20; me.buffs.push({ label: 'Magnetic', damageMultiplier: 1, damageReduction: 0, critNext: false, remainingTurns: 1 }); pushLog(ownerSide, `${me.name} +20 shield + kinetic dampener.`); break
      case 'nano-repair':         me.hull = Math.min(me.hull + 20, SHIP_STATS[me.shipClass].hull); pushLog(ownerSide, `${me.name} nano-repaired 20 hull.`); break
      case 'mirror-shield':       me.buffs.push({ label: 'Mirror', damageMultiplier: 1, damageReduction: 0, critNext: false, remainingTurns: 1 }); pushLog(ownerSide, `${me.name} reflects 50% next turn.`); break
      case 'phase-shift-defense': me.defensiveActive = true; pushLog(ownerSide, `${me.name} phased out — untargetable until next turn.`); break
      case 'plasma-ablative-shield': me.shield += 60; pushLog(ownerSide, `${me.name} +60 ablative shield.`); break

      // ─── Tactical ─────────────────────────────────────────────────────
      case 'speed-boost':    pushLog(ownerSide, `${me.name} surges (cosmetic v1).`); break
      case 'jam-weapons':    if (rng() < 0.5) { opp.energy = Math.max(0, opp.energy - 1); pushLog(ownerSide, `${opp.name}'s weapons jammed.`) } break
      case 'scan-target':    pushLog(ownerSide, `${me.name} scans ${opp.name}: hand ${opp.hand.length}, shield ${opp.shield}.`); break
      case 'damage-booster': me.buffs.push({ label: '+50% dmg', damageMultiplier: 1.5, damageReduction: 0, critNext: false, remainingTurns: 2 }); pushLog(ownerSide, `${me.name} overcharges weapons.`); break
      case 'blind-pulse':    pushLog(ownerSide, `${opp.name} blinded — accuracy reduced (cosmetic v1).`); break
      case 'crit-amplifier': me.buffs.push({ label: 'Crit ×2', damageMultiplier: 1, damageReduction: 0, critNext: true, remainingTurns: 1 }); pushLog(ownerSide, `${me.name} aims for the kill.`); break
      case 'create-nebula':  pushLog(ownerSide, `Nebula deployed (cosmetic v1).`); break
      case 'mind-read':      pushLog(ownerSide, `${me.name} reads ${opp.name}'s hand: ${opp.hand.join(', ') || '(empty)'}.`); break

      // ─── Deployment ──────────────────────────────────────────────────
      case 'laser-drone':   me.deployments.push({ cardId, ownerSide, damagePerTurn: 4, remainingTurns: 2 }); pushLog(ownerSide, `${me.name} deploys laser drone.`); break
      case 'point-defense': me.buffs.push({ label: 'PD', damageMultiplier: 1, damageReduction: 5, critNext: false, remainingTurns: 2 }); pushLog(ownerSide, `${me.name} sets up point defense.`); break
      case 'missile-drone': me.deployments.push({ cardId, ownerSide, damagePerTurn: 10, remainingTurns: 2 }); pushLog(ownerSide, `${me.name} deploys missile drone.`); break
      case 'shield-drone':  me.shield += 10; me.buffs.push({ label: 'Shield Drone', damageMultiplier: 1, damageReduction: 0, critNext: false, remainingTurns: 2 }); pushLog(ownerSide, `${me.name} +10 shield/turn for 2.`); break
      case 'kamikaze-drone': dealAttackDamage(opp, 25, dmgMult, critNext, card.name, ownerSide); break
      case 'fortress-turret': me.deployments.push({ cardId, ownerSide, damagePerTurn: 18, remainingTurns: 3 }); pushLog(ownerSide, `${me.name} fortifies a heavy turret.`); break

      // ─── Alien (already passed backfire roll) ────────────────────────
      case 'minor-phase-ripple': pushLog(ownerSide, `${me.name} phase-rippled to a new position.`); break
      case 'void-pulse':         opp.shield = Math.max(0, opp.shield - 15); pushLog(ownerSide, `${card.name} drained 15 shield.`); break
      case 'time-reverse':       pushLog(ownerSide, `${card.name} undid the last damage taken (cosmetic v1).`); break
      case 'reality-warp': {
        const meTotal = me.shield + me.hull
        const oppTotal = opp.shield + opp.hull
        me.shield = 0; me.hull = oppTotal
        opp.shield = 0; opp.hull = meTotal
        pushLog(ownerSide, `${card.name} swapped HP totals!`, { swapped: true })
        break
      }

      default:
        pushLog(ownerSide, `${card.name} resolves (no v1 effect).`)
    }
  }

  function dealAttackDamage(target: Combatant, base: number, mult: number, crit: boolean, source: string, side: CombatantSide): number {
    const final = Math.round(base * mult * (crit ? 2 : 1))
    const dealt = applyDamage(target, final, source)
    pushLog(side, `${source} hits ${target.name} for ${dealt}${crit ? ' (CRIT!)' : ''}.`)
    return dealt
  }

  function dealAttackDamageBypassShield(target: Combatant, base: number, shieldBypassPct: number, mult: number, crit: boolean, source: string, side: CombatantSide): number {
    const final = Math.round(base * mult * (crit ? 2 : 1))
    const bypass = Math.round(final * shieldBypassPct)
    const through = final - bypass
    target.hull = Math.max(0, target.hull - bypass)
    const absorbed = applyDamage(target, through, source)
    const total = bypass + absorbed
    pushLog(side, `${source} hits ${target.name} for ${total} (${bypass} bypassed shield).`)
    return total
  }

  function dealAttackHullOnly(target: Combatant, base: number, mult: number, crit: boolean, source: string, side: CombatantSide): number {
    const final = Math.round(base * mult * (crit ? 2 : 1))
    target.hull = Math.max(0, target.hull - final)
    pushLog(side, `${source} bypasses shield for ${final} hull damage.`)
    return final
  }

  // ── public API ────────────────────────────────────────────────────────

  const engine: CombatEngine = {
    state,
    start() {
      if (state.phase !== CombatPhase.Idle) return
      state.phase = CombatPhase.Loading
      shuffleDraw(state.a)
      shuffleDraw(state.b)
      // Coin flip
      state.phase = CombatPhase.CoinFlip
      const aGoesFirst = rng() < 0.5
      state.current = aGoesFirst ? CombatantSide.A : CombatantSide.B
      // Opening hands (5 each)
      drawN(state.a, 5)
      drawN(state.b, 5)
      // First turn setup
      state.turn = 1
      state.turnPhase = TurnPhase.Draw
      state.phase = aGoesFirst ? CombatPhase.TurnA : CombatPhase.TurnB
      const me = active()
      drawN(me, 1)
      me.energy += me.energyPerTurn
      state.turnPhase = TurnPhase.Play
      pushLog(state.current, `${me.name} starts the duel with ${me.energy} energy.`)
    },

    canPlay(cardId: string) {
      const me = active()
      if (!me.hand.includes(cardId)) return false
      const card = catalogue[cardId]
      if (!card) return false
      return me.energy >= card.energyCost
    },

    playCard(cardId: string) {
      if (state.phase !== CombatPhase.TurnA && state.phase !== CombatPhase.TurnB) {
        return { ok: false, reason: 'Not in a play phase.' }
      }
      const me = active()
      const card = catalogue[cardId]
      if (!card) return { ok: false, reason: 'Unknown card.' }
      const idx = me.hand.indexOf(cardId)
      if (idx < 0) return { ok: false, reason: 'Card not in hand.' }
      if (me.energy < card.energyCost) return { ok: false, reason: 'Not enough energy.' }

      me.hand.splice(idx, 1)
      me.discard.push(cardId)
      me.energy -= card.energyCost
      pushLog(state.current, `${me.name} plays ${card.name}.`)
      resolveCard(cardId, state.current)
      checkVictory()
      return { ok: true }
    },

    endTurn() {
      if (state.phase !== CombatPhase.TurnA && state.phase !== CombatPhase.TurnB) return
      const me = active()
      // End-of-turn deployments tick (own side)
      tickEndOfTurnDeployments(me)
      tickBuffs(me)
      me.energy = 0 // doesn't carry
      // Check victory before swapping
      checkVictory()
      // TS narrows `state.phase` at function entry to TurnA|TurnB so the
      // comparison below looks unreachable — but `checkVictory()` mutates it.
      // Cast through `string` to bypass the narrowing without using `any`.
      const phaseAfter = state.phase as string
      if (
        phaseAfter === CombatPhase.Won ||
        phaseAfter === CombatPhase.Lost ||
        phaseAfter === CombatPhase.Draw
      )
        return

      // Swap turn
      state.current = state.current === CombatantSide.A ? CombatantSide.B : CombatantSide.A
      state.turn += 1
      state.phase = state.current === CombatantSide.A ? CombatPhase.TurnA : CombatPhase.TurnB

      // New active player: draw + energy
      state.turnPhase = TurnPhase.Draw
      const next = active()
      drawN(next, 1)
      next.energy += next.energyPerTurn
      state.turnPhase = TurnPhase.Play
      pushLog(state.current, `${next.name}'s turn (energy ${next.energy}).`)

      // Final check (turn limit)
      checkVictory()
    },

    surrender(side: CombatantSide) {
      const c = meOf(side)
      c.surrendered = true
      pushLog(side, `${c.name} surrendered.`)
      checkVictory()
    },

    aiStep(): { action: 'play' | 'end'; cardId?: string } {
      if (state.phase !== CombatPhase.TurnA && state.phase !== CombatPhase.TurnB) return { action: 'end' }
      const me = active()
      const opp = opponent()
      const playable = me.hand.filter((id) => {
        const card = catalogue[id]
        return card && me.energy >= card.energyCost
      }).map((id) => ({ id, card: catalogue[id] }))

      if (playable.length === 0) return { action: 'end' }

      // Heuristic priority:
      //   1) lethal: if any single attack card can kill, play the cheapest lethal
      //   2) low hull: play any defense card
      //   3) otherwise: play highest energy cost card we can afford
      const oppEffectiveHP = opp.hull + opp.shield
      const lethal = playable
        .filter(({ card }) => card.category === CardCategory.Attack)
        .filter(({ card }) => estimateDamage(card.id) >= oppEffectiveHP)
        .sort((a, b) => a.card.energyCost - b.card.energyCost)
      if (lethal.length > 0) {
        engine.playCard(lethal[0].id)
        return { action: 'play', cardId: lethal[0].id }
      }

      const lowHull = me.hull / SHIP_STATS[me.shipClass].hull < 0.4
      if (lowHull) {
        const def = playable.find(({ card }) => card.category === CardCategory.Defense)
        if (def) {
          engine.playCard(def.id)
          return { action: 'play', cardId: def.id }
        }
      }

      // Pick the highest-energy affordable card
      playable.sort((a, b) => b.card.energyCost - a.card.energyCost)
      const pick = playable[0]
      engine.playCard(pick.id)
      return { action: 'play', cardId: pick.id }
    },
  }

  // Lookup table for AI's lethality estimate. Returns rough damage number.
  function estimateDamage(cardId: string): number {
    switch (cardId) {
      case 'laser-pulse': return 8
      case 'plasma-bolt': return 14
      case 'micro-missile': return 10
      case 'gatling-burst': return 9
      case 'thermal-lance': return 12
      case 'railgun-shot': return 20
      case 'acid-cloud': return 5
      case 'homing-missile': return 18
      case 'torpedo-barrage': return 36
      case 'phase-beam': return 24
      case 'void-lance': return 40
      case 'nova-barrage': return 20
      case 'stellar-annihilator': return 80
      case 'kamikaze-drone': return 25
      default: return 0
    }
  }

  return engine
}

/** Convenience export for UI callers. */
export { totalHP }
