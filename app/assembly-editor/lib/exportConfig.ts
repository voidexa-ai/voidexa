import type { AssemblyConfig, PlacedModel } from './editorTypes'

export function buildConfig(
  models: PlacedModel[],
  cameraPos: [number, number, number],
  cameraTarget: [number, number, number],
  name = 'untitled_assembly',
  description = '',
  tags: string[] = []
): AssemblyConfig {
  return {
    name,
    version: 1,
    created: new Date().toISOString(),
    models,
    camera: { position: cameraPos, target: cameraTarget },
    metadata: { description, tags },
  }
}

export function downloadJson(config: AssemblyConfig) {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${config.name || 'assembly'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyJson(config: AssemblyConfig) {
  await navigator.clipboard.writeText(JSON.stringify(config, null, 2))
}

export function parseConfig(raw: string): AssemblyConfig | null {
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.models)) return null
    return parsed as AssemblyConfig
  } catch {
    return null
  }
}
