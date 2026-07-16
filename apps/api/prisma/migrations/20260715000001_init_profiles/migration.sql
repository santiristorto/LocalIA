-- LocalIA — Sprint 1A
-- Crea `profiles` y activa Row Level Security desde el día uno
-- (Database Specification §3.1 / §15 — RLS es la última línea de defensa,
-- no una optimización posterior).

CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT NOT NULL DEFAULT 'es-AR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- `id` es el mismo UUID que `auth.users.id` (relación 1:1 fuera del control
-- de Prisma, ya que `auth` es un schema gestionado por Supabase).
ALTER TABLE "profiles"
    ADD CONSTRAINT "profiles_id_fkey"
    FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" FORCE ROW LEVEL SECURITY;

-- Un usuario solo puede ver y editar su propia fila.
-- `auth.uid()` es la función nativa de Supabase que resuelve el usuario
-- autenticado de la sesión actual (equivalente a `fn_current_user_id()`
-- del Database Specification, ya provisto por la plataforma).
CREATE POLICY "profiles_select_own"
    ON "profiles" FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
    ON "profiles" FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- No hay política de INSERT/DELETE para el rol de aplicación: la fila se crea
-- únicamente vía el trigger de la migración siguiente, y no se borra
-- físicamente (baja lógica con `deleted_at`, coherente con el resto del
-- Database Specification).
