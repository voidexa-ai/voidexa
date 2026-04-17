/**
 * Sprint 5 — Task 2: dynamic contract generator.
 *
 * Pure function. Given a date seed, synthesises 8 unique hauling contracts
 * mixing trade goods, zones, and reward multipliers. Deterministic per seed
 * so all pilots on the same date see the same roster.
 */

import { TRADE_GOODS, type TradeGood, type Zone } from './tradeGoods'
import type { HaulingContract, RiskLevel } from './contracts'

const ZONE_ORDER: readonly Zone[] = ['Core Zone', 'Inner Ring', 'Mid Ring', 'Outer Ring', 'Deep Void']

/**
 * Distance multiplier per V3 spec:
 *   same-zone 1.0x, adjacent 1.5x, cross-zone 2.2x, Deep Void 3.0x
 */
export function distanceMultiplier(from: Zone, to: Zone): number {
  if (to === 'Deep Void' || from === 'Deep Void') return 3.0
  const fi = ZONE_ORDER.indexOf(from)
  const ti = ZONE_ORDER.indexOf(to)
  if (fi < 0 || ti < 0) return 1.0
  const d = Math.abs(ti - fi)
  if (d === 0) return 1.0
  if (d === 1) return 1.5
  return 2.2
}

/**
 * Risk multiplier — applied on top of distance.
 * Contested +30%, wreck risk +60%.
 */
export function riskMultiplier(risk: RiskLevel): number {
  if (risk === 'Wreck Risk') return 1.6
  if (risk === 'Contested') return 1.3
  return 1.0
}

const ISSUER_POOL: readonly HaulingContract['issuer'][] = ['jix', 'claude', 'gpt', 'gemini', 'perplexity', 'llama']

function hashSeed(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h
}

function mulberry32(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickRisk(good: TradeGood, rng: () => number): RiskLevel {
  const riskText = good.riskNotes.toLowerCase()
  if (riskText.includes('pirate') || riskText.includes('extreme') || riskText.includes('illegal')) return 'Wreck Risk'
  if (riskText.includes('customs') || riskText.includes('theft') || riskText.includes('contested')) return 'Contested'
  if (riskText.includes('volatile') || riskText.includes('fragile') || riskText.includes('spoils')) return 'Low'
  return rng() < 0.35 ? 'Contested' : 'Safe'
}

function timeEstimateFor(units: number, distanceMult: number): string {
  const minutes = Math.round(5 + units * 1.5 + distanceMult * 3)
  return `${minutes}–${minutes + 3} min`
}

function distanceUnitsFor(multiplier: number): number {
  return Math.round(200 * multiplier)
}

/**
 * Produces `count` deterministic contracts for the given date seed.
 */
export function generateDailyContracts(dateSeed: string, count = 8): HaulingContract[] {
  const rng = mulberry32(hashSeed(dateSeed))
  const contracts: HaulingContract[] = []
  const usedGoodIds = new Set<string>()
  let safety = 0

  while (contracts.length < count && safety < count * 10) {
    safety++
    const good = TRADE_GOODS[Math.floor(rng() * TRADE_GOODS.length)]
    if (usedGoodIds.has(good.id)) continue
    usedGoodIds.add(good.id)

    const dest = good.destinationZones[Math.floor(rng() * good.destinationZones.length)]
    const distMult = distanceMultiplier(good.sourceZone, dest)
    const risk = pickRisk(good, rng)
    const riskMult = riskMultiplier(risk)
    const units = Math.max(1, Math.round(1 + rng() * 3))
    const base = Math.round(good.baseValueGhai * good.weight * units * distMult * riskMult)
    const rewardMin = Math.round(base * 0.85)
    const rewardMax = Math.round(base * 1.15)
    const issuer = ISSUER_POOL[Math.floor(rng() * ISSUER_POOL.length)]
    const distanceUnits = distanceUnitsFor(distMult)

    contracts.push({
      id: `dynamic_${good.id}_${dateSeed}`,
      name: `${good.name} Run`,
      origin: originNameForZone(good.sourceZone),
      destination: destinationNameForZone(dest),
      zone: good.sourceZone === dest ? good.sourceZone : `${good.sourceZone} → ${dest}`,
      cargoName: good.name,
      cargoFragile: good.category === 'perishable' || good.category === 'tech components',
      rewardMin,
      rewardMax,
      risk,
      timeEstimate: timeEstimateFor(units, distMult),
      issuer,
      flavor: good.riskNotes,
      distanceUnits,
    })
  }
  return contracts
}

function originNameForZone(z: Zone): string {
  switch (z) {
    case 'Core Zone':  return 'voidexa Hub'
    case 'Inner Ring': return 'Helio Ward'
    case 'Mid Ring':   return 'Needle Prospect'
    case 'Outer Ring': return 'Brine Halo'
    case 'Deep Void':  return 'Edge Marker One'
  }
}

function destinationNameForZone(z: Zone): string {
  switch (z) {
    case 'Core Zone':  return 'Break Room Halo'
    case 'Inner Ring': return 'Patchbay Kilo'
    case 'Mid Ring':   return 'Marrow Exchange'
    case 'Outer Ring': return 'The Last Cordial'
    case 'Deep Void':  return 'Third Edge Marker'
  }
}

/** YYYY-MM-DD today in UTC. */
export function todayDateSeed(): string {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, '0')
  const d = String(now.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
