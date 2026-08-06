-- LocalIA — Sprint 4 (Menú)
-- Tabla `menu_items`. `tenant_id` queda denormalizado acá además de
-- resolverse vía `category_id` a propósito: simplifica las políticas de RLS
-- (chequean `tenant_id` directo, sin subconsulta a `menu_categories`) y
-- evita que un ítem quede asociado a una categoría de otro tenant.

CREATE TABLE "menu_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "image_url" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "menu_items_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
    CONSTRAINT "menu_items_category_id_fkey"
        FOREIGN KEY ("category_id") REFERENCES "menu_categories"("id") ON DELETE CASCADE
);

CREATE INDEX "menu_items_tenant_id_category_id_position_idx" ON "menu_items"("tenant_id", "category_id", "position");

ALTER TABLE "menu_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "menu_items" FORCE ROW LEVEL SECURITY;
