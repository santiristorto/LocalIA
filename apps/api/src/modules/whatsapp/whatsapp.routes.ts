import { Router } from "express";

import { authenticate as defaultAuthenticate } from "../../core/middlewares/authenticate.js";
import { authorize } from "../../core/middlewares/authorize.js";
import type { createRequireTenantRole } from "../../core/middlewares/require-tenant-role.js";
import type { createWhatsappController } from "./whatsapp.controller.js";

interface TenantParams {
  [key: string]: string;
  tenantId: string;
}

/**
 * Rutas del modulo whatsapp (Sprint 5).
 *
 * `GET`/`POST /webhooks/whatsapp` son publicas a proposito — las llama
 * Meta, no un usuario con sesion (no hay JWT que mandar). Se protegen con
 * su propio mecanismo dentro del controller (verify token / firma HMAC),
 * no con `authenticate`.
 *
 * `POST /tenants/:tenantId/whatsapp/test-message` si sigue el patron
 * estandar de la app: `authenticate` + `authorize()` + `requireTenantRole`
 * — mismo criterio de escritura que ya usa `menu.routes.ts`
 * (`owner`/`manager`), reutilizando el mismo middleware del Sprint 4.
 */
export function createWhatsappRouter(
  controller: ReturnType<typeof createWhatsappController>,
  requireTenantRole: ReturnType<typeof createRequireTenantRole>,
  authenticateMiddleware = defaultAuthenticate,
): Router {
  const router = Router();

  router.get("/webhooks/whatsapp", controller.verifyWebhook);
  router.post("/webhooks/whatsapp", controller.receiveWebhook);

  router.post<TenantParams>(
    "/tenants/:tenantId/whatsapp/test-message",
    authenticateMiddleware,
    authorize(),
    requireTenantRole(["owner", "manager"]),
    controller.sendTestMessage,
  );

  return router;
}
