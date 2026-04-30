import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Crown, ExternalLink, Hammer, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quantum Tools — voidexa',
  description:
    'Three ways to harness multi-AI intelligence. Quantum Council debates and converges. Quantum Forge ships builds. Void Pro AI gives premium pay-per-message access.',
}

type ToolCard = {
  icon: typeof Users
  title: string
  tagline: string
  body: string
  cta: string
  href: string
  external?: boolean
  color: string
}

const TOOLS: ToolCard[] = [
  {
    icon: Users,
    title: 'Quantum Council',
    tagline: '4 AIs debate. You get the answer.',
    body: 'Claude, GPT, Gemini, and Perplexity argue, refine, and converge on a single answer. The minority view is preserved when it disagrees with the majority.',
    cta: 'Enter Council',
    href: '/quantum',
    color: '#00d4ff',
  },
  {
    icon: Hammer,
    title: 'Quantum Forge',
    tagline: 'Debate-to-build pipeline.',
    body: 'Describe what you want. Multiple AIs debate the spec, extract a scaffold, and execute the build through Claude Agent SDK — all in one unbroken pipeline.',
    cta: 'Open Forge',
    href: 'https://forge.voidexa.com',
    external: true,
    color: '#8b5cf6',
  },
  {
    icon: Crown,
    title: 'Void Pro AI',
    tagline: 'Premium pay-per-message.',
    body: 'Direct access to Claude, GPT, and Gemini at premium quality with no subscription. Pay for what you use, when you use it.',
    cta: 'Try Void Pro AI',
    href: '/void-pro-ai',
    color: '#00d4ff',
  },
]

export default function QuantumToolsPage() {
  return (
    <div className="min-h-screen bg-transparent pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-medium uppercase tracking-widest text-[#00d4ff]/70 mb-3">
            Quantum Tools
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold text-[#e2e8f0] mb-5"
            style={{ fontFamily: 'var(--font-space)' }}
          >
            Three ways to harness{' '}
            <span className="gradient-text">multi-AI intelligence.</span>
          </h1>
          <p className="text-[#b0b0b0] max-w-xl mx-auto">
            One orbit, three tools. Council debates and converges. Forge ships builds.
            Void Pro AI gives you premium pay-per-message access to every model.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TOOLS.map(({ icon: Icon, title, tagline, body, cta, href, external, color }) => {
            const linkProps = external
              ? { href, target: '_blank' as const, rel: 'noopener noreferrer' }
              : { href }
            return (
              <Link
                {...linkProps}
                key={title}
                className="glass-card rounded-3xl p-7 flex flex-col hover:border-[var(--hover-border)] transition-colors"
                style={{
                  // CSS var consumed by hover:border-[var(--hover-border)] via inline definition
                  ['--hover-border' as string]: `${color}55`,
                }}
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
                <p className="text-base text-[#b0b0b0] mb-3">{tagline}</p>
                <p className="text-base text-[#b0b0b0] leading-relaxed mb-6">{body}</p>
                <div
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest"
                  style={{ color }}
                >
                  {cta}
                  {external ? (
                    <ExternalLink size={14} aria-hidden="true" />
                  ) : (
                    <ArrowRight size={14} aria-hidden="true" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
