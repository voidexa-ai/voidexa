'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function TeamTeaser() {
  return (
    <div className="px-6 pb-4">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/team"
          className="inline-flex items-center gap-3 group transition-all hover:opacity-90"
          style={{
            padding: '10px 18px',
            borderRadius: 40,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Tiny circular group photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cast/gruppe billede.jpg"
            alt="The team"
            style={{
              width: 50, height: 50, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center 20%',
              border: '1.5px solid rgba(119,119,187,0.35)',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 15, fontWeight: 500, color: '#94a3b8' }}>
            Meet the team
          </span>
          <ArrowRight size={15} style={{ color: '#64748b' }} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
