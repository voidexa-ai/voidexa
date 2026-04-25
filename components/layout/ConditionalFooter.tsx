'use client'

import { usePathname } from 'next/navigation'
import { stripLocale } from '@/lib/i18n/locale'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = stripLocale(usePathname() ?? '/')
  // Hide footer on homepage, full-viewport 3D scenes (freeflight, assembly,
  // galaxy views), and chat surfaces. The homepage renders its own inline
  // footer; galaxy views show a subtle in-scene CVR marker instead so the
  // large company footer doesn't compete with the 3D scene.
  if (
    pathname === '/' ||
    pathname === '/freeflight' ||
    pathname === '/assembly-editor' ||
    pathname === '/starmap' ||
    pathname.startsWith('/starmap/') ||
    pathname.startsWith('/void-chat') ||
    pathname.startsWith('/quantum/chat') ||
    pathname.startsWith('/game/battle')
  ) return null
  return <Footer />
}
