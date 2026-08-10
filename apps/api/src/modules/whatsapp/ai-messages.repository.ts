import { Prisma } from "@prisma/client";

import { prisma } from "../../core/database/prisma-client.js";
import type { AiMessage, IAiMessagesRepository } from "./whatsapp.types.js";

/**
 * Repositorio de `ai_messages`. `create` es donde vive la idempotencia real
 * (Sprint 5, criterio de aceptación #4): en vez de "buscar y después crear"
 * (con una ventana de carrera entre ambos pasos si dos webhooks llegan casi
 * al mismo tiempo), se intenta crear directo y se deja que la restricción
 * `UNIQUE(whatsapp_message_id)` de la base sea la única fuente de verdad —
 * si Prisma devuelve `P2002` (violación de unicidad), significa que el
 * mensaje ya se procesó antes, y se devuelve `null` en vez de propagar el
 * error: el caller (`whatsapp.service.ts`) lo trata como éxito silencioso.
 */
export class AiMessagesRepository implements IAiMessagesRepository {
  async existsByWhatsappMessageId(whatsappMessageId: string): Promise<boolean> {
    const existing = await prisma.aiMessage.findUnique({
      where: { whatsappMessageId },
      select: { id: true },
    });
    return existing !== null;
  }

  async create(input: {
    tenantId: string;
    conversationId: string;
    direction: "inbound" | "outbound";
    content: string;
    whatsappMessageId: string | null;
  }): Promise<AiMessage | null> {
    try {
      const row = await prisma.aiMessage.create({ data: input });
      return toDTO(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return null;
      }
      throw error;
    }
  }
}

interface AiMessageRow {
  id: string;
  tenantId: string;
  conversationId: string;
  direction: string;
  content: string;
  whatsappMessageId: string | null;
  createdAt: Date;
}

function toDirection(value: string): AiMessage["direction"] {
  if (value === "inbound" || value === "outbound") return value;
  throw new Error(`Dirección de mensaje desconocida: ${value}`);
}

function toDTO(row: AiMessageRow): AiMessage {
  return {
    id: row.id,
    tenantId: row.tenantId,
    conversationId: row.conversationId,
    direction: toDirection(row.direction),
    content: row.content,
    whatsappMessageId: row.whatsappMessageId,
    createdAt: row.createdAt.toISOString(),
  };
}
