import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { TRADING_HUB_CARDS } from '../components/trading-hub/TradingHubGrid'

const PAGE_SRC = readFileSync(
  join(process.cwd(), 'app', 'trading-hub', 'page.tsx'),
  'utf8',
)
const HEADER_SRC = readFileSync(
  join(process.cwd(), 'components', 'trading-hub', 'TradingHubHeader.tsx'),
  'utf8',
)
const GRID_SRC = readFileSync(
  join(process.cwd(), 'components', 'trading-hub', 'TradingHubGrid.tsx'),
  'utf8',
)

describe('AFS-10 /trading-hub merged platform', () => {
  it('page renders TradingHubHeader + TradingHubGrid (replaces legacy 5-tabs)', () => {
    expect(PAGE_SRC).toMatch(/TradingHubHeader/)
    expect(PAGE_SRC).toMatch(/TradingHubGrid/)
    expect(PAGE_SRC).not.toMatch(/TradingHubTabs/)
  })

  it('header strip carries live volume + trades-today placeholders', () => {
    expect(HEADER_SRC).toMatch(/data-testid="trading-hub-live-volume"/)
    expect(HEADER_SRC).toMatch(/data-testid="trading-hub-live-trades"/)
    expect(HEADER_SRC).toMatch(/Coming Soon/)
  })

  it('grid exports exactly 6 cards in the locked SLUT 21 order', () => {
    const ids = TRADING_HUB_CARDS.map(c => c.id)
    expect(ids).toEqual([
      'the-bot',
      'live-trading',
      'leaderboard',
      'backtesting',
      'beat-the-house',
      'konkurrence',
    ])
  })

  it('"The Bot" is the only live link — points to /trading', () => {
    const liveCards = TRADING_HUB_CARDS.filter(c => !c.comingSoon)
    expect(liveCards).toHaveLength(1)
    expect(liveCards[0].id).toBe('the-bot')
    expect(liveCards[0].href).toBe('/trading')
  })

  it('the other 5 cards are flagged comingSoon with no href', () => {
    const comingSoon = TRADING_HUB_CARDS.filter(c => c.comingSoon)
    expect(comingSoon).toHaveLength(5)
    for (const card of comingSoon) {
      expect(card.href).toBeNull()
    }
  })

  it('grid renders Coming Soon pulse element for each comingSoon card', () => {
    expect(GRID_SRC).toMatch(/data-testid="coming-soon-pulse"/)
    expect(GRID_SRC).toMatch(/animate-ping/)
  })

  it('grid uses 3-col responsive layout (NOT linear scroll)', () => {
    expect(GRID_SRC).toMatch(/lg:grid-cols-3/)
  })

  it('each card carries a unique data-testid for E2E hooks', () => {
    for (const card of TRADING_HUB_CARDS) {
      expect(GRID_SRC).toMatch(new RegExp(`trading-hub-card-\\$\\{card\\.id\\}`))
    }
  })
})
