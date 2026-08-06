import type { NextFunction, Request, Response } from "express";

import { ForbiddenError, UnauthenticatedError } from "../errors/index.js";
import type { TenantsService } from "../../modules/tenants/tenants.service.js";
import type { TenantMembership } from "../../modules/tenants/tenants.types.js";

export type TenantRole = TenantMembership["role"];

/**
 * Mismo motivo que en `menu.controller.ts`: declara su propio índice de
 * `string` (no extiende `ParamsDictionary` — ese import no resuelve bajo
 * `moduleResolution: NodeNext` en este proyecto) para seguir siendo
 * compatible con los demás middlewares/controladores genéricos de la misma
 * cadena de ruta. Se redeclara acá en vez de importarla del módulo `menu`
 * a propósito — este es un middleware de `core/`, no depende de ningún
 * módulo de negocio.
 */
interface TenantParams {
  [key: string]: string;
  tenantId: string;
}

/**
 * Middleware de autorización a nivel de tenant — Sprint 4 (Menú).
 *
 * `authorize` (ver `authorize.ts`) solo valida "hay un usuario autenticado":
 * su predicado es síncrono, sin acceso a `req.params` ni a I/O, porque hasta
 * ahora nunca hizo falta más. Un recurso anidado bajo
 * `/tenants/:tenantId/...` sí necesita resolver la membresía real del
 * usuario para ESE tenant (vía `TenantsService`, que es I/O async) — por
 * eso este es un middleware nuevo y no una extensión de `authorize`, tal
 * como preveía su propio comentario ("agregar el chequeo real de permisos
 * más adelante no requiere tocar las rutas que ya lo usan").
 *
 * `createRequireTenantRole(tenantsService)` es la fábrica del composition
 * root (`core/container.ts`); `requireTenantRole(allowedRoles?)` es lo que
 * se monta en cada ruta. Sin `allowedRoles`, alcanza con ser miembro activo
 * del tenant (lecturas); con `allowedRoles`, además el rol tiene que estar
 * en la lista (escrituras — Sprint 4 solo permite escribir el menú a
 * `owner`/`manager`).
 */
export function createRequireTenantRole(tenantsService: TenantsService) {
  return function requireTenantRole(allowedRoles?: readonly TenantRole[]) {
    return async (
      req: Request<TenantParams>,
      _res: Response,
      next: NextFunction,
    ): Promise<void> => {
      if (!req.user) {
        next(
          new UnauthenticatedError(
            "Se requiere autenticación para acceder a este recurso.",
          ),
        );
        return;
      }

      try {
        const memberships = await tenantsService.getMembershipsForUser(
          req.user.id,
        );
        const membership = memberships.find(
          (m) => m.tenantId === req.params.tenantId,
        );

        const isAuthorized = Boolean(
          membership &&
          (!allowedRoles || allowedRoles.includes(membership.role)),
        );

        if (!isAuthorized) {
          next(
            new ForbiddenError(
              "No tenés permiso para acceder a este comercio.",
            ),
          );
          return;
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
