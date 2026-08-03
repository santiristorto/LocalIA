/**
 * `Customer` — modelo del feature Clientes.
 *
 * Todavía no existe un endpoint real ni un esquema Zod compartido en
 * `@localia/types` (Sprint 3 solo construye la infraestructura, sin CRUD
 * funcional) — por eso este tipo vive local al feature en vez de en el
 * paquete de contratos compartidos, a diferencia de `auth.ts`/`tenants.ts`.
 * Cuando exista el módulo `customers` en `apps/api` con su propio esquema
 * Zod, este tipo se reemplaza por el inferido de `@localia/types`.
 */
export interface Customer {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
