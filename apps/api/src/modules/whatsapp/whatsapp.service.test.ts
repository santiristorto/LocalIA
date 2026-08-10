import { afterEach, describe, expect, it, vi } from "vitest";

import { FakeAiConversationsRepository } from "../../test-utils/fake-ai-conversations-repository.js";
import { FakeAiMessagesRepository } from "../../test-utils/fake-ai-messages-repository.js";
import { FakeCustomersRepository } from "../../test-utils/fake-customers-repository.js";
import { FakeTenantWhatsappConfigRepository } from "../../test-utils/fake-tenant-whatsapp-config-repository.js";
import { WhatsappService } from "./whatsapp.service.js";
import type { WhatsappWebhookPayload } from "./whatsapp.validators.js";

const TENANT_ID = "11111111-1111-1111-1111-111111111111";
const PHONE_NUMBER_ID = "999888777";

function buildService() {
  const customersRepository = new FakeCustomersRepository();
  const conversationsRepository = new FakeAiConversationsRepository();
  const messagesRepository = new FakeAiMessagesRepository();
  const tenantConfigRepository = new FakeTenantWhatsappConfigRepository();
  tenantConfigRepository.seedConfig({
    tenantId: TENANT_ID,
    whatsappPhoneNumberId: PHONE_NUMBER_ID,
    whatsappAccessToken: "test-access-token",
  });

  const service = new WhatsappService(
    customersRepository,
    conversationsRepository,
    messagesRepository,
    tenantConfigRepository,
  );

  return {
    service,
    customersRepository,
    conversationsRepository,
    messagesRepository,
    tenantConfigRepository,
  };
}

function buildIncomingPayload(
  messageId: string,
  text: string,
): WhatsappWebhookPayload {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "waba-id",
        changes: [
          {
            field: "messages",
            value: {
              metadata: { phone_number_id: PHONE_NUMBER_ID },
              contacts: [{ wa_id: "5491122334455", profile: { name: "Juan" } }],
              messages: [
                {
                  id: messageId,
                  from: "5491122334455",
                  type: "text",
                  text: { body: text },
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

describe("WhatsappService.verifyWebhookChallenge", () => {
  it("devuelve el challenge cuando mode y token coinciden", () => {
    const { service } = buildService();

    expect(
      service.verifyWebhookChallenge(
        "subscribe",
        "test-verify-token",
        "el-challenge",
      ),
    ).toBe("el-challenge");
  });

  it("devuelve null si el token no coincide", () => {
    const { service } = buildService();

    expect(
      service.verifyWebhookChallenge("subscribe", "token-incorrecto", "x"),
    ).toBeNull();
  });

  it("devuelve null si el mode no es subscribe", () => {
    const { service } = buildService();

    expect(
      service.verifyWebhookChallenge("unsubscribe", "test-verify-token", "x"),
    ).toBeNull();
  });
});

describe("WhatsappService.processIncomingWebhook", () => {
  it("crea customer, conversation y message ante un mensaje nuevo", async () => {
    const {
      service,
      customersRepository,
      conversationsRepository,
      messagesRepository,
    } = buildService();

    await service.processIncomingWebhook(
      buildIncomingPayload("wamid.1", "Hola, quiero hacer una reserva"),
    );

    expect(customersRepository.findAll()).toHaveLength(1);
    expect(customersRepository.findAll()[0]).toMatchObject({
      tenantId: TENANT_ID,
      phone: "5491122334455",
      name: "Juan",
    });
    expect(conversationsRepository.findAll()).toHaveLength(1);
    expect(messagesRepository.findAll()).toHaveLength(1);
    expect(messagesRepository.findAll()[0]).toMatchObject({
      direction: "inbound",
      content: "Hola, quiero hacer una reserva",
      whatsappMessageId: "wamid.1",
    });
  });

  it("no procesa el mismo mensaje dos veces (idempotencia)", async () => {
    const { service, messagesRepository } = buildService();
    const payload = buildIncomingPayload("wamid.duplicado", "Hola");

    await service.processIncomingWebhook(payload);
    await service.processIncomingWebhook(payload);

    expect(messagesRepository.findAll()).toHaveLength(1);
  });

  it("reutiliza la misma conversation para el mismo customer", async () => {
    const { service, conversationsRepository, messagesRepository } =
      buildService();

    await service.processIncomingWebhook(
      buildIncomingPayload("wamid.a", "primero"),
    );
    await service.processIncomingWebhook(
      buildIncomingPayload("wamid.b", "segundo"),
    );

    expect(conversationsRepository.findAll()).toHaveLength(1);
    expect(messagesRepository.findAll()).toHaveLength(2);
  });

  it("ignora mensajes de un phone_number_id sin tenant asociado", async () => {
    const { service, customersRepository } = buildService();

    await service.processIncomingWebhook({
      object: "whatsapp_business_account",
      entry: [
        {
          id: "waba-id",
          changes: [
            {
              field: "messages",
              value: {
                metadata: { phone_number_id: "numero-no-registrado" },
                contacts: [{ wa_id: "5491122334455" }],
                messages: [
                  {
                    id: "wamid.x",
                    from: "5491122334455",
                    type: "text",
                    text: { body: "hola" },
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    expect(customersRepository.findAll()).toHaveLength(0);
  });

  it("ignora un change sin mensajes (ej. actualizacion de estado de entrega)", async () => {
    const { service, customersRepository } = buildService();

    await service.processIncomingWebhook({
      object: "whatsapp_business_account",
      entry: [
        {
          id: "waba-id",
          changes: [
            {
              field: "messages",
              value: { metadata: { phone_number_id: PHONE_NUMBER_ID } },
            },
          ],
        },
      ],
    });

    expect(customersRepository.findAll()).toHaveLength(0);
  });
});

describe("WhatsappService.sendTestMessage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("envia el mensaje via la Cloud API y lo persiste como outbound", async () => {
    const { service, messagesRepository } = buildService();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ messages: [{ id: "wamid.enviado" }] }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const message = await service.sendTestMessage(TENANT_ID, {
      to: "5491122334455",
      text: "Mensaje de prueba",
    });

    expect(message).toMatchObject({
      direction: "outbound",
      content: "Mensaje de prueba",
      whatsappMessageId: "wamid.enviado",
    });
    expect(messagesRepository.findAll()).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rechaza si el tenant no tiene WhatsApp conectado", async () => {
    const { service } = buildService();

    await expect(
      service.sendTestMessage("tenant-sin-whatsapp", {
        to: "5491122334455",
        text: "hola",
      }),
    ).rejects.toThrow("no tiene un numero de WhatsApp conectado");
  });
});
