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
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      {/* Hero — full-width banner with space station image */}
      <div
        className="relative overflow-hidden w-full"
        style={{ minHeight: '420px' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/space-station.jpg"
          alt="Space Station"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        {/* Dark gradient overlay — dark at bottom, transparent at top, for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7,7,13,1.0) 0%, rgba(7,7,13,0.65) 50%, rgba(7,7,13,0.2) 100%)',
            zIndex: 1,
          }}
        />
        {/* Atmospheric glow accent */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(68,170,204,0.15) 0%, transparent 70%)',
            zIndex: 1,
          }}
        />
        {/* Hero content — positioned above overlays */}
        <div className="relative z-10 pt-40 pb-16 text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium uppercase tracking-widest mb-3"
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
            style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: 480, margin: '0 auto 32px' }}
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
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#94a3b8',
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `rgba(68,170,204,0.10)`; el.style.borderColor = `${ACCENT}44`; el.style.color = ACCENT }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.borderColor = 'rgba(255,255,255,0.12)'; el.style.color = '#94a3b8' }}
              >
                <Icon size={15} />
                {label}
              </a>
            ))}
          </motion.div>
        </div>
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
