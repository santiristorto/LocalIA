import { ConflictError, NotFoundError } from "../../core/errors/index.js";
import type {
  CreateMenuCategoryInput,
  CreateMenuItemInput,
  IMenuCategoriesRepository,
  IMenuItemsRepository,
  MenuCategory,
  MenuItem,
  UpdateMenuCategoryInput,
  UpdateMenuItemInput,
} from "./menu.types.js";

/**
 * Servicio del módulo `menu` — la lógica de negocio vive acá, nunca en el
 * controlador ni en los repositorios (Backend Architecture Specification
 * §5/§6). Depende de las interfaces de los repositorios (puertos), no de
 * las clases concretas — mismo criterio que `TenantsService`.
 *
 * La autorización de "quién puede escribir" (owner/manager) ya la resuelve
 * el middleware `requireTenantRole` a nivel de ruta — este servicio no la
 * duplica. Lo que sí valida acá es la integridad del catálogo: que un ítem
 * no quede asociado a una categoría de otro tenant o inexistente, algo que
 * ninguna capa anterior chequea.
 */
export class MenuService {
  constructor(
    private readonly categoriesRepository: IMenuCategoriesRepository,
    private readonly itemsRepository: IMenuItemsRepository,
  ) {}

  async getCategories(
    userId: string,
    tenantId: string,
  ): Promise<MenuCategory[]> {
    return this.categoriesRepository.findAllByTenant(userId, tenantId);
  }

  async createCategory(
    userId: string,
    tenantId: string,
    input: CreateMenuCategoryInput,
  ): Promise<MenuCategory> {
    return this.categoriesRepository.create(userId, tenantId, input);
  }

  async updateCategory(
    userId: string,
    tenantId: string,
    categoryId: string,
    input: UpdateMenuCategoryInput,
  ): Promise<MenuCategory> {
    const updated = await this.categoriesRepository.update(
      userId,
      tenantId,
      categoryId,
      input,
    );

    if (!updated) {
      throw new NotFoundError("La categoría no existe.");
    }

    return updated;
  }

  async deleteCategory(
    userId: string,
    tenantId: string,
    categoryId: string,
  ): Promise<void> {
    const category = await this.categoriesRepository.findById(
      userId,
      tenantId,
      categoryId,
    );
    if (!category) {
      throw new NotFoundError("La categoría no existe.");
    }

    const items = await this.itemsRepository.findAllByTenant(
      userId,
      tenantId,
      categoryId,
    );
    if (items.length > 0) {
      throw new ConflictError(
        "No se puede borrar una categoría que todavía tiene ítems. Movés o borrás los ítems primero.",
      );
    }

    await this.categoriesRepository.softDelete(userId, tenantId, categoryId);
  }

  async getItems(
    userId: string,
    tenantId: string,
    categoryId?: string,
  ): Promise<MenuItem[]> {
    return this.itemsRepository.findAllByTenant(userId, tenantId, categoryId);
  }

  async createItem(
    userId: string,
    tenantId: string,
    input: CreateMenuItemInput,
  ): Promise<MenuItem> {
    await this.assertCategoryExists(userId, tenantId, input.categoryId);

    return this.itemsRepository.create(userId, tenantId, input);
  }

  async updateItem(
    userId: string,
    tenantId: string,
    itemId: string,
    input: UpdateMenuItemInput,
  ): Promise<MenuItem> {
    if (input.categoryId !== undefined) {
      await this.assertCategoryExists(userId, tenantId, input.categoryId);
    }

    const updated = await this.itemsRepository.update(
      userId,
      tenantId,
      itemId,
      input,
    );

    if (!updated) {
      throw new NotFoundError("El ítem no existe.");
    }

    return updated;
  }

  async deleteItem(
    userId: string,
    tenantId: string,
    itemId: string,
  ): Promise<void> {
    const deleted = await this.itemsRepository.softDelete(
      userId,
      tenantId,
      itemId,
    );

    if (!deleted) {
      throw new NotFoundError("El ítem no existe.");
    }
  }

  private async assertCategoryExists(
    userId: string,
    tenantId: string,
    categoryId: string,
  ): Promise<void> {
    const category = await this.categoriesRepository.findById(
      userId,
      tenantId,
      categoryId,
    );

    if (!category) {
      throw new NotFoundError("La categoría indicada no existe.");
    }
  }
}
