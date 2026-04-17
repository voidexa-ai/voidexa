import { describe, it, expect } from 'vitest'
import {
  HOMEPAGE_PANELS,
  PHASES,
  TOTAL_DURATION_SECONDS,
  VOICEOVER_SCRIPT,
  activeVoiceoverLine,
  isOverlayVisibleAt,
  phaseAt,
  phaseProgress,
} from '../config'

describe('cinematic config — phases', () => {
  it('covers exactly 0..45 with no gaps', () => {
    expect(PHASES[0].start).toBe(0)
    expect(PHASES[PHASES.length - 1].end).toBe(TOTAL_DURATION_SECONDS)
    for (let i = 1; i < PHASES.length; i++) {
      expect(PHASES[i].start).toBe(PHASES[i - 1].end)
    }
  })

  it('phaseAt returns correct phase for sample timestamps', () => {
    expect(phaseAt(0)).toBe('approach')
    expect(phaseAt(7.99)).toBe('approach')
    expect(phaseAt(8)).toBe('warp')
    expect(phaseAt(11.99)).toBe('warp')
    expect(phaseAt(12)).toBe('arrival')
    expect(phaseAt(24.99)).toBe('arrival')
    expect(phaseAt(25)).toBe('door-open')
    expect(phaseAt(35)).toBe('reveal')
    expect(phaseAt(42)).toBe('end-state')
    expect(phaseAt(99)).toBe('end-state')
  })

  it('phaseProgress is 0..1 inside its phase', () => {
    expect(phaseProgress(0, 'approach')).toBe(0)
    expect(phaseProgress(4, 'approach')).toBeCloseTo(0.5, 5)
    expect(phaseProgress(8, 'approach')).toBe(1)
    expect(phaseProgress(10, 'warp')).toBeCloseTo(0.5, 5)
    expect(phaseProgress(43.5, 'end-state')).toBeCloseTo(0.5, 5)
  })

  it('isOverlayVisibleAt flips at second 42', () => {
    expect(isOverlayVisibleAt(41.999)).toBe(false)
    expect(isOverlayVisibleAt(42)).toBe(true)
    expect(isOverlayVisibleAt(45)).toBe(true)
  })
})

describe('cinematic config — voiceover script', () => {
  it('has 5 lines in monotonically increasing time', () => {
    expect(VOICEOVER_SCRIPT.length).toBe(5)
    for (let i = 1; i < VOICEOVER_SCRIPT.length; i++) {
      expect(VOICEOVER_SCRIPT[i].time).toBeGreaterThan(VOICEOVER_SCRIPT[i - 1].time)
    }
  })

  it('all lines are non-empty strings under 280 characters', () => {
    for (const line of VOICEOVER_SCRIPT) {
      expect(line.text.length).toBeGreaterThan(0)
      expect(line.text.length).toBeLessThan(280)
    }
  })

  it('activeVoiceoverLine returns the latest line at or before elapsed', () => {
    expect(activeVoiceoverLine(0)).toBeNull()
    expect(activeVoiceoverLine(0.99)).toBeNull()
    expect(activeVoiceoverLine(1)?.text).toMatch(/Welcome/i)
    expect(activeVoiceoverLine(13.99)?.text).toMatch(/Welcome/i)
    expect(activeVoiceoverLine(14)?.text).toMatch(/companies/i)
    expect(activeVoiceoverLine(42)?.text).toMatch(/Website Creation/i)
  })
})

describe('cinematic config — homepage panels', () => {
  it('has the 4 canonical panels with valid routes', () => {
    expect(HOMEPAGE_PANELS).toHaveLength(4)
    const titles = HOMEPAGE_PANELS.map((p) => p.title)
    expect(titles).toEqual(['Website Creation', 'Custom Apps', 'Universe', 'Tools'])
    for (const p of HOMEPAGE_PANELS) {
      expect(p.route.startsWith('/')).toBe(true)
      expect(p.cta.length).toBeGreaterThan(0)
    }
  })
})
