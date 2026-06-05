import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only pick up files in tests/unit/
    include: ["tests/unit/**/*.test.{js,jsx,ts,tsx}"],
    // Node environment — no DOM needed for unit tests
    environment: "node",
    // Coverage via v8 (fast, no instrumentation overhead)
    coverage: {
      provider: "v8",
      include: ["lib/**", "utils/**", "hooks/**", "components/**"],
      exclude: ["**/*.test.*", "node_modules/**"],
      reporter: ["text", "html"],
    },
  },
});
