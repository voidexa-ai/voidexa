'use client'

import { useEffect, useState } from 'react'
import {
  COOKIE_CONSENT_KEY,
  getCookieConsent,
  setCookieConsent,
  type CookieConsent,
} from '@/lib/cookies/consent'

export default function CookieSettings() {
  const [current, setCurrent] = useState<CookieConsent | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setCurrent(getCookieConsent())
  }, [])

  function save(value: CookieConsent) {
    setCookieConsent(value)
    setCurrent(value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  return (
    <div
      data-testid="cookie-settings"
      style={{
        margin: '1.25rem 0 2rem',
        padding: '18px 20px',
        borderRadius: 14,
        background: 'rgba(0,212,255,0.025)',
        border: '1px solid rgba(0,212,255,0.12)',
      }}
    >
      <p style={{ margin: 0, fontSize: 14, color: '#cbd5e1' }}>
        Current choice:{' '}
        <strong data-testid="cookie-current" style={{ color: '#e2e8f0' }}>
          {current ?? 'not set'}
        </strong>
        {' '}&middot; stored under <code>{COOKIE_CONSENT_KEY}</code>
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => save('essential')}
          style={buttonStyle(current === 'essential')}
        >
          Essentials only
        </button>
        <button
          type="button"
          onClick={() => save('all')}
          style={buttonStyle(current === 'all')}
        >
          Allow all
        </button>
      </div>
      {saved && (
        <p style={{ margin: '10px 0 0', fontSize: 12, color: '#00d4ff' }}>
          Saved.
        </p>
      )}
    </div>
  )
}

function buttonStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 14px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    background: active ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${active ? 'rgba(0,212,255,0.45)' : 'rgba(255,255,255,0.1)'}`,
    color: active ? '#00d4ff' : '#c8d5e3',
  }
}
