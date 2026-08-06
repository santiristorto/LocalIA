import type {
  CreateMenuCategoryInput,
  CreateMenuItemInput,
  MenuCategory,
  MenuItem,
  UpdateMenuCategoryInput,
  UpdateMenuItemInput,
} from "@localia/types";

export type {
  CreateMenuCategoryInput,
  CreateMenuItemInput,
  MenuCategory,
  MenuItem,
  UpdateMenuCategoryInput,
  UpdateMenuItemInput,
};

/**
 * Puertos (Backend Architecture Specification §24-D/I) — `MenuService`
 * depende de estas interfaces, nunca de las clases concretas
 * `MenuCategoriesRepository`/`MenuItemsRepository`, mismo criterio que
 * `ITenantsRepository`.
 */
export interface IMenuCategoriesRepository {
  findAllByTenant(userId: string, tenantId: string): Promise<MenuCategory[]>;
  findById(
    userId: string,
    tenantId: string,
    categoryId: string,
  ): Promise<MenuCategory | null>;
  create(
    userId: string,
    tenantId: string,
    input: CreateMenuCategoryInput,
  ): Promise<MenuCategory>;
  update(
    userId: string,
    tenantId: string,
    categoryId: string,
    input: UpdateMenuCategoryInput,
  ): Promise<MenuCategory | null>;
  softDelete(
    userId: string,
    tenantId: string,
    categoryId: string,
  ): Promise<boolean>;
}

export interface IMenuItemsRepository {
  findAllByTenant(
    userId: string,
    tenantId: string,
    categoryId?: string,
  ): Promise<MenuItem[]>;
  findById(
    userId: string,
    tenantId: string,
    itemId: string,
  ): Promise<MenuItem | null>;
  create(
    userId: string,
    tenantId: string,
    input: CreateMenuItemInput,
  ): Promise<MenuItem>;
  update(
    userId: string,
    tenantId: string,
    itemId: string,
    input: UpdateMenuItemInput,
  ): Promise<MenuItem | null>;
  softDelete(
    userId: string,
    tenantId: string,
    itemId: string,
  ): Promise<boolean>;
}
