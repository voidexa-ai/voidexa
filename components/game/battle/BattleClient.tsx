'use client'

import { useCallback, useState } from 'react'
import type { CardTemplate } from '@/lib/game/cards/index'
import BattleEntry from './BattleEntry'
import BattleController, { type BattleConfig } from './BattleController'

type Stage = 'entry' | 'battle'

export default function BattleClient() {
  const [stage, setStage] = useState<Stage>('entry')
  const [config, setConfig] = useState<BattleConfig>({ kind: 'tier', tier: 1 })
  const [playerDeck, setPlayerDeck] = useState<CardTemplate[]>([])
  const [battleKey, setBattleKey] = useState(0)

  const handleStart = useCallback((cfg: BattleConfig, deck: CardTemplate[]) => {
    setConfig(cfg)
    setPlayerDeck(deck)
    setStage('battle')
  }, [])

  const handleExit = useCallback(() => {
    setStage('entry')
  }, [])

  const handleRestart = useCallback(() => {
    setBattleKey(k => k + 1)
  }, [])

  if (stage === 'entry') return <BattleEntry onStart={handleStart} />
  return (
    <BattleController
      key={battleKey}
      config={config}
      playerDeck={playerDeck}
      onExit={handleExit}
      onRestart={handleRestart}
    />
  )
}
