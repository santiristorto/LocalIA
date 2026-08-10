import { randomUUID } from "node:crypto";

import type {
  AiConversation,
  AiConversationChannel,
  IAiConversationsRepository,
} from "../modules/whatsapp/whatsapp.types.js";

/** Implementacion en memoria de IAiConversationsRepository. */
export class FakeAiConversationsRepository implements IAiConversationsRepository {
  private conversations: AiConversation[] = [];

  async findOrCreateOpen(
    tenantId: string,
    customerId: string,
    channel: AiConversationChannel,
  ): Promise<AiConversation> {
    const existing = this.conversations.find(
      (c) =>
        c.tenantId === tenantId &&
        c.customerId === customerId &&
        c.channel === channel,
    );
    if (existing) return existing;

    const now = new Date().toISOString();
    const conversation: AiConversation = {
      id: randomUUID(),
      tenantId,
      customerId,
      channel,
      status: "open",
      lastMessageAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.push(conversation);
    return conversation;
  }

  async touchLastMessageAt(conversationId: string, at: Date): Promise<void> {
    const conversation = this.conversations.find(
      (c) => c.id === conversationId,
    );
    if (conversation) conversation.lastMessageAt = at.toISOString();
  }

  findAll(): AiConversation[] {
    return this.conversations;
  }
}
