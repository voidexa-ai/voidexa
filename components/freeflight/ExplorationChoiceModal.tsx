'use client'

import { useState } from 'react'
import type { EncounterChoice, ExplorationEncounter } from '@/lib/game/freeflight/explorationEncounters'

interface Props {
  encounter: ExplorationEncounter
  onChoose: (choice: EncounterChoice) => void
  onDismiss: () => void
}

const OUTCOME_COLOR: Record<string, string> = {
  ghai: '#ffd166',
  lore: '#af52de',
  reputation: '#7fff9f',
  nothing: 'rgba(220,216,230,0.7)',
}

export default function ExplorationChoiceModal({ encounter, onChoose, onDismiss }: Props) {
  const [resolvedNote, setResolvedNote] = useState<string | null>(null)
  const [chosenLabel, setChosenLabel] = useState<string | null>(null)

  const handlePick = (choice: EncounterChoice) => {
    if (resolvedNote) return
    setResolvedNote(choice.note)
    setChosenLabel(choice.label)
    onChoose(choice)
  }

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.eyebrow}>Exploration · {encounter.zone}</div>
        <h2 style={S.title}>{encounter.name}</h2>
        <p style={S.flavor}>&ldquo;{encounter.flavor}&rdquo;</p>
        <p style={S.desc}>{encounter.description}</p>

        {!resolvedNote ? (
          <div style={S.choicesRow}>
            {encounter.choices.map(c => (
              <button
                key={c.id}
                onClick={() => handlePick(c)}
                style={{
                  ...S.choiceBtn,
                  borderColor: `${OUTCOME_COLOR[c.outcomeKind] ?? '#fff'}80`,
                  color: OUTCOME_COLOR[c.outcomeKind] ?? '#fff',
                }}
              >
                <span>{c.label}</span>
                {c.outcomeKind === 'ghai' && c.reward && (
                  <span style={S.rewardChip}>+{c.reward} GHAI</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div style={S.outcomeBlock}>
              <div style={S.outcomeLabel}>{chosenLabel}</div>
              <div style={S.outcomeNote}>{resolvedNote}</div>
            </div>
            <button onClick={onDismiss} style={S.primaryBtn}>Continue flying →</button>
          </>
        )}
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2,1,10,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    padding: 32,
    borderRadius: 16,
    background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))',
    border: '1px solid rgba(127,119,221,0.4)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
    color: '#e8f4ff',
    fontFamily: 'var(--font-sans)',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#af52de',
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#fff',
    margin: '0 0 8px',
  },
  flavor: {
    fontSize: 15,
    fontStyle: 'italic',
    color: 'rgba(220,216,230,0.75)',
    margin: '0 0 12px',
  },
  desc: {
    fontSize: 16,
    lineHeight: 1.55,
    color: 'rgba(220,236,255,0.88)',
    margin: '0 0 22px',
  },
  choicesRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  choiceBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    borderRadius: 10,
    border: '1px solid',
    background: 'rgba(12,14,30,0.6)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    letterSpacing: '0.01em',
  },
  rewardChip: {
    padding: '3px 10px',
    borderRadius: 999,
    background: 'rgba(255,209,102,0.14)',
    border: '1px solid rgba(255,209,102,0.5)',
    fontSize: 13,
    fontWeight: 600,
    color: '#ffd166',
  },
  outcomeBlock: {
    padding: 18,
    borderRadius: 10,
    background: 'rgba(127,119,221,0.08)',
    border: '1px solid rgba(127,119,221,0.3)',
    marginBottom: 18,
  },
  outcomeLabel: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#00d4ff',
    marginBottom: 6,
  },
  outcomeNote: {
    fontSize: 16,
    lineHeight: 1.55,
    color: 'rgba(220,236,255,0.92)',
  },
  primaryBtn: {
    display: 'block',
    width: '100%',
    padding: '12px 22px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #00d4ff, #af52de)',
    color: '#050210',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 0 22px rgba(0,212,255,0.35)',
  },
}
