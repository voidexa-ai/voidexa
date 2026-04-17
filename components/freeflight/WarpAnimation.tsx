'use client'

import { useEffect, useState } from 'react'

interface Props {
  destinationName: string
  onComplete: () => void
}

const DURATION_MS = 2000

export default function WarpAnimation({ destinationName, onComplete }: Props) {
  const [phase, setPhase] = useState<'starting' | 'mid' | 'ending'>('starting')

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('mid'), 400)
    const t2 = window.setTimeout(() => setPhase('ending'), 1500)
    const t3 = window.setTimeout(() => onComplete(), DURATION_MS)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <div style={{
      ...S.wrap,
      background: phase === 'starting'
        ? 'rgba(6,10,20,0.3)'
        : phase === 'mid'
          ? 'rgba(200,230,255,0.95)'
          : 'rgba(6,10,20,0.85)',
      transition: 'background 0.4s ease-out',
    }}>
      <div style={{
        ...S.label,
        opacity: phase === 'mid' ? 0 : 1,
        color: phase === 'ending' ? '#fff' : '#e8f4ff',
      }}>
        <div style={S.eyebrow}>WARPING TO</div>
        <div style={S.name}>{destinationName}</div>
      </div>
      <div style={{
        ...S.streaks,
        opacity: phase === 'starting' ? 0.3 : phase === 'mid' ? 1 : 0.3,
      }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            style={{
              ...S.streak,
              left: `${(i * 13) % 100}%`,
              top: `${(i * 29) % 100}%`,
              animation: phase === 'mid' ? `warpStreak 0.6s linear infinite` : undefined,
              animationDelay: `${(i % 10) * 0.05}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes warpStreak {
          0% { transform: translateX(-150px) scaleX(0.3); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(150px) scaleX(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    backdropFilter: 'blur(4px)',
  },
  label: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    transition: 'opacity 0.3s',
    fontFamily: 'var(--font-sans)',
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: 6,
  },
  name: {
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    textShadow: '0 0 20px rgba(0,212,255,0.65)',
  },
  streaks: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    transition: 'opacity 0.4s',
  },
  streak: {
    position: 'absolute',
    width: 80,
    height: 2,
    background: 'linear-gradient(to right, transparent, #7fd8ff, transparent)',
    boxShadow: '0 0 8px #7fd8ff',
  },
}
