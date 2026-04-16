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
      "lib/chat/__tests__/**/*.test.ts",
      "lib/achievements/__tests__/**/*.test.ts",
      "lib/race/__tests__/**/*.test.ts",
      "lib/missions/__tests__/**/*.test.ts",
      "lib/game/battle/__tests__/**/*.test.ts",
      "components/combat/__tests__/**/*.test.ts",
    ],
    alias: {
      "@/lib": new URL("./lib", import.meta.url).pathname,
      "@/components": new URL("./components", import.meta.url).pathname,
      "@/app": new URL("./app", import.meta.url).pathname,
      "@": new URL("./", import.meta.url).pathname,
    },
    environment: "node",
    globals: false,
  },
});
