// components/manual/ManualEtape.tsx
//
// AFS-18c - Etape page renderer. Reads the slug's markdown file, strips
// the shared H1, applies cross-link substitution for the 'cards' slug
// only, then composes layout + header + markdown content.

import {
  ETAPE_META,
  ETAPE_ORDER,
  type EtapeSlug,
} from '@/lib/manual/etapes'
import { loadEtapeMarkdown } from '@/lib/manual/load-markdown'
import { injectTypeCrossLinks } from '@/lib/manual/cross-links'
import ManualLayout from './ManualLayout'
import ManualContent from './ManualContent'

interface Props {
  slug: EtapeSlug
  basePath: string
}

export default function ManualEtape({ slug, basePath }: Props) {
  const meta = ETAPE_META[slug]
  let markdown = loadEtapeMarkdown(meta.file)
  if (slug === 'cards') {
    markdown = injectTypeCrossLinks(markdown)
  }

  const etapeNumber = ETAPE_ORDER.indexOf(slug) + 1

  return (
    <ManualLayout basePath={basePath} currentSlug={slug}>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-60">
          Etape {etapeNumber} of {ETAPE_ORDER.length}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {meta.title}
        </h1>
        <p className="mt-2 text-base opacity-80">{meta.description}</p>
      </header>
      <ManualContent markdown={markdown} />
    </ManualLayout>
  )
}
