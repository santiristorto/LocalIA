import type { Customer } from "../types/customer.ts";

export interface CustomerRowProps {
  customer: Customer;
}

/**
 * `CustomerRow` — una fila de `CustomersTable`. Hoy no se renderiza nunca
 * (la lista siempre viene vacía), pero queda lista para cuando
 * `useCustomers()` devuelva datos reales: `CustomersTable` solo necesita
 * mapear el arreglo, sin tocar el layout de la fila.
 */
export function CustomerRow({ customer }: CustomerRowProps) {
  return (
    <tr className="border-b border-gray-100 last:border-0 dark:border-gray-800">
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
        {customer.firstName} {customer.lastName}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        {customer.email ?? "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        {customer.phone ?? "—"}
      </td>
    </tr>
  );
}
