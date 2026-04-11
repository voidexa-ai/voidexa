'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface SavedSession {
  id: string
  question: string
  mode: string
  status: string
  synthesis: string | null
  messages: unknown[]
  cost_usd: number | null
  customer_price_usd: number | null
  tokens_used: number | null
  providers_used: string[] | null
  duration_seconds: number | null
  created_at: string
}

interface Props {
  activeSessionId: string | null
  onSelectSession: (session: SavedSession) => void
  onNewDebate: () => void
}

export default function ChatHistorySidebar({ activeSessionId, onSelectSession, onNewDebate }: Props) {
  const [sessions, setSessions] = useState<SavedSession[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    const { data } = await supabase
      .from('quantum_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) setSessions(data as SavedSession[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  // Refresh when active session changes (e.g. after session completes)
  useEffect(() => {
    if (activeSessionId) fetchSessions()
  }, [activeSessionId, fetchSessions])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex flex-col h-full">
      {/* New Debate button */}
      <button
        onClick={onNewDebate}
        className="w-full rounded-lg py-2.5 font-semibold mb-3"
        style={{
          fontSize: 14,
          color: '#fff',
          background: 'rgba(127,119,221,0.35)',
          border: '1px solid rgba(127,119,221,0.3)',
          cursor: 'pointer',
          letterSpacing: '0.04em',
        }}
      >
        + New Debate
      </button>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto" style={{ marginRight: -4, paddingRight: 4 }}>
        {loading && (
          <div style={{ fontSize: 14, color: '#475569', textAlign: 'center', padding: 16 }}>
            Loading history...
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div style={{ fontSize: 14, color: '#475569', textAlign: 'center', padding: 16, lineHeight: 1.6 }}>
            No sessions yet. Ask your first question!
          </div>
        )}

        {sessions.map(session => {
          const isActive = session.id === activeSessionId
          const preview = session.question.length > 50
            ? session.question.slice(0, 50) + '...'
            : session.question

          return (
            <button
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="w-full text-left rounded-lg mb-1.5 px-3 py-2.5"
              style={{
                fontSize: 14,
                color: isActive ? '#e2e8f0' : '#94a3b8',
                background: isActive ? 'rgba(127,119,221,0.15)' : 'transparent',
                border: isActive
                  ? '1px solid rgba(127,119,221,0.3)'
                  : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
                lineHeight: 1.4,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block rounded-full shrink-0"
                  style={{
                    width: 6,
                    height: 6,
                    background: session.status === 'complete' ? '#4ade80' : session.status === 'error' ? '#ef4444' : '#eab308',
                  }}
                />
                <span
                  className="rounded px-1.5 py-0.5 shrink-0"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: session.mode === 'deep' ? '#a5b4fc' : '#94a3b8',
                    background: session.mode === 'deep' ? 'rgba(165,180,252,0.1)' : 'rgba(148,163,184,0.08)',
                  }}
                >
                  {session.mode === 'deep' ? 'DEEP' : 'STD'}
                </span>
                <span style={{ fontSize: 12, color: '#475569', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                  {formatDate(session.created_at)}
                </span>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {preview}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
