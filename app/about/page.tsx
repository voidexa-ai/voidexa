'use client'

import { motion } from 'framer-motion'
import { Code2, Brain, Shield, Zap, Database, Network } from 'lucide-react'

const values = [
  {
    icon: Zap,
    title: 'Autonomy',
    desc: 'Systems that run themselves. A system that requires constant human intervention is a system that isn\'t done yet.',
  },
  {
    icon: Brain,
    title: 'Intelligence',
    desc: 'AI that makes real decisions — not just suggestions. Built into the architecture, not bolted on as a feature.',
  },
  {
    icon: Shield,
    title: 'Privacy',
    desc: 'Your data, your control. No surveillance, no vendor lock-in, no compromises. End-to-end or not at all.',
  },
  {
    icon: Code2,
    title: 'Innovation',
    desc: "If it doesn't exist, we build it. We don't wait for the industry to catch up to what people actually need.",
  },
]

const stack = [
  { name: 'Python',           role: 'Core AI systems & pipelines' },
  { name: 'TypeScript',       role: 'Frontend and API layers' },
  { name: 'React / Next.js',  role: 'Web products & interfaces' },
  { name: 'Claude AI',        role: 'LLM reasoning & agent decisions' },
  { name: 'Multi-agent arch', role: 'Custom agent orchestration' },
  { name: 'E2E Encryption',   role: 'Privacy-first communication' },
  { name: 'P2P Protocols',    role: 'Decentralised data transfer' },
  { name: 'Custom Hardware',  role: 'Solar & off-grid servers' },
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
            Born from the{' '}
            <span className="gradient-text">void.</span>
          </h1>
          <div className="space-y-4 text-[#64748b] leading-relaxed max-w-2xl">
            <p>
              voidexa was born from the void — the space between what technology can do
              and what it actually does for people.
            </p>
            <p>
              The philosophy is simple: technology should work autonomously, intelligently,
              for the benefit of its owner. Not require constant supervision. Not generate
              busy work. Not lock you in. Just run.
            </p>
            <p>
              Founded by a developer and AI architect. The answer took the form of a trading bot
              that classifies market regimes and executes autonomously. An encrypted messenger
              that leaves no trace. A website builder that ships production code from a brief.
              Tools that work without you.
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
