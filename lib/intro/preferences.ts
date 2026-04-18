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
