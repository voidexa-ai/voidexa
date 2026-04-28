// components/manual/ManualLanding.tsx
//
// AFS-18c - /manual landing content: overview + 5 etape cards.
// Composed inside ManualLayout by the route page.

import Link from 'next/link'
import { ETAPE_META, ETAPE_ORDER } from '@/lib/manual/etapes'

export default function ManualLanding({ basePath }: { basePath: string }) {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          voidexa User Manual
        </h1>
        <p className="mt-2 max-w-2xl text-base opacity-80">
          5-etape guide to the voidexa universe and card battle. Read in any
          order - each etape is self-contained. The 9 card types in etape 3
          link directly into the live catalog at /cards.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {ETAPE_ORDER.map((slug, i) => {
          const meta = ETAPE_META[slug]
          return (
            <Link
              key={slug}
              href={`${basePath}/${slug}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
            >
              <p className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Etape {i + 1}
              </p>
              <h2 className="mt-1 text-xl font-semibold group-hover:text-cyan-300">
                {meta.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed opacity-75">
                {meta.description}
              </p>
            </Link>
          )
        })}
      </div>
    </>
  )
}
