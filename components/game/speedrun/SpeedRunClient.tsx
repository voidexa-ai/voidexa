'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TRACKS, type PowerUpId, type TrackDef } from '@/lib/game/speedrun/tracks'
import TrackCard from './TrackCard'
import Leaderboard from './Leaderboard'
import PreRacePanel from './PreRacePanel'
import RaceHUD from './RaceHUD'
import RaceResults from './RaceResults'
import { createInventory, type PowerUpInventory } from './PowerUpSystem'
import type { GateStatus } from './GateRing'
import type { RaceStatus } from './RaceScene'

const RaceCanvas = dynamic(() => import('./RaceCanvas'), { ssr: false })

type Stage = 'select' | 'pre-race' | 'racing' | 'results'

const DEFAULT_SHIP_ID = 'qs_bob'
const DEFAULT_SHIP_URL = process.env.NEXT_PUBLIC_BOB_SHIP_URL?.trim()
  || 'https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/models/qs_bob.glb'
const DEFAULT_SHIP_SCALE = 1.2

export default function SpeedRunClient() {
  const [stage, setStage] = useState<Stage>('select')
  const [activeTrack, setActiveTrack] = useState<TrackDef | null>(null)
  const [inventory, setInventory] = useState<PowerUpInventory>(() => createInventory([]))
  const [bestTimes, setBestTimes] = useState<Record<string, number | null>>({})

  const [raceState, setRaceState] = useState<{
    status: RaceStatus
    elapsedMs: number
    clearedGates: number
    missedGates: number
    gateStatuses: GateStatus[]
  }>({
    status: 'countdown',
    elapsedMs: 0,
    clearedGates: 0,
    missedGates: 0,
    gateStatuses: [],
  })

  const usedPowerUpsRef = useRef<PowerUpId[]>([])

  // Load best times per track on mount.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id
      if (!uid) {
        // Global best if not signed in
        loadGlobalBests().then(setBestTimes)
        return
      }
      loadUserBests(uid).then(setBestTimes)
    })
  }, [stage])

  const countdown = useMemo(() => {
    if (stage !== 'racing') return null
    if (raceState.status !== 'countdown') return null
    // We don't have the countdown start here; derive from elapsedMs which only starts at 'running'.
    // Show simple GO banner — RaceScene handles the 3s delay internally.
    return 3
  }, [stage, raceState.status])

  const handleStartRace = useCallback((selected: PowerUpId[]) => {
    usedPowerUpsRef.current = []
    setInventory(createInventory(selected))
    setStage('racing')
  }, [])

  const handleInventoryChange = useCallback((inv: PowerUpInventory) => {
    // Track power-ups that have been activated at least once.
    setInventory(prev => {
      const newlyUsed = inv.usedIds.filter(id => !prev.usedIds.includes(id))
      if (newlyUsed.length > 0) {
        usedPowerUpsRef.current = [...usedPowerUpsRef.current, ...newlyUsed]
      }
      return inv
    })
  }, [])

  const handleRaceStateChange = useCallback((st: typeof raceState) => {
    setRaceState(st)
    if (st.status === 'finished' && stage === 'racing') {
      setStage('results')
    }
  }, [stage])

  const handleRaceAgain = useCallback(() => {
    if (!activeTrack) return
    usedPowerUpsRef.current = []
    setInventory(createInventory(inventory.usedIds.length ? [] : [])) // fresh empty
    setStage('pre-race')
  }, [activeTrack, inventory.usedIds.length])

  const handleBackToTracks = useCallback(() => {
    setActiveTrack(null)
    setStage('select')
    setInventory(createInventory([]))
  }, [])

  // ----- RENDER -----

  if (stage === 'racing' && activeTrack) {
    return (
      <div style={S.racePage}>
        <RaceCanvas
          track={activeTrack}
          shipUrl={DEFAULT_SHIP_URL}
          shipScale={DEFAULT_SHIP_SCALE}
          inventory={inventory}
          onInventoryChange={handleInventoryChange}
          onRaceStateChange={handleRaceStateChange}
        />
        <RaceHUD
          elapsedMs={raceState.elapsedMs}
          totalGates={activeTrack.gates.length}
          clearedGates={raceState.clearedGates}
          countdown={countdown}
          inventory={inventory}
          trackName={activeTrack.name}
          onExit={handleBackToTracks}
        />
      </div>
    )
  }

  if (stage === 'pre-race' && activeTrack) {
    return (
      <PreRacePanel
        track={activeTrack}
        onStart={handleStartRace}
        onCancel={handleBackToTracks}
      />
    )
  }

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div style={S.headerInner}>
          <Link href="/" style={S.backLink}>← voidexa</Link>
          <div>
            <span style={S.eyebrow}>VOID PRIX · TIME TRIALS</span>
            <h1 style={S.title}>Speed Run</h1>
            <p style={S.subtitle}>
              Three tracks. Fifteen gates each. Gold beats par, Silver beats par + 15%, Bronze beats par + 30%.
            </p>
          </div>
        </div>
      </header>

      <main style={S.main}>
        <section style={S.trackGrid}>
          {TRACKS.map(t => (
            <TrackCard
              key={t.id}
              track={t}
              bestTimeMs={bestTimes[t.id] ?? null}
              onStart={() => { setActiveTrack(t); setStage('pre-race') }}
            />
          ))}
        </section>

        <Leaderboard />
      </main>

      {stage === 'results' && activeTrack && (
        <RaceResults
          track={activeTrack}
          timeMs={raceState.elapsedMs}
          clearedGates={raceState.clearedGates}
          missedGates={raceState.missedGates}
          powerUpsUsed={usedPowerUpsRef.current}
          shipId={DEFAULT_SHIP_ID}
          onRaceAgain={handleRaceAgain}
          onBackToTracks={handleBackToTracks}
        />
      )}
    </div>
  )
}

async function loadUserBests(userId: string): Promise<Record<string, number | null>> {
  const { data } = await supabase
    .from('speedrun_times')
    .select('track_id, duration_ms')
    .eq('user_id', userId)
    .order('duration_ms', { ascending: true })
  const best: Record<string, number | null> = {}
  ;(data ?? []).forEach(r => {
    const k = r.track_id as string
    const t = r.duration_ms as number
    if (best[k] == null || t < (best[k] as number)) best[k] = t
  })
  return best
}

async function loadGlobalBests(): Promise<Record<string, number | null>> {
  const out: Record<string, number | null> = {}
  await Promise.all(TRACKS.map(async t => {
    const { data } = await supabase
      .from('speedrun_times')
      .select('duration_ms')
      .eq('track_id', t.id)
      .order('duration_ms', { ascending: true })
      .limit(1)
    out[t.id] = data && data[0] ? (data[0].duration_ms as number) : null
  }))
  return out
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000 100%)',
    color: '#e8e4f0',
    fontFamily: 'var(--font-sans)',
    paddingBottom: 80,
  },
  header: {
    borderBottom: '1px solid rgba(127,119,221,0.2)',
  },
  headerInner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '24px 28px 36px',
  },
  backLink: {
    fontSize: 14,
    color: 'rgba(148,163,184,0.8)',
    textDecoration: 'none',
    marginBottom: 16,
    display: 'inline-block',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.2em',
    color: '#00d4ff',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #00d4ff, #af52de)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(220,216,230,0.8)',
    maxWidth: 680,
    margin: 0,
    lineHeight: 1.55,
  },
  main: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '32px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  trackGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20,
  },
  racePage: {
    position: 'fixed',
    inset: 0,
    background: '#000',
    overflow: 'hidden',
  },
}
