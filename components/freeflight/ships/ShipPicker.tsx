'use client'

import dynamic from 'next/dynamic'
import { Suspense, useMemo, useState } from 'react'
import { SHIP_CATALOG, type ShipCatalogEntry, saveShipId } from './catalog'

const ShipPreviewCanvas = dynamic(() => import('./ShipPreviewCanvas'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: '#0a0f1c' }} />,
})

interface Props {
  onPick: (ship: ShipCatalogEntry) => void
  onCancel?: () => void
  currentId?: string
}

export default function ShipPicker({ onPick, onCancel, currentId }: Props) {
  const [selectedId, setSelectedId] = useState<string>(currentId ?? SHIP_CATALOG[0].id)
  const selected = useMemo(
    () => SHIP_CATALOG.find(s => s.id === selectedId) ?? SHIP_CATALOG[0],
    [selectedId],
  )

  const confirm = () => {
    saveShipId(selected.id)
    onPick(selected)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 70,
      background: 'rgba(2, 4, 14, 0.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 32px',
      color: '#fff',
      fontFamily: 'var(--font-inter, system-ui)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <div>
          <div style={{
            fontSize: 14,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.7)',
            fontFamily: 'var(--font-space, monospace)',
          }}>
            Hangar · Select Ship
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: '#fff',
            textShadow: '0 0 16px #00d4ff',
            fontFamily: 'var(--font-space, system-ui)',
            marginTop: 4,
          }}>
            Choose Your Ship
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 14,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'var(--font-space, monospace)',
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Main grid: large 3D preview + catalog list */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: 24,
        minHeight: 0,
      }}>
        {/* Preview column */}
        <div style={{
          position: 'relative',
          background: 'radial-gradient(circle at 40% 50%, rgba(10,20,40,0.9), rgba(2,4,14,0.95))',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(0,212,255,0.1) inset',
        }}>
          <Suspense fallback={null}>
            <ShipPreviewCanvas ship={selected} />
          </Suspense>

          {/* Overlay info */}
          <div style={{
            position: 'absolute',
            left: 24, right: 24, bottom: 22,
            pointerEvents: 'none',
          }}>
            <div style={{
              fontSize: 14,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: selected.tier === 'premium' ? '#ffc966' : '#66ff99',
              textShadow: `0 0 8px ${selected.tier === 'premium' ? '#ffaa33' : '#66ff99'}`,
              fontFamily: 'var(--font-space, monospace)',
            }}>
              {selected.tier === 'premium' ? '★ Premium' : 'Starter · Free'}
            </div>
            <div style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#fff',
              textShadow: '0 2px 10px rgba(0,0,0,0.9)',
              marginTop: 4,
              fontFamily: 'var(--font-space, system-ui)',
            }}>
              {selected.name}
            </div>
            <div style={{
              fontSize: 16,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.8)',
              marginTop: 8,
              maxWidth: 520,
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}>
              {selected.description}
            </div>
          </div>
        </div>

        {/* List column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          overflowY: 'auto',
          paddingRight: 4,
        }}>
          {SHIP_CATALOG.map(s => {
            const active = s.id === selectedId
            const premium = s.tier === 'premium'
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  background: active
                    ? 'linear-gradient(135deg, rgba(0,120,180,0.3), rgba(139,92,246,0.25))'
                    : 'rgba(10, 14, 24, 0.6)',
                  border: `1px solid ${active ? 'rgba(0,212,255,0.6)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 8,
                  color: '#fff',
                  fontFamily: 'var(--font-inter, system-ui)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: active ? '0 0 18px rgba(0,212,255,0.3)' : 'none',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    fontFamily: 'var(--font-space, system-ui)',
                  }}>
                    {s.name}
                  </div>
                  <span style={{
                    fontSize: 14,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: premium ? '#ffc966' : '#66ff99',
                    fontFamily: 'var(--font-space, monospace)',
                  }}>
                    {premium ? '★' : 'Free'}
                  </span>
                </div>
                <div style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 4,
                  lineHeight: 1.4,
                }}>
                  {s.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Confirm button */}
      <div style={{
        marginTop: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <button
          onClick={confirm}
          style={{
            padding: '14px 42px',
            minWidth: 300,
            fontSize: 16,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, rgba(0,120,180,0.4), rgba(139,92,246,0.35))',
            border: '1px solid rgba(0,212,255,0.7)',
            borderRadius: 999,
            color: '#fff',
            fontFamily: 'var(--font-space, system-ui)',
            cursor: 'pointer',
            boxShadow: '0 0 26px rgba(0,212,255,0.4)',
            textShadow: '0 0 12px #00d4ff',
          }}
        >
          Launch · {selected.name}
        </button>
      </div>
    </div>
  )
}
