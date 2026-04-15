'use client'

import { useEffect, useMemo, useState } from 'react'
import { CardRarity } from '@/lib/game/cards'
import { STARTER_SHOP_ITEMS, ShopCategory, type ShopItem } from '@/lib/shop/items'
import {
  getDailyItems,
  getWeeklyFeatured,
  getActiveLimitedEditions,
} from '@/lib/shop/rotation'

const RARITY_COLOR: Record<CardRarity, string> = {
  [CardRarity.Common]:    '#94a3b8',
  [CardRarity.Uncommon]:  '#4ade80',
  [CardRarity.Rare]:      '#3b82f6',
  [CardRarity.Epic]:      '#a855f7',
  [CardRarity.Legendary]: '#f59e0b',
}

const RARITY_LABEL: Record<CardRarity, string> = {
  [CardRarity.Common]:    'Common',
  [CardRarity.Uncommon]:  'Uncommon',
  [CardRarity.Rare]:      'Rare',
  [CardRarity.Epic]:      'Epic',
  [CardRarity.Legendary]: 'Legendary',
}

const CATEGORY_LABEL: Record<ShopCategory, string> = {
  [ShopCategory.ShipSkin]:     'Ship Skin',
  [ShopCategory.Attachment]:   'Attachment',
  [ShopCategory.Effect]:       'Effect',
  [ShopCategory.Trail]:        'Trail',
  [ShopCategory.CockpitTheme]: 'Cockpit',
  [ShopCategory.Emote]:        'Emote',
  [ShopCategory.CardPack]:     'Card Pack',
}

