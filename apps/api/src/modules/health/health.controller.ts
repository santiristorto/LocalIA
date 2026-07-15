import type { Request, Response } from "express";

import { sendSuccess } from "../../core/http/response-envelope.js";

/**
 * `GET /api/v1/health` — único endpoint de negocio del Sprint 0.
 *
 * Sirve como prueba de vida del servicio y, a partir del Sprint 1, se amplía
 * para reportar también el estado de la conexión a la base de datos
 * (DevOps & Deployment Specification §8, "uptime/synthetic checks").
 */
export function getHealth(_req: Request, res: Response): void {
  sendSuccess(res, {
    status: "ok",
    service: "localia-api",
    timestamp: new Date().toISOString(),
  });
}
