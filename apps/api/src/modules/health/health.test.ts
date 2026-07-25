import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildTestApp } from "../../test-utils/build-test-app.js";

describe("GET /api/v1/health", () => {
  it("responde 200 con el envelope estándar de éxito", async () => {
    const { app } = await buildTestApp();

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: "ok",
        service: "localia-api",
        timestamp: expect.any(String),
      },
    });
  });
});
