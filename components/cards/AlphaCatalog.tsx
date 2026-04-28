'use client'

/**
 * components/cards/AlphaCatalog.tsx
 *
 * AFS-6d — Client renderer for /cards/alpha. Server pages handle searchParam
 * validation and Supabase fetch; this component receives the page slice plus
 * pagination metadata and renders 9 type tabs + a 20-per-page card grid.
 *
 * Distinct from V3 catalog at components/combat/CardCollection.tsx.
 */

import Link from 'next/link'
import AlphaCardFrame, {
  type AlphaCardType,
  type AlphaRarity,
} from '@/components/cards/AlphaCardFrame'
import {
  ALPHA_DB_TO_LABEL,
  ALPHA_PAGE_SIZE,
  VALID_ALPHA_TYPES,
  type AlphaTypeDb,
} from '@/lib/cards/alpha-types'
import { getAlphaCardImageUrl } from '@/lib/cards/alpha-image-url'

export interface AlphaCatalogCard {
  id: string
  type: AlphaTypeDb
  name: string
  energy_cost: number
  attack: number | null
  defense: number | null
  rarity: AlphaRarity
  archetype: string | null
  effect_text: string
  flavor_text: string | null
  keywords: string[]
  extras: Record<string, unknown>
}

interface Props {
  activeType: AlphaTypeDb
  currentPage: number
  totalPages: number
  totalCount: number
  cards: AlphaCatalogCard[]
  basePath?: string
}

export default function AlphaCatalog({
  activeType,
  currentPage,
  totalPages,
  totalCount,
  cards,
  basePath = '/cards/alpha',
}: Props) {
  const activeLabel = ALPHA_DB_TO_LABEL[activeType]

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-zinc-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Alpha Card Library
        </h1>
        <p className="mt-2 text-base opacity-80">
          1000 cards across 9 types and 6 rarities — the premium voidexa set.
          Cards shown {ALPHA_PAGE_SIZE} per page.
        </p>
      </header>

      <nav
        aria-label="Card type filter"
        className="mb-8 flex flex-wrap gap-2 border-b border-zinc-800 pb-3"
      >
        {VALID_ALPHA_TYPES.map((dbType) => {
          const isActive = dbType === activeType
          return (
            <Link
              key={dbType}
              href={`${basePath}?type=${dbType}&page=1`}
              aria-current={isActive ? 'page' : undefined}
              className={
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors ' +
                (isActive
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800')
              }
            >
              {ALPHA_DB_TO_LABEL[dbType]}
            </Link>
          )
        })}
      </nav>

      <p className="mb-6 text-sm opacity-70">
        Showing {cards.length} of {totalCount} {activeLabel} cards — page{' '}
        {currentPage} of {totalPages}
      </p>

      {cards.length === 0 ? (
        <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center text-base opacity-70">
          No cards match this filter yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <AlphaCardFrame
              key={card.id}
              rarity={card.rarity}
              type={ALPHA_DB_TO_LABEL[card.type] as AlphaCardType}
              name={card.name}
              energy_cost={card.energy_cost}
              attack={card.attack ?? undefined}
              defense={card.defense ?? undefined}
              effect_text={card.effect_text}
              flavor_text={card.flavor_text ?? ''}
              imageUrl={getAlphaCardImageUrl(card.id, card.rarity)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          basePath={basePath}
          activeType={activeType}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </main>
  )
}

function Pagination({
  basePath,
  activeType,
  currentPage,
  totalPages,
}: {
  basePath: string
  activeType: AlphaTypeDb
  currentPage: number
  totalPages: number
}) {
  const href = (p: number) =>
    `${basePath}?type=${activeType}&page=${p}`

  // Compact page list: 1, current-1, current, current+1, last (with ellipsis).
  const pages: Array<number | 'ellipsis'> = []
  const add = (n: number) => {
    if (!pages.includes(n) && n >= 1 && n <= totalPages) pages.push(n)
  }
  add(1)
  if (currentPage - 1 > 2) pages.push('ellipsis')
  add(currentPage - 1)
  add(currentPage)
  add(currentPage + 1)
  if (currentPage + 1 < totalPages - 1) pages.push('ellipsis')
  add(totalPages)

  return (
    <nav
      aria-label="Catalog pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <PageLink
        href={href(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        label="Previous page"
      >
        ←
      </PageLink>
      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span
            key={`e${idx}`}
            aria-hidden="true"
            className="px-2 text-sm opacity-60"
          >
            …
          </span>
        ) : (
          <PageLink
            key={p}
            href={href(p)}
            active={p === currentPage}
            label={`Page ${p}`}
          >
            {p}
          </PageLink>
        ),
      )}
      <PageLink
        href={href(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        label="Next page"
      >
        →
      </PageLink>
    </nav>
  )
}

function PageLink({
  href,
  children,
  active = false,
  disabled = false,
  label,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  label: string
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={`${label} (disabled)`}
        className="cursor-not-allowed rounded-full bg-zinc-900 px-3 py-1 text-sm opacity-40"
      >
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={
        'rounded-full px-3 py-1 text-sm font-semibold transition-colors ' +
        (active
          ? 'bg-zinc-100 text-zinc-900'
          : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800')
      }
    >
      {children}
    </Link>
  )
}
