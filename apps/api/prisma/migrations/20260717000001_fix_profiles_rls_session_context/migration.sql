-- LocalIA — Sprint 1B
-- CORRECCIÓN de una decisión del Sprint 1A, no una tabla nueva.
--
-- Las políticas de `profiles` creadas en la migración 20260715000001
-- (`profiles_select_own`, `profiles_update_own`) usan `auth.uid()`, la
-- función nativa de Supabase que solo resuelve el usuario cuando la consulta
-- llega directo del cliente de Supabase (PostgREST/GoTrue) con el JWT
-- adjunto automáticamente a la sesión de Postgres.
--
-- El backend de LocalIA se conecta a Postgres con Prisma usando un rol de
-- conexión propio (Backend Architecture Specification §11) — en ese camino,
-- `auth.uid()` no tiene forma de saber quién es el usuario y evalúa NULL
-- siempre, lo que bloquearía cualquier consulta legítima del backend contra
-- `profiles`. Nunca se notó en el Sprint 1A porque `/me` no consultaba la
-- base todavía (ver nota de decisión técnica del Sprint 1A).
--
-- Se reemplaza por la convención ya definida en el Database Specification
-- §9.1/§9.3: una variable de sesión propia (`app.current_user_id`), seteada
-- explícitamente por el backend con `set_config(...)` al inicio de cada
-- transacción (ver `core/database/with-user-context.ts`).

CREATE FUNCTION "public"."fn_current_user_id"()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;

DROP POLICY "profiles_select_own" ON "profiles";
DROP POLICY "profiles_update_own" ON "profiles";

CREATE POLICY "profiles_select_own"
    ON "profiles" FOR SELECT
    USING (id = fn_current_user_id());

CREATE POLICY "profiles_update_own"
    ON "profiles" FOR UPDATE
    USING (id = fn_current_user_id())
    WITH CHECK (id = fn_current_user_id());
