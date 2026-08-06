import type { CreateTenantInput, TenantMembership } from "@localia/types";

import { env } from "./env.ts";
import { supabase } from "./supabase-client.ts";

/**
 * Cliente HTTP mínimo — Frontend Architecture Specification §3 (`shared/lib`).
 *
 * Agrega el header `Authorization` con el access token de la sesión de
 * Supabase cuando existe. `MeResponse` incluye `memberships` (usado para
 * decidir si mostrar el onboarding).
 */
export interface MeResponse {
  success: true;
  data: {
    id: string;
    email: string | null;
    fullName: string | null;
    memberships: TenantMembership[];
  };
}

export interface CreateTenantResponse {
  success: true;
  data: TenantMembership;
}

export interface ApiErrorBody {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

async function authHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

async function parseErrorBody(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.error.message;
  } catch {
    return `La API respondió con un error (${response.status}).`;
  }
}

/**
 * Helper genérico autenticado — pensado para los `services/` de cada
 * feature del Employee Center (ver `features/customers`, `features/menu`),
 * a diferencia de `fetchMe`/`createTenant` de acá arriba, que son
 * específicos de auth/onboarding. Devuelve directo el campo `data` del
 * envelope de éxito (`{ success: true, data }`), no el envelope entero.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(await authHeaders()),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await parseErrorBody(response));
  }

  const body = (await response.json()) as { success: true; data: T };
  return body.data;
}

export async function fetchMe(): Promise<MeResponse> {
  const response = await fetch(`${env.apiBaseUrl}/me`, {
    headers: await authHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseErrorBody(response));
  }

  return (await response.json()) as MeResponse;
}

export async function createTenant(
  input: CreateTenantInput,
): Promise<CreateTenantResponse> {
  const response = await fetch(`${env.apiBaseUrl}/tenants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseErrorBody(response));
  }

  return (await response.json()) as CreateTenantResponse;
}
