/**
 * Sprint 7 — SoundManager. Singleton, SSR-safe, HTMLAudioElement based.
 *
 * Why HTMLAudio over WebAudio: simpler, autoplay quirks already solved by
 * the browser layer, no AudioContext lifecycle to manage. Cap of 6 concurrent
 * one-shots keeps the mixer from clipping. Loops bypass the cap.
 *
 * Volume + mute persisted to localStorage:
 *   voidexa.sound.volume  → '0' .. '1'
 *   voidexa.sound.muted   → '1' | '0'
 */

import { ALL_SOUND_KEYS, type PlayOptions, type SoundEventKey } from './types'

const MAX_CONCURRENT = 6
const VOL_KEY = 'voidexa.sound.volume'
const MUTE_KEY = 'voidexa.sound.muted'

interface ActiveSource {
  el: HTMLAudioElement
  key: SoundEventKey
  loop: boolean
  startedAt: number
}

class SoundManagerImpl {
  private masterVolume = 0.7
  private muted = false
  private active: ActiveSource[] = []
  private loops: Map<SoundEventKey, HTMLAudioElement> = new Map()
  private hydrated = false

  private hydrate() {
    if (this.hydrated || typeof window === 'undefined') return
    this.hydrated = true
    const v = window.localStorage.getItem(VOL_KEY)
    const m = window.localStorage.getItem(MUTE_KEY)
    if (v !== null) this.masterVolume = clamp01(parseFloat(v))
    if (m !== null) this.muted = m === '1'
  }

  private persist() {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(VOL_KEY, String(this.masterVolume))
    window.localStorage.setItem(MUTE_KEY, this.muted ? '1' : '0')
  }

  private srcFor(key: SoundEventKey): string {
    return `/sounds/${key}.mp3`
  }

  /** Play a one-shot sound. Returns the HTMLAudioElement (null on SSR). */
  play(key: SoundEventKey, opts: PlayOptions = {}): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null
    this.hydrate()
    if (this.muted) return null
    const loop = !!opts.loop

    if (loop && this.loops.has(key)) {
      // already looping — return existing
      return this.loops.get(key) ?? null
    }

    if (!loop) {
      // Evict oldest if over the cap
      this.active = this.active.filter((s) => !s.el.ended)
      if (this.active.length >= MAX_CONCURRENT) {
        const oldest = this.active.shift()
        oldest?.el.pause()
      }
    }

    const el = new Audio(this.srcFor(key))
    el.volume = clamp01((opts.volume ?? 1) * this.masterVolume)
    el.loop = loop
    el.play().catch(() => {
      /* autoplay denied — ignore */
    })

    if (loop) this.loops.set(key, el)
    else this.active.push({ el, key, loop, startedAt: Date.now() })

    return el
  }

  /** Stop a specific sound (loops + recent one-shots with this key). */
  stop(key: SoundEventKey): void {
    const loop = this.loops.get(key)
    if (loop) {
      loop.pause()
      this.loops.delete(key)
    }
    this.active = this.active.filter((s) => {
      if (s.key === key) {
        s.el.pause()
        return false
      }
      return true
    })
  }

  /** Stop everything. */
  stopAll(): void {
    for (const [, el] of this.loops) el.pause()
    this.loops.clear()
    for (const s of this.active) s.el.pause()
    this.active = []
  }

  setMasterVolume(v: number): void {
    this.hydrate()
    this.masterVolume = clamp01(v)
    // Apply to anything currently playing
    for (const [, el] of this.loops) el.volume = this.masterVolume
    for (const s of this.active) s.el.volume = this.masterVolume
    this.persist()
  }

  getMasterVolume(): number {
    this.hydrate()
    return this.masterVolume
  }

  setMuted(b: boolean): void {
    this.hydrate()
    this.muted = b
    if (b) this.stopAll()
    this.persist()
  }

  isMuted(): boolean {
    this.hydrate()
    return this.muted
  }

  /** For tests + introspection. */
  activeCount(): number {
    return this.active.length + this.loops.size
  }

  loopingKeys(): SoundEventKey[] {
    return [...this.loops.keys()]
  }
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

let _singleton: SoundManagerImpl | null = null

export function getSoundManager(): SoundManagerImpl {
  if (!_singleton) _singleton = new SoundManagerImpl()
  return _singleton
}

/** Test-only — resets state between tests. */
export function __resetSoundManagerForTests(): void {
  _singleton = null
}

/** Re-exported for ergonomics. */
export { ALL_SOUND_KEYS }
export type { SoundEventKey, PlayOptions }
