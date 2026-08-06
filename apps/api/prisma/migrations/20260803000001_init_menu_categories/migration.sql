-- LocalIA — Sprint 4 (Menú)
-- Tabla `menu_categories` — agrupa los ítems del menú de un comercio
-- (ej. "Entradas", "Bebidas"). Las políticas de RLS se agregan en la
-- migración `20260803000003_menu_rls_policies`, una vez creada también
-- `menu_items` — hasta entonces la tabla queda con RLS activo y sin
-- políticas (deniega todo por defecto), mismo criterio que `tenants` en el
-- Sprint 1B.

CREATE TABLE "menu_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "menu_categories_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "menu_categories_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE
);

CREATE INDEX "menu_categories_tenant_id_position_idx" ON "menu_categories"("tenant_id", "position");

ALTER TABLE "menu_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "menu_categories" FORCE ROW LEVEL SECURITY;
