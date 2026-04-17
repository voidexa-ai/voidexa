'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { SHIP_CATALOG } from '@/components/freeflight/ships/catalog'
import DesktopOnlyNotice from '@/components/ui/DesktopOnlyNotice'
import {
  EMPTY_TAG,
  ROLE_LABELS,
  TIER_COLORS,
  TIER_DEFAULTS,
  TIER_LABELS,
  type ShipRole,
  type ShipTag,
  type ShipTier,
} from '@/lib/data/shipTagging'

type Filter = 'all' | 'untagged' | 'free' | 'achievement' | 'paid'

const SECRET_KEY = 'admin_secret'
const SAVE_DEBOUNCE_MS = 600

const TIER_ORDER: ShipTier[] = ['free', 'achievement', 'paid-medium', 'paid-high', 'legendary']

function readSecret(): string {
  if (typeof window === 'undefined') return ''
  try { return localStorage.getItem(SECRET_KEY) ?? '' } catch { return '' }
}

function writeSecret(s: string): void {
  try { localStorage.setItem(SECRET_KEY, s) } catch { /* noop */ }
}

export default function ShipTaggerClient() {
  const [secret, setSecret] = useState('')
  const [tags, setTags] = useState<Record<string, ShipTag>>({})
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  // Hydrate secret from localStorage on mount
  useEffect(() => {
    setSecret(readSecret())
  }, [])

  const loadTags = useCallback(async (s: string) => {
    if (!s) { setLoading(false); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/ship-tags', { headers: { 'x-admin-secret': s } })
      if (res.status === 401) {
        setAuthError('Unauthorized — check ADMIN_SECRET')
        setLoading(false)
        return
      }
      const data = await res.json() as { ships?: Record<string, ShipTag> }
      setTags(data.ships ?? {})
      setAuthError(null)
    } catch (err) {
      setAuthError('Network error: ' + String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTags(secret) }, [secret, loadTags])

  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const persist = useCallback((shipId: string, tag: ShipTag) => {
    if (!secret) return
    const timers = saveTimers.current
    if (timers[shipId]) clearTimeout(timers[shipId])
    timers[shipId] = setTimeout(() => {
      fetch('/api/admin/ship-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ shipId, tag }),
      }).catch(() => { /* swallow — UI shows local state already */ })
    }, SAVE_DEBOUNCE_MS)
  }, [secret])

  const updateTag = useCallback((shipId: string, patch: Partial<ShipTag>) => {
    setTags(prev => {
      const current: ShipTag = prev[shipId] ?? { ...EMPTY_TAG }
      const next: ShipTag = { ...current, ...patch }

      // When tier changes and price hasn't been customised, auto-fill.
      if (patch.tier && patch.tier !== current.tier) {
        const priceUntouched =
          current.priceUSD === null ||
          (current.tier && current.priceUSD === TIER_DEFAULTS[current.tier].priceUSD)
        if (priceUntouched) {
          next.priceUSD = TIER_DEFAULTS[patch.tier].priceUSD
          next.priceGHAI = TIER_DEFAULTS[patch.tier].priceGHAI
        }
      }

      const updated = { ...prev, [shipId]: next }
      persist(shipId, next)
      return updated
    })
  }, [persist])

  const visibleShips = useMemo(() => {
    return SHIP_CATALOG.filter(s => {
      const t = tags[s.id]
      if (filter === 'untagged') return !t?.tier
      if (filter === 'free') return t?.tier === 'free'
      if (filter === 'achievement') return t?.tier === 'achievement'
      if (filter === 'paid') return t?.tier === 'paid-medium' || t?.tier === 'paid-high' || t?.tier === 'legendary'
      return true
    })
  }, [filter, tags])

  const tierCounts = useMemo(() => {
    const counts: Record<ShipTier, number> = {
      'free': 0, 'achievement': 0, 'paid-medium': 0, 'paid-high': 0, 'legendary': 0,
    }
    Object.values(tags).forEach(t => { if (t?.tier) counts[t.tier]++ })
    return counts
  }, [tags])

  const taggedCount = Object.values(tags).filter(t => t?.tier).length

  const onAuth = (s: string) => {
    const trimmed = s.trim()
    writeSecret(trimmed)
    setSecret(trimmed)
  }

  const onExport = async () => {
    if (!secret) return
    const res = await fetch('/api/admin/ship-tags', { headers: { 'x-admin-secret': secret } })
    if (!res.ok) return
    const data = await res.json()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shipTagging.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const layout: React.CSSProperties = {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#e2e8f0',
    padding: 24,
    fontFamily: 'var(--font-inter, system-ui)',
  }

  if (!secret) {
    return (
      <div style={layout}>
        <h1 style={{ fontFamily: 'var(--font-space, monospace)', fontSize: 28, marginBottom: 12 }}>
          SHIP TAGGER · ADMIN
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 24 }}>
          Paste the ADMIN_SECRET value from Vercel env vars. Stored in localStorage on this device only.
        </p>
        <SecretGate onSubmit={onAuth} />
      </div>
    )
  }

  return (
    <div style={layout}>
      <DesktopOnlyNotice
        reason="Ship Tagger is an admin tool — designed for desktop screens."
        fallbackHref="/"
        fallbackLabel="Back to home"
      />
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-space, monospace)', fontSize: 28, margin: 0 }}>
          SHIP TAGGER · ADMIN
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>
          Tag each ship with tier, role, price. Saves debounce 600ms to lib/data/shipTagging.json.
        </p>
        {authError && (
          <p style={{ color: '#f87171', fontSize: 14, marginTop: 8 }}>
            {authError} · <button onClick={() => { writeSecret(''); setSecret('') }} style={linkBtn}>Re-enter secret</button>
          </p>
        )}
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {(['all', 'untagged', 'free', 'achievement', 'paid'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              background: filter === f ? '#00d4ff' : '#1a1a24',
              color: filter === f ? '#000' : '#e2e8f0',
              border: '1px solid #2a2a3a',
              cursor: 'pointer',
              fontFamily: 'var(--font-space, monospace)',
              fontSize: 14,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {f}{f === 'all' ? ` (${SHIP_CATALOG.length})` : ''}
          </button>
        ))}
        <button onClick={onExport} style={{
          marginLeft: 'auto',
          padding: '8px 16px',
          background: '#1a1a24',
          color: '#00d4ff',
          border: '1px solid #00d4ff',
          cursor: 'pointer',
          fontFamily: 'var(--font-space, monospace)',
          fontSize: 14,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          ⬇ Export JSON
        </button>
      </div>

      <div style={{
        padding: 14,
        background: '#12121a',
        border: '1px solid #2a2a3a',
        marginBottom: 20,
        fontSize: 14,
        fontFamily: 'var(--font-space, monospace)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 24px',
      }}>
        <span>Tagged: <strong>{taggedCount}/{SHIP_CATALOG.length}</strong></span>
        {TIER_ORDER.map(tier => (
          <span key={tier} style={{ color: TIER_COLORS[tier] }}>
            {TIER_LABELS[tier]}: <strong>{tierCounts[tier]}</strong>
          </span>
        ))}
      </div>

      {loading ? (
        <p style={{ padding: 40 }}>Loading ship catalog...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 20,
        }}>
          {visibleShips.map(ship => (
            <ShipTagCard
              key={ship.id}
              shipId={ship.id}
              shipName={ship.name}
              modelUrl={ship.url}
              previewScale={ship.previewScale}
              description={ship.description}
              tag={tags[ship.id]}
              onChange={(patch) => updateTag(ship.id, patch)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SecretGate({ onSubmit }: { onSubmit: (s: string) => void }) {
  const [val, setVal] = useState('')
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(val) }}
      style={{ display: 'flex', gap: 8, maxWidth: 480 }}
    >
      <input
        type="password"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="ADMIN_SECRET"
        autoComplete="off"
        style={{
          flex: 1,
          padding: 12,
          background: '#1a1a24',
          color: '#e2e8f0',
          border: '1px solid #2a2a3a',
          fontFamily: 'var(--font-space, monospace)',
          fontSize: 14,
          outline: 'none',
        }}
      />
      <button type="submit" style={{
        padding: '12px 24px',
        background: '#00d4ff',
        color: '#000',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-space, monospace)',
        fontSize: 14,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        Unlock
      </button>
    </form>
  )
}

interface CardProps {
  shipId: string
  shipName: string
  modelUrl: string
  previewScale: number
  description: string
  tag: ShipTag | undefined
  onChange: (patch: Partial<ShipTag>) => void
}

function ShipTagCard({ shipId, shipName, modelUrl, previewScale, description, tag, onChange }: CardProps) {
  const t = tag ?? EMPTY_TAG
  const accent = t.tier ? TIER_COLORS[t.tier] : '#2a2a3a'

  return (
    <div style={{
      background: '#12121a',
      border: `1px solid ${accent}`,
      padding: 16,
      transition: 'border-color 0.2s',
    }}>
      <div style={{ height: 220, background: '#0a0a0f', marginBottom: 12, border: '1px solid #1a1a24', position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 4], fov: 35 }} gl={{ antialias: true }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, -3, -3]} intensity={0.45} color="#00d4ff" />
          <Suspense fallback={null}>
            <ShipPreview url={modelUrl} previewScale={previewScale} />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1.2} enableZoom enablePan={false} minDistance={1.5} maxDistance={10} />
        </Canvas>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, fontFamily: 'var(--font-space, monospace)' }}>
        <span style={{ fontSize: 17, fontWeight: 700 }}>{shipName}</span>
        {t.tier && (
          <span style={{
            fontSize: 11,
            padding: '3px 8px',
            background: TIER_COLORS[t.tier],
            color: '#000',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {TIER_LABELS[t.tier]}
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4, fontFamily: 'monospace' }}>{shipId}</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14, lineHeight: 1.4 }}>{description}</div>

      <div style={{ marginBottom: 10 }}>
        <label style={fieldLabel}>TIER</label>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
          {TIER_ORDER.map(tier => (
            <button
              key={tier}
              onClick={() => onChange({ tier })}
              style={{
                padding: '4px 8px',
                background: t.tier === tier ? TIER_COLORS[tier] : '#1a1a24',
                color: t.tier === tier ? '#000' : '#e2e8f0',
                border: '1px solid #2a2a3a',
                cursor: 'pointer',
                fontSize: 11,
                fontFamily: 'var(--font-space, monospace)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {TIER_LABELS[tier]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={fieldLabel}>ROLE</label>
        <select
          value={t.role ?? ''}
          onChange={(e) => onChange({ role: (e.target.value || null) as ShipRole | null })}
          style={inputStyle}
        >
          <option value="">— Choose role —</option>
          {(Object.keys(ROLE_LABELS) as ShipRole[]).map(r => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div>
          <label style={fieldLabel}>USD</label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={t.priceUSD ?? ''}
            onChange={(e) => {
              const usd = e.target.value === '' ? null : parseFloat(e.target.value)
              onChange({ priceUSD: usd, priceGHAI: usd === null ? null : Math.round(usd * 100) })
            }}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={fieldLabel}>GHAI</label>
          <input
            type="number"
            min={0}
            step={100}
            value={t.priceGHAI ?? ''}
            onChange={(e) => {
              const ghai = e.target.value === '' ? null : parseInt(e.target.value, 10)
              onChange({ priceGHAI: ghai })
            }}
            style={inputStyle}
          />
        </div>
      </div>

      {t.tier === 'achievement' && (
        <div style={{ marginBottom: 10 }}>
          <label style={fieldLabel}>ACHIEVEMENT REQUIREMENT</label>
          <input
            type="text"
            value={t.achievementId ?? ''}
            onChange={(e) => onChange({ achievementId: e.target.value || null })}
            placeholder="e.g. complete_5_docks"
            style={inputStyle}
          />
        </div>
      )}

      <div>
        <label style={fieldLabel}>NOTES</label>
        <textarea
          value={t.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={2}
          placeholder="Visual feel, balance concerns, why this tier..."
          style={{ ...inputStyle, resize: 'vertical', minHeight: 50, fontSize: 12 }}
        />
      </div>
    </div>
  )
}

function ShipPreview({ url, previewScale }: { url: string; previewScale: number }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={previewScale} />
}

const fieldLabel: React.CSSProperties = {
  fontSize: 14,
  color: '#64748b',
  fontFamily: 'var(--font-space, monospace)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 8,
  marginTop: 4,
  background: '#1a1a24',
  color: '#e2e8f0',
  border: '1px solid #2a2a3a',
  fontFamily: 'var(--font-space, monospace)',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

const linkBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#00d4ff',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: 14,
  padding: 0,
}
