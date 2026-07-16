/**
 * Variables de entorno de `apps/web` — mismo principio de "fallar rápido y
 * explícito" que `apps/api/src/core/config/env.ts`, adaptado a Vite (que no
 * permite leer `import.meta.env` de forma dinámica, solo estática).
 */
function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copiá .env.example a .env y completala.`,
    );
  }
  return value;
}

export const env = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1",
  supabaseUrl: requireEnv(
    import.meta.env.VITE_SUPABASE_URL,
    "VITE_SUPABASE_URL",
  ),
  supabaseAnonKey: requireEnv(
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    "VITE_SUPABASE_ANON_KEY",
  ),
};
