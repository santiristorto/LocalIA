import type { ReactNode } from "react";

import { useAuth } from "./use-auth.ts";
import { TenantContext, type TenantContextValue } from "./tenant-context.ts";
import { useMe } from "../../shared/hooks/use-me.ts";

/**
 * TenantProvider — Frontend Architecture Specification §7: uno de los tres
 * providers de app (junto a `AuthProvider` y, a futuro, `PluginProvider`)
 * que exponen contexto transversal en vez de forzar prop drilling en cada
 * pantalla.
 *
 * Precondición importante: este provider asume que ya existe una
 * membresía activa — es responsabilidad de `RequireOnboarding` (el guard
 * que lo envuelve en el árbol de rutas) garantizar eso antes de montarlo.
 * Por eso no maneja su propio estado de loading/error: si `RequireOnboarding`
 * ya dejó pasar, `useMe()` (misma query cacheada, sin fetch adicional) ya
 * tiene el dato. Si de todos modos no lo tiene, es un bug de los guards,
 * no un estado válido de UI — por eso el `throw` en vez de un fallback
 * silencioso.
 */
export function TenantProvider({ children }: { children: ReactNode }) {
  const { data } = useMe();
  const { user } = useAuth();

  const membership = data?.data.memberships[0];

  if (!membership || !user) {
    throw new Error(
      "TenantProvider se montó sin sesión o sin membresía activa — revisar RequireOnboarding.",
    );
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;

  const value: TenantContextValue = {
    tenantId: membership.tenantId,
    tenantName: membership.tenantName,
    role: membership.role,
    user: { id: user.id, email: user.email ?? null, fullName },
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}
