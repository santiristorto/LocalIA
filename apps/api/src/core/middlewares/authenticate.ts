import type { NextFunction, Request, Response } from "express";

import { verifySupabaseJwt } from "../auth/verify-supabase-jwt.js";
import { UnauthenticatedError } from "../errors/index.js";

export interface AuthenticatedUser {
  id: string;
  email: string | null;
  fullName: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware de autenticación — Backend Architecture Specification §9.
 *
 * Verifica el JWT de Supabase Auth del header `Authorization: Bearer <jwt>`
 * y adjunta el usuario resuelto a `req.user`. Es el primer eslabón de la
 * cadena de autorización (junto con `authorize`, ver `authorize.ts`) — no
 * decide permisos, solo identidad.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : null;

  if (!token) {
    next(
      new UnauthenticatedError(
        "Falta el header Authorization con un token Bearer.",
      ),
    );
    return;
  }

  try {
    const payload = await verifySupabaseJwt(token);

    req.user = {
      id: payload.sub,
      email: payload.email ?? null,
      fullName: payload.user_metadata?.full_name ?? null,
    };

    next();
  } catch (error) {
    req.log?.warn({ err: error }, "Token de Supabase inválido o expirado");
    next(new UnauthenticatedError("Sesión inválida o expirada."));
  }
}
