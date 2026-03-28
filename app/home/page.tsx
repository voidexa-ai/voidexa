import Hero               from '@/components/sections/home/Hero'
import WhatWeBuild        from '@/components/sections/home/WhatWeBuild'
import Sovereignty        from '@/components/sections/home/Sovereignty'
import FeaturedProduct    from '@/components/sections/home/FeaturedProduct'
import CoreTech           from '@/components/sections/home/CoreTech'
import ClaimPlanetTeaser  from '@/components/sections/home/ClaimPlanetTeaser'
import TeamTeaser          from '@/components/sections/home/TeamTeaser'
import Kcp90Stats         from '@/components/sections/home/Kcp90Stats'

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeBuild />
      <Sovereignty />
      <FeaturedProduct />
      <CoreTech />
      <Kcp90Stats />
      <TeamTeaser />
      <ClaimPlanetTeaser />
    </>
  )
}
