'use client'

import Link from 'next/link'
import { useState } from 'react'

interface GhaiStat {
  value: string
  label: string
}

const GHAI_STATS: GhaiStat[] = [
  { value: '700,000,000', label: 'Total Supply' },
  { value: '200M',        label: 'Minted + Distributed' },
  { value: '300M',        label: 'Burned Permanently' },
  { value: 'Utility',     label: 'Token Type — Platform Currency' },
]

interface PlaceholderSection {
  title: string
  description: string
  href?: string
  cta?: string
}

const PLACEHOLDER_SECTIONS: PlaceholderSection[] = [
  {
    title: 'Tokenomics',
    description: 'Distribution, vesting, sinks, and burn mechanics. Full breakdown once legal review is complete.',
  },
  {
    title: 'Roadmap',
    description: 'Product launches, platform milestones, and seasonal content drops.',
    href: '/station',
    cta: 'See Station →',
  },
  {
    title: 'Partners',
    description: 'Integrations, data providers, and channel partners. Announcements coming soon.',
  },
  {
    title: 'Technology Stack',
    description: 'Quantum debate engine, KCP-90 compression protocol, voidexa.com surface. All sovereign, all in-house.',
  },
]

function GhaiOrb({ size = 220 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      position: 'relative',
      background: 'radial-gradient(circle at 38% 34%, #c8e8ff 0%, #00d4ff 18%, #6a5cff 48%, #140a33 82%)',
      boxShadow: '0 0 60px rgba(0,212,255,0.55), 0 0 120px rgba(139,92,246,0.35), inset 0 0 40px rgba(5,8,20,0.6)',
      animation: 'ghai-pulse 4s ease-in-out infinite',
    }}>
      {/* Inner swirl */}
      <div aria-hidden style={{
        position: 'absolute',
        inset: '18%',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.35)',
        boxShadow: '0 0 20px rgba(0,212,255,0.6) inset',
        opacity: 0.7,
      }} />
      {/* Wordmark */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-space, system-ui)',
        fontSize: size * 0.22,
        fontWeight: 800,
        letterSpacing: '0.05em',
        color: '#fff',
        textShadow: '0 0 18px rgba(0,212,255,0.85), 0 2px 6px rgba(0,0,0,0.7)',
      }}>
        GHAI
      </div>
      <style>{`
        @keyframes ghai-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50%      { transform: scale(1.03); filter: brightness(1.08); }
        }
      `}</style>
    </div>
  )
}

function SubscribeForm() {
  const [email, setEmail] = useState('')

  // Routes through the user's mail client straight to contact@voidexa.com.
  // Deferring the Supabase waitlist_signups table until after legal review;
  // no point collecting emails when the deliverable's ship date is uncertain.
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const addr = email.trim()
    if (!addr) return
    const subject = encodeURIComponent('White paper waitlist')
    const body = encodeURIComponent(`Please add ${addr} to the voidexa white paper waitlist.`)
    window.location.href = `mailto:contact@voidexa.com?subject=${subject}&body=${body}`
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@company.com"
        style={{
          flex: '1 1 260px',
          minWidth: 0,
          padding: '14px 16px',
          background: 'rgba(10,14,24,0.8)',
          border: '1px solid rgba(0,212,255,0.35)',
          borderRadius: 10,
          color: '#fff',
          fontSize: 16,
          fontFamily: 'var(--font-inter, system-ui)',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '14px 26px',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.4), rgba(139,92,246,0.35))',
          border: '1px solid rgba(0,212,255,0.7)',
          borderRadius: 10,
          color: '#fff',
          fontSize: 14,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-space, monospace)',
          cursor: 'pointer',
          textShadow: '0 0 10px #00d4ff',
          boxShadow: '0 0 20px rgba(0,212,255,0.35)',
        }}
      >
        Subscribe for updates
      </button>
    </form>
  )
}

