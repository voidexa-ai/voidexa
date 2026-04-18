// USD ↔ GHAI display helpers.
// Platform-GHAI is fictive in-game currency: $1 USD = 100 GHAI (fixed).

export const USD_TO_GHAI = 100

export function usdToGhai(usd: number): number {
  if (!Number.isFinite(usd) || usd < 0) return 0
  return Math.floor(usd * USD_TO_GHAI)
}

export function centsToGhai(cents: number): number {
  if (!Number.isFinite(cents) || cents < 0) return 0
  return Math.floor(cents)
}

export function formatGhai(ghai: number): string {
  const n = Math.max(0, Math.floor(ghai))
  return `${n.toLocaleString('en-US')} GHAI`
}

export function formatUsdAsGhai(usd: number): string {
  return formatGhai(usdToGhai(usd))
}

export function formatCentsAsGhai(cents: number): string {
  return formatGhai(centsToGhai(cents))
}
