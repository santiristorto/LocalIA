import { createAuthenticate } from "../core/middlewares/authenticate.js";
import { createAuthController } from "../modules/auth/auth.controller.js";
import { createAuthRouter } from "../modules/auth/auth.routes.js";
import { createTenantsController } from "../modules/tenants/tenants.controller.js";
import { createTenantsRouter } from "../modules/tenants/tenants.routes.js";
import { TenantsService } from "../modules/tenants/tenants.service.js";
import { createApp } from "../app.js";
import { FakeTenantsRepository } from "./fake-tenants-repository.js";
import { getTestJWKS } from "./sign-test-jwt.js";

/**
 * Construye una app Express completa (mismos middlewares, mismas rutas,
 * misma lógica de negocio) pero con dos reemplazos deliberados para no
 * depender de nada externo en los tests:
 *   - `TenantsRepository` → `FakeTenantsRepository` (sin Prisma/Postgres).
 *   - `authenticate` real (JWKS remoto de Supabase) → `authenticate` con un
 *     JWKS local (`getTestJWKS`), sin llamadas de red reales.
 */
export async function buildTestApp() {
  const tenantsRepository = new FakeTenantsRepository();
  const tenantsService = new TenantsService(tenantsRepository);

  const testAuthenticate = createAuthenticate(await getTestJWKS());

  const tenantsController = createTenantsController(tenantsService);
  const tenantsRouter = createTenantsRouter(
    tenantsController,
    testAuthenticate,
  );

  const authController = createAuthController(tenantsService);
  const authRouter = createAuthRouter(authController, testAuthenticate);

  const app = createApp({ authRouter, tenantsRouter });

  return { app, tenantsRepository };
}
