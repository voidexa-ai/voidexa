import { notFound } from 'next/navigation'
import Link from 'next/link'
import { STRATEGIES } from '@/content/trading-hub/strategies'
import { ChevronLeft, Zap } from 'lucide-react'

const ACCENT = '#cc9955'

interface PageProps {
  params: Promise<{ 'strategy-slug': string }>
}

export async function generateStaticParams() {
  return STRATEGIES.map(s => ({ 'strategy-slug': s.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { 'strategy-slug': slug } = await params
  const s = STRATEGIES.find(s => s.slug === slug)
  if (!s) return {}
  return { title: `${s.title} — Trading Hub — voidexa` }
}

export default async function StrategyPage({ params }: PageProps) {
  const { 'strategy-slug': slug } = await params
  const strategy = STRATEGIES.find(s => s.slug === slug)
  if (!strategy) notFound()

  return (
    <div className="min-h-screen" style={{ background: '#07070d' }}>
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        {/* Back */}
        <Link
          href="/trading-hub"
          className="inline-flex items-center gap-2 mb-10 transition-colors hover:text-[#94a3b8]"
          style={{ color: '#475569', fontSize: '0.9375rem', textDecoration: 'none' }}
        >
          <ChevronLeft size={16} /> Back to Trading Hub
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <h1
              style={{
                color: '#e2e8f0',
                fontSize: '2.5rem',
                fontFamily: 'var(--font-space)',
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            >
              {strategy.title}
            </h1>
            {strategy.isEdge && <Zap size={20} style={{ color: ACCENT, marginTop: 4 }} />}
          </div>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', marginBottom: 16 }}>{strategy.tagline}</p>
          <div className="flex flex-wrap gap-2">
            {strategy.tags.map(tag => (
              <span
                key={tag}
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  background: strategy.isEdge ? `${ACCENT}14` : 'rgba(255,255,255,0.05)',
                  color: strategy.isEdge ? ACCENT : '#64748b',
                  border: strategy.isEdge ? `1px solid ${ACCENT}28` : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {strategy.sections.map((sec, i) => (
            <div key={i}>
              <h2
                style={{
                  color: strategy.isEdge ? ACCENT : '#94a3b8',
                  fontWeight: 500,
                  marginBottom: 8,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase' as const,
                  fontSize: '0.8125rem',
                }}
              >
                {sec.heading}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.75 }}>{sec.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
