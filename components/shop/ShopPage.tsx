'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { CardRarity } from '@/lib/game/cards'
import { STARTER_SHOP_ITEMS, ShopCategory, type ShopItem } from '@/lib/shop/items'
import {
  getDailyItems,
  getWeeklyFeatured,
  getActiveLimitedEditions,
} from '@/lib/shop/rotation'
import { useT } from '@/lib/i18n/context'
import type { Dict } from '@/lib/i18n/types'
import { MODEL_URLS } from '@/lib/config/modelUrls'
import { formatCentsAsGhai, formatUsdAsGhai } from '@/lib/ghai/format'
import ItemBuyButton from './ItemBuyButton'
import ShopCrossNav from './ShopCrossNav'

const ShopItemPreviewCanvas = dynamic(() => import('./ShopItemPreviewCanvas'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: '#050813' }} />,
})

const RARITY_COLOR: Record<CardRarity, string> = {
  [CardRarity.Common]:    '#94a3b8',
  [CardRarity.Uncommon]:  '#4ade80',
  [CardRarity.Rare]:      '#3b82f6',
  [CardRarity.Epic]:      '#a855f7',
  [CardRarity.Legendary]: '#f59e0b',
  [CardRarity.Mythic]:    '#ec4899',
}

const rarityLabel = (t: Dict, r: CardRarity): string => {
  const key = CardRarity[r] as keyof Dict['shop']['rarity']
  return t.shop.rarity[key] ?? key
}
const categoryLabel = (t: Dict, c: ShopCategory): string => {
  const key = c as keyof Dict['shop']['category']
  return t.shop.category[key] ?? String(c)
}
const itemName = (t: Dict, item: ShopItem): string => t.shop.items[item.id]?.name ?? item.name
const itemDesc = (t: Dict, item: ShopItem): string => t.shop.items[item.id]?.description ?? item.description

// Map shop-item IDs to actual .glb paths for 3D preview in the detail modal.
// Grid cards now use static render PNGs (see ITEM_IMAGE) to avoid WebGL context
// exhaustion when multiple canvases mount at once.
const ITEM_MODEL: Record<string, { url: string; scale?: number }> = {
  'skin-crimson-fighter': { url: MODEL_URLS.qs_bob,            scale: 1.0 },
  'skin-chrome-cruiser':  { url: MODEL_URLS.usc_astroeagle01,  scale: 0.6 },
  'skin-obsidian-stealth':{ url: MODEL_URLS.usc_cosmicshark01, scale: 0.55 },
  'skin-void-legend':     { url: MODEL_URLS.usc_voidwhale01,   scale: 0.25 },
  'cockpit-carbon':       { url: MODEL_URLS.hirez_cockpit01,   scale: 1.0 },
  // 'cockpit-gilded' — awaiting hirez_cockpit02.glb upload to Supabase
}

// Static rendered preview images per shop item. Preferred over live WebGL
// canvases in the grid to keep context count low and thumbnails crisp.
const ITEM_IMAGE: Record<string, string> = {
  'skin-crimson-fighter':   '/images/renders/uncommon/usc_forcebadger01.png',
  'skin-chrome-cruiser':    '/images/renders/rare/uscx_starship.png',
  'skin-obsidian-stealth':  '/images/renders/epic/hirez_ship02_full.png',
  'skin-void-legend':       '/images/renders/legendary/hirez_ship01_full.png',
  'attach-swept-wings':     '/images/renders/weapons/hirez_weapon_blaster.png',
  'attach-sensor-array':    '/images/renders/weapons/hirez_weapon_smallmachinegun.png',
  'attach-vanity-guns':     '/images/renders/weapons/hirez_weapon_bigmachinegun.png',
  'cockpit-carbon':         '/images/renders/cockpits/hirez_cockpit01.png',
  'cockpit-gilded':         '/images/renders/cockpits/hirez_cockpit02.png',
}

type TabKey = 'featured' | 'all' | ShopCategory

