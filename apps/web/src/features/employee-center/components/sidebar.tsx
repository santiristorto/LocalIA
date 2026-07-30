import { X } from "lucide-react";
import { NavLink } from "react-router-dom";

import { navItems } from "./nav-items.ts";

export interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

/**
 * Sidebar — fijo en desktop (siempre visible, parte del layout en fila),
 * panel deslizante con backdrop en mobile (por debajo del breakpoint `lg`).
 * Los ítems marcados `comingSoon` igual navegan — llevan a una pantalla de
 * "Próximamente" real, no quedan deshabilitados ni fingen no existir.
 */
export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onCloseMobile}
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <p className="text-lg font-semibold text-primary-dark dark:text-primary">
            LocalIA
          </p>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Cerrar menú"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </span>
                {item.comingSoon && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    Próximamente
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
