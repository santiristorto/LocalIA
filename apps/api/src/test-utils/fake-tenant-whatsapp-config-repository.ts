import type {
  ITenantWhatsappConfigRepository,
  TenantWhatsappConfig,
} from "../modules/whatsapp/whatsapp.types.js";

/** Implementacion en memoria de ITenantWhatsappConfigRepository. */
export class FakeTenantWhatsappConfigRepository implements ITenantWhatsappConfigRepository {
  private configs: TenantWhatsappConfig[] = [];

  async findByPhoneNumberId(
    phoneNumberId: string,
  ): Promise<TenantWhatsappConfig | null> {
    return (
      this.configs.find((c) => c.whatsappPhoneNumberId === phoneNumberId) ??
      null
    );
  }

  async findByTenantId(tenantId: string): Promise<TenantWhatsappConfig | null> {
    return this.configs.find((c) => c.tenantId === tenantId) ?? null;
  }

  seedConfig(config: TenantWhatsappConfig): void {
    this.configs.push(config);
  }
}
