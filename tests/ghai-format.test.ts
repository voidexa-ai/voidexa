import { describe, it, expect } from 'vitest'
import {
  USD_TO_GHAI,
  usdToGhai,
  centsToGhai,
  formatGhai,
  formatUsdAsGhai,
  formatCentsAsGhai,
} from '@/lib/ghai/format'

describe('ghai format — usdToGhai', () => {
  it('converts $1.99 → 199 GHAI', () => {
    expect(usdToGhai(1.99)).toBe(199)
  })

  it('converts $3.00 → 300 GHAI', () => {
    expect(usdToGhai(3.0)).toBe(300)
  })

  it('converts $0.50 → 50 GHAI', () => {
    expect(usdToGhai(0.5)).toBe(50)
  })

  it('zero in, zero out', () => {
    expect(usdToGhai(0)).toBe(0)
  })

  it('clamps negative input to zero', () => {
    expect(usdToGhai(-1)).toBe(0)
  })

  it('USD_TO_GHAI constant is 100 (platform rate is locked)', () => {
    expect(USD_TO_GHAI).toBe(100)
  })
})

describe('ghai format — formatGhai', () => {
  it('formats 424 as "424 GHAI"', () => {
    expect(formatGhai(424)).toBe('424 GHAI')
  })

  it('inserts thousands separators', () => {
    expect(formatGhai(12345)).toBe('12,345 GHAI')
  })

  it('floors fractional values', () => {
    expect(formatGhai(99.9)).toBe('99 GHAI')
  })
})

describe('ghai format — formatUsdAsGhai', () => {
  it('$4.24 → "424 GHAI"', () => {
    expect(formatUsdAsGhai(4.24)).toBe('424 GHAI')
  })

  it('$1.99 → "199 GHAI"', () => {
    expect(formatUsdAsGhai(1.99)).toBe('199 GHAI')
  })
})

describe('ghai format — cents helpers', () => {
  it('centsToGhai is 1:1 integer mapping ($1 = 100¢ = 100 GHAI)', () => {
    expect(centsToGhai(300)).toBe(300)
  })

  it('formatCentsAsGhai renders shop price cents as GHAI', () => {
    expect(formatCentsAsGhai(199)).toBe('199 GHAI')
    expect(formatCentsAsGhai(1200)).toBe('1,200 GHAI')
  })
})
