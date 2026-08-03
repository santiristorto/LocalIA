import { Plus } from "lucide-react";

import { Button } from "@localia/ui";

/**
 * `CustomersToolbar` — se usa como `action` de `PageTitle` (Sprint 2 dejó
 * ese prop preparado justo para esto). Solo el botón "Nuevo cliente" por
 * ahora, deshabilitado porque todavía no hay CRUD — se habilita cuando
 * exista el formulario de alta.
 */
export function CustomersToolbar() {
  return (
    <Button variant="primary" disabled>
      <Plus className="h-4 w-4" aria-hidden="true" />
      Nuevo cliente
    </Button>
  );
}
