'use client'

import { Hero } from './components/Hero'
import { WhatYouGet } from './components/WhatYouGet'
import { Ecosystem } from './components/Ecosystem'
import { PioneerRewards } from './components/PioneerRewards'
import { PioneerSlots } from './components/PioneerSlots'
import { Pricing } from './components/Pricing'
import { GravityScore } from './components/GravityScore'
import { InterPlanetCommerce } from './components/InterPlanetCommerce'
import { Governance } from './components/Governance'
import { WhyJoinEarly } from './components/WhyJoinEarly'
import { CTA } from './components/CTA'

export default function ClaimYourPlanetPage() {
  return (
    <>
      <style>{`
        @keyframes shimmer { to { background-position: 200% center } }
        @keyframes cyanPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(0,212,255,0.18), 0 0 30px rgba(0,212,255,0.06); }
          50% { box-shadow: 0 0 24px rgba(0,212,255,0.4), 0 0 60px rgba(0,212,255,0.12); }
        }
      `}</style>

      <div style={{ paddingTop: 90 }}>
        <Hero />
        <WhatYouGet />
        <Ecosystem />
        <PioneerRewards />
        <PioneerSlots />
        <Pricing />
        <GravityScore />
        <InterPlanetCommerce />
        <Governance />
        <WhyJoinEarly />
        <CTA />
      </div>
    </>
  )
}
