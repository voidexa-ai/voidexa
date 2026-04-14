'use client'

import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { CompanyPlanet, Industry } from './companies'
import { INDUSTRY_META } from './companies'

interface Props {
  planets: CompanyPlanet[]
}

// Connect every pair of planets that share an industry (excluding the sun and mystery nodes)
export default function Constellations({ planets }: Props) {
  const edges = useMemo(() => {
    const byIndustry = new Map<Industry, CompanyPlanet[]>()
    planets
      .filter(p => !p.isSun && !p.isMystery && p.industry !== 'unknown')
      .forEach(p => {
        const list = byIndustry.get(p.industry) ?? []
        list.push(p)
        byIndustry.set(p.industry, list)
      })

    const result: { key: string; a: [number, number, number]; b: [number, number, number]; color: string }[] = []
    byIndustry.forEach((group, industry) => {
      if (group.length < 2) return
      const color = INDUSTRY_META[industry].color
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          result.push({
            key: `${group[i].id}-${group[j].id}`,
            a: group[i].position,
            b: group[j].position,
            color,
          })
        }
      }
    })
    return result
  }, [planets])

  if (edges.length === 0) return null

  return (
    <>
      {edges.map(e => (
        <Line
          key={e.key}
          points={[e.a, e.b]}
          color={e.color}
          lineWidth={0.6}
          transparent
          opacity={0.08}
          dashed
          dashScale={2.5}
          toneMapped={false}
        />
      ))}
    </>
  )
}
