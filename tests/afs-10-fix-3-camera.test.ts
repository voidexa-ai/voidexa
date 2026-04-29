import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, test } from 'vitest'

const GALAXY_CANVAS = readFileSync(
  resolve(__dirname, '../components/galaxy/GalaxyCanvas.tsx'),
  'utf-8',
)
const GALAXY_SCENE = readFileSync(
  resolve(__dirname, '../components/galaxy/GalaxyScene.tsx'),
  'utf-8',
)
const SYSTEM_CANVAS = readFileSync(
  resolve(__dirname, '../components/starmap/StarMapCanvas.tsx'),
  'utf-8',
)
const SYSTEM_SCENE = readFileSync(
  resolve(__dirname, '../components/starmap/StarMapScene.tsx'),
  'utf-8',
)

describe('AFS-10-FIX-3 — galaxy view camera (pull-back-only)', () => {
  test('GalaxyCanvas camera position is [0, 3, 38]', () => {
    expect(GALAXY_CANVAS).toMatch(/position:\s*\[0,\s*3,\s*38\]/)
  })

  test('GalaxyCanvas FOV unchanged at 60', () => {
    expect(GALAXY_CANVAS).toMatch(/fov:\s*60/)
  })

  test('GalaxyScene OrbitControls maxDistance is 100', () => {
    expect(GALAXY_SCENE).toMatch(/maxDistance=\{100\}/)
  })

  test('GalaxyScene OrbitControls minDistance unchanged at 8', () => {
    expect(GALAXY_SCENE).toMatch(/minDistance=\{8\}/)
  })
})

describe('AFS-10-FIX-3 — system view camera (pull-back-only)', () => {
  test('StarMapCanvas camera position is [0, 0, 12]', () => {
    expect(SYSTEM_CANVAS).toMatch(/position:\s*\[0,\s*0,\s*12\]/)
  })

  test('StarMapCanvas FOV unchanged at 60', () => {
    expect(SYSTEM_CANVAS).toMatch(/fov:\s*60/)
  })

  test('StarMapScene OrbitControls maxDistance is 80', () => {
    expect(SYSTEM_SCENE).toMatch(/maxDistance=\{80\}/)
  })

  test('StarMapScene OrbitControls minDistance unchanged at 5', () => {
    expect(SYSTEM_SCENE).toMatch(/minDistance=\{5\}/)
  })
})
