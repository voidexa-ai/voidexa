import type { ReputationSummary } from '@/lib/game/reputation/summary'

interface PilotProfile {
  userId: string
  pilotName: string
  composedTitle: string | null
  knownFor: string | null
  activeSince: string | null
}

interface Props {
  profile: PilotProfile
  summary: ReputationSummary
}

export default function PilotCard({ profile, summary }: Props) {
  const activeSince = profile.activeSince
    ? new Date(profile.activeSince).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null

  return (
    <section style={S.wrap}>
      <div style={S.eyebrow}>PILOT PROFILE</div>
      <h1 style={S.name}>{profile.pilotName}</h1>
      {profile.composedTitle && (
        <div style={S.title}>— {profile.composedTitle}</div>
      )}

      <div style={S.statsRow}>
        <Stat label="Successful hauls" value={summary.successfulHauls} accent="#7fff9f" />
        <Stat label="Missions completed" value={summary.missionsCompleted} accent="#00d4ff" />
        <Stat label="Bosses defeated" value={summary.bossesDefeated} accent="#ff8a3c" />
        <Stat label="Tier 5 boss wins" value={summary.tier5BossesDefeated} accent="#ffd166" />
        <Stat label="Speedrun entries" value={summary.speedrunWins} accent="#af52de" />
      </div>

      {profile.knownFor && (
        <div style={S.knownFor}>
          <span style={S.knownForLabel}>KNOWN FOR</span>
          <span style={S.knownForText}>{profile.knownFor}</span>
        </div>
      )}

      {activeSince && (
        <div style={S.activeSince}>Active since {activeSince}</div>
      )}
    </section>
  )
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div style={S.stat}>
      <div style={S.statLabel}>{label}</div>
      <div style={{ ...S.statValue, color: accent ?? '#fff' }}>{value}</div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    padding: 32,
    borderRadius: 16,
    border: '1px solid rgba(127,119,221,0.28)',
    background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(12,14,30,0.9))',
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.22em',
    color: '#00d4ff',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  name: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#fff',
    margin: 0,
  },
  title: {
    fontSize: 16,
    color: '#ffd166',
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 20,
    textShadow: '0 0 10px rgba(255,209,102,0.35)',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 10,
    marginTop: 18,
    marginBottom: 20,
  },
  stat: {
    padding: '12px 14px',
    borderRadius: 10,
    background: 'rgba(127,119,221,0.08)',
    border: '1px solid rgba(127,119,221,0.22)',
  },
  statLabel: {
    fontSize: 12,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(148,163,184,0.85)',
    fontWeight: 600,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 700,
  },
  knownFor: {
    padding: '12px 16px',
    borderRadius: 10,
    background: 'rgba(127,119,221,0.06)',
    border: '1px solid rgba(127,119,221,0.2)',
    marginBottom: 14,
  },
  knownForLabel: {
    fontSize: 11,
    letterSpacing: '0.18em',
    color: 'rgba(148,163,184,0.85)',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginRight: 10,
  },
  knownForText: {
    fontSize: 16,
    color: '#e8f4ff',
  },
  activeSince: {
    fontSize: 14,
    color: 'rgba(220,216,230,0.65)',
    letterSpacing: '0.02em',
  },
}
