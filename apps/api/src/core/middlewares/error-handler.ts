import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { env } from "../config/env.js";
import { AppError } from "../errors/index.js";
import { sendError } from "../http/response-envelope.js";

/**
 * Middleware centralizado de manejo de errores — Backend Architecture
 * Specification §8. Último middleware de la cadena (§9). Traduce errores de
 * dominio (`AppError`), errores de validación de Zod, y cualquier error
 * inesperado al envelope estándar, sin filtrar detalles internos en
 * producción.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    req.log?.warn({ err }, `Error de dominio: ${err.code}`);
    sendError(res, err.httpStatus, err.code, err.message, err.details);
    return;
  }

  if (err instanceof ZodError) {
    req.log?.warn({ err }, "Error de validación");
    sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "El payload no cumple el esquema esperado.",
      {
        issues: err.flatten(),
      },
    );
    return;
  }

  req.log?.error({ err }, "Error inesperado");

  sendError(
    res,
    500,
    "INTERNAL_ERROR",
    env.NODE_ENV === "production"
      ? "Ocurrió un error inesperado. Ya fue registrado para su revisión."
      : err instanceof Error
        ? err.message
        : "Error desconocido",
  );
}

/**
 * Handler de rutas no encontradas — se monta después de todas las rutas y
 * antes del `errorHandler`.
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(
    res,
    404,
    "NOT_FOUND",
    `No existe la ruta ${req.method} ${req.originalUrl}`,
  );
}
