'use client'

import type { QuestStep } from '@/lib/game/quests/chains/firstDayRealSky'
import { getStepByIdAcrossChains } from '@/lib/game/quests/chains'

interface Props {
  step: QuestStep
  completedIds: ReadonlySet<string>
  onSkip: () => void
  visible: boolean
}

const ISSUER_META: Record<string, { name: string; color: string }> = {
  jix:        { name: 'Jix',        color: '#ffd166' },
  claude:     { name: 'Claude',     color: '#7fd8ff' },
  gpt:        { name: 'GPT',        color: '#af52de' },
  gemini:     { name: 'Gemini',     color: '#9cff9c' },
  perplexity: { name: 'Perplexity', color: '#ff8a3c' },
  llama:      { name: 'Llama',      color: '#ff6b6b' },
}

export default function TutorialGuide({ step, completedIds, onSkip, visible }: Props) {
  if (!visible) return null
  const issuer = ISSUER_META[step.issuer] ?? ISSUER_META.jix
  // Look up which chain this step belongs to so we can show the chain name
  // and full step count in the header.
  const lookup = getStepByIdAcrossChains(step.id)
  const chainName = lookup?.chain.name ?? 'Quest Chain'
  const totalSteps = lookup?.chain.steps.length ?? 4
  const chainSteps = lookup?.chain.steps ?? []
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>
        <span style={S.eyebrowLabel}>{chainName}</span>
        <button onClick={onSkip} style={S.skipBtn}>Skip tutorial</button>
      </div>
      <div style={S.stepHeader}>
        <span style={{ ...S.stepNum, color: issuer.color, borderColor: `${issuer.color}88` }}>
          Step {step.stepNumber} / {totalSteps}
        </span>
        <span style={{ ...S.category, color: issuer.color }}>{step.category}</span>
      </div>
      <h3 style={S.name}>{step.name}</h3>
      <p style={S.objective}>{step.objective}</p>
      <blockquote style={{ ...S.quote, borderLeftColor: issuer.color }}>
        <span style={{ ...S.speaker, color: issuer.color }}>{issuer.name}:</span>
        <span style={S.quoteText}>&ldquo;{step.castLine}&rdquo;</span>
      </blockquote>
      <div style={S.progressRow}>
        {chainSteps.map(s => (
          <span
            key={s.id}
            style={{
              ...S.pip,
              background: completedIds.has(s.id)
                ? '#7fff9f'
                : s.id === step.id
                  ? issuer.color
                  : 'rgba(127,119,221,0.25)',
            }}
            aria-label={s.name}
          />
        ))}
      </div>
      <div style={S.rewardRow}>
        Reward <b style={{ color: '#ffd166' }}>{step.rewardGhai} GHAI</b>
        <span style={S.rewardHint}>(Chain bonus on completion: 600 GHAI + title)</span>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'fixed',
    top: 80,
    left: 24,
    zIndex: 24,
    width: 340,
    padding: '18px 20px',
    background: 'rgba(6,10,20,0.82)',
    border: '1px solid rgba(255,209,102,0.45)',
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 0 24px rgba(255,209,102,0.18)',
    fontFamily: 'var(--font-sans)',
    color: '#e8f4ff',
    letterSpacing: '0.01em',
  },
  eyebrow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eyebrowLabel: {
    fontSize: 12,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#ffd166',
    fontWeight: 600,
    textShadow: '0 0 8px rgba(255,209,102,0.5)',
  },
  skipBtn: {
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid rgba(220,216,230,0.25)',
    background: 'transparent',
    color: 'rgba(220,216,230,0.6)',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  stepHeader: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 6,
  },
  stepNum: {
    padding: '3px 10px',
    borderRadius: 999,
    border: '1px solid',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  category: {
    fontSize: 12,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    margin: '4px 0 10px',
  },
  objective: {
    fontSize: 14,
    lineHeight: 1.55,
    color: 'rgba(220,236,255,0.88)',
    margin: '0 0 12px',
  },
  quote: {
    margin: '0 0 14px',
    padding: '10px 14px',
    borderLeft: '3px solid',
    background: 'rgba(127,119,221,0.08)',
    borderRadius: '0 8px 8px 0',
    fontSize: 14,
    lineHeight: 1.55,
  },
  speaker: {
    fontWeight: 600,
    marginRight: 6,
  },
  quoteText: {
    fontStyle: 'italic',
    color: 'rgba(220,236,255,0.88)',
  },
  progressRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 12,
  },
  pip: {
    width: 30,
    height: 6,
    borderRadius: 3,
    transition: 'background 0.4s',
  },
  rewardRow: {
    fontSize: 14,
    color: 'rgba(220,236,255,0.85)',
  },
  rewardHint: {
    display: 'block',
    fontSize: 12,
    color: 'rgba(220,216,230,0.55)',
    marginTop: 3,
  },
}
