import { randomUUID } from "node:crypto";

import type {
  CreateMenuItemInput,
  IMenuItemsRepository,
  MenuItem,
  UpdateMenuItemInput,
} from "../modules/menu/menu.types.js";

/**
 * Implementación en memoria de `IMenuItemsRepository`, mismo criterio que
 * `FakeMenuCategoriesRepository`.
 */
export class FakeMenuItemsRepository implements IMenuItemsRepository {
  private items: MenuItem[] = [];

  async findAllByTenant(
    _userId: string,
    tenantId: string,
    categoryId?: string,
  ): Promise<MenuItem[]> {
    return this.items
      .filter(
        (i) =>
          i.tenantId === tenantId &&
          (categoryId === undefined || i.categoryId === categoryId),
      )
      .sort((a, b) => a.position - b.position);
  }

  async findById(
    _userId: string,
    tenantId: string,
    itemId: string,
  ): Promise<MenuItem | null> {
    return (
      this.items.find((i) => i.id === itemId && i.tenantId === tenantId) ?? null
    );
  }

  async create(
    _userId: string,
    tenantId: string,
    input: CreateMenuItemInput,
  ): Promise<MenuItem> {
    const now = new Date().toISOString();
    const position = this.items.filter(
      (i) => i.tenantId === tenantId && i.categoryId === input.categoryId,
    ).length;

    const item: MenuItem = {
      id: randomUUID(),
      tenantId,
      categoryId: input.categoryId,
      name: input.name,
      description: input.description ? input.description : null,
      price: input.price,
      imageUrl: input.imageUrl ? input.imageUrl : null,
      isAvailable: input.isAvailable ?? true,
      position,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(item);
    return item;
  }

  async update(
    _userId: string,
    tenantId: string,
    itemId: string,
    input: UpdateMenuItemInput,
  ): Promise<MenuItem | null> {
    const item = this.items.find(
      (i) => i.id === itemId && i.tenantId === tenantId,
    );
    if (!item) return null;

    if (input.categoryId !== undefined) item.categoryId = input.categoryId;
    if (input.name !== undefined) item.name = input.name;
    if (input.description !== undefined) {
      item.description = input.description ? input.description : null;
    }
    if (input.price !== undefined) item.price = input.price;
    if (input.imageUrl !== undefined) {
      item.imageUrl = input.imageUrl ? input.imageUrl : null;
    }
    if (input.isAvailable !== undefined) item.isAvailable = input.isAvailable;
    item.updatedAt = new Date().toISOString();

    return item;
  }

  async softDelete(
    _userId: string,
    tenantId: string,
    itemId: string,
  ): Promise<boolean> {
    const index = this.items.findIndex(
      (i) => i.id === itemId && i.tenantId === tenantId,
    );
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  /** Solo para arrancar un test con un ítem ya creado. */
  seedItem(item: MenuItem): void {
    this.items.push(item);
  }
}
