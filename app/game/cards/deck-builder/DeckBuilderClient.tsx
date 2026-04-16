'use client'

import { useCallback, useEffect, useMemo, useState, type DragEvent } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  CARD_TEMPLATES,
  CARDS_BY_ID,
  type CardTemplate,
  type CardType,
  type GameCardRarity,
} from '@/lib/game/cards/index'

const DECK_SIZE = 20
const MAX_COPIES = 2
const MAX_RARE = 3
const MAX_LEGENDARY = 1
const MAX_MYTHIC = 1

const TYPE_OPTIONS: readonly (CardType | 'all')[] = [
  'all', 'weapon', 'defense', 'maneuver', 'drone', 'ai', 'consumable',
] as const

const RARITY_OPTIONS: readonly (GameCardRarity | 'all')[] = [
  'all', 'common', 'uncommon', 'rare', 'legendary', 'pioneer',
] as const

const TYPE_ICON: Record<CardType, string> = {
  weapon: '⚔', defense: '◈', maneuver: '↗', drone: '⬢', ai: '◉', consumable: '⚗',
}

const RARITY_BORDER: Record<GameCardRarity, string> = {
  common: 'rgba(176,176,196,0.45)',
  uncommon: 'rgba(90,200,250,0.55)',
  rare: 'rgba(90,160,250,0.75)',
  legendary: 'rgba(255,186,60,0.7)',
  pioneer: 'rgba(175,82,222,0.75)',
}

const RARITY_GLOW: Record<GameCardRarity, string> = {
  common: 'rgba(176,176,196,0.12)',
  uncommon: 'rgba(90,200,250,0.16)',
  rare: 'rgba(90,160,250,0.2)',
  legendary: 'rgba(255,186,60,0.22)',
  pioneer: 'rgba(175,82,222,0.25)',
}

interface DeckEntry {
  templateId: string
  count: number
}

interface SavedDeck {
  id: string
  name: string
  updated_at: string
}

