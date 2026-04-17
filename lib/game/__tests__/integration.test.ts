/**
 * Sprint 5 — Task 3: cross-mode pure-function integration.
 *
 * Does NOT exercise Supabase, DOM, or R3F. Pins the public surface
 * of every gameplay mode so a regression in one mode can't silently
 * ship past the per-module tests.
 */

import { describe, it, expect } from 'vitest'

import { calculateGrade, GRADE_REWARDS } from '../speedrun/tracks'
import {
  deliveryGrade,
  deliveryBaseReward,
} from '../hauling/delivery'
import {
  rollEncounter,
  weightsForRisk,
  generateRoute,
  HAULING_CONTRACTS,
  type EncounterKind,
} from '../hauling/contracts'
import {
  generateDailyContracts,
  distanceMultiplier,
  riskMultiplier,
} from '../hauling/generateContract'
import { riskTierForZone, timerWindow, computeClaimEconomics } from '../wrecks/economics'

describe('speed run grading — gold/silver/bronze/dnf matrix', () => {
  const par = 60_000

  it('under par = gold', () => {
    expect(calculateGrade(par, par, true)).toBe('gold')
    expect(calculateGrade(par - 1, par, true)).toBe('gold')
  })

  it('silver band (≤1.15× par)', () => {
    expect(calculateGrade(par * 1.1, par, true)).toBe('silver')
    expect(calculateGrade(par * 1.15, par, true)).toBe('silver')
  })

  it('bronze band (≤1.3× par)', () => {
    expect(calculateGrade(par * 1.25, par, true)).toBe('bronze')
    expect(calculateGrade(par * 1.3, par, true)).toBe('bronze')
  })

  it('over bronze band still completed = dnf', () => {
    expect(calculateGrade(par * 1.31, par, true)).toBe('dnf')
  })

  it('incomplete run = dnf regardless of time', () => {
    expect(calculateGrade(1, par, false)).toBe('dnf')
  })

  it('grade rewards are positive for non-dnf', () => {
    expect(GRADE_REWARDS.gold).toBeGreaterThan(GRADE_REWARDS.silver)
    expect(GRADE_REWARDS.silver).toBeGreaterThan(GRADE_REWARDS.bronze)
    expect(GRADE_REWARDS.dnf).toBe(0)
  })
})

describe('hauling delivery grading', () => {
  it('failed outcome always yields Failed, zero reward', () => {
    expect(deliveryGrade('failed', 100)).toBe('Failed')
    expect(deliveryBaseReward({ rewardMin: 40, rewardMax: 60 }, 'failed', 100)).toBe(0)
  })

  it('≥90% integrity = Gold', () => {
    expect(deliveryGrade('delivered', 90)).toBe('Gold')
    expect(deliveryGrade('delivered', 100)).toBe('Gold')
  })

  it('60–89% integrity = Silver', () => {
    expect(deliveryGrade('delivered', 60)).toBe('Silver')
    expect(deliveryGrade('delivered', 89)).toBe('Silver')
  })

  it('<60% integrity = Bronze', () => {
    expect(deliveryGrade('delivered', 59)).toBe('Bronze')
    expect(deliveryGrade('delivered', 0)).toBe('Bronze')
  })

  it('base reward scales linearly with integrity', () => {
    const c = { rewardMin: 40, rewardMax: 60 }
    expect(deliveryBaseReward(c, 'delivered', 100)).toBe(50)
    expect(deliveryBaseReward(c, 'delivered', 50)).toBe(25)
    expect(deliveryBaseReward(c, 'delivered', 0)).toBe(0)
  })
})

describe('hauling encounter roll distribution', () => {
  it('safe weights sum = 100 and roll lands in a known bucket', () => {
    const w = weightsForRisk('Safe')
    expect(w.none + w.navigation + w.combat + w.opportunity + w.atmosphere).toBe(100)
    for (let i = 0; i < 100; i++) {
      const k = rollEncounter(w, i / 100)
      expect(['none', 'navigation', 'combat', 'opportunity', 'atmosphere'] as EncounterKind[])
        .toContain(k)
    }
  })

  it('safe roll hits "none" at least half the time (probabilistic sanity)', () => {
    const w = weightsForRisk('Safe')
    let none = 0
    for (let i = 0; i < 1000; i++) {
      if (rollEncounter(w, Math.random()) === 'none') none++
    }
    expect(none).toBeGreaterThan(500)
  })

  it('contested roll hits combat more than safe', () => {
    const safeW = weightsForRisk('Safe')
    const riskyW = weightsForRisk('Contested')
    let safeCombat = 0, riskyCombat = 0
    for (let i = 0; i < 1000; i++) {
      if (rollEncounter(safeW, Math.random()) === 'combat') safeCombat++
      if (rollEncounter(riskyW, Math.random()) === 'combat') riskyCombat++
    }
    expect(riskyCombat).toBeGreaterThan(safeCombat)
  })
})

describe('hauling route generation', () => {
  it('Safe contracts get 3 checkpoints, Contested 4, Wreck Risk 5', () => {
    const safe = HAULING_CONTRACTS.find(c => c.risk === 'Safe')!
    const contested = HAULING_CONTRACTS.find(c => c.risk === 'Contested')!
    const wreck = HAULING_CONTRACTS.find(c => c.risk === 'Wreck Risk')!
    expect(generateRoute(safe).checkpoints).toHaveLength(3)
    expect(generateRoute(contested).checkpoints).toHaveLength(4)
    expect(generateRoute(wreck).checkpoints).toHaveLength(5)
  })

  it('route origin z > destination z (travel is toward -z)', () => {
    const c = HAULING_CONTRACTS[0]
    const r = generateRoute(c)
    expect(r.origin.z).toBeGreaterThan(r.destination.z)
  })
})

describe('dynamic contract generator + wreck economics — cross-mode pricing', () => {
  it('daily contracts honor Deep Void distance multiplier', () => {
    expect(distanceMultiplier('Core Zone', 'Deep Void')).toBe(3.0)
    expect(riskMultiplier('Wreck Risk')).toBe(1.6)
  })

  it('generated contracts are all accept-ready (rewardMin ≤ rewardMax, positive)', () => {
    const roster = generateDailyContracts('2026-04-17')
    for (const c of roster) {
      expect(c.rewardMin).toBeGreaterThan(0)
      expect(c.rewardMax).toBeGreaterThanOrEqual(c.rewardMin)
      expect(c.distanceUnits).toBeGreaterThan(0)
    }
  })

  it('zone risk tier maps to timer window', () => {
    expect(riskTierForZone('Core Zone')).toBe('low')
    expect(riskTierForZone('Deep Void')).toBe('high')
    expect(timerWindow('low').protectedMs).toBeGreaterThan(timerWindow('high').protectedMs)
  })

  it('claim economics climb monotonically with ship tier', () => {
    const common = computeClaimEconomics('common')!
    const legendary = computeClaimEconomics('legendary')!
    expect(legendary.basePrice).toBeGreaterThan(common.basePrice)
    expect(legendary.claimFee).toBeGreaterThan(common.claimFee)
  })
})
