'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function MeetTheTeam() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl"
          style={{ minHeight: 400 }}
        >
          {/* Group photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cast/gruppe billede.jpg"
            alt="The team behind the code"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 25%',
            }}
          />

          {/* Dark overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(7,7,13,0.92) 0%, rgba(7,7,13,0.65) 50%, rgba(7,7,13,0.3) 100%)',
          }} />

          {/* Content */}
          <div
            className="relative flex flex-col items-center justify-end text-center"
            style={{ minHeight: 400, padding: '40px 32px' }}
          >
            <p
              className="font-mono uppercase tracking-[0.28em] mb-4"
              style={{ fontSize: 14, color: 'rgba(119,119,187,0.75)' }}
            >
              The Cast
            </p>
            <h2
              className="font-bold mb-3"
              style={{
                fontFamily: 'var(--font-space)',
                fontSize: 'clamp(28px, 5vw, 48px)',
                color: '#e2e8f0',
                lineHeight: 1.1,
              }}
            >
              The team behind the code
            </h2>
            <p
              className="mb-8 max-w-md"
              style={{ fontSize: 16, color: 'rgba(148,163,184,0.8)', lineHeight: 1.6 }}
            >
              Six personalities. One goal. Endless disagreement.
            </p>
            <Link
              href="/quantum"
              className="inline-flex items-center gap-2 font-semibold rounded-full transition-all hover:opacity-85"
              style={{
                fontSize: 15,
                padding: '11px 26px',
                background: 'rgba(119,119,187,0.18)',
                border: '1px solid rgba(119,119,187,0.38)',
                color: '#a5b4fc',
              }}
            >
              Meet them on Quantum <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
