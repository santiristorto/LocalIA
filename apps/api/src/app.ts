import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { env } from "./core/config/env.js";
import {
  errorHandler,
  notFoundHandler,
} from "./core/middlewares/error-handler.js";
import { requestContext } from "./core/middlewares/request-context.js";
import { healthRouter } from "./modules/health/health.routes.js";

/**
 * Ensamblado de la aplicación — Backend Architecture Specification §2/§9.
 *
 * Orden de la cadena de middlewares globales (no confundir con la cadena de
 * autenticación por ruta, que se agrega recién en el Sprint 2):
 *   1. Seguridad de cabeceras (helmet) y CORS
 *   2. Parseo de JSON
 *   3. Contexto de request (correlationId + logger)
 *   4. Rutas versionadas (`/api/v1/...`)
 *   5. 404
 *   6. Manejador de errores centralizado (siempre al final)
 */
export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(requestContext);

  // Versionado de API — API Specification §1.1.
  const v1 = express.Router();
  v1.use(healthRouter);
  app.use("/api/v1", v1);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
