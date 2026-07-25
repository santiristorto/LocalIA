import { describe, expect, it } from "vitest";

import { buildValidCreateTenantInput } from "../../test-utils/build-valid-create-tenant-input.js";
import { FakeTenantsRepository } from "../../test-utils/fake-tenants-repository.js";
import { TenantsService } from "./tenants.service.js";

describe("TenantsService", () => {
  it("crea el comercio cuando el usuario no tiene ninguno todavía", async () => {
    const repository = new FakeTenantsRepository();
    const service = new TenantsService(repository);

    const membership = await service.createTenant(
      "user-1",
      buildValidCreateTenantInput({ name: "Café Central" }),
    );

    expect(membership).toMatchObject({
      tenantName: "Café Central",
      role: "owner",
    });
  });

  it("rechaza crear un segundo comercio para el mismo usuario (un usuario = un comercio)", async () => {
    const repository = new FakeTenantsRepository();
    repository.seedMembership("user-1", {
      tenantId: "tnt-1",
      tenantName: "Comercio Existente",
      role: "owner",
    });
    const service = new TenantsService(repository);

    await expect(
      service.createTenant(
        "user-1",
        buildValidCreateTenantInput({ name: "Otro Comercio" }),
      ),
    ).rejects.toThrow("Ya tenés un comercio configurado");
  });

  it("devuelve un array vacío de memberships para un usuario sin comercio", async () => {
    const repository = new FakeTenantsRepository();
    const service = new TenantsService(repository);

    const memberships =
      await service.getMembershipsForUser("user-sin-comercio");

    expect(memberships).toEqual([]);
  });
});
