import Link from 'next/link'

export interface TradingHubCardSpec {
  id: string
  title: string
  description: string
  href: string | null
  cta: string
  comingSoon: boolean
  accent: string
}

const CARDS: TradingHubCardSpec[] = [
  {
    id: 'the-bot',
    title: 'The Bot',
    description:
      'Regime-based crypto trading bot with +194.79% 12-month backtest, 11 coins tracked, 4 market phases. See pipeline, performance, and how to run it.',
    href: '/trading',
    cta: 'See the bot',
    comingSoon: false,
    accent: '#22d3ee',
  },
  {
    id: 'live-trading',
    title: 'Live Trading',
    description:
      'Real-time volume + trade feed across all active voidexa bots. Watch every position open and close as it happens.',
    href: null,
    cta: 'Coming soon',
    comingSoon: true,
    accent: '#06b6d4',
  },
  {
    id: 'leaderboard',
    title: 'Leaderboard',
    description:
      'Top human traders, top bots, and the house bot Bob Astroeagle ranked side-by-side by realised P&L.',
    href: null,
    cta: 'Coming soon',
    comingSoon: true,
    accent: '#0ea5e9',
  },
  {
    id: 'backtesting',
    title: 'Backtesting',
    description:
      'Test your strategy against historical data, dial in the parameters, and compare against Bob before going live.',
    href: null,
    cta: 'Coming soon',
    comingSoon: true,
    accent: '#3b82f6',
  },
  {
    id: 'beat-the-house',
    title: 'Beat the House',
    description:
      'Run a live head-to-head against Bob Astroeagle on the same market window. Win, and your strategy goes on the leaderboard.',
    href: null,
    cta: 'Coming soon',
    comingSoon: true,
    accent: '#6366f1',
  },
  {
    id: 'konkurrence',
    title: 'Konkurrence',
    description:
      'Monthly competition with a real prize pool for the top trader. Leaderboard resets the first of every month.',
    href: null,
    cta: 'Coming soon',
    comingSoon: true,
    accent: '#8b5cf6',
  },
]

function ComingSoonPulse({ accent }: { accent: string }) {
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

function Card({ card }: { card: TradingHubCardSpec }) {
  const className =
    'group flex h-full flex-col gap-4 rounded-2xl border bg-zinc-950/60 p-7 backdrop-blur transition'
  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2
          className="text-2xl font-semibold tracking-tight"
          style={{ color: card.accent }}
        >
          {card.title}
        </h2>
        {card.comingSoon && <ComingSoonPulse accent={card.accent} />}
      </div>
      <p className="flex-1 text-base leading-relaxed text-zinc-300">
        {card.description}
      </p>
      <div
        className="flex items-center gap-2 pt-2 text-base font-semibold"
        style={{ color: card.comingSoon ? `${card.accent}99` : card.accent }}
      >
        <span>{card.cta}</span>
        {!card.comingSoon && <span aria-hidden="true">→</span>}
      </div>
    </>
  )

  const style = {
    borderColor: `${card.accent}44`,
    boxShadow: `0 0 0 1px ${card.accent}22, 0 12px 40px ${card.accent}1a`,
  } as const

  if (card.href) {
    return (
      <Link
        href={card.href}
        data-testid={`trading-hub-card-${card.id}`}
        className={`${className} hover:-translate-y-1 hover:shadow-2xl`}
        style={style}
      >
        {inner}
      </Link>
    )
  }
  return (
    <div
      data-testid={`trading-hub-card-${card.id}`}
      aria-disabled="true"
      className={`${className} cursor-not-allowed opacity-90`}
      style={style}
    >
      {inner}
    </div>
  )
}

export default function TradingHubGrid() {
  return (
    <section
      aria-label="Trading Hub sections"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {CARDS.map(card => (
        <Card key={card.id} card={card} />
      ))}
    </section>
  )
}

export const TRADING_HUB_CARDS = CARDS
