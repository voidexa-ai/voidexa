import { Metadata } from 'next'
import UniverseWallFeed from '@/components/universe-wall/UniverseWallFeed'

export const metadata: Metadata = {
  title: 'Universe Wall — voidexa',
  description: 'Public activity feed. Boss kills, speed records, mythic pulls, new pilots.',
}

export default function UniverseWallPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000 100%)',
      color: '#e8e4f0',
      fontFamily: 'var(--font-sans)',
      paddingBottom: 80,
    }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 28px' }}>
        <header style={{ marginBottom: 28 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#af52de',
          }}>THE UNIVERSE REMEMBERS</span>
          <h1 style={{
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#fff',
            margin: '6px 0 10px',
            background: 'linear-gradient(135deg, #af52de, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Universe Wall</h1>
          <p style={{ fontSize: 16, color: 'rgba(220,216,230,0.8)', margin: 0 }}>
            Every pilot&apos;s real moves. Mythic pulls, boss kills, personal bests, debuts.
          </p>
        </header>
        <UniverseWallFeed />
      </main>
    </div>
  )
}
