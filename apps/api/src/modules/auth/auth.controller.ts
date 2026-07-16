import type { Request, Response } from "express";

import { sendSuccess } from "../../core/http/response-envelope.js";

/**
 * `GET /api/v1/me` — API Specification §2.1 (versión simplificada de este
 * sprint: sin `memberships`, porque `tenant_users` todavía no existe).
 *
 * Los datos devueltos vienen del JWT ya verificado por `authenticate`, no de
 * una consulta a `profiles` — ver la nota de decisión técnica al inicio de
 * este sprint sobre por qué `/me` no depende de Prisma todavía.
 */
export function getMe(req: Request, res: Response): void {
  // `authorize` garantiza que `req.user` existe antes de llegar acá.
  const user = req.user!;

  sendSuccess(res, {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  });
}
