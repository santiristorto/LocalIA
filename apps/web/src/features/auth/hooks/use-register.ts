import { useMutation } from "@tanstack/react-query";

import type { RegisterInput } from "@localia/types";

import { supabase } from "../../../shared/lib/supabase-client.ts";

/**
 * `useRegister` — el `full_name` viaja en `options.data`, que es lo que el
 * trigger `handle_new_user` (migración `20260715000002`) usa para crear la
 * fila de `profiles` automáticamente.
 */
export function useRegister() {
  return useMutation({
    mutationFn: async ({ fullName, email, password }: RegisterInput) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          throw new Error("Ya existe una cuenta con este email.");
        }
        throw new Error(error.message);
      }
    },
  });
}
