import { Navigate, Outlet } from "react-router-dom";

import { Spinner } from "@localia/ui";

import { useMe } from "../../shared/hooks/use-me.ts";

/**
 * RequireNoOnboarding — protege `/onboarding`: si el usuario ya tiene un
 * comercio configurado, no vuelve a mostrarle el formulario (lo manda a la
 * home). Requisito de producto: "si el onboarding ya fue completado
 * anteriormente, no volver a mostrarlo".
 */
export function RequireNoOnboarding() {
  const { data, isLoading, isError } = useMe();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Cargando tu cuenta…" />
      </div>
    );
  }

  // Ante un error de red, se deja completar el onboarding igual — es
  // preferible a bloquear al usuario por una falla transitoria de /me.
  const hasTenant = !isError && data.data.memberships.length > 0;

  if (hasTenant) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
