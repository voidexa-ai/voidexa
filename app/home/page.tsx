import Hero               from '@/components/sections/home/Hero'
import HomeCtas           from '@/components/sections/home/HomeCtas'
import WhatWeBuild        from '@/components/sections/home/WhatWeBuild'
import Sovereignty        from '@/components/sections/home/Sovereignty'
import FeaturedProduct    from '@/components/sections/home/FeaturedProduct'
import CoreTech           from '@/components/sections/home/CoreTech'
import Kcp90Stats         from '@/components/sections/home/Kcp90Stats'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeCtas />
      <WhatWeBuild />
      <Sovereignty />
      <FeaturedProduct />
      <CoreTech />
      <Kcp90Stats />
    </>
  )
}
