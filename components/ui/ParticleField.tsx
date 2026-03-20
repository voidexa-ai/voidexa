'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  hue: number       // 0=cyan, 1=purple
  pulseOffset: number
  pulseSpeed: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const timeRef   = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []
    const COUNT       = 110
    const CONNECT_DIST = 140
    const REPEL_DIST   = 110
    const REPEL_FORCE  = 0.5

    function resize() {
      canvas!.width  = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }

    function init() {
      resize()
      particles = Array.from({ length: COUNT }, () => ({
        x:           Math.random() * canvas!.width,
        y:           Math.random() * canvas!.height,
        vx:          (Math.random() - 0.5) * 0.45,
        vy:          (Math.random() - 0.5) * 0.45,
        radius:      Math.random() * 1.8 + 0.5,
        opacity:     Math.random() * 0.6 + 0.2,
        hue:         Math.random(),
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed:  0.02 + Math.random() * 0.02,
      }))
    }

    function lerpColor(t: number, time: number) {
      // Cyan (#00d4ff) to purple (#8b5cf6) based on hue + slow time shift
      const shift = (Math.sin(time * 0.0005 + t * Math.PI * 2) + 1) / 2
      const r = Math.round(0   + shift * 139)
      const g = Math.round(212 - shift * 120)
      const b = Math.round(255 - shift * 9)
      return `${r},${g},${b}`
    }

    function draw() {
      timeRef.current++
      const time = timeRef.current
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_DIST && dist > 0) {
          const force = (REPEL_DIST - dist) / REPEL_DIST * REPEL_FORCE
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        p.vx *= 0.978
        p.vy *= 0.978
        p.x  += p.vx
        p.y  += p.vy

        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > canvas!.width)  { p.x = canvas!.width;  p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > canvas!.height) { p.y = canvas!.height; p.vy *= -1 }
      }

      // Draw connections with gradient color
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.22
            const rgbA = lerpColor(a.hue, time)
            const rgbB = lerpColor(b.hue, time)
            const grad = ctx!.createLinearGradient(a.x, a.y, b.x, b.y)
            grad.addColorStop(0, `rgba(${rgbA},${alpha})`)
            grad.addColorStop(1, `rgba(${rgbB},${alpha})`)
            ctx!.beginPath()
            ctx!.strokeStyle = grad
            ctx!.lineWidth = 0.6
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // Draw nodes with pulsing glow
      for (const p of particles) {
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset)
        const r = p.radius * (1 + pulse * 0.3)
        const op = p.opacity * (0.8 + pulse * 0.2)
        const rgb = lerpColor(p.hue, time)

        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4)
        grad.addColorStop(0, `rgba(${rgb},${op})`)
        grad.addColorStop(0.5, `rgba(${rgb},${op * 0.3})`)
        grad.addColorStop(1, `rgba(${rgb},0)`)
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, r * 4, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()

        // Bright core
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${rgb},${op})`
        ctx!.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    function onMouse(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function onLeave() {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    init()
    draw()

    const ro = new ResizeObserver(() => init())
    ro.observe(canvas)
    canvas.addEventListener('mousemove', onMouse)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      canvas.removeEventListener('mousemove', onMouse)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.8 }}
    />
  )
}
