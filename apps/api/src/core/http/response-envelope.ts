import type { Response } from "express";

/**
 * Envelope estándar de respuesta — Backend Architecture Specification §8 /
 * API Specification §1.4. Único punto de la aplicación que arma el shape de
 * respuesta, para que nunca haya dos formatos distintos conviviendo.
 */
export function sendSuccess<T>(res: Response, data: T, httpStatus = 200): void {
  res.status(httpStatus).json({ success: true, data });
}

export function sendError(
  res: Response,
  httpStatus: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
): void {
  res.status(httpStatus).json({
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  });
}
