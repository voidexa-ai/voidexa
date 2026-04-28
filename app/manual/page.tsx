import type { Metadata } from 'next'
import ManualLayout from '@/components/manual/ManualLayout'
import ManualLanding from '@/components/manual/ManualLanding'

export const metadata: Metadata = {
  title: 'voidexa User Manual - How to Play',
  description:
    '5-etape guide to the voidexa universe and card battle: lore, battle mechanics, the 9 card types, pilots, and a keyword glossary.',
  alternates: {
    canonical: '/manual',
    languages: {
      en: '/manual',
      da: '/dk/manual',
      'x-default': '/manual',
    },
  },
}

export default function ManualLandingPage() {
  return (
    <ManualLayout basePath="/manual" currentSlug={null}>
      <ManualLanding basePath="/manual" />
    </ManualLayout>
  )
}
