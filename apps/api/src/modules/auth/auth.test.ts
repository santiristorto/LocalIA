import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../../app.js";
import { signTestJwt } from "../../test-utils/sign-test-jwt.js";

describe("GET /api/v1/me", () => {
  it("responde 401 sin token", async () => {
    const app = createApp();

    const response = await request(app).get("/api/v1/me");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("UNAUTHENTICATED");
  });

  it("responde 401 con un token inválido", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/api/v1/me")
      .set("Authorization", "Bearer token-invalido");

    expect(response.status).toBe(401);
  });

  it("responde 200 con los datos del usuario autenticado", async () => {
    const app = createApp();
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
      },
    });
  });
});
