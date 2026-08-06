import {
  CalendarCheck,
  CalendarDays,
  LayoutDashboard,
  Settings,
  Sparkles,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  /** Todavía no tiene pantalla real — se muestra igual en el menú, marcada como tal. */
  comingSoon?: boolean;
}

/**
 * Items del sidebar — Frontend Architecture Specification §5/§10: los
 * slugs de ruta (`/customers`, `/reservations`, `/employee-engine`,
 * `/settings`) son los mismos que ya define el árbol de rutas de la
 * especificación, para no tener que renombrarlos cuando cada módulo se
 * construya de verdad. `Agenda` es la única ruta sin precedente en los
 * documentos aprobados — se agrega tal cual la pidió este sprint. `Menú`
 * (Sprint 4) tampoco tenía slug predefinido — se eligió `/menu`, mismo
 * criterio.
 */
export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Clientes", path: "/customers", icon: Users, comingSoon: true },
  { label: "Menú", path: "/menu", icon: UtensilsCrossed },
  {
    label: "Reservas",
    path: "/reservations",
    icon: CalendarCheck,
    comingSoon: true,
  },
  { label: "Agenda", path: "/agenda", icon: CalendarDays, comingSoon: true },
  {
    label: "Empleado IA",
    path: "/employee-engine",
    icon: Sparkles,
    comingSoon: true,
  },
  {
    label: "Configuración",
    path: "/settings",
    icon: Settings,
    comingSoon: true,
  },
];
