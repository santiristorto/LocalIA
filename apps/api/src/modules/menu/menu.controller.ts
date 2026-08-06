import type { NextFunction, Request, Response } from "express";

import { sendSuccess } from "../../core/http/response-envelope.js";
import {
  createMenuCategorySchema,
  createMenuItemSchema,
  updateMenuCategorySchema,
  updateMenuItemSchema,
} from "./menu.validators.js";
import type { MenuService } from "./menu.service.js";

/**
 * Params de cada ruta, explícitos — Express 5 tipa `req.params` genérico
 * como `{ [key: string]: string | string[] }` (soporta rutas wildcard tipo
 * `/user/*id`, que capturan un array) y el proyecto tiene
 * `noUncheckedIndexedAccess`, así que sin este tipado explícito
 * `req.params.tenantId` resuelve a `string | string[] | undefined`. Ninguna
 * ruta de este módulo usa wildcards, así que la forma real siempre es
 * `string` — declararla acá es lo que le permite a TypeScript demostrarlo,
 * en vez de un cast. Cada interfaz declara también su propio índice de
 * `string` (no extiende `ParamsDictionary`: ese paquete no resuelve bien
 * bajo `moduleResolution: NodeNext` en este proyecto) — así siguen siendo
 * compatibles con los middlewares genéricos de la cadena (`authenticate`,
 * `authorize()`, `requireTenantRole`, tipados como
 * `RequestHandler<ParamsDictionary>`, que exige ese índice). Ver
 * `menu.routes.ts`, que pasa este mismo tipo como generic explícito a cada
 * `router.METHOD<Params>`.
 */
interface TenantParams {
  [key: string]: string;
  tenantId: string;
}
interface CategoryParams extends TenantParams {
  categoryId: string;
}
interface ItemParams extends TenantParams {
  itemId: string;
}
export type { TenantParams, CategoryParams, ItemParams };

/**
 * Controlador del módulo `menu` — sin lógica de negocio, mismo criterio que
 * `TenantsController`. `authenticate` + `authorize` + `requireTenantRole`
 * ya garantizaron identidad y permiso antes de llegar acá (ver
 * `menu.routes.ts`), así que `req.user!` es seguro.
 */
export function createMenuController(service: MenuService) {
  return {
    async listCategories(
      req: Request<TenantParams>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const categories = await service.getCategories(
          req.user!.id,
          req.params.tenantId,
        );

        sendSuccess(res, categories);
      } catch (error) {
        next(error);
      }
    },

    async createCategory(
      req: Request<TenantParams>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const input = createMenuCategorySchema.parse(req.body);
        const category = await service.createCategory(
          req.user!.id,
          req.params.tenantId,
          input,
        );

        sendSuccess(res, category, 201);
      } catch (error) {
        next(error);
      }
    },

    async updateCategory(
      req: Request<CategoryParams>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const input = updateMenuCategorySchema.parse(req.body);
        const category = await service.updateCategory(
          req.user!.id,
          req.params.tenantId,
          req.params.categoryId,
          input,
        );

        sendSuccess(res, category);
      } catch (error) {
        next(error);
      }
    },

    async deleteCategory(
      req: Request<CategoryParams>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        await service.deleteCategory(
          req.user!.id,
          req.params.tenantId,
          req.params.categoryId,
        );

        sendSuccess(res, null);
      } catch (error) {
        next(error);
      }
    },

    async listItems(
      req: Request<TenantParams>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const categoryId =
          typeof req.query.categoryId === "string"
            ? req.query.categoryId
            : undefined;

        const items = await service.getItems(
          req.user!.id,
          req.params.tenantId,
          categoryId,
        );

        sendSuccess(res, items);
      } catch (error) {
        next(error);
      }
    },

    async createItem(
      req: Request<TenantParams>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const input = createMenuItemSchema.parse(req.body);
        const item = await service.createItem(
          req.user!.id,
          req.params.tenantId,
          input,
        );

        sendSuccess(res, item, 201);
      } catch (error) {
        next(error);
      }
    },

    async updateItem(
      req: Request<ItemParams>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const input = updateMenuItemSchema.parse(req.body);
        const item = await service.updateItem(
          req.user!.id,
          req.params.tenantId,
          req.params.itemId,
          input,
        );

        sendSuccess(res, item);
      } catch (error) {
        next(error);
      }
    },

    async deleteItem(
      req: Request<ItemParams>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        await service.deleteItem(
          req.user!.id,
          req.params.tenantId,
          req.params.itemId,
        );

        sendSuccess(res, null);
      } catch (error) {
        next(error);
      }
    },
  };
}
