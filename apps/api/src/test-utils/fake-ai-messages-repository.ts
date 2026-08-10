import { randomUUID } from "node:crypto";

import type {
  AiMessage,
  AiMessageDirection,
  IAiMessagesRepository,
} from "../modules/whatsapp/whatsapp.types.js";

/** Implementacion en memoria de IAiMessagesRepository — la unicidad de whatsappMessageId se emula a mano, mismo comportamiento que la restriccion real de la base. */
export class FakeAiMessagesRepository implements IAiMessagesRepository {
  private messages: AiMessage[] = [];

  async existsByWhatsappMessageId(whatsappMessageId: string): Promise<boolean> {
    return this.messages.some((m) => m.whatsappMessageId === whatsappMessageId);
  }

  async create(input: {
    tenantId: string;
    conversationId: string;
    direction: AiMessageDirection;
    content: string;
    whatsappMessageId: string | null;
  }): Promise<AiMessage | null> {
    if (
      input.whatsappMessageId &&
      (await this.existsByWhatsappMessageId(input.whatsappMessageId))
    ) {
      return null;
    }

    const message: AiMessage = {
      id: randomUUID(),
      tenantId: input.tenantId,
      conversationId: input.conversationId,
      direction: input.direction,
      content: input.content,
      whatsappMessageId: input.whatsappMessageId,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(message);
    return message;
  }

  findAll(): AiMessage[] {
    return this.messages;
  }
}
