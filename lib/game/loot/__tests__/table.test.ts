import { describe, it, expect } from 'vitest'
import { rollLootCard, type LootSource, __internal } from '../table'

const { SCHEDULES, GAMEPLAY_MYTHIC_CHANCE } = __internal

function rollMany(source: LootSource, tier: string, n: number) {
  const hits: string[] = []
  for (let i = 0; i < n; i++) {
    const r = rollLootCard({ source, tier, seedKey: `seed_${i}` })
    hits.push(r ? r.rarity : 'none')
  }
  return hits
}

describe('rollLootCard — shape', () => {
  it('returns null for unknown source/tier combos', () => {
    expect(rollLootCard({ source: 'battle', tier: 'no_such_tier', seedKey: 'x' })).toBeNull()
  })

  it('is deterministic per seedKey', () => {
    const a = rollLootCard({ source: 'battle', tier: 'tier_1', seedKey: 'abc' })
    const b = rollLootCard({ source: 'battle', tier: 'tier_1', seedKey: 'abc' })
    expect(a?.card.id).toBe(b?.card.id)
  })

  it('different seeds yield different cards eventually', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 50; i++) {
      const r = rollLootCard({ source: 'battle', tier: 'tier_5', seedKey: `s${i}` })
      if (r) seen.add(r.card.id)
    }
    expect(seen.size).toBeGreaterThan(5)
  })
})

describe('rollLootCard — drop distribution', () => {
  const N = 3000

  it('Tier 1 battle drops ~80% common with no legendary', () => {
    const hits = rollMany('battle', 'tier_1', N)
    const dropped = hits.filter(h => h !== 'none').length
    expect(dropped / N).toBeGreaterThan(0.70)
    expect(dropped / N).toBeLessThan(0.90)
    // Almost all drops should be common (plus rare mythic chance).
    const commons = hits.filter(h => h === 'common').length
    expect(commons / dropped).toBeGreaterThan(0.95)
    expect(hits.filter(h => h === 'legendary').length).toBe(0)
  })

  it('Tier 5 battle drops 90% with legendary frequency 15–40%', () => {
    const hits = rollMany('battle', 'tier_5', N)
    const dropped = hits.filter(h => h !== 'none').length
    expect(dropped / N).toBeGreaterThan(0.80)
    const legendaryRate = hits.filter(h => h === 'legendary').length / dropped
    expect(legendaryRate).toBeGreaterThan(0.10)
    expect(legendaryRate).toBeLessThan(0.45)
  })

  it('Boss drops (Varka) are guaranteed with rare/legendary mix', () => {
    const hits = rollMany('battle', 'varka', 500)
    const dropped = hits.filter(h => h !== 'none').length
    expect(dropped).toBe(500)
    const rare = hits.filter(h => h === 'rare').length
    const legendary = hits.filter(h => h === 'legendary').length
    expect(rare).toBeGreaterThan(0)
    expect(legendary).toBeGreaterThan(0)
  })

  it('Mission Gold drops ~65% with uncommon/rare mix', () => {
    const hits = rollMany('mission', 'gold', N)
    const dropped = hits.filter(h => h !== 'none').length
    expect(dropped / N).toBeGreaterThan(0.55)
    expect(dropped / N).toBeLessThan(0.75)
    const uncommon = hits.filter(h => h === 'uncommon').length
    const rare = hits.filter(h => h === 'rare').length
    expect(uncommon).toBeGreaterThan(0)
    expect(rare).toBeGreaterThan(0)
  })

  it('Speedrun Bronze drops only common', () => {
    const hits = rollMany('speedrun', 'bronze', N)
    const rare = hits.filter(h => h === 'rare').length
    const legendary = hits.filter(h => h === 'legendary').length
    expect(rare).toBe(0)
    expect(legendary).toBe(0)
  })
})

describe('rollLootCard — mythic cap', () => {
  it('mythic rate across all sources is near 0.1%', () => {
    // Aggregate across sources to hit enough samples.
    const N = 5000
    let mythics = 0
    let total = 0
    const sources: [LootSource, string][] = [
      ['battle', 'tier_5'],
      ['battle', 'varka'],
      ['mission', 'gold'],
    ]
    for (const [src, tier] of sources) {
      for (let i = 0; i < N; i++) {
        const r = rollLootCard({ source: src, tier, seedKey: `m_${src}_${tier}_${i}` })
        if (r) {
          total++
          if (r.rarity === 'mythic') mythics++
        }
      }
    }
    const rate = mythics / total
    expect(rate).toBeLessThanOrEqual(GAMEPLAY_MYTHIC_CHANCE * 3)
  })
})

describe('SCHEDULES integrity', () => {
  it('every source has at least one tier', () => {
    for (const [source, tiers] of Object.entries(SCHEDULES)) {
      expect(Object.keys(tiers).length).toBeGreaterThan(0)
    }
  })

  it('all drop chances are in [0,1]', () => {
    for (const tiers of Object.values(SCHEDULES)) {
      for (const s of Object.values(tiers)) {
        expect(s.dropChance).toBeGreaterThanOrEqual(0)
        expect(s.dropChance).toBeLessThanOrEqual(1)
      }
    }
  })
})
