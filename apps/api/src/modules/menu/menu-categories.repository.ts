import type { Prisma } from "@prisma/client";

import { withUserContext } from "../../core/database/with-user-context.js";
import type {
  CreateMenuCategoryInput,
  IMenuCategoriesRepository,
  MenuCategory,
  UpdateMenuCategoryInput,
} from "./menu.types.js";

/**
 * Repositorio de `menu_categories` — única puerta de entrada a Prisma para
 * este recurso (Backend Architecture Specification §6). Todo método pasa
 * por `withUserContext`, nunca por el cliente de Prisma directo, porque la
 * tabla tiene RLS activo (mismo criterio que `TenantsRepository`).
 */
export class MenuCategoriesRepository implements IMenuCategoriesRepository {
  constructor(
    private readonly runWithUserContext: typeof withUserContext = withUserContext,
  ) {}

  async findAllByTenant(
    userId: string,
    tenantId: string,
  ): Promise<MenuCategory[]> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const rows = await tx.menuCategory.findMany({
          where: { tenantId, deletedAt: null },
          orderBy: { position: "asc" },
        });

        return rows.map((row: (typeof rows)[number]) => toDTO(row));
      },
    );
  }

  async findById(
    userId: string,
    tenantId: string,
    categoryId: string,
  ): Promise<MenuCategory | null> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const row = await tx.menuCategory.findFirst({
          where: { id: categoryId, tenantId, deletedAt: null },
        });

        return row ? toDTO(row) : null;
      },
    );
  }

  async create(
    userId: string,
    tenantId: string,
    input: CreateMenuCategoryInput,
  ): Promise<MenuCategory> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const { _max } = await tx.menuCategory.aggregate({
          where: { tenantId, deletedAt: null },
          _max: { position: true },
        });

        const row = await tx.menuCategory.create({
          data: {
            tenantId,
            name: input.name,
            description: emptyToNull(input.description),
            position: (_max.position ?? -1) + 1,
          },
        });

        return toDTO(row);
      },
    );
  }

  async update(
    userId: string,
    tenantId: string,
    categoryId: string,
    input: UpdateMenuCategoryInput,
  ): Promise<MenuCategory | null> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const existing = await tx.menuCategory.findFirst({
          where: { id: categoryId, tenantId, deletedAt: null },
        });
        if (!existing) return null;

        const row = await tx.menuCategory.update({
          where: { id: categoryId },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.description !== undefined
              ? { description: emptyToNull(input.description) }
              : {}),
          },
        });

        return toDTO(row);
      },
    );
  }

  async softDelete(
    userId: string,
    tenantId: string,
    categoryId: string,
  ): Promise<boolean> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const existing = await tx.menuCategory.findFirst({
          where: { id: categoryId, tenantId, deletedAt: null },
        });
        if (!existing) return false;

        await tx.menuCategory.update({
          where: { id: categoryId },
          data: { deletedAt: new Date() },
        });

        return true;
      },
    );
  }
}

function emptyToNull(value: string | undefined): string | null {
  return value && value.length > 0 ? value : null;
}

/**
 * Forma mínima de una fila de `menu_categories` que necesita `toDTO` — una
 * interfaz propia, no un tipo con nombre del namespace `Prisma` (ver
 * corrección de `tenants.repository.ts`: esos nombres no son estables
 * entre entornos). Cualquier resultado real de `tx.menuCategory.findMany`/
 * `findFirst`/`create`/`update` es estructuralmente compatible.
 */
interface MenuCategoryRow {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

function toDTO(row: MenuCategoryRow): MenuCategory {
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    description: row.description,
    position: row.position,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