export default function DeckBuilderClient() {
  const [typeFilter, setTypeFilter] = useState<CardType | 'all'>('all')
  const [rarityFilter, setRarityFilter] = useState<GameCardRarity | 'all'>('all')
  const [maxCost, setMaxCost] = useState(7)
  const [ownedOnly, setOwnedOnly] = useState(false)
  const [dreamMode, setDreamMode] = useState(true)

  const [userId, setUserId] = useState<string | null>(null)
  const [owned, setOwned] = useState<Record<string, number>>({})
  const [deck, setDeck] = useState<DeckEntry[]>([])
  const [deckName, setDeckName] = useState('New Deck')
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null)
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([])
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; tone: 'ok' | 'err' } | null>(null)
  const [invalidFlash, setInvalidFlash] = useState<string | null>(null)

  const showToast = useCallback((msg: string, tone: 'ok' | 'err' = 'ok') => {
    setToast({ msg, tone })
    setTimeout(() => setToast(null), 3200)
  }, [])

  const flashInvalid = useCallback((reason: string) => {
    setInvalidFlash(reason)
    setTimeout(() => setInvalidFlash(null), 1600)
  }, [])

  // --- Auth + collection + saved decks ---
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null
      setUserId(uid)
      if (!uid) return
      supabase
        .from('user_cards')
        .select('template_id, quantity')
        .eq('user_id', uid)
        .then(({ data: rows }) => {
          if (rows) {
            const map: Record<string, number> = {}
            rows.forEach(r => { map[r.template_id as string] = r.quantity as number })
            setOwned(map)
          }
        })
      supabase
        .from('decks')
        .select('id, name, updated_at')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false })
        .then(({ data: rows }) => {
          if (rows) setSavedDecks(rows as SavedDeck[])
        })
    })
  }, [])

  const deckTotal = useMemo(() => deck.reduce((s, e) => s + e.count, 0), [deck])

  const deckStats = useMemo(() => {
    const stats = { rare: 0, legendary: 0, mythic: 0, pioneer: 0 }
    deck.forEach(e => {
      const tpl = CARDS_BY_ID[e.templateId]
      if (!tpl) return
      if (tpl.rarity === 'rare') stats.rare += e.count
      if (tpl.rarity === 'legendary') stats.legendary += e.count
      if (tpl.rarity === 'pioneer') stats.pioneer += e.count
    })
    return stats
  }, [deck])

  const filtered = useMemo(() => {
    return CARD_TEMPLATES.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (rarityFilter !== 'all' && t.rarity !== rarityFilter) return false
      if (t.cost > maxCost) return false
      const ownedQty = owned[t.id] ?? 0
      if (ownedOnly && ownedQty === 0) return false
      if (!dreamMode && ownedQty === 0) return false
      return true
    })
  }, [typeFilter, rarityFilter, maxCost, ownedOnly, dreamMode, owned])

  // --- Deck mutation ---
  function tryAdd(templateId: string): { ok: boolean; reason?: string } {
    const tpl = CARDS_BY_ID[templateId]
    if (!tpl) return { ok: false, reason: 'Unknown card' }
    if (deckTotal >= DECK_SIZE) return { ok: false, reason: 'Deck is full (20)' }

    const existing = deck.find(e => e.templateId === templateId)
    const nextCount = (existing?.count ?? 0) + 1
    if (nextCount > MAX_COPIES) return { ok: false, reason: 'Max 2 copies of same card' }

    if (tpl.rarity === 'rare' && deckStats.rare + 1 > MAX_RARE) return { ok: false, reason: 'Max 3 rare per deck' }
    if (tpl.rarity === 'legendary' && deckStats.legendary + 1 > MAX_LEGENDARY) return { ok: false, reason: 'Max 1 legendary per deck' }
    if (tpl.rarity === 'pioneer' && deckStats.pioneer + 1 > MAX_MYTHIC) return { ok: false, reason: 'Max 1 pioneer/mythic per deck' }

    const ownedQty = owned[tpl.id] ?? 0
    if (!dreamMode && nextCount > ownedQty) return { ok: false, reason: "You don't own enough copies" }

    return { ok: true }
  }

  function addCard(templateId: string) {
    const check = tryAdd(templateId)
    if (!check.ok) {
      flashInvalid(check.reason ?? 'Invalid')
      return
    }
    setDeck(prev => {
      const existing = prev.find(e => e.templateId === templateId)
      if (existing) {
        return prev.map(e => e.templateId === templateId ? { ...e, count: e.count + 1 } : e)
      }
      return [...prev, { templateId, count: 1 }]
    })
  }

  function removeCard(templateId: string) {
    setDeck(prev => {
      const existing = prev.find(e => e.templateId === templateId)
      if (!existing) return prev
      if (existing.count <= 1) return prev.filter(e => e.templateId !== templateId)
      return prev.map(e => e.templateId === templateId ? { ...e, count: e.count - 1 } : e)
    })
  }

  // --- Drag and drop ---
  function onDragStart(e: DragEvent, templateId: string) {
    e.dataTransfer.setData('text/template-id', templateId)
    e.dataTransfer.effectAllowed = 'copy'
  }
  function onDragOver(e: DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }
  function onDrop(e: DragEvent) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/template-id')
    if (id) addCard(id)
  }

  // --- Save / load ---
  async function handleSave() {
    if (!userId) {
      showToast('Sign in to save decks.', 'err')
      return
    }
    if (deckTotal === 0) {
      showToast('Add cards to the deck first.', 'err')
      return
    }
    setSaving(true)
    try {
      let deckId = activeDeckId
      if (deckId) {
        const { error } = await supabase
          .from('decks')
          .update({ name: deckName, updated_at: new Date().toISOString() })
          .eq('id', deckId)
          .eq('user_id', userId)
        if (error) throw error
        await supabase.from('deck_cards').delete().eq('deck_id', deckId)
      } else {
        const { data, error } = await supabase
          .from('decks')
          .insert({ user_id: userId, name: deckName })
          .select('id')
          .single()
        if (error) throw error
        deckId = data.id as string
        setActiveDeckId(deckId)
      }
      const rows = deck.map(e => ({
        deck_id: deckId!,
        template_id: e.templateId,
        count: e.count,
      }))
      const { error: dcErr } = await supabase.from('deck_cards').insert(rows)
      if (dcErr) throw dcErr
      showToast(`Saved: ${deckName}`)
      const { data: refreshed } = await supabase
        .from('decks')
        .select('id, name, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
      if (refreshed) setSavedDecks(refreshed as SavedDeck[])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      showToast(msg, 'err')
    } finally {
      setSaving(false)
    }
  }

  async function handleLoad(deckId: string) {
    if (!userId) return
    const { data: meta } = await supabase
      .from('decks')
      .select('id, name')
      .eq('id', deckId)
      .eq('user_id', userId)
      .single()
    if (!meta) {
      showToast('Deck not found', 'err')
      return
    }
    const { data: rows } = await supabase
      .from('deck_cards')
      .select('template_id, count')
      .eq('deck_id', deckId)
    setActiveDeckId(deckId)
    setDeckName(meta.name as string)
    setDeck((rows ?? []).map(r => ({ templateId: r.template_id as string, count: r.count as number })))
    showToast(`Loaded: ${meta.name}`)
  }

  function handleNew() {
    setActiveDeckId(null)
    setDeckName('New Deck')
    setDeck([])
  }

  const deckEntriesFlat = useMemo(() => {
    const out: string[] = []
    deck.forEach(e => { for (let i = 0; i < e.count; i++) out.push(e.templateId) })
    while (out.length < DECK_SIZE) out.push('')
    return out.slice(0, DECK_SIZE)
  }, [deck])

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div style={S.headerInner}>
          <Link href="/" style={S.backLink}>← voidexa</Link>
          <div>
            <span style={S.badge}>DECK FORGE</span>
            <h1 style={S.titleText}>Deck Builder</h1>
            <p style={S.subtitle}>
              Build a 20-card deck. Max 2 copies per card. Max 3 rare, 1 legendary, 1 mythic.
              {dreamMode && <span style={{ color: '#af52de', marginLeft: 8 }}>Dream Mode on — browsing all cards.</span>}
            </p>
          </div>
        </div>
      </header>

      <main style={S.main}>
        <div style={S.layout}>
          {/* LEFT — collection */}
          <section style={S.leftPane}>
            <div style={S.filters}>
              <label style={S.filterLabel}>
                Type
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value as CardType | 'all')}
                  style={S.select}
                >
                  {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t === 'all' ? 'All types' : t}</option>)}
                </select>
              </label>

              <label style={S.filterLabel}>
                Rarity
                <select
                  value={rarityFilter}
                  onChange={e => setRarityFilter(e.target.value as GameCardRarity | 'all')}
                  style={S.select}
                >
                  {RARITY_OPTIONS.map(r => <option key={r} value={r}>{r === 'all' ? 'All rarities' : r}</option>)}
                </select>
              </label>

              <label style={S.filterLabel}>
                Max cost: <span style={{ color: '#00d4ff' }}>{maxCost}</span>
                <input
                  type="range"
                  min={0}
                  max={7}
                  value={maxCost}
                  onChange={e => setMaxCost(Number(e.target.value))}
                  style={S.slider}
                />
              </label>

              <label style={S.toggleLabel}>
                <input
                  type="checkbox"
                  checked={ownedOnly}
                  onChange={e => setOwnedOnly(e.target.checked)}
                />
                Owned only
              </label>

              <label style={S.toggleLabel}>
                <input
                  type="checkbox"
                  checked={dreamMode}
                  onChange={e => setDreamMode(e.target.checked)}
                />
                <span>All cards (Dream Mode)</span>
              </label>
            </div>

            <div style={S.collection}>
              {filtered.map(tpl => {
                const ownedQty = owned[tpl.id] ?? 0
                const locked = ownedQty === 0
                return (
                  <CardTile
                    key={tpl.id}
                    template={tpl}
                    owned={ownedQty}
                    locked={locked}
                    draggable
                    onDragStart={e => onDragStart(e, tpl.id)}
                    onClick={() => addCard(tpl.id)}
                  />
                )
              })}
              {filtered.length === 0 && (
                <p style={S.empty}>No cards match the filters.</p>
              )}
            </div>
          </section>

          {/* RIGHT — deck */}
          <aside style={S.rightPane} onDragOver={onDragOver} onDrop={onDrop}>
            <div style={S.deckHeader}>
              <input
                value={deckName}
                onChange={e => setDeckName(e.target.value)}
                style={S.deckNameInput}
                maxLength={40}
              />
              <div style={S.deckCounter}>
                <span style={{ color: deckTotal === DECK_SIZE ? '#7fff9f' : '#ffffff', fontSize: 22, fontWeight: 700 }}>
                  {deckTotal}
                </span>
                <span style={{ color: 'rgba(220,216,230,0.6)', fontSize: 14 }}>/ {DECK_SIZE}</span>
              </div>
            </div>

            <div style={S.statsRow}>
              <StatPill label="Rare" value={deckStats.rare} max={MAX_RARE} />
              <StatPill label="Legend." value={deckStats.legendary} max={MAX_LEGENDARY} />
              <StatPill label="Pioneer" value={deckStats.pioneer} max={MAX_MYTHIC} />
            </div>

            {invalidFlash && (
              <div style={S.invalidFlash}>{invalidFlash}</div>
            )}

            <div style={S.deckSlots}>
              {deckEntriesFlat.map((tplId, idx) => {
                const tpl = tplId ? CARDS_BY_ID[tplId] : undefined
                return (
                  <div key={idx} style={{
                    ...S.slot,
                    borderColor: tpl ? RARITY_BORDER[tpl.rarity] : 'rgba(127,119,221,0.2)',
                    background: tpl ? `linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))` : 'rgba(127,119,221,0.05)',
                  }}>
                    <span style={S.slotNumber}>{idx + 1}</span>
                    {tpl ? (
                      <div style={S.slotContent}>
                        <div style={{ ...S.slotCost, background: `radial-gradient(circle at 35% 30%, #7ff7ff, #1d6b8a)` }}>
                          {tpl.cost}
                        </div>
                        <div style={S.slotName}>{tpl.name}</div>
                        <div style={S.slotTypeIcon}>{TYPE_ICON[tpl.type]}</div>
                        <button
                          onClick={() => removeCard(tpl.id)}
                          style={S.slotRemove}
                          aria-label={`Remove ${tpl.name}`}
                        >×</button>
                      </div>
                    ) : (
                      <span style={S.slotEmpty}>—</span>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={S.deckActions}>
              <button onClick={handleNew} style={S.secondaryBtn}>New</button>
              <select
                value={activeDeckId ?? ''}
                onChange={e => {
                  const id = e.target.value
                  if (id) handleLoad(id)
                }}
                style={{ ...S.select, flex: 1 }}
                disabled={savedDecks.length === 0}
              >
                <option value="">{savedDecks.length ? 'Load saved deck…' : 'No saved decks'}</option>
                {savedDecks.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <button
                onClick={handleSave}
                disabled={saving || !userId || deckTotal === 0}
                style={{
                  ...S.primaryBtn,
                  opacity: (saving || !userId || deckTotal === 0) ? 0.5 : 1,
                  cursor: (saving || !userId || deckTotal === 0) ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving…' : userId ? 'Save Deck' : 'Sign In to Save'}
              </button>
            </div>
          </aside>
        </div>
      </main>

      {toast && (
        <div style={{
          ...S.toast,
          borderColor: toast.tone === 'err' ? 'rgba(255,107,107,0.55)' : 'rgba(127,255,159,0.55)',
          color: toast.tone === 'err' ? '#ff9f9f' : '#bfffcf',
        }}>{toast.msg}</div>
      )}
    </div>
  )
}

// --- Card tile (collection) ---

function CardTile({
  template,
  owned,
  locked,
  draggable,
  onDragStart,
  onClick,
}: {
  template: CardTemplate
  owned: number
  locked: boolean
  draggable?: boolean
  onDragStart?: (e: DragEvent) => void
  onClick?: () => void
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
      style={{
        ...S.tile,
        borderColor: RARITY_BORDER[template.rarity],
        boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 18px ${RARITY_GLOW[template.rarity]}`,
        opacity: locked ? 0.5 : 1,
        cursor: 'pointer',
      }}
      data-rarity={template.rarity}
    >
      <div style={{ ...S.tileCost, background: `radial-gradient(circle at 35% 30%, #7ff7ff, #1d6b8a)` }}>
        {template.cost}
      </div>
      <div style={S.tileTypeIcon}>{TYPE_ICON[template.type]}</div>
      <div style={S.tileArt}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 40%, ${RARITY_GLOW[template.rarity]}, transparent 70%)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, color: RARITY_BORDER[template.rarity], opacity: 0.55,
        }}>{TYPE_ICON[template.type]}</div>
      </div>
      <div style={S.tileName}>{template.name}</div>
      <div style={S.tileAbility}>{template.abilityText}</div>
      <div style={S.tileFooter}>
        <span style={{ ...S.rarityChip, color: RARITY_BORDER[template.rarity] }}>
          {template.rarity}
        </span>
        {owned > 0 ? (
          <span style={S.ownedChip}>× {owned}</span>
        ) : (
          <span style={S.lockChip}>🔒 Dream</span>
        )}
      </div>
    </div>
  )
}

function StatPill({ label, value, max }: { label: string; value: number; max: number }) {
  const atMax = value >= max
  return (
    <div style={{
      ...S.statPill,
      color: atMax ? '#ffd166' : 'rgba(220,216,230,0.85)',
      borderColor: atMax ? 'rgba(255,209,102,0.5)' : 'rgba(127,119,221,0.25)',
    }}>
      <span style={S.statPillLabel}>{label}</span>
      <span style={S.statPillValue}>{value}/{max}</span>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000 100%)',
    color: '#e8e4f0',
    fontFamily: 'var(--font-sans)',
  },
  header: {
    borderBottom: '1px solid rgba(127,119,221,0.2)',
    background: 'linear-gradient(180deg, rgba(6,5,16,0.75) 0%, transparent 100%)',
  },
  headerInner: {
    maxWidth: 1440,
    margin: '0 auto',
    padding: '24px 28px 28px',
  },
  backLink: {
    fontSize: 14,
    color: 'rgba(148,163,184,0.8)',
    textDecoration: 'none',
    marginBottom: 16,
    display: 'inline-block',
  },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.18em',
    color: '#af52de',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
  },
  titleText: {
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #af52de, #00d4ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 1.55,
    color: 'rgba(220,216,230,0.75)',
    margin: 0,
    maxWidth: 720,
  },
  main: {
    maxWidth: 1440,
    margin: '0 auto',
    padding: '24px 28px 80px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 420px',
    gap: 24,
    alignItems: 'flex-start',
  },
  leftPane: { minWidth: 0 },
  rightPane: {
    padding: 20,
    borderRadius: 14,
    border: '1px solid rgba(127,119,221,0.3)',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.9) 0%, rgba(12,14,30,0.9) 100%)',
    position: 'sticky',
    top: 20,
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    padding: 16,
    borderRadius: 12,
    border: '1px solid rgba(127,119,221,0.2)',
    background: 'rgba(12,14,30,0.6)',
    marginBottom: 18,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.02em',
    color: 'rgba(220,216,230,0.85)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 140,
  },
  toggleLabel: {
    fontSize: 14,
    color: 'rgba(220,216,230,0.85)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    marginTop: 18,
  },
  select: {
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid rgba(127,119,221,0.3)',
    background: 'rgba(12,14,30,0.9)',
    color: '#e8e4f0',
    fontSize: 14,
    fontFamily: 'inherit',
  },
  slider: {
    width: 140,
  },
  collection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 14,
  },
  tile: {
    position: 'relative',
    height: 260,
    borderRadius: 12,
    border: '1px solid',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.95) 0%, rgba(12,14,30,0.95) 100%)',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    color: '#e8e4f0',
    transition: 'transform 0.2s, box-shadow 0.2s',
    userSelect: 'none',
  },
  tileCost: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: '50%',
    color: '#071019',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 600,
    boxShadow: '0 0 12px rgba(125,245,255,0.6)',
    zIndex: 2,
  },
  tileTypeIcon: {
    position: 'absolute',
    top: 10,
    right: 12,
    fontSize: 18,
    color: 'rgba(220,216,230,0.8)',
    zIndex: 2,
  },
  tileArt: {
    position: 'relative',
    marginTop: 36,
    height: 100,
    borderRadius: 6,
    background: '#000',
    overflow: 'hidden',
  },
  tileName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 500,
    color: '#fff',
    textShadow: '0 1px 2px rgba(0,0,0,0.6)',
  },
  tileAbility: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 1.35,
    color: 'rgba(220,216,230,0.8)',
    flex: 1,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
  tileFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  rarityChip: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  ownedChip: {
    fontSize: 13,
    fontWeight: 600,
    color: '#7fff9f',
  },
  lockChip: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(220,216,230,0.7)',
  },
  empty: {
    fontSize: 16,
    color: 'rgba(220,216,230,0.6)',
    padding: '40px 0',
    textAlign: 'center',
    gridColumn: '1 / -1',
  },
  deckHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  deckNameInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(127,119,221,0.3)',
    background: 'rgba(12,14,30,0.9)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 500,
    fontFamily: 'inherit',
  },
  deckCounter: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
  },
  statsRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 14,
  },
  statPill: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid',
    fontSize: 13,
    textAlign: 'center',
  },
  statPillLabel: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(148,163,184,0.8)',
    marginBottom: 2,
  },
  statPillValue: {
    fontSize: 14,
    fontWeight: 600,
  },
  invalidFlash: {
    marginBottom: 12,
    padding: '8px 14px',
    borderRadius: 8,
    background: 'rgba(255,107,107,0.12)',
    border: '1px solid rgba(255,107,107,0.5)',
    color: '#ffafaf',
    fontSize: 14,
    textAlign: 'center',
    animation: 'shake 0.4s',
  },
  deckSlots: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    maxHeight: '50vh',
    overflowY: 'auto',
    paddingRight: 4,
    marginBottom: 14,
  },
  slot: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minHeight: 44,
    borderRadius: 8,
    border: '1px dashed',
    paddingLeft: 38,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
  },
  slotNumber: {
    position: 'absolute',
    left: 10,
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(148,163,184,0.6)',
  },
  slotContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  slotCost: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    color: '#071019',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    flexShrink: 0,
  },
  slotName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  slotTypeIcon: {
    fontSize: 14,
    color: 'rgba(220,216,230,0.7)',
  },
  slotRemove: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: '1px solid rgba(255,107,107,0.35)',
    background: 'rgba(255,107,107,0.1)',
    color: '#ff9f9f',
    fontSize: 14,
    lineHeight: 1,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  slotEmpty: {
    fontSize: 14,
    color: 'rgba(127,119,221,0.4)',
  },
  deckActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  secondaryBtn: {
    padding: '10px 16px',
    borderRadius: 10,
    border: '1px solid rgba(127,119,221,0.3)',
    background: 'transparent',
    color: '#e8e4f0',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  primaryBtn: {
    padding: '10px 22px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #00d4ff, #af52de)',
    color: '#050210',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    fontFamily: 'inherit',
    boxShadow: '0 0 20px rgba(175,82,222,0.35)',
  },
  toast: {
    position: 'fixed',
    bottom: 28,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 22px',
    borderRadius: 10,
    background: 'rgba(12,14,30,0.96)',
    border: '1px solid',
    fontSize: 15,
    fontWeight: 500,
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    zIndex: 200,
  },
}
