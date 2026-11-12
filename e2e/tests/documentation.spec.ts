import { expect, test } from '@playwright/test'
import { version } from './sources'

// The imported documentation: links between the handbooks, the c0de highlighting and the
// search.

test.use({ viewport: { width: 1440, height: 900 } })

test('the handbook overview links to the pages of the library functions', async ({ page }) => {
  await page.goto('/c0de/')
  await page.getByRole('link', { name: 'GET_PRESSURE_PLATE', exact: true }).click()
  await expect(page).toHaveURL(/\/c0de\/minecraft\/get_pressure_plate$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('GET_PRESSURE_PLATE')
  await expect(page.locator('.page-source')).toHaveText(`c0de ${version('c0de')}`)
})

test('links to sections of a handbook lead to their anchors', async ({ page }) => {
  await page.goto('/c0de/')
  await page.getByRole('link', { name: 'TYPE_STRING', exact: true }).click()
  await expect(page).toHaveURL(/\/c0de\/reference\/data#type_string$/)
  await expect(page.locator('#type_string')).toBeInViewport()
})

test('the images of the handbooks are shown', async ({ page }) => {
  await page.goto('/c0de/reference/statements')
  const recipe = page.getByRole('img', { name: 'OPERATOR recipe' })
  await recipe.scrollIntoViewIfNeeded()
  await expect
    .poll(() => recipe.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0)
})

test('c0de programs are highlighted in the colors of the blocks', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/c0de/math/abs')
  const parameter = page.locator('.shiki .line > span', { hasText: 'PARAMETER' })
  await expect(parameter).toHaveCSS('color', 'rgb(143, 31, 143)')
  await expect(parameter).toHaveCSS('font-weight', '700')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(parameter).toHaveCSS('color', 'rgb(228, 138, 228)')
})

test('the c0de net handbook is a library tab with its own chapters', async ({ page }) => {
  await page.goto('/c0de_net/http/')
  await expect(page.locator('.page-source')).toHaveText(`c0de net ${version('c0de_net')}`)
  const chapters = page.locator('nav.tabs .tab-chapter')
  await expect(chapters.first()).toHaveText('Getting started')
  await expect(chapters.last()).toHaveText('Examples')
  await expect(chapters).toHaveCount(12)
})

test('the search finds functions and opens their page', async ({ page }) => {
  await page.goto('/')
  const field = page.getByRole('combobox', { name: 'Search' })
  await field.fill('teleport')
  const results = page.getByRole('listbox', { name: 'Search results' })
  await expect(results.getByRole('option').first()).toContainText('TELEPORT')
  await field.press('Enter')
  await expect(page).toHaveURL(/\/c0de\/minecraft\/teleport/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('TELEPORT')
})

test('the search stays in the language of the page', async ({ page }) => {
  await page.goto('/de/')
  const field = page.getByRole('combobox', { name: 'Suchen' })
  await field.fill('pressure plate')
  await expect(page.getByRole('option').first()).toBeVisible()
  await page.getByRole('option').first().click()
  await expect(page).toHaveURL(/\/de\/c0de\//)
})

test('the search says when it finds nothing', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Search' }).fill('qjxvkwqjxvkw')
  await expect(page.getByText('Nothing found')).toBeVisible()
})
