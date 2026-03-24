'use client'

import { motion } from 'framer-motion'

const items = [
  { quote: 'The trading bot has been running autonomously for months. It just works.', name: 'Early user', role: 'Private beta' },
  { quote: 'Comlink is the only messenger I trust for sensitive conversations.', name: 'Beta tester', role: 'Comlink beta' },
  { quote: 'The AI consulting engagement cut our data pipeline build time in half.', name: 'Startup founder', role: 'Services client' },
]

export default function SocialProof() {
  return (
    <section className="section-pad bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            Early signal
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#e2e8f0]"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            What people are saying
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map(({ quote, name, role }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <p className="text-sm text-[#64748b] leading-relaxed mb-5 italic">
                &ldquo;{quote}&rdquo;
              </p>
              <div>
                <div className="text-sm font-medium text-[#e2e8f0]">{name}</div>
                <div className="text-xs text-[#475569]">{role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
