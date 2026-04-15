import type { Metadata } from 'next'
import CardCollectionView from '@/components/combat/CardCollection'

export const metadata: Metadata = {
  title: 'Card Collection — voidexa',
  description: 'Manage your voidexa Core Set: disenchant, craft, fuse, and prepare your deck.',
}

export default function CardsPage() {
  return <CardCollectionView />
}
