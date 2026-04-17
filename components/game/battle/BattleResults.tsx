'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CARD_TEMPLATES, type CardTemplate } from '@/lib/game/cards/index'
import { BOSS_DEFS, type BossId, type PveTierId } from '@/lib/game/battle/encounters'
import { creditGhai } from '@/lib/credits/credit'
import { useActiveQuestChain } from '@/lib/game/quests/progress'
import type { BattleConfig } from './BattleController'

export type BattleOutcome = 'victory' | 'defeat'

interface Props {
  outcome: BattleOutcome
  config: BattleConfig
  turnsPlayed: number
  onRetry: () => void
  onExit: () => void
}

const TIER_REWARDS: Record<PveTierId, { ghai: number; xp: number }> = {
  1: { ghai: 30, xp: 25 },
  2: { ghai: 60, xp: 50 },
  3: { ghai: 110, xp: 90 },
  4: { ghai: 180, xp: 150 },
  5: { ghai: 280, xp: 240 },
}

function rewardFor(config: BattleConfig): { ghai: number; xp: number } {
  if (config.kind === 'boss') {
    const def = BOSS_DEFS[config.bossId]
    return { ghai: def.reward.ghai, xp: Math.round(def.reward.ghai * 0.8) }
  }
  return TIER_REWARDS[config.tier]
}

function bossTemplate(config: BattleConfig): string {
  return config.kind === 'boss' ? config.bossId : `tier_${config.tier}`
}

function pickLootCard(config: BattleConfig): CardTemplate {
  const rarityByTier: Record<PveTierId, string[]> = {
    1: ['common'],
    2: ['common', 'uncommon'],
    3: ['uncommon', 'rare'],
    4: ['rare', 'legendary'],
    5: ['rare', 'legendary'],
  }
  const rarityByBoss: Record<Exclude<BossId, 'kestrel'>, string[]> = {
    lantern_auditor: ['common', 'uncommon'],
    varka:           ['rare', 'legendary'],
    choir_sight:     ['rare', 'legendary'],
    patient_wreck:   ['legendary', 'mythic'],
  }
  const allowed = config.kind === 'boss'
    ? rarityByBoss[config.bossId]
    : rarityByTier[config.tier]
  const pool = CARD_TEMPLATES.filter(c => allowed.includes(c.rarity))
  const source = pool.length > 0 ? pool : CARD_TEMPLATES
  return source[Math.floor(Math.random() * source.length)]
}

