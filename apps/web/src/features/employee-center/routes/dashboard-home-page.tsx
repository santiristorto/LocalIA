import { Bell, CalendarCheck, DollarSign, Users } from "lucide-react";

import { PageTitle, StatCard } from "@localia/ui";

import { useTenant } from "../../../app/providers/use-tenant.ts";

/**
 * Dashboard — home del Employee Center. Solo estructura por ahora: los
 * cuatro `StatCard` muestran `0` porque todavía no existe ningún módulo de
 * negocio (Clientes, Reservas, Pedidos, Employee Inbox) que alimente estos
 * números — se conectan a datos reales cuando esos módulos existan, sin
 * tener que tocar este layout.
 */
export function DashboardHomePage() {
  const { tenantName } = useTenant();

  return (
    <div>
      <PageTitle title="Dashboard" subtitle={`Resumen de ${tenantName}`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Clientes"
          value={0}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Reservas"
          value={0}
          icon={<CalendarCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Ingresos"
          value="$0"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Mensajes IA"
          value={0}
          icon={<Bell className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}
