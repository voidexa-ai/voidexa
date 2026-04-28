import type { Metadata } from 'next'
import ManualEtape from '@/components/manual/ManualEtape'
import { ETAPE_META } from '@/lib/manual/etapes'

const SLUG = 'pilots' as const

export const metadata: Metadata = {
  title: `${ETAPE_META[SLUG].title} - voidexa Manual`,
  description: ETAPE_META[SLUG].description,
  alternates: {
    canonical: `/manual/${SLUG}`,
    languages: {
      en: `/manual/${SLUG}`,
      da: `/dk/manual/${SLUG}`,
      'x-default': `/manual/${SLUG}`,
    },
  },
}

export default function PilotsPage() {
  return <ManualEtape slug={SLUG} basePath="/manual" />
}
