import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateTenantInput } from "@localia/types";

import { createTenant } from "../../../shared/lib/api-client.ts";

/**
 * `useCreateTenant` — envía el formulario de onboarding. Invalida `["me"]`
 * al terminar para que `RequireOnboarding`/`RequireNoOnboarding` vean de
 * inmediato la nueva membresía sin necesidad de recargar la página.
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTenantInput) => createTenant(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
