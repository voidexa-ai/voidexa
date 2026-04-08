'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { Shield, Globe, Zap, Users, TrendingUp, Network, Star, ChevronRight } from 'lucide-react'

// ── Animated mini solar system ──────────────────────────────────────────────
function MiniSolarSystem({
  label,
  sublabel,
  isMystery,
}: {
  label: string
  sublabel: string
  isMystery?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2

    const planets = isMystery
      ? [
          { r: 38, speed: 0.0000001, size: 4, color: 'rgba(0,212,255,0.4)', phase: 0 },
          { r: 60, speed: 0.0000001, size: 5, color: 'rgba(139,92,246,0.4)', phase: 1.2 },
          { r: 82, speed: 0.0000001, size: 3, color: 'rgba(0,212,255,0.3)', phase: 2.5 },
        ]
      : [
          { r: 38, speed: 0.0000001, size: 5, color: '#ff6600', phase: 0 },
          { r: 56, speed: 0.0000001, size: 4, color: '#cc00ff', phase: 0.8 },
          { r: 74, speed: 0.0000001, size: 6, color: '#00ff44', phase: 1.6 },
          { r: 92, speed: 0.0000001, size: 3, color: '#ff0044', phase: 2.4 },
        ]

    let raf: number
    let t = 0

    function draw() {
      ctx!.clearRect(0, 0, W, H)

      // Stars
      ctx!.fillStyle = 'rgba(255,255,255,0.6)'
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 37 + 13) % W)
        const sy = ((i * 53 + 7) % H)
        const sz = ((i * 17) % 2) * 0.5 + 0.5
        ctx!.beginPath()
        ctx!.arc(sx, sy, sz * 0.6, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Sun
      const sunGlow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 14)
      if (isMystery) {
        sunGlow.addColorStop(0, 'rgba(0,212,255,0.15)')
        sunGlow.addColorStop(1, 'transparent')
      } else {
        sunGlow.addColorStop(0, 'rgba(0,212,255,0.9)')
        sunGlow.addColorStop(0.4, 'rgba(0,180,255,0.6)')
        sunGlow.addColorStop(1, 'transparent')
      }
      ctx!.beginPath()
      ctx!.arc(cx, cy, 14, 0, Math.PI * 2)
      ctx!.fillStyle = sunGlow
      ctx!.fill()
      ctx!.beginPath()
      ctx!.arc(cx, cy, isMystery ? 5 : 8, 0, Math.PI * 2)
      ctx!.fillStyle = isMystery ? 'rgba(0,212,255,0.2)' : '#00d4ff'
      ctx!.fill()

      planets.forEach(p => {
        const angle = t * p.speed * 1000 + p.phase
        const px = cx + Math.cos(angle) * p.r
        const py = cy + Math.sin(angle) * p.r

        // Orbit ring
        ctx!.beginPath()
        ctx!.arc(cx, cy, p.r, 0, Math.PI * 2)
        ctx!.strokeStyle = isMystery ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.06)'
        if (isMystery) {
          ctx!.setLineDash([4, 6])
        } else {
          ctx!.setLineDash([])
        }
        ctx!.lineWidth = 0.5
        ctx!.stroke()
        ctx!.setLineDash([])

        // Planet glow
        const glow = ctx!.createRadialGradient(px, py, 0, px, py, p.size * 2.5)
        glow.addColorStop(0, p.color)
        glow.addColorStop(1, 'transparent')
        ctx!.beginPath()
        ctx!.arc(px, py, p.size * 2.5, 0, Math.PI * 2)
        ctx!.fillStyle = glow
        ctx!.fill()

        // Planet body
        ctx!.beginPath()
        ctx!.arc(px, py, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.color
        ctx!.fill()
      })

      t += 16
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [isMystery])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        position: 'relative',
        borderRadius: '50%',
        border: isMystery
          ? '1px dashed rgba(0,212,255,0.25)'
          : '1px solid rgba(0,212,255,0.15)',
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.6)',
        boxShadow: isMystery
          ? '0 0 30px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,0,0,0.8)'
          : '0 0 40px rgba(0,212,255,0.12), inset 0 0 20px rgba(0,0,0,0.6)',
      }}>
        <canvas ref={canvasRef} width={220} height={220} style={{ display: 'block' }} />
        {isMystery && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.45)',
          }}>
            <span style={{
              fontSize: 36, fontWeight: 800,
              color: 'rgba(0,212,255,0.35)',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-space)',
            }}>?</span>
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: isMystery ? 'rgba(0,212,255,0.5)' : '#e2e8f0', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 14, color: '#64748b' }}>{sublabel}</p>
      </div>
    </div>
  )
}

