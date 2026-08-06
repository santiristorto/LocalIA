import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateMenuItemInput, UpdateMenuItemInput } from "@localia/types";

import { useTenant } from "../../../app/providers/use-tenant.ts";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuItem,
} from "../services/menu-items.service.ts";

const ITEMS_KEY = (tenantId: string) => ["menu-items", tenantId];

/** Ítems del tenant activo, ordenados por posición. */
export function useMenuItems() {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ITEMS_KEY(tenantId),
    queryFn: () => getMenuItems(tenantId),
  });
}

export function useCreateMenuItem() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMenuItemInput) => createMenuItem(tenantId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ITEMS_KEY(tenantId) });
    },
  });
}

export function useUpdateMenuItem() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      input,
    }: {
      itemId: string;
      input: UpdateMenuItemInput;
    }) => updateMenuItem(tenantId, itemId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ITEMS_KEY(tenantId) });
    },
  });
}

export function useDeleteMenuItem() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteMenuItem(tenantId, itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ITEMS_KEY(tenantId) });
    },
  });
}

/**
 * Toggle de disponibilidad — Sprint 4. No es un endpoint propio, es
 * `useUpdateMenuItem` con un único campo (ver `menu.routes.ts`); este hook
 * solo le da un nombre claro a ese uso puntual.
 */
export function useToggleMenuItemAvailability() {
  const updateMenuItemMutation = useUpdateMenuItem();

  return function toggleAvailability(itemId: string, isAvailable: boolean) {
    return updateMenuItemMutation.mutateAsync({
      itemId,
      input: { isAvailable },
    });
  };
}
