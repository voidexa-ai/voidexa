export default function TradingHubHeader() {
  return (
    <header className="mb-10 flex flex-col gap-4">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
        voidexa Trading Hub
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        The bot, the bench, and the bracket — in one room.
      </h1>
      <div
        data-testid="trading-hub-live-strip"
        className="mt-3 grid gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-zinc-300 sm:grid-cols-2"
      >
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
            Live volume (24h)
          </span>
          <span data-testid="trading-hub-live-volume" className="font-mono text-base text-cyan-200">
            Coming Soon
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
            Trades today
          </span>
          <span data-testid="trading-hub-live-trades" className="font-mono text-base text-cyan-200">
            Coming Soon
          </span>
        </div>
      </div>
    </header>
  )
}
