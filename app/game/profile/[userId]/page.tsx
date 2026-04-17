import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import PilotCard from '@/components/profile/PilotCard'
import TalesLog from '@/components/profile/TalesLog'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import UniverseWallFeed from '@/components/universe-wall/UniverseWallFeed'
import { computeReputation } from '@/lib/game/reputation/summary'
import { buildTalesFeed } from '@/lib/game/reputation/tales'

export const metadata: Metadata = {
  title: 'Pilot Profile — voidexa',
  description: 'Public pilot profile. Reputation card, composed title, Tales log.',
}

interface Props {
  params: Promise<{ userId: string }>
}

export default async function PilotProfilePage({ params }: Props) {
  const { userId } = await params
  const sb = await createServerSupabaseClient()
  const { data: viewer } = await sb.auth.getUser()
  const isOwner = viewer?.user?.id === userId

  // Reputation row may not exist for brand-new pilots — treat null as defaults.
  const [repRes, missionsRes, battlesRes, speedrunRes, haulingRes] = await Promise.all([
    sb.from('pilot_reputation').select('*').eq('user_id', userId).maybeSingle(),
    sb.from('mission_acceptances')
      .select('id, mission_id, status, outcome_grade, completed_at')
      .eq('user_id', userId),
    sb.from('battle_sessions')
      .select('id, status, boss_template, ended_at, turns_played')
      .eq('user_id', userId),
    sb.from('speedrun_times')
      .select('id, track_id, duration_ms, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    sb.from('hauling_contracts')
      .select('id, mission_template, destination_planet, outcome_grade, status, completed_at')
      .eq('user_id', userId),
  ])

  if (repRes.error && repRes.error.code !== 'PGRST116') {
    // Hard error other than "no row" — show 404.
    notFound()
  }

  const missions = (missionsRes.data ?? [])
  const battles  = (battlesRes.data ?? [])
  const hauling  = (haulingRes.data ?? [])
  const speedrun = (speedrunRes.data ?? [])

  const summary = computeReputation({ missions, battles, hauling, speedrun })
  const tales = buildTalesFeed({ missions, battles, speedrun, hauling }, 20)

  const profile = {
    userId,
    pilotName: repRes.data?.pilot_name ?? `Pilot ${userId.slice(0, 6)}`,
    composedTitle: repRes.data?.composed_title ?? null,
    knownFor: repRes.data?.known_for ?? null,
    activeSince: repRes.data?.active_since ?? null,
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0a0620 0%, #05030f 60%, #000 100%)',
      color: '#e8e4f0',
      fontFamily: 'var(--font-sans)',
      paddingBottom: 80,
    }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 28px' }}>
        <PilotCard profile={profile} summary={summary} />
        {isOwner && (
          <ProfileEditForm
            userId={userId}
            initialPilotName={profile.pilotName}
            initialKnownFor={profile.knownFor ?? ''}
          />
        )}
        <TalesLog tales={tales} />
        <div style={{ marginTop: 24 }}>
          <UniverseWallFeed forUserId={userId} pageSize={10} />
        </div>
      </main>
    </div>
  )
}
