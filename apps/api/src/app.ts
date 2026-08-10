import cors from "cors";
import express, { type Express, type Router } from "express";
import helmet from "helmet";

import { env } from "./core/config/env.js";
import {
  errorHandler,
  notFoundHandler,
} from "./core/middlewares/error-handler.js";
import { requestContext } from "./core/middlewares/request-context.js";
import { captureRawBody } from "./core/middlewares/raw-body.js";
import { healthRouter } from "./modules/health/health.routes.js";

export interface AppRouters {
  authRouter: Router;
  tenantsRouter: Router;
  menuRouter: Router;
  whatsappRouter: Router;
}

/**
 * Ensamblado de la aplicación — Backend Architecture Specification §2/§9.
 *
 * `routers` es un parámetro OBLIGATORIO, sin valor por defecto, y este
 * archivo nunca importa `core/container.ts` (el composition root real).
 * Es una corrección deliberada respecto a la primera versión de este
 * sprint: un valor por defecto como `= container` obliga a importar ese
 * módulo igual (los módulos de ES se ejecutan enteros al importarse,
 * aunque el valor por defecto no se termine usando), lo que instanciaba
 * `PrismaClient` en cada test — incluso los que nunca tocan Prisma. Ahora
 * `app.ts` es una función pura de sus inputs, y solo `server.ts` (el
 * entrypoint real) conoce el `container` de producción.
 *
 * Orden de la cadena de middlewares globales (la cadena de autenticación
 * — `authenticate` + `authorize` — se aplica por ruta, dentro de cada
 * `*.routes.ts`, no acá):
 *   1. Seguridad de cabeceras (helmet) y CORS
 *   2. Parseo de JSON (con `captureRawBody`: Sprint 5 necesita el body
 *      crudo, no solo el ya parseado, para validar la firma del webhook
 *      de WhatsApp — ver `core/middlewares/raw-body.ts`)
 *   3. Contexto de request (correlationId + logger)
 *   4. Rutas versionadas (`/api/v1/...`)
 *   5. 404
 *   6. Manejador de errores centralizado (siempre al final)
 *
 * `whatsappRouter` (Sprint 5) es la única excepción a "todo pasa por
 * `authenticate`": `GET`/`POST /webhooks/whatsapp` los llama Meta, no un
 * usuario con sesión — no hay JWT que validar ahí. Se protegen con su
 * propio mecanismo (verify token / firma HMAC), dentro del controller. El
 * endpoint de prueba de envío sí es autenticado (`/tenants/:tenantId/
 * whatsapp/test-message`, dentro del mismo router).
 */
export function createApp(routers: AppRouters): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ verify: captureRawBody }));
  app.use(requestContext);

  // Versionado de API — API Specification §1.1.
  const v1 = express.Router();
  v1.use(healthRouter);
  v1.use(routers.authRouter);
  v1.use(routers.tenantsRouter);
  v1.use(routers.menuRouter);
  v1.use(routers.whatsappRouter);
  app.use("/api/v1", v1);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
