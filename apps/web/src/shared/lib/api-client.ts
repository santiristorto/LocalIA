import { env } from "./env.ts";
import { supabase } from "./supabase-client.ts";

/**
 * Cliente HTTP mínimo — Frontend Architecture Specification §3 (`shared/lib`).
 *
 * Sprint 1A: agrega el header `Authorization` con el access token de la
 * sesión de Supabase cuando existe. El resto de las convenciones (envelope
 * de error estándar, `X-Tenant-Id`) se agregan cuando exista multi-tenancy.
 */
export interface HealthResponse {
  success: true;
  data: {
    status: string;
    service: string;
    timestamp: string;
  };
}

export interface MeResponse {
  success: true;
  data: {
    id: string;
    email: string | null;
    fullName: string | null;
  };
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

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${env.apiBaseUrl}/health`);

  if (!response.ok) {
    throw new Error(`Healthcheck falló con status ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
}

export async function fetchMe(): Promise<MeResponse> {
  const response = await fetch(`${env.apiBaseUrl}/me`, {
    headers: await authHeaders(),
  });

  if (!response.ok) {
    const body = (await response.json()) as ApiErrorBody;
    throw new Error(body.error.message);
  }

  return (await response.json()) as MeResponse;
}