// ── Shimmer text ─────────────────────────────────────────────────────────────
function ShimmerText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      style={{
        background: 'linear-gradient(90deg, #00d4ff 0%, #8b5cf6 40%, #00d4ff 80%, #8b5cf6 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'shimmer 3s linear infinite',
        ...style,
      }}
    >
      {children}
    </span>
  )
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 0.03, 0.26, 1] } }),
}

export default function ClaimYourPlanetPage() {
  return (
    <>
      <style>{`
        @keyframes shimmer { to { background-position: 200% center } }
        @keyframes cyanPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(0,212,255,0.18), 0 0 30px rgba(0,212,255,0.06); }
          50% { box-shadow: 0 0 24px rgba(0,212,255,0.4), 0 0 60px rgba(0,212,255,0.12); }
        }
        @keyframes dashSpin {
          to { stroke-dashoffset: -100; }
        }
      `}</style>

      <div style={{ paddingTop: 90 }}>

        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <section style={{
          minHeight: '60vh', maxHeight: '60vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 24px 60px',
          position: 'relative', overflow: 'hidden',
          background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(0,212,255,0.06) 0%, transparent 70%)',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/claaming a planet.jpg"
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', opacity: 0.55, zIndex: 0 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,7,13,0.25) 0%, rgba(7,7,13,0.08) 50%, rgba(7,7,13,0.45) 100%)', zIndex: 1 }} />

          {/* Decorative rings */}
          <div aria-hidden style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 600, height: 600, borderRadius: '50%',
            border: '1px dashed rgba(0,212,255,0.06)', pointerEvents: 'none', zIndex: 2,
          }} />
          <div aria-hidden style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 400, height: 400, borderRadius: '50%',
            border: '1px dashed rgba(139,92,246,0.08)', pointerEvents: 'none', zIndex: 2,
          }} />

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', maxWidth: 760, position: 'relative', zIndex: 2 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999,
              border: '1px solid rgba(0,212,255,0.2)',
              background: 'rgba(0,212,255,0.04)',
              marginBottom: 28,
            }}>
              <Globe size={14} style={{ color: '#00d4ff' }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(0,212,255,0.8)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Phase 2.5 — Planet Ownership
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(48px, 8vw, 88px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: 24,
              fontFamily: 'var(--font-space)',
            }}>
              <ShimmerText>Claim Your Planet</ShimmerText>
            </h1>

            <p style={{
              fontSize: 'clamp(18px, 2.5vw, 22px)',
              color: 'rgba(148,163,184,0.85)',
              lineHeight: 1.65,
              maxWidth: 580,
              margin: '0 auto 36px',
              fontWeight: 400,
            }}>
              Own a sovereign node in the voidexa star system.
              Build infrastructure. Fuel it with your contributions. Become part of
              the network that runs itself.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="mailto:contact@voidexa.com"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', borderRadius: 999,
                  background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
                  color: '#0a0a0f', fontSize: 16, fontWeight: 700,
                  textDecoration: 'none', transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Apply for a Planet
                <ChevronRight size={16} />
              </a>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '14px 24px', borderRadius: 999,
                border: '1px solid rgba(0,212,255,0.2)',
                color: 'rgba(148,163,184,0.7)', fontSize: 15,
              }}>
                5 Pioneer Slots Available
              </span>
            </div>
          </motion.div>
        </section>

        {/* ── 2. PRICING BANNER ──────────────────────────────────────────── */}
        <section style={{
          padding: '0 24px 60px',
          display: 'flex', justifyContent: 'center',
        }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            style={{
              maxWidth: 700, width: '100%',
              padding: '32px 40px',
              borderRadius: 20,
              border: '1px solid rgba(139,92,246,0.25)',
              background: 'linear-gradient(135deg, rgba(10,4,30,0.95) 0%, rgba(22,10,45,0.95) 100%)',
              backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', gap: 28,
              boxShadow: '0 0 60px rgba(139,92,246,0.08)',
              flexWrap: 'wrap',
            }}
          >
            {/* Purple orb */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
              background: 'radial-gradient(circle, #8b5cf6 0%, rgba(139,92,246,0.3) 60%, transparent 100%)',
              boxShadow: '0 0 32px rgba(139,92,246,0.5)',
              animation: 'cyanPulse 3s ease-in-out infinite',
            }} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{
                fontSize: 22, fontWeight: 700, color: '#e2e8f0',
                marginBottom: 6, fontFamily: 'var(--font-space)',
              }}>
                Pricing at launch.
              </p>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>
                Planet pricing details will be announced at launch. Token payment options coming soon.
              </p>
              <p style={{ fontSize: 14, color: '#475569', marginTop: 10 }}>
                <Link href="/ghost-ai" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#a78bfa'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#8b5cf6'}
                >
                  Learn about Ghost AI →
                </Link>
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── 3. SOLAR SYSTEM DEMO ────────────────────────────────────────── */}
        <section style={{
          padding: '60px 24px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,20,0.4) 50%, transparent 100%)',
        }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: 52 }}
          >
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#e2e8f0',
              letterSpacing: '-0.02em', fontFamily: 'var(--font-space)',
            }}>
              Two Systems. One Universe.
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', marginTop: 8 }}>
              The voidexa star system is growing. Your planet could be next.
            </p>
          </motion.div>

          <div style={{
            display: 'flex', gap: 40, justifyContent: 'center',
            alignItems: 'flex-start', flexWrap: 'wrap',
          }}>
            <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <MiniSolarSystem label="voidexa system" sublabel="Active · Expanding" />
            </motion.div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              paddingTop: 90, color: 'rgba(0,212,255,0.3)', fontSize: 28, fontWeight: 300,
            }}>
              vs
            </div>
            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <MiniSolarSystem label="your system" sublabel="Unclaimed · Waiting" isMystery />
            </motion.div>
          </div>
        </section>

        {/* ── 4. PIONEER REWARD ───────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
                padding: '5px 14px', borderRadius: 999,
                border: '1px solid rgba(245,158,11,0.3)',
                background: 'rgba(245,158,11,0.06)',
              }}>
                <Star size={13} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  First 5 Pioneers
                </span>
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
                color: '#e2e8f0', letterSpacing: '-0.02em', fontFamily: 'var(--font-space)',
              }}>
                Pioneer Reward Program
              </h2>
              <p style={{ fontSize: 16, color: '#64748b', marginTop: 10, maxWidth: 520, margin: '10px auto 0' }}>
                The first 5 habitable planets receive a special vesting reward paid out over 18 months.
              </p>
            </motion.div>

            {/* 5 Pioneer Slots */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  width: 68, height: 68, borderRadius: '50%',
                  border: '2px dashed rgba(0,212,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,212,255,0.03)',
                  animation: 'cyanPulse 3s ease-in-out infinite',
                  animationDelay: `${i * 0.3}s`,
                }}>
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: 'rgba(0,212,255,0.3)',
                    fontFamily: 'var(--font-space)',
                  }}>0{i}</span>
                </div>
              ))}
            </motion.div>

            {/* Reward Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {[
                {
                  milestone: '6-Month Milestone',
                  amount: 'Pioneer Reward',
                  desc: 'Paid monthly over 6 months after reaching the 6-month milestone.',
                  color: '#00d4ff',
                  glow: 'rgba(0,212,255,0.12)',
                },
                {
                  milestone: '12-Month Milestone',
                  amount: 'Pioneer Reward',
                  desc: 'Paid monthly over 6 months after reaching the 12-month milestone.',
                  color: '#8b5cf6',
                  glow: 'rgba(139,92,246,0.12)',
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  style={{
                    padding: '32px 28px',
                    borderRadius: 16,
                    border: `1px solid ${card.color}30`,
                    background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${card.glow} 100%)`,
                    boxShadow: `0 0 40px ${card.glow}`,
                  }}
                >
                  <p style={{
                    fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: card.color, marginBottom: 12,
                  }}>
                    {card.milestone}
                  </p>
                  <p style={{
                    fontSize: 32, fontWeight: 800, color: '#e2e8f0',
                    letterSpacing: '-0.02em', marginBottom: 12,
                    fontFamily: 'var(--font-space)',
                  }}>
                    {card.amount}
                  </p>
                  <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>{card.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Vesting note */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{
                marginTop: 24, padding: '18px 24px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
              <span style={{ fontSize: 16, marginTop: 1 }}>⚠️</span>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>18 months total vesting period.</span>{' '}
                Pioneer reward is paid monthly over two 6-month windows. Planet owner must maintain habitable status throughout the entire vesting period.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── 5. FUEL YOUR PLANET ─────────────────────────────────────────── */}
        <section style={{
          padding: '80px 24px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.04) 50%, transparent 100%)',
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: 52 }}>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
                color: '#e2e8f0', letterSpacing: '-0.02em', fontFamily: 'var(--font-space)',
              }}>
                Fuel Your Planet
              </h2>
              <p style={{ fontSize: 16, color: '#64748b', marginTop: 10, maxWidth: 480, margin: '10px auto 0' }}>
                Two contributions power every planet — an initial deposit to stake your claim,
                and a monthly contribution to keep it alive.
              </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {[
                {
                  phase: 'Launch Phase',
                  title: 'Initial Deposit',
                  desc: 'A one-time deposit to stake your claim in the voidexa star system and activate your planet node. Pricing at launch.',
                  icon: '🚀',
                  color: '#00d4ff',
                },
                {
                  phase: 'Self-Sustaining',
                  title: 'Monthly Contribution',
                  desc: 'A monthly contribution that keeps your planet active, habitable, and growing within the network. Pricing at launch.',
                  icon: '🔄',
                  color: '#8b5cf6',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  style={{
                    padding: '32px 28px', borderRadius: 16,
                    border: `1px solid ${item.color}22`,
                    background: 'rgba(7,4,18,0.8)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
                  <p style={{
                    fontSize: 12, fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: item.color, marginBottom: 8,
                  }}>
                    {item.phase}
                  </p>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 12, fontFamily: 'var(--font-space)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. PROTECTED ECOSYSTEM ──────────────────────────────────────── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.2)',
              }}>
                <Shield size={28} style={{ color: '#00d4ff' }} />
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
                color: '#e2e8f0', letterSpacing: '-0.02em', fontFamily: 'var(--font-space)',
              }}>
                Protected Ecosystem
              </h2>
              <p style={{
                fontSize: 16, color: '#64748b', marginTop: 10,
                maxWidth: 500, margin: '10px auto 0', lineHeight: 1.65,
              }}>
                Funds go to infrastructure, not founder pockets. Every contribution is
                transparently allocated and governed.
              </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {[
                {
                  title: 'Transparent Allocation',
                  desc: 'All payments tracked via Stripe. Allocation to infrastructure, rewards, and operations is publicly visible.',
                  icon: '📊',
                },
                {
                  title: 'Smart Contract Governed',
                  desc: 'Planet rules, pioneer rewards, and fund distribution are enforced transparently — no manual overrides.',
                  icon: '⛓️',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  style={{
                    padding: '28px 24px', borderRadius: 14,
                    border: '1px solid rgba(0,212,255,0.1)',
                    background: 'rgba(0,10,20,0.6)',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 10, fontFamily: 'var(--font-space)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. PLANET OWNER BENEFITS ────────────────────────────────────── */}
        <section style={{
          padding: '80px 24px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.03) 50%, transparent 100%)',
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: 52 }}>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
                color: '#e2e8f0', letterSpacing: '-0.02em', fontFamily: 'var(--font-space)',
              }}>
                Planet Owner Benefits
              </h2>
              <p style={{ fontSize: 16, color: '#64748b', marginTop: 10 }}>
                Access the full voidexa infrastructure stack.
              </p>
            </motion.div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}>
              {[
                {
                  icon: <Zap size={22} />,
                  title: 'Quantum Engine',
                  desc: 'Priority access to Quantum — voidexa\'s multi-AI consensus engine across all major providers.',
                  color: '#8b5cf6',
                },
                {
                  icon: <TrendingUp size={22} />,
                  title: 'Trading Infrastructure',
                  desc: 'Full access to the voidexa Trading Hub: strategies, competitions, and automated bot systems.',
                  color: '#ff6600',
                },
                {
                  icon: <Network size={22} />,
                  title: 'Shared Scaling',
                  desc: 'Your planet grows with the network. Shared infrastructure means lower costs as the system scales.',
                  color: '#00d4ff',
                },
                {
                  icon: <Users size={22} />,
                  title: 'Community Network',
                  desc: 'Connect with other planet owners. Share strategies, resources, and build the ecosystem together.',
                  color: '#00ff44',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  style={{
                    padding: '28px 24px', borderRadius: 14,
                    border: `1px solid ${item.color}18`,
                    background: 'rgba(7,4,18,0.7)',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, marginBottom: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${item.color}14`,
                    border: `1px solid ${item.color}22`,
                    color: item.color,
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 10, fontFamily: 'var(--font-space)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. HABITABILITY GRID ────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: 52 }}>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
                color: '#e2e8f0', letterSpacing: '-0.02em', fontFamily: 'var(--font-space)',
              }}>
                Habitability Grid
              </h2>
              <p style={{ fontSize: 16, color: '#64748b', marginTop: 10 }}>
                A habitable planet isn&apos;t just active — it&apos;s alive.
              </p>
            </motion.div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}>
              {[
                {
                  num: '01',
                  title: 'Bring People In',
                  desc: 'Attract users, contributors, and collaborators to your planet node.',
                  color: '#00d4ff',
                },
                {
                  num: '02',
                  title: 'Generate Activity',
                  desc: 'Consistent on-platform activity — trades, chats, contributions, interactions.',
                  color: '#8b5cf6',
                },
                {
                  num: '03',
                  title: 'Build Something Real',
                  desc: 'Launch a project, strategy, product, or service that adds value to the ecosystem.',
                  color: '#ff6600',
                },
                {
                  num: '04',
                  title: 'Expand Your Orbit',
                  desc: 'Grow connections with other planets and the broader voidexa network over time.',
                  color: '#00ff44',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  style={{
                    padding: '28px 22px', borderRadius: 14,
                    border: `1px solid ${item.color}18`,
                    background: 'rgba(0,0,10,0.5)',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 18, right: 18,
                    fontSize: 36, fontWeight: 800,
                    color: `${item.color}10`,
                    fontFamily: 'var(--font-space)',
                    lineHeight: 1,
                  }}>
                    {item.num}
                  </div>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 10px ${item.color}`,
                    marginBottom: 16,
                  }} />
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 10, fontFamily: 'var(--font-space)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. HOW TO CLAIM ─────────────────────────────────────────────── */}
        <section style={{
          padding: '80px 24px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.04) 50%, transparent 100%)',
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: 52 }}>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
                color: '#e2e8f0', letterSpacing: '-0.02em', fontFamily: 'var(--font-space)',
              }}>
                How to Claim
              </h2>
            </motion.div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24, position: 'relative',
            }}>
              {[
                {
                  step: '01',
                  title: 'Tell Us What You Bring',
                  desc: 'Send us an email describing your background, vision for your planet, and what you plan to build in the voidexa ecosystem.',
                  color: '#00d4ff',
                },
                {
                  step: '02',
                  title: 'Board Review',
                  desc: 'The voidexa team reviews your application. We onboard planets personally to ensure quality and ecosystem fit.',
                  color: '#8b5cf6',
                },
                {
                  step: '03',
                  title: 'Fuel Up and Launch',
                  desc: 'Once approved, make your initial deposit, set up your monthly contribution, and launch your planet into the star system.',
                  color: '#00ff44',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  style={{
                    padding: '32px 24px', borderRadius: 16,
                    border: `1px solid ${item.color}20`,
                    background: 'rgba(7,4,18,0.8)',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', marginBottom: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${item.color}14`,
                    border: `2px solid ${item.color}30`,
                    fontSize: 14, fontWeight: 800, color: item.color,
                    fontFamily: 'var(--font-space)',
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12, fontFamily: 'var(--font-space)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.65 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABANDONED PLANETS POLICY ────────────────────────────────────── */}
        <section style={{ padding: '0 24px 60px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{
                padding: '24px 28px', borderRadius: 14,
                border: '1px solid rgba(255,100,0,0.15)',
                background: 'rgba(255,60,0,0.03)',
              }}>
              <p style={{
                fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,100,0,0.6)', marginBottom: 10,
              }}>
                Abandoned Planet Policy
              </p>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                Planets inactive for{' '}
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>90+ days</span> receive a warning.
                After{' '}
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>180 days</span>{' '}
                of inactivity, the planet returns to the void and may be reassigned to a new owner.
                Content stays live. Deposits are non-refundable.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── 10. CTA ─────────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px 120px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{
              maxWidth: 680, margin: '0 auto',
              padding: '64px 40px',
              borderRadius: 24,
              border: '1px solid rgba(0,212,255,0.15)',
              background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.05) 0%, rgba(139,92,246,0.05) 60%, transparent 100%)',
              textAlign: 'center',
              boxShadow: '0 0 80px rgba(0,212,255,0.06)',
            }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
              padding: '5px 14px', borderRadius: 999,
              border: '1px solid rgba(245,158,11,0.3)',
              background: 'rgba(245,158,11,0.06)',
            }}>
              <Star size={13} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                5 Pioneer Slots Available
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.02em', marginBottom: 16,
              fontFamily: 'var(--font-space)',
            }}>
              <ShimmerText>Ready to Claim Your Planet?</ShimmerText>
            </h2>

            <p style={{
              fontSize: 16, color: '#64748b', lineHeight: 1.65,
              maxWidth: 480, margin: '0 auto 36px',
            }}>
              Applications are reviewed personally. Tell us what you bring to the voidexa universe.
            </p>

            <a
              href="mailto:contact@voidexa.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '16px 40px', borderRadius: 999,
                background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
                color: '#0a0a0f', fontSize: 17, fontWeight: 700,
                textDecoration: 'none', transition: 'opacity 0.2s',
                marginBottom: 20,
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              Apply Now
              <ChevronRight size={18} />
            </a>

            <p style={{ fontSize: 15, color: '#475569', marginTop: 8 }}>
              contact@voidexa.com
            </p>
          </motion.div>
        </section>

      </div>
    </>
  )
}
