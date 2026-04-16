import { Metadata } from 'next'
import BattleClient from '@/components/game/battle/BattleClient'

export const metadata: Metadata = {
  title: 'Card Battle — voidexa',
  description: 'PvE card duels against Tier 1–5 enemies. Build a deck, pick a fight.',
}

export default function BattlePage() {
  return <BattleClient />
}
