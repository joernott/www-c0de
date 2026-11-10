// Lighthouse CI (npm run lighthouse): checks performance, accessibility, best practices and
// search engine optimization of typical pages against minimum scores. It runs against the
// same server as the end-to-end tests (E2E_BASE_URL, default https://localhost) with the
// Chromium of Playwright.
const { chromium } = require('@playwright/test')

process.env.CHROME_PATH ??= chromium.executablePath()
const base = process.env.E2E_BASE_URL ?? 'https://localhost'
const pages = [
  '/',
  '/de/',
  '/c0de/',
  '/c0de/reference/data',
  '/c0de/minecraft/teleport',
  '/privacy',
]

module.exports = {
  ci: {
    collect: {
      url: pages.map((page) => base + page),
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--headless=new --ignore-certificate-errors --no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: { target: 'filesystem', outputDir: 'lighthouse' },
  },
}
