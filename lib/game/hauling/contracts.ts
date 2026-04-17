/**
 * Phase 3 — Hauling MVP contracts, route generation, encounter weights.
 * Source of truth: docs/VOIDEXA_GAMING_COMBINED_V3.md PART 4 (Hauling).
 */

import type { CastIssuer } from '@/lib/game/missions/board'

export type RiskLevel = 'Safe' | 'Low' | 'Medium' | 'Timed' | 'Ranked' | 'Contested' | 'Wreck Risk'
export type ContractRiskDb = 'safe' | 'low' | 'medium' | 'wreck_risk'

export interface HaulingContract {
  id: string
  name: string
  origin: string
  destination: string
  zone: string
  cargoName: string
  cargoFragile: boolean
  rewardMin: number
  rewardMax: number
  risk: RiskLevel
  timeEstimate: string
  issuer: CastIssuer
  flavor: string
  /** Distance in world units for route planning. */
  distanceUnits: number
}

export const HAULING_CONTRACTS: readonly HaulingContract[] = [
  {
    id: 'h_core_parcel',
    name: 'Core Parcel Run',
    origin: 'voidexa Hub',
    destination: 'Station Alpha',
    zone: 'Core',
    cargoName: 'Sealed Data Parcel',
    cargoFragile: false,
    rewardMin: 40,
    rewardMax: 60,
    risk: 'Safe',
    timeEstimate: '3–5 min',
    issuer: 'perplexity',
    flavor: 'Standard data transfer. Inner ring. Nothing to worry about.',
    distanceUnits: 240,
  },
  {
    id: 'h_med_supplies',
    name: 'Medical Supplies',
    origin: 'Station Alpha',
    destination: 'Beta Outpost',
    zone: 'Core',
    cargoName: 'Fragile Medical Kit',
    cargoFragile: true,
    rewardMin: 60,
    rewardMax: 90,
    risk: 'Safe',
    timeEstimate: '4–6 min',
    issuer: 'gemini',
    flavor: 'Fragile cargo. Damage reduces payout. Slow and steady.',
    distanceUnits: 320,
  },
  {
    id: 'h_priority_docs',
    name: 'Priority Courier',
    origin: 'voidexa Hub',
    destination: 'Beta Outpost',
    zone: 'Core → Mid Ring',
    cargoName: 'Priority Data Crystal',
    cargoFragile: false,
    rewardMin: 90,
    rewardMax: 140,
    risk: 'Contested',
    timeEstimate: '6–9 min',
    issuer: 'claude',
    flavor: 'Mid-ring traffic. Some opportunist patrols. Keep moving.',
    distanceUnits: 440,
  },
  {
    id: 'h_salvage_tow',
    name: 'Salvage Tow',
    origin: 'Beta Outpost',
    destination: 'Gamma Station',
    zone: 'Mid Ring',
    cargoName: 'Derelict Chassis',
    cargoFragile: false,
    rewardMin: 120,
    rewardMax: 180,
    risk: 'Contested',
    timeEstimate: '8–11 min',
    issuer: 'gpt',
    flavor: 'Heavy tow. Scavengers scan for tows in the mid ring.',
    distanceUnits: 520,
  },
  {
    id: 'h_black_route',
    name: 'Black Route Contract',
    origin: 'Gamma Station',
    destination: 'Delta Outpost',
    zone: 'Mid Ring → Deep Void',
    cargoName: 'Unregistered Cargo',
    cargoFragile: false,
    rewardMin: 200,
    rewardMax: 280,
    risk: 'Wreck Risk',
    timeEstimate: '10–14 min',
    issuer: 'jix',
    flavor: 'Du skal ikke vide hvad det er. Bare lever det. Ingen spørgsmål.',
    distanceUnits: 640,
  },
  {
    id: 'h_relief_run',
    name: 'Relief Supplies',
    origin: 'voidexa Hub',
    destination: 'Delta Outpost',
    zone: 'Core → Mid Ring',
    cargoName: 'Emergency Food Crates',
    cargoFragile: false,
    rewardMin: 140,
    rewardMax: 200,
    risk: 'Contested',
    timeEstimate: '9–12 min',
    issuer: 'llama',
    flavor: 'bro Delta mangler bare mad lmao tag den med vil du?',
    distanceUnits: 560,
  },
] as const

