import { createAuthController } from "../modules/auth/auth.controller.js";
import { createAuthRouter } from "../modules/auth/auth.routes.js";
import { createTenantsController } from "../modules/tenants/tenants.controller.js";
import { createTenantsRouter } from "../modules/tenants/tenants.routes.js";
import { TenantsRepository } from "../modules/tenants/tenants.repository.js";
import { TenantsService } from "../modules/tenants/tenants.service.js";

/**
 * Composition root — Backend Architecture Specification §5.
 *
 * Ensamblado explícito de dependencias, sin framework de DI: se instancian
 * los repositorios, después los servicios (recibiendo sus repositorios por
 * constructor), después los controladores (recibiendo sus servicios), y
 * finalmente los routers (recibiendo sus controladores). `app.ts` monta los
 * routers ya armados, sin conocer cómo se construyeron.
 */
const tenantsRepository = new TenantsRepository();
const tenantsService = new TenantsService(tenantsRepository);
const tenantsController = createTenantsController(tenantsService);
const tenantsRouter = createTenantsRouter(tenantsController);

const authController = createAuthController(tenantsService);
const authRouter = createAuthRouter(authController);

export const container = {
  tenantsService,
  tenantsRouter,
  authRouter,
};
