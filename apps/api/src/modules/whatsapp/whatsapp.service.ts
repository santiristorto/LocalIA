import { env } from "../../core/config/env.js";
import { ForbiddenError, NotFoundError } from "../../core/errors/index.js";
import { sendTextMessage } from "./whatsapp-cloud-api.client.js";
import {
  parseWhatsappTextMessage,
  type SendTestMessageInput,
  type WhatsappWebhookPayload,
} from "./whatsapp.validators.js";
import type {
  AiMessage,
  IAiConversationsRepository,
  IAiMessagesRepository,
  ICustomersRepository,
  ITenantWhatsappConfigRepository,
} from "./whatsapp.types.js";

/**
 * Servicio del modulo whatsapp. Toda la logica de negocio vive aca, nunca
 * en el controlador ni en los repositorios (mismo criterio que
 * MenuService/TenantsService). Depende de las interfaces de los
 * repositorios (puertos), no de las clases concretas.
 */
export class WhatsappService {
  constructor(
    private readonly customersRepository: ICustomersRepository,
    private readonly conversationsRepository: IAiConversationsRepository,
    private readonly messagesRepository: IAiMessagesRepository,
    private readonly tenantConfigRepository: ITenantWhatsappConfigRepository,
  ) {}

  verifyWebhookChallenge(
    mode: string | undefined,
    verifyToken: string | undefined,
    challenge: string | undefined,
  ): string | null {
    if (
      mode === "subscribe" &&
      verifyToken === env.WHATSAPP_VERIFY_TOKEN &&
      challenge
    ) {
      return challenge;
    }
    return null;
  }

  async processIncomingWebhook(payload: WhatsappWebhookPayload): Promise<void> {
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        await this.processChange(change);
      }
    }
  }

  private async processChange(
    change: WhatsappWebhookPayload["entry"][number]["changes"][number],
  ): Promise<void> {
    const { value } = change;
    if (!value.messages || value.messages.length === 0) return;

    const tenantConfig = await this.tenantConfigRepository.findByPhoneNumberId(
      value.metadata.phone_number_id,
    );
    if (!tenantConfig) return;

    const contactsByPhone = new Map(
      (value.contacts ?? []).map((contact) => [
        contact.wa_id,
        contact.profile?.name ?? null,
      ]),
    );

    for (const rawMessage of value.messages) {
      const message = parseWhatsappTextMessage(rawMessage);
      if (!message) continue;

      const alreadyProcessed =
        await this.messagesRepository.existsByWhatsappMessageId(message.id);
      if (alreadyProcessed) continue;

      const customer = await this.customersRepository.findOrCreateByPhone(
        tenantConfig.tenantId,
        message.from,
        contactsByPhone.get(message.from) ?? null,
      );

      const conversation = await this.conversationsRepository.findOrCreateOpen(
        tenantConfig.tenantId,
        customer.id,
        "whatsapp",
      );

      const created = await this.messagesRepository.create({
        tenantId: tenantConfig.tenantId,
        conversationId: conversation.id,
        direction: "inbound",
        content: message.text.body,
        whatsappMessageId: message.id,
      });
      if (!created) continue;

      await this.conversationsRepository.touchLastMessageAt(
        conversation.id,
        new Date(),
      );
    }
  }

  async sendTestMessage(
    tenantId: string,
    input: SendTestMessageInput,
  ): Promise<AiMessage> {
    const tenantConfig =
      await this.tenantConfigRepository.findByTenantId(tenantId);
    if (!tenantConfig) {
      throw new ForbiddenError(
        "Este comercio todavia no tiene un numero de WhatsApp conectado.",
      );
    }

    const { whatsappMessageId } = await sendTextMessage(
      tenantConfig.whatsappPhoneNumberId,
      tenantConfig.whatsappAccessToken,
      input.to,
      input.text,
    );

    const customer = await this.customersRepository.findOrCreateByPhone(
      tenantId,
      input.to,
      null,
    );
    const conversation = await this.conversationsRepository.findOrCreateOpen(
      tenantId,
      customer.id,
      "whatsapp",
    );

    const created = await this.messagesRepository.create({
      tenantId,
      conversationId: conversation.id,
      direction: "outbound",
      content: input.text,
      whatsappMessageId,
    });
    if (!created) {
      throw new NotFoundError("No se pudo registrar el mensaje enviado.");
    }

    await this.conversationsRepository.touchLastMessageAt(
      conversation.id,
      new Date(),
    );

    return created;
  }
}
