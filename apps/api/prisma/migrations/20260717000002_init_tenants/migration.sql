-- LocalIA — Sprint 1B
-- Tabla `tenants` — Database Specification §4, extendida con los campos de
-- onboarding pedidos para este sprint (descripción, contacto, ubicación,
-- horarios, marca) que no estaban en la primera versión del schema.
-- Las políticas de RLS se agregan en la migración
-- `20260717000004_tenant_rls_policies`, una vez que existan las funciones
-- auxiliares y `tenant_users` — hasta entonces la tabla queda con RLS
-- activo y sin políticas (deniega todo por defecto, nunca abierta).

CREATE TYPE "business_vertical" AS ENUM (
    'restaurant', 'cafe', 'gym', 'salon', 'clinic', 'retail_services', 'other'
);

CREATE TYPE "tenant_status" AS ENUM ('trial', 'active', 'suspended', 'cancelled');

CREATE TABLE "tenants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "business_vertical" "business_vertical" NOT NULL,
    "status" "tenant_status" NOT NULL DEFAULT 'trial',
    "description" TEXT,
    "phone" TEXT,
    "contact_email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Argentina',
    "timezone" TEXT NOT NULL DEFAULT 'America/Argentina/Buenos_Aires',
    "opening_hours" JSONB,
    "logo_url" TEXT,
    "brand_primary_color" TEXT,
    "brand_secondary_color" TEXT,
    "trial_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenants" FORCE ROW LEVEL SECURITY;
