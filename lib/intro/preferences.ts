// Sprint 15 Task 11 — split onboarding preferences into three orthogonal flags:
//   - SKIP_VIDEO_KEY: permanently skip the intro video (localStorage)
//   - SKIP_QUICK_MENU_KEY: permanently skip the quick menu (localStorage)
//   - SESSION_SEEN_KEY: one-per-browser-session flag (sessionStorage)
//
// Legacy `voidexa_skip_intro` flag is still read for backwards-compat — users
// who opted out previously continue to land directly on /starmap.

export const SKIP_VIDEO_KEY = 'voidexaSkipIntroVideo'
export const SKIP_QUICK_MENU_KEY = 'voidexaSkipQuickMenu'
export const SESSION_SEEN_KEY = 'hasSeenIntroThisSession'
export const AUDIO_PREFERENCE_KEY = 'voidexaAudioPreference'

// Retained so older code + migration paths keep working. New code should use
// SKIP_VIDEO_KEY / SKIP_QUICK_MENU_KEY.
export const LEGACY_SKIP_KEY = 'voidexa_skip_intro'
export const SKIP_KEY = LEGACY_SKIP_KEY

export type AudioPreference = 'enabled' | 'muted' | null

function readLocal(key: string): string | null {
  if (typeof window === 'undefined') return null
  try { return window.localStorage.getItem(key) } catch { return null }
}

function writeLocal(key: string, value: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    /* storage blocked — ignore */
  }
}

function readSession(key: string): string | null {
  if (typeof window === 'undefined') return null
  try { return window.sessionStorage.getItem(key) } catch { return null }
}

function writeSession(key: string, value: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (value === null) window.sessionStorage.removeItem(key)
    else window.sessionStorage.setItem(key, value)
  } catch {
    /* storage blocked — ignore */
  }
}

export function shouldSkipIntroVideo(): boolean {
  return readLocal(SKIP_VIDEO_KEY) === 'true' || readLocal(LEGACY_SKIP_KEY) === 'true'
}

export function setSkipIntroVideo(value: boolean): void {
  writeLocal(SKIP_VIDEO_KEY, value ? 'true' : null)
}

export function shouldSkipQuickMenu(): boolean {
  return readLocal(SKIP_QUICK_MENU_KEY) === 'true'
}

export function setSkipQuickMenu(value: boolean): void {
  writeLocal(SKIP_QUICK_MENU_KEY, value ? 'true' : null)
}

export function hasSeenIntroThisSession(): boolean {
  return readSession(SESSION_SEEN_KEY) === 'true'
}

export function markIntroSeenThisSession(): void {
  writeSession(SESSION_SEEN_KEY, 'true')
}

export function getAudioPreference(): AudioPreference {
  const raw = readLocal(AUDIO_PREFERENCE_KEY)
  if (raw === 'enabled' || raw === 'muted') return raw
  return null
}

export function setAudioPreference(pref: AudioPreference): void {
  writeLocal(AUDIO_PREFERENCE_KEY, pref)
}

export function resetOnboardingPreferences(): void {
  writeLocal(SKIP_VIDEO_KEY, null)
  writeLocal(SKIP_QUICK_MENU_KEY, null)
  writeLocal(LEGACY_SKIP_KEY, null)
  writeLocal(AUDIO_PREFERENCE_KEY, null)
  writeSession(SESSION_SEEN_KEY, null)
}

// ─── Legacy names retained so existing imports keep compiling. ─────────────
// setSkipIntro continues to write to the legacy `voidexa_skip_intro` key so
// pre-Sprint-15 tests + any persisted user preferences keep working. The new
// setSkipIntroVideo API is the forward path and writes to SKIP_VIDEO_KEY.
export function shouldSkipIntro(): boolean { return shouldSkipIntroVideo() }
export function setSkipIntro(value: boolean): void {
  writeLocal(LEGACY_SKIP_KEY, value ? 'true' : null)
}

export type IntroMode = 'redirect' | 'menu-only' | 'video' | 'quick-menu'

// Sprint 15 Task 11: expanded decision table. See skill file for the full
// truth table mapping skipVideo × skipQuickMenu × sessionSeen → flow.
export interface ComputeIntroModeInput {
  menuOnly: boolean
  skipVideo?: boolean
  skipQuickMenu?: boolean
  sessionSeen?: boolean
  /**
   * Deprecated single-flag API retained for backwards-compat with tests +
   * call-sites written before Sprint 15. Behaves as "skip everything, jump
   * straight to /starmap" — i.e. equivalent to `skipVideo && skipQuickMenu`.
   */
  skipIntro?: boolean
}

export function computeIntroMode(params: ComputeIntroModeInput): IntroMode {
  // Manual "Quick Menu" link from nav — always honor it.
  if (params.menuOnly) return 'menu-only'

  // Legacy single-flag shape: skipIntro alone means "skip both" → redirect.
  const hasExplicitSkips = params.skipVideo !== undefined || params.skipQuickMenu !== undefined
  const legacySkip = !!params.skipIntro && !hasExplicitSkips
  const skipVideo = params.skipVideo ?? legacySkip
  const skipQuickMenu = params.skipQuickMenu ?? legacySkip
  const sessionSeen = params.sessionSeen ?? false

  // Both skipped → jump straight to /starmap.
  if (skipVideo && skipQuickMenu) return 'redirect'

  // Video skipped or already seen this session → go to quick menu.
  if (skipVideo || sessionSeen) {
    return skipQuickMenu ? 'redirect' : 'quick-menu'
  }

  // Full flow: play the video, then show the menu afterwards.
  return 'video'
}
