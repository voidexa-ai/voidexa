'use client'

import { motion } from 'framer-motion'
import { Code2, Brain, Shield, Zap, Database, Network } from 'lucide-react'

const values = [
  {
    icon: Brain,
    title: 'Intelligence first',
    desc: 'Every product we ship has AI at its core — not as a feature, but as the foundation it was built on.',
  },
  {
    icon: Shield,
    title: 'Minimal footprint',
    desc: "We build for function, not optics. If a feature doesn't serve the user's actual goal, it doesn't ship.",
  },
  {
    icon: Zap,
    title: 'Autonomous by default',
    desc: 'A system that requires constant human intervention is a system that isn\'t done yet. We build to completion.',
  },
  {
    icon: Code2,
    title: 'You own the code',
    desc: "Everything we build is delivered as source code you control. No vendor lock-in, no subscription traps.",
  },
]

const stack = [
  { name: 'Python',      role: 'Core AI systems & pipelines' },
  { name: 'Next.js',     role: 'Web products & interfaces' },
  { name: 'TypeScript',  role: 'Frontend and API layers' },
  { name: 'Claude API',  role: 'LLM reasoning & decisions' },
  { name: 'ccxt',        role: 'Exchange integrations' },
  { name: 'Pydantic',    role: 'Configuration & validation' },
  { name: 'Framer Motion', role: 'Interaction and animation' },
  { name: 'Tailwind CSS', role: 'Styling systems' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            About
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Built from the{' '}
            <span className="gradient-text">void up.</span>
          </h1>
          <div className="space-y-4 text-[#64748b] leading-relaxed max-w-2xl">
            <p>
              voidexa started with a single question: what would software look like if intelligence
              was baked into every layer — not bolted on, not a chat widget, but structurally
              embedded in how the system makes decisions?
            </p>
            <p>
              The answer is a trading bot that classifies market regimes and rebalances portfolios
              autonomously. An encrypted messenger that leaves no trace. A website builder that
              ships production code from a brief. Tools that work without you.
            </p>
            <p>
              We operate globally from the digital void. No office, no bloat, no meetings about meetings.
              Just builders who ship.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2
            className="text-2xl font-bold text-[#e2e8f0] mb-8"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            How we think
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
                >
                  <Icon size={18} style={{ color: '#00d4ff' }} />
                </div>
                <h3 className="text-base font-semibold text-[#e2e8f0] mb-2">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-2xl font-bold text-[#e2e8f0] mb-8"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Our stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stack.map(({ name, role }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="text-sm font-semibold text-[#e2e8f0] mb-1">{name}</div>
                <div className="text-[10px] text-[#334155]">{role}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
