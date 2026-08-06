import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Card } from "@localia/ui";

import type { MenuCategory, MenuItem } from "../types/menu.ts";
import { MenuItemRow } from "./menu-item-row.tsx";

export interface MenuCategorySectionProps {
  category: MenuCategory;
  items: MenuItem[];
  canWrite: boolean;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onAddItem: () => void;
  onToggleItemAvailability: (itemId: string, isAvailable: boolean) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
}

/**
 * Sección de una categoría — header con nombre/descripción + acciones
 * (menú de tres puntos, en vez de dos botones de texto sueltos: menos
 * ruido visual cuando `canWrite` está activo), y la lista de sus ítems.
 * `canWrite` oculta las acciones de escritura, mismo criterio que
 * `MenuPage` (el backend ya las exige vía `requireTenantRole`, esto es
 * solo UX).
 */
export function MenuCategorySection({
  category,
  items,
  canWrite,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onToggleItemAvailability,
  onEditItem,
  onDeleteItem,
}: MenuCategorySectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Card className="p-0 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h3 className="truncate text-[15px] font-semibold text-gray-900 dark:text-gray-50">
              {category.name}
            </h3>
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {items.length}
            </span>
          </div>
          {category.description && (
            <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
              {category.description}
            </p>
          )}
        </div>

        {canWrite && (
          <div className="relative flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onAddItem}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ítem
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={`Más acciones para ${category.name}`}
              aria-expanded={isMenuOpen}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>

            {isMenuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={() => setIsMenuOpen(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEditCategory();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDeleteCategory();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-danger/5"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Borrar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <p className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:text-gray-500">
          Sin ítems todavía.
        </p>
      ) : (
        <div className="divide-y divide-gray-100 border-t border-gray-100 px-6 dark:divide-gray-800 dark:border-gray-800">
          {items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              canWrite={canWrite}
              onToggleAvailability={(isAvailable) =>
                onToggleItemAvailability(item.id, isAvailable)
              }
              onEdit={() => onEditItem(item)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
