'use client'

import { motion } from 'framer-motion'
import { Youtube, Twitter, MessageCircle, Music2 } from 'lucide-react'

const ACCENT = '#44aacc'

const SOCIALS = [
  {
    platform: 'TikTok',
    handle: '@voidexa',
    desc: 'Short-form demos, strategy breakdowns, and market commentary.',
    icon: Music2,
    color: '#ee1d52',
    href: 'https://tiktok.com/@voidexa',
  },
  {
    platform: 'YouTube',
    handle: 'voidexa',
    desc: 'Long-form tutorials, full product demos, and CEO updates.',
    icon: Youtube,
    color: '#ff0000',
    href: 'https://youtube.com/@voidexa',
  },
  {
    platform: 'Twitter / X',
    handle: '@voidexa',
    desc: 'Real-time announcements, market takes, and community polls.',
    icon: Twitter,
    color: '#1da1f2',
    href: 'https://x.com/voidexa',
  },
  {
    platform: 'Discord',
    handle: 'voidexa community',
    desc: 'The main hub. Get help, share bots, discuss strategy.',
    icon: MessageCircle,
    color: '#5865f2',
    href: 'https://discord.gg/voidexa',
  },
]

const BEHIND_THE_SCENES = [
  {
    date: 'Mar 2026',
    update: 'Trading Hub entering internal testing. Leaderboard data pipeline completed.',
  },
  {
    date: 'Mar 2026',
    update: 'Void Chat deployed to production. First paying users onboarded.',
  },
  {
    date: 'Feb 2026',
    update: 'GHAI token live on Solana. Platform credit system integrated.',
  },
  {
    date: 'Jan 2026',
    update: 'voidexa.com launched. Auth, profiles, waitlist, and star map all live.',
  },
]

export default function SocialDeck() {
  return (
    <div className="space-y-12">
      <div>
        <p style={{ color: `${ACCENT}88`, fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>
          Social Deck
        </p>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}>
          Find Us
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 24 }}>
          Follow the build. Join the community.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOCIALS.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl transition-all"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}33` }}
                >
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem' }}>{s.platform}</span>
                    <span style={{ color: '#334155', fontSize: '0.875rem' }}>{s.handle}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* Behind the scenes */}
      <div>
        <h3 style={{ color: '#e2e8f0', fontSize: '1.25rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 4 }}>
          Behind the Scenes
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 20 }}>
          What the team is actually working on, in plain language.
        </p>

        <div className="relative pl-5" style={{ borderLeft: '1px solid rgba(68,170,204,0.2)' }}>
          {BEHIND_THE_SCENES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="mb-6 relative"
            >
              <div
                className="absolute -left-[21px] w-3 h-3 rounded-full"
                style={{ background: '#07070d', border: `2px solid ${ACCENT}66`, top: 3 }}
              />
              <span style={{ color: ACCENT, fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                {item.date}
              </span>
              <p style={{ color: '#94a3b8', fontSize: '0.9375rem', lineHeight: 1.6 }}>{item.update}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
