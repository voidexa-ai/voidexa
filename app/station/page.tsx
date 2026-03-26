'use client'

import { motion } from 'framer-motion'
import { Film, FlaskConical, Share2 } from 'lucide-react'
import CinemaDeck from '@/components/station/CinemaDeck'
import ScienceDeck from '@/components/station/ScienceDeck'
import SocialDeck from '@/components/station/SocialDeck'

const ACCENT = '#44aacc'

const DECKS = [
  { id: 'cinema',  label: 'Cinema Deck',  Icon: Film,         href: '#cinema'  },
  { id: 'science', label: 'Science Deck', Icon: FlaskConical, href: '#science' },
  { id: 'social',  label: 'Social Deck',  Icon: Share2,        href: '#social'  },
]

export default function StationPage() {
  return (
    <div className="min-h-screen" style={{ background: '#07070d' }}>
      {/* Hero */}
      <div
        className="relative pt-36 pb-16 text-center overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 0%, rgba(68,170,204,0.12) 0%, transparent 70%)`,
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: `${ACCENT}88`, letterSpacing: '0.18em' }}
        >
          voidexa
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ color: '#e2e8f0', fontSize: '3.5rem', fontFamily: 'var(--font-space)', fontWeight: 500, lineHeight: 1.05, marginBottom: 12 }}
        >
          Space Station
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: 480, margin: '0 auto 32px' }}
        >
          The content hub for the voidexa universe. Videos, roadmap, ideas, and the team behind the mission.
        </motion.p>

        {/* Deck nav */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 px-4"
        >
          {DECKS.map(({ id, label, Icon, href }) => (
            <a
              key={id}
              href={href}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `rgba(68,170,204,0.10)`; el.style.borderColor = `${ACCENT}44`; el.style.color = ACCENT }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.color = '#94a3b8' }}
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Decks */}
      <div className="max-w-5xl mx-auto px-4 pb-24 space-y-24">
        <section id="cinema" className="scroll-mt-24">
          <CinemaDeck />
        </section>
        <section id="science" className="scroll-mt-24">
          <ScienceDeck />
        </section>
        <section id="social" className="scroll-mt-24">
          <SocialDeck />
        </section>
      </div>
    </div>
  )
}
