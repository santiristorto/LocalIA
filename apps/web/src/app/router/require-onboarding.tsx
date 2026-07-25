import { Navigate, Outlet } from "react-router-dom";

import { Spinner } from "@localia/ui";

import { useMe } from "../../shared/hooks/use-me.ts";

/**
 * RequireOnboarding — protege las rutas de la app real: si el usuario
 * todavía no completó el onboarding (sin ninguna membresía en
 * `tenant_users`), lo manda a `/onboarding` antes de dejarlo entrar.
 */
export function RequireOnboarding() {
  const { data, isLoading, isError, error } = useMe();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Cargando tu cuenta…" />
      </div>
    );
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

  const hasTenant = data.data.memberships.length > 0;

  if (!hasTenant) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
