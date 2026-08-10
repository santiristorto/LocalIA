import type { Request } from "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

/**
 * `captureRawBody` — pasa como `verify` a `express.json()` (ver `app.ts`).
 *
 * Validar `X-Hub-Signature-256` de un webhook de WhatsApp requiere el
 * cuerpo EXACTO (bytes crudos) que Meta firmó — `req.body` ya parseado a
 * objeto no sirve, porque re-serializarlo con `JSON.stringify` no garantiza
 * el mismo string byte a byte (orden de claves, espacios) que el original.
 * Este es el patrón estándar de Express para este problema (igual que usan
 * Stripe/GitHub para sus webhooks): capturar el buffer crudo en un único
 * punto global, disponible como `req.rawBody` para cualquier ruta que lo
 * necesite — solo lo usa `whatsapp.controller.ts` por ahora.
 */
export function captureRawBody(req: Request, _res: unknown, buf: Buffer): void {
  req.rawBody = buf;
}
