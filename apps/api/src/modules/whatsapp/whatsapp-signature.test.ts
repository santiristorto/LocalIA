import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import { verifyWhatsappSignature } from "./whatsapp-signature.js";

const APP_SECRET = "test-app-secret";

function signBody(body: string): string {
  return `sha256=${createHmac("sha256", APP_SECRET).update(body).digest("hex")}`;
}

describe("verifyWhatsappSignature", () => {
  it("acepta una firma valida", () => {
    const body = Buffer.from(JSON.stringify({ hello: "world" }));

    expect(
      verifyWhatsappSignature(body, signBody(body.toString()), APP_SECRET),
    ).toBe(true);
  });

  it("rechaza una firma calculada con otro secreto", () => {
    const body = Buffer.from(JSON.stringify({ hello: "world" }));
    const wrongSignature = `sha256=${createHmac("sha256", "otro-secreto").update(body).digest("hex")}`;

    expect(verifyWhatsappSignature(body, wrongSignature, APP_SECRET)).toBe(
      false,
    );
  });

  it("rechaza si el body fue alterado despues de firmarse", () => {
    const originalBody = Buffer.from(JSON.stringify({ hello: "world" }));
    const signature = signBody(originalBody.toString());
    const tamperedBody = Buffer.from(JSON.stringify({ hello: "mundo" }));

    expect(verifyWhatsappSignature(tamperedBody, signature, APP_SECRET)).toBe(
      false,
    );
  });

  it("rechaza si falta la cabecera", () => {
    const body = Buffer.from("{}");
    expect(verifyWhatsappSignature(body, undefined, APP_SECRET)).toBe(false);
  });

  it("rechaza un formato de cabecera invalido", () => {
    const body = Buffer.from("{}");
    expect(verifyWhatsappSignature(body, "not-a-signature", APP_SECRET)).toBe(
      false,
    );
  });
});
