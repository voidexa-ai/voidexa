import { Metadata } from 'next'
import QuestCatalogClient from '@/components/quests/QuestCatalogClient'

export const metadata: Metadata = {
  title: 'Quest Chains — voidexa',
  description: 'Narrative arcs. Five chains, linear unlocks, Cast-authored dialogue.',
}

export default function QuestsPage() {
  return <QuestCatalogClient />
}
