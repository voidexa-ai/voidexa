'use client'

import { COCKPIT_CATALOG, saveCockpitId, type CockpitCatalogEntry } from './catalog'

interface Props {
  currentId?: string
  onPick: (cockpit: CockpitCatalogEntry) => void
  onCancel: () => void
}

export default function CockpitPicker({ currentId, onPick, onCancel }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 70,
      background: 'rgba(2, 4, 14, 0.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 32px',
      color: '#fff',
      fontFamily: 'var(--font-inter, system-ui)',
    }}>
      <div style={{
        fontSize: 14,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(0,212,255,0.7)',
        fontFamily: 'var(--font-space, monospace)',
        marginBottom: 6,
      }}>
        Hangar · Cockpit Preview
      </div>
      <div style={{
        fontSize: 28,
        fontWeight: 700,
        color: '#fff',
        textShadow: '0 0 16px #00d4ff',
        fontFamily: 'var(--font-space, system-ui)',
        marginBottom: 24,
      }}>
        Choose Cockpit
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 14,
        maxWidth: 760,
        width: '100%',
        marginBottom: 24,
      }}>
        {COCKPIT_CATALOG.map((c) => {
          const active = c.id === currentId
          return (
            <button
              key={c.id}
              onClick={() => {
                saveCockpitId(c.id)
                onPick(c)
              }}
              style={{
                padding: '22px 18px',
                background: active
                  ? 'linear-gradient(135deg, rgba(0,120,180,0.35), rgba(139,92,246,0.3))'
                  : 'rgba(10, 14, 24, 0.7)',
                border: `1px solid ${active ? 'rgba(0,212,255,0.7)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 10,
                color: '#fff',
                fontFamily: 'var(--font-space, system-ui)',
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: active ? '0 0 22px rgba(0,212,255,0.35)' : 'none',
                textShadow: active ? '0 0 10px #00d4ff' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {c.name}
              {active && (
                <div style={{
                  fontSize: 12,
                  letterSpacing: '0.2em',
                  color: '#66e6ff',
                  marginTop: 6,
                  fontFamily: 'var(--font-space, monospace)',
                }}>
                  ACTIVE
                </div>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={onCancel}
        style={{
          padding: '10px 22px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 999,
          color: 'rgba(255,255,255,0.75)',
          fontFamily: 'var(--font-space, monospace)',
          fontSize: 14,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
    </div>
  )
}
