'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ShopItem } from '@/lib/shop/items'
import { buyShopItem, isCardPack, type BuyOutcome } from '@/lib/shop/buy-handler'

interface Props {
  item: ShopItem
  /** Accent color, typically from rarity palette. */
  accent: string
  /** Invoked after a successful purchase so the modal can close. */
  onSuccess?: () => void
}

type Toast =
  | { kind: 'ok'; text: string }
  | { kind: 'err'; text: string; actionHref?: string; actionLabel?: string }

export default function ItemBuyButton({ item, accent, onSuccess }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (!toast || toast.kind !== 'ok') return
    const id = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(id)
  }, [toast])

  const label = isCardPack(item) ? 'Open Packs →' : 'Buy'

  const handle = useCallback(async () => {
    if (busy) return
    setBusy(true)
    setToast(null)
    let out: BuyOutcome
    try {
      out = await buyShopItem(item)
    } catch (e) {
      setToast({ kind: 'err', text: e instanceof Error ? e.message : 'Network error' })
      setBusy(false)
      return
    }
    if (out.kind === 'redirect') {
      router.push(out.url)
      return
    }
    if (out.kind === 'ok') {
      setToast({ kind: 'ok', text: `Acquired · ${item.name}` })
      setBusy(false)
      onSuccess?.()
      return
    }
    const { code, detail } = out
    if (code === 'UNAUTHORIZED') {
      setToast({
        kind: 'err',
        text: 'Sign in to buy',
        actionHref: `/auth/login?redirect=/shop`,
        actionLabel: 'Sign in',
      })
    } else if (code === 'INSUFFICIENT_BALANCE') {
      setToast({
        kind: 'err',
        text: 'Not enough GHAI',
        actionHref: '/wallet',
        actionLabel: 'Top up',
      })
    } else if (code === 'ALREADY_OWNED') {
      setToast({ kind: 'err', text: 'Already owned' })
    } else {
      setToast({ kind: 'err', text: detail ?? 'Purchase failed' })
    }
    setBusy(false)
  }, [busy, item, onSuccess, router])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
      {toast && (
        <div
          role="status"
          style={{
            fontSize: 13,
            padding: '6px 12px',
            borderRadius: 8,
            background: toast.kind === 'ok' ? 'rgba(127,255,159,0.12)' : 'rgba(255,107,107,0.12)',
            border: `1px solid ${toast.kind === 'ok' ? 'rgba(127,255,159,0.45)' : 'rgba(255,107,107,0.45)'}`,
            color: toast.kind === 'ok' ? '#bfffcf' : '#ff9f9f',
            fontFamily: 'var(--font-inter, system-ui)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span>{toast.text}</span>
          {toast.kind === 'err' && toast.actionHref && (
            <a
              href={toast.actionHref}
              style={{
                color: '#fff',
                textDecoration: 'underline',
                fontWeight: 600,
              }}
            >
              {toast.actionLabel ?? 'Fix'}
            </a>
          )}
        </div>
      )}
      <button
        onClick={handle}
        disabled={busy}
        style={{
          padding: '12px 26px',
          background: busy
            ? `linear-gradient(135deg, ${accent}33, ${accent}22)`
            : `linear-gradient(135deg, ${accent}, #af52de)`,
          border: `1px solid ${accent}`,
          borderRadius: 999,
          color: busy ? 'rgba(255,255,255,0.7)' : '#050210',
          fontFamily: 'var(--font-space, monospace)',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          cursor: busy ? 'wait' : 'pointer',
          textShadow: busy ? 'none' : '0 0 8px rgba(255,255,255,0.25)',
          transition: 'all 0.15s',
        }}
      >
        {busy ? '...' : label}
      </button>
    </div>
  )
}
