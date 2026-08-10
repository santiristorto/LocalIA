/**
 * Tipos y puertos (interfaces de repositorio) del módulo `whatsapp` —
 * mismo criterio que `menu.types.ts`/`tenants.types.ts`: `WhatsappService`
 * depende de estas interfaces, nunca de las clases concretas.
 *
 * A diferencia de `menu`/`tenants`, estos tipos no vienen de `@localia/types`
 * porque todavía no hay ningún consumidor de frontend (Sprint 5 es
 * exclusivamente backend — sin dashboard de conversaciones, sin chat en
 * tiempo real, ver la definición del sprint).
 */

export interface Customer {
  id: string;
  tenantId: string;
  name: string | null;
  phone: string;
  email: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AiConversationChannel = "whatsapp";
export type AiConversationStatus = "open" | "closed";

export interface AiConversation {
  id: string;
  tenantId: string;
  customerId: string;
  channel: AiConversationChannel;
  status: AiConversationStatus;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AiMessageDirection = "inbound" | "outbound";

export interface AiMessage {
  id: string;
  tenantId: string;
  conversationId: string;
  direction: AiMessageDirection;
  content: string;
  whatsappMessageId: string | null;
  createdAt: string;
}

export interface TenantWhatsappConfig {
  tenantId: string;
  whatsappPhoneNumberId: string;
  whatsappAccessToken: string;
}

export interface ICustomersRepository {
  findOrCreateByPhone(
    tenantId: string,
    phone: string,
    name: string | null,
  ): Promise<Customer>;
}

export interface IAiConversationsRepository {
  findOrCreateOpen(
    tenantId: string,
    customerId: string,
    channel: AiConversationChannel,
  ): Promise<AiConversation>;
  touchLastMessageAt(conversationId: string, at: Date): Promise<void>;
}

export interface IAiMessagesRepository {
  existsByWhatsappMessageId(whatsappMessageId: string): Promise<boolean>;
  create(input: {
    tenantId: string;
    conversationId: string;
    direction: AiMessageDirection;
    content: string;
    whatsappMessageId: string | null;
  }): Promise<AiMessage | null>;
}

export interface ITenantWhatsappConfigRepository {
  findByPhoneNumberId(
    phoneNumberId: string,
  ): Promise<TenantWhatsappConfig | null>;
  findByTenantId(tenantId: string): Promise<TenantWhatsappConfig | null>;
}

/** Mensaje entrante ya normalizado — lo que el service necesita del payload de Meta, sin acoplarse a su forma cruda. */
export interface IncomingWhatsappMessage {
  phoneNumberId: string;
  customerPhone: string;
  customerName: string | null;
  whatsappMessageId: string;
  text: string;
}