function buildTabs(t: Dict): { key: TabKey; label: string }[] {
  // Fortnite-style: All + Featured land first, then the six canonical shelves.
  // Skins surfaces hull-customization attachments (fins, antennas, cannons).
  return [
    { key: 'all',                     label: t.shop.tabs.all ?? 'All' },
    { key: 'featured',                label: 'Featured' },
    { key: ShopCategory.ShipSkin,     label: t.shop.tabs.ships },
    { key: ShopCategory.Attachment,   label: 'Skins' },
    { key: ShopCategory.Trail,        label: t.shop.tabs.trails },
    { key: ShopCategory.CardPack,     label: t.shop.tabs.cardPacks },
    { key: ShopCategory.CockpitTheme, label: t.shop.tabs.cockpits },
  ]
}

const PAGE_SIZE = 8

// Shop prices are stored as USD cents. GHAI rate: $1 = 100 GHAI, so
// cents → GHAI is a 1:1 integer mapping (e.g. $3.00 = 300¢ = 300 GHAI).
function formatPrice(cents: number): string {
  return formatCentsAsGhai(cents)
}

function parseCardPackContents(description: string): string[] {
  const m = description.match(/:\s*(.*)$/)
  if (!m) return []
  return m[1].split(/\s*\+\s*/).map(s => s.trim())
}

function useCountdownToUtcMidnight(): string {
  const [, force] = useState(0)
  useEffect(() => {
    const id = setInterval(() => force(x => x + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const now = new Date()
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0))
  const diff = Math.max(0, next.getTime() - now.getTime())
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Geometric SVG placeholders per category — neutral, readable, no emoji.
function CategoryShape({ category, color, size = 120 }: { category: ShopCategory; color: string; size?: number }) {
  const stroke = color
  const fill = `${color}22`
  const strokeWidth = 2.4
  const props = { width: size, height: size, viewBox: '0 0 100 100' as const }
  const glow = `0 0 24px ${color}88`
  const common = { stroke, strokeWidth, fill, style: { filter: `drop-shadow(${glow})` } }
  switch (category) {
    case ShopCategory.ShipSkin:
      return (
        <svg {...props}>
          <polygon points="50,10 86,82 50,68 14,82" {...common} />
        </svg>
      )
    case ShopCategory.Attachment:
      return (
        <svg {...props}>
          <rect x="20" y="20" width="60" height="60" rx="10" {...common} />
          <circle cx="50" cy="50" r="10" {...common} />
        </svg>
      )
    case ShopCategory.Effect:
      return (
        <svg {...props}>
          <circle cx="50" cy="50" r="30" {...common} />
          <circle cx="50" cy="50" r="42" stroke={stroke} strokeWidth="1.5" fill="none" opacity="0.6" />
          <circle cx="50" cy="50" r="14" stroke={stroke} strokeWidth="1.2" fill="none" opacity="0.8" />
        </svg>
      )
    case ShopCategory.Trail:
      return (
        <svg {...props}>
          <path d="M10 65 L40 60 L58 50 L74 40 L90 22" stroke={stroke} strokeWidth={strokeWidth} fill="none" style={{ filter: `drop-shadow(${glow})` }} strokeLinecap="round" />
          <path d="M12 75 L44 70 L60 62 L78 54 L92 40" stroke={stroke} strokeWidth={strokeWidth - 0.6} fill="none" opacity="0.6" strokeLinecap="round" />
        </svg>
      )
    case ShopCategory.CockpitTheme:
      return (
        <svg {...props}>
          <path d="M20 66 Q50 20 80 66 L80 82 L20 82 Z" {...common} />
          <path d="M30 66 Q50 34 70 66" stroke={stroke} strokeWidth="1.5" fill="none" opacity="0.7" />
        </svg>
      )
    case ShopCategory.Emote:
      return (
        <svg {...props}>
          <circle cx="50" cy="50" r="34" {...common} />
          <circle cx="40" cy="44" r="3" fill={stroke} />
          <circle cx="60" cy="44" r="3" fill={stroke} />
          <path d="M36 62 Q50 74 64 62" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )
    case ShopCategory.CardPack:
      return (
        <svg {...props}>
          <rect x="22" y="14" width="44" height="72" rx="6" stroke={stroke} strokeWidth={strokeWidth - 0.4} fill={fill} opacity="0.5" transform="rotate(-12 50 50)" />
          <rect x="30" y="18" width="44" height="72" rx="6" stroke={stroke} strokeWidth={strokeWidth - 0.2} fill={fill} opacity="0.7" transform="rotate(-4 50 50)" />
          <rect x="34" y="20" width="44" height="72" rx="6" {...common} />
        </svg>
      )
  }
}

function ItemCard({ item, onClick, large = false }: { item: ShopItem; onClick: () => void; large?: boolean }) {
  const t = useT()
  const color = RARITY_COLOR[item.rarity]
  const renderSrc = ITEM_IMAGE[item.id]
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        textAlign: 'left',
        padding: 0,
        background: 'linear-gradient(180deg, rgba(10,14,24,0.85), rgba(6,10,18,0.92))',
        border: `1px solid ${color}55`,
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: `0 0 24px ${color}22`,
        color: '#fff',
        fontFamily: 'var(--font-inter, system-ui)',
        transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 38px ${color}88`
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = color
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 24px ${color}22`
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${color}55`
      }}
    >
      <div style={{
        aspectRatio: large ? '5 / 4' : '1 / 1',
        minHeight: 220,
        background: `radial-gradient(circle at 50% 55%, ${color}33 0%, rgba(5,8,16,0.95) 70%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: `1px solid ${color}33`,
        position: 'relative',
      }}>
        {renderSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={renderSrc}
            alt={item.name}
            style={{
              width: '92%',
              height: '92%',
              objectFit: 'contain',
              filter: `drop-shadow(0 0 24px ${color}88)`,
            }}
          />
        ) : (
          <CategoryShape category={item.category} color={color} size={large ? 200 : 200} />
        )}
        {item.isLimitedEdition && (
          <span style={{
            position: 'absolute',
            top: 12, left: 12,
            fontSize: 11,
            letterSpacing: '0.18em',
            padding: '4px 10px',
            borderRadius: 999,
            color: '#f59e0b',
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.5)',
            textShadow: '0 0 8px #f59e0b',
            fontFamily: 'var(--font-space, monospace)',
          }}>
            {t.shop.limited}
          </span>
        )}
      </div>
      <div style={{ padding: large ? 20 : 16 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}>
          <span style={{
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color,
            textShadow: `0 0 8px ${color}77`,
            fontFamily: 'var(--font-space, monospace)',
          }}>
            {rarityLabel(t, item.rarity)}
          </span>
          <span style={{
            fontSize: 12,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            padding: '3px 10px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 999,
          }}>
            {categoryLabel(t, item.category)}
          </span>
        </div>
        <div style={{
          fontSize: large ? 20 : 17,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          marginTop: 8,
          fontFamily: 'var(--font-space, system-ui)',
        }}>
          {itemName(t, item)}
        </div>
        <div style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.65)',
          marginTop: 6,
          lineHeight: 1.45,
          minHeight: '2.9em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {itemDesc(t, item)}
        </div>
        <div style={{ marginTop: 14 }}>
          <span style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#fff',
            textShadow: '0 0 10px #00d4ff66',
            fontFamily: 'var(--font-space, system-ui)',
          }}>
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </button>
  )
}

