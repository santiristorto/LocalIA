import { Router } from "express";

import { authenticate as defaultAuthenticate } from "../../core/middlewares/authenticate.js";
import { authorize } from "../../core/middlewares/authorize.js";
import type { createAuthController } from "./auth.controller.js";

export function createAuthRouter(
  controller: ReturnType<typeof createAuthController>,
  authenticateMiddleware = defaultAuthenticate,
): Router {
  const router = Router();

  router.get("/me", authenticateMiddleware, authorize(), controller.getMe);

  return router;
}
