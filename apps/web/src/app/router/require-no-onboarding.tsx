import { Navigate, Outlet } from "react-router-dom";

import { Loading } from "@localia/ui";

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
    return <Loading variant="screen" label="Cargando tu cuenta…" />;
  }

  // Ante un error de red, o sin datos todavía (un estado que TanStack
  // Query no tipa como imposible al desestructurar `useMe()`), se deja
  // completar el onboarding igual — es preferible a bloquear al usuario
  // por una falla transitoria de /me.
  const hasTenant = data ? !isError && data.data.memberships.length > 0 : false;

  if (hasTenant) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
