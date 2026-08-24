import { defineConfig } from '@playwright/test';

/**
 * E2E smoke tests run against the static export served by
 * `npm run preview` (the GitHub Pages simulation), so asset URLs,
 * the base path, and 404 behavior are exercised exactly as deployed.
 *
 * Run `npm run build` first so out/ is fresh.
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Isolated port (argv) so E2E never collides with dev/preview servers on 8080.
    command: 'node ./scripts/serve-export.js 3100',
    url: 'http://127.0.0.1:3100/Project-Adobo-Website/',
    reuseExistingServer: true,
    timeout: 20_000,
  },
});
