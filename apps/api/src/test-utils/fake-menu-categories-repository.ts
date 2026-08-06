import { randomUUID } from "node:crypto";

import type {
  CreateMenuCategoryInput,
  IMenuCategoriesRepository,
  MenuCategory,
  UpdateMenuCategoryInput,
} from "../modules/menu/menu.types.js";

/**
 * Implementación en memoria de `IMenuCategoriesRepository`, mismo criterio
 * que `FakeTenantsRepository` — reemplaza a `MenuCategoriesRepository`
 * (Prisma + Postgres) en los tests.
 */
export class FakeMenuCategoriesRepository implements IMenuCategoriesRepository {
  private categories: MenuCategory[] = [];

  async findAllByTenant(
    _userId: string,
    tenantId: string,
  ): Promise<MenuCategory[]> {
    return this.categories
      .filter((c) => c.tenantId === tenantId)
      .sort((a, b) => a.position - b.position);
  }

  async findById(
    _userId: string,
    tenantId: string,
    categoryId: string,
  ): Promise<MenuCategory | null> {
    return (
      this.categories.find(
        (c) => c.id === categoryId && c.tenantId === tenantId,
      ) ?? null
    );
  }

  async create(
    _userId: string,
    tenantId: string,
    input: CreateMenuCategoryInput,
  ): Promise<MenuCategory> {
    const now = new Date().toISOString();
    const position = this.categories.filter(
      (c) => c.tenantId === tenantId,
    ).length;

    const category: MenuCategory = {
      id: randomUUID(),
      tenantId,
      name: input.name,
      description: input.description ? input.description : null,
      position,
      createdAt: now,
      updatedAt: now,
    };

    this.categories.push(category);
    return category;
  }

  async update(
    _userId: string,
    tenantId: string,
    categoryId: string,
    input: UpdateMenuCategoryInput,
  ): Promise<MenuCategory | null> {
    const category = this.categories.find(
      (c) => c.id === categoryId && c.tenantId === tenantId,
    );
    if (!category) return null;

    if (input.name !== undefined) category.name = input.name;
    if (input.description !== undefined) {
      category.description = input.description ? input.description : null;
    }
    category.updatedAt = new Date().toISOString();

    return category;
  }

  async softDelete(
    _userId: string,
    tenantId: string,
    categoryId: string,
  ): Promise<boolean> {
    const index = this.categories.findIndex(
      (c) => c.id === categoryId && c.tenantId === tenantId,
    );
    if (index === -1) return false;

    this.categories.splice(index, 1);
    return true;
  }

  /** Solo para arrancar un test con una categoría ya creada. */
  seedCategory(category: MenuCategory): void {
    this.categories.push(category);
  }
}
