'use client'

// Identity marker. Subtle — not overwhelming. The goal is that a visitor
// scrolling past knows this is a Danish-built, sovereign operation without
// the page shouting about it.
export default function HomeDenmark() {
  return (
    <section style={{
      position: 'relative',
      padding: '80px 24px',
      background: 'linear-gradient(180deg, #070918 0%, #050813 100%)',
      color: '#fff',
      overflow: 'hidden',
    }}>
      {/* Subtle Danish flag wash — soft red field with white cross, blurred
          so it reads as ambient color, not imagery. */}
      <div aria-hidden style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.07,
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 370 280" preserveAspectRatio="xMidYMid slice">
          <rect width="370" height="280" fill="#c8102e" />
          <rect x="0" y="120" width="370" height="40" fill="#ffffff" />
          <rect x="120" y="0" width="40" height="280" fill="#ffffff" />
        </svg>
      </div>

      <div style={{
        position: 'relative',
        maxWidth: 780,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 13,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(0,212,255,0.7)',
          fontFamily: 'var(--font-space, monospace)',
          marginBottom: 10,
        }}>
          Built from Denmark
        </div>
        <h2 style={{
          margin: '0 0 18px',
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: '-0.015em',
          fontFamily: 'var(--font-space, system-ui)',
          color: '#fff',
        }}>
          Digital sovereignty, solo founder, Danish roots.
        </h2>
        <p style={{
          fontSize: 16,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.75)',
          margin: '0 auto',
          maxWidth: 620,
        }}>
          voidexa is independently built and operated by a solo founder. No venture capital, no offshore
          infrastructure, no borrowed stack. Every product runs on our own rails — encrypted, private,
          and built for operators who want their data and their decisions to stay theirs.
        </p>
        <div style={{
          marginTop: 22,
          fontSize: 14,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-space, monospace)',
        }}>
          voidexa · CVR 46343387 · Denmark
        </div>
      </div>
    </section>
  )
}
