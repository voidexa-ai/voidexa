'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, ChevronRight } from 'lucide-react'
import { STRATEGIES, FUNDAMENTALS } from '@/content/trading-hub/strategies'

const ACCENT = '#cc9955'

export default function LearnTab() {
  return (
    <div className="space-y-12">
      {/* Strategy grid */}
      <div>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
          Strategy Library
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 24 }}>
          Six foundational strategies. Click any card to read the full guide.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STRATEGIES.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/trading-hub/learn/${s.slug}`}
                className="block rounded-2xl p-5 transition-all group"
                style={{
                  background: s.isEdge ? `rgba(204,153,85,0.06)` : 'rgba(255,255,255,0.02)',
                  border: s.isEdge ? `1px solid ${ACCENT}44` : '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = s.isEdge ? `rgba(204,153,85,0.10)` : 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = s.isEdge ? `rgba(204,153,85,0.06)` : 'rgba(255,255,255,0.02)'}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.0625rem' }}>{s.title}</span>
                      {s.isEdge && <Zap size={14} style={{ color: ACCENT }} />}
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{s.tagline}</p>
                  </div>
                  <ChevronRight size={16} style={{ color: '#334155', marginTop: 4 }} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        background: s.isEdge ? `${ACCENT}14` : 'rgba(255,255,255,0.05)',
                        color: s.isEdge ? ACCENT : '#64748b',
                        fontSize: '0.875rem',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fundamentals */}
      <div>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
          Fundamentals
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 24 }}>
          Concepts every bot builder must understand before going live.
        </p>

        <div className="space-y-3">
          {FUNDAMENTALS.map((f, i) => (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex gap-4 px-5 py-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span
                className="shrink-0 font-medium px-2.5 py-1 rounded-full h-fit"
                style={{ background: `${ACCENT}12`, color: ACCENT, border: `1px solid ${ACCENT}28`, fontSize: '0.875rem', whiteSpace: 'nowrap' }}
              >
                {f.tag}
              </span>
              <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
