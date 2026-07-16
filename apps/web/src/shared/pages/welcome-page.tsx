import { Button } from "@localia/ui";

import { useAuth } from "../../app/providers/use-auth.ts";
import { useMe } from "../hooks/use-me.ts";

/**
 * Home protegida del Sprint 1A — no es una pantalla de producto todavía
 * (el Employee Center real llega en un sprint posterior). Sirve para
 * verificar de punta a punta que: hay sesión, el backend valida el JWT, y
 * `/api/v1/me` devuelve los datos correctos.
 */
export function WelcomePage() {
  const { user, signOut } = useAuth();
  const { data, isLoading, isError, error } = useMe();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center font-sans">
      <h1 className="text-2xl font-semibold text-primary-dark">LocalIA</h1>
      <p className="max-w-md text-sm text-gray-600">
        Sesión iniciada como <strong>{user?.email}</strong>. Sprint 1A —
        autenticación.
      </p>

      <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm">
        {isLoading && (
          <span className="text-gray-500">Consultando /api/v1/me…</span>
        )}
        {isError && <span className="text-danger">Error: {error.message}</span>}
        {data && (
          <span className="text-success">
            /me respondió — id: <code>{data.data.id}</code>, nombre:{" "}
            <strong>{data.data.fullName}</strong>
          </span>
        )}
      </div>

      <Button variant="secondary" onClick={() => void signOut()}>
        Cerrar sesión
      </Button>
    </main>
  );
}
