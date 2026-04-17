/**
 * Sprint 3 — Task 4: pilot reputation summary math.
 * Pure function — takes query results and returns the reputation card data.
 * Testable without a live Supabase connection.
 */

export interface MissionRow {
  status: string           // 'accepted' | 'in_progress' | 'completed' | 'failed' | 'abandoned'
  outcome_grade?: string | null
}

export interface BattleRow {
  status: string           // 'won' | 'lost' | ...
  boss_template?: string | null
}

export interface HaulingRow {
  status: string           // 'completed' | 'failed' | ...
  outcome_grade?: string | null
}

export interface SpeedrunRow {
  track_id: string
  duration_ms: number
}

export interface ReputationSummary {
  successfulHauls: number
  pilotsRescued: number        // placeholder — will wire in Sprint 4 when
                                 // rescue tracking is designed
  bossesDefeated: number
  speedrunWins: number
  missionsCompleted: number
  // Notable bosses
  tier5BossesDefeated: number
}

export interface ReputationInput {
  missions: readonly MissionRow[]
  battles: readonly BattleRow[]
  hauling: readonly HaulingRow[]
  speedrun: readonly SpeedrunRow[]
}

const TIER_5_BOSS_IDS = new Set(['choir_sight', 'patient_wreck'])
const ALL_BOSS_IDS = new Set([
  'kestrel', 'lantern_auditor', 'varka', 'choir_sight', 'patient_wreck',
])

export function computeReputation(input: ReputationInput): ReputationSummary {
  const successfulHauls = input.hauling.filter(h => h.status === 'completed').length
  const missionsCompleted = input.missions.filter(m => m.status === 'completed').length
  const speedrunWins = input.speedrun.length

  const bossWins = input.battles.filter(
    b => b.status === 'won' && b.boss_template && ALL_BOSS_IDS.has(b.boss_template),
  )
  const bossesDefeated = bossWins.length
  const tier5BossesDefeated = bossWins.filter(
    b => b.boss_template && TIER_5_BOSS_IDS.has(b.boss_template),
  ).length

  return {
    successfulHauls,
    pilotsRescued: 0,
    bossesDefeated,
    speedrunWins,
    missionsCompleted,
    tier5BossesDefeated,
  }
}
