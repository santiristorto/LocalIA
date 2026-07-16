import { createClient } from "@supabase/supabase-js";

import { env } from "./env.ts";

/**
 * Cliente de Supabase Auth — Backend Architecture Specification §9: el
 * registro, login y recuperación de contraseña se resuelven acá, directo
 * desde el frontend, nunca a través del backend.
 *
 * `detectSessionInUrl: true` es lo que permite que el flujo de
 * restablecimiento de contraseña (link de email → `/restablecer-password`)
 * funcione: Supabase parsea el token de recuperación de la URL
 * automáticamente al cargar la página.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
