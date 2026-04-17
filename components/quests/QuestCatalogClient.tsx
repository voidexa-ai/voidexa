'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CHAINS } from '@/lib/game/quests/chains'

type ChainStatus = 'locked' | 'active' | 'completed'

interface ChainProgress {
  chainId: string
  completedSteps: number
  totalSteps: number
  status: ChainStatus
}

export default function QuestCatalogClient() {
  const [progressById, setProgressById] = useState<Record<string, ChainProgress>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData.user?.id
      const allStepIds = CHAINS.flatMap(c => c.steps.map(s => s.id))
      let completedSet = new Set<string>()
      if (uid) {
        const { data: rows } = await supabase
          .from('user_quest_progress')
          .select('quest_id, status')
          .eq('user_id', uid)
          .in('quest_id', allStepIds)
          .eq('status', 'completed')
        completedSet = new Set((rows ?? []).map(r => r.quest_id as string))
      }
      // Compute progress + status for every chain.
      const map: Record<string, ChainProgress> = {}
      for (const chain of CHAINS) {
        const completed = chain.steps.filter(s => completedSet.has(s.id)).length
        const total = chain.steps.length
        let status: ChainStatus
        if (completed === total) status = 'completed'
        else if (!chain.prerequisiteChainId) status = 'active'
        else {
          const prereq = CHAINS.find(c => c.id === chain.prerequisiteChainId)
          const prereqDone = prereq ? prereq.steps.every(s => completedSet.has(s.id)) : true
          status = prereqDone ? 'active' : 'locked'
        }
        map[chain.id] = { chainId: chain.id, completedSteps: completed, totalSteps: total, status }
      }
      setProgressById(map)
      setLoading(false)
    })()
  }, [])

  return (
    <div style={S.page}>
      <main style={S.main}>
        <header style={S.header}>
          <Link href="/game" style={S.backLink}>← Game Hub</Link>
          <span style={S.eyebrow}>NARRATIVE ARCS</span>
          <h1 style={S.title}>Quest Chains</h1>
          <p style={S.subtitle}>
            Five linear chains. Finish one, the next unlocks. Each chain ends with a reward + title.
          </p>
        </header>

        {loading ? (
          <p style={S.loading}>Loading progress…</p>
        ) : (
          <section style={S.list}>
            {CHAINS.map((chain, index) => {
              const p = progressById[chain.id]
              const color = CHAIN_COLOR[index % CHAIN_COLOR.length]
              return (
                <div
                  key={chain.id}
                  style={{
                    ...S.card,
                    borderColor: statusBorder(p?.status ?? 'locked', color),
                    opacity: p?.status === 'locked' ? 0.55 : 1,
                  }}
                >
                  <div style={S.cardHeader}>
                    <span style={{ ...S.chainNum, color }}>Chain {index + 1}</span>
                    <span style={{ ...S.statusBadge, ...statusBadgeStyle(p?.status ?? 'locked') }}>
                      {p?.status ?? 'locked'}
                    </span>
                  </div>
                  <h3 style={S.chainName}>{chain.name}</h3>
                  <p style={S.summary}>{chain.summary}</p>

                  <div style={S.progressBar}>
                    <div
                      style={{
                        ...S.progressFill,
                        width: `${(100 * (p?.completedSteps ?? 0)) / Math.max(1, p?.totalSteps ?? 1)}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <div style={S.progressText}>
                    {p?.completedSteps ?? 0} / {p?.totalSteps ?? chain.steps.length} steps
                    {p?.status === 'completed' && ' · ✓'}
                  </div>

                  <div style={S.reward}>
                    Final reward: <b style={{ color: '#ffd166' }}>{chain.finalReward.ghai} GHAI</b>
                    {' · '}
                    <span style={{ color: '#7fd8ff' }}>Title:</span>{' '}
                    <span style={{ fontStyle: 'italic' }}>{chain.finalReward.title}</span>
                  </div>
                </div>
              )
            })}
          </section>
        )}
      </main>
    </div>
  )
}

const CHAIN_COLOR = ['#ffd166', '#7fd8ff', '#7fff9f', '#af52de', '#ff8a3c']

function statusBorder(status: ChainStatus, base: string): string {
  if (status === 'locked') return 'rgba(127,119,221,0.22)'
  if (status === 'completed') return 'rgba(127,255,159,0.6)'
  return `${base}88`
}

function statusBadgeStyle(status: ChainStatus): React.CSSProperties {
  if (status === 'completed') return { color: '#7fff9f', background: 'rgba(127,255,159,0.14)', borderColor: 'rgba(127,255,159,0.5)' }
  if (status === 'active')    return { color: '#ffd166', background: 'rgba(255,209,102,0.14)', borderColor: 'rgba(255,209,102,0.5)' }
  return { color: 'rgba(220,216,230,0.55)', background: 'rgba(127,119,221,0.08)', borderColor: 'rgba(127,119,221,0.3)' }
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000 100%)',
    color: '#e8e4f0',
    fontFamily: 'var(--font-sans)',
    paddingBottom: 80,
  },
  main: { maxWidth: 1040, margin: '0 auto', padding: '32px 28px' },
  header: { marginBottom: 32 },
  backLink: { fontSize: 14, color: 'rgba(148,163,184,0.8)', textDecoration: 'none', marginBottom: 16, display: 'inline-block' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', color: '#af52de', textTransform: 'uppercase', display: 'block' },
  title: { fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: '6px 0 10px' },
  subtitle: { fontSize: 16, color: 'rgba(220,216,230,0.8)', margin: 0, lineHeight: 1.55, maxWidth: 680 },
  loading: { fontSize: 15, color: 'rgba(220,216,230,0.65)' },
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 },
  card: { padding: 24, borderRadius: 14, border: '1px solid', background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  chainNum: { fontSize: 12, letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' },
  statusBadge: { padding: '3px 10px', borderRadius: 999, border: '1px solid', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' },
  chainName: { fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.01em' },
  summary: { fontSize: 14, lineHeight: 1.55, color: 'rgba(220,216,230,0.82)', margin: '0 0 14px' },
  progressBar: { height: 6, borderRadius: 3, background: 'rgba(127,119,221,0.2)', overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', transition: 'width 0.4s' },
  progressText: { fontSize: 13, color: 'rgba(220,216,230,0.75)', marginBottom: 12 },
  reward: { fontSize: 14, color: 'rgba(220,236,255,0.88)' },
}
