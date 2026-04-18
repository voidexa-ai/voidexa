'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { formatGhai, usdToGhai } from '@/lib/ghai/format'

interface GhaiBalanceData {
  platformBalance: number
}

const EXEMPT_EMAILS = ['ceo@voidexa.com', 'tom@voidexa.com']
const TOP_UP_AMOUNTS = [5, 10, 25, 50]

export default function GhaiBalance() {
  const { user } = useAuth()
  const [ghai, setGhai] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const exempt = EXEMPT_EMAILS.includes(user?.email ?? '')

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/ghai/balance')
      if (!res.ok) return
      const data: GhaiBalanceData = await res.json()
      setGhai(typeof data?.platformBalance === 'number' ? data.platformBalance : 0)
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    if (!user) { setGhai(null); return }
    void fetchBalance()
  }, [user, fetchBalance])

  const handleTopUp = async (amount: number) => {
    setLoading(true)
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      const data = await res.json()
      if (data.checkout_url) window.location.href = data.checkout_url
    } catch { /* silent */ }
    setLoading(false)
  }

  if (!user) return null

  const label = exempt ? 'Free Access' : formatGhai(ghai ?? 0)

  return (
    <>
      <button
        data-testid="ghai-balance"
        onClick={() => !exempt && setShowModal(true)}
        aria-label="GHAI balance"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          borderRadius: 999,
          background: 'rgba(0,212,255,0.08)',
          border: '1px solid rgba(0,212,255,0.35)',
          color: '#cffbff',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'var(--font-space, monospace)',
          letterSpacing: '0.04em',
          cursor: exempt ? 'default' : 'pointer',
          transition: 'all 0.18s',
          textShadow: '0 0 10px rgba(0,212,255,0.35)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/ghai.svg" alt="" aria-hidden width={18} height={18} style={{ display: 'block' }} />
        <span>{label}</span>
      </button>

      {showModal && !exempt && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            role="dialog"
            aria-label="Top up wallet"
            style={{
              minWidth: 320,
              maxWidth: 420,
              padding: 24,
              borderRadius: 14,
              background: '#0b0c1a',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#e2e8f0',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Top Up Wallet</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6 }}>
              Balance: <span style={{ color: '#7ff3ff', fontWeight: 700 }}>{formatGhai(ghai ?? 0)}</span>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginTop: 16 }}>
              {TOP_UP_AMOUNTS.map(usd => (
                <button
                  key={usd}
                  disabled={loading}
                  onClick={() => handleTopUp(usd)}
                  style={{
                    padding: '12px 10px',
                    background: 'rgba(127,119,221,0.22)',
                    border: '1px solid rgba(127,119,221,0.4)',
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  +{usdToGhai(usd).toLocaleString('en-US')} GHAI
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>
                    ${usd}
                  </div>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 14 }}>
              Secure checkout via Stripe
            </p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                display: 'block',
                width: '100%',
                marginTop: 10,
                padding: '10px 0',
                fontSize: 14,
                color: '#94a3b8',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
