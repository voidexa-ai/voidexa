/**
 * Sprint 5 — Task 2: 30 trade goods loader.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 7, rows 1–30.
 *
 * JSON-backed so the catalog file stays small. Runtime imports the data
 * once and exposes typed helpers.
 */

import tradeGoodsJson from './tradeGoods.json'

export type TradeCategory =
  | 'perishable'
  | 'raw material'
  | 'refined goods'
  | 'tech components'
  | 'luxury'
  | 'contraband'

export type Zone = 'Core Zone' | 'Inner Ring' | 'Mid Ring' | 'Outer Ring' | 'Deep Void'

export interface TradeGood {
  id: string
  name: string
  category: TradeCategory
  sourceZone: Zone
  destinationZones: Zone[]
  baseValueGhai: number
  weight: number
  riskNotes: string
  lore: string
}

interface RawTradeGood {
  id: string
  name: string
  category: string
  sourceZone: string
  destinationZones: string[]
  baseValueGhai: number
  weight: number
  riskNotes: string
  lore: string
}

export const TRADE_GOODS: readonly TradeGood[] = Object.freeze(
  (tradeGoodsJson as RawTradeGood[]).map(g => ({
    id: g.id,
    name: g.name,
    category: g.category as TradeCategory,
    sourceZone: g.sourceZone as Zone,
    destinationZones: g.destinationZones as Zone[],
    baseValueGhai: g.baseValueGhai,
    weight: g.weight,
    riskNotes: g.riskNotes,
    lore: g.lore,
  })),
)

export function getTradeGood(id: string): TradeGood | undefined {
  return TRADE_GOODS.find(g => g.id === id)
}

export function tradeGoodsFrom(zone: Zone): TradeGood[] {
  return TRADE_GOODS.filter(g => g.sourceZone === zone)
}
