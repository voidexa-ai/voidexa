// components/manual/ManualSidebar.tsx
//
// AFS-18c - Sticky-on-md+ sidebar listing the 5 etapes plus the
// landing-page "Overview" link. Server component - active-state is
// derived from the currentSlug prop passed in by the parent page.
// Mobile: rendered above the article (no JS toggle in v1).

import Link from 'next/link'
import { ETAPE_META, ETAPE_ORDER, type EtapeSlug } from '@/lib/manual/etapes'

interface Props {
  basePath: string
  currentSlug: EtapeSlug | null
}

export default function ManualSidebar({ basePath, currentSlug }: Props) {
  return (
    <aside
      aria-label="Manual navigation"
      className="md:sticky md:top-24 md:self-start"
    >
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider opacity-60">
        Voidexa Manual
      </p>
      <nav className="flex flex-col gap-1">
        <SidebarLink
          href={basePath}
          label="Overview"
          active={currentSlug === null}
        />
        {ETAPE_ORDER.map((slug, i) => (
          <SidebarLink
            key={slug}
            href={`${basePath}/${slug}`}
            label={`${i + 1}. ${ETAPE_META[slug].title}`}
            active={currentSlug === slug}
          />
        ))}
      </nav>
    </aside>
  )
}

function SidebarLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={
        'rounded-md px-3 py-2 text-sm font-medium transition-colors ' +
        (active
          ? 'bg-zinc-800 text-zinc-100'
          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100')
      }
    >
      {label}
    </Link>
  )
}
