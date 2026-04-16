'use client'

import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  MISSION_TEMPLATES,
  MISSION_CATEGORIES,
  CAST_META,
  RISK_META,
  CATEGORY_META,
  type MissionTemplate,
  type MissionCategory,
} from '@/lib/game/missions/board'

type Filter = MissionCategory | 'All'

const FILTERS: readonly Filter[] = ['All', ...MISSION_CATEGORIES] as const

export default function MissionBoardClient() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [selected, setSelected] = useState<MissionTemplate | null>(null)
  const [accepting, setAccepting] = useState(false)
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null
      setUserId(uid)
      if (uid) {
        supabase
          .from('mission_acceptances')
          .select('mission_id')
          .eq('user_id', uid)
          .in('status', ['accepted', 'in_progress'])
          .then(({ data: rows }) => {
            if (rows) setAcceptedIds(new Set(rows.map(r => r.mission_id as string)))
          })
      }
    })
  }, [])

  const recommended = useMemo(
    () => MISSION_TEMPLATES.filter(m => m.recommended).slice(0, 3),
    []
  )

  const filtered = useMemo(
    () => (activeFilter === 'All'
      ? MISSION_TEMPLATES
      : MISSION_TEMPLATES.filter(m => m.category === activeFilter)),
    [activeFilter]
  )

  async function handleAccept(mission: MissionTemplate) {
    if (!userId) {
      setToast('Sign in to accept missions.')
      setTimeout(() => setToast(null), 3500)
      return
    }
    if (acceptedIds.has(mission.id)) {
      setToast('Already accepted. Check your active contracts.')
      setTimeout(() => setToast(null), 3000)
      return
    }
    setAccepting(true)
    const { error } = await supabase.from('mission_acceptances').insert({
      user_id: userId,
      mission_id: mission.id,
      status: 'accepted',
    })
    setAccepting(false)
    if (error) {
      setToast(`Could not accept: ${error.message}`)
      setTimeout(() => setToast(null), 4000)
      return
    }
    setAcceptedIds(prev => new Set(prev).add(mission.id))
    setToast(`Accepted: ${mission.name}`)
    setTimeout(() => setToast(null), 2500)
    setSelected(null)
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Link href="/" style={styles.backLink}>← voidexa</Link>
          <div style={styles.title}>
            <span style={styles.titleBadge}>STATION BOARD</span>
            <h1 style={styles.titleText}>Mission Board</h1>
            <p style={styles.subtitle}>
              Contracts posted by the Cast. Accept one, fly the route, earn GHAI.
            </p>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Recommended */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Recommended</h2>
          <div style={styles.recommendedGrid}>
            {recommended.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                accepted={acceptedIds.has(mission.id)}
                onClick={() => setSelected(mission)}
                featured
              />
            ))}
          </div>
        </section>

        {/* Filter tabs */}
        <nav style={styles.tabs} aria-label="Mission categories">
          {FILTERS.map(f => {
            const active = activeFilter === f
            const color = f === 'All' ? '#ffffff' : CATEGORY_META[f].color
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  ...styles.tab,
                  color: active ? color : 'rgba(220,216,230,0.7)',
                  borderColor: active ? `rgba(${hexToRgb(color)},0.55)` : 'rgba(127,119,221,0.18)',
                  backgroundColor: active ? `rgba(${hexToRgb(color)},0.1)` : 'transparent',
                  boxShadow: active ? `0 0 18px rgba(${hexToRgb(color)},0.25)` : 'none',
                }}
              >
                {f !== 'All' && <span style={{ marginRight: 6 }}>{CATEGORY_META[f as MissionCategory].icon}</span>}
                {f}
              </button>
            )
          })}
        </nav>

        {/* Grid */}
        <section style={styles.section}>
          <div style={styles.grid}>
            {filtered.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                accepted={acceptedIds.has(mission.id)}
                onClick={() => setSelected(mission)}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <p style={styles.emptyText}>No missions in this category right now.</p>
          )}
        </section>
      </main>

      {/* Detail modal */}
      {selected && (
        <MissionDetailModal
          mission={selected}
          accepted={acceptedIds.has(selected.id)}
          accepting={accepting}
          onClose={() => setSelected(null)}
          onAccept={() => handleAccept(selected)}
          signedIn={!!userId}
        />
      )}

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  )
}

