import { useState } from "react";
import type { ReactNode } from "react";

import { Sidebar } from "./sidebar.tsx";
import { Topbar } from "./topbar.tsx";

export interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout — shell reutilizable de todas las pantallas autenticadas
 * (Frontend Architecture Specification §6, `EmployeeCenterLayout`): sidebar
 * fijo en desktop, topbar, área central de contenido. El único estado que
 * maneja es si el sidebar mobile está abierto — todo lo demás (tenant,
 * usuario) lo resuelven `Sidebar`/`Topbar` directamente vía contexto, sin
 * que este componente tenga que pasarlo como prop.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans dark:bg-gray-950">
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
