import { describe, it, expect } from 'vitest'
import { formatWallEvent, type WallEventRow } from '../events'

function row(over: Partial<WallEventRow> = {}): WallEventRow {
  return {
    id: 'r1',
    event_type: 'debut',
    actor_user_id: 'u1',
    actor_name: 'Test Pilot',
    payload: {},
    created_at: '2026-04-17T12:00:00Z',
    ...over,
  }
}

describe('formatWallEvent', () => {
  it('debut event reads "just joined the fleet"', () => {
    const f = formatWallEvent(row({ event_type: 'debut' }))
    expect(f.line).toContain('just joined the fleet')
    expect(f.icon).toBe('⭐')
  })

  it('boss_defeat uses display name for known bosses', () => {
    const f = formatWallEvent(row({
      event_type: 'boss_defeat',
      payload: { boss: 'kestrel' },
    }))
    expect(f.line).toContain('Kestrel Reclaimer')
    expect(f.icon).toBe('⚔')
  })

  it('boss_defeat with unknown boss id falls back to humanised id', () => {
    const f = formatWallEvent(row({
      event_type: 'boss_defeat',
      payload: { boss: 'unknown_boss' },
    }))
    expect(f.line).toContain('Unknown Boss')
  })

  it('speed_record formats duration as mm:ss.cc', () => {
    const f = formatWallEvent(row({
      event_type: 'speed_record',
      payload: { track: 'core_circuit', duration_ms: 183_450 },
    }))
    expect(f.line).toContain('Core Circuit')
    expect(f.line).toContain('03:03.45')
    expect(f.icon).toBe('🏁')
  })

  it('mythic_pull formats with remaining count', () => {
    const f = formatWallEvent(row({
      event_type: 'mythic_pull',
      payload: { card_id: 'temporal_loop', remaining: 48 },
    }))
    expect(f.line).toContain('Temporal Loop')
    expect(f.line).toContain('48 remaining')
    expect(f.icon).toBe('💎')
  })

  it('mythic_pull without remaining omits the count suffix', () => {
    const f = formatWallEvent(row({
      event_type: 'mythic_pull',
      payload: { card_id: 'quantum_splice' },
    }))
    expect(f.line).toContain('Quantum Splice')
    expect(f.line).not.toContain('remaining')
  })

  it('quest_complete formats chain humanised', () => {
    const f = formatWallEvent(row({
      event_type: 'quest_complete',
      payload: { chain: 'shape_of_safe' },
    }))
    expect(f.line).toContain('Shape Of Safe')
  })

  it('unknown event type falls back to safe default', () => {
    const f = formatWallEvent(row({ event_type: 'zzz_new_thing' }))
    expect(f.line.length).toBeGreaterThan(0)
    expect(f.icon).toBe('•')
  })

  it('missing actor_name degrades to "An unknown pilot"', () => {
    const f = formatWallEvent(row({ actor_name: '' }))
    expect(f.actor).toBe('An unknown pilot')
  })

  it('color is assigned per event type', () => {
    expect(formatWallEvent(row({ event_type: 'mythic_pull' })).color).toBe('#c832ff')
    expect(formatWallEvent(row({ event_type: 'boss_defeat' })).color).toBe('#ff6b6b')
    expect(formatWallEvent(row({ event_type: 'debut' })).color).toBe('#ffd166')
  })
})
