'use client'

import Link from 'next/link'
import { useState } from 'react'

interface StackItem {
  title: string
  description: string
}

const TECH_STACK: StackItem[] = [
  {
    title: 'Quantum debate engine',
    description: 'Multi-model deliberation across Claude, GPT, Gemini, and Perplexity with role-based rounds and a compiled synthesis layer.',
  },
  {
    title: 'KCP-90 compression protocol',
    description: 'In-house context compression that reduces token spend on long-form deliberation while preserving semantic fidelity.',
  },
  {
    title: 'voidexa.com surface',
    description: 'A unified web client — Void Pro AI, Star System, Free Flight, Trading Hub, and the Break Room — sitting on the same auth and wallet.',
  },
  {
    title: 'All sovereign, all in-house',
    description: 'No third-party orchestration layer. Backend on Railway, frontend on Vercel, data on Supabase, payments through Stripe.',
  },
]

function SubscribeForm() {
  const [email, setEmail] = useState('')

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

const sectionHeading: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-space, system-ui)',
  color: '#fff',
  borderLeft: '3px solid #00d4ff',
  paddingLeft: 12,
  textShadow: '0 0 10px rgba(0,212,255,0.4)',
}

const proseText: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.7,
  color: 'rgba(255,255,255,0.75)',
  margin: '0 0 14px',
}

const inlineLink: React.CSSProperties = {
  color: '#00d4ff',
  textDecoration: 'none',
  borderBottom: '1px solid rgba(0,212,255,0.4)',
  paddingBottom: 1,
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
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <header style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 14,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.75)',
            fontFamily: 'var(--font-space, monospace)',
            marginBottom: 12,
          }}>
            voidexa · White Paper
          </div>
          <h1 style={{
            margin: '0 0 18px',
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-space, system-ui)',
            background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.15,
          }}>
            The infrastructure behind the universe
          </h1>
          <p style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.72)',
            margin: 0,
          }}>
            voidexa builds sovereign AI infrastructure — trading systems, encrypted communication,
            custom decision platforms — and a gameplay layer that fuels it all. This document
            outlines the stack, the mechanics, and the platform currency that powers the ecosystem.
          </p>
        </header>

        {/* Platform Currency Overview — brief, link to /ghost-ai */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={sectionHeading}>Platform currency</h2>
          <p style={proseText}>
            GHAI is the platform currency of the voidexa ecosystem — a fixed-rate platform credit
            (<span style={{ color: '#fff', fontWeight: 600 }}>$1 = 100 GHAI</span>) earned or
            purchased and spent inside voidexa for AI compute, priority access, and seasonal
            content. It is not an investment vehicle and circulates only inside voidexa products.
          </p>
          <p style={{ ...proseText, margin: 0 }}>
            <Link href="/ghost-ai" style={inlineLink}>
              Full GHAI overview →
            </Link>
          </p>
        </section>

        {/* Technology Stack */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={sectionHeading}>Technology stack</h2>
          <div style={{ display: 'grid', gap: 14 }}>
            {TECH_STACK.map(item => (
              <div
                key={item.title}
                style={{
                  padding: '18px 20px',
                  background: 'linear-gradient(160deg, rgba(14,18,30,0.7), rgba(6,10,18,0.85))',
                  border: '1px solid rgba(0,212,255,0.18)',
                  borderRadius: 12,
                }}
              >
                <div style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#fff',
                  fontFamily: 'var(--font-space, system-ui)',
                  marginBottom: 6,
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.68)',
                  lineHeight: 1.6,
                }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={sectionHeading}>Roadmap</h2>
          <p style={proseText}>
            Product launches, platform milestones, and seasonal content drops are tracked on the
            Station — voidexa&apos;s public build log and release cadence.
          </p>
          <p style={{ ...proseText, margin: 0 }}>
            <Link href="/station" style={inlineLink}>
              See Station →
            </Link>
          </p>
        </section>

        {/* Under consideration with legal advisors */}
        <section style={{
          marginBottom: 48,
          padding: '24px 26px',
          background: 'rgba(245, 158, 11, 0.07)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          borderRadius: 14,
        }}>
          <div style={{
            fontSize: 14,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: '#f59e0b',
            fontFamily: 'var(--font-space, monospace)',
            marginBottom: 10,
          }}>
            Under consideration with legal advisors
          </div>
          <p style={{
            fontSize: 15,
            lineHeight: 1.65,
            color: 'rgba(255, 235, 200, 0.88)',
            margin: 0,
          }}>
            voidexa is working with ADVORA (Danish regulatory specialists) on the framework that
            would allow GHAI to extend beyond platform credit into a broader utility token.
            Timeline, scope, and technical details will be finalized only after legal clearance.
            No contract addresses, technical infrastructure, or distribution mechanics will be
            disclosed until that review is complete.
          </p>
        </section>

        {/* Subscribe */}
        <section style={{
          padding: '32px 26px',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(139,92,246,0.06))',
          border: '1px solid rgba(0,212,255,0.22)',
          borderRadius: 14,
        }}>
          <h3 style={{
            margin: '0 0 10px',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.005em',
            fontFamily: 'var(--font-space, system-ui)',
            color: '#fff',
          }}>
            Subscribe for updates
          </h3>
          <p style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.7)',
            margin: '0 0 18px',
            lineHeight: 1.6,
          }}>
            Subscribe and we&apos;ll send you the full paper when it publishes — no marketing drip,
            just the document.
          </p>
          <SubscribeForm />
        </section>
      </div>
    </div>
  )
}
