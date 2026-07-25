-- LocalIA — Sprint 1B
-- Tabla `tenant_users` — Database Specification §3.2. Pivote entre `profiles`
-- (usuario) y `tenants` (comercio), con el rol como atributo de la relación.
-- El primer uso real es el propio onboarding: al crear un comercio, el
-- usuario que lo crea queda insertado acá con `role = 'owner'`.

CREATE TYPE "tenant_user_role" AS ENUM ('owner', 'manager', 'employee', 'readonly');
CREATE TYPE "tenant_user_status" AS ENUM ('active', 'invited', 'revoked');

CREATE TABLE "tenant_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "tenant_user_role" NOT NULL DEFAULT 'owner',
    "status" "tenant_user_status" NOT NULL DEFAULT 'active',
    "invited_by" UUID,
    "invited_at" TIMESTAMP(3),
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "tenant_users_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
    CONSTRAINT "tenant_users_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "tenant_users_tenant_id_user_id_key" ON "tenant_users"("tenant_id", "user_id");
CREATE INDEX "tenant_users_user_id_idx" ON "tenant_users"("user_id");
CREATE INDEX "tenant_users_tenant_id_role_idx" ON "tenant_users"("tenant_id", "role");

ALTER TABLE "tenant_users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenant_users" FORCE ROW LEVEL SECURITY;
