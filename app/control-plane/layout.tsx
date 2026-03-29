// app/control-plane/layout.tsx
// Standalone full-viewport layout for the admin control plane.
// Sits above the global Navigation via z-index and provides its own scroll context.

import type { ReactNode } from 'react'

export default function ControlPlaneLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#030308',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}
