import { env } from "../../core/config/env.js";
import { ExternalServiceError } from "../../core/errors/index.js";

interface SendTextMessageResult {
  whatsappMessageId: string;
}

/**
 * `sendTextMessage` — único método necesario para el endpoint de prueba de
 * este sprint (POST a `/{phone_number_id}/messages` de la Cloud API). Sin
 * SDK: `fetch` nativo de Node 22 alcanza y no agrega una dependencia nueva.
 */
export async function sendTextMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  text: string,
): Promise<SendTextMessageResult> {
  const response = await fetch(
    `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ExternalServiceError(
      `La Cloud API de WhatsApp rechazó el envío (${response.status}): ${errorBody}`,
    );
  }

  const body = (await response.json()) as {
    messages?: Array<{ id?: string }>;
  };
  const whatsappMessageId = body.messages?.[0]?.id;

  if (!whatsappMessageId) {
    throw new ExternalServiceError(
      "La Cloud API de WhatsApp no devolvió un id de mensaje.",
    );
  }

  return { whatsappMessageId };
}
