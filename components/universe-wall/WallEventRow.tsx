'use client'

import type { FormattedWallEvent } from '@/lib/game/universeWall/events'

interface Props {
  event: FormattedWallEvent
}

export default function WallEventRow({ event }: Props) {
  return (
    <li style={S.row}>
      <span style={{ ...S.icon, color: event.color, textShadow: `0 0 10px ${event.color}aa` }}>
        {event.icon}
      </span>
      <span style={S.line}>{event.line}</span>
      <span style={S.when}>{formatRelative(event.when)}</span>
    </li>
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
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 10,
    background: 'rgba(127,119,221,0.06)',
    border: '1px solid rgba(127,119,221,0.18)',
    color: '#e8f4ff',
    fontFamily: 'var(--font-sans)',
  },
  icon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
    flexShrink: 0,
  },
  line: {
    flex: 1,
    fontSize: 15,
    lineHeight: 1.4,
    overflow: 'hidden',
  },
  when: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.75)',
    letterSpacing: '0.02em',
    flexShrink: 0,
  },
}
