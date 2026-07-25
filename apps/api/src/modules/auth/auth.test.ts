import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildTestApp } from "../../test-utils/build-test-app.js";
import { signTestJwt } from "../../test-utils/sign-test-jwt.js";

describe("GET /api/v1/me", () => {
  it("responde 401 sin token", async () => {
    const { app } = await buildTestApp();

    const response = await request(app).get("/api/v1/me");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHENTICATED");
  });

  it("responde 401 con un token inválido", async () => {
    const { app } = await buildTestApp();

    const response = await request(app)
      .get("/api/v1/me")
      .set("Authorization", "Bearer token-invalido");

    expect(response.status).toBe(401);
  });

  it("responde 200 con los datos del usuario y memberships vacío si no tiene comercio", async () => {
    const { app } = await buildTestApp();
    const token = await signTestJwt({
      sub: "user-123",
      email: "marina@ejemplo.com",
      fullName: "Marina Gómez",
    });

    const response = await request(app)
      .get("/api/v1/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: "user-123",
        email: "marina@ejemplo.com",
        fullName: "Marina Gómez",
        memberships: [],
      },
    });
  });

  it("responde con memberships cuando el usuario ya tiene un comercio", async () => {
    const { app, tenantsRepository } = await buildTestApp();
    tenantsRepository.seedMembership("user-123", {
      tenantId: "tnt-1",
      tenantName: "Café Central",
      role: "owner",
    });
    const token = await signTestJwt({
      sub: "user-123",
      email: "marina@ejemplo.com",
    });

    const response = await request(app)
      .get("/api/v1/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body.data.memberships).toEqual([
      { tenantId: "tnt-1", tenantName: "Café Central", role: "owner" },
    ]);
  });
});
