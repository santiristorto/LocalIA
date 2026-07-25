import { defaultOpeningHours } from "@localia/types";
import type { CreateTenantInput } from "@localia/types";

/** Payload válido de referencia para tests — evita repetirlo en cada test. */
export function buildValidCreateTenantInput(
  overrides: Partial<CreateTenantInput> = {},
): CreateTenantInput {
  return {
    name: "Café Central",
    businessVertical: "cafe",
    description: "Cafetería de especialidad en el centro.",
    phone: "+5491122334455",
    contactEmail: "contacto@cafecentral.com",
    address: "Av. Siempre Viva 123",
    city: "Río Cuarto",
    province: "Córdoba",
    country: "Argentina",
    timezone: "America/Argentina/Buenos_Aires",
    openingHours: defaultOpeningHours,
    brandPrimaryColor: "#4F46E5",
    brandSecondaryColor: "#0F9D8B",
    ...overrides,
  };
}
