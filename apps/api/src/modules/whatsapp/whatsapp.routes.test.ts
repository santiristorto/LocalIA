import { createHmac } from "node:crypto";

import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildTestApp } from "../../test-utils/build-test-app.js";
import { signTestJwt } from "../../test-utils/sign-test-jwt.js";

const TENANT_ID = "11111111-1111-1111-1111-111111111111";
const PHONE_NUMBER_ID = "999888777";
const APP_SECRET = "test-app-secret";

function sign(body: string): string {
  return `sha256=${createHmac("sha256", APP_SECRET).update(body).digest("hex")}`;
}

function buildIncomingPayload(messageId: string) {
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
                  text: { body: "Hola" },
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

describe("GET /api/v1/webhooks/whatsapp (Meta Verification Challenge)", () => {
  it("devuelve el challenge cuando el verify token es correcto", async () => {
    const { app } = await buildTestApp();

    const response = await request(app).get("/api/v1/webhooks/whatsapp").query({
      "hub.mode": "subscribe",
      "hub.verify_token": "test-verify-token",
      "hub.challenge": "el-challenge-de-meta",
    });

    expect(response.status).toBe(200);
    expect(response.text).toBe("el-challenge-de-meta");
  });

  it("responde 403 si el verify token es incorrecto", async () => {
    const { app } = await buildTestApp();

    const response = await request(app).get("/api/v1/webhooks/whatsapp").query({
      "hub.mode": "subscribe",
      "hub.verify_token": "token-incorrecto",
      "hub.challenge": "el-challenge-de-meta",
    });

    expect(response.status).toBe(403);
  });
});

describe("POST /api/v1/webhooks/whatsapp", () => {
  it("responde 403 si la firma no es valida", async () => {
    const { app } = await buildTestApp();
    const payload = buildIncomingPayload("wamid.1");

    const response = await request(app)
      .post("/api/v1/webhooks/whatsapp")
      .set("x-hub-signature-256", "sha256=firma-invalida")
      .send(payload);

    expect(response.status).toBe(403);
  });

  it("responde 200 y persiste el mensaje cuando la firma es valida", async () => {
    const {
      app,
      customersRepository,
      aiMessagesRepository,
      tenantWhatsappConfigRepository,
    } = await buildTestApp();
    tenantWhatsappConfigRepository.seedConfig({
      tenantId: TENANT_ID,
      whatsappPhoneNumberId: PHONE_NUMBER_ID,
      whatsappAccessToken: "test-access-token",
    });
    const body = JSON.stringify(buildIncomingPayload("wamid.valido"));

    const response = await request(app)
      .post("/api/v1/webhooks/whatsapp")
      .set("x-hub-signature-256", sign(body))
      .set("Content-Type", "application/json")
      .send(body);

    expect(response.status).toBe(200);
    expect(customersRepository.findAll()).toHaveLength(1);
    expect(aiMessagesRepository.findAll()).toHaveLength(1);
  });

  it("no procesa el mismo webhook dos veces (idempotencia)", async () => {
    const { app, aiMessagesRepository, tenantWhatsappConfigRepository } =
      await buildTestApp();
    tenantWhatsappConfigRepository.seedConfig({
      tenantId: TENANT_ID,
      whatsappPhoneNumberId: PHONE_NUMBER_ID,
      whatsappAccessToken: "test-access-token",
    });
    const body = JSON.stringify(buildIncomingPayload("wamid.repetido"));

    await request(app)
      .post("/api/v1/webhooks/whatsapp")
      .set("x-hub-signature-256", sign(body))
      .set("Content-Type", "application/json")
      .send(body);
    await request(app)
      .post("/api/v1/webhooks/whatsapp")
      .set("x-hub-signature-256", sign(body))
      .set("Content-Type", "application/json")
      .send(body);

    expect(aiMessagesRepository.findAll()).toHaveLength(1);
  });
});

describe("POST /api/v1/tenants/:tenantId/whatsapp/test-message", () => {
  it("responde 401 sin token", async () => {
    const { app } = await buildTestApp();

    const response = await request(app)
      .post(`/api/v1/tenants/${TENANT_ID}/whatsapp/test-message`)
      .send({ to: "5491122334455", text: "hola" });

    expect(response.status).toBe(401);
  });

  it("responde 403 si un employee intenta enviar", async () => {
    const { app, tenantsRepository } = await buildTestApp();
    tenantsRepository.seedMembership("user-employee", {
      tenantId: TENANT_ID,
      tenantName: "Comercio de Prueba",
      role: "employee",
    });
    const token = await signTestJwt({ sub: "user-employee" });

    const response = await request(app)
      .post(`/api/v1/tenants/${TENANT_ID}/whatsapp/test-message`)
      .set("Authorization", `Bearer ${token}`)
      .send({ to: "5491122334455", text: "hola" });

    expect(response.status).toBe(403);
  });

  it("responde 400 si falta el texto", async () => {
    const { app, tenantsRepository } = await buildTestApp();
    tenantsRepository.seedMembership("user-owner", {
      tenantId: TENANT_ID,
      tenantName: "Comercio de Prueba",
      role: "owner",
    });
    const token = await signTestJwt({ sub: "user-owner" });

    const response = await request(app)
      .post(`/api/v1/tenants/${TENANT_ID}/whatsapp/test-message`)
      .set("Authorization", `Bearer ${token}`)
      .send({ to: "5491122334455" });

    expect(response.status).toBe(400);
  });
});
