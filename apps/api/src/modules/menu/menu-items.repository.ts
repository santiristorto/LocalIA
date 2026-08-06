import type { Prisma } from "@prisma/client";

import { withUserContext } from "../../core/database/with-user-context.js";
import type {
  CreateMenuItemInput,
  IMenuItemsRepository,
  MenuItem,
  UpdateMenuItemInput,
} from "./menu.types.js";

/**
 * Repositorio de `menu_items` — mismo criterio que `MenuCategoriesRepository`:
 * único acceso a Prisma para este recurso, siempre a través de
 * `withUserContext` (la tabla tiene RLS activo).
 */
export class MenuItemsRepository implements IMenuItemsRepository {
  constructor(
    private readonly runWithUserContext: typeof withUserContext = withUserContext,
  ) {}

  async findAllByTenant(
    userId: string,
    tenantId: string,
    categoryId?: string,
  ): Promise<MenuItem[]> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const rows = await tx.menuItem.findMany({
          where: {
            tenantId,
            deletedAt: null,
            ...(categoryId ? { categoryId } : {}),
          },
          orderBy: { position: "asc" },
        });

        return rows.map((row: (typeof rows)[number]) => toDTO(row));
      },
    );
  }

  async findById(
    userId: string,
    tenantId: string,
    itemId: string,
  ): Promise<MenuItem | null> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const row = await tx.menuItem.findFirst({
          where: { id: itemId, tenantId, deletedAt: null },
        });

        return row ? toDTO(row) : null;
      },
    );
  }

  async create(
    userId: string,
    tenantId: string,
    input: CreateMenuItemInput,
  ): Promise<MenuItem> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const { _max } = await tx.menuItem.aggregate({
          where: { tenantId, categoryId: input.categoryId, deletedAt: null },
          _max: { position: true },
        });

        const row = await tx.menuItem.create({
          data: {
            tenantId,
            categoryId: input.categoryId,
            name: input.name,
            description: emptyToNull(input.description),
            price: input.price,
            imageUrl: emptyToNull(input.imageUrl),
            isAvailable: input.isAvailable ?? true,
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
    itemId: string,
    input: UpdateMenuItemInput,
  ): Promise<MenuItem | null> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const existing = await tx.menuItem.findFirst({
          where: { id: itemId, tenantId, deletedAt: null },
        });
        if (!existing) return null;

        const row = await tx.menuItem.update({
          where: { id: itemId },
          data: {
            ...(input.categoryId !== undefined
              ? { categoryId: input.categoryId }
              : {}),
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.description !== undefined
              ? { description: emptyToNull(input.description) }
              : {}),
            ...(input.price !== undefined ? { price: input.price } : {}),
            ...(input.imageUrl !== undefined
              ? { imageUrl: emptyToNull(input.imageUrl) }
              : {}),
            ...(input.isAvailable !== undefined
              ? { isAvailable: input.isAvailable }
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
    itemId: string,
  ): Promise<boolean> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const existing = await tx.menuItem.findFirst({
          where: { id: itemId, tenantId, deletedAt: null },
        });
        if (!existing) return false;

        await tx.menuItem.update({
          where: { id: itemId },
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
 * Forma mínima de una fila de `menu_items` que necesita `toDTO` — interfaz
 * propia, mismo criterio que `MenuCategoryRow` (sin nombrar tipos del
 * namespace `Prisma`). `price` queda como `unknown` a propósito: Prisma lo
 * devuelve como su propio tipo `Decimal` (no un `number` ni un tipo
 * exportado con un nombre estable) — `toDTO` lo convierte con `Number(...)`,
 * que acepta cualquier valor con `.toString()`, sin necesitar nombrar ese
 * tipo tampoco.
 */
interface MenuItemRow {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: unknown;
  imageUrl: string | null;
  isAvailable: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

function toDTO(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    tenantId: row.tenantId,
    categoryId: row.categoryId,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.imageUrl,
    isAvailable: row.isAvailable,
    position: row.position,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
