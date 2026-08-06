import { createAuthenticate } from "../core/middlewares/authenticate.js";
import { createRequireTenantRole } from "../core/middlewares/require-tenant-role.js";
import { createAuthController } from "../modules/auth/auth.controller.js";
import { createAuthRouter } from "../modules/auth/auth.routes.js";
import { createMenuController } from "../modules/menu/menu.controller.js";
import { createMenuRouter } from "../modules/menu/menu.routes.js";
import { MenuService } from "../modules/menu/menu.service.js";
import { createTenantsController } from "../modules/tenants/tenants.controller.js";
import { createTenantsRouter } from "../modules/tenants/tenants.routes.js";
import { TenantsService } from "../modules/tenants/tenants.service.js";
import { createApp } from "../app.js";
import { FakeMenuCategoriesRepository } from "./fake-menu-categories-repository.js";
import { FakeMenuItemsRepository } from "./fake-menu-items-repository.js";
import { FakeTenantsRepository } from "./fake-tenants-repository.js";
import { getTestJWKS } from "./sign-test-jwt.js";

/**
 * Construye una app Express completa (mismos middlewares, mismas rutas,
 * misma lógica de negocio) pero con reemplazos deliberados para no
 * depender de nada externo en los tests:
 *   - `TenantsRepository`/`MenuCategoriesRepository`/`MenuItemsRepository`
 *     → sus versiones `Fake*` en memoria (sin Prisma/Postgres).
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

  const menuCategoriesRepository = new FakeMenuCategoriesRepository();
  const menuItemsRepository = new FakeMenuItemsRepository();
  const menuService = new MenuService(
    menuCategoriesRepository,
    menuItemsRepository,
  );
  const menuController = createMenuController(menuService);
  const requireTenantRole = createRequireTenantRole(tenantsService);
  const menuRouter = createMenuRouter(
    menuController,
    requireTenantRole,
    testAuthenticate,
  );

  const app = createApp({ authRouter, tenantsRouter, menuRouter });

  return {
    app,
    tenantsRepository,
    menuCategoriesRepository,
    menuItemsRepository,
  };
}
