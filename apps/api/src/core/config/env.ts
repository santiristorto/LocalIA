import dotenv from "dotenv";
import { z } from "zod";

/**
 * Carga `apps/api/.env` hacia `process.env` — sin esto, `loadEnv()` de más
 * abajo solo ve las variables que el shell/orquestador ya tenía exportadas,
 * nunca las del archivo `.env` (ni `tsx` ni `node` lo hacen automáticamente).
 *
 * `dotenv.config()` NUNCA sobreescribe una variable que ya exista en
 * `process.env` — así, en producción, las variables inyectadas por la
 * plataforma (Render, GitHub Actions, etc.) siempre ganan por sobre un
 * `.env` que, de todos modos, no debería existir fuera de desarrollo local.
 *
 * Se ejecuta acá, en el módulo que define el esquema, en vez de en
 * `server.ts` — así cualquier entrypoint futuro (workers, scripts, tests)
 * que importe `env.ts` queda cubierto sin tener que acordarse de repetirlo.
 */
dotenv.config();

/**
 * Esquema de variables de entorno de `apps/api`.
 *
 * Backend Architecture Specification §2 / §9: toda variable de entorno se
 * valida al arranque — si falta o tiene el tipo incorrecto, la aplicación
 * falla de inmediato en vez de arrancar en un estado inconsistente.
 *
 * `SUPABASE_URL` es la única variable relacionada a la identidad del
 * usuario: se usa para construir la URL del JWKS público del proyecto
 * (`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`), contra el que se
 * verifica la firma de cada JWT (claves asimétricas ES256/RSA — Supabase no
 * usa un secreto compartido). Ver `core/auth/verify-supabase-jwt.ts`.
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
  DATABASE_URL: z.string().min(1, "DATABASE_URL es requerido."),
  DIRECT_URL: z.string().min(1, "DIRECT_URL es requerido."),

  // Necesario para construir la URL del JWKS público del proyecto
  // (`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`), que es contra lo que
  // se verifica la firma de cada JWT — ver `core/auth/verify-supabase-jwt.ts`.
  SUPABASE_URL: z
    .string()
    .url(
      "SUPABASE_URL debe ser una URL válida (ej: https://xxxx.supabase.co).",
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
