'use client'

import { useEffect, useRef } from 'react'

export default function CSSStarfield() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const frag = document.createDocumentFragment()
    const count = 220

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div')
      const x = Math.random() * 100
      const y = Math.random() * 100
      const r = Math.random()
      const size = r < 0.7 ? 1 : r < 0.92 ? 1.5 : 2.5
      const dur = 2.5 + Math.random() * 4
      const delay = Math.random() * 7
      const opacity = 0.25 + Math.random() * 0.6

      star.style.cssText = `
        position:absolute;
        left:${x}%;top:${y}%;
        width:${size}px;height:${size}px;
        background:white;border-radius:50%;
        opacity:${opacity};
        animation:sm-twinkle ${dur}s ${delay}s ease-in-out infinite alternate;
        will-change:opacity;
      `
      frag.appendChild(star)
    }
    container.appendChild(frag)
  }, [])

  return (
    <>
      <style>{`
        @keyframes sm-twinkle {
          from { opacity: 0.05; }
          to   { opacity: 0.9; }
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 40% 50%, #0d0419 0%, #07070d 60%, #060510 100%)',
          overflow: 'hidden',
        }}
      />
    </>
  )
}