// --- Mission card ---

function MissionCard({
  mission,
  onClick,
  featured = false,
  accepted = false,
}: {
  mission: MissionTemplate
  onClick: () => void
  featured?: boolean
  accepted?: boolean
}) {
  const cast = CAST_META[mission.issuer]
  const risk = RISK_META[mission.risk]
  const cat = CATEGORY_META[mission.category]
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.card,
        borderColor: featured ? `rgba(${hexToRgb(cat.color)},0.4)` : 'rgba(127,119,221,0.22)',
        boxShadow: featured
          ? `0 4px 28px rgba(0,0,0,0.6), 0 0 22px rgba(${hexToRgb(cat.color)},0.15)`
          : '0 4px 20px rgba(0,0,0,0.6)',
      }}
      aria-label={`Open ${mission.name} details`}
    >
      <div style={styles.cardHeader}>
        <div style={styles.avatarWrap}>
          <Image
            src={cast.avatar}
            alt={cast.name}
            width={44}
            height={44}
            style={styles.avatar}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.castName}>{cast.name}</div>
          <div style={styles.castRole}>{cast.role}</div>
        </div>
        <div
          style={{
            ...styles.categoryChip,
            color: cat.color,
            borderColor: `rgba(${hexToRgb(cat.color)},0.45)`,
            background: `rgba(${hexToRgb(cat.color)},0.09)`,
          }}
        >
          <span style={{ marginRight: 4 }}>{cat.icon}</span>
          {mission.category}
        </div>
      </div>

      <h3 style={styles.cardTitle}>{mission.name}</h3>
      <p style={styles.cardDesc}>{mission.description}</p>

      <div style={styles.cardMeta}>
        <div style={styles.metaBadge}>
          <span style={styles.metaLabel}>TIME</span>
          <span style={styles.metaValue}>{mission.timeEstimate}</span>
        </div>
        <div style={styles.metaBadge}>
          <span style={styles.metaLabel}>REWARD</span>
          <span style={{ ...styles.metaValue, color: '#ffd166' }}>
            {mission.rewardMin}–{mission.rewardMax} GHAI
          </span>
        </div>
        <div
          style={{
            ...styles.riskBadge,
            color: risk.color,
            background: risk.bg,
            borderColor: `rgba(${hexToRgb(risk.color)},0.45)`,
          }}
        >
          {risk.label}
        </div>
      </div>

      {accepted && (
        <div style={styles.acceptedBadge}>Accepted</div>
      )}
    </button>
  )
}

// --- Detail modal ---

