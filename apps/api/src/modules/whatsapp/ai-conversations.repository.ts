import { prisma } from "../../core/database/prisma-client.js";
import type {
  AiConversation,
  AiConversationChannel,
  IAiConversationsRepository,
} from "./whatsapp.types.js";

/** Mismo criterio que `CustomersRepository`: sin `withUserContext`, la tabla no tiene RLS todavía. */
export class AiConversationsRepository implements IAiConversationsRepository {
  async findOrCreateOpen(
    tenantId: string,
    customerId: string,
    channel: AiConversationChannel,
  ): Promise<AiConversation> {
    const row = await prisma.aiConversation.upsert({
      where: {
        tenantId_customerId_channel: { tenantId, customerId, channel },
      },
      create: { tenantId, customerId, channel },
      update: {},
    });

    return toDTO(row);
  }

  async touchLastMessageAt(conversationId: string, at: Date): Promise<void> {
    await prisma.aiConversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: at },
    });
  }
}

interface AiConversationRow {
  id: string;
  tenantId: string;
  customerId: string;
  channel: string;
  status: string;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CHANNELS: readonly AiConversation["channel"][] = ["whatsapp"];
const STATUSES: readonly AiConversation["status"][] = ["open", "closed"];

function toChannel(value: string): AiConversation["channel"] {
  const match = CHANNELS.find((channel) => channel === value);
  if (!match) throw new Error(`Canal de conversación desconocido: ${value}`);
  return match;
}

function toStatus(value: string): AiConversation["status"] {
  const match = STATUSES.find((status) => status === value);
  if (!match) throw new Error(`Estado de conversación desconocido: ${value}`);
  return match;
}

function toDTO(row: AiConversationRow): AiConversation {
  return {
    id: row.id,
    tenantId: row.tenantId,
    customerId: row.customerId,
    channel: toChannel(row.channel),
    status: toStatus(row.status),
    lastMessageAt: row.lastMessageAt ? row.lastMessageAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
