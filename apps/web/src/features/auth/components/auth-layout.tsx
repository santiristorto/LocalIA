import type { ReactNode } from "react";

import { ThemeToggle } from "@localia/ui";

import { useTheme } from "../../../app/providers/use-theme.ts";

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * AuthLayout — UX/UI Specification §2/§3: card centrada (max-width 400px)
 * sobre fondo neutro claro. Compartido por Login, Registro, Recuperar y
 * Restablecer contraseña, para no repetir la estructura cuatro veces.
 *
 * Incluye variantes `dark:` y el `ThemeToggle`, visible desde cualquier
 * pantalla de auth, no solo desde adentro de la app ya autenticada.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gray-50 px-6 font-sans dark:bg-gray-950">
      <div className="absolute right-6 top-6">
        <ThemeToggle
          resolvedTheme={resolvedTheme}
          onToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        />
      </div>

      <div className="w-full max-w-[400px] rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-primary-dark dark:text-primary">
            LocalIA
          </p>
          <h1 className="mt-3 text-xl font-semibold text-gray-900 dark:text-gray-50">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {children}

        {footer && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
