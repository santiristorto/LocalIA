-- LocalIA — Sprint 4 (Menú)
-- Políticas de RLS de `menu_categories`/`menu_items`, reutilizando las
-- funciones auxiliares `fn_is_tenant_member`/`fn_tenant_role` ya creadas en
-- la migración `20260717000004_tenant_rls_policies` — mismo mecanismo, sin
-- funciones nuevas.
--
-- SELECT: cualquier miembro activo del tenant (cualquier rol) puede leer el
--   menú — es lo que necesita el propio panel del Employee Center.
-- INSERT/UPDATE: reservado a `owner`/`manager` — decisión de negocio del
--   sprint, `employee`/`readonly` solo pueden leer. El "borrado" del
--   catálogo es un soft delete (columna `deleted_at`, ver
--   `menu.repository.ts`), por eso no hace falta una política de DELETE —
--   mismo criterio que ya usa `tenants`.

-- ── menu_categories ─────────────────────────────────────────────────────

CREATE POLICY "menu_categories_select_member"
    ON "menu_categories" FOR SELECT
    USING (fn_is_tenant_member(tenant_id, fn_current_user_id()));

CREATE POLICY "menu_categories_insert_owner_manager"
    ON "menu_categories" FOR INSERT
    WITH CHECK (fn_tenant_role(tenant_id, fn_current_user_id()) IN ('owner', 'manager'));

CREATE POLICY "menu_categories_update_owner_manager"
    ON "menu_categories" FOR UPDATE
    USING (fn_tenant_role(tenant_id, fn_current_user_id()) IN ('owner', 'manager'))
    WITH CHECK (fn_tenant_role(tenant_id, fn_current_user_id()) IN ('owner', 'manager'));

-- ── menu_items ───────────────────────────────────────────────────────────

CREATE POLICY "menu_items_select_member"
    ON "menu_items" FOR SELECT
    USING (fn_is_tenant_member(tenant_id, fn_current_user_id()));

CREATE POLICY "menu_items_insert_owner_manager"
    ON "menu_items" FOR INSERT
    WITH CHECK (fn_tenant_role(tenant_id, fn_current_user_id()) IN ('owner', 'manager'));

CREATE POLICY "menu_items_update_owner_manager"
    ON "menu_items" FOR UPDATE
    USING (fn_tenant_role(tenant_id, fn_current_user_id()) IN ('owner', 'manager'))
    WITH CHECK (fn_tenant_role(tenant_id, fn_current_user_id()) IN ('owner', 'manager'));
