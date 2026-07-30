import { Outlet } from "react-router-dom";

import { TenantProvider } from "../providers/tenant-provider.tsx";
import { AppLayout } from "../../features/employee-center/index.ts";

/**
 * AppShellLayout — ruta de layout que envuelve todas las pantallas reales
 * de la app (Dashboard, Clientes, Reservas, etc.) con `TenantProvider` +
 * `AppLayout`. Vive en `app/router/` (no en `features/employee-center/`)
 * porque es infraestructura de ruteo, no un componente de UI en sí mismo.
 */
export function AppShellLayout() {
  return (
    <TenantProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </TenantProvider>
  );
}