export default function BattleResults({ outcome, config, turnsPlayed, onRetry, onExit }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const questChain = useActiveQuestChain()
  const reward = outcome === 'victory' ? rewardFor(config) : { ghai: 0, xp: 0 }
  const [loot] = useState<CardTemplate | null>(outcome === 'victory' ? pickLootCard(config) : null)
  const template = bossTemplate(config)

  useEffect(() => { void finalizeBattle() /* eslint-disable-line react-hooks/exhaustive-deps */ }, [])

  async function finalizeBattle() {
    try {
      setSaving(true)
      setErr(null)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setSaving(false)
        return
      }
      const { data: session, error } = await supabase.from('battle_sessions').insert({
        user_id: userData.user.id,
        mode: 'pve',
        boss_template: template,
        ship_id: 'qs_bob',
        status: outcome === 'victory' ? 'won' : 'lost',
        seed: String(Date.now()),
        turns_played: turnsPlayed,
        reward_ghai: reward.ghai,
        started_at: new Date(Date.now() - turnsPlayed * 3000).toISOString(),
        ended_at: new Date().toISOString(),
      }).select('id').single()
      if (error) {
        setErr(error.message)
      } else {
        if (outcome === 'victory') {
          if (reward.ghai > 0 && session?.id) {
            await creditGhai(userData.user.id, reward.ghai, {
              source: 'battle',
              sourceId: session.id as string,
            })
          }
          if (loot) {
            await supabase.from('user_cards').upsert(
              {
                user_id: userData.user.id,
                template_id: loot.id,
                quantity: 1,
                acquired_from: 'mission',
              },
              { onConflict: 'user_id,template_id' },
            )
          }
          // Sprint 3 Task 1: advance First Day Real Sky if this battle matches.
          void questChain.recordEvent({ type: 'battle_victory', target: template })
        }
        setSaved(true)
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Finalize failed')
    } finally {
      setSaving(false)
    }
  }

  const color = outcome === 'victory' ? '#7fff9f' : '#ff6b6b'

  return (
    <div style={S.wrap}>
      <div style={{ ...S.card, borderColor: `${color}80`, boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 40px ${color}30` }}>
        <div style={{ ...S.eyebrow, color }}>
          {outcome === 'victory' ? 'Victory' : 'Ship Down'}
        </div>
        <h2 style={S.title}>
          {outcome === 'victory' ? 'You Win!' : 'Defeated'}
        </h2>

        {outcome === 'victory' ? (
          <>
            <div style={S.rewardGrid}>
              <Reward label="GHAI" value={`+${reward.ghai}`} accent="#ffd166" />
              <Reward label="XP" value={`+${reward.xp}`} accent="#00d4ff" />
              <Reward label="Turns" value={`${turnsPlayed}`} />
            </div>
            {loot && (
              <div style={S.lootBox}>
                <div style={S.lootLabel}>CARD DROP</div>
                <div style={S.lootName}>{loot.name}</div>
                <div style={S.lootType}>{loot.type} · {loot.rarity}</div>
                <div style={S.lootAbility}>{loot.abilityText}</div>
              </div>
            )}
          </>
        ) : (
          <p style={S.defeatText}>
            Your ship took too much damage. No rewards this run — rebuild your deck or drop a tier.
          </p>
        )}

        {saving && <div style={S.note}>Saving battle…</div>}
        {saved && !err && <div style={{ ...S.note, color: '#bfffcf' }}>Battle recorded.</div>}
        {err && <div style={{ ...S.note, color: '#ff9f9f' }}>{err}</div>}

        <div style={S.actions}>
          <button onClick={onExit} style={S.secondaryBtn}>Back to Menu</button>
          <button onClick={onRetry} style={S.primaryBtn}>
            {outcome === 'victory' ? 'Fight Again' : 'Retry'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Reward({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={S.reward}>
      <div style={S.rewardLabel}>{label}</div>
      <div style={{ ...S.rewardValue, color: accent ?? '#fff' }}>{value}</div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: { position: 'fixed', inset: 0, background: 'rgba(2,1,10,0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80, padding: 20 },
  card: { width: '100%', maxWidth: 520, padding: 32, borderRadius: 16, background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))', border: '1px solid', color: '#e8e4f0', fontFamily: 'var(--font-sans)', textAlign: 'center' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 22px' },
  rewardGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 },
  reward: { padding: '12px 10px', borderRadius: 10, background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)' },
  rewardLabel: { fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.85)', fontWeight: 600, marginBottom: 4 },
  rewardValue: { fontSize: 22, fontWeight: 700 },
  lootBox: { padding: 18, borderRadius: 12, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.35)', marginBottom: 20, textAlign: 'left' },
  lootLabel: { fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00d4ff', fontWeight: 600, marginBottom: 6 },
  lootName: { fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 2 },
  lootType: { fontSize: 13, color: 'rgba(220,216,230,0.65)', marginBottom: 8, textTransform: 'capitalize' },
  lootAbility: { fontSize: 14, lineHeight: 1.5, color: 'rgba(220,216,230,0.85)' },
  defeatText: { fontSize: 15, lineHeight: 1.6, color: 'rgba(220,216,230,0.85)', margin: '0 0 22px' },
  note: { fontSize: 14, color: 'rgba(220,216,230,0.8)', marginBottom: 12 },
  actions: { display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 6 },
  secondaryBtn: { padding: '12px 20px', borderRadius: 10, border: '1px solid rgba(127,119,221,0.35)', background: 'transparent', color: '#e8e4f0', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
  primaryBtn: { padding: '12px 26px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #00d4ff, #af52de)', color: '#050210', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', fontFamily: 'inherit', boxShadow: '0 0 22px rgba(0,212,255,0.35)' },
}
