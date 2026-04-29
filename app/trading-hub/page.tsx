import TradingHubHeader from '@/components/trading-hub/TradingHubHeader'
import TradingHubGrid from '@/components/trading-hub/TradingHubGrid'

export const metadata = {
  title: 'voidexa Trading Hub — Bot · Live · Leaderboard · Compete',
  description:
    'voidexa Trading Hub: regime-based AI bot, live trading feed, leaderboard, backtesting, head-to-head against Bob Astroeagle, and the monthly trading competition.',
}

export default function TradingHubPage() {
  return (
    <main className="min-h-[calc(100dvh-84px)] w-full px-6 pb-24 pt-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <TradingHubHeader />
        <TradingHubGrid />
      </div>
    </main>
  )
}
