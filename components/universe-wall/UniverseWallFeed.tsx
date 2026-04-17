'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatWallEvent, type FormattedWallEvent, type WallEventRow } from '@/lib/game/universeWall/events'
import WallEventRow_Component from './WallEventRow'

interface Props {
  /** Optional filter — show only rows where actor_user_id matches. */
  forUserId?: string
  pageSize?: number
  showTitle?: boolean
}

const POLL_INTERVAL_MS = 30_000

export default function UniverseWallFeed({ forUserId, pageSize = 25, showTitle = true }: Props) {
  const [events, setEvents] = useState<FormattedWallEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const earliestRef = useRef<string | null>(null)

  const loadInitial = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('universe_wall')
      .select('id, event_type, actor_user_id, actor_name, subject_user_id, subject_name, payload, created_at')
      .order('created_at', { ascending: false })
      .limit(pageSize)
    if (forUserId) query = query.eq('actor_user_id', forUserId)
    const { data } = await query
    const rows = (data ?? []) as WallEventRow[]
    const formatted = rows.map(formatWallEvent)
    setEvents(formatted)
    earliestRef.current = rows[rows.length - 1]?.created_at ?? null
    setHasMore(rows.length === pageSize)
    setLoading(false)
  }, [forUserId, pageSize])

  const loadMore = useCallback(async () => {
    if (!earliestRef.current || !hasMore) return
    let query = supabase
      .from('universe_wall')
      .select('id, event_type, actor_user_id, actor_name, subject_user_id, subject_name, payload, created_at')
      .order('created_at', { ascending: false })
      .lt('created_at', earliestRef.current)
      .limit(pageSize)
    if (forUserId) query = query.eq('actor_user_id', forUserId)
    const { data } = await query
    const rows = (data ?? []) as WallEventRow[]
    setEvents(prev => [...prev, ...rows.map(formatWallEvent)])
    earliestRef.current = rows[rows.length - 1]?.created_at ?? earliestRef.current
    if (rows.length < pageSize) setHasMore(false)
  }, [forUserId, pageSize, hasMore])

  // Initial load + Realtime subscription.
  useEffect(() => {
    void loadInitial()
    let channel: ReturnType<typeof supabase.channel> | null = null
    let polling: number | null = null
    try {
      channel = supabase
        .channel(`universe_wall_${forUserId ?? 'all'}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'universe_wall',
            ...(forUserId ? { filter: `actor_user_id=eq.${forUserId}` } : {}),
          },
          (payload: { new: WallEventRow }) => {
            const formatted = formatWallEvent(payload.new)
            setEvents(prev => [formatted, ...prev])
          },
        )
        .subscribe((status) => {
          // If subscription fails, fall back to polling.
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            if (polling == null) {
              polling = window.setInterval(loadInitial, POLL_INTERVAL_MS)
            }
          }
        })
    } catch {
      polling = window.setInterval(loadInitial, POLL_INTERVAL_MS)
    }
    return () => {
      if (channel) void supabase.removeChannel(channel)
      if (polling != null) window.clearInterval(polling)
    }
  }, [forUserId, loadInitial])

  return (
    <section style={S.wrap}>
      {showTitle && <h2 style={S.title}>Universe Wall</h2>}
      {loading && events.length === 0 && <div style={S.empty}>Listening for the universe…</div>}
      {!loading && events.length === 0 && (
        <div style={S.empty}>Quiet for now. Be the pilot that makes the feed move.</div>
      )}
      <ul style={S.list}>
        {events.map(e => <WallEventRow_Component key={e.id} event={e} />)}
      </ul>
      {hasMore && events.length > 0 && (
        <button onClick={loadMore} style={S.loadMore}>Load older events</button>
      )}
    </section>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    padding: 28,
    borderRadius: 16,
    border: '1px solid rgba(127,119,221,0.28)',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))',
    color: '#e8e4f0',
    fontFamily: 'var(--font-sans)',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 16px',
    letterSpacing: '-0.01em',
  },
  empty: {
    fontSize: 15,
    color: 'rgba(220,216,230,0.7)',
    padding: '24px 0',
    textAlign: 'center',
    lineHeight: 1.55,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
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
