'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: number
  label: string
  suffix?: string
  prefix?: string
}

// Stats reflect voidexa as of the homepage rebuild. Hardcoded by design:
// these are identity markers, not live metrics. Update in follow-up work
// when the project milestones shift.
const STATS: Stat[] = [
  { value: 7,       label: 'Active products' },
  { value: 153000,  label: 'Lines of code', suffix: '+' },
  { value: 28,      label: 'Days since launch' },
  { value: 342,     label: 'Tests passing',  suffix: '+' },
]

// Counts a numeric target up from 0 with an eased curve once the section
// scrolls into view. Each stat has its own ref so the IntersectionObserver
// triggers per card — useful on mobile where the 2x2 grid splits vertically.
function useCountUp(target: number, run: boolean, duration = 1400) {
  const [count, setCount] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    if (!run) return
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, run, duration])
  return count
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, active)
  const display = stat.value >= 1000 ? count.toLocaleString() : String(count)
  return (
    <div style={{
      flex: '1 1 200px',
      minWidth: 0,
      padding: '30px 24px',
      background: 'linear-gradient(160deg, rgba(14,18,30,0.8), rgba(6,10,18,0.9))',
      border: '1px solid rgba(0,212,255,0.22)',
      borderRadius: 14,
      boxShadow: '0 0 32px rgba(0,212,255,0.08) inset, 0 0 22px rgba(0,212,255,0.05)',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 48,
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: '#00d4ff',
        textShadow: '0 0 18px rgba(0,212,255,0.55)',
        fontFamily: 'var(--font-space, system-ui)',
      }}>
        {stat.prefix ?? ''}{display}{stat.suffix ?? ''}
      </div>
      <div style={{
        marginTop: 6,
        fontSize: 14,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.62)',
        fontFamily: 'var(--font-space, monospace)',
      }}>
        {stat.label}
      </div>
    </div>
  )
}

export default function HomeStats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(true) })
    }, { threshold: 0.25 })
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '80px 24px 40px',
        background: 'linear-gradient(180deg, #02030a 0%, #050813 100%)',
        color: '#fff',
      }}
    >
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
        }}>
          {STATS.map(s => (
            <StatCard key={s.label} stat={s} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}
