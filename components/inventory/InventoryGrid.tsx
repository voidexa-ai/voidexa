'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
export type InventoryRarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Mythic'

export interface InventoryCardRow {
  id: string
  name: string
  rarity: InventoryRarity | null
  quantity: number
  acquiredFrom: string | null
}

export interface InventoryCosmeticRow {
  id: string
  name: string
  category: string | null
  equipped: boolean
}

type Tab = 'all' | 'cards' | 'cosmetics'

const RARITY_COLOR: Record<InventoryRarity, string> = {
  Common:    '#94a3b8',
  Uncommon:  '#4ade80',
  Rare:      '#3b82f6',
  Epic:      '#a855f7',
  Legendary: '#f59e0b',
  Mythic:    '#ec4899',
}

interface Props {
  cards: readonly InventoryCardRow[]
  cosmetics: readonly InventoryCosmeticRow[]
}

export default function InventoryGrid({ cards, cosmetics }: Props) {
  const [tab, setTab] = useState<Tab>('all')

  const totalCards = useMemo(() => cards.reduce((n, c) => n + c.quantity, 0), [cards])
  const totalCosmetics = cosmetics.length

  const showCards = tab === 'all' || tab === 'cards'
  const showCosmetics = tab === 'all' || tab === 'cosmetics'
  const empty = cards.length === 0 && cosmetics.length === 0

  return (
    <div style={S.page}>
      <main style={S.main}>
        <header style={S.header}>
          <Link href="/" style={S.backLink}>← voidexa</Link>
          <span style={S.eyebrow}>PILOT INVENTORY</span>
          <h1 style={S.title}>Your Inventory</h1>
          <p style={S.subtitle}>
            {totalCards} card{totalCards === 1 ? '' : 's'} · {totalCosmetics} cosmetic{totalCosmetics === 1 ? '' : 's'}
          </p>
        </header>

        <div style={S.tabs}>
          {(['all', 'cards', 'cosmetics'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...S.tab,
                color: tab === t ? '#fff' : 'rgba(220,216,230,0.75)',
                borderBottomColor: tab === t ? '#00d4ff' : 'transparent',
                background: tab === t ? 'rgba(0,212,255,0.08)' : 'transparent',
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <Link href="/shop/packs" style={S.cta}>Get more packs →</Link>
          <Link href="/shop/cosmetics" style={S.cta}>Shop cosmetics →</Link>
        </div>

        {empty && (
          <div style={S.empty}>
            <p style={S.emptyText}>Your inventory is empty. Buy a pack to get started.</p>
            <Link href="/shop/packs" style={S.emptyBtn}>Open the pack shop</Link>
          </div>
        )}

        {showCards && cards.length > 0 && (
          <section style={S.section}>
            <h2 style={S.sectionTitle}>Cards</h2>
            <div style={S.grid}>
              {cards.map(card => {
                const color = card.rarity != null ? RARITY_COLOR[card.rarity] : '#7fd8ff'
                return (
                  <div key={card.id} style={{ ...S.cell, borderColor: `${color}55`, boxShadow: `0 0 16px ${color}18` }}>
                    <div style={{ ...S.slotBadge, color, borderColor: `${color}80` }}>
                      {card.rarity ?? 'CARD'}
                    </div>
                    <h3 style={S.itemName}>{card.name}</h3>
                    <p style={S.itemMeta}>
                      Qty: <strong>{card.quantity}</strong>
                      {card.acquiredFrom ? ` · via ${card.acquiredFrom}` : ''}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {showCosmetics && cosmetics.length > 0 && (
          <section style={S.section}>
            <h2 style={S.sectionTitle}>Cosmetics</h2>
            <div style={S.grid}>
              {cosmetics.map(cosm => (
                <div key={cosm.id} style={{ ...S.cell, borderColor: 'rgba(127,119,221,0.45)' }}>
                  <div style={S.cosmeticBadge}>
                    {cosm.category ? cosm.category.toUpperCase() : 'COSMETIC'}
                  </div>
                  <h3 style={S.itemName}>{cosm.name}</h3>
                  <p style={S.itemMeta}>
                    {cosm.equipped ? 'Equipped' : 'Owned · not equipped'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000 100%)',
    color: '#e8e4f0',
    fontFamily: 'var(--font-sans)',
    paddingBottom: 60,
  },
  main: { maxWidth: 1200, margin: '0 auto', padding: '32px 28px' },
  header: { marginBottom: 22 },
  backLink: { fontSize: 14, color: 'rgba(148,163,184,0.8)', textDecoration: 'none', marginBottom: 16, display: 'inline-block' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', color: '#af52de', textTransform: 'uppercase', display: 'block', marginBottom: 6 },
  title: { fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: 0 },
  subtitle: { fontSize: 15, color: 'rgba(220,216,230,0.75)', marginTop: 6 },
  tabs: {
    display: 'flex',
    gap: 8,
    borderBottom: '1px solid rgba(127,119,221,0.22)',
    marginBottom: 24,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderBottom: '2px solid',
    background: 'transparent',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  },
  cta: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: '#7fd8ff',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid rgba(0,212,255,0.35)',
  },
  empty: {
    padding: 28,
    borderRadius: 14,
    background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))',
    border: '1px solid rgba(255,209,102,0.35)',
    textAlign: 'center',
  },
  emptyText: { fontSize: 16, color: 'rgba(220,216,230,0.85)', margin: '0 0 16px' },
  emptyBtn: {
    display: 'inline-block',
    padding: '12px 24px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #ffd166, #af52de)',
    color: '#050210',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.02em',
    textDecoration: 'none',
  },
  section: { marginTop: 12, marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: 700, letterSpacing: '0.12em', color: '#fff', margin: '0 0 12px', textTransform: 'uppercase' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 },
  cell: {
    padding: 18,
    borderRadius: 12,
    border: '1px solid',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  slotBadge: {
    alignSelf: 'flex-start',
    padding: '3px 10px',
    borderRadius: 999,
    border: '1px solid',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  cosmeticBadge: {
    alignSelf: 'flex-start',
    padding: '3px 10px',
    borderRadius: 999,
    border: '1px solid rgba(127,119,221,0.5)',
    color: '#c8bfff',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  itemName: { fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 },
  itemMeta: { fontSize: 13, color: 'rgba(220,216,230,0.7)', margin: 0 },
}
