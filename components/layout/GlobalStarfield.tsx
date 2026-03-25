'use client'

import { usePathname } from 'next/navigation'
import ParticleField from '@/components/ui/ParticleField'

export default function GlobalStarfield() {
  const pathname = usePathname()
  // Star map homepage (/) has its own R3F nebula — skip there
  if (pathname === '/') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <ParticleField />
    </div>
  )
}
