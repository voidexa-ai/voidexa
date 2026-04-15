'use client'

import { usePathname } from 'next/navigation'
import { stripLocale } from '@/lib/i18n/locale'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = stripLocale(usePathname() ?? '/')
  // Hide footer on homepage, void-chat, and quantum/chat (full-viewport layouts)
  if (pathname === '/' || pathname === '/freeflight' || pathname.startsWith('/void-chat') || pathname.startsWith('/quantum/chat')) return null
  return <Footer />
}
