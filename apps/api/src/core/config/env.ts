import { z } from "zod";

/**
 * Esquema de variables de entorno de `apps/api`.
 *
 * Backend Architecture Specification §2 / §9: toda variable de entorno se valida
 * al arranque — si falta o tiene el tipo incorrecto, la aplicación falla de
 * inmediato en vez de arrancar en un estado inconsistente.
 *
 * Sprint 0: solo lo estrictamente necesario para que el servidor levante y
 * responda el healthcheck. Las variables de Supabase/Prisma se agregan en el
 * Sprint 1, cuando exista el primer modelo real.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Variables de entorno inválidas:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error(
      "Configuración de entorno inválida — revisar .env contra .env.example",
    );
  }

  return parsed.data;
}

export const env = loadEnv();
