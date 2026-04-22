// Sprint AFS-1 regression coverage for the homepage cinematic -> quick menu
// flow. The project runs vitest with a jsdom-lite mock pattern, not a real
// browser runner — so this file asserts on source-level invariants (strings,
// styles, storage keys) plus direct exercise of the preferences module.
//
// The six behaviors locked in here correspond 1:1 to the sprint's tasks:
//
//   Task 1 — backdrop aspect matches video (documented via the backdrop URL)
//   Task 2 — no in-video MUTE button ever renders
//   Task 3 — audio-gate shows once per browser session (not once per device)
//   Task 4 — no 'Bespoke' copy in quick menu panels
//   Task 5 — checkbox / replay link contrast at readable thresholds
//   Task 6 — Enter Star Map / Enter Free Flight still route to /starmap and
//            /freeflight, and the /?menu=true shortcut still lands on the menu

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')

const INTRO_VIDEO_SRC = read('components', 'home', 'IntroVideo.tsx')
const AUDIO_GATE_SRC = read('components', 'home', 'AudioGatePopup.tsx')
const QUICK_MENU_SRC = read('components', 'home', 'QuickMenuOverlay.tsx')
const PANELS_SRC = read('lib', 'intro', 'panels.ts')
const PAGE_SRC = read('app', 'page.tsx')
const PREFS_SRC = read('lib', 'intro', 'preferences.ts')

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
  const local = new MockStorage()
  const session = new MockStorage()
  vi.stubGlobal('window', { localStorage: local, sessionStorage: session })
  return { local, session }
}

describe('AFS-1 Task 2 — MUTE button is gone from IntroVideo', () => {
  it('no <button> element in the video component', () => {
    expect(INTRO_VIDEO_SRC).not.toMatch(/<button/)
  })

  it('no muted/setMuted state or toggleMute handler', () => {
    expect(INTRO_VIDEO_SRC).not.toMatch(/setMuted/)
    expect(INTRO_VIDEO_SRC).not.toMatch(/toggleMute/)
  })

  it('no user-visible Mute / Unmute label strings', () => {
    // initialMuted is a prop name — expected. The label strings shown in the
    // old bottom-right button (e.g. '>Mute<', 'Unmute voiceover') must not
    // appear anywhere in the component source.
    expect(INTRO_VIDEO_SRC).not.toMatch(/>\s*Mute\s*</)
    expect(INTRO_VIDEO_SRC).not.toMatch(/Unmute\s+voiceover/)
    expect(INTRO_VIDEO_SRC).not.toMatch(/Unmute intro audio/)
  })

  it('<video muted> attribute is driven by the initialMuted prop', () => {
    expect(INTRO_VIDEO_SRC).toMatch(/muted=\{initialMuted\}/)
  })
})

