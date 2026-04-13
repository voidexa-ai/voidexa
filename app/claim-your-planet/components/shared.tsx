'use client'

import type { Variants } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 0.03, 0.26, 1] },
  }),
}

export function ShimmerText({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        background:
          'linear-gradient(90deg, #00d4ff 0%, #8b5cf6 40%, #00d4ff 80%, #8b5cf6 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'shimmer 3s linear infinite',
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export const sectionHeading: CSSProperties = {
  fontSize: 'clamp(28px, 4vw, 40px)',
  fontWeight: 700,
  color: '#e2e8f0',
  letterSpacing: '-0.02em',
  fontFamily: 'var(--font-space)',
}

export const sectionSub: CSSProperties = {
  fontSize: 16,
  color: '#94a3b8',
  marginTop: 10,
  lineHeight: 1.65,
  maxWidth: 560,
  marginLeft: 'auto',
  marginRight: 'auto',
}

export const glassCard: CSSProperties = {
  padding: '28px 26px',
  borderRadius: 16,
  border: '1px solid rgba(0,212,255,0.15)',
  background:
    'linear-gradient(135deg, rgba(7,7,13,0.9) 0%, rgba(12,10,28,0.9) 100%)',
  backdropFilter: 'blur(14px)',
  boxShadow: '0 0 40px rgba(0,212,255,0.05)',
}
