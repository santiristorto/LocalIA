import type { ReactNode } from "react";

import { Card } from "./card.js";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  hint?: string;
}

/**
 * StatCard — tarjeta de KPI (Frontend Architecture Specification §9,
 * UX/UI Specification §5: "StatCard (KPI)"). Valor grande + etiqueta +
 * ícono opcional. Todavía no anima ni compara contra el período anterior
 * (eso llega cuando exista Analytics real) — hoy solo muestra el número.
 */
export function StatCard({ label, value, icon, hint }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        {icon && (
          <span className="text-primary dark:text-primary" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
        {value}
      </p>
      {hint && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </Card>
  );
}
