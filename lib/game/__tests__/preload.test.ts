import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_PRELOAD_MANIFEST,
  PreloadProgress,
  getDefaultPreloadManifest,
  preloadGameAssets,
  resetPreloadCacheForTests,
} from '../preload'

const originalFetch = globalThis.fetch
const originalImage = (globalThis as { Image?: typeof Image }).Image

class StubImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  set src(_v: string) {
    queueMicrotask(() => this.onload && this.onload())
  }
}

const originalWindow = (globalThis as { window?: unknown }).window

beforeEach(() => {
  resetPreloadCacheForTests()
  globalThis.fetch = vi.fn(async () => new Response('', { status: 200 })) as typeof fetch
  ;(globalThis as { Image?: typeof Image }).Image = StubImage as unknown as typeof Image
  ;(globalThis as { window?: unknown }).window = globalThis
})

afterEach(() => {
  resetPreloadCacheForTests()
  globalThis.fetch = originalFetch
  if (originalImage) (globalThis as { Image?: typeof Image }).Image = originalImage
  else delete (globalThis as { Image?: typeof Image }).Image
  if (originalWindow === undefined) {
    delete (globalThis as { window?: unknown }).window
  } else {
    ;(globalThis as { window?: unknown }).window = originalWindow
  }
})

describe('preloadGameAssets', () => {
  it('exposes the default manifest copy (immutable)', () => {
    const a = getDefaultPreloadManifest()
    const b = getDefaultPreloadManifest()
    expect(a).not.toBe(b)
    expect(a).toEqual(DEFAULT_PRELOAD_MANIFEST)
  })

  it('resolves and emits progress to 1 across the manifest', async () => {
    const events: PreloadProgress[] = []
    await preloadGameAssets(DEFAULT_PRELOAD_MANIFEST, (p) => events.push(p))
    expect(events.length).toBe(DEFAULT_PRELOAD_MANIFEST.length)
    expect(events[events.length - 1].pct).toBe(1)
  })

  it('coalesces concurrent calls into a single in-flight promise', async () => {
    const fetchSpy = globalThis.fetch as unknown as ReturnType<typeof vi.fn>
    await Promise.all([
      preloadGameAssets([{ url: '/x.json', kind: 'json' }]),
      preloadGameAssets([{ url: '/y.json', kind: 'json' }]),
    ])
    // Only the first call's manifest should have triggered fetches
    expect(fetchSpy.mock.calls.length).toBeLessThanOrEqual(1)
  })

  it('does not throw when fetch rejects', async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error('offline')
    }) as typeof fetch
    await expect(
      preloadGameAssets([{ url: '/missing.json', kind: 'json' }]),
    ).resolves.toBeUndefined()
  })
})
