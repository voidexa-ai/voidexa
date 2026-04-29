'use client'

import { usePathname } from 'next/navigation'
import ParticleField from '@/components/ui/ParticleField'

export default function GlobalStarfield() {
  const pathname = usePathname()
  // Skip on routes that have their own self-contained background:
  // - '/' (homepage R3F nebula)
  // - '/starmap' (galaxy view) and '/starmap/voidexa' (system view) — AFS-10-FIX-5:
  //   both views render NebulaBg + planet textures and must not be tinted by the
  //   global gradients / ParticleField overlay.
  if (pathname === '/' || pathname === '/starmap' || pathname.startsWith('/starmap/')) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      {/* Deep space base gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(20,10,50,0.7) 0%, rgba(7,7,13,0.95) 55%, #07070d 100%)',
      }} />
      {/* Subtle nebula accent — top right */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 85% 15%, rgba(0,100,180,0.07) 0%, transparent 70%)',
      }} />
      {/* Subtle nebula accent — bottom left */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 50% 35% at 10% 85%, rgba(80,0,140,0.06) 0%, transparent 70%)',
      }} />
      {/* Particle starfield */}
      <ParticleField />
    </div>
  )
}
