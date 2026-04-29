import Link from 'next/link'

const TILES = [
  {
    id: 'sovereign-sky',
    title: 'Sovereign Sky',
    description: '6-DOF free flight in the voidexa starfield.',
    href: '/freeflight',
    accent: '#22d3ee',
  },
  {
    id: 'ghai-invaders',
    title: 'GHAI Invaders',
    description: 'Arcade shooter — clear the wave for GHAI.',
    href: '/break-room',
    accent: '#f59e0b',
  },
  {
    id: 'ghost-jump',
    title: 'Ghost Jump',
    description: 'Vertical hop-and-dodge runner.',
    href: '/break-room',
    accent: '#a78bfa',
  },
  {
    id: 'kcp-stacker',
    title: 'KCP Stacker',
    description: 'Compress incoming blocks before the buffer fills.',
    href: '/break-room',
    accent: '#22c55e',
  },
  {
    id: 'void-pong',
    title: 'Void Pong',
    description: 'Pong with extra physics — and a leaderboard.',
    href: '/break-room',
    accent: '#ec4899',
  },
] as const

export default function PlayNow() {
  return (
    <section
      aria-labelledby="play-now-heading"
      data-testid="play-now"
      className="mb-16"
    >
      <h2
        id="play-now-heading"
        className="mb-5 text-2xl font-semibold tracking-tight text-white"
      >
        Play now
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(tile => (
          <Link
            key={tile.id}
            href={tile.href}
            data-testid={`play-now-tile-${tile.id}`}
            className="group flex flex-col gap-2 rounded-xl border bg-zinc-950/60 p-5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
            style={{
              borderColor: `${tile.accent}44`,
              boxShadow: `0 0 0 1px ${tile.accent}22`,
            }}
          >
            <h3
              className="text-lg font-semibold tracking-tight"
              style={{ color: tile.accent }}
            >
              {tile.title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-300">
              {tile.description}
            </p>
            <span
              className="mt-1 text-sm font-semibold"
              style={{ color: tile.accent }}
            >
              Play →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export const PLAY_NOW_TILES = TILES
