'use client'

import { useEffect } from 'react'
import { useLocale } from '@/lib/i18n/context'

/**
 * Syncs the <html lang> attribute with the active locale on the client.
 * The server renders `lang="en"`; this swaps to `da` on /dk/* routes after
 * hydration so screen readers and `:lang()` selectors reflect reality.
 */
export default function LocaleHtml() {
  const locale = useLocale()
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
