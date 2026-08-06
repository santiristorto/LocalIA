import type {
  CreateMenuItemInput,
  MenuItem,
  UpdateMenuItemInput,
} from "@localia/types";

import { apiFetch } from "../../../shared/lib/api-client.ts";

/** `menu-items.service` — mismo criterio que `menu-categories.service.ts`. */

export function getMenuItems(
  tenantId: string,
  categoryId?: string,
): Promise<MenuItem[]> {
  const query = categoryId ? `?categoryId=${categoryId}` : "";
  return apiFetch<MenuItem[]>(`/tenants/${tenantId}/menu-items${query}`);
}

export function createMenuItem(
  tenantId: string,
  input: CreateMenuItemInput,
): Promise<MenuItem> {
  return apiFetch<MenuItem>(`/tenants/${tenantId}/menu-items`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateMenuItem(
  tenantId: string,
  itemId: string,
  input: UpdateMenuItemInput,
): Promise<MenuItem> {
  return apiFetch<MenuItem>(`/tenants/${tenantId}/menu-items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteMenuItem(
  tenantId: string,
  itemId: string,
): Promise<void> {
  await apiFetch<null>(`/tenants/${tenantId}/menu-items/${itemId}`, {
    method: "DELETE",
  });
}
