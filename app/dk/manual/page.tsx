import type { Metadata } from 'next'
import ManualLayout from '@/components/manual/ManualLayout'
import ManualLanding from '@/components/manual/ManualLanding'

// AFS-18c - DK shell. UI strings stay English per AFS-26 deferral; only
// metadata is localized for SEO / share previews.

export const metadata: Metadata = {
  title: 'voidexa Spillermanual - Sadan spiller du',
  description:
    '5-etape guide til voidexa-universet og kortkampene: lore, battle mechanics, de 9 korttyper, piloter og en keyword-glossar. UI pa engelsk pr. AFS-26.',
  alternates: {
    canonical: '/dk/manual',
    languages: {
      en: '/manual',
      da: '/dk/manual',
      'x-default': '/manual',
    },
  },
}

export default function ManualLandingPageDk() {
  return (
    <ManualLayout basePath="/dk/manual" currentSlug={null}>
      <ManualLanding basePath="/dk/manual" />
    </ManualLayout>
  )
}
