import { defineConfig, devices } from '@playwright/test';

/**
 * Конфигурация интеграционных тестов Playwright.
 * Тесты запускаются против приложения, которое поднимает webpack-dev-server.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.ts?(x)',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npx webpack serve --mode=development --no-open',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
