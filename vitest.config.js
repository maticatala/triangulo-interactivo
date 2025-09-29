// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.js', 'tests/integration/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'playwright.config.js', // excluye Playwright config
        'tests/e2e/**',         // excluye tests E2E
        'vitest.config.js',      // excluye este config
        'node_modules/**'
      ]
    }
  }
})