/**
 * Map UI risk → DB enum used by hauling_contracts.risk_level.
 * DB accepts: safe, low, medium, wreck_risk.
 */
export function riskToDb(risk: RiskLevel): ContractRiskDb {
  if (risk === 'Safe') return 'safe'
  if (risk === 'Low') return 'low'
  if (risk === 'Medium' || risk === 'Timed' || risk === 'Ranked' || risk === 'Contested') return 'medium'
  return 'wreck_risk'
}

// --- Route generation ---

export interface Waypoint {
  x: number
  y: number
  z: number
  label: string
}

export interface Route {
  origin: Waypoint
  destination: Waypoint
  checkpoints: Waypoint[]
}

/**
 * Deterministic route: origin at z=+halfDist, destination at z=-halfDist,
 * 3-5 checkpoints between, with some lateral drift per checkpoint.
 * More distance = more checkpoints (Safe 3, Contested 4, Wreck Risk 5).
 */
export function generateRoute(contract: HaulingContract, seed = 0): Route {
  const checkpointCount =
    contract.risk === 'Safe' ? 3 : contract.risk === 'Contested' ? 4 : 5

  const halfDist = contract.distanceUnits / 2
  const origin: Waypoint = { x: 0, y: 0, z: halfDist, label: contract.origin }
  const destination: Waypoint = { x: 0, y: 0, z: -halfDist, label: contract.destination }

  const checkpoints: Waypoint[] = []
  const step = contract.distanceUnits / (checkpointCount + 1)
  const rng = mulberry32(seed + contract.id.length)
  for (let i = 1; i <= checkpointCount; i++) {
    const lateral = (rng() - 0.5) * 80
    const vertical = (rng() - 0.5) * 30
    checkpoints.push({
      x: lateral,
      y: vertical,
      z: halfDist - step * i,
      label: `Checkpoint ${i}`,
    })
  }
  return { origin, destination, checkpoints }
}

function mulberry32(seed: number) {
  let s = seed >>> 0
  return function () {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// --- Encounter weights ---

export type EncounterKind = 'none' | 'navigation' | 'combat' | 'opportunity' | 'atmosphere'

export interface EncounterWeights {
  none: number
  navigation: number
  combat: number
  opportunity: number
  atmosphere: number
}

export const ENCOUNTER_WEIGHTS_SAFE: EncounterWeights = {
  none: 70, navigation: 15, combat: 2, opportunity: 10, atmosphere: 3,
}
export const ENCOUNTER_WEIGHTS_RISKY: EncounterWeights = {
  none: 35, navigation: 20, combat: 20, opportunity: 15, atmosphere: 10,
}

export function weightsForRisk(risk: RiskLevel): EncounterWeights {
  return risk === 'Safe' ? ENCOUNTER_WEIGHTS_SAFE : ENCOUNTER_WEIGHTS_RISKY
}

export function rollEncounter(weights: EncounterWeights, rand: number): EncounterKind {
  const total = weights.none + weights.navigation + weights.combat + weights.opportunity + weights.atmosphere
  let pick = rand * total
  if ((pick -= weights.none) <= 0) return 'none'
  if ((pick -= weights.navigation) <= 0) return 'navigation'
  if ((pick -= weights.combat) <= 0) return 'combat'
  if ((pick -= weights.opportunity) <= 0) return 'opportunity'
  return 'atmosphere'
}

export function formatHaulingTime(ms: number): string {
  if (ms <= 0) return '00:00'
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
