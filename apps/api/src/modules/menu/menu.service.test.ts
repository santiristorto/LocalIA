import { describe, expect, it } from "vitest";

import { FakeMenuCategoriesRepository } from "../../test-utils/fake-menu-categories-repository.js";
import { FakeMenuItemsRepository } from "../../test-utils/fake-menu-items-repository.js";
import { MenuService } from "./menu.service.js";

function buildService() {
  const categoriesRepository = new FakeMenuCategoriesRepository();
  const itemsRepository = new FakeMenuItemsRepository();
  const service = new MenuService(categoriesRepository, itemsRepository);
  return { service, categoriesRepository, itemsRepository };
}

describe("MenuService", () => {
  it("crea una categoría", async () => {
    const { service } = buildService();

    const category = await service.createCategory("user-1", "tnt-1", {
      name: "Entradas",
    });

    expect(category).toMatchObject({ tenantId: "tnt-1", name: "Entradas" });
  });

  it("rechaza crear un ítem con una categoría que no existe para ese tenant", async () => {
    const { service } = buildService();

    await expect(
      service.createItem("user-1", "tnt-1", {
        categoryId: "cat-inexistente",
        name: "Milanesa",
        price: 5000,
      }),
    ).rejects.toThrow("La categoría indicada no existe");
  });

  it("crea un ítem cuando la categoría sí pertenece al tenant", async () => {
    const { service } = buildService();
    const category = await service.createCategory("user-1", "tnt-1", {
      name: "Platos principales",
    });

    const item = await service.createItem("user-1", "tnt-1", {
      categoryId: category.id,
      name: "Milanesa",
      price: 5000,
    });

    expect(item).toMatchObject({
      categoryId: category.id,
      name: "Milanesa",
      price: 5000,
      isAvailable: true,
    });
  });

  it("togglea la disponibilidad de un ítem vía updateItem", async () => {
    const { service } = buildService();
    const category = await service.createCategory("user-1", "tnt-1", {
      name: "Bebidas",
    });
    const item = await service.createItem("user-1", "tnt-1", {
      categoryId: category.id,
      name: "Gaseosa",
      price: 1500,
    });

    const updated = await service.updateItem("user-1", "tnt-1", item.id, {
      isAvailable: false,
    });

    expect(updated.isAvailable).toBe(false);
  });

  it("lanza NotFoundError al actualizar un ítem inexistente", async () => {
    const { service } = buildService();

    await expect(
      service.updateItem("user-1", "tnt-1", "item-inexistente", {
        isAvailable: false,
      }),
    ).rejects.toThrow("El ítem no existe");
  });

  it("lanza NotFoundError al borrar una categoría inexistente", async () => {
    const { service } = buildService();

    await expect(
      service.deleteCategory("user-1", "tnt-1", "cat-inexistente"),
    ).rejects.toThrow("La categoría no existe");
  });

  it("rechaza borrar una categoría que todavía tiene ítems", async () => {
    const { service } = buildService();
    const category = await service.createCategory("user-1", "tnt-1", {
      name: "Postres",
    });
    await service.createItem("user-1", "tnt-1", {
      categoryId: category.id,
      name: "Flan",
      price: 2000,
    });

    await expect(
      service.deleteCategory("user-1", "tnt-1", category.id),
    ).rejects.toThrow("todavía tiene ítems");
  });

  it("borra una categoría vacía sin problema", async () => {
    const { service } = buildService();
    const category = await service.createCategory("user-1", "tnt-1", {
      name: "Vacía",
    });

    await expect(
      service.deleteCategory("user-1", "tnt-1", category.id),
    ).resolves.toBeUndefined();
  });
});
