import { Metadata } from 'next'
import HaulingClient from '@/components/game/hauling/HaulingClient'

export const metadata: Metadata = {
  title: 'Hauling — voidexa',
  description: 'Pick up cargo, fly the route, deliver. Some runs are quiet. Some are chaos.',
}

export default function HaulingPage() {
  return <HaulingClient />
}
