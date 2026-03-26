'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'voidexa_beta_banner_dismissed'
const LAUNCH_DATE = new Date('2026-04-05T00:00:00Z')

function getCountdown(): string {
  const now = new Date()
  const diff = LAUNCH_DATE.getTime() - now.getTime()
  if (diff <= 0) return 'Platform is live!'

  const totalMinutes = Math.floor(diff / 60000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) return `Platform launches in ${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `Platform launches in ${hours}h ${minutes}m`
  return `Platform launches in ${minutes}m`
}

export default function BetaBanner() {
  const [visible, setVisible] = useState(false)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVisible(localStorage.getItem(STORAGE_KEY) !== 'true')
    }
    setCountdown(getCountdown())
    const interval = setInterval(() => setCountdown(getCountdown()), 60000)
    return () => clearInterval(interval)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center px-10 py-2"
      style={{
        background: 'linear-gradient(90deg, rgba(10,8,20,0.98) 0%, rgba(20,10,40,0.98) 50%, rgba(10,8,20,0.98) 100%)',
        borderBottom: '1px solid rgba(139,92,246,0.18)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <p className="text-center text-[11px] tracking-wide" style={{ color: 'rgba(200,190,230,0.85)' }}>
        <span className="font-semibold" style={{ color: 'rgba(220,210,255,0.95)' }}>Early Access</span>
        {' '}—{' '}
        We&apos;re building something big.{' '}
        <span style={{ color: 'rgba(170,140,255,0.9)' }}>{countdown}</span>
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-colors"
        style={{ color: 'rgba(139,92,246,0.4)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(200,180,255,0.8)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(139,92,246,0.4)'}
      >
        <X size={12} />
      </button>
    </div>
  )
}
