import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Spinner } from "@localia/ui";

import { supabase } from "../../shared/lib/supabase-client.ts";
import { AuthContext, type AuthContextValue } from "./auth-context.ts";

/**
 * AuthProvider — Frontend Architecture Specification §7.
 *
 * Fuente única de verdad del estado de sesión en el frontend: resuelve la
 * sesión inicial una vez, y después reacciona a cualquier cambio (login,
 * logout, refresh de token, recuperación de contraseña) vía
 * `onAuthStateChange`, sin que cada pantalla tenga que consultarlo por su
 * cuenta. El hook de consumo (`useAuth`) vive en `use-auth.ts` — separado a
 * propósito para que este archivo solo exporte un componente (React Fast
 * Refresh).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    isLoading,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  // Mientras se resuelve la sesión inicial, no se decide todavía si mostrar
  // una pantalla pública o protegida — evita un parpadeo de "no autenticado"
  // antes de saber la respuesta real.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Verificando tu sesión…" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
