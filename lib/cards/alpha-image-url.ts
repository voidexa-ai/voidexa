// lib/cards/alpha-image-url.ts
//
// AFS-18 — Deterministic public URL for an Alpha card webp.
//
// Bucket layout (Option A locked Apr 28):
//   cards/alpha/{rarity}/{id}.webp
// where {id} matches alpha_cards.id (text PK, snake_case slug). The
// numeric prefix from the AFS-5 generation pipeline is stripped on upload
// (scripts/upload_alpha_to_supabase.ts) so each card has exactly one
// canonical filename derivable from DB columns alone.
//
// Bucket "cards" is public-read (migration 20260428_afs18_cards_bucket.sql),
// so anonymous fetches need no token. Build the URL from the public env var.

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
const PUBLIC_BASE = `${SUPABASE_URL}/storage/v1/object/public/cards`

export function getAlphaCardImageUrl(id: string, rarity: string): string {
  return `${PUBLIC_BASE}/alpha/${rarity}/${id}.webp`
}
