'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardTemplate } from '@/lib/game/cards/index'
import { initBattle, playCard, endTurn } from '@/lib/game/battle/engine'
import { selectAction } from '@/lib/game/battle/ai'
import { makeTierEncounter, makeBossEncounter, type PveTierId, type BossId } from '@/lib/game/battle/encounters'
import type { BattleEffect, BattleState } from '@/lib/game/battle/types'

export type BattleConfig =
  | { kind: 'tier'; tier: PveTierId }
  | { kind: 'boss'; bossId: Exclude<BossId, 'kestrel'> }
import BattleHUD from './BattleHUD'
import CardHand from './CardHand'
import BattleResults from './BattleResults'
import DamageNumbers, { type FloatEvent } from './DamageNumbers'

const BattleCanvas = dynamic(() => import('./BattleCanvas'), { ssr: false })

const DEFAULT_PLAYER_SHIP = process.env.NEXT_PUBLIC_BOB_SHIP_URL?.trim()
  || 'https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/models/qs_bob.glb'
const DEFAULT_ENEMY_SHIP = process.env.NEXT_PUBLIC_ENEMY_SHIP_URL?.trim()
  || 'https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/models/qs_executioner.glb'

const EFFECT_DURATION_MS: Record<BattleEffect['kind'], number> = {
  weapon_fire: 700,
  hit_impact: 420,
  shield_up: 700,
  drone_deploy: 700,
  explosion: 900,
  status_apply: 600,
  status_tick: 400,
  repair: 700,
  draw: 250,
  energy_gain: 250,
}

interface Props {
  config: BattleConfig
  playerDeck: CardTemplate[]
  onExit: () => void
  onRestart: () => void
}

