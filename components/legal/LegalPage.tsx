'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface LegalPageProps {
  kicker: string
  title: ReactNode
  lastUpdated: string
  children: ReactNode
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

export default function LegalPage({ kicker, title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(0,212,255,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-36 pb-32">
        <motion.div {...fade()} className="mb-14">
          <p
            className="text-sm font-medium uppercase tracking-[0.18em] mb-5"
            style={{ color: 'rgba(0,212,255,0.55)' }}
          >
            {kicker}
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold leading-none tracking-tight mb-5"
            style={{ fontFamily: 'var(--font-space)', color: '#e2e8f0' }}
          >
            {title}
          </h1>
          <p className="text-sm" style={{ color: 'rgba(100,116,139,0.75)' }}>
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        <motion.article
          {...fade(0.05)}
          className="legal-prose"
          style={{ color: '#9aa5b8', fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}
        >
          {children}
        </motion.article>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '48px 0 32px' }} />

        <p className="text-sm" style={{ color: 'rgba(100,116,139,0.6)', letterSpacing: '0.04em' }}>
          voidexa · CVR 46343387 · Denmark ·{' '}
          <a
            href="mailto:contact@voidexa.com"
            style={{ color: 'rgba(100,116,139,0.85)' }}
          >
            contact@voidexa.com
          </a>
        </p>

        <style jsx global>{`
          .legal-prose h2 {
            font-family: var(--font-space);
            color: #e2e8f0;
            font-size: 1.35rem;
            font-weight: 700;
            margin-top: 2.5rem;
            margin-bottom: 0.85rem;
            letter-spacing: -0.01em;
          }
          .legal-prose h3 {
            font-family: var(--font-space);
            color: #cbd5e1;
            font-size: 1.05rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
          }
          .legal-prose p {
            margin: 0 0 1rem 0;
          }
          .legal-prose ul {
            list-style: disc;
            padding-left: 1.25rem;
            margin: 0 0 1rem 0;
          }
          .legal-prose li {
            margin-bottom: 0.45rem;
          }
          .legal-prose a {
            color: #00d4ff;
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .legal-prose strong {
            color: #cbd5e1;
            font-weight: 600;
          }
          .legal-prose table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0 1.5rem;
            font-size: 0.9rem;
          }
          .legal-prose th,
          .legal-prose td {
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 0.65rem 0.85rem;
            text-align: left;
            vertical-align: top;
          }
          .legal-prose th {
            background: rgba(0, 212, 255, 0.04);
            color: #cbd5e1;
            font-weight: 600;
          }
        `}</style>
      </div>
    </div>
  )
}
