'use client'

import StarMapPage from '@/components/starmap/StarMapPage'
import HomeStats from './HomeStats'
import HomeProducts from './HomeProducts'
import HomeDenmark from './HomeDenmark'
import HomeFooter from './HomeFooter'

// Public homepage composition. Star-map hero (100vh) then below-the-fold
// identity sections. StarMapPage renders non-fullscreen so the page scrolls.
export default function HomePage() {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <section style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <StarMapPage fullscreen={false} />
        {/* Scroll cue — subtle chevron bumped up from bottom so it doesn't
            overlap the existing HUD hint. */}
        <div style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          color: 'rgba(0,212,255,0.5)',
          fontSize: 14,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-space, monospace)',
          pointerEvents: 'none',
          textShadow: '0 0 10px rgba(0,212,255,0.6)',
        }}>
          ↓ Scroll
        </div>
      </section>

      <HomeStats />
      <HomeProducts />
      <HomeDenmark />
      <HomeFooter />
    </div>
  )
}
