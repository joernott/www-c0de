import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// The programs in 3D (sprint 8): every complete program has a switch between its text and a 3D
// model of its sheet; the model loads only when the reader asks for it.

test.use({ viewport: { width: 1280, height: 900 } })
// Without a graphics card, the browsers of the tests draw with the processor: slowly.
test.describe.configure({ timeout: 120_000 })

const hasWebGL = (page: Page) =>
  page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'))

// violations collects the reports of the Content-Security-Policy of the page.
async function violations(page: Page): Promise<string[]> {
  const found: string[] = []
  page.on('console', (message) => {
    if (/Content[- ]Security[- ]Policy/i.test(message.text())) found.push(message.text())
  })
  await page.exposeFunction('reportViolation', (text: string) => found.push(text))
  await page.addInitScript(() =>
    document.addEventListener('securitypolicyviolation', (event) =>
      (window as unknown as { reportViolation: (t: string) => void }).reportViolation(
        `${event.violatedDirective}: ${event.blockedURI}`,
      ),
    ),
  )
  return found
}

const loaded = (view: import('@playwright/test').Locator) =>
  expect
    .poll(
      () =>
        view.locator('model-viewer').evaluate((viewer) => (viewer as { loaded?: boolean }).loaded),
      {
        timeout: 60_000,
      },
    )
    .toBe(true)

test('a program shows its text first and loads the 3D model on request', async ({ page }) => {
  const blocked = await violations(page)
  const scripts: string[] = []
  page.on('request', (request) => {
    if (request.resourceType() === 'script') scripts.push(request.url())
  })
  await page.goto('/tutorials/learning/first-program')
  test.skip(!(await hasWebGL(page)), 'no WebGL in this browser')
  const view = page.locator('.program-view').first()
  await expect(view.locator('pre code')).toContainText('PROGRAM sign')
  const text = view.getByRole('button', { name: 'Text' })
  const model = view.getByRole('button', { name: '3D' })
  await expect(text).toHaveAttribute('aria-pressed', 'true')
  expect(scripts.some((url) => url.includes('model-viewer'))).toBe(false)

  await model.click()
  await expect(model).toHaveAttribute('aria-pressed', 'true')
  await expect(view.locator('pre code')).toBeHidden()
  await loaded(view)
  // Vue sets alt as property of the web component
  expect(
    await view.locator('model-viewer').evaluate((viewer) => (viewer as { alt?: string }).alt),
  ).toBe('The program sign on its sheet, as 3D model')
  expect(blocked).toEqual([])

  await text.click()
  await expect(view.locator('pre code')).toBeVisible()
  await expect(view.locator('model-viewer')).toHaveCount(0)
})

test('pointing at a block shows its text', async ({ page }) => {
  await page.goto('/tutorials/learning/first-program')
  test.skip(!(await hasWebGL(page)), 'no WebGL in this browser')
  const view = page.locator('.program-view').first()
  await view.getByRole('button', { name: '3D' }).click()
  await loaded(view)
  const viewer = view.locator('model-viewer')
  const box = (await viewer.boundingBox())!
  const seen = new Set<string>()
  for (let y = 0.15; y < 0.9; y += 0.05) {
    for (let x = 0.1; x < 0.9; x += 0.04) {
      await page.mouse.move(box.x + box.width * x, box.y + box.height * y)
      const tip = await view
        .locator('.program-view-tip')
        .textContent({ timeout: 50 })
        .catch(() => null)
      if (tip) seen.add(tip)
    }
    if (seen.has('sign') && seen.has('Line 0')) break
  }
  // the label of the program and the number of its first line
  expect([...seen]).toEqual(expect.arrayContaining(['sign', 'Line 0']))
})

test('the choice of the 3D view is kept for the next page', async ({ page }) => {
  await page.goto('/de/tutorials/learning/first-program')
  test.skip(!(await hasWebGL(page)), 'no WebGL in this browser')
  await page.locator('.program-view').first().getByRole('button', { name: '3D' }).click()
  await page.goto('/de/tutorials/learning/variables')
  const view = page.locator('.program-view').first()
  await expect(view.getByRole('button', { name: '3D' })).toHaveAttribute('aria-pressed', 'true')
  // <model-viewer> loads the model only when it comes into view
  await view.scrollIntoViewIfNeeded()
  await loaded(view)
  expect(
    await view.locator('model-viewer').evaluate((viewer) => (viewer as { alt?: string }).alt),
  ).toMatch(/als 3D-Modell$/)
  const results = await new AxeBuilder({ page }).include('.program-view').analyze()
  expect(results.violations).toEqual([])
})

test('the complete programs of the guide have the switch, fragments have none', async ({
  page,
}) => {
  await page.goto('/c0de/guide/examples')
  test.skip(!(await hasWebGL(page)), 'no WebGL in this browser')
  await expect(page.locator('.program-view').first()).toBeVisible()
  await page.goto('/c0de/reference/statements')
  const blocks = await page.locator('.content div[class*="language-c0de"]').count()
  const views = await page.locator('.program-view').count()
  expect(views).toBeLessThan(blocks)
})
