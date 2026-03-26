'use client'

import { motion } from 'framer-motion'
import { Play, Clock } from 'lucide-react'

const ACCENT = '#44aacc'

const DEMO_CARDS = [
  { title: 'Quantum Live Demo',        desc: 'Watch multiple AIs debate and converge on a complex question in real time.',  duration: '8 min' },
  { title: 'Trading Bot in Action',    desc: 'A regime-aware bot navigating a live BTC breakout — decision by decision.',    duration: '12 min' },
  { title: 'How Upload Works',         desc: 'From Python file to live sandbox run — the full pipeline explained.',           duration: '5 min' },
]

function VideoCard({ title, desc, duration, isFeatured = false }: { title: string; desc: string; duration: string; isFeatured?: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: isFeatured ? `1px solid ${ACCENT}33` : '1px solid rgba(255,255,255,0.07)',
        background: isFeatured ? `rgba(68,170,204,0.05)` : 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Player frame */}
      <div
        className="relative flex items-center justify-center"
        style={{ aspectRatio: '16/9', background: 'rgba(0,0,0,0.5)' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33` }}
          >
            <Play size={22} style={{ color: ACCENT, marginLeft: 3 }} />
          </div>
          <span
            className="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.6)', color: `${ACCENT}99`, border: `1px solid ${ACCENT}22`, letterSpacing: '0.14em', fontSize: '0.75rem' }}
          >
            Coming Soon
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem', lineHeight: 1.4 }}>{title}</p>
          <span className="flex items-center gap-1 shrink-0" style={{ color: '#475569', fontSize: '0.8125rem' }}>
            <Clock size={12} /> {duration}
          </span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 4, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function CinemaDeck() {
  return (
    <div className="space-y-8">
      <div>
        <p style={{ color: `${ACCENT}88`, fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>
          Cinema Deck
        </p>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}>
          See It in Action
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
          Product demos, CEO introduction, and behind-the-scenes footage. Videos launching with Early Access.
        </p>
      </div>

      {/* Featured: CEO intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${ACCENT}44` }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ aspectRatio: '16/9', background: `linear-gradient(135deg, rgba(68,170,204,0.08) 0%, rgba(0,0,0,0.6) 100%)` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}
            >
              <Play size={26} style={{ color: ACCENT, marginLeft: 4 }} />
            </div>
            <div className="text-center">
              <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.125rem', marginBottom: 4 }}>CEO Introduction</p>
              <span
                className="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)', color: `${ACCENT}aa`, border: `1px solid ${ACCENT}33`, letterSpacing: '0.14em', fontSize: '0.75rem' }}
              >
                Coming Soon
              </span>
            </div>
          </div>
        </div>
        <div className="px-6 py-5" style={{ borderTop: `1px solid ${ACCENT}22` }}>
          <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1rem' }}>Meet the team behind voidexa</p>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: 4 }}>
            Where we came from, what we&apos;re building, and why sovereign AI infrastructure matters.
          </p>
        </div>
      </motion.div>

      {/* Demo grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DEMO_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <VideoCard {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
