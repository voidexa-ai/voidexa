'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { spendGhai } from '@/lib/credits/deduct'
import { cosmeticsByCategory } from '@/lib/game/shop/catalog'
import type { CosmeticCategory, CosmeticDef } from '@/lib/game/shop/types'

interface Props {
  category: CosmeticCategory
}

const CATEGORY_COLOR: Record<CosmeticCategory, string> = {
  racing:  '#00d4ff',
  combat:  '#ff6b6b',
  pilot:   '#7fff9f',
  premium: '#ffd166',
}

export default function CosmeticTab({ category }: Props) {
  const items = cosmeticsByCategory(category)
  const color = CATEGORY_COLOR[category]

  const [userId, setUserId] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [owned, setOwned] = useState<Set<string>>(new Set())
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    const uid = data.user?.id ?? null
    setUserId(uid)
    if (!uid) return
    const [wallet, cosmetics] = await Promise.all([
      supabase.from('user_credits').select('ghai_balance_platform').eq('user_id', uid).maybeSingle(),
      supabase.from('user_cosmetics').select('cosmetic_id').eq('user_id', uid),
    ])
    setBalance(wallet.data?.ghai_balance_platform ?? 0)
    setOwned(new Set((cosmetics.data ?? []).map(r => r.cosmetic_id as string)))
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const buy = useCallback(async (item: CosmeticDef) => {
    if (!userId) { setToast({ kind: 'err', text: 'Sign in to buy cosmetics.' }); return }
    if (owned.has(item.id)) { setToast({ kind: 'err', text: 'Already owned.' }); return }
    if ((balance ?? 0) < item.priceGhai) { setToast({ kind: 'err', text: `Need ${item.priceGhai} GHAI.` }); return }
    setPurchasing(item.id)
    const spend = await spendGhai(userId, item.priceGhai, {
      source: 'module_purchase',
      sourceId: `cosm_${item.id}`,
    })
    if (!spend.ok) {
      setToast({ kind: 'err', text: spend.error ?? 'Purchase failed.' })
      setPurchasing(null)
      return
    }
    await supabase.from('user_cosmetics').insert({
      user_id: userId,
      cosmetic_id: item.id,
      equipped: false,
    })
    setBalance(spend.newBalance ?? balance)
    setOwned(prev => new Set(prev).add(item.id))
    setToast({ kind: 'ok', text: `Acquired · ${item.name}` })
    setPurchasing(null)
    window.setTimeout(() => setToast(null), 2500)
  }, [userId, owned, balance])

  return (
    <div>
      <div style={S.header}>
        <div>
          <span style={{ ...S.eyebrow, color }}>{category.toUpperCase()} COSMETICS</span>
          <h2 style={S.title}>
            {category === 'racing' && 'Look Fast, Be Fast'}
            {category === 'combat' && 'Battle Theater'}
            {category === 'pilot' && 'Your Signature'}
            {category === 'premium' && 'Statement Pieces'}
          </h2>
        </div>
        <div style={S.balance}>
          <span style={S.balanceLabel}>BALANCE</span>
          <span style={S.balanceValue}>{balance == null ? '…' : `${balance.toLocaleString()} GHAI`}</span>
        </div>
      </div>

      {toast && (
        <div style={{ ...S.toast, borderColor: toast.kind === 'err' ? '#ff6b6b88' : '#7fff9f88', color: toast.kind === 'err' ? '#ff9f9f' : '#bfffcf' }}>
          {toast.text}
        </div>
      )}

      <div style={S.grid}>
        {items.map(item => {
          const isOwned = owned.has(item.id)
          const canAfford = (balance ?? 0) >= item.priceGhai
          return (
            <div key={item.id} style={{ ...S.card, borderColor: `${color}44`, boxShadow: `0 0 16px ${color}18` }}>
              <div style={{ ...S.slotBadge, color, borderColor: `${color}80` }}>{item.slot.replace(/_/g, ' ')}</div>
              <h3 style={S.itemName}>{item.name}</h3>
              <p style={S.itemDesc}>{item.description}</p>
              <div style={S.priceRow}>
                <span style={{ ...S.price, color }}>{item.priceGhai} GHAI</span>
                <button
                  onClick={() => buy(item)}
                  disabled={isOwned || purchasing === item.id || !canAfford || !userId}
                  style={{
                    ...S.buyBtn,
                    background: isOwned ? 'rgba(127,255,159,0.14)' : `linear-gradient(135deg, ${color}, #af52de)`,
                    color: isOwned ? '#7fff9f' : '#050210',
                    opacity: (!canAfford && !isOwned) || !userId ? 0.5 : 1,
                    cursor: isOwned || !canAfford || !userId ? 'default' : 'pointer',
                  }}
                >
                  {isOwned ? 'Owned ✓' : purchasing === item.id ? '…' : !userId ? 'Sign in' : !canAfford ? 'Low GHAI' : 'Buy'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 18 },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: 700, color: '#fff', margin: '4px 0 0' },
  balance: { padding: '10px 16px', borderRadius: 10, background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)' },
  balanceLabel: { fontSize: 11, letterSpacing: '0.18em', color: 'rgba(148,163,184,0.85)', fontWeight: 600, textTransform: 'uppercase', marginRight: 10 },
  balanceValue: { fontSize: 18, fontWeight: 700, color: '#ffd166' },
  toast: { padding: '10px 14px', borderRadius: 8, border: '1px solid', background: 'rgba(12,14,30,0.7)', fontSize: 14, marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 },
  card: { padding: 18, borderRadius: 12, border: '1px solid', background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))', display: 'flex', flexDirection: 'column', gap: 10 },
  slotBadge: { alignSelf: 'flex-start', padding: '3px 10px', borderRadius: 999, border: '1px solid', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' },
  itemName: { fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 },
  itemDesc: { fontSize: 14, lineHeight: 1.5, color: 'rgba(220,216,230,0.78)', margin: 0, minHeight: 48 },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 16, fontWeight: 700 },
  buyBtn: { padding: '8px 18px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'inherit' },
}
