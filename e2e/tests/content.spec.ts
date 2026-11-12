import { expect, test } from '@playwright/test'
import { version } from './sources'

// The pages of the site itself: home page, legal notice, privacy policy, and what search
// engines and link previews get.

test.use({ viewport: { width: 1440, height: 900 } })

test('the home page shows both mods with their versions and links', async ({ page }) => {
  await page.goto('/')
  const mods = page.locator('.mod')
  await expect(mods).toHaveCount(2)
  // toHaveText with a string compares the whole text with normalized whitespace
  await expect(mods.nth(0).getByRole('heading')).toHaveText(`c0de ${version('c0de')}`)
  await expect(mods.nth(1).getByRole('heading')).toHaveText(`c0de net ${version('c0de_net')}`)
  await expect(mods.nth(0).getByRole('link', { name: 'Download on Modrinth' })).toHaveAttribute(
    'href',
    'https://modrinth.com/mod/T9RufCc0',
  )
  await expect(mods.nth(1).getByRole('link', { name: 'Source code on GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/joernott/minecraft-c0de-net',
  )
  await mods.nth(1).getByRole('link', { name: 'Documentation' }).click()
  await expect(page).toHaveURL(/\/c0de_net\/http\/$/)
})

test('the home page shows the screenshot, an example and the tabs', async ({ page }) => {
  await page.goto('/de/')
  const screenshot = page.locator('img.screenshot')
  await expect
    .poll(() => screenshot.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBe(1280)
  await expect(page.locator('.shiki').first()).toContainText('FUNCTION greet')
  const tabs = page.locator('.tab-overview li')
  // the tabs of c0de, the five libraries and the tutorials
  await expect(tabs).toHaveCount(7)
  await expect(tabs.first()).toContainText('12 Kapitel')
  await expect(
    page.locator('.mod').first().getByRole('link', { name: 'Dokumentation' }),
  ).toHaveAttribute('href', '/de/c0de/')
})

test('the legal notice names the operator in both languages', async ({ page }) => {
  await page.goto('/legal-notice')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Legal notice')
  await expect(page.locator('.content')).toContainText('53604 Bad Honnef')
  await expect(page.getByRole('link', { name: 'c0de@c0de.at' })).toHaveAttribute(
    'href',
    'mailto:c0de@c0de.at',
  )
  await page.getByRole('link', { name: 'Diese Seite auf Deutsch' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Impressum')
  await expect(page.locator('.content')).toContainText('Angaben gemäß § 5 DDG')
})

test('the footer leads to the privacy policy', async ({ page }) => {
  await page.goto('/de/c0de/math/abs')
  await page.locator('footer').getByRole('link', { name: 'Datenschutz' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Datenschutzerklärung')
  await expect(page.locator('.content')).toContainText('drei Monate')
})

// The only thing the site stores is the view of the programs that the reader chose (privacy
// policy; programs.spec.ts).
test('the site sets no cookies and stores nothing until the reader chooses a view', async ({
  page,
  context,
}) => {
  for (const path of [
    '/',
    '/c0de/minecraft/teleport',
    '/tutorials/learning/first-program',
    '/de/c0de/',
  ]) {
    await page.goto(path)
  }
  await page.getByRole('combobox').fill('json')
  await expect(page.getByRole('option').first()).toBeVisible()
  expect(await context.cookies()).toEqual([])
  const stored = await page.evaluate(() => [localStorage.length, sessionStorage.length])
  expect(stored).toEqual([0, 0])
})

test('every page describes itself for link previews', async ({ page }) => {
  await page.goto('/c0de/strings/mid')
  const meta = (property: string) => page.locator(`meta[property="${property}"]`)
  await expect(meta('og:title')).toHaveAttribute('content', 'MID | c0de')
  await expect(meta('og:description')).toHaveAttribute('content', 'Returns a part of a text.')
  await expect(meta('og:url')).toHaveAttribute('content', 'https://c0de.at/c0de/strings/mid')
  await expect(meta('og:image')).toHaveAttribute('content', 'https://c0de.at/og-image.png')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Returns a part of a text.',
  )
})

test('search engines get a sitemap and the robots file', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Sitemap: https://c0de.at/sitemap.xml')
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('<loc>https://c0de.at/de/c0de/math/abs</loc>')
  expect(sitemap).not.toContain('not-found')
  const preview = await request.get('/og-image.png')
  expect(preview.headers()['content-type']).toBe('image/png')
})
