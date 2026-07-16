import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../providers/use-auth.ts";

/**
 * ProtectedRoute — Frontend Architecture Specification §5 (guard de
 * autenticación). `AuthProvider` ya resolvió la sesión inicial antes de que
 * cualquier ruta se monte (muestra su propio `Spinner` mientras tanto), así
 * que acá alcanza con mirar `session` de forma sincrónica.
 */
export function ProtectedRoute() {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
