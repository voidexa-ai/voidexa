'use client'

import StarMapPage from '@/components/starmap/StarMapPage'
import ShuttleHero from './ShuttleHero'
import ProductPanels from './ProductPanels'
import HomeStats from './HomeStats'
import HomeProducts from './HomeProducts'
import HomeDenmark from './HomeDenmark'
import HomeFooter from './HomeFooter'

// Public homepage composition (Sprint 8): shuttle hero → product panels →
// star map (preserved as Level 2 anchor) → identity sections.
export default function HomePage() {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <ShuttleHero />
      <ProductPanels />

      <section style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <StarMapPage fullscreen={false} />
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
          ↓ More
        </div>
      </section>

      <HomeStats />
      <HomeProducts />
      <HomeDenmark />
      <HomeFooter />
    </div>
  )
}
