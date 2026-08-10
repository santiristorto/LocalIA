import { prisma } from "../../core/database/prisma-client.js";
import type {
  ITenantWhatsappConfigRepository,
  TenantWhatsappConfig,
} from "./whatsapp.types.js";

/**
 * Lee `whatsappPhoneNumberId`/`whatsappAccessToken` de `tenants`. Vive acá
 * (no en `tenants.repository.ts`) para no tocar el módulo `tenants`
 * — que no pertenece a este sprint — por dos columnas de solo lectura que
 * solo necesita `whatsapp.service.ts`.
 */
export class TenantWhatsappConfigRepository implements ITenantWhatsappConfigRepository {
  async findByPhoneNumberId(
    phoneNumberId: string,
  ): Promise<TenantWhatsappConfig | null> {
    const tenant = await prisma.tenant.findUnique({
      where: { whatsappPhoneNumberId: phoneNumberId },
      select: {
        id: true,
        whatsappPhoneNumberId: true,
        whatsappAccessToken: true,
      },
    });

    return toDTO(tenant);
  }

  async findByTenantId(tenantId: string): Promise<TenantWhatsappConfig | null> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        whatsappPhoneNumberId: true,
        whatsappAccessToken: true,
      },
    });

    return toDTO(tenant);
  }
}

interface TenantWhatsappRow {
  id: string;
  whatsappPhoneNumberId: string | null;
  whatsappAccessToken: string | null;
}

function toDTO(row: TenantWhatsappRow | null): TenantWhatsappConfig | null {
  if (!row || !row.whatsappPhoneNumberId || !row.whatsappAccessToken) {
    return null;
  }

  return {
    tenantId: row.id,
    whatsappPhoneNumberId: row.whatsappPhoneNumberId,
    whatsappAccessToken: row.whatsappAccessToken,
  };
}
