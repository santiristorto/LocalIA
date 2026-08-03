import { Loading, PageTitle } from "@localia/ui";

import { useCustomers } from "../hooks/use-customers.ts";
import { CustomersTable } from "../components/customers-table.tsx";
import { CustomersToolbar } from "../components/customers-toolbar.tsx";

/**
 * `CustomersPage` — primer módulo real del Employee Center (Sprint 3).
 * Solo infraestructura: sin CRUD todavía, `useCustomers()` siempre
 * devuelve `[]`, así que hoy `CustomersTable` siempre muestra el
 * `EmptyState`. El `isLoading` se maneja igual, por consistencia con el
 * resto de la app (`RequireOnboarding`) y para no tener que tocar esta
 * página cuando el fetch real empiece a tardar.
 */
export function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();

  return (
    <div>
      <PageTitle
        title="Clientes"
        subtitle="Gestioná los clientes de tu comercio."
        action={<CustomersToolbar />}
      />

      {isLoading ? (
        <Loading label="Cargando clientes…" />
      ) : (
        <CustomersTable customers={customers ?? []} />
      )}
    </div>
  );
}
