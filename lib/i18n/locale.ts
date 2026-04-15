import type { Locale } from './types'
import { DEFAULT_LOCALE } from './types'

const DK_PREFIX = '/dk'

export function getLocaleFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return DEFAULT_LOCALE
  if (pathname === DK_PREFIX || pathname.startsWith(DK_PREFIX + '/')) return 'da'
  return 'en'
}

export function stripLocale(pathname: string): string {
  if (pathname === DK_PREFIX) return '/'
  if (pathname.startsWith(DK_PREFIX + '/')) return pathname.slice(DK_PREFIX.length)
  return pathname
}

export function withLocale(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname)
  if (locale === 'da') {
    return base === '/' ? DK_PREFIX : DK_PREFIX + base
  }
  return base
}

export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/')) return href
  if (locale === 'da') {
    if (href === '/') return DK_PREFIX
    if (href.startsWith(DK_PREFIX + '/') || href === DK_PREFIX) return href
    return DK_PREFIX + href
  }
  return href
}
