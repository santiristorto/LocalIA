import type { NextFunction, Request, Response } from "express";

import { sendSuccess } from "../../core/http/response-envelope.js";
import type { TenantsService } from "../tenants/tenants.service.js";

/**
 * `GET /api/v1/me` — API Specification §2.1.
 *
 * `id`/`email`/`fullName` vienen directo del JWT ya verificado, sin
 * consultar `profiles` (no hace falta para lo que este endpoint devuelve
 * hoy). `memberships` sí requiere consultar la base — es el dato que el
 * frontend usa para decidir si mostrar el onboarding o la app ya
 * configurada, por eso este controlador depende de `TenantsService`.
 */
export function createAuthController(tenantsService: TenantsService) {
  return {
    async getMe(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        // `authorize` garantiza que `req.user` existe antes de llegar acá.
        const user = req.user!;
        const memberships = await tenantsService.getMembershipsForUser(user.id);

        sendSuccess(res, {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          memberships,
        });
      } catch (error) {
        next(error);
      }
    },
  };
}
