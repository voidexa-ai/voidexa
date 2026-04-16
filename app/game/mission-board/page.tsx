import { Metadata } from 'next'
import MissionBoardClient from './MissionBoardClient'

export const metadata: Metadata = {
  title: 'Mission Board — voidexa',
  description: 'Accept contracts from the Cast. Courier, Rush, Hunt, Recovery, Signal.',
}

export default function MissionBoardPage() {
  return <MissionBoardClient />
}
