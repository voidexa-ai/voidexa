import Link from 'next/link'
import {
  Scroll,
  Zap,
  Package,
  Swords,
  LayoutGrid,
  Compass,
  User,
  ShoppingBag,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'

interface Tile {
  href: string
  label: string
  description: string
  color: string
  icon: LucideIcon
}

const TILES: readonly Tile[] = [
  { href: '/game/mission-board',      label: 'Mission Board', description: 'Accept contracts from the Cast.',          color: '#00d4ff', icon: Scroll      },
  { href: '/game/speed-run',          label: 'Speed Run',     description: 'Race tracks, beat the clock.',             color: '#af52de', icon: Zap         },
  { href: '/game/hauling',            label: 'Hauling',       description: 'Deliver cargo across zones.',              color: '#ffd166', icon: Package     },
  { href: '/game/battle',             label: 'Card Battle',   description: 'Challenge AI bosses in tactical combat.',  color: '#ff6b6b', icon: Swords      },
  { href: '/game/cards/deck-builder', label: 'Deck Builder',  description: 'Build and save battle decks.',             color: '#7fd8ff', icon: LayoutGrid  },
  { href: '/game/quests',             label: 'Quests',        description: 'Multi-stage story missions.',              color: '#7fff9f', icon: Compass     },
  { href: '/game/profile',            label: 'Pilot Profile', description: 'Your callsign, stats, tales.',             color: '#ff8a3c', icon: User        },
  { href: '/shop',                    label: 'Shop',          description: 'Cosmetics and card packs.',                color: '#c832ff', icon: ShoppingBag },
]

export default function GameHubTiles() {
  return (
    <section
      aria-label="Game Hub surfaces"
      className="grid gap-3 md:grid-cols-2 lg:grid-cols-4"
      style={{ marginBottom: 28 }}
    >
      {TILES.map(t => {
        const Icon = t.icon
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-label={`${t.label} — ${t.description}`}
            data-testid={`game-hub-tile-${t.label.toLowerCase().replace(/\s+/g, '-')}`}
            className="game-hub-tile"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '20px 18px',
              borderRadius: 14,
              border: `1px solid ${t.color}55`,
              background: 'rgba(12,14,30,0.72)',
              color: '#fff',
              textDecoration: 'none',
              minHeight: 150,
              transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
              boxShadow: `0 0 0 1px transparent, 0 4px 18px -8px ${t.color}44`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Icon size={22} color={t.color} strokeWidth={1.8} aria-hidden="true" />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: `${t.color}`,
                  opacity: 0.85,
                }}
              >
                Enter
              </span>
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: '#fff',
                textShadow: `0 0 14px ${t.color}44`,
              }}
            >
              {t.label}
            </div>
            <div
              style={{
                fontSize: 13.5,
                lineHeight: 1.45,
                color: '#d8d4e6',
                opacity: 0.85,
                flex: 1,
              }}
            >
              {t.description}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: t.color,
              }}
            >
              Open <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </div>
          </Link>
        )
      })}
      <style>{`
        .game-hub-tile:hover {
          border-color: rgba(255,255,255,0.35) !important;
          transform: translateY(-1px);
        }
        .game-hub-tile:focus-visible {
          outline: 2px solid #7fd8ff;
          outline-offset: 2px;
        }
      `}</style>
    </section>
  )
}

export const GAME_HUB_TILES = TILES
