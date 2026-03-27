import Hero               from '@/components/sections/home/Hero'
import WhatWeBuild        from '@/components/sections/home/WhatWeBuild'
import Sovereignty        from '@/components/sections/home/Sovereignty'
import FeaturedProduct    from '@/components/sections/home/FeaturedProduct'
import CoreTech           from '@/components/sections/home/CoreTech'
import ClaimPlanetTeaser  from '@/components/sections/home/ClaimPlanetTeaser'
import MeetTheTeam        from '@/components/sections/home/MeetTheTeam'

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeBuild />
      <Sovereignty />
      <FeaturedProduct />
      <CoreTech />
      <MeetTheTeam />
      <ClaimPlanetTeaser />
    </>
  )
}
