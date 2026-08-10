import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Valida `X-Hub-Signature-256` de un webhook de WhatsApp (Sprint 5,
 * criterio de aceptación #3): Meta firma el cuerpo crudo con HMAC-SHA256
 * usando el App Secret, con el formato de cabecera `sha256=<hex>`.
 *
 * `timingSafeEqual` en vez de `===` — comparar firmas con un `===` común
 * es vulnerable a un ataque de timing (la comparación de strings corta en
 * el primer byte que no matchea, filtrando cuánto del secreto es
 * correcto); requiere que ambos buffers tengan la misma longitud, por eso
 * el chequeo de `length` antes.
 */
export function verifyWhatsappSignature(
  rawBody: Buffer,
  signatureHeader: string | undefined,
  appSecret: string,
): boolean {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return false;
  }

  const receivedSignature = signatureHeader.slice("sha256=".length);
  const expectedSignature = createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");

  const receivedBuffer = Buffer.from(receivedSignature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}
