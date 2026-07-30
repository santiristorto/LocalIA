import { Sparkles } from "lucide-react";

import { EmptyState, PageTitle } from "@localia/ui";

export interface ComingSoonPageProps {
  title: string;
  description?: string;
}

/**
 * Pantalla compartida por los cinco módulos que todavía no existen
 * (Clientes, Reservas, Agenda, Empleado IA, Configuración) — evita crear
 * cinco archivos casi idénticos. Cuando un módulo se construya de verdad,
 * su ruta deja de apuntar acá y pasa a tener su propia pantalla.
 */
export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div>
      <PageTitle title={title} />
      <EmptyState
        icon={<Sparkles className="h-8 w-8" aria-hidden="true" />}
        title="Próximamente"
        description={
          description ??
          `${title} todavía no está disponible — lo vamos a construir en un próximo sprint.`
        }
      />
    </div>
  );
}
