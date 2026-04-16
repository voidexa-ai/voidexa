'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'
import { SHIP_CATALOG, type ShipCatalogEntry, saveShipId } from './catalog'
import { getShipTier, isStarterShip, TIER_COLOR, TIER_LABEL } from '@/lib/data/shipTiers'

const ShipPreviewCanvas = dynamic(() => import('./ShipPreviewCanvas'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: '#0a0f1c' }} />,
})

interface Props {
  onPick: (ship: ShipCatalogEntry) => void
  onCancel?: () => void
  currentId?: string
}

// Placeholder Stripe prices per tier until the shop wiring for ships lands.
// Shown as a locked-ship badge so the player knows where they sit in the
// rarity ladder. Kept local to the picker — the shop page remains the source
// of truth for real prices.
const TIER_PRICE_LABEL: Record<string, string> = {
  common:    '$1.99',
  uncommon:  '$2.99',
  rare:      '$4.99',
  epic:      '$7.99',
  legendary: '$11.99',
}

export default function ShipPicker({ onPick, onCancel, currentId }: Props) {
  const router = useRouter()
  // Default to the stored selection if starter, else the first starter ship.
  const firstStarterId = SHIP_CATALOG.find(s => isStarterShip(s.id))?.id ?? SHIP_CATALOG[0].id
  const initialId = currentId && isStarterShip(currentId) ? currentId : firstStarterId
  const [selectedId, setSelectedId] = useState<string>(initialId)
  const selected = useMemo(
    () => SHIP_CATALOG.find(s => s.id === selectedId) ?? SHIP_CATALOG[0],
    [selectedId],
  )
  const selectedStarter = isStarterShip(selected.id)

  const handleRowClick = (ship: ShipCatalogEntry) => {
    if (isStarterShip(ship.id)) {
      setSelectedId(ship.id)
      return
    }
    // Locked ships route to the shop where the cosmetic gating lives. The
    // picker stays a gameplay surface — buying happens in /shop only.
    router.push(`/shop?ship=${encodeURIComponent(ship.id)}`)
  }

  const confirm = () => {
    if (!selectedStarter) return
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
              color: selectedStarter ? '#66ff99' : TIER_COLOR[getShipTier(selected.id)],
              textShadow: `0 0 8px ${selectedStarter ? '#66ff99' : TIER_COLOR[getShipTier(selected.id)]}`,
              fontFamily: 'var(--font-space, monospace)',
            }}>
              {selectedStarter
                ? '● Starter · Free · Play now'
                : `🔒 ${TIER_LABEL[getShipTier(selected.id)]} · Unlock in shop`}
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
            const starter = isStarterShip(s.id)
            const tier = getShipTier(s.id)
            const tierColor = TIER_COLOR[tier]
            const priceLabel = TIER_PRICE_LABEL[tier]
            return (
              <button
                key={s.id}
                onClick={() => handleRowClick(s)}
                title={starter ? 'Play now' : 'Unlock in shop'}
                style={{
                  position: 'relative',
                  textAlign: 'left',
                  padding: '14px 16px',
                  background: active && starter
                    ? 'linear-gradient(135deg, rgba(0,120,180,0.3), rgba(139,92,246,0.25))'
                    : 'rgba(10, 14, 24, 0.6)',
                  border: `1px solid ${active && starter ? 'rgba(0,212,255,0.6)' : starter ? 'rgba(102,255,153,0.3)' : `${tierColor}55`}`,
                  borderRadius: 8,
                  color: '#fff',
                  fontFamily: 'var(--font-inter, system-ui)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: active && starter ? '0 0 18px rgba(0,212,255,0.3)' : 'none',
                  opacity: starter ? 1 : 0.7,
                  overflow: 'hidden',
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    {!starter && <span style={{ fontSize: 14, opacity: 0.7 }}>🔒</span>}
                    <span>{s.name}</span>
                  </div>
                  <span style={{
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: starter ? '#0a0a0a' : tierColor,
                    background: starter ? '#66ff99' : `${tierColor}22`,
                    border: starter ? 'none' : `1px solid ${tierColor}99`,
                    padding: '3px 8px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-space, monospace)',
                    fontWeight: 700,
                    textShadow: starter ? 'none' : `0 0 6px ${tierColor}`,
                  }}>
                    {starter ? 'Starter' : TIER_LABEL[tier]}
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
                <div style={{
                  marginTop: 8,
                  fontSize: 13,
                  letterSpacing: '0.06em',
                  color: starter ? '#86efac' : 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-space, monospace)',
                }}>
                  {starter ? 'Play now · Free' : `Unlock in shop · ${priceLabel ?? 'See shop'}`}
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
        {selectedStarter ? (
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
        ) : (
          <button
            onClick={() => router.push(`/shop?ship=${encodeURIComponent(selected.id)}`)}
            style={{
              padding: '14px 42px',
              minWidth: 300,
              fontSize: 16,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.35), rgba(168,85,247,0.3))',
              border: `1px solid ${TIER_COLOR[getShipTier(selected.id)]}`,
              borderRadius: 999,
              color: '#fff',
              fontFamily: 'var(--font-space, system-ui)',
              cursor: 'pointer',
              boxShadow: `0 0 26px ${TIER_COLOR[getShipTier(selected.id)]}55`,
              textShadow: `0 0 12px ${TIER_COLOR[getShipTier(selected.id)]}`,
            }}
          >
            🔒 Unlock {selected.name} in Shop
          </button>
        )}
      </div>
    </div>
  )
}
