import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildTestApp } from "../../test-utils/build-test-app.js";
import { signTestJwt } from "../../test-utils/sign-test-jwt.js";

const TENANT_ID = "11111111-1111-1111-1111-111111111111";

describe("Rutas de Menú", () => {
  it("responde 401 sin token", async () => {
    const { app } = await buildTestApp();

    const response = await request(app).get(
      `/api/v1/tenants/${TENANT_ID}/menu-categories`,
    );

    expect(response.status).toBe(401);
  });

  it("responde 403 si el usuario no es miembro del tenant", async () => {
    const { app } = await buildTestApp();
    const token = await signTestJwt({ sub: "user-ajeno" });

    const response = await request(app)
      .get(`/api/v1/tenants/${TENANT_ID}/menu-categories`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("responde 403 si un employee intenta crear una categoría", async () => {
    const { app, tenantsRepository } = await buildTestApp();
    tenantsRepository.seedMembership("user-employee", {
      tenantId: TENANT_ID,
      tenantName: "Comercio de Prueba",
      role: "employee",
    });
    const token = await signTestJwt({ sub: "user-employee" });

    const response = await request(app)
      .post(`/api/v1/tenants/${TENANT_ID}/menu-categories`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Entradas" });

    expect(response.status).toBe(403);
  });

  it("un employee sí puede leer el menú (solo lectura)", async () => {
    const { app, tenantsRepository } = await buildTestApp();
    tenantsRepository.seedMembership("user-employee", {
      tenantId: TENANT_ID,
      tenantName: "Comercio de Prueba",
      role: "employee",
    });
    const token = await signTestJwt({ sub: "user-employee" });

    const response = await request(app)
      .get(`/api/v1/tenants/${TENANT_ID}/menu-categories`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  it("un owner puede crear categoría e ítem, y togglear disponibilidad", async () => {
    const { app, tenantsRepository } = await buildTestApp();
    tenantsRepository.seedMembership("user-owner", {
      tenantId: TENANT_ID,
      tenantName: "Comercio de Prueba",
      role: "owner",
    });
    const token = await signTestJwt({ sub: "user-owner" });

    const categoryResponse = await request(app)
      .post(`/api/v1/tenants/${TENANT_ID}/menu-categories`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Entradas" });

    expect(categoryResponse.status).toBe(201);
    const categoryId = categoryResponse.body.data.id;

    const itemResponse = await request(app)
      .post(`/api/v1/tenants/${TENANT_ID}/menu-items`)
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryId, name: "Empanada", price: 800 });

    expect(itemResponse.status).toBe(201);
    expect(itemResponse.body.data.isAvailable).toBe(true);
    const itemId = itemResponse.body.data.id;

    const toggleResponse = await request(app)
      .patch(`/api/v1/tenants/${TENANT_ID}/menu-items/${itemId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isAvailable: false });

    expect(toggleResponse.status).toBe(200);
    expect(toggleResponse.body.data.isAvailable).toBe(false);
  });

  it("responde 400 si falta el nombre de la categoría", async () => {
    const { app, tenantsRepository } = await buildTestApp();
    tenantsRepository.seedMembership("user-owner", {
      tenantId: TENANT_ID,
      tenantName: "Comercio de Prueba",
      role: "owner",
    });
    const token = await signTestJwt({ sub: "user-owner" });

    const response = await request(app)
      .post(`/api/v1/tenants/${TENANT_ID}/menu-categories`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("responde 404 si el ítem referencia una categoría inexistente", async () => {
    const { app, tenantsRepository } = await buildTestApp();
    tenantsRepository.seedMembership("user-owner", {
      tenantId: TENANT_ID,
      tenantName: "Comercio de Prueba",
      role: "owner",
    });
    const token = await signTestJwt({ sub: "user-owner" });

    const response = await request(app)
      .post(`/api/v1/tenants/${TENANT_ID}/menu-items`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        categoryId: "22222222-2222-2222-2222-222222222222",
        name: "Empanada",
        price: 800,
      });

    expect(response.status).toBe(404);
  });
});
