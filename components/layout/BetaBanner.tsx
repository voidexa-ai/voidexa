'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'voidexa_beta_banner_dismissed'

export default function BetaBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVisible(localStorage.getItem(STORAGE_KEY) !== 'true')
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center px-10"
      style={{
        paddingTop: '12px',
        paddingBottom: '12px',
        background: 'linear-gradient(90deg, rgba(10,8,20,0.98) 0%, rgba(20,10,40,0.98) 50%, rgba(10,8,20,0.98) 100%)',
        borderBottom: '1px solid rgba(139,92,246,0.18)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <p
        className="text-center"
        style={{ color: 'rgba(200,190,230,0.9)', fontSize: '15px', fontWeight: 500 }}
      >
        <span style={{ color: 'rgba(220,210,255,0.98)', fontWeight: 600 }}>Early Access</span>
        {' '}— Limited slots available. We onboard users personally to ensure quality.
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-colors"
        style={{ color: 'rgba(139,92,246,0.4)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(200,180,255,0.8)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(139,92,246,0.4)'}
      >
        <X size={14} />
      </button>
    </div>
  )
}
