import type { Metadata } from 'next'
import CardCollectionView from '@/components/combat/CardCollection'

export const metadata: Metadata = {
  title: 'Kortsamling — voidexa',
  description: 'Administrer din voidexa Core Set: forvitr til støv, lav nye kort, fusioner, og byg dit deck.',
  alternates: {
    canonical: '/dk/cards',
    languages: {
      en: '/cards',
      da: '/dk/cards',
      'x-default': '/cards',
    },
  },
}

export default function CardsDk() {
  return <CardCollectionView />
}
