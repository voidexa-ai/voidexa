'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State { hasError: boolean }

// Error boundary for useGLTF failures. When a .glb fails to load (network, 404,
// parse error), we render a simple geometry fallback instead of crashing the
// page. Must live inside an R3F <Canvas> subtree so the fallback is a 3D mesh.
export default class ModelErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    if (typeof console !== 'undefined') {
      console.warn('[ModelErrorBoundary] model load failed, using fallback:', error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <mesh>
            <boxGeometry args={[1.2, 0.5, 2]} />
            <meshStandardMaterial color="#00d4ff" emissive="#0066aa" emissiveIntensity={0.6} />
          </mesh>
        )
      )
    }
    return this.props.children
  }
}
