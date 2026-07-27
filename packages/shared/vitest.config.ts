import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['domains/**/__tests__/**/*.test.ts', 'domains/**/__integration__/**/*.test.ts'],
    passWithNoTests: true,
    testTimeout: 30000,
    fileParallelism: false,
  },
});
