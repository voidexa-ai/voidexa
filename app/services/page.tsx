'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Code2, BarChart3, Lightbulb, CheckCircle2 } from 'lucide-react'

const services = [
  {
    icon: Code2,
    title: 'Custom AI Development',
    color: '#00d4ff',
    tagline: 'We build the system. You own it.',
    desc: 'From intelligent trading pipelines to autonomous agents to custom LLM integrations — we scope, architect, and ship production-grade AI systems tailored to your exact requirements.',
    includes: [
      'Scoping and architecture design',
      'Full-stack Python or Next.js build',
      'AI/LLM integration and fine-tuning',
      'Multi-agent pipeline design',
      'Testing, deployment, and documentation',
      'Code delivered, no lock-in',
    ],
  },
  {
    icon: BarChart3,
    title: 'Data Intelligence',
    color: '#8b5cf6',
    tagline: 'Turn data into decisions that run themselves.',
    desc: 'We design and implement data pipelines, monitoring dashboards, and predictive models that give you real visibility — then automate the actions those insights imply.',
    includes: [
      'Data pipeline design and implementation',
      'Real-time monitoring dashboards',
      'Predictive modeling and backtesting',
      'Alert systems and anomaly detection',
      'Reporting automation',
      'Integration with existing systems',
    ],
  },
  {
    icon: Lightbulb,
    title: 'AI Consulting',
    color: '#00d4ff',
    tagline: 'Strategy, implementation, and integration.',
    desc: 'Not sure where AI fits in your product or workflow? We map your current state, identify the highest-leverage AI opportunities, and give you a concrete roadmap — with or without implementation.',
    includes: [
      'AI readiness assessment',
      'Use case prioritization',
      'Tool and model selection',
      'Implementation roadmap',
      'Team enablement and training',
      'Ongoing advisory retainer',
    ],
  },
]

const process = [
  { step: '01', title: 'Discovery call', desc: 'We learn your problem, constraints, and goals. 30 minutes, no strings attached.' },
  { step: '02', title: 'Scope + proposal', desc: 'We send a fixed-scope proposal with timeline and cost within 48h.' },
  { step: '03', title: 'Build + iterate', desc: 'Weekly check-ins, working software from day one, no waterfall.' },
  { step: '04', title: 'Handoff', desc: 'Full documentation, code ownership, and optional ongoing support.' },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            Services
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-5"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            We scope it,{' '}
            <span className="gradient-text">we ship it.</span>
          </h1>
          <p className="text-[#b0b0b0] max-w-xl mx-auto">
            Project-based AI development and consulting. No retainers, no padded teams —
            just the work, scoped and delivered.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
          {services.map(({ icon: Icon, title, color, tagline, desc, includes }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-3xl p-7 flex flex-col"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h2
                className="text-xl font-bold text-[#e2e8f0] mb-1"
                style={{ fontFamily: 'var(--font-space)' }}
              >
                {title}
              </h2>
              <p className="text-sm text-[#b0b0b0] mb-3">{tagline}</p>
              <p className="text-sm text-[#b0b0b0] leading-relaxed mb-5">{desc}</p>
              <div className="mt-auto">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#b0b0b0] mb-3">
                  Includes
                </p>
                <ul className="space-y-2">
                  {includes.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[#b0b0b0]">
                      <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" style={{ color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2
            className="text-3xl font-bold text-[#e2e8f0] text-center mb-12"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            How we work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="text-3xl font-bold gradient-text mb-3" style={{ fontFamily: 'var(--font-space)' }}>
                  {step}
                </div>
                <h3 className="text-sm font-medium text-[#e2e8f0] mb-2">{title}</h3>
                <p className="text-xs text-[#b0b0b0] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center rounded-3xl p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(139,92,246,0.06))',
            border: '1px solid rgba(0,212,255,0.12)',
          }}
        >
          <h2
            className="text-3xl font-bold text-[#e2e8f0] mb-3"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Ready to build?
          </h2>
          <p className="text-[#b0b0b0] mb-6 max-w-md mx-auto">
            Tell us what you're trying to build. We'll scope it and send a proposal within 48 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity glow-cyan-btn"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
          >
            Start a project <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
