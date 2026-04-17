import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ALL_SOUND_KEYS, getSoundManager, __resetSoundManagerForTests } from '../manager'
import { EVENT_MAP, playEvent } from '../events'

class FakeAudio {
  src: string
  volume = 1
  loop = false
  paused = true
  ended = false
  static instances: FakeAudio[] = []
  constructor(src: string) {
    this.src = src
    FakeAudio.instances.push(this)
  }
  play(): Promise<void> {
    this.paused = false
    return Promise.resolve()
  }
  pause(): void {
    this.paused = true
  }
}

class FakeStorage {
  private data: Map<string, string> = new Map()
  getItem(k: string): string | null {
    return this.data.get(k) ?? null
  }
  setItem(k: string, v: string): void {
    this.data.set(k, v)
  }
  removeItem(k: string): void {
    this.data.delete(k)
  }
  clear(): void {
    this.data.clear()
  }
}

beforeEach(() => {
  FakeAudio.instances = []
  ;(globalThis as Record<string, unknown>).Audio = FakeAudio
  ;(globalThis as Record<string, unknown>).window = {
    localStorage: new FakeStorage(),
  }
  __resetSoundManagerForTests()
})

afterEach(() => {
  vi.restoreAllMocks()
  delete (globalThis as Record<string, unknown>).Audio
  delete (globalThis as Record<string, unknown>).window
})

describe('SoundManager — basics', () => {
  it('exposes 67 sound keys', () => {
    expect(ALL_SOUND_KEYS.length).toBe(67)
    expect(new Set(ALL_SOUND_KEYS).size).toBe(67)
  })

  it('play() returns an Audio element with correct src', () => {
    const mgr = getSoundManager()
    const el = mgr.play('menu-click') as unknown as FakeAudio
    expect(el).not.toBeNull()
    expect(el.src).toBe('/sounds/menu-click.mp3')
  })

  it('play() applies master volume', () => {
    const mgr = getSoundManager()
    mgr.setMasterVolume(0.5)
    const el = mgr.play('menu-click') as unknown as FakeAudio
    expect(el.volume).toBeCloseTo(0.5, 5)
  })

  it('play(opts.volume) multiplies master volume', () => {
    const mgr = getSoundManager()
    mgr.setMasterVolume(0.6)
    const el = mgr.play('menu-click', { volume: 0.5 }) as unknown as FakeAudio
    expect(el.volume).toBeCloseTo(0.3, 5)
  })

  it('does not play when muted', () => {
    const mgr = getSoundManager()
    mgr.setMuted(true)
    const el = mgr.play('menu-click')
    expect(el).toBeNull()
  })
})

describe('SoundManager — concurrency cap', () => {
  it('caps simultaneous one-shots at 6, evicts oldest', () => {
    const mgr = getSoundManager()
    for (let i = 0; i < 8; i++) mgr.play('weapon-fire-laser-beam')
    expect(mgr.activeCount()).toBeLessThanOrEqual(6)
  })

  it('loops bypass the one-shot cap', () => {
    const mgr = getSoundManager()
    for (let i = 0; i < 6; i++) mgr.play('weapon-fire-laser-beam')
    mgr.play('battle-tension-loop', { loop: true })
    expect(mgr.loopingKeys()).toContain('battle-tension-loop')
  })

  it('replaying same loop key returns the existing element, no duplicate', () => {
    const mgr = getSoundManager()
    const a = mgr.play('battle-tension-loop', { loop: true })
    const b = mgr.play('battle-tension-loop', { loop: true })
    expect(a).toBe(b)
    expect(mgr.loopingKeys().length).toBe(1)
  })
})

describe('SoundManager — stop / stopAll', () => {
  it('stop(key) removes a specific looping sound', () => {
    const mgr = getSoundManager()
    mgr.play('battle-tension-loop', { loop: true })
    mgr.play('battle-intense-loop', { loop: true })
    mgr.stop('battle-tension-loop')
    expect(mgr.loopingKeys()).toEqual(['battle-intense-loop'])
  })

  it('stopAll clears everything', () => {
    const mgr = getSoundManager()
    mgr.play('weapon-fire-laser-beam')
    mgr.play('battle-tension-loop', { loop: true })
    mgr.stopAll()
    expect(mgr.activeCount()).toBe(0)
  })

  it('setMuted(true) stops all currently playing', () => {
    const mgr = getSoundManager()
    mgr.play('battle-tension-loop', { loop: true })
    mgr.setMuted(true)
    expect(mgr.loopingKeys().length).toBe(0)
  })
})

describe('SoundManager — persistence', () => {
  it('persists volume to localStorage', () => {
    getSoundManager().setMasterVolume(0.42)
    const win = (globalThis as { window: { localStorage: FakeStorage } }).window
    expect(win.localStorage.getItem('voidexa.sound.volume')).toBe('0.42')
  })

  it('persists muted to localStorage', () => {
    getSoundManager().setMuted(true)
    const win = (globalThis as { window: { localStorage: FakeStorage } }).window
    expect(win.localStorage.getItem('voidexa.sound.muted')).toBe('1')
  })

  it('hydrates from localStorage on first call', () => {
    const win = (globalThis as { window: { localStorage: FakeStorage } }).window
    win.localStorage.setItem('voidexa.sound.volume', '0.33')
    win.localStorage.setItem('voidexa.sound.muted', '1')
    const mgr = getSoundManager()
    expect(mgr.getMasterVolume()).toBeCloseTo(0.33, 5)
    expect(mgr.isMuted()).toBe(true)
  })

  it('clamps invalid volumes to [0,1]', () => {
    const mgr = getSoundManager()
    mgr.setMasterVolume(-1)
    expect(mgr.getMasterVolume()).toBe(0)
    mgr.setMasterVolume(99)
    expect(mgr.getMasterVolume()).toBe(1)
  })
})

describe('events.ts — semantic mapping', () => {
  it('every EVENT_MAP value is a real sound key', () => {
    const validKeys = new Set(ALL_SOUND_KEYS)
    for (const [event, key] of Object.entries(EVENT_MAP)) {
      expect(validKeys.has(key as never), `event "${event}" → unknown key "${key}"`).toBe(
        true
      )
    }
  })

  it('playEvent dispatches to the correct file', () => {
    playEvent('combat.weapon.laser')
    const last = FakeAudio.instances.at(-1)!
    expect(last.src).toBe('/sounds/weapon-fire-laser-beam.mp3')
  })
})
