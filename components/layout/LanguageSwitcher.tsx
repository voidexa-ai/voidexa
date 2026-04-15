'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'
import { withLocale } from '@/lib/i18n/locale'

interface Props {
  variant?: 'compact' | 'full'
}

export default function LanguageSwitcher({ variant = 'compact' }: Props) {
  const pathname = usePathname() ?? '/'
  const { locale, t } = useI18n()

  const other = locale === 'en' ? 'da' : 'en'
  const otherHref = withLocale(pathname, other)
  const otherFlag = other === 'da' ? '🇩🇰' : '🇬🇧'
  const otherLabel = other === 'da' ? t.languageSwitcher.danish : t.languageSwitcher.english

  const size = variant === 'full' ? 36 : 30

  return (
    <Link
      href={otherHref}
      title={`${t.languageSwitcher.switchTo}: ${otherLabel}`}
      aria-label={`${t.languageSwitcher.switchTo}: ${otherLabel}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width: variant === 'full' ? 'auto' : size,
        height: size,
        padding: variant === 'full' ? '0 12px' : 0,
        borderRadius: 8,
        background: 'rgba(0,212,255,0.06)',
        border: '1px solid rgba(0,212,255,0.25)',
        color: '#cbd5e1',
        fontSize: variant === 'full' ? 14 : 16,
        lineHeight: 1,
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,212,255,0.14)'
        ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,212,255,0.55)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,212,255,0.06)'
        ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,212,255,0.25)'
      }}
    >
      <span style={{ fontSize: size === 30 ? 18 : 20 }}>{otherFlag}</span>
      {variant === 'full' && <span style={{ fontFamily: 'var(--font-space)', fontSize: 13, letterSpacing: '0.08em' }}>{otherLabel}</span>}
    </Link>
  )
}