export default function BattleController({ config, playerDeck, onExit, onRestart }: Props) {
  const [encounter] = useState(() => (
    config.kind === 'boss'
      ? makeBossEncounter(config.bossId)
      : makeTierEncounter(config.tier)
  ))
  const [state, setState] = useState<BattleState>(() => initBattle(playerDeck, encounter.deck, 100, encounter.hull))
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state }, [state])

  const [effectQueue, setEffectQueue] = useState<BattleEffect[]>([])
  const [activeEffect, setActiveEffect] = useState<BattleEffect | null>(null)
  const [floatEvents, setFloatEvents] = useState<FloatEvent[]>([])
  const [playingIds, setPlayingIds] = useState<Set<string>>(new Set())
  const [playerDamaged, setPlayerDamaged] = useState(false)
  const [enemyDamaged, setEnemyDamaged] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const aiRunning = useRef(false)

  // Enqueue new effects + derive damage numbers from them.
  const enqueueEffects = useCallback((effects: BattleEffect[]) => {
    if (effects.length === 0) return
    setEffectQueue(prev => [...prev, ...effects])
    const newFloats: FloatEvent[] = []
    effects.forEach(e => {
      if (e.kind === 'hit_impact' && (e.damage ?? 0) > 0) {
        newFloats.push({ id: `f${Math.random()}`, kind: 'damage', amount: e.damage ?? 0, side: e.target })
      } else if (e.kind === 'repair' && (e.heal ?? 0) > 0) {
        newFloats.push({ id: `f${Math.random()}`, kind: 'heal', amount: e.heal ?? 0, side: e.target })
      } else if (e.kind === 'shield_up' && (e.block ?? 0) > 0) {
        newFloats.push({ id: `f${Math.random()}`, kind: 'shield', amount: e.block ?? 0, side: e.target })
      }
    })
    if (newFloats.length > 0) {
      setFloatEvents(prev => [...prev, ...newFloats])
      // Auto-expire float events after animation duration.
      newFloats.forEach(f => {
        window.setTimeout(() => setFloatEvents(prev => prev.filter(p => p.id !== f.id)), 1300)
      })
    }
  }, [])

  // Consume one effect at a time with fixed duration per kind.
  useEffect(() => {
    if (activeEffect || effectQueue.length === 0) return
    const [next, ...rest] = effectQueue
    setActiveEffect(next)
    setEffectQueue(rest)

    // Ship damage flash for hit_impact.
    if (next.kind === 'hit_impact' && (next.damage ?? 0) > 0) {
      if (next.target === 'player') {
        setPlayerDamaged(true)
        window.setTimeout(() => setPlayerDamaged(false), 420)
      } else {
        setEnemyDamaged(true)
        window.setTimeout(() => setEnemyDamaged(false), 420)
      }
    }

    const dur = EFFECT_DURATION_MS[next.kind] ?? 500
    const t = window.setTimeout(() => setActiveEffect(null), dur)
    return () => window.clearTimeout(t)
  }, [activeEffect, effectQueue])

  // Watch for game over → show results.
  useEffect(() => {
    if (state.winner && !showResults) {
      // Let remaining effects play before showing results.
      const t = window.setTimeout(() => setShowResults(true), 900)
      return () => window.clearTimeout(t)
    }
  }, [state.winner, showResults])

  // Player plays a card.
  const handlePlayCard = useCallback((instanceId: string) => {
    if (state.activeSide !== 'player' || state.winner) return
    setPlayingIds(prev => new Set(prev).add(instanceId))
    window.setTimeout(() => {
      setPlayingIds(prev => {
        const next = new Set(prev)
        next.delete(instanceId)
        return next
      })
    }, 560)
    const { state: next, effects } = playCard(state, { type: 'play_card', cardInstanceId: instanceId })
    setState(next)
    enqueueEffects(effects)
  }, [state, enqueueEffects])

  // Player ends turn → run AI loop.
  const handleEndTurn = useCallback(() => {
    if (state.activeSide !== 'player' || state.winner) return
    const next = endTurn(state)
    setState(next)
  }, [state])

  // Enemy AI loop — triggered on activeSide flip to enemy.
  useEffect(() => {
    if (state.activeSide !== 'enemy' || state.winner || aiRunning.current) return
    aiRunning.current = true
    const run = async () => {
      // Each step: pick action → if play_card, dispatch + wait 800ms; if end_turn, break.
      // Loop until AI ends turn or game over.
      let guard = 0
      while (guard < 15) {
        guard++
        const cur = stateRef.current
        if (cur.winner || cur.activeSide !== 'enemy') break
        const action = selectAction(cur)
        if (action.type === 'end_turn') break
        const { state: after, effects } = playCard(cur, action)
        setState(after)
        enqueueEffects(effects)
        await sleep(800)
      }
      const cur = stateRef.current
      if (!cur.winner && cur.activeSide === 'enemy') {
        setState(endTurn(cur))
      }
      aiRunning.current = false
    }
    void run()
  }, [state.activeSide, state.winner, enqueueEffects])

  const canEndTurn = state.activeSide === 'player' && !state.winner && effectQueue.length === 0 && !activeEffect

  return (
    <div style={S.wrap}>
      <div style={S.canvasLayer}>
        <BattleCanvas
          playerShipUrl={DEFAULT_PLAYER_SHIP}
          enemyShipUrl={DEFAULT_ENEMY_SHIP}
          activeEffect={activeEffect}
          playerDamaged={playerDamaged}
          enemyDamaged={enemyDamaged}
          playerBlocking={state.player.block > 0}
          enemyBlocking={state.enemy.block > 0}
        />
      </div>

      <BattleHUD
        player={state.player}
        enemy={state.enemy}
        activeSide={state.activeSide}
        turn={state.turn}
        onEndTurn={handleEndTurn}
        canEndTurn={canEndTurn}
        onExit={onExit}
      />

      <DamageNumbers events={floatEvents} />

      <CardHand
        cards={state.player.hand}
        energy={state.player.energy}
        playerTurn={state.activeSide === 'player' && !state.winner}
        onPlay={handlePlayCard}
        playing={playingIds}
      />

      {showResults && (
        <BattleResults
          outcome={state.winner === 'player' ? 'victory' : 'defeat'}
          config={config}
          turnsPlayed={state.turn}
          onRetry={onRestart}
          onExit={onExit}
        />
      )}
    </div>
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => window.setTimeout(resolve, ms))
}

const S: Record<string, React.CSSProperties> = {
  wrap: { position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' },
  canvasLayer: { position: 'absolute', inset: 0 },
}
