'use client'

import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  STARTER_CATALOGUE,
  STARTER_CARDS,
} from '@/lib/cards/starter_set'
import { ShipClass } from '@/lib/game/ships'
import {
  CombatPhase,
  CombatantSide,
  createEngine,
  defaultDeckFor,
  type CombatEngine,
} from './CombatEngine'
import HealthBars from './HealthBars'
import EnergyDisplay from './EnergyDisplay'
import BattleLog from './BattleLog'
import TurnIndicator from './TurnIndicator'
import CardHand from './CardHand'
import EndScreen from './EndScreen'

export interface CombatUIProps {
  /** Player + opponent setup. If omitted, defaults to a tutorial duel. */
  playerName?: string
  playerShipClass?: ShipClass
  playerDeck?: string[]
  npcName?: string
  npcShipClass?: ShipClass
  npcDeck?: string[]
}

export default function CombatUI(props: CombatUIProps = {}) {
  const engineRef = useRef<CombatEngine | null>(null)
  // tick state forces a render after each state mutation
  const [, forceRender] = useReducer((x) => x + 1, 0)
  const [aiThinking, setAiThinking] = useState(false)

  // Build engine on mount (or whenever the setup props change identity)
  useEffect(() => {
    const e = createEngine({
      playerName: props.playerName ?? 'You',
      playerShipClass: props.playerShipClass ?? ShipClass.Fighter,
      playerDeck: props.playerDeck ?? defaultDeckFor(STARTER_CATALOGUE),
      npcName: props.npcName ?? 'Pirate',
      npcShipClass: props.npcShipClass ?? ShipClass.Cruiser,
      npcDeck: props.npcDeck ?? defaultDeckFor(STARTER_CATALOGUE),
      catalogue: STARTER_CATALOGUE,
    })
    e.start()
    engineRef.current = e
    forceRender()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.playerName,
    props.playerShipClass,
    props.npcName,
    props.npcShipClass,
  ])

  const engine = engineRef.current

  // NPC AI loop: when it's NPC turn, step every 800 ms until it ends turn
  useEffect(() => {
    if (!engine) return
    const inCombat =
      engine.state.phase === CombatPhase.TurnA ||
      engine.state.phase === CombatPhase.TurnB
    const isNpcTurn = engine.state.current === CombatantSide.B
    if (!inCombat || !isNpcTurn) return

    setAiThinking(true)
    let cancelled = false
    const tick = () => {
      if (cancelled || !engine) return
      // Re-check phase + side
      if (
        engine.state.current !== CombatantSide.B ||
        (engine.state.phase !== CombatPhase.TurnA && engine.state.phase !== CombatPhase.TurnB)
      ) {
        setAiThinking(false)
        forceRender()
        return
      }
      const r = engine.aiStep()
      forceRender()
      if (r.action === 'end') {
        engine.endTurn()
        forceRender()
        setAiThinking(false)
        return
      }
      window.setTimeout(tick, 800)
    }
    const t = window.setTimeout(tick, 600)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine?.state.current, engine?.state.phase])

  if (!engine) {
    return (
      <div style={pageWrap}>
        <div style={{ color: '#e5f7fa', padding: 40 }}>Loading duel…</div>
      </div>
    )
  }

  const { state } = engine
  const self = state.a
  const opp = state.b
  const isYourTurn = state.current === CombatantSide.A &&
    (state.phase === CombatPhase.TurnA || state.phase === CombatPhase.TurnB)

  const handlePlay = (cardId: string) => {
    if (!isYourTurn) return
    engine.playCard(cardId)
    forceRender()
  }

  const handleEnd = () => {
    if (!isYourTurn) return
    engine.endTurn()
    forceRender()
  }

  const handleSurrender = () => {
    if (!confirm('Surrender this duel? It counts as a loss.')) return
    engine.surrender(CombatantSide.A)
    forceRender()
  }

  const handleRematch = () => {
    const e = createEngine({
      playerName: props.playerName ?? 'You',
      playerShipClass: props.playerShipClass ?? ShipClass.Fighter,
      playerDeck: props.playerDeck ?? defaultDeckFor(STARTER_CATALOGUE),
      npcName: props.npcName ?? 'Pirate',
      npcShipClass: props.npcShipClass ?? ShipClass.Cruiser,
      npcDeck: props.npcDeck ?? defaultDeckFor(STARTER_CATALOGUE),
      catalogue: STARTER_CATALOGUE,
    })
    e.start()
    engineRef.current = e
    forceRender()
  }

  const rewards = useMemo(() => {
    if (state.winner === CombatantSide.A) return ['+25 rank points', '+1 random Common card', '+5 dust']
    if (state.winner === CombatantSide.B) return ['−20 rank points']
    return []
  }, [state.winner])

  return (
    <div style={pageWrap}>
      {/* Opponent panel — top */}
      <div style={panelTop}>
        <HealthBars combatant={opp} compact />
        <EnergyDisplay combatant={opp} />
      </div>

      {/* 3D arena placeholder — another process owns the actual scene */}
      <div style={arenaPlaceholder}>
        <div style={{ color: 'rgba(229,247,250,0.4)', fontSize: 14 }}>
          [3D duel arena lives here — built by the freeflight process]
        </div>
      </div>

      {/* Battle log + turn indicator strip */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <BattleLog entries={state.log} selfSide={CombatantSide.A} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <TurnIndicator
            phase={state.phase}
            current={state.current}
            selfSide={CombatantSide.A}
            turn={state.turn}
            turnLimit={state.turnLimit}
          />
          {aiThinking && (
            <div
              style={{
                fontSize: 14,
                color: '#fb7185',
                padding: '6px 12px',
                background: 'rgba(251,113,133,0.1)',
                border: '1px solid rgba(251,113,133,0.4)',
                borderRadius: 6,
              }}
            >
              {opp.name} thinking…
            </div>
          )}
        </div>
      </div>

      {/* Player panel — bottom */}
      <div style={panelBottom}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px',
          }}
        >
          <HealthBars combatant={self} />
          <EnergyDisplay combatant={self} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleEnd}
              disabled={!isYourTurn}
              style={{
                ...endTurnBtn,
                opacity: isYourTurn ? 1 : 0.45,
                cursor: isYourTurn ? 'pointer' : 'not-allowed',
              }}
            >
              End turn
            </button>
            <button onClick={handleSurrender} style={surrenderBtn}>
              Surrender
            </button>
          </div>
        </div>

        <CardHand
          hand={self.hand}
          energy={self.energy}
          isYourTurn={isYourTurn}
          onPlayCard={handlePlay}
        />
      </div>

      <EndScreen
        phase={state.phase}
        selfSide={CombatantSide.A}
        winner={state.winner}
        rewards={rewards}
        onRematch={handleRematch}
        returnHref="/freeflight"
      />
    </div>
  )
}

const pageWrap: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0a0a0f',
  color: '#e5f7fa',
  display: 'flex',
  flexDirection: 'column',
}

const panelTop: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
  background: 'rgba(251,113,133,0.05)',
  borderBottom: '1px solid rgba(251,113,133,0.3)',
}

const panelBottom: React.CSSProperties = {
  background: 'rgba(34,211,238,0.05)',
  borderTop: '1px solid rgba(34,211,238,0.3)',
  paddingBottom: 24,
}

const arenaPlaceholder: React.CSSProperties = {
  flex: 1,
  minHeight: 220,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 70%)',
}

const endTurnBtn: React.CSSProperties = {
  padding: '8px 18px',
  background: 'rgba(34,211,238,0.2)',
  border: '1px solid #22d3ee',
  color: '#67e8f9',
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
}

const surrenderBtn: React.CSSProperties = {
  padding: '8px 14px',
  background: 'transparent',
  border: '1px solid rgba(251,113,133,0.55)',
  color: '#fb7185',
  borderRadius: 8,
  fontSize: 14,
  cursor: 'pointer',
}
