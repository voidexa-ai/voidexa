'use client'

import { ALPHA_DB_TO_LABEL, type AlphaTypeDb } from '@/lib/cards/alpha-types'
import type { AlphaRarity } from '@/components/cards/AlphaCardFrame'

export const DECK_SIZE = 60
export const VISIBLE_OPTIONS = [5, 10, 15] as const

export interface DeckBarCard {
  id: string
  name: string
  type: AlphaTypeDb
  rarity: AlphaRarity
  energy_cost: number
}

export default function AlphaDeckBar({
  deckIds,
  cardById,
  deckName,
  visibleCount,
  isPending,
  statusMsg,
  onDeckNameChange,
  onChangeVisible,
  onRemoveAt,
  onSave,
  onNew,
  onDragOver,
  onDrop,
}: {
  deckIds: string[]
  cardById: Map<string, DeckBarCard>
  deckName: string
  visibleCount: number
  isPending: boolean
  statusMsg: string
  onDeckNameChange: (s: string) => void
  onChangeVisible: (n: number) => void
  onRemoveAt: (idx: number) => void
  onSave: () => void
  onNew: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}) {
  const counterColor = deckIds.length === DECK_SIZE ? '#22c55e' : '#fbbf24'

  return (
    <section
      aria-label="Active deck"
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="sticky top-0 z-30 mb-6 rounded-xl border border-zinc-800 bg-zinc-950/90 p-3 backdrop-blur"
    >
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <input
          value={deckName}
          onChange={(e) => onDeckNameChange(e.target.value)}
          aria-label="Deck name"
          className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-base font-semibold"
        />
        <span
          data-testid="deck-counter"
          className="text-base font-mono"
          style={{ color: counterColor }}
        >
          {deckIds.length} / {DECK_SIZE}
        </span>
        <div role="group" aria-label="Visible card slots" className="ml-auto flex gap-1">
          {VISIBLE_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChangeVisible(n)}
              aria-pressed={visibleCount === n}
              className={
                'rounded-full px-3 py-1 text-sm font-semibold ' +
                (visibleCount === n
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800')
              }
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onNew}
          className="rounded-full bg-zinc-900 px-3 py-1 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
        >
          New
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isPending}
          className="rounded-full bg-cyan-500 px-4 py-1 text-sm font-semibold text-zinc-900 hover:bg-cyan-400 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Save deck'}
        </button>
      </div>
      <div
        className="grid gap-1 overflow-x-auto"
        style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}
      >
        {deckIds.length === 0 ? (
          <p className="col-span-full py-4 text-center text-sm opacity-60">
            Drop cards here, or click cards below to add.
          </p>
        ) : (
          deckIds.map((id, idx) => {
            const card = cardById.get(id)
            if (!card) return null
            return (
              <button
                key={`${id}-${idx}`}
                type="button"
                onClick={() => onRemoveAt(idx)}
                aria-label={`Remove ${card.name}`}
                className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-left hover:bg-rose-900/30 hover:border-rose-600"
              >
                <div className="truncate text-sm font-semibold">{card.name}</div>
                <div className="text-xs opacity-70">
                  {ALPHA_DB_TO_LABEL[card.type]} · {card.rarity} · {card.energy_cost}E
                </div>
              </button>
            )
          })
        )}
      </div>
      {statusMsg && (
        <p className="mt-2 text-sm opacity-80" role="status" aria-live="polite">
          {statusMsg}
        </p>
      )}
    </section>
  )
}
