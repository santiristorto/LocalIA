import { z } from "zod";

/**
 * Esquemas del Menú (categorías e ítems) — Sprint 4. Compartidos entre
 * frontend y backend, mismo criterio que `tenants.ts`/`auth.ts`.
 */

export const menuCategorySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  position: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type MenuCategory = z.infer<typeof menuCategorySchema>;

export const createMenuCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Ingresá el nombre de la categoría.")
    .max(60, "El nombre es demasiado largo."),
  description: z
    .string()
    .max(300, "La descripción es demasiado larga (máximo 300 caracteres).")
    .optional()
    .or(z.literal("")),
});
export type CreateMenuCategoryInput = z.infer<typeof createMenuCategorySchema>;

export const updateMenuCategorySchema = createMenuCategorySchema.partial();
export type UpdateMenuCategoryInput = z.infer<typeof updateMenuCategorySchema>;

export const menuItemSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  imageUrl: z.string().nullable(),
  isAvailable: z.boolean(),
  position: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type MenuItem = z.infer<typeof menuItemSchema>;

export const createMenuItemSchema = z.object({
  categoryId: z.string().uuid("Seleccioná una categoría válida."),
  name: z
    .string()
    .min(2, "Ingresá el nombre del ítem.")
    .max(80, "El nombre es demasiado largo."),
  description: z
    .string()
    .max(300, "La descripción es demasiado larga (máximo 300 caracteres).")
    .optional()
    .or(z.literal("")),
  price: z
    .number({ message: "Ingresá un precio válido." })
    .positive("El precio tiene que ser mayor a 0.")
    .max(999999.99, "El precio es demasiado alto."),
  imageUrl: z
    .string()
    .url("La URL de la imagen no es válida.")
    .optional()
    .or(z.literal("")),
  isAvailable: z.boolean().optional(),
});
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;

export const updateMenuItemSchema = createMenuItemSchema.partial();
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;

/** Solo para el toggle de disponibilidad — evita mandar el objeto entero. */
export const updateMenuItemAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});
export type UpdateMenuItemAvailabilityInput = z.infer<
  typeof updateMenuItemAvailabilitySchema
>;
