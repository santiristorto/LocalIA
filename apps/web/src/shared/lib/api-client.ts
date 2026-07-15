/**
 * Cliente HTTP mínimo — Frontend Architecture Specification §3 (`shared/lib`).
 *
 * Sprint 0: solo lo necesario para verificar la conexión con el backend
 * (healthcheck). Se amplía en el Sprint 1 en adelante con manejo de auth,
 * `X-Tenant-Id`, y el envelope de error estándar (API Specification §1.4).
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export interface HealthResponse {
  success: true;
  data: {
    status: string;
    service: string;
    timestamp: string;
  };
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Healthcheck falló con status ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
}
