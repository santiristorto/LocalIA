import type {
  CreateMenuCategoryInput,
  MenuCategory,
  UpdateMenuCategoryInput,
} from "@localia/types";

import { apiFetch } from "../../../shared/lib/api-client.ts";

/**
 * `menu-categories.service` — capa de acceso a datos de categorías del
 * menú, mismo rol que `customers.service.ts` pero contra el endpoint real
 * (existe desde este sprint, ver `apps/api/src/modules/menu`).
 */

export function getMenuCategories(tenantId: string): Promise<MenuCategory[]> {
  return apiFetch<MenuCategory[]>(`/tenants/${tenantId}/menu-categories`);
}

export function createMenuCategory(
  tenantId: string,
  input: CreateMenuCategoryInput,
): Promise<MenuCategory> {
  return apiFetch<MenuCategory>(`/tenants/${tenantId}/menu-categories`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateMenuCategory(
  tenantId: string,
  categoryId: string,
  input: UpdateMenuCategoryInput,
): Promise<MenuCategory> {
  return apiFetch<MenuCategory>(
    `/tenants/${tenantId}/menu-categories/${categoryId}`,
    { method: "PATCH", body: JSON.stringify(input) },
  );
}

export async function deleteMenuCategory(
  tenantId: string,
  categoryId: string,
): Promise<void> {
  await apiFetch<null>(`/tenants/${tenantId}/menu-categories/${categoryId}`, {
    method: "DELETE",
  });
}
