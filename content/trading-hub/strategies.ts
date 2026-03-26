export interface Strategy {
  slug: string
  title: string
  tagline: string
  tags: string[]
  isEdge?: boolean
  sections: { heading: string; body: string }[]
}

export const STRATEGIES: Strategy[] = [
  {
    slug: 'dca',
    title: 'DCA',
    tagline: 'Dollar-Cost Averaging',
    tags: ['Beginner', 'Low Risk', 'Long-term'],
    sections: [
      {
        heading: 'What is DCA?',
        body: 'Dollar-Cost Averaging means buying a fixed dollar amount of an asset at regular intervals, regardless of price. Over time this smooths out the impact of volatility and removes the pressure to time the market perfectly.',
      },
      {
        heading: 'When does it work?',
        body: 'DCA works best in long-term uptrends. It underperforms in sustained bear markets compared to not investing at all — but it dramatically outperforms the emotional investor who tries to time bottoms and tops.',
      },
      {
        heading: 'Key parameters',
        body: 'Interval (weekly/monthly), fixed amount per interval, asset selection, and optionally a momentum filter to pause during extreme downtrends.',
      },
    ],
  },
  {
    slug: 'grid-trading',
    title: 'Grid Trading',
    tagline: 'Buy low, sell high automatically',
    tags: ['Intermediate', 'Sideways markets', 'High frequency'],
    sections: [
      {
        heading: 'What is Grid Trading?',
        body: 'A grid bot places buy orders at regular intervals below the current price and sell orders at regular intervals above it. Every time the price bounces between grid lines, it captures the spread as profit.',
      },
      {
        heading: 'Best conditions',
        body: 'Sideways, choppy markets with no strong trend. Trending markets destroy grid bots — the price blows through all your buy orders and never comes back.',
      },
      {
        heading: 'Key parameters',
        body: 'Grid range (upper/lower price), number of grids, investment per grid, and a trend filter to pause the bot during breakouts.',
      },
    ],
  },
  {
    slug: 'momentum',
    title: 'Momentum',
    tagline: 'Ride the trend until it bends',
    tags: ['Intermediate', 'Trending markets', 'Higher risk'],
    sections: [
      {
        heading: 'What is Momentum?',
        body: 'Momentum strategies assume that assets which have performed well recently will continue to perform well in the near term. You buy the winners and short (or avoid) the losers.',
      },
      {
        heading: 'Classic implementation',
        body: 'Rank assets by 3-month or 12-month return. Long the top decile, flat or short the bottom decile. Rebalance monthly.',
      },
      {
        heading: 'Key risks',
        body: 'Momentum crashes — sudden reversals that punish crowded trades. Adding a volatility filter and maximum drawdown circuit breaker is essential.',
      },
    ],
  },
  {
    slug: 'mean-reversion',
    title: 'Mean Reversion',
    tagline: 'Prices always return to average',
    tags: ['Intermediate', 'Range-bound', 'Statistical'],
    sections: [
      {
        heading: 'The core idea',
        body: 'Many financial time series have a statistical tendency to return to their mean. When an asset deviates far from its historical average, you bet it will revert.',
      },
      {
        heading: 'Common indicators',
        body: 'Z-score of price vs. rolling mean, Bollinger Bands, RSI divergence. Entry on extreme deviation, exit when price returns to mean.',
      },
      {
        heading: 'Danger zones',
        body: 'Mean reversion fails catastrophically on assets entering structural decline. Always combine with a fundamental health check or a trend regime filter.',
      },
    ],
  },
  {
    slug: 'rebalancing',
    title: 'Rebalancing',
    tagline: 'Systematic portfolio maintenance',
    tags: ['Beginner', 'Low maintenance', 'Portfolio'],
    sections: [
      {
        heading: 'What is Rebalancing?',
        body: 'Set a target allocation (e.g. 60% BTC, 30% ETH, 10% stables). When any asset drifts more than a threshold from its target, sell the winners and buy the losers back to target.',
      },
      {
        heading: 'Why it works',
        body: 'Forced selling of overperformers and buying of underperformers creates systematic buy-low sell-high behaviour — without requiring any market prediction.',
      },
      {
        heading: 'Key decisions',
        body: 'Rebalancing trigger (threshold-based vs. calendar-based), drift tolerance, and transaction cost management.',
      },
    ],
  },
  {
    slug: 'regime-aware',
    title: 'Regime-Aware',
    tagline: 'The voidexa edge',
    tags: ['Advanced', 'Multi-strategy', 'voidexa Edge'],
    isEdge: true,
    sections: [
      {
        heading: 'What is Regime-Aware trading?',
        body: 'Different market conditions (BTC dominance rising, altseason, risk-off, ETH rotation) require completely different strategies. A regime-aware bot detects which phase the market is in and dynamically switches its strategy.',
      },
      {
        heading: 'The voidexa regime model',
        body: 'We classify the market into five regimes: BTC Phase, ETH Phase, Alt Phase, Risk-Off, and Neutral. Each regime has a distinct volatility profile, correlation structure, and opportunity set.',
      },
      {
        heading: 'Why this is an edge',
        body: 'Most bots use a fixed strategy. Regime-aware bots effectively have five strategies in one and switch between them as the market evolves. This is the model behind the voidexa All-Season bot.',
      },
    ],
  },
]

export const FUNDAMENTALS = [
  { tag: 'Overfitting',           desc: 'When your backtest is perfect but live trading fails — and why most bots die here.' },
  { tag: 'Backtesting',           desc: 'How to build an honest backtest that actually predicts live performance.' },
  { tag: 'Fees and Slippage',     desc: 'The silent killers. A strategy that nets 2% per trade after fees is very different from 2% before fees.' },
  { tag: 'Risk Management',       desc: 'Position sizing, stop losses, maximum drawdown rules — what separates professionals from gamblers.' },
  { tag: 'Why Bots Fail',         desc: 'The five most common reasons bots that worked in testing fail in production.' },
]
