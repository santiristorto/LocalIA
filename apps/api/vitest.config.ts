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
      // No hace falta que sea alcanzable por red: los tests inyectan un
      // JWKS local (`test-utils/sign-test-jwt.ts`), nunca resuelven contra
      // este host de verdad. Solo se usa para construir el `iss` esperado.
      SUPABASE_URL: "http://localhost:54321",
      // Valores de relleno: requeridos por el esquema Zod, pero ningún
      // test los usa de verdad (usan `FakeTenantsRepository`, nunca
      // `prisma-client.ts`) — ver `test-utils/build-test-app.ts`.
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      DIRECT_URL: "postgresql://test:test@localhost:5432/test",
      // Sprint 5 (WhatsApp conectado). Valor de relleno para
      // WHATSAPP_APP_SECRET — los tests de firma usan este mismo valor
      // (ver `whatsapp-signature.test.ts`) para poder generar una firma
      // válida sin depender de un secreto real.
      WHATSAPP_APP_SECRET: "test-app-secret",
      WHATSAPP_VERIFY_TOKEN: "test-verify-token",
    },
  },
});
