import { Metadata } from 'next'
import DeckBuilderClient from './DeckBuilderClient'

export const metadata: Metadata = {
  title: 'Deck Builder — voidexa',
  description: 'Build your 20-card deck. Dream Mode shows the full universe.',
}

export default function DeckBuilderPage() {
  return <DeckBuilderClient />
}
