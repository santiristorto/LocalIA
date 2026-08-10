-- LocalIA — Sprint 5 (WhatsApp conectado)
-- Tabla `ai_messages`. `whatsapp_message_id` UNIQUE es el mecanismo real de
-- idempotencia (ver comentario en `schema.prisma`).
--
-- Sin RLS, a diferencia de `tenants`/`menu_*`: todo el acceso de este
-- sprint al conjunto customers/ai_conversations/ai_messages es o bien del
-- webhook (sin usuario autenticado — no hay `current_user_id` que setear
-- para que las políticas tengan algo que evaluar) o bien interno al mismo
-- módulo (`whatsapp.service.ts` ya filtra por `tenant_id` en cada query).
-- Cuando un sprint futuro exponga estas tablas a un endpoint de usuario
-- (dashboard de conversaciones), ahí corresponde sumar RLS con
-- `withUserContext`, igual que se hizo con `menu_*` en el Sprint 4.

CREATE TYPE "ai_message_direction" AS ENUM ('inbound', 'outbound');

CREATE TABLE "ai_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "direction" "ai_message_direction" NOT NULL,
    "content" TEXT NOT NULL,
    "whatsapp_message_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ai_messages_tenant_id_fkey"
        FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
    CONSTRAINT "ai_messages_conversation_id_fkey"
        FOREIGN KEY ("conversation_id") REFERENCES "ai_conversations"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "ai_messages_whatsapp_message_id_key" ON "ai_messages"("whatsapp_message_id");
CREATE INDEX "ai_messages_tenant_id_conversation_id_created_at_idx"
    ON "ai_messages"("tenant_id", "conversation_id", "created_at");
