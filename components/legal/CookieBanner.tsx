'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  getCookieConsent,
  setCookieConsent,
  type CookieConsent,
} from '@/lib/cookies/consent'

export { COOKIE_CONSENT_KEY, getCookieConsent, setCookieConsent } from '@/lib/cookies/consent'
export type { CookieConsent } from '@/lib/cookies/consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (getCookieConsent() === null) setVisible(true)
  }, [])

  function accept(value: CookieConsent) {
    setCookieConsent(value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      data-testid="cookie-banner"
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 70,
        maxWidth: 640,
        margin: '0 auto',
        padding: '18px 20px',
        borderRadius: 16,
        background: 'rgba(10,10,15,0.92)',
        border: '1px solid rgba(0,212,255,0.18)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
        color: '#c8d5e3',
        fontFamily: 'var(--font-inter)',
      }}
    >
      <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>
        We use essential cookies to run voidexa.com. With your permission, we
        also use analytics cookies to understand how the site is used. You can
        change this anytime on the{' '}
        <Link href="/cookies" style={{ color: '#00d4ff' }}>
          cookies page
        </Link>
        .
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => accept('essential')}
          data-testid="cookie-essential"
          style={{
            flex: '1 1 160px',
            padding: '10px 16px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#c8d5e3',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Essentials only
        </button>
        <button
          type="button"
          onClick={() => accept('all')}
          data-testid="cookie-all"
          style={{
            flex: '1 1 160px',
            padding: '10px 16px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            border: 'none',
            color: '#0a0a0f',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Allow all
        </button>
      </div>
    </div>
  )
}
