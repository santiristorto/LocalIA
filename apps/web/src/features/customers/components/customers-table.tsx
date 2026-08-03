import { Users } from "lucide-react";

import { EmptyState } from "@localia/ui";

import type { Customer } from "../types/customer.ts";
import { CustomerRow } from "./customer-row.tsx";

export interface CustomersTableProps {
  customers: Customer[];
}

/**
 * `CustomersTable` — tabla vacía con headers reales (Frontend Architecture
 * Specification: la estructura de columnas queda fija desde ahora, antes
 * de que exista el CRUD) que cede el lugar a `EmptyState` cuando
 * `customers` está vacío, mismo patrón que ya usa `ComingSoonPage`.
 */
export function CustomersTable({ customers }: CustomersTableProps) {
  if (customers.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-8 w-8" aria-hidden="true" />}
        title="Todavía no hay clientes"
        description="Cuando agregues tu primer cliente, va a aparecer acá."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Nombre
            </th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Email
            </th>
            <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Teléfono
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
