import { useContext } from "react";

import { TenantContext, type TenantContextValue } from "./tenant-context.ts";

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenant debe usarse dentro de <TenantProvider>");
  }

  return context;
}
