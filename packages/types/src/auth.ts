import { z } from "zod";

/**
 * Esquemas de autenticación — UX/UI Specification §2/§3, packages/types como
 * contrato compartido (Frontend Architecture Specification §13).
 *
 * Se validan en el frontend antes de llamar al SDK de Supabase Auth. El
 * backend no expone endpoints de registro/login (los resuelve Supabase
 * directamente), así que estos esquemas hoy solo los consume `apps/web` —
 * viven acá igual porque son parte del contrato de negocio del dominio auth,
 * no un detalle de implementación de una sola app.
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresá tu email.")
    .email("Ingresá un email válido."),
  password: z.string().min(1, "Ingresá tu contraseña."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Ingresá tu nombre completo.")
    .max(80, "El nombre es demasiado largo."),
  email: z
    .string()
    .min(1, "Ingresá tu email.")
    .email("Ingresá un email válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/\d/, "La contraseña debe incluir al menos un número."),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresá tu email.")
    .email("Ingresá un email válido."),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(/\d/, "La contraseña debe incluir al menos un número."),
    confirmPassword: z.string().min(1, "Confirmá tu nueva contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