function ItemModal({ item, onClose }: { item: ShopItem; onClose: () => void }) {
  const t = useT()
  const color = RARITY_COLOR[item.rarity]
  const modelSpec = ITEM_MODEL[item.id]
  const isCardPack = item.category === ShopCategory.CardPack
  const packContents = isCardPack ? parseCardPackContents(itemDesc(t, item)) : []
  const isShipSkin = item.category === ShopCategory.ShipSkin

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: 'rgba(2, 4, 14, 0.92)',
        backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 1100, maxHeight: '92vh',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(300px, 1fr)',
          gap: 0,
          background: 'linear-gradient(160deg, rgba(14,18,30,0.96), rgba(6,10,18,0.98))',
          border: `1px solid ${color}`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: `0 0 50px ${color}55`,
          color: '#fff',
          fontFamily: 'var(--font-inter, system-ui)',
        }}
      >
        <div style={{
          position: 'relative',
          background: `radial-gradient(circle at 50% 55%, ${color}33 0%, rgba(5,8,16,0.97) 75%)`,
          borderRight: `1px solid ${color}44`,
          minHeight: 420,
        }}>
          {modelSpec ? (
            <div style={{ position: 'absolute', inset: 0 }}>
              <ShopItemPreviewCanvas url={modelSpec.url} scale={modelSpec.scale} accent={color} orbit rotateSpeed={0.25} />
            </div>
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CategoryShape category={item.category} color={color} size={240} />
            </div>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 16, right: 16,
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'rgba(6,8,18,0.75)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: 22, lineHeight: 1,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          padding: '30px 32px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 12.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-space, monospace)',
            flexWrap: 'wrap',
          }}>
            <span style={{ color, textShadow: `0 0 8px ${color}` }}>
              {rarityLabel(t, item.rarity)}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
              {categoryLabel(t, item.category)}
            </span>
            {item.isLimitedEdition && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                <span style={{ color: '#f59e0b', textShadow: '0 0 8px #f59e0b' }}>
                  {t.shop.limited}
                </span>
              </>
            )}
          </div>
          <div style={{
            fontSize: 32,
            fontWeight: 800,
            marginTop: 10,
            lineHeight: 1.1,
            fontFamily: 'var(--font-space, system-ui)',
          }}>
            {itemName(t, item)}
          </div>
          <div style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 14,
            lineHeight: 1.55,
          }}>
            {itemDesc(t, item)}
          </div>
          {isCardPack && packContents.length > 0 && (
            <div style={{
              marginTop: 18,
              padding: '14px 16px',
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.25)',
              borderRadius: 10,
            }}>
              <div style={{
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6fe6ff',
                fontFamily: 'var(--font-space, monospace)',
                marginBottom: 8,
              }}>
                {t.shop.packContents}
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: 20,
                fontSize: 15,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.7,
              }}>
                {packContents.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          {isShipSkin && (
            <div style={{
              marginTop: 14,
              fontSize: 13,
              color: 'rgba(0,212,255,0.75)',
              fontStyle: 'italic',
            }}>
              {t.shop.previewNote}
            </div>
          )}

          <div style={{ flex: 1 }} />

          <div style={{
            marginTop: 26,
            padding: '20px 0 0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}>
            <span style={{
              fontSize: 34,
              fontWeight: 800,
              color: '#fff',
              textShadow: '0 0 14px #00d4ff88',
              fontFamily: 'var(--font-space, system-ui)',
            }}>
              {formatPrice(item.price)}
            </span>
            <ItemBuyButton item={item} accent={color} onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const t = useT()
  const TABS = buildTabs(t)
  const [selected, setSelected] = useState<ShopItem | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [page, setPage] = useState(0)
  const countdown = useCountdownToUtcMidnight()

  const today = useMemo(() => new Date(), [])
  const daily = useMemo(() => getDailyItems(today), [today])
  const weekly = useMemo(() => getWeeklyFeatured(today), [today])
  const limited = useMemo(() => getActiveLimitedEditions(today), [today])

  // Prefer an item that has a rendered hero image for the huge banner
  const featured: ShopItem[] = useMemo(() => {
    const withImage = daily.filter(i => ITEM_IMAGE[i.id])
    const primary = withImage[0] ?? daily[0]
    const secondary = daily.find(i => i.id !== primary?.id) ?? weekly[0]
    return [primary, secondary].filter((x): x is ShopItem => Boolean(x))
  }, [daily, weekly])

  useEffect(() => { setPage(0) }, [activeTab])

  // Every shop item, sorted: daily featured first, then rarity high→low,
  // then alphabetical.
  const allItems = useMemo(() => {
    const featuredIds = new Set(daily.map(i => i.id))
    const rarityRank: Record<CardRarity, number> = {
      [CardRarity.Mythic]:    0,
      [CardRarity.Legendary]: 1,
      [CardRarity.Epic]:      2,
      [CardRarity.Rare]:      3,
      [CardRarity.Uncommon]:  4,
      [CardRarity.Common]:    5,
    }
    const items = [...STARTER_SHOP_ITEMS]
    return items.sort((a, b) => {
      const aFeat = featuredIds.has(a.id) ? 0 : 1
      const bFeat = featuredIds.has(b.id) ? 0 : 1
      if (aFeat !== bFeat) return aFeat - bFeat
      if (a.rarity !== b.rarity) return rarityRank[a.rarity] - rarityRank[b.rarity]
      return a.name.localeCompare(b.name)
    })
  }, [daily])

  const tabItems = useMemo(() => {
    if (activeTab === 'featured') return [] as readonly ShopItem[]
    if (activeTab === 'all') return allItems
    return STARTER_SHOP_ITEMS.filter(i => i.category === activeTab)
  }, [activeTab, allItems])

  const pageCount = Math.max(1, Math.ceil(tabItems.length / PAGE_SIZE))
  const pagedItems = tabItems.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0a1124 0%, #050813 60%, #02030a 100%)',
      color: '#fff',
      fontFamily: 'var(--font-inter, system-ui)',
      padding: '96px 24px 80px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <header style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 14,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.75)',
            fontFamily: 'var(--font-space, monospace)',
          }}>
            {t.shop.eyebrow}
          </div>
          <h1 style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '8px 0 10px',
            fontFamily: 'var(--font-space, system-ui)',
            background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {t.shop.title}
          </h1>
          <p style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 680,
            lineHeight: 1.6,
          }}>
            {t.shop.subtitle}
          </p>
          <ShopCrossNav />
        </header>

        {/* Starter pack banner */}
        <div style={{
          marginBottom: 28,
          padding: '22px 28px',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(139,92,246,0.18))',
          border: '1px solid rgba(0,212,255,0.5)',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
          boxShadow: '0 0 32px rgba(0,212,255,0.2)',
        }}>
          <div>
            <div style={{
              fontSize: 12,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#66e6ff',
              fontFamily: 'var(--font-space, monospace)',
              textShadow: '0 0 8px #00d4ff',
            }}>
              {t.shop.newPilotBundle}
            </div>
            <div style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.01em',
              marginTop: 6,
              fontFamily: 'var(--font-space, system-ui)',
            }}>
              {t.shop.starterPack}
            </div>
            <div style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.75)',
              marginTop: 6,
              lineHeight: 1.5,
            }}>
              {t.shop.starterDesc}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              fontSize: 34,
              fontWeight: 800,
              color: '#fff',
              textShadow: '0 0 14px #00d4ff',
              fontFamily: 'var(--font-space, system-ui)',
            }}>
              {formatUsdAsGhai(1.99)}
            </div>
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/wallet/deduct', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount_usd: 1.99, description: 'Starter Pack purchase' }),
                  })
                  if (res.status === 402) {
                    // Insufficient balance — prompt top-up by dispatching a custom event the nav can listen for.
                    window.dispatchEvent(new CustomEvent('voidexa:topup-required', { detail: { amount_usd: 1.99 } }))
                  }
                  // Success / other — noop for now; Starter Pack inventory wiring is a later sprint.
                } catch { /* silent */ }
              }}
              style={{
                padding: '12px 26px',
                background: 'linear-gradient(135deg, rgba(0,212,255,0.4), rgba(139,92,246,0.35))',
                border: '1px solid rgba(0,212,255,0.7)',
                borderRadius: 999,
                color: '#fff',
                fontFamily: 'var(--font-space, monospace)',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                textShadow: '0 0 8px #00d4ff',
              }}
            >
              BUY · {formatUsdAsGhai(1.99)}
            </button>
          </div>
        </div>

        {/* Fortnite-style tab bar — moved above shelves so switching shows a clean surface */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 28,
          paddingBottom: 10,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          {TABS.map(tab => {
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '12px 22px',
                  background: active ? 'rgba(0,212,255,0.14)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(0,212,255,0.7)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 999,
                  color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontSize: 14,
                  fontFamily: 'var(--font-space, monospace)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  textShadow: active ? '0 0 10px #00d4ff' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Daily Featured banner — only on the Featured tab */}
        {activeTab === 'featured' && featured.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 14,
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-space, system-ui)',
                  color: '#fff',
                  borderLeft: '3px solid #00d4ff',
                  paddingLeft: 12,
                  textShadow: '0 0 12px rgba(0,212,255,0.6)',
                }}>
                  {t.shop.dailyFeatured}
                </h2>
              </div>
              <div style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-space, monospace)',
              }}>
                {t.shop.resetsIn}{' '}
                <span style={{
                  color: '#00ffff',
                  textShadow: '0 0 8px #00d4ff',
                }}>
                  {countdown}
                </span>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: featured.length > 1 ? 'repeat(auto-fit, minmax(360px, 1fr))' : '1fr',
              gap: 20,
            }}>
              {featured.map(item => {
                const color = RARITY_COLOR[item.rarity]
                const heroImg = ITEM_IMAGE[item.id]
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    style={{
                      position: 'relative',
                      textAlign: 'left',
                      padding: 0,
                      background: 'linear-gradient(180deg, rgba(10,14,24,0.85), rgba(6,10,18,0.95))',
                      border: `1.5px solid ${color}`,
                      borderRadius: 18,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: `0 0 40px ${color}44`,
                      color: '#fff',
                      fontFamily: 'var(--font-inter, system-ui)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)'
                      ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 60px ${color}88`
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                      ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 40px ${color}44`
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      aspectRatio: '16 / 9',
                      background: `radial-gradient(circle at 50% 55%, ${color}44 0%, rgba(5,8,16,0.97) 75%)`,
                    }}>
                      {heroImg ? (
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={heroImg}
                            alt={item.name}
                            style={{
                              maxWidth: '85%',
                              maxHeight: '85%',
                              objectFit: 'contain',
                              filter: `drop-shadow(0 0 36px ${color}aa)`,
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <CategoryShape category={item.category} color={color} size={240} />
                        </div>
                      )}
                      <div style={{
                        position: 'absolute',
                        top: 16, left: 16,
                        fontSize: 12,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color,
                        background: 'rgba(6,8,18,0.5)',
                        border: `1px solid ${color}77`,
                        padding: '4px 12px',
                        borderRadius: 999,
                        fontFamily: 'var(--font-space, monospace)',
                        textShadow: `0 0 8px ${color}`,
                        backdropFilter: 'blur(8px)',
                      }}>
                        {rarityLabel(t, item.rarity)}
                      </div>
                    </div>
                    <div style={{ padding: '22px 26px' }}>
                      <div style={{
                        fontSize: 13,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.55)',
                      }}>
                        {categoryLabel(t, item.category)}
                      </div>
                      <div style={{
                        fontSize: 26,
                        fontWeight: 800,
                        letterSpacing: '-0.01em',
                        marginTop: 4,
                        fontFamily: 'var(--font-space, system-ui)',
                      }}>
                        {itemName(t, item)}
                      </div>
                      <div style={{
                        fontSize: 15,
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: 8,
                        lineHeight: 1.5,
                      }}>
                        {itemDesc(t, item)}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 16,
                      }}>
                        <span style={{
                          fontSize: 28,
                          fontWeight: 800,
                          textShadow: '0 0 12px #00d4ff66',
                          fontFamily: 'var(--font-space, system-ui)',
                        }}>
                          {formatPrice(item.price)}
                        </span>
                        <span style={{
                          fontSize: 13,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.5)',
                          fontFamily: 'var(--font-space, monospace)',
                        }}>
                          {t.common.viewDetails}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Limited Edition strip — only on the Featured tab */}
        {activeTab === 'featured' && limited.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{
              margin: '0 0 14px',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-space, system-ui)',
              color: '#fff',
              borderLeft: '3px solid #f59e0b',
              paddingLeft: 12,
              textShadow: '0 0 12px rgba(245,158,11,0.55)',
            }}>
              {t.shop.limitedEdition}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 18,
            }}>
              {limited.map(item => (
                <ItemCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </section>
        )}

        {/* Paginated grid — category tabs only */}
        {activeTab !== 'featured' && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 28,
            }}>
              {pagedItems.map(item => (
                <ItemCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
              {pagedItems.length === 0 && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '60px 0',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-space, monospace)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}>
                  No items in this category yet.
                </div>
              )}
            </div>

            {pageCount > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
                marginTop: 36,
              }}>
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={{
                    padding: '10px 22px',
                    background: 'rgba(0,212,255,0.08)',
                    border: '1px solid rgba(0,212,255,0.4)',
                    borderRadius: 999,
                    color: '#fff',
                    fontFamily: 'var(--font-space, monospace)',
                    fontSize: 14,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                    opacity: page === 0 ? 0.45 : 1,
                  }}
                >
                  ← Prev
                </button>
                <span style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-space, monospace)',
                  letterSpacing: '0.12em',
                }}>
                  {page + 1} / {pageCount}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
                  disabled={page >= pageCount - 1}
                  style={{
                    padding: '10px 22px',
                    background: 'rgba(0,212,255,0.08)',
                    border: '1px solid rgba(0,212,255,0.4)',
                    borderRadius: 999,
                    color: '#fff',
                    fontFamily: 'var(--font-space, monospace)',
                    fontSize: 14,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: page >= pageCount - 1 ? 'not-allowed' : 'pointer',
                    opacity: page >= pageCount - 1 ? 0.45 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
