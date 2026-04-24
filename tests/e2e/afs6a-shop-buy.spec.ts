// Sprint AFS-6a — shop BUY → inventory → wallet E2E flow.
//
// NOTE: Playwright is not installed in voidexa-ai/voidexa; the E2E suite
// lives in the sibling voidexa-ai/voidexa-tests repo. This file is the
// canonical spec for AFS-6a and should be copied into that repo's
// `specs/` directory on next sync (same pattern as AFS-4). Until then
// it is a documentation artifact.
//
// To run (once copied into voidexa-tests):
//   npx playwright test specs/afs6a-shop-buy.spec.ts

import { expect, test } from '@playwright/test'

const BASE_URL = process.env.VOIDEXA_BASE_URL ?? 'https://voidexa.com'
const TEST_EMAIL = process.env.VOIDEXA_TEST_EMAIL
const TEST_PASSWORD = process.env.VOIDEXA_TEST_PASSWORD

test.describe('AFS-6a — shop BUY flow', () => {
  test.skip(
    !TEST_EMAIL || !TEST_PASSWORD,
    'Requires VOIDEXA_TEST_EMAIL + VOIDEXA_TEST_PASSWORD fixtures',
  )

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`)
    await page.getByLabel(/email/i).fill(TEST_EMAIL!)
    await page.getByLabel(/password/i).fill(TEST_PASSWORD!)
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL(u => !u.toString().includes('/auth/login'))
  })

  test('cosmetic BUY deducts GHAI and shows up in /inventory', async ({ page }) => {
    await page.goto(`${BASE_URL}/shop`)
    // Open the modal for the first non-pack item tile.
    await page.getByRole('button', { name: /crimson fighter/i }).first().click()

    // The new BuyButton should render with the word "Buy" (no Coming Soon).
    const buy = page.getByRole('button', { name: /^buy$/i })
    await expect(buy).toBeVisible()
    await buy.click()

    // Success toast — "Acquired · ..." text.
    await expect(page.getByText(/acquired/i)).toBeVisible({ timeout: 8000 })

    // Inventory should now list the skin.
    await page.goto(`${BASE_URL}/inventory`)
    await expect(page.getByText(/crimson fighter/i)).toBeVisible()

    // Wallet balance decreased (Starter item costs 50 GHAI).
    await page.goto(`${BASE_URL}/wallet`)
    await expect(page.getByText(/balance/i)).toBeVisible()
  })

  test('card_pack tile redirects to /shop/packs', async ({ page }) => {
    await page.goto(`${BASE_URL}/shop`)
    await page
      .getByRole('tab', { name: /card\s*packs/i })
      .click()
    await page.getByRole('button').filter({ hasText: /pack/i }).first().click()

    const openPacks = page.getByRole('button', { name: /open packs/i })
    await expect(openPacks).toBeVisible()
    await openPacks.click()

    await page.waitForURL(/\/shop\/packs/)
    await expect(page).toHaveURL(/\/shop\/packs/)
  })

  test('unauthenticated /inventory redirects to login', async ({ browser }) => {
    const clean = await browser.newContext({ storageState: undefined })
    const p = await clean.newPage()
    await p.goto(`${BASE_URL}/inventory`)
    await expect(p).toHaveURL(/\/auth\/login\?redirect=%2Finventory/)
    await clean.close()
  })
})
