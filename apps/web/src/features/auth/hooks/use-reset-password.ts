import { useMutation } from "@tanstack/react-query";

import type { ResetPasswordInput } from "@localia/types";

import { supabase } from "../../../shared/lib/supabase-client.ts";

/**
 * `useResetPassword` — solo puede llamarse con éxito si Supabase ya
 * estableció una sesión de recuperación (link de email → `detectSessionInUrl`
 * en `supabase-client.ts`). Si no hay sesión de recuperación, Supabase
 * responde con error y se lo mostramos tal cual al usuario.
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ password }: ResetPasswordInput) => {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw new Error(error.message);
      }
    },
  });
}
