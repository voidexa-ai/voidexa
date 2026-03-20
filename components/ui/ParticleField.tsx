'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []
    const COUNT = 80
    const CONNECT_DIST = 120
    const REPEL_DIST   = 100
    const REPEL_FORCE  = 0.4

    function resize() {
      canvas!.width  = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }

    function init() {
      resize()
      particles = Array.from({ length: COUNT }, () => ({
        x:       Math.random() * canvas!.width,
        y:       Math.random() * canvas!.height,
        vx:      (Math.random() - 0.5) * 0.4,
        vy:      (Math.random() - 0.5) * 0.4,
        radius:  Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      }))
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Update positions + mouse repulsion
      for (const p of particles) {
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_DIST && dist > 0) {
          const force = (REPEL_DIST - dist) / REPEL_DIST * REPEL_FORCE
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        p.vx *= 0.98
        p.vy *= 0.98
        p.x  += p.vx
        p.y  += p.vy

        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > canvas!.width)  { p.x = canvas!.width;  p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > canvas!.height) { p.y = canvas!.height; p.vy *= -1 }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.25
            const grad = ctx!.createLinearGradient(a.x, a.y, b.x, b.y)
            grad.addColorStop(0, `rgba(0,212,255,${alpha})`)
            grad.addColorStop(1, `rgba(139,92,246,${alpha})`)
            ctx!.beginPath()
            ctx!.strokeStyle = grad
            ctx!.lineWidth = 0.5
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // Draw nodes
      for (const p of particles) {
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
        grad.addColorStop(0, `rgba(0,212,255,${p.opacity})`)
        grad.addColorStop(1, 'rgba(0,212,255,0)')
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = grad
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
    window.addEventListener('resize', () => { init() })
    canvas.addEventListener('mousemove', onMouse)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousemove', onMouse)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  )
}
