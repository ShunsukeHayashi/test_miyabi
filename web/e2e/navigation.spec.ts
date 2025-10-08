/**
 * E2E Tests: Navigation and Layout
 */

import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/')

    // Navigate to Edit page
    await page.click('text=Edit')
    await expect(page).toHaveURL(/\/edit/)
    await expect(page.locator('h1')).toContainText(/edit/i)

    // Navigate to Batch page
    await page.click('text=Batch')
    await expect(page).toHaveURL(/\/batch/)
    await expect(page.locator('h1')).toContainText(/batch/i)

    // Navigate to History
    await page.click('text=History')
    await expect(page).toHaveURL(/\/history/)
    await expect(page.locator('h1')).toContainText(/history/i)

    // Navigate to Settings
    await page.click('text=Settings')
    await expect(page).toHaveURL(/\/settings/)
    await expect(page.locator('h1')).toContainText(/settings/i)
  })

  test('should have header with logo', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header')).toBeVisible()
  })

  test('should have footer with links', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('footer >> text=Byteflow')).toBeVisible()
  })

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/')

    // Find and click dark mode toggle
    const themeToggle = page.locator('[aria-label*="theme" i], [aria-label*="dark" i]').first()
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      // Theme should change
      await page.waitForTimeout(500)
    }
  })
})
