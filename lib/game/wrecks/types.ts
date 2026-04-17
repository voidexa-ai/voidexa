/**
 * Sprint 5 — Task 1: wreck system types.
 * Source: docs/VOIDEXA_GAMING_COMBINED_V3.md PART 7.
 */

export type WreckPhase = 'protected' | 'abandoned' | 'expired' | 'claimed' | 'scrapped' | 'repaired'

export type WreckRiskTier = 'low' | 'high'

export type ShipClass = 'starter' | 'fighter' | 'hauler' | 'explorer' | 'salvager' | 'capital'

export type ShipTier = 'common' | 'uncommon' | 'rare' | 'legendary' | 'pioneer' | 'soulbound'

export type RecoveryResolution =
  | 'self_repair'
  | 'towed'
  | 'claimed_by_other'
  | 'scrapped'
  | 'abandoned'

export interface WreckRow {
  id: string
  owner_user_id: string
  ship_id: string
  ship_class: ShipClass | null
  ship_tier: ShipTier | null
  base_price_ghai: number
  position: { x: number; y: number; z: number }
  sector: string | null
  risk_level: WreckRiskTier
  phase: WreckPhase
  spawned_at: string
  protected_until: string
  expires_at: string
  claimed_by_user_id: string | null
  claimed_at: string | null
  resolution: RecoveryResolution | null
}

export interface TimerWindow {
  protectedMs: number
  totalMs: number
}

/**
 * V3 PART 7 table — Low Risk: 15/45min, High Risk: 5/20min.
 * Instanced (PvP dome) never creates a wreck, so no entry.
 */
export const TIMER_WINDOWS: Readonly<Record<WreckRiskTier, TimerWindow>> = {
  low:  { protectedMs: 15 * 60_000, totalMs: 60 * 60_000 },
  high: { protectedMs: 5  * 60_000, totalMs: 25 * 60_000 },
}
