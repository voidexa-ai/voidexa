'use client'

export const MAX_DECKS = 5

export interface SavedDeckSlot {
  id: string
  name: string
  card_ids: string[]
  created_at: string
}

export default function AlphaDeckSlots({
  savedDecks,
  activeSlotId,
  isPending,
  onLoad,
  onDelete,
}: {
  savedDecks: SavedDeckSlot[]
  activeSlotId: string | null
  isPending: boolean
  onLoad: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <aside aria-label="Saved decks" className="space-y-3">
      <h2 className="text-base font-semibold">
        Saved decks ({savedDecks.length} / {MAX_DECKS})
      </h2>
      {savedDecks.length === 0 && (
        <p className="rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm opacity-70">
          No saved decks yet. Build a 60-card deck and click Save.
        </p>
      )}
      {savedDecks.map((d) => (
        <div
          key={d.id}
          className={
            'rounded-md border p-3 ' +
            (activeSlotId === d.id
              ? 'border-cyan-500 bg-cyan-950/30'
              : 'border-zinc-800 bg-zinc-950')
          }
        >
          <div className="mb-1 truncate text-sm font-semibold">{d.name}</div>
          <div className="mb-2 text-xs opacity-70">
            {d.card_ids.length} cards · saved{' '}
            {new Date(d.created_at).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onLoad(d.id)}
              disabled={isPending}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              Load
            </button>
            <button
              type="button"
              onClick={() => onDelete(d.id)}
              disabled={isPending}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300 hover:bg-rose-900/40"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </aside>
  )
}
