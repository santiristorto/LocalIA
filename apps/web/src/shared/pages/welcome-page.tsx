import { useQuery } from "@tanstack/react-query";

import { fetchHealth } from "../lib/api-client.ts";

/**
 * Página placeholder del Sprint 0 — Backend Architecture Specification /
 * Frontend Architecture Specification.
 *
 * No es una pantalla de producto: es la prueba de que el monorepo, Vite,
 * TanStack Query y la API están correctamente conectados de punta a punta.
 * Se reemplaza en el Sprint 3 por el shell real del Employee Center.
 */
export function WelcomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center font-sans">
      <h1 className="text-2xl font-semibold text-primary-dark">LocalIA</h1>
      <p className="max-w-md text-sm text-gray-600">
        Sprint 0 — estructura base del proyecto. Sin funcionalidad de negocio
        todavía.
      </p>

      <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm">
        {isLoading && (
          <span className="text-gray-500">
            Verificando conexión con la API…
          </span>
        )}
        {isError && (
          <span className="text-danger">
            No se pudo conectar con la API:{" "}
            {error instanceof Error ? error.message : "error desconocido"}
          </span>
        )}
        {data && (
          <span className="text-success">
            API conectada — estado: <strong>{data.data.status}</strong>
          </span>
        )}
      </div>
    </main>
  );
}
