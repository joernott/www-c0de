import { expect, test } from '@playwright/test'

test('the home page is in English and links to German', async ({ page }) => {
  const failed: string[] = []
  page.on('requestfailed', (request) => failed.push(request.url()))

  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('c0de')

  await page.getByRole('link', { name: 'Deutsch' }).click()
  await expect(page).toHaveURL(/\/de\/?$/)
  await expect(page.getByText('Programmieren in Minecraft, Block für Block.')).toBeVisible()
  expect(failed).toEqual([])
})

test('the German home page links back to English', async ({ page }) => {
  await page.goto('/de/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await page.getByRole('link', { name: 'English' }).click()
  await expect(page.getByText('Programming in Minecraft, one block at a time.')).toBeVisible()
})

test('a missing page answers 404 and says so', async ({ page }) => {
  const response = await page.goto('/no/such/page')
  expect(response?.status()).toBe(404)
  await expect(page.getByText('This page does not exist.')).toBeVisible()
})

test('a missing German page says so in German', async ({ page }) => {
  await page.goto('/de/keine/seite')
  await expect(page.getByText('Diese Seite gibt es nicht.')).toBeVisible()
})

test('HTTP redirects to HTTPS', async ({ request, baseURL }) => {
  test.skip(!baseURL?.startsWith('https:'), 'the server runs without HTTPS')
  const http = (baseURL ?? '').replace(/^https:/, 'http:')
  const response = await request.get(`${http}/de/`, { maxRedirects: 0 })
  expect(response.status()).toBe(308)
  expect(response.headers()['location']).toBe(`${baseURL}/de/`)
})
