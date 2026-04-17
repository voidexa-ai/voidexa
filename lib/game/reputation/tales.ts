/**
 * Sprint 3 — Task 4: Tales log line formatter.
 * Turns an activity row into a one-line "Tale" — what happened, when, where.
 */

export type TaleCategory = 'mission' | 'battle' | 'speedrun' | 'hauling' | 'pack'

export interface TaleEntry {
  id: string
  category: TaleCategory
  line: string
  when: string  // ISO timestamp
}

// ---------------------------------------------------------------------------
// Per-source row shapes (union of relevant fields from the source tables).
// ---------------------------------------------------------------------------

export interface TaleMissionRow {
  id: string
  mission_id: string
  completed_at?: string | null
  outcome_grade?: string | null
}

export interface TaleBattleRow {
  id: string
  status: string
  boss_template?: string | null
  ended_at?: string | null
  turns_played?: number | null
}

export interface TaleSpeedrunRow {
  id: string
  track_id: string
  duration_ms: number
  created_at: string
}

export interface TaleHaulingRow {
  id: string
  mission_template: string
  destination_planet: string
  outcome_grade?: string | null
  completed_at?: string | null
}

// ---------------------------------------------------------------------------
// Formatters.
// ---------------------------------------------------------------------------

export function formatMissionTale(row: TaleMissionRow): TaleEntry {
  const grade = row.outcome_grade ? ` · ${cap(row.outcome_grade)}` : ''
  return {
    id: `mission_${row.id}`,
    category: 'mission',
    line: `Completed mission ${humanId(row.mission_id)}${grade}`,
    when: row.completed_at ?? new Date(0).toISOString(),
  }
}

export function formatBattleTale(row: TaleBattleRow): TaleEntry {
  const verb = row.status === 'won' ? 'Defeated' : 'Lost to'
  const what = row.boss_template ? humanId(row.boss_template) : 'an opponent'
  const turns = row.turns_played ? ` · ${row.turns_played} turns` : ''
  return {
    id: `battle_${row.id}`,
    category: 'battle',
    line: `${verb} ${what}${turns}`,
    when: row.ended_at ?? new Date(0).toISOString(),
  }
}

export function formatSpeedrunTale(row: TaleSpeedrunRow): TaleEntry {
  return {
    id: `speedrun_${row.id}`,
    category: 'speedrun',
    line: `Finished ${humanId(row.track_id)} in ${formatMs(row.duration_ms)}`,
    when: row.created_at,
  }
}

export function formatHaulingTale(row: TaleHaulingRow): TaleEntry {
  const grade = row.outcome_grade ? ` · ${cap(row.outcome_grade)}` : ''
  return {
    id: `hauling_${row.id}`,
    category: 'hauling',
    line: `Delivered ${humanId(row.mission_template)} to ${row.destination_planet}${grade}`,
    when: row.completed_at ?? new Date(0).toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Merge + sort.
// ---------------------------------------------------------------------------

export function buildTalesFeed(sources: {
  missions?: readonly TaleMissionRow[]
  battles?: readonly TaleBattleRow[]
  speedrun?: readonly TaleSpeedrunRow[]
  hauling?: readonly TaleHaulingRow[]
}, limit = 20): TaleEntry[] {
  const tales: TaleEntry[] = []
  sources.missions?.forEach(r => tales.push(formatMissionTale(r)))
  sources.battles?.forEach(r => tales.push(formatBattleTale(r)))
  sources.speedrun?.forEach(r => tales.push(formatSpeedrunTale(r)))
  sources.hauling?.forEach(r => tales.push(formatHaulingTale(r)))
  return tales
    .sort((a, b) => (a.when < b.when ? 1 : -1))
    .slice(0, limit)
}

// ---------------------------------------------------------------------------
// Small helpers.
// ---------------------------------------------------------------------------

function humanId(id: string): string {
  // Strips common prefixes and title-cases the rest.
  return id
    .replace(/^m\d+_/, '')
    .replace(/^tier_/, 'Tier ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatMs(ms: number): string {
  const totalSec = ms / 1000
  const m = Math.floor(totalSec / 60)
  const s = Math.floor(totalSec % 60)
  const cs = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}
