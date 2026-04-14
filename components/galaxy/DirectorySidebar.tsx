'use client'

import { useMemo, useState } from 'react'
import type { CompanyPlanet } from './companies'
import { INDUSTRY_META } from './companies'

interface Props {
  planets: CompanyPlanet[]
  highlightedId: string | null
  onHighlight: (id: string | null) => void
  onWarpTo: (planet: CompanyPlanet) => void
}

export default function DirectorySidebar({ planets, highlightedId, onHighlight, onWarpTo }: Props) {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...planets].sort((a, b) => {
      if (a.isSun && !b.isSun) return -1
      if (!a.isSun && b.isSun) return 1
      return a.name.localeCompare(b.name)
    })
    if (!q) return sorted
    return sorted.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sublabel.toLowerCase().includes(q) ||
      INDUSTRY_META[p.industry].label.toLowerCase().includes(q)
    )
  }, [planets, query])

  // Auto-highlight first match when searching
  const firstMatchId = query.trim() && filtered.length > 0 ? filtered[0].id : null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 30,
        width: open ? 300 : 44,
        transition: 'width 0.28s ease',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: open ? 'rgba(6, 8, 18, 0.72)' : 'rgba(6, 8, 18, 0.4)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderRight: '1px solid rgba(0, 212, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Toggle bar */}
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            gap: 8,
            padding: '14px 14px',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
            color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
            fontFamily: 'var(--font-space, system-ui)',
            fontSize: 16,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
          aria-label={open ? 'Collapse directory' : 'Expand directory'}
        >
          {open && <span>Galaxy Directory</span>}
          <span style={{ fontSize: 18, color: 'rgba(0,212,255,0.8)' }}>{open ? '‹' : '›'}</span>
        </button>

        {open && (
          <>
            {/* Search */}
            <div style={{ padding: '12px 14px 8px' }}>
              <input
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value)
                  // highlight first match immediately
                  const q = e.target.value.trim().toLowerCase()
                  if (!q) { onHighlight(null); return }
                  const match = planets.find(p =>
                    p.name.toLowerCase().includes(q) ||
                    p.sublabel.toLowerCase().includes(q)
                  )
                  onHighlight(match?.id ?? null)
                }}
                placeholder="Search planets…"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 14,
                  fontFamily: 'var(--font-inter, system-ui)',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(0, 212, 255, 0.25)',
                  borderRadius: 6,
                  color: '#fff',
                  outline: 'none',
                }}
              />
              {firstMatchId && (
                <div style={{ fontSize: 14, color: 'rgba(0,212,255,0.65)', marginTop: 6 }}>
                  {filtered.length} result{filtered.length === 1 ? '' : 's'}
                </div>
              )}
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 16px' }}>
              {filtered.map(p => {
                const active = highlightedId === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => onWarpTo(p)}
                    onMouseEnter={() => onHighlight(p.id)}
                    onMouseLeave={() => {
                      if (!query.trim()) onHighlight(null)
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      margin: '2px 0',
                      background: active ? `${p.emissive}22` : 'transparent',
                      border: `1px solid ${active ? `${p.emissive}66` : 'transparent'}`,
                      borderRadius: 6,
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: 'var(--font-inter, system-ui)',
                      cursor: 'pointer',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        aria-hidden
                        style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: p.emissive,
                          boxShadow: `0 0 10px ${p.emissive}`,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{
                        fontSize: 16,
                        fontWeight: p.isSun ? 700 : 500,
                        letterSpacing: '-0.01em',
                      }}>
                        {p.name}
                      </span>
                      {p.isSun && (
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: 14,
                          color: 'rgba(0,212,255,0.75)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}>Sun</span>
                      )}
                      {p.isMystery && (
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: 14,
                          color: 'rgba(0,212,255,0.6)',
                        }}>?</span>
                      )}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.6)',
                      marginTop: 3,
                      marginLeft: 20,
                      letterSpacing: '0.01em',
                    }}>
                      {p.sublabel}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: `${INDUSTRY_META[p.industry].color}cc`,
                      marginTop: 2,
                      marginLeft: 20,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {INDUSTRY_META[p.industry].label}
                    </div>
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <div style={{
                  padding: 16,
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.5)',
                  textAlign: 'center',
                }}>
                  No planets match your search.
                </div>
              )}
            </div>

            <div style={{
              padding: '10px 14px',
              borderTop: '1px solid rgba(0, 212, 255, 0.1)',
              fontSize: 14,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'var(--font-inter, system-ui)',
              letterSpacing: '0.02em',
            }}>
              {planets.length} planet{planets.length === 1 ? '' : 's'} in galaxy
            </div>
          </>
        )}
      </div>
    </div>
  )
}
