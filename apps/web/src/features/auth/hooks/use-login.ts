import { useMutation } from "@tanstack/react-query";

import type { LoginInput } from "@localia/types";

import { supabase } from "../../../shared/lib/supabase-client.ts";

/**
 * `useLogin` — envuelve `supabase.auth.signInWithPassword` en una mutation
 * de TanStack Query, para heredar sus estados de loading/error/success sin
 * reimplementarlos a mano (Frontend Architecture Specification §12).
 */
export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginInput) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Mensaje genérico a propósito — nunca se especifica si falló el
        // email o la contraseña (UX/UI Specification §2, estado de error).
        throw new Error("Email o contraseña incorrectos.");
      }
    },
  });
}
