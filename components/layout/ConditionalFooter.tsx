'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  // Hide footer on homepage, void-chat, and quantum/chat (full-viewport layouts)
  if (pathname === '/' || pathname.startsWith('/void-chat') || pathname.startsWith('/quantum/chat')) return null
  return <Footer />
}
