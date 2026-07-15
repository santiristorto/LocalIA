import pino from "pino";

import { env } from "../config/env.js";

/**
 * Logger estructurado — Backend Architecture Specification §12.
 *
 * JSON en producción (para el agregador de logs), formato legible en
 * desarrollo (`pino-pretty`). El `correlationId` de cada request se agrega
 * como `child logger` en el middleware `request-context.ts`, no acá.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  redact: {
    paths: ["req.headers.authorization", "*.password", "*.token", "*.secret"],
    censor: "[REDACTADO]",
  },
});
