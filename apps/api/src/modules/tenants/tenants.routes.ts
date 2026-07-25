import { Router } from "express";

import { authenticate as defaultAuthenticate } from "../../core/middlewares/authenticate.js";
import { authorize } from "../../core/middlewares/authorize.js";
import type { createTenantsController } from "./tenants.controller.js";

/**
 * `POST /api/v1/tenants` — API Specification §3.1: alta de un comercio
 * nuevo. Es, en la práctica, lo que dispara el onboarding.
 */
export function createTenantsRouter(
  controller: ReturnType<typeof createTenantsController>,
  authenticateMiddleware = defaultAuthenticate,
): Router {
  const router = Router();

  router.post(
    "/tenants",
    authenticateMiddleware,
    authorize(),
    controller.createTenant,
  );

  return router;
}
