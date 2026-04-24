import Link from 'next/link'

/**
 * Pill-style cross-navigation shown in the /shop hero so visitors can
 * jump to the per-category cosmetics surface (/shop/cosmetics) or the
 * booster pack shop (/shop/packs). Added in AFS-6a-fix — those routes
 * were previously only reachable via the Universe dropdown.
 */
export default function ShopCrossNav() {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
      <Link href="/shop/cosmetics" style={{ ...PILL, ...COSMETIC_COLORS }}>
        Browse all cosmetics →
      </Link>
      <Link href="/shop/packs" style={{ ...PILL, ...PACK_COLORS }}>
        Booster packs →
      </Link>
    </div>
  )
}

const PILL: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 999,
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.08em',
  fontFamily: 'var(--font-space, monospace)',
}

const COSMETIC_COLORS: React.CSSProperties = {
  border: '1px solid rgba(0,212,255,0.45)',
  background: 'rgba(0,212,255,0.08)',
  color: '#7fd8ff',
}

const PACK_COLORS: React.CSSProperties = {
  border: '1px solid rgba(255,209,102,0.45)',
  background: 'rgba(255,209,102,0.08)',
  color: '#ffd166',
}
