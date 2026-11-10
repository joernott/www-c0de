import { expect, test } from '@playwright/test'

// The security headers of the server, and that the site works with them: the
// Content-Security-Policy allows only the scripts of the site.

test.use({ viewport: { width: 1440, height: 900 } })

test('the pages work with the Content-Security-Policy', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  for (const path of [
    '/',
    '/c0de/',
    '/c0de/minecraft/teleport',
    '/de/c0de_net/http/',
    '/no/page',
  ]) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }
  // navigation in the browser, the search and the language switch run scripts
  await page.goto('/c0de/')
  await page.getByRole('link', { name: 'GET_PRESSURE_PLATE', exact: true }).click()
  await page.getByRole('combobox').fill('json')
  await expect(page.getByRole('option').first()).toBeVisible()
  await page.getByRole('link', { name: 'Diese Seite auf Deutsch' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')

  expect(errors.filter((e) => !e.includes('404'))).toEqual([])
})

test('the server sends the security headers', async ({ request }) => {
  const response = await request.get('/c0de/')
  const headers = response.headers()
  expect(headers['content-security-policy']).toMatch(/script-src 'self'( 'sha256-[^']+')+;/)
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['cache-control']).toBe('no-cache')
  expect(headers['etag']).toBeTruthy()
  expect(headers['server']).toBeUndefined()
})

test('assets are cached for good and sent compressed', async ({ page, request }) => {
  await page.goto('/')
  const script = await page.locator('script[type="module"]').first().getAttribute('src')
  const response = await request.get(script!, { headers: { 'Accept-Encoding': 'br' } })
  expect(response.headers()['cache-control']).toBe('public, max-age=31536000, immutable')
  expect(response.headers()['content-encoding']).toBe('br')
})

// The redirect of www is tested by the Go tests and the ACME test (contrib/pebble), which
// have names for it; www.localhost doesn't resolve everywhere.
