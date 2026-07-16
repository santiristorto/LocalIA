import type { NextFunction, Request, Response } from "express";

import { ForbiddenError, UnauthenticatedError } from "../errors/index.js";
import type { AuthenticatedUser } from "./authenticate.js";

/**
 * Middleware de autorización — Backend Architecture Specification §10/§24-I.
 *
 * Separado de `authenticate` a propósito, aunque en este sprint su único
 * chequeo real sea "hay un usuario autenticado": la matriz de permisos por
 * tenant (API Specification §1.3) recién tiene datos contra los cuales
 * evaluar cuando exista `tenant_users` (próximo sprint). El punto de
 * extensión ya queda wireado acá — `authorize` acepta un predicado, así que
 * agregar el chequeo real de permisos más adelante no requiere tocar las
 * rutas que ya lo usan, solo el predicado que le pasan.
 *
 * @param predicate Chequeo adicional sobre el usuario ya autenticado.
 *   Por defecto, cualquier usuario autenticado está autorizado.
 */
export function authorize(
  predicate: (user: AuthenticatedUser) => boolean = () => true,
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(
        new UnauthenticatedError(
          "Se requiere autenticación para acceder a este recurso.",
        ),
      );
      return;
    }

    if (!predicate(req.user)) {
      next(new ForbiddenError("No tenés permiso para acceder a este recurso."));
      return;
    }

    next();
  };
}
