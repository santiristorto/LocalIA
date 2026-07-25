import type { ReactNode } from "react";

import { ThemeToggle } from "@localia/ui";

import { useTheme } from "../../../app/providers/use-theme.ts";

export interface OnboardingLayoutProps {
  children: ReactNode;
}

/** Layout ancho (no la card de 400px de auth) — este formulario necesita más espacio. */
export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 font-sans dark:bg-gray-950">
      <div className="mx-auto flex max-w-2xl items-center justify-between pb-6">
        <p className="text-lg font-semibold text-primary-dark dark:text-primary">
          LocalIA
        </p>
        <ThemeToggle
          resolvedTheme={resolvedTheme}
          onToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        />
      </div>

      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Configurá tu comercio
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Esta información es la que tu Employee va a usar para atender a tus
            clientes por WhatsApp — la podés editar más adelante desde
            Configuración.
          </p>
        </div>

        {children}
      </div>
    </main>
  );
}
