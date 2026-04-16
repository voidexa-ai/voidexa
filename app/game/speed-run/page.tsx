import { Metadata } from 'next'
import SpeedRunClient from '@/components/game/speedrun/SpeedRunClient'

export const metadata: Metadata = {
  title: 'Speed Run — voidexa',
  description: 'Three tracks, 15 gates each. Race for Gold, Silver, Bronze.',
}

export default function SpeedRunPage() {
  return <SpeedRunClient />
}
