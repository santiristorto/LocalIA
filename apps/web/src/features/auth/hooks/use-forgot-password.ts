import { useMutation } from "@tanstack/react-query";

import type { ForgotPasswordInput } from "@localia/types";

import { supabase } from "../../../shared/lib/supabase-client.ts";

/** `useForgotPassword` — envía el email de recuperación de Supabase Auth. */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async ({ email }: ForgotPasswordInput) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/restablecer-password`,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
  });
}
