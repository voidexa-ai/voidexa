'use client'

import { motion } from 'framer-motion'

export default function Sovereignty() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl p-10 lg:p-14"
          style={{
            background: 'linear-gradient(135deg, rgba(10,10,20,0.9), rgba(14,12,28,0.95))',
            border: '1px solid rgba(139,92,246,0.18)',
            boxShadow: '0 0 60px rgba(139,92,246,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Subtle top-left accent */}
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
              transform: 'translate(-30%, -30%)',
            }}
          />

          <p
            className="text-xs font-medium uppercase tracking-widest mb-6"
            style={{ color: 'rgba(139,92,246,0.7)' }}
          >
            Built for sovereignty
          </p>

          <div className="space-y-5 relative z-10">
            <p className="text-[#94a3b8] leading-relaxed">
              In 2025, Denmark's government directed companies to create exit plans from American
              cloud services. Copenhagen and Aarhus — the country's two largest municipalities —
              followed by ending their Microsoft dependencies. Denmark is investing DKK 18 million
              in cybersecurity for Danish SMEs.
            </p>

            <p className="text-[#c4c4c4] leading-relaxed">
              voidexa builds for this moment. Encrypted communication that runs on your hardware.
              AI workflows that never touch a third-party server. Trading systems that execute
              autonomously. Data intelligence that stays on your infrastructure.
            </p>

            <p
              className="text-sm font-medium tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Zero-knowledge architecture. European sovereignty by design.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
