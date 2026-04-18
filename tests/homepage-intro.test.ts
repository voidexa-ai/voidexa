import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  OVERLAY_FADE_IN_DELAY_MS,
  PRIMARY_CTA,
  QUICK_MENU_PANELS,
  SECONDARY_CTA,
  SKIP_BUTTON_THRESHOLD_SEC,
} from '@/lib/intro/panels'

class MockStorage {
  private store = new Map<string, string>()
  getItem = (k: string) => (this.store.has(k) ? this.store.get(k)! : null)
  setItem = (k: string, v: string) => { this.store.set(k, v) }
  removeItem = (k: string) => { this.store.delete(k) }
  clear = () => { this.store.clear() }
  key = () => null
  get length() { return this.store.size }
}

function installWindow() {
  const storage = new MockStorage()
  vi.stubGlobal('window', { localStorage: storage })
  return storage
}

describe('homepage intro — skip preferences', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('skip key constant is voidexa_skip_intro', async () => {
    installWindow()
    const { SKIP_KEY } = await import('@/lib/intro/preferences')
    expect(SKIP_KEY).toBe('voidexa_skip_intro')
  })

  it('shouldSkipIntro returns false on first visit when flag is absent', async () => {
    installWindow()
    const { shouldSkipIntro } = await import('@/lib/intro/preferences')
    expect(shouldSkipIntro()).toBe(false)
  })

  it('shouldSkipIntro returns true when flag is set to the string "true"', async () => {
    const storage = installWindow()
    storage.setItem('voidexa_skip_intro', 'true')
    const { shouldSkipIntro } = await import('@/lib/intro/preferences')
    expect(shouldSkipIntro()).toBe(true)
  })

  it('setSkipIntro(true) writes "true" to localStorage so homepage redirects to /starmap on next visit', async () => {
    const storage = installWindow()
    const { setSkipIntro } = await import('@/lib/intro/preferences')
    setSkipIntro(true)
    expect(storage.getItem('voidexa_skip_intro')).toBe('true')
  })

  it('setSkipIntro(false) removes the flag', async () => {
    const storage = installWindow()
    storage.setItem('voidexa_skip_intro', 'true')
    const { setSkipIntro } = await import('@/lib/intro/preferences')
    setSkipIntro(false)
    expect(storage.getItem('voidexa_skip_intro')).toBeNull()
  })

  it('checkbox roundtrip: setting, then reading returns true', async () => {
    installWindow()
    const { setSkipIntro, shouldSkipIntro } = await import('@/lib/intro/preferences')
    setSkipIntro(true)
    expect(shouldSkipIntro()).toBe(true)
  })

  it('shouldSkipIntro is SSR-safe: returns false when window is undefined', async () => {
    vi.stubGlobal('window', undefined)
    const { shouldSkipIntro } = await import('@/lib/intro/preferences')
    expect(shouldSkipIntro()).toBe(false)
  })
})

describe('homepage intro — quick menu panels', () => {
  it('renders exactly 4 panels', () => {
    expect(QUICK_MENU_PANELS).toHaveLength(4)
  })

  it('panel titles are Website Creation, Custom Apps, Universe, Tools in that order', () => {
    const titles = QUICK_MENU_PANELS.map((p) => p.title)
    expect(titles).toEqual(['Website Creation', 'Custom Apps', 'Universe', 'Tools'])
  })

  it('Website Creation panel has no href (modal trigger, not route)', () => {
    const website = QUICK_MENU_PANELS.find((p) => p.key === 'website')
    expect(website).toBeDefined()
    expect(website?.href).toBeUndefined()
  })

  it('non-modal panels map to expected routes', () => {
    const routesByKey = Object.fromEntries(
      QUICK_MENU_PANELS.filter((p) => p.href).map((p) => [p.key, p.href]),
    )
    expect(routesByKey.apps).toBe('/apps')
    expect(routesByKey.universe).toBe('/starmap')
    expect(routesByKey.tools).toBe('/ai-tools')
  })

  it('every panel has a non-empty description at least 14 chars', () => {
    for (const p of QUICK_MENU_PANELS) {
      expect(p.description.length).toBeGreaterThanOrEqual(14)
    }
  })
})

describe('homepage intro — CTAs and timing constants', () => {
  it('Enter Free Flight CTA href is /freeflight', () => {
    expect(PRIMARY_CTA.href).toBe('/freeflight')
    expect(PRIMARY_CTA.label).toBe('Enter Free Flight')
  })

  it('Enter Star Map CTA href is /starmap/voidexa', () => {
    expect(SECONDARY_CTA.href).toBe('/starmap/voidexa')
    expect(SECONDARY_CTA.label).toBe('Enter Star Map')
  })

  it('skip button threshold is 3 seconds (hidden before, visible at >= 3)', () => {
    expect(SKIP_BUTTON_THRESHOLD_SEC).toBe(3)
  })

  it('overlay fades in 2000ms after video end', () => {
    expect(OVERLAY_FADE_IN_DELAY_MS).toBe(2000)
  })
})
