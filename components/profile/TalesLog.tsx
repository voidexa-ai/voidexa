'use client'

import { useState } from 'react'
import type { TaleEntry } from '@/lib/game/reputation/tales'

interface Props {
  tales: readonly TaleEntry[]
}

const CATEGORY_COLOR: Record<string, string> = {
  mission:  '#00d4ff',
  battle:   '#ff6b6b',
  speedrun: '#af52de',
  hauling:  '#ffd166',
  pack:     '#7fff9f',
}

export default function TalesLog({ tales }: Props) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? tales : tales.slice(0, 8)

  if (tales.length === 0) {
    return (
      <section style={S.wrap}>
        <h2 style={S.title}>Tales</h2>
        <p style={S.empty}>This pilot hasn&apos;t made any memorable moves yet. Fly, fight, deliver — the log will fill.</p>
      </section>
    )
  }

  return (
    <section style={S.wrap}>
      <h2 style={S.title}>Tales</h2>
      <ul style={S.list}>
        {visible.map(t => (
          <li key={t.id} style={S.item}>
            <span style={{ ...S.dot, background: CATEGORY_COLOR[t.category] ?? '#fff' }} />
            <span style={S.line}>{t.line}</span>
            <span style={S.when}>{formatRelative(t.when)}</span>
          </li>
        ))}
      </ul>
      {tales.length > 8 && !showAll && (
        <button onClick={() => setShowAll(true)} style={S.loadMore}>
          Load more ({tales.length - 8} more)
        </button>
      )}
    </section>
  )
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then) || then <= 0) return ''
  const diffMs = Date.now() - then
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    padding: 28,
    borderRadius: 16,
    border: '1px solid rgba(127,119,221,0.28)',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.88), rgba(12,14,30,0.88))',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 18px',
    letterSpacing: '-0.01em',
  },
  empty: {
    fontSize: 15,
    lineHeight: 1.55,
    color: 'rgba(220,216,230,0.7)',
    margin: 0,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    borderRadius: 8,
    background: 'rgba(127,119,221,0.06)',
    border: '1px solid rgba(127,119,221,0.15)',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: '0 0 8px currentColor',
  },
  line: {
    flex: 1,
    fontSize: 15,
    color: '#e8f4ff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  when: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.75)',
    letterSpacing: '0.02em',
    flexShrink: 0,
  },
  loadMore: {
    marginTop: 14,
    padding: '10px 18px',
    borderRadius: 10,
    border: '1px solid rgba(127,119,221,0.35)',
    background: 'transparent',
    color: '#e8e4f0',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}
