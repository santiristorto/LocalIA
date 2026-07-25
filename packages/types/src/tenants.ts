import { z } from "zod";

/**
 * Esquemas de comercio (tenant) y onboarding — Database Specification §4,
 * API Specification §3. Compartidos entre frontend y backend, mismo criterio
 * que `auth.ts`.
 */

export const businessVerticalValues = [
  "restaurant",
  "cafe",
  "gym",
  "salon",
  "clinic",
  "retail_services",
  "other",
] as const;

export const businessVerticalSchema = z.enum(businessVerticalValues);
export type BusinessVertical = z.infer<typeof businessVerticalSchema>;

export const businessVerticalLabels: Record<BusinessVertical, string> = {
  restaurant: "Restaurante",
  cafe: "Cafetería",
  gym: "Gimnasio",
  salon: "Peluquería / Barbería",
  clinic: "Consultorio de salud",
  retail_services: "Comercio / Servicios",
  other: "Otro",
};

export const weekdays = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type Weekday = (typeof weekdays)[number];

export const weekdayLabels: Record<Weekday, string> = {
  mon: "Lunes",
  tue: "Martes",
  wed: "Miércoles",
  thu: "Jueves",
  fri: "Viernes",
  sat: "Sábado",
  sun: "Domingo",
};

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido (HH:MM).");

const dayScheduleSchema = z.object({
  isOpen: z.boolean(),
  open: timeSchema,
  close: timeSchema,
});
export type DaySchedule = z.infer<typeof dayScheduleSchema>;

export const openingHoursSchema = z.object({
  mon: dayScheduleSchema,
  tue: dayScheduleSchema,
  wed: dayScheduleSchema,
  thu: dayScheduleSchema,
  fri: dayScheduleSchema,
  sat: dayScheduleSchema,
  sun: dayScheduleSchema,
});
export type OpeningHours = z.infer<typeof openingHoursSchema>;

export const defaultOpeningHours: OpeningHours = {
  mon: { isOpen: true, open: "09:00", close: "18:00" },
  tue: { isOpen: true, open: "09:00", close: "18:00" },
  wed: { isOpen: true, open: "09:00", close: "18:00" },
  thu: { isOpen: true, open: "09:00", close: "18:00" },
  fri: { isOpen: true, open: "09:00", close: "18:00" },
  sat: { isOpen: true, open: "09:00", close: "13:00" },
  sun: { isOpen: false, open: "09:00", close: "13:00" },
};

export const timezoneOptions = [
  {
    value: "America/Argentina/Buenos_Aires",
    label: "Argentina (Buenos Aires)",
  },
  { value: "America/Sao_Paulo", label: "Brasil (São Paulo)" },
  { value: "America/Santiago", label: "Chile (Santiago)" },
  { value: "America/Bogota", label: "Colombia (Bogotá)" },
  { value: "America/Mexico_City", label: "México (Ciudad de México)" },
  { value: "America/Lima", label: "Perú (Lima)" },
  { value: "America/Montevideo", label: "Uruguay (Montevideo)" },
] as const;

const hexColorSchema = z
  .string()
  .regex(
    /^#[0-9A-Fa-f]{6}$/,
    "Ingresá un color válido en formato hexadecimal (#RRGGBB).",
  );

export const defaultBrandColors = {
  primary: "#4F46E5",
  secondary: "#0F9D8B",
};

export const createTenantSchema = z.object({
  name: z
    .string()
    .min(2, "Ingresá el nombre de tu comercio.")
    .max(60, "El nombre es demasiado largo."),
  businessVertical: businessVerticalSchema,
  description: z
    .string()
    .max(500, "La descripción es demasiado larga (máximo 500 caracteres).")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(6, "Ingresá un teléfono válido.")
    .max(30, "El teléfono es demasiado largo."),
  contactEmail: z
    .string()
    .min(1, "Ingresá un email de contacto.")
    .email("Ingresá un email válido."),
  address: z
    .string()
    .min(3, "Ingresá una dirección.")
    .max(150, "La dirección es demasiado larga."),
  city: z
    .string()
    .min(2, "Ingresá una ciudad.")
    .max(80, "La ciudad es demasiado larga."),
  province: z
    .string()
    .min(2, "Ingresá una provincia.")
    .max(80, "La provincia es demasiado larga."),
  country: z
    .string()
    .min(2, "Ingresá un país.")
    .max(80, "El país es demasiado largo."),
  timezone: z.string().min(1, "Seleccioná una zona horaria."),
  openingHours: openingHoursSchema,
  logoUrl: z
    .string()
    .url("La URL del logo no es válida.")
    .optional()
    .or(z.literal("")),
  brandPrimaryColor: hexColorSchema,
  brandSecondaryColor: hexColorSchema,
});
export type CreateTenantInput = z.infer<typeof createTenantSchema>;

export interface TenantMembership {
  tenantId: string;
  tenantName: string;
  role: "owner" | "manager" | "employee" | "readonly";
}