function MissionDetailModal({
  mission,
  accepted,
  accepting,
  onClose,
  onAccept,
  signedIn,
}: {
  mission: MissionTemplate
  accepted: boolean
  accepting: boolean
  onClose: () => void
  onAccept: () => void
  signedIn: boolean
}) {
  const cast = CAST_META[mission.issuer]
  const risk = RISK_META[mission.risk]
  const cat = CATEGORY_META[mission.category]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div style={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close">×</button>

        <div style={styles.modalHeader}>
          <div style={styles.avatarWrapLarge}>
            <Image src={cast.avatar} alt={cast.name} width={72} height={72} style={styles.avatar} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.castNameLarge}>{cast.name}</div>
            <div style={styles.castRole}>{cast.role}</div>
          </div>
          <div
            style={{
              ...styles.categoryChip,
              color: cat.color,
              borderColor: `rgba(${hexToRgb(cat.color)},0.45)`,
              background: `rgba(${hexToRgb(cat.color)},0.09)`,
              alignSelf: 'flex-start',
            }}
          >
            <span style={{ marginRight: 4 }}>{cat.icon}</span>
            {mission.category}
          </div>
        </div>

        <h2 style={styles.modalTitle}>{mission.name}</h2>

        <blockquote style={styles.quote}>
          <span style={styles.quoteMark}>&ldquo;</span>
          {mission.quote.replace(/^"|"$/g, '')}
          <span style={styles.quoteMark}>&rdquo;</span>
          <div style={styles.quoteAttribution}>— {cast.name}</div>
        </blockquote>

        <div style={styles.modalSection}>
          <h3 style={styles.modalSectionTitle}>Brief</h3>
          <p style={styles.modalText}>{mission.description}</p>
        </div>

        <div style={styles.modalSection}>
          <h3 style={styles.modalSectionTitle}>Objective</h3>
          <p style={styles.modalText}>{mission.objective}</p>
        </div>

        <div style={styles.modalSection}>
          <h3 style={styles.modalSectionTitle}>Encounter notes</h3>
          <p style={styles.modalText}>{mission.encounterChance}</p>
        </div>

        <div style={styles.modalMetaRow}>
          <div style={styles.metaBadge}>
            <span style={styles.metaLabel}>TIME</span>
            <span style={styles.metaValue}>{mission.timeEstimate}</span>
          </div>
          <div style={styles.metaBadge}>
            <span style={styles.metaLabel}>REWARD</span>
            <span style={{ ...styles.metaValue, color: '#ffd166' }}>
              {mission.rewardMin}–{mission.rewardMax} GHAI
            </span>
          </div>
          <div
            style={{
              ...styles.riskBadge,
              color: risk.color,
              background: risk.bg,
              borderColor: `rgba(${hexToRgb(risk.color)},0.45)`,
            }}
          >
            {risk.label}
          </div>
        </div>

        <div style={styles.modalActions}>
          <button onClick={onClose} style={styles.secondaryBtn}>Back to Board</button>
          <button
            onClick={onAccept}
            disabled={accepting || accepted || !signedIn}
            style={{
              ...styles.primaryBtn,
              opacity: (accepting || accepted || !signedIn) ? 0.55 : 1,
              cursor: (accepting || accepted || !signedIn) ? 'not-allowed' : 'pointer',
            }}
          >
            {accepted ? 'Already Accepted' : !signedIn ? 'Sign In to Accept' : accepting ? 'Accepting…' : 'Accept Contract'}
          </button>
        </div>
      </div>
    </div>
  )
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r},${g},${b}`
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000000 100%)',
    color: '#e8e4f0',
    fontFamily: 'var(--font-sans)',
    paddingBottom: 80,
  },
  header: {
    borderBottom: '1px solid rgba(127,119,221,0.2)',
    background: 'linear-gradient(180deg, rgba(6,5,16,0.75) 0%, transparent 100%)',
  },
  headerInner: {
    maxWidth: 1440,
    margin: '0 auto',
    padding: '24px 28px 36px',
  },
  backLink: {
    display: 'inline-block',
    fontSize: 14,
    color: 'rgba(148,163,184,0.8)',
    textDecoration: 'none',
    marginBottom: 20,
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  titleBadge: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.18em',
    color: '#00d4ff',
    textTransform: 'uppercase',
  },
  titleText: {
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 1.55,
    color: 'rgba(220,216,230,0.75)',
    maxWidth: 640,
    margin: 0,
  },
  main: {
    maxWidth: 1440,
    margin: '0 auto',
    padding: '32px 28px',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: 'rgba(220,216,230,0.85)',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  recommendedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 18,
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  tab: {
    padding: '10px 18px',
    borderRadius: 999,
    border: '1px solid rgba(127,119,221,0.18)',
    background: 'transparent',
    color: 'rgba(220,216,230,0.7)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 18,
  },
  card: {
    textAlign: 'left',
    position: 'relative',
    padding: 20,
    borderRadius: 14,
    border: '1px solid rgba(127,119,221,0.22)',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.9) 0%, rgba(12,14,30,0.9) 100%)',
    cursor: 'pointer',
    transition: 'transform 0.2s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.2s, border-color 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    fontFamily: 'inherit',
    color: '#e8e4f0',
    minHeight: 220,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid rgba(127,119,221,0.4)',
    flexShrink: 0,
  },
  avatarWrapLarge: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid rgba(127,119,221,0.4)',
    flexShrink: 0,
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  castName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  castNameLarge: {
    fontSize: 20,
    fontWeight: 600,
    color: '#ffffff',
  },
  castRole: {
    fontSize: 14,
    color: 'rgba(148,163,184,0.85)',
  },
  categoryChip: {
    padding: '4px 10px',
    borderRadius: 999,
    border: '1px solid',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 1.55,
    color: 'rgba(220,216,230,0.78)',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 'auto',
  },
  metaBadge: {
    display: 'flex',
    flexDirection: 'column',
    padding: '6px 12px',
    borderRadius: 8,
    background: 'rgba(127,119,221,0.08)',
    border: '1px solid rgba(127,119,221,0.18)',
    gap: 2,
  },
  metaLabel: {
    fontSize: 10,
    letterSpacing: '0.14em',
    color: 'rgba(148,163,184,0.7)',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#ffffff',
  },
  riskBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: 8,
    border: '1px solid',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  acceptedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#7fff9f',
    background: 'rgba(127,255,159,0.12)',
    border: '1px solid rgba(127,255,159,0.45)',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(220,216,230,0.6)',
    textAlign: 'center',
    padding: '40px 0',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2,1,10,0.78)',
    backdropFilter: 'blur(6px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: 680,
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: 32,
    borderRadius: 16,
    background: 'linear-gradient(145deg, rgba(20,22,40,0.98) 0%, rgba(12,14,30,0.98) 100%)',
    border: '1px solid rgba(127,119,221,0.35)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(127,119,221,0.15)',
    color: '#e8e4f0',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1px solid rgba(127,119,221,0.3)',
    background: 'rgba(127,119,221,0.08)',
    color: '#e8e4f0',
    fontSize: 22,
    lineHeight: 1,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#ffffff',
    margin: '0 0 20px',
  },
  quote: {
    margin: '0 0 24px',
    padding: '16px 20px',
    borderLeft: '3px solid #00d4ff',
    background: 'rgba(0,212,255,0.05)',
    borderRadius: '0 10px 10px 0',
    fontSize: 16,
    lineHeight: 1.6,
    fontStyle: 'italic',
    color: 'rgba(220,216,230,0.9)',
  },
  quoteMark: {
    color: '#00d4ff',
    fontSize: 22,
    marginRight: 4,
  },
  quoteAttribution: {
    fontSize: 13,
    fontStyle: 'normal',
    color: 'rgba(148,163,184,0.8)',
    marginTop: 8,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'rgba(148,163,184,0.9)',
    textTransform: 'uppercase',
    margin: '0 0 8px',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 1.6,
    color: 'rgba(220,216,230,0.85)',
    margin: 0,
  },
  modalMetaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    margin: '24px 0',
    alignItems: 'center',
  },
  modalActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  secondaryBtn: {
    padding: '12px 20px',
    borderRadius: 10,
    border: '1px solid rgba(127,119,221,0.3)',
    background: 'transparent',
    color: '#e8e4f0',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  primaryBtn: {
    padding: '12px 28px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
    color: '#050210',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    fontFamily: 'inherit',
    boxShadow: '0 0 24px rgba(0,212,255,0.35)',
  },
  toast: {
    position: 'fixed',
    bottom: 28,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 22px',
    borderRadius: 10,
    background: 'rgba(12,14,30,0.96)',
    border: '1px solid rgba(127,119,221,0.45)',
    color: '#e8e4f0',
    fontSize: 15,
    fontWeight: 500,
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    zIndex: 200,
  },
}
