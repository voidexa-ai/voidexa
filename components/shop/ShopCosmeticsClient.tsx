'use client'

import Link from 'next/link'
import ShopTabs from './ShopTabs'
import CosmeticTab from './CosmeticTab'
import type { CosmeticCategory } from '@/lib/game/shop/types'

const COSMETIC_CATEGORIES: readonly CosmeticCategory[] = ['racing', 'combat', 'pilot', 'premium']

interface Props {
  tab: string
}

export default function ShopCosmeticsClient({ tab }: Props) {
  const isCosmetic = COSMETIC_CATEGORIES.includes(tab as CosmeticCategory)
  return (
    <div style={S.page}>
      <main style={S.main}>
        <header style={S.header}>
          <Link href="/" style={S.backLink}>← voidexa</Link>
          <span style={S.eyebrow}>SHOP · COSMETICS</span>
          <h1 style={S.title}>Shop</h1>
        </header>

        <ShopTabs activeTab={tab} />

        {isCosmetic && <CosmeticTab category={tab as CosmeticCategory} />}

        {tab === 'packs' && (
          <div style={S.redirectCard}>
            <h3 style={S.redirectTitle}>Booster Packs</h3>
            <p style={S.redirectText}>
              Pack opening lives on its own page with the full card reveal animation.
            </p>
            <Link href="/shop/packs" style={S.redirectBtn}>
              Open Pack Shop →
            </Link>
          </div>
        )}

        {!isCosmetic && tab !== 'packs' && (
          <p style={S.loading}>Loading tab…</p>
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
  redirectCard: {
    padding: 28,
    borderRadius: 14,
    background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))',
    border: '1px solid rgba(255,209,102,0.35)',
    textAlign: 'center',
  },
  redirectTitle: { fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 10px' },
  redirectText: { fontSize: 15, lineHeight: 1.55, color: 'rgba(220,216,230,0.8)', margin: '0 0 18px' },
  redirectBtn: {
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
  loading: { fontSize: 15, color: 'rgba(220,216,230,0.65)' },
}
