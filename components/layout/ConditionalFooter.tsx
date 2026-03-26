'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  // Hide footer on homepage and all void-chat routes (chat UI fills viewport)
  if (pathname === '/' || pathname.startsWith('/void-chat')) return null
  return <Footer />
}
