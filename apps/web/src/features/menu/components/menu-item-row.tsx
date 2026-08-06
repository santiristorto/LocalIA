import { Pencil, Trash2 } from "lucide-react";

import { Switch } from "@localia/ui";

import type { MenuItem } from "../types/menu.ts";

export interface MenuItemRowProps {
  item: MenuItem;
  canWrite: boolean;
  onToggleAvailability: (isAvailable: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

export function MenuItemRow({
  item,
  canWrite,
  onToggleAvailability,
  onEdit,
  onDelete,
}: MenuItemRowProps) {
  return (
    <div className="group flex items-center gap-4 py-3.5 first:pt-4 last:pb-4">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-inset ring-gray-900/5"
        />
      ) : (
        <div
          aria-hidden="true"
          className="h-11 w-11 shrink-0 rounded-lg bg-gray-50 ring-1 ring-inset ring-gray-900/5 dark:bg-gray-800/60"
        />
      )}

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            item.isAvailable
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {item.name}
        </p>
        {item.description && (
          <p className="truncate text-[13px] text-gray-500 dark:text-gray-400">
            {item.description}
          </p>
        )}
      </div>

      <span className="shrink-0 text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300">
        {currencyFormatter.format(item.price)}
      </span>

      {canWrite && (
        <>
          <Switch
            checked={item.isAvailable}
            onChange={onToggleAvailability}
            label={`Disponibilidad de ${item.name}`}
          />

          <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Editar ${item.name}`}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Borrar ${item.name}`}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
