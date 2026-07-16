import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    // Variables mínimas para que `core/config/env.ts` valide correctamente
    // al importarse — sin esto, cualquier test que toque `app.ts` fallaría
    // en el arranque, no en la aserción.
    env: {
      NODE_ENV: "test",
      LOG_LEVEL: "error",
      SUPABASE_JWT_SECRET: "test-secret-not-for-production-min-32-chars",
    },
  },
});
