import { Button, ThemeToggle } from "@localia/ui";

import { useAuth } from "../../app/providers/use-auth.ts";
import { useTheme } from "../../app/providers/use-theme.ts";
import { useMe } from "../hooks/use-me.ts";

/**
 * Home protegida — todavía no es el Employee Center real (llega en un
 * sprint posterior). Sirve para verificar de punta a punta que: hay sesión,
 * el backend valida el JWT, y `/api/v1/me` devuelve memberships reales tras
 * completar el onboarding.
 */
export function WelcomePage() {
  const { user, signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const { data, isLoading, isError, error } = useMe();

  const tenant = data?.data.memberships[0];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center font-sans dark:bg-gray-950">
      <div className="absolute right-6 top-6">
        <ThemeToggle
          resolvedTheme={resolvedTheme}
          onToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        />
      </div>

      <h1 className="text-2xl font-semibold text-primary-dark dark:text-primary">
        LocalIA
      </h1>
      <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
        Sesión iniciada como <strong>{user?.email}</strong>.
      </p>

      <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm dark:border-gray-800">
        {isLoading && (
          <span className="text-gray-500">Consultando /api/v1/me…</span>
        )}
        {isError && <span className="text-danger">Error: {error.message}</span>}
        {tenant && (
          <span className="text-success">
            Comercio configurado: <strong>{tenant.tenantName}</strong> (rol:{" "}
            {tenant.role})
          </span>
        )}
      </div>

      <Button variant="secondary" onClick={() => void signOut()}>
        Cerrar sesión
      </Button>
    </main>
  );
}
