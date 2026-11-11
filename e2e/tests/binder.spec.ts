import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// The ring binder: tabs, scrolling, languages, page navigation, small screens, accessibility.

const mainTabs = [
  'c0de',
  'c0de/math',
  'c0de/strings',
  'c0de/time',
  'c0de/minecraft',
  'c0de_net/http',
  'Tutorials',
]

// The tab column (its label is in the language of the page).
const tabs = (page: Page) => page.locator('nav.tabs')
const scroller = (page: Page) => page.locator('.tabs-scroller')

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('the home page shows the main tabs and no chapter tabs', async ({ page }) => {
    await page.goto('/')
    await expect(tabs(page).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    for (const name of mainTabs) {
      await expect(tabs(page).getByRole('link', { name, exact: true })).toBeVisible()
    }
    await expect(page.locator('.tab-chapter')).toHaveCount(0)
  })

  test('a library shows its chapter tabs below its main tab', async ({ page }) => {
    await page.goto('/c0de/math/sgn')
    await expect(page.locator('.tab-chapter')).toHaveCount(16)
    const current = tabs(page).locator('[aria-current="page"]')
    await expect(current).toHaveText('SGN')
    // the chapter tabs are between c0de/math and c0de/strings
    const math = await tabs(page)
      .getByRole('link', { name: 'c0de/math', exact: true })
      .boundingBox()
    const strings = await tabs(page)
      .getByRole('link', { name: 'c0de/strings', exact: true })
      .boundingBox()
    const sgn = await current.boundingBox()
    expect(sgn!.y).toBeGreaterThan(math!.y)
    expect(sgn!.y).toBeLessThan(strings!.y)
  })

  test('the c0de tab separates the guide from the handbooks', async ({ page }) => {
    await page.goto('/c0de/')
    await expect(page.locator('.tab-chapter')).toHaveCount(12)
    await expect(page.locator('.tab-chapter .tab-book')).toHaveCount(6)
    await expect(page.locator('.tabs-group-start')).toHaveCount(1)
    await expect(tabs(page).getByRole('link', { name: 'c0de', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  test('the current tab is drawn in front of the page edge', async ({ page }) => {
    await page.goto('/c0de/math/sgn')
    const front = await tabs(page)
      .locator('[aria-current="page"]')
      .evaluate((el) => getComputedStyle(el).zIndex)
    const back = await tabs(page)
      .getByRole('link', { name: 'ABS' })
      .evaluate((el) => getComputedStyle(el).zIndex)
    const edge = await page.locator('.tabs-edge').evaluate((el) => getComputedStyle(el).zIndex)
    expect(Number(front)).toBeGreaterThan(Number(edge))
    expect(Number(back)).toBeLessThan(Number(edge))
  })

  test('the previous and the next page are linked', async ({ page }) => {
    await page.goto('/c0de/math/sgn')
    await expect(page.locator('a[rel="prev"]')).toContainText('ABS')
    await expect(page.locator('a[rel="next"]')).toContainText('SQR')
    await page.locator('a[rel="next"]').click()
    await expect(page).toHaveURL(/\/c0de\/math\/sqr$/)
    await expect(tabs(page).locator('[aria-current="page"]')).toHaveText('SQR')
  })

  test('the language switch leads to the same page in German and back', async ({ page }) => {
    await page.goto('/c0de/guide/getting-started')
    await page.getByRole('link', { name: 'Diese Seite auf Deutsch' }).click()
    await expect(page).toHaveURL(/\/de\/c0de\/guide\/getting-started$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    // c0de has a German translation of its documentation since 0.4.0
    await expect(page.getByRole('note')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Erste Schritte')
    await expect(tabs(page).locator('[aria-current="page"]')).toHaveText('Erste Schritte')
    await page.getByRole('link', { name: 'This page in English' }).click()
    await expect(page).toHaveURL(/\/c0de\/guide\/getting-started$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('every page names its versions in all languages', async ({ page }) => {
    await page.goto('/de/c0de/math/abs')
    const alternates = await page
      .locator('link[rel="alternate"]')
      .evaluateAll((links) =>
        links.map((l) => `${l.getAttribute('hreflang')} ${l.getAttribute('href')}`),
      )
    expect(alternates).toEqual([
      'en https://c0de.at/c0de/math/abs',
      'de https://c0de.at/de/c0de/math/abs',
      'x-default https://c0de.at/c0de/math/abs',
    ])
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://c0de.at/de/c0de/math/abs',
    )
  })

  test('the tabs work with the keyboard', async ({ page }) => {
    await page.goto('/')
    const link = tabs(page).getByRole('link', { name: 'c0de/time', exact: true })
    await link.focus()
    await expect(link).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/c0de\/time\/$/)
    await expect(page.locator('.tab-chapter')).toHaveCount(12)
  })
})

test.describe('low window', () => {
  test.use({ viewport: { width: 1280, height: 520 } })

  test('the tabs scroll with buttons', async ({ page }) => {
    await page.goto('/c0de/minecraft/')
    const up = page.getByRole('button', { name: 'Scroll the tabs up' })
    const down = page.getByRole('button', { name: 'Scroll the tabs down' })
    await scroller(page).evaluate((el) => el.scrollTo({ top: 0 }))
    await expect(down).toBeVisible()
    await expect(up).toBeHidden()
    const before = await scroller(page).evaluate((el) => el.scrollTop)
    await down.click()
    await expect.poll(() => scroller(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(before)
    await expect(up).toBeVisible()
  })

  test('the current tab is scrolled into view', async ({ page }) => {
    await page.goto('/c0de/minecraft/teleport')
    const box = await scroller(page).boundingBox()
    const current = await tabs(page).locator('[aria-current="page"]').boundingBox()
    expect(current!.y).toBeGreaterThanOrEqual(box!.y)
    expect(current!.y + current!.height).toBeLessThanOrEqual(box!.y + box!.height)
    // the house tab stays on top
    await expect(tabs(page).getByRole('link', { name: 'Home' })).toBeInViewport()
  })

  test('the page does not scroll when the current tab is scrolled into view', async ({ page }) => {
    await page.goto('/c0de/minecraft/teleport')
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })
})

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the tabs become a menu and the rings disappear', async ({ page }) => {
    await page.goto('/c0de/strings/mid')
    await expect(page.locator('.spine')).toBeHidden()
    await expect(page.locator('.tabs')).toBeHidden()
    const menu = page.locator('.menu-button')
    await expect(menu).toContainText('MID')
    await menu.click()
    const panel = page.locator('.menu-panel')
    await expect(panel.getByRole('link', { name: 'LEFT' })).toBeVisible()
    await panel.getByRole('link', { name: 'c0de/time' }).click()
    await expect(page).toHaveURL(/\/c0de\/time\/$/)
    await expect(panel).toBeHidden()
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } })

  test('the pages and the tabs are rendered on the server', async ({ page }) => {
    await page.goto('/de/c0de/math/abs')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('ABS')
    await expect(tabs(page).locator('[aria-current="page"]')).toHaveText('ABS')
    await expect(page.getByText('Gibt den Betrag einer Zahl zurück.')).toBeVisible()
  })

  test('the not-found page is rendered in the language of the URL', async ({ page }) => {
    const response = await page.goto('/de/gibt/es/nicht')
    expect(response?.status()).toBe(404)
    await expect(page.getByText('Diese Seite gibt es nicht.')).toBeVisible()
  })
})

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`accessibility in ${colorScheme} mode`, () => {
    test.use({ colorScheme, viewport: { width: 1440, height: 900 } })

    for (const path of [
      '/',
      '/c0de/',
      '/c0de/reference/data',
      '/de/c0de_net/http/http_get',
      '/no/page',
    ]) {
      test(`${path} has no violations`, async ({ page }) => {
        await page.goto(path)
        const results = await new AxeBuilder({ page }).analyze()
        expect(
          results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`),
        ).toEqual([])
      })
    }
  })
}
