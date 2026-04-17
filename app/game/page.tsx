import Link from 'next/link'
import { Metadata } from 'next'
import UniverseWallFeed from '@/components/universe-wall/UniverseWallFeed'

export const metadata: Metadata = {
  title: 'voidexa · Game Hub',
  description: 'Pick a surface — mission board, deck builder, speed run, hauling, battle, profile, wall.',
}

const TILES = [
  { href: '/game/mission-board',       label: 'Mission Board',   color: '#00d4ff' },
  { href: '/game/speed-run',           label: 'Speed Run',       color: '#af52de' },
  { href: '/game/hauling',             label: 'Hauling',         color: '#ffd166' },
  { href: '/game/battle',              label: 'Card Battle',     color: '#ff6b6b' },
  { href: '/game/cards/deck-builder',  label: 'Deck Builder',    color: '#7fd8ff' },
  { href: '/game/quests',              label: 'Quests',          color: '#7fff9f' },
  { href: '/game/profile',             label: 'Pilot Profile',   color: '#ff8a3c' },
  { href: '/shop',                     label: 'Shop',            color: '#c832ff' },
]

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
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 22px' }}>Game Hub</h1>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
          {TILES.map(t => (
            <Link key={t.href} href={t.href} style={{
              padding: '18px 16px',
              borderRadius: 12,
              border: `1px solid ${t.color}66`,
              background: 'rgba(12,14,30,0.7)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textShadow: `0 0 12px ${t.color}66`,
            }}>{t.label}</Link>
          ))}
        </section>
        <UniverseWallFeed pageSize={5} />
      </main>
    </div>
  )
}
