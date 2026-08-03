import { useQuery } from "@tanstack/react-query";

import { getCustomers } from "../services/customers.service.ts";

/**
 * `useCustomers` — lista de clientes del tenant activo. Hoy siempre
 * devuelve `[]` (ver `customers.service.ts`), pero ya queda montado sobre
 * TanStack Query con su propia `queryKey` — conectar el fetch real más
 * adelante no cambia nada de lo que consume este hook.
 */
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
}
