import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

/**
 * Frontend Architecture Specification §7 / §12.
 *
 * Configuración única de TanStack Query. Pendiente: manejo global de
 * errores (401 → logout, 403 → estado de permiso) a nivel de
 * `QueryClient` — hoy cada hook maneja sus propios estados de error
 * (`isError`), todavía no hay una redirección centralizada ante una sesión
 * vencida.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </TanStackQueryClientProvider>
  );
}
