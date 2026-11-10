import { defineConfig, devices } from '@playwright/test'

// The tests run against the container (make run on the VM, the e2e workflow in CI). It uses
// certificates from Caddy's local CA, which the browsers don't know.
export default defineConfig({
  testDir: 'tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'https://localhost',
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
})
