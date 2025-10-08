/**
 * E2E Tests: Text-to-Image Generation Flow
 */

import { test, expect } from '@playwright/test'

test.describe('Text-to-Image Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the generation page', async ({ page }) => {
    await expect(page).toHaveTitle(/Byteflow/)
    await expect(page.locator('h1')).toContainText(/generate/i)
  })

  test('should have form elements', async ({ page }) => {
    // Check for prompt input
    const promptInput = page.getByPlaceholder(/describe the image/i)
    await expect(promptInput).toBeVisible()

    // Check for model selector
    await expect(page.getByText(/model/i)).toBeVisible()

    // Check for size selector
    await expect(page.getByText(/size/i)).toBeVisible()

    // Check for generate button
    const generateButton = page.getByRole('button', { name: /generate/i })
    await expect(generateButton).toBeVisible()
  })

  test('should validate empty prompt', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i })
    await generateButton.click()

    // Should show validation error
    await expect(page.getByText(/prompt is required/i)).toBeVisible()
  })

  test('should enable generate button when form is valid', async ({ page }) => {
    const promptInput = page.getByPlaceholder(/describe the image/i)
    await promptInput.fill('A beautiful sunset over mountains')

    const generateButton = page.getByRole('button', { name: /generate/i })
    await expect(generateButton).toBeEnabled()
  })

  test('should show loading state during generation', async ({ page }) => {
    // Fill form
    const promptInput = page.getByPlaceholder(/describe the image/i)
    await promptInput.fill('Test image generation')

    // Start generation
    const generateButton = page.getByRole('button', { name: /generate/i })
    await generateButton.click()

    // Should show loading indicator
    await expect(page.getByText(/generating/i)).toBeVisible()
  })
})
