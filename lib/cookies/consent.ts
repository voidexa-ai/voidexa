export const COOKIE_CONSENT_KEY = 'voidexa_cookie_consent_v1'

export type CookieConsent = 'essential' | 'all'

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY)
  return raw === 'essential' || raw === 'all' ? raw : null
}

export function setCookieConsent(value: CookieConsent): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value)
}

export function clearCookieConsent(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(COOKIE_CONSENT_KEY)
}
