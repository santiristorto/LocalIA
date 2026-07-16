import { z } from "zod";

/**
 * Esquema de variables de entorno de `apps/api`.
 *
 * Backend Architecture Specification §2 / §9: toda variable de entorno se valida
 * al arranque — si falta o tiene el tipo incorrecto, la aplicación falla de
 * inmediato en vez de arrancar en un estado inconsistente.
 *
 * Sprint 1A: se agrega `SUPABASE_JWT_SECRET`, necesario para verificar las
 * sesiones que emite Supabase Auth. `DATABASE_URL` sigue opcional en este
 * sprint porque ningún endpoint todavía depende de Prisma en runtime (ver
 * nota de la Parte 1 del Sprint 1A sobre generación del cliente de Prisma).
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

  // Sprint 1A — Backend Architecture Specification §9: el backend verifica
  // los JWT que emite Supabase Auth contra este secreto compartido.
  SUPABASE_JWT_SECRET: z
    .string()
    .min(
      1,
      "SUPABASE_JWT_SECRET es requerido para verificar sesiones de Supabase Auth",
    ),
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
