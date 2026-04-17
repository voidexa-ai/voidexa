'use client'

export interface PreloadEntry {
  url: string
  kind: 'model' | 'image' | 'audio' | 'json'
}

export interface PreloadProgress {
  loaded: number
  total: number
  pct: number
}

export const DEFAULT_PRELOAD_MANIFEST: PreloadEntry[] = [
  { url: '/models/glb-ready/qs_bob.glb', kind: 'model' },
  { url: '/images/shuttle-hero.png', kind: 'image' },
]

let inFlight: Promise<void> | null = null

export function getDefaultPreloadManifest(): PreloadEntry[] {
  return [...DEFAULT_PRELOAD_MANIFEST]
}

async function fetchHead(url: string): Promise<void> {
  try {
    await fetch(url, { method: 'GET', cache: 'force-cache' })
  } catch {
    /* swallow — preload is non-blocking and best-effort */
  }
}

function loadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve()
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
}

async function loadEntry(entry: PreloadEntry): Promise<void> {
  if (entry.kind === 'image') return loadImage(entry.url)
  return fetchHead(entry.url)
}

export async function preloadGameAssets(
  manifest: PreloadEntry[] = DEFAULT_PRELOAD_MANIFEST,
  onProgress?: (p: PreloadProgress) => void,
): Promise<void> {
  if (inFlight) return inFlight
  if (typeof window === 'undefined') return Promise.resolve()
  const total = manifest.length
  let loaded = 0
  inFlight = (async () => {
    await Promise.all(
      manifest.map(async (entry) => {
        await loadEntry(entry)
        loaded += 1
        onProgress?.({ loaded, total, pct: total === 0 ? 1 : loaded / total })
      }),
    )
  })()
  try {
    await inFlight
  } finally {
    inFlight = null
  }
}

export function resetPreloadCacheForTests(): void {
  inFlight = null
}
