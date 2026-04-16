'use client'

import { useCallback, useState } from 'react'
import type { CardTemplate } from '@/lib/game/cards/index'
import type { PveTierId } from '@/lib/game/battle/encounters'
import BattleEntry from './BattleEntry'
import BattleController from './BattleController'

type Stage = 'entry' | 'battle'

export default function BattleClient() {
  const [stage, setStage] = useState<Stage>('entry')
  const [tierId, setTierId] = useState<PveTierId>(1)
  const [playerDeck, setPlayerDeck] = useState<CardTemplate[]>([])
  const [battleKey, setBattleKey] = useState(0)

  const handleStart = useCallback((tier: PveTierId, deck: CardTemplate[]) => {
    setTierId(tier)
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
      tierId={tierId}
      playerDeck={playerDeck}
      onExit={handleExit}
      onRestart={handleRestart}
    />
  )
}
