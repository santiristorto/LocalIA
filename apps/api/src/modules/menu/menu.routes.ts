import { Router } from "express";

import { authenticate as defaultAuthenticate } from "../../core/middlewares/authenticate.js";
import { authorize } from "../../core/middlewares/authorize.js";
import type { createRequireTenantRole } from "../../core/middlewares/require-tenant-role.js";
import type {
  CategoryParams,
  ItemParams,
  TenantParams,
  createMenuController,
} from "./menu.controller.js";

/**
 * Rutas del Menú — anidadas bajo `/tenants/:tenantId/...`, API
 * Specification §3 (mismo prefijo de recurso que usa `tenants`). Lecturas:
 * cualquier miembro activo del tenant. Escrituras (crear/editar/borrar
 * categorías e ítems, incluido el toggle de disponibilidad — es un `PATCH`
 * más, sin endpoint propio): reservadas a `owner`/`manager`, vía
 * `requireTenantRole` (ver ese archivo para el porqué de un middleware
 * nuevo en vez de extender `authorize`).
 *
 * Cada `router.METHOD` pasa su generic de params explícito
 * (`TenantParams`/`CategoryParams`/`ItemParams`, las mismas interfaces que
 * usa `menu.controller.ts`) — si no, Express infiere `ParamsDictionary`
 * para toda la cadena de middlewares y el controlador (tipado más
 * específico) deja de encajar. Los middlewares genéricos
 * (`authenticateMiddleware`, `authorize()`, `requireMember`,
 * `requireOwnerOrManager`) siguen sirviendo para cualquier `Params` porque
 * no leen ningún campo de `req.params` en particular (o, en el caso de
 * `requireTenantRole`, solo `tenantId`, presente en los tres).
 */
export function createMenuRouter(
  controller: ReturnType<typeof createMenuController>,
  requireTenantRole: ReturnType<typeof createRequireTenantRole>,
  authenticateMiddleware = defaultAuthenticate,
): Router {
  const router = Router();
  const requireMember = requireTenantRole();
  const requireOwnerOrManager = requireTenantRole(["owner", "manager"]);

  router.get<TenantParams>(
    "/tenants/:tenantId/menu-categories",
    authenticateMiddleware,
    authorize(),
    requireMember,
    controller.listCategories,
  );

  router.post<TenantParams>(
    "/tenants/:tenantId/menu-categories",
    authenticateMiddleware,
    authorize(),
    requireOwnerOrManager,
    controller.createCategory,
  );

  router.patch<CategoryParams>(
    "/tenants/:tenantId/menu-categories/:categoryId",
    authenticateMiddleware,
    authorize(),
    requireOwnerOrManager,
    controller.updateCategory,
  );

  router.delete<CategoryParams>(
    "/tenants/:tenantId/menu-categories/:categoryId",
    authenticateMiddleware,
    authorize(),
    requireOwnerOrManager,
    controller.deleteCategory,
  );

  router.get<TenantParams>(
    "/tenants/:tenantId/menu-items",
    authenticateMiddleware,
    authorize(),
    requireMember,
    controller.listItems,
  );

  router.post<TenantParams>(
    "/tenants/:tenantId/menu-items",
    authenticateMiddleware,
    authorize(),
    requireOwnerOrManager,
    controller.createItem,
  );

  router.patch<ItemParams>(
    "/tenants/:tenantId/menu-items/:itemId",
    authenticateMiddleware,
    authorize(),
    requireOwnerOrManager,
    controller.updateItem,
  );

  router.delete<ItemParams>(
    "/tenants/:tenantId/menu-items/:itemId",
    authenticateMiddleware,
    authorize(),
    requireOwnerOrManager,
    controller.deleteItem,
  );

  return router;
}