export default function WhitePaperPageClient() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0a1124 0%, #050813 60%, #02030a 100%)',
      color: '#fff',
      fontFamily: 'var(--font-inter, system-ui)',
      padding: '96px 24px 80px',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            fontSize: 13,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.75)',
            fontFamily: 'var(--font-space, monospace)',
            marginBottom: 10,
          }}>
            voidexa · White Paper
          </div>
          <h1 style={{
            margin: '0 0 14px',
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-space, system-ui)',
            background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
          }}>
            The infrastructure behind the universe
          </h1>
          <p style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 640,
            margin: '0 auto',
          }}>
            voidexa builds sovereign AI infrastructure — trading systems, encrypted communication,
            custom decision platforms — and a gameplay layer that fuels it all. This document
            outlines the stack, the mechanics, and the utility model behind GHAI.
          </p>
        </section>

        {/* GHAI Section */}
        <section style={{
          marginBottom: 60,
          padding: '44px 32px',
          background: 'linear-gradient(160deg, rgba(14,18,30,0.88), rgba(6,10,18,0.95))',
          border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: 20,
          boxShadow: '0 0 40px rgba(0,212,255,0.15)',
        }}>
          <div style={{
            display: 'flex',
            gap: 40,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ flex: '0 0 auto' }}>
              <GhaiOrb size={220} />
            </div>
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              <div style={{
                fontSize: 13,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#00d4ff',
                fontFamily: 'var(--font-space, monospace)',
                textShadow: '0 0 10px rgba(0,212,255,0.6)',
                marginBottom: 8,
              }}>
                Utility Token · GHAI
              </div>
              <h2 style={{
                margin: '0 0 14px',
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: '-0.015em',
                fontFamily: 'var(--font-space, system-ui)',
                color: '#fff',
              }}>
                Ghost AI (GHAI)
              </h2>
              <p style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.75)',
                margin: '0 0 20px',
              }}>
                GHAI is the platform utility credit that unlocks premium AI compute,
                priority queue access, and seasonal in-game content across voidexa.
                It is not a security, not an investment vehicle, and not listed on
                any public exchange. Exact mechanics will be finalized post legal review.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
                marginBottom: 20,
              }}>
                {GHAI_STATS.map(s => (
                  <div key={s.label} style={{
                    padding: '14px 16px',
                    background: 'rgba(0,212,255,0.06)',
                    border: '1px solid rgba(0,212,255,0.25)',
                    borderRadius: 10,
                  }}>
                    <div style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: '#00d4ff',
                      fontFamily: 'var(--font-space, system-ui)',
                      textShadow: '0 0 10px rgba(0,212,255,0.5)',
                    }}>
                      {s.value}
                    </div>
                    <div style={{
                      fontSize: 12,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.6)',
                      fontFamily: 'var(--font-space, monospace)',
                      marginTop: 4,
                    }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                padding: '14px 18px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.55)',
                borderRadius: 10,
                fontSize: 14,
                lineHeight: 1.6,
                color: '#ffd99a',
              }}>
                <strong style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 12, color: '#f59e0b' }}>
                  Pending legal review
                </strong>
                <div style={{ marginTop: 4, color: 'rgba(255,235,200,0.85)' }}>
                  GHAI token mechanics are undergoing legal review by <strong>ADVORA</strong>.
                  Token launch, utility scope, and distribution details will be disclosed
                  once review is complete. No contract address has been or will be shared
                  before launch.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Placeholder sections */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{
            margin: '0 0 18px',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-space, system-ui)',
            color: '#fff',
            borderLeft: '3px solid #00d4ff',
            paddingLeft: 14,
            textShadow: '0 0 10px rgba(0,212,255,0.5)',
          }}>
            In the full paper
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {PLACEHOLDER_SECTIONS.map(s => {
              const body = (
                <div style={{
                  padding: '22px 22px',
                  background: 'linear-gradient(160deg, rgba(14,18,30,0.75), rgba(6,10,18,0.9))',
                  border: '1px solid rgba(0,212,255,0.18)',
                  borderRadius: 12,
                  height: '100%',
                  boxSizing: 'border-box',
                }}>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: '-0.005em',
                    color: '#fff',
                    fontFamily: 'var(--font-space, system-ui)',
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.65)',
                    marginTop: 8,
                    lineHeight: 1.55,
                  }}>
                    {s.description}
                  </div>
                  {s.href && s.cta && (
                    <div style={{
                      marginTop: 12,
                      fontSize: 13,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#00d4ff',
                      fontFamily: 'var(--font-space, monospace)',
                      textShadow: '0 0 8px rgba(0,212,255,0.5)',
                    }}>
                      {s.cta}
                    </div>
                  )}
                </div>
              )
              return s.href ? (
                <Link key={s.title} href={s.href} style={{ textDecoration: 'none' }}>
                  {body}
                </Link>
              ) : (
                <div key={s.title}>{body}</div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          textAlign: 'center',
          padding: '40px 24px',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.08))',
          border: '1px solid rgba(0,212,255,0.25)',
          borderRadius: 16,
        }}>
          <h3 style={{
            margin: '0 0 10px',
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '-0.01em',
            fontFamily: 'var(--font-space, system-ui)',
            color: '#fff',
          }}>
            Learn more when we launch
          </h3>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.68)',
            margin: '0 auto 22px',
            maxWidth: 520,
            lineHeight: 1.6,
          }}>
            The full white paper publishes after legal review. Subscribe and we&apos;ll send
            you the PDF the moment it ships — no marketing drip, just the document.
          </p>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <SubscribeForm />
          </div>
        </section>
      </div>
    </div>
  )
}
