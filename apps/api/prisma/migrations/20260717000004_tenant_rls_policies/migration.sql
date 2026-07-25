-- LocalIA — Sprint 1B
-- Funciones auxiliares `SECURITY DEFINER` — Database Specification §3.2/§9.2:
-- evalúan membresía sin pasar por RLS, evitando la recursión infinita que
-- generaría una política de `tenant_users` que consulta la propia tabla
-- `tenant_users` directamente.

CREATE FUNCTION "public"."fn_is_tenant_member"(target_tenant_id UUID, target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_users
    WHERE tenant_id = target_tenant_id
      AND user_id = target_user_id
      AND status = 'active'
  );
$$;

CREATE FUNCTION "public"."fn_tenant_role"(target_tenant_id UUID, target_user_id UUID)
RETURNS "tenant_user_role"
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.tenant_users
  WHERE tenant_id = target_tenant_id
    AND user_id = target_user_id
    AND status = 'active'
  LIMIT 1;
$$;

-- ── tenants ──────────────────────────────────────────────────────────────
-- SELECT: visible solo para quien ya es miembro.
-- INSERT: cualquier usuario autenticado puede crear un comercio nuevo (es
--   el propio flujo de onboarding) — queda "reclamado" en la misma
--   transacción por el INSERT correspondiente en `tenant_users` (ver abajo).
-- UPDATE: reservado a `owner` — sin endpoint que lo use todavía este sprint,
--   pero la política queda correcta desde ya (Database Specification §4).

CREATE POLICY "tenants_select_member"
    ON "tenants" FOR SELECT
    USING (fn_is_tenant_member(id, fn_current_user_id()));

CREATE POLICY "tenants_insert_authenticated"
    ON "tenants" FOR INSERT
    WITH CHECK (fn_current_user_id() IS NOT NULL);

CREATE POLICY "tenants_update_owner"
    ON "tenants" FOR UPDATE
    USING (fn_tenant_role(id, fn_current_user_id()) = 'owner')
    WITH CHECK (fn_tenant_role(id, fn_current_user_id()) = 'owner');

-- ── tenant_users ─────────────────────────────────────────────────────────
-- SELECT: un miembro ve las membresías de los tenants a los que pertenece
--   (incluida la propia) — necesario más adelante para listar el equipo.
-- INSERT: un usuario únicamente puede insertar una fila de membresía para
--   sí mismo — es lo que permite "reclamar" el tenant recién creado como
--   `owner` sin abrir la puerta a que alguien inserte membresías ajenas.

CREATE POLICY "tenant_users_select_member"
    ON "tenant_users" FOR SELECT
    USING (fn_is_tenant_member(tenant_id, fn_current_user_id()));

CREATE POLICY "tenant_users_insert_self"
    ON "tenant_users" FOR INSERT
    WITH CHECK (user_id = fn_current_user_id());
