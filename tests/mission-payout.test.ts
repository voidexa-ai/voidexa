import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const MISSION_SRC = readFileSync(
  join(process.cwd(), 'components', 'freeflight', 'useActiveMission.ts'),
  'utf8',
)
const CREDIT_API_SRC = readFileSync(
  join(process.cwd(), 'app', 'api', 'wallet', 'credit', 'route.ts'),
  'utf8',
)

describe('mission auto-payout — sprint 13d', () => {
  it('mission completion calls creditGhai with the mission source + acceptance id', () => {
    // Auto-payout is the main goal of the sprint — must be wired.
    expect(MISSION_SRC).toMatch(/creditGhai\(/)
    expect(MISSION_SRC).toMatch(/source:\s*['"]mission['"]/)
    expect(MISSION_SRC).toMatch(/sourceId:\s*active\.acceptanceId/)
  })

  it('reward is the avg of rewardMin/rewardMax and passed to onPayout on success', () => {
    expect(MISSION_SRC).toMatch(/mission\.rewardMin\s*\+\s*mission\.rewardMax/)
    expect(MISSION_SRC).toMatch(/onPayout\(reward,\s*mission\.name\)/)
  })

  it('the acceptance row is flipped to completed before the credit fires (idempotency anchor)', () => {
    // Update to completed must happen before creditGhai, so replays resolve to
    // already-credited rather than accidentally double-paying.
    const updIdx = MISSION_SRC.indexOf("status: 'completed'")
    const creditIdx = MISSION_SRC.indexOf('creditGhai(')
    expect(updIdx).toBeGreaterThan(-1)
    expect(creditIdx).toBeGreaterThan(updIdx)
  })
})

describe('/api/wallet/credit — sprint 13d', () => {
  it('rejects unauthenticated requests with 401', () => {
    expect(CREDIT_API_SRC).toMatch(/if\s*\(!user\)/)
    expect(CREDIT_API_SRC).toMatch(/status:\s*401/)
  })

  it('rejects negative or zero amounts with 400', () => {
    expect(CREDIT_API_SRC).toMatch(/amountUsd\s*<=\s*0/)
    expect(CREDIT_API_SRC).toMatch(/status:\s*400/)
  })

  it('caps a single credit at $100 (sane upper bound for gameplay payouts)', () => {
    expect(CREDIT_API_SRC).toMatch(/amountUsd\s*>\s*100/)
  })

  it('uses the unique-violation (23505) branch as the idempotency anchor', () => {
    expect(CREDIT_API_SRC).toMatch(/['"]23505['"]/)
    expect(CREDIT_API_SRC).toMatch(/already_credited:\s*true/)
  })

  it('credits ghai_balance_platform at the $1 = 100 GHAI rate', () => {
    expect(CREDIT_API_SRC).toMatch(/USD_TO_GHAI\s*=\s*100/)
    expect(CREDIT_API_SRC).toMatch(/ghai_balance_platform/)
  })
})
