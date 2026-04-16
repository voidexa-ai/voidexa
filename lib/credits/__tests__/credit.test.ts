import { describe, it, expect, vi, beforeEach } from 'vitest'
import { creditGhai } from '../credit'

// Mock the supabase client used by credit.ts. We stub the fluent chain so we
// can assert behaviour without hitting the real DB. `insert` is the first call
// in `creditGhai` — its outcome determines the rest of the branching.
type InsertResult = { error: { message: string; code?: string } | null }

const insertFn = vi.fn<(payload: unknown) => Promise<InsertResult>>()
const selectFn = vi.fn()
const updateFn = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (_table: string) => ({
      insert: (payload: unknown) => insertFn(payload),
      select: () => ({
        eq: () => ({ maybeSingle: () => selectFn() }),
      }),
      update: () => ({ eq: () => updateFn() }),
    }),
  },
}))

beforeEach(() => {
  insertFn.mockReset()
  selectFn.mockReset()
  updateFn.mockReset()
})

describe('creditGhai input validation', () => {
  it('rejects missing userId', async () => {
    const r = await creditGhai('', 50, { source: 'mission', sourceId: 'mx' })
    expect(r.ok).toBe(false)
    expect(r.error).toContain('userId')
    expect(insertFn).not.toHaveBeenCalled()
  })

  it('rejects zero or negative amounts', async () => {
    const a = await creditGhai('u1', 0, { source: 'mission', sourceId: 'mx' })
    const b = await creditGhai('u1', -10, { source: 'mission', sourceId: 'mx' })
    expect(a.ok).toBe(false); expect(a.error).toContain('positive')
    expect(b.ok).toBe(false); expect(b.error).toContain('positive')
    expect(insertFn).not.toHaveBeenCalled()
  })

  it('rejects non-finite amounts', async () => {
    const r = await creditGhai('u1', Number.NaN, { source: 'mission', sourceId: 'mx' })
    expect(r.ok).toBe(false)
    expect(insertFn).not.toHaveBeenCalled()
  })

  it('rejects missing sourceId', async () => {
    const r = await creditGhai('u1', 50, { source: 'mission', sourceId: '' })
    expect(r.ok).toBe(false)
    expect(r.error).toContain('sourceId')
    expect(insertFn).not.toHaveBeenCalled()
  })
})

describe('creditGhai idempotency', () => {
  it('treats unique_violation (23505) as already-credited, not an error', async () => {
    insertFn.mockResolvedValueOnce({ error: { message: 'duplicate key', code: '23505' } })
    const r = await creditGhai('u1', 50, { source: 'mission', sourceId: 'm1' })
    expect(r.ok).toBe(true)
    expect(r.alreadyCredited).toBe(true)
    // Should not read/update user_credits on dup.
    expect(selectFn).not.toHaveBeenCalled()
    expect(updateFn).not.toHaveBeenCalled()
  })

  it('surfaces non-idempotency insert errors', async () => {
    insertFn.mockResolvedValueOnce({ error: { message: 'bad fk', code: '23503' } })
    const r = await creditGhai('u1', 50, { source: 'mission', sourceId: 'm1' })
    expect(r.ok).toBe(false)
    expect(r.error).toContain('bad fk')
  })
})

describe('creditGhai balance updates', () => {
  it('creates a user_credits row on first credit (no existing row)', async () => {
    insertFn.mockResolvedValueOnce({ error: null })         // ledger insert ok
    selectFn.mockResolvedValueOnce({ data: null, error: null }) // no existing row
    insertFn.mockResolvedValueOnce({ error: null })         // fresh user_credits row insert
    const r = await creditGhai('u1', 25, { source: 'battle', sourceId: 'b1' })
    expect(r.ok).toBe(true)
    expect(r.alreadyCredited).toBe(false)
    expect(r.newBalance).toBe(25)
    // Two inserts total: ledger + user_credits row.
    expect(insertFn).toHaveBeenCalledTimes(2)
  })

  it('increments existing balance by amount', async () => {
    insertFn.mockResolvedValueOnce({ error: null })
    selectFn.mockResolvedValueOnce({ data: { ghai_balance_platform: 100 }, error: null })
    updateFn.mockResolvedValueOnce({ error: null })
    const r = await creditGhai('u1', 50, { source: 'speedrun', sourceId: 's1' })
    expect(r.ok).toBe(true)
    expect(r.newBalance).toBe(150)
    expect(updateFn).toHaveBeenCalledTimes(1)
  })
})
