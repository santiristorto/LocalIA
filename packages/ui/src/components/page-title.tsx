import type { ReactNode } from "react";

export interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

/**
 * PageTitle — encabezado estándar de cada pantalla del Employee Center.
 * `action` es para el botón principal de la pantalla (ej. "Nueva reserva"),
 * cuando exista — hoy ningún módulo lo usa todavía.
 */
export function PageTitle({ title, subtitle, action }: PageTitleProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
