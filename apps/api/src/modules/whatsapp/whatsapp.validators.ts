import { z } from "zod";

/**
 * Payload del webhook de WhatsApp (Cloud API) — se valida de forma
 * tolerante a propósito: Meta manda el mismo formato de sobre
 * (`entry[].changes[].value`) para varios tipos de evento (`field`
 * distinto según sea un mensaje, un cambio de estado de entrega, etc.), y
 * este sprint solo procesa mensajes de texto entrantes. Todo lo que no
 * matchee esta forma se ignora sin error — devolver 200 igual es lo que
 * evita que Meta reintente indefinidamente un evento que no nos interesa.
 */
const whatsappTextMessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  type: z.literal("text"),
  text: z.object({ body: z.string() }),
});

const whatsappContactSchema = z.object({
  wa_id: z.string(),
  profile: z.object({ name: z.string().optional() }).optional(),
});

const whatsappChangeValueSchema = z.object({
  metadata: z.object({ phone_number_id: z.string() }),
  contacts: z.array(whatsappContactSchema).optional(),
  messages: z.array(z.record(z.string(), z.unknown())).optional(),
});

const whatsappChangeSchema = z.object({
  field: z.string(),
  value: whatsappChangeValueSchema,
});

export const whatsappWebhookPayloadSchema = z.object({
  object: z.string(),
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(whatsappChangeSchema),
    }),
  ),
});
export type WhatsappWebhookPayload = z.infer<
  typeof whatsappWebhookPayloadSchema
>;
export type WhatsappTextMessage = z.infer<typeof whatsappTextMessageSchema>;

export function parseWhatsappTextMessage(
  raw: Record<string, unknown>,
): WhatsappTextMessage | null {
  const result = whatsappTextMessageSchema.safeParse(raw);
  return result.success ? result.data : null;
}

export const sendTestMessageSchema = z.object({
  to: z
    .string()
    .min(8, "Ingresá un número de teléfono válido, en formato E.164."),
  text: z
    .string()
    .min(1, "El mensaje no puede estar vacío.")
    .max(4096, "El mensaje es demasiado largo."),
});
export type SendTestMessageInput = z.infer<typeof sendTestMessageSchema>;
