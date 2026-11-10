import { test } from '@playwright/test'

// Screenshots of the important pages for reviewing the design. They are not compared with
// earlier screenshots (fonts render differently on every system); they are saved in
// test-results/ and attached to the report.

const pages = [
  ['home', '/'],
  ['c0de-overview', '/c0de/'],
  ['guide-chapter', '/c0de/guide/language'],
  ['handbook-chapter', '/c0de/reference/data'],
  ['library-function', '/c0de/minecraft/teleport'],
  ['german-function', '/de/c0de/strings/mid'],
  ['not-found', '/no/such/page'],
] as const

const sizes = [
  ['desktop', 1440, 900],
  ['low-window', 1280, 600],
  ['phone', 390, 844],
] as const

for (const scheme of ['light', 'dark'] as const) {
  for (const [size, width, height] of sizes) {
    test(`screenshots ${scheme} ${size}`, async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: scheme })
      await page.setViewportSize({ width, height })
      for (const [name, path] of pages) {
        await page.goto(path)
        await page.evaluate(() => document.fonts.ready)
        const file = testInfo.outputPath(`${name}-${scheme}-${size}.png`)
        await page.screenshot({ path: file })
        await testInfo.attach(`${name}-${scheme}-${size}`, { path: file, contentType: 'image/png' })
      }
    })
  }
}
