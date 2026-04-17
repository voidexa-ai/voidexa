import { describe, it, expect } from 'vitest'
import { TRADE_GOODS, getTradeGood } from '../tradeGoods'
import { generateDailyContracts, distanceMultiplier, riskMultiplier } from '../generateContract'

describe('TRADE_GOODS catalog', () => {
  it('has exactly 30 trade goods', () => {
    expect(TRADE_GOODS).toHaveLength(30)
  })

  it('all ids are unique', () => {
    expect(new Set(TRADE_GOODS.map(g => g.id)).size).toBe(30)
  })

  it('every good has name, category, baseValueGhai, weight', () => {
    for (const g of TRADE_GOODS) {
      expect(g.name.length).toBeGreaterThan(0)
      expect(g.baseValueGhai).toBeGreaterThan(0)
      expect(g.weight).toBeGreaterThan(0)
      expect(g.destinationZones.length).toBeGreaterThan(0)
    }
  })

  it('getTradeGood resolves known ids', () => {
    expect(getTradeGood('tg001_orchard_glassfruit')?.category).toBe('perishable')
    expect(getTradeGood('not_a_good')).toBeUndefined()
  })
})

describe('distanceMultiplier (V3 zone distances)', () => {
  it('same zone = 1.0x', () => {
    expect(distanceMultiplier('Core Zone', 'Core Zone')).toBe(1.0)
    expect(distanceMultiplier('Mid Ring', 'Mid Ring')).toBe(1.0)
  })

  it('adjacent = 1.5x', () => {
    expect(distanceMultiplier('Core Zone', 'Inner Ring')).toBe(1.5)
    expect(distanceMultiplier('Outer Ring', 'Mid Ring')).toBe(1.5)
  })

  it('cross-zone = 2.2x', () => {
    expect(distanceMultiplier('Core Zone', 'Mid Ring')).toBe(2.2)
    expect(distanceMultiplier('Core Zone', 'Outer Ring')).toBe(2.2)
  })

  it('Deep Void involvement = 3.0x', () => {
    expect(distanceMultiplier('Core Zone', 'Deep Void')).toBe(3.0)
    expect(distanceMultiplier('Deep Void', 'Inner Ring')).toBe(3.0)
  })
})

describe('riskMultiplier', () => {
  it('Safe + Low + Timed + Ranked + Medium = 1.0x', () => {
    expect(riskMultiplier('Safe')).toBe(1.0)
    expect(riskMultiplier('Low')).toBe(1.0)
    expect(riskMultiplier('Medium')).toBe(1.0)
    expect(riskMultiplier('Timed')).toBe(1.0)
    expect(riskMultiplier('Ranked')).toBe(1.0)
  })

  it('Contested = 1.3x', () => {
    expect(riskMultiplier('Contested')).toBe(1.3)
  })

  it('Wreck Risk = 1.6x', () => {
    expect(riskMultiplier('Wreck Risk')).toBe(1.6)
  })
})

describe('generateDailyContracts', () => {
  it('returns exactly 8 contracts', () => {
    const r = generateDailyContracts('2026-04-17', 8)
    expect(r).toHaveLength(8)
  })

  it('deterministic per seed', () => {
    const a = generateDailyContracts('2026-04-17')
    const b = generateDailyContracts('2026-04-17')
    expect(a.map(c => c.id)).toEqual(b.map(c => c.id))
  })

  it('different seeds → different rosters', () => {
    const a = generateDailyContracts('2026-04-17').map(c => c.id).sort()
    const b = generateDailyContracts('2026-04-18').map(c => c.id).sort()
    expect(a).not.toEqual(b)
  })

  it('all ids are unique within a roster', () => {
    const r = generateDailyContracts('2026-04-17')
    expect(new Set(r.map(c => c.id)).size).toBe(r.length)
  })

  it('every contract has positive rewards and rewardMin ≤ rewardMax', () => {
    for (const c of generateDailyContracts('2026-04-17')) {
      expect(c.rewardMin).toBeGreaterThan(0)
      expect(c.rewardMax).toBeGreaterThanOrEqual(c.rewardMin)
    }
  })

  it('at least 3 distinct zones appear across 30 daily rotations', () => {
    const zones = new Set<string>()
    for (let i = 0; i < 30; i++) {
      for (const c of generateDailyContracts(`2026-04-${String(i + 1).padStart(2, '0')}`)) {
        zones.add(c.zone)
      }
    }
    expect(zones.size).toBeGreaterThanOrEqual(3)
  })

  it('every generated contract references a real trade good id', () => {
    for (const c of generateDailyContracts('2026-04-17')) {
      const tail = c.id.replace(/^dynamic_/, '').replace(/_\d{4}-\d{2}-\d{2}$/, '')
      expect(getTradeGood(tail)).toBeDefined()
    }
  })
})
