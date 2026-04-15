'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import type { Dict, Locale } from './types'
import { en } from './en'
import { da } from './da'
import { getLocaleFromPathname, localizeHref } from './locale'

const DICTS: Record<Locale, Dict> = { en, da }

interface LocaleCtx {
  locale: Locale
  t: Dict
  localizeHref: (href: string) => string
}

const Ctx = createContext<LocaleCtx | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const value = useMemo<LocaleCtx>(() => ({
    locale,
    t: DICTS[locale],
    localizeHref: (href: string) => localizeHref(href, locale),
  }), [locale])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n(): LocaleCtx {
  const ctx = useContext(Ctx)
  if (ctx) return ctx
  // Fallback for any component mounted outside the provider (e.g. during
  // early SSR before hydration). Return English.
  return {
    locale: 'en',
    t: en,
    localizeHref: (href: string) => href,
  }
}

/** Shorthand: returns just the dictionary. */
export function useT(): Dict {
  return useI18n().t
}

export function useLocale(): Locale {
  return useI18n().locale
}

/** String formatter — replaces {{key}} tokens with vars. */
export function format(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ''))
}
