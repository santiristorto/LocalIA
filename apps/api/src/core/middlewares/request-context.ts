import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

import { logger } from "../logger/logger.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      correlationId: string;
      log: typeof logger;
    }
  }
}

/**
 * Genera/propaga un `correlationId` por request y expone un logger ya
 * contextualizado (`req.log`) — Backend Architecture Specification §12.
 * Este es el primer middleware de la cadena (§9), antes de cualquier
 * autenticación o lógica de negocio.
 */
export function requestContext(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const incoming = req.header("x-correlation-id");
  const correlationId =
    incoming && incoming.length > 0 ? incoming : randomUUID();

  req.correlationId = correlationId;
  req.log = logger.child({ correlationId });
  res.setHeader("x-correlation-id", correlationId);

  next();
}
