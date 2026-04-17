'use client'

import dynamic from 'next/dynamic'

const HomeCinematic = dynamic(() => import('./HomeCinematic'), {
  ssr: false,
  loading: () => <HomeCinematicLoading />,
})

function HomeCinematicLoading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#02060f',
        color: 'rgba(230,240,255,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-sans)',
      }}
    >
      Initializing voidexa…
    </div>
  )
}

export default function HomeRoot() {
  return <HomeCinematic />
}
