import type { Metadata } from 'next'
import ManualEtape from '@/components/manual/ManualEtape'
import { ETAPE_META } from '@/lib/manual/etapes'

const SLUG = 'glossary' as const

// AFS-18c - DK shell, EN content per AFS-26.
export const metadata: Metadata = {
  title: `${ETAPE_META[SLUG].title} - voidexa Spillermanual`,
  description: ETAPE_META[SLUG].description,
  alternates: {
    canonical: `/dk/manual/${SLUG}`,
    languages: {
      en: `/manual/${SLUG}`,
      da: `/dk/manual/${SLUG}`,
      'x-default': `/manual/${SLUG}`,
    },
  },
}

export default function GlossaryPageDk() {
  return <ManualEtape slug={SLUG} basePath="/dk/manual" />
}
