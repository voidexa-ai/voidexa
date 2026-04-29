'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const PROMOS = [
  {
    id: 'free-flight',
    title: 'Free Flight is live',
    description: 'Take a Vattalus light fighter into the voidexa starfield. No login required.',
    href: '/freeflight',
    cta: 'Launch',
    accent: '#22d3ee',
  },
  {
    id: 'alpha-cards',
    title: 'Alpha 1000 cards shipped',
    description: '1000 unique card art pieces, 6 rarities, with mythic iridescent frames live now.',
    href: '/cards',
    cta: 'See the catalog',
    accent: '#a78bfa',
  },
  {
    id: 'kcp-90',
    title: 'KCP-90 ~93% compression',
    description: 'Every Quantum Council debate uses KCP-90 to cut bytes on the wire.',
    href: '/quantum',
    cta: 'How it works',
    accent: '#f59e0b',
  },
  {
    id: 'manual',
    title: 'Read the rules',
    description: 'Five-etape pilot manual covers every system in the universe.',
    href: '/manual',
    cta: 'Open manual',
    accent: '#22c55e',
  },
] as const

export default function RollingPromo() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx(i => (i + 1) % PROMOS.length)
    }, 5000)
    return () => window.clearInterval(id)
  }, [])

  const promo = PROMOS[idx]

  return (
    <section
      aria-label="voidexa promotions"
      data-testid="rolling-promo"
      className="mb-4 overflow-hidden rounded-2xl border bg-zinc-950/60 p-6 backdrop-blur"
      style={{
        borderColor: `${promo.accent}55`,
        boxShadow: `0 0 0 1px ${promo.accent}22`,
        transition: 'border-color 600ms, box-shadow 600ms',
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: `${promo.accent}cc` }}
          >
            {promo.title}
          </p>
          <p className="truncate text-base text-zinc-300">{promo.description}</p>
        </div>
        <Link
          href={promo.href}
          data-testid="rolling-promo-cta"
          className="self-start rounded-lg border px-4 py-2 text-sm font-semibold transition hover:opacity-80 sm:self-auto"
          style={{
            borderColor: `${promo.accent}88`,
            color: promo.accent,
            background: `${promo.accent}10`,
          }}
        >
          {promo.cta} →
        </Link>
      </div>
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {PROMOS.map((_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition"
            style={{
              background: i === idx ? promo.accent : '#3f3f46',
              opacity: i === idx ? 1 : 0.5,
            }}
          />
        ))}
      </div>
    </section>
  )
}

export const ROLLING_PROMOS = PROMOS
