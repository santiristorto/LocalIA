import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateMenuCategoryInput,
  UpdateMenuCategoryInput,
} from "@localia/types";

import { useTenant } from "../../../app/providers/use-tenant.ts";
import {
  createMenuCategory,
  deleteMenuCategory,
  getMenuCategories,
  updateMenuCategory,
} from "../services/menu-categories.service.ts";

const CATEGORIES_KEY = (tenantId: string) => ["menu-categories", tenantId];

/** Lista de categorías del tenant activo, ordenadas por posición. */
export function useMenuCategories() {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: CATEGORIES_KEY(tenantId),
    queryFn: () => getMenuCategories(tenantId),
  });
}

export function useCreateMenuCategory() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMenuCategoryInput) =>
      createMenuCategory(tenantId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: CATEGORIES_KEY(tenantId),
      });
    },
  });
}

export function useUpdateMenuCategory() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      input,
    }: {
      categoryId: string;
      input: UpdateMenuCategoryInput;
    }) => updateMenuCategory(tenantId, categoryId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: CATEGORIES_KEY(tenantId),
      });
    },
  });
}

export function useDeleteMenuCategory() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      deleteMenuCategory(tenantId, categoryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: CATEGORIES_KEY(tenantId),
      });
    },
  });
}