describe('AFS-1 Task 3 — audio gate is per-session, not once-per-device', () => {
  beforeEach(() => { vi.unstubAllGlobals() })

  it('preferences module exports the session-scoped helpers', async () => {
    installWindow()
    const mod = await import('@/lib/intro/preferences')
    expect(typeof mod.hasAnsweredAudioGateThisSession).toBe('function')
    expect(typeof mod.markAudioGateAnsweredThisSession).toBe('function')
    expect(mod.AUDIO_GATE_ANSWERED_KEY).toBe('voidexaSoundPopupAnsweredThisSession')
  })

  it('marking the gate writes to sessionStorage, not localStorage', async () => {
    const { local, session } = installWindow()
    const { markAudioGateAnsweredThisSession, hasAnsweredAudioGateThisSession } =
      await import('@/lib/intro/preferences')
    expect(hasAnsweredAudioGateThisSession()).toBe(false)
    markAudioGateAnsweredThisSession()
    expect(session.getItem('voidexaSoundPopupAnsweredThisSession')).toBe('true')
    expect(local.getItem('voidexaSoundPopupAnsweredThisSession')).toBeNull()
    expect(hasAnsweredAudioGateThisSession()).toBe(true)
  })

  it('resetOnboardingPreferences clears the session flag too', async () => {
    const { session } = installWindow()
    const { markAudioGateAnsweredThisSession, resetOnboardingPreferences } =
      await import('@/lib/intro/preferences')
    markAudioGateAnsweredThisSession()
    expect(session.getItem('voidexaSoundPopupAnsweredThisSession')).toBe('true')
    resetOnboardingPreferences()
    expect(session.getItem('voidexaSoundPopupAnsweredThisSession')).toBeNull()
  })

  it('voidexaAudioPreference localStorage key is preserved for backwards compat', () => {
    expect(PREFS_SRC).toMatch(/AUDIO_PREFERENCE_KEY\s*=\s*'voidexaAudioPreference'/)
  })

  it('homepage gates the popup on the session flag, not on a null audio pref', () => {
    expect(PAGE_SRC).toMatch(/hasAnsweredAudioGateThisSession/)
    expect(PAGE_SRC).toMatch(/markAudioGateAnsweredThisSession/)
    // The old once-per-device check ( pref === null -> show gate ) must not
    // still be the sole trigger — the session flag is the new source of truth.
    expect(PAGE_SRC).not.toMatch(/pref\s*===\s*null[^\n]*setStage\(['"]audio-gate['"]\)/)
  })

  it('audio-gate popup no longer claims the choice is saved forever', () => {
    expect(AUDIO_GATE_SRC).not.toMatch(/saved for next time/i)
    expect(AUDIO_GATE_SRC).not.toMatch(/mute it at any time from the corner control/i)
  })

  it('audio-gate popup accepts a defaultChoice prop so it can highlight the prior answer', () => {
    expect(AUDIO_GATE_SRC).toMatch(/defaultChoice/)
  })
})

describe('AFS-1 Task 4 — no Bespoke copy in the quick menu', () => {
  it('Custom Apps description was rewritten', () => {
    expect(PANELS_SRC).toMatch(/Custom-built apps tailored to your workflow\./)
  })

  it('no "bespoke" token in intro/panels source (case-insensitive)', () => {
    expect(PANELS_SRC.toLowerCase()).not.toContain('bespoke')
  })
})

describe('AFS-1 Task 5 — checkbox + replay link contrast', () => {
  it('checkbox label style is lifted into a shared constant', () => {
    expect(QUICK_MENU_SRC).toMatch(/CHECKBOX_LABEL_STYLE/)
    expect(QUICK_MENU_SRC).toMatch(/REPLAY_LINK_STYLE/)
  })

  it('checkbox label color opacity is >= 0.9', () => {
    const match = QUICK_MENU_SRC.match(/CHECKBOX_LABEL_STYLE[\s\S]*?color:\s*'rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)'/)
    expect(match, 'CHECKBOX_LABEL_STYLE color not found').toBeTruthy()
    expect(Number(match![1])).toBeGreaterThanOrEqual(0.9)
  })

  it('replay link color opacity is >= 0.9', () => {
    const match = QUICK_MENU_SRC.match(/REPLAY_LINK_STYLE[\s\S]*?color:\s*'rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)'/)
    expect(match, 'REPLAY_LINK_STYLE color not found').toBeTruthy()
    expect(Number(match![1])).toBeGreaterThanOrEqual(0.9)
  })

  it('both styles add a text-shadow for legibility on any backdrop luminance', () => {
    expect(QUICK_MENU_SRC).toMatch(/CHECKBOX_LABEL_STYLE[\s\S]*?textShadow/)
    expect(QUICK_MENU_SRC).toMatch(/REPLAY_LINK_STYLE[\s\S]*?textShadow/)
  })

  it('checkbox label font-weight is bumped to 500', () => {
    expect(QUICK_MENU_SRC).toMatch(/CHECKBOX_LABEL_STYLE[\s\S]*?fontWeight:\s*500/)
  })
})

describe('AFS-1 Task 6 — CTAs and /?menu=true routing regression', () => {
  it('PRIMARY_CTA points at /freeflight with the Enter Free Flight label', async () => {
    const { PRIMARY_CTA } = await import('@/lib/intro/panels')
    expect(PRIMARY_CTA).toEqual({ label: 'Enter Free Flight', href: '/freeflight' })
  })

  it('SECONDARY_CTA points at /starmap with the Enter Star Map label', async () => {
    const { SECONDARY_CTA } = await import('@/lib/intro/panels')
    expect(SECONDARY_CTA).toEqual({ label: 'Enter Star Map', href: '/starmap' })
  })

  it('computeIntroMode honors /?menu=true even when skip flags are set', async () => {
    const { computeIntroMode } = await import('@/lib/intro/preferences')
    expect(computeIntroMode({ menuOnly: true, skipVideo: true, skipQuickMenu: true })).toBe('menu-only')
  })

  it('computeIntroMode sends returning session-seen visitors to the quick menu', async () => {
    const { computeIntroMode } = await import('@/lib/intro/preferences')
    expect(computeIntroMode({ menuOnly: false, sessionSeen: true })).toBe('quick-menu')
  })

  it('computeIntroMode plays the video for first-time visitors', async () => {
    const { computeIntroMode } = await import('@/lib/intro/preferences')
    expect(computeIntroMode({ menuOnly: false, sessionSeen: false })).toBe('video')
  })

  it('computeIntroMode redirects when both skip flags are set', async () => {
    const { computeIntroMode } = await import('@/lib/intro/preferences')
    expect(computeIntroMode({ menuOnly: false, skipVideo: true, skipQuickMenu: true })).toBe('redirect')
  })

  it('homepage navigates via router.replace(/starmap) on the redirect branch', () => {
    expect(PAGE_SRC).toMatch(/router\.replace\(['"]\/starmap['"]\)/)
  })
})
