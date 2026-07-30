import { LogOut, Menu } from "lucide-react";

import { Avatar, Button, ThemeToggle } from "@localia/ui";

import { useAuth } from "../../../app/providers/use-auth.ts";
import { useTenant } from "../../../app/providers/use-tenant.ts";
import { useTheme } from "../../../app/providers/use-theme.ts";

export interface TopbarProps {
  onOpenMobileNav: () => void;
}

/** Topbar — nombre del comercio, usuario actual, tema y cerrar sesión. */
export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const { tenantName, user } = useTenant();
  const { signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const displayName = user.fullName ?? user.email ?? "Usuario";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Abrir menú"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
          {tenantName}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle
          resolvedTheme={resolvedTheme}
          onToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        />

        <div className="hidden items-center gap-2 sm:flex">
          <Avatar name={displayName} size="sm" />
          <span className="max-w-[160px] truncate text-sm text-gray-700 dark:text-gray-300">
            {displayName}
          </span>
        </div>

        <Button
          variant="secondary"
          onClick={() => void signOut()}
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </Button>
      </div>
    </header>
  );
}
