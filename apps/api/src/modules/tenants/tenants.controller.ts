import type { NextFunction, Request, Response } from "express";

import { sendSuccess } from "../../core/http/response-envelope.js";
import { createTenantSchema } from "./tenants.validators.js";
import type { TenantsService } from "./tenants.service.js";

/**
 * Controlador del módulo `tenants` — traduce HTTP↔dominio, sin lógica de
 * negocio (Backend Architecture Specification §4). Recibe el servicio por
 * inyección desde el composition root (`core/container.ts`), nunca importa
 * el repositorio directamente.
 */
export function createTenantsController(service: TenantsService) {
  return {
    async createTenant(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const input = createTenantSchema.parse(req.body);
        // `authenticate` + `authorize` ya garantizaron que `req.user` existe.
        const membership = await service.createTenant(req.user!.id, input);

        sendSuccess(res, membership, 201);
      } catch (error) {
        next(error);
      }
    },
  };
}
