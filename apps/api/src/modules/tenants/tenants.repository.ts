import type { Prisma } from "@prisma/client";

import { withUserContext } from "../../core/database/with-user-context.js";
import { slugify } from "../../core/utils/slugify.js";
import type {
  CreateTenantInput,
  ITenantsRepository,
  TenantMembership,
} from "./tenants.types.js";

/**
 * Repositorio del módulo `tenants` — única puerta de entrada a Prisma para
 * este dominio (Backend Architecture Specification §6). Todo método pasa
 * por `withUserContext`, nunca por el cliente de Prisma directo, porque las
 * tablas que toca (`tenants`, `tenant_users`) tienen RLS activo.
 */
export class TenantsRepository implements ITenantsRepository {
  constructor(
    private readonly runWithUserContext: typeof withUserContext = withUserContext,
  ) {}

  async findMembershipsByUserId(userId: string): Promise<TenantMembership[]> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const rows = await tx.tenantUser.findMany({
          where: { userId, status: "active" },
          include: { tenant: true },
          orderBy: { createdAt: "asc" },
        });

        return rows.map((row) => ({
          tenantId: row.tenantId,
          tenantName: row.tenant.name,
          role: row.role,
        }));
      },
    );
  }

  async createTenantWithOwner(
    userId: string,
    input: CreateTenantInput,
  ): Promise<TenantMembership> {
    return this.runWithUserContext(
      userId,
      async (tx: Prisma.TransactionClient) => {
        const tenant = await tx.tenant.create({
          data: {
            name: input.name,
            slug: slugify(input.name),
            businessVertical: input.businessVertical,
            description: emptyToNull(input.description),
            phone: input.phone,
            contactEmail: input.contactEmail,
            address: input.address,
            city: input.city,
            province: input.province,
            country: input.country,
            timezone: input.timezone,
            openingHours: input.openingHours,
            logoUrl: emptyToNull(input.logoUrl),
            brandPrimaryColor: input.brandPrimaryColor,
            brandSecondaryColor: input.brandSecondaryColor,
          },
        });

        await tx.tenantUser.create({
          data: {
            tenantId: tenant.id,
            userId,
            role: "owner",
            status: "active",
            joinedAt: new Date(),
          },
        });

        return {
          tenantId: tenant.id,
          tenantName: tenant.name,
          role: "owner" as const,
        };
      },
    );
  }
}

function emptyToNull(value: string | undefined): string | null {
  return value && value.length > 0 ? value : null;
}
