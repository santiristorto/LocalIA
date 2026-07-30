import { createContext } from "react";

import type { TenantMembership } from "@localia/types";

export interface TenantContextUser {
  id: string;
  email: string | null;
  fullName: string | null;
}

export interface TenantContextValue {
  tenantId: string;
  tenantName: string;
  role: TenantMembership["role"];
  user: TenantContextUser;
}

export const TenantContext = createContext<TenantContextValue | null>(null);
