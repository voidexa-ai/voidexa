import Hero            from '@/components/sections/home/Hero'
import WhatWeBuild     from '@/components/sections/home/WhatWeBuild'
import Sovereignty     from '@/components/sections/home/Sovereignty'
import FeaturedProduct from '@/components/sections/home/FeaturedProduct'

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeBuild />
      <Sovereignty />
      <FeaturedProduct />
    </>
  )
}
