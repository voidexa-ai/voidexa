'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, Shield, BookOpen, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react'
import { RealWorldPaymentNotice } from '@/components/shop/RealWorldPaymentNotice'

const products = [
  {
    icon: TrendingUp,
    title: 'AI Trading Bot',
    status: 'Live',
    statusColor: '#00d4ff',
    tagline: 'Autonomous crypto portfolio management with AI regime detection.',
    desc: 'A fully modular spot rebalancing bot with futures overlay. It classifies the market into BTC/ETH/ALTCOIN phases or RISK_OFF, generates a rebalance proposal, validates it through a risk gate, and executes in dry-run or live mode.',
    features: [
      '5-stage AI pipeline (Market Data → Season → Rebalance → Risk → Execution)',
      'Market regime classifier (BTC_PHASE / ETH_PHASE / ALTCOIN_PHASE / RISK_OFF)',
      'Futures overlay with adaptive leverage up to 5x',
      'Momentum weighting — altcoin allocations adjust dynamically',
      'Multi-agent architecture (Scanner, Season, Futures, Portfolio)',
      'Telegram notifications + paper trading simulator',
      'KuCoin integration — spot + futures read/write',
      '+313% backtest return over 12 months vs buy-and-hold -6%',
    ],
    href: '/contact',
    cta: 'Request access',
  },
  {
    icon: Shield,
    title: 'Comlink',
    status: 'Beta',
    statusColor: '#8b5cf6',
    tagline: 'Encrypted peer-to-peer messaging with zero server storage.',
    desc: 'Comlink is built for people who value privacy above convenience. End-to-end encrypted, no logs, no accounts, ephemeral channels that disappear when you close them.',
    features: [
      'End-to-end encryption on all messages',
      'Zero server storage — nothing persisted',
      'Ephemeral channels that auto-close',
      'Cross-platform (iOS, Android, Web)',
      'No accounts, no phone numbers required',
      'Open protocol planned for v2',
    ],
    href: '/contact',
    cta: 'Join beta',
  },
  {
    icon: BookOpen,
    title: 'AI Book Creator',
    status: 'In Dev',
    statusColor: '#00d4ff',
    tagline: 'Generate publication-ready books from a single prompt.',
    desc: 'Describe your book concept once. The AI structures chapters, maintains consistent voice, handles research synthesis, and exports in print-ready and digital formats.',
    features: [
      'Full book generation from a one-page brief',
      'Consistent narrative voice across chapters',
      'Automated research synthesis and citations',
      'Export to PDF, EPUB, DOCX',
      'Non-fiction, technical, and fiction modes',
      'Human-in-the-loop editing workflow',
    ],
    href: '/contact',
    cta: 'Notify me',
  },
  {
    icon: Wrench,
    title: 'Website Builder',
    status: 'Soon',
    statusColor: '#8b5cf6',
    tagline: 'AI-designed, production-deployed websites from a brief.',
    desc: 'Describe your brand, audience, and goals. Get back a production Next.js site — designed, built, and deployed — in minutes. Not a drag-and-drop editor. An AI that ships code.',
    features: [
      'Brief-to-deployed in under 10 minutes',
      'Production Next.js + Tailwind output',
      'Responsive by default, SEO optimized',
      'Custom domain and edge deployment',
      'Full code ownership — no lock-in',
      'Ongoing AI-assisted iteration',
    ],
    href: '/contact',
    cta: 'Get notified',
  },
]

function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span
      className="text-sm font-medium uppercase tracking-widest px-2.5 py-1 rounded-full"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}35`,
        color,
      }}
    >
      {status}
    </span>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            Products
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-5"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Built to run{' '}
            <span className="gradient-text">without you.</span>
          </h1>
          <p className="text-[#64748b] max-w-xl mx-auto">
            Every product in the voidexa suite is designed to operate autonomously.
            Set it up once, let it work.
          </p>
        </motion.div>

        <RealWorldPaymentNotice />

        {/* Products */}
        <div className="space-y-8">
          {products.map(({ icon: Icon, title, status, statusColor, tagline, desc, features, href, cta }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-3xl p-8 lg:p-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left */}
                <div className="lg:col-span-2">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}
                    >
                      <Icon size={20} style={{ color: statusColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h2
                          className="text-xl font-bold text-[#e2e8f0]"
                          style={{ fontFamily: 'var(--font-space)' }}
                        >
                          {title}
                        </h2>
                        <StatusBadge status={status} color={statusColor} />
                      </div>
                      <p className="text-sm text-[#475569]">{tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748b] leading-relaxed mb-6">{desc}</p>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#0a0a0f] hover:opacity-90 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${statusColor}, #8b5cf6)` }}
                  >
                    {cta} <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Right — features */}
                <div className="lg:col-span-3">
                  <p className="text-sm font-medium uppercase tracking-widest text-[#475569] mb-4">
                    Features
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#64748b]">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: statusColor }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
