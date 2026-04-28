// components/manual/ManualLayout.tsx
//
// AFS-18c - Manual page shell: sidebar (left, sticky on md+) + article
// (right, max-w-3xl for readable line length). Server component.

import ManualSidebar from './ManualSidebar'
import type { EtapeSlug } from '@/lib/manual/etapes'

interface Props {
  basePath: string
  currentSlug: EtapeSlug | null
  children: React.ReactNode
}

export default function ManualLayout({
  basePath,
  currentSlug,
  children,
}: Props) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-zinc-100">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <ManualSidebar basePath={basePath} currentSlug={currentSlug} />
        <article className="min-w-0 max-w-3xl">{children}</article>
      </div>
    </main>
  )
}
