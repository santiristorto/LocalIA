-- LocalIA — Sprint 5 (WhatsApp conectado)
-- Config de WhatsApp Business por tenant. `whatsapp_phone_number_id` es lo
-- que Meta manda en cada webhook — es lo único que permite resolver a qué
-- tenant pertenece un mensaje entrante, de ahí el UNIQUE.

ALTER TABLE "tenants"
  ADD COLUMN "whatsapp_phone_number_id" TEXT,
  ADD COLUMN "whatsapp_access_token" TEXT;

CREATE UNIQUE INDEX "tenants_whatsapp_phone_number_id_key"
  ON "tenants"("whatsapp_phone_number_id");
