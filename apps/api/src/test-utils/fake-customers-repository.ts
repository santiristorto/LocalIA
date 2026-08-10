import { randomUUID } from "node:crypto";

import type {
  Customer,
  ICustomersRepository,
} from "../modules/whatsapp/whatsapp.types.js";

/** Implementacion en memoria de ICustomersRepository, mismo criterio que FakeTenantsRepository. */
export class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  async findOrCreateByPhone(
    tenantId: string,
    phone: string,
    name: string | null,
  ): Promise<Customer> {
    const existing = this.customers.find(
      (c) => c.tenantId === tenantId && c.phone === phone,
    );

    if (existing) {
      if (!existing.name && name) existing.name = name;
      return existing;
    }

    const now = new Date().toISOString();
    const customer: Customer = {
      id: randomUUID(),
      tenantId,
      name,
      phone,
      email: null,
      notes: null,
      createdAt: now,
      updatedAt: now,
    };
    this.customers.push(customer);
    return customer;
  }

  findAll(): Customer[] {
    return this.customers;
  }
}
