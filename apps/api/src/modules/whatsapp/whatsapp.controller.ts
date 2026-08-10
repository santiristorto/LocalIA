import type { NextFunction, Request, Response } from "express";

import { env } from "../../core/config/env.js";
import { sendSuccess } from "../../core/http/response-envelope.js";
import { verifyWhatsappSignature } from "./whatsapp-signature.js";
import {
  sendTestMessageSchema,
  whatsappWebhookPayloadSchema,
} from "./whatsapp.validators.js";
import type { WhatsappService } from "./whatsapp.service.js";

/**
 * Mismo motivo que en `menu.controller.ts`: interfaz propia con indice de
 * string en vez de depender de ParamsDictionary/ParsedQs (no resuelven
 * bien bajo moduleResolution NodeNext en este proyecto).
 */
interface TenantParams {
  [key: string]: string;
  tenantId: string;
}

interface VerifyWebhookQuery {
  [key: string]: string | undefined;
  "hub.mode"?: string;
  "hub.verify_token"?: string;
  "hub.challenge"?: string;
}

/**
 * Controlador del modulo whatsapp. `verifyWebhook`/`receiveWebhook` no
 * pasan por `authenticate` (los llama Meta, no un usuario con sesion) — su
 * propia validacion (verify token / firma HMAC) reemplaza esa capa, ver
 * `whatsapp.routes.ts`.
 */
export function createWhatsappController(service: WhatsappService) {
  return {
    verifyWebhook(
      req: Request<Record<string, never>, unknown, unknown, VerifyWebhookQuery>,
      res: Response,
    ): void {
      const challenge = service.verifyWebhookChallenge(
        req.query["hub.mode"],
        req.query["hub.verify_token"],
        req.query["hub.challenge"],
      );

      if (challenge === null) {
        res.status(403).end();
        return;
      }

      res.status(200).type("text/plain").send(challenge);
    },

    async receiveWebhook(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const signatureValid = verifyWhatsappSignature(
          req.rawBody ?? Buffer.from(""),
          req.header("x-hub-signature-256"),
          env.WHATSAPP_APP_SECRET,
        );

        if (!signatureValid) {
          res.status(403).end();
          return;
        }

        const parsed = whatsappWebhookPayloadSchema.safeParse(req.body);
        if (!parsed.success) {
          // Payload con una forma que no reconocemos (otro tipo de evento
          // de Meta) — se responde 200 igual para que no reintente algo
          // que nunca vamos a poder procesar.
          res.status(200).end();
          return;
        }

        await service.processIncomingWebhook(parsed.data);
        res.status(200).end();
      } catch (error) {
        next(error);
      }
    },

    async sendTestMessage(
      req: Request<TenantParams>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const input = sendTestMessageSchema.parse(req.body);
        const message = await service.sendTestMessage(
          req.params.tenantId,
          input,
        );

        sendSuccess(res, message, 201);
      } catch (error) {
        next(error);
      }
    },
  };
}
