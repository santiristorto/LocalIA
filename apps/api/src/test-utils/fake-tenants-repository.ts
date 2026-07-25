import type {
  CreateTenantInput,
  ITenantsRepository,
  TenantMembership,
} from "../modules/tenants/tenants.types.js";

/**
 * Implementación en memoria de `ITenantsRepository`, solo para tests.
 * Reemplaza al `TenantsRepository` real (que necesita Prisma + Postgres) en
 * los tests de integración de `app.ts` — Backend Architecture Specification
 * §19: "Unitario/Integración: repositorios y adaptadores mockeados".
 */
export class FakeTenantsRepository implements ITenantsRepository {
  private membershipsByUser = new Map<string, TenantMembership[]>();

  async findMembershipsByUserId(userId: string): Promise<TenantMembership[]> {
    return this.membershipsByUser.get(userId) ?? [];
  }

  async createTenantWithOwner(
    userId: string,
    input: CreateTenantInput,
  ): Promise<TenantMembership> {
    const membership: TenantMembership = {
      tenantId: `tnt_${Math.random().toString(36).slice(2, 10)}`,
      tenantName: input.name,
      role: "owner",
    };

    this.membershipsByUser.set(userId, [membership]);

    return membership;
  }

  /** Solo para arrancar un test con un estado ya poblado. */
  seedMembership(userId: string, membership: TenantMembership): void {
    this.membershipsByUser.set(userId, [membership]);
  }
}
