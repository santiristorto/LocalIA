import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildTestApp } from "../../test-utils/build-test-app.js";
import { buildValidCreateTenantInput } from "../../test-utils/build-valid-create-tenant-input.js";
import { signTestJwt } from "../../test-utils/sign-test-jwt.js";

describe("POST /api/v1/tenants", () => {
  it("responde 401 sin token", async () => {
    const { app } = await buildTestApp();

    const response = await request(app)
      .post("/api/v1/tenants")
      .send(buildValidCreateTenantInput());

    expect(response.status).toBe(401);
  });

  it("responde 400 si falta un campo requerido", async () => {
    const { app } = await buildTestApp();
    const token = await signTestJwt({ sub: "user-123" });

    const response = await request(app)
      .post("/api/v1/tenants")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Café Central" }); // sin el resto de los campos requeridos

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("crea el comercio y lo asocia al usuario autenticado como owner", async () => {
    const { app } = await buildTestApp();
    const token = await signTestJwt({ sub: "user-123" });

    const response = await request(app)
      .post("/api/v1/tenants")
      .set("Authorization", `Bearer ${token}`)
      .send(buildValidCreateTenantInput({ name: "Café Central" }));

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      tenantName: "Café Central",
      role: "owner",
    });
    expect(response.body.data.tenantId).toEqual(expect.any(String));
  });

  it("responde 409 si el usuario ya tiene un comercio configurado", async () => {
    const { app, tenantsRepository } = await buildTestApp();
    tenantsRepository.seedMembership("user-123", {
      tenantId: "tnt-existente",
      tenantName: "Comercio Existente",
      role: "owner",
    });
    const token = await signTestJwt({ sub: "user-123" });

    const response = await request(app)
      .post("/api/v1/tenants")
      .set("Authorization", `Bearer ${token}`)
      .send(buildValidCreateTenantInput());

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("CONFLICT");
  });
});
