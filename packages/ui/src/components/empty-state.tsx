import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

/**
 * EmptyState — Frontend Architecture Specification §9. Se usa tanto para
 * "todavía no hay datos" como para las pantallas de módulos que están
 * "Próximamente" — mismo patrón visual, distinto texto.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
      {icon && (
        <span className="text-gray-400 dark:text-gray-600" aria-hidden="true">
          {icon}
        </span>
      )}
      <p className="text-base font-medium text-gray-900 dark:text-gray-100">
        {title}
      </p>
      {description && (
        <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
