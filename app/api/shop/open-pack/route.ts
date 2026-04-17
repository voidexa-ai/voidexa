import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { PACK_DEFS, type PackTier } from '@/lib/game/packs/types'
import { rollPack, downgradeMythic, resolveCard } from '@/lib/game/packs/rollPack'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

function admin() {
  return createClient(SUPABASE_URL, SERVICE_KEY)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const tier = body.tier as PackTier
    if (!tier || !PACK_DEFS[tier]) {
      return NextResponse.json({ error: 'invalid tier' }, { status: 400 })
    }

    // Authenticated user.
    const sb = await createServerSupabaseClient()
    const { data: userData } = await sb.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'not signed in' }, { status: 401 })
    }

    const def = PACK_DEFS[tier]
    const openId = crypto.randomUUID()

    // 1. Check balance.
    const adminSb = admin()
    const { data: wallet } = await adminSb
      .from('user_credits')
      .select('ghai_balance_platform')
      .eq('user_id', userId)
      .maybeSingle()
    if (!wallet || (wallet.ghai_balance_platform ?? 0) < def.priceGhai) {
      return NextResponse.json({ error: 'insufficient GHAI' }, { status: 402 })
    }

    // 2. Write ledger debit (idempotent via partial unique index).
    const { error: debitErr } = await adminSb.from('ghai_transactions').insert({
      user_id: userId,
      amount: def.priceGhai,
      type: 'debit',
      product: `pack_${tier}`,
      tx_signature: openId,
    })
    if (debitErr && (debitErr as { code?: string }).code !== '23505') {
      return NextResponse.json({ error: debitErr.message }, { status: 500 })
    }

    // 3. Deduct balance.
    const newBalance = (wallet.ghai_balance_platform ?? 0) - def.priceGhai
    await adminSb
      .from('user_credits')
      .update({ ghai_balance_platform: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    // 4. Roll the pack.
    const roll = rollPack(tier)

    // 5. If Mythic rolled, try to atomically decrement supply. On failure,
    //    downgrade the best slot to Legendary.
    let finalCardIds = [...roll.cardIds]
    let finalRarities = [...roll.rarities]
    let mythicPulled = false
    let mythicRemaining: number | null = null
    if (roll.mythicPulled && roll.mythicCardId) {
      const { data: current } = await adminSb
        .from('mythic_supply')
        .select('pulled, total_minted')
        .eq('card_id', roll.mythicCardId)
        .maybeSingle()
      if (current && current.pulled < current.total_minted) {
        const { data: bumped, error: bumpErr } = await adminSb
          .from('mythic_supply')
          .update({ pulled: current.pulled + 1, updated_at: new Date().toISOString() })
          .eq('card_id', roll.mythicCardId)
          .eq('pulled', current.pulled) // optimistic concurrency
          .select('pulled, total_minted')
          .maybeSingle()
        if (bumped && !bumpErr) {
          mythicPulled = true
          mythicRemaining = (bumped.total_minted ?? 50) - (bumped.pulled ?? 0)
          // Universe Wall announcement.
          const { data: profile } = await adminSb
            .from('pilot_reputation')
            .select('pilot_name')
            .eq('user_id', userId)
            .maybeSingle()
          const actorName = profile?.pilot_name || `Pilot ${userId.slice(0, 6)}`
          await adminSb.from('universe_wall').insert({
            event_type: 'mythic_pull',
            actor_user_id: userId,
            actor_name: actorName,
            payload: {
              card_id: roll.mythicCardId,
              tier,
              remaining: mythicRemaining,
            },
          })
        } else {
          // Concurrency lost — downgrade.
          const dg = downgradeMythic()
          finalCardIds[finalCardIds.length - 1] = dg.cardId
          finalRarities[finalRarities.length - 1] = dg.rarity
        }
      } else {
        // Supply exhausted — downgrade.
        const dg = downgradeMythic()
        finalCardIds[finalCardIds.length - 1] = dg.cardId
        finalRarities[finalRarities.length - 1] = dg.rarity
      }
    }

    // 6. Grant cards to user_cards (upsert — quantity increments by 1 each).
    for (const cardId of finalCardIds) {
      const { data: existing } = await adminSb
        .from('user_cards')
        .select('quantity')
        .eq('user_id', userId)
        .eq('template_id', cardId)
        .maybeSingle()
      if (existing) {
        await adminSb
          .from('user_cards')
          .update({ quantity: (existing.quantity ?? 0) + 1 })
          .eq('user_id', userId)
          .eq('template_id', cardId)
      } else {
        await adminSb.from('user_cards').insert({
          user_id: userId,
          template_id: cardId,
          quantity: 1,
          acquired_from: 'pack',
        })
      }
    }

    return NextResponse.json({
      ok: true,
      cardIds: finalCardIds,
      rarities: finalRarities,
      mythicPulled,
      mythicRemaining,
      newBalance,
      cards: finalCardIds.map(id => resolveCard(id)),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
