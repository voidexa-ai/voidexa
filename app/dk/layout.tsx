import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'voidexa — Suveræn AI-infrastruktur',
    template: '%s',
  },
  description:
    'voidexa bygger AI-drevne handelssystemer, krypteret kommunikation og intelligente automatiseringsværktøjer. Teknologi der tænker, tilpasser sig og eksekverer.',
  alternates: {
    canonical: '/dk',
    languages: {
      'en': '/',
      'da': '/dk',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'voidexa — Suveræn AI-infrastruktur',
    description: 'Intelligente systemer der arbejder for dig',
    type: 'website',
    locale: 'da_DK',
  },
}

export default function DanishLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
