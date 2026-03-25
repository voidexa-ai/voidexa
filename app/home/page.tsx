import Hero            from '@/components/sections/home/Hero'
import WhatWeBuild     from '@/components/sections/home/WhatWeBuild'
import Sovereignty     from '@/components/sections/home/Sovereignty'
import FeaturedProduct from '@/components/sections/home/FeaturedProduct'
import CoreTech        from '@/components/sections/home/CoreTech'

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeBuild />
      <Sovereignty />
      <FeaturedProduct />
      <CoreTech />
    </>
  )
}
