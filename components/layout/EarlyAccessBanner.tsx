'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'voidexa_eab_v2_dismissed'
const TARGET_UTC = new Date('2026-04-05T00:00:00Z').getTime()

function getCountdown(): string {
  const diff = TARGET_UTC - Date.now()
  if (diff <= 0) return ''
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${d}d ${h}h ${m}m ${s}s`
}

export default function EarlyAccessBanner() {
  const [visible, setVisible] = useState(false)
  const [countdown, setCountdown] = useState('')
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') return
    setVisible(true)

    const initial = getCountdown()
    if (!initial) {
      setIsLive(true)
    } else {
      setCountdown(initial)
    }

    const id = setInterval(() => {
      const t = getCountdown()
      if (!t) {
        setIsLive(true)
        setCountdown('')
        clearInterval(id)
      } else {
        setCountdown(t)
      }
    }, 1000)

    return () => clearInterval(id)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-center px-10"
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        background: 'linear-gradient(90deg, rgba(10,8,20,0.97) 0%, rgba(22,10,45,0.97) 50%, rgba(10,8,20,0.97) 100%)',
        borderBottom: '1px solid rgba(139,92,246,0.2)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <p
        className="text-center select-none"
        style={{ color: 'rgba(200,190,230,0.9)', fontSize: '14px', fontWeight: 500, lineHeight: 1.4 }}
      >
        {isLive ? (
          <span style={{ color: 'rgba(220,210,255,0.98)', fontWeight: 700 }}>
            We are live. Welcome to voidexa.
          </span>
        ) : (
          <>
            <span style={{ color: 'rgba(220,210,255,0.98)', fontWeight: 700 }}>Early Access</span>
            {' '}— Limited slots available. We onboard users personally to ensure quality.
            {countdown && (
              <span style={{ color: 'rgba(139,92,246,0.9)', fontWeight: 700, marginLeft: 8 }}>
                | {countdown}
              </span>
            )}
          </>
        )}
      </p>
      <button
        onClick={() => { localStorage.setItem(STORAGE_KEY, 'true'); setVisible(false) }}
        aria-label="Dismiss"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded transition-colors"
        style={{ color: 'rgba(139,92,246,0.45)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(200,180,255,0.85)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(139,92,246,0.45)' }}
      >
        <X size={13} />
      </button>
    </div>
  )
}