const CATEGORY_ICON: Record<ShopCategory, string> = {
  [ShopCategory.ShipSkin]:     '🚀',
  [ShopCategory.Attachment]:   '🔩',
  [ShopCategory.Effect]:       '✨',
  [ShopCategory.Trail]:        '🌠',
  [ShopCategory.CockpitTheme]: '🛸',
  [ShopCategory.Emote]:        '😎',
  [ShopCategory.CardPack]:     '🃏',
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
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

function parseCardPackContents(description: string): string[] {
  // Rough heuristic: split after "5 cards:" on "+"
  const m = description.match(/:\s*(.*)$/)
  if (!m) return []
  return m[1].split(/\s*\+\s*/).map(s => s.trim())
}

function ItemCard({ item, onClick }: { item: ShopItem; onClick: () => void }) {
  const color = RARITY_COLOR[item.rarity]
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        textAlign: 'left',
        padding: 0,
        background: 'linear-gradient(180deg, rgba(10,14,24,0.8), rgba(6,10,18,0.9))',
        border: `1px solid ${color}66`,
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: `0 0 18px ${color}22`,
        color: '#fff',
        fontFamily: 'var(--font-inter, system-ui)',
        transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 28px ${color}66`
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = color
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 18px ${color}22`
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${color}66`
      }}
    >
      {/* Preview / icon area */}
      <div style={{
        aspectRatio: '4 / 3',
        background: `radial-gradient(circle at 50% 55%, ${color}33 0%, rgba(5,8,16,0.95) 70%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 64,
        textShadow: `0 0 24px ${color}aa`,
        borderBottom: `1px solid ${color}44`,
      }}>
        {CATEGORY_ICON[item.category]}
      </div>
      {/* Body */}
      <div style={{ padding: 14 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}>
          <span style={{
            fontSize: 12,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color,
            textShadow: `0 0 8px ${color}77`,
            fontFamily: 'var(--font-space, monospace)',
          }}>
            {RARITY_LABEL[item.rarity]}
          </span>
          <span style={{
            fontSize: 12,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            padding: '2px 8px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 999,
          }}>
            {CATEGORY_LABEL[item.category]}
          </span>
        </div>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          marginTop: 6,
          fontFamily: 'var(--font-space, system-ui)',
        }}>
          {item.name}
        </div>
        <div style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.65)',
          marginTop: 4,
          lineHeight: 1.45,
          minHeight: '2.8em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.description}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 0 10px #00d4ff88',
          }}>
            {formatPrice(item.price)}
          </span>
          {item.isLimitedEdition && (
            <span style={{
              fontSize: 11,
              letterSpacing: '0.16em',
              color: '#f59e0b',
              textShadow: '0 0 8px #f59e0b',
              fontFamily: 'var(--font-space, monospace)',
            }}>
              ★ LIMITED
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function ItemModal({ item, onClose }: { item: ShopItem; onClose: () => void }) {
  const color = RARITY_COLOR[item.rarity]
  const isCardPack = item.category === ShopCategory.CardPack
  const packContents = isCardPack ? parseCardPackContents(item.description) : []
  const isShipSkin = item.category === ShopCategory.ShipSkin
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'rgba(2, 4, 14, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 640,
          background: 'linear-gradient(160deg, rgba(14,18,30,0.95), rgba(6,10,18,0.95))',
          border: `1px solid ${color}`,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: `0 0 40px ${color}44`,
          color: '#fff',
          fontFamily: 'var(--font-inter, system-ui)',
        }}
      >
        <div style={{
          aspectRatio: '16 / 9',
          background: `radial-gradient(circle at 50% 55%, ${color}44 0%, rgba(5,8,16,0.95) 70%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 120,
          textShadow: `0 0 40px ${color}`,
          borderBottom: `1px solid ${color}66`,
        }}>
          {CATEGORY_ICON[item.category]}
        </div>
        <div style={{ padding: '22px 26px 26px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-space, monospace)',
          }}>
            <span style={{ color, textShadow: `0 0 8px ${color}` }}>
              {RARITY_LABEL[item.rarity]}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
              {CATEGORY_LABEL[item.category]}
            </span>
            {item.isLimitedEdition && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
                <span style={{ color: '#f59e0b', textShadow: '0 0 8px #f59e0b' }}>
                  ★ Limited Edition
                </span>
              </>
            )}
          </div>
          <div style={{
            fontSize: 26,
            fontWeight: 700,
            marginTop: 8,
            fontFamily: 'var(--font-space, system-ui)',
          }}>
            {item.name}
          </div>
          <div style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 10,
            lineHeight: 1.55,
          }}>
            {item.description}
          </div>
          {isCardPack && packContents.length > 0 && (
            <div style={{
              marginTop: 16,
              padding: '12px 14px',
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.25)',
              borderRadius: 8,
            }}>
              <div style={{
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6fe6ff',
                fontFamily: 'var(--font-space, monospace)',
                marginBottom: 6,
              }}>
                Pack Contents
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: 20,
                fontSize: 14,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.6,
              }}>
                {packContents.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          {isShipSkin && (
            <div style={{
              marginTop: 12,
              fontSize: 13,
              color: 'rgba(0,212,255,0.75)',
              letterSpacing: '0.04em',
              fontStyle: 'italic',
            }}>
              Preview in Free Flight after purchase.
            </div>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 20,
          }}>
            <span style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 0 14px #00d4ff77',
              fontFamily: 'var(--font-space, system-ui)',
            }}>
              {formatPrice(item.price)}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 999,
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: 'var(--font-space, monospace)',
                  fontSize: 13,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                disabled
                style={{
                  padding: '10px 22px',
                  background: `linear-gradient(135deg, ${color}33, ${color}22)`,
                  border: `1px solid ${color}66`,
                  borderRadius: 999,
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'var(--font-space, monospace)',
                  fontSize: 13,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'not-allowed',
                }}
              >
                Coming Soon · Stripe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [selected, setSelected] = useState<ShopItem | null>(null)
  const countdown = useCountdownToUtcMidnight()

  const today = useMemo(() => new Date(), [])
  const daily = useMemo(() => getDailyItems(today), [today])
  const weekly = useMemo(() => getWeeklyFeatured(today), [today])
  const limited = useMemo(() => getActiveLimitedEditions(today), [today])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0a1124 0%, #050813 60%, #02030a 100%)',
      color: '#fff',
      fontFamily: 'var(--font-inter, system-ui)',
      padding: '96px 32px 80px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <header style={{ marginBottom: 36 }}>
          <div style={{
            fontSize: 14,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.75)',
            fontFamily: 'var(--font-space, monospace)',
          }}>
            voidexa · Storefront
          </div>
          <h1 style={{
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '6px 0 10px',
            fontFamily: 'var(--font-space, system-ui)',
            background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Shop
          </h1>
          <p style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 680,
            lineHeight: 1.6,
          }}>
            Cosmetic skins, trails, cockpit themes and card packs. No pay-to-win —
            gameplay earns stats, the shop only sells looks.
          </p>
        </header>

        {/* Limited Edition strip */}
        {limited.length > 0 && (
          <Section
            title="Last Chance · Limited Edition"
            accent="#f59e0b"
            meta="Never returning. Once they leave, they're gone."
          >
            <Grid>
              {limited.map(item => (
                <ItemCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </Grid>
          </Section>
        )}

        {/* Daily rotation */}
        <Section
          title="Daily Rotation"
          accent="#00d4ff"
          meta={
            <span>
              Resets in{' '}
              <span style={{
                fontFamily: 'var(--font-space, monospace)',
                color: '#00ffff',
                textShadow: '0 0 8px #00d4ff',
              }}>
                {countdown}
              </span>
            </span>
          }
        >
          <Grid>
            {daily.map(item => (
              <ItemCard key={item.id} item={item} onClick={() => setSelected(item)} />
            ))}
          </Grid>
        </Section>

        {/* Weekly featured */}
        <Section
          title="Weekly Featured"
          accent="#a855f7"
          meta="Premium picks, rotating every Monday."
        >
          <Grid>
            {weekly.map(item => (
              <ItemCard key={item.id} item={item} onClick={() => setSelected(item)} />
            ))}
          </Grid>
        </Section>

        {/* Full catalog (collapsed-style) */}
        <Section
          title="Full Catalog"
          accent="#64748b"
          meta={`${STARTER_SHOP_ITEMS.length} items`}
        >
          <Grid>
            {STARTER_SHOP_ITEMS.map(item => (
              <ItemCard key={item.id} item={item} onClick={() => setSelected(item)} />
            ))}
          </Grid>
        </Section>
      </div>

      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function Section({ title, meta, accent, children }: {
  title: string
  meta?: React.ReactNode
  accent: string
  children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: 44 }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        <h2 style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-space, system-ui)',
          color: '#fff',
          borderLeft: `3px solid ${accent}`,
          paddingLeft: 12,
          textShadow: `0 0 10px ${accent}55`,
        }}>
          {title}
        </h2>
        {meta && (
          <div style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.04em',
          }}>
            {meta}
          </div>
        )}
      </div>
      {children}
    </section>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 16,
    }}>
      {children}
    </div>
  )
}
