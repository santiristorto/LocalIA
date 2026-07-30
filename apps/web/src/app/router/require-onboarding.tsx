import { Navigate, Outlet } from "react-router-dom";

import { Loading } from "@localia/ui";

import { useMe } from "../../shared/hooks/use-me.ts";

/**
 * RequireOnboarding — protege las rutas de la app real: si el usuario
 * todavía no completó el onboarding (sin ninguna membresía en
 * `tenant_users`), lo manda a `/onboarding` antes de dejarlo entrar.
 */
export function RequireOnboarding() {
  const { data, isLoading, isError, error } = useMe();

  if (isLoading) {
    return <Loading variant="screen" label="Cargando tu cuenta…" />;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-sm text-danger">
          No pudimos cargar tu cuenta:{" "}
          {error instanceof Error ? error.message : "error desconocido"}
        </p>
      </div>
    );
  }

  if (!data) {
    // Destructurar `useMe()` pierde la unión discriminada que TanStack
    // Query expone en el objeto completo del resultado — TypeScript no
    // puede probar que "ni loading ni error" implica "data definido".
    // En la práctica no debería pasar nunca acá; si pasa, mismo fallback
    // de carga en vez de romper.
    return <Loading variant="screen" label="Cargando tu cuenta…" />;
  }

  const hasTenant = data.data.memberships.length > 0;

  if (!hasTenant) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
