const ITEMS = [
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Trade ships, cards, cosmetics, and rare drops with other pilots.',
    accent: '#22d3ee',
  },
  {
    id: 'tournaments',
    title: 'Tournaments',
    description: 'Bracketed PvP and PvE events with GHAI prize pools.',
    accent: '#a78bfa',
  },
  {
    id: 'forums',
    title: 'Forums',
    description: 'Strategy threads, dev AMAs, and pilot lore — moderated by the council.',
    accent: '#f59e0b',
  },
  {
    id: 'leaderboards',
    title: 'Leaderboards',
    description: 'Per-game rankings with weekly resets and lifetime hall-of-fame.',
    accent: '#ec4899',
  },
  {
    id: 'affiliate',
    title: 'Affiliate',
    description: 'Earn GHAI when pilots you bring in spend on the platform.',
    accent: '#22c55e',
  },
] as const

function Pulse({ accent }: { accent: string }) {
  return (
    <span
      data-testid="coming-soon-pulse"
      className="relative flex h-2 w-2"
      aria-hidden="true"
    >
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
        style={{ background: accent }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ background: accent }}
      />
    </span>
  )
}

export default function ComingSoonRoadmap() {
  return (
    <section
      aria-labelledby="roadmap-heading"
      data-testid="roadmap"
      className="mb-16"
    >
      <div className="mb-5 flex items-baseline justify-between">
        <h2
          id="roadmap-heading"
          className="text-2xl font-semibold tracking-tight text-white"
        >
          Coming soon
        </h2>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Roadmap
        </span>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(item => (
          <li
            key={item.id}
            data-testid={`roadmap-item-${item.id}`}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 backdrop-blur"
          >
            <div className="mb-2 flex items-center gap-3">
              <h3
                className="text-lg font-semibold tracking-tight"
                style={{ color: item.accent }}
              >
                {item.title}
              </h3>
              <Pulse accent={item.accent} />
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export const ROADMAP_ITEMS = ITEMS
