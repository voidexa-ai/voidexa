'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  durationMs?: number
  onComplete: (collisions: number) => void
}

interface Rock {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

const SHIP_HITBOX = 28
const ROCK_COUNT = 7

/**
 * 2D dodge minigame as an encounter overlay — WASD / arrow keys move the
 * reticle in the frame while rocks drift. Collision increments a counter.
 * After durationMs, report total collisions to the caller.
 */
export default function DebrisFieldMinigame({ durationMs = 10_000, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shipPos = useRef({ x: 240, y: 180 })
  const keys = useRef<Record<string, boolean>>({})
  const rocks = useRef<Rock[]>([])
  const collisions = useRef(0)
  const collisionFlashRef = useRef(0)
  const lastHitTime = useRef(0)
  const [remaining, setRemaining] = useState(durationMs)
  const [hits, setHits] = useState(0)

  useEffect(() => {
    // Init rocks with random velocities.
    const init: Rock[] = []
    for (let i = 0; i < ROCK_COUNT; i++) {
      init.push({
        id: i,
        x: Math.random() * 480,
        y: Math.random() * 320,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120,
        size: 18 + Math.random() * 24,
      })
    }
    rocks.current = init

    const down = (e: KeyboardEvent) => { keys.current[e.code] = true }
    const up = (e: KeyboardEvent) => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    const startedAt = performance.now()
    let lastTs = startedAt
    let raf = 0

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000)
      lastTs = now
      const elapsed = now - startedAt
      setRemaining(Math.max(0, durationMs - elapsed))

      const W = 480, H = 320
      const pos = shipPos.current
      const speed = 200
      if (keys.current['KeyW'] || keys.current['ArrowUp']) pos.y -= speed * dt
      if (keys.current['KeyS'] || keys.current['ArrowDown']) pos.y += speed * dt
      if (keys.current['KeyA'] || keys.current['ArrowLeft']) pos.x -= speed * dt
      if (keys.current['KeyD'] || keys.current['ArrowRight']) pos.x += speed * dt
      pos.x = Math.max(20, Math.min(W - 20, pos.x))
      pos.y = Math.max(20, Math.min(H - 20, pos.y))

      // Move rocks, bounce off walls.
      rocks.current.forEach(r => {
        r.x += r.vx * dt
        r.y += r.vy * dt
        if (r.x < r.size / 2) { r.x = r.size / 2; r.vx *= -1 }
        if (r.x > W - r.size / 2) { r.x = W - r.size / 2; r.vx *= -1 }
        if (r.y < r.size / 2) { r.y = r.size / 2; r.vy *= -1 }
        if (r.y > H - r.size / 2) { r.y = H - r.size / 2; r.vy *= -1 }

        const dx = r.x - pos.x
        const dy = r.y - pos.y
        if (Math.sqrt(dx * dx + dy * dy) < (r.size / 2 + SHIP_HITBOX / 2)) {
          if (now - lastHitTime.current > 600) {
            lastHitTime.current = now
            collisions.current += 1
            setHits(collisions.current)
            collisionFlashRef.current = 1
          }
        }
      })

      // Draw.
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#05030f'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = 'rgba(0,212,255,0.05)'
        for (let x = 0; x < W; x += 40) {
          ctx.fillRect(x, 0, 1, H)
        }
        for (let y = 0; y < H; y += 40) {
          ctx.fillRect(0, y, W, 1)
        }
        rocks.current.forEach(r => {
          ctx.fillStyle = '#7a7aa0'
          ctx.beginPath()
          ctx.arc(r.x, r.y, r.size / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#af52de'
          ctx.lineWidth = 1.5
          ctx.stroke()
        })
        const flashOpacity = Math.max(0, collisionFlashRef.current)
        if (flashOpacity > 0) {
          ctx.fillStyle = `rgba(255,107,107,${flashOpacity * 0.4})`
          ctx.fillRect(0, 0, W, H)
          collisionFlashRef.current *= 0.9
        }
        ctx.fillStyle = '#00d4ff'
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, SHIP_HITBOX / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      if (elapsed >= durationMs) {
        onComplete(collisions.current)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      cancelAnimationFrame(raf)
    }
  }, [durationMs, onComplete])

  return (
    <div style={S.wrap}>
      <div style={S.panel}>
        <div style={S.header}>
          <span style={S.eyebrow}>Navigation · Debris Field</span>
          <span style={S.timer}>{(remaining / 1000).toFixed(1)}s</span>
          <span style={S.hits}>Hits: <b style={{ color: hits > 0 ? '#ff6b6b' : '#fff' }}>{hits}</b></span>
        </div>
        <canvas ref={canvasRef} width={480} height={320} style={S.canvas} />
        <div style={S.hint}>WASD / Arrows — dodge the rocks. Each hit costs speed and cargo.</div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: { position: 'fixed', inset: 0, background: 'rgba(2,1,10,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 },
  panel: { padding: 22, borderRadius: 16, background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))', border: '1px solid rgba(0,212,255,0.35)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', color: '#e8e4f0', fontFamily: 'var(--font-sans)' },
  header: { display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', color: '#00d4ff', textTransform: 'uppercase', flex: 1 },
  timer: { fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono), Consolas, monospace' },
  hits: { fontSize: 13, color: 'rgba(220,216,230,0.8)' },
  canvas: { display: 'block', borderRadius: 10, border: '1px solid rgba(127,119,221,0.3)' },
  hint: { marginTop: 10, fontSize: 13, color: 'rgba(220,216,230,0.7)', textAlign: 'center' },
}
