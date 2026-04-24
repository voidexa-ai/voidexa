'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { COSMETIC_TABS } from '@/lib/game/shop/catalog'

interface Props {
  activeTab: string
}

export default function ShopTabs({ activeTab }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  function go(tab: string) {
    const next = new URLSearchParams(params.toString())
    next.set('tab', tab)
    router.push(`/shop/cosmetics?${next.toString()}`)
  }

  return (
    <div style={S.wrap}>
      {COSMETIC_TABS.map(t => {
        const active = activeTab === t.id
        return (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            style={{
              ...S.tab,
              color: active ? '#fff' : 'rgba(220,216,230,0.75)',
              borderBottomColor: active ? '#00d4ff' : 'transparent',
              background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    display: 'flex',
    gap: 4,
    borderBottom: '1px solid rgba(127,119,221,0.22)',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderBottom: '2px solid',
    background: 'transparent',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'all 0.2s',
  },
}
