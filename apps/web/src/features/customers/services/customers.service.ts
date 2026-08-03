import type { Customer } from "../types/customer.ts";

/**
 * `customers.service` — capa de acceso a datos del feature Clientes
 * (Frontend Architecture Specification §3, mismo rol que
 * `shared/lib/api-client.ts` para `me`/`tenants`, pero acá local al
 * feature porque `customers` todavía no tiene contrato compartido).
 *
 * El backend no expone ningún endpoint de `customers` todavía. `getCustomers`
 * devuelve un arreglo vacío tipado en vez de pegarle a la API — es la única
 * operación que ya necesita responder algo real hoy (la tabla vacía la
 * consume vía `useCustomers()`). El resto queda con un `throw` explícito
 * hasta que exista el endpoint correspondiente; conectarlos es un cambio
 * de una sola línea cada uno, sin tocar nada que los consuma.
 */

export type CreateCustomerInput = Omit<
  Customer,
  "id" | "tenantId" | "createdAt" | "updatedAt"
>;

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export async function getCustomers(): Promise<Customer[]> {
  return [];
}

export async function createCustomer(
  _input: CreateCustomerInput,
): Promise<Customer> {
  throw new Error("Not implemented");
}

export async function updateCustomer(
  _id: string,
  _input: UpdateCustomerInput,
): Promise<Customer> {
  throw new Error("Not implemented");
}

export async function deleteCustomer(_id: string): Promise<void> {
  throw new Error("Not implemented");
}
