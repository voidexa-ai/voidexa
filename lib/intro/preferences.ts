export const SKIP_KEY = 'voidexa_skip_intro'

export function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(SKIP_KEY) === 'true'
  } catch {
    return false
  }
}

export function setSkipIntro(value: boolean): void {
  if (typeof window === 'undefined') return
  try {
    if (value) window.localStorage.setItem(SKIP_KEY, 'true')
    else window.localStorage.removeItem(SKIP_KEY)
  } catch {
    // ignore — storage may be blocked
  }
}

export type IntroMode = 'redirect' | 'menu-only' | 'video'

// Source of truth for what the / route renders on load.
// menu-only wins over the skip-intro redirect — users who click "Quick Menu"
// from the nav dropdown expect the menu, not a jump to /starmap.
export function computeIntroMode(params: {
  menuOnly: boolean
  skipIntro: boolean
}): IntroMode {
  if (params.menuOnly) return 'menu-only'
  if (params.skipIntro) return 'redirect'
  return 'video'
}
