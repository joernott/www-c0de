import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// The tutorials (sprint 6): their tab, the paths as chapter tabs and the lessons as pages of a path.

const tabs = (page: import('@playwright/test').Page) => page.locator('nav.tabs')

test.use({ viewport: { width: 1440, height: 900 } })

test('the tutorials tab shows the paths and the libraries as chapter tabs', async ({ page }) => {
  await page.goto('/tutorials/')
  await expect(tabs(page).getByRole('link', { name: 'Tutorials', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
  for (const name of ['Learning to program', 'c0de for programmers', 'Libraries in practice']) {
    await expect(tabs(page).locator('.tab-chapter', { hasText: name })).toBeVisible()
  }
  await expect(page.locator('.tab-chapter')).toHaveCount(8)
  await expect(page.getByRole('heading', { name: 'The world of the tutorials' })).toBeVisible()
})

test('a lesson keeps the tab of its path selected', async ({ page }) => {
  await page.goto('/tutorials/programmers/ten-minutes')
  await expect(tabs(page).locator('[aria-current="page"]')).toHaveText('c0de for programmers')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('c0de in ten minutes')
  await expect(page.locator('a[rel="prev"]')).toHaveAttribute('href', '/tutorials/programmers/')
})

test('the overview of a path lists its lessons', async ({ page }) => {
  await page.goto('/de/tutorials/programmers/')
  const lesson = page.locator('.lessons a').first()
  await expect(lesson).toHaveText('c0de in zehn Minuten')
  await lesson.click()
  await expect(page).toHaveURL(/\/de\/tutorials\/programmers\/ten-minutes$/)
})

test('a lesson has its boxes, its programs and folded solutions', async ({ page }) => {
  await page.goto('/tutorials/programmers/ten-minutes')
  await expect(page.locator('.custom-block.info .custom-block-title')).toHaveText('What you need')
  await expect(page.locator('pre code').first()).toContainText('FUNCTION greet')
  const solution = page.locator('.content details').first()
  await expect(solution.locator('pre')).toBeHidden()
  await solution.locator('summary').click()
  await expect(solution.locator('pre')).toBeVisible()
})

test('the pages of the tutorials are accessible', async ({ page }) => {
  for (const path of [
    '/tutorials/',
    '/tutorials/programmers/ten-minutes',
    '/de/tutorials/programmers/',
  ]) {
    await page.goto(path)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations, path).toEqual([])
  }
})
