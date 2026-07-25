import type { Request, Response } from "express";

import { sendSuccess } from "../../core/http/response-envelope.js";

/**
 * `GET /api/v1/health` — prueba de vida del servicio, sin autenticación.
 *
 * Candidato natural para ampliarse con el estado de la conexión a la base
 * de datos (DevOps & Deployment Specification §8, "uptime/synthetic
 * checks") el día que un incidente real lo justifique — hoy solo confirma
 * que el proceso HTTP responde.
 */
export function getHealth(_req: Request, res: Response): void {
  sendSuccess(res, {
    status: "ok",
    service: "localia-api",
    timestamp: new Date().toISOString(),
  });
}
