-- LocalIA — Sprint 5 (WhatsApp conectado)
-- Tabla `ai_conversations`. Sin RLS todavía — ver nota en la migración de
-- `ai_messages`.

CREATE TYPE "ai_conversation_channel" AS ENUM ('whatsapp');
CREATE TYPE "ai_conversation_status" AS ENUM ('open', 'closed');

CREATE TABLE "ai_conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "channel" "ai_conversation_channel" NOT NULL DEFAULT 'whatsapp',
    "status" "ai_conversation_status" NOT NULL DEFAULT 'open',
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ai_conversations_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
    CONSTRAINT "ai_conversations_customer_id_fkey"
        FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "ai_conversations_tenant_id_customer_id_channel_key"
    ON "ai_conversations"("tenant_id", "customer_id", "channel");

CREATE INDEX "ai_conversations_tenant_id_status_idx" ON "ai_conversations"("tenant_id", "status");
