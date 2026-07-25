import type { CreateTenantInput, TenantMembership } from "@localia/types";

export type { CreateTenantInput, TenantMembership };

/**
 * Puerto (Backend Architecture Specification §24-D/I): `TenantsService`
 * depende de esta interfaz, nunca de la clase concreta `TenantsRepository`
 * — es lo que permite inyectar un repositorio falso en los tests sin tocar
 * Prisma ni una base de datos real.
 */
export interface ITenantsRepository {
  findMembershipsByUserId(userId: string): Promise<TenantMembership[]>;
  createTenantWithOwner(
    userId: string,
    input: CreateTenantInput,
  ): Promise<TenantMembership>;
}
