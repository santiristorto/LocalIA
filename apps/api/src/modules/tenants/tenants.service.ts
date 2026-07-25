import { ConflictError } from "../../core/errors/index.js";
import type {
  CreateTenantInput,
  ITenantsRepository,
  TenantMembership,
} from "./tenants.types.js";

/**
 * Servicio del módulo `tenants` — la lógica de negocio vive acá, nunca en
 * el controlador ni en el repositorio (Backend Architecture Specification
 * §5/§6). Depende de `ITenantsRepository` (puerto), no de la clase concreta
 * — Backend Architecture Specification §24-D.
 */
export class TenantsService {
  constructor(private readonly repository: ITenantsRepository) {}

  async getMembershipsForUser(userId: string): Promise<TenantMembership[]> {
    return this.repository.findMembershipsByUserId(userId);
  }

  /**
   * Crea el comercio del onboarding. Regla de negocio del MVP (LocalIA —
   * MVP Definitivo y Plan de Sprints, "simplificación operativa clave"):
   * un usuario administra un solo comercio por ahora — si ya tiene una
   * membresía activa, no se crea uno nuevo.
   */
  async createTenant(
    userId: string,
    input: CreateTenantInput,
  ): Promise<TenantMembership> {
    const existingMemberships =
      await this.repository.findMembershipsByUserId(userId);

    if (existingMemberships.length > 0) {
      throw new ConflictError(
        "Ya tenés un comercio configurado. Por ahora, cada cuenta administra un solo comercio.",
      );
    }

    return this.repository.createTenantWithOwner(userId, input);
  }
}
