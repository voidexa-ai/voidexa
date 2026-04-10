'use client'

import { motion } from 'framer-motion'

interface ConsensusMeterProps {
  value: number
}

export default function ConsensusMeter({ value }: ConsensusMeterProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className="w-full max-w-[280px] mx-auto mt-4">
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.1em' }}>
          CONSENSUS
        </span>
        <span style={{ fontSize: 14, color: '#7777bb', fontWeight: 700 }}>
          {Math.round(clampedValue)}%
        </span>
      </div>
      <div
        className="relative w-full overflow-hidden rounded-full"
        style={{
          height: 6,
          background: 'rgba(119,119,187,0.12)',
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #7777bb, #60a5fa)',
            boxShadow: '0 0 12px rgba(119,119,187,0.4)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="mt-1" style={{ fontSize: 14, color: '#64748b' }}>
        Emerging from 4 providers
      </p>
    </div>
  )
}
