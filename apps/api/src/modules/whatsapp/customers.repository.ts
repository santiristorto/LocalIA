import { prisma } from "../../core/database/prisma-client.js";
import type { Customer, ICustomersRepository } from "./whatsapp.types.js";

/**
 * Repositorio de `customers` — acceso directo con el cliente base de
 * Prisma, sin `withUserContext`: la tabla no tiene RLS todavía (ver
 * comentario en `schema.prisma`), así que no hay `current_user_id` que
 * setear — quien escribe acá es el webhook, sin usuario autenticado.
 */
export class CustomersRepository implements ICustomersRepository {
  async findOrCreateByPhone(
    tenantId: string,
    phone: string,
    name: string | null,
  ): Promise<Customer> {
    const existing = await prisma.customer.findUnique({
      where: { tenantId_phone: { tenantId, phone } },
    });

    if (existing) {
      if (!existing.name && name) {
        const updated = await prisma.customer.update({
          where: { id: existing.id },
          data: { name },
        });
        return toDTO(updated);
      }
      return toDTO(existing);
    }

    const created = await prisma.customer.create({
      data: { tenantId, phone, name },
    });
    return toDTO(created);
  }
}

interface CustomerRow {
  id: string;
  tenantId: string;
  name: string | null;
  phone: string;
  email: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function toDTO(row: CustomerRow): Customer {
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    phone: row.phone,
    email: row.email,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
