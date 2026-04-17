/**
 * Sprint 4 — Task 1: Universe Wall event formatter.
 * Pure function — takes a `universe_wall` row and returns a display-ready
 * object with icon + text + timestamp. No Supabase calls, no network.
 */

export type WallEventType =
  | 'rescue'
  | 'claim_planet'
  | 'speed_record'
  | 'boss_defeat'
  | 'wreck_claim'
  | 'tournament'
  | 'quest_complete'
  | 'pioneer_milestone'
  | 'debut'
  | 'mythic_pull'

export interface WallEventRow {
  id: string
  event_type: string           // string so unknown types degrade gracefully
  actor_user_id: string | null
  actor_name: string
  subject_user_id?: string | null
  subject_name?: string | null
  payload?: Record<string, unknown> | null
  created_at: string | null
}

export interface FormattedWallEvent {
  id: string
  icon: string
  actor: string
  line: string
  color: string
  when: string
}

const BOSS_DISPLAY: Record<string, string> = {
  kestrel:         'Kestrel Reclaimer',
  lantern_auditor: 'The Lantern Auditor',
  varka:           'Varka, Tyrant of the Hollow',
  choir_sight:     'Choir-Sight Envoy',
  patient_wreck:   'The Patient Wreck',
}

const TRACK_DISPLAY: Record<string, string> = {
  core_circuit: 'Core Circuit',
  nebula_run:   'Nebula Run',
  void_prix:    'Void Prix Championship',
}

const EVENT_ICON: Record<string, string> = {
  rescue:            '🛟',
  claim_planet:      '🪐',
  speed_record:      '🏁',
  boss_defeat:       '⚔',
  wreck_claim:       '⚙',
  tournament:        '🏆',
  quest_complete:    '📜',
  pioneer_milestone: '🏅',
  debut:             '⭐',
  mythic_pull:       '💎',
}

const EVENT_COLOR: Record<string, string> = {
  rescue:            '#7fff9f',
  claim_planet:      '#af52de',
  speed_record:      '#00d4ff',
  boss_defeat:       '#ff6b6b',
  wreck_claim:       '#ff8a3c',
  tournament:        '#ffd166',
  quest_complete:    '#7fd8ff',
  pioneer_milestone: '#af52de',
  debut:             '#ffd166',
  mythic_pull:       '#c832ff',
}

function formatMs(ms: unknown): string {
  const n = typeof ms === 'number' ? ms : Number(ms)
  if (!Number.isFinite(n) || n <= 0) return '??:??.??'
  const totalSec = n / 1000
  const m = Math.floor(totalSec / 60)
  const s = Math.floor(totalSec % 60)
  const cs = Math.floor((n % 1000) / 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export function formatWallEvent(row: WallEventRow): FormattedWallEvent {
  const p = row.payload ?? {}
  const actor = row.actor_name || 'An unknown pilot'
  const icon = EVENT_ICON[row.event_type] ?? '•'
  const color = EVENT_COLOR[row.event_type] ?? '#b0b0c4'
  const when = row.created_at ?? ''
  let line = `${actor} made a move.`

  switch (row.event_type) {
    case 'mythic_pull': {
      const cardId = typeof p.card_id === 'string' ? p.card_id : 'a Mythic card'
      const remaining = typeof p.remaining === 'number' ? p.remaining : null
      const tail = remaining != null ? ` (${remaining} remaining)` : ''
      line = `${actor} just pulled ${humanId(cardId)}!${tail}`
      break
    }
    case 'boss_defeat': {
      const bossId = typeof p.boss === 'string' ? p.boss : ''
      const bossName = BOSS_DISPLAY[bossId] ?? (bossId ? humanId(bossId) : 'a boss')
      line = `${actor} defeated ${bossName}`
      break
    }
    case 'speed_record': {
      const trackId = typeof p.track === 'string' ? p.track : ''
      const trackName = TRACK_DISPLAY[trackId] ?? (trackId ? humanId(trackId) : 'a track')
      const dur = formatMs(p.duration_ms)
      line = `${actor} set a new record on ${trackName}: ${dur}`
      break
    }
    case 'debut': {
      line = `${actor} just joined the fleet`
      break
    }
    case 'rescue': {
      const subject = row.subject_name ?? 'another pilot'
      line = `${actor} rescued ${subject}`
      break
    }
    case 'claim_planet': {
      const planet = typeof p.planet === 'string' ? p.planet : 'a planet'
      line = `${actor} claimed ${planet}`
      break
    }
    case 'quest_complete': {
      const chain = typeof p.chain === 'string' ? humanId(p.chain) : 'a quest chain'
      line = `${actor} completed ${chain}`
      break
    }
    case 'tournament': {
      const result = typeof p.result === 'string' ? p.result : 'a tournament'
      line = `${actor} won ${result}`
      break
    }
    case 'wreck_claim': {
      const shipId = typeof p.ship === 'string' ? humanId(p.ship) : 'a wreck'
      line = `${actor} claimed ${shipId}`
      break
    }
    case 'pioneer_milestone': {
      const milestone = typeof p.milestone === 'string' ? p.milestone : 'a Pioneer milestone'
      line = `${actor} reached ${milestone}`
      break
    }
  }

  return { id: row.id, icon, actor, line, color, when }
}

function humanId(id: string): string {
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
