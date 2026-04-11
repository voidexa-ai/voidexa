'use client'

import { useState, useEffect, useCallback } from 'react'

interface WalletData {
  balance_usd: number
  total_deposited_usd: number
  total_spent_usd: number
}

const TOP_UP_AMOUNTS = [5, 10, 25, 50]

export default function WalletBar({ exempt }: { exempt?: boolean }) {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet')
      if (res.ok) {
        const data = await res.json()
        setWallet(data)
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    if (!exempt) fetchWallet()
  }, [exempt, fetchWallet])

  // Listen for successful top-up redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('topup') === 'success') {
      fetchWallet()
      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete('topup')
      window.history.replaceState({}, '', url.toString())
    }
  }, [fetchWallet])

  if (exempt) {
    return (
      <div
        className="flex items-center justify-between px-4 py-2 rounded-lg"
        style={{
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.18)',
        }}
      >
        <span style={{ fontSize: 14, color: '#4ade80', fontWeight: 600 }}>
          Admin / Tester — Free Access
        </span>
      </div>
    )
  }

  const balance = parseFloat(String(wallet?.balance_usd ?? 0))

  const handleTopUp = async (amount: number) => {
    setLoading(true)
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      const data = await res.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch { /* silent */ }
    setLoading(false)
  }

  return (
    <>
      <div
        className="flex items-center justify-between gap-3 px-4 py-2 rounded-lg"
        style={{
          background: balance > 0 ? 'rgba(74,222,128,0.06)' : 'rgba(239,68,68,0.06)',
          border: `1px solid ${balance > 0 ? 'rgba(74,222,128,0.18)' : 'rgba(239,68,68,0.18)'}`,
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block rounded-full"
            style={{
              width: 7,
              height: 7,
              background: balance > 0 ? '#4ade80' : '#ef4444',
              boxShadow: `0 0 8px ${balance > 0 ? 'rgba(74,222,128,0.6)' : 'rgba(239,68,68,0.6)'}`,
            }}
          />
          <span style={{ fontSize: 14, color: balance > 0 ? '#4ade80' : '#ef4444', fontWeight: 700, fontFamily: 'monospace' }}>
            Balance: ${balance.toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-md px-3 py-1"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            background: 'rgba(127,119,221,0.5)',
            border: '1px solid rgba(127,119,221,0.3)',
            cursor: 'pointer',
          }}
        >
          Top Up
        </button>
      </div>

      {balance <= 0 && (
        <div style={{ fontSize: 14, color: '#ef4444', textAlign: 'center', marginTop: 4 }}>
          Add funds to use Quantum
        </div>
      )}

      {/* Top-up modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="rounded-xl p-6"
            style={{
              background: '#0c0c1a',
              border: '1px solid rgba(127,119,221,0.25)',
              minWidth: 320,
              maxWidth: 400,
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, color: '#e2e8f0', fontWeight: 700, marginBottom: 4 }}>
              Top Up Wallet
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>
              Current balance: <span style={{ color: '#4ade80', fontWeight: 600 }}>${balance.toFixed(2)}</span>
            </p>

            <div className="grid grid-cols-2 gap-3">
              {TOP_UP_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  onClick={() => handleTopUp(amount)}
                  disabled={loading}
                  className="rounded-lg py-3 font-bold"
                  style={{
                    fontSize: 16,
                    color: '#fff',
                    background: 'rgba(127,119,221,0.2)',
                    border: '1px solid rgba(127,119,221,0.3)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(127,119,221,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(127,119,221,0.2)')}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <p style={{ fontSize: 14, color: '#475569', marginTop: 12, textAlign: 'center' }}>
              Payments via Stripe · Secure checkout
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 rounded-lg py-2"
              style={{
                fontSize: 14,
                color: '#94a3b8',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
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
