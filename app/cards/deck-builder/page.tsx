import type { Metadata } from 'next'
import DeckBuilder from '@/components/combat/DeckBuilder'

export const metadata: Metadata = {
  title: 'Deck Builder — voidexa',
  description: 'Build a 20-card deck from your voidexa Core Set collection.',
}

export default function DeckBuilderPage() {
  return <DeckBuilder />
}
