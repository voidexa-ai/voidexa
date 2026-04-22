import { Metadata } from 'next'
import UniverseWallFeed from '@/components/universe-wall/UniverseWallFeed'
import GameHubTiles from '@/components/game/GameHubTiles'

export const metadata: Metadata = {
  title: 'voidexa · Game Hub',
  description: 'Pick a surface — mission board, deck builder, speed run, hauling, battle, profile, wall.',
}

export default function GameHubPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000 100%)',
      color: '#e8e4f0',
      fontFamily: 'var(--font-sans)',
      paddingBottom: 80,
    }}>
      <main style={{ maxWidth: 1040, margin: '0 auto', padding: '32px 28px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>
          Game Hub
        </h1>
        <p style={{ fontSize: 15, color: '#b9b4c8', margin: '0 0 24px', maxWidth: 640 }}>
          Every surface of the voidexa game universe. Pick a mode and jump in.
        </p>
        <GameHubTiles />
        <UniverseWallFeed pageSize={5} />
      </main>
    </div>
  )
}
