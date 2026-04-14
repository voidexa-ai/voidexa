import { defineConfig } from "vitest/config";

/**
 * Vitest configuration — scoped to lib/game/ tests for now.
 * Widen `include` as more test suites land.
 */
export default defineConfig({
  test: {
    include: [
      "lib/game/__tests__/**/*.test.ts",
      "lib/shop/__tests__/**/*.test.ts",
      "lib/cards/__tests__/**/*.test.ts",
    ],
    environment: "node",
    globals: false,
  },
});
